# Library Quality Pass 2 — Perfect Score

## Problem

Post–Phase 6 code and quality review scored the library 6.5–8/10 across six dimensions. Remaining gaps include CSS bugs (missing chart tones, hardcoded colors), accessibility edge cases (unnamed close buttons, title-less modals, shallow label propagation), overlay positioning limitations, token inconsistencies, default-theme semantic duplication, and incomplete Studio controllers/previews.

## Goals

Bring all six review dimensions to **10/10**:

| Dimension | Current | Target |
|-----------|---------|--------|
| Code architecture | 8/10 | 10/10 |
| Accessibility | 7/10 | 10/10 |
| Visual/token consistency | 7/10 | 10/10 |
| Default theme prettiness | 8/10 | 10/10 |
| Studio controllers | 6.5/10 | 10/10 |
| Studio preview coverage | 7/10 | 10/10 |

## Non-goals

- Adopting Radix or another overlay dependency (stay in-house).
- Visual regression CI infrastructure (defer to `harden-release-and-quality`).
- npm publish (optional follow-up after this change).
- Breaking existing public APIs without migration notes.

## Affected capabilities

- React components
- Accessibility
- Theme system
- Theme studio

## Dependencies

- Completed `polish-library-quality` and `expand-react-component-library` archives.
- Existing 84+ component tests and `pnpm check` gate.

## Risks

- Adding `--ss-color-success` is a schema/token addition — must update compiler, defaults, contrast checks, and MIGRATION.md.
- Studio controller expansion increases sidebar complexity — mitigate with grouped sections and helper text.
- Modal inert/aria requirements may affect consumer DOM — scope to overlay portal behavior only.

## Rollout

Implement in six phases aligned to score dimensions. Each phase ends with tests and Studio verification. Sync specs and archive when `pnpm check` green and review checklist complete.
