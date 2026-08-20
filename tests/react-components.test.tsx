/**
 * @vitest-environment happy-dom
 */
import { act, createRef, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import {
  Alert,
  Checkbox,
  Input,
  Label,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Textarea
} from "../packages/react/src/index.js";

function render(element: ReactElement): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(element);
  });
  return container;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Checkbox", () => {
  it("forwards refs and native checkbox attributes", () => {
    const ref = createRef<HTMLInputElement>();
    const container = render(<Checkbox ref={ref} defaultChecked />);
    const field = container.querySelector('input[type="checkbox"]');

    expect(field).not.toBeNull();
    expect(ref.current).toBe(field);
    expect(field?.checked).toBe(true);
    expect(field?.className).toContain("ss-checkbox");
  });
});

describe("Radio group", () => {
  it("renders a fieldset with labeled radio options", () => {
    const container = render(
      <RadioGroup label="Plan">
        <Radio name="plan" value="starter" label="Starter" defaultChecked />
        <Radio name="plan" value="pro" label="Pro" />
      </RadioGroup>
    );

    expect(container.querySelector("fieldset.ss-radio-group")).not.toBeNull();
    expect(container.querySelector("legend")?.textContent).toBe("Plan");
    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(2);
    expect(container.querySelector('input[value="starter"]')?.checked).toBe(true);
  });
});

describe("Switch", () => {
  it("uses switch semantics", () => {
    const container = render(<Switch defaultChecked />);
    const field = container.querySelector('input[role="switch"]');

    expect(field?.className).toContain("ss-switch");
    expect(field?.checked).toBe(true);
  });
});

describe("Select", () => {
  it("forwards refs and renders options", () => {
    const ref = createRef<HTMLSelectElement>();
    const container = render(
      <Select ref={ref} defaultValue="pro">
        <option value="starter">Starter</option>
        <option value="pro">Pro</option>
      </Select>
    );

    const field = container.querySelector("select");
    expect(ref.current).toBe(field);
    expect(field?.value).toBe("pro");
    expect(field?.className).toContain("ss-select");
  });
});

describe("Alert", () => {
  it("renders alert semantics and variants", () => {
    const container = render(
      <Alert variant="destructive" title="Payment failed">
        Update billing details.
      </Alert>
    );

    const alert = container.querySelector('[role="alert"]');
    expect(alert?.className).toContain("ss-alert--destructive");
    expect(alert?.querySelector(".ss-alert__title")?.textContent).toBe("Payment failed");
    expect(alert?.textContent).toContain("Update billing details.");
  });
});

describe("Label", () => {
  it("forwards refs and associates with controls", () => {
    const ref = createRef<HTMLLabelElement>();
    const container = render(
      <Label ref={ref} htmlFor="email">
        Email address
      </Label>
    );

    const label = container.querySelector("label");
    expect(label).not.toBeNull();
    expect(ref.current).toBe(label);
    expect(label?.htmlFor).toBe("email");
    expect(label?.className).toContain("ss-label");
    expect(label?.textContent).toBe("Email address");
  });

  it("shows required and disabled states", () => {
    const container = render(
      <Label required disabled>
        Full name
      </Label>
    );
    const label = container.querySelector("label");

    expect(label?.className).toContain("ss-label--disabled");
    expect(label?.querySelector(".ss-label__required")?.textContent).toContain("*");
  });
});

describe("Textarea", () => {
  it("forwards refs and native textarea attributes", () => {
    const ref = createRef<HTMLTextAreaElement>();
    const container = render(
      <Textarea ref={ref} rows={5} placeholder="Bio" defaultValue="Hello" />
    );

    const field = container.querySelector("textarea");
    expect(field).not.toBeNull();
    expect(ref.current).toBe(field);
    expect(field?.getAttribute("rows")).toBe("5");
    expect(field?.placeholder).toBe("Bio");
    expect(field?.value).toBe("Hello");
    expect(field?.className).toContain("ss-textarea");
  });

  it("marks invalid state for assistive technology", () => {
    const container = render(<Textarea invalid defaultValue="Too short" />);
    const field = container.querySelector("textarea");

    expect(field?.className).toContain("ss-textarea--invalid");
    expect(field?.getAttribute("aria-invalid")).toBe("true");
  });
});

describe("Input", () => {
  it("marks invalid state for assistive technology", () => {
    const container = render(<Input invalid defaultValue="Bad value" />);
    const field = container.querySelector("input");

    expect(field?.className).toContain("ss-input--invalid");
    expect(field?.getAttribute("aria-invalid")).toBe("true");
  });
});
