import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export class DirtyWorktreeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirtyWorktreeError";
  }
}

export async function isGitRepository(cwd: string): Promise<boolean> {
  try {
    await execFileAsync("git", ["rev-parse", "--is-inside-work-tree"], { cwd });
    return true;
  } catch {
    return false;
  }
}

export async function hasUncommittedChanges(cwd: string): Promise<boolean> {
  const { stdout } = await execFileAsync("git", ["status", "--porcelain"], { cwd });
  return stdout.trim().length > 0;
}

export async function assertSafeToWrite(cwd: string, allowDirty: boolean): Promise<void> {
  if (!(await isGitRepository(cwd))) return;

  if (await hasUncommittedChanges(cwd)) {
    if (allowDirty) return;
    throw new DirtyWorktreeError(
      "Refusing to write migration changes because the git worktree has uncommitted changes.\n" +
        "Commit or stash your work first, or rerun with --allow-dirty if you accept the risk."
    );
  }
}
