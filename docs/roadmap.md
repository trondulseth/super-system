# Roadmap & contributing

[← Documentation](./README.md) · [CLI](./cli.md) · [Studio](./studio.md)

## Beta roadmap

Batch 1–3 component batches are **shipped**. Remaining work in the active OpenSpec change covers release verification. Next planned work:
- a safer assisted migration workflow for existing projects;
- ESLint rules and deeper framework-aware audits;
- optional AI instruction adapters;
- hosted theme sharing in addition to the private local Studio.

The [Studio browser demo](https://trondulseth.github.io/super-system/) is available on GitHub Pages and stays in sync with the local Studio UI through the shared `@super-system/studio-ui` package.

## Product specifications and roadmap

Super System uses [OpenSpec](https://openspec.dev/) to keep the product plan reviewable and close to the code.

- [`openspec/specs`](../openspec/specs) describes what the current beta does today.
- [`openspec/changes`](../openspec/changes) contains active proposals, technical designs, acceptance requirements, and implementation checklists for planned work.
- [`openspec/changes/archive`](../openspec/changes/archive) records completed changes, including the bootstrap beta, Batch 1 component expansion, Studio GitHub Pages demo, and the Batch 1 quality polish pass.

Active work to watch: [`expand-react-component-library`](../openspec/changes/expand-react-component-library) (Batch 2 navigation components).

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
