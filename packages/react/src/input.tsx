import * as React from "react";
import { classes } from "./utils.js";

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
Input.displayName = "Input";
