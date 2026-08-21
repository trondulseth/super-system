import type { MigrationPlanItem } from "./migration.js";
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

function ensureButtonImport(content: string): string {
  if (/import\s+\{[^}]*\bButton\b[^}]*\}\s+from\s+["']@super-system\/react["']/.test(content)) {
    return content;
  }

  const existing = content.match(/import\s+\{([^}]+)\}\s+from\s+["']@super-system\/react["']/);
  if (existing?.[1]) {
    const names = existing[1]
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (!names.includes("Button")) names.push("Button");
    return content.replace(existing[0], `import { ${names.join(", ")} } from "@super-system/react"`);
  }

  const { eol, lines } = splitLines(content);
  const useDirective = lines[0]?.match(/^["']use (?:client|server)["'];?$/);
  const insertAt = useDirective ? 1 : 0;
  lines.splice(insertAt, 0, 'import { Button } from "@super-system/react";');
  return joinLines(lines, eol);
}

export function transformNativeButtonToButton(content: string, item: MigrationPlanItem): TransformResult | null {
  const { eol, lines } = splitLines(content);
  const index = item.line - 1;
  const line = lines[index];
  if (!line || !/<button\b/i.test(line) || /<Button\b/.test(line)) return null;

  const updated = line.replace(/<button\b/gi, "<Button").replace(/<\/button>/gi, "</Button>");
  if (updated === line) return null;

  lines[index] = updated;
  return {
    content: joinLines(lines, eol),
    description: "Replaced native <button> with <Button>"
  };
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
  return ensureButtonImport(content);
}

export const transforms: Record<string, TransformFn> = {
  "img-add-alt": transformImgAddAlt,
  "token-replace-color": transformTokenReplaceColor,
  "native-button-to-button": transformNativeButtonToButton
};

export function applyTransform(
  transformId: string,
  content: string,
  item: MigrationPlanItem
): TransformResult | null {
  return transforms[transformId]?.(content, item) ?? null;
}
