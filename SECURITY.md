# Security policy

## Supported versions

| Version | Supported |
| --- | --- |
| `0.1.0-beta.*` | Best-effort fixes for security issues affecting published npm packages |
| `< 0.1.0-beta.1` | Unsupported |

## Reporting a vulnerability

**Do not open public GitHub issues for security vulnerabilities.**

Email the repository owner via the contact address on their GitHub profile, or use GitHub private vulnerability reporting if enabled for this repository.

Include:

- Affected package and version
- Steps to reproduce
- Impact assessment
- Suggested fix (optional)

We aim to acknowledge reports within a few business days. Critical issues in published npm packages will be addressed with a patched beta release and a note in `MIGRATION.md`.

## Scope

In scope:

- `@super-system/cli`, `@super-system/react`, `@super-system/tokens`, `@super-system/rules`, `eslint-plugin-super-system`
- GitHub Actions publish workflow misconfiguration
- Studio local server binding and file access

Out of scope:

- Consumer application code
- Third-party AI tools reading generated adapter files
