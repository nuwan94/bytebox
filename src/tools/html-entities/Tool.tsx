"use client";

import { useState } from "react";
import { TransformTool } from "@/components/TransformTool";
import { decodeEntities, encodeEntities } from "./logic";

export default function HtmlEntities() {
  const [allNonAscii, setAllNonAscii] = useState(false);

  return (
    <TransformTool
      id="entities"
      inputLabel="Text or HTML"
      outputLabel="Result"
      sample={`<p class="note">Fish & chips — £5 'today'</p>`}
      idle="Type some text, then press Encode or Decode."
      actions={[
        { label: "Encode", done: "Escaped for HTML.", problem: "", run: (input) => ({ ok: true, output: encodeEntities(input, allNonAscii) }) },
        { label: "Decode", done: "Turned the entities back into characters.", problem: "", run: (input) => ({ ok: true, output: decodeEntities(input) }) },
      ]}
    >
      <label className="check">
        <input type="checkbox" checked={allNonAscii} onChange={(event) => setAllNonAscii(event.target.checked)} />
        Also encode non-ASCII
      </label>
    </TransformTool>
  );
}
