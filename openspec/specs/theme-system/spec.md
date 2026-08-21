# Theme System Specification

## Purpose

Define the portable design-token contract that keeps an application's visual language consistent across components, themes, and frameworks.

## Requirements

### Requirement: Single theme source
The system SHALL use `super-system.json` as the project-owned source of truth for colors (including success), typography, spacing, radii, shadows, density, and motion preferences.

#### Scenario: A token is changed
- **GIVEN** a project initialized with Super System
- **WHEN** a maintainer changes a token in `super-system.json` and rebuilds the theme
- **THEN** every consumer of the corresponding generated CSS custom property receives the new value
- **AND** component source files do not require individual visual edits

### Requirement: Versioned configuration
The theme configuration SHALL include a schema version and SHALL reject unsupported or structurally invalid input with an actionable validation error.

#### Scenario: An invalid configuration is compiled
- **GIVEN** a theme file with missing required token groups or an unsupported schema version
- **WHEN** the compiler validates the file
- **THEN** compilation fails before CSS is written
- **AND** the error identifies the invalid field or version

### Requirement: Light and dark themes
The compiler SHALL generate light-theme and dark-theme CSS custom properties from one configuration.

#### Scenario: The active theme changes
- **GIVEN** generated Super System CSS is loaded
- **WHEN** the application changes the active theme from light to dark
- **THEN** semantic colors resolve to their dark-theme values
- **AND** component markup remains unchanged

### Requirement: Portable generated CSS
The compiler SHALL emit standards-based CSS custom properties that can be consumed without React or a utility-CSS framework.

#### Scenario: Tokens are used outside React
- **GIVEN** a plain HTML or non-React application
- **WHEN** the generated stylesheet is imported
- **THEN** the application can use Super System variables through standard CSS

### Requirement: Density and motion preferences
The theme SHALL expose density-aware sizing and SHALL support reduced-motion preferences without requiring per-component configuration.

#### Scenario: Reduced motion is requested
- **GIVEN** a user whose operating system requests reduced motion
- **WHEN** Super System component styles are rendered
- **THEN** non-essential transitions and animations are removed or materially reduced

### Requirement: Semantic overlay tokens
The theme system SHALL define semantic tokens for overlay backdrop and shadow treatments with light and dark defaults, and the token compiler SHALL emit corresponding CSS custom properties consumed by dialog, drawer, and popover styles.

#### Scenario: Overlay styles use theme tokens
- **GIVEN** a project using the default Super System theme
- **WHEN** dialog and drawer overlays render
- **THEN** backdrop and shadow treatments derive from compiled overlay semantic tokens rather than hardcoded colour mixes

#### Scenario: A custom theme changes overlay appearance
- **GIVEN** an application with customized overlay semantic tokens in `super-system.json`
- **WHEN** the theme stylesheet is regenerated
- **THEN** overlay components adopt the customized backdrop and shadow values

### Requirement: Semantic success tokens
The theme system SHALL define semantic success foreground and background tokens with light and dark defaults, and the token compiler SHALL emit corresponding CSS custom properties consumed by KPI trends and other positive-state UI.

#### Scenario: Success styling uses theme tokens
- **GIVEN** a project using the default Super System theme
- **WHEN** a positive KPI trend renders
- **THEN** its colors derive from compiled success semantic tokens

#### Scenario: A custom theme changes success appearance
- **GIVEN** an application with customized success semantic tokens in `super-system.json`
- **WHEN** the theme stylesheet is regenerated
- **THEN** positive-state UI adopts the customized success values

### Requirement: Distinct semantic surfaces
Default light and dark themes SHALL assign distinguishable values to secondary and muted surface tokens so surface hierarchy remains visible without component-specific overrides.

#### Scenario: Secondary and muted surfaces differ in the default theme
- **GIVEN** the unmodified default theme
- **WHEN** secondary and muted surfaces render adjacent to one another
- **THEN** they are visually distinguishable

### Requirement: Focus token distinctiveness
Default themes SHALL assign focus ring tokens that remain distinguishable from primary brand colors while meeting configured contrast targets against relevant surfaces.

#### Scenario: Focus and primary colors differ in the default light theme
- **GIVEN** the unmodified default light theme
- **WHEN** a focused primary button renders
- **THEN** the focus ring remains visually distinguishable from the primary fill
