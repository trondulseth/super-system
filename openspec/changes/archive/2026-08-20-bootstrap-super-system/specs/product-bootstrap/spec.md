# Product Bootstrap Delta

## ADDED Requirements

### Requirement: Installable independent toolkit
The beta SHALL be usable through public npm packages without requiring Codex, ChatGPT, or another AI environment.

#### Scenario: A developer installs Super System manually
- **GIVEN** a standard Node.js project and npm registry access
- **WHEN** the developer installs a published Super System package
- **THEN** the package can be configured and used through documented files and commands

### Requirement: Centralized visual decisions
The beta SHALL centralize supported visual decisions in a project-owned configuration and generated CSS variables.

#### Scenario: A shared button color changes
- **GIVEN** multiple screens using Super System button styles
- **WHEN** the semantic button color token is changed and rebuilt
- **THEN** all those screens receive the updated color

### Requirement: Secure public beta
The initial public release SHALL be verified by repository quality gates and published through npm Trusted Publishing.

#### Scenario: Version 0.1.0-beta.1 is released
- **GIVEN** successful type checks, tests, builds, and smoke checks
- **WHEN** the authorized GitHub release workflow publishes the packages
- **THEN** all three scoped packages become available through the beta tag with provenance
