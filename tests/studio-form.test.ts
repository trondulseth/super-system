/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from "vitest";
import { defaultTheme } from "../packages/tokens/src/index.js";
import {
  applyConfigToForm,
  readConfigFromForm,
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
    <input id="fontSans" value="Inter" />
    <input id="fontMono" value="monospace" />
    <input id="baseSize" value="16px" />
    <input id="lineHeight" type="number" value="1.5" />
    <input id="radiusSm" value="6px" />
    <input id="radiusMd" value="10px" />
    <input id="radiusLg" value="14px" />
    <input id="radiusFull" value="9999px" />
    <input id="spacingUnit" type="number" value="4" />
    <select id="density"><option>comfortable</option></select>
    <select id="icons"><option>lucide</option></select>
    <select id="contrast"><option>AA</option></select>
    <input id="target" type="number" value="44" />
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
});
