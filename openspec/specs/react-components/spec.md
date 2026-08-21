# React Components Specification

## Purpose

Define the accessible React component layer that consumes Super System tokens and provides consistent application primitives.

## Requirements

### Requirement: Shared component styling
All exported React components SHALL derive visual values from Super System CSS custom properties rather than embedding project-specific colors, spacing, radii, or shadows. Decorative assets such as chevrons and checkmarks SHALL use token-driven colors or masks rather than hardcoded hex values in stylesheets.

#### Scenario: A theme value changes
- **GIVEN** an application using Super System React components
- **WHEN** its generated theme stylesheet changes
- **THEN** all affected component instances adopt the new design without component-level edits
- **AND** select chevrons and checkbox checkmarks reflect the active theme

### Requirement: Button component
The package SHALL provide a `Button` supporting documented variants, sizes, disabled state, loading state, native button attributes, and forwarded refs.

#### Scenario: A button is loading
- **GIVEN** a button with loading enabled
- **WHEN** it renders
- **THEN** it communicates a busy state to assistive technology
- **AND** it prevents duplicate activation
- **AND** its label remains understandable

### Requirement: Input component
The package SHALL provide an `Input` supporting native input attributes, forwarded refs, disabled styling, focus styling, and invalid-state styling that includes both border and subtle background treatment.

#### Scenario: Input validation fails
- **GIVEN** an input marked invalid
- **WHEN** it renders
- **THEN** its visual state communicates the error through border and background treatment
- **AND** the native accessibility state remains available to assistive technology

#### Scenario: An input is disabled
- **GIVEN** a disabled input
- **WHEN** it renders
- **THEN** it displays token-consistent disabled styling
- **AND** the disabled state is programmatically available

### Requirement: Label component
The package SHALL provide a `Label` supporting native label attributes, forwarded refs, optional required indication, disabled styling, and an `inline` layout modifier. When a label wraps an associated control and `required` or `disabled` is set, the label SHALL propagate the corresponding native accessibility attributes to that control. Inline label styles SHALL ship in the production `@super-system/react` stylesheet so Checkbox and Switch inline labels render correctly outside Studio.

#### Scenario: A required field is labeled
- **GIVEN** a form field marked required through a wrapping label
- **WHEN** its label renders with the required indicator
- **THEN** the visible label communicates the requirement
- **AND** the associated control exposes `required` and `aria-required="true"`

#### Scenario: A disabled field is labeled
- **GIVEN** a form field marked disabled through a wrapping label
- **WHEN** its label renders with disabled styling
- **THEN** the associated control is disabled

#### Scenario: An inline label renders in an application
- **GIVEN** a checkbox or switch with an inline label
- **WHEN** the component renders in a consumer application importing `@super-system/react/styles.css`
- **THEN** the label uses inline-flex layout with appropriate gap
- **AND** the layout matches Studio preview behaviour

### Requirement: Textarea component
The package SHALL provide a `Textarea` supporting native textarea attributes, forwarded refs, disabled styling, focus styling, and invalid-state styling that includes both border and subtle background treatment.

#### Scenario: Textarea validation fails
- **GIVEN** a textarea marked invalid
- **WHEN** it renders
- **THEN** its visual state communicates the error through border and background treatment
- **AND** the native accessibility state remains available to assistive technology

#### Scenario: A textarea is disabled
- **GIVEN** a disabled textarea
- **WHEN** it renders
- **THEN** it displays token-consistent disabled styling

### Requirement: Checkbox component
The package SHALL provide a `Checkbox` supporting native checkbox attributes, forwarded refs, focus styling, invalid-state styling, disabled styling, and an optional inline `label` prop consistent with radio option labeling.

#### Scenario: A checkbox is toggled
- **GIVEN** an enabled checkbox
- **WHEN** a user activates it
- **THEN** its checked state updates through the native control

#### Scenario: A labeled checkbox renders
- **GIVEN** a checkbox with an inline label prop
- **WHEN** it renders
- **THEN** the label text is associated with the checkbox through native label semantics

