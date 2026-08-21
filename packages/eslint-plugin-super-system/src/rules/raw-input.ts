import type { Rule } from "eslint";
import { getAuditRule, isTextLikeNativeInputType } from "@super-system/rules";
import { getJsxAttributeValue, type JsxOpeningElement } from "../jsx-utils.js";

export const rawInputRule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow native text-like <input> elements; use Super System Input instead."
    },
    schema: [],
    messages: {
      useInput: getAuditRule("raw-input")?.message ?? "Use the shared Input component for text-like controls."
    }
  },
  create(context) {
    return {
      JSXOpeningElement(node: JsxOpeningElement) {
        if (node.name.type !== "JSXIdentifier") return;
        if (node.name.name !== "input") return;

        const typeValue = getJsxAttributeValue(node, "type");
        if (typeValue === null) return;
        if (!isTextLikeNativeInputType(typeValue)) return;

        context.report({ node, messageId: "useInput" });
      }
    };
  }
};
