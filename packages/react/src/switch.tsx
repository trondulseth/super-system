import * as React from "react";
import { classes } from "./utils.js";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  invalid?: boolean;
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
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
      role="switch"
      disabled={disabled}
      className={classes("ss-switch", invalid && "ss-switch--invalid", !label && className)}
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
Switch.displayName = "Switch";
