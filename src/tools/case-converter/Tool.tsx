"use client";

import { useState } from "react";
import { ResultRow } from "@/components/ResultRow";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { toCases } from "./logic";

const IDLE = waiting("Type a name or phrase. Every case updates as you type.");
const ROWS = [
  ["Camel", "camel"],
  ["Pascal", "pascal"],
  ["Snake", "snake"],
  ["Kebab", "kebab"],
  ["Constant", "constant"],
  ["Title", "title"],
] as const;

export default function CaseConverter() {
  const [text, setText] = useState("user profile page");
  const [status, setStatus] = useState<StatusInfo>(IDLE);
  const cases = toCases(text);

  return (
    <div>
      <div className="pane" data-color="mint">
        <label htmlFor="case-in">Name or phrase</label>
        <input id="case-in" className="input" spellCheck={false} value={text} onChange={(event) => { setText(event.target.value); setStatus(IDLE); }} />
      </div>
      <div className="rows">
        {ROWS.map(([label, key]) => (
          <ResultRow
            key={key}
            label={label}
            value={cases[key]}
            onCopy={(copied) => setStatus(copied ? ok(`Copied the ${label.toLowerCase()} case version.`) : failed("The browser blocked copying. Select the text and copy it by hand."))}
          />
        ))}
      </div>
      <Status status={status} />
    </div>
  );
}
