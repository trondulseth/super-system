import type { SuperSystemConfig } from "@super-system/tokens";

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
  "focus"
] as const;

export type FormColorId = (typeof FORM_COLOR_IDS)[number];

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

export function applyConfigToForm(
  config: SuperSystemConfig,
  preview: "light" | "dark",
  root: ParentNode = document
): void {
  const theme = config.themes[preview];

  for (const id of FORM_COLOR_IDS) {
    const value = theme[id];
    getInput(id, root).value = value;
    getInput(`${id}Hex`, root).value = value;
  }

  getInput("fontSans", root).value = config.typography.fontSans;
  getInput("fontMono", root).value = config.typography.fontMono;
  getInput("baseSize", root).value = config.typography.baseSize;
  getInput("lineHeight", root).value = String(config.typography.lineHeight);
  getInput("radiusSm", root).value = config.radius.sm;
  getInput("radiusMd", root).value = config.radius.md;
  getInput("radiusLg", root).value = config.radius.lg;
  getInput("radiusFull", root).value = config.radius.full;
  getInput("spacingUnit", root).value = String(config.spacing.unit);
  getSelect("density", root).value = config.spacing.density;
  getSelect("icons", root).value = config.icons.library;
  getSelect("contrast", root).value = config.accessibility.contrast;
  getInput("target", root).value = String(config.accessibility.minimumTargetSize);
  getSelect("modeDefault", root).value = config.mode.default;
  getInput("reducedMotion", root).checked = config.accessibility.reducedMotion;
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
  next.typography.baseSize = getInput("baseSize", root).value;
  next.typography.lineHeight = Number(getInput("lineHeight", root).value);
  next.radius.sm = getInput("radiusSm", root).value;
  next.radius.md = getInput("radiusMd", root).value;
  next.radius.lg = getInput("radiusLg", root).value;
  next.radius.full = getInput("radiusFull", root).value;
  next.spacing.unit = Number(getInput("spacingUnit", root).value);
  next.spacing.density = getSelect("density", root).value as SuperSystemConfig["spacing"]["density"];
  next.icons.library = getSelect("icons", root).value as SuperSystemConfig["icons"]["library"];
  next.accessibility.contrast = getSelect("contrast", root).value as SuperSystemConfig["accessibility"]["contrast"];
  next.accessibility.minimumTargetSize = Number(getInput("target", root).value);
  next.mode.default = getSelect("modeDefault", root).value as SuperSystemConfig["mode"]["default"];
  next.accessibility.reducedMotion = getInput("reducedMotion", root).checked;

  return next;
}

export function validateStudioForm(root: ParentNode = document): string | null {
  const lineHeight = Number(getInput("lineHeight", root).value);
  if (!Number.isFinite(lineHeight) || lineHeight < 1.1 || lineHeight > 2) {
    return "Line height must be between 1.1 and 2.";
  }

  const target = Number(getInput("target", root).value);
  if (!Number.isFinite(target) || target < 24 || target > 64) {
    return "Minimum target must be between 24 and 64.";
  }

  const unit = Number(getInput("spacingUnit", root).value);
  if (!Number.isFinite(unit) || unit < 2 || unit > 8) {
    return "Spacing unit must be between 2 and 8.";
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
