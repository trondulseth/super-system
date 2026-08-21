import { defaultTheme, type SuperSystemConfig } from "@super-system/tokens";

export const FORM_COLOR_IDS = [
  "primary",
  "primaryForeground",
  "background",
  "foreground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "border",
  "destructive",
  "destructiveForeground",
  "success",
  "successForeground",
  "focus",
  "link",
  "linkHover"
] as const;

export type FormColorId = (typeof FORM_COLOR_IDS)[number];

const DEFAULT_SHADOW_STRENGTH = 6;
const DEFAULT_SHADOW_HOVER_STRENGTH = 10;

const SHADOW_STRENGTH_RE = /color-mix\(in srgb, var\(--ss-color-foreground\) (\d+(?:\.\d+)?)%, transparent\)/;

const SLIDER_FIELDS = [
  { id: "lineHeight", format: (value: string) => value },
  { id: "headingLineHeight", format: (value: string) => value },
  { id: "spacingUnit", format: (value: string) => value },
  { id: "target", format: (value: string) => `${value}px` },
  { id: "baseSize", format: (value: string) => `${value}px` },
  { id: "radiusSm", format: (value: string) => `${value}px` },
  { id: "radiusMd", format: (value: string) => `${value}px` },
  { id: "radiusLg", format: (value: string) => `${value}px` },
  { id: "gradientTint", format: (value: string) => `${value}%` },
  { id: "gradientAngle", format: (value: string) => `${value}°` },
  { id: "shadowStrength", format: (value: string) => `${value}%` },
  { id: "shadowHoverStrength", format: (value: string) => `${value}%` },
  { id: "lift", format: (value: string) => `${value}px` },
  { id: "scaleH1", format: (value: string) => `${value}rem` },
  { id: "scaleH2", format: (value: string) => `${value}rem` },
  { id: "scaleH3", format: (value: string) => `${value}rem` },
  { id: "scaleH4", format: (value: string) => `${value}rem` },
  { id: "scaleLead", format: (value: string) => `${value}rem` },
  { id: "scaleSmall", format: (value: string) => `${value}rem` }
] as const;

function getInput(id: string, root: ParentNode = document): HTMLInputElement {
  const element = root.querySelector<HTMLInputElement>(`#${id}`);
  if (!element) throw new Error(`Missing form control #${id}`);
  return element;
}

function getSelect(id: string, root: ParentNode = document): HTMLSelectElement {
  const element = root.querySelector<HTMLSelectElement>(`#${id}`);
  if (!element) throw new Error(`Missing form control #${id}`);
  return element;
}

export function parsePx(value: string): number {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)px$/);
  return match ? Number(match[1]) : Number(value);
}

export function formatPx(value: number): string {
  return `${value}px`;
}

export function parseRem(value: string): number {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)rem$/);
  return match ? Number(match[1]) : Number(value);
}

export function formatRem(value: number): string {
  return `${value}rem`;
}

export function parseShadowStrength(shadow: string, fallback: number): number {
  const match = shadow.match(SHADOW_STRENGTH_RE);
  return match ? Number(match[1]) : fallback;
}

export function buildElevationShadow(strength: number): string {
  return `0 1px 2px color-mix(in srgb, var(--ss-color-foreground) ${strength}%, transparent)`;
}

export function buildElevationShadowHover(strength: number): string {
  return `0 10px 24px color-mix(in srgb, var(--ss-color-foreground) ${strength}%, transparent)`;
}

export function syncSliderDisplays(root: ParentNode = document): void {
  for (const field of SLIDER_FIELDS) {
    const slider = root.querySelector<HTMLInputElement>(`#${field.id}`);
    const output = root.querySelector<HTMLOutputElement>(`output[for="${field.id}"]`);
    if (!slider || !output) continue;
    output.textContent = field.format(slider.value);
  }
}

