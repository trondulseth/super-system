# Theme Studio Delta

## MODIFIED Requirements

### Requirement: Configuration editing
The Studio SHALL load the current `super-system.json`, allow supported tokens to be edited visually, validate changes, and save valid changes back to that file. Supported color tokens SHALL include all semantic theme colors required by component previews. Supported shape and typography tokens SHALL include radius small and large values, line height, and monospace font family in addition to existing brand, semantic, density, icon, and accessibility controls.

#### Scenario: A valid color is saved
- **GIVEN** the Studio is open on a valid project
- **WHEN** the user changes a supported color token and saves
- **THEN** the configuration file contains that change
- **AND** invalid unrelated values are not introduced

#### Scenario: Semantic colors are edited
- **GIVEN** the Studio sidebar is visible
- **WHEN** the user edits muted, border, destructive, or focus colors
- **THEN** those values are collected, previewed, and persisted with other theme colors

#### Scenario: Radius ladder is edited
- **GIVEN** the Studio sidebar is visible
- **WHEN** the user edits small, medium, or large radius values
- **THEN** those values are collected, previewed where applicable, and persisted with other theme tokens

#### Scenario: Line height is edited
- **GIVEN** the typography section is visible
- **WHEN** the user changes line height
- **THEN** the preview theme reflects the updated line height through compiled CSS variables

### Requirement: Immediate component preview
The Studio SHALL preview representative components in light and dark themes as supported token values change. Previews SHALL include primary, disabled, invalid, and neutral states for form and feedback components and representative navigation, disclosure, and overlay examples including quality-hardening states from the library quality pass.

#### Scenario: Button tokens are adjusted
- **GIVEN** a button preview is visible
- **WHEN** the user adjusts a relevant color, radius, or spacing token
- **THEN** the preview reflects the proposed value without requiring an application rebuild

#### Scenario: Invalid and disabled controls are previewed
- **GIVEN** the component preview panel is visible
- **WHEN** the user inspects form controls
- **THEN** disabled and invalid examples are shown alongside default states
- **AND** a neutral alert variant is shown alongside primary and destructive alerts

#### Scenario: Navigation components are previewed
- **GIVEN** the component preview panel is visible
- **WHEN** the user inspects tabs, accordion, breadcrumb, dropdown menu, and pagination sections
- **THEN** static preview markup demonstrates the shipped class names and ARIA landmarks

#### Scenario: Disabled and structural variants are previewed
- **GIVEN** the component preview panel is visible
- **WHEN** the user inspects accordion, tabs, dialog, popover, and inline label examples
- **THEN** disabled accordion items, top popovers, inline labels, and dialog ARIA variants are demonstrated

## ADDED Requirements

### Requirement: Config-only field clarity
The Studio SHALL distinguish configuration fields that affect the live preview immediately from fields that are persisted for application runtime only.

#### Scenario: A config-only field is shown
- **GIVEN** reduced-motion default or mode.default controls are visible
- **WHEN** the user reads their helper text
- **THEN** it is clear whether the field affects the live preview or only saved configuration

### Requirement: Demo styling separation
Studio static previews SHALL use demo-only CSS modifiers that are not shipped in the production React component stylesheet.

#### Scenario: Studio demo builds successfully after CSS separation
- **GIVEN** demo modifier styles live in Studio assets only
- **WHEN** the Studio demo bundle is built
- **THEN** all static component previews render correctly
- **AND** the production React stylesheet omits demo modifiers
