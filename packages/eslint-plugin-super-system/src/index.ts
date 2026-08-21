import type { ESLint } from "eslint";
import { getAuditRule } from "@super-system/rules";
import { rawButtonRule } from "./rules/raw-button.js";

const plugin: ESLint.Plugin = {
  meta: {
    name: "eslint-plugin-super-system",
    version: "0.1.0-beta.16"
  },
  rules: {
    "raw-button": rawButtonRule
  }
};

plugin.configs = {
  recommended: {
    plugins: {
      "super-system": plugin
    },
    rules: {
      "super-system/raw-button": "warn"
    }
  },
  strict: {
    plugins: {
      "super-system": plugin
    },
    rules: {
      "super-system/raw-button": "error"
    }
  }
};

export default plugin;

export function ruleMessage(ruleId: string): string {
  return getAuditRule(ruleId)?.message ?? "Super System policy violation.";
}
