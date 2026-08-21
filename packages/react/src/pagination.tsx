import * as React from "react";
import { classes } from "./utils.js";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {}

export function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={classes("ss-pagination", className)} {...props} />
  );
}

export interface PaginationContentProps extends React.HTMLAttributes<HTMLUListElement> {}

export function PaginationContent({ className, ...props }: PaginationContentProps) {
  return <ul className={classes("ss-pagination__content", className)} {...props} />;
}

export interface PaginationItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export function PaginationItem({ className, ...props }: PaginationItemProps) {
  return <li className={classes("ss-pagination__item", className)} {...props} />;
}

export interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
}

export const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  function PaginationLink({ isActive, className, ...props }, ref) {
    return (
      <a
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={classes(
          "ss-pagination__link",
          isActive && "ss-pagination__link--active",
          className
        )}
        {...props}
      />
    );
  }
);
PaginationLink.displayName = "PaginationLink";

export interface PaginationPreviousProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean;
}

export function PaginationPrevious({
  className,
  children = "Previous",
  disabled = false,
  href,
  onClick,
  tabIndex,
  ...props
}: PaginationPreviousProps) {
  if (disabled) {
    return (
      <span
        aria-label="Go to previous page"
        aria-disabled="true"
        tabIndex={-1}
        className={classes(
          "ss-pagination__link",
          "ss-pagination__previous",
          "ss-pagination__link--disabled",
          className
        )}
        {...props}
      >
        <span className="ss-pagination__chevron" aria-hidden="true" />
        <span>{children}</span>
      </span>
    );
  }

  return (
    <a
      aria-label="Go to previous page"
      className={classes("ss-pagination__link", "ss-pagination__previous", className)}
      href={href}
      tabIndex={tabIndex}
      onClick={onClick}
      {...props}
    >
      <span className="ss-pagination__chevron" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}

export interface PaginationNextProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  disabled?: boolean;
}

export function PaginationNext({
  className,
  children = "Next",
  disabled = false,
  href,
  onClick,
  tabIndex,
  ...props
}: PaginationNextProps) {
  if (disabled) {
    return (
      <span
        aria-label="Go to next page"
        aria-disabled="true"
        tabIndex={-1}
        className={classes(
          "ss-pagination__link",
          "ss-pagination__next",
          "ss-pagination__link--disabled",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <span className="ss-pagination__chevron ss-pagination__chevron--next" aria-hidden="true" />
      </span>
    );
  }

  return (
    <a
      aria-label="Go to next page"
      className={classes("ss-pagination__link", "ss-pagination__next", className)}
      href={href}
      tabIndex={tabIndex}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      <span className="ss-pagination__chevron ss-pagination__chevron--next" aria-hidden="true" />
    </a>
  );
}

export interface PaginationEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span className={classes("ss-pagination__ellipsis", className)} {...props}>
      <span aria-hidden="true">…</span>
      <span className="ss-pagination__sr-only">More pages</span>
    </span>
  );
}
