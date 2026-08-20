import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export interface Finding {
  rule: string;
  file: string;
  line: number;
  message: string;
}

const extensions = new Set([".tsx", ".jsx", ".ts", ".js", ".css", ".scss", ".html", ".vue", ".svelte"]);
const ignored = new Set(["node_modules", ".git", "dist", "build", ".next", ".super-system"]);

async function collect(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.flatMap(async (entry) => {
    if (ignored.has(entry.name)) return [];
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collect(target);
    return extensions.has(path.extname(entry.name)) ? [target] : [];
  }));
  return nested.flat();
}

const rules = [
  { rule: "raw-button", pattern: /<button\b/i, message: "Use the shared Button component." },
  { rule: "raw-input", pattern: /<(input|select|textarea)\b/i, message: "Use a shared form component where possible." },
  { rule: "hardcoded-color", pattern: /#[0-9a-f]{3,8}\b|rgba?\s*\(/i, message: "Replace hardcoded color with a semantic token." },
  { rule: "arbitrary-spacing", pattern: /(?:p|m|gap|space-[xy])-[trblxy]?\[[^\]]+\]/i, message: "Use the shared spacing scale." },
  { rule: "inline-style", pattern: /\bstyle\s*=\s*\{\{/i, message: "Prefer a design-system component or tokenized class." },
  { rule: "image-alt", pattern: /<img\b(?![^>]*\balt=)/i, message: "Add meaningful alt text or alt=\"\" for decorative images." }
] as const;

export async function auditProject(cwd: string): Promise<Finding[]> {
  const files = await collect(cwd);
  const findings: Finding[] = [];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    content.split(/\r?\n/).forEach((line, index) => {
      for (const rule of rules) {
        if (rule.pattern.test(line)) {
          findings.push({
            rule: rule.rule,
            file: path.relative(cwd, file),
            line: index + 1,
            message: rule.message
          });
        }
      }
    });
  }
  return findings;
}
