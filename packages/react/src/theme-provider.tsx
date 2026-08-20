import * as React from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** @deprecated Use `defaultMode` instead. */
  mode?: ThemeMode;
  defaultMode?: ThemeMode;
  storageKey?: string;
  enablePersistence?: boolean;
}

function applyTheme(mode: ThemeMode): void {
  if (mode === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.dataset.theme = mode;
}

function resolveMode(
  defaultMode: ThemeMode,
  enablePersistence: boolean,
  storageKey: string
): ThemeMode {
  if (!enablePersistence) return defaultMode;

  const stored = window.localStorage.getItem(storageKey);
  if (stored === "light" || stored === "dark") return stored;
  return defaultMode;
}

export function ThemeProvider({
  children,
  mode,
  defaultMode = mode ?? "system",
  storageKey = "super-system-theme",
  enablePersistence = true
}: ThemeProviderProps) {
  React.useEffect(() => {
    const syncTheme = () => {
      applyTheme(resolveMode(defaultMode, enablePersistence, storageKey));
    };

    syncTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (resolveMode(defaultMode, enablePersistence, storageKey) === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, [defaultMode, enablePersistence, storageKey]);

  return <>{children}</>;
}
