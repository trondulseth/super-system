import type { ContrastResult, SuperSystemConfig, ThemeColors } from "./types.js";

function channel(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number | null {
  const match = /^#([\da-f]{6})$/i.exec(hex.trim());
  if (!match?.[1]) return null;
  const raw = match[1];
  const red = Number.parseInt(raw.slice(0, 2), 16);
  const green = Number.parseInt(raw.slice(2, 4), 16);
  const blue = Number.parseInt(raw.slice(4, 6), 16);
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

export function contrastRatio(foreground: string, background: string): number | null {
  const a = luminance(foreground);
  const b = luminance(background);
  if (a === null || b === null) return null;
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const pairs: Array<[string, keyof ThemeColors, keyof ThemeColors, number?]> = [
  ["foreground/background", "foreground", "background"],
  ["primary", "primaryForeground", "primary"],
  ["secondary", "secondaryForeground", "secondary"],
  ["muted", "mutedForeground", "muted"],
  ["destructive", "destructiveForeground", "destructive"],
  ["success", "successForeground", "success"],
  ["focus/background", "focus", "background"],
  ["link/background", "link", "background"],
  ["border/background", "border", "background", 3]
];

export function checkThemeContrast(config: SuperSystemConfig): ContrastResult[] {
  const defaultRequired = config.accessibility.contrast === "AAA" ? 7 : 4.5;
  return (["light", "dark"] as const).flatMap((theme) =>
    pairs.map(([pair, foregroundKey, backgroundKey, pairRequired]) => {
      const foreground = config.themes[theme][foregroundKey];
      const background = config.themes[theme][backgroundKey];
      const ratio = contrastRatio(foreground, background) ?? 0;
      const required = pairRequired ?? defaultRequired;
      return {
        theme,
        pair,
        foreground,
        background,
        ratio: Math.round(ratio * 100) / 100,
        required,
        passes: ratio >= required
      };
    })
  );
}
