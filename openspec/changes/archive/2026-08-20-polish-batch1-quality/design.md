# Design: Polish Batch 1 Quality

## Overview

This change is a quality hardening pass over everything shipped in Batch 1. Work is grouped into four phases that can land as separate PRs while sharing one OpenSpec change. Each phase has clear acceptance criteria and test additions.

## Phase 1 — Token fidelity and disabled states (must-fix)

### Select chevron and checkbox checkmark

Hardcoded hex values in SVG data URLs break custom and dark themes. Replace inline `fill='%23475569'` and `fill='white'` backgrounds with **CSS mask techniques**:

```css
.ss-select {
  background-color: var(--ss-color-background);
  mask-image: url("data:image/svg+xml,..."); /* path only, no fill color */
  mask-repeat: no-repeat;
  mask-position: right var(--ss-space-2) center;
  mask-size: 1rem;
  -webkit-mask-image: /* same */;
}
```

For the select chevron, apply the mask on a `::after` pseudo-element positioned at the right edge so the native select background and padding stay intact. Color the chevron with `background-color: var(--ss-color-muted-foreground)`.

For the checkbox checkmark, use `:checked::after` with a mask and `background-color: var(--ss-color-primary-foreground)`.

**Alternative rejected:** Encoding theme colors at build time — would require regenerating component CSS per project.

### Missing `:disabled` styles

Add consistent disabled treatment to `.ss-input`, `.ss-textarea`, and `.ss-checkbox` matching Button/Select/Switch:

- `cursor: not-allowed`
- `opacity: 0.55`
- Preserve readable contrast (no gray override that breaks tokens)

### Studio semantic color controls

Extend `colorIds` in `packages/studio-ui/src/app.ts` and matching `<input type="color">` fields in `index.html`:

| Token | Purpose |
|-------|---------|
| `muted` | Surfaces (alerts, badges) |
| `mutedForeground` | Secondary text, chevrons |
| `border` | Control outlines |
| `destructive` | Errors, required asterisk |
| `destructiveForeground` | Text on destructive surfaces |
| `focus` | Focus ring base color |

Group controls under a new **Semantic colors** sidebar section between Brand and Typography.

---

## Phase 2 — Accessibility and Studio preview parity (should-fix)

### Label `required` and `disabled`

**Composition pattern** (Label wraps a single control child):

- When `required`, clone the child to add `required` and `aria-required="true"`.
- When `disabled`, clone the child to add `disabled` (and `aria-disabled` if the child supports it).

**`htmlFor` pattern** (Label associates by id):

- Document in README that the target control must carry `required` / `disabled` / `aria-required` itself.
- Studio preview examples shall demonstrate both patterns.

### Typography convention

Document and apply:

- **Field labels** (`Label`, `RadioGroup` legend): font-weight 600
- **Option labels** (`Radio` inline text): font-weight 400

This is intentional hierarchy, not a bug — update Studio preview comments and README so it reads as convention.

### Alert live region semantics

Add optional `liveRegion?: "alert" | "status"` (default `"alert"`). Map variants:

| Variant | Default live region | Rationale |
|---------|---------------------|-----------|
| `destructive` | `alert` | Urgent, interrupts |
| `primary` | `status` | Informational success |
| `neutral` | `status` | Non-urgent context |

Consumers can override. Update spec accordingly.

### Studio preview gaps

Add static preview rows for:

- Alert `neutral` variant
- Input `disabled`
- Select, Checkbox, Switch `invalid` (+ `aria-invalid`)
- Textarea `disabled` (for symmetry)

---

## Phase 3 — Component architecture and API consistency (medium)

### Module split

Split `packages/react/src/index.tsx` into focused modules while keeping `index.tsx` as the public barrel:

```
packages/react/src/
  index.tsx          # re-exports only
  utils.ts           # classes(), mergeHandlers()
  button.tsx
  input.tsx
  textarea.tsx
  label.tsx
  checkbox.tsx
  radio-group.tsx
  switch.tsx
  select.tsx
  alert.tsx
  spinner.tsx
  skeleton.tsx
  tooltip.tsx
  badge.tsx
  card.tsx
  theme-provider.tsx
```

No change to package `"exports"` — consumers still import from `@super-system/react`.

### Checkbox and Switch label prop

Align with `Radio` by adding an optional `label?: React.ReactNode`:

- When `label` is provided, render a wrapping `<label className="ss-label ss-label--inline">` with the input inside.
- `className` applies to the **outer label wrapper** when `label` is set; otherwise remains on the input (preserving current headless usage).
- Document the convention in README.

