# Components

[← Documentation](./README.md) · [Getting started](./getting-started.md) · [Theme](./theme.md) · [Audit & accessibility](./audit-and-accessibility.md)

## React components (Batch 1–3)

The beta ships **83 exports** from `@super-system/react`: Batch 1–3 components plus the normalized `Icon` wrapper for SVG and compatible icon libraries.

Each component is token-driven, supports light and dark themes, and includes copy-ready examples below.

### Button

```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Learn more</Button>
<Button loading>Saving</Button>
```

- Button variants: `primary`, `secondary`, `destructive`, `ghost`
- Button sizes: `sm`, `md`, `lg`

### Input

```tsx
<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" />

<Label htmlFor="email-error" required>
  Email address
</Label>
<Input id="email-error" type="email" invalid aria-describedby="email-error-message" />
```

`Input` forwards normal HTML input properties and applies `aria-invalid` when `invalid` is true.

### Label

Field labels use **font-weight 600** (`Label`, `RadioGroup` legends). Inline option labels such as `Radio` option text use **font-weight 400** so grouped choices read as secondary to the field label.

**Wrapping pattern** — `required` and `disabled` propagate to a single wrapped control:

```tsx
<Label required>
  Email address
  <Input type="email" />
</Label>

<Label disabled>
  Unavailable field
  <Input type="text" />
</Label>
```

When a wrapping label sets `required`, the child receives `required` and `aria-required="true"`. When it sets `disabled`, the child receives `disabled`.

**`htmlFor` pattern** — set native attributes on the associated control yourself:

```tsx
<Label htmlFor="name" required>
  Full name
</Label>
<Input id="name" required aria-required="true" />

<Label htmlFor="legacy" disabled>
  Unavailable field
</Label>
<Input id="legacy" disabled />
```

`Label` forwards native label attributes and supports `required` and `disabled` visual states. Wrap a control to stack the label above it:

```tsx
<Label>
  Email address
  <Input type="email" />
</Label>
```

### Textarea

```tsx
<Textarea rows={4} placeholder="Tell us about yourself" />
<Textarea invalid aria-describedby="bio-error" />
```

`Textarea` mirrors `Input`: it forwards native textarea properties, supports ref forwarding, and applies `aria-invalid` when `invalid` is true.

### Checkbox

```tsx
<Checkbox label="Email me product updates" defaultChecked />
<Checkbox invalid aria-describedby="terms-error" />

<Label inline>
  <Checkbox defaultChecked />
  Email me product updates
</Label>
```

When `label` is provided, `Checkbox` renders an inline label wrapper and `className` applies to that wrapper. Without `label`, `className` applies to the input.

### Radio group

```tsx
<RadioGroup label="Plan">
  <Radio name="plan" value="starter" label="Starter" defaultChecked />
  <Radio name="plan" value="pro" label="Pro" />
</RadioGroup>
```

`RadioGroup` renders a semantic fieldset. Each `Radio` associates its visible label with the native radio input.

### Switch

```tsx
<Switch label="Enable notifications" defaultChecked />
<Switch invalid aria-describedby="switch-error" />

<Label inline>
  <Switch defaultChecked />
  Enable notifications
</Label>
```

`Switch` uses the native checkbox with `role="switch"`. The `label` prop and `className` placement follow the same rules as `Checkbox`.

### Slider

```tsx
<Slider label="Volume" min={0} max={100} defaultValue={60} />
<Slider invalid min={0} max={100} defaultValue={75} aria-describedby="brightness-error" />

<Label>
  Brightness
  <Slider min={0} max={100} defaultValue={40} />
</Label>
```

`Slider` wraps the native `input type="range"`. It forwards refs and range attributes (`min`, `max`, `step`, `value`, `defaultValue`). Super System Studio uses the same `.ss-slider` styles for theme tuning controls.

### Select

```tsx
<Label htmlFor="country">Country</Label>
<Select id="country" defaultValue="no">
  <option value="no">Norway</option>
  <option value="se">Sweden</option>
</Select>
<Select invalid aria-describedby="country-error">
  <option value="">Choose a role</option>
</Select>
```

### Alert

```tsx
<Alert title="Workspace created">Invite teammates when you are ready.</Alert>
<Alert variant="primary" title="Invite sent">
  Your teammate can now join the workspace.
</Alert>
<Alert variant="destructive" title="Payment failed">
  Update your billing details to keep access.
</Alert>
```

`Alert` defaults to `role="status"` for neutral and primary variants, and `role="alert"` for destructive messages. Override with `liveRegion`:

```tsx
<Alert variant="primary" liveRegion="alert" title="Critical notice">
  This upgrade requires immediate attention.
</Alert>
```

### Spinner

```tsx
<Spinner />
<Spinner size="lg" label="Saving changes" />
<Button loading>Saving</Button>
```

Use `aria-hidden` when the spinner is decorative inside a control that already communicates status.

### Skeleton

```tsx
<Skeleton variant="block" />
<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" />
```

Skeleton placeholders are marked `aria-hidden` because surrounding content should communicate loading state.

### Tooltip

```tsx
<Tooltip content="Use semantic tokens instead of hard-coded colors.">
  <Button variant="secondary">Help</Button>
</Tooltip>
```

