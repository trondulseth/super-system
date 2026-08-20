# Tasks: Add Studio GitHub Pages Demo

## Shared Studio UI

- [x] Create `packages/studio-ui` with shared HTML, CSS, and client UI logic.
- [x] Define the `StudioBackend` interface and server/static backend implementations.
- [x] Refactor `packages/cli/src/studio.ts` to serve the shared server bundle and existing API routes.

## Static demo build

- [x] Add an esbuild pipeline that emits a browser bundle using the static backend and `@super-system/tokens`.
- [x] Add `build:studio-demo` and include demo build verification in `pnpm check`.

## GitHub Pages deployment

- [x] Add a GitHub Actions workflow that builds and deploys the generated demo on pushes to `main`.
- [x] Document the public demo link and how it differs from local Studio in the README.

## Verification

- [x] Add tests for static backend contrast behavior and demo build output.
- [x] Verify local Studio still loads, previews, saves, and reports contrast through the CLI server.
- [x] Run `pnpm check` successfully.
