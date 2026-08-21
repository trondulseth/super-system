# Audit & accessibility

[← Documentation](./README.md) · [Getting started](./getting-started.md) · [Migration guide](./migration-guide.md) · [Theme](./theme.md) · [CLI](./cli.md)

## Find inconsistent UI with Audit

Run this inside any existing project:

```bash
npx @super-system/cli audit
```

Audit looks for common sources of UI drift:

- raw `<button>` elements;
- raw inputs, selects, and textareas;
- hard-coded hex/RGB colors;
- arbitrary Tailwind spacing values;
- inline style objects;
- images without `alt` attributes.

Example output:

```text
Found 3 potential design-system violations:

src/App.tsx:18  raw-button       Use the shared Button component.
src/App.tsx:27  hardcoded-color  Replace hardcoded color with a semantic token.
src/Hero.tsx:9  image-alt        Add meaningful alt text or alt="".
```

Audit reports possible problems; it does not rewrite your application. Review each finding before changing code.

For machine-readable output:

```bash
npx @super-system/cli audit --json
```

Audit exits with code `1` when it finds violations, so it can also be used in CI.

## Assisted migration

Use audit findings as the input to the migration workflow. The full step-by-step guide — manifests, transform selection, verification, backup, and rollback — lives in the **[Migration guide](./migration-guide.md)**.

Quick reference:

```bash
npx @super-system/cli migrate plan                          # read-only inventory
npx @super-system/cli migrate plan --out .super-system/migration-plan.json
npx @super-system/cli migrate apply --dry-run               # preview diffs
npx @super-system/cli migrate apply --only native-button-to-button
npx @super-system/cli migrate verify                        # typecheck, test, build, audit
```

### Plan a migration (read-only)

```bash
npx @super-system/cli migrate plan
```

The plan groups audit findings by confidence and whether an automated transform is planned. It does **not** modify files.

Example output:

```text
Super System migration plan (read-only)

Project: vite, no super-system.json

Summary: 5 finding(s) — 2 planned auto-fix, 3 manual review, 0 unsupported

Planned auto-fixes (review before apply):
  src/App.tsx:1  raw-button  medium  Replace native <button> with <Button> from @super-system/react.

Manual review:
  src/App.tsx:1  inline-style  low  Move inline styles to tokenized classes or shared components.
```

For AI coding tools:

```bash
npx @super-system/cli migrate plan --json
```

Supported scan targets: `.tsx`, `.jsx`, `.ts`, `.js`, `.css`, `.scss`, `.html`, `.vue`, and `.svelte` files outside `node_modules`, build output, and `.super-system`.

### Preview auto-fixes (dry run)

```bash
npx @super-system/cli migrate apply --dry-run
```

### Apply auto-fixes

```bash
npx @super-system/cli migrate apply
```

In git repositories, apply refuses to write when the worktree has uncommitted changes. Commit or stash first, or pass `--allow-dirty` if you accept the risk of mixing migration edits with other local changes.

**Selective apply** — run one transform at a time:

```bash
npx @super-system/cli migrate apply --only img-add-alt --only native-button-to-button
npx @super-system/cli migrate apply --skip token-replace-color
npx @super-system/cli migrate apply --skip-rule raw-input
```

**Resumable runs** — save and resume progress via `.super-system/migration-plan.json` (see [Manifest format](./migration-guide.md#resumable-manifest) in the migration guide).

**Verify after apply**:

```bash
npx @super-system/cli migrate apply --verify   # run checks after writing files
npx @super-system/cli migrate verify           # run checks on current tree
```

After applying, re-run `npx @super-system/cli audit` (or `migrate verify`) to see remaining manual cleanup work.

### Automated transforms

Current automated transforms (transform id → behavior):

- `img-add-alt` — adds `alt=""` to `<img>` tags missing alt text
- `native-button-to-button` — replaces native `<button>` with `<Button>` and adds the import when needed
- `native-input-to-input` — replaces text-like `<input>` elements with `<Input>` (skips checkbox, radio, file, hidden, and submit types)
- `native-textarea-to-textarea` — replaces native `<textarea>` with `<Textarea>`
- `native-select-to-select` — replaces native `<select>` with `<Select>`
- `token-replace-color` — replaces hardcoded hex/rgb colors with `var(--ss-color-*)` when the value maps to exactly one theme token

Example dry-run diff:

```diff
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -1,2 +1,3 @@
+import { Button } from "@super-system/react";
-  return <button>Save</button>;
+  return <Button>Save</Button>;
```

## Check color contrast

Run:

```bash
npx @super-system/cli check-contrast
```

Super System checks important foreground/background pairs in both themes:

```text
PASS light/foreground/background: 17.74:1
PASS light/primary: 5.17:1
PASS dark/primary: 7.44:1
```

The default theme passes its configured WCAG AA contrast threshold. If any configured pair fails, the command exits with code `1`.

Automated tools can identify many accessibility issues, but no automated tool can certify an entire product as WCAG compliant. Keyboard testing, screen-reader testing, content review, and human judgment are still important.

### Manual verification checklist

After theme or component changes, spot-check Batch 1 and Batch 2 controls in both light and dark themes:

| Check | How to verify |
| --- | --- |
| Keyboard focus | Tab through interactive components including dialogs, drawers, popovers, and toast dismiss buttons; confirm visible focus rings. |
| Overlays | Open dialog and drawer samples; confirm Escape closes them and focus returns to triggers. Confirm popover closes on Escape and outside click. |
| Tabs & accordion | Use arrow keys in tab lists; confirm only one tab panel is visible. Toggle accordion sections and confirm `aria-expanded` updates. |
| Dropdown menu | Open with click or Enter, move with arrow keys, close with Escape; confirm focus returns to the trigger. |
| Reduced motion | Enable `prefers-reduced-motion: reduce` in devtools; confirm spinner, skeleton, tab, and accordion animations stop. |
| Forced colors | Enable forced-colors / high-contrast mode; confirm inputs, checkbox, radio, switch, and select borders remain visible. |
| Invalid states | Trigger `invalid` on Input, Textarea, Select, Checkbox, and Switch; confirm border and subtle background tint. |
| Live regions | Confirm destructive `Alert` uses `role="alert"` and neutral/primary alerts default to `role="status"`. |
| Zoom | At 200% browser zoom, confirm labels, controls, and Studio previews remain readable and usable. |

Component CSS includes `prefers-reduced-motion` and `forced-colors` fallbacks; zoom and screen-reader behavior still require manual verification in your application layout.
