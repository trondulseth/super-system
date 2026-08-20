import {
  checkThemeContrast,
  defaultTheme,
  validateConfig,
  type SuperSystemConfig
} from "@super-system/tokens";
import type { StudioBackend } from "./types.js";

const storageKey = "super-system-studio-demo";

function readStoredConfig(): SuperSystemConfig | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    return validateConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}

function writeStoredConfig(config: SuperSystemConfig): void {
  window.localStorage.setItem(storageKey, JSON.stringify(config));
}

function downloadConfig(config: SuperSystemConfig): void {
  const blob = new Blob([`${JSON.stringify(config, null, 2)}\n`], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "super-system.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export const staticBackend: StudioBackend = {
  async loadConfig() {
    return structuredClone(readStoredConfig() ?? defaultTheme);
  },
  async saveConfig(config) {
    const validated = validateConfig(config);
    writeStoredConfig(validated);
    downloadConfig(validated);
    return { ok: true, message: "Downloaded theme" };
  },
  async checkContrast(config) {
    return checkThemeContrast(validateConfig(config));
  }
};

export { storageKey };
