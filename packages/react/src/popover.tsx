import * as React from "react";
import {
  OverlayPortal,
  useDismissOnOutsideClick,
  useEscapeToClose,
  useFloatingPosition
} from "./overlay-utils.js";
import { classes, composeRefs, mergeHandlers } from "./utils.js";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string): PopoverContextValue {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error(`${component} must be used within Popover.`);
  }
  return context;
}

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Popover({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const contentId = React.useId();
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

  useDismissOnOutsideClick(open, [contentRef, triggerRef], () => setOpen(false));
  useEscapeToClose(open, () => setOpen(false), triggerRef);

  return (
    <PopoverContext.Provider value={{ open, setOpen, contentId, triggerRef, contentRef }}>
      <span className="ss-popover">{children}</span>
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps {
  children: React.ReactElement;
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { open, setOpen, contentId, triggerRef } = usePopoverContext("PopoverTrigger");
  const child = React.Children.only(children);
  const childProps = child.props as React.HTMLAttributes<HTMLElement>;
  const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;

  return React.cloneElement(child, {
    ...childProps,
    ref: composeRefs(childRef, triggerRef),
    "aria-expanded": open,
    "aria-controls": open ? contentId : undefined,
    onClick: mergeHandlers(childProps.onClick, () => setOpen(!open)),
    onKeyDown: mergeHandlers(childProps.onKeyDown, (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(!open);
      }
    })
  } as React.HTMLAttributes<HTMLElement>);
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
}

export function PopoverContent({
  align = "center",
  side = "bottom",
  className,
  children,
  ...props
}: PopoverContentProps) {
  const { open, contentId, triggerRef, contentRef } = usePopoverContext("PopoverContent");
  const position = useFloatingPosition(open, triggerRef, { side, align });

  if (!open || !position) return null;

  return (
    <OverlayPortal>
      <div
        ref={contentRef}
        id={contentId}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          transform: position.transform
        }}
        className={classes(
          "ss-popover__content",
          `ss-popover__content--${side}`,
          `ss-popover__content--${align}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    </OverlayPortal>
  );
}

export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose({ className, onClick, ...props }, ref) {
    const { setOpen } = usePopoverContext("PopoverClose");

    return (
      <button
        ref={ref}
        type="button"
        className={classes("ss-popover__close", className)}
        onClick={mergeHandlers(onClick, () => setOpen(false))}
        {...props}
      />
    );
  }
);
PopoverClose.displayName = "PopoverClose";
