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

- light and dark colors, including semantic colors (muted, border, destructive, focus);
- font family and base size;
- component density;
- border radius;
- minimum interactive target size;
- AA or AAA contrast requirements;
- icon-library preference (saved as metadata for a future icon adapter).

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

`ThemeProvider` props:

- `defaultMode` — initial mode when no stored preference exists (default `"system"`);
- `enablePersistence` — read/write `localStorage` using `storageKey` (default `true`);
- `storageKey` — storage key for the user's theme choice (default `"super-system-theme"`);
- `mode` — deprecated alias for `defaultMode`.

When `defaultMode="system"`, the provider listens for operating-system color preference changes. The `mode` prop remains supported for compatibility but `defaultMode` is preferred.

### Vite/React

Wrap your app with `ThemeProvider`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@super-system/react";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultMode="system">
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
  return <ThemeProvider defaultMode="system">{children}</ThemeProvider>;
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

Prefer `ThemeProvider` for light, dark, and system mode. It persists the user's choice when `enablePersistence` is true and reacts to operating-system color preference changes in system mode.

For a manual switcher, Super System reads the `data-theme` attribute on the root `<html>` element:

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

Call `selectTheme("light")`, `selectTheme("dark")`, or `selectTheme("system")` from your own menu or buttons, or use `ThemeProvider` with `defaultMode` instead.

## React components (Batch 1 & 2)

