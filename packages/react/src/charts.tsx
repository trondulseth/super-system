import * as React from "react";
import { buildLinePath, buildSparklinePoints, normalizeSeries } from "./chart-utils.js";
import { classes } from "./utils.js";

export type ChartTone = "primary" | "secondary" | "destructive" | "muted";

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  tone?: ChartTone;
  label?: string;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  tone = "primary",
  label,
  className,
  ...props
}: SparklineProps) {
  const points = buildSparklinePoints(data, width, height);
  const normalized = normalizeSeries(data);
  const last = normalized[normalized.length - 1] ?? 0;
  const first = normalized[0] ?? 0;
  const trend = last >= first ? "up" : "down";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label ?? `Sparkline chart trending ${trend}`}
      className={classes("ss-sparkline", `ss-sparkline--${tone}`, className)}
      {...props}
    >
      <polyline className="ss-sparkline__line" points={points} fill="none" />
    </svg>
  );
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{ label: string; value: number }>;
  tone?: ChartTone;
  orientation?: "vertical" | "horizontal";
  label?: string;
}

export function BarChart({
  data,
  tone = "primary",
  orientation = "vertical",
  label,
  className,
  ...props
}: BarChartProps) {
  const max = Math.max(...data.map((entry) => entry.value), 1);

  return (
    <div
      role="img"
      aria-label={label ?? "Bar chart"}
      className={classes(
        "ss-bar-chart",
        `ss-bar-chart--${orientation}`,
        `ss-bar-chart--${tone}`,
        className
      )}
      {...props}
    >
      {data.map((entry) => (
        <div key={entry.label} className="ss-bar-chart__item">
          <div
            className="ss-bar-chart__bar"
            style={{
              [orientation === "vertical" ? "height" : "width"]:
                `${Math.max((entry.value / max) * 100, 4)}%`
            }}
            title={`${entry.label}: ${entry.value}`}
          />
          <span className="ss-bar-chart__label">{entry.label}</span>
        </div>
      ))}
    </div>
  );
}

export interface LineChartProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  tone?: ChartTone;
  showArea?: boolean;
  label?: string;
}

export function LineChart({
  data,
  width = 280,
  height = 120,
  tone = "primary",
  showArea = true,
  label,
  className,
  ...props
}: LineChartProps) {
  const { line, area } = buildLinePath(data, width, height);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label ?? "Line chart"}
      className={classes("ss-line-chart", `ss-line-chart--${tone}`, className)}
      {...props}
    >
      {showArea ? <path className="ss-line-chart__area" d={area} /> : null}
      <path className="ss-line-chart__line" d={line} fill="none" />
    </svg>
  );
}

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  tone?: ChartTone;
  label?: string;
  size?: number;
}

export function DonutChart({
  value,
  max = 100,
  tone = "primary",
  label,
  size = 72,
  className,
  ...props
}: DonutChartProps) {
  const percent = Math.min(Math.max(value / max, 0), 1);
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent);

  return (
    <div
      role="img"
      aria-label={label ?? `Progress ${Math.round(percent * 100)} percent`}
      className={classes("ss-donut-chart", `ss-donut-chart--${tone}`, className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="ss-donut-chart__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="ss-donut-chart__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ss-donut-chart__label">{Math.round(percent * 100)}%</span>
    </div>
  );
}
