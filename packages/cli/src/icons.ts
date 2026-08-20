import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readConfig } from "./files.js";

const execFileAsync = promisify(execFile);

const ICON_PACKAGES = {
  lucide: "lucide-react",
  phosphor: "@phosphor-icons/react",
  heroicons: "@heroicons/react/24/outline"
} as const;

export async function setupIcons(cwd: string, install = false): Promise<void> {
  const config = await readConfig(cwd);
  const library = config.icons.library;

  if (library === "custom") {
    console.log(
      'icons.library is "custom". Supply compatible SVG components and wrap them with <Icon> from @super-system/react.'
    );
    return;
  }

  const packageName = ICON_PACKAGES[library];
  console.log(`Configured icon library: ${library}`);
  console.log(`Recommended package: ${packageName}`);
  console.log("");
  console.log("Install:");
  console.log(`  npm install ${packageName}`);
  console.log("");
  console.log("Example:");
  console.log(`  import { Plus } from "${packageName === "@heroicons/react/24/outline" ? "@heroicons/react/24/outline" : packageName}";`);
  console.log('  import { Button, Icon } from "@super-system/react";');
  console.log("");
  console.log('  <Button aria-label="Add item">');
  console.log("    <Icon decorative>");
  console.log("      <Plus />");
  console.log("    </Icon>");
  console.log("  </Button>");

  if (!install) return;

  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  await execFileAsync(npmCmd, ["install", packageName], { cwd });
  console.log("");
  console.log(`Installed ${packageName}.`);
}
