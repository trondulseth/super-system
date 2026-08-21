# Getting started

[← Documentation](./README.md) · [Studio](./studio.md) · [AI tools](./ai-tools.md) · [Components](./components.md)

## Get started with AI (recommended)

The fastest way to adopt Super System is to paste a prompt into your coding agent (Cursor, Copilot, Claude Code, Windsurf, etc.) and let it wire everything up in your repo.

### Prompt: Install Super System

```text
Add Super System to this React project (Next.js App Router or Vite).

1. Install @super-system/react
2. Run npx @super-system/cli init (use --force only if super-system.json already exists and I confirm)
3. Import the generated theme CSS and @super-system/react/styles.css once at the app root
4. Wrap the app with ThemeProvider from @super-system/react (defaultMode="system")
5. Replace any raw <button>, <input>, and ad-hoc form controls in the files I point you at with Super System components
6. Tell me exactly which files you changed and what I should run to verify
```

### Prompt: Use Super System components

```text
In this codebase, use @super-system/react for UI:

- Button, Input, Textarea, Label, Checkbox, RadioGroup, Radio, Switch, Slider, Select
- Alert, Spinner, Skeleton, Tooltip, Badge, Card
- Tabs, Accordion, Breadcrumb, DropdownMenu, Pagination
- Dialog, Drawer, Popover, Toast (ToastProvider + useToast), Table, Icon

Rules:
- Use semantic CSS variables from the generated theme (var(--ss-color-primary), etc.) — never hard-code hex colors or arbitrary spacing in component code
- Treat super-system.json as the single source of truth for colors, typography, spacing, radius, and accessibility
- Never edit .super-system/theme.css by hand — regenerate with npx @super-system/cli build-theme after theme changes
- Prefer ThemeProvider for light/dark/system mode instead of manual data-theme toggles
```

### Prompt: Tune the theme in Studio

```text
Open Super System Studio for this project and help me adjust the theme.

1. Run npx @super-system/cli studio (or tell me to use the browser demo at https://trondulseth.github.io/super-system/ if I am not in the repo)
2. Use the sliders for line height, spacing unit, radii, base size, and minimum target size
3. Preview light and dark themes and fix any contrast failures shown in the checks panel
4. Save the theme so super-system.json and .super-system/theme.css are updated
5. Summarize what changed in the theme file
```

### Prompt: Audit UI consistency

```text
Run a Super System consistency check on this project:

1. npx @super-system/cli audit
2. npx @super-system/cli check-contrast
3. List each finding with file, line, and a concrete fix using @super-system/react components or theme tokens
4. Apply fixes for raw buttons/inputs, hard-coded colors, and missing alt text unless I say to skip a finding
```

### Project rule (paste into AGENTS.md, CLAUDE.md, or Cursor rules)

```text
Use components from @super-system/react for buttons, inputs, textareas, labels, checkboxes, radio groups, switches, sliders, selects, alerts, spinners, skeletons, tooltips, badges, cards, tabs, accordions, breadcrumbs, dropdown menus, pagination, dialogs, drawers, popovers, toasts, tables, icons, and theme switching.
Use semantic Super System CSS variables instead of hard-coded colors or spacing.
Treat super-system.json as the single source of truth.
Never edit .super-system/theme.css manually.
After UI work, run npx @super-system/cli audit and check-contrast.
```

## Manual setup (reference)

If you prefer to install by hand, or want to verify what the AI did:

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
