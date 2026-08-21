import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultTheme } from "../packages/tokens/src/index.js";
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

  it("classifies unambiguous hardcoded colors as auto-fixable", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-tokens-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(path.join(directory, "super-system.json"), `${JSON.stringify(defaultTheme, null, 2)}\n`);
    await writeFile(
      path.join(directory, "package.json"),
      JSON.stringify({ dependencies: { "@super-system/react": "beta" } })
    );
    await writeFile(
      path.join(directory, "src", "Card.css"),
      ".card {\n  color: #2563eb;\n}\n"
    );

    const plan = await createMigrationPlan(directory);
    const colorItem = plan.items.find((item) => item.rule === "hardcoded-color");
    expect(colorItem?.mode).toBe("auto");
    expect(colorItem?.transformId).toBe("token-replace-color");
    expect(colorItem?.tokenReplacements?.[0]?.cssVar).toBe("var(--ss-color-primary)");
  });

  it("classifies safe form controls as auto-fixable", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-form-plan-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "Form.tsx"),
      [
        "export function Form() {",
        "  return (",
        "    <>",
        '      <input type="email" />',
        "      <textarea />",
        "      <select />",
        '      <input type="checkbox" />',
        "    </>",
        "  );",
        "}",
        ""
      ].join("\n")
    );

    const plan = await createMigrationPlan(directory);
    expect(plan.items.find((item) => item.rule === "raw-input" && item.transformId === "native-input-to-input")).toBeTruthy();
    expect(plan.items.find((item) => item.rule === "raw-textarea" && item.transformId === "native-textarea-to-textarea")).toBeTruthy();
    expect(plan.items.find((item) => item.rule === "raw-select" && item.transformId === "native-select-to-select")).toBeTruthy();
    expect(plan.items.filter((item) => item.rule === "raw-input" && item.mode === "manual")).toHaveLength(0);
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
