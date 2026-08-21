<p align="center">
  <img src="brand/logo.svg" alt="Super System logo" width="220" />
</p>

<p align="center">
  <img src="brand/hero.png" alt="Super System hero illustration" width="640" />
</p>

<h1 align="center">Super System</h1>

<p align="center">
  <strong>One theme. One set of components. Zero mystery-meat buttons.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@super-system/cli/v/beta"><img src="https://img.shields.io/npm/v/%40super-system%2Fcli/beta?label=CLI&color=2563eb" alt="npm CLI" /></a>
  <a href="https://www.npmjs.com/package/@super-system/react/v/beta"><img src="https://img.shields.io/npm/v/%40super-system%2Freact/beta?label=React&color=2563eb" alt="npm React" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-16a34a" alt="MIT license" /></a>
</p>

<p align="center">
  A lightweight, AI-independent design system for React apps — shared visual language, accessible components, automatic light/dark themes, a visual theme editor, and a UI consistency audit.
</p>

<p align="center">
  Change a color once. Change button padding once. Change the radius once. Your whole product follows.
</p>

> [!IMPORTANT]
> Super System is currently a beta. The first release targets React 18+, Next.js, and Vite. Its generated CSS tokens can be used with any web framework.

## What problem does it solve?

AI tools and fast-moving teams create UI quickly — and five slightly different blue buttons just as quickly. Without a system, projects collect mismatched buttons, scattered colors, one-off radiuses, patchy dark mode, and inaccessible combinations.

Super System gives you a single source of truth:

```text
super-system.json
        │
        ├── colors, typography, spacing, radius and accessibility
        │
        ├── generated CSS variables for the entire app
        │
        └── shared React components that consume those variables
```

## Quick start

```bash
npm install @super-system/react
npx @super-system/cli init
npx @super-system/cli studio
```

Import the generated theme and component styles at your app root, wrap with `ThemeProvider`, and start using components from `@super-system/react`. See [Getting started](./docs/getting-started.md) for AI prompts, Next.js/Vite setup, and your first component.

## Documentation

| Guide | Description |
| --- | --- |
| [Documentation hub](./docs/README.md) | Overview and table of contents |
| [Getting started](./docs/getting-started.md) | AI prompts and manual installation |
| [Super System Studio](./docs/studio.md) | Visual theme editor |
| [Theme](./docs/theme.md) | Theme file, CSS variables, light/dark mode |
| [Components](./docs/components.md) | Batch 1–3 React components with examples |
| [Audit & accessibility](./docs/audit-and-accessibility.md) | UI audit, contrast checks, manual verification |
| [CLI reference](./docs/cli.md) | Commands and packages |
| [AI coding tools](./docs/ai-tools.md) | Project rules for coding agents |
| [Troubleshooting](./docs/troubleshooting.md) | Common fixes |
| [Roadmap & contributing](./docs/roadmap.md) | Beta roadmap, OpenSpec, dev setup |

## Links

- **Studio demo:** [Super System Studio on GitHub Pages](https://trondulseth.github.io/super-system/)
- **npm packages:**
  - [`@super-system/cli`](https://www.npmjs.com/package/@super-system/cli)
  - [`@super-system/react`](https://www.npmjs.com/package/@super-system/react)
  - [`@super-system/tokens`](https://www.npmjs.com/package/@super-system/tokens)

## License

[MIT](./LICENSE) © 2026 Trond Ulseth

---

<p align="center"><strong>Build fast. Stay consistent. Go super.</strong> ⚡</p>
