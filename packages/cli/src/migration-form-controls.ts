import { isTextLikeNativeInputType } from "@super-system/rules";

export function canTransformNativeInput(line: string): boolean {
  if (!/<input\b/.test(line) || /<Input\b/.test(line)) return false;

  const typeMatch = line.match(/\btype\s*=\s*["'{]([^"'}]+)["'}]/i);
  if (!typeMatch) return true;

  return isTextLikeNativeInputType(typeMatch[1]);
}

export function canTransformNativeTextarea(line: string): boolean {
  return /<textarea\b/.test(line) && !/<Textarea\b/.test(line);
}

export function canTransformNativeSelect(line: string): boolean {
  return /<select\b/.test(line) && !/<Select\b/.test(line);
}

export function replaceNativeInput(line: string): string {
  return line.replace(/<input\b/g, "<Input").replace(/<\/input>/gi, "</Input>");
}

export function replaceNativeTextarea(line: string): string {
  return line.replace(/<textarea\b/g, "<Textarea").replace(/<\/textarea>/gi, "</Textarea>");
}

export function replaceNativeSelect(line: string): string {
  return line.replace(/<select\b/g, "<Select").replace(/<\/select>/gi, "</Select>");
}
