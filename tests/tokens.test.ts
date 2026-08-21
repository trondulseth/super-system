import { describe, expect, it } from "vitest";
import { checkThemeContrast, compileTheme, contrastRatio, defaultTheme, validateConfig } from "../packages/tokens/src/index.js";

describe("theme tokens", () => {
  it("compiles portable light and dark CSS", () => {
    const css = compileTheme(defaultTheme);
    expect(css).toContain("--ss-color-primary: #2563eb");
    expect(css).toContain("--ss-color-success:");
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain("prefers-reduced-motion");
  });

  it("passes every default contrast pair", () => {
    expect(checkThemeContrast(defaultTheme).every((result) => result.passes)).toBe(true);
  });

  it("uses distinct secondary, muted, focus, and primary values in defaults", () => {
    const { light, dark } = defaultTheme.themes;
    expect(light.secondary).not.toBe(light.muted);
    expect(light.focus).not.toBe(light.primary);
    expect(dark.secondary).not.toBe(dark.muted);
    expect(dark.focus).not.toBe(dark.primary);
  });

  it("checks focus ring contrast against page background", () => {
    const focusResults = checkThemeContrast(defaultTheme).filter((result) => result.pair === "focus/background");
    expect(focusResults).toHaveLength(2);
    expect(focusResults.every((result) => result.passes)).toBe(true);
  });

  it("calculates WCAG contrast", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
  });

  it("rejects incomplete configs", () => {
    expect(() => validateConfig({ version: 1 })).toThrow();
  });
});
