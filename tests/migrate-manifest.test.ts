import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultTheme } from "../packages/tokens/src/index.js";
import { applyMigration, applyMigrationDryRun } from "../packages/cli/src/migration-apply.js";
import {
  filterAutoItems,
  markItemsApplied,
  mergeStoredPlan,
  readStoredMigrationPlan,
  writeStoredMigrationPlan
} from "../packages/cli/src/migration-manifest.js";
import { createMigrationPlan } from "../packages/cli/src/migration.js";

describe("migration manifest", () => {
  it("filters transforms by --only and --skip selections", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-manifest-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "App.tsx"),
      '<button>Save</button>\n<img src="/logo.png" />\n'
    );

    const plan = await createMigrationPlan(directory);
    const onlyButtons = filterAutoItems(plan.items, {
      selection: { onlyTransforms: ["native-button-to-button"] }
    });
    expect(onlyButtons.every((item) => item.transformId === "native-button-to-button")).toBe(true);

    const dryRun = await applyMigrationDryRun(directory, {
      selection: { skipTransforms: ["img-add-alt"] }
    });
    expect(dryRun.changes[0]?.diff).toContain("<Button>Save</Button>");
    expect(dryRun.changes[0]?.diff).not.toContain('alt=""');
  });

  it("persists applied item statuses for resumable manifests", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-resume-"));
    await mkdir(path.join(directory, "src"));
    const filePath = path.join(directory, "src", "App.tsx");
    await writeFile(filePath, '<button>Save</button>\n<img src="/logo.png" />\n');

    const first = await applyMigration(directory, {
      dryRun: false,
      manifestPath: ".super-system/migration-plan.json",
      writeManifest: true,
      selection: { onlyTransforms: ["native-button-to-button"] }
    });
    expect(first.summary.filesWritten).toBe(1);

    const stored = await readStoredMigrationPlan(directory, ".super-system/migration-plan.json");
    expect(stored?.itemStatuses?.some((entry) => entry.status === "applied")).toBe(true);

    const second = await applyMigrationDryRun(directory, {
      manifestPath: ".super-system/migration-plan.json",
      selection: { onlyTransforms: ["native-button-to-button"] }
    });
    expect(second.summary.transformsApplied).toBe(0);
    expect(second.summary.transformsSkipped).toBe(0);
  });

  it("merges prior applied statuses into a refreshed plan", async () => {
    const fresh = await createMigrationPlan(process.cwd());
    const stored = markItemsApplied(mergeStoredPlan(fresh, null), [{ id: fresh.items[0]?.id ?? "x" }], []);
    const merged = mergeStoredPlan(fresh, stored);
    expect(merged.itemStatuses?.find((entry) => entry.id === fresh.items[0]?.id)?.status).toBe("applied");
  });
});

describe("migration fixtures", () => {
  it("handles successful, ambiguous, unsupported, and malformed fixture cases", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-fixtures-"));
    await mkdir(path.join(directory, "src"));

    await writeFile(path.join(directory, "src", "Success.tsx"), "<button>Go</button>\n");
    await writeFile(path.join(directory, "src", "Ambiguous.css"), ".card { color: #999999; }\n");
    await writeFile(
      path.join(directory, "super-system.json"),
      `${JSON.stringify(
        {
          ...defaultTheme,
          themes: {
            ...defaultTheme.themes,
            light: { ...defaultTheme.themes.light, border: "#999999", mutedForeground: "#999999" }
          }
        },
        null,
        2
      )}\n`
    );
    await writeFile(path.join(directory, "src", "Unsupported.vue"), "<template><button /></template>\n");
    await writeFile(path.join(directory, "src", "Malformed.tsx"), "<button>Missing close\n");

    const plan = await createMigrationPlan(directory);
    const success = plan.items.find((item) => item.file === "src/Success.tsx");
    const ambiguous = plan.items.find((item) => item.file === "src/Ambiguous.css");
    const unsupported = plan.items.find((item) => item.file === "src/Unsupported.vue");
    const malformed = plan.items.find((item) => item.file === "src/Malformed.tsx");

    expect(success?.mode).toBe("auto");
    expect(ambiguous?.mode).toBe("manual");
    expect(unsupported?.mode).toBe("auto");
    expect(malformed?.mode).toBe("auto");
  });
});

describe("migration idempotency", () => {
  it("does not rewrite files when apply runs twice", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-idempotent-"));
    await mkdir(path.join(directory, "src"));
    const filePath = path.join(directory, "src", "App.tsx");
    await writeFile(filePath, 'export default function App() {\n  return <button>Save</button>;\n}\n');

    const first = await applyMigration(directory, { dryRun: false, writeManifest: false });
    const afterFirst = await readFile(filePath, "utf8");

    const second = await applyMigration(directory, { dryRun: false, writeManifest: false });
    const afterSecond = await readFile(filePath, "utf8");

    expect(first.summary.filesWritten).toBe(1);
    expect(second.summary.filesWritten).toBe(0);
    expect(afterSecond).toBe(afterFirst);
  });
});

describe("migration project detection", () => {
  it("detects vite and next project contexts in representative fixtures", async () => {
    for (const [label, files] of [
      ["vite", { "vite.config.ts": "export default {}\n", "package.json": "{}\n" }],
      ["next", { "next.config.js": "module.exports = {}\n", "package.json": "{}\n" }]
    ] as const) {
      const directory = await mkdtemp(path.join(tmpdir(), `super-system-migrate-${label}-`));
      for (const [name, content] of Object.entries(files)) {
        await writeFile(path.join(directory, name), content);
      }
      const plan = await createMigrationPlan(directory);
      expect(plan.project.frameworks).toContain(label);
    }
  });
});
