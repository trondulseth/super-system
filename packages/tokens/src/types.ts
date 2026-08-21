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
  link: string;
  linkHover: string;
}

export interface TypographyScale {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  lead: string;
  body: string;
  small: string;
}

export interface TypographyWeights {
  heading: number;
  body: number;
  strong: number;
}

export interface ElevationConfig {
  shadow: string;
  shadowHover: string;
  lift: string;
}

export interface SurfaceConfig {
  gradientTint: number;
  gradientAngle: number;
}

export interface SuperSystemConfig {
  version: 1;
  mode: { default: ColorMode; storageKey: string };
  icons: { library: "lucide" | "phosphor" | "heroicons" | "custom" };
  typography: {
    fontFamily?: string;
    fontSans: string;
    fontMono: string;
    baseSize: string;
    lineHeight: number;
    scale: TypographyScale;
    weight: TypographyWeights;
    headingLineHeight: number;
  };
  spacing: { unit: number; density: Density };
  radius: { sm: string; md: string; lg: string; full: string };
  elevation: ElevationConfig;
  surfaces: SurfaceConfig;
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
