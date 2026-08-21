import * as React from "react";
import { buildLinePath, buildSparklinePoints, getSparklineTrend, normalizeSeries } from "./chart-utils.js";
import { classes } from "./utils.js";

export type ChartTone = "primary" | "secondary" | "destructive" | "muted";

interface ChartDataTableProps {
  caption?: string;
  rows: Array<{ label: string; value: string | number }>;
}

function ChartDataTable({ caption, rows }: ChartDataTableProps) {
  return (
    <table className="ss-chart__data-table">
      {caption ? <caption>{caption}</caption> : null}
      <thead>
        <tr>
          <th scope="col">Label</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  tone?: ChartTone;
  label?: string;
  dataTable?: boolean;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  tone = "primary",
  label,
  dataTable = false,
  className,
  ...props
}: SparklineProps) {
  const points = buildSparklinePoints(data, width, height);
  const trend = getSparklineTrend(data);
  const defaultLabel = `Sparkline chart trending ${trend}`;

  const chart = (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label ?? defaultLabel}
      className={classes("ss-sparkline", `ss-sparkline--${tone}`, className)}
      {...props}
    >
      <polyline className="ss-sparkline__line" points={points} fill="none" />
    </svg>
  );

  if (!dataTable) return chart;

  return (
    <div className="ss-chart">
      {chart}
      <ChartDataTable
        caption={label ?? defaultLabel}
        rows={data.map((value, index) => ({
          label: `Point ${index + 1}`,
          value
        }))}
      />
    </div>
  );
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{ id?: string; label: string; value: number }>;
  tone?: ChartTone;
  orientation?: "vertical" | "horizontal";
  label?: string;
  dataTable?: boolean;
}

export function BarChart({
  data,
  tone = "primary",
  orientation = "vertical",
  label,
  dataTable = false,
  className,
  ...props
}: BarChartProps) {
  const max = Math.max(...data.map((entry) => entry.value), 1);
  const chartLabel = label ?? "Bar chart";

  return (
    <div
      role="img"
      aria-label={chartLabel}
      className={classes(
        "ss-bar-chart",
        `ss-bar-chart--${orientation}`,
        `ss-bar-chart--${tone}`,
        className
      )}
      {...props}
    >
      {data.map((entry, index) => (
        <div key={entry.id ?? `${entry.label}-${index}`} className="ss-bar-chart__item">
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
      {dataTable ? (
        <ChartDataTable
          caption={chartLabel}
          rows={data.map((entry) => ({ label: entry.label, value: entry.value }))}
        />
      ) : null}
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
  dataTable?: boolean;
}

export function LineChart({
  data,
  width = 280,
  height = 120,
  tone = "primary",
  showArea = true,
  label,
  dataTable = false,
  className,
  ...props
}: LineChartProps) {
  const { line, area } = buildLinePath(data, width, height);
  const chartLabel = label ?? "Line chart";

  const chart = (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={chartLabel}
      className={classes("ss-line-chart", `ss-line-chart--${tone}`, className)}
      {...props}
    >
      {showArea ? <path className="ss-line-chart__area" d={area} /> : null}
      <path className="ss-line-chart__line" d={line} fill="none" />
    </svg>
  );

  if (!dataTable) return chart;

  return (
    <div className="ss-chart">
      {chart}
      <ChartDataTable
        caption={chartLabel}
        rows={data.map((value, index) => ({
          label: `Point ${index + 1}`,
          value
        }))}
      />
    </div>
  );
}

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  tone?: ChartTone;
  label?: string;
  size?: number;
  dataTable?: boolean;
}

export function DonutChart({
  value,
  max = 100,
  tone = "primary",
  label,
  size = 72,
  dataTable = false,
  className,
  ...props
}: DonutChartProps) {
  const percent = Math.min(Math.max(value / max, 0), 1);
  const percentLabel = Math.round(percent * 100);
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent);
  const chartLabel = label ?? `Progress ${percentLabel} percent`;

  return (
    <div
      role="img"
      aria-label={chartLabel}
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
      <span className="ss-donut-chart__label">{percentLabel}%</span>
      {dataTable ? (
        <ChartDataTable
          caption={chartLabel}
          rows={[
            { label: "Value", value },
            { label: "Maximum", value: max },
            { label: "Percent", value: `${percentLabel}%` }
          ]}
        />
      ) : null}
    </div>
  );
}
