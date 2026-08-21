export type MigrationConfidence = "high" | "medium" | "low";
export type MigrationMode = "auto" | "manual" | "unsupported";

export interface MigrationRuleDefinition {
  rule: string;
  pattern: RegExp;
  message: string;
  confidence: MigrationConfidence;
  mode: MigrationMode;
  transformId?: string;
  plannedAction: string;
  assumption?: string;
}

export const migrationRules: MigrationRuleDefinition[] = [
  {
    rule: "raw-button",
    pattern: /<button\b/i,
    message: "Use the shared Button component.",
    confidence: "medium",
    mode: "auto",
    transformId: "native-button-to-button",
    plannedAction: "Replace native <button> with <Button> from @super-system/react.",
    assumption: "The control is a standard button without custom non-DOM behavior."
  },
  {
    rule: "raw-input",
    pattern: /<(input|select|textarea)\b/i,
    message: "Use a shared form component where possible.",
    confidence: "low",
    mode: "manual",
    plannedAction: "Review the control and map it to Input, Select, Textarea, Checkbox, Switch, or Radio."
  },
  {
    rule: "hardcoded-color",
    pattern: /#[0-9a-f]{3,8}\b|rgba?\s*\(/i,
    message: "Replace hardcoded color with a semantic token.",
    confidence: "low",
    mode: "manual",
    plannedAction: "Map literal colors to semantic tokens from super-system.json or CSS variables."
  },
  {
    rule: "arbitrary-spacing",
    pattern: /(?:p|m|gap|space-[xy])-[trblxy]?\[[^\]]+\]/i,
    message: "Use the shared spacing scale.",
    confidence: "medium",
    mode: "manual",
    plannedAction: "Replace arbitrary Tailwind spacing utilities with the theme spacing scale."
  },
  {
    rule: "inline-style",
    pattern: /\bstyle\s*=\s*\{\{/i,
    message: "Prefer a design-system component or tokenized class.",
    confidence: "low",
    mode: "manual",
    plannedAction: "Move inline styles to tokenized classes or shared components."
  },
  {
    rule: "image-alt",
    pattern: /<img\b(?![^>]*\balt=)/i,
    message: 'Add meaningful alt text or alt="" for decorative images.',
    confidence: "high",
    mode: "auto",
    transformId: "img-add-alt",
    plannedAction: 'Add alt="" for decorative images or a meaningful alt attribute.',
    assumption: "Decorative images can use an empty alt when no label exists in nearby text."
  }
];

export function getMigrationRule(rule: string): MigrationRuleDefinition | undefined {
  return migrationRules.find((entry) => entry.rule === rule);
}