export function applyConfigToForm(
  config: SuperSystemConfig,
  preview: "light" | "dark",
  root: ParentNode = document
): void {
  const theme = { ...defaultTheme.themes[preview], ...config.themes[preview] };
  const surfaces = { ...defaultTheme.surfaces, ...config.surfaces };
  const elevation = { ...defaultTheme.elevation, ...config.elevation };
  const scale = { ...defaultTheme.typography.scale, ...config.typography.scale };
  const weight = { ...defaultTheme.typography.weight, ...config.typography.weight };

  for (const id of FORM_COLOR_IDS) {
    const value = theme[id];
    getInput(id, root).value = value;
    getInput(`${id}Hex`, root).value = value;
  }

  getInput("fontSans", root).value = config.typography.fontSans;
  getInput("fontMono", root).value = config.typography.fontMono;
  getInput("baseSize", root).value = String(parsePx(config.typography.baseSize));
  getInput("lineHeight", root).value = String(config.typography.lineHeight);
  getInput("headingLineHeight", root).value = String(
    config.typography.headingLineHeight ?? defaultTheme.typography.headingLineHeight
  );
  getInput("scaleH1", root).value = String(parseRem(scale.h1));
  getInput("scaleH2", root).value = String(parseRem(scale.h2));
  getInput("scaleH3", root).value = String(parseRem(scale.h3));
  getInput("scaleH4", root).value = String(parseRem(scale.h4));
  getInput("scaleLead", root).value = String(parseRem(scale.lead));
  getInput("scaleSmall", root).value = String(parseRem(scale.small));
  getSelect("weightHeading", root).value = String(weight.heading);
  getSelect("weightBody", root).value = String(weight.body);
  getSelect("weightStrong", root).value = String(weight.strong);
  getInput("gradientTint", root).value = String(surfaces.gradientTint);
  getInput("gradientAngle", root).value = String(surfaces.gradientAngle);
  getInput("shadowStrength", root).value = String(
    parseShadowStrength(elevation.shadow, DEFAULT_SHADOW_STRENGTH)
  );
  getInput("shadowHoverStrength", root).value = String(
    parseShadowStrength(elevation.shadowHover, DEFAULT_SHADOW_HOVER_STRENGTH)
  );
  getInput("lift", root).value = String(parsePx(elevation.lift));
  getInput("radiusSm", root).value = String(parsePx(config.radius.sm));
  getInput("radiusMd", root).value = String(parsePx(config.radius.md));
  getInput("radiusLg", root).value = String(parsePx(config.radius.lg));
  getInput("radiusFull", root).value = config.radius.full;
  getInput("spacingUnit", root).value = String(config.spacing.unit);
  getSelect("density", root).value = config.spacing.density;
  getSelect("icons", root).value = config.icons.library;
  getSelect("contrast", root).value = config.accessibility.contrast;
  getInput("target", root).value = String(config.accessibility.minimumTargetSize);
  getSelect("modeDefault", root).value = config.mode.default;
  getInput("reducedMotion", root).checked = config.accessibility.reducedMotion;

  syncSliderDisplays(root);
}

export function readConfigFromForm(
  config: SuperSystemConfig,
  preview: "light" | "dark",
  root: ParentNode = document
): SuperSystemConfig {
  const next = structuredClone(config);
  const theme = next.themes[preview];

  for (const id of FORM_COLOR_IDS) {
    const value = getInput(id, root).value;
    theme[id] = value;
    getInput(`${id}Hex`, root).value = value;
  }

  next.typography.fontSans = getInput("fontSans", root).value;
  next.typography.fontMono = getInput("fontMono", root).value;
  next.typography.baseSize = formatPx(Number(getInput("baseSize", root).value));
  next.typography.lineHeight = Number(getInput("lineHeight", root).value);
  next.typography.headingLineHeight = Number(getInput("headingLineHeight", root).value);
  next.typography.scale = {
    h1: formatRem(Number(getInput("scaleH1", root).value)),
    h2: formatRem(Number(getInput("scaleH2", root).value)),
    h3: formatRem(Number(getInput("scaleH3", root).value)),
    h4: formatRem(Number(getInput("scaleH4", root).value)),
    lead: formatRem(Number(getInput("scaleLead", root).value)),
    body: next.typography.baseSize,
    small: formatRem(Number(getInput("scaleSmall", root).value))
  };
  next.typography.weight = {
    heading: Number(getSelect("weightHeading", root).value),
    body: Number(getSelect("weightBody", root).value),
    strong: Number(getSelect("weightStrong", root).value)
  };
  next.surfaces = {
    gradientTint: Number(getInput("gradientTint", root).value),
    gradientAngle: Number(getInput("gradientAngle", root).value)
  };
  const shadowStrength = Number(getInput("shadowStrength", root).value);
  const shadowHoverStrength = Number(getInput("shadowHoverStrength", root).value);
  next.elevation = {
    shadow: buildElevationShadow(shadowStrength),
    shadowHover: buildElevationShadowHover(shadowHoverStrength),
    lift: formatPx(Number(getInput("lift", root).value))
  };
  next.radius.sm = formatPx(Number(getInput("radiusSm", root).value));
  next.radius.md = formatPx(Number(getInput("radiusMd", root).value));
  next.radius.lg = formatPx(Number(getInput("radiusLg", root).value));
  next.radius.full = getInput("radiusFull", root).value;
  next.spacing.unit = Number(getInput("spacingUnit", root).value);
  next.spacing.density = getSelect("density", root).value as SuperSystemConfig["spacing"]["density"];
  next.icons.library = getSelect("icons", root).value as SuperSystemConfig["icons"]["library"];
  next.accessibility.contrast = getSelect("contrast", root).value as SuperSystemConfig["accessibility"]["contrast"];
  next.accessibility.minimumTargetSize = Number(getInput("target", root).value);
  next.mode.default = getSelect("modeDefault", root).value as SuperSystemConfig["mode"]["default"];
  next.accessibility.reducedMotion = getInput("reducedMotion", root).checked;

  syncSliderDisplays(root);

  return next;
}

