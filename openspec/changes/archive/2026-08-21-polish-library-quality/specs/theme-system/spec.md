# Theme System Delta

## ADDED Requirements

### Requirement: Semantic overlay tokens
The theme system SHALL define semantic tokens for overlay backdrop and shadow treatments with light and dark defaults, and the token compiler SHALL emit corresponding CSS custom properties consumed by dialog, drawer, and popover styles.

#### Scenario: Overlay styles use theme tokens
- **GIVEN** a project using the default Super System theme
- **WHEN** dialog and drawer overlays render
- **THEN** backdrop and shadow treatments derive from compiled overlay semantic tokens rather than hardcoded colour mixes

#### Scenario: A custom theme changes overlay appearance
- **GIVEN** an application with customized overlay semantic tokens in `super-system.json`
- **WHEN** the theme stylesheet is regenerated
- **THEN** overlay components adopt the customized backdrop and shadow values
