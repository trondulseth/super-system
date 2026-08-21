# Migration guide

[← Documentation](./README.md) · [CLI](./cli.md) · [Audit & accessibility](./audit-and-accessibility.md)

Assisted migration helps you move an existing React project toward Super System with deterministic, reviewable CLI transforms.

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
| `--skip-rule <rule>` | Skip all items for an audit rule (for example `raw-input`). |
| `--manifest <path>` | Read/write item statuses for resumable runs (default: `.super-system/migration-plan.json`). |

Supported transform ids:

- `img-add-alt`
- `token-replace-color`
- `native-button-to-button`
- `native-input-to-input`
- `native-textarea-to-textarea`
- `native-select-to-select`

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
