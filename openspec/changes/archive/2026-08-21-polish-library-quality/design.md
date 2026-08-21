# Design: Polish Library Quality

## Overview

Quality hardening pass over the full shipped React library (Batches 1–3 + Icon). Work is grouped into six implementation phases after planning (Phase 0). Phases 1–5 can land as separate PRs under one OpenSpec change. Phase 6 closes release verification and archives related changes.

**Phase 1 status:** Implemented on branch `cursor/polish-phase1-blockers-2c3d` (draft PR #12).

---

## Phase 0 — Planning (this artifact)

Lock design decisions before further implementation:

| Decision | Choice |
|----------|--------|
| Tabs default selection | Auto-select first registered `TabsTrigger` when `value`/`defaultValue` unset (one-shot flag in context). Explicit `defaultValue` remains recommended for SSR. |
| Tabs panel mounting | Add `forceMount?: boolean` on `TabsContent`; default unmounts inactive panels; `forceMount` keeps DOM with `hidden`. |
| Dialog/Drawer ARIA | `DialogTitle`/`DialogDescription` (and drawer equivalents) register via `useLayoutEffect`; content sets `aria-labelledby` / `aria-describedby` only when registered. |
| Scroll lock | Module-level ref counter in `overlay-utils.ts`; body overflow hidden while count > 0. |
| Focus trap | When zero tabbables, focus dialog container (`tabIndex={-1}` on content). |
| Dropdown portal | Portal to `[data-ss-portal-root]` with fixed positioning via shared `useFloatingPosition` helper (extract from Popover). |
| Toast live region | Viewport `aria-live="assertive"` when any toast is destructive; otherwise `polite`. Per-toast `role` matches variant. |
| Demo CSS | Move `.ss-*--demo` rules to Studio-only CSS; not shipped in `@super-system/react/dist/styles.css`. |
| Studio radius | Expose `radius.sm` and `radius.lg` in sidebar OR derive proportionally from `radiusMd` with documented ratio. |
| Shared utilities | Extract `composeRefs` for trigger ref merge (Dialog, Drawer, Popover, Dropdown, Tooltip). |

---

## Phase 1 — P0 ship blockers

### Inline label CSS

`.ss-label--inline` is emitted by `Label`, `Checkbox`, and `Switch` but was only styled in Studio. Add to `packages/react/src/styles.css`:

```css
.ss-label--inline {
  display: inline-flex;
  align-items: center;
  gap: var(--ss-space-2, 8px);
  width: fit-content;
}
```

Studio `components.css` copies from React on build — no separate Studio edit required.

### Accordion item disabled

Extend `AccordionItemContext` to `{ value, disabled? }`. `AccordionTrigger` merges `disabled || itemDisabled` on the native button and skips `toggleItem` when disabled.

### Dialog / Drawer conditional ARIA

Provider tracks `hasTitle` / `hasDescription` via register/unregister callbacks invoked from title/description components in `useLayoutEffect`. Content omits ARIA reference attributes when flags are false.

**Alternative rejected:** Always require title — too breaking for confirm-only dialogs.

### Popover top positioning

For `side="top"`, anchor at `triggerRect.top - gap` and apply CSS transform:
- `align="start"` → `translateY(-100%)`
- `align="center"` → `translate(-50%, -100%)`
- `align="end"` → `translate(-100%, -100%)`

**Alternative rejected:** Measure content height in layout effect — extra reflow; transform is sufficient.

### Pagination ellipsis

Outer span is not `aria-hidden`. Decorative glyph wrapped in inner `aria-hidden="true"`; SR text "More pages" remains readable.

### Breadcrumb current page

`BreadcrumbPage` is plain text with `aria-current="page"` only — no `role="link"` or `aria-disabled`.

---

## Phase 2 — P1 accessibility and behavior

### Focus trap fallback

In `useFocusTrap`, when `getFocusableElements` returns empty, call `container.focus()` instead of only preventing Tab.

### Scroll lock stacking

```typescript
let scrollLockCount = 0;
// increment on active, decrement on cleanup
// apply overflow:hidden only when count goes 0→1
// remove only when count goes 1→0
```

### Tabs improvements

- **Auto-select:** First `TabsTrigger` to mount with empty active value calls `setValue` once (guard ref in context).
- **forceMount:** `TabsContent` renders children when `forceMount || selected`; uses `hidden={!selected}` when force-mounted.

### Toast live region

Compute viewport `aria-live` from toast list. Align per-toast roles with viewport politeness to avoid `polite` + `alert` conflicts.

### Tooltip ref merge

Extract `composeRefs` in `utils.ts`; apply in `Tooltip` trigger clone matching Dialog pattern.

### Label + Radio

Add `Radio.displayName = "Radio"` and `"Radio"` to `FORM_CONTROL_NAMES` so `Label` propagates `required`/`disabled` to wrapped radios.

---

## Phase 3 — P2 architecture and bundle hygiene

### Dropdown portal

Reuse `OverlayPortal` and shared floating-position hook. Menu content renders fixed-position in portal root; preserves existing keyboard behaviour and `role="menu"`.

### Demo CSS separation

Remove from `packages/react/src/styles.css`:
- `.ss-tooltip--demo`
- `.ss-dropdown--demo`
- `.ss-dialog--demo` / `.ss-drawer--demo`
- `.ss-popover--demo`

Add equivalents under `packages/studio-ui/src/styles.css` scoped to `.preview-theme` or demo sections.

### Popover role

Remove `role="dialog"` from non-modal popover content; rely on `aria-expanded` on trigger. Document in README.

### Shared overlay helpers (optional in same PR)

- `composeRefs`
- `useDismissOnOutsideClick` (Popover/Dropdown dedup)
- `useEscapeToClose`

---

## Phase 4 — Studio controllers and preview quality

### New sidebar controls

| Field | Behaviour |
|-------|-----------|
| `radiusSm`, `radiusLg` | Direct inputs or proportional derivation from `radiusMd` |
| `lineHeight` | Number input wired through `compileTheme` |
| `fontMono` | Text input + monospace preview snippet |
| `reducedMotion` | Checkbox — config persistence; preview note if not live-simulated |
| `mode.default` | Select (system/light/dark) — config only; preview toggle unchanged |

### Preview additions

- Accordion disabled item
- Tabs auto-select / disabled tab
- Dialog title-only and neither title nor description
- Popover `side="top"`
- Inline Label + Checkbox row

### Field help

Distinguish live-preview fields from config-only metadata (pattern from Batch 1 icons helper).

---

## Phase 5 — Foundation closure

### Semantic overlay tokens

Add to `default-theme.ts` and compiler:
- Overlay backdrop colour mix
- Overlay shadow token

Replace hardcoded shadow/backdrop mixes in dialog/drawer/popover CSS.

### Dependency policy

Document in README and OpenSpec: in-house primitives, no Radix; criteria for revisiting.

### Migration notes

`MIGRATION.md` or README section covering:
- Tabs auto-select
- Dropdown portaling
- BreadcrumbPage markup
- Dialog optional title/description ARIA

---

## Phase 6 — Verification and release

- Target **80+** component tests
- Fresh install smoke: Vite React, Next.js App Router
- Bump to `0.1.0-beta.2` if user requests publish
- Sync delta specs → living specs
- Archive `polish-library-quality`
- Complete and archive `expand-react-component-library`

---

## Alternatives considered

| Alternative | Why rejected |
|-------------|--------------|
| Require DialogTitle always | Breaks minimal confirm dialogs |
| Radix for overlays | Conflicts with zero-dependency primitive philosophy |
| Keep dropdown inline | Clipping in real layouts; portal is required for quality bar |
| Unmount tabs always | Loses form state; `forceMount` opt-in preserves flexibility |
| Auto-accept visual baselines | Deferred to `harden-release-and-quality` |

## Compatibility

All changes are patch-level for beta. Breaking markup changes (BreadcrumbPage) are accessibility corrections with migration notes. New props (`forceMount`) are additive.
