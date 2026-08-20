# Theme Studio Delta

## ADDED Requirements

### Requirement: Shared studio UI source
The Studio user interface SHALL be implemented in a shared package consumed by the CLI so visual and behavioral changes do not require maintaining separate copies.

#### Scenario: Studio UI is updated
- **GIVEN** a change to the shared Studio UI package
- **WHEN** the CLI and demo build pipelines run
- **THEN** both the local Studio and the generated static demo use the updated UI

### Requirement: Static public demo
The project SHALL provide a generated static Studio demo suitable for GitHub Pages that allows visitors to edit the default theme, preview light and dark modes, and view contrast feedback without installing the CLI.

#### Scenario: A visitor opens the public demo
- **GIVEN** the deployed GitHub Pages demo
- **WHEN** a visitor loads the page
- **THEN** the default theme is available for editing and preview
- **AND** contrast results update as supported tokens change

### Requirement: Demo theme export
The static demo SHALL export the edited theme as a downloadable `super-system.json` file instead of writing to a project on disk.

#### Scenario: A visitor exports a theme
- **GIVEN** an edited theme in the public demo
- **WHEN** the visitor chooses to download the theme
- **THEN** the browser downloads a valid `super-system.json` containing the edited configuration

### Requirement: Local studio remains primary
The static demo SHALL NOT replace or weaken the local-first Studio guarantees for CLI usage, including loopback binding and direct project file saves.

#### Scenario: A developer uses local Studio
- **GIVEN** an initialized local project
- **WHEN** the developer runs `super-system studio`
- **THEN** Studio binds to the loopback interface by default
- **AND** saving writes to the local `super-system.json`
