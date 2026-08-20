import { compileTheme, type SuperSystemConfig } from "@super-system/tokens";

const STYLE_ID = "preview-theme-styles";

export function updatePreviewTheme(config: SuperSystemConfig, mode: "light" | "dark"): void {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = scopeThemeStylesheet(config);

  const root = document.getElementById("preview-root");
  if (root) {
    root.dataset.theme = mode;
  }
}

function scopeThemeStylesheet(config: SuperSystemConfig): string {
  return compileTheme(config)
    .replace(/^:root/gm, ".preview-theme")
    .replace(/:root\[data-theme="dark"\]/g, '.preview-theme[data-theme="dark"]')
    .replace(
      /:root:not\(\[data-theme="light"\]\)/g,
      ".preview-theme:not([data-theme=\"light\"])"
    );
}
