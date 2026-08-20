import * as React from "react";
import { classes } from "./utils.js";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "destructive";
}

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return <span className={classes("ss-badge", `ss-badge--${variant}`, className)} {...props} />;
}
