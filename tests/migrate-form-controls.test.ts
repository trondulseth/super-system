import { describe, expect, it } from "vitest";
import {
  canTransformNativeInput,
  canTransformNativeSelect,
  canTransformNativeTextarea,
  replaceNativeInput,
  replaceNativeSelect,
  replaceNativeTextarea
} from "../packages/cli/src/migration-form-controls.js";
import { finalizeComponentImports } from "../packages/cli/src/migration-imports.js";

describe("migration form control helpers", () => {
  it("allows text-like inputs and rejects specialized input types", () => {
    expect(canTransformNativeInput('<input type="email" />')).toBe(true);
    expect(canTransformNativeInput("<input />")).toBe(true);
    expect(canTransformNativeInput('<input type="checkbox" />')).toBe(false);
    expect(canTransformNativeInput('<input type="radio" />')).toBe(false);
    expect(canTransformNativeInput("<Input />")).toBe(false);
  });

  it("replaces native form tags with Super System components", () => {
    expect(replaceNativeInput('<input type="email" />')).toBe('<Input type="email" />');
    expect(replaceNativeTextarea("<textarea />")).toBe("<Textarea />");
    expect(replaceNativeSelect("<select><option>A</option></select>")).toBe(
      "<Select><option>A</option></Select>"
    );
  });

  it("detects textarea and select transforms", () => {
    expect(canTransformNativeTextarea("<textarea />")).toBe(true);
    expect(canTransformNativeTextarea("<Textarea />")).toBe(false);
    expect(canTransformNativeSelect("<select />")).toBe(true);
    expect(canTransformNativeSelect("<Select />")).toBe(false);
  });

  it("merges multiple component imports into one statement", () => {
    const content = "<input />\n<textarea />\n";
    const updated = finalizeComponentImports(content, ["Input", "Textarea", "Button"]);
    expect(updated).toContain('import { Button, Input, Textarea } from "@super-system/react"');
  });
});
