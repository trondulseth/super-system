# Governance and AI Adapters Specification

## Purpose

Define a vendor-neutral governance layer for Super System: canonical policy, CI-enforceable checks, shared ESLint rules, syntax-aware audits, and optional AI instruction adapters that preserve user-authored content.

## Requirements

### Requirement: Canonical AI-neutral policy
The project SHALL support a versioned policy file whose enforceable rules do not depend on a specific AI vendor.

#### Scenario: No AI tool is installed
- **GIVEN** a project with a valid Super System policy
- **WHEN** the CLI checks that policy
- **THEN** rules can be enforced without an AI service or adapter

### Requirement: Generated instruction adapters
The CLI SHALL generate optional tool-specific instructions from the canonical policy and current Super System configuration.

#### Scenario: An adapter is generated
- **GIVEN** a valid canonical policy and a selected supported target
- **WHEN** the user runs adapter generation
- **THEN** the output expresses the same design-system constraints in the target format
- **AND** identifies itself as generated content

### Requirement: Preserve user instructions
Adapter generation SHALL preserve content outside clearly owned generated sections and SHALL preview potentially conflicting changes.

#### Scenario: A target file has manual guidance
- **GIVEN** an existing instruction file containing user-authored text
- **WHEN** the adapter is updated
- **THEN** the user-authored text remains unchanged
- **AND** only the generated section is replaced

### Requirement: Deprecation lifecycle
Governance metadata SHALL identify deprecated tokens and components, their replacements, and the earliest release in which they may be removed.

#### Scenario: Deprecated API is audited
- **GIVEN** a project using an API marked deprecated
- **WHEN** governance checks run
- **THEN** the finding names the replacement and applicable removal timeline

### Requirement: CI-enforceable policy
Policy checks SHALL provide structured results and meaningful exit statuses for continuous integration.

#### Scenario: A blocking governance rule fails
- **GIVEN** a policy that marks a rule as blocking
- **WHEN** a violation is detected in CI
- **THEN** the command exits unsuccessfully
- **AND** emits the rule identifier and remediation

### Requirement: Shared ESLint rules
The project SHALL provide an ESLint plugin for supported source rules and SHALL keep shared rule identifiers, configuration, and outcomes aligned with CLI audit.

#### Scenario: A raw button violates policy
- **GIVEN** a supported source file and the same active rule configuration
- **WHEN** ESLint and CLI audit inspect the raw button
- **THEN** both report the same rule identifier and compatible remediation

### Requirement: Syntax-aware analysis
Rules whose correctness depends on program structure SHALL use syntax-aware analysis rather than unscoped text matching.

#### Scenario: The word button appears in a comment
- **GIVEN** a source comment mentioning a raw button but no violating element
- **WHEN** syntax-aware audit runs
- **THEN** it does not report the comment as a UI violation
