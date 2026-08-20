# Theme System Specification

## Purpose

Define the portable design-token contract that keeps an application's visual language consistent across components, themes, and frameworks.

## Requirements

### Requirement: Single theme source
The system SHALL use `super-system.json` as the project-owned source of truth for colors, typography, spacing, radii, shadows, density, and motion preferences.

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
