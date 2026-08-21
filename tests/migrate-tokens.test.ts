import { describe, expect, it } from "vitest";
import { defaultTheme } from "../packages/tokens/src/index.js";
import {
  applyColorTokenReplacements,
  buildColorTokenIndex,
  findColorLiterals,
  normalizeColor,
  resolveTokenReplacements
} from "../packages/cli/src/migration-tokens.js";

describe("migration token index", () => {
  it("normalizes hex and rgb literals", () => {
    expect(normalizeColor("#2563EB")).toBe("#2563eb");
    expect(normalizeColor("#fff")).toBe("#ffffff");
    expect(normalizeColor("rgb(37, 99, 235)")).toBe("#2563eb");
  });

  it("maps unambiguous theme colors to a single token", () => {
    const index = buildColorTokenIndex(defaultTheme);
    expect(index.get("#2563eb")).toBe("primary");
    expect(index.has("#ff0000")).toBe(false);
  });

  it("resolves replacements only for unambiguous literals", () => {
    const index = buildColorTokenIndex(defaultTheme);
    const replacements = resolveTokenReplacements('color: "#2563eb";', index);
    expect(replacements).toEqual([
      {
        literal: "#2563eb",
        token: "primary",
        cssVar: "var(--ss-color-primary)"
      }
    ]);
  });

  it("replaces all unambiguous literals on a line", () => {
    const index = buildColorTokenIndex(defaultTheme);
    const replacements = resolveTokenReplacements(
      "background: #2563eb; border: #ff0000;",
      index
    );
    expect(replacements).toHaveLength(1);
    expect(applyColorTokenReplacements(
      "background: #2563eb; border: #ff0000;",
      replacements
    )).toBe(
      "background: var(--ss-color-primary); border: #ff0000;"
    );
  });

  it("finds hex and rgb literals in source order", () => {
    const literals = findColorLiterals('fill: rgb(37, 99, 235); stroke: #111827;');
    expect(literals.map((literal) => literal.raw)).toEqual(["rgb(37, 99, 235)", "#111827"]);
  });
});
