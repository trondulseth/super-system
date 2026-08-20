# Tasks: Polish Library Quality

> **Status:** Phase 0 planning complete. Phase 1 implemented on PR #12 (`cursor/polish-phase1-blockers-2c3d`). Phases 2–6 open.

## Phase 0 — Planning

- [x] Create OpenSpec change `polish-library-quality` with proposal, design, tasks, and delta specs.
- [x] Lock design decisions (Tabs, Dialog ARIA, scroll lock, dropdown portal, demo CSS, Studio radius).
- [x] Update `SUPERSTATE.md` active handoff to this change.
- [x] Append journal entry documenting Phase 0 completion.

## Phase 1 — P0 ship blockers (PR #12)

- [x] Add `.ss-label--inline` to `packages/react/src/styles.css`.
- [x] Propagate `AccordionItem disabled` to `AccordionTrigger`.
- [x] Set Dialog/Drawer `aria-labelledby` and `aria-describedby` only when title/description render.
- [x] Fix Popover `side="top"` positioning with `translateY(-100%)` transform.
- [x] Fix `PaginationEllipsis` — SR text not hidden by parent `aria-hidden`.
- [x] Fix `BreadcrumbPage` — remove `role="link"`; keep `aria-current="page"`.
- [x] Add unit tests for all six fixes.
- [x] Run `pnpm check` (71 tests).

## Phase 2 — P1 accessibility and behavior (PR 2)

- [ ] Focus trap fallback: focus container when no tabbable children (`overlay-utils.ts`).
- [ ] Scroll lock stacking with module-level ref counter (`overlay-utils.ts`).
- [ ] Tabs auto-select first trigger when value/defaultValue unset.
- [ ] Add `forceMount?: boolean` on `TabsContent`; preserve DOM with `hidden` when force-mounted.
- [ ] Toast viewport `aria-live` strategy aligned with per-toast roles.
- [ ] Extract `composeRefs` in `utils.ts`; merge refs on Tooltip trigger.
- [ ] Add `Radio.displayName`; include `Radio` in `FORM_CONTROL_NAMES`; test Label propagation.
- [ ] Add unit tests for all Phase 2 items.
- [ ] Run `pnpm check`.

## Phase 3 — P2 architecture and bundle hygiene (PR 3)

- [ ] Extract shared `useFloatingPosition` (or equivalent) from Popover positioning logic.
- [ ] Portal `DropdownMenuContent` via `OverlayPortal` with fixed positioning.
- [ ] Remove `.ss-*--demo` rules from `packages/react/src/styles.css`.
- [ ] Add demo modifier styles to Studio-only CSS; verify static previews.
- [ ] Remove `role="dialog"` from non-modal Popover content; document in README.
- [ ] Optionally extract `useDismissOnOutsideClick` and `useEscapeToClose` shared helpers.
- [ ] Add dropdown portal and CSS bundle tests.
- [ ] Run `pnpm check`.

## Phase 4 — Studio controllers and preview quality (PR 4)

- [ ] Add Studio controls for `radiusSm` and `radiusLg` (or proportional derivation from `radiusMd`).
- [ ] Add Studio control for `typography.lineHeight`.
- [ ] Add Studio control for `typography.fontMono` with monospace preview snippet.
- [ ] Add Studio control or help text for `accessibility.reducedMotion` and `mode.default`.
- [ ] Add preview rows: accordion disabled, tabs auto-select, dialog ARIA variants, popover top, inline label.
- [ ] Wire new fields through `fill()`, `collect()`, and `updatePreviewTheme`.
- [ ] Run `pnpm check` and verify studio demo build.

## Phase 5 — Foundation closure (PR 5)

- [ ] Add semantic overlay tokens (backdrop, shadow) to `default-theme.ts` and compiler.
- [ ] Replace hardcoded overlay shadow/backdrop in component CSS with tokens.
- [ ] Document dependency/primitive philosophy in README and expand change design notes.
- [ ] Add migration notes (Tabs, Dropdown portal, BreadcrumbPage, Dialog ARIA).
- [ ] Mark expand-change foundation tasks complete where applicable.
- [ ] Run `pnpm check`.

## Phase 6 — Verification and release (PR 6)

- [ ] Reach 80+ automated component tests.
- [ ] Verify fresh install in Vite React, Next.js App Router (document in journal).
- [ ] Publish `0.1.0-beta.2` if user requests release.
- [ ] Sync delta specs to living specs (`react-components`, `accessibility`, `theme-studio`, `theme-system`).
- [ ] Archive `polish-library-quality`.
- [ ] Complete expand-change release verification tasks.
- [ ] Archive `expand-react-component-library`.
- [ ] Update `SUPERSTATE.md` handoff to `harden-release-and-quality`.

## Exit criteria

- [ ] All review findings addressed or explicitly documented with rationale.
- [ ] No demo-only CSS in production `@super-system/react` bundle.
- [ ] Studio covers high-impact tokens or documents config-only fields.
- [ ] `pnpm check` green with 80+ component tests.
- [ ] Fresh-install smoke documented and passing.
- [ ] Living specs synced; both polish and expand changes archived.
