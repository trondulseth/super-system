# React Components Specification

## Purpose

Define the accessible React component layer that consumes Super System tokens and provides consistent application primitives.

## Requirements

### Requirement: Shared component styling
All exported React components SHALL derive visual values from Super System CSS custom properties rather than embedding project-specific colors, spacing, radii, or shadows.

#### Scenario: A theme value changes
- **GIVEN** an application using Super System React components
- **WHEN** its generated theme stylesheet changes
- **THEN** all affected component instances adopt the new design without component-level edits

### Requirement: Button component
The package SHALL provide a `Button` supporting documented variants, sizes, disabled state, loading state, native button attributes, and forwarded refs.

#### Scenario: A button is loading
- **GIVEN** a button with loading enabled
- **WHEN** it renders
- **THEN** it communicates a busy state to assistive technology
- **AND** it prevents duplicate activation
- **AND** its label remains understandable

### Requirement: Input component
The package SHALL provide an `Input` supporting native input attributes, forwarded refs, disabled styling, focus styling, and invalid-state styling.

#### Scenario: Input validation fails
- **GIVEN** an input marked invalid
- **WHEN** it renders
- **THEN** its visual state communicates the error
- **AND** the native accessibility state remains available to assistive technology

### Requirement: Label component
The package SHALL provide a `Label` supporting native label attributes, forwarded refs, optional required indication, and disabled styling.

#### Scenario: A required field is labeled
- **GIVEN** a form field marked required
- **WHEN** its label renders with the required indicator
- **THEN** the visible label communicates the requirement
- **AND** the native label association remains available to assistive technology

### Requirement: Textarea component
The package SHALL provide a `Textarea` supporting native textarea attributes, forwarded refs, disabled styling, focus styling, and invalid-state styling.

#### Scenario: Textarea validation fails
- **GIVEN** a textarea marked invalid
- **WHEN** it renders
- **THEN** its visual state communicates the error
- **AND** the native accessibility state remains available to assistive technology

### Requirement: Checkbox component
The package SHALL provide a `Checkbox` supporting native checkbox attributes, forwarded refs, focus styling, and invalid-state styling.

#### Scenario: A checkbox is toggled
- **GIVEN** an enabled checkbox
- **WHEN** a user activates it
- **THEN** its checked state updates through the native control

### Requirement: Radio group component
The package SHALL provide a `RadioGroup` and `Radio` pair that preserves native radio semantics and visible labels.

#### Scenario: One option is selected in a group
- **GIVEN** a radio group with multiple options
- **WHEN** one option is selected
- **THEN** only that option remains selected
- **AND** each option label remains associated with its input

### Requirement: Switch component
The package SHALL provide a `Switch` supporting native switch semantics, forwarded refs, focus styling, and invalid-state styling.

#### Scenario: A switch is toggled
- **GIVEN** a switch rendered with `role="switch"`
- **WHEN** a user activates it
- **THEN** its checked state updates through the native control

### Requirement: Select component
The package SHALL provide a `Select` supporting native select attributes, forwarded refs, focus styling, and invalid-state styling.

#### Scenario: A select value changes
- **GIVEN** a select with multiple options
- **WHEN** a user chooses a different option
- **THEN** the native select value updates

### Requirement: Alert component
The package SHALL provide an `Alert` with documented variants and `role="alert"` for important status messages.

#### Scenario: An error alert is rendered
- **GIVEN** a destructive alert
- **WHEN** it appears on screen
- **THEN** it exposes alert semantics to assistive technology
- **AND** its variant styling distinguishes it from neutral alerts

### Requirement: Badge and Card components
The package SHALL provide token-driven `Badge` variants and composable `Card` primitives for common status and content layouts.

#### Scenario: A card is composed
- **GIVEN** a product screen using the exported card primitives
- **WHEN** header, body, and footer content are combined
- **THEN** their spacing and surfaces remain consistent with the active theme

### Requirement: Theme provider
The package SHALL provide a `ThemeProvider` that supports light, dark, and system preferences and exposes the active theme to descendants.

#### Scenario: System preference is selected
- **GIVEN** the provider is configured for the system theme
- **WHEN** the operating-system color preference changes
- **THEN** the rendered theme updates without a page reload
