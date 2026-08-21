import * as React from "react";
import { classes, isFormControl } from "./utils.js";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  required?: boolean;
  inline?: boolean;
}

function enhanceLabelChild(
  child: React.ReactElement,
  options: { required?: boolean; disabled?: boolean }
): React.ReactElement {
  const nextProps: Record<string, unknown> = {};

  if (options.required) {
    nextProps.required = true;
    nextProps["aria-required"] = true;
  }

  if (options.disabled) {
    nextProps.disabled = true;
  }

  return React.cloneElement(child, nextProps);
}

function propagateLabelState(
  children: React.ReactNode,
  options: { required?: boolean; disabled?: boolean }
): React.ReactNode {
  if (!options.required && !options.disabled) return children;

  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (isFormControl(child)) return enhanceLabelChild(child, options);
    return child;
  });
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { disabled, required, inline, className, children, ...props },
  ref
) {
  const content = propagateLabelState(children, { required, disabled });

  return (
    <label
      ref={ref}
      className={classes(
        "ss-label",
        disabled && "ss-label--disabled",
        inline && "ss-label--inline",
        className
      )}
      {...props}
    >
      {content}
      {required ? <span className="ss-label__required" aria-hidden="true"> *</span> : null}
    </label>
  );
});
Label.displayName = "Label";
