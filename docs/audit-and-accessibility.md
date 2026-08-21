# Audit & accessibility

[← Documentation](./README.md) · [Getting started](./getting-started.md) · [Theme](./theme.md) · [CLI](./cli.md)

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
