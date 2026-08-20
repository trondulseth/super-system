# Support More Frameworks

## Problem

The token layer is already portable, but reusable components and setup guidance are React-first. Vue, Svelte, and plain web projects can use generated CSS, yet they do not receive equivalent primitives, framework-specific setup, or clean-project verification.

## Goals

- Formalize a framework-neutral component styling and behavior contract.
- Add supported adapters or component packages based on demonstrated demand.
- Provide equivalent setup, theme, dark-mode, and accessibility guidance.
- Prevent framework packages from drifting into separate visual systems.

## Non-goals

- Promise simultaneous support for every frontend framework.
- Force all frameworks through React wrappers.
- Duplicate token compilation in each adapter.

## Affected capabilities

- Theme system
- React components
- CLI tooling
- Distribution
- Accessibility

## Dependencies

- Stable semantic CSS contract and component behavior specifications.
- Framework-specific maintainers, test fixtures, and package build pipelines.
- Demand-based prioritization among Vue, Svelte, Web Components, and other targets.

## Risks

- Parallel implementations may drift in behavior or accessibility.
- Framework release cycles can multiply maintenance cost.
- Prematurely supporting many targets may slow the stable core.

## Rollout

First document and test the framework-neutral contract and improve plain CSS integration. Select one additional adapter through user demand, publish it as beta, and require parity checks before considering another framework.
