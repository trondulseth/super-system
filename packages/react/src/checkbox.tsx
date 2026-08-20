import * as React from "react";
import { classes } from "./utils.js";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { invalid, label, className, disabled, id, ...props },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const input = (
    <input
      ref={ref}
      id={inputId}
      type="checkbox"
      disabled={disabled}
      className={classes("ss-checkbox", invalid && "ss-checkbox--invalid", !label && className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );

  if (!label) return input;

  return (
    <label
      htmlFor={inputId}
      className={classes(
        "ss-label",
        "ss-label--inline",
        disabled && "ss-label--disabled",
        className
      )}
    >
      {input}
      {label}
    </label>
  );
});
Checkbox.displayName = "Checkbox";
