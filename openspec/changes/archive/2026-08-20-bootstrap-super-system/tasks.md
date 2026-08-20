# Tasks: Bootstrap Super System

## Repository and architecture

- [x] Create the TypeScript and pnpm monorepo.
- [x] Split tokens, React components, and CLI into separate packages.
- [x] Add MIT licensing and a public GitHub repository.

## Theme system

- [x] Define the versioned `super-system.json` contract and default theme.
- [x] Implement validation and deterministic CSS custom-property generation.
- [x] Add light and dark semantic tokens, typography, spacing, radius, shadow, density, and motion settings.
- [x] Add contrast calculation and configurable accessibility targets.

## React package

- [x] Implement Button with variants, sizes, loading, disabled state, and ref forwarding.
- [x] Implement Input with focus, disabled, and invalid states.
- [x] Implement Badge variants and composable Card primitives.
- [x] Implement ThemeProvider with light, dark, and system modes.
- [x] Style components exclusively through shared Super System variables.

## CLI and Studio

- [x] Implement safe project initialization.
- [x] Implement deterministic theme building.
- [x] Implement local Theme Studio with live previews and contrast feedback.
- [x] Implement UI auditing with human and JSON output.
- [x] Implement direct contrast checks.

## Quality, documentation, and release

- [x] Add strict type checking, Vitest coverage, package builds, and clean-package smoke tests.
- [x] Add GitHub continuous integration and release workflows.
- [x] Configure npm Trusted Publishing with OIDC.
- [x] Publish all three packages as `0.1.0-beta.1` under the beta tag.
- [x] Write a comprehensive beginner-oriented README covering setup and everyday use.
- [x] Verify the full repository with `pnpm check`.
