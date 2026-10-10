"use client";

import { useState } from "react";
import { Status, waiting } from "@/components/Status";
import { countText } from "./logic";

const SAMPLE = "Small tools for developers.\nThey run in your browser, so nothing you paste gets uploaded.";
const LABELS = [
  ["characters", "Characters"],
  ["words", "Words"],
  ["lines", "Lines"],
  ["bytes", "Bytes (UTF-8)"],
] as const;

export default function TextCounter() {
  const [text, setText] = useState(SAMPLE);
  const counts = countText(text);

  return (
    <div>
      <div className="pane" data-color="cobalt">
        <label htmlFor="count-in">Text to count</label>
        <textarea id="count-in" className="medium" value={text} onChange={(event) => setText(event.target.value)} />
      </div>
      <dl className="stats">
        {LABELS.map(([key, label]) => (
          <div key={key}>
            <dd>{counts[key].toLocaleString("en")}</dd>
            <dt>{label}</dt>
          </div>
        ))}
      </dl>
      <Status status={text ? { tone: "ok", text: "Counted. The numbers update as you type.", cat: "idle" } : waiting("Type or paste text to count it.")} />
    </div>
  );
}
