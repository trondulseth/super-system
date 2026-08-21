import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GENERATED_SECTION_BEGIN, GENERATED_SECTION_END } from "../packages/rules/src/index.js";
import { generateAdapter, mergeGeneratedSection } from "../packages/cli/src/adapters.js";
import { defaultPolicy, readPolicy, validatePolicy, writePolicy } from "../packages/cli/src/policy.js";
import { checkPolicy } from "../packages/cli/src/policy-check.js";

describe("governance policy", () => {
  it("validates policy schema", () => {
    expect(validatePolicy(defaultPolicy())).toEqual([]);
    expect(validatePolicy({ version: 99 })).not.toEqual([]);
  });

  it("writes and reads policy init defaults", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-policy-"));
    await writePolicy(directory, defaultPolicy());
    const stored = await readPolicy(directory);
    expect(stored?.audit?.severity?.["image-alt"]).toBe("error");
  });

  it("applies severity and exclusions during policy check", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-policy-check-"));
    await mkdir(path.join(directory, "src"), { recursive: true });
    await writeFile(path.join(directory, "src", "App.tsx"), "<button>Save</button>\n");

    const policy = defaultPolicy();
    policy.audit = {
      severity: { "raw-button": "error" },
      excludeRules: [],
      excludeGlobs: []
    };
    await writePolicy(directory, policy);

    const result = await checkPolicy(directory);
    expect(result.findings.some((entry) => entry.rule === "raw-button" && entry.severity === "error")).toBe(true);
    expect(result.passed).toBe(false);
  });
});

describe("instruction adapters", () => {
  it("merges generated sections without removing user content", () => {
    const merged = mergeGeneratedSection(
      "# My project\n\nCustom guidance.\n",
      `${GENERATED_SECTION_BEGIN}\nrules\n${GENERATED_SECTION_END}`
    );
    expect(merged).toContain("Custom guidance.");
    expect(merged).toContain(GENERATED_SECTION_BEGIN);
  });

  it("replaces an existing generated section", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-adapters-"));
    const existing = [
      "# Agents",
      "",
      "Team notes stay.",
      "",
      GENERATED_SECTION_BEGIN,
      "old content",
      GENERATED_SECTION_END,
      ""
    ].join("\n");
    await writeFile(path.join(directory, "AGENTS.md"), existing);

    const result = await generateAdapter(directory, { target: "agents-md" });
    expect(result.content).toContain("Team notes stay.");
    expect(result.content).toContain("Generator version:");
    expect(result.content).not.toContain("old content");
    expect(await readFile(path.join(directory, "AGENTS.md"), "utf8")).toContain("Team notes stay.");
  });
});
