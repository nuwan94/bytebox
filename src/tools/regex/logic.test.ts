import { describe, expect, it } from "vitest";
import { findMatches, toSegments } from "./logic";

describe("findMatches", () => {
  it("finds every match with its position and groups", () => {
    const result = findMatches("(\\w+)@(\\w+)", "", "a@b, cd@ef");
    expect(result).toEqual({
      ok: true,
      capped: false,
      matches: [
        { index: 0, text: "a@b", groups: ["a", "b"] },
        { index: 5, text: "cd@ef", groups: ["cd", "ef"] },
      ],
    });
  });

  it("honours the ignore-case flag", () => {
    const result = findMatches("cat", "i", "Cat cAT dog");
    expect(result.ok && result.matches.length).toBe(2);
  });

  it("returns no matches for an empty pattern", () => {
    expect(findMatches("", "", "anything")).toEqual({ ok: true, matches: [], capped: false });
  });

  it("reports an invalid pattern", () => {
    expect(findMatches("(", "", "text").ok).toBe(false);
  });
});

describe("toSegments", () => {
  it("splits text around the matches", () => {
    const result = findMatches("\\d+", "", "a1bc22d");
    expect(result.ok && toSegments("a1bc22d", result.matches)).toEqual([
      { text: "a", hit: false },
      { text: "1", hit: true },
      { text: "bc", hit: false },
      { text: "22", hit: true },
      { text: "d", hit: false },
    ]);
  });

  it("skips zero-length matches", () => {
    const result = findMatches("x*", "", "ab");
    expect(result.ok && toSegments("ab", result.matches)).toEqual([{ text: "ab", hit: false }]);
  });
});
