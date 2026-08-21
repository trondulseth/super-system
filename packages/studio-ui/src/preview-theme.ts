import { buildGoogleFontsUrl, compileTheme, resolveFontPreset, type SuperSystemConfig } from "@super-system/tokens";

const STYLE_ID = "preview-theme-styles";
const FONT_LINK_ID = "preview-google-fonts";

export function updatePreviewTheme(config: SuperSystemConfig, mode: "light" | "dark"): void {
  updatePreviewFonts(config);

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

export function updatePreviewFonts(config: SuperSystemConfig): void {
  const preset = resolveFontPreset(config);
  const weights = [
    config.typography.weight?.body ?? 400,
    config.typography.weight?.strong ?? 600,
    config.typography.weight?.heading ?? 700
  ];
  const href = buildGoogleFontsUrl(preset, weights);

  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  if (link.href !== href) {
    link.href = href;
  }
}

function scopeThemeStylesheet(config: SuperSystemConfig): string {
  let css = compileTheme(config)
    .replace(/^@import url\([^)]+\);\s*/m, "")
    .replace(/^:root/gm, ".preview-theme")
    .replace(/:root\[data-theme="dark"\]/g, '.preview-theme[data-theme="dark"]')
    .replace(
      /:root:not\(\[data-theme="light"\]\)/g,
      '.preview-theme:not([data-theme="light"])'
    );

  css = css.replace(
    /@media \(prefers-reduced-motion: reduce\) \{\s*\*, \*::before, \*::after \{/g,
    "@media (prefers-reduced-motion: reduce) { .preview-theme, .preview-theme *, .preview-theme *::before, .preview-theme *::after {"
  );

  return css;
}
