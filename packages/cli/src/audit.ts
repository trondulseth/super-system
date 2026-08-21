import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { migrationRules } from "./migration-rules.js";

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

export async function auditProject(cwd: string): Promise<Finding[]> {
  const files = await collect(cwd);
  const findings: Finding[] = [];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    content.split(/\r?\n/).forEach((line, index) => {
      for (const rule of migrationRules) {
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
