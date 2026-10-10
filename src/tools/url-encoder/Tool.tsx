"use client";

import { useState } from "react";
import { TransformTool } from "@/components/TransformTool";
import { decodeUrl, encodeUrl } from "./logic";

export default function UrlEncoder() {
  const [keepStructure, setKeepStructure] = useState(false);

  return (
    <TransformTool
      id="url"
      inputLabel="Text or URL"
      outputLabel="Result"
      sample="name=Byte Box&tags=json,uuid&note=100% local"
      idle="Type some text, then press Encode or Decode."
      actions={[
        { label: "Encode", done: "Encoded for a URL.", problem: "That can't be encoded.", run: (input) => encodeUrl(input, keepStructure) },
        { label: "Decode", done: "Decoded back to text.", problem: "That can't be decoded.", run: (input) => decodeUrl(input, keepStructure) },
      ]}
    >
      <label className="check">
        <input type="checkbox" checked={keepStructure} onChange={(event) => setKeepStructure(event.target.checked)} />
        Keep : / ? & = as they are
      </label>
    </TransformTool>
  );
}
