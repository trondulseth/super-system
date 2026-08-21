import type { Rule } from "eslint";

export type JsxOpeningElement = Rule.Node & {
  name: { type: string; name?: string };
  attributes: JsxAttributeLike[];
};

type JsxAttributeLike = {
  type: string;
  name?: { type: string; name?: string };
  value?: {
    type: string;
    value?: unknown;
    expression?: { type: string; value?: unknown };
  };
};

export function getJsxAttributeValue(
  node: JsxOpeningElement,
  attributeName: string
): string | undefined | null {
  for (const attribute of node.attributes) {
    if (attribute.type !== "JSXAttribute") continue;
    if (attribute.name?.type !== "JSXIdentifier" || attribute.name.name !== attributeName) continue;

    if (!attribute.value) return "";

    if (attribute.value.type === "Literal") {
      return String(attribute.value.value);
    }

    if (
      attribute.value.type === "JSXExpressionContainer" &&
      attribute.value.expression?.type === "Literal"
    ) {
      return String(attribute.value.expression.value);
    }

    return null;
  }

  return undefined;
}

export function hasJsxAttribute(node: JsxOpeningElement, attributeName: string): boolean {
  return node.attributes.some(
    (attribute) =>
      attribute.type === "JSXAttribute" &&
      attribute.name?.type === "JSXIdentifier" &&
      attribute.name.name === attributeName
  );
}

export function hasJsxSpreadAttribute(node: JsxOpeningElement): boolean {
  return node.attributes.some((attribute) => attribute.type === "JSXSpreadAttribute");
}