### Requirement: Radio group component
The package SHALL provide a `RadioGroup` and `Radio` pair that preserves native radio semantics and visible labels.

#### Scenario: One option is selected in a group
- **GIVEN** a radio group with multiple options
- **WHEN** one option is selected
- **THEN** only that option remains selected
- **AND** each option label remains associated with its input

### Requirement: Switch component
The package SHALL provide a `Switch` supporting native switch semantics, forwarded refs, focus styling, invalid-state styling, disabled styling, visible thumb contrast in unchecked state, and an optional inline `label` prop.

#### Scenario: A switch is toggled
- **GIVEN** a switch rendered with `role="switch"`
- **WHEN** a user activates it
- **THEN** its checked state updates through the native control

### Requirement: Select component
The package SHALL provide a `Select` supporting native select attributes, forwarded refs, focus styling, invalid-state styling, disabled styling, and a token-driven dropdown chevron.

#### Scenario: A select value changes
- **GIVEN** a select with multiple options
- **WHEN** a user chooses a different option
- **THEN** the native select value updates

### Requirement: Alert component
The package SHALL provide an `Alert` with documented variants and configurable live-region semantics defaulting to urgent `role="alert"` for destructive messages and `role="status"` for neutral and primary informational messages.

#### Scenario: An error alert is rendered
- **GIVEN** a destructive alert
- **WHEN** it appears on screen
- **THEN** it exposes alert semantics to assistive technology
- **AND** its variant styling distinguishes it from neutral alerts

#### Scenario: A neutral status alert is rendered
- **GIVEN** a neutral alert
- **WHEN** it appears on screen
- **THEN** it exposes status semantics by default
- **AND** it does not unnecessarily interrupt assistive technology

### Requirement: Spinner component
The package SHALL provide a standalone `Spinner` with documented sizes and an accessible status label when rendered outside decorative contexts.

#### Scenario: A standalone spinner is rendered
- **GIVEN** a loading screen using the spinner
- **WHEN** assistive technology reads the control
- **THEN** the spinner exposes a meaningful status label

### Requirement: Skeleton component
The package SHALL provide a `Skeleton` placeholder with documented shape variants for loading states.

#### Scenario: Content is loading
- **GIVEN** a card waiting for data
- **WHEN** skeleton placeholders render
- **THEN** they provide visually consistent loading shapes without replacing semantic content

### Requirement: Tooltip component
The package SHALL provide a `Tooltip` that exposes supplementary content on hover and focus, merges with any existing `aria-describedby` identifiers on the trigger, associates tooltip content while open, and forwards refs to the trigger element.

#### Scenario: A tooltip trigger receives focus
- **GIVEN** a button wrapped by a tooltip
- **WHEN** keyboard focus moves to the button
- **THEN** the tooltip content becomes available
- **AND** the trigger exposes an accessible description while the tooltip is open
- **AND** any pre-existing described-by identifiers remain referenced

#### Scenario: A tooltip trigger forwards refs
- **GIVEN** a tooltip wrapping a trigger with a ref callback
- **WHEN** the trigger mounts
- **THEN** the ref receives the trigger element

### Requirement: Badge and Card components
The package SHALL provide token-driven `Badge` variants and composable `Card` primitives including header, title, body, and footer parts for common content layouts.

#### Scenario: A card is composed
- **GIVEN** a product screen using the exported card primitives
- **WHEN** header, body, and footer content are combined
- **THEN** their spacing and surfaces remain consistent with the active theme

### Requirement: Theme provider
The package SHALL provide a `ThemeProvider` that supports light, dark, and system preferences, optional persistence through local storage, and live reaction to operating-system color preference changes when system mode is active.

#### Scenario: System preference is selected
- **GIVEN** the provider is configured for the system theme
- **WHEN** the operating-system color preference changes
- **THEN** the rendered theme updates without a page reload

#### Scenario: Persistence is disabled
- **GIVEN** a provider with persistence disabled
- **WHEN** the application renders
- **THEN** the configured default mode is used without reading or writing stored preferences

