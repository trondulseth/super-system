import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { RuleTester } from "eslint";
import { describe, expect, it } from "vitest";
import plugin from "../packages/eslint-plugin-super-system/src/index.js";
import { auditProject } from "../packages/cli/src/audit.js";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      ecmaFeatures: { jsx: true },
      sourceType: "module"
    }
  }
});

describe("eslint-plugin-super-system", () => {
  it("flags native button elements", () => {
    ruleTester.run("raw-button", plugin.rules!["raw-button"]!, {
      valid: ['const label = "button";', "export function App() { return <Button>Save</Button>; }"],
      invalid: [
        {
          code: "export function App() { return <button>Save</button>; }",
          errors: [{ messageId: "useButton" }]
        }
      ]
    });
  });

  it("agrees with CLI audit on raw-button in JSX files", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-eslint-parity-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "App.tsx"),
      'export default function App() {\n  return <button>Save</button>;\n}\n'
    );

    const findings = await auditProject(directory);
    expect(findings.some((entry) => entry.rule === "raw-button")).toBe(true);
  });
});
