/**
 * @vitest-environment happy-dom
 */
import { act, createRef, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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

describe("Button", () => {
  it("forwards refs to the native button element", () => {
    const ref = createRef<HTMLButtonElement>();
    const container = render(<Button ref={ref}>Save</Button>);

    const button = container.querySelector("button");
    expect(ref.current).toBe(button);
    expect(button?.textContent).toContain("Save");
  });

  it("communicates loading state and prevents duplicate activation", () => {
    const container = render(
      <Button loading variant="primary">
        Saving
      </Button>
    );

    const button = container.querySelector("button");
    expect(button?.getAttribute("aria-busy")).toBe("true");
    expect(button?.disabled).toBe(true);
    expect(container.querySelector(".ss-spinner")).not.toBeNull();
  });
});

describe("Badge", () => {
  it("renders documented variants", () => {
    const container = render(
      <>
        <Badge variant="neutral">Draft</Badge>
        <Badge variant="primary">Active</Badge>
        <Badge variant="destructive">Blocked</Badge>
      </>
    );

    expect(container.querySelector(".ss-badge--neutral")?.textContent).toBe("Draft");
    expect(container.querySelector(".ss-badge--primary")?.textContent).toBe("Active");
    expect(container.querySelector(".ss-badge--destructive")?.textContent).toBe("Blocked");
  });
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

  it("applies invalid styling class for background tint", () => {
    const container = render(<Textarea invalid defaultValue="Too short" />);
    expect(container.querySelector(".ss-textarea--invalid")).not.toBeNull();
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

  it("applies invalid styling class for background tint", () => {
    const container = render(<Input invalid defaultValue="Bad value" />);
    expect(container.querySelector(".ss-input--invalid")).not.toBeNull();
  });

  it("applies disabled styling and native disabled state", () => {
    const container = render(<Input disabled defaultValue="Read only" />);
    const field = container.querySelector("input");

    expect(field?.disabled).toBe(true);
    expect(field?.className).toContain("ss-input");
  });
});

describe("Card", () => {
  it("renders a bare card surface", () => {
    const container = render(<Card>Simple content</Card>);
    const card = container.querySelector(".ss-card");

    expect(card).not.toBeNull();
    expect(card?.textContent).toBe("Simple content");
  });

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

  it("ignores stored preferences when persistence is disabled", () => {
    window.localStorage.setItem("super-system-theme", "dark");

    render(
      <ThemeProvider defaultMode="light" enablePersistence={false}>
        <span>App</span>
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("supports the deprecated mode alias as defaultMode", () => {
    render(
      <ThemeProvider mode="dark" enablePersistence={false}>
        <span>App</span>
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});

describe("Tabs", () => {
  it("activates panels and exposes tab semantics", () => {
    const container = render(
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">Profile content</TabsContent>
        <TabsContent value="billing">Billing content</TabsContent>
      </Tabs>
    );

    const profileTrigger = container.querySelector('[role="tab"][aria-selected="true"]');
    expect(profileTrigger?.textContent).toBe("Profile");
    expect(container.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toBe(
      "Profile content"
    );

    act(() => {
      container.querySelectorAll('[role="tab"]')[1]?.dispatchEvent(
        new MouseEvent("click", { bubbles: true })
      );
    });

    expect(container.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toBe(
      "Billing"
    );
    expect(container.querySelector('[role="tabpanel"]:not([hidden])')?.textContent).toBe(
      "Billing content"
    );
  });

  it("moves focus between triggers with arrow keys", () => {
    const container = render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">One</TabsContent>
        <TabsContent value="two">Two</TabsContent>
      </Tabs>
    );

    const tablist = container.querySelector('[role="tablist"]') as HTMLElement;
    const triggers = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    triggers[0]?.focus();

    act(() => {
      tablist.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });

    expect(document.activeElement).toBe(triggers[1]);
  });
});

describe("Accordion", () => {
  it("toggles single sections with aria-expanded", () => {
    const container = render(
      <Accordion type="single" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section one</AccordionTrigger>
          <AccordionContent>First panel</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section two</AccordionTrigger>
          <AccordionContent>Second panel</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const triggers = container.querySelectorAll(".ss-accordion__trigger");
    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("false");

    act(() => {
      triggers[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("true");
  });

  it("allows multiple open sections in multiple mode", () => {
    const container = render(
      <Accordion type="multiple" defaultValue={["a"]}>
        <AccordionItem value="a">
          <AccordionTrigger>A</AccordionTrigger>
          <AccordionContent>A content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>B</AccordionTrigger>
          <AccordionContent>B content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const triggers = container.querySelectorAll(".ss-accordion__trigger");

    act(() => {
      triggers[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(triggers[0]?.getAttribute("aria-expanded")).toBe("true");
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("Breadcrumb", () => {
  it("renders breadcrumb navigation semantics", () => {
    const container = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(container.querySelector('nav[aria-label="Breadcrumb"]')).not.toBeNull();
    expect(container.querySelector(".ss-breadcrumb__page")?.getAttribute("aria-current")).toBe(
      "page"
    );
  });
});

describe("DropdownMenu", () => {
  it("opens on trigger click and closes on Escape", () => {
    const container = render(
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="secondary">Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = container.querySelector("button") as HTMLButtonElement;
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector('[role="menu"]')).toBeNull();

    act(() => {
      trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelectorAll('[role="menuitem"]').length).toBe(2);

    const menu = container.querySelector('[role="menu"]') as HTMLElement;
    act(() => {
      menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector('[role="menu"]')).toBeNull();
  });
});

describe("Pagination", () => {
  it("marks the active page and exposes pagination navigation", () => {
    const container = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(container.querySelector('nav[aria-label="Pagination"]')).not.toBeNull();
    expect(container.querySelector(".ss-pagination__link--active")?.getAttribute("aria-current")).toBe(
      "page"
    );
    expect(container.querySelector(".ss-pagination__ellipsis")?.textContent).toContain("More pages");
  });
});
