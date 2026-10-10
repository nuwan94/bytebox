import { describe, expect, it } from "vitest";
import { diffLines } from "./logic";

describe("diffLines", () => {
  it("marks removed and added lines around unchanged ones", () => {
    expect(diffLines("a\nb\nc", "a\nc\nd")).toEqual({
      ok: true,
      added: 1,
      removed: 1,
      lines: [
        { type: "same", text: "a" },
        { type: "removed", text: "b" },
        { type: "same", text: "c" },
        { type: "added", text: "d" },
      ],
    });
  });

  it("reports identical texts as all the same", () => {
    const result = diffLines("x\ny", "x\ny");
    expect(result).toMatchObject({ ok: true, added: 0, removed: 0 });
  });

  it("treats an empty side as nothing", () => {
    expect(diffLines("", "a\nb")).toMatchObject({ added: 2, removed: 0 });
    expect(diffLines("a\nb", "")).toMatchObject({ added: 0, removed: 2 });
    expect(diffLines("", "")).toEqual({ ok: true, lines: [], added: 0, removed: 0 });
  });

  it("shows a changed line as one removal and one addition", () => {
    expect(diffLines("port: 80", "port: 8080")).toMatchObject({ added: 1, removed: 1 });
  });

  it("refuses texts that are too long", () => {
    const long = Array.from({ length: 2100 }, (_, index) => `line ${index}`).join("\n");
    expect(diffLines(long, long).ok).toBe(false);
  });
});
