import * as React from "react";
import { classes } from "./utils.js";

export type IconSize = "sm" | "md" | "lg";

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  size?: IconSize;
  /** When true, hides the icon from assistive technology. Use when visible text or a labelled control provides the name. */
  decorative?: boolean;
  /** Required when the icon is meaningful on its own and not decorative. */
  label?: string;
  children: React.ReactElement;
}

function mergeIconClassName(
  size: IconSize,
  className: string | undefined,
  childClassName: string | undefined
): string {
  return classes("ss-icon", `ss-icon--${size}`, className, childClassName);
}

function getAccessibilityProps(
  decorative: boolean,
  label: string | undefined,
  ariaLabel: string | undefined
): Pick<React.HTMLAttributes<HTMLElement>, "aria-hidden" | "role" | "aria-label"> {
  if (decorative) {
    return { "aria-hidden": "true" };
  }

  return {
    role: "img",
    "aria-label": label ?? ariaLabel
  };
}

export const Icon = React.forwardRef<HTMLElement, IconProps>(function Icon(
  {
    size = "md",
    decorative = false,
    label,
    className,
    children,
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const child = React.Children.only(children);
  const accessibility = getAccessibilityProps(decorative, label, ariaLabel);

  if (typeof child.type === "string" && child.type === "svg") {
    return React.cloneElement(child, {
      ...props,
      ...accessibility,
      ref,
      className: mergeIconClassName(size, className, (child.props as { className?: string }).className)
    } as React.SVGAttributes<SVGElement>);
  }

  return (
    <span
      ref={ref as React.Ref<HTMLSpanElement>}
      className={mergeIconClassName(size, className, undefined)}
      {...accessibility}
      {...props}
    >
      {React.cloneElement(child, {
        className: classes("ss-icon__glyph", (child.props as { className?: string }).className),
        "aria-hidden": "true"
      } as React.HTMLAttributes<HTMLElement>)}
    </span>
  );
});
Icon.displayName = "Icon";
