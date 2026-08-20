# CLI Tooling Specification

## Purpose

Define a beginner-friendly command line that installs, configures, validates, and maintains Super System in application projects.

## Requirements

### Requirement: Supported runtime
The CLI SHALL run on supported Node.js 20 or newer environments and SHALL provide actionable errors for unsupported execution conditions.

#### Scenario: Help is requested
- **GIVEN** a supported Node.js environment
- **WHEN** a user runs the CLI with the help flag
- **THEN** available commands and their usage are displayed without modifying the project

### Requirement: Safe initialization
The `init` command SHALL create the required configuration, generated theme, and integration guidance without overwriting existing project-owned files unless the user explicitly selects a force option.

#### Scenario: Initialization finds an existing configuration
- **GIVEN** a project containing `super-system.json`
- **WHEN** the user runs `super-system init` without force
- **THEN** the command stops before replacing that file
- **AND** explains how to proceed safely

### Requirement: Deterministic theme build
The `build-theme` command SHALL validate the project configuration and deterministically generate the theme stylesheet in the documented location.

#### Scenario: A valid theme is built
- **GIVEN** a valid `super-system.json`
- **WHEN** the user runs `super-system build-theme`
- **THEN** the generated CSS represents the current configuration
- **AND** repeated builds with unchanged input produce equivalent output

### Requirement: Explicit project location
Project-scoped commands SHALL support running against an explicit working directory.

#### Scenario: A parent workspace invokes the CLI
- **GIVEN** an application in a nested directory
- **WHEN** a command is given that directory as its project location
- **THEN** reads and writes are confined to that application

### Requirement: Useful command outcomes
Commands SHALL print concise human-readable results and SHALL return a non-zero exit code when validation, compilation, or policy checks fail.

#### Scenario: A command fails validation
- **GIVEN** invalid project input
- **WHEN** a validating command runs
- **THEN** it exits unsuccessfully
- **AND** reports enough context to correct the input
