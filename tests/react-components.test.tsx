/**
 * @vitest-environment happy-dom
 */
import { act, createRef, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Input, Label, Textarea } from "../packages/react/src/index.js";

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