### Requirement: Motion and contrast resilience
Component stylesheets SHALL respect `prefers-reduced-motion` for animations and transitions defined in the component package, and SHALL provide usable control outlines under `forced-colors` active media queries.

#### Scenario: Reduced motion is preferred
- **GIVEN** a user with reduced motion enabled
- **WHEN** spinner, skeleton, or transition-heavy components render
- **THEN** non-essential motion is suppressed in component CSS

#### Scenario: Forced colors mode is active
- **GIVEN** a high-contrast forced-colors environment
- **WHEN** interactive components render
- **THEN** controls remain visibly distinguishable

### Requirement: Batch 1 test coverage
Every Batch 1 exported component SHALL have automated tests covering primary states, ref forwarding where applicable, and documented accessibility behavior for that component.

#### Scenario: Continuous integration runs
- **GIVEN** the Batch 1 component set is complete
- **WHEN** `pnpm check` runs
- **THEN** tests exist for Button, Input, Textarea, Label, Checkbox, RadioGroup, Radio, Switch, Select, Alert, Spinner, Skeleton, Tooltip, Badge, Card, and ThemeProvider

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

### Requirement: Accordion component
The package SHALL provide composable `Accordion`, `AccordionItem`, `AccordionTrigger`, and `AccordionContent` primitives supporting single and multiple open sections, `aria-expanded` on triggers, linked regions identified through stable generated ids, and item-level `disabled` state that prevents toggling.

#### Scenario: A single accordion section opens
- **GIVEN** an accordion configured for single selection
- **WHEN** a user opens a different section
- **THEN** the previously open section closes unless collapsible mode allows an empty state
- **AND** the active trigger exposes `aria-expanded="true"`

#### Scenario: Multiple accordion sections stay open
- **GIVEN** an accordion configured for multiple selection
- **WHEN** a user opens an additional section
- **THEN** previously open sections remain open

#### Scenario: A disabled accordion item cannot be toggled
- **GIVEN** an accordion item marked disabled
- **WHEN** a user attempts to activate its trigger
- **THEN** the section does not open or close
- **AND** the trigger exposes the native disabled state

### Requirement: Breadcrumb component
The package SHALL provide composable breadcrumb primitives including a root navigation landmark with `aria-label="Breadcrumb"`, link items, a current-page item with `aria-current="page"` as plain text (not a link role), and separators hidden from assistive technology.

#### Scenario: A breadcrumb trail is rendered
- **GIVEN** a breadcrumb list with a link and a current page
- **WHEN** assistive technology reads the trail
- **THEN** the navigation landmark is identified as a breadcrumb
- **AND** the current page exposes `aria-current="page"` without link semantics

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

### Requirement: Batch 2 test coverage
Every Batch 2 exported navigation and disclosure primitive SHALL have automated tests covering primary interaction, ARIA semantics, and documented keyboard behavior where applicable.

#### Scenario: Continuous integration runs
- **GIVEN** the Batch 2 component set is complete
- **WHEN** `pnpm check` runs
- **THEN** tests exist for Tabs, Accordion, Breadcrumb, DropdownMenu, and Pagination behavior

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

### Requirement: Toast component
The package SHALL provide a `ToastProvider` with imperative `useToast` publishing, portal-rendered viewport, auto-dismiss timing, dismiss controls, and live-region semantics where viewport politeness matches per-toast urgency and uses `role="alert"` for destructive messages and `role="status"` for other variants by default.

#### Scenario: A toast is published
- **GIVEN** an application wrapped in `ToastProvider`
- **WHEN** the application publishes a toast
- **THEN** the toast appears in the portal viewport
- **AND** it exposes appropriate live-region semantics for its variant

#### Scenario: A destructive toast uses assertive live region semantics
- **GIVEN** a toast viewport containing a destructive toast
- **WHEN** the toast appears
- **THEN** the viewport and toast expose consistent urgent announcement semantics

