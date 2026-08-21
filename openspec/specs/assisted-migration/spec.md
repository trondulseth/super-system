# Assisted Migration Specification

## Purpose

Define a safe, reviewable CLI workflow for planning and applying deterministic migrations from legacy UI patterns toward Super System in existing projects.

## Requirements

### Requirement: Read-only migration plan
The CLI SHALL generate a migration plan without changing application files unless write mode is explicitly requested.

#### Scenario: A user evaluates an existing project
- **GIVEN** a project containing design-system bypasses
- **WHEN** the user runs the migration planning command
- **THEN** the command reports proposed changes, confidence, and unsupported work
- **AND** application files remain unchanged

### Requirement: Reviewable dry run
The migration command SHALL show the exact proposed file changes before applying them.

#### Scenario: A dry run is requested
- **GIVEN** a plan containing supported transformations
- **WHEN** the user requests a dry run
- **THEN** a reviewable diff is produced
- **AND** no proposed change is written

### Requirement: Protected write mode
Write mode SHALL require explicit selection and SHALL protect projects with uncommitted source-control changes unless the user explicitly overrides that protection.

#### Scenario: The worktree is dirty
- **GIVEN** a source-controlled project with uncommitted changes
- **WHEN** the user attempts to apply a migration without override
- **THEN** the command stops before writing
- **AND** explains how to create a safe checkpoint or consciously override

### Requirement: Deterministic supported transforms
Supported transformations SHALL be syntax-aware, repeatable, and idempotent.

#### Scenario: A completed transform is rerun
- **GIVEN** a supported transformation has already been applied
- **WHEN** the same migration is run again
- **THEN** it does not duplicate imports, wrappers, attributes, or token replacements

### Requirement: Post-migration verification
The migration flow SHALL rerun relevant build, type, audit, and test commands when configured and SHALL summarize any remaining manual work.

#### Scenario: An applied change breaks a configured check
- **GIVEN** a migration has written application files
- **WHEN** post-migration verification detects a failure
- **THEN** the failure and affected command are reported
- **AND** rollback guidance is shown
