# Accessibility Delta

## MODIFIED Requirements

### Requirement: Semantic component behavior
Components SHALL preserve native semantics and accessibility attributes for their underlying controls. Composite labeling components SHALL propagate required and disabled state to associated controls when composed as documented.

#### Scenario: Assistive technology inspects a disabled control
- **GIVEN** a disabled Super System control
- **WHEN** assistive technology reads it
- **THEN** the disabled state is programmatically available

#### Scenario: A required labeled control is inspected
- **GIVEN** a required field using the documented wrapping label pattern
- **WHEN** assistive technology reads the control
- **THEN** the required state is programmatically available

## ADDED Requirements

### Requirement: Live region appropriateness
Informational alerts SHALL default to non-interrupting live region semantics unless configured for urgent interruption.

#### Scenario: A neutral alert is announced
- **GIVEN** a neutral informational alert
- **WHEN** it appears after page load
- **THEN** assistive technology can treat it as a status update rather than an urgent interruption by default

### Requirement: High contrast and motion preferences
Interactive component styles SHALL remain operable under forced-colors mode, and non-essential motion SHALL respect reduced-motion preferences in component-level styles.

#### Scenario: A keyboard user focuses a control in forced-colors mode
- **GIVEN** forced-colors mode is active
- **WHEN** focus reaches a Super System interactive component
- **THEN** a visible focus treatment or system highlight remains available
