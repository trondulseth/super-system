# Design: Library Quality Pass 2

## Score-to-work mapping

Each phase closes a measurable gap. Exit criteria define what “10/10” means for that dimension.

### 1. Visual/token consistency (7 → 10)

**Fixes**

- Add missing `.ss-line-chart--muted` and `.ss-donut-chart--muted` CSS (parity with sparkline/bar).
- Introduce `--ss-color-success` and `--ss-color-success-foreground` in theme schema, compiler, and defaults; replace `#15803d` in KPI trend-up.
- Unify overlay shadows: drawer and toast use `--ss-overlay-shadow` (remove hardcoded box-shadows).
- Replace literal `white` in bar gradient with `var(--ss-color-background)`.
- Remove `!important` from horizontal bar height — use flex/grid sizing instead.
- Add chart reduced-motion overrides (disable bar/donut transitions under `prefers-reduced-motion`).
- Remove dead CSS modifier classes or wire them to documented positioning (popover/dropdown side classes).

**10/10 bar:** Every component color, shadow, and motion derives from tokens; no hardcoded hex in component CSS; all four chart tones render correctly in light and dark.

### 2. Default theme prettiness (8 → 10)

**Fixes**

- Differentiate light `secondary` (`#e2e8f0` or similar) from `muted` (`#f1f5f9`).
- Set light `focus` distinct from `primary` (e.g. `#3b82f6` ring hue or lighter mix).
- Add success colors to light/dark palettes with contrast-validated pairs.
- Apply `--ss-font-mono` in at least one visible component context (table numerics, code in alerts, or KPI values) so the token is meaningful.
- Document semantic color roles in default-theme comments.

**10/10 bar:** Default theme has distinct semantic surfaces, accessible focus/success/destructive pairs, and every typography token visible in preview.

### 3. Accessibility (7 → 10)

**Fixes**

| Finding | Approach |
|---------|----------|
| Close buttons unnamed | Default `aria-label="Close"` on Dialog/Drawer/Popover close; allow override via props |
| Title-less modals | `DialogContent`/`DrawerContent` accept optional `aria-label`; dev-only `console.warn` when neither title nor aria-label |
| Tooltips on disabled controls | Wrap disabled triggers in `<span className="ss-tooltip__trigger-wrap">` with `display: inline-flex` and pointer-events forwarding pattern |
| Shallow label propagation | Document limitation + add `htmlFor`/`id` example; optional deep-child walk behind prop `propagateDeep?: boolean` (default false to avoid surprises) |
| Background not inert | Set `aria-hidden="true"` on `#ss-overlay-root` siblings or use `inert` on `document.body` children except portal when modal open (ref-counted) |
| Vertical Divider | Change to `<div role="separator" aria-orientation="vertical">` with decorative option |
| Popover missing `aria-haspopup` | Add `aria-haspopup="dialog"` or `"true"` on popover trigger |
| Tabs auto-select disabled | Skip disabled triggers when auto-selecting first tab |
| Pagination unavailable pages | Add `PaginationPrevious`/`PaginationNext` disabled pattern with `aria-disabled` + `tabIndex={-1}` when `isActive` prop or href absent |
| Chart a11y | Add optional `dataTable` prop rendering visually hidden `<table>` for screen readers; improve default aria-labels |
| Toast double-announce | Use viewport `aria-live="polite"` always; rely on toast `role="alert"` only for destructive (remove assertive from viewport when mixed) |

**10/10 bar:** Automated tests cover every fix; manual checklist passes for dialog, tooltip-on-disabled, charts with data table, pagination disabled state.

### 4. Code architecture (8 → 10)

**Fixes**

| Finding | Approach |
|---------|----------|
| Floating position stale on scroll | Add `resize` + `scroll` listeners (capture phase on window) in `useFloatingPosition`; optional viewport flip when content would clip |
| BarChart duplicate keys | Use `key={\`${entry.label}-${index}\`}` or require `id` on data entries |
| Controlled tabs orphan value | When controlled `value` matches no trigger, fall back to first enabled tab or warn |
| Sparkline misleading trend label | Use "flat" when `\|last-first\| < epsilon` |
| KpiCard `--default` noise | Remove modifier class when variant is default (emit base class only) |
| Accordion `collapsible` in multiple mode | Document in prop JSDoc; no behavior change |
| Button/Label displayName | Add for DevTools consistency |
| Empty hamburger panel CSS | Add `.ss-hamburger-menu__panel` width/height rules or document as alias of drawer-left |
| Page shell responsive | Add `AppShell` prop `sidebarCollapsible` + CSS media query hiding sidebar below breakpoint (optional, document pattern) |

Extract shared close-button component internally (`OverlayClose`) to DRY Dialog/Drawer/Popover close.

**10/10 bar:** No known positioning bugs; no React key warnings; overlay utilities handle scroll/resize; internal patterns DRY without over-abstraction.

### 5. Studio controllers (6.5 → 10)

**Fixes**

| Controller | Implementation |
|------------|----------------|
| `spacing.unit` | Number input 2–8, wired in fill/collect |
| `radius.full` | Text input with pill preview snippet |
| Color fields | Hex text input synced with color picker both ways |
| Theme editing clarity | Static label "Editing: Light theme" / "Editing: Dark theme" updated on toggle |
| Contrast panel | Show both themes (tabs or combined list with theme badge) |
| Contrast pairs | Add focus/foreground, border/background, success/foreground |
| `reducedMotion` scope | Wrap reduced-motion CSS under `.preview-theme` only in preview injection |
| Numeric validation | Guard lineHeight (1.1–2), target (24–64), unit (2–8) before save |
| Icons row layout | Move field-help outside `.row` grid |
| `fontMono` | Either wire into preview (mono KPI value sample) or hide until used — prefer wire |
| `mode.default` | Add read-only badge in preview header showing effective saved default |

**10/10 bar:** Every persisted config field has a controller or explicit "advanced/config-only" label; no controller edits a field with zero effect; validation prevents corrupt saves.

### 6. Studio preview coverage (7 → 10)

**Add preview sections**

- Card (header/title/body/footer)
- LineChart + DonutChart with tone row (primary/secondary/destructive/muted)
- Toast neutral + destructive
- Focus-visible strip (button + input tab demo)
- KPI: description, footer, trend down, muted variant
- Layout: Stack, Row, Container sizes, Divider, Spacer
- Page shell: AppShell + Sidebar + active SidebarNavItem + HamburgerMenu drawer demo
- Drawer left + close button; dialog with close button
- Popover top alignment demo
- Table caption + footer

**Replace inline styles** in KPI/layout sections with `ss-stack`, `ss-row`, `ss-container` classes.

**10/10 bar:** Every export in `packages/react/src/index.tsx` has a representative static preview or documented N/A (ToastProvider runtime-only).

## Testing strategy

- Unit tests for each code fix (close aria-label, muted chart tones, tabs skip disabled, scroll listener mock, pagination disabled, divider role, success token KPI trend).
- CSS hygiene test: no `#15803d` or literal `white` in `styles.css`.
- Studio build + demo build in `pnpm check`.
- Manual: scroll while dropdown open, tooltip on disabled button, both theme contrast visible.

## Compatibility

- Additive token fields (`success`, `successForeground`) with defaults in compiler — existing configs merge defaults on load.
- Close button default aria-label is additive (consumers overriding still work).
- No export removals.

## Alternatives considered

- **Radix for overlays:** rejected; fix in-house positioning and a11y instead.
- **Remove `muted` chart tone:** rejected; fix CSS is smaller than API shrink.
- **Remove fontMono controller:** rejected; wiring token into preview is better UX.
