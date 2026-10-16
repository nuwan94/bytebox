import { describe, expect, it } from "vitest";
import { formatSql } from "./logic";

describe("formatSql", () => {
  it("lays out a query with uppercase keywords", () => {
    expect(formatSql("select id,name from users where id=1", "sql", "upper")).toEqual({
      ok: true,
      output: "SELECT\n  id,\n  name\nFROM\n  users\nWHERE\n  id = 1",
    });
  });

  it("can lowercase keywords", () => {
    const result = formatSql("SELECT 1", "postgresql", "lower");
    expect(result.ok && result.output).toBe("select\n  1");
  });

  it("reports text it can't parse", () => {
    expect(formatSql("select (1", "sql", "upper").ok).toBe(false);
  });
});
