import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { auditProject } from "../packages/cli/src/audit.js";
import { auditJsxFile } from "../packages/cli/src/audit-jsx.js";

describe("syntax-aware JSX audit", () => {
  it("does not flag checkbox inputs or button mentions in comments", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-audit-syntax-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "App.tsx"),
      [
        "// Use <button> in docs only",
        "export function App() {",
        "  return (",
        "    <>",
        '      <input type="checkbox" />',
        "      <Button>Save</Button>",
        '      <img alt="" src="/logo.png" />',
        "    </>",
        "  );",
        "}",
        ""
      ].join("\n")
    );

    const findings = await auditProject(directory);
    expect(findings.some((entry) => entry.rule === "raw-input")).toBe(false);
    expect(findings.some((entry) => entry.rule === "raw-button")).toBe(false);
    expect(findings.some((entry) => entry.rule === "image-alt")).toBe(false);
  });

  it("flags native button, text-like input, and img without alt", () => {
    const source = [
      "export function App() {",
      "  return (",
      "    <>",
      "      <button>Save</button>",
      '      <input type="email" />',
      '      <img src="/logo.png" />',
      "    </>",
      "  );",
      "}",
      ""
    ].join("\n");

    const { findings } = auditJsxFile(source, "src/App.tsx");
    expect(findings.map((entry) => entry.rule).sort()).toEqual(["image-alt", "raw-button", "raw-input"]);
  });

  it("matches ESLint parity for mixed violations", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-audit-parity-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "App.tsx"),
      [
        "export default function App() {",
        "  return (",
        "    <>",
        "      <button>Save</button>",
        '      <input type="email" />',
        '      <img src="/logo.png" />',
        "    </>",
        "  );",
        "}",
        ""
      ].join("\n")
    );

    const findings = await auditProject(directory);
    expect(findings.some((entry) => entry.rule === "raw-button")).toBe(true);
    expect(findings.some((entry) => entry.rule === "raw-input")).toBe(true);
    expect(findings.some((entry) => entry.rule === "image-alt")).toBe(true);
  });

  it("falls back to line-based JSX rules when TSX cannot be parsed", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-audit-fallback-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "App.tsx"),
      '<button>Save</button>\n<img src="/logo.png" />\n'
    );

    const findings = await auditProject(directory);
    expect(findings.some((entry) => entry.rule === "raw-button")).toBe(true);
    expect(findings.some((entry) => entry.rule === "image-alt")).toBe(true);
  });
});
