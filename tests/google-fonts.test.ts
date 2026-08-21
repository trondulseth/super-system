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
    const preset = GOOGLE_FONT_PRESETS.find((entry) => entry.id === "source-sans-3")!;
    expect(buildGoogleFontsUrl(preset, [400, 600, 700])).toBe(
      "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap"
    );
  });

  it("infers preset ids from font stacks", () => {
    expect(inferFontPresetId('"Work Sans", ui-sans-serif, system-ui, sans-serif')).toBe("work-sans");
    expect(inferFontPresetId("Custom Font, sans-serif")).toBe("inter");
  });

  it("emits a Google Fonts import in generated theme CSS", () => {
    const css = buildGoogleFontsImport(defaultTheme);
    expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');");
    expect(resolveFontPreset(defaultTheme).id).toBe("inter");
  });
});
