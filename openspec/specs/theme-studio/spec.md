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
The Studio SHALL load the current `super-system.json`, allow supported tokens to be edited visually, validate changes, and save valid changes back to that file.

#### Scenario: A valid color is saved
- **GIVEN** the Studio is open on a valid project
- **WHEN** the user changes a supported color token and saves
- **THEN** the configuration file contains that change
- **AND** invalid unrelated values are not introduced

### Requirement: Immediate component preview
The Studio SHALL preview representative components in light and dark themes as supported token values change.

#### Scenario: Button tokens are adjusted
- **GIVEN** a button preview is visible
- **WHEN** the user adjusts a relevant color, radius, or spacing token
- **THEN** the preview reflects the proposed value without requiring an application rebuild

### Requirement: Contrast feedback
The Studio SHALL display WCAG contrast results for supported foreground/background pairs before the user saves the theme.

#### Scenario: Contrast falls below the target
- **GIVEN** a configured minimum contrast target
- **WHEN** an edited color pair falls below that target
- **THEN** the Studio clearly identifies the failing pair and measured ratio
