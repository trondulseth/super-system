import * as React from "react";
import { classes, composeRefs, mergeDescribedBy, mergeHandlers } from "./utils.js";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  display?: "inline" | "inline-flex" | "block";
}

export function Tooltip({
  content,
  children,
  side = "top",
  display = "inline-flex"
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const tooltipId = React.useId();

  const child = React.Children.only(children);
  const childProps = child.props as React.HTMLAttributes<HTMLElement>;
  const describedBy = childProps["aria-describedby"];
  const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;

  const trigger = React.cloneElement(child, {
    ...childProps,
    ref: composeRefs(childRef, undefined),
    "aria-describedby": open ? mergeDescribedBy(describedBy, tooltipId) : describedBy,
    onMouseEnter: mergeHandlers(childProps.onMouseEnter, () => setOpen(true)),
    onMouseLeave: mergeHandlers(childProps.onMouseLeave, () => setOpen(false)),
    onFocus: mergeHandlers(childProps.onFocus, () => setOpen(true)),
    onBlur: mergeHandlers(childProps.onBlur, () => setOpen(false)),
    onKeyDown: mergeHandlers(childProps.onKeyDown, (event) => {
      if (event.key === "Escape") setOpen(false);
    })
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <span className="ss-tooltip" style={{ display }}>
      {trigger}
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={classes("ss-tooltip__content", `ss-tooltip__content--${side}`)}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
