# Design: Studio GitHub Pages Demo

## Shared UI package

Create `packages/studio-ui` as the single source of truth for Studio markup, styles, and client behavior. The package exposes:

- Shared UI logic that renders controls, preview canvas, and contrast feedback.
- A small `StudioBackend` interface for loading config, saving config, and checking contrast.
- A server backend that calls the existing CLI HTTP routes (`/api/config`, `/api/contrast`).
- A static backend that loads the packaged default theme, runs contrast checks in the browser using `@super-system/tokens`, and exports themes through download instead of disk writes.

The CLI keeps its local HTTP server and API routes but serves the shared UI assets instead of an inline HTML string.

## Build outputs

`@super-system/studio-ui` produces two artifacts:

1. **Server bundle** — HTML, CSS, and JavaScript used by `super-system studio`.
2. **Demo bundle** — a static site suitable for GitHub Pages, built with the static backend and the current default theme.

The root build adds `build:studio-demo`, and `pnpm check` verifies the demo bundle builds successfully on every CI run.

## Deployment

A GitHub Actions workflow on pushes to `main`:

1. Installs dependencies.
2. Runs `pnpm build:studio-demo`.
3. Uploads the generated demo directory as the GitHub Pages artifact.
4. Deploys through the official Pages actions.

The demo is generated in CI rather than committed to git to avoid noisy diffs and merge conflicts.

## Static demo behavior

The public demo mirrors local Studio editing and preview behavior with these intentional differences:

- **Save** becomes **Download theme**, writing `super-system.json` to the visitor's machine.
- No project files are read or written on a server.
- Optional browser `localStorage` persistence keeps edits across refresh within the same browser profile.

## Alternatives considered

- **Hand-maintained HTML in `docs/`:** rejected because it would drift from the CLI Studio.
- **Deploy the Node server to a cloud host:** rejected as unnecessary infrastructure for a try-it-now demo.
- **Runtime fetch fallback in one bundle:** rejected because build-time backend selection is easier to test and reason about.

## Compatibility and migration

Local Studio commands, API routes, and loopback binding remain unchanged. The refactor is internal to the CLI implementation. The static demo is an additive distribution surface documented separately from local Studio guarantees.
