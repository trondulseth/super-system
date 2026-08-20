import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { auditProject } from "../packages/cli/src/audit.js";

describe("project audit", () => {
  it("finds raw controls and hardcoded colors", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-audit-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(path.join(directory, "src", "App.tsx"), '<button style={{ color: "#ff0000" }}>Save</button>');
    const findings = await auditProject(directory);
    expect(findings.map((finding) => finding.rule)).toEqual(expect.arrayContaining(["raw-button", "hardcoded-color", "inline-style"]));
  });
});
