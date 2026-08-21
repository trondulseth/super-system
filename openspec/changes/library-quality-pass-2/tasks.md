# Tasks: Library Quality Pass 2

> **Goal:** 10/10 on all six review dimensions. See `design.md` for score-to-work mapping.

## Phase 0 — Planning

- [x] Create OpenSpec change `library-quality-pass-2` with proposal, design, tasks, delta specs.
- [x] Validate with `openspec validate library-quality-pass-2 --strict`.
- [x] Update `SUPERSTATE.md` active handoff to this change.

---

## Phase 1 — Visual/token consistency (7 → 10)

### CSS bugs and token gaps

- [ ] Add `.ss-line-chart--muted` line and area fill rules in `packages/react/src/styles.css`.
- [ ] Add `.ss-donut-chart--muted` stroke rule in `styles.css`.
- [ ] Add `--ss-color-success` and `--ss-color-success-foreground` to theme types, `default-theme.ts`, and `compiler.ts`.
- [ ] Replace `#15803d` in `.ss-kpi-card__trend--up` with success tokens.
- [ ] Change drawer `box-shadow` (line ~741) to `var(--ss-overlay-shadow, ...)`.
- [ ] Change toast `box-shadow` (line ~800) to `var(--ss-overlay-shadow, ...)`.
- [ ] Replace literal `white` in bar gradient with `var(--ss-color-background)`.
- [ ] Remove `!important` from horizontal bar height; fix layout via CSS flex/grid.
- [ ] Add chart transition overrides under `@media (prefers-reduced-motion: reduce)`.
- [ ] Remove or implement dead CSS: `.ss-popover__content--*`, `.ss-dropdown__content--start/end`.
- [ ] Stop emitting `ss-kpi-card--default` when variant is default.

### Tests

- [ ] Test LineChart and DonutChart `tone="muted"` render with computed stroke/fill color.
- [ ] Test KPI trend-up uses success token (CSS custom property assertion or snapshot).
- [ ] CSS hygiene test: no `#15803d`, no bare `white` in production stylesheet.

**Exit:** All chart tones visible in light/dark; zero hardcoded hex in component CSS; all overlays use `--ss-overlay-shadow`.

---

## Phase 2 — Default theme prettiness (8 → 10)

- [ ] Differentiate light `secondary` from `muted` in `default-theme.ts`.
- [ ] Set light `focus` distinct from `primary`; verify dark focus remains distinct.
- [ ] Add light/dark success + successForeground with contrast validation.
- [ ] Extend `contrast.ts` pairs for success and focus combinations.
- [ ] Apply `--ss-font-mono` in component CSS (table numerics, code snippet in alert, or KPI value option).
- [ ] Update root `super-system.json` template if present.
- [ ] Document new tokens in `MIGRATION.md`.

### Tests

- [ ] Contrast tests pass for new success pairs in default theme.
- [ ] Visual/manual: secondary vs muted surfaces distinguishable in Studio preview.

**Exit:** Every typography/color token has visible effect; semantic surfaces distinct; focus/success/destructive all contrast-valid.

---

## Phase 3 — Accessibility (7 → 10)

### Component fixes

- [ ] Default `aria-label="Close"` on DialogClose, DrawerClose, PopoverClose (overridable).
- [ ] Add optional `aria-label` on DialogContent/DrawerContent; dev warn when no title and no label.
- [ ] Implement disabled-trigger tooltip wrapper pattern in `tooltip.tsx` + CSS.
- [ ] Add ref-counted background inert/`aria-hidden` in `overlay-utils.ts` for modals.
- [ ] Change vertical `Divider` to `role="separator"` with `aria-orientation="vertical"`.
- [ ] Add `aria-haspopup` on Popover trigger.
- [ ] Skip disabled tabs in auto-select (`tabs.tsx`).
- [ ] Handle controlled tabs orphan value (fallback or warn).
- [ ] Pagination previous/next unavailable state with `aria-disabled`.
- [ ] Add optional `dataTable` / accessible data prop on charts (visually hidden table).
- [ ] Fix sparkline aria-label: "flat" when delta below epsilon.
- [ ] Refine toast live region: avoid viewport+toast double assertive announcement.

### Documentation

- [ ] Document label shallow propagation + recommended `htmlFor` pattern in component docs/README.
- [ ] Document tooltip-on-disabled pattern.

### Tests

- [ ] Close buttons expose accessible name by default.
- [ ] Tooltip on disabled button shows content (pointer + focus where applicable).
- [ ] Tabs skip disabled first trigger.
- [ ] Pagination previous disabled on first page.
- [ ] Vertical divider has separator role.
- [ ] Chart dataTable exposes values to a11y tree.
- [ ] Modal background inert when open (DOM assertion).

