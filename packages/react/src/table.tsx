import * as React from "react";
import { classes } from "./utils.js";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="ss-table-wrap">
      <table className={classes("ss-table", className)} {...props} />
    </div>
  );
}

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return <caption className={classes("ss-table__caption", className)} {...props} />;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={classes("ss-table__header", className)} {...props} />;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={classes("ss-table__body", className)} {...props} />;
}

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export function TableFooter({ className, ...props }: TableFooterProps) {
  return <tfoot className={classes("ss-table__footer", className)} {...props} />;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={classes("ss-table__row", className)} {...props} />;
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export function TableHead({ className, ...props }: TableHeadProps) {
  return <th scope="col" className={classes("ss-table__head", className)} {...props} />;
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={classes("ss-table__cell", className)} {...props} />;
}
