import {
  AUDIT_RULE_CATALOG,
  compileAuditPattern,
  getAuditRule,
  type AuditRuleDefinition
} from "@super-system/rules";

export type MigrationConfidence = AuditRuleDefinition["confidence"];
export type MigrationMode = AuditRuleDefinition["mode"];

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

function toMigrationRule(rule: AuditRuleDefinition): MigrationRuleDefinition {
  return {
    rule: rule.id,
    pattern: compileAuditPattern(rule),
    message: rule.message,
    confidence: rule.confidence,
    mode: rule.mode,
    transformId: rule.transformId,
    plannedAction: rule.plannedAction,
    assumption: rule.assumption
  };
}

export const migrationRules: MigrationRuleDefinition[] = AUDIT_RULE_CATALOG.map(toMigrationRule);

export function getMigrationRule(rule: string): MigrationRuleDefinition | undefined {
  const entry = getAuditRule(rule);
  return entry ? toMigrationRule(entry) : undefined;
}
