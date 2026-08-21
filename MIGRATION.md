# Migration notes

## 0.1.0-beta.17 (ESLint image-alt and raw-input)

No breaking API changes.

- **ESLint:** `super-system/image-alt` and `super-system/raw-input` rules with syntax-aware JSX analysis.
- **Rules:** Shared `isTextLikeNativeInputType()` in `@super-system/rules` for CLI migration and ESLint parity.

## 0.1.0-beta.16 (governance foundation + release hardening)

No breaking API changes.

- **Governance:** `super-system.policy.json` schema, `policy init`, `policy check`, and `adapters generate` for merge-safe `AGENTS.md` sections.
- **Rules:** New `@super-system/rules` shared catalog for CLI audit and ESLint.
- **ESLint:** `eslint-plugin-super-system` with `raw-button` rule (recommended/strict configs).
- **Release:** `CONTRIBUTING.md`, `SECURITY.md`, [compatibility policy](./docs/compatibility.md), `scripts/verify-release.mjs`, tarball install smoke test.

## 0.1.0-beta.15 (assisted migration completion)

No breaking API changes.

- **CLI:** Transform selection (`--only`, `--skip`, `--skip-rule`), resumable manifests (`.super-system/migration-plan.json`), `migrate verify`, and `migrate apply --verify`.
- **Docs:** [Migration guide](./docs/migration-guide.md) with backup, rollback, troubleshooting, and AI-neutral follow-up.

## 0.1.0-beta.14 (Studio sidebar form polish)

No breaking API changes. Studio-only visual fix for sidebar controls.

- **Studio:** Sliders and value readouts now use dedicated shell styling (visible tracks/thumbs, bordered control rows, consistent spacing). Fixes sidebar controls that previously looked like static text.

## 0.1.0-beta.13 (Google Font preset diversity)

No breaking API changes.

- **Fonts:** Studio preset list replaced with ten more distinct personalities (sans, serif, slab). Old `fontFamily` ids no longer in the dropdown still resolve from `fontSans` until you re-save in Studio.

## 0.1.0-beta.12 (Studio surface/elevation/typography controls)

No breaking API changes. Studio-only release.

- **Studio:** Sidebar controls for surface gradient tint/angle, elevation shadow strength/hover/lift, typography scale (h1–h4, lead, small), heading line height, font weights, and link colors.
- **Fonts:** Font family is a curated Google Fonts dropdown. `build-theme` injects an `@import` into `.super-system/theme.css`; Studio loads the same font in preview.
- **Preview:** Live demo card with `.ss-prose`, `.ss-elevate-on-hover`, and themed links.

## 0.1.0-beta.11 (surfaces, elevation, typography utilities)

No breaking API changes. Regenerate theme CSS after upgrading.

- **Surfaces:** Neutral components use a subtle token-driven `--ss-surface-gradient` (tint and angle configurable in `super-system.json`).
- **Elevation:** New `--ss-elevation-*` tokens plus `.ss-elevate` and `.ss-elevate-on-hover` utility classes.
- **Typography:** Type scale (`h1`–`h4`, `lead`, `body`, `small`), heading weights, and `.ss-heading-*` / `.ss-prose` utilities.
- **Links:** Theme colors `link` and `linkHover` drive `.ss-link` and prose anchors.

## 0.1.0-beta.10 (form component transforms)

No breaking changes. Safe to upgrade from `beta.9`.

- **CLI:** `migrate apply` now replaces native `<input>`, `<textarea>`, and `<select>` with `Input`, `Textarea`, and `Select` when safe.
- **Safety:** Checkbox, radio, file, hidden, and submit inputs remain manual review items.

## 0.1.0-beta.9 (token replacement transforms)

No breaking changes. Safe to upgrade from `beta.8`.

- **CLI:** `migrate apply` now replaces unambiguous hardcoded colors with semantic CSS variables (for example `#2563eb` → `var(--ss-color-primary)`) when the literal maps to exactly one token in `super-system.json`.
- **Safety:** Ambiguous colors (shared by multiple tokens) and unknown literals remain manual review items.

