# Expand the React Component Library

## Status

**Batch 1 (form and feedback) is complete and polished.** Shipped components: Textarea, Label, Checkbox, RadioGroup, Radio, Switch, Select, Alert, Spinner, Skeleton, and Tooltip — plus quality hardening in [archive/2026-08-20-polish-batch1-quality](../archive/2026-08-20-polish-batch1-quality). **Batch 2 (navigation and disclosure) is implemented** (Tabs, Accordion, Breadcrumb, Dropdown Menu, Pagination). **Batch 3 (overlays and data) is next.**

## Problem

The beta originally proved the shared-token model with only Button, Input, Badge, Card, and ThemeProvider. Real SaaS products still needed common form and feedback controls; Batch 1 closed that gap. Navigation, overlays, and data primitives remain for later batches.

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

Deliver components in reviewed batches. Batch 1 is complete. Continue with Batch 2 navigation and disclosure, then Batch 3 overlays and data primitives. Document and test each batch before publishing it under the beta tag.
