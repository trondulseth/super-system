# Add Studio GitHub Pages Demo

## Problem

Super System Studio runs only as a local CLI server. Visitors cannot try the theme editor without installing Node, initializing a project, and running a command. There is also no public surface that demonstrates what Studio offers.

The Studio UI currently lives as an inline template string inside the CLI. Any hand-maintained static copy would drift from the real editor as Studio evolves.

## Goals

- Publish a static Studio demo on GitHub Pages so anyone can preview and edit the default theme in a browser.
- Extract Studio UI into a shared package used by both the CLI and the static demo.
- Generate the demo automatically during the repository build so UI changes stay in sync.
- Preserve local-first CLI behavior: loopback binding, disk save, and no network requirement for local use.

## Non-goals

- Replace the local CLI Studio with a hosted editor.
- Upload visitor projects or store themes on a backend for this change.
- Add authentication, collaboration, or shareable hosted snapshots (see hosted theme sharing).
- Publish `@super-system/studio-ui` as a public npm package in this change.

## Affected capabilities

- Theme Studio
- Distribution
- CLI tooling

## Dependencies

- Existing Studio behavior and `@super-system/tokens` contrast logic.
- GitHub Pages and GitHub Actions in the repository.
- A build step that bundles browser-safe token logic for the static demo.

## Risks

- Browser bundling could diverge from server-side contrast results if not shared from `@super-system/tokens`.
- Asset path differences between GitHub Pages project and user/organization sites must be handled in deployment configuration.
- Extracting the UI is a refactor that could regress local Studio behavior if not covered by tests.

## Rollout

Land the shared Studio UI package, switch the CLI to serve it, add a generated static demo artifact, deploy it through GitHub Actions on `main`, and document the public demo link in the README.
