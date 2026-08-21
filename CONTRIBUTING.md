# Contributing to Super System

Thank you for improving Super System. This repository is an npm workspace managed with pnpm.

## Development setup

```bash
git clone https://github.com/trondulseth/super-system.git
cd super-system
corepack enable
pnpm install
pnpm check
```

`pnpm check` runs TypeScript validation, unit tests, package builds, and a Studio demo build.

## Pull requests

- Keep changes focused and match existing code style.
- Update docs when CLI behavior, policy schema, or public APIs change.
- Run `pnpm check` before pushing.
- Link OpenSpec changes when work implements a planned capability.

## Release process (maintainers)

Beta releases are tag-driven:

1. Bump coordinated versions in all published packages.
2. Add a section to `MIGRATION.md`.
3. Merge to `main` and push tag `v0.1.0-beta.N`.
4. GitHub Actions runs `pnpm check`, `node scripts/verify-release.mjs`, and `node scripts/publish-packages.mjs` (publishes every package independently with a summary).

Stable `1.0.0` will require explicit approval and release-candidate gates documented in [compatibility policy](./docs/compatibility.md).

### First-time npm packages

Trusted Publishing (OIDC) can update existing packages but **cannot create new scoped packages** under `@super-system` until an org owner publishes them once.

When adding a package to the publish list:

1. Set `"publishConfig": { "access": "public" }` in its `package.json`.
2. As an `@super-system` npm org owner, publish once from a trusted machine:

   ```bash
   pnpm install --frozen-lockfile
   pnpm check
   npm publish --workspace=@super-system/rules --tag beta
   ```

3. In npm → package → **Settings → Publishing access**, link **Trusted Publisher** to this repo and the `Publish beta` workflow (`publish.yml`).
4. Re-run the failed **Publish beta** workflow on the release tag (Actions → workflow run → Re-run all jobs).

`scripts/publish-packages.mjs` attempts every package even when one fails, treats already-published versions as skipped, and exits non-zero if any package still fails — so a partial publish (for example tokens at beta.18 while rules is blocked) can be completed after first-publish setup without re-tagging.

Packages that require first-time setup as of beta.18:

| Package | Status on npm |
| --- | --- |
| `@super-system/tokens`, `@super-system/react`, `@super-system/cli` | Published |
| `@super-system/rules` | Needs first publish |
| `eslint-plugin-super-system` | Needs first publish |

## Governance and policy

Opt-in project policy lives in `super-system.policy.json`. See [Governance](./docs/governance.md).

## Questions

Open a GitHub issue for bugs and feature requests. For security issues, see [SECURITY.md](./SECURITY.md).
