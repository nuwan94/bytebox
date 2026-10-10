import { describe, expect, it } from "vitest";
import { formatColour, parseColour } from "./logic";

const convert = (input: string) => {
  const result = parseColour(input);
  return result.ok ? formatColour(result.rgb) : result.error;
};

describe("colour converter", () => {
  it("converts hex to every format", () => {
    expect(convert("#ff0000")).toEqual({ hex: "#ff0000", rgb: "rgb(255, 0, 0)", hsl: "hsl(0, 100%, 50%)" });
    expect(convert("#808080")).toEqual({ hex: "#808080", rgb: "rgb(128, 128, 128)", hsl: "hsl(0, 0%, 50%)" });
  });

  it("expands short hex and accepts it without the hash or in capitals", () => {
    expect(convert("#fd0")).toEqual({ hex: "#ffdd00", rgb: "rgb(255, 221, 0)", hsl: "hsl(52, 100%, 50%)" });
    expect(convert("FFDD00")).toEqual(convert("#fd0"));
  });

  it("reads rgb with commas or spaces", () => {
    expect(convert("rgb(0, 128, 255)")).toEqual(convert("rgb(0 128 255)"));
    expect(convert("rgb(0, 128, 255)")).toMatchObject({ hex: "#0080ff" });
  });

  it("reads hsl, including the 360 degree wrap", () => {
    expect(convert("hsl(120, 100%, 50%)")).toMatchObject({ hex: "#00ff00" });
    expect(convert("hsl(240 100% 50%)")).toMatchObject({ hex: "#0000ff" });
    expect(convert("hsl(360, 100%, 50%)")).toMatchObject({ hex: "#ff0000" });
  });

  it("explains out-of-range and unreadable input", () => {
    expect(convert("rgb(256, 0, 0)")).toBe("RGB values go from 0 to 255.");
    expect(convert("hsl(10, 120%, 50%)")).toMatch(/Hue goes up to 360/);
    expect(convert("salmon-ish")).toMatch(/Use a form like/);
  });
});
