import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertSafeToWrite } from "./git-worktree.js";
import { createMigrationPlan, type MigrationPlanItem } from "./migration.js";
import {
  appliedItemIds,
  filterAutoItems,
  markItemsApplied,
  mergeStoredPlan,
  readStoredMigrationPlan,
  resolveMigrationPlanPath,
  type MigrationSelection,
  type StoredMigrationPlan,
  writeStoredMigrationPlan
} from "./migration-manifest.js";
import { applyTransform, finalizeComponentImports } from "./migration-transforms.js";
import { transformComponentImports } from "./migration-imports.js";
import {
  formatMigrationVerification,
  verifyMigration,
  type MigrationVerificationResult
} from "./migration-verify.js";

export interface AppliedTransform {
  id: string;
  transformId: string;
  file: string;
  line: number;
  description: string;
}

export interface SkippedTransform {
  id: string;
  transformId?: string;
  file: string;
  line: number;
  reason: string;
}

export interface FileChange {
  file: string;
  before: string;
  after: string;
  diff: string;
  applied: AppliedTransform[];
}

export interface MigrationApplySummary {
  filesChanged: number;
  transformsApplied: number;
  transformsSkipped: number;
  manualRemaining: number;
  filesWritten: number;
  manifestPath?: string;
}

export interface MigrationApplyResult {
  dryRun: boolean;
  summary: MigrationApplySummary;
  changes: FileChange[];
  applied: AppliedTransform[];
  skipped: SkippedTransform[];
  manualItems: MigrationPlanItem[];
  writtenFiles: string[];
  verification?: MigrationVerificationResult;
}

export interface MigrationApplyOptions {
  dryRun?: boolean;
  allowDirty?: boolean;
  manifestPath?: string;
  writeManifest?: boolean;
  selection?: MigrationSelection;
  verify?: boolean;
}

function createUnifiedDiff(relativePath: string, before: string, after: string): string {
  const beforeLines = before.split(/\r?\n/);
  const afterLines = after.split(/\r?\n/);
  const output = [`--- a/${relativePath}`, `+++ b/${relativePath}`];

  const max = Math.max(beforeLines.length, afterLines.length);
  let start = -1;

  for (let index = 0; index <= max; index++) {
    const oldLine = beforeLines[index];
    const newLine = afterLines[index];
    const changed = oldLine !== newLine;

    if (changed && start === -1) start = index;
    if ((!changed || index === max) && start !== -1) {
      const end = changed && index === max ? index : index - 1;
      const oldCount = Math.max(0, end - start + 1);
      const newCount = Math.max(0, end - start + 1);
      output.push(`@@ -${start + 1},${oldCount} +${start + 1},${newCount} @@`);
      for (let lineIndex = start; lineIndex <= end; lineIndex++) {
        const left = beforeLines[lineIndex];
        const right = afterLines[lineIndex];
        if (left !== undefined && left !== right) output.push(`-${left}`);
        if (right !== undefined && left !== right) output.push(`+${right}`);
      }
      start = -1;
    }
  }

  return output.join("\n");
}

async function applyAutoTransformsToFile(
  cwd: string,
  file: string,
  items: MigrationPlanItem[]
): Promise<FileChange | null> {
  const absolutePath = path.join(cwd, file);
  const original = await readFile(absolutePath, "utf8");
  let content = original;
  const applied: AppliedTransform[] = [];

  const ordered = [...items].sort((left, right) => {
    const order = (item: MigrationPlanItem) => {
      if (item.transformId && transformComponentImports[item.transformId]) return 2;
      if (item.transformId === "token-replace-color") return 1;
      return 0;
    };
    return order(left) - order(right) || left.line - right.line;
  });

  const componentsToImport = new Set<string>();
  for (const item of ordered) {
    if (item.mode !== "auto" || !item.transformId) continue;
    const result = applyTransform(item.transformId, content, item);
    if (!result) continue;
    content = result.content;
    const component = transformComponentImports[item.transformId];
    if (component) componentsToImport.add(component);
    applied.push({
      id: item.id,
      transformId: item.transformId,
      file: item.file,
      line: item.line,
      description: result.description
    });
  }

  if (componentsToImport.size > 0) {
    const withImports = finalizeComponentImports(content, [...componentsToImport]);
    if (withImports !== content) {
      content = withImports;
      applied.push({
        id: `${file}:import:components`,
        transformId: "component-import",
        file,
        line: 1,
        description: `Added ${[...componentsToImport].sort().join(", ")} import from @super-system/react`
      });
    }
  }

  if (content === original || applied.length === 0) return null;
  return {
    file,
    before: original,
    after: content,
    diff: createUnifiedDiff(file, original, content),
    applied
  };
}

async function computeMigrationChanges(
  cwd: string,
  plan: StoredMigrationPlan,
  selection?: MigrationSelection
): Promise<{
  changes: FileChange[];
  applied: AppliedTransform[];
  skipped: SkippedTransform[];
  manualItems: MigrationPlanItem[];
}> {
  const autoItems = filterAutoItems(plan.items, {
    selection: selection ?? plan.selection,
    appliedIds: appliedItemIds(plan)
  });
  const manualItems = plan.items.filter((item) => item.mode !== "auto" || !item.transformId);
  const byFile = new Map<string, MigrationPlanItem[]>();

  for (const item of autoItems) {
    const group = byFile.get(item.file) ?? [];
    group.push(item);
    byFile.set(item.file, group);
  }

  const changes: FileChange[] = [];
  const applied: AppliedTransform[] = [];
  const skipped: SkippedTransform[] = [];

  for (const [file, items] of byFile) {
    const change = await applyAutoTransformsToFile(cwd, file, items);
    if (change) {
      changes.push(change);
      applied.push(...change.applied);
      continue;
    }

    for (const item of items) {
      skipped.push({
        id: item.id,
        transformId: item.transformId,
        file: item.file,
        line: item.line,
        reason: "Transform could not be applied safely to the current source line."
      });
    }
  }

  return { changes, applied, skipped, manualItems };
}

