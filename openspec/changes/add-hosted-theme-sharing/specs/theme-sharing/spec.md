# Hosted Theme Sharing Delta

## ADDED Requirements

### Requirement: Explicit theme publication
The system SHALL upload a theme only after an explicit user action that identifies the data leaving the local project.

#### Scenario: A local theme is shared
- **GIVEN** a valid local configuration
- **WHEN** the user chooses to publish a preview and confirms the disclosed fields
- **THEN** only the validated theme data and documented metadata are uploaded
- **AND** application source files are not uploaded

### Requirement: Immutable public snapshot
Each published theme version SHALL have a read-only public preview whose rendered content cannot be changed in place.

#### Scenario: A shared theme is edited locally
- **GIVEN** an existing public snapshot
- **WHEN** the local theme changes
- **THEN** the existing snapshot continues to show its original version
- **AND** publishing the update creates a new version

### Requirement: Revocation and expiry
Anonymous shared previews SHALL support expiration and revocation through a secret separate from the public identifier.

#### Scenario: A snapshot is revoked
- **GIVEN** a valid management secret
- **WHEN** its owner revokes the snapshot
- **THEN** the public preview stops serving the theme

### Requirement: Local operation remains independent
Hosted sharing SHALL be optional and SHALL NOT be required for theme compilation, local Studio use, application builds, audits, or component rendering.

#### Scenario: The hosted service is unavailable
- **GIVEN** a configured local project without network access
- **WHEN** the user builds the theme or runs the local Studio
- **THEN** the local operation continues normally

### Requirement: Historical schema clarity
The hosted preview SHALL either render a stored schema version accurately or clearly report that it is unsupported without silently changing its meaning.

#### Scenario: An old snapshot is opened
- **GIVEN** a snapshot using an older schema
- **WHEN** the preview service receives it
- **THEN** it uses a compatible renderer or displays an explicit unsupported-version state
