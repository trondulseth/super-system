import type { Rule } from "eslint";
import { getAuditRule } from "@super-system/rules";

type JsxOpeningElement = Rule.Node & {
  name: { type: string; name?: string };
};

export const rawButtonRule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow native <button> elements; use Super System Button instead."
    },
    schema: [
      {
        type: "object",
        properties: {
          ignoreComments: { type: "boolean" }
        },
        additionalProperties: false
      }
    ],
    messages: {
      useButton: getAuditRule("raw-button")?.message ?? "Use the shared Button component."
    }
  },
  create(context) {
    return {
      JSXOpeningElement(node: JsxOpeningElement) {
        if (node.name.type !== "JSXIdentifier") return;
        if (node.name.name !== "button") return;
        context.report({ node, messageId: "useButton" });
      }
    };
  }
};
