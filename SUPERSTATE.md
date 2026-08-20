<!-- superstate: managed -->
<!-- superstate: schema=2 -->

Super System is a lightweight, AI-independent design system for React teams. It provides token-driven theming, accessible components, a local Studio editor, and a UI consistency audit so product teams can ship consistent interfaces without a heavyweight component library.

- **Planning system:** openspec
- **OpenSpec root:** openspec/
- **Active change:** expand-react-component-library
- **Journal:** openspec/journal/

## Active handoff

- **Objective:** Close out `expand-react-component-library` with release verification, then archive the change.
- **Work state:** Icon wrapper (`Icon`), CLI `icons setup`, tests, README docs, and Studio icon previews are implemented. Release verification (fresh installs, beta publish) remains open.
- **Recent evidence:** `Icon` supports decorative and labelled modes; `npx @super-system/cli icons setup` maps `super-system.json` icon library to install guidance; default recommendation is `lucide-react`.
- **Risks and limitations:** Icon package install is opt-in via `--install`; dropdown and tooltip still render inline without a portal; npm packages remain at `0.1.0-beta.1`.
- **Next handoff:** Verify installation in fresh React, Next.js, and Vite projects, publish updated beta if requested, sync specs, and archive `expand-react-component-library`.
