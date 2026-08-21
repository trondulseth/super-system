const UNSAFE_INPUT_TYPES = new Set([
  "button",
  "checkbox",
  "file",
  "hidden",
  "image",
  "radio",
  "reset",
  "submit"
]);

export function canTransformNativeInput(line: string): boolean {
  if (!/<input\b/i.test(line) || /<Input\b/.test(line)) return false;

  const typeMatch = line.match(/\btype\s*=\s*["'{]([^"'}]+)["'}]/i);
  if (!typeMatch) return true;

  return !UNSAFE_INPUT_TYPES.has(typeMatch[1]!.toLowerCase());
}

export function canTransformNativeTextarea(line: string): boolean {
  return /<textarea\b/i.test(line) && !/<Textarea\b/.test(line);
}

export function canTransformNativeSelect(line: string): boolean {
  return /<select\b/i.test(line) && !/<Select\b/.test(line);
}

export function replaceNativeInput(line: string): string {
  return line.replace(/<input\b/gi, "<Input").replace(/<\/input>/gi, "</Input>");
}

export function replaceNativeTextarea(line: string): string {
  return line.replace(/<textarea\b/gi, "<Textarea").replace(/<\/textarea>/gi, "</Textarea>");
}

export function replaceNativeSelect(line: string): string {
  return line.replace(/<select\b/gi, "<Select").replace(/<\/select>/gi, "</Select>");
}
