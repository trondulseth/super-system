# Tasks: Polish Batch 1 Quality

## Phase 1 — Critical fixes (PR 1)

Token leaks and missing states that break themes or misrepresent control state.

- [x] Replace Select chevron hardcoded `#475569` with token-driven mask/color (`styles.css`).
- [x] Replace Checkbox checkmark hardcoded white SVG fill with `primaryForeground` mask.
- [x] Add `:disabled` styles for Input, Textarea, and Checkbox (match Button/Select/Switch pattern).
- [x] Add Studio sidebar controls for `muted`, `mutedForeground`, `border`, `destructive`, `destructiveForeground`, and `focus`.
- [x] Wire new Studio color inputs through `fill()`, `collect()`, and contrast checks in `app.ts`.
- [x] Copy updated `components.css` to Studio after React style changes.
- [x] Add unit tests for disabled Input/Textarea/Checkbox rendering.
- [x] Run `pnpm check`.

## Phase 2 — Accessibility and Studio preview (PR 2)

Behavior and preview parity for assistive technology and the live demo.

- [x] Implement Label child cloning for `required` → `required` + `aria-required="true"`.
- [x] Implement Label child cloning for `disabled` → `disabled` on associated control.
- [x] Document `htmlFor` pattern: consumer must set `required`/`disabled` on the target control.
- [x] Add Alert `liveRegion?: "alert" | "status"` with variant-aware defaults.
- [x] Add Studio preview rows: Alert neutral, Input disabled, Textarea disabled, Select/Checkbox/Switch invalid.
- [x] Document label typography convention (600 field labels, 400 option labels) in README.
- [x] Add tests: Label required/disabled propagation, Alert liveRegion defaults.
- [x] Run `pnpm check`.

## Phase 3 — Architecture and API polish (PR 3)

Structural improvements and consistency before expanding the library.

- [x] Split `packages/react/src/index.tsx` into per-component modules with barrel re-export.
- [x] Add optional `label` prop to Checkbox and Switch (Radio parity); document `className` placement rules.
- [x] Add `CardHeader`, `CardTitle`, `CardBody`, `CardFooter` composable exports and styles.
- [x] Merge Tooltip `aria-describedby` with existing trigger IDs when open.
- [x] Add Tooltip `display` prop for layout-sensitive triggers; document clipping limitation.
- [x] Refactor ThemeProvider: `defaultMode`, `enablePersistence`, `matchMedia` listener for system mode.
- [x] Keep backward-compatible `mode` prop alias with JSDoc deprecation note.
- [x] Extend invalid-state styling with subtle destructive background tint on all form controls.
- [x] Improve Switch unchecked thumb contrast.
- [x] Add `prefers-reduced-motion` and `forced-colors` rules to `styles.css`.
- [x] Add tests: Tooltip ID merge, Card composition, Checkbox/Switch label prop, ThemeProvider system/storage.
- [x] Run `pnpm check`.

## Phase 4 — Verification closure and docs (PR 4)

Complete Batch 1 quality bar and close related expand-change verification items.

- [x] Add Button tests: loading, `aria-busy`, disabled-when-loading, ref forward.
- [x] Add Badge variant tests.
- [x] Add Card composable layout tests.
- [x] Add ThemeProvider tests: OS theme change simulation, persistence on/off.
- [x] Add Input/Textarea invalid background visual regression or class assertion tests.
- [x] Add Studio icons metadata helper text in `index.html`.
- [x] Update README: ThemeProvider API, Label patterns, Tooltip limits, Card composition, forced-colors manual checklist.
- [x] Mark applicable Batch 1 verification items complete in `expand-react-component-library/tasks.md`.
- [x] Verify tree-shakable imports still pass after module split.
- [x] Run full `pnpm check` and confirm GitHub Pages demo deploy succeeds.

## Exit criteria

- [x] All 25 review findings from the Batch 1 quality pass are addressed or explicitly documented with rationale.
- [ ] Living specs synced via archive/sync after implementation.
- [x] No hardcoded theme colors remain in `@super-system/react` component CSS.
- [x] Studio demo reflects every Batch 1 component state (default, disabled, invalid, neutral).
- [x] Batch 2 (`expand-react-component-library` navigation batch) does not start until this change is archived.
