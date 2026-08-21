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
    expect(html).toContain('id="spacingUnit"');
    expect(html).toContain('id="radiusFull"');
    expect(html).toContain('id="successHex"');
    expect(html).toContain('id="editing-theme"');
    expect(html).toContain('id="mode-default-badge"');
    expect(html).toContain("preview-mono");
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
    expect(html).toContain('role="status"');
    expect(html).toContain("disabled");
    expect(html).toContain("ss-select-wrap");
    expect(html).toContain("ss-select--invalid");
    expect(html).toContain("ss-checkbox--invalid");
    expect(html).toContain("ss-switch--invalid");
    expect(html).not.toContain("preview icons are not rendered yet");
    expect(html).toContain("ss-spinner--md");
    expect(html).toContain("ss-skeleton--block");
    expect(html).toContain("ss-tooltip__content");
    expect(html).toContain("ss-badge--neutral");
    expect(html).toContain("ss-card");
    expect(html).toContain("ss-spinner");
    expect(html).toContain("ss-tabs__trigger--active");
    expect(html).toContain("ss-accordion__trigger");
    expect(html).toContain('aria-label="Breadcrumb"');
    expect(html).toContain("ss-dropdown__content");
    expect(html).toContain('aria-label="Pagination"');
    expect(html).toContain("ss-pagination__link--active");
    expect(html).toContain("ss-dialog__content");
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain("ss-drawer__content--right");
    expect(html).toContain("ss-drawer__content--left");
    expect(html).toContain("ss-dialog__close");
    expect(html).toContain("ss-popover__content--top");
    expect(html).toContain("ss-toast--destructive");
    expect(html).toContain("ss-table__caption");
    expect(html).toContain("ss-table__footer");
    expect(html).toContain("ss-card__footer");
    expect(html).toContain("ss-line-chart--primary");
    expect(html).toContain("ss-donut-chart--muted");
    expect(html).toContain("ss-app-shell--preview");
    expect(html).toContain("preview-focus-ring");
    expect(html).toContain("ss-table-wrap");
    expect(html).toContain('scope="col"');
    expect(html).toContain("ss-icon--md");
    expect(html).toContain('aria-label="Add item"');
  });

  it("uses the same contrast logic as the token package", () => {
    const results = checkThemeContrast(defaultTheme).filter(
      (result) => result.pair !== "border/background"
    );
    expect(results.every((result) => result.passes)).toBe(true);
    expect(validateConfig(defaultTheme).version).toBe(1);
  });
});
