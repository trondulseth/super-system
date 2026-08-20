# Distribution Hardening Delta

## ADDED Requirements

### Requirement: Release metadata
Every user-visible change SHALL carry structured release metadata sufficient to generate package changelogs and identify breaking changes, deprecations, and migrations.

#### Scenario: A release candidate is assembled
- **GIVEN** merged user-visible changes
- **WHEN** the release workflow prepares a candidate
- **THEN** each change appears in the generated changelog under the correct category

### Requirement: Clean consumer matrix
Release candidates SHALL be installed from packed artifacts in clean projects covering the documented supported runtime and framework matrix.

#### Scenario: An export is missing from the package
- **GIVEN** source tests pass but a packed package omits a required file
- **WHEN** a clean-project fixture imports that export
- **THEN** the release-candidate workflow fails before publication

### Requirement: Explicit stable publication
A stable npm release SHALL require explicit authorization and successful completion of all release-candidate gates.

#### Scenario: A workflow is triggered without approval
- **GIVEN** a commit that has passed normal continuous integration
- **WHEN** no stable-release approval has been provided
- **THEN** the workflow does not publish a stable npm version

### Requirement: Verifiable provenance
Published packages SHALL expose npm provenance tied to the authorized repository workflow, and post-publication verification SHALL confirm version, tag, contents, and provenance.

#### Scenario: Publication succeeds incompletely
- **GIVEN** npm accepts a package but post-publication verification finds incorrect metadata
- **WHEN** the release workflow evaluates the result
- **THEN** it reports the release as failed or partial
- **AND** initiates the documented recovery procedure

### Requirement: Stable compatibility policy
Before `1.0.0`, the project SHALL publish the supported environments and the compatibility rules for JavaScript exports, TypeScript types, configuration schema, CLI behavior, and public CSS variables.

#### Scenario: A post-1.0 breaking change is proposed
- **GIVEN** a proposed removal of a documented public API
- **WHEN** release metadata is validated
- **THEN** the change requires the appropriate major version and migration guidance

### Requirement: Reviewed visual regression
Release candidates SHALL compare representative UI states with approved visual baselines and SHALL require intentional review before a changed baseline is accepted.

#### Scenario: Component padding changes unexpectedly
- **GIVEN** an approved visual baseline
- **WHEN** a release candidate renders a materially different component state
- **THEN** the visual-regression check fails with reviewable artifacts
- **AND** does not replace the baseline automatically