Tooltip content appears on hover and focus, merges with any existing `aria-describedby` ids on the trigger, and closes on Escape. Tooltips render inline without a portal, so they may clip inside overflow containers. Use the optional `display` prop (`inline`, `inline-flex`, or `block`) when the wrapper affects layout.

**Disabled triggers** — native disabled buttons do not receive pointer or keyboard events. Wrap them in a focusable container so the tooltip still opens:

```tsx
<Tooltip content="Sync unavailable while offline">
  <Button disabled>Sync</Button>
</Tooltip>
```

The library detects `disabled` or `aria-disabled` on the trigger and applies this wrapper automatically.

### Badge

```tsx
<Badge variant="neutral">Draft</Badge>
<Badge variant="primary">Active</Badge>
<Badge variant="destructive">Blocked</Badge>
```

### Card

```tsx
<Card>Any React content can go here.</Card>

<Card>
  <CardHeader>
    <CardTitle>Account</CardTitle>
  </CardHeader>
  <CardBody>Manage your profile settings.</CardBody>
  <CardFooter>
    <Button size="sm">Save</Button>
  </CardFooter>
</Card>
```

`Card` provides the shared surface, border, and radius. Bare cards keep padding; composable `CardHeader`, `CardTitle`, `CardBody`, and `CardFooter` parts handle structured layouts.

### Tabs

```tsx
<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">Profile settings</TabsContent>
  <TabsContent value="billing">Billing settings</TabsContent>
</Tabs>
```

Tabs follow the WAI-ARIA tabs pattern: roving `tabIndex`, arrow-key focus movement within `TabsList`, and `aria-selected` / `aria-controls` wiring between triggers and panels. Use controlled `value` / `onValueChange` when you need external state.

### Accordion

```tsx
<Accordion type="single" defaultValue="account" collapsible>
  <AccordionItem value="account">
    <AccordionTrigger>Account</AccordionTrigger>
    <AccordionContent>Update your email and password.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="notifications">
    <AccordionTrigger>Notifications</AccordionTrigger>
    <AccordionContent>Choose which alerts you receive.</AccordionContent>
  </AccordionItem>
</Accordion>
```

Set `type="multiple"` to allow more than one section open. Triggers expose `aria-expanded` and toggle their linked region on click.

### Breadcrumb

```tsx
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
```

The root `Breadcrumb` renders a `nav` with `aria-label="Breadcrumb"`. Use `BreadcrumbPage` for the current page (`aria-current="page"`).

### Dropdown menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="secondary">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

The menu opens on trigger click, supports arrow-key navigation and Escape to close, and returns focus to the trigger. Like `Tooltip`, content renders inline without a portal and may clip inside overflow containers.

### Pagination

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

Use `isActive` on `PaginationLink` to mark the current page (`aria-current="page"`). Previous and next links include accessible labels.

### Dialog

```tsx
<Dialog>
  <DialogTrigger>
    <Button variant="destructive">Delete account</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete account</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogBody>All project data will be permanently removed.</DialogBody>
    <DialogFooter>
      <Button variant="secondary">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Dialog content renders in a portal with `role="dialog"`, `aria-modal="true"`, focus trap, body scroll lock, Escape to close, and focus restored to the trigger.

### Drawer

```tsx
<Drawer side="right">
  <DrawerTrigger>
    <Button variant="secondary">Filters</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Filters</DrawerTitle>
      <DrawerDescription>Refine the current view.</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>{/* filter controls */}</DrawerBody>
  </DrawerContent>
</Drawer>
```

Drawers share modal overlay behaviour with dialogs and support `left`, `right`, or `bottom` placement.

### Popover

```tsx
<Popover>
  <PopoverTrigger>
    <Button variant="ghost">Details</Button>
  </PopoverTrigger>
  <PopoverContent align="center" side="bottom">
    Additional context for this item.
  </PopoverContent>
</Popover>
```

Popovers render in a portal, close on outside click or Escape, and return focus to the trigger. They are non-modal (`aria-modal="false"`).

### Toast

```tsx
<ToastProvider>
  <App />
</ToastProvider>

// Inside App:
const { toast } = useToast();
toast({ title: "Saved", description: "Your changes were stored." });
```

`ToastProvider` renders a fixed viewport in a portal. Destructive toasts use `role="alert"`; other variants default to `role="status"`. Toasts auto-dismiss after the configured duration.

### Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

`Table` wraps a native `<table>` in a horizontally scrollable container for responsive layouts while preserving header and cell semantics.

### Icon

```tsx
import { Plus } from "lucide-react";
import { Button, Icon } from "@super-system/react";

<Button aria-label="Add item" variant="secondary">
  <Icon decorative size="sm">
    <Plus />
  </Icon>
</Button>

<Icon label="Favorite" size="lg">
  <Heart />
</Icon>
```

Install your configured library with `npx @super-system/cli icons setup` (add `--install` to run npm install in the current project). Use `decorative` when a visible label or `aria-label` on the owning control already names the action. Use `label` when the icon communicates meaning on its own. The wrapper normalizes size (`sm`, `md`, `lg`), alignment, and `currentColor` stroke treatment for SVG children.
