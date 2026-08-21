import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";

describe("verify-release script", () => {
  it("passes when tag matches package versions and MIGRATION.md", () => {
    const output = execFileSync("node", ["scripts/verify-release.mjs", "v0.1.0-beta.16"], {
      cwd: process.cwd(),
      encoding: "utf8"
    });
    expect(output).toContain("0.1.0-beta.16");
  });

  it("fails on version mismatch", () => {
    expect(() =>
      execFileSync("node", ["scripts/verify-release.mjs", "v0.1.0-beta.99"], {
        cwd: process.cwd(),
        encoding: "utf8"
      })
    ).toThrow();
  });
});
