import type { SuperSystemConfig } from "./types.js";

export const defaultTheme: SuperSystemConfig = {
  version: 1,
  mode: { default: "system", storageKey: "super-system-theme" },
  icons: { library: "lucide" },
  typography: {
    fontSans: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, monospace",
    baseSize: "16px",
    lineHeight: 1.5,
    headingLineHeight: 1.25,
    scale: {
      h1: "2.25rem",
      h2: "1.875rem",
      h3: "1.5rem",
      h4: "1.25rem",
      lead: "1.125rem",
      body: "1rem",
      small: "0.875rem"
    },
    weight: {
      heading: 700,
      body: 400,
      strong: 600
    }
  },
  spacing: { unit: 4, density: "comfortable" },
  radius: { sm: "6px", md: "10px", lg: "14px", full: "9999px" },
  elevation: {
    shadow: "0 1px 2px color-mix(in srgb, var(--ss-color-foreground) 6%, transparent)",
    shadowHover: "0 10px 24px color-mix(in srgb, var(--ss-color-foreground) 10%, transparent)",
    lift: "2px"
  },
  surfaces: {
    gradientTint: 5,
    gradientAngle: 145
  },
  themes: {
    light: {
      background: "#ffffff",
      foreground: "#111827",
      primary: "#2563eb",
      primaryForeground: "#ffffff",
      secondary: "#e2e8f0",
      secondaryForeground: "#172033",
      muted: "#f1f5f9",
      mutedForeground: "#475569",
      border: "#cbd5e1",
      destructive: "#b91c1c",
      destructiveForeground: "#ffffff",
      success: "#15803d",
      successForeground: "#ffffff",
      focus: "#1d4ed8",
      link: "#1d4ed8",
      linkHover: "#1e40af"
    },
    dark: {
      background: "#0b1120",
      foreground: "#f8fafc",
      primary: "#60a5fa",
      primaryForeground: "#08111f",
      secondary: "#334155",
      secondaryForeground: "#f8fafc",
      muted: "#1e293b",
      mutedForeground: "#cbd5e1",
      border: "#475569",
      destructive: "#f87171",
      destructiveForeground: "#1f0808",
      success: "#4ade80",
      successForeground: "#052e16",
      focus: "#93c5fd",
      link: "#93c5fd",
      linkHover: "#bfdbfe"
    }
  },
  accessibility: {
    contrast: "AA",
    minimumTargetSize: 44,
    reducedMotion: true
  }
};
