import * as React from "react";
import { classes, mergeHandlers } from "./utils.js";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  menuId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(component: string): DropdownMenuContextValue {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(`${component} must be used within DropdownMenu.`);
  }
  return context;
}

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const menuId = React.useId();
  const triggerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const open = openProp ?? uncontrolledOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [onOpenChange, openProp]
  );

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (contentRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, setOpen]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, menuId, triggerRef, contentRef }}>
      <div className="ss-dropdown">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps {
  children: React.ReactElement;
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { open, setOpen, menuId, triggerRef } = useDropdownMenuContext("DropdownMenuTrigger");
  const child = React.Children.only(children);
  const childProps = child.props as React.HTMLAttributes<HTMLElement>;

  return React.cloneElement(child, {
    ...childProps,
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof childRef === "function") childRef(node);
      else if (childRef && typeof childRef === "object") {
        (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
    onClick: mergeHandlers(childProps.onClick, () => setOpen(!open)),
    onKeyDown: mergeHandlers(childProps.onKeyDown, (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
      }
    })
  } as React.HTMLAttributes<HTMLElement>);
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end";
}

export function DropdownMenuContent({
  align = "start",
  className,
  children,
  onKeyDown,
  ...props
}: DropdownMenuContentProps) {
  const { open, setOpen, menuId, triggerRef, contentRef } = useDropdownMenuContext("DropdownMenuContent");

  React.useEffect(() => {
    if (!open) return;
    const firstItem = contentRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
    firstItem?.focus();
  }, [contentRef, open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const items = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []
    );
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
      items[next]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
      items[next]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      id={menuId}
      role="menu"
      tabIndex={-1}
      className={classes("ss-dropdown__content", `ss-dropdown__content--${align}`, className)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ inset, className, disabled, onClick, ...props }, ref) {
    const { setOpen } = useDropdownMenuContext("DropdownMenuItem");

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        tabIndex={-1}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={classes("ss-dropdown__item", inset && "ss-dropdown__item--inset", className)}
        onClick={mergeHandlers(onClick, (event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          setOpen(false);
        })}
        {...props}
      />
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";
