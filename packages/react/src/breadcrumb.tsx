import * as React from "react";
import { classes } from "./utils.js";

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {}

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={classes("ss-breadcrumb", className)} {...props} />
  );
}

export interface BreadcrumbListProps extends React.OlHTMLAttributes<HTMLOListElement> {}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return <ol className={classes("ss-breadcrumb__list", className)} {...props} />;
}

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return <li className={classes("ss-breadcrumb__item", className)} {...props} />;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ className, ...props }, ref) {
    return (
      <a ref={ref} className={classes("ss-breadcrumb__link", className)} {...props} />
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      className={classes("ss-breadcrumb__page", className)}
      {...props}
    />
  );
}

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export function BreadcrumbSeparator({
  className,
  children = "/",
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <span role="presentation" aria-hidden="true" className={classes("ss-breadcrumb__separator", className)} {...props}>
      {children}
    </span>
  );
}
