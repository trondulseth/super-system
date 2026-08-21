import type { MigrationSelection } from "./migration-manifest.js";

export interface MigrationCliOptions {
  cwd: string;
  json: boolean;
  manifestPath?: string;
  writeManifest: boolean;
  selection: MigrationSelection;
  verify: boolean;
  dryRun: boolean;
  allowDirty: boolean;
}

function readFlagValues(args: string[], flag: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index++) {
    if (args[index] === flag && args[index + 1]) {
      values.push(args[index + 1]!);
      index++;
    }
  }
  return values;
}

export function parseMigrationCliOptions(args: string[], defaults: Partial<MigrationCliOptions> = {}): MigrationCliOptions {
  const cwdFlag = args.indexOf("--cwd");
  const outFlag = args.indexOf("--out");
  const manifestFlag = args.indexOf("--manifest");

  return {
    cwd: cwdFlag >= 0 && args[cwdFlag + 1] ? args[cwdFlag + 1]! : defaults.cwd ?? process.cwd(),
    json: args.includes("--json"),
    manifestPath:
      outFlag >= 0 && args[outFlag + 1]
        ? args[outFlag + 1]
        : manifestFlag >= 0 && args[manifestFlag + 1]
          ? args[manifestFlag + 1]
          : defaults.manifestPath,
    writeManifest: args.includes("--out") || args.includes("--write-manifest"),
    selection: {
      onlyTransforms: readFlagValues(args, "--only"),
      skipTransforms: readFlagValues(args, "--skip"),
      skipRules: readFlagValues(args, "--skip-rule")
    },
    verify: args.includes("--verify"),
    dryRun: args.includes("--dry-run"),
    allowDirty: args.includes("--allow-dirty")
  };
}
