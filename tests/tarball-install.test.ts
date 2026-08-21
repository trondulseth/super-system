import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

const workspaceRoot = process.cwd();

describe("package tarball install", () => {
  it("installs packed tokens and react exports in a clean project", async () => {
    const temp = await mkdtemp(path.join(tmpdir(), "super-system-tarball-"));
    const packDir = path.join(temp, "packs");
    const projectDir = path.join(temp, "consumer");
    await mkdir(packDir, { recursive: true });
    await mkdir(projectDir, { recursive: true });

    try {
      execFileSync("pnpm", ["run", "build"], {
        cwd: path.join(workspaceRoot, "packages/tokens"),
        stdio: "pipe"
      });
      execFileSync("pnpm", ["run", "build"], {
        cwd: path.join(workspaceRoot, "packages/react"),
        stdio: "pipe"
      });

      const tokensTarball = execFileSync("npm", ["pack", "--pack-destination", packDir], {
        cwd: path.join(workspaceRoot, "packages/tokens"),
        encoding: "utf8"
      })
        .trim()
        .split("\n")
        .pop()!;

      const reactTarball = execFileSync("npm", ["pack", "--pack-destination", packDir], {
        cwd: path.join(workspaceRoot, "packages/react"),
        encoding: "utf8"
      })
        .trim()
        .split("\n")
        .pop()!;

      await writeFile(
        path.join(projectDir, "package.json"),
        JSON.stringify(
          {
            name: "super-system-tarball-fixture",
            private: true,
            type: "module",
            dependencies: {
              "@super-system/tokens": `file:${path.join(packDir, tokensTarball)}`,
              "@super-system/react": `file:${path.join(packDir, reactTarball)}`
            }
          },
          null,
          2
        )
      );

      execFileSync("npm", ["install", "--ignore-scripts"], { cwd: projectDir, stdio: "pipe" });

      const tokensPkg = JSON.parse(
        await readFile(path.join(projectDir, "node_modules/@super-system/tokens/package.json"), "utf8")
      );
      const reactPkg = JSON.parse(
        await readFile(path.join(projectDir, "node_modules/@super-system/react/package.json"), "utf8")
      );

      expect(tokensPkg.name).toBe("@super-system/tokens");
      expect(reactPkg.exports["./styles.css"]).toBeDefined();
    } finally {
      await rm(temp, { recursive: true, force: true });
    }
  }, 120_000);
});
