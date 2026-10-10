import { describe, expect, it } from "vitest";
import { formatJson } from "./logic";

describe("formatJson", () => {
  it("indents with two spaces", () => {
    const result = formatJson('{"a":[1,2]}', 2);
    expect(result).toEqual({ ok: true, output: '{\n  "a": [\n    1,\n    2\n  ]\n}', lines: 6 });
  });

  it("indents with tabs", () => {
    const result = formatJson('{"a":1}', "tab");
    expect(result.ok && result.output).toBe('{\n\t"a": 1\n}');
  });

  it("minifies to one line", () => {
    const result = formatJson('{\n  "a": 1,\n  "b": [true, null]\n}', "none");
    expect(result).toEqual({ ok: true, output: '{"a":1,"b":[true,null]}', lines: 1 });
  });

  it("reports invalid JSON instead of throwing", () => {
    const result = formatJson('{"a":1,}', 2);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.length).toBeGreaterThan(0);
  });
});
