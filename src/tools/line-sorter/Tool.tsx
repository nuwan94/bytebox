"use client";

import { useState } from "react";
import { TransformTool } from "@/components/TransformTool";
import { tidyLines, type LineOptions } from "./logic";

const SAMPLE = "pear\napple \nfig\n\napple\nbanana10\nbanana2\n  fig";

export default function LineSorter() {
  const [options, setOptions] = useState<LineOptions>({ sort: "asc", dedupe: true, trim: true, dropEmpty: true });
  const set = (change: Partial<LineOptions>) => setOptions((current) => ({ ...current, ...change }));

  return (
    <TransformTool
      id="lines"
      inputLabel="Lines"
      outputLabel="Result"
      sample={SAMPLE}
      idle="Paste a list, one item per line, then press Tidy lines."
      actions={[{ label: "Tidy lines", done: "Lines tidied.", problem: "", run: (input) => ({ ok: true, output: tidyLines(input, options) }) }]}
    >
      <label className="check" htmlFor="lines-sort">Sort</label>
      <select id="lines-sort" value={options.sort} onChange={(event) => set({ sort: event.target.value as LineOptions["sort"] })}>
        <option value="asc">A to Z</option>
        <option value="desc">Z to A</option>
        <option value="none">Keep order</option>
      </select>
      <label className="check">
        <input type="checkbox" checked={options.trim} onChange={(event) => set({ trim: event.target.checked })} />
        Trim spaces
      </label>
      <label className="check">
        <input type="checkbox" checked={options.dedupe} onChange={(event) => set({ dedupe: event.target.checked })} />
        Remove duplicates
      </label>
      <label className="check">
        <input type="checkbox" checked={options.dropEmpty} onChange={(event) => set({ dropEmpty: event.target.checked })} />
        Remove empty lines
      </label>
    </TransformTool>
  );
}
