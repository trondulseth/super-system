# Add Governance and AI Adapters

## Problem

Super System is AI-independent, but teams still need durable rules that tell humans, AI agents, and continuous integration how the system must be used. Different tools understand different instruction formats, and design-token changes currently lack a formal review and deprecation policy.

## Goals

- Define a canonical, vendor-neutral policy file for design-system usage.
- Generate optional instruction adapters for common AI coding environments.
- Add versioning, deprecation, and review rules for tokens and components.
- Enforce selected policies in CI through machine-readable checks.
- Provide an ESLint plugin and syntax-aware audits for immediate editor feedback in supported JavaScript and TypeScript projects.

## Non-goals

- Require an AI tool to use Super System.
- Store proprietary prompts in the runtime packages.
- Grant generated instructions permission to change or publish code automatically.

## Affected capabilities

- CLI tooling
- UI audit
- Distribution
- Theme system
- React components

## Dependencies

- Stable public API and audit rule identifiers.
- A shared rule engine that can power both CLI audit and ESLint without producing different results.
- Documented instruction formats for each supported adapter.
- A schema for canonical governance policy.

## Risks

- Generated files may conflict with hand-maintained project instructions.
- Vendor formats can change independently.
- Overly strict policies can create noise and discourage adoption.

## Rollout

Ship the canonical policy and CI checks first. Add adapters individually, with preview and merge-safe behavior. Treat adapter output as generated guidance and keep the canonical policy authoritative.
