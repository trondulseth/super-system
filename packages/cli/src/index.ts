#!/usr/bin/env node
import { checkThemeContrast } from "@super-system/tokens";
import { auditProject } from "./audit.js";
import { initialize, readConfig, writeGeneratedCss } from "./files.js";
import { startStudio } from "./studio.js";

const [command = "help", ...args] = process.argv.slice(2);
const cwdFlag = args.indexOf("--cwd");
const cwd = cwdFlag >= 0 && args[cwdFlag + 1] ? args[cwdFlag + 1]! : process.cwd();

function help(): void {
  console.log(`Super System

Usage:
  super-system init [--force] [--cwd path]
  super-system studio [--port 4173] [--no-open] [--cwd path]
  super-system audit [--json] [--cwd path]
  super-system build-theme [--cwd path]
  super-system check-contrast [--cwd path]
`);
}

async function main(): Promise<void> {
  switch (command) {
    case "init":
      await initialize(cwd, args.includes("--force"));
      console.log("Created super-system.json and .super-system/theme.css");
      console.log('Import "./.super-system/theme.css" and "@super-system/react/styles.css" in your app.');
      break;
    case "studio": {
      const portFlag = args.indexOf("--port");
      const port = portFlag >= 0 ? Number(args[portFlag + 1]) : 4173;
      await startStudio(cwd, port, !args.includes("--no-open"));
      break;
    }
    case "audit": {
      const findings = await auditProject(cwd);
      if (args.includes("--json")) console.log(JSON.stringify(findings, null, 2));
      else if (findings.length === 0) console.log("No design-system violations found.");
      else {
        console.log(`Found ${findings.length} potential design-system violations:\n`);
        findings.forEach((finding) => console.log(`${finding.file}:${finding.line}  ${finding.rule}  ${finding.message}`));
      }
      process.exitCode = findings.length > 0 ? 1 : 0;
      break;
    }
    case "build-theme": {
      const target = await writeGeneratedCss(cwd, await readConfig(cwd));
      console.log(`Generated ${target}`);
      break;
    }
    case "check-contrast": {
      const results = checkThemeContrast(await readConfig(cwd));
      results.forEach((result) => console.log(`${result.passes ? "PASS" : "FAIL"} ${result.theme}/${result.pair}: ${result.ratio}:1`));
      process.exitCode = results.some((result) => !result.passes) ? 1 : 0;
      break;
    }
    default:
      help();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
