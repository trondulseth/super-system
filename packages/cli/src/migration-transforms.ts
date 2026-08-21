import type { MigrationPlanItem } from "./migration.js";
import {
  canTransformNativeInput,
  canTransformNativeSelect,
  canTransformNativeTextarea,
  replaceNativeInput,
  replaceNativeSelect,
  replaceNativeTextarea
} from "./migration-form-controls.js";
import { finalizeComponentImports } from "./migration-imports.js";
import { applyColorTokenReplacements } from "./migration-tokens.js";

export interface TransformResult {
  content: string;
  description: string;
}

export type TransformFn = (content: string, item: MigrationPlanItem) => TransformResult | null;

function splitLines(content: string): { eol: "\n" | "\r\n"; lines: string[] } {
  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  return { eol, lines: content.split(/\r?\n/) };
}

function joinLines(lines: string[], eol: "\n" | "\r\n"): string {
  return lines.join(eol);
}

function replaceLine(
  content: string,
  item: MigrationPlanItem,
  replace: (line: string) => string,
  description: string
): TransformResult | null {
  const { eol, lines } = splitLines(content);
  const index = item.line - 1;
  const line = lines[index];
  if (!line) return null;

  const updated = replace(line);
  if (updated === line) return null;

  lines[index] = updated;
  return {
    content: joinLines(lines, eol),
    description
  };
}

export function transformImgAddAlt(content: string, item: MigrationPlanItem): TransformResult | null {
  const { eol, lines } = splitLines(content);
  const index = item.line - 1;
  const line = lines[index];
  if (!line || !/<img\b/i.test(line) || /\balt\s*=/.test(line)) return null;

  const updated = line.replace(/(<img\b[^>]*?)(\s*\/?>)/i, '$1 alt=""$2');
  if (updated === line) return null;

  lines[index] = updated;
  return {
    content: joinLines(lines, eol),
    description: 'Added alt="" to img element'
  };
}

export function transformNativeButtonToButton(content: string, item: MigrationPlanItem): TransformResult | null {
  return replaceLine(
    content,
    item,
    (line) => {
      if (!/<button\b/i.test(line) || /<Button\b/.test(line)) return line;
      return line.replace(/<button\b/gi, "<Button").replace(/<\/button>/gi, "</Button>");
    },
    "Replaced native <button> with <Button>"
  );
}

export function transformNativeInputToInput(content: string, item: MigrationPlanItem): TransformResult | null {
  return replaceLine(
    content,
    item,
    (line) => (canTransformNativeInput(line) ? replaceNativeInput(line) : line),
    "Replaced native <input> with <Input>"
  );
}

export function transformNativeTextareaToTextarea(content: string, item: MigrationPlanItem): TransformResult | null {
  return replaceLine(
    content,
    item,
    (line) => (canTransformNativeTextarea(line) ? replaceNativeTextarea(line) : line),
    "Replaced native <textarea> with <Textarea>"
  );
}

export function transformNativeSelectToSelect(content: string, item: MigrationPlanItem): TransformResult | null {
  return replaceLine(
    content,
    item,
    (line) => (canTransformNativeSelect(line) ? replaceNativeSelect(line) : line),
    "Replaced native <select> with <Select>"
  );
}

export function transformTokenReplaceColor(content: string, item: MigrationPlanItem): TransformResult | null {
  if (!item.tokenReplacements?.length) return null;

  const { eol, lines } = splitLines(content);
  const index = item.line - 1;
  const line = lines[index];
  if (!line) return null;

  const updated = applyColorTokenReplacements(line, item.tokenReplacements);
  if (updated === line) return null;

  lines[index] = updated;
  return {
    content: joinLines(lines, eol),
    description: `Replaced ${item.tokenReplacements.map((replacement) => replacement.literal).join(", ")} with semantic token variable(s)`
  };
}

export function finalizeButtonImport(content: string): string {
  return finalizeComponentImports(content, ["Button"]);
}

export { finalizeComponentImports };

export const transforms: Record<string, TransformFn> = {
  "img-add-alt": transformImgAddAlt,
  "token-replace-color": transformTokenReplaceColor,
  "native-button-to-button": transformNativeButtonToButton,
  "native-input-to-input": transformNativeInputToInput,
  "native-textarea-to-textarea": transformNativeTextareaToTextarea,
  "native-select-to-select": transformNativeSelectToSelect
};

export function applyTransform(
  transformId: string,
  content: string,
  item: MigrationPlanItem
): TransformResult | null {
  return transforms[transformId]?.(content, item) ?? null;
}

export {
  canTransformNativeInput,
  canTransformNativeSelect,
  canTransformNativeTextarea
} from "./migration-form-controls.js";
