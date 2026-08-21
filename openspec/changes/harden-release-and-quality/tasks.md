# Tasks: Harden Release and Quality

## Policy and metadata

- [x] Define supported Node, React, browser, and framework versions.
- [x] Add contribution, security, maintenance, deprecation, and semantic-versioning policies.
- [ ] Adopt structured change metadata and generated changelogs.
- [ ] Define public API and CSS-variable compatibility contracts for `1.0`.

## Test expansion

- [x] Add package-tarball tests in clean temporary projects.
- [ ] Add supported Node and React matrix coverage.
- [ ] Add Next.js and Vite integration fixtures.
- [ ] Add automated accessibility checks plus documented manual test checklists.
- [ ] Add visual-regression coverage for representative components and Studio states in light and dark themes.
- [ ] Store reviewable failure artifacts and require explicit visual-baseline approval.
- [ ] Add end-to-end tests for CLI initialization, Studio, audit, and theme builds.

## Release workflow

- [x] Validate tags, coordinated versions, lockfile, changelog, and clean builds before publication.
- [ ] Minimize workflow permissions and verify npm provenance after publication.
- [ ] Add approval-gated release-candidate and stable channels.
- [ ] Add npm deprecation, patch-release, and consumer rollback procedures.

## Stable launch

- [ ] Run release-candidate rehearsals from a clean commit.
- [ ] Verify installation and documented quick starts in fresh supported projects.
- [ ] Resolve all release-blocking beta issues and freeze the `1.0` contract.
- [ ] Publish `1.0.0` only after explicit approval and complete post-publication verification.
