import { describe, expect, it } from "vitest";
import { makeLorem, MAX_PARAGRAPHS } from "./logic";

describe("makeLorem", () => {
  it("makes the requested number of paragraphs", () => {
    expect(makeLorem(4, 1).split("\n\n")).toHaveLength(4);
  });

  it("opens with the traditional words", () => {
    expect(makeLorem(2, 99)).toMatch(/^Lorem ipsum dolor sit amet /);
  });

  it("writes sentences that start with a capital and end with a full stop", () => {
    for (const paragraph of makeLorem(3, 7).split("\n\n")) {
      for (const sentence of paragraph.split(". ")) expect(sentence).toMatch(/^[A-Z][a-z ]+\.?$/);
      expect(paragraph.endsWith(".")).toBe(true);
    }
  });

  it("is repeatable for a seed and different across seeds", () => {
    expect(makeLorem(2, 5)).toBe(makeLorem(2, 5));
    expect(makeLorem(2, 5)).not.toBe(makeLorem(2, 6));
  });

  it("clamps the paragraph count", () => {
    expect(makeLorem(0, 1).split("\n\n")).toHaveLength(1);
    expect(makeLorem(500, 1).split("\n\n")).toHaveLength(MAX_PARAGRAPHS);
  });
});
