import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { compileTheme, defaultTheme, validateConfig, type SuperSystemConfig } from "@super-system/tokens";

export const configName = "super-system.json";
export const generatedDir = ".super-system";
export const cssName = "theme.css";

export async function readConfig(cwd: string): Promise<SuperSystemConfig> {
  const raw = await readFile(path.join(cwd, configName), "utf8");
  return validateConfig(JSON.parse(raw));
}

export async function writeConfig(cwd: string, config: SuperSystemConfig): Promise<void> {
  await writeFile(path.join(cwd, configName), `${JSON.stringify(config, null, 2)}\n`, "utf8");
  await writeGeneratedCss(cwd, config);
}

export async function writeGeneratedCss(cwd: string, config: SuperSystemConfig): Promise<string> {
  const dir = path.join(cwd, generatedDir);
  await mkdir(dir, { recursive: true });
  const target = path.join(dir, cssName);
  await writeFile(target, compileTheme(config), "utf8");
  return target;
}

export async function initialize(cwd: string, force = false): Promise<void> {
  const target = path.join(cwd, configName);
  if (!force) {
    try {
      await readFile(target, "utf8");
      throw new Error(`${configName} already exists. Use --force to replace it.`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) throw error;
    }
  }
  await writeConfig(cwd, structuredClone(defaultTheme));
}
