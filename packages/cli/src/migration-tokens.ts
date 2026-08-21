import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  defaultTheme,
  validateConfig,
  type SuperSystemConfig,
  type ThemeColors
} from "../../tokens/src/index.js";

const configName = "super-system.json";

export interface ColorLiteral {
  raw: string;
  normalized: string;
  start: number;
  end: number;
}

export interface TokenReplacement {
  literal: string;
  token: string;
  cssVar: string;
}

function kebab(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function expandHex(value: string): string | null {
  const match = value.match(/^#([0-9a-f]{3,8})$/i);
  if (!match) return null;
  const hex = match[1]!.toLowerCase();
  if (hex.length === 3 || hex.length === 4) {
    return `#${hex
      .slice(0, 3)
      .split("")
      .map((char) => char + char)
      .join("")}`;
  }
  if (hex.length === 6) return `#${hex}`;
  if (hex.length === 8) return `#${hex.slice(0, 6)}`;
  return null;
}

function rgbToHex(red: number, green: number, blue: number): string {
  const channel = (value: number) => value.toString(16).padStart(2, "0");
  return `#${channel(red)}${channel(green)}${channel(blue)}`;
}

export function normalizeColor(value: string): string | null {
  const trimmed = value.trim();
  const hex = expandHex(trimmed);
  if (hex) return hex;

  const rgb = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+\s*)?\)$/i);
  if (!rgb) return null;

  const channels = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  if (channels.some((channel) => channel < 0 || channel > 255)) return null;
  return rgbToHex(channels[0]!, channels[1]!, channels[2]!);
}

export function buildColorTokenIndex(config: SuperSystemConfig): Map<string, string> {
  const occurrences = new Map<string, Set<string>>();

  for (const mode of ["light", "dark"] as const) {
    const colors: ThemeColors = { ...defaultTheme.themes[mode], ...config.themes[mode] };
    for (const [token, literal] of Object.entries(colors)) {
      const normalized = normalizeColor(literal);
      if (!normalized) continue;
      const names = occurrences.get(normalized) ?? new Set<string>();
      names.add(token);
      occurrences.set(normalized, names);
    }
  }

  const index = new Map<string, string>();
  for (const [color, tokens] of occurrences) {
    if (tokens.size === 1) index.set(color, [...tokens][0]!);
  }
  return index;
}

export async function loadColorTokenIndex(cwd: string): Promise<Map<string, string>> {
  try {
    const raw = await readFile(path.join(cwd, configName), "utf8");
    return buildColorTokenIndex(validateConfig(JSON.parse(raw)));
  } catch {
    return buildColorTokenIndex(defaultTheme);
  }
}

export function findColorLiterals(line: string): ColorLiteral[] {
  const literals: ColorLiteral[] = [];
  const hexPattern = /#(?:[0-9a-f]{3,8})\b/gi;
  const rgbPattern = /rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*[\d.]+\s*)?\)/gi;

  for (const pattern of [hexPattern, rgbPattern]) {
    for (const match of line.matchAll(pattern)) {
      const raw = match[0];
      const normalized = normalizeColor(raw);
      if (!normalized) continue;
      literals.push({
        raw,
        normalized,
        start: match.index ?? 0,
        end: (match.index ?? 0) + raw.length
      });
    }
  }

  return literals.sort((left, right) => left.start - right.start);
}

export function resolveTokenReplacements(
  line: string,
  tokenIndex: Map<string, string>
): TokenReplacement[] {
  const seen = new Set<string>();
  const replacements: TokenReplacement[] = [];

  for (const literal of findColorLiterals(line)) {
    if (seen.has(literal.normalized)) continue;
    const token = tokenIndex.get(literal.normalized);
    if (!token) continue;
    seen.add(literal.normalized);
    replacements.push({
      literal: literal.raw,
      token,
      cssVar: `var(--ss-color-${kebab(token)})`
    });
  }

  return replacements;
}

export function applyColorTokenReplacements(line: string, replacements: TokenReplacement[]): string {
  let updated = line;
  for (const replacement of replacements) {
    updated = updated.replaceAll(replacement.literal, replacement.cssVar);
  }
  return updated;
}
