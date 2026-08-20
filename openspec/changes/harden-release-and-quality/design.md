# Design: Release and Quality Hardening

## Quality layers

Fast pull-request checks cover formatting, types, unit tests, package builds, and focused smoke tests. A broader release-candidate workflow covers supported Node versions, React/framework fixtures, package tarball installation, accessibility checks, supply-chain inspection, and end-to-end CLI behavior.

Representative component and Studio states also receive reviewed visual baselines in light, dark, density, focus, and reduced-motion configurations. Visual changes produce inspectable artifacts and require intentional baseline approval rather than automatic replacement.

## Versioning and changelog

Every user-visible change includes structured release metadata. Coordinated package versions are preferred while the packages evolve together. Generated changelogs distinguish features, fixes, breaking changes, deprecations, and migrations.

## Release authorization

Publication remains manual or approval-gated and uses GitHub OIDC Trusted Publishing with least-privilege workflow permissions. The workflow validates that the git tag, package versions, lockfile, changelog, and clean build agree before publishing in dependency order.

## Recovery

npm versions are immutable and are not silently replaced. A faulty release is deprecated with a clear message, a fixed patch is published, and GitHub release notes describe impact. Rollback documentation distinguishes application rollback from package deprecation.

## Support and security

The repository documents supported runtimes, peer ranges, beta/stable policy, security reporting, response ownership, and maintenance status. Automated dependency updates require the same quality gates as human changes.

## Alternatives considered

- **Publish from a developer laptop:** rejected for normal releases because provenance and repeatability are weaker.
- **Publish every merge:** rejected because package release is an external irreversible action requiring explicit intent.
- **Single enormous CI job:** rejected because layered checks provide faster feedback and clearer failures.
- **Automatically accept new screenshots:** rejected because it would hide accidental visual regressions.

## Compatibility and migration

Before `1.0.0`, a release candidate freezes the intended public schema, CSS variables, exports, and CLI commands. Breaking beta changes include migration notes. After `1.0.0`, semantic versioning governs public API removal and incompatible behavior.
