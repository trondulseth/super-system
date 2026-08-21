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
The Studio SHALL load the current `super-system.json`, allow supported tokens to be edited visually, validate changes, and save valid changes back to that file. Supported color tokens SHALL include all semantic theme colors required by component previews, including success colors. Supported shape and spacing tokens SHALL include radius small, medium, large, and full values, spacing unit, line height, and monospace font family in addition to existing brand, semantic, density, icon, and accessibility controls. Color fields SHALL provide both picker and text entry synced in both directions.

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

#### Scenario: Spacing unit is edited
- **GIVEN** the spacing section is visible
- **WHEN** the user changes spacing unit
- **THEN** the preview theme reflects updated spacing through compiled CSS variables

#### Scenario: Radius full is edited
- **GIVEN** the shape section is visible
- **WHEN** the user changes radius full
- **THEN** pill-shaped preview elements adopt the updated radius

#### Scenario: A color is edited via text input
- **GIVEN** a color field with paired picker and text inputs
- **WHEN** the user pastes a valid hex color into the text field
- **THEN** the picker and preview update to match

### Requirement: Immediate component preview
The Studio SHALL preview representative components in light and dark themes as supported token values change. Previews SHALL include primary, disabled, invalid, and neutral states for form and feedback components, representative navigation, disclosure, overlay, dashboard, and page-shell examples, and every exported React component category or documented runtime-only exceptions including chart tone variants, toast variants, focus-visible states, layout primitives, and full page-shell composition.

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

#### Scenario: Chart tone variants are previewed
- **GIVEN** the component preview panel is visible
- **WHEN** the user inspects chart examples
- **THEN** primary, secondary, destructive, and muted tones are demonstrated for each chart type

#### Scenario: Layout primitives are previewed with token-driven spacing
- **GIVEN** the layout preview section is visible
- **WHEN** the user changes density or spacing unit
- **THEN** stack, row, and container examples reflect the updated spacing without inline style overrides

#### Scenario: Page shell composition is previewed
- **GIVEN** the page shell preview section is visible
- **WHEN** the user inspects navigation examples
- **THEN** sidebar, active navigation state, and mobile menu patterns are demonstrated

### Requirement: Contrast feedback
The Studio SHALL display WCAG contrast results for supported foreground/background pairs for both light and dark themes before the user saves the theme, including success and focus pairs where applicable.

#### Scenario: Contrast falls below the target
- **GIVEN** a configured minimum contrast target
- **WHEN** an edited color pair falls below that target
- **THEN** the Studio clearly identifies the failing pair and measured ratio

#### Scenario: Both theme modes show contrast results
- **GIVEN** the contrast panel is visible
- **WHEN** the user edits colors in either light or dark mode
- **THEN** contrast results for both themes remain visible or easily accessible

### Requirement: Metadata field clarity
The Studio SHALL distinguish configuration metadata fields that do not yet affect the live preview from fields that do.

#### Scenario: Icon library is selected
- **GIVEN** the icon library select is visible
- **WHEN** the user reads its helper text
- **THEN** it explains how to install the configured library and preview representative icon sizes in the component panel

### Requirement: Config-only field clarity
The Studio SHALL distinguish configuration fields that affect the live preview immediately from fields that are persisted for application runtime only, and SHALL indicate which theme (light or dark) is currently being edited.

#### Scenario: A config-only field is shown
- **GIVEN** reduced-motion default or mode.default controls are visible
- **WHEN** the user reads their helper text
- **THEN** it is clear whether the field affects the live preview or only saved configuration

#### Scenario: The active editing theme is visible
- **GIVEN** the Studio sidebar is visible
- **WHEN** the user toggles preview theme
- **THEN** the interface clearly indicates whether light or dark theme colors are being edited

### Requirement: Demo styling separation
Studio static previews SHALL use demo-only CSS modifiers that are not shipped in the production React component stylesheet.

#### Scenario: Studio demo builds successfully after CSS separation
- **GIVEN** demo modifier styles live in Studio assets only
- **WHEN** the Studio demo bundle is built
- **THEN** all static component previews render correctly
- **AND** the production React stylesheet omits demo modifiers

### Requirement: Save validation
The Studio SHALL validate numeric and color fields before persisting configuration and SHALL reject or correct out-of-range values with actionable feedback.

#### Scenario: An invalid line height is submitted
- **GIVEN** a line height field outside the supported range
- **WHEN** the user attempts to save
- **THEN** the Studio prevents saving invalid configuration
- **AND** the user receives actionable feedback

### Requirement: Preview-scoped motion configuration
Reduced-motion defaults injected for preview SHALL affect only the preview region unless the operating system already requests reduced motion globally.

#### Scenario: Reduced motion default is toggled
- **GIVEN** the reduced motion default checkbox is toggled
- **WHEN** the preview renders transitions
- **THEN** preview component motion reflects the setting without disabling unrelated Studio chrome animations unless the OS prefers reduced motion
