# Tasks: Polish Library Quality

> **Status:** Complete. Archived 2026-08-21 after release verification and spec sync.

## Phase 0 — Planning

- [x] Create OpenSpec change `polish-library-quality` with proposal, design, tasks, and delta specs.
- [x] Lock design decisions (Tabs, Dialog ARIA, scroll lock, dropdown portal, demo CSS, Studio radius).
- [x] Update `SUPERSTATE.md` active handoff to this change.
- [x] Append journal entry documenting Phase 0 completion.

## Phase 1 — P0 ship blockers

- [x] Add `.ss-label--inline` to `packages/react/src/styles.css`.
- [x] Propagate `AccordionItem disabled` to `AccordionTrigger`.
- [x] Set Dialog/Drawer `aria-labelledby` and `aria-describedby` only when title/description render.
- [x] Fix Popover `side="top"` positioning with `translateY(-100%)` transform.
- [x] Fix `PaginationEllipsis` — SR text not hidden by parent `aria-hidden`.
- [x] Fix `BreadcrumbPage` — remove `role="link"`; keep `aria-current="page"`.
- [x] Add unit tests for all six fixes.

## Phase 2 — P1 accessibility and behavior

- [x] Focus trap fallback: focus container when no tabbable children (`overlay-utils.ts`).
- [x] Scroll lock stacking with module-level ref counter (`overlay-utils.ts`).
- [x] Tabs auto-select first trigger when value/defaultValue unset.
- [x] Add `forceMount?: boolean` on `TabsContent`; preserve DOM with `hidden` when force-mounted.
- [x] Toast viewport `aria-live` strategy aligned with per-toast roles.
- [x] Extract `composeRefs` in `utils.ts`; merge refs on Tooltip trigger.
- [x] Add `Radio.displayName`; include `Radio` in `FORM_CONTROL_NAMES`; test Label propagation.
- [x] Add unit tests for all Phase 2 items.

## Phase 3 — P2 architecture and bundle hygiene

- [x] Extract shared `useFloatingPosition` in `overlay-utils.ts`.
- [x] Portal `DropdownMenuContent` via `OverlayPortal` with fixed positioning.
- [x] Remove `.ss-*--demo` rules from `packages/react/src/styles.css`.
- [x] Add demo modifier styles to Studio-only CSS; verify static previews.
- [x] Remove `role="dialog"` from non-modal Popover content.
- [x] Extract `useDismissOnOutsideClick` and `useEscapeToClose` shared helpers.
- [x] Add dropdown portal and CSS bundle tests.

## Phase 4 — Studio controllers and preview quality

- [x] Add Studio controls for `radiusSm` and `radiusLg`.
- [x] Add Studio control for `typography.lineHeight`.
- [x] Add Studio control for `typography.fontMono`.
- [x] Add Studio controls/help for `accessibility.reducedMotion` and `mode.default`.
- [x] Add preview rows: KPI/charts, layout/page shell, top bar.
- [x] Wire new fields through `fill()`, `collect()`, and `updatePreviewTheme`.

## Phase 5 — Foundation closure + dashboard components

- [x] Add semantic overlay tokens via compiler (`--ss-overlay-backdrop`, `--ss-overlay-shadow`).
- [x] Add migration notes in `MIGRATION.md`.
- [x] Add chart components: Sparkline, BarChart, LineChart, DonutChart.
- [x] Add KPI card composables with chart slot.
- [x] Add flex layout primitives: Box, Stack, Row, Container, Spacer, Divider.
- [x] Add page shell: AppShell, Sidebar, PageHeader, PageFooter, Main, TopBar, HamburgerMenu.

## Phase 6 — Verification and release

- [x] Reach 80+ automated component tests (84 total).
- [x] Run `pnpm check` successfully.
- [x] Verify fresh install in Vite React, Next.js App Router (see journal 2026-08-21).
- [ ] Publish `0.1.0-beta.2` if user requests release.
- [x] Sync delta specs to living specs.
- [x] Archive `polish-library-quality`.
- [x] Archive `expand-react-component-library`.

## Exit criteria

- [x] All review findings addressed or documented.
- [x] No demo-only CSS in production `@super-system/react` bundle.
- [x] Studio covers high-impact tokens or documents config-only fields.
- [x] `pnpm check` green with 80+ component tests.
- [x] Fresh-install smoke documented and passing.
- [x] Living specs synced; both polish and expand changes archived.