**Exit:** All P0/P1 a11y findings covered by automated tests; manual SR checklist documented and passing.

---

## Phase 4 — Code architecture (8 → 10)

- [ ] Add scroll/resize listeners to `useFloatingPosition` (window capture); cleanup on close.
- [ ] Optional viewport flip when floating content would clip (design: flip to opposite side).
- [ ] BarChart stable keys: `id` field on data or index suffix.
- [ ] Extract internal `OverlayClose` shared by dialog/drawer/popover (DRY, keep public exports).
- [ ] Add `Button.displayName` and `Label.displayName`.
- [ ] Add `.ss-hamburger-menu__panel` CSS or document drawer-left alias.
- [ ] Accordion `collapsible` JSDoc for multiple mode.
- [ ] Optional: `AppShell` responsive sidebar collapse prop + CSS (document mobile pattern).

### Tests

- [ ] Mock scroll event repositions floating content.
- [ ] BarChart duplicate labels no React key warnings.
- [ ] Controlled tabs with invalid value falls back gracefully.

**Exit:** No positioning bugs in manual scroll test; no console warnings in test suite; overlay utilities ref-count inert correctly.

---

## Phase 5 — Studio controllers (6.5 → 10)

### New/edited controllers (`app.ts`, `index.html`)

- [ ] Add `spacing.unit` number input; wire fill/collect.
- [ ] Add `radius.full` text input; wire fill/collect.
- [ ] Add success color + successForeground color inputs (light/dark via toggle).
- [ ] Pair hex text inputs with every color picker; sync both ways.
- [ ] Add static label "Editing: Light theme" / "Editing: Dark theme".
- [ ] Contrast panel: show both themes (tabs or combined with badge).
- [ ] Extend contrast pairs: focus, border, success.
- [ ] Scope reduced-motion preview CSS to `.preview-theme` in `preview-theme.ts`.
- [ ] Validate lineHeight (1.1–2), target (24–64), unit (2–8) before save.
- [ ] Move icons field-help outside `.row` grid.
- [ ] Show saved `mode.default` as read-only badge in preview header.
- [ ] Wire `fontMono` into preview sample (mono text block).

### Tests

- [ ] Studio unit/integration: collect persists unit and radius.full.
- [ ] Invalid line height blocked on save.

**Exit:** Every config field has controller or explicit config-only label; no dead controllers; save validation prevents corrupt JSON.

---

## Phase 6 — Studio preview coverage (7 → 10)

Add static preview sections in `index.html` (use demo modifiers from `styles.css`):

- [ ] Card composable (header/title/body/footer).
- [ ] LineChart + DonutChart; tone row for all four tones.
- [ ] Toast neutral + destructive variants.
- [ ] Focus-visible strip (button + input).
- [ ] KPI: description, footer, trend down, muted variant.
- [ ] Layout: Stack, Row, Container (sm/md/lg), Divider, Spacer.
- [ ] Page shell: AppShell + Sidebar + SidebarNavItem active + HamburgerMenu drawer demo.
- [ ] Drawer left with close; dialog with close button.
- [ ] Popover `side="top"` demo.
- [ ] Table caption + footer.
- [ ] Replace inline styles in KPI/layout sections with layout primitive classes.

### Verification

- [ ] Checklist: every `index.tsx` export has preview or documented runtime-only exception.
- [ ] `pnpm check` green including studio demo build.

**Exit:** Preview checklist 100%; density/unit changes visible in layout sections.

---

## Phase 7 — Release verification

- [ ] Reach 100+ automated tests (estimate +20 from this change).
- [ ] Run `pnpm check`.
- [ ] Fresh-install smoke: Vite + Next.js with success token + new close defaults.
- [ ] Sync delta specs to living specs.
- [ ] Archive `library-quality-pass-2`.
- [ ] Journal entry documenting 10/10 checklist completion.

---

## Score checklist (must all pass)

| Dimension | Verification |
|-----------|--------------|
| Code architecture 10/10 | Scroll-safe overlays, DRY close, no key warnings, ref-count inert |
| Accessibility 10/10 | All a11y tests green + manual SR checklist |
| Visual/token consistency 10/10 | No hardcoded colors; all tones/shadows tokenized |
| Default theme prettiness 10/10 | Distinct surfaces; success/focus tokens; mono visible |
| Studio controllers 10/10 | Full field coverage + validation + dual-theme contrast |
| Studio preview coverage 10/10 | Export checklist complete |

## Optional follow-up (out of scope)

- [ ] Publish `0.1.0-beta.2`.
- [ ] Visual regression CI (`harden-release-and-quality`).