The beta ships **45 exports** from `@super-system/react`: Batch 1 form and feedback (`Button`, `Input`, `Textarea`, `Label`, `Checkbox`, `RadioGroup`, `Radio`, `Switch`, `Select`, `Alert`, `Spinner`, `Skeleton`, `Tooltip`, `Badge`, `Card`, `CardHeader`, `CardTitle`, `CardBody`, `CardFooter`, `ThemeProvider`) plus Batch 2 navigation and disclosure (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`, `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`).

Each component is token-driven, supports light and dark themes, and includes copy-ready examples below.

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
<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" />

<Label htmlFor="email-error" required>
  Email address
</Label>
<Input id="email-error" type="email" invalid aria-describedby="email-error-message" />
```

`Input` forwards normal HTML input properties and applies `aria-invalid` when `invalid` is true.

### Label

Field labels use **font-weight 600** (`Label`, `RadioGroup` legends). Inline option labels such as `Radio` option text use **font-weight 400** so grouped choices read as secondary to the field label.

**Wrapping pattern** — `required` and `disabled` propagate to a single wrapped control:

```tsx
<Label required>
  Email address
  <Input type="email" />
</Label>

<Label disabled>
  Unavailable field
  <Input type="text" />
</Label>
```

When a wrapping label sets `required`, the child receives `required` and `aria-required="true"`. When it sets `disabled`, the child receives `disabled`.

**`htmlFor` pattern** — set native attributes on the associated control yourself:

```tsx
<Label htmlFor="name" required>
  Full name
</Label>
<Input id="name" required aria-required="true" />

<Label htmlFor="legacy" disabled>
  Unavailable field
</Label>
<Input id="legacy" disabled />
```

`Label` forwards native label attributes and supports `required` and `disabled` visual states. Wrap a control to stack the label above it:

```tsx
<Label>
  Email address
  <Input type="email" />
</Label>
```

### Textarea

```tsx
<Textarea rows={4} placeholder="Tell us about yourself" />
<Textarea invalid aria-describedby="bio-error" />
```

`Textarea` mirrors `Input`: it forwards native textarea properties, supports ref forwarding, and applies `aria-invalid` when `invalid` is true.

### Checkbox

```tsx
<Checkbox label="Email me product updates" defaultChecked />
<Checkbox invalid aria-describedby="terms-error" />

<Label inline>
  <Checkbox defaultChecked />
  Email me product updates
</Label>
```

When `label` is provided, `Checkbox` renders an inline label wrapper and `className` applies to that wrapper. Without `label`, `className` applies to the input.

### Radio group

```tsx
<RadioGroup label="Plan">
  <Radio name="plan" value="starter" label="Starter" defaultChecked />
  <Radio name="plan" value="pro" label="Pro" />
</RadioGroup>
```

`RadioGroup` renders a semantic fieldset. Each `Radio` associates its visible label with the native radio input.

### Switch

```tsx
<Switch label="Enable notifications" defaultChecked />
<Switch invalid aria-describedby="switch-error" />

<Label inline>
  <Switch defaultChecked />
  Enable notifications
</Label>
```

`Switch` uses the native checkbox with `role="switch"`. The `label` prop and `className` placement follow the same rules as `Checkbox`.

### Select

```tsx
<Label htmlFor="country">Country</Label>
<Select id="country" defaultValue="no">
  <option value="no">Norway</option>
  <option value="se">Sweden</option>
</Select>
<Select invalid aria-describedby="country-error">
  <option value="">Choose a role</option>
</Select>
```

### Alert

```tsx
<Alert title="Workspace created">Invite teammates when you are ready.</Alert>
<Alert variant="primary" title="Invite sent">
  Your teammate can now join the workspace.
</Alert>
<Alert variant="destructive" title="Payment failed">
  Update your billing details to keep access.
</Alert>
```

`Alert` defaults to `role="status"` for neutral and primary variants, and `role="alert"` for destructive messages. Override with `liveRegion`:

```tsx
<Alert variant="primary" liveRegion="alert" title="Critical notice">
  This upgrade requires immediate attention.
</Alert>
```

### Spinner

```tsx
<Spinner />
<Spinner size="lg" label="Saving changes" />
<Button loading>Saving</Button>
```

Use `aria-hidden` when the spinner is decorative inside a control that already communicates status.

### Skeleton

```tsx
<Skeleton variant="block" />
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" />
```

Skeleton placeholders are marked `aria-hidden` because surrounding content should communicate loading state.

### Tooltip

```tsx
<Tooltip content="Use semantic tokens instead of hard-coded colors.">
  <Button variant="secondary">Help</Button>
</Tooltip>
```

Tooltip content appears on hover and focus, merges with any existing `aria-describedby` ids on the trigger, and closes on Escape. Tooltips render inline without a portal, so they may clip inside overflow containers. Use the optional `display` prop (`inline`, `inline-flex`, or `block`) when the wrapper affects layout.

### Badge

```tsx
<Badge variant="neutral">Draft</Badge>
<Badge variant="primary">Active</Badge>
<Badge variant="destructive">Blocked</Badge>
```

### Card

```tsx
<Card>Any React content can go here.</Card>

<Card>
  <CardHeader>
    <CardTitle>Account</CardTitle>
  </CardHeader>
  <CardBody>Manage your profile settings.</CardBody>
  <CardFooter>
    <Button size="sm">Save</Button>
  </CardFooter>
</Card>
```

`Card` provides the shared surface, border, and radius. Bare cards keep padding; composable `CardHeader`, `CardTitle`, `CardBody`, and `CardFooter` parts handle structured layouts.

### Tabs

```tsx
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">Profile settings</TabsContent>
  <TabsContent value="billing">Billing settings</TabsContent>
</Tabs>
```

Tabs follow the WAI-ARIA tabs pattern: roving `tabIndex`, arrow-key focus movement within `TabsList`, and `aria-selected` / `aria-controls` wiring between triggers and panels. Use controlled `value` / `onValueChange` when you need external state.

### Accordion

```tsx
<Accordion type="single" defaultValue="account" collapsible>
  <AccordionItem value="account">
    <AccordionTrigger>Account</AccordionTrigger>
    <AccordionContent>Update your email and password.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="notifications">
    <AccordionTrigger>Notifications</AccordionTrigger>
    <AccordionContent>Choose which alerts you receive.</AccordionContent>
  </AccordionItem>
</Accordion>
```

Set `type="multiple"` to allow more than one section open. Triggers expose `aria-expanded` and toggle their linked region on click.

### Breadcrumb

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Settings</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

The root `Breadcrumb` renders a `nav` with `aria-label="Breadcrumb"`. Use `BreadcrumbPage` for the current page (`aria-current="page"`).

### Dropdown menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="secondary">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

The menu opens on trigger click, supports arrow-key navigation and Escape to close, and returns focus to the trigger. Like `Tooltip`, content renders inline without a portal and may clip inside overflow containers.

### Pagination

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

Use `isActive` on `PaginationLink` to mark the current page (`aria-current="page"`). Previous and next links include accessible labels.

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

### Manual verification checklist

After theme or component changes, spot-check Batch 1 and Batch 2 controls in both light and dark themes:

| Check | How to verify |
| --- | --- |
| Keyboard focus | Tab through Button, Input, Textarea, Checkbox, Radio, Switch, Select, Tooltip triggers, Tabs, Accordion triggers, Breadcrumb links, Dropdown items, and Pagination links; confirm visible focus rings. |
| Tabs & accordion | Use arrow keys in tab lists; confirm only one tab panel is visible. Toggle accordion sections and confirm `aria-expanded` updates. |
| Dropdown menu | Open with click or Enter, move with arrow keys, close with Escape; confirm focus returns to the trigger. |
| Reduced motion | Enable `prefers-reduced-motion: reduce` in devtools; confirm spinner, skeleton, tab, and accordion animations stop. |
| Forced colors | Enable forced-colors / high-contrast mode; confirm inputs, checkbox, radio, switch, and select borders remain visible. |
| Invalid states | Trigger `invalid` on Input, Textarea, Select, Checkbox, and Switch; confirm border and subtle background tint. |
| Live regions | Confirm destructive `Alert` uses `role="alert"` and neutral/primary alerts default to `role="status"`. |
| Zoom | At 200% browser zoom, confirm labels, controls, and Studio previews remain readable and usable. |

Component CSS includes `prefers-reduced-motion` and `forced-colors` fallbacks; zoom and screen-reader behavior still require manual verification in your application layout.

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
Use components from @super-system/react for buttons, inputs, textareas, labels, checkboxes, radio groups, switches, selects, alerts, spinners, skeletons, tooltips, badges, cards, tabs, accordions, breadcrumbs, dropdown menus, pagination, and theme switching.
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

Batch 1 form and feedback components are **shipped and polished** (see archived change `2026-08-20-polish-batch1-quality`). Batch 2 navigation and disclosure components are **shipped** (Tabs, Accordion, Breadcrumb, Dropdown Menu, Pagination). Next planned work:

- **Batch 3 — overlays and data:** dialog, drawer, popover, toast, table primitives;
- automatic icon-package installation and normalized icon components;
- a safer assisted migration workflow for existing projects;
- ESLint rules and deeper framework-aware audits;
- optional AI instruction adapters;
- hosted theme sharing in addition to the private local Studio.

The [Studio browser demo](https://trondulseth.github.io/super-system/) is available on GitHub Pages and stays in sync with the local Studio UI through the shared `@super-system/studio-ui` package.

## Product specifications and roadmap

Super System uses [OpenSpec](https://openspec.dev/) to keep the product plan reviewable and close to the code.

- [`openspec/specs`](./openspec/specs) describes what the current beta does today.
- [`openspec/changes`](./openspec/changes) contains active proposals, technical designs, acceptance requirements, and implementation checklists for planned work.
- [`openspec/changes/archive`](./openspec/changes/archive) records completed changes, including the bootstrap beta, Batch 1 component expansion, Studio GitHub Pages demo, and the Batch 1 quality polish pass.

Active work to watch: [`expand-react-component-library`](./openspec/changes/expand-react-component-library) (Batch 2 navigation components).

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

`pnpm check` runs strict TypeScript validation, unit tests, production builds for every package, and a Studio demo build verification.

## License

[MIT](./LICENSE) © 2026 Trond Ulseth

---

**Build fast. Stay consistent. Go super.** ⚡
