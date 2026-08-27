import { parse, type ParserPlugin } from "@babel/parser";
import {
  auditJsxOpeningElement,
  findSuppressionNearLine,
  SYNTAX_JSX_RULE_IDS,
  type JsxOpeningElementLike
} from "@super-system/rules";
import type { Finding } from "./audit.js";

type BabelNode = {
  type: string;
  start?: number | null;
  end?: number | null;
  loc?: { start: { line: number; column: number } } | null;
  name?: { type: string; name?: string };
  attributes?: BabelNode[];
  [key: string]: unknown;
};

const JSX_SOURCE_EXTENSIONS = new Set([".tsx", ".jsx", ".ts", ".js"]);
const SYNTAX_JSX_RULE_SET = new Set<string>(SYNTAX_JSX_RULE_IDS);

export function supportsSyntaxJsxAudit(filePath: string): boolean {
  const extension = filePath.slice(filePath.lastIndexOf("."));
  return JSX_SOURCE_EXTENSIONS.has(extension);
}

export function isSyntaxJsxRule(ruleId: string): boolean {
  return SYNTAX_JSX_RULE_SET.has(ruleId);
}

function parserPlugins(filePath: string): ParserPlugin[] {
  const plugins: ParserPlugin[] = ["jsx"];
  if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
    plugins.push("typescript");
  }
  return plugins;
}

function toJsxOpeningElementLike(node: BabelNode): JsxOpeningElementLike {
  return {
    name: node.name ?? { type: "Unknown" },
    attributes: (node.attributes ?? []) as JsxOpeningElementLike["attributes"]
  };
}

function walk(node: BabelNode, visit: (node: BabelNode) => void): void {
  visit(node);
  for (const value of Object.values(node)) {
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry && typeof entry === "object" && "type" in (entry as BabelNode)) {
          walk(entry as BabelNode, visit);
        }
      }
      continue;
    }
    if (typeof value === "object" && "type" in (value as BabelNode)) {
      walk(value as BabelNode, visit);
    }
  }
}

export interface JsxAuditResult {
  findings: Finding[];
  /** False when the file could not be parsed; callers should fall back to line-based JSX rules. */
  parsed: boolean;
}

export function auditJsxFile(content: string, relativePath: string): JsxAuditResult {
  if (!supportsSyntaxJsxAudit(relativePath)) {
    return { findings: [], parsed: false };
  }

  let program: BabelNode;
  try {
    program = parse(content, {
      sourceType: "module",
      allowReturnOutsideFunction: true,
      errorRecovery: true,
      plugins: parserPlugins(relativePath)
    }) as unknown as BabelNode;
  } catch {
    return { findings: [], parsed: false };
  }

  const findings: Finding[] = [];
  walk(program, (node) => {
    if (node.type !== "JSXOpeningElement" || !node.loc) return;

    for (const violation of auditJsxOpeningElement(toJsxOpeningElementLike(node))) {
      if (findSuppressionNearLine(content, node.loc.start.line, violation.ruleId)) continue;
      findings.push({
        rule: violation.ruleId,
        file: relativePath,
        line: node.loc.start.line,
        message: violation.message
      });
    }
  });

  return { findings, parsed: true };
}
