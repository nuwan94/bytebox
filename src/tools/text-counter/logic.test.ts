import { describe, expect, it } from "vitest";
import { countText } from "./logic";

describe("countText", () => {
  it("counts characters, words, lines and UTF-8 bytes", () => {
    expect(countText("héllo wörld\nfoo")).toEqual({ characters: 15, words: 3, lines: 2, bytes: 17 });
  });

  it("counts an emoji as one character and four bytes", () => {
    expect(countText("🪩")).toEqual({ characters: 1, words: 1, lines: 1, bytes: 4 });
  });

  it("returns zeros for empty text", () => {
    expect(countText("")).toEqual({ characters: 0, words: 0, lines: 0, bytes: 0 });
  });
});
