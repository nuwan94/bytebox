import { describe, expect, it } from "vitest";
import { makeQrPng, makeQrSvg } from "./logic";

describe("QR codes", () => {
  it("makes an SVG", async () => {
    const result = await makeQrSvg("https://devtools.nuwan.dev/", "M");
    expect(result.ok && result.output).toMatch(/^<svg[\s\S]*<\/svg>\s*$/);
  });

  it("makes a PNG data URL", async () => {
    const result = await makeQrPng("hello", "L");
    expect(result.ok && result.output.startsWith("data:image/png;base64,")).toBe(true);
  });

  it("gets denser at higher correction levels", async () => {
    const low = await makeQrSvg("x".repeat(100), "L");
    const high = await makeQrSvg("x".repeat(100), "H");
    const size = (svg: string) => Number(/viewBox="0 0 (\d+)/.exec(svg)?.[1]);
    expect(low.ok && high.ok && size(high.output) > size(low.output)).toBe(true);
  });

  it("explains when the text is too long", async () => {
    expect(await makeQrSvg("x".repeat(3000), "H")).toEqual({
      ok: false,
      error: "That is too much text for one QR code at this level. Shorten it or choose a lower level.",
    });
  });

  it("refuses empty text", async () => {
    expect((await makeQrSvg("", "M")).ok).toBe(false);
  });
});
