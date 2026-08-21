# React Components Delta

## MODIFIED Requirements

### Requirement: Chart components
The package SHALL provide token-driven chart primitives including `Sparkline`, `BarChart`, `LineChart`, and `DonutChart` with accessible labels, data-driven rendering suitable for dashboard summaries, and complete tone variants (`primary`, `secondary`, `destructive`, `muted`) for every chart type.

#### Scenario: A sparkline renders trend data
- **GIVEN** a numeric series and accessible label
- **WHEN** a sparkline renders in an application
- **THEN** the chart exposes the label to assistive technology
- **AND** visual styling derives from Super System tokens

#### Scenario: Every chart tone renders visibly
- **GIVEN** a chart component configured with `tone="muted"`
- **WHEN** it renders in light or dark theme
- **THEN** stroke or fill colors are visible and derive from semantic tokens

#### Scenario: Optional data table exposes chart values
- **GIVEN** a chart with `dataTable` or equivalent accessibility prop enabled
- **WHEN** assistive technology reads the chart
- **THEN** underlying numeric values are available beyond the decorative image semantics

### Requirement: KPI card components
The package SHALL provide composable KPI card primitives including header, title, value, trend, description, chart slot, and footer parts for dashboard metric displays. Trend indicators SHALL use semantic success and destructive tokens rather than hardcoded colors.

#### Scenario: A KPI card composes metric content
- **GIVEN** a dashboard screen using KPI card primitives
- **WHEN** title, value, and chart slot content are combined
- **THEN** spacing and surfaces remain consistent with the active theme

#### Scenario: An upward trend uses success tokens
- **GIVEN** a KPI trend marked as up
- **WHEN** it renders in a custom theme
- **THEN** its color derives from `--ss-color-success` rather than a fixed hex value

### Requirement: Dialog component
The package SHALL provide composable dialog primitives that render modal content in a portal with `role="dialog"`, `aria-modal="true"`, optional labelled title and description regions referenced only when present, a default accessible name on close controls, focus trap, body scroll lock, background inertness while open, Escape dismissal, and focus restoration to the trigger.

#### Scenario: A dialog is opened from a trigger
- **GIVEN** a dialog with a trigger and content
- **WHEN** the user activates the trigger
- **THEN** the dialog content is rendered in a portal
- **AND** the dialog exposes modal semantics to assistive technology

#### Scenario: A dialog is closed with Escape
- **GIVEN** an open dialog opened from a trigger
- **WHEN** the user presses Escape
- **THEN** the dialog closes
- **AND** focus returns to the trigger when it remains available

#### Scenario: A dialog without a title omits label references
- **GIVEN** a dialog content region without a title or description
- **WHEN** the dialog opens
- **THEN** the dialog does not reference missing title or description ids in ARIA attributes

#### Scenario: A dialog with a title references its label
- **GIVEN** a dialog with a title but no description
- **WHEN** the dialog opens
- **THEN** `aria-labelledby` references the title id
- **AND** `aria-describedby` is omitted

#### Scenario: A dialog close control is accessible by default
- **GIVEN** a dialog with a close button and no custom close label
- **WHEN** assistive technology reads the close control
- **THEN** the control exposes a meaningful accessible name

### Requirement: Drawer component
The package SHALL provide composable drawer primitives with modal overlay behaviour, portal rendering, configurable placement, optional title and description regions referenced only when present, default accessible close controls, background inertness while open, and the same Escape and focus-restoration behaviour as dialogs. Drawer shadows SHALL use semantic overlay shadow tokens.

#### Scenario: A drawer opens from the right
- **GIVEN** a drawer configured for right-side placement
- **WHEN** the user opens it from its trigger
- **THEN** the drawer panel renders in a portal with modal semantics

#### Scenario: A drawer without a title omits label references
- **GIVEN** a drawer content region without a title
- **WHEN** the drawer opens
- **THEN** the drawer does not reference a missing title id in ARIA attributes

#### Scenario: A drawer close control is accessible by default
- **GIVEN** a drawer with a close button and no custom close label
- **WHEN** assistive technology reads the close control
- **THEN** the control exposes a meaningful accessible name

### Requirement: Popover component
The package SHALL provide composable popover primitives that render non-modal content in a portal, position content above or below the trigger without overlapping the trigger when `side="top"`, update position on scroll and resize while open, expose `aria-haspopup` on the trigger, close on outside pointer interaction and Escape, and associate expanded state with the trigger.

#### Scenario: A popover closes on Escape
- **GIVEN** an open popover
- **WHEN** the user presses Escape
- **THEN** the popover closes
- **AND** focus returns to the trigger

#### Scenario: A top popover clears the trigger
- **GIVEN** a popover configured with `side="top"`
- **WHEN** it opens
- **THEN** the popover content is visually positioned above the trigger
- **AND** it does not overlap the trigger activation area

#### Scenario: A popover stays aligned while the page scrolls
- **GIVEN** an open popover anchored to a trigger
- **WHEN** the user scrolls the page
- **THEN** the popover content remains aligned to the trigger

