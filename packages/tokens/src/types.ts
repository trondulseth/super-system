export type ColorMode = "light" | "dark" | "system";
export type Density = "compact" | "comfortable" | "spacious";
export type ContrastLevel = "AA" | "AAA";

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  focus: string;
}

export interface SuperSystemConfig {
  version: 1;
  mode: { default: ColorMode; storageKey: string };
  icons: { library: "lucide" | "phosphor" | "heroicons" | "custom" };
  typography: {
    fontSans: string;
    fontMono: string;
    baseSize: string;
    lineHeight: number;
  };
  spacing: { unit: number; density: Density };
  radius: { sm: string; md: string; lg: string; full: string };
  themes: { light: ThemeColors; dark: ThemeColors };
  accessibility: {
    contrast: ContrastLevel;
    minimumTargetSize: number;
    reducedMotion: boolean;
  };
}

export interface ContrastResult {
  theme: "light" | "dark";
  pair: string;
  foreground: string;
  background: string;
  ratio: number;
  required: number;
  passes: boolean;
}
