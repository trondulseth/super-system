/**
 * @vitest-environment happy-dom
 */
import { act, createRef, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Textarea,
  ThemeProvider,
  Tooltip
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
  document.documentElement.removeAttribute("data-theme");
  window.localStorage.clear();
});

describe("Spinner", () => {
  it("exposes status semantics when standalone", () => {
    const container = render(<Spinner label="Saving changes" />);
    const spinner = container.querySelector('[role="status"]');

    expect(spinner?.className).toContain("ss-spinner--md");
    expect(spinner?.getAttribute("aria-label")).toBe("Saving changes");
  });

  it("can be hidden from assistive technology when decorative", () => {
    const container = render(<Spinner aria-hidden />);
    expect(container.querySelector('[role="status"]')).toBeNull();
    expect(container.querySelector(".ss-spinner")).not.toBeNull();
  });
});

describe("Skeleton", () => {
  it("renders shape variants", () => {
    const container = render(
      <>
        <Skeleton variant="block" />
        <Skeleton variant="circle" />
        <Skeleton variant="text" lines={3} />
      </>
    );

    expect(container.querySelector(".ss-skeleton--block")).not.toBeNull();
    expect(container.querySelector(".ss-skeleton--circle")).not.toBeNull();
    expect(container.querySelectorAll(".ss-skeleton--text")).toHaveLength(3);
  });
});

describe("Tooltip", () => {
  it("links tooltip content on focus", () => {
    const container = render(
      <Tooltip content="Helpful text">
        <Button variant="secondary">Help</Button>
      </Tooltip>
    );

    const button = container.querySelector("button");
    act(() => {
      button?.focus();
    });

    expect(button?.getAttribute("aria-describedby")).toBeTruthy();
    expect(container.querySelector('[role="tooltip"]')?.textContent).toBe("Helpful text");
  });

  it("merges aria-describedby with existing trigger ids when open", () => {
    const container = render(
      <Tooltip content="Helpful text">
        <Button variant="secondary" aria-describedby="existing-id">
          Help
        </Button>
      </Tooltip>
    );

    const button = container.querySelector("button");
    act(() => {
      button?.focus();
    });

    const describedBy = button?.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain("existing-id");
    expect(describedBy.split(/\s+/).filter(Boolean)).toHaveLength(2);
  });
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

  it("applies disabled styling and native disabled state", () => {
    const container = render(<Checkbox disabled />);
    const field = container.querySelector('input[type="checkbox"]');

    expect(field?.disabled).toBe(true);
    expect(field?.className).toContain("ss-checkbox");
  });

  it("renders an inline label wrapper when label prop is set", () => {
    const container = render(<Checkbox label="Accept terms" />);

    expect(container.querySelector("label.ss-label--inline")).not.toBeNull();
    expect(container.querySelector('input[type="checkbox"]')).not.toBeNull();
    expect(container.textContent).toContain("Accept terms");
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

  it("renders an inline label wrapper when label prop is set", () => {
    const container = render(<Switch label="Enable notifications" defaultChecked />);

    expect(container.querySelector("label.ss-label--inline")).not.toBeNull();
    expect(container.querySelector('input[role="switch"]')).not.toBeNull();
    expect(container.textContent).toContain("Enable notifications");
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

  it("defaults informational variants to status semantics", () => {
    const container = render(
      <>
        <Alert title="Workspace created">Invite teammates when ready.</Alert>
        <Alert variant="primary" title="Invite sent">
          Your teammate can join.
        </Alert>
      </>
    );

    expect(container.querySelectorAll('[role="status"]')).toHaveLength(2);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it("allows liveRegion override", () => {
    const container = render(
      <Alert variant="primary" liveRegion="alert" title="Critical notice">
        Immediate attention required.
      </Alert>
    );

    expect(container.querySelector('[role="alert"]')).not.toBeNull();
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

  it("propagates required to a wrapped control", () => {
    const container = render(
      <Label required>
        Email address
        <Input type="email" />
      </Label>
    );

    const field = container.querySelector("input");
    expect(field?.required).toBe(true);
    expect(field?.getAttribute("aria-required")).toBe("true");
  });

  it("propagates disabled to a wrapped control", () => {
    const container = render(
      <Label disabled>
        Unavailable field
        <Input type="text" />
      </Label>
    );

    expect(container.querySelector("input")?.disabled).toBe(true);
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

  it("applies disabled styling and native disabled state", () => {
    const container = render(<Textarea disabled defaultValue="Read only" />);
    const field = container.querySelector("textarea");

    expect(field?.disabled).toBe(true);
    expect(field?.className).toContain("ss-textarea");
  });
});

describe("Input", () => {
  it("marks invalid state for assistive technology", () => {
    const container = render(<Input invalid defaultValue="Bad value" />);
    const field = container.querySelector("input");

    expect(field?.className).toContain("ss-input--invalid");
    expect(field?.getAttribute("aria-invalid")).toBe("true");
  });

  it("applies disabled styling and native disabled state", () => {
    const container = render(<Input disabled defaultValue="Read only" />);
    const field = container.querySelector("input");

    expect(field?.disabled).toBe(true);
    expect(field?.className).toContain("ss-input");
  });
});

describe("Card", () => {
  it("renders composable card parts", () => {
    const container = render(
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardBody>Manage your profile settings.</CardBody>
        <CardFooter>
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
    );

    expect(container.querySelector(".ss-card__header")).not.toBeNull();
    expect(container.querySelector(".ss-card__title")?.textContent).toBe("Account");
    expect(container.querySelector(".ss-card__body")?.textContent).toContain("profile settings");
    expect(container.querySelector(".ss-card__footer")).not.toBeNull();
  });
});

describe("ThemeProvider", () => {
  it("uses defaultMode when persistence is disabled", () => {
    render(
      <ThemeProvider defaultMode="dark" enablePersistence={false}>
        <span>App</span>
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("reads stored preference when persistence is enabled", () => {
    window.localStorage.setItem("super-system-theme", "dark");

    render(
      <ThemeProvider defaultMode="light" enablePersistence>
        <span>App</span>
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("clears data-theme for system mode and responds to preference changes", () => {
    render(
      <ThemeProvider defaultMode="system" enablePersistence={false}>
        <span>App</span>
      </ThemeProvider>
    );

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);

    act(() => {
      window.matchMedia("(prefers-color-scheme: dark)").dispatchEvent(new Event("change"));
    });

    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});
