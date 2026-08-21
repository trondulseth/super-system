import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { auditProject, type Finding } from "./audit.js";
import {
  getMigrationRule,
  type MigrationConfidence,
  type MigrationMode
} from "./migration-rules.js";
import { findColorLiterals, loadColorTokenIndex, resolveTokenReplacements } from "./migration-tokens.js";

export const MIGRATION_MANIFEST_VERSION = 1 as const;

export interface ProjectContext {
  hasSuperSystemConfig: boolean;
  hasReactPackage: boolean;
  frameworks: string[];
}

export interface MigrationPlanItem extends Finding {
  id: string;
  confidence: MigrationConfidence;
  mode: MigrationMode;
  transformId?: string;
  plannedAction: string;
  assumption?: string;
  tokenReplacements?: Array<{ literal: string; token: string; cssVar: string }>;
}

export interface MigrationPlanSummary {
  findings: number;
  autoFixable: number;
  manualReview: number;
  unsupported: number;
}

export interface MigrationPlan {
  version: typeof MIGRATION_MANIFEST_VERSION;
  generatedAt: string;
  project: ProjectContext;
  summary: MigrationPlanSummary;
  items: MigrationPlanItem[];
  nextSteps: string[];
}

function makeFindingId(finding: Finding): string {
  return `${finding.rule}:${finding.file}:${finding.line}`;
}

function enrichFinding(
  finding: Finding,
  lineContent: string,
  tokenIndex: Map<string, string>
): MigrationPlanItem {
  const rule = getMigrationRule(finding.rule);
  const item: MigrationPlanItem = {
    ...finding,
    id: makeFindingId(finding),
    confidence: rule?.confidence ?? "low",
    mode: rule?.mode ?? "unsupported",
    transformId: rule?.transformId,
    plannedAction: rule?.plannedAction ?? "Review manually; no automated transform is available yet.",
    assumption: rule?.assumption
  };

  if (finding.rule !== "hardcoded-color") return item;

  const replacements = resolveTokenReplacements(lineContent, tokenIndex);
  if (replacements.length === 0) return item;

  const literals = replacements.map((replacement) => replacement.literal);
  item.mode = "auto";
  item.transformId = "token-replace-color";
  item.confidence = replacements.length === findColorLiterals(lineContent).length ? "high" : "medium";
  item.tokenReplacements = replacements;
  item.plannedAction = `Replace ${literals.join(", ")} with ${replacements.map((replacement) => replacement.cssVar).join(", ")}.`;
  item.assumption = "Each literal matches exactly one semantic token in the active theme.";
  return item;
}

