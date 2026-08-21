# Compatibility policy

[← Documentation](./README.md) · [Governance](./governance.md) · [Contributing](../CONTRIBUTING.md)

Super System is in **beta** (`0.1.0-beta.*`). APIs, CSS variables, and CLI commands may change between beta releases with notes in [MIGRATION.md](../MIGRATION.md).

## Supported environments

| Environment | Supported range | Notes |
| --- | --- | --- |
| **Node.js** | `>=20` | Required by `@super-system/cli` |
| **React** | `>=18.2` | Peer dependency of `@super-system/react`; tested with React 19 |
| **react-dom** | `>=18.2` | Required for portal-based overlays |
| **Browsers** | Last two evergreen majors | Manual accessibility verification still required |
| **Frameworks** | Vite, Next.js, generic React | Migration CLI detects Vite/Next configs; other React setups supported |

## Public contract (pre-1.0)

Before `1.0.0`, the following are considered public and should remain stable within a beta line unless documented:

- npm package exports listed in each package `exports` field
- Semantic CSS variables emitted by `@super-system/tokens` (`--ss-*`)
- `super-system.json` schema version `1`
- CLI commands documented in [cli.md](./cli.md)
- Audit rule identifiers in `@super-system/rules`

Breaking changes to these surfaces require a migration note in `MIGRATION.md`.

## Release verification

Release tags must match coordinated package versions. CI runs:

```bash
node scripts/verify-release.mjs v0.1.0-beta.N
pnpm check
node scripts/publish-packages.mjs
```

Tarball installation is smoke-tested in CI to catch missing `files` entries before publish.

If publish fails for a **new** package, see [First-time npm packages](../CONTRIBUTING.md#first-time-npm-packages) in CONTRIBUTING.md. Re-run the Publish beta workflow after setup; already-published versions are skipped automatically.

## Semantic versioning (target for 1.0)

After `1.0.0`:

- **Major** — incompatible public API, removed exports, breaking CSS variable renames
- **Minor** — backward-compatible features
- **Patch** — backward-compatible fixes

Beta releases use `0.1.0-beta.N` and do not follow strict semver for breaking changes.

## Rollback

- **Application rollback:** revert git commits or restore from backup after `migrate apply`.
- **Package rollback:** install a previous beta version; npm versions are immutable. Faulty releases may be deprecated on npm with a message pointing to a fixed version.
