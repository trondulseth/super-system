import { describe, expect, it } from "vitest";
import {
  findSuppressionNearLine,
  parseSuppressionComment,
  SUPPRESSION_MIN_JUSTIFICATION_LENGTH
} from "../packages/rules/src/suppressions.js";

describe("inline suppressions", () => {
  it("parses rule-specific suppressions with justification", () => {
    const parsed = parseSuppressionComment("// super-system-ignore raw-button: Legacy checkout until Q2 migration");
    expect(parsed?.ruleId).toBe("raw-button");
    expect(parsed?.justification).toContain("Legacy checkout");
  });

  it("rejects short justifications", () => {
    expect(parseSuppressionComment("// super-system-ignore raw-button: short")).toBeNull();
  });

  it("supports wildcard rule suppressions", () => {
    const source = [
      "// super-system-ignore *: Third-party embed we cannot refactor yet",
      "<button>Save</button>"
    ].join("\n");
    expect(findSuppressionNearLine(source, 2, "raw-button")?.ruleId).toBe("*");
  });

  it("reads suppressions from the line above the violation", () => {
    const source = [
      "// super-system-ignore image-alt: Decorative hero background only",
      '<img src="/hero.png" />'
    ].join("\n");
    expect(findSuppressionNearLine(source, 2, "image-alt")).not.toBeNull();
    expect(findSuppressionNearLine(source, 2, "raw-button")).toBeNull();
  });

  it("documents minimum justification length", () => {
    expect(SUPPRESSION_MIN_JUSTIFICATION_LENGTH).toBeGreaterThanOrEqual(8);
  });
});
