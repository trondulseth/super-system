# Theme Studio Specification

## Purpose

Define the local visual editor used to safely adjust theme tokens while previewing their effect.

## Requirements

### Requirement: Local-first studio
The Studio SHALL run locally and bind to the loopback interface by default so project configuration is not exposed to the network.

#### Scenario: Studio starts with defaults
- **GIVEN** an initialized project
- **WHEN** the user runs `super-system studio`
- **THEN** the editor is available from the local machine
- **AND** it is not bound to a public network interface by default

### Requirement: Configuration editing
The Studio SHALL load the current `super-system.json`, allow supported tokens to be edited visually, validate changes, and save valid changes back to that file. Supported color tokens SHALL include all semantic theme colors required by Batch 1 component previews.

#### Scenario: A valid color is saved
- **GIVEN** the Studio is open on a valid project
- **WHEN** the user changes a supported color token and saves
- **THEN** the configuration file contains that change
- **AND** invalid unrelated values are not introduced

#### Scenario: Semantic colors are edited
- **GIVEN** the Studio sidebar is visible
- **WHEN** the user edits muted, border, destructive, or focus colors
- **THEN** those values are collected, previewed, and persisted with other theme colors

### Requirement: Immediate component preview
The Studio SHALL preview representative components in light and dark themes as supported token values change. Previews SHALL include primary, disabled, invalid, and neutral states for form and feedback components shipped in Batch 1 and representative navigation and disclosure examples shipped in Batch 2.

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
- **THEN** static preview markup demonstrates the shipped Batch 2 class names and ARIA landmarks

### Requirement: Contrast feedback
The Studio SHALL display WCAG contrast results for supported foreground/background pairs before the user saves the theme.

#### Scenario: Contrast falls below the target
- **GIVEN** a configured minimum contrast target
- **WHEN** an edited color pair falls below that target
- **THEN** the Studio clearly identifies the failing pair and measured ratio

### Requirement: Metadata field clarity
The Studio SHALL distinguish configuration metadata fields that do not yet affect the live preview from fields that do.

#### Scenario: Icon library is selected
- **GIVEN** the icon library select is visible
- **WHEN** the user reads its helper text
- **THEN** it is clear the setting is saved for future use and does not yet change preview icons
