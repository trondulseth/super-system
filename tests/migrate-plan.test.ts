import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createMigrationPlan, formatMigrationPlan } from "../packages/cli/src/migration.js";

describe("migrate plan", () => {
  it("builds a read-only migration plan from audit findings", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "package.json"),
      JSON.stringify({ dependencies: { react: "^19.0.0" } })
    );
    await writeFile(path.join(directory, "vite.config.ts"), "export default {};\n");
    await writeFile(
      path.join(directory, "src", "App.tsx"),
      '<button style={{ color: "#ff0000" }}>Save</button>\n<img src="/logo.png" />'
    );

    const plan = await createMigrationPlan(directory);

    expect(plan.version).toBe(1);
    expect(plan.project.frameworks).toContain("vite");
    expect(plan.project.hasSuperSystemConfig).toBe(false);
    expect(plan.summary.findings).toBeGreaterThanOrEqual(4);
    expect(plan.summary.autoFixable).toBeGreaterThanOrEqual(2);
    expect(plan.summary.manualReview).toBeGreaterThanOrEqual(2);
    expect(plan.items.some((item) => item.rule === "raw-button" && item.transformId === "native-button-to-button")).toBe(true);
    expect(plan.items.some((item) => item.rule === "image-alt" && item.confidence === "high")).toBe(true);
    expect(plan.nextSteps.some((step) => step.includes("init"))).toBe(true);

    const formatted = formatMigrationPlan(plan);
    expect(formatted).toContain("migration plan (read-only)");
    expect(formatted).toContain("Planned auto-fixes");
    expect(formatted).toContain("Manual review");
  });

  it("reports a clean plan when no findings exist", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-clean-"));
    await writeFile(path.join(directory, "super-system.json"), JSON.stringify({ version: 1 }));
    await writeFile(
      path.join(directory, "package.json"),
      JSON.stringify({ dependencies: { "@super-system/react": "beta" } })
    );

    const plan = await createMigrationPlan(directory);
    expect(plan.summary.findings).toBe(0);
    expect(plan.nextSteps.some((step) => step.includes("No migration work detected"))).toBe(true);
  });
});
