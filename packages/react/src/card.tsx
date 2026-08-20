import * as React from "react";
import { classes } from "./utils.js";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classes("ss-card", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classes("ss-card__header", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={classes("ss-card__title", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classes("ss-card__body", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classes("ss-card__footer", className)} {...props} />;
}
