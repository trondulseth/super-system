import type { SuperSystemConfig } from "@super-system/tokens";
import { updatePreviewTheme } from "./preview-theme.js";
import type { StudioBackend, StudioOptions } from "./types.js";

const colorIds = [
  "primary",
  "primaryForeground",
  "background",
  "foreground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "border",
  "destructive",
  "destructiveForeground",
  "focus"
] as const;

function $(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element;
}

function esc(value: string): string {
  return String(value).replace(/[&<>"']/g, (character) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return map[character] ?? character;
  });
}

export async function initStudio(backend: StudioBackend, options: StudioOptions = {}): Promise<void> {
  let config: SuperSystemConfig;
  let preview: "light" | "dark" = "light";

  const saveButton = $("save") as HTMLButtonElement;
  const toggleButton = $("toggle") as HTMLButtonElement;
  const status = $("status");
  const checks = $("checks");
  const demoBanner = $("demo-banner");

  saveButton.textContent = options.saveLabel ?? "Save theme";
  if (options.demoBanner) {
    demoBanner.hidden = false;
    demoBanner.textContent = options.demoBanner;
  }

  function fill(): void {
    const theme = config.themes[preview];
    colorIds.forEach((id) => {
      (document.getElementById(id) as HTMLInputElement).value = theme[id];
    });
    (document.getElementById("fontSans") as HTMLInputElement).value = config.typography.fontSans;
    (document.getElementById("fontMono") as HTMLInputElement).value = config.typography.fontMono;
    (document.getElementById("baseSize") as HTMLInputElement).value = config.typography.baseSize;
    (document.getElementById("lineHeight") as HTMLInputElement).value = String(config.typography.lineHeight);
    (document.getElementById("radiusSm") as HTMLInputElement).value = config.radius.sm;
    (document.getElementById("radiusMd") as HTMLInputElement).value = config.radius.md;
    (document.getElementById("radiusLg") as HTMLInputElement).value = config.radius.lg;
    (document.getElementById("density") as HTMLSelectElement).value = config.spacing.density;
    (document.getElementById("icons") as HTMLSelectElement).value = config.icons.library;
    (document.getElementById("contrast") as HTMLSelectElement).value = config.accessibility.contrast;
    (document.getElementById("target") as HTMLInputElement).value = String(
      config.accessibility.minimumTargetSize
    );
    (document.getElementById("modeDefault") as HTMLSelectElement).value = config.mode.default;
    (document.getElementById("reducedMotion") as HTMLInputElement).checked =
      config.accessibility.reducedMotion;
  }

  function collect(): void {
    const theme = config.themes[preview];
    colorIds.forEach((id) => {
      theme[id] = (document.getElementById(id) as HTMLInputElement).value;
    });
    config.typography.fontSans = (document.getElementById("fontSans") as HTMLInputElement).value;
    config.typography.fontMono = (document.getElementById("fontMono") as HTMLInputElement).value;
    config.typography.baseSize = (document.getElementById("baseSize") as HTMLInputElement).value;
    config.typography.lineHeight = Number(
      (document.getElementById("lineHeight") as HTMLInputElement).value
    );
    config.radius.sm = (document.getElementById("radiusSm") as HTMLInputElement).value;
    config.radius.md = (document.getElementById("radiusMd") as HTMLInputElement).value;
    config.radius.lg = (document.getElementById("radiusLg") as HTMLInputElement).value;
    config.spacing.density = (document.getElementById("density") as HTMLSelectElement)
      .value as SuperSystemConfig["spacing"]["density"];
    config.icons.library = (document.getElementById("icons") as HTMLSelectElement)
      .value as SuperSystemConfig["icons"]["library"];
    config.accessibility.contrast = (document.getElementById("contrast") as HTMLSelectElement)
      .value as SuperSystemConfig["accessibility"]["contrast"];
    config.accessibility.minimumTargetSize = Number(
      (document.getElementById("target") as HTMLInputElement).value
    );
    config.mode.default = (document.getElementById("modeDefault") as HTMLSelectElement)
      .value as SuperSystemConfig["mode"]["default"];
    config.accessibility.reducedMotion = (document.getElementById("reducedMotion") as HTMLInputElement)
      .checked;
  }

  async function render(): Promise<void> {
    collect();
    updatePreviewTheme(config, preview);

    const results = await backend.checkContrast(config);
    checks.innerHTML = results
      .filter((result) => result.theme === preview)
      .map(
        (result) =>
          `<div class="check"><span>${esc(result.pair)}</span><span class="${result.passes ? "pass" : "fail"}">${result.ratio}:1 ${result.passes ? "Pass" : "Fail"}</span></div>`
      )
      .join("");
  }

  config = await backend.loadConfig();
  fill();
  await render();

  document.querySelectorAll("aside input,aside select").forEach((element) => {
    element.addEventListener("input", () => {
      void render();
    });
    element.addEventListener("change", () => {
      void render();
    });
  });

  toggleButton.addEventListener("click", () => {
    collect();
    preview = preview === "light" ? "dark" : "light";
    toggleButton.textContent = preview === "light" ? "Dark preview" : "Light preview";
    fill();
    void render();
  });

  saveButton.addEventListener("click", () => {
    void (async () => {
      collect();
      const result = await backend.saveConfig(config);
      status.textContent = result.message;
      setTimeout(() => {
        status.textContent = "";
      }, 1800);
    })();
  });
}
