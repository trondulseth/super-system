# React Components Delta

## ADDED Requirements

### Requirement: Extended SaaS primitives
The React package SHALL provide documented form, feedback, navigation, disclosure, and overlay primitives needed by common SaaS interfaces.

#### Scenario: A product team builds a settings screen
- **GIVEN** the expanded component package
- **WHEN** the team composes settings from labels, text inputs, textareas, checkboxes, radio groups, switches, selects, alerts, and tooltips
- **THEN** those controls share tokens, sizing, focus treatment, and state conventions

### Requirement: Composite keyboard behavior
Composite and overlay components SHALL implement the keyboard and focus behavior defined by their applicable accessibility pattern.

#### Scenario: A dialog is closed with the keyboard
- **GIVEN** a keyboard user opened a dialog from a trigger
- **WHEN** the user presses Escape
- **THEN** the dialog closes
- **AND** focus returns to the trigger when it remains available

### Requirement: Additive public API
New component exports SHALL be additive and SHALL preserve existing beta component imports unless a separately documented breaking change is approved.

#### Scenario: An existing application upgrades
- **GIVEN** an application importing the current Button and Card exports
- **WHEN** it installs the expanded compatible release
- **THEN** those existing imports continue to build without source changes

### Requirement: Component documentation
Every new component SHALL include a minimal example, complete public props, state behavior, and relevant accessibility guidance.

#### Scenario: A first-time user adopts a component
- **GIVEN** no prior knowledge of that component
- **WHEN** the user follows its documentation
- **THEN** a functional basic example can be added without reading package source

### Requirement: Normalized icon integration
The React package SHALL provide a documented icon integration that normalizes size and alignment and distinguishes decorative icons from icons that require an accessible name.

#### Scenario: An icon-only button is created
- **GIVEN** a button whose only visible content is an icon
- **WHEN** the component is rendered
- **THEN** the owning control requires or receives an accessible name
- **AND** the icon does not create duplicate assistive-technology output

### Requirement: Composable data table
The package SHALL provide token-driven Table primitives that preserve native table semantics and support responsive application guidance.

#### Scenario: Assistive technology reads a table
- **GIVEN** a table composed from Super System primitives with headers and data cells
- **WHEN** assistive technology navigates it
- **THEN** the native row, header, and cell relationships remain available
