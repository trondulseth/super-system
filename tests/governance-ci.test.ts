import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { auditProject } from "../packages/cli/src/audit.js";
import { generateAdapter, mergeCursorRules } from "../packages/cli/src/adapters.js";
import { defaultPolicy, writePolicy } from "../packages/cli/src/policy.js";
import { checkPolicy } from "../packages/cli/src/policy-check.js";
import { GENERATED_SECTION_BEGIN, GENERATED_SECTION_END } from "../packages/rules/src/index.js";

async function writePassFixture(root: string): Promise<void> {
  await mkdir(path.join(root, "src"), { recursive: true });
  await writeFile(
    path.join(root, "src", "App.tsx"),
    [
      "export function App() {",
      "  return <Button>Save</Button>;",
      "}",
      ""
    ].join("\n")
  );
  await writePolicy(root, defaultPolicy());
}

async function writeWarnFixture(root: string): Promise<void> {
  await mkdir(path.join(root, "src"), { recursive: true });
  await writeFile(path.join(root, "src", "App.tsx"), "<button>Save</button>\n");
  const policy = defaultPolicy();
  policy.audit = { severity: { "raw-button": "warn" }, excludeRules: [], excludeGlobs: [] };
  await writePolicy(root, policy);
}

async function writeFailFixture(root: string): Promise<void> {
  await mkdir(path.join(root, "src"), { recursive: true });
  await writeFile(path.join(root, "src", "App.tsx"), "<button>Save</button>\n");
  const policy = defaultPolicy();
  policy.audit = { severity: { "raw-button": "error" }, excludeRules: [], excludeGlobs: [] };
  await writePolicy(root, policy);
}

describe("governance CI fixtures", () => {
  it("passes policy check on a clean project", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-policy-pass-"));
    await writePassFixture(directory);
    const result = await checkPolicy(directory);
    expect(result.passed).toBe(true);
    expect(result.findings).toHaveLength(0);
  });

  it("allows warn-level violations without failing policy check", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-policy-warn-"));
    await writeWarnFixture(directory);
    const result = await checkPolicy(directory);
    expect(result.findings.some((entry) => entry.rule === "raw-button" && entry.severity === "warn")).toBe(true);
    expect(result.passed).toBe(true);
  });

  it("fails policy check on error-level violations", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-policy-fail-"));
    await writeFailFixture(directory);
    const result = await checkPolicy(directory);
    expect(result.passed).toBe(false);
    expect(result.findings.some((entry) => entry.severity === "error")).toBe(true);
  });

  it("honours inline suppressions during audit", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-policy-suppress-"));
    await mkdir(path.join(directory, "src"), { recursive: true });
    await writeFile(
      path.join(directory, "src", "Legacy.tsx"),
      [
        "// super-system-ignore raw-button: Vendor bundle we cannot refactor this sprint",
        "<button>Save</button>",
        ""
      ].join("\n")
    );
    const findings = await auditProject(directory);
    expect(findings.some((entry) => entry.rule === "raw-button")).toBe(false);
  });
});

describe("cursor rules adapter", () => {
  it("merges generated content into cursor frontmatter files", () => {
    const merged = mergeCursorRules(
      "---\ndescription: Team rules\nglobs: **/*.tsx\nalwaysApply: false\n---\n\n# Notes\n",
      `${GENERATED_SECTION_BEGIN}\nbody\n${GENERATED_SECTION_END}`
    );
    expect(merged).toContain("description: Team rules");
    expect(merged).toContain("# Notes");
    expect(merged).toContain(GENERATED_SECTION_BEGIN);
  });

  it("writes .cursor/rules/super-system.mdc", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-cursor-adapter-"));
    const result = await generateAdapter(directory, { target: "cursor-rules" });
    expect(result.file).toBe(".cursor/rules/super-system.mdc");
    const content = await readFile(path.join(directory, result.file), "utf8");
    expect(content).toContain("---");
    expect(content).toContain("globs:");
    expect(content).toContain(GENERATED_SECTION_BEGIN);
  });
});
