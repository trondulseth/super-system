import * as React from "react";
import { OverlayPortal, useBodyScrollLock, useFocusTrap } from "./overlay-utils.js";
import { classes, mergeHandlers } from "./utils.js";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(component: string): DialogContextValue {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error(`${component} must be used within Dialog.`);
  }
  return context;
}

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const baseId = React.useId();
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

  useBodyScrollLock(open);

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen,
        contentId: `${baseId}-content`,
        titleId: `${baseId}-title`,
        descriptionId: `${baseId}-description`,
        triggerRef,
        contentRef
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export interface DialogTriggerProps {
  children: React.ReactElement;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  const { open, setOpen, contentId, triggerRef } = useDialogContext("DialogTrigger");
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

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  closeOnOverlayClick?: boolean;
}

export function DialogContent({
  closeOnOverlayClick = true,
  className,
  children,
  onKeyDown,
  ...props
}: DialogContentProps) {
  const { open, setOpen, contentId, titleId, descriptionId, triggerRef, contentRef } =
    useDialogContext("DialogContent");

  useFocusTrap(contentRef, open, triggerRef);

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

  const handleContentKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
  };

  return (
    <OverlayPortal>
      <div className="ss-dialog">
        <div
          className="ss-dialog__overlay"
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
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          className={classes("ss-dialog__content", className)}
          onKeyDown={handleContentKeyDown}
          {...props}
        >
          {children}
        </div>
      </div>
    </OverlayPortal>
  );
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return <div className={classes("ss-dialog__header", className)} {...props} />;
}

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  const { titleId } = useDialogContext("DialogTitle");
  return <h2 id={titleId} className={classes("ss-dialog__title", className)} {...props} />;
}

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  const { descriptionId } = useDialogContext("DialogDescription");
  return <p id={descriptionId} className={classes("ss-dialog__description", className)} {...props} />;
}

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogBody({ className, ...props }: DialogBodyProps) {
  return <div className={classes("ss-dialog__body", className)} {...props} />;
}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogFooter({ className, ...props }: DialogFooterProps) {
  return <div className={classes("ss-dialog__footer", className)} {...props} />;
}

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ className, onClick, ...props }, ref) {
    const { setOpen } = useDialogContext("DialogClose");

    return (
      <button
        ref={ref}
        type="button"
        className={classes("ss-dialog__close", className)}
        onClick={mergeHandlers(onClick, () => setOpen(false))}
        {...props}
      />
    );
  }
);
DialogClose.displayName = "DialogClose";
