import * as React from "react";
import { classes } from "./utils.js";

export type KpiTrend = "up" | "down" | "neutral";

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "muted";
}

export function KpiCard({ variant = "default", className, ...props }: KpiCardProps) {
  return <div className={classes("ss-kpi-card", `ss-kpi-card--${variant}`, className)} {...props} />;
}

export interface KpiCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function KpiCardHeader({ className, ...props }: KpiCardHeaderProps) {
  return <div className={classes("ss-kpi-card__header", className)} {...props} />;
}

export interface KpiCardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function KpiCardTitle({ className, ...props }: KpiCardTitleProps) {
  return <p className={classes("ss-kpi-card__title", className)} {...props} />;
}

export interface KpiCardValueProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function KpiCardValue({ className, ...props }: KpiCardValueProps) {
  return <p className={classes("ss-kpi-card__value", className)} {...props} />;
}

export interface KpiCardTrendProps extends React.HTMLAttributes<HTMLSpanElement> {
  trend?: KpiTrend;
}

export function KpiCardTrend({ trend = "neutral", className, ...props }: KpiCardTrendProps) {
  return (
    <span className={classes("ss-kpi-card__trend", `ss-kpi-card__trend--${trend}`, className)} {...props} />
  );
}

export interface KpiCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function KpiCardDescription({ className, ...props }: KpiCardDescriptionProps) {
  return <p className={classes("ss-kpi-card__description", className)} {...props} />;
}

export interface KpiCardChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function KpiCardChart({ className, ...props }: KpiCardChartProps) {
  return <div className={classes("ss-kpi-card__chart", className)} {...props} />;
}

export interface KpiCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function KpiCardFooter({ className, ...props }: KpiCardFooterProps) {
  return <div className={classes("ss-kpi-card__footer", className)} {...props} />;
}
