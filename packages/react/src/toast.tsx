import * as React from "react";
import { OverlayPortal } from "./overlay-utils.js";
import { classes } from "./utils.js";

export type ToastVariant = "neutral" | "primary" | "destructive";

export interface ToastInput {
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastRecord extends Required<Pick<ToastInput, "title">> {
  id: string;
  description?: React.ReactNode;
  variant: ToastVariant;
  duration: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

function defaultLiveRole(variant: ToastVariant): "alert" | "status" {
  return variant === "destructive" ? "alert" : "status";
}

export interface ToastProviderProps {
  children: React.ReactNode;
  duration?: number;
}

export function ToastProvider({ children, duration = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);
  const timersRef = React.useRef<Map<string, number>>(new Map());

  const dismiss = React.useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const toast = React.useCallback(
    (input: ToastInput) => {
      const id = input.id ?? `toast-${Math.random().toString(36).slice(2, 10)}`;
      const entry: ToastRecord = {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? "neutral",
        duration: input.duration ?? duration
      };

      setToasts((current) => [...current, entry]);

      const timer = window.setTimeout(() => dismiss(id), entry.duration);
      timersRef.current.set(id, timer);
      return id;
    },
    [dismiss, duration]
  );

  React.useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) {
        window.clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <OverlayPortal>
        <div className="ss-toast-viewport" aria-live="polite" aria-relevant="additions">
          {toasts.map((entry) => (
            <div
              key={entry.id}
              role={defaultLiveRole(entry.variant)}
              className={classes("ss-toast", `ss-toast--${entry.variant}`)}
            >
              <div className="ss-toast__content">
                <p className="ss-toast__title">{entry.title}</p>
                {entry.description ? (
                  <p className="ss-toast__description">{entry.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="ss-toast__close"
                aria-label="Dismiss notification"
                onClick={() => dismiss(entry.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </OverlayPortal>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context;
}

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: ToastVariant;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export function Toast({
  open = true,
  onOpenChange,
  variant = "neutral",
  title,
  description,
  className,
  ...props
}: ToastProps) {
  if (!open) return null;

  return (
    <div
      role={defaultLiveRole(variant)}
      className={classes("ss-toast", `ss-toast--${variant}`, className)}
      {...props}
    >
      <div className="ss-toast__content">
        <p className="ss-toast__title">{title}</p>
        {description ? <p className="ss-toast__description">{description}</p> : null}
      </div>
      {onOpenChange ? (
        <button
          type="button"
          className="ss-toast__close"
          aria-label="Dismiss notification"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export interface ToastTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function ToastTitle({ className, ...props }: ToastTitleProps) {
  return <p className={classes("ss-toast__title", className)} {...props} />;
}

export interface ToastDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return <p className={classes("ss-toast__description", className)} {...props} />;
}

export interface ToastCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(function ToastClose(
  { className, onClick, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Dismiss notification"
      className={classes("ss-toast__close", className)}
      onClick={onClick}
      {...props}
    />
  );
});
ToastClose.displayName = "ToastClose";
