# Distribution Specification

## Purpose

Define how Super System is packaged, verified, documented, and released for independent use from any AI environment.

## Requirements

### Requirement: Public package split
The project SHALL publish separate public packages for framework-independent tokens, React components, and command-line tooling under the `@super-system` npm scope.

#### Scenario: A non-React project installs tokens
- **GIVEN** a project that does not use React
- **WHEN** it installs `@super-system/tokens`
- **THEN** React is not required to compile or consume the token output

### Requirement: Beta release availability
The packages `@super-system/tokens`, `@super-system/react`, and `@super-system/cli` SHALL be publicly available at version `0.1.0-beta.1` under the npm beta distribution tag.

#### Scenario: A user installs the beta CLI
- **GIVEN** access to the public npm registry
- **WHEN** the user installs `@super-system/cli@beta`
- **THEN** npm resolves the published beta release

### Requirement: Trusted publication
Package releases SHALL use npm Trusted Publishing from GitHub Actions with OpenID Connect and SHALL not require a long-lived npm publication token in the repository.

#### Scenario: An authorized release runs
- **GIVEN** the configured GitHub repository and npm trusted publisher
- **WHEN** the release workflow publishes an approved version
- **THEN** npm authenticates the workflow through trusted provenance

### Requirement: Release dependency order
Releases SHALL publish tokens before React and CLI packages so workspace dependencies are available when dependent packages are published.

#### Scenario: All packages are released together
- **GIVEN** a new coordinated version
- **WHEN** the publication workflow runs
- **THEN** `@super-system/tokens` is published before its dependents

### Requirement: Verification gates
The repository SHALL run type checking, tests, package builds, and clean-package smoke checks before a release is considered ready.

#### Scenario: A package cannot be consumed cleanly
- **GIVEN** a build that fails its clean-project smoke test
- **WHEN** continuous integration evaluates it
- **THEN** the release is blocked

### Requirement: Open source documentation
The public GitHub repository SHALL include the MIT license and beginner-oriented instructions covering installation, initialization, theme editing, React usage, dark mode, auditing, and release status.

#### Scenario: A first-time user opens the repository
- **GIVEN** no prior Super System experience
- **WHEN** the user follows the README quick start
- **THEN** the user can identify the required package and the next command to initialize a project
