import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { applyMigrationDryRun, formatMigrationApplyResult } from "../packages/cli/src/migration-apply.js";
import {
  finalizeButtonImport,
  transformImgAddAlt,
  transformNativeButtonToButton
} from "../packages/cli/src/migration-transforms.js";

describe("migrate apply dry-run", () => {
  it("shows unified diffs without writing files", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-apply-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "App.tsx"),
      'export default function App() {\n  return <button>Save</button>;\n}\n'
    );

    const result = await applyMigrationDryRun(directory);

    expect(result.dryRun).toBe(true);
    expect(result.summary.transformsApplied).toBe(2);
    expect(result.summary.filesChanged).toBe(1);
    expect(result.changes[0]?.diff).toContain("--- a/src/App.tsx");
    expect(result.changes[0]?.diff).toContain("+import { Button } from \"@super-system/react\";");
    expect(result.changes[0]?.diff).toContain("+  return <Button>Save</Button>;");

    const formatted = formatMigrationApplyResult(result);
    expect(formatted).toContain("dry run");
    expect(formatted).toContain("Proposed changes:");
  });

  it("applies img alt and button transforms on the same file", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-apply-multi-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "Hero.tsx"),
      '<button>Go</button>\n<img src="/logo.png" />\n'
    );

    const result = await applyMigrationDryRun(directory);
    expect(result.summary.transformsApplied).toBe(3);
    expect(result.changes[0]?.diff).toContain('alt=""');
    expect(result.changes[0]?.diff).toContain("<Button>Go</Button>");
  });

  it("is idempotent for img alt transforms", () => {
    const item = {
      id: "image-alt:src/Hero.tsx:2",
      rule: "image-alt",
      file: "src/Hero.tsx",
      line: 1,
      message: "",
      confidence: "high" as const,
      mode: "auto" as const,
      transformId: "img-add-alt",
      plannedAction: ""
    };
    const once = transformImgAddAlt("<img src=\"/logo.png\" />", item);
    expect(once?.content).toContain('alt=""');
    const twice = transformImgAddAlt(once!.content, item);
    expect(twice).toBeNull();
  });

  it("adds Button to an existing Super System import", () => {
    const item = {
      id: "raw-button:src/App.tsx:2",
      rule: "raw-button",
      file: "src/App.tsx",
      line: 2,
      message: "",
      confidence: "medium" as const,
      mode: "auto" as const,
      transformId: "native-button-to-button",
      plannedAction: ""
    };
    const content = 'import { Input } from "@super-system/react";\n<button>Save</button>\n';
    const result = transformNativeButtonToButton(content, item);
    expect(result?.content).toContain("<Button>Save</Button>");
    expect(finalizeButtonImport(result!.content)).toContain('import { Input, Button } from "@super-system/react"');
  });
});
