# Tasks: Expand the React Component Library

## Foundation

- [ ] Finalize the component priority order and public API conventions.
- [ ] Add any required semantic tokens with light/dark defaults and validation.
- [ ] Select and document the dependency approach for complex accessible primitives.
- [ ] Select the default icon package and define the normalized icon contract.

## Implementation

- [ ] Implement the form and feedback component batch.
  - [x] Textarea
  - [ ] Label
  - [ ] Checkbox
  - [ ] Radio Group
  - [ ] Switch
  - [ ] Select
  - [ ] Alert
  - [ ] Spinner (standalone export)
  - [ ] Skeleton
  - [ ] Tooltip
- [ ] Implement the navigation and disclosure component batch.
- [ ] Implement the overlay component batch.
- [ ] Implement Table primitives and responsive usage guidance.
- [ ] Implement optional icon-package setup and the normalized Icon wrapper.
- [ ] Export each component and its public TypeScript types.

## Verification

- [ ] Add behavior, keyboard, state, and ref-forwarding tests for every component.
- [ ] Add light, dark, forced-colors, reduced-motion, and zoom verification where relevant.
- [ ] Test decorative, labeled, icon-only, and custom icon accessibility behavior.
- [ ] Measure bundle impact and verify tree-shakable clean-project imports.
- [ ] Run `pnpm check` successfully.

## Documentation and release

- [ ] Add copy-ready examples and accessibility notes for every component.
- [ ] Add migration notes for any expanded token schema.
- [ ] Publish an opt-in beta and verify installation in fresh React, Next.js, and Vite projects.
