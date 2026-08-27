import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ADAPTER_GENERATOR_VERSION,
  AUDIT_RULE_CATALOG,
  type AuditSeverity,
  listAuditRuleIds
} from "@super-system/rules";

export const POLICY_VERSION = 1 as const;
export const defaultPolicyPath = "super-system.policy.json";

export interface PolicyDeprecation {
  id: string;
  replacement?: string;
  removeIn?: string;
  message?: string;
}

export interface SuperSystemPolicy {
  version: typeof POLICY_VERSION;
  audit?: {
    severity?: Partial<Record<string, AuditSeverity>>;
    excludeRules?: string[];
    excludeGlobs?: string[];
  };
  accessibility?: {
    minContrastRatio?: number;
  };
  deprecations?: PolicyDeprecation[];
  adapters?: {
    generatorVersion?: string;
    lastGeneratedAt?: string;
    targets?: Partial<Record<string, { formatVersion?: string; lastGeneratedAt?: string }>>;
  };
}

export interface PolicyValidationIssue {
  path: string;
  message: string;
}

export async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export function defaultPolicy(): SuperSystemPolicy {
  const severity = Object.fromEntries(
    AUDIT_RULE_CATALOG.map((rule) => [rule.id, rule.defaultSeverity])
  ) as Record<string, AuditSeverity>;

  return {
    version: POLICY_VERSION,
    audit: {
      severity,
      excludeRules: [],
      excludeGlobs: []
    },
    accessibility: {
      minContrastRatio: 4.5
    },
    deprecations: [],
    adapters: {
      generatorVersion: ADAPTER_GENERATOR_VERSION
    }
  };
}

export function validatePolicy(input: unknown): PolicyValidationIssue[] {
  const issues: PolicyValidationIssue[] = [];
  if (!input || typeof input !== "object") {
    return [{ path: "", message: "Policy must be a JSON object." }];
  }

  const policy = input as SuperSystemPolicy;
  if (policy.version !== POLICY_VERSION) {
    issues.push({ path: "version", message: `Unsupported policy version: ${String(policy.version)}` });
  }

  const knownRules = new Set(listAuditRuleIds());
  for (const [ruleId, severity] of Object.entries(policy.audit?.severity ?? {})) {
    if (!knownRules.has(ruleId)) {
      issues.push({ path: `audit.severity.${ruleId}`, message: "Unknown audit rule id." });
    }
    if (typeof severity !== "string" || !["off", "warn", "error"].includes(severity)) {
      issues.push({ path: `audit.severity.${ruleId}`, message: "Severity must be off, warn, or error." });
    }
  }

  for (const ruleId of policy.audit?.excludeRules ?? []) {
    if (!knownRules.has(ruleId)) {
      issues.push({ path: "audit.excludeRules", message: `Unknown excluded rule: ${ruleId}` });
    }
  }

  const ratio = policy.accessibility?.minContrastRatio;
  if (ratio !== undefined && (typeof ratio !== "number" || ratio <= 0)) {
    issues.push({ path: "accessibility.minContrastRatio", message: "Contrast ratio must be a positive number." });
  }

  return issues;
}

export async function readPolicy(cwd: string, policyPath = defaultPolicyPath): Promise<SuperSystemPolicy | null> {
  const target = path.resolve(cwd, policyPath);
  if (!(await pathExists(target))) return null;
  const parsed = JSON.parse(await readFile(target, "utf8")) as unknown;
  const issues = validatePolicy(parsed);
  if (issues.length > 0) {
    throw new Error(issues.map((issue) => `${issue.path || "policy"}: ${issue.message}`).join("\n"));
  }
  return parsed as SuperSystemPolicy;
}

export async function writePolicy(cwd: string, policy: SuperSystemPolicy, policyPath = defaultPolicyPath): Promise<string> {
  const target = path.resolve(cwd, policyPath);
  await writeFile(target, `${JSON.stringify(policy, null, 2)}\n`, "utf8");
  return target;
}

export function resolveRuleSeverity(policy: SuperSystemPolicy | null | undefined, ruleId: string): AuditSeverity {
  const configured = policy?.audit?.severity?.[ruleId];
  if (configured) return configured;
  return AUDIT_RULE_CATALOG.find((entry) => entry.id === ruleId)?.defaultSeverity ?? "warn";
}

export function isRuleExcluded(policy: SuperSystemPolicy | null | undefined, ruleId: string): boolean {
  return policy?.audit?.excludeRules?.includes(ruleId) ?? false;
}

export function matchesExcludeGlob(relativePath: string, globs: string[] | undefined): boolean {
  if (!globs?.length) return false;
  return globs.some((glob) => {
    const normalized = glob.replace(/\\/g, "/");
    if (normalized.endsWith("/**")) {
      const prefix = normalized.slice(0, -3);
      return relativePath === prefix || relativePath.startsWith(`${prefix}/`);
    }
    return relativePath === normalized || relativePath.endsWith(`/${normalized}`);
  });
}
