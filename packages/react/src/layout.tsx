import * as React from "react";
import { classes } from "./utils.js";

type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
type FlexGap = "none" | "sm" | "md" | "lg";

const alignMap: Record<FlexAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline"
};

const justifyMap: Record<FlexJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly"
};

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: FlexWrap;
  gap?: FlexGap;
  inline?: boolean;
  grow?: boolean;
  shrink?: boolean;
}

function flexStyle(props: Pick<BoxProps, "direction" | "align" | "justify" | "wrap" | "inline" | "grow" | "shrink">) {
  return {
    display: props.inline ? "inline-flex" : "flex",
    flexDirection: props.direction,
    alignItems: props.align ? alignMap[props.align] : undefined,
    justifyContent: props.justify ? justifyMap[props.justify] : undefined,
    flexWrap: props.wrap,
    flexGrow: props.grow ? 1 : undefined,
    flexShrink: props.shrink ? 0 : undefined
  } as React.CSSProperties;
}

export function Box({
  direction = "row",
  align,
  justify,
  wrap,
  gap = "none",
  inline,
  grow,
  shrink,
  className,
  style,
  ...props
}: BoxProps) {
  return (
    <div
      className={classes("ss-box", gap !== "none" && `ss-box--gap-${gap}`, className)}
      style={{ ...flexStyle({ direction, align, justify, wrap, inline, grow, shrink }), ...style }}
      {...props}
    />
  );
}

export interface StackProps extends Omit<BoxProps, "direction"> {}

export function Stack(props: StackProps) {
  return <Box direction="column" {...props} />;
}

export interface RowProps extends Omit<BoxProps, "direction"> {}

export function Row(props: RowProps) {
  return <Box direction="row" {...props} />;
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "full";
}

export function Container({ size = "lg", className, ...props }: ContainerProps) {
  return <div className={classes("ss-container", `ss-container--${size}`, className)} {...props} />;
}

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: FlexGap;
}

export function Spacer({ size = "md", className, ...props }: SpacerProps) {
  return <div aria-hidden="true" className={classes("ss-spacer", `ss-spacer--${size}`, className)} {...props} />;
}

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({ orientation = "horizontal", className, ...props }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={classes("ss-divider", "ss-divider--vertical", className)}
        {...props}
      />
    );
  }

  return <hr className={classes("ss-divider", "ss-divider--horizontal", className)} {...props} />;
}
