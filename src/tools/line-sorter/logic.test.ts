import { describe, expect, it } from "vitest";
import { tidyLines, type LineOptions } from "./logic";

const off: LineOptions = { sort: "none", dedupe: false, trim: false, dropEmpty: false };

describe("tidyLines", () => {
  it("leaves text alone when every option is off", () => {
    expect(tidyLines(" b \n\na", off)).toBe(" b \n\na");
  });

  it("sorts naturally in both directions", () => {
    expect(tidyLines("b\na10\na2", { ...off, sort: "asc" })).toBe("a2\na10\nb");
    expect(tidyLines("b\na10\na2", { ...off, sort: "desc" })).toBe("b\na10\na2");
  });

  it("trims before removing duplicates and empty lines", () => {
    expect(tidyLines("x \n x\n\n  \ny", { ...off, trim: true, dedupe: true, dropEmpty: true })).toBe("x\ny");
  });

  it("keeps the first of each duplicate in its original place", () => {
    expect(tidyLines("b\na\nb\na", { ...off, dedupe: true })).toBe("b\na");
  });

  it("handles Windows line endings", () => {
    expect(tidyLines("b\r\na", { ...off, sort: "asc" })).toBe("a\nb");
  });
});
