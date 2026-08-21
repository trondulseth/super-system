/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from "vitest";
import { defaultTheme } from "../packages/tokens/src/index.js";
import {
  applyConfigToForm,
  buildElevationShadow,
  buildElevationShadowHover,
  parseShadowStrength,
  readConfigFromForm,
  syncSliderDisplays,
  validateStudioForm
} from "../packages/studio-ui/src/studio-form.js";

function createFormFixture(): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = `
    <input id="primary" type="color" value="#2563eb" />
    <input id="primaryHex" type="text" value="#2563eb" />
    <input id="primaryForeground" type="color" value="#ffffff" />
    <input id="primaryForegroundHex" type="text" value="#ffffff" />
    <input id="background" type="color" value="#ffffff" />
    <input id="backgroundHex" type="text" value="#ffffff" />
    <input id="foreground" type="color" value="#111827" />
    <input id="foregroundHex" type="text" value="#111827" />
    <input id="secondary" type="color" value="#e2e8f0" />
    <input id="secondaryHex" type="text" value="#e2e8f0" />
    <input id="secondaryForeground" type="color" value="#172033" />
    <input id="secondaryForegroundHex" type="text" value="#172033" />
    <input id="muted" type="color" value="#f1f5f9" />
    <input id="mutedHex" type="text" value="#f1f5f9" />
    <input id="mutedForeground" type="color" value="#475569" />
    <input id="mutedForegroundHex" type="text" value="#475569" />
    <input id="border" type="color" value="#cbd5e1" />
    <input id="borderHex" type="text" value="#cbd5e1" />
    <input id="destructive" type="color" value="#b91c1c" />
    <input id="destructiveHex" type="text" value="#b91c1c" />
    <input id="destructiveForeground" type="color" value="#ffffff" />
    <input id="destructiveForegroundHex" type="text" value="#ffffff" />
    <input id="success" type="color" value="#15803d" />
    <input id="successHex" type="text" value="#15803d" />
    <input id="successForeground" type="color" value="#ffffff" />
    <input id="successForegroundHex" type="text" value="#ffffff" />
    <input id="focus" type="color" value="#1d4ed8" />
    <input id="focusHex" type="text" value="#1d4ed8" />
    <input id="link" type="color" value="#1d4ed8" />
    <input id="linkHex" type="text" value="#1d4ed8" />
    <input id="linkHover" type="color" value="#1e40af" />
    <input id="linkHoverHex" type="text" value="#1e40af" />
    <select id="fontFamily"><option value="inter">Inter</option><option value="work-sans">Work Sans</option></select>
    <input id="fontMono" value="monospace" />
    <input id="baseSize" class="ss-slider" type="range" min="12" max="24" value="16" />
    <output for="baseSize"></output>
    <input id="lineHeight" class="ss-slider" type="range" step="0.05" value="1.5" />
    <output for="lineHeight"></output>
    <input id="headingLineHeight" class="ss-slider" type="range" step="0.05" value="1.25" />
    <output for="headingLineHeight"></output>
    <input id="scaleH1" class="ss-slider" type="range" step="0.125" value="2.25" />
    <output for="scaleH1"></output>
    <input id="scaleH2" class="ss-slider" type="range" step="0.125" value="1.875" />
    <output for="scaleH2"></output>
    <input id="scaleH3" class="ss-slider" type="range" step="0.125" value="1.5" />
    <output for="scaleH3"></output>
    <input id="scaleH4" class="ss-slider" type="range" step="0.125" value="1.25" />
    <output for="scaleH4"></output>
    <input id="scaleLead" class="ss-slider" type="range" step="0.0625" value="1.125" />
    <output for="scaleLead"></output>
    <input id="scaleSmall" class="ss-slider" type="range" step="0.0625" value="0.875" />
    <output for="scaleSmall"></output>
    <select id="weightHeading"><option value="700">700</option></select>
    <select id="weightBody"><option value="400">400</option></select>
    <select id="weightStrong"><option value="600">600</option></select>
    <input id="gradientTint" class="ss-slider" type="range" value="5" />
    <output for="gradientTint"></output>
    <input id="gradientAngle" class="ss-slider" type="range" value="145" />
    <output for="gradientAngle"></output>
    <input id="shadowStrength" class="ss-slider" type="range" value="6" />
    <output for="shadowStrength"></output>
    <input id="shadowHoverStrength" class="ss-slider" type="range" value="10" />
    <output for="shadowHoverStrength"></output>
    <input id="lift" class="ss-slider" type="range" value="2" />
    <output for="lift"></output>
    <input id="radiusSm" class="ss-slider" type="range" value="6" />
    <output for="radiusSm"></output>
    <input id="radiusMd" class="ss-slider" type="range" value="10" />
    <output for="radiusMd"></output>
    <input id="radiusLg" class="ss-slider" type="range" value="14" />
    <output for="radiusLg"></output>
    <input id="radiusFull" value="9999px" />
    <input id="spacingUnit" class="ss-slider" type="range" value="4" />
    <output for="spacingUnit"></output>
    <select id="density"><option>comfortable</option></select>
    <select id="icons"><option>lucide</option></select>
    <select id="contrast"><option>AA</option></select>
    <input id="target" class="ss-slider" type="range" value="44" />
    <output for="target"></output>
    <select id="modeDefault"><option>system</option></select>
    <input id="reducedMotion" type="checkbox" checked />
  `;
  document.body.appendChild(container);
  return container;
}

