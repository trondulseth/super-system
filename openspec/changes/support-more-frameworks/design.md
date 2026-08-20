# Design: Multi-framework Support

## Shared foundation

All adapters consume `@super-system/tokens` output and a documented semantic CSS contract. Shared behavior specifications define states, keyboard interaction, accessibility attributes, and DOM expectations without requiring identical internal implementations.

## Adapter options

- Framework packages provide idiomatic components and bindings for a selected ecosystem.
- Web Components may provide a reusable baseline where platform behavior and styling boundaries are suitable.
- Plain CSS recipes serve projects that need visual consistency without a component runtime.

The first adapter is chosen through repository demand and maintenance capacity, not assumed in this proposal.

## Parity model

A machine-readable component manifest records supported primitives, variants, states, tokens, and accessibility expectations. Framework test fixtures exercise the same conformance cases where possible. Documentation labels partial parity honestly.

## CLI integration

Initialization detects or accepts a selected framework, installs only its required package, writes the appropriate stylesheet integration, and avoids altering unrelated project configuration. Token compilation remains identical across frameworks.

## Alternatives considered

- **React wrappers inside every framework:** rejected because it creates unnecessary runtime coupling and non-idiomatic APIs.
- **Independent designs per framework:** rejected because consistency is the product's central promise.
- **Launch many adapters together:** rejected because sustainable parity matters more than package count.

## Compatibility and migration

The shared token schema and generated CSS remain authoritative. Framework packages use independent peer dependencies and clearly documented support ranges. A shared token or behavior breaking change requires coordinated adapter verification and migration notes.
