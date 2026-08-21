import * as React from "react";
import { classes, composeRefs, mergeDescribedBy, mergeHandlers } from "./utils.js";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  display?: "inline" | "inline-flex" | "block";
}

function isDisabledTrigger(props: Record<string, unknown>): boolean {
  return (
    Boolean(props.disabled) ||
    props["aria-disabled"] === true ||
    props["aria-disabled"] === "true"
  );
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
  const childProps = child.props as Record<string, unknown> & React.HTMLAttributes<HTMLElement>;
  const describedBy = childProps["aria-describedby"];
  const childRef = (child as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
  const disabledTrigger = isDisabledTrigger(childProps);

  const openHandlers = {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key === "Escape") setOpen(false);
    }
  };

  const triggerProps = {
    ...childProps,
    ref: composeRefs(childRef),
    "aria-describedby": open ? mergeDescribedBy(describedBy, tooltipId) : describedBy,
    ...(disabledTrigger
      ? { tabIndex: -1 }
      : {
          onMouseEnter: mergeHandlers(childProps.onMouseEnter, openHandlers.onMouseEnter),
          onMouseLeave: mergeHandlers(childProps.onMouseLeave, openHandlers.onMouseLeave),
          onFocus: mergeHandlers(childProps.onFocus, openHandlers.onFocus),
          onBlur: mergeHandlers(childProps.onBlur, openHandlers.onBlur),
          onKeyDown: mergeHandlers(childProps.onKeyDown, openHandlers.onKeyDown)
        })
  };

  const trigger = React.cloneElement(child, triggerProps);

  const tooltip = open ? (
    <span
      id={tooltipId}
      role="tooltip"
      className={classes("ss-tooltip__content", `ss-tooltip__content--${side}`)}
    >
      {content}
    </span>
  ) : null;

  if (disabledTrigger) {
    return (
      <span className={classes("ss-tooltip", "ss-tooltip--disabled-trigger")} style={{ display }}>
        <span className="ss-tooltip__trigger-wrap" tabIndex={0} {...openHandlers}>
          {trigger}
        </span>
        {tooltip}
      </span>
    );
  }

  return (
    <span className="ss-tooltip" style={{ display }}>
      {trigger}
      {tooltip}
    </span>
  );
}
