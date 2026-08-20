import * as React from "react";

function classes(...values: Array<string | undefined | false>): string {
  return values.filter(Boolean).join(" ");
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, disabled, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={classes("ss-button", `ss-button--${variant}`, `ss-button--${size}`, className)}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="ss-spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
});

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={classes("ss-input", invalid && "ss-input--invalid", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={classes("ss-textarea", invalid && "ss-textarea--invalid", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { disabled, required, className, children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={classes("ss-label", disabled && "ss-label--disabled", className)}
      {...props}
    >
      {children}
      {required ? <span className="ss-label__required" aria-hidden="true"> *</span> : null}
    </label>
  );
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "destructive";
}

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return <span className={classes("ss-badge", `ss-badge--${variant}`, className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classes("ss-card", className)} {...props} />;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  mode?: "light" | "dark" | "system";
  storageKey?: string;
}

export function ThemeProvider({ children, mode = "system", storageKey = "super-system-theme" }: ThemeProviderProps) {
  React.useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    const selected = stored === "light" || stored === "dark" ? stored : mode;
    if (selected === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.dataset.theme = selected;
  }, [mode, storageKey]);
  return <>{children}</>;
}
