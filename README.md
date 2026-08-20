# Super System

> **One theme. One set of components. Zero mystery-meat buttons.**

[![npm CLI](https://img.shields.io/npm/v/%40super-system%2Fcli?label=CLI&color=2563eb)](https://www.npmjs.com/package/@super-system/cli)
[![npm React](https://img.shields.io/npm/v/%40super-system%2Freact?label=React&color=2563eb)](https://www.npmjs.com/package/@super-system/react)
[![MIT license](https://img.shields.io/badge/license-MIT-16a34a)](./LICENSE)

Super System is a lightweight, AI-independent design system for React apps. It gives your project a shared visual language, accessible components, automatic light/dark themes, a visual theme editor, and a UI consistency audit.

Change a color once. Change button padding once. Change the radius once. Your whole product follows.

No design-system degree required. Your app gets the cape; you get to keep the credit. 🦸

> [!IMPORTANT]
> Super System is currently a beta. The first release targets React 18+, Next.js, and Vite. Its generated CSS tokens can be used with any web framework.

## What problem does it solve?

AI tools and fast-moving product teams are great at creating UI quickly. They are also great at accidentally creating five slightly different blue buttons.

Without a system, a project slowly collects:

- buttons with different heights and padding;
- almost-identical colors scattered through the code;
- one-off border radiuses and font sizes;
- dark mode fixes applied to individual pages;
- inaccessible color combinations and missing focus states;
- components that look related but are implemented differently.

Super System creates a single source of truth:

```text
super-system.json
        │
        ├── colors, typography, spacing, radius and accessibility
        │
        ├── generated CSS variables for the entire app
        │
        └── shared React components that consume those variables
```

## The five-minute setup

### 1. Open your project

Use an existing React project or create a new Next.js/Vite project. Super System requires Node.js 20 or newer.

```bash
cd your-project
```

### 2. Install the React components

```bash
npm install @super-system/react
```

### 3. Initialize Super System

```bash
npx @super-system/cli init
```

This creates two files:

```text
your-project/
├── super-system.json        # The theme you edit
└── .super-system/
    └── theme.css            # Generated CSS — do not edit this by hand
```

### 4. Import the styles

Your app needs the generated theme and the component styles.

For Next.js App Router, add these imports to `app/layout.tsx`:

```tsx
import "../.super-system/theme.css";
import "@super-system/react/styles.css";
```

For Vite, add them to `src/main.tsx`:

```tsx
import "../.super-system/theme.css";
import "@super-system/react/styles.css";
```

If your folders are arranged differently, adjust only the relative path to `.super-system/theme.css`.

### 5. Use your first component

```tsx
import { Badge, Button, Card, Input } from "@super-system/react";

export function WelcomeCard() {
  return (
    <Card>
      <Badge variant="primary">Super powered</Badge>
      <h2>Create your account</h2>

      <label>
        Email address
        <Input type="email" placeholder="you@example.com" />
      </label>

      <Button size="md">Continue</Button>
    </Card>
  );
}
```

That is it. The components now use the same colors, spacing, typography, radius, focus treatment, and light/dark theme.

## Make it yours with Super System Studio

Run:

```bash
npx @super-system/cli studio
```

Or try the browser demo without installing anything: [Super System Studio on GitHub Pages](https://trondulseth.github.io/super-system/).

The public demo uses the same Studio UI as the CLI. It keeps edits in your browser and downloads `super-system.json` when you export a theme. For project integration and saving directly to your repository, use the local command above.

Studio opens locally in your browser. It does not upload your project or theme anywhere.

Use it to preview and adjust:

- light and dark colors;
- font family and base size;
- component density;
- border radius;
- minimum interactive target size;
- AA or AAA contrast requirements;
- icon-library preference.

Click **Save theme**. Studio updates `super-system.json` and regenerates `.super-system/theme.css` automatically.

> [!NOTE]
> In the current beta, the icon-library setting is theme metadata. Automatic icon-package installation is planned for a later release.

## Understanding the theme file

You do not need to understand the entire file before using Super System. These are the important parts:

```jsonc
{
  "mode": {
    "default": "system"
  },
  "typography": {
    "fontSans": "Inter, ui-sans-serif, system-ui, sans-serif",
    "baseSize": "16px"
  },
  "spacing": {
    "unit": 4,
    "density": "comfortable"
  },
  "radius": {
    "md": "10px"
  },
  "themes": {
    "light": {
      "primary": "#2563eb",
      "primaryForeground": "#ffffff"
    },
    "dark": {
      "primary": "#60a5fa",
      "primaryForeground": "#08111f"
    }
  },
  "accessibility": {
    "contrast": "AA",
    "minimumTargetSize": 44,
    "reducedMotion": true
  }
}
```

The color names describe purpose, not a specific color:

- `primary` is the main action color;
- `primaryForeground` is text placed on the primary color;
- `background` and `foreground` are the page surface and text;
- `secondary` is a less prominent action or surface;
- `muted` is a quiet surface;
- `destructive` is used for dangerous actions;
- `border` and `focus` provide consistent boundaries and keyboard focus.

If you edit `super-system.json` manually, regenerate the CSS:

```bash
npx @super-system/cli build-theme
```

## Light and dark mode

The generated theme supports three modes:

- `light` — always light;
- `dark` — always dark;
- `system` — follows the visitor's operating-system preference.

### Vite/React

Wrap your app with `ThemeProvider`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@super-system/react";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider mode="system">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
```

### Next.js App Router

`ThemeProvider` is interactive, so place it in a small client component:

```tsx
// app/providers.tsx
"use client";

import { ThemeProvider } from "@super-system/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider mode="system">{children}</ThemeProvider>;
}
```

Then use it from the root layout:

```tsx
// app/layout.tsx
import "../.super-system/theme.css";
import "@super-system/react/styles.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Add a theme switcher

Super System reads the `data-theme` attribute on the root `<html>` element:

```tsx
type Theme = "light" | "dark" | "system";

function selectTheme(theme: Theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = theme;
  }

  localStorage.setItem("super-system-theme", theme);
}
```

Call `selectTheme("light")`, `selectTheme("dark")`, or `selectTheme("system")` from your own menu or buttons.

## Components in the first beta

### Button

```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Learn more</Button>
<Button loading>Saving</Button>
```

- Button variants: `primary`, `secondary`, `destructive`, `ghost`
- Button sizes: `sm`, `md`, `lg`

### Input

```tsx
<Input type="text" />
<Input type="email" invalid aria-describedby="email-error" />
```

`Input` forwards normal HTML input properties and applies `aria-invalid` when `invalid` is true. You are still responsible for providing a visible label.

### Badge

```tsx
<Badge variant="neutral">Draft</Badge>
<Badge variant="primary">Active</Badge>
<Badge variant="destructive">Blocked</Badge>
```

### Card

```tsx
<Card>Any React content can go here.</Card>
```

`Card` provides the shared surface, border, radius, foreground, and padding.

## Find inconsistent UI with Audit

Run this inside any existing project:

```bash
npx @super-system/cli audit
```

Audit looks for common sources of UI drift:

- raw `<button>` elements;
- raw inputs, selects, and textareas;
- hard-coded hex/RGB colors;
- arbitrary Tailwind spacing values;
- inline style objects;
- images without `alt` attributes.

Example output:

```text
Found 3 potential design-system violations:

src/App.tsx:18  raw-button       Use the shared Button component.
src/App.tsx:27  hardcoded-color  Replace hardcoded color with a semantic token.
src/Hero.tsx:9  image-alt        Add meaningful alt text or alt="".
```

Audit reports possible problems; it does not rewrite your application. Review each finding before changing code.

For machine-readable output:

```bash
npx @super-system/cli audit --json
```

Audit exits with code `1` when it finds violations, so it can also be used in CI.

## Check color contrast

Run:

```bash
npx @super-system/cli check-contrast
```

Super System checks important foreground/background pairs in both themes:

```text
PASS light/foreground/background: 17.74:1
PASS light/primary: 5.17:1
PASS dark/primary: 7.44:1
```

The default theme passes its configured WCAG AA contrast threshold. If any configured pair fails, the command exits with code `1`.

Automated tools can identify many accessibility issues, but no automated tool can certify an entire product as WCAG compliant. Keyboard testing, screen-reader testing, content review, and human judgment are still important.

## CLI reference

| Command | What it does |
| --- | --- |
| `npx @super-system/cli init` | Creates the default theme and generated CSS. |
| `npx @super-system/cli init --force` | Replaces an existing theme. This overwrites it. |
| `npx @super-system/cli studio` | Starts the local visual theme editor. |
| `npx @super-system/cli studio --port 5000` | Starts Studio on another port. |
| `npx @super-system/cli studio --no-open` | Starts Studio without opening a browser. |
| `npx @super-system/cli audit` | Reports likely UI consistency problems. |
| `npx @super-system/cli audit --json` | Prints findings as JSON. |
| `npx @super-system/cli build-theme` | Regenerates CSS from `super-system.json`. |
| `npx @super-system/cli check-contrast` | Checks configured light/dark color pairs. |

All commands accept `--cwd path` when the target project is not the current folder.

## Packages

| Package | Purpose |
| --- | --- |
| [`@super-system/cli`](https://www.npmjs.com/package/@super-system/cli) | Initialize, edit, generate, and audit. |
| [`@super-system/react`](https://www.npmjs.com/package/@super-system/react) | React components and component CSS. |
| [`@super-system/tokens`](https://www.npmjs.com/package/@super-system/tokens) | Theme types, validation, CSS compilation, and contrast checks. |

You can use `@super-system/tokens` directly when building another framework adapter:

```ts
import {
  checkThemeContrast,
  compileTheme,
  defaultTheme,
  validateConfig,
} from "@super-system/tokens";
```

## Using Super System with AI coding tools

Super System does not depend on an AI tool. Its files and commands work with humans, scripts, CI, and any coding agent.

If you use an AI assistant, give it this project rule:

```text
Use components from @super-system/react for buttons, inputs, badges, and cards.
Use semantic Super System CSS variables instead of hard-coded colors or spacing.
Treat super-system.json as the single source of truth.
Never edit .super-system/theme.css manually.
After UI work, run npx @super-system/cli audit and check-contrast.
```

The rule works in an `AGENTS.md`, `CLAUDE.md`, Cursor rule, Copilot instruction, or ordinary project documentation.

## Troubleshooting

### The components have no styling

Make sure both files are imported once near your application root:

```tsx
import "../.super-system/theme.css";
import "@super-system/react/styles.css";
```

### `super-system.json already exists`

That is a safety feature. Use Studio to edit the current theme. Only use `init --force` when you deliberately want to replace it.

### My manual theme changes are not visible

Regenerate the CSS:

```bash
npx @super-system/cli build-theme
```

Then restart the application if its development server does not notice generated files.

### Contrast checks fail

Increase the difference between the relevant foreground and background colors. Studio displays the ratio while you edit.

### Studio does not open automatically

Open `http://127.0.0.1:4173` manually, or choose another port:

```bash
npx @super-system/cli studio --port 5000
```

## Beta roadmap

The first beta deliberately starts small. Planned work includes:

- form fields, textarea, select, checkbox, radio, switch, dialog, drawer, toast, tabs, and table;
- automatic icon-package installation and normalized icon components;
- a safer assisted migration workflow for existing projects;
- ESLint rules and deeper framework-aware audits;
- optional AI instruction adapters;
- hosted theme sharing in addition to the private local Studio;
- visual regression and expanded accessibility testing.

The [Studio browser demo](https://trondulseth.github.io/super-system/) is already available on GitHub Pages and stays in sync with the local Studio UI through the shared `@super-system/studio-ui` package.

## Product specifications and roadmap

Super System uses [OpenSpec](https://openspec.dev/) to keep the product plan reviewable and close to the code.

- [`openspec/specs`](./openspec/specs) describes what the current beta does today.
- [`openspec/changes`](./openspec/changes) contains complete proposals, technical designs, acceptance requirements, and implementation checklists for planned work.
- [`openspec/changes/archive`](./openspec/changes/archive) records the completed bootstrap that produced the current public beta.

Before implementing a planned feature, review its OpenSpec change. When the work and verification tasks are complete, sync the living specification and archive the change. This gives people and AI coding tools the same source of truth.

## Contributing

Super System is developed as an npm workspace:

```bash
git clone https://github.com/trondulseth/super-system.git
cd super-system
corepack enable
pnpm install
pnpm check
```

`pnpm check` runs strict TypeScript validation, unit tests, and production builds for every package.

## License

[MIT](./LICENSE) © 2026 Trond Ulseth

---

**Build fast. Stay consistent. Go super.** ⚡
