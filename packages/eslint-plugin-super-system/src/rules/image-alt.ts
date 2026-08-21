import type { Rule } from "eslint";
import { getAuditRule } from "@super-system/rules";
import { hasJsxAttribute, hasJsxSpreadAttribute, type JsxOpeningElement } from "../jsx-utils.js";

export const imageAltRule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require alt text on img elements."
    },
    schema: [],
    messages: {
      missingAlt: getAuditRule("image-alt")?.message ?? 'Add meaningful alt text or alt="" for decorative images.'
    }
  },
  create(context) {
    return {
      JSXOpeningElement(node: JsxOpeningElement) {
        if (node.name.type !== "JSXIdentifier") return;
        if (node.name.name !== "img") return;
        if (hasJsxSpreadAttribute(node)) return;
        if (hasJsxAttribute(node, "alt")) return;

        context.report({ node, messageId: "missingAlt" });
      }
    };
  }
};
