"use client";

import { useState } from "react";
import { TransformTool } from "@/components/TransformTool";
import { jsonToTypeScript } from "./logic";

const SAMPLE = `{
  "id": 42,
  "login": "nuwan",
  "admin": false,
  "tags": ["tools", "web"],
  "profile": { "site": "https://nuwan.dev", "bio": null },
  "repos": [
    { "name": "bytebox", "stars": 12 },
    { "name": "notes", "stars": 3, "archived": true }
  ]
}`;

export default function JsonToTs() {
  const [rootName, setRootName] = useState("Root");

  return (
    <TransformTool
      id="json-to-ts"
      inputLabel="JSON sample"
      outputLabel="TypeScript"
      sample={SAMPLE}
      idle="Paste a JSON sample, then press Make types."
      actions={[
        {
          label: "Make types",
          done: "Wrote the interfaces.",
          problem: "That isn't valid JSON.",
          run: (input) => jsonToTypeScript(input, rootName.trim() || "Root"),
        },
      ]}
    >
      <label className="check">
        Root name
        <input className="input input-small input-name" spellCheck={false} value={rootName} onChange={(event) => setRootName(event.target.value)} />
      </label>
    </TransformTool>
  );
}
