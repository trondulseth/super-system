# Polish Batch 1 Quality

## Problem

Batch 1 form and feedback components are implemented and merged, but a full code review surfaced correctness gaps, token leaks, incomplete Studio coverage, missing tests, and API inconsistencies. Shipping Batch 2 navigation and overlay components on this foundation would compound the debt and weaken trust in the design system.

## Goals

- Fix every review finding from the Batch 1 quality pass — from hardcoded theme values to missing disabled styles, accessibility gaps, and incomplete verification.
- Bring Studio, React components, tests, and living specs to a production-grade bar before starting Batch 2.
- Close the remaining foundation and verification tasks from `expand-react-component-library` that apply to shipped components.
- Establish durable conventions (module layout, label/checkbox API, Card composition, ThemeProvider behavior) that Batch 2 can follow.

## Non-goals

- Implement Batch 2 components (Tabs, Accordion, Breadcrumb, Dropdown Menu, Pagination).
- Introduce overlay primitives, icon packages, or new external dependencies unless required for an existing component fix.
- Publish a stable `1.0.0` release (that remains in `harden-release-and-quality`).
- Rewrite Studio as a React application.

## Affected capabilities

- React components
- Theme system
- Accessibility
- Theme Studio
- Distribution (documentation and test coverage only)

## Dependencies

- Existing Batch 1 component implementations in `@super-system/react`.
- Shared Studio UI in `@super-system/studio-ui`.
- Token compiler and default theme in `@super-system/tokens`.
- Vitest + happy-dom test harness.

## Risks

- ThemeProvider API clarification may affect early adopters if semantics change without documentation.
- Splitting `index.tsx` into modules touches many import paths — must preserve the public barrel export.
- Card composable additions are additive but expand the documented public API surface.
- Tooltip improvements (ID merging, wrapper behavior) need careful regression testing.

## Rollout

Deliver in four reviewed phases: critical token and state fixes, accessibility and Studio parity, structural and API polish, then verification and documentation closure. Each phase gets its own PR, runs `pnpm check`, and updates the live Studio demo. Batch 2 work starts only after this change is complete.
