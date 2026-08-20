import { execFile } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { checkThemeContrast, defaultTheme, validateConfig } from "../packages/tokens/src/index.js";

const execFileAsync = promisify(execFile);
const demoDir = path.join(process.cwd(), "packages/studio-ui/dist/demo");

describe("studio demo", () => {
  it("builds a static demo bundle", async () => {
    await execFileAsync("pnpm", ["build:studio-demo"], { cwd: process.cwd() });

    await expect(access(path.join(demoDir, "index.html"))).resolves.toBeUndefined();
    await expect(access(path.join(demoDir, "app.js"))).resolves.toBeUndefined();
    await expect(access(path.join(demoDir, "styles.css"))).resolves.toBeUndefined();

    const html = await readFile(path.join(demoDir, "index.html"), "utf8");
    expect(html).toContain("Download theme");
    expect(html).toContain('src="./app.js"');
    expect(html).toContain("ss-button--destructive");
    expect(html).toContain("ss-button--ghost");
    expect(html).toContain("ss-input--invalid");
    expect(html).toContain("ss-textarea");
    expect(html).toContain("ss-textarea--invalid");
    expect(html).toContain("ss-label");
    expect(html).toContain("ss-label__required");
    expect(html).toContain("ss-checkbox");
    expect(html).toContain("ss-radio-group");
    expect(html).toContain("ss-switch");
    expect(html).toContain("ss-select");
    expect(html).toContain("ss-alert--destructive");
    expect(html).toContain("ss-badge--neutral");
    expect(html).toContain("ss-card");
    expect(html).toContain("ss-spinner");
  });

  it("uses the same contrast logic as the token package", () => {
    expect(checkThemeContrast(defaultTheme).every((result) => result.passes)).toBe(true);
    expect(validateConfig(defaultTheme).version).toBe(1);
  });
});
