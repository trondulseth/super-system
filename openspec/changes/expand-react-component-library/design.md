# Design: Expanded React Component Library

## Status

Batch 2 (navigation and disclosure) and Batch 3 (overlays and data) are **complete**. Icon wrapper and release verification remain in this change.

## Component batches

1. **Form and feedback (done):** Textarea, Label, Checkbox, Radio Group, Switch, Select, Alert, Spinner, Skeleton, Tooltip. Icon wrapper remains planned.
2. **Navigation and disclosure (done):** Tabs, Accordion, Breadcrumb, Dropdown Menu, and Pagination.
3. **Data and overlays (done):** Table primitives, Dialog, Drawer, Popover, and Toast.

Each component exposes documented variants and state attributes, forwards refs where its root is a DOM element, and consumes semantic Super System variables. Components that need generated identifiers use React-safe stable IDs.

## Accessibility design

Native controls are preferred when their behavior is sufficient. Composite widgets follow the applicable WAI-ARIA interaction pattern, including focus movement, Escape behavior, labeling, and restoration of focus. Automated unit tests cover state and keyboard behavior; browser and screen-reader checklists cover behavior automation cannot prove.

## Styling and tokens

New styles extend semantic tokens only when an existing semantic value cannot express the intent. Component-specific one-off values are avoided. New tokens receive light/dark defaults and contrast checks when they represent foreground/background pairs.

## Icon integration

The CLI can optionally install a documented open icon package and configure a normalized `Icon` wrapper. The wrapper standardizes size, stroke, alignment, decorative hiding, and accessible labels while still allowing compatible custom SVG components. Icons used without visible text require an explicit accessible name at the owning control.

## Dependency policy

A low-level accessibility library may be adopted for complex overlays if it materially reduces behavior risk. Any dependency must be tree-shakable, compatible with React 18+, maintained, and documented. Its visual styling must not leak into Super System.

## Alternatives considered

- **Implement every interaction from scratch:** avoided for complex composites when a proven primitive reduces accessibility risk.
- **Wrap a full visual component library:** rejected because it would weaken token ownership and introduce another design language.
- **Ship every planned component at once:** rejected in favor of incremental beta batches and smaller review surfaces.
- **Copy raw SVG markup into every component:** rejected because sizing, accessibility, and updates would drift.

## Compatibility and migration

Existing exports and CSS variable names remain compatible. New exports are additive. Any new peer dependency is declared explicitly, and package smoke tests verify both direct imports and root exports.
