#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME ?? process.env.npm_package_version;
if (!tag) {
  console.error("verify-release: pass a tag such as v0.1.0-beta.16 or set GITHUB_REF_NAME");
  process.exit(1);
}

const version = tag.startsWith("v") ? tag.slice(1) : tag;
const packages = ["tokens", "react", "cli", "rules", "eslint-plugin-super-system"];
const mismatches = [];

for (const name of packages) {
  const pkgPath = join("packages", name, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.version !== version) {
    mismatches.push(`${pkg.name}: expected ${version}, found ${pkg.version}`);
  }
}

if (mismatches.length > 0) {
  console.error("verify-release: version mismatch");
  mismatches.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}

const migrationNotes = readFileSync("MIGRATION.md", "utf8");
if (!migrationNotes.includes(version)) {
  console.error(`verify-release: MIGRATION.md has no entry for ${version}`);
  process.exit(1);
}

console.log(`verify-release: ${version} matches ${packages.length} packages and MIGRATION.md`);
