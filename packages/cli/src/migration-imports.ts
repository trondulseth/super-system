function splitLines(content: string): { eol: "\n" | "\r\n"; lines: string[] } {
  const eol = content.includes("\r\n") ? "\r\n" : "\n";
  return { eol, lines: content.split(/\r?\n/) };
}

function joinLines(lines: string[], eol: "\n" | "\r\n"): string {
  return lines.join(eol);
}

export function finalizeComponentImports(content: string, components: string[]): string {
  const unique = [...new Set(components)].sort();
  if (unique.length === 0) return content;

  let updated = content;
  const existing = updated.match(/import\s+\{([^}]+)\}\s+from\s+["']@super-system\/react["']/);
  if (existing?.[1]) {
    const names = existing[1]
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    for (const component of unique) {
      if (!names.includes(component)) names.push(component);
    }
    names.sort();
    return updated.replace(existing[0], `import { ${names.join(", ")} } from "@super-system/react"`);
  }

  const { eol, lines } = splitLines(updated);
  const useDirective = lines[0]?.match(/^["']use (?:client|server)["'];?$/);
  const insertAt = useDirective ? 1 : 0;
  lines.splice(insertAt, 0, `import { ${unique.join(", ")} } from "@super-system/react";`);
  return joinLines(lines, eol);
}

export const transformComponentImports: Record<string, string> = {
  "native-button-to-button": "Button",
  "native-input-to-input": "Input",
  "native-textarea-to-textarea": "Textarea",
  "native-select-to-select": "Select"
};
