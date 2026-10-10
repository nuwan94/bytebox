export type Rgb = { r: number; g: number; b: number };
export type ColourResult = { ok: true; rgb: Rgb } | { ok: false; error: string };

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/;
const RGB = /^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)$/;
const HSL = /^hsla?\(\s*(\d{1,3}(?:\.\d+)?)(?:deg)?\s*[, ]\s*(\d{1,3}(?:\.\d+)?)%\s*[, ]\s*(\d{1,3}(?:\.\d+)?)%\s*\)$/;

export function hslToRgb(h: number, s: number, l: number): Rgb {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const sector = (h % 360) / 60;
  const x = chroma * (1 - Math.abs((sector % 2) - 1));
  const [r, g, b] = [
    [chroma, x, 0],
    [x, chroma, 0],
    [0, chroma, x],
    [0, x, chroma],
    [x, 0, chroma],
    [chroma, 0, x],
  ][Math.floor(sector)];
  const lift = lightness - chroma / 2;
  return { r: Math.round((r + lift) * 255), g: Math.round((g + lift) * 255), b: Math.round((b + lift) * 255) };
}

export function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const [red, green, blue] = [r / 255, g / 255, b / 255];
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  if (delta !== 0) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return { h: (Math.round(hue * 60) + 360) % 360, s: Math.round(saturation * 100), l: Math.round(lightness * 100) };
}

/** Reads #rgb, #rrggbb, rgb(r, g, b) or hsl(h, s%, l%). Alpha is not supported. */
export function parseColour(input: string): ColourResult {
  const text = input.trim().toLowerCase();
  const hex = HEX.exec(text);
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((char) => char + char).join("") : hex[1];
    const value = parseInt(digits, 16);
    return { ok: true, rgb: { r: value >> 16, g: (value >> 8) & 255, b: value & 255 } };
  }
  const rgb = RGB.exec(text);
  if (rgb) {
    const [r, g, b] = rgb.slice(1).map(Number);
    if (r > 255 || g > 255 || b > 255) return { ok: false, error: "RGB values go from 0 to 255." };
    return { ok: true, rgb: { r, g, b } };
  }
  const hsl = HSL.exec(text);
  if (hsl) {
    const [h, s, l] = hsl.slice(1).map(Number);
    if (h > 360 || s > 100 || l > 100) return { ok: false, error: "Hue goes up to 360, and saturation and lightness up to 100%." };
    return { ok: true, rgb: hslToRgb(h, s, l) };
  }
  return { ok: false, error: "Use a form like #ff6fb0, rgb(255, 111, 176) or hsl(333, 100%, 72%)." };
}

export function formatColour(rgb: Rgb) {
  const { h, s, l } = rgbToHsl(rgb);
  return {
    hex: "#" + [rgb.r, rgb.g, rgb.b].map((value) => value.toString(16).padStart(2, "0")).join(""),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
  };
}
