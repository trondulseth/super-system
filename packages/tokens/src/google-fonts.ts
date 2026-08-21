import type { SuperSystemConfig } from "./types.js";

export interface GoogleFontPreset {
  id: string;
  label: string;
  googleFamily: string;
  fontSans: string;
}

export const GOOGLE_FONT_PRESETS: GoogleFontPreset[] = [
  {
    id: "inter",
    label: "Inter",
    googleFamily: "Inter",
    fontSans: "Inter, ui-sans-serif, system-ui, sans-serif"
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    googleFamily: "DM Sans",
    fontSans: '"DM Sans", ui-sans-serif, system-ui, sans-serif'
  },
  {
    id: "plus-jakarta-sans",
    label: "Plus Jakarta Sans",
    googleFamily: "Plus Jakarta Sans",
    fontSans: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif'
  },
  {
    id: "manrope",
    label: "Manrope",
    googleFamily: "Manrope",
    fontSans: "Manrope, ui-sans-serif, system-ui, sans-serif"
  },
  {
    id: "source-sans-3",
    label: "Source Sans 3",
    googleFamily: "Source Sans 3",
    fontSans: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif'
  },
  {
    id: "nunito-sans",
    label: "Nunito Sans",
    googleFamily: "Nunito Sans",
    fontSans: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif'
  },
  {
    id: "work-sans",
    label: "Work Sans",
    googleFamily: "Work Sans",
    fontSans: '"Work Sans", ui-sans-serif, system-ui, sans-serif'
  },
  {
    id: "outfit",
    label: "Outfit",
    googleFamily: "Outfit",
    fontSans: "Outfit, ui-sans-serif, system-ui, sans-serif"
  },
  {
    id: "lexend",
    label: "Lexend",
    googleFamily: "Lexend",
    fontSans: "Lexend, ui-sans-serif, system-ui, sans-serif"
  },
  {
    id: "ibm-plex-sans",
    label: "IBM Plex Sans",
    googleFamily: "IBM Plex Sans",
    fontSans: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif'
  }
];

const PRESET_BY_ID = new Map(GOOGLE_FONT_PRESETS.map((preset) => [preset.id, preset]));

function primaryFamily(fontSans: string): string {
  return fontSans.split(",")[0]?.trim().replace(/^"|"$/g, "").toLowerCase() ?? "";
}

export function getFontPreset(id: string): GoogleFontPreset | undefined {
  return PRESET_BY_ID.get(id);
}

export function inferFontPresetId(fontSans: string): string {
  const primary = primaryFamily(fontSans);
  const match = GOOGLE_FONT_PRESETS.find(
    (preset) => primaryFamily(preset.fontSans) === primary
  );
  return match?.id ?? GOOGLE_FONT_PRESETS[0]!.id;
}

export function resolveFontPreset(config: SuperSystemConfig): GoogleFontPreset {
  const id = config.typography.fontFamily ?? inferFontPresetId(config.typography.fontSans);
  return getFontPreset(id) ?? GOOGLE_FONT_PRESETS[0]!;
}

export function fontWeightsForConfig(config: SuperSystemConfig): number[] {
  const weight = config.typography.weight;
  return [
    weight?.body ?? 400,
    weight?.strong ?? 600,
    weight?.heading ?? 700
  ];
}

export function buildGoogleFontsUrl(preset: GoogleFontPreset, weights: number[]): string {
  const familyParam = preset.googleFamily.replace(/ /g, "+");
  const uniqueWeights = [...new Set(weights.map((weight) => Math.round(weight)))].sort((a, b) => a - b);
  return `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${uniqueWeights.join(";")}&display=swap`;
}

export function buildGoogleFontsImport(config: SuperSystemConfig): string {
  const preset = resolveFontPreset(config);
  const url = buildGoogleFontsUrl(preset, fontWeightsForConfig(config));
  return `@import url('${url}');`;
}

export const GOOGLE_FONT_PRESET_IDS = GOOGLE_FONT_PRESETS.map((preset) => preset.id);
