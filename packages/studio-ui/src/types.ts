import type { ContrastResult, SuperSystemConfig } from "@super-system/tokens";

export interface StudioBackend {
  loadConfig(): Promise<SuperSystemConfig>;
  saveConfig(config: SuperSystemConfig): Promise<{ ok: boolean; message: string }>;
  checkContrast(config: SuperSystemConfig): Promise<ContrastResult[]>;
}

export interface StudioOptions {
  saveLabel?: string;
  demoBanner?: string;
}
