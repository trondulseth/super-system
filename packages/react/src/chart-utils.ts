const SPARKLINE_TREND_EPSILON = 1e-9;

export function getSparklineTrend(values: number[]): "up" | "down" | "flat" {
  if (values.length === 0) return "flat";
  const first = values[0] ?? 0;
  const last = values[values.length - 1] ?? 0;
  if (Math.abs(last - first) < SPARKLINE_TREND_EPSILON) return "flat";
  return last >= first ? "up" : "down";
}

export function normalizeSeries(values: number[]): number[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values.map((value) => (value - min) / range);
}

export function buildSparklinePoints(
  values: number[],
  width: number,
  height: number,
  padding = 2
): string {
  if (values.length === 0) return "";
  const normalized = normalizeSeries(values);
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  return normalized
    .map((value, index) => {
      const x = padding + (index / Math.max(normalized.length - 1, 1)) * innerWidth;
      const y = padding + innerHeight - value * innerHeight;
      return `${x},${y}`;
    })
    .join(" ");
}

export function buildLinePath(
  values: number[],
  width: number,
  height: number,
  padding = 4
): { line: string; area: string } {
  if (values.length === 0) return { line: "", area: "" };
  const normalized = normalizeSeries(values);
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const baseY = padding + innerHeight;

  const points = normalized.map((value, index) => {
    const x = padding + (index / Math.max(normalized.length - 1, 1)) * innerWidth;
    const y = padding + innerHeight - value * innerHeight;
    return { x, y };
  });

  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${points[points.length - 1]?.x ?? padding},${baseY} L${points[0]?.x ?? padding},${baseY} Z`;
  return { line, area };
}
