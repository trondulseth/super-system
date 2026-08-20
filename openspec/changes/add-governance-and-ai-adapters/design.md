# Design: Governance and AI Adapters

## Canonical policy

`super-system.policy.json` stores enforceable choices such as allowed component sources, disallowed raw values, audit severity, minimum contrast, deprecation windows, and generated-file ownership. A schema version supports future migration.

## Adapter model

Adapters transform canonical policy and current package facts into tool-specific instruction sections. Output clearly marks its generated boundaries. If a target file contains user content, the CLI previews and merges only its owned section instead of replacing the file.

Initial targets should be selected from real demand and may include generic `AGENTS.md`, GitHub Copilot instructions, Cursor rules, Claude guidance, and Codex-compatible guidance. The generic human-readable guide remains usable by any tool.

## Governance checks

The CLI validates policy syntax, detects stale generated adapters, enforces deprecation deadlines, and combines policy thresholds with audit results. Structured output enables CI annotations without binding the core package to one CI vendor.

## ESLint and deeper audit

Supported JavaScript and TypeScript rules share identifiers and configuration between the CLI and a dedicated ESLint plugin. Syntax-tree analysis replaces text matching where semantic context matters, reducing false positives for raw controls, literal styles, deprecated imports, and unsupported component usage. The CLI remains available for non-ESLint projects and repository-wide reporting.

## Lifecycle rules

Tokens and components can be active, deprecated, or removed. Deprecations include replacement guidance and an earliest removal version. Breaking removals require a major release after stable `1.0.0`; beta changes remain clearly documented.

## Alternatives considered

- **One manually maintained prompt:** rejected because it drifts from code and cannot be validated.
- **Separate source policy per AI vendor:** rejected because rules would diverge.
- **Overwrite target instruction files:** rejected because those files may contain unrelated user policy.
- **Maintain unrelated ESLint and CLI rule implementations:** rejected because findings and suppressions would drift.

## Compatibility and migration

Governance is opt-in initially. Existing projects continue to work without a policy file. Adapter output includes generator version metadata so stale content can be detected and regenerated.
