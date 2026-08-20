<!-- superstate: managed -->
<!-- superstate: schema=2 -->

Super System is a lightweight, AI-independent design system for React teams. It provides token-driven theming, accessible components, a local Studio editor, and a UI consistency audit so product teams can ship consistent interfaces without a heavyweight component library.

- **Planning system:** openspec
- **OpenSpec root:** openspec/
- **Active change:** polish-library-quality
- **Journal:** openspec/journal/

## Active handoff

- **Objective:** Execute `polish-library-quality` in six phases — harden components, Studio, tokens, and tests; then release verification and archive both polish and expand changes.
- **Work state:** Phase 0 planning artifacts complete. Phase 1 P0 blockers implemented on PR #12 (`cursor/polish-phase1-blockers-2c3d`). Phases 2–6 open.
- **Recent evidence:** OpenSpec change `polish-library-quality` with proposal, design, tasks, and delta specs for react-components, accessibility, theme-studio, and theme-system.
- **Risks and limitations:** Phase 1 may merge before Phase 2 starts; dropdown still inline until Phase 3; npm packages remain at `0.1.0-beta.1`.
- **Next handoff:** Merge PR #12, then start Phase 2 (focus trap, scroll lock, Tabs, Toast, Tooltip, Label/Radio) on `cursor/polish-phase2-a11y-2c3d`.
