/** Minimum characters required in a suppression justification (after the colon). */
export const SUPPRESSION_MIN_JUSTIFICATION_LENGTH = 8;

const SUPPRESSION_PATTERN = /super-system-ignore\s+([a-z0-9*-]+)\s*:\s*(.+)$/i;

export interface ParsedSuppression {
  ruleId: string;
  justification: string;
}

export function parseSuppressionComment(text: string): ParsedSuppression | null {
  const normalized = text.replace(/^\s*\/\*+\s*|\s*\*+\/\s*$/g, "").replace(/^\s*\/\/\s*/, "").trim();
  const match = normalized.match(SUPPRESSION_PATTERN);
  if (!match) return null;

  const ruleId = match[1]!.toLowerCase();
  const justification = match[2]!.trim();
  if (justification.length < SUPPRESSION_MIN_JUSTIFICATION_LENGTH) return null;

  return { ruleId, justification };
}

export function suppressionApplies(parsed: ParsedSuppression, ruleId: string): boolean {
  return parsed.ruleId === "*" || parsed.ruleId === ruleId.toLowerCase();
}

export function findSuppressionInText(text: string, ruleId: string): ParsedSuppression | null {
  for (const segment of text.split(/[\n\r]/)) {
    const parsed = parseSuppressionComment(segment);
    if (parsed && suppressionApplies(parsed, ruleId)) return parsed;
  }
  return null;
}

/** Scan a few lines above a finding (and the finding line) for inline suppressions. */
export function findSuppressionNearLine(content: string, line: number, ruleId: string): ParsedSuppression | null {
  const lines = content.split(/\r?\n/);
  const indexes = [line - 3, line - 2, line - 1].filter((index) => index >= 0 && index < lines.length);
  for (const index of indexes) {
    const parsed = findSuppressionInText(lines[index] ?? "", ruleId);
    if (parsed) return parsed;
  }
  return null;
}

export const SUPPRESSION_HELP = [
  "Use an inline comment on the line above (or same line as) the violation:",
  "  // super-system-ignore raw-button: Legacy markup until checkout migration in Q2",
  "  {/* super-system-ignore image-alt: Decorative divider; parent has aria-hidden */}",
  "",
  `Justification must be at least ${SUPPRESSION_MIN_JUSTIFICATION_LENGTH} characters. Use * as the rule id to suppress all rules on the next line.`
].join("\n");
