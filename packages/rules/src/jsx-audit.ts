import { getAuditRule, isTextLikeNativeInputType } from "./catalog.js";

export type JsxAttributeLike = {
  type: string;
  name?: { type: string; name?: string };
  value?: {
    type: string;
    value?: unknown;
    expression?: { type: string; value?: unknown };
  };
};

export type JsxOpeningElementLike = {
  name: { type: string; name?: string };
  attributes: JsxAttributeLike[];
};

export interface JsxAuditViolation {
  ruleId: string;
  message: string;
}

export const SYNTAX_JSX_RULE_IDS = ["raw-button", "raw-input", "image-alt"] as const;

function readStaticValue(value: { type: string; value?: unknown } | undefined): string | undefined {
  if (!value) return undefined;
  if (value.type === "Literal" || value.type === "StringLiteral") {
    return String(value.value);
  }
  return undefined;
}

export function getJsxAttributeValue(
  node: JsxOpeningElementLike,
  attributeName: string
): string | undefined | null {
  for (const attribute of node.attributes) {
    if (attribute.type !== "JSXAttribute") continue;
    if (attribute.name?.type !== "JSXIdentifier" || attribute.name.name !== attributeName) continue;

    if (!attribute.value) return "";

    const direct = readStaticValue(attribute.value);
    if (direct !== undefined) return direct;

    if (attribute.value.type === "JSXExpressionContainer") {
      const expression = readStaticValue(attribute.value.expression);
      if (expression !== undefined) return expression;
      return null;
    }

    return null;
  }

  return undefined;
}

export function hasJsxAttribute(node: JsxOpeningElementLike, attributeName: string): boolean {
  return node.attributes.some(
    (attribute) =>
      attribute.type === "JSXAttribute" &&
      attribute.name?.type === "JSXIdentifier" &&
      attribute.name.name === attributeName
  );
}

export function hasJsxSpreadAttribute(node: JsxOpeningElementLike): boolean {
  return node.attributes.some((attribute) => attribute.type === "JSXSpreadAttribute");
}

function messageFor(ruleId: string): string {
  return getAuditRule(ruleId)?.message ?? "Super System policy violation.";
}

export function auditJsxOpeningElement(node: JsxOpeningElementLike): JsxAuditViolation[] {
  if (node.name.type !== "JSXIdentifier" || !node.name.name) return [];

  const violations: JsxAuditViolation[] = [];
  const tag = node.name.name;

  if (tag === "button") {
    violations.push({ ruleId: "raw-button", message: messageFor("raw-button") });
  }

  if (tag === "input") {
    const typeValue = getJsxAttributeValue(node, "type");
    if (typeValue !== null && isTextLikeNativeInputType(typeValue)) {
      violations.push({ ruleId: "raw-input", message: messageFor("raw-input") });
    }
  }

  if (tag === "img" && !hasJsxSpreadAttribute(node) && !hasJsxAttribute(node, "alt")) {
    violations.push({ ruleId: "image-alt", message: messageFor("image-alt") });
  }

  return violations;
}
