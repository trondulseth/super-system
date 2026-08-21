import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { defaultTheme } from "../packages/tokens/src/index.js";
import { DirtyWorktreeError } from "../packages/cli/src/git-worktree.js";
import {
  applyMigration,
  applyMigrationDryRun,
  formatMigrationApplyResult
} from "../packages/cli/src/migration-apply.js";
import {
  finalizeComponentImports,
  transformImgAddAlt,
  transformNativeButtonToButton,
  transformNativeInputToInput,
  transformNativeSelectToSelect,
  transformNativeTextareaToTextarea
} from "../packages/cli/src/migration-transforms.js";

const execFileAsync = promisify(execFile);

async function initGitRepo(directory: string): Promise<void> {
  await execFileAsync("git", ["init"], { cwd: directory });
  await execFileAsync("git", ["config", "user.email", "test@example.com"], { cwd: directory });
  await execFileAsync("git", ["config", "user.name", "Test User"], { cwd: directory });
}

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

  it("applies token replacement for unambiguous theme colors", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-apply-token-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(path.join(directory, "super-system.json"), `${JSON.stringify(defaultTheme, null, 2)}\n`);
    await writeFile(
      path.join(directory, "src", "Card.css"),
      ".card {\n  color: #2563eb;\n}\n"
    );

    const result = await applyMigrationDryRun(directory);
    expect(result.summary.transformsApplied).toBe(1);
    expect(result.changes[0]?.diff).toContain("var(--ss-color-primary)");
  });

  it("applies form control transforms and merges imports", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-apply-form-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "Form.tsx"),
      '<input type="email" />\n<textarea />\n<select><option>A</option></select>\n'
    );

    const result = await applyMigrationDryRun(directory);
    expect(result.summary.transformsApplied).toBe(4);
    expect(result.changes[0]?.diff).toContain('<Input type="email" />');
    expect(result.changes[0]?.diff).toContain("<Textarea />");
    expect(result.changes[0]?.diff).toContain("<Select><option>A</option></Select>");
    expect(result.changes[0]?.diff).toContain(
      'import { Input, Select, Textarea } from "@super-system/react";'
    );
  });

  it("skips unsafe checkbox inputs during apply", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-apply-checkbox-"));
    await mkdir(path.join(directory, "src"));
    await writeFile(path.join(directory, "src", "Form.tsx"), '<input type="checkbox" />\n');

    const result = await applyMigrationDryRun(directory);
    expect(result.summary.transformsApplied).toBe(0);
    expect(result.summary.manualRemaining).toBe(1);
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
    expect(finalizeComponentImports(result!.content, ["Button"])).toContain(
      'import { Button, Input } from "@super-system/react"'
    );
  });

  it("transforms native input, textarea, and select tags", () => {
    const inputItem = {
      id: "raw-input:src/Form.tsx:1",
      rule: "raw-input",
      file: "src/Form.tsx",
      line: 1,
      message: "",
      confidence: "medium" as const,
      mode: "auto" as const,
      transformId: "native-input-to-input",
      plannedAction: ""
    };
    expect(transformNativeInputToInput('<input type="email" />', inputItem)?.content).toBe(
      '<Input type="email" />'
    );
    expect(transformNativeInputToInput('<input type="checkbox" />', inputItem)).toBeNull();

    const textareaItem = { ...inputItem, id: "raw-textarea:src/Form.tsx:1", line: 1, transformId: "native-textarea-to-textarea" };
    expect(transformNativeTextareaToTextarea("<textarea />", textareaItem)?.content).toBe("<Textarea />");

    const selectItem = { ...inputItem, id: "raw-select:src/Form.tsx:1", line: 1, transformId: "native-select-to-select" };
    expect(transformNativeSelectToSelect("<select />", selectItem)?.content).toBe("<Select />");
  });
});

describe("migrate apply write mode", () => {
  it("writes transformed files when not in dry-run mode", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-apply-write-"));
    await mkdir(path.join(directory, "src"));
    const filePath = path.join(directory, "src", "App.tsx");
    await writeFile(filePath, 'export default function App() {\n  return <button>Save</button>;\n}\n');

    const result = await applyMigration(directory, { dryRun: false });

    expect(result.dryRun).toBe(false);
    expect(result.summary.filesWritten).toBe(1);
    expect(result.writtenFiles).toEqual(["src/App.tsx"]);

    const written = await readFile(filePath, "utf8");
    expect(written).toContain('import { Button } from "@super-system/react"');
    expect(written).toContain("<Button>Save</Button>");
    expect(written).not.toContain("<button>Save</button>");
  });

  it("refuses to write when the git worktree has uncommitted changes", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-apply-dirty-"));
    await initGitRepo(directory);
    await mkdir(path.join(directory, "src"));
    await writeFile(
      path.join(directory, "src", "App.tsx"),
      'export default function App() {\n  return <button>Save</button>;\n}\n'
    );
    await writeFile(path.join(directory, "notes.txt"), "draft\n");
    await execFileAsync("git", ["add", "."], { cwd: directory });
    await execFileAsync("git", ["commit", "-m", "initial"], { cwd: directory });
    await writeFile(path.join(directory, "notes.txt"), "draft edits\n");

    await expect(applyMigration(directory, { dryRun: false })).rejects.toBeInstanceOf(
      DirtyWorktreeError
    );
  });

  it("writes when --allow-dirty is set on a dirty worktree", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "super-system-migrate-apply-allow-dirty-"));
    await initGitRepo(directory);
    await mkdir(path.join(directory, "src"));
    const filePath = path.join(directory, "src", "App.tsx");
    await writeFile(filePath, 'export default function App() {\n  return <button>Save</button>;\n}\n');
    await writeFile(path.join(directory, "notes.txt"), "draft\n");
    await execFileAsync("git", ["add", "."], { cwd: directory });
    await execFileAsync("git", ["commit", "-m", "initial"], { cwd: directory });
    await writeFile(path.join(directory, "notes.txt"), "draft edits\n");

    const result = await applyMigration(directory, { dryRun: false, allowDirty: true });

    expect(result.summary.filesWritten).toBe(1);
    const written = await readFile(filePath, "utf8");
    expect(written).toContain("<Button>Save</Button>");
  });
});
