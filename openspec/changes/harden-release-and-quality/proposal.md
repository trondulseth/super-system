# Harden Release and Quality

## Problem

The first beta has automated checks and Trusted Publishing, but a stable release needs broader tests, reproducible versioning, clearer compatibility guarantees, dependency hygiene, provenance verification, and a documented incident and rollback process.

## Goals

- Establish a repeatable release-candidate and stable-release process.
- Expand tests across supported runtimes, frameworks, accessibility behavior, and package consumption.
- Automate changelogs, version coordination, provenance checks, and rollback guidance.
- Define support, security reporting, and compatibility policies before `1.0.0`.

## Non-goals

- Promise permanent support for every beta API.
- Automatically publish on every merge.
- Treat test coverage percentage as a substitute for behavior and integration verification.

## Affected capabilities

- Distribution
- Accessibility
- CLI tooling
- Theme system
- React components

## Dependencies

- GitHub Actions and npm Trusted Publishing.
- Representative clean-project fixtures.
- A chosen versioning and changelog workflow.

## Risks

- Release automation with excessive permissions could publish unintended versions.
- An oversized test matrix could slow contribution without adding meaningful confidence.
- Stable compatibility commitments made too early could block necessary design corrections.

## Rollout

Add release metadata and expanded tests while remaining in beta, rehearse release candidates, freeze the `1.0` public contract, then promote a verified candidate to latest through an explicitly approved workflow.
