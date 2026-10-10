export type DiffLine = { type: "same" | "added" | "removed"; text: string };

export type DiffResult =
  | { ok: true; lines: DiffLine[]; added: number; removed: number }
  | { ok: false; error: string };

// The comparison table has one cell per pair of lines, so cap its size.
export const MAX_CELLS = 4_000_000;

const toLines = (text: string) => (text === "" ? [] : text.split(/\r?\n/));

/** Compares two texts line by line using the longest common subsequence. */
export function diffLines(before: string, after: string): DiffResult {
  const a = toLines(before);
  const b = toLines(after);
  if (a.length * b.length > MAX_CELLS) {
    return { ok: false, error: "These texts are too long to compare here. Try a smaller section." };
  }

  // common[i][j] is the length of the longest common subsequence of a[i..] and b[j..].
  const common = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      common[i][j] = a[i] === b[j] ? common[i + 1][j + 1] + 1 : Math.max(common[i + 1][j], common[i][j + 1]);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      lines.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (common[i + 1][j] >= common[i][j + 1]) {
      lines.push({ type: "removed", text: a[i++] });
    } else {
      lines.push({ type: "added", text: b[j++] });
    }
  }
  while (i < a.length) lines.push({ type: "removed", text: a[i++] });
  while (j < b.length) lines.push({ type: "added", text: b[j++] });

  return {
    ok: true,
    lines,
    added: lines.filter((line) => line.type === "added").length,
    removed: lines.filter((line) => line.type === "removed").length,
  };
}
