import * as React from "react";
import { OverlayClose } from "./overlay-close.js";
import { OverlayPortal, useBackgroundInert, useBodyScrollLock, useFocusTrap } from "./overlay-utils.js";
import { classes, composeRefs, mergeHandlers } from "./utils.js";

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
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
    <DialogContext.Provider
      value={{
        open,
        setOpen,
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

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  closeOnOverlayClick?: boolean;
}

export function DialogContent({
  closeOnOverlayClick = true,
  className,
  children,
  onKeyDown,
  "aria-label": ariaLabel,
  ...props
}: DialogContentProps) {
  const { open, setOpen, contentId, titleId, descriptionId, hasTitle, hasDescription, triggerRef, contentRef } =
    useDialogContext("DialogContent");

  useFocusTrap(contentRef, open, triggerRef);
  useBackgroundInert(open);

  React.useEffect(() => {
    if (!open || process.env.NODE_ENV === "production") return;
    if (!hasTitle && !ariaLabel) {
      console.warn(
        "[Super System Dialog] DialogContent should include DialogTitle or an aria-label for accessibility."
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
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          aria-label={!hasTitle ? ariaLabel : undefined}
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
  const { titleId, registerTitle, unregisterTitle } = useDialogContext("DialogTitle");

  React.useLayoutEffect(() => {
    registerTitle();
    return unregisterTitle;
  }, [registerTitle, unregisterTitle]);

  return <h2 id={titleId} className={classes("ss-dialog__title", className)} {...props} />;
}

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  const { descriptionId, registerDescription, unregisterDescription } =
    useDialogContext("DialogDescription");

  React.useLayoutEffect(() => {
    registerDescription();
    return unregisterDescription;
  }, [registerDescription, unregisterDescription]);

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
  function DialogClose({ className, ...props }, ref) {
    const { setOpen } = useDialogContext("DialogClose");

    return (
      <OverlayClose
        ref={ref}
        {...props}
        className={classes("ss-dialog__close", className)}
        onClose={() => setOpen(false)}
      />
    );
  }
);
DialogClose.displayName = "DialogClose";
