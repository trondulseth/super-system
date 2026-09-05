# Tasks: Add Governance and AI Adapters

## Canonical governance

- [x] Define and validate the versioned policy schema.
- [x] Document component, token, audit, accessibility, and deprecation policy fields.
- [x] Add `policy init`, `policy check`, and machine-readable output.
- [x] Integrate policy severity and exclusions with UI audit.

## Linting and deeper audit

- [x] Extract a shared, versioned rule catalog for CLI and editor integrations.
- [x] Add syntax-aware JavaScript and TypeScript analysis for supported rules.
- [x] Publish an ESLint plugin with recommended and strict configurations.
- [x] Add safe inline suppression syntax with required justification guidance.

## Adapter generation

- [x] Define the adapter interface and generated-section markers.
- [x] Implement generic `AGENTS.md` output.
- [x] Select and implement the first vendor-specific adapters from verified formats.
- [x] Add preview, merge-safe update, stale-output detection, and removal commands.

## Verification

- [x] Test policy validation and lifecycle transitions.
- [x] Test adapters against empty, missing, generated, and hand-edited target files.
- [x] Verify that regeneration is deterministic and preserves user-owned content.
- [x] Add CI fixtures for pass, warning, and failure policies.
- [x] Add parity fixtures proving that ESLint and CLI audit agree on shared rules.

## Documentation and release

- [x] Write governance examples for solo projects and teams.
- [x] Explain that adapters provide guidance and do not grant tool permissions.
- [x] Publish adapters as opt-in beta features and document format support versions.
