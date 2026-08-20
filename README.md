# Super System

Super System is a lightweight, AI-independent design system for React projects.
It combines portable design tokens, accessible components, a visual theme studio,
and project auditing in one CLI.

## Quick start

```bash
npx super-system init
npx super-system studio
npx super-system audit
```

The first beta targets React, Next.js, and Vite. CSS tokens are framework-independent.

## Workspace packages

- `@super-system/tokens` validates themes, generates CSS, and checks contrast.
- `@super-system/react` provides the first accessible React components.
- `super-system` provides `init`, `studio`, and `audit` commands.

## Development

```bash
npm install
npm run check
```

## Accessibility

Super System checks token-pair contrast and provides accessible component defaults.
Automated checks help with WCAG conformance but do not constitute certification.