### Card composable primitives

Add additive exports matching the living spec:

- `Card` — surface container (existing)
- `CardHeader` — top section with bottom padding adjustment
- `CardTitle` — semantic heading slot
- `CardBody` — main content
- `CardFooter` — actions row with top border optional via class

All token-driven; no breaking change to bare `Card`.

### Tooltip hardening

1. **Merge `aria-describedby`:** When open, join existing IDs with the tooltip ID (space-separated, deduplicated).
2. **Wrapper layout:** Change wrapper to `display: inline` by default; add optional `display?: "inline" | "inline-flex" | "block"` prop for layout-sensitive triggers.
3. **Defer portal** to Batch 3 overlays — document clipping limitation in README.

### ThemeProvider behavior

Clarify and implement:

| Prop | Behavior |
|------|----------|
| `defaultMode` | Initial mode when no stored preference (`"light" \| "dark" \| "system"`, default `"system"`) |
| `storageKey` | localStorage key (unchanged) |
| `enablePersistence` | When `true` (default), read/write localStorage; when `false`, ignore storage |

Implementation:

- On mount, read storage only when `enablePersistence` is true.
- When effective mode is `"system"`, subscribe to `(prefers-color-scheme: dark)` via `matchMedia` and update `data-theme` / remove attribute accordingly.
- Clean up listener on unmount.

**Migration:** Existing `mode` prop renamed to `defaultMode` with re-export alias `mode` deprecated in JSDoc for one beta cycle (both accepted, `defaultMode` wins if both set).

### Invalid state visual treatment

Extend `--invalid` modifiers beyond border-only:

```css
.ss-input--invalid {
  border-color: var(--ss-color-destructive);
  background: color-mix(in srgb, var(--ss-color-destructive) 6%, var(--ss-color-background));
}
```

Apply consistently to Input, Textarea, Checkbox, Radio, Switch, Select.

### Switch unchecked thumb contrast

Use `var(--ss-color-foreground)` or `var(--ss-color-muted-foreground)` for the thumb in unchecked state instead of `background` (which matches track and reduces visibility).

### Reduced motion in component CSS

Add a standalone fallback in `styles.css` (not only generated theme CSS):

```css
@media (prefers-reduced-motion: reduce) {
  .ss-spinner { animation: none; }
  .ss-skeleton { animation: none; }
  .ss-button, .ss-switch { transition: none; }
}
```

### Forced colors (high contrast)

Add `@media (forced-colors: active)` overrides for interactive controls:

- Preserve visible borders on inputs, checkbox, radio, switch, select
- Use `Highlight` / `ButtonText` system colors where token fills would be suppressed

---

## Phase 4 — Verification, docs, and Batch 1 closure

### Test matrix (new / expanded)

| Component | Tests to add |
|-----------|--------------|
| Button | loading, `aria-busy`, disabled-when-loading, ref forward |
| Badge | variants |
| Card | composable layout, ref/className |
| ThemeProvider | system preference listener, storage on/off, defaultMode |
| Label | required/disabled child cloning |
| Tooltip | aria-describedby merge with pre-existing id |
| Input/Textarea/Checkbox | disabled styling class presence, invalid background |
| Alert | liveRegion prop per variant |

Add CSS snapshot or computed-style checks where happy-dom supports them; document manual forced-colors checklist in README.

### Studio icons setting

Add helper text under the Icon library select: *"Saved to config for future icon adapter setup; preview icons are not rendered yet."*

### Documentation

- README: ThemeProvider API update, Label association patterns, Tooltip clipping note, Card composition example
- Close applicable unchecked items in `expand-react-component-library/tasks.md` (verification subset for Batch 1 only)

### Bundle check

Run clean import smoke test verifying tree-shaking still works after module split (existing or new script in `pnpm check`).

---

## Alternatives considered

| Decision | Alternative | Why rejected |
|----------|-------------|--------------|
| CSS mask for icons | Per-theme generated CSS | Couples component package to build pipeline |
| Label context API | React context for form fields | Over-engineered for beta; cloneElement covers composition |
| Tooltip portal now | Full Radix-style portal | Scope belongs with Batch 3 overlays |
| Remove Radio `label` prop | Force external Label only | Worse DX; Checkbox/Switch should gain parity instead |
| Card breaking change | Single Card only | Violates living spec promise |

## Compatibility

All changes are additive or visual unless ThemeProvider prop rename is documented with backward-compatible alias. No token schema changes required.
