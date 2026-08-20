# Design: Assisted Migration

## Workflow

The migration flow has four stages: discover, plan, apply, and verify. Discovery reuses audit findings and gathers framework/configuration facts. Planning writes a machine-readable manifest describing proposed changes, confidence, and files. Apply executes only selected deterministic transforms. Verification reruns checks and reports remaining issues.

## Safety model

Read-only planning is the default. Write mode refuses to run on a dirty source-control worktree unless the user explicitly overrides the protection. Files are parsed into syntax trees for transformations where supported; unsupported or ambiguous findings remain recommendations. A dry-run diff is available before writes.

## Mapping strategy

Literal visual values are mapped to semantic tokens only when a configured or inferred match is unambiguous. Native elements are replaced only when structure, props, and event behavior can be preserved. The plan records every assumption and confidence level.

## AI integration boundary

The core migration engine is deterministic and works without AI. It may emit a structured context file and instructions that an AI tool can consume for unresolved work, but it does not require a specific vendor or transmit code by itself.

## Alternatives considered

- **Prompt-only migration:** rejected as the primary path because results are difficult to reproduce and verify.
- **Regex replacement:** limited to trivial cases; syntax-aware transforms are required for source rewrites.
- **Automatic write on first run:** rejected because users need to inspect scope and assumptions first.

## Compatibility and migration

Initial write support targets documented React with TypeScript/JavaScript source. Other files remain discoverable where audit supports them but are marked manual until a safe transformer exists.
