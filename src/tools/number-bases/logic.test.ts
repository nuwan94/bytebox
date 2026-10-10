import { describe, expect, it } from "vitest";
import { describeInteger, parseInteger, type Base } from "./logic";

const convert = (input: string, base: Base) => {
  const result = parseInteger(input, base);
  return result.ok ? describeInteger(result.value) : result.error;
};

describe("number bases", () => {
  it("converts decimal to every base", () => {
    expect(convert("255", 10)).toEqual({ binary: "11111111", octal: "377", decimal: "255", hex: "ff" });
  });

  it("reads each base, with prefixes, capitals and separators", () => {
    expect(convert("0xFF", 16)).toMatchObject({ decimal: "255" });
    expect(convert("1111 1111", 2)).toMatchObject({ decimal: "255" });
    expect(convert("0o377", 8)).toMatchObject({ decimal: "255" });
    expect(convert("1_000_000", 10)).toMatchObject({ hex: "f4240" });
  });

  it("keeps full precision beyond 64 bits", () => {
    expect(convert("ffffffffffffffffffff", 16)).toMatchObject({ decimal: "1208925819614629174706175" });
  });

  it("handles negative numbers", () => {
    expect(convert("-10", 10)).toEqual({ binary: "-1010", octal: "-12", decimal: "-10", hex: "-a" });
  });

  it("explains wrong digits and empty input", () => {
    expect(convert("102", 2)).toBe("It has characters that aren't binary digits.");
    expect(convert("12.5", 10)).toBe("It has characters that aren't decimal digits.");
    expect(convert(" ", 10)).toBe("There's no number to convert.");
  });
});
