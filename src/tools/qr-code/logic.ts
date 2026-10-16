import QRCode from "qrcode";
import type { TextResult } from "../types";

export type Level = "L" | "M" | "Q" | "H";

export const LEVELS: { level: Level; label: string }[] = [
  { level: "L", label: "Low (7%)" },
  { level: "M", label: "Medium (15%)" },
  { level: "Q", label: "Quartile (25%)" },
  { level: "H", label: "High (30%)" },
];

const options = (level: Level) => ({ errorCorrectionLevel: level, margin: 2, color: { dark: "#000000", light: "#ffffff" } });

const problem = (error: unknown) =>
  error instanceof Error && /too big|amount of data/i.test(error.message)
    ? "That is too much text for one QR code at this level. Shorten it or choose a lower level."
    : error instanceof Error
      ? error.message
      : String(error);

/** Returns the QR code as SVG markup. */
export async function makeQrSvg(text: string, level: Level): Promise<TextResult> {
  if (!text) return { ok: false, error: "There's nothing to encode." };
  try {
    return { ok: true, output: await QRCode.toString(text, { ...options(level), type: "svg" }) };
  } catch (error) {
    return { ok: false, error: problem(error) };
  }
}

/** Returns the QR code as a PNG data URL, for downloading. */
export async function makeQrPng(text: string, level: Level): Promise<TextResult> {
  try {
    return { ok: true, output: await QRCode.toDataURL(text, { ...options(level), width: 1024 }) };
  } catch (error) {
    return { ok: false, error: problem(error) };
  }
}
