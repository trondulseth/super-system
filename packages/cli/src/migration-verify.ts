import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { auditProject } from "./audit.js";

const execFileAsync = promisify(execFile);

export interface VerificationStep {
  command: string;
  status: "passed" | "failed" | "skipped";
  detail?: string;
}

export interface MigrationVerificationResult {
  steps: VerificationStep[];
  passed: boolean;
}

async function readPackageScripts(cwd: string): Promise<Record<string, string>> {
  try {
    const raw = await readFile(path.join(cwd, "package.json"), "utf8");
    const parsed = JSON.parse(raw) as { scripts?: Record<string, string> };
    return parsed.scripts ?? {};
  } catch {
    return {};
  }
}

async function runScript(cwd: string, scriptName: string, scripts: Record<string, string>): Promise<VerificationStep> {
  if (!scripts[scriptName]) {
    return { command: scriptName, status: "skipped", detail: "Script not defined in package.json." };
  }

  try {
    await execFileAsync("npm", ["run", scriptName], { cwd, env: process.env });
    return { command: `npm run ${scriptName}`, status: "passed" };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { command: `npm run ${scriptName}`, status: "failed", detail };
  }
}

export async function verifyMigration(cwd: string): Promise<MigrationVerificationResult> {
  const scripts = await readPackageScripts(cwd);
  const steps: VerificationStep[] = [];

  for (const scriptName of ["typecheck", "test", "build"]) {
    steps.push(await runScript(cwd, scriptName, scripts));
  }

  const findings = await auditProject(cwd);
  steps.push({
    command: "super-system audit",
    status: findings.length === 0 ? "passed" : "failed",
    detail: findings.length === 0 ? undefined : `${findings.length} finding(s) remain`
  });

  return {
    steps,
    passed: steps.every((step) => step.status !== "failed")
  };
}

export function formatMigrationVerification(result: MigrationVerificationResult): string {
  const lines = ["Post-migration verification:", ""];
  for (const step of result.steps) {
    const status = step.status.toUpperCase();
    lines.push(`  [${status}] ${step.command}${step.detail ? ` — ${step.detail}` : ""}`);
  }
  lines.push("");
  lines.push(result.passed ? "Verification passed." : "Verification failed. Review changes or roll back before continuing.");
  lines.push("Rollback: `git restore .` or revert the migration commit if you created a checkpoint first.");
  return lines.join("\n");
}
