import { describe, expect, it } from "vitest";
import { isTextLikeNativeInputType } from "../packages/rules/src/index.js";

describe("@super-system/rules input eligibility", () => {
  it("matches migration and ESLint expectations for native input types", () => {
    expect(isTextLikeNativeInputType(undefined)).toBe(true);
    expect(isTextLikeNativeInputType("email")).toBe(true);
    expect(isTextLikeNativeInputType("checkbox")).toBe(false);
    expect(isTextLikeNativeInputType("radio")).toBe(false);
    expect(isTextLikeNativeInputType("submit")).toBe(false);
  });
});
