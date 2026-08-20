# Super System

Super System is a lightweight, AI-independent design system for React projects.
It combines portable design tokens, accessible components, a visual theme studio,
and project auditing in one CLI.

## Quick start

```bash
npx @super-system/cli init
npx @super-system/cli studio
npx @super-system/cli audit
```

The first beta targets React, Next.js, and Vite. CSS tokens are framework-independent.

## Workspace packages

- `@super-system/tokens` validates themes, generates CSS, and checks contrast.
- `@super-system/react` provides the first accessible React components.
- `@super-system/cli` provides `init`, `studio`, and `audit` commands.

## Development

```bash
npm install
npm run check
```

## Accessibility

Super System checks token-pair contrast and provides accessible component defaults.
Automated checks help with WCAG conformance but do not constitute certification.
