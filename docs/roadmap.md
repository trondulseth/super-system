# Roadmap & contributing

[← Documentation](./README.md) · [CLI](./cli.md) · [Studio](./studio.md)

## Beta roadmap

Batch 1–3 component batches and **assisted migration** (beta.15) are **shipped**. **Governance** (beta.16–19) adds policy, shared rules, ESLint parity, suppressions, and Cursor/AGENTS adapters. Next planned work:

- release matrix, visual regression, and RC workflow (`harden-release-and-quality`);
- hosted theme sharing in addition to the private local Studio.

The [Studio browser demo](https://trondulseth.github.io/super-system/) is available on GitHub Pages and stays in sync with the local Studio UI through the shared `@super-system/studio-ui` package.

## Product specifications and roadmap

Super System uses [OpenSpec](https://openspec.dev/) to keep the product plan reviewable and close to the code.

- [`openspec/specs`](../openspec/specs) describes what the current beta does today.
- [`openspec/changes`](../openspec/changes) contains active proposals, technical designs, acceptance requirements, and implementation checklists for planned work.
- [`openspec/changes/archive`](../openspec/changes/archive) records completed changes, including bootstrap beta, component batches, Studio GitHub Pages demo, quality passes, and assisted migration.

Active work to watch:

- [`harden-release-and-quality`](../openspec/changes/harden-release-and-quality) — release candidates, expanded tests, 1.0 policies
- [`add-hosted-theme-sharing`](../openspec/changes/add-hosted-theme-sharing) — optional hosted theme previews

Before implementing a planned feature, review its OpenSpec change. When the work and verification tasks are complete, sync the living specification and archive the change. This gives people and AI coding tools the same source of truth.

## Contributing

Super System is developed as an npm workspace:

```bash
git clone https://github.com/trondulseth/super-system.git
cd super-system
corepack enable
pnpm install
pnpm check
```

`pnpm check` runs strict TypeScript validation, unit tests, production builds for every package, and a Studio demo build verification.
