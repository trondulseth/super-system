# Add Assisted Migration

## Problem

Existing projects often contain hard-coded colors, arbitrary spacing, repeated native controls, and several competing component conventions. The audit can identify some issues, but users still need a safe way to plan and apply a broad cleanup.

## Goals

- Produce an inventory and migration plan before modifying an existing project.
- Apply deterministic, reviewable fixes for supported patterns.
- Preserve application behavior and user-owned customizations.
- Make backups or source-control checkpoints an explicit safety prerequisite.

## Non-goals

- Guarantee fully automatic migration of every frontend stack.
- Rewrite business logic or redesign product flows.
- Send source code to a hosted AI service by default.

## Affected capabilities

- CLI tooling
- UI audit
- React components
- Theme system

## Dependencies

- A stable audit finding format and rule identifiers.
- A supported-file parser strategy for safe transformations.
- A component mapping that distinguishes eligible native patterns from intentional custom controls.

## Risks

- Text-based rewrites can damage syntax or change behavior.
- Ambiguous design values may map to the wrong semantic token.
- Large migrations may be hard to review and revert.

## Rollout

Start with a read-only planning command, then add opt-in transformations one rule at a time. Require a clean source-control state or explicit override before writing, and publish migration features as beta until tested on representative projects.