### Requirement: Table primitives
The package SHALL provide composable table primitives that preserve native table semantics, apply token-driven styling, and wrap tables in a horizontally scrollable container for responsive layouts.

#### Scenario: Assistive technology reads a table
- **GIVEN** a table composed from Super System table primitives with headers and data cells
- **WHEN** assistive technology navigates it
- **THEN** the native row, header, and cell relationships remain available

### Requirement: Batch 3 test coverage
Every Batch 3 exported overlay and table primitive SHALL have automated tests covering primary interaction, portal rendering where applicable, and documented accessibility behaviour.

#### Scenario: Continuous integration runs
- **GIVEN** the Batch 3 component set is complete
- **WHEN** `pnpm check` runs
- **THEN** tests exist for Dialog, Drawer, Popover, Toast, and Table behaviour

### Requirement: Normalized icon integration
The package SHALL provide an `Icon` wrapper that normalizes size and alignment for SVG and compatible custom icon components, distinguishes decorative icons from labelled icons, and documents icon-only control patterns where the owning control carries the accessible name.

#### Scenario: An icon-only button is created
- **GIVEN** a button whose only visible content is an icon
- **WHEN** the button renders with an accessible name and a decorative icon child
- **THEN** assistive technology reads the control name from the button
- **AND** the icon does not expose a duplicate accessible name

#### Scenario: A meaningful standalone icon is rendered
- **GIVEN** an icon that communicates meaning without adjacent visible text
- **WHEN** it renders with an explicit label
- **THEN** it exposes image semantics and the provided label to assistive technology

### Requirement: Production stylesheet hygiene
The production `@super-system/react` stylesheet SHALL NOT include demo-only modifier classes used exclusively by Studio static previews.

#### Scenario: Production CSS is consumed by an application
- **GIVEN** an application importing `@super-system/react/styles.css`
- **WHEN** the stylesheet is loaded
- **THEN** demo-only preview modifiers are not present
- **AND** all component classes required for application use remain available

### Requirement: Overlay primitive robustness
Modal overlay utilities SHALL support stacked scroll locking and focus trapping when a dialog contains no tabbable elements.

#### Scenario: Nested modals preserve scroll lock
- **GIVEN** two modal surfaces open simultaneously
- **WHEN** one closes while the other remains open
- **THEN** body scroll remains locked until the last modal closes

#### Scenario: An empty dialog still receives focus
- **GIVEN** a dialog with no tabbable children
- **WHEN** it opens
- **THEN** focus moves to the dialog content container
- **AND** keyboard interaction does not escape the modal unexpectedly

### Requirement: Library quality test coverage
The full shipped component library SHALL maintain expanded automated test coverage for quality-hardening behaviour introduced by the library quality pass.

#### Scenario: Continuous integration runs after quality hardening
- **GIVEN** the quality hardening change is complete
- **WHEN** `pnpm check` runs
- **THEN** at least 80 automated component behaviour tests pass
- **AND** tests cover disabled accordion items, conditional dialog ARIA, popover top placement, tabs auto-select, dropdown portal rendering, and toast live-region behaviour

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

### Requirement: Page shell components
The package SHALL provide page shell primitives including `AppShell`, `Sidebar`, `SidebarNav`, `SidebarNavItem`, `PageHeader`, `PageFooter`, `Main`, `TopBar`, and `HamburgerMenu` for common application chrome layouts.

#### Scenario: A responsive shell exposes navigation
- **GIVEN** an application using the page shell primitives
- **WHEN** a user opens navigation on a small viewport
- **THEN** the hamburger menu reveals sidebar navigation without losing landmark semantics

### Requirement: Framework-compatible package output
The `@super-system/react` package SHALL declare `react` and `react-dom` as peer dependencies and SHALL NOT bundle either runtime into its published ESM output.

#### Scenario: A Next.js application imports the package
- **GIVEN** a Next.js App Router project installing `@super-system/react`
- **WHEN** the application builds for production
- **THEN** the build completes without dynamic require errors from bundled React runtimes

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
