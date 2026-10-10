export type LineOptions = {
  sort: "none" | "asc" | "desc";
  dedupe: boolean;
  trim: boolean;
  dropEmpty: boolean;
};

/** Cleans up a list of lines. Sorting is natural, so "a2" comes before "a10". */
export function tidyLines(text: string, options: LineOptions): string {
  let lines = text.split(/\r?\n/);
  if (options.trim) lines = lines.map((line) => line.trim());
  if (options.dropEmpty) lines = lines.filter((line) => line !== "");
  if (options.dedupe) lines = [...new Set(lines)];
  if (options.sort !== "none") {
    lines = [...lines].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
    if (options.sort === "desc") lines.reverse();
  }
  return lines.join("\n");
}
