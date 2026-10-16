import { describe, expect, it } from "vitest";
import { jsonToTypeScript } from "./logic";

const ts = (json: string) => {
  const result = jsonToTypeScript(json);
  return result.ok ? result.output : `ERROR ${result.error}`;
};

describe("jsonToTypeScript", () => {
  it("describes nested objects, arrays and nulls", () => {
    const json = '{"id":1,"name":"a","tags":["x"],"owner":{"login":"n"},"items":[{"a":1},{"a":2,"b":"x"}],"note":null}';
    expect(ts(json)).toBe(
      [
        "export interface Root {",
        "  id: number;",
        "  name: string;",
        "  tags: string[];",
        "  owner: Owner;",
        "  items: Item[];",
        "  note: null;",
        "}",
        "",
        "export interface Owner {",
        "  login: string;",
        "}",
        "",
        "export interface Item {",
        "  a: number;",
        "  b?: string;",
        "}",
        "",
      ].join("\n"),
    );
  });

  it("writes unions for mixed arrays and unknown for empty ones", () => {
    expect(ts('{"mixed":[1,"a"],"empty":[]}')).toContain("  mixed: (number | string)[];\n  empty: unknown[];");
  });

  it("quotes keys that aren't identifiers and keeps names unique", () => {
    const output = ts('{"first-name":"a","user":{"id":1},"other":{"user":{"name":"b"}}}');
    expect(output).toContain('  "first-name": string;');
    expect(output).toContain("export interface User {");
    expect(output).toContain("export interface User2 {");
  });

  it("handles a top-level array", () => {
    expect(ts('[{"id":1},{"id":2}]')).toBe("export type Root = Item[];\n\nexport interface Item {\n  id: number;\n}\n");
  });

  it("reports invalid JSON", () => {
    expect(ts("{nope")).toMatch(/^ERROR /);
  });
});