export function validateStudioForm(root: ParentNode = document): string | null {
  const lineHeight = Number(getInput("lineHeight", root).value);
  if (!Number.isFinite(lineHeight) || lineHeight < 1.1 || lineHeight > 2) {
    return "Line height must be between 1.1 and 2.";
  }

  const headingLineHeight = Number(getInput("headingLineHeight", root).value);
  if (!Number.isFinite(headingLineHeight) || headingLineHeight < 1 || headingLineHeight > 1.6) {
    return "Heading line height must be between 1 and 1.6.";
  }

  const target = Number(getInput("target", root).value);
  if (!Number.isFinite(target) || target < 24 || target > 64) {
    return "Minimum target must be between 24 and 64.";
  }

  const unit = Number(getInput("spacingUnit", root).value);
  if (!Number.isFinite(unit) || unit < 2 || unit > 8) {
    return "Spacing unit must be between 2 and 8.";
  }

  const baseSize = Number(getInput("baseSize", root).value);
  if (!Number.isFinite(baseSize) || baseSize < 12 || baseSize > 24) {
    return "Base size must be between 12 and 24 px.";
  }

  for (const id of ["radiusSm", "radiusMd", "radiusLg"] as const) {
    const radius = Number(getInput(id, root).value);
    if (!Number.isFinite(radius) || radius < 0 || radius > 24) {
      return "Radius values must be between 0 and 24 px.";
    }
  }

  const gradientTint = Number(getInput("gradientTint", root).value);
  if (!Number.isFinite(gradientTint) || gradientTint < 0 || gradientTint > 15) {
    return "Surface gradient tint must be between 0 and 15%.";
  }

  const gradientAngle = Number(getInput("gradientAngle", root).value);
  if (!Number.isFinite(gradientAngle) || gradientAngle < 0 || gradientAngle > 360) {
    return "Surface gradient angle must be between 0 and 360°.";
  }

  for (const id of ["shadowStrength", "shadowHoverStrength"] as const) {
    const strength = Number(getInput(id, root).value);
    if (!Number.isFinite(strength) || strength < 0 || strength > 30) {
      return "Shadow strength must be between 0 and 30%.";
    }
  }

  const lift = Number(getInput("lift", root).value);
  if (!Number.isFinite(lift) || lift < 0 || lift > 8) {
    return "Elevation lift must be between 0 and 8 px.";
  }

  for (const [id, min, max] of [
    ["scaleH1", 1.5, 3.5],
    ["scaleH2", 1.25, 3],
    ["scaleH3", 1, 2.5],
    ["scaleH4", 0.875, 2],
    ["scaleLead", 1, 1.5],
    ["scaleSmall", 0.625, 1]
  ] as const) {
    const size = Number(getInput(id, root).value);
    if (!Number.isFinite(size) || size < min || size > max) {
      return `${id.replace("scale", "Type scale ")} must be between ${min} and ${max} rem.`;
    }
  }

  for (const id of ["weightHeading", "weightBody", "weightStrong"] as const) {
    const weight = Number(getSelect(id, root).value);
    if (!Number.isFinite(weight) || weight < 300 || weight > 800 || weight % 100 !== 0) {
      return "Font weights must be between 300 and 800 in steps of 100.";
    }
  }

  for (const id of FORM_COLOR_IDS) {
    const hex = getInput(`${id}Hex`, root).value.trim();
    if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      return `${id} must be a valid hex color.`;
    }
  }

  return null;
}

export function syncColorPickerFromHex(colorId: FormColorId, root: ParentNode = document): boolean {
  const hexInput = getInput(`${colorId}Hex`, root);
  const picker = getInput(colorId, root);
  if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput.value.trim())) {
    hexInput.value = picker.value;
    return false;
  }

  picker.value = hexInput.value.trim();
  return true;
}

export function syncHexFromColorPicker(colorId: FormColorId, root: ParentNode = document): void {
  const picker = getInput(colorId, root);
  getInput(`${colorId}Hex`, root).value = picker.value;
}
