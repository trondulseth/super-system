import type { SuperSystemConfig } from "@super-system/tokens";
import type { StudioBackend } from "./types.js";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const serverBackend: StudioBackend = {
  async loadConfig() {
    return requestJson<SuperSystemConfig>("/api/config");
  },
  async saveConfig(config) {
    const response = await fetch("/api/config", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(config)
    });
    return {
      ok: response.ok,
      message: response.ok ? "Saved" : "Could not save"
    };
  },
  async checkContrast(config) {
    return requestJson("/api/contrast", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(config)
    });
  }
};
