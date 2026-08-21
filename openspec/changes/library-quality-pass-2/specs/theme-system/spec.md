# Theme System Delta

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Single theme source
The system SHALL use `super-system.json` as the project-owned source of truth for colors (including success), typography, spacing, radii, shadows, density, and motion preferences.

#### Scenario: A token is changed
- **GIVEN** a project initialized with Super System
- **WHEN** a maintainer changes a token in `super-system.json` and rebuilds the theme
- **THEN** every consumer of the corresponding generated CSS custom property receives the new value
- **AND** component source files do not require individual visual edits