### Requirement: Dropdown menu component
The package SHALL provide composable `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, and `DropdownMenuItem` primitives that render menu content in a portal so menus are not clipped by ancestor overflow, update position on scroll and resize while open, while opening from a trigger, exposing menu semantics, supporting arrow-key navigation and Escape to close, returning focus to the trigger on Escape, and closing on outside pointer interaction.

#### Scenario: A menu opens from the keyboard
- **GIVEN** a dropdown menu trigger
- **WHEN** the user activates it with Enter or ArrowDown
- **THEN** the menu becomes available
- **AND** the trigger exposes `aria-expanded="true"`

#### Scenario: A menu closes with Escape
- **GIVEN** an open dropdown menu with focus inside the menu
- **WHEN** the user presses Escape
- **THEN** the menu closes
- **AND** focus returns to the trigger

#### Scenario: A menu is not clipped by overflow
- **GIVEN** a dropdown menu inside a container with `overflow: hidden`
- **WHEN** the user opens the menu
- **THEN** the menu content remains fully visible
- **AND** it renders through the shared portal root

#### Scenario: A menu stays aligned while the page scrolls
- **GIVEN** an open dropdown menu anchored to a trigger
- **WHEN** the user scrolls the page
- **THEN** the menu content remains aligned to the trigger

### Requirement: Tabs component
The package SHALL provide composable `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` primitives that implement the WAI-ARIA tabs pattern with roving tabindex, arrow-key focus movement within the tab list, `aria-selected` / `aria-controls` wiring between triggers and panels, auto-selection of the first enabled tab when no value is provided, optional `forceMount` on panels to preserve inactive panel state, and graceful handling when a controlled value matches no enabled trigger.

#### Scenario: A user selects a tab
- **GIVEN** a tab group with multiple triggers and panels
- **WHEN** a user activates a different tab trigger
- **THEN** that trigger becomes selected
- **AND** only the matching panel is visible

#### Scenario: A keyboard user moves between tabs
- **GIVEN** focus is on a tab trigger inside a horizontal tab list
- **WHEN** the user presses an arrow key defined for that orientation
- **THEN** focus moves to an adjacent trigger without leaving the tab list

#### Scenario: A tab group without an initial value selects the first tab
- **GIVEN** a tab group with triggers and no explicit value or defaultValue
- **WHEN** it renders
- **THEN** the first enabled tab is selected
- **AND** keyboard navigation is available from that tab

#### Scenario: A force-mounted panel preserves content
- **GIVEN** a tab panel with `forceMount` enabled
- **WHEN** the user selects a different tab
- **THEN** the inactive panel remains in the document with `hidden` semantics
- **AND** internal panel state is preserved

#### Scenario: A disabled first tab is skipped during auto-select
- **GIVEN** a tab group whose first trigger is disabled
- **WHEN** it renders without an explicit value
- **THEN** the first enabled tab is selected instead

### Requirement: Pagination component
The package SHALL provide composable pagination primitives including a navigation landmark with `aria-label="Pagination"`, previous and next links with accessible names, page links that can mark the active page with `aria-current="page"`, an ellipsis affordance for skipped ranges with readable screen-reader text, and previous/next controls that expose unavailable navigation through disabled semantics when applicable.

#### Scenario: The active page is indicated
- **GIVEN** a pagination control with an active page link
- **WHEN** assistive technology reads the control
- **THEN** the active page exposes `aria-current="page"`

#### Scenario: An ellipsis is announced
- **GIVEN** a pagination control with an ellipsis for skipped pages
- **WHEN** assistive technology reads the ellipsis
- **THEN** the skipped-range meaning is available as readable text
- **AND** decorative punctuation does not hide that text

#### Scenario: Previous navigation is unavailable on the first page
- **GIVEN** a pagination control on the first page
- **WHEN** assistive technology reads the previous control
- **THEN** the control communicates that previous navigation is unavailable

### Requirement: Flex layout primitives
The package SHALL provide token-driven layout primitives including `Box`, `Stack`, `Row`, `Container`, `Spacer`, and `Divider` for common application composition patterns. Vertical dividers SHALL use separator semantics appropriate for visual layout rather than thematic breaks.

#### Scenario: A page section uses stack layout
- **GIVEN** vertically stacked content in an application
- **WHEN** a stack primitive wraps the section
- **THEN** spacing follows token-driven gap values

#### Scenario: A vertical divider separates content
- **GIVEN** horizontally arranged content separated by a vertical divider
- **WHEN** assistive technology inspects the divider
- **THEN** the divider exposes separator semantics with vertical orientation

### Requirement: Framework-compatible package output
The `@super-system/react` package SHALL declare `react` and `react-dom` as peer dependencies and SHALL NOT bundle either runtime into its published ESM output.

#### Scenario: A Next.js application imports the package
- **GIVEN** a Next.js App Router project installing `@super-system/react`
- **WHEN** the application builds for production
- **THEN** the build completes without dynamic require errors from bundled React runtimes

## ADDED Requirements

### Requirement: Tooltip support for disabled triggers
The package SHALL allow supplementary tooltip content to be exposed for disabled controls when composed using the documented disabled-trigger pattern.

#### Scenario: A disabled button has a tooltip
- **GIVEN** a disabled button wrapped with a tooltip using the documented pattern
- **WHEN** a pointer user hovers the control
- **THEN** the tooltip content becomes visible

### Requirement: Toast shadow and motion consistency
Toast surfaces SHALL use semantic overlay shadow tokens and respect reduced-motion preferences for entrance transitions.

#### Scenario: A toast renders in a custom theme
- **GIVEN** customized overlay shadow tokens
- **WHEN** a toast appears
- **THEN** its shadow derives from the semantic overlay token

### Requirement: Bar chart data identity
Bar chart data entries SHALL support stable identity for list rendering when labels repeat.

#### Scenario: Duplicate bar labels render safely
- **GIVEN** a bar chart whose data contains repeated labels
- **WHEN** it renders
- **THEN** no duplicate-key warnings occur
- **AND** each bar remains visually distinct
