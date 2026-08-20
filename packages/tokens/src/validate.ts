import type { SuperSystemConfig } from "./types.js";

export function validateConfig(input: unknown): SuperSystemConfig {
  if (!input || typeof input !== "object") throw new Error("Theme must be an object.");
  const config = input as Partial<SuperSystemConfig>;
  if (config.version !== 1) throw new Error("Unsupported theme version.");
  if (!config.themes?.light || !config.themes.dark) throw new Error("Both light and dark themes are required.");
  if (!config.typography?.fontSans) throw new Error("typography.fontSans is required.");
  if (!config.spacing || config.spacing.unit <= 0) throw new Error("spacing.unit must be greater than zero.");
  if (!config.accessibility || config.accessibility.minimumTargetSize < 24) {
    throw new Error("accessibility.minimumTargetSize must be at least 24.");
  }
  return config as SuperSystemConfig;
}
