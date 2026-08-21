import { describe, expect, it } from "vitest";
import {
  buildGoogleFontsImport,
  buildGoogleFontsUrl,
  defaultTheme,
  GOOGLE_FONT_PRESETS,
  inferFontPresetId,
  resolveFontPreset
} from "../packages/tokens/src/index.js";

describe("google fonts", () => {
  it("builds a stylesheet URL with configured weights", () => {
    const preset = GOOGLE_FONT_PRESETS.find((entry) => entry.id === "lora")!;
    expect(buildGoogleFontsUrl(preset, [400, 600, 700])).toBe(
      "https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap"
    );
  });

  it("infers preset ids from font stacks", () => {
    expect(inferFontPresetId('"Space Grotesk", ui-sans-serif, system-ui, sans-serif')).toBe("space-grotesk");
    expect(inferFontPresetId("Custom Font, sans-serif")).toBe("inter");
  });

  it("falls back to fontSans when an old preset id is stored", () => {
    const config = {
      ...defaultTheme,
      typography: {
        ...defaultTheme.typography,
        fontFamily: "work-sans",
        fontSans: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif'
      }
    };
    expect(resolveFontPreset(config).id).toBe("space-grotesk");
  });

  it("emits a Google Fonts import in generated theme CSS", () => {
    const css = buildGoogleFontsImport(defaultTheme);
    expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');");
    expect(resolveFontPreset(defaultTheme).id).toBe("inter");
  });
});
