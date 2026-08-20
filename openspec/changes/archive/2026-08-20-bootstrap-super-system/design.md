# Design: Bootstrap Super System

## Architecture

Super System is split into three independently consumable packages:

- `@super-system/tokens` owns the typed configuration, defaults, validation, CSS compilation, and contrast utilities.
- `@super-system/react` owns React primitives and consumes generated CSS custom properties.
- `@super-system/cli` owns initialization, theme building, local Studio, auditing, and contrast checks.

The project stores design decisions in `super-system.json`. Compilation turns those decisions into portable CSS custom properties. Components refer only to semantic variables, so changing a token updates every matching component instance.

## Key decisions

### Project-owned JSON configuration

JSON is inspectable by people, scripts, and AI tools, has broad editor support, and avoids coupling configuration to a JavaScript runtime. A version field creates a future migration boundary.

### CSS custom properties as the integration layer

CSS variables work across React, server-rendered HTML, and other frontend frameworks. This boundary keeps the token package independent from React and avoids requiring a utility-CSS framework.

### Local Studio instead of a hosted account

The first editor runs on the developer's machine, reads the current repository, and saves directly to its theme configuration. This keeps the beta simple and avoids authentication, storage, privacy, and service-availability requirements.

### Static audit as guidance

The audit detects common bypasses with deterministic source checks. Findings include locations and remediation guidance. It is intentionally not a full parser or visual-regression engine in the initial beta.

### Native semantics first

React primitives wrap native elements, forward their attributes and refs, and add token-driven styling. This gives applications a predictable accessibility foundation without hiding browser behavior.

### Trusted Publishing

GitHub Actions publishes through npm's OpenID Connect integration. This avoids storing a long-lived npm publication secret and provides release provenance.

## Alternatives considered

- **Copy-paste components only:** rejected as the sole model because updates would not automatically reach existing instances.
- **Runtime CSS-in-JS:** rejected for the portable core because it would increase runtime and framework coupling.
- **Tailwind-only tokens:** rejected because Super System must work in projects without Tailwind.
- **Hosted editor first:** deferred until local workflows and the configuration contract are stable.
- **One combined npm package:** rejected because non-React projects should be able to use the theme compiler without React dependencies.

## Compatibility and migration

The beta targets Node.js 20+ and React 18+. Configuration is versioned from the first public beta. Breaking changes before stable release must be documented and should include automated migration when practical. The generated CSS remains the cross-framework compatibility boundary.
