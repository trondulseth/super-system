/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it } from "vitest";
import { initStudioShell } from "../packages/studio-ui/src/studio-shell.js";

function buildShell(): void {
  document.body.innerHTML = `
    <main class="studio-main">
      <aside class="studio-sidebar" data-studio-panel="theme"></aside>
      <div class="studio-workspace">
        <section class="studio-preview" data-studio-panel="preview"></section>
        <section class="studio-checks" data-studio-panel="checks"></section>
      </div>
    </main>
    <nav class="studio-mobile-nav">
      <button type="button" data-studio-tab="theme" aria-selected="true">Theme</button>
      <button type="button" data-studio-tab="preview" aria-selected="false">Preview</button>
      <button type="button" data-studio-tab="checks" aria-selected="false">A11y</button>
    </nav>
  `;
}

describe("studio shell", () => {
  beforeEach(() => {
    sessionStorage.clear();
    buildShell();
  });

  it("shows only the theme panel on narrow viewports", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("min-width") ? false : false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {}
      })
    });

    initStudioShell();

    const main = document.querySelector(".studio-main") as HTMLElement;
    const theme = document.querySelector('[data-studio-panel="theme"]') as HTMLElement;
    const preview = document.querySelector('[data-studio-panel="preview"]') as HTMLElement;
    const checks = document.querySelector('[data-studio-panel="checks"]') as HTMLElement;

    expect(main.dataset.activePanel).toBe("theme");
    expect(theme.hidden).toBe(false);
    expect(preview.hidden).toBe(true);
    expect(checks.hidden).toBe(true);
  });

  it("switches panels when a mobile tab is pressed", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {}
      })
    });

    initStudioShell();

    const previewTab = document.querySelector('[data-studio-tab="preview"]') as HTMLButtonElement;
    previewTab.click();

    const preview = document.querySelector('[data-studio-panel="preview"]') as HTMLElement;
    const main = document.querySelector(".studio-main") as HTMLElement;
    expect(main.dataset.activePanel).toBe("preview");
    expect(preview.hidden).toBe(false);
    expect(previewTab.getAttribute("aria-selected")).toBe("true");
  });
});
