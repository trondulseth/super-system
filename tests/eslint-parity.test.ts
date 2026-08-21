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

  it("flags text-like native inputs but not specialized types", () => {
    ruleTester.run("raw-input", plugin.rules!["raw-input"]!, {
      valid: [
        "export function App() { return <Input />; }",
        'export function App() { return <input type="checkbox" />; }',
        'export function App() { return <input type="radio" />; }',
        'export function App() { return <input type={mode} />; }'
      ],
      invalid: [
        {
          code: "export function App() { return <input />; }",
          errors: [{ messageId: "useInput" }]
        },
        {
          code: 'export function App() { return <input type="email" />; }',
          errors: [{ messageId: "useInput" }]
        }
      ]
    });
  });

  it("flags img elements without alt", () => {
    ruleTester.run("image-alt", plugin.rules!["image-alt"]!, {
      valid: [
        'export function App() { return <img alt="" src="/logo.png" />; }',
        'export function App() { return <img alt="Logo" src="/logo.png" />; }',
        'export function App() { return <img alt={"Logo"} src="/logo.png" />; }',
        'export function App() { return <img {...props} />; }'
      ],
      invalid: [
        {
          code: 'export function App() { return <img src="/logo.png" />; }',
          errors: [{ messageId: "missingAlt" }]
        }
      ]
    });
  });

  it("agrees with CLI audit on shared JSX violations", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-eslint-parity-"));
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
});
