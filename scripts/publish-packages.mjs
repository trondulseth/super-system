#!/usr/bin/env node
import { spawnSync } from "node:child_process";

/** Publish order respects workspace dependencies (tokens/rules before react/cli). */
const PACKAGES = [
  "@super-system/tokens",
  "@super-system/rules",
  "@super-system/react",
  "eslint-plugin-super-system",
  "@super-system/cli"
];

const NPM_TAG = process.env.NPM_PUBLISH_TAG ?? "beta";

function isAlreadyPublished(output) {
  return /previously published|cannot publish over|version already exists|E409|E403.*publish over/i.test(output);
}

function publishPackage(name) {
  const result = spawnSync(
    "npm",
    ["publish", `--workspace=${name}`, "--tag", NPM_TAG],
    { encoding: "utf8" }
  );

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();

  if (result.status === 0) {
    return { name, status: "published", detail: "Published successfully." };
  }

  if (isAlreadyPublished(output)) {
    return { name, status: "skipped", detail: "Version already on npm; skipped." };
  }

  const detail = output.split("\n").filter(Boolean).slice(-3).join(" ") || `exit ${result.status}`;
  return { name, status: "failed", detail };
}

const results = PACKAGES.map((name) => publishPackage(name));

console.log("\nPublish summary:\n");
for (const entry of results) {
  const marker = entry.status === "failed" ? "FAIL" : entry.status === "skipped" ? "SKIP" : "OK";
  console.log(`  [${marker}] ${entry.name} — ${entry.detail}`);
}

const failed = results.filter((entry) => entry.status === "failed");
const published = results.filter((entry) => entry.status === "published");
const skipped = results.filter((entry) => entry.status === "skipped");

console.log(
  `\nTotals: ${published.length} published, ${skipped.length} skipped, ${failed.length} failed (tag: ${NPM_TAG})\n`
);

if (failed.length > 0) {
  console.error("One or more packages failed to publish. See logs above.");
  console.error("For new scoped packages, complete first-publish setup in CONTRIBUTING.md before re-running.");
  process.exit(1);
}
