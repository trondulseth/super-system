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
      {loading ? <Spinner size="sm" aria-hidden /> : null}
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
  inline?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { disabled, required, inline, className, children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={classes(
        "ss-label",
        disabled && "ss-label--disabled",
        inline && "ss-label--inline",
        className
      )}
      {...props}
    >
      {children}
      {required ? <span className="ss-label__required" aria-hidden="true"> *</span> : null}
    </label>
  );
});

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { invalid, className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={classes("ss-checkbox", invalid && "ss-checkbox--invalid", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});

export interface RadioGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  label?: string;
}

export function RadioGroup({ label, className, children, ...props }: RadioGroupProps) {
  return (
    <fieldset className={classes("ss-radio-group", className)} {...props}>
      {label ? <legend className="ss-radio-group__legend">{label}</legend> : null}
      <div className="ss-radio-group__items">{children}</div>
    </fieldset>
  );
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
  label: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { invalid, label, className, disabled, id, ...props },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={classes("ss-radio", disabled && "ss-radio--disabled", className)}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className={classes("ss-radio__input", invalid && "ss-radio__input--invalid")}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        {...props}
      />
      <span className="ss-radio__label">{label}</span>
    </label>
  );
});

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  invalid?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { invalid, className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type="checkbox"
      role="switch"
      className={classes("ss-switch", invalid && "ss-switch--invalid", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...props },
  ref
) {
  return (
    <span className="ss-select-wrap">
      <select
        ref={ref}
        className={classes("ss-select", invalid && "ss-select--invalid", className)}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
    </span>
  );
});

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "neutral" | "primary" | "destructive";
  title?: string;
}

export function Alert({
  variant = "neutral",
  title,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={classes("ss-alert", `ss-alert--${variant}`, className)}
      {...props}
    >
      {title ? <p className="ss-alert__title">{title}</p> : null}
      <div className="ss-alert__body">{children}</div>
    </div>
  );
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({
  size = "md",
  label = "Loading",
  className,
  "aria-hidden": ariaHidden,
  ...props
}: SpinnerProps) {
  return (
    <span
      role={ariaHidden ? undefined : "status"}
      aria-label={ariaHidden ? undefined : label}
      aria-hidden={ariaHidden || undefined}
      className={classes("ss-spinner", `ss-spinner--${size}`, className)}
      {...props}
    />
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "block" | "circle";
  lines?: number;
}

export function Skeleton({
  variant = "block",
  lines = 1,
  className,
  ...props
}: SkeletonProps) {
  if (variant === "text" && lines > 1) {
    return (
      <div className={classes("ss-skeleton-group", className)} aria-hidden="true" {...props}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={classes(
              "ss-skeleton",
              "ss-skeleton--text",
              index === lines - 1 && "ss-skeleton--short"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={classes("ss-skeleton", `ss-skeleton--${variant}`, className)}
      {...props}
    />
  );
}

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
}

function mergeHandlers<Event extends React.SyntheticEvent>(
  theirs: ((event: Event) => void) | undefined,
  ours: (event: Event) => void
): (event: Event) => void {
  return (event) => {
    theirs?.(event);
    ours(event);
  };
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const tooltipId = React.useId();

  const child = React.Children.only(children);
  const childProps = child.props as React.HTMLAttributes<HTMLElement>;
  const trigger = React.cloneElement(child, {
    ...childProps,
    "aria-describedby": open ? tooltipId : childProps["aria-describedby"],
    onMouseEnter: mergeHandlers(childProps.onMouseEnter, () => setOpen(true)),
    onMouseLeave: mergeHandlers(childProps.onMouseLeave, () => setOpen(false)),
    onFocus: mergeHandlers(childProps.onFocus, () => setOpen(true)),
    onBlur: mergeHandlers(childProps.onBlur, () => setOpen(false)),
    onKeyDown: mergeHandlers(childProps.onKeyDown, (event) => {
      if (event.key === "Escape") setOpen(false);
    })
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <span className="ss-tooltip">
      {trigger}
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={classes("ss-tooltip__content", `ss-tooltip__content--${side}`)}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

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
