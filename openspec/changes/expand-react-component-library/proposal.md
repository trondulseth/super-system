# Expand the React Component Library

## Problem

The beta proves the shared-token model but only includes Button, Input, Badge, Card, and ThemeProvider. Real SaaS products still have to invent many common controls, which reintroduces inconsistent markup, spacing, state handling, and accessibility.

## Goals

- Add the most frequently needed accessible SaaS primitives.
- Standardize icon selection, sizing, alignment, and accessible labeling through one supported icon adapter.
- Keep styling entirely token-driven and visually compatible with existing components.
- Provide stable composition patterns and documentation for every new primitive.
- Support tree-shakable imports without increasing the framework-independent token package.

## Non-goals

- Build highly domain-specific widgets such as data grids or rich-text editors.
- Replace application routing, forms, or data-fetching libraries.
- Introduce a second styling system.
- Bundle a proprietary icon catalog or prevent applications from supplying custom icons.

## Affected capabilities

- React components
- Theme system
- Accessibility
- Distribution

## Dependencies

- Stable semantic tokens for overlays, borders, states, and component sizing.
- Accessible primitive behavior, either implemented directly or through a carefully selected low-level dependency.

## Risks

- Overlay and composite widgets require robust keyboard, focus, and portal behavior.
- A large first batch could make review and adoption difficult.
- New dependencies could increase bundle size or create incompatible React constraints.

## Rollout

Deliver components in reviewed batches, starting with simple form and layout primitives, followed by overlays and navigation. Document and test each batch before publishing it under the beta tag.
