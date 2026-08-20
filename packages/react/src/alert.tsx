import * as React from "react";
import { classes } from "./utils.js";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "neutral" | "primary" | "destructive";
  title?: string;
  liveRegion?: "alert" | "status";
}

function defaultLiveRegion(variant: NonNullable<AlertProps["variant"]>): "alert" | "status" {
  return variant === "destructive" ? "alert" : "status";
}

export function Alert({
  variant = "neutral",
  title,
  liveRegion,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role={liveRegion ?? defaultLiveRegion(variant)}
      className={classes("ss-alert", `ss-alert--${variant}`, className)}
      {...props}
    >
      {title ? <p className="ss-alert__title">{title}</p> : null}
      <div className="ss-alert__body">{children}</div>
    </div>
  );
}
