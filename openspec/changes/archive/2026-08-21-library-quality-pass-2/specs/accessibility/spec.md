# Accessibility Delta

## MODIFIED Requirements

### Requirement: Modal dialog labelling
Modal dialogs and drawers SHALL reference title and description elements in ARIA attributes only when those elements are present in the content tree, and SHALL require either a visible title or an explicit accessible name on the content region.

#### Scenario: Assistive technology reads a minimal dialog
- **GIVEN** a dialog with body content but no title or description
- **WHEN** assistive technology inspects the dialog
- **THEN** no broken references to missing label elements are exposed

#### Scenario: A dialog without a title provides an explicit name
- **GIVEN** a dialog without a title component
- **WHEN** it opens with an explicit accessible name on the content region
- **THEN** assistive technology can identify the dialog purpose

### Requirement: Focus management in empty modals
When a modal surface opens and contains no tabbable elements, focus SHALL move to the modal container so keyboard users are not left without a focus target. While a modal is open, background content outside the modal portal SHALL be inert or hidden from assistive technology using a ref-counted strategy compatible with nested modals.

#### Scenario: A keyboard user opens a minimal dialog
- **GIVEN** a dialog without interactive controls
- **WHEN** it opens
- **THEN** focus moves into the dialog surface

#### Scenario: Background content is inaccessible during a modal
- **GIVEN** an open modal dialog over page content
- **WHEN** assistive technology navigates the page
- **THEN** background content outside the modal is not interactively available until the modal closes

### Requirement: Toast live region consistency
Toast viewports SHALL use live-region politeness that avoids duplicate urgent announcements when both viewport and toast expose alert semantics.

#### Scenario: A destructive toast is published
- **GIVEN** a destructive toast in the viewport
- **WHEN** it is added to the live region
- **THEN** assistive technology receives a single coherent urgent announcement

## ADDED Requirements

### Requirement: Tooltip accessibility for disabled controls
Disabled interactive controls SHALL remain able to expose supplementary descriptions when composed with the documented tooltip wrapper pattern.

#### Scenario: A screen reader user focuses a disabled control with a tooltip
- **GIVEN** a disabled control with supplementary tooltip content
- **WHEN** keyboard focus reaches the control
- **THEN** the supplementary description remains available where supported by the pattern

### Requirement: Chart value accessibility
Chart components SHALL support exposing underlying data values to assistive technology beyond decorative image semantics when configured for accessible data presentation.

#### Scenario: A screen reader user reads chart values
- **GIVEN** a chart configured to expose its data accessibly
- **WHEN** assistive technology reads the chart region
- **THEN** numeric values from the dataset are available
