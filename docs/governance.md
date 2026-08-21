# Governance

[← Documentation](./README.md) · [CLI](./cli.md) · [AI coding tools](./ai-tools.md) · [Compatibility](./compatibility.md)

Super System governance is **opt-in** and **AI-neutral**. A canonical policy file drives CLI checks and optional generated instruction adapters — no specific AI vendor is required.

## Canonical policy file

Create `super-system.policy.json` in your project root:

```bash
npx @super-system/cli policy init
```

Example structure:

```json
{
  "version": 1,
  "audit": {
    "severity": {
      "raw-button": "warn",
      "image-alt": "error"
    },
    "excludeRules": [],
    "excludeGlobs": ["src/legacy/**"]
  },
  "accessibility": {
    "minContrastRatio": 4.5
  },
  "deprecations": [],
  "adapters": {
    "generatorVersion": "0.1.0-beta.18"
  }
}
```

### Audit severity

| Value | Behavior |
| --- | --- |
| `off` | Rule ignored |
| `warn` | Reported; does not fail `policy check` |
| `error` | Reported; fails `policy check` |

Rule ids match `@super-system/rules` and CLI audit output (for example `raw-button`, `image-alt`).

### Deprecations

List deprecated APIs your team still tracks:

```json
{
  "deprecations": [
    {
      "id": "legacy-kpi-card",
      "replacement": "KpiCard",
      "removeIn": "0.2.0",
      "message": "Replace LegacyKpi with KpiCard before 0.2.0."
    }
  ]
}
```

## Policy check (CI)

```bash
npx @super-system/cli policy check
npx @super-system/cli policy check --json
npx @super-system/cli policy check --strict   # warnings also fail
```

Runs audit findings through policy severity, optional contrast threshold, and deprecation notices. Exits non-zero when blocking rules fail.

## Instruction adapters

Generate a merge-safe section in `AGENTS.md`:

```bash
npx @super-system/cli adapters generate --target agents-md
npx @super-system/cli adapters generate --dry-run
```

Content between `<!-- super-system:generated begin -->` and `<!-- super-system:generated end -->` is owned by the CLI. User text outside those markers is preserved.

Adapters provide **guidance only** — they do not grant tools permission to publish packages or bypass review.

## ESLint plugin

For JavaScript/TypeScript projects, use `eslint-plugin-super-system` alongside CLI audit:

```js
import superSystem from "eslint-plugin-super-system";

export default [
  superSystem.configs.recommended
];
```

Shared rule ids keep ESLint and CLI aligned. Syntax-aware rules (for example `raw-button`, `raw-input`, `image-alt`) avoid false positives in comments and skip specialized input types that migration leaves manual.

Configured rules in `recommended`:

| Rule | Default | Notes |
| --- | --- | --- |
| `super-system/raw-button` | warn | Native `<button>` → `<Button>` |
| `super-system/raw-input` | warn | Text-like `<input>` only; skips checkbox/radio/file/submit |
| `super-system/image-alt` | error | Requires `alt` on `<img>`; ignores spread props |

## Related docs

- [Migration guide](./migration-guide.md) — upgrading existing projects
- [Audit & accessibility](./audit-and-accessibility.md) — rule catalog and manual checks
