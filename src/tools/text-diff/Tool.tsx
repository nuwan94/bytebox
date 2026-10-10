"use client";

import { useMemo, useState } from "react";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { diffLines } from "./logic";

const BEFORE = 'name: bytebox\nport: 3000\ndebug: true\ntools:\n  - json\n  - base64';
const AFTER = 'name: bytebox\nport: 8080\ntools:\n  - json\n  - base64\n  - uuid';
const MARKS = { same: " ", added: "+", removed: "-" };

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export default function TextDiff() {
  const [before, setBefore] = useState(BEFORE);
  const [after, setAfter] = useState(AFTER);
  const result = useMemo(() => diffLines(before, after), [before, after]);

  let status: StatusInfo;
  if (!result.ok) status = failed(result.error);
  else if (!before && !after) status = waiting("Paste the old text on the left and the new text on the right.");
  else if (result.added + result.removed === 0) status = ok("The two texts are identical.");
  else status = { tone: "ok", text: `${plural(result.added, "line")} added, ${plural(result.removed, "line")} removed.`, cat: "idle" };

  return (
    <div>
      <div className="panes">
        <div className="pane" data-color="gum">
          <label htmlFor="diff-before">Before</label>
          <textarea id="diff-before" className="medium" spellCheck={false} value={before} onChange={(event) => setBefore(event.target.value)} />
        </div>
        <div className="pane" data-color="mint">
          <label htmlFor="diff-after">After</label>
          <textarea id="diff-after" className="medium" spellCheck={false} value={after} onChange={(event) => setAfter(event.target.value)} />
        </div>
      </div>
      {result.ok && result.lines.length > 0 && (
        <div className="pane panes-below" data-color="sun">
          <span className="pane-label">Changes</span>
          <div className="preview diff" aria-label="Line by line comparison">
            {result.lines.map((line, index) => (
              <div key={index} className={`diff-line diff-${line.type}`}>
                <span className="diff-mark" aria-label={line.type}>{MARKS[line.type]}</span>
                {line.text}
              </div>
            ))}
          </div>
        </div>
      )}
      <Status status={status} />
    </div>
  );
}