describe("studio form", () => {
  it("persists spacing unit and radius.full when collecting form values", () => {
    const root = createFormFixture();
    const config = structuredClone(defaultTheme);

    applyConfigToForm(config, "light", root);

    (root.querySelector("#spacingUnit") as HTMLInputElement).value = "6";
    (root.querySelector("#radiusFull") as HTMLInputElement).value = "100px";

    const collected = readConfigFromForm(config, "light", root);

    expect(collected.spacing.unit).toBe(6);
    expect(collected.radius.full).toBe("100px");
    root.remove();
  });

  it("round-trips surfaces, elevation, typography scale, and link colors", () => {
    const root = createFormFixture();
    const config = structuredClone(defaultTheme);

    applyConfigToForm(config, "light", root);

    (root.querySelector("#gradientTint") as HTMLInputElement).value = "8";
    (root.querySelector("#gradientAngle") as HTMLInputElement).value = "90";
    (root.querySelector("#shadowStrength") as HTMLInputElement).value = "12";
    (root.querySelector("#shadowHoverStrength") as HTMLInputElement).value = "18";
    (root.querySelector("#lift") as HTMLInputElement).value = "4";
    (root.querySelector("#scaleH1") as HTMLInputElement).value = "2.5";
    (root.querySelector("#headingLineHeight") as HTMLInputElement).value = "1.3";
    (root.querySelector("#linkHex") as HTMLInputElement).value = "#334155";
    (root.querySelector("#link") as HTMLInputElement).value = "#334155";

    const collected = readConfigFromForm(config, "light", root);

    expect(collected.surfaces).toEqual({ gradientTint: 8, gradientAngle: 90 });
    expect(collected.elevation.shadow).toBe(buildElevationShadow(12));
    expect(collected.elevation.shadowHover).toBe(buildElevationShadowHover(18));
    expect(collected.elevation.lift).toBe("4px");
    expect(collected.typography.scale.h1).toBe("2.5rem");
    expect(collected.typography.headingLineHeight).toBe(1.3);
    expect(collected.themes.light.link).toBe("#334155");
    root.remove();
  });

  it("persists Google Font preset selection", () => {
    const root = createFormFixture();
    const config = structuredClone(defaultTheme);

    applyConfigToForm(config, "light", root);
    (root.querySelector("#fontFamily") as HTMLSelectElement).value = "work-sans";

    const collected = readConfigFromForm(config, "light", root);

    expect(collected.typography.fontFamily).toBe("work-sans");
    expect(collected.typography.fontSans).toContain("Work Sans");
    root.remove();
  });

  it("syncs slider value displays", () => {
    const root = createFormFixture();

    (root.querySelector("#target") as HTMLInputElement).value = "48";
    (root.querySelector("#gradientTint") as HTMLInputElement).value = "10";
    syncSliderDisplays(root);

    expect(root.querySelector('output[for="target"]')?.textContent).toBe("48px");
    expect(root.querySelector('output[for="gradientTint"]')?.textContent).toBe("10%");
    root.remove();
  });

  it("parses shadow strength from elevation strings", () => {
    expect(parseShadowStrength(defaultTheme.elevation.shadow, 0)).toBe(6);
    expect(parseShadowStrength("custom shadow", 9)).toBe(9);
  });

  it("blocks invalid line height before save", () => {
    const root = createFormFixture();

    (root.querySelector("#lineHeight") as HTMLInputElement).value = "2.5";
    expect(validateStudioForm(root)).toBe("Line height must be between 1.1 and 2.");

    (root.querySelector("#lineHeight") as HTMLInputElement).value = "1.5";
    expect(validateStudioForm(root)).toBeNull();

    root.remove();
  });

  it("blocks invalid spacing unit and target values", () => {
    const root = createFormFixture();

    (root.querySelector("#spacingUnit") as HTMLInputElement).value = "1";
    expect(validateStudioForm(root)).toBe("Spacing unit must be between 2 and 8.");

    (root.querySelector("#spacingUnit") as HTMLInputElement).value = "4";
    (root.querySelector("#target") as HTMLInputElement).value = "20";
    expect(validateStudioForm(root)).toBe("Minimum target must be between 24 and 64.");

    root.remove();
  });

  it("blocks invalid surface and elevation values", () => {
    const root = createFormFixture();

    (root.querySelector("#gradientTint") as HTMLInputElement).value = "20";
    expect(validateStudioForm(root)).toBe("Surface gradient tint must be between 0 and 15%.");

    (root.querySelector("#gradientTint") as HTMLInputElement).value = "5";
    (root.querySelector("#lift") as HTMLInputElement).value = "12";
    expect(validateStudioForm(root)).toBe("Elevation lift must be between 0 and 8 px.");

    root.remove();
  });
});
