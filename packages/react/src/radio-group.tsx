import * as React from "react";
import { classes } from "./utils.js";

export interface RadioGroupProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  label?: string;
}

export function RadioGroup({ label, className, children, ...props }: RadioGroupProps) {
  return (
    <fieldset className={classes("ss-radio-group", className)} {...props}>
      {label ? <legend className="ss-radio-group__legend">{label}</legend> : null}
      <div className="ss-radio-group__items">{children}</div>
    </fieldset>
  );
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
  label: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { invalid, label, className, disabled, id, ...props },
  ref
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <label
      htmlFor={inputId}
      className={classes("ss-radio", disabled && "ss-radio--disabled", className)}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        className={classes("ss-radio__input", invalid && "ss-radio__input--invalid")}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        {...props}
      />
      <span className="ss-radio__label">{label}</span>
    </label>
  );
});
Radio.displayName = "Radio";
