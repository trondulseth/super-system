import * as React from "react";
import { classes } from "./utils.js";

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
