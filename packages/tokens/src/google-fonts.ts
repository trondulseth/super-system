import type { SuperSystemConfig } from "./types.js";

export interface GoogleFontPreset {
  id: string;
  label: string;
  googleFamily: string;
  fontSans: string;
  /** Short Studio hint describing the font personality. */
  personality: string;
}

export const GOOGLE_FONT_PRESETS: GoogleFontPreset[] = [
  {
    id: "inter",
    label: "Inter",
    googleFamily: "Inter",
    fontSans: "Inter, ui-sans-serif, system-ui, sans-serif",
    personality: "Neutral UI default"
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    googleFamily: "Space Grotesk",
    fontSans: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
    personality: "Tech, geometric, startup"
  },
  {
    id: "lora",
    label: "Lora",
    googleFamily: "Lora",
    fontSans: "Lora, ui-serif, Georgia, serif",
    personality: "Editorial serif, warm"
  },
  {
    id: "nunito",
    label: "Nunito",
    googleFamily: "Nunito",
    fontSans: "Nunito, ui-sans-serif, system-ui, sans-serif",
    personality: "Soft, rounded, friendly"
  },
  {
    id: "barlow",
    label: "Barlow",
    googleFamily: "Barlow",
    fontSans: "Barlow, ui-sans-serif, system-ui, sans-serif",
    personality: "Industrial, utilitarian"
  },
  {
    id: "merriweather",
    label: "Merriweather",
    googleFamily: "Merriweather",
    fontSans: "Merriweather, ui-serif, Georgia, serif",
    personality: "Classic serif, trustworthy"
  },
  {
    id: "archivo",
    label: "Archivo",
    googleFamily: "Archivo",
    fontSans: "Archivo, ui-sans-serif, system-ui, sans-serif",
    personality: "Grotesque, newsroom"
  },
  {
    id: "fraunces",
    label: "Fraunces",
    googleFamily: "Fraunces",
    fontSans: "Fraunces, ui-serif, Georgia, serif",
    personality: "Artisan soft serif"
  },
  {
    id: "roboto-slab",
    label: "Roboto Slab",
    googleFamily: "Roboto Slab",
    fontSans: '"Roboto Slab", ui-serif, Georgia, serif',
    personality: "Slab serif, strong"
  },
  {
    id: "syne",
    label: "Syne",
    googleFamily: "Syne",
    fontSans: "Syne, ui-sans-serif, system-ui, sans-serif",
    personality: "Artistic, avant-garde"
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
  const inferred = inferFontPresetId(config.typography.fontSans);
  const id = config.typography.fontFamily ?? inferred;
  return getFontPreset(id) ?? getFontPreset(inferred) ?? GOOGLE_FONT_PRESETS[0]!;
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
