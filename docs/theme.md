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
