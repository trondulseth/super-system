# Migration guide

[← Documentation](./README.md) · [CLI](./cli.md) · [Audit & accessibility](./audit-and-accessibility.md)

Assisted migration helps you move an existing React project toward Super System with deterministic, reviewable CLI transforms.

For what each automated transform does, see [Audit & accessibility — automated transforms](./audit-and-accessibility.md#automated-transforms).

## Supported projects

Migration scans `.tsx`, `.jsx`, `.ts`, `.js`, `.css`, `.scss`, `.html`, `.vue`, and `.svelte` files outside `node_modules`, build output, and `.super-system`.

The CLI detects common React setups:

| Context | How it is detected |
| --- | --- |
| **Vite** | `vite.config.ts` / `.js` / `.mjs` |
| **Next.js** | `next.config.ts` / `.js` / `.mjs` |
| **React (generic)** | `package.json` when no framework config is found |

Vue and Svelte files are scanned for audit findings; automated component transforms target React/JSX sources.

## Before you start

1. Commit or stash your work so you can roll back.
2. Run `npx @super-system/cli init` if the project does not have `super-system.json` yet.
3. Install `@super-system/react` and import theme CSS in your app root.

## Recommended workflow

```bash
# 1. Read-only inventory
npx @super-system/cli migrate plan

# 2. Save a resumable manifest
npx @super-system/cli migrate plan --out .super-system/migration-plan.json

# 3. Preview diffs
npx @super-system/cli migrate apply --dry-run

# 4. Apply selected transforms
npx @super-system/cli migrate apply --only native-button-to-button --only img-add-alt

# 5. Verify configured checks + audit
npx @super-system/cli migrate apply --verify
# or after apply:
npx @super-system/cli migrate verify
```

## Transform selection

| Flag | Purpose |
|------|---------|
| `--only <transformId>` | Apply only the listed transform(s). Repeatable. |
| `--skip <transformId>` | Skip a transform. Repeatable. |
| `--skip-rule <rule>` | Skip all items for an audit rule (for example `raw-input`). Repeatable. |
| `--manifest <path>` | Read/write item statuses for resumable runs (default: `.super-system/migration-plan.json`). |

### Transform ids

| Transform id | Audit rule | What it does |
| --- | --- | --- |
| `img-add-alt` | `image-alt` | Adds `alt=""` to `<img>` tags missing alt text |
| `native-button-to-button` | `raw-button` | Replaces `<button>` with `<Button>` and adds the import |
| `native-input-to-input` | `raw-input` | Replaces text-like `<input>` with `<Input>` (skips checkbox, radio, file, hidden, submit) |
| `native-textarea-to-textarea` | `raw-textarea` | Replaces `<textarea>` with `<Textarea>` |
| `native-select-to-select` | `raw-select` | Replaces `<select>` with `<Select>` |
| `token-replace-color` | `hardcoded-color` | Replaces hex/rgb literals with `var(--ss-color-*)` when the value maps to exactly one theme token |

### Audit rule ids (for `--skip-rule`)

Use these with `--skip-rule` to opt out of every planned item for a rule:

| Rule id | Typical mode | Notes |
| --- | --- | --- |
| `raw-button` | auto | Native `<button>` elements |
| `raw-input` | manual/auto | Text-like inputs can auto-transform; checkbox/radio/file stay manual |
| `raw-textarea` | auto | Native `<textarea>` elements |
| `raw-select` | auto | Native `<select>` elements |
| `hardcoded-color` | manual/auto | Auto only when the literal maps to one theme token |
| `arbitrary-spacing` | manual | Arbitrary Tailwind spacing utilities |
| `inline-style` | manual | Inline `style={{ … }}` objects |
| `image-alt` | auto | `<img>` without `alt` |

## Resumable manifest

Saving a plan with `--out` (or letting `migrate apply` write after a successful run) creates a manifest at `.super-system/migration-plan.json` by default.

Each plan item gets a stable id (`rule:file:line`) and a status in `itemStatuses`:

| Status | Meaning |
| --- | --- |
| `pending` | Auto-fix planned but not yet applied |
| `applied` | Transform succeeded; skipped on subsequent runs |
| `skipped` | Transform could not be applied safely (see `skipReason`) |
| `manual` | No automated transform; needs human or AI review |

On each apply, the CLI refreshes findings from the current source tree and merges them with stored statuses so completed work is not repeated. Commit the manifest with your migration branch if you want to resume across machines.

Example fragment:

```json
{
  "version": 1,
  "itemStatuses": [
    { "id": "raw-button:src/App.tsx:1", "status": "applied", "appliedAt": "2026-08-21T14:00:00.000Z" },
    { "id": "image-alt:src/Hero.tsx:9", "status": "pending" },
    { "id": "inline-style:src/Card.tsx:4", "status": "manual" }
  ]
}
```

## Post-migration verification

`migrate verify` (and `migrate apply --verify` after writing files) runs these steps in order:

1. `npm run typecheck` — skipped if the script is not defined in `package.json`
2. `npm run test` — skipped if not defined
3. `npm run build` — skipped if not defined
4. `super-system audit` — **fails** when any audit findings remain

Example output:

```text
Post-migration verification:

  [PASSED] npm run typecheck
  [SKIPPED] test — Script not defined in package.json.
  [PASSED] npm run build
  [FAILED] super-system audit — 2 finding(s) remain

Verification failed. Review changes or roll back before continuing.
Rollback: `git restore .` or revert the migration commit if you created a checkpoint first.
```

Verification passes only when every step is `passed` or `skipped` (none `failed`).

## Backup, review, and rollback

- **Backup:** commit before `migrate apply`, or copy the project directory.
- **Review:** always run `--dry-run` first and inspect unified diffs.
- **Dirty worktree:** write mode refuses to run when git has uncommitted changes unless you pass `--allow-dirty`.
- **Rollback:** `git restore .` or revert the migration commit. The manifest records applied item ids so a resumed run skips completed work.

## Troubleshooting

| Symptom | What to do |
|---------|------------|
| `DirtyWorktreeError` | Commit/stash changes, or use `--allow-dirty` consciously. |
| Transform skipped | Source may have changed, or the pattern is no longer eligible (for example checkbox inputs). |
| Ambiguous color | Map the literal manually; token replacement requires a unique theme match. |
| Verification failed | Fix type/test/build errors, then re-run `migrate verify` and `audit`. |

## AI-neutral follow-up for manual items

Share these artifacts with any coding tool (no vendor lock-in):

1. `npx @super-system/cli migrate plan --json > migration-plan.json`
2. This guide (`docs/migration-guide.md`)
3. `docs/ai-tools.md` rules for Super System components and tokens

Ask the tool to work through items where `mode` is `manual`, preserving behavior and skipping ambiguous color mappings.
