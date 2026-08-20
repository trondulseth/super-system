import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const srcDir = path.join(packageRoot, "src");
const demoOnly = process.argv.includes("--demo");

async function buildServerBundle() {
  const outDir = path.join(packageRoot, "dist", "server");
  await mkdir(outDir, { recursive: true });

  await esbuild.build({
    entryPoints: [path.join(srcDir, "main-server.ts")],
    outfile: path.join(outDir, "app.js"),
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    sourcemap: true
  });

  await copyFile(path.join(srcDir, "index.html"), path.join(outDir, "index.html"));
  await copyFile(path.join(srcDir, "styles.css"), path.join(outDir, "styles.css"));
}

async function buildDemoBundle() {
  const outDir = path.join(packageRoot, "dist", "demo");
  await mkdir(outDir, { recursive: true });

  await esbuild.build({
    entryPoints: [path.join(srcDir, "main-static.ts")],
    outfile: path.join(outDir, "app.js"),
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    sourcemap: true
  });

  let html = await readFile(path.join(srcDir, "index.html"), "utf8");
  html = html.replace(
    "Save theme",
    "Download theme"
  );
  await writeFile(path.join(outDir, "index.html"), html, "utf8");
  await copyFile(path.join(srcDir, "styles.css"), path.join(outDir, "styles.css"));
}

if (demoOnly) {
  await buildDemoBundle();
} else {
  await buildServerBundle();
  await buildDemoBundle();
}

console.log(`Built studio-ui ${demoOnly ? "demo" : "server + demo"} bundles.`);
