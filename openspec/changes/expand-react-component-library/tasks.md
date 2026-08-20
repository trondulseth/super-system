# Tasks: Expand the React Component Library

## Foundation

- [ ] Finalize the component priority order and public API conventions.
- [ ] Add any required semantic tokens with light/dark defaults and validation.
- [ ] Select and document the dependency approach for complex accessible primitives.
- [ ] Select the default icon package and define the normalized icon contract.

## Implementation

- [x] Implement the form and feedback component batch.
  - [x] Textarea
  - [x] Label
  - [x] Checkbox
  - [x] Radio Group
  - [x] Switch
  - [x] Select
  - [x] Alert
  - [x] Spinner (standalone export)
  - [x] Skeleton
  - [x] Tooltip
- [ ] Implement the navigation and disclosure component batch.
- [ ] Implement the overlay component batch.
- [ ] Implement Table primitives and responsive usage guidance.
- [ ] Implement optional icon-package setup and the normalized Icon wrapper.
- [x] Export each component and its public TypeScript types for the Batch 1 form and feedback set.

## Verification

- [x] Add behavior, keyboard, state, and ref-forwarding tests for every Batch 1 component.
- [x] Add reduced-motion and forced-colors CSS coverage for Batch 1 components; document manual zoom and forced-colors checklist in README.
- [ ] Test decorative, labeled, icon-only, and custom icon accessibility behavior (deferred until Icon wrapper lands).
- [x] Verify tree-shakable named exports and CSS-only sideEffects on `@super-system/react`.
- [x] Run `pnpm check` successfully.

## Documentation and release

- [x] Add copy-ready examples and accessibility notes for every Batch 1 component.
- [ ] Add migration notes for any expanded token schema.
- [ ] Publish an opt-in beta and verify installation in fresh React, Next.js, and Vite projects.
