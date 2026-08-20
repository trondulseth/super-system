import * as React from "react";
import { classes } from "./utils.js";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, children, ...props },
  ref
) {
  return (
    <span className="ss-select-wrap">
      <select
        ref={ref}
        className={classes("ss-select", invalid && "ss-select--invalid", className)}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
    </span>
  );
});
Select.displayName = "Select";
