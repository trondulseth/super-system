/**
 * @vitest-environment happy-dom
 */
import { act, createRef, type HTMLAttributes, type ReactElement, type SVGProps } from "react";
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
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Icon,
  Label,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeProvider,
  Toast,
  ToastProvider,
  Tooltip,
  useToast
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
  act(() => {
    document.body.innerHTML = "";
  });
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

  it("does not toggle disabled accordion items", () => {
    const container = render(
      <Accordion type="single">
        <AccordionItem value="open">
          <AccordionTrigger>Open</AccordionTrigger>
          <AccordionContent>Open content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="locked" disabled>
          <AccordionTrigger>Locked</AccordionTrigger>
          <AccordionContent>Locked content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const triggers = container.querySelectorAll(".ss-accordion__trigger");
    expect(triggers[1]?.hasAttribute("disabled")).toBe(true);
    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("false");

    act(() => {
      triggers[1]?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(triggers[1]?.getAttribute("aria-expanded")).toBe("false");
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
    expect(container.querySelector(".ss-breadcrumb__page")?.getAttribute("role")).toBeNull();
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
    expect(container.querySelector(".ss-pagination__ellipsis")?.getAttribute("aria-hidden")).toBeNull();
  });
});

describe("Dialog", () => {
  it("renders a modal dialog in a portal with dialog semantics", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogBody>All data will be removed.</DialogBody>
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(document.body.querySelector(".ss-dialog__title")?.textContent).toBe("Delete account");
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(
      <Dialog>
        <DialogTrigger>
          <Button variant="secondary">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Update your preferences.</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    const trigger = document.querySelector("button") as HTMLButtonElement;
    act(() => {
      trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("omits aria-labelledby and aria-describedby when title and description are absent", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogBody>Confirm your changes.</DialogBody>
        </DialogContent>
      </Dialog>
    );

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute("aria-labelledby")).toBeNull();
    expect(dialog?.getAttribute("aria-describedby")).toBeNull();
  });

  it("sets aria-labelledby when only a title is provided", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Quick note</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const dialog = document.body.querySelector('[role="dialog"]') as HTMLElement;
    const title = document.body.querySelector(".ss-dialog__title") as HTMLElement;
    expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
    expect(dialog.getAttribute("aria-describedby")).toBeNull();
  });
});

describe("Drawer", () => {
  it("renders a modal drawer panel in a portal", () => {
    render(
      <Drawer defaultOpen side="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Refine the current view.</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>Filter controls go here.</DrawerBody>
        </DrawerContent>
      </Drawer>
    );

    const drawer = document.body.querySelector(".ss-drawer__content--right");
    expect(drawer?.getAttribute("role")).toBe("dialog");
    expect(drawer?.getAttribute("aria-modal")).toBe("true");
  });

  it("omits aria-labelledby when drawer title is absent", () => {
    render(
      <Drawer defaultOpen side="left">
        <DrawerContent>
          <DrawerBody>Panel content</DrawerBody>
        </DrawerContent>
      </Drawer>
    );

    const drawer = document.body.querySelector(".ss-drawer__content--left");
    expect(drawer?.getAttribute("aria-labelledby")).toBeNull();
    expect(drawer?.getAttribute("aria-describedby")).toBeNull();
  });
});

describe("Popover", () => {
  it("opens from a trigger and closes on Escape", () => {
    render(
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost">Details</Button>
        </PopoverTrigger>
        <PopoverContent>Additional context for this item.</PopoverContent>
      </Popover>
    );

    const trigger = document.querySelector("button") as HTMLButtonElement;
    act(() => {
      trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.querySelector(".ss-popover__content")).not.toBeNull();

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(document.body.querySelector(".ss-popover__content")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("positions top popovers above the trigger", () => {
    const rect = {
      top: 120,
      bottom: 160,
      left: 40,
      right: 140,
      width: 100,
      height: 40,
      x: 40,
      y: 120,
      toJSON: () => ({})
    };

    render(
      <Popover>
        <PopoverTrigger>
          <Button variant="ghost">Details</Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="center">
          Above the trigger
        </PopoverContent>
      </Popover>
    );

    const trigger = document.querySelector("button") as HTMLButtonElement;
    trigger.getBoundingClientRect = () => rect as DOMRect;

    act(() => {
      trigger.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const content = document.body.querySelector(".ss-popover__content") as HTMLElement;
    expect(content).not.toBeNull();
    expect(content.style.transform).toBe("translate(-50%, -100%)");
    expect(content.style.top).toBe("112px");
  });
});

describe("Toast", () => {
  it("publishes toasts through ToastProvider", () => {
    function Demo() {
      const { toast } = useToast();
      return (
        <Button variant="secondary" onClick={() => toast({ title: "Saved", description: "Changes stored." })}>
          Notify
        </Button>
      );
    }

    render(
      <ToastProvider duration={10000}>
        <Demo />
      </ToastProvider>
    );

    act(() => {
      document.querySelector("button")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const toast = document.body.querySelector(".ss-toast");
    expect(toast?.getAttribute("role")).toBe("status");
    expect(toast?.textContent).toContain("Saved");
  });

  it("renders destructive toasts with alert semantics", () => {
    render(<Toast variant="destructive" title="Payment failed" description="Try again." />);
    expect(document.querySelector(".ss-toast--destructive")?.getAttribute("role")).toBe("alert");
  });
});

describe("Table", () => {
  it("preserves native table semantics inside a scroll wrapper", () => {
    const container = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    expect(container.querySelector(".ss-table-wrap")).not.toBeNull();
    expect(container.querySelector("table")).not.toBeNull();
    expect(container.querySelectorAll('th[scope="col"]').length).toBe(2);
    expect(container.querySelector("td")?.textContent).toBe("Ada");
  });
});

function PlusGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

describe("Icon", () => {
  it("marks decorative svg icons as hidden from assistive technology", () => {
    const container = render(
      <Icon decorative size="md">
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Icon>
    );

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.classList.contains("ss-icon--md")).toBe(true);
  });

  it("exposes a label for meaningful standalone svg icons", () => {
    const container = render(
      <Icon label="Add item" size="lg">
        <svg viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Icon>
    );

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Add item");
    expect(svg?.classList.contains("ss-icon--lg")).toBe(true);
  });

  it("normalizes compatible icon components inside the icon shell", () => {
    const container = render(
      <Icon decorative size="md">
        <PlusGlyph />
      </Icon>
    );

    const icon = container.querySelector(".ss-icon");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.classList.contains("ss-icon--md")).toBe(true);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("supports icon-only buttons when the control owns the accessible name", () => {
    const container = render(
      <Button aria-label="Add item" variant="secondary">
        <Icon decorative size="sm">
          <PlusGlyph />
        </Icon>
      </Button>
    );

    const button = container.querySelector("button");
    expect(button?.getAttribute("aria-label")).toBe("Add item");
    expect(button?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("wraps compatible non-svg icon components in a normalized shell", () => {
    function CustomIcon(props: HTMLAttributes<HTMLSpanElement>) {
      return (
        <span data-testid="custom-glyph" {...props}>
          ★
        </span>
      );
    }

    const container = render(
      <Icon label="Favorite" size="md">
        <CustomIcon />
      </Icon>
    );

    expect(container.querySelector(".ss-icon")?.getAttribute("role")).toBe("img");
    expect(container.querySelector(".ss-icon")?.getAttribute("aria-label")).toBe("Favorite");
    expect(container.querySelector("[data-testid='custom-glyph']")?.getAttribute("aria-hidden")).toBe("true");
  });
});
