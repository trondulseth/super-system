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
4. GitHub Actions runs `pnpm check`, `node scripts/verify-release.mjs`, and publishes to npm with the `beta` tag.

Stable `1.0.0` will require explicit approval and release-candidate gates documented in [compatibility policy](./docs/compatibility.md).

## Governance and policy

Opt-in project policy lives in `super-system.policy.json`. See [Governance](./docs/governance.md).

## Questions

Open a GitHub issue for bugs and feature requests. For security issues, see [SECURITY.md](./SECURITY.md).
