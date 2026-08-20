<!-- superstate: managed -->
<!-- superstate: schema=2 -->

Super System is a lightweight, AI-independent design system for React teams. It provides token-driven theming, accessible components, a local Studio editor, and a UI consistency audit so product teams can ship consistent interfaces without a heavyweight component library.

- **Planning system:** openspec
- **OpenSpec root:** openspec/
- **Active change:** expand-react-component-library
- **Journal:** openspec/journal/

## Active handoff

- **Objective:** Close out the React library expansion change after Batch 3 overlays and table primitives; remaining work is icon integration and beta release verification.
- **Work state:** Batch 3 (Dialog, Drawer, Popover, Toast, Table) is implemented with portal rendering, focus trap for modals, tests, README docs, and Studio previews. Active change `expand-react-component-library` remains open for icon wrapper and release tasks.
- **Recent evidence:** `pnpm check` with expanded test suite; dialog and drawer use `OverlayPortal`; popover and toast viewport render through portals; table wraps native semantics in `ss-table-wrap`.
- **Risks and limitations:** Dropdown menu and tooltip still render inline without a portal; icon wrapper not shipped; npm packages remain at `0.1.0-beta.1`.
- **Next handoff:** Implement normalized Icon wrapper and complete release verification tasks, then archive `expand-react-component-library` after living specs sync.
