# Theme

[← Documentation](./README.md) · [Getting started](./getting-started.md) · [Studio](./studio.md) · [Components](./components.md)

## Understanding the theme file

You do not need to understand the entire file before using Super System. These are the important parts:

```jsonc
{
  "mode": {
    "default": "system"
  },
  "typography": {
    "fontFamily": "inter",
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
- `link` and `linkHover` control anchor text in `.ss-link` and `.ss-prose a`.

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

## Surfaces, elevation, and typography utilities

Generated theme CSS now includes surface, elevation, and type-scale variables you can tune in `super-system.json`:

```jsonc
{
  "surfaces": { "gradientTint": 5, "gradientAngle": 145 },
  "elevation": {
    "shadow": "0 1px 2px color-mix(in srgb, var(--ss-color-foreground) 6%, transparent)",
    "shadowHover": "0 10px 24px color-mix(in srgb, var(--ss-color-foreground) 10%, transparent)",
    "lift": "2px"
  },
  "typography": {
    "scale": { "h1": "2.25rem", "h2": "1.875rem", "h3": "1.5rem", "h4": "1.25rem", "lead": "1.125rem", "body": "1rem", "small": "0.875rem" },
    "weight": { "heading": 700, "body": 400, "strong": 600 },
    "headingLineHeight": 1.25
  },
  "themes": {
    "light": { "link": "#1d4ed8", "linkHover": "#1e40af" }
  }
}
```

Neutral components pick up a very subtle `--ss-surface-gradient` automatically. Add elevation with utility classes from `@super-system/react/styles.css`:

```html
<div class="ss-card ss-elevate">Static shadow</div>
<div class="ss-card ss-elevate-on-hover">Lifts on hover</div>
```

Typography helpers:

```html
<article class="ss-prose">
  <h1>Page title</h1>
  <p class="ss-text-lead">Intro copy</p>
  <p>Body paragraph with a <a href="/docs">themed link</a>.</p>
</article>
```

Or use individual classes: `.ss-heading-1` … `.ss-heading-4`, `.ss-text-body`, `.ss-text-small`, `.ss-text-muted`, `.ss-link`.
