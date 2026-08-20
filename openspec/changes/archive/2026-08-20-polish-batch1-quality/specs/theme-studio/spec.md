# Theme Studio Delta

## MODIFIED Requirements

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
The Studio SHALL preview representative components in light and dark themes as supported token values change. Previews SHALL include primary, disabled, invalid, and neutral states for form and feedback components shipped in Batch 1.

#### Scenario: Button tokens are adjusted
- **GIVEN** a button preview is visible
- **WHEN** the user adjusts a relevant color, radius, or spacing token
- **THEN** the preview reflects the proposed value without requiring an application rebuild

#### Scenario: Invalid and disabled controls are previewed
- **GIVEN** the component preview panel is visible
- **WHEN** the user inspects form controls
- **THEN** disabled and invalid examples are shown alongside default states
- **AND** a neutral alert variant is shown alongside primary and destructive alerts

## ADDED Requirements

### Requirement: Metadata field clarity
The Studio SHALL distinguish configuration metadata fields that do not yet affect the live preview from fields that do.

#### Scenario: Icon library is selected
- **GIVEN** the icon library select is visible
- **WHEN** the user reads its helper text
- **THEN** it is clear the setting is saved for future use and does not yet change preview icons
