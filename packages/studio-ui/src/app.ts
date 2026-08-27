import type { SuperSystemConfig } from "@super-system/tokens";
import { initPreviewInteractions } from "./preview-interactions.js";
import { updatePreviewTheme } from "./preview-theme.js";
import { initStudioShell } from "./studio-shell.js";
import {
  applyConfigToForm,
  FORM_COLOR_IDS,
  readConfigFromForm,
  syncColorPickerFromHex,
  syncHexFromColorPicker,
  syncSliderDisplays,
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

function setToggleLabels(button: HTMLButtonElement, preview: "light" | "dark"): void {
  const short = preview === "light" ? "Dark" : "Light";
  const long = preview === "light" ? "Dark preview" : "Light preview";
  button.querySelector(".studio-action-btn__short")!.textContent = short;
  button.querySelector(".studio-action-btn__long")!.textContent = long;
  button.setAttribute("aria-label", long);
}

const DEVICE_HINTS: Record<"desktop" | "tablet" | "mobile", string> = {
  desktop: "Full-width layout with persistent sidebar.",
  tablet: "Pad width — sidebar hidden; use the menu button.",
  mobile: "Mobile width — sidebar hidden; use the menu button."
};

function initPageShellPreview(): void {
  const frame = document.getElementById("page-shell-frame");
  const drawer = document.getElementById("preview-shell-drawer");
  const trigger = document.getElementById("preview-hamburger") as HTMLButtonElement | null;
  const closeButton = document.getElementById("preview-shell-close");
  const hint = document.getElementById("page-shell-hint");
  const switches = document.querySelectorAll<HTMLButtonElement>("[data-preview-device]");

  if (!frame || !drawer || !trigger) return;

  const shellFrame = frame;
  const shellDrawer = drawer;
  const shellTrigger = trigger;
  const shellOverlay = shellDrawer.querySelector(".preview-shell-drawer__overlay");

  function closeDrawer(): void {
    shellDrawer.classList.remove("is-open");
    shellDrawer.setAttribute("aria-hidden", "true");
    shellTrigger.setAttribute("aria-expanded", "false");
    shellOverlay?.setAttribute("tabindex", "-1");
  }

  function openDrawer(): void {
    shellDrawer.classList.add("is-open");
    shellDrawer.setAttribute("aria-hidden", "false");
    shellTrigger.setAttribute("aria-expanded", "true");
    shellOverlay?.setAttribute("tabindex", "0");
  }

  function toggleDrawer(): void {
    if (shellDrawer.classList.contains("is-open")) closeDrawer();
    else openDrawer();
  }

  function setDevice(device: "desktop" | "tablet" | "mobile"): void {
    shellFrame.dataset.device = device;
    switches.forEach((button) => {
      const active = button.dataset.previewDevice === device;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (hint) hint.textContent = DEVICE_HINTS[device];
    shellTrigger.hidden = device === "desktop";
    closeDrawer();
  }

  switches.forEach((button) => {
    button.addEventListener("click", () => {
      const device = button.dataset.previewDevice as "desktop" | "tablet" | "mobile" | undefined;
      if (device) setDevice(device);
    });
  });

  shellTrigger.addEventListener("click", () => {
    if (shellFrame.dataset.device === "desktop") return;
    toggleDrawer();
  });

  closeButton?.addEventListener("click", closeDrawer);
  shellOverlay?.addEventListener("click", closeDrawer);

  shellDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeDrawer();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && shellDrawer.classList.contains("is-open")) closeDrawer();
  });

  setDevice("desktop");
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

  const defaultSaveLabel = options.saveLabel ?? "Save theme";
  const saveShort = saveButton.querySelector(".studio-action-btn__short");
  const saveLong = saveButton.querySelector(".studio-action-btn__long");
  if (saveShort && saveLong) {
    saveShort.textContent = defaultSaveLabel.startsWith("Download") ? "Download" : "Save";
    saveLong.textContent = defaultSaveLabel;
    saveButton.setAttribute("aria-label", defaultSaveLabel);
  } else {
    saveButton.textContent = defaultSaveLabel;
  }
  setToggleLabels(toggleButton, preview);
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
  initStudioShell();
  initPageShellPreview();
  initPreviewInteractions();

  document.querySelectorAll("aside input,aside select").forEach((element) => {
    element.addEventListener("input", () => {
      syncSliderDisplays();
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
    setToggleLabels(toggleButton, preview);
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
