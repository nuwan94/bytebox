export type Indent = 2 | 4 | "tab";

export type JsonResult =
  | { ok: true; output: string; lines: number }
  | { ok: false; error: string };

/** Re-serialises JSON. Pass "none" as the indent to minify. */
export function formatJson(source: string, indent: Indent | "none"): JsonResult {
  try {
    const space = indent === "none" ? 0 : indent === "tab" ? "\t" : indent;
    const output = JSON.stringify(JSON.parse(source), null, space);
    return { ok: true, output, lines: output.split("\n").length };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