## 0.1.0-beta.8 (migrate apply write mode)

No breaking changes. Safe to upgrade from `beta.7`.

- **CLI:** `migrate apply` writes supported auto-fixes (`img-add-alt`, `native-button-to-button`) to disk.
- **Safety:** In git repositories, apply refuses to write when the worktree has uncommitted changes unless you pass `--allow-dirty`.
- **Workflow:** Preview with `migrate apply --dry-run`, then apply and re-run `audit`.

## 0.1.0-beta.7 (migrate apply dry-run)

No breaking changes. Safe to upgrade from `beta.6`.

- **CLI:** `migrate apply --dry-run` previews unified diffs for supported auto-fixes (`img-add-alt`, `native-button-to-button`) without writing files.

## 0.1.0-beta.6 (migrate plan)

No breaking changes. Safe to upgrade from `beta.5`.

- **CLI:** New read-only `migrate plan` command groups audit findings by confidence and planned transform. Use `--json` for AI coding tools.

## 0.1.0-beta.5 (branding + docs polish)

No breaking API or token changes. Safe to upgrade from `beta.4`.

- **Studio branding:** CLI-bundled Studio ships updated logo assets and header layout.
- **Docs:** README messaging reframed for AI-assisted development teams.
- **Repo assets:** Optimized `brand/hero.png` and logo PNGs for faster README and Pages loads.

## 0.1.0-beta.2 (library quality + dashboard components)

### Accessibility corrections

- **BreadcrumbPage** no longer uses `role="link"`. Current page is plain text with `aria-current="page"`.
- **Dialog / Drawer** only set `aria-labelledby` and `aria-describedby` when title/description components are rendered.
- **PaginationEllipsis** screen-reader text is no longer hidden by a parent `aria-hidden`.

### Behavior changes

- **Tabs** auto-select the first tab when no `value` or `defaultValue` is provided. Set `defaultValue` explicitly for stable SSR.
- **TabsContent** supports `forceMount` to keep inactive panel DOM (and form state) while hidden.
- **DropdownMenu** content now renders in a portal; menus are no longer clipped by `overflow: hidden` ancestors.
- **Popover** `side="top"` positions content above the trigger.
- **Toast** viewport uses `aria-live="assertive"` when any toast is destructive.

### CSS

- **`.ss-label--inline`** is included in `@super-system/react/styles.css`.
- Demo-only `.ss-*--demo` modifiers moved to Studio assets only.

### New components

- **Charts:** `Sparkline`, `BarChart`, `LineChart`, `DonutChart`
- **KPI:** `KpiCard`, `KpiCardHeader`, `KpiCardTitle`, `KpiCardValue`, `KpiCardTrend`, `KpiCardDescription`, `KpiCardChart`, `KpiCardFooter`
- **Layout:** `Box`, `Stack`, `Row`, `Container`, `Spacer`, `Divider`
- **Page shell:** `AppShell`, `Sidebar`, `SidebarNav`, `SidebarNavItem`, `PageHeader`, `PageFooter`, `Main`, `TopBar`, `HamburgerMenu`

### Theme tokens

- Compiler emits `--ss-overlay-backdrop` and `--ss-overlay-shadow` for modal/overlay surfaces.
- **Success tokens:** `success` and `successForeground` are now part of the theme schema (used by KPI trend-up and positive states). Older configs pick up defaults when the theme is compiled.
- **Default palette refresh:** light `secondary` and `muted` are distinct surfaces; light `focus` is distinct from `primary`. Dark `secondary` and `muted` are also differentiated.

### Typography tokens

- **`fontMono`** is applied to KPI values, table cells with `data-numeric="true"`, and inline `code` inside alert bodies.

### Package peers

- `@super-system/react` declares `react-dom` as a peer dependency (required for portal-based overlays). The published ESM bundle externalizes both `react` and `react-dom` so Next.js and Vite builds succeed.
