import * as React from "react";
import { classes } from "./utils.js";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
  label?: React.ReactNode;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { invalid, label, className, disabled, id, ...props },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const input = (
    <input
      ref={ref}
      id={inputId}
      type="range"
      disabled={disabled}
      className={classes("ss-slider", invalid && "ss-slider--invalid", !label && className)}
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
        disabled && "ss-label--disabled",
        className
      )}
    >
      {label}
      {input}
    </label>
  );
});
Slider.displayName = "Slider";
