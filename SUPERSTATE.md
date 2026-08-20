<!-- superstate: managed -->
<!-- superstate: schema=2 -->

Super System is a lightweight, AI-independent design system for React teams. It provides token-driven theming, accessible components, a local Studio editor, and a UI consistency audit so product teams can ship consistent interfaces without a heavyweight component library.

- **Planning system:** openspec
- **OpenSpec root:** openspec/
- **Active change:** expand-react-component-library
- **Journal:** openspec/journal/

## Active handoff

- **Objective:** Finish the React component library expansion: Batch 2 navigation and disclosure is implemented; Batch 3 overlays (dialog, drawer, popover, toast) and table primitives remain in the active change.
- **Work state:** Batch 1 is polished and archived. Batch 2 (Tabs, Accordion, Breadcrumb, Dropdown Menu, Pagination) is implemented in `@super-system/react` with tests, README docs, and Studio previews. The active OpenSpec change tracks remaining Batch 3 work, icon integration, and release verification tasks.
- **Recent evidence:** `pnpm check` passes with 54 Vitest tests; GitHub Actions CI runs `pnpm check` on push and pull request; Studio demo builds include Batch 2 preview sections; draft PR #9 adds Batch 2 exports; `openspec validate --all --strict` passes for all living specs and active changes.
- **Risks and limitations:** Tooltip and dropdown menu render inline without a portal and may clip inside overflow containers; overlay batch (dialog, drawer, popover, toast) is not shipped yet; npm packages remain at `0.1.0-beta.1`; automated tests do not replace manual keyboard, screen-reader, or zoom verification.
- **Next handoff:** Begin Batch 3 overlay components (dialog, drawer, popover, toast) and table primitives under `expand-react-component-library`, including focus-trap and portal behavior, before publishing a new beta tag.
