# Framework Adapters Delta

## ADDED Requirements

### Requirement: Shared framework-neutral contract
Official framework adapters SHALL consume the same semantic theme output and conform to documented shared behavior and accessibility expectations.

#### Scenario: The primary color changes
- **GIVEN** React and another official adapter use the same theme
- **WHEN** the semantic primary token changes
- **THEN** equivalent components in both adapters receive the new value from generated CSS

### Requirement: Idiomatic adapter API
Each official adapter SHALL expose APIs idiomatic to its framework without introducing a React runtime dependency unless React is that adapter's declared framework.

#### Scenario: A non-React application installs its adapter
- **GIVEN** an official adapter for a non-React framework
- **WHEN** it is installed in a clean application
- **THEN** React is not required to render its components

### Requirement: Declared parity
Each adapter SHALL publish a machine-readable and human-readable statement of supported components, variants, states, and known parity gaps.

#### Scenario: A component is not yet supported
- **GIVEN** an adapter with partial catalog coverage
- **WHEN** a user checks its compatibility documentation
- **THEN** the missing component is clearly identified rather than implied to work

### Requirement: Framework-aware initialization
The CLI SHALL install and configure only the selected supported adapter while preserving the framework-independent theme configuration.

#### Scenario: A supported non-React project is initialized
- **GIVEN** a detected or explicitly selected supported framework
- **WHEN** initialization runs
- **THEN** the correct adapter and stylesheet integration are proposed
- **AND** React packages are not added unintentionally

### Requirement: Cross-adapter conformance
Official adapters SHALL pass shared conformance tests for common visual states and accessibility behavior before stable publication.

#### Scenario: An adapter differs in keyboard behavior
- **GIVEN** a shared keyboard interaction requirement
- **WHEN** an adapter fails the corresponding conformance case
- **THEN** its stable release is blocked or the difference is explicitly approved and documented
