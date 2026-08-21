# Accessibility Delta

## MODIFIED Requirements

### Requirement: Semantic component behavior
Components SHALL preserve native semantics and accessibility attributes for their underlying controls. Composite labeling components SHALL propagate required and disabled state to associated controls when composed as documented, including wrapped `Radio` controls.

#### Scenario: Assistive technology inspects a disabled control
- **GIVEN** a disabled Super System control
- **WHEN** assistive technology reads it
- **THEN** the disabled state is programmatically available

#### Scenario: A required labeled control is inspected
- **GIVEN** a required field using the documented wrapping label pattern
- **WHEN** assistive technology reads the control
- **THEN** the required state is programmatically available

#### Scenario: A required labeled radio is inspected
- **GIVEN** a required field using the documented wrapping label pattern with a Radio control
- **WHEN** assistive technology reads the control
- **THEN** the required state is programmatically available

## ADDED Requirements

### Requirement: Modal dialog labelling
Modal dialogs and drawers SHALL reference title and description elements in ARIA attributes only when those elements are present in the content tree.

#### Scenario: Assistive technology reads a minimal dialog
- **GIVEN** a dialog with body content but no title or description
- **WHEN** assistive technology inspects the dialog
- **THEN** no broken references to missing label elements are exposed

### Requirement: Pagination ellipsis readability
Pagination ellipsis affordances SHALL expose skipped-range meaning to assistive technology without hiding explanatory text behind `aria-hidden` on a parent element.

#### Scenario: A screen reader user encounters an ellipsis
- **GIVEN** a pagination control showing an ellipsis
- **WHEN** assistive technology reads the ellipsis region
- **THEN** text explaining additional pages is available

### Requirement: Toast live region consistency
Toast viewports SHALL use live-region politeness that matches the urgency of published toasts and avoids conflicting announcement semantics between container and child.

#### Scenario: A destructive toast is published
- **GIVEN** a destructive toast in the viewport
- **WHEN** it is added to the live region
- **THEN** assistive technology can treat it as an urgent announcement consistently at both viewport and toast level

### Requirement: Focus management in empty modals
When a modal surface opens and contains no tabbable elements, focus SHALL move to the modal container so keyboard users are not left without a focus target.

#### Scenario: A keyboard user opens a minimal dialog
- **GIVEN** a dialog without interactive controls
- **WHEN** it opens
- **THEN** focus moves into the dialog surface
