export type AuditConfidence = "high" | "medium" | "low";
export type AuditMode = "auto" | "manual" | "unsupported";
export type AuditSeverity = "off" | "warn" | "error";

export interface AuditRuleDefinition {
  id: string;
  pattern: string;
  flags?: string;
  message: string;
  confidence: AuditConfidence;
  mode: AuditMode;
  transformId?: string;
  plannedAction: string;
  assumption?: string;
  defaultSeverity: AuditSeverity;
}

export const AUDIT_RULE_CATALOG: AuditRuleDefinition[] = [
  {
    id: "raw-button",
    pattern: String.raw`<button\b`,
    message: "Use the shared Button component.",
    confidence: "medium",
    mode: "auto",
    transformId: "native-button-to-button",
    plannedAction: "Replace native <button> with <Button> from @super-system/react.",
    assumption: "The control is a standard button without custom non-DOM behavior.",
    defaultSeverity: "warn"
  },
  {
    id: "raw-input",
    pattern: String.raw`<input\b`,
    message: "Use the shared Input component for text-like controls.",
    confidence: "low",
    mode: "manual",
    plannedAction: "Replace native <input> with <Input> when the control is a standard text-like field.",
    assumption: "Checkbox, radio, file, hidden, and submit inputs need different Super System components.",
    defaultSeverity: "warn"
  },
  {
    id: "raw-textarea",
    pattern: String.raw`<textarea\b`,
    message: "Use the shared Textarea component.",
    confidence: "medium",
    mode: "manual",
    plannedAction: "Replace native <textarea> with <Textarea> from @super-system/react.",
    assumption: "The control is a standard textarea without custom non-DOM behavior.",
    defaultSeverity: "warn"
  },
  {
    id: "raw-select",
    pattern: String.raw`<select\b`,
    message: "Use the shared Select component.",
    confidence: "medium",
    mode: "manual",
    plannedAction: "Replace native <select> with <Select> from @super-system/react.",
    assumption: "The control is a standard select without custom non-DOM behavior.",
    defaultSeverity: "warn"
  },
  {
    id: "hardcoded-color",
    pattern: String.raw`#[0-9a-f]{3,8}\b|rgba?\s*\(`,
    flags: "i",
    message: "Replace hardcoded color with a semantic token.",
    confidence: "low",
    mode: "manual",
    plannedAction: "Map literal colors to semantic tokens from super-system.json or CSS variables.",
    defaultSeverity: "warn"
  },
  {
    id: "arbitrary-spacing",
    pattern: String.raw`(?:p|m|gap|space-[xy])-[trblxy]?\[[^\]]+\]`,
    flags: "i",
    message: "Use the shared spacing scale.",
    confidence: "medium",
    mode: "manual",
    plannedAction: "Replace arbitrary Tailwind spacing utilities with the theme spacing scale.",
    defaultSeverity: "warn"
  },
  {
    id: "inline-style",
    pattern: String.raw`\bstyle\s*=\s*\{\{`,
    flags: "i",
    message: "Prefer a design-system component or tokenized class.",
    confidence: "low",
    mode: "manual",
    plannedAction: "Move inline styles to tokenized classes or shared components.",
    defaultSeverity: "warn"
  },
  {
    id: "image-alt",
    pattern: String.raw`<img\b(?![^>]*\balt=)`,
    flags: "i",
    message: 'Add meaningful alt text or alt="" for decorative images.',
    confidence: "high",
    mode: "auto",
    transformId: "img-add-alt",
    plannedAction: 'Add alt="" for decorative images or a meaningful alt attribute.',
    assumption: "Decorative images can use an empty alt when no label exists in nearby text.",
    defaultSeverity: "error"
  }
];

export function compileAuditPattern(rule: AuditRuleDefinition): RegExp {
  return new RegExp(rule.pattern, rule.flags ?? "");
}

export function getAuditRule(ruleId: string): AuditRuleDefinition | undefined {
  return AUDIT_RULE_CATALOG.find((entry) => entry.id === ruleId);
}

export function listAuditRuleIds(): string[] {
  return AUDIT_RULE_CATALOG.map((entry) => entry.id);
}

export const GENERATED_SECTION_BEGIN = "<!-- super-system:generated begin -->";
export const GENERATED_SECTION_END = "<!-- super-system:generated end -->";
export const ADAPTER_GENERATOR_VERSION = "0.1.0-beta.16";
