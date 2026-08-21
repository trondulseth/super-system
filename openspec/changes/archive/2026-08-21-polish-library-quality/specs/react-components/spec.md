# React Components Delta

## MODIFIED Requirements

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

### Requirement: Pagination component
The package SHALL provide composable pagination primitives including a navigation landmark with `aria-label="Pagination"`, previous and next links with accessible names, page links that can mark the active page with `aria-current="page"`, and an ellipsis affordance for skipped ranges with readable screen-reader text.

#### Scenario: The active page is indicated
- **GIVEN** a pagination control with an active page link
- **WHEN** assistive technology reads the control
- **THEN** the active page exposes `aria-current="page"`

#### Scenario: An ellipsis is announced
- **GIVEN** a pagination control with an ellipsis for skipped pages
- **WHEN** assistive technology reads the ellipsis
- **THEN** the skipped-range meaning is available as readable text
- **AND** decorative punctuation does not hide that text

### Requirement: Dialog component
The package SHALL provide composable dialog primitives that render modal content in a portal with `role="dialog"`, `aria-modal="true"`, optional labelled title and description regions referenced only when present, focus trap, body scroll lock, Escape dismissal, and focus restoration to the trigger.

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

### Requirement: Drawer component
The package SHALL provide composable drawer primitives with modal overlay behaviour, portal rendering, configurable `left`, `right`, or `bottom` placement, optional title and description regions referenced only when present, and the same Escape and focus-restoration behaviour as dialogs.

#### Scenario: A drawer opens from the right
- **GIVEN** a drawer configured for right-side placement
- **WHEN** the user opens it from its trigger
- **THEN** the drawer panel renders in a portal with modal semantics

#### Scenario: A drawer without a title omits label references
- **GIVEN** a drawer content region without a title
- **WHEN** the drawer opens
- **THEN** the drawer does not reference a missing title id in ARIA attributes

### Requirement: Popover component
The package SHALL provide composable popover primitives that render non-modal content in a portal, position content above or below the trigger without overlapping the trigger when `side="top"`, close on outside pointer interaction and Escape, and associate expanded state with the trigger.

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

### Requirement: Tabs component
The package SHALL provide composable `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` primitives that implement the WAI-ARIA tabs pattern with roving tabindex, arrow-key focus movement within the tab list, `aria-selected` / `aria-controls` wiring between triggers and panels, auto-selection of the first tab when no value is provided, and optional `forceMount` on panels to preserve inactive panel state.

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
- **THEN** the first tab is selected
- **AND** keyboard navigation is available from that tab

#### Scenario: A force-mounted panel preserves content
- **GIVEN** a tab panel with `forceMount` enabled
- **WHEN** the user selects a different tab
- **THEN** the inactive panel remains in the document with `hidden` semantics
- **AND** internal panel state is preserved

### Requirement: Dropdown menu component
The package SHALL provide composable `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, and `DropdownMenuItem` primitives that render menu content in a portal so menus are not clipped by ancestor overflow, while opening from a trigger, exposing menu semantics, supporting arrow-key navigation and Escape to close, returning focus to the trigger on Escape, and closing on outside pointer interaction.

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

## ADDED Requirements

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
The full shipped component library SHALL maintain expanded automated test coverage for quality-hardening behaviour introduced by this change.

#### Scenario: Continuous integration runs after quality hardening
- **GIVEN** Phases 1–5 of the quality hardening change are complete
- **WHEN** `pnpm check` runs
- **THEN** at least 80 automated component behaviour tests pass
- **AND** tests cover disabled accordion items, conditional dialog ARIA, popover top placement, tabs auto-select, dropdown portal rendering, and toast live-region behaviour
