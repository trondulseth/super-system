# Migration notes

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
