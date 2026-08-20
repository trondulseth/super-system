# UI Audit Specification

## Purpose

Define static checks that help teams find visual values and component patterns that bypass the design system.

## Requirements

### Requirement: Supported source scan
The audit command SHALL scan documented web source-file types within the selected project while excluding dependencies, generated output, version-control data, and configured ignored paths.

#### Scenario: A project is audited
- **GIVEN** a project with application source and installed dependencies
- **WHEN** `super-system audit` runs
- **THEN** eligible application files are inspected
- **AND** dependency and generated directories are not reported as product violations

### Requirement: Design-system bypass detection
The audit SHALL report supported patterns including hard-coded visual colors, arbitrary spacing values, and raw interactive elements that should use shared primitives.

#### Scenario: A hard-coded color is found
- **GIVEN** an eligible source file containing a disallowed literal color
- **WHEN** the audit runs
- **THEN** a finding identifies the file, location, rule, and remediation direction

### Requirement: Human and machine output
The audit SHALL support readable terminal output and structured JSON output suitable for automation.

#### Scenario: CI requests JSON
- **GIVEN** a project with audit findings
- **WHEN** JSON output is selected
- **THEN** findings are emitted as valid structured data
- **AND** no decorative terminal formatting corrupts that data

### Requirement: Policy exit status
The audit SHALL return an unsuccessful exit status when findings meet the configured failure threshold.

#### Scenario: Blocking findings exist
- **GIVEN** at least one finding at or above the failure threshold
- **WHEN** the audit completes
- **THEN** the process exits non-zero so continuous integration can block the change
