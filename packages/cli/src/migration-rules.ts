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
    pattern: /<button\b/,
    message: "Use the shared Button component.",
    confidence: "medium",
    mode: "auto",
    transformId: "native-button-to-button",
    plannedAction: "Replace native <button> with <Button> from @super-system/react.",
    assumption: "The control is a standard button without custom non-DOM behavior."
  },
  {
    rule: "raw-input",
    pattern: /<input\b/,
    message: "Use the shared Input component for text-like controls.",
    confidence: "low",
    mode: "manual",
    plannedAction: "Replace native <input> with <Input> when the control is a standard text-like field.",
    assumption: "Checkbox, radio, file, hidden, and submit inputs need different Super System components."
  },
  {
    rule: "raw-textarea",
    pattern: /<textarea\b/,
    message: "Use the shared Textarea component.",
    confidence: "medium",
    mode: "manual",
    plannedAction: "Replace native <textarea> with <Textarea> from @super-system/react.",
    assumption: "The control is a standard textarea without custom non-DOM behavior."
  },
  {
    rule: "raw-select",
    pattern: /<select\b/,
    message: "Use the shared Select component.",
    confidence: "medium",
    mode: "manual",
    plannedAction: "Replace native <select> with <Select> from @super-system/react.",
    assumption: "The control is a standard select without custom non-DOM behavior."
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
