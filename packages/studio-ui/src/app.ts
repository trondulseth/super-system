import type { SuperSystemConfig } from "@super-system/tokens";
import { updatePreviewTheme } from "./preview-theme.js";
import {
  applyConfigToForm,
  FORM_COLOR_IDS,
  readConfigFromForm,
  syncColorPickerFromHex,
  syncHexFromColorPicker,
  validateStudioForm
} from "./studio-form.js";
import type { StudioBackend, StudioOptions } from "./types.js";

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

function formatModeDefault(mode: SuperSystemConfig["mode"]["default"]): string {
  return mode.charAt(0).toUpperCase() + mode.slice(1);
}

export async function initStudio(backend: StudioBackend, options: StudioOptions = {}): Promise<void> {
  let config: SuperSystemConfig;
  let preview: "light" | "dark" = "light";

  const saveButton = $("save") as HTMLButtonElement;
  const toggleButton = $("toggle") as HTMLButtonElement;
  const status = $("status");
  const checks = $("checks");
  const demoBanner = $("demo-banner");
  const editingTheme = $("editing-theme");
  const modeDefaultBadge = $("mode-default-badge");

  saveButton.textContent = options.saveLabel ?? "Save theme";
  if (options.demoBanner) {
    demoBanner.hidden = false;
    demoBanner.textContent = options.demoBanner;
  }

  function fill(): void {
    applyConfigToForm(config, preview);
    editingTheme.textContent = `Editing: ${preview === "light" ? "Light" : "Dark"} theme`;
    modeDefaultBadge.textContent = `Default mode: ${formatModeDefault(config.mode.default)}`;
  }

  function collect(): void {
    config = readConfigFromForm(config, preview);
  }

  async function render(): Promise<void> {
    collect();
    updatePreviewTheme(config, preview);

    const results = await backend.checkContrast(config);
    checks.innerHTML = (["light", "dark"] as const)
      .map((theme) => {
        const heading =
          theme === preview
            ? `<h3 class="checks-theme checks-theme--active">${esc(theme)} theme · editing</h3>`
            : `<h3 class="checks-theme">${esc(theme)} theme</h3>`;
        const rows = results
          .filter((result) => result.theme === theme)
          .map(
            (result) =>
              `<div class="check"><span>${esc(result.pair)}</span><span class="${result.passes ? "pass" : "fail"}">${result.ratio}:1 ${result.passes ? "Pass" : "Fail"}</span></div>`
          )
          .join("");
        return `${heading}${rows}`;
      })
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

  for (const id of FORM_COLOR_IDS) {
    const picker = document.getElementById(id) as HTMLInputElement | null;
    const hex = document.getElementById(`${id}Hex`) as HTMLInputElement | null;
    if (!picker || !hex) continue;

    picker.addEventListener("input", () => {
      syncHexFromColorPicker(id);
      void render();
    });

    hex.addEventListener("input", () => {
      if (syncColorPickerFromHex(id)) {
        void render();
      }
    });

    hex.addEventListener("change", () => {
      syncColorPickerFromHex(id);
      void render();
    });
  }

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
      const validationError = validateStudioForm();
      if (validationError) {
        status.textContent = validationError;
        return;
      }

      const result = await backend.saveConfig(config);
      status.textContent = result.message;
      setTimeout(() => {
        status.textContent = "";
      }, 1800);
    })();
  });
}
