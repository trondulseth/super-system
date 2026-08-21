import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { generatedDir } from "./files.js";
import { MIGRATION_MANIFEST_VERSION, type MigrationPlan, type MigrationPlanItem } from "./migration.js";

export const defaultMigrationPlanPath = path.join(generatedDir, "migration-plan.json");

export type MigrationItemStatus = "pending" | "applied" | "skipped" | "manual";

export interface MigrationManifestItem {
  id: string;
  status: MigrationItemStatus;
  appliedAt?: string;
  skipReason?: string;
}

export interface MigrationSelection {
  onlyTransforms?: string[];
  skipTransforms?: string[];
  skipRules?: string[];
}

export interface StoredMigrationPlan extends MigrationPlan {
  selection?: MigrationSelection;
  itemStatuses?: MigrationManifestItem[];
}

export async function pathExists(target: string): Promise<boolean> {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export function resolveMigrationPlanPath(cwd: string, manifestPath?: string): string {
  return manifestPath ? path.resolve(cwd, manifestPath) : path.join(cwd, defaultMigrationPlanPath);
}

export function createItemStatuses(plan: MigrationPlan): MigrationManifestItem[] {
  return plan.items.map((item) => ({
    id: item.id,
    status: item.mode === "auto" ? "pending" : item.mode === "manual" ? "manual" : "manual"
  }));
}

export function mergeStoredPlan(plan: MigrationPlan, stored?: StoredMigrationPlan | null): StoredMigrationPlan {
  const previousStatuses = new Map(stored?.itemStatuses?.map((entry) => [entry.id, entry]) ?? []);
  const itemStatuses = plan.items.map((item) => {
    const previous = previousStatuses.get(item.id);
    if (previous?.status === "applied") return previous;
    if (item.mode !== "auto") {
      return { id: item.id, status: "manual" as const };
    }
    return previous ?? { id: item.id, status: "pending" as const };
  });

  return {
    ...plan,
    selection: stored?.selection,
    itemStatuses
  };
}

export async function readStoredMigrationPlan(cwd: string, manifestPath?: string): Promise<StoredMigrationPlan | null> {
  const target = resolveMigrationPlanPath(cwd, manifestPath);
  if (!(await pathExists(target))) return null;
  const parsed = JSON.parse(await readFile(target, "utf8")) as StoredMigrationPlan;
  if (parsed.version !== MIGRATION_MANIFEST_VERSION) {
    throw new Error(`Unsupported migration manifest version: ${String(parsed.version)}`);
  }
  return parsed;
}

export async function writeStoredMigrationPlan(
  cwd: string,
  plan: StoredMigrationPlan,
  manifestPath?: string
): Promise<string> {
  const target = resolveMigrationPlanPath(cwd, manifestPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  return target;
}

export function appliedItemIds(plan: StoredMigrationPlan | null | undefined): Set<string> {
  return new Set(plan?.itemStatuses?.filter((entry) => entry.status === "applied").map((entry) => entry.id) ?? []);
}

export function markItemsApplied(
  plan: StoredMigrationPlan,
  applied: Array<{ id: string }>,
  skipped: Array<{ id: string; reason: string }>
): StoredMigrationPlan {
  const appliedIds = new Set(applied.map((entry) => entry.id));
  const skippedById = new Map(skipped.map((entry) => [entry.id, entry.reason]));
  const now = new Date().toISOString();

  const itemStatuses = plan.items.map((item) => {
    if (appliedIds.has(item.id)) {
      return { id: item.id, status: "applied" as const, appliedAt: now };
    }
    const skipReason = skippedById.get(item.id);
    if (skipReason) {
      return { id: item.id, status: "skipped" as const, skipReason };
    }
    const existing = plan.itemStatuses?.find((entry) => entry.id === item.id);
    if (existing?.status === "applied") return existing;
    if (item.mode !== "auto") return { id: item.id, status: "manual" as const };
    return existing ?? { id: item.id, status: "pending" as const };
  });

  return { ...plan, itemStatuses };
}

export function filterAutoItems(
  items: MigrationPlanItem[],
  options: {
    selection?: MigrationSelection;
    appliedIds?: Set<string>;
  }
): MigrationPlanItem[] {
  const { selection, appliedIds } = options;
  return items.filter((item) => {
    if (item.mode !== "auto" || !item.transformId) return false;
    if (appliedIds?.has(item.id)) return false;
    if (selection?.skipRules?.includes(item.rule)) return false;
    if (selection?.skipTransforms?.includes(item.transformId)) return false;
    if (selection?.onlyTransforms?.length && !selection.onlyTransforms.includes(item.transformId)) {
      return false;
    }
    return true;
  });
}

export function listTransformIds(): string[] {
  return [
    "img-add-alt",
    "token-replace-color",
    "native-button-to-button",
    "native-input-to-input",
    "native-textarea-to-textarea",
    "native-select-to-select"
  ];
}
