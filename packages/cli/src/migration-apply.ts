import { readFile } from "node:fs/promises";
import path from "node:path";
import { createMigrationPlan, type MigrationPlanItem } from "./migration.js";
import { applyTransform, finalizeButtonImport } from "./migration-transforms.js";

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
  diff: string;
  applied: AppliedTransform[];
}

export interface MigrationApplySummary {
  filesChanged: number;
  transformsApplied: number;
  transformsSkipped: number;
  manualRemaining: number;
}

export interface MigrationApplyResult {
  dryRun: true;
  summary: MigrationApplySummary;
  changes: FileChange[];
  applied: AppliedTransform[];
  skipped: SkippedTransform[];
  manualItems: MigrationPlanItem[];
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
    const order = (item: MigrationPlanItem) =>
      item.transformId === "native-button-to-button" ? 1 : 0;
    return order(left) - order(right) || left.line - right.line;
  });

  let buttonReplaced = false;
  for (const item of ordered) {
    if (item.mode !== "auto" || !item.transformId) continue;
    const result = applyTransform(item.transformId, content, item);
    if (!result) continue;
    content = result.content;
    if (item.transformId === "native-button-to-button") buttonReplaced = true;
    applied.push({
      id: item.id,
      transformId: item.transformId,
      file: item.file,
      line: item.line,
      description: result.description
    });
  }

  if (buttonReplaced) {
    const withImport = finalizeButtonImport(content);
    if (withImport !== content) {
      content = withImport;
      applied.push({
        id: `${file}:import:button`,
        transformId: "native-button-to-button",
        file,
        line: 1,
        description: "Added Button import from @super-system/react"
      });
    }
  }

  if (content === original || applied.length === 0) return null;
  return {
    file,
    diff: createUnifiedDiff(file, original, content),
    applied
  };
}

export async function applyMigrationDryRun(cwd: string): Promise<MigrationApplyResult> {
  const plan = await createMigrationPlan(cwd);
  const autoItems = plan.items.filter((item) => item.mode === "auto" && item.transformId);
  const manualItems = plan.items.filter((item) => item.mode !== "auto");
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

  return {
    dryRun: true,
    summary: {
      filesChanged: changes.length,
      transformsApplied: applied.length,
      transformsSkipped: skipped.length,
      manualRemaining: manualItems.length
    },
    changes,
    applied,
    skipped,
    manualItems
  };
}

export function formatMigrationApplyResult(result: MigrationApplyResult): string {
  const lines = [
    "Super System migration apply (dry run — no files written)",
    "",
    `Summary: ${result.summary.transformsApplied} transform(s) across ${result.summary.filesChanged} file(s); ${result.summary.transformsSkipped} skipped; ${result.summary.manualRemaining} manual item(s) remain`,
    ""
  ];

  if (result.changes.length === 0) {
    lines.push("No automated diffs to show.");
  } else {
    lines.push("Proposed changes:");
    lines.push("");
    for (const change of result.changes) {
      lines.push(change.diff);
      lines.push("");
    }
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
  }

  return lines.join("\n");
}
