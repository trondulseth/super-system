# Polish Library Quality

## Problem

Batches 1–3 and the Icon wrapper are merged, but a full code review surfaced correctness gaps, accessibility bugs, incomplete Studio token coverage, demo CSS leaking into the production bundle, and overlay edge cases (focus trap, scroll lock, dropdown clipping). Shipping release verification and archiving `expand-react-component-library` on this foundation would weaken trust in the design system.

## Goals

- Fix every review finding from the post–Batch 3 quality pass — from missing `.ss-label--inline` CSS to conditional dialog ARIA, accordion disabled state, popover positioning, and pagination/breadcrumb semantics.
- Harden overlay primitives (focus trap fallback, stacked scroll lock, dropdown portal, shared floating-position utilities).
- Improve Tabs defaults, panel mounting strategy, Toast live-region consistency, Tooltip ref forwarding, and Label/Radio propagation.
- Complete Studio sidebar coverage for high-impact tokens or document config-only fields clearly.
- Remove demo-only CSS from `@super-system/react` production styles; add semantic overlay tokens and migration notes.
- Close remaining `expand-react-component-library` foundation tasks (overlay tokens, dependency policy, release verification) before archiving that change.
- Reach **80+** automated component tests and a documented fresh-install smoke path.

## Non-goals

- Publish stable `1.0.0` (remains in `harden-release-and-quality`).
- Add visual-regression CI or axe-core automation (deferred to `harden-release-and-quality`).
- Portal Tooltip (document clipping limit; dropdown portal is higher priority).
- Rewrite Studio as a React application.
- Introduce Radix/shadcn or other external primitive dependencies.

## Affected capabilities

- React components
- Accessibility
- Theme Studio
- Theme system (overlay semantic tokens)
- Distribution (migration notes, release verification)

## Dependencies

- Existing component implementations in `@super-system/react` (Batches 1–3 + Icon).
- Shared Studio UI in `@super-system/studio-ui`.
- Token compiler and default theme in `@super-system/tokens`.
- Vitest + happy-dom test harness.
- `expand-react-component-library` must archive after this change and release verification complete.

## Risks

- Tabs auto-select on first trigger may differ from explicit `defaultValue` expectations — document and test SSR behaviour.
- Dropdown portal changes stacking context and positioning — regression test in overflow-hidden containers.
- Dialog/Drawer conditional ARIA uses layout-effect registration — one render pass before labels attach; acceptable if documented.
- Demo CSS removal must not break Studio static previews — verify `build:demo` after move.
- Phase 1 may land on PR #12 before later phases — tasks track per-phase completion.

## Rollout

Deliver in six reviewed phases (0–6): OpenSpec planning, P0 blockers, P1 accessibility, P2 architecture, Studio controllers, foundation closure, release verification. Each implementation phase gets its own PR, runs `pnpm check`, and updates tests/docs. Archive `polish-library-quality`, sync living specs, complete expand change release tasks, then archive `expand-react-component-library`.
