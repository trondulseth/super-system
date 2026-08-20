import * as React from "react";
import { classes } from "./utils.js";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={classes("ss-textarea", invalid && "ss-textarea--invalid", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
