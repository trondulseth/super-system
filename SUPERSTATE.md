<!-- superstate: managed -->
<!-- superstate: schema=2 -->

Super System is a lightweight, AI-independent design system for React teams. It provides token-driven theming, accessible components, a local Studio editor, and a UI consistency audit so product teams can ship consistent interfaces without a heavyweight component library.

- **Planning system:** openspec
- **OpenSpec root:** openspec/
- **Active change:** none (polish + expand archived 2026-08-21)
- **Journal:** openspec/journal/

## Active handoff

- **Objective:** Optional npm publish (`0.1.0-beta.2`) and post-release hardening.
- **Work state:** Phase 6 complete on `cursor/polish-and-dashboard-2c3d`. 84 tests, fresh-install smoke passing (Vite + Next.js), living specs synced, both OpenSpec changes archived.
- **Recent evidence:** `react-dom` externalized from published bundle; charts/KPI/layout/page-shell shipped; overlay tokens + MIGRATION.md updated.
- **Risks and limitations:** npm publish not run; beta tag still at `0.1.0-beta.1`.
- **Next handoff:** Publish beta.2 on user request; consider dedicated change for release hardening or next component batch.
