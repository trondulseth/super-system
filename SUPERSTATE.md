<!-- superstate: managed -->
<!-- superstate: schema=2 -->

Super System is a lightweight, AI-independent design system for React teams. It provides token-driven theming, accessible components, a local Studio editor, and a UI consistency audit so product teams can ship consistent interfaces without a heavyweight component library.

- **Planning system:** openspec
- **OpenSpec root:** openspec/
- **Active change:** polish-library-quality
- **Journal:** openspec/journal/

## Active handoff

- **Objective:** Complete release verification and archive `polish-library-quality` + `expand-react-component-library`.
- **Work state:** Phases 0–5 complete on `cursor/polish-and-dashboard-2c3d`. 84 tests, charts/KPI/layout/page-shell components, Studio controllers, overlay tokens, migration notes.
- **Recent evidence:** `Sparkline`, `BarChart`, `LineChart`, `DonutChart`, `KpiCard`, flex layout (`Stack`/`Row`/`Box`), `PageHeader`, `HamburgerMenu`, dropdown portal, tabs auto-select, scroll-lock stacking.
- **Risks and limitations:** Fresh install smoke not yet run in this environment; npm publish remains at user request.
- **Next handoff:** Manual fresh-install verification, sync specs, archive changes, optional `0.1.0-beta.2` publish.