async function readSourceLine(cwd: string, file: string, line: number, cache: Map<string, string[]>): Promise<string> {
  let lines = cache.get(file);
  if (!lines) {
    const content = await readFile(path.join(cwd, file), "utf8");
    lines = content.split(/\r?\n/);
    cache.set(file, lines);
  }
  return lines[line - 1] ?? "";
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function detectFrameworks(cwd: string): Promise<string[]> {
  const frameworks: string[] = [];
  if (await pathExists(path.join(cwd, "next.config.ts")) || await pathExists(path.join(cwd, "next.config.js")) || await pathExists(path.join(cwd, "next.config.mjs"))) {
    frameworks.push("next");
  }
  if (await pathExists(path.join(cwd, "vite.config.ts")) || await pathExists(path.join(cwd, "vite.config.js")) || await pathExists(path.join(cwd, "vite.config.mjs"))) {
    frameworks.push("vite");
  }
  if (frameworks.length === 0 && await pathExists(path.join(cwd, "package.json"))) {
    frameworks.push("react");
  }
  return frameworks;
}

async function detectProjectContext(cwd: string): Promise<ProjectContext> {
  const hasSuperSystemConfig = await pathExists(path.join(cwd, "super-system.json"));
  let hasReactPackage = false;

  const packageJsonPath = path.join(cwd, "package.json");
  if (await pathExists(packageJsonPath)) {
    const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    hasReactPackage = Boolean(
      packageJson.dependencies?.["@super-system/react"] ||
      packageJson.devDependencies?.["@super-system/react"]
    );
  }

  return {
    hasSuperSystemConfig,
    hasReactPackage,
    frameworks: await detectFrameworks(cwd)
  };
}

function buildSummary(items: MigrationPlanItem[]): MigrationPlanSummary {
  return {
    findings: items.length,
    autoFixable: items.filter((item) => item.mode === "auto").length,
    manualReview: items.filter((item) => item.mode === "manual").length,
    unsupported: items.filter((item) => item.mode === "unsupported").length
  };
}

function buildNextSteps(project: ProjectContext, summary: MigrationPlanSummary): string[] {
  const steps: string[] = [];

  if (!project.hasSuperSystemConfig) {
    steps.push("Run `npx @super-system/cli init` to create super-system.json and generated theme CSS.");
  }
  if (!project.hasReactPackage) {
    steps.push("Install `@super-system/react` and import `@super-system/react/styles.css` in your app root.");
  }
  if (summary.findings === 0) {
    steps.push("No migration work detected. Re-run `super-system audit` after future UI changes.");
    return steps;
  }
  if (summary.autoFixable > 0) {
    steps.push("Preview auto-fixes with `npx @super-system/cli migrate apply --dry-run`, then apply with `migrate apply`.");
  }
  if (summary.manualReview > 0) {
    steps.push("Resolve manual-review findings by hand or with your AI coding tool using docs/ai-tools.md rules.");
  }
  steps.push("Re-run `npx @super-system/cli audit` to confirm the project is clean.");
  steps.push("Save this plan with `migrate plan --json` if you want an AI agent to work through the items.");
  return steps;
}

export async function createMigrationPlan(cwd: string): Promise<MigrationPlan> {
  const findings = await auditProject(cwd);
  const tokenIndex = await loadColorTokenIndex(cwd);
  const lineCache = new Map<string, string[]>();
  const items = await Promise.all(
    findings.map(async (finding) => {
      const lineContent = await readSourceLine(cwd, finding.file, finding.line, lineCache);
      return enrichFinding(finding, lineContent, tokenIndex);
    })
  );
  const project = await detectProjectContext(cwd);
  const summary = buildSummary(items);

  return {
    version: MIGRATION_MANIFEST_VERSION,
    generatedAt: new Date().toISOString(),
    project,
    summary,
    items,
    nextSteps: buildNextSteps(project, summary)
  };
}

export function formatMigrationPlan(plan: MigrationPlan): string {
  const lines: string[] = [
    "Super System migration plan (read-only)",
    "",
    `Project: ${plan.project.frameworks.join(", ") || "unknown"}${plan.project.hasSuperSystemConfig ? ", super-system.json present" : ", no super-system.json"}${plan.project.hasReactPackage ? ", @super-system/react installed" : ""}`,
    "",
    `Summary: ${plan.summary.findings} finding(s) — ${plan.summary.autoFixable} planned auto-fix, ${plan.summary.manualReview} manual review, ${plan.summary.unsupported} unsupported`,
    ""
  ];

  const groups = [
    ["Planned auto-fixes (review before apply)", plan.items.filter((item) => item.mode === "auto")],
    ["Manual review", plan.items.filter((item) => item.mode === "manual")],
    ["Unsupported", plan.items.filter((item) => item.mode === "unsupported")]
  ] as const;

  for (const [title, items] of groups) {
    if (items.length === 0) continue;
    lines.push(`${title}:`);
    for (const item of items) {
      lines.push(`  ${item.file}:${item.line}  ${item.rule}  ${item.confidence}  ${item.plannedAction}`);
      if (item.assumption) lines.push(`    assumption: ${item.assumption}`);
    }
    lines.push("");
  }

  lines.push("Next steps:");
  plan.nextSteps.forEach((step, index) => lines.push(`  ${index + 1}. ${step}`));
  return lines.join("\n");
}
