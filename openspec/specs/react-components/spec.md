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