function buildSummary(
  changes: FileChange[],
  applied: AppliedTransform[],
  skipped: SkippedTransform[],
  manualItems: MigrationPlanItem[],
  filesWritten: number,
  manifestPath?: string
): MigrationApplySummary {
  return {
    filesChanged: changes.length,
    transformsApplied: applied.length,
    transformsSkipped: skipped.length,
    manualRemaining: manualItems.length,
    filesWritten,
    manifestPath
  };
}

export async function resolveMigrationPlan(cwd: string, manifestPath?: string): Promise<StoredMigrationPlan> {
  const stored = await readStoredMigrationPlan(cwd, manifestPath);
  const fresh = await createMigrationPlan(cwd);
  return mergeStoredPlan(fresh, stored);
}

export async function saveMigrationPlan(
  cwd: string,
  manifestPath?: string,
  selection?: MigrationSelection
): Promise<{ path: string; plan: StoredMigrationPlan }> {
  const stored = await readStoredMigrationPlan(cwd, manifestPath);
  const plan = mergeStoredPlan(await createMigrationPlan(cwd), stored);
  if (selection) plan.selection = selection;
  const target = await writeStoredMigrationPlan(cwd, plan, manifestPath);
  return { path: target, plan };
}

export async function applyMigration(
  cwd: string,
  options: MigrationApplyOptions = {}
): Promise<MigrationApplyResult> {
  const dryRun = options.dryRun ?? false;
  const selection = options.selection;
  const manifestPath = resolveMigrationPlanPath(cwd, options.manifestPath);
  let plan = await resolveMigrationPlan(cwd, options.manifestPath);
  if (selection) {
    plan = { ...plan, selection };
  }

  const { changes, applied, skipped, manualItems } = await computeMigrationChanges(cwd, plan, selection);

  if (!dryRun) {
    await assertSafeToWrite(cwd, options.allowDirty ?? false);
  }

  const writtenFiles: string[] = [];
  if (!dryRun) {
    for (const change of changes) {
      await writeFile(path.join(cwd, change.file), change.after, "utf8");
      writtenFiles.push(change.file);
    }
  }

  let verification: MigrationVerificationResult | undefined;
  if (!dryRun && options.verify && writtenFiles.length > 0) {
    verification = await verifyMigration(cwd);
  }

  if (!dryRun && (options.writeManifest || writtenFiles.length > 0)) {
    const transformItems = applied.filter((entry) => entry.transformId !== "component-import");
    plan = markItemsApplied(
      plan,
      transformItems,
      skipped.map((entry) => ({ id: entry.id, reason: entry.reason }))
    );
    await writeStoredMigrationPlan(cwd, plan, options.manifestPath);
  }

  return {
    dryRun,
    summary: buildSummary(changes, applied, skipped, manualItems, writtenFiles.length, manifestPath),
    changes,
    applied,
    skipped,
    manualItems,
    writtenFiles,
    verification
  };
}

export async function applyMigrationDryRun(cwd: string, options: MigrationApplyOptions = {}): Promise<MigrationApplyResult> {
  return applyMigration(cwd, { ...options, dryRun: true });
}

export function formatMigrationApplyResult(result: MigrationApplyResult): string {
  const lines = [
    result.dryRun
      ? "Super System migration apply (dry run — no files written)"
      : "Super System migration apply",
    "",
    result.dryRun
      ? `Summary: ${result.summary.transformsApplied} transform(s) across ${result.summary.filesChanged} file(s); ${result.summary.transformsSkipped} skipped; ${result.summary.manualRemaining} manual item(s) remain`
      : `Summary: wrote ${result.summary.filesWritten} file(s); ${result.summary.transformsApplied} transform(s); ${result.summary.transformsSkipped} skipped; ${result.summary.manualRemaining} manual item(s) remain`,
    ""
  ];

  if (result.summary.manifestPath) {
    lines.push(`Manifest: ${result.summary.manifestPath}`);
    lines.push("");
  }

  if (result.changes.length === 0) {
    lines.push(result.dryRun ? "No automated diffs to show." : "No files were changed.");
  } else if (result.dryRun) {
    lines.push("Proposed changes:");
    lines.push("");
    for (const change of result.changes) {
      lines.push(change.diff);
      lines.push("");
    }
  } else {
    lines.push("Written files:");
    for (const file of result.writtenFiles) {
      lines.push(`  ${file}`);
    }
    lines.push("");
  }

  if (result.skipped.length > 0) {
    lines.push("Skipped auto-fixes:");
    for (const item of result.skipped) {
      lines.push(`  ${item.file}:${item.line}  ${item.transformId ?? "unknown"}  ${item.reason}`);
    }
    lines.push("");
  }

  if (result.manualItems.length > 0) {
    lines.push("Manual review still required:");
    for (const item of result.manualItems) {
      lines.push(`  ${item.file}:${item.line}  ${item.rule}  ${item.plannedAction}`);
    }
    lines.push("");
    lines.push("AI-neutral follow-up: share docs/migration-guide.md and the JSON plan with your coding tool.");
    lines.push("");
  }

  if (result.verification) {
    lines.push(formatMigrationVerification(result.verification));
    lines.push("");
  }

  if (!result.dryRun && result.summary.filesWritten > 0) {
    lines.push("Next step: run `npx @super-system/cli audit` or re-run `migrate apply --verify`.");
  }

  return lines.join("\n");
}
