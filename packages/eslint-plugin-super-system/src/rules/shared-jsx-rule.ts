import type { Rule } from "eslint";
import {
  auditJsxOpeningElement,
  findSuppressionInText,
  findSuppressionNearLine,
  getAuditRule,
  type JsxOpeningElementLike
} from "@super-system/rules";

function toJsxOpeningElementLike(node: Rule.Node): JsxOpeningElementLike {
  const element = node as JsxOpeningElementLike & Rule.Node;
  return {
    name: element.name,
    attributes: element.attributes
  };
}

function isSuppressed(context: Rule.RuleContext, node: Rule.Node, ruleId: string): boolean {
  const sourceCode = context.sourceCode;
  const comments = sourceCode.getCommentsBefore(node);
  for (const comment of comments) {
    if (findSuppressionInText(comment.value, ruleId)) return true;
  }

  const startLine = node.loc?.start.line;
  if (startLine) {
    if (findSuppressionNearLine(sourceCode.getText(), startLine, ruleId)) return true;
  }

  return false;
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
            if (isSuppressed(context, node, ruleId)) continue;
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
