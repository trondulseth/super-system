import type { Rule } from "eslint";
import { auditJsxOpeningElement, getAuditRule, type JsxOpeningElementLike } from "@super-system/rules";

function toJsxOpeningElementLike(node: Rule.Node): JsxOpeningElementLike {
  const element = node as JsxOpeningElementLike & Rule.Node;
  return {
    name: element.name,
    attributes: element.attributes
  };
}

function createJsxRule(ruleId: string, messageId: string): Rule.RuleModule {
  return {
    meta: {
      type: "problem",
      docs: {
        description: `Super System ${ruleId} policy`
      },
      schema: [],
      messages: {
        [messageId]: getAuditRule(ruleId)?.message ?? "Super System policy violation."
      }
    },
    create(context) {
      return {
        JSXOpeningElement(node: Rule.Node) {
          for (const violation of auditJsxOpeningElement(toJsxOpeningElementLike(node))) {
            if (violation.ruleId !== ruleId) continue;
            context.report({ node, messageId });
          }
        }
      };
    }
  };
}

export const rawButtonRule = createJsxRule("raw-button", "useButton");
export const rawInputRule = createJsxRule("raw-input", "useInput");
export const imageAltRule = createJsxRule("image-alt", "missingAlt");
