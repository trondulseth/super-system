/**
 * @vitest-environment node
 */
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const demoDir = path.join(process.cwd(), "packages/studio-ui/dist/demo");

/** Static preview markers for @super-system/react exports (runtime-only exports excluded). */
const PREVIEW_COVERAGE = [
  { exportName: "Button", marker: "ss-button--primary" },
  { exportName: "Input", marker: "ss-input" },
  { exportName: "Textarea", marker: "ss-textarea" },
  { exportName: "Label", marker: "ss-label" },
  { exportName: "Checkbox", marker: "ss-checkbox" },
  { exportName: "RadioGroup", marker: "ss-radio-group" },
  { exportName: "Switch", marker: "ss-switch" },
  { exportName: "Select", marker: "ss-select" },
  { exportName: "Alert", marker: "ss-alert" },
  { exportName: "Spinner", marker: "ss-spinner" },
  { exportName: "Skeleton", marker: "ss-skeleton" },
  { exportName: "Tooltip", marker: "ss-tooltip__content" },
  { exportName: "Badge", marker: "ss-badge--neutral" },
  { exportName: "Card", marker: "ss-card__footer" },
  { exportName: "Tabs", marker: "ss-tabs__trigger--active" },
  { exportName: "Accordion", marker: "ss-accordion__trigger" },
  { exportName: "Breadcrumb", marker: 'aria-label="Breadcrumb"' },
  { exportName: "DropdownMenu", marker: "ss-dropdown__content" },
  { exportName: "Pagination", marker: 'aria-label="Pagination"' },
  { exportName: "DialogClose", marker: "ss-dialog__close" },
  { exportName: "DrawerClose", marker: "ss-drawer__close" },
  { exportName: "Drawer left", marker: "ss-drawer__content--left" },
  { exportName: "Popover top", marker: "ss-popover__content--top" },
  { exportName: "Toast neutral", marker: "Draft saved" },
  { exportName: "Toast destructive", marker: "ss-toast--destructive" },
  { exportName: "TableCaption", marker: "ss-table__caption" },
  { exportName: "TableFooter", marker: "ss-table__footer" },
  { exportName: "Icon", marker: "ss-icon--md" },
  { exportName: "Sparkline", marker: "ss-sparkline--primary" },
  { exportName: "BarChart", marker: "ss-bar-chart--muted" },
  { exportName: "LineChart", marker: "ss-line-chart--primary" },
  { exportName: "DonutChart", marker: "ss-donut-chart--primary" },
  { exportName: "KpiCardDescription", marker: "ss-kpi-card__description" },
  { exportName: "KpiCardFooter", marker: "ss-kpi-card__footer" },
  { exportName: "KpiCard trend down", marker: "ss-kpi-card__trend--down" },
  { exportName: "Stack", marker: "ss-stack" },
  { exportName: "Row", marker: 'class="ss-row' },
  { exportName: "Container", marker: "ss-container--sm" },
  { exportName: "Divider", marker: "ss-divider--vertical" },
  { exportName: "Spacer", marker: "ss-spacer--md" },
  { exportName: "AppShell", marker: "ss-app-shell--preview" },
  { exportName: "SidebarNavItem active", marker: "ss-sidebar__link--active" },
  { exportName: "HamburgerMenu", marker: "ss-hamburger-menu__trigger" },
  { exportName: "PageHeader", marker: "ss-page-header__title" },
  { exportName: "PageFooter", marker: "ss-page-footer" },
  { exportName: "Main", marker: "ss-main" },
  { exportName: "TopBar", marker: "ss-top-bar__brand" },
  { exportName: "Focus visible", marker: "preview-focus-ring" }
] as const;

/** Exports that require React runtime wiring and are intentionally not static HTML demos. */
export const RUNTIME_ONLY_EXPORTS = [
  "ThemeProvider",
  "ToastProvider",
  "useToast",
  "DialogTrigger",
  "DrawerTrigger",
  "PopoverTrigger",
  "Dialog",
  "Drawer",
  "Popover",
  "ToastTitle",
  "ToastDescription",
  "ToastClose",
  "Box"
] as const;

describe("studio preview coverage", () => {
  it("covers every static preview export in the demo HTML", async () => {
    await execFileAsync("pnpm", ["build:studio-demo"], { cwd: process.cwd() });

    const html = await readFile(path.join(demoDir, "index.html"), "utf8");
    const missing = PREVIEW_COVERAGE.filter(({ marker }) => !html.includes(marker));

    expect(missing, `Missing preview markers: ${missing.map((entry) => entry.exportName).join(", ")}`).toEqual([]);
  });

  it("avoids inline layout styles in the preview panel markup", async () => {
    const html = await readFile(path.join(process.cwd(), "packages/studio-ui/src/index.html"), "utf8");
    const previewStart = html.indexOf('id="preview-root"');
    const previewEnd = html.indexOf('<div id="checks">');
    const previewHtml = html.slice(previewStart, previewEnd);

    expect(previewHtml.includes('style="')).toBe(false);
  });
});
