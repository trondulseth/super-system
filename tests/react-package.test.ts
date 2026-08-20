import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const reactDir = path.join(process.cwd(), "packages/react");
const stylesPath = path.join(reactDir, "src/styles.css");

describe("react package distribution", () => {
  it("limits sideEffects to CSS for tree-shakable JS imports", async () => {
    const pkg = JSON.parse(await readFile(path.join(reactDir, "package.json"), "utf8"));
    expect(pkg.sideEffects).toEqual(["**/*.css"]);
  });

  it("supports importing a single named export from the public barrel", async () => {
    const { Button, Badge } = await import("../packages/react/src/index.js");
    expect(Button).toBeTruthy();
    expect(Badge).toBeTruthy();
  });

  it("keeps per-component modules behind a single public entry", async () => {
    const barrel = await readFile(path.join(reactDir, "src/index.tsx"), "utf8");
    expect(barrel).toContain('export { Button');
    expect(barrel).toContain('export { ThemeProvider');
    expect(barrel).not.toContain("function Button");
  });

  it("documents invalid-state background tint and resilience media queries in component CSS", async () => {
    const css = await readFile(stylesPath, "utf8");
    expect(css).toContain(".ss-input--invalid");
    expect(css).toContain("color-mix(in srgb, var(--ss-color-destructive) 6%");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("@media (forced-colors: active)");
  });
});
