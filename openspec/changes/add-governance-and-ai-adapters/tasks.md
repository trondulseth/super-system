# Tasks: Add Governance and AI Adapters

## Canonical governance

- [ ] Define and validate the versioned policy schema.
- [ ] Document component, token, audit, accessibility, and deprecation policy fields.
- [ ] Add `policy init`, `policy check`, and machine-readable output.
- [ ] Integrate policy severity and exclusions with UI audit.

## Linting and deeper audit

- [ ] Extract a shared, versioned rule catalog for CLI and editor integrations.
- [ ] Add syntax-aware JavaScript and TypeScript analysis for supported rules.
- [ ] Publish an ESLint plugin with recommended and strict configurations.
- [ ] Add safe inline suppression syntax with required justification guidance.

## Adapter generation

- [ ] Define the adapter interface and generated-section markers.
- [ ] Implement generic `AGENTS.md` output.
- [ ] Select and implement the first vendor-specific adapters from verified formats.
- [ ] Add preview, merge-safe update, stale-output detection, and removal commands.

## Verification

- [ ] Test policy validation and lifecycle transitions.
- [ ] Test adapters against empty, missing, generated, and hand-edited target files.
- [ ] Verify that regeneration is deterministic and preserves user-owned content.
- [ ] Add CI fixtures for pass, warning, and failure policies.
- [ ] Add parity fixtures proving that ESLint and CLI audit agree on shared rules.

## Documentation and release

- [ ] Write governance examples for solo projects and teams.
- [ ] Explain that adapters provide guidance and do not grant tool permissions.
- [ ] Publish adapters as opt-in beta features and document format support versions.
