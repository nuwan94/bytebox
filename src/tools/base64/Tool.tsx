"use client";

import { useState } from "react";
import { TransformTool } from "@/components/TransformTool";
import { decodeBase64, encodeBase64 } from "./logic";

export default function Base64() {
  const [urlSafe, setUrlSafe] = useState(false);

  return (
    <TransformTool
      id="base64"
      inputLabel="Text or Base64"
      outputLabel="Result"
      sample="Peel a sticker to open a tool."
      idle="Type some text, then press Encode or Decode."
      actions={[
        { label: "Encode", done: "Encoded as Base64.", problem: "", run: (input) => ({ ok: true, output: encodeBase64(input, urlSafe) }) },
        { label: "Decode", done: "Decoded back to text.", problem: "That isn't valid Base64.", run: decodeBase64 },
      ]}
    >
      <label className="check">
        <input type="checkbox" checked={urlSafe} onChange={(event) => setUrlSafe(event.target.checked)} />
        URL-safe when encoding
      </label>
    </TransformTool>
  );
}
