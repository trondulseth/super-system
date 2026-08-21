import * as React from "react";
import { Spinner } from "./spinner.js";
import { classes } from "./utils.js";

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
Button.displayName = "Button";
