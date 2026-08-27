import { checkThemeContrast } from "@super-system/tokens";
import { detectStaleAdapters } from "./adapters.js";
import { auditProject, type Finding } from "./audit.js";
import { readConfig } from "./files.js";
import {
  isRuleExcluded,
  matchesExcludeGlob,
  readPolicy,
  resolveRuleSeverity,
  type SuperSystemPolicy
} from "./policy.js";

export interface PolicyFinding extends Finding {
  severity: "warn" | "error";
}

export interface PolicyCheckResult {
  policyPresent: boolean;
  findings: PolicyFinding[];
  deprecations: Array<{ id: string; message: string; severity: "warn" | "error" }>;
  contrast?: { passed: boolean; detail?: string };
  adapterWarnings: string[];
  passed: boolean;
}

function applyPolicyToFindings(findings: Finding[], policy: SuperSystemPolicy | null): PolicyFinding[] {
  return findings.flatMap((finding) => {
    if (policy && isRuleExcluded(policy, finding.rule)) return [];
    if (policy && matchesExcludeGlob(finding.file, policy.audit?.excludeGlobs)) return [];
    const severity = resolveRuleSeverity(policy, finding.rule);
    if (severity === "off") return [];
    return [{ ...finding, severity: severity === "error" ? "error" : "warn" }];
  });
}

export async function checkPolicy(cwd: string, options: { strict?: boolean } = {}): Promise<PolicyCheckResult> {
  const policy = await readPolicy(cwd);
  const rawFindings = await auditProject(cwd);
  const findings = applyPolicyToFindings(rawFindings, policy);

  const deprecations =
    policy?.deprecations?.map((entry) => ({
      id: entry.id,
      message: entry.message ?? `Deprecated: ${entry.id}${entry.replacement ? ` — use ${entry.replacement}` : ""}${entry.removeIn ? ` (remove in ${entry.removeIn})` : ""}`,
      severity: "warn" as const
    })) ?? [];

  let contrast: PolicyCheckResult["contrast"];
  if (policy?.accessibility?.minContrastRatio) {
    try {
      const config = await readConfig(cwd);
      const results = checkThemeContrast(config);
      const threshold = policy.accessibility.minContrastRatio;
      const failed = results.filter((entry) => entry.ratio < threshold);
      contrast = {
        passed: failed.length === 0,
        detail: failed.length === 0 ? undefined : `${failed.length} contrast pair(s) below ${threshold}:1`
      };
    } catch {
      contrast = { passed: true, detail: "No super-system.json — contrast check skipped." };
    }
  }

  const hasErrors = findings.some((entry) => entry.severity === "error");
  const contrastFailed = contrast?.passed === false;
  const adapterWarnings = await detectStaleAdapters(cwd);
  const passed = !hasErrors && !contrastFailed && (!options.strict || findings.length === 0);

  return {
    policyPresent: policy !== null,
    findings,
    deprecations,
    contrast,
    adapterWarnings,
    passed
  };
}

export function formatPolicyCheckResult(result: PolicyCheckResult): string {
  const lines = ["Super System policy check", ""];

  if (!result.policyPresent) {
    lines.push("No super-system.policy.json found. Run `super-system policy init` to create one.");
    lines.push("");
  }

  if (result.findings.length === 0) {
    lines.push("Audit: no policy-scoped violations.");
  } else {
    lines.push(`Audit: ${result.findings.length} finding(s):`);
    for (const finding of result.findings) {
      lines.push(`  [${finding.severity.toUpperCase()}] ${finding.file}:${finding.line}  ${finding.rule}  ${finding.message}`);
    }
  }
  lines.push("");

  if (result.deprecations.length > 0) {
    lines.push("Deprecations:");
    for (const entry of result.deprecations) {
      lines.push(`  [WARN] ${entry.id}  ${entry.message}`);
    }
    lines.push("");
  }

  if (result.contrast) {
    lines.push(result.contrast.passed ? "Contrast: passed configured threshold." : `Contrast: failed — ${result.contrast.detail}`);
    lines.push("");
  }

  if (result.adapterWarnings.length > 0) {
    lines.push("Adapter warnings:");
    for (const warning of result.adapterWarnings) {
      lines.push(`  [WARN] ${warning}`);
    }
    lines.push("");
  }

  lines.push(result.passed ? "Policy check passed." : "Policy check failed.");
  return lines.join("\n");
}
