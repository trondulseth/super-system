import * as React from "react";
import { classes } from "./utils.js";

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
