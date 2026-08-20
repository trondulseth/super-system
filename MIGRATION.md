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
