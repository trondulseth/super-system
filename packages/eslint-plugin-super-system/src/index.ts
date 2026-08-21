import type { ESLint } from "eslint";
import { getAuditRule } from "@super-system/rules";
import { imageAltRule } from "./rules/image-alt.js";
import { rawButtonRule } from "./rules/raw-button.js";
import { rawInputRule } from "./rules/raw-input.js";

const plugin: ESLint.Plugin = {
  meta: {
    name: "eslint-plugin-super-system",
    version: "0.1.0-beta.17"
  },
  rules: {
    "raw-button": rawButtonRule,
    "raw-input": rawInputRule,
    "image-alt": imageAltRule
  }
};

const recommendedRules = {
  "super-system/raw-button": "warn",
  "super-system/raw-input": "warn",
  "super-system/image-alt": "error"
} as const;

const strictRules = {
  "super-system/raw-button": "error",
  "super-system/raw-input": "error",
  "super-system/image-alt": "error"
} as const;

plugin.configs = {
  recommended: {
    plugins: {
      "super-system": plugin
    },
    rules: recommendedRules
  },
  strict: {
    plugins: {
      "super-system": plugin
    },
    rules: strictRules
  }
};

export default plugin;

export function ruleMessage(ruleId: string): string {
  return getAuditRule(ruleId)?.message ?? "Super System policy violation.";
}
