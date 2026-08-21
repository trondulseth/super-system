# CLI reference

[← Documentation](./README.md) · [Getting started](./getting-started.md) · [Studio](./studio.md) · [Troubleshooting](./troubleshooting.md)

## CLI reference

| Command | What it does |
| --- | --- |
| `npx @super-system/cli init` | Creates the default theme and generated CSS. |
| `npx @super-system/cli init --force` | Replaces an existing theme. This overwrites it. |
| `npx @super-system/cli studio` | Starts the local visual theme editor. |
| `npx @super-system/cli studio --port 5000` | Starts Studio on another port. |
| `npx @super-system/cli studio --no-open` | Starts Studio without opening a browser. |
| `npx @super-system/cli audit` | Reports likely UI consistency problems. |
| `npx @super-system/cli audit --json` | Prints findings as JSON. |
| `npx @super-system/cli migrate plan` | Builds a read-only migration plan from audit findings. |
| `npx @super-system/cli migrate plan --json` | Prints the migration manifest as JSON for AI tools. |
| `npx @super-system/cli migrate apply --dry-run` | Shows proposed auto-fix diffs without writing files. |
| `npx @super-system/cli migrate apply --dry-run --json` | Prints the dry-run result as JSON. |
| `npx @super-system/cli migrate apply` | Applies supported auto-fixes and writes changed files. |
| `npx @super-system/cli migrate apply --allow-dirty` | Applies auto-fixes even when the git worktree has uncommitted changes. |
| `npx @super-system/cli migrate apply --json` | Prints the apply result as JSON. |
| `npx @super-system/cli build-theme` | Regenerates CSS from `super-system.json`. |
| `npx @super-system/cli check-contrast` | Checks configured light/dark color pairs. |
| `npx @super-system/cli icons setup` | Prints install guidance for the configured icon library. |
| `npx @super-system/cli icons setup --install` | Installs the recommended icon package in the project. |

All commands accept `--cwd path` when the target project is not the current folder.

## Packages

| Package | Purpose |
| --- | --- |
| [`@super-system/cli`](https://www.npmjs.com/package/@super-system/cli) | Initialize, edit, generate, and audit. |
| [`@super-system/react`](https://www.npmjs.com/package/@super-system/react) | React components and component CSS. |
| [`@super-system/tokens`](https://www.npmjs.com/package/@super-system/tokens) | Theme types, validation, CSS compilation, and contrast checks. |

You can use `@super-system/tokens` directly when building another framework adapter:

```ts
import {
  checkThemeContrast,
  compileTheme,
  defaultTheme,
  validateConfig,
} from "@super-system/tokens";
```
