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
The package SHALL provide a `Label` supporting native label attributes, forwarded refs, optional required indication, and disabled styling. When a label wraps an associated control and `required` or `disabled` is set, the label SHALL propagate the corresponding native accessibility attributes to that control.

#### Scenario: A required field is labeled
- **GIVEN** a form field marked required through a wrapping label
- **WHEN** its label renders with the required indicator
- **THEN** the visible label communicates the requirement
- **AND** the associated control exposes `required` and `aria-required="true"`

#### Scenario: A disabled field is labeled
- **GIVEN** a form field marked disabled through a wrapping label
- **WHEN** its label renders with disabled styling
- **THEN** the associated control is disabled

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
The package SHALL provide a `Tooltip` that exposes supplementary content on hover and focus, merges with any existing `aria-describedby` identifiers on the trigger, and associates tooltip content while open.

#### Scenario: A tooltip trigger receives focus
- **GIVEN** a button wrapped by a tooltip
- **WHEN** keyboard focus moves to the button
- **THEN** the tooltip content becomes available
- **AND** the trigger exposes an accessible description while the tooltip is open
- **AND** any pre-existing described-by identifiers remain referenced

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
