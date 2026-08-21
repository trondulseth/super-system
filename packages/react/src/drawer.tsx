import * as React from "react";
import { OverlayPortal, useBackgroundInert, useBodyScrollLock, useFocusTrap } from "./overlay-utils.js";
import { classes, composeRefs, mergeHandlers } from "./utils.js";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: "left" | "right" | "bottom";
  contentId: string;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  registerTitle: () => void;
  unregisterTitle: () => void;
  registerDescription: () => void;
  unregisterDescription: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawerContext(component: string): DrawerContextValue {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error(`${component} must be used within Drawer.`);
  }
  return context;
}

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right" | "bottom";
  children: React.ReactNode;
}

export function Drawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = "right",
  children
}: DrawerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const baseId = React.useId();
  const triggerRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const open = openProp ?? uncontrolledOpen;

  const registerTitle = React.useCallback(() => setHasTitle(true), []);
  const unregisterTitle = React.useCallback(() => setHasTitle(false), []);
  const registerDescription = React.useCallback(() => setHasDescription(true), []);
  const unregisterDescription = React.useCallback(() => setHasDescription(false), []);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [onOpenChange, openProp]
  );

  useBodyScrollLock(open);

  return (
    <DrawerContext.Provider
      value={{
        open,
        setOpen,
        side,
        contentId: `${baseId}-content`,
        titleId: `${baseId}-title`,
        descriptionId: `${baseId}-description`,
        hasTitle,
        hasDescription,
        registerTitle,
        unregisterTitle,
        registerDescription,
        unregisterDescription,
        triggerRef,
        contentRef
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export interface DrawerTriggerProps {
  children: React.ReactElement;
}

export function DrawerTrigger({ children }: DrawerTriggerProps) {
  const { open, setOpen, contentId, triggerRef } = useDrawerContext("DrawerTrigger");
  const child = React.Children.only(children);
  const childProps = child.props as React.HTMLAttributes<HTMLElement>;

  const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;

  return React.cloneElement(child, {
    ...childProps,
    ref: composeRefs(childRef, triggerRef),
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": open ? contentId : undefined,
    onClick: mergeHandlers(childProps.onClick, () => setOpen(true)),
    onKeyDown: mergeHandlers(childProps.onKeyDown, (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(true);
      }
    })
  } as React.HTMLAttributes<HTMLElement>);
}

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  closeOnOverlayClick?: boolean;
}

export function DrawerContent({
  closeOnOverlayClick = true,
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: DrawerContentProps) {
  const { open, setOpen, side, contentId, titleId, descriptionId, hasTitle, hasDescription, triggerRef, contentRef } =
    useDrawerContext("DrawerContent");

  useFocusTrap(contentRef, open, triggerRef);
  useBackgroundInert(open);

  React.useEffect(() => {
    if (!open || process.env.NODE_ENV === "production") return;
    if (!hasTitle && !ariaLabel) {
      console.warn(
        "[Super System Drawer] DrawerContent should include DrawerTitle or an aria-label for accessibility."
      );
    }
  }, [ariaLabel, hasTitle, open]);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen, triggerRef]);

  if (!open) return null;

  return (
    <OverlayPortal>
      <div className="ss-drawer">
        <div
          className="ss-drawer__overlay"
          aria-hidden="true"
          onMouseDown={() => {
            if (closeOnOverlayClick) setOpen(false);
          }}
        />
        <div
          ref={contentRef}
          id={contentId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          aria-label={!hasTitle ? ariaLabel : undefined}
          tabIndex={-1}
          className={classes("ss-drawer__content", `ss-drawer__content--${side}`, className)}
          {...props}
        >
          {children}
        </div>
      </div>
    </OverlayPortal>
  );
}

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return <div className={classes("ss-drawer__header", className)} {...props} />;
}

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  const { titleId, registerTitle, unregisterTitle } = useDrawerContext("DrawerTitle");

  React.useLayoutEffect(() => {
    registerTitle();
    return unregisterTitle;
  }, [registerTitle, unregisterTitle]);

  return <h2 id={titleId} className={classes("ss-drawer__title", className)} {...props} />;
}

export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function DrawerDescription({ className, ...props }: DrawerDescriptionProps) {
  const { descriptionId, registerDescription, unregisterDescription } =
    useDrawerContext("DrawerDescription");

  React.useLayoutEffect(() => {
    registerDescription();
    return unregisterDescription;
  }, [registerDescription, unregisterDescription]);

  return <p id={descriptionId} className={classes("ss-drawer__description", className)} {...props} />;
}

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerBody({ className, ...props }: DrawerBodyProps) {
  return <div className={classes("ss-drawer__body", className)} {...props} />;
}

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return <div className={classes("ss-drawer__footer", className)} {...props} />;
}

export interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  function DrawerClose({ className, onClick, "aria-label": ariaLabel = "Close", ...props }, ref) {
    const { setOpen } = useDrawerContext("DrawerClose");

    return (
      <button
        ref={ref}
        type="button"
        className={classes("ss-drawer__close", className)}
        aria-label={ariaLabel}
        onClick={mergeHandlers(onClick, () => setOpen(false))}
        {...props}
      />
    );
  }
);
DrawerClose.displayName = "DrawerClose";
