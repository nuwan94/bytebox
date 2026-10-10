"use client";

import { useMemo, useState } from "react";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { findMatches, MATCH_LIMIT, toSegments } from "./logic";

const FLAGS = [
  { flag: "i", label: "Ignore case" },
  { flag: "m", label: "^ and $ match each line" },
  { flag: "s", label: ". matches line breaks" },
];

const SAMPLE_TEXT = "Order 1042 shipped on 2026-03-14.\nOrder 1043 is waiting.\nRefund 77 was issued on 2026-03-15.";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\d{4}-\\d{2}-\\d{2}");
  const [flags, setFlags] = useState("");
  const [text, setText] = useState(SAMPLE_TEXT);

  const result = useMemo(() => findMatches(pattern, flags, text), [pattern, flags, text]);
  const segments = result.ok ? toSegments(text, result.matches) : [{ text, hit: false }];

  let status: StatusInfo;
  if (!result.ok) status = failed(`That pattern doesn't compile. ${result.error}`);
  else if (!pattern) status = waiting("Type a pattern to start matching.");
  else if (result.matches.length === 0) status = { tone: "idle", text: "No matches in the sample text.", cat: "idle" };
  else if (result.capped) status = ok(`More than ${MATCH_LIMIT} matches. Showing the first ${MATCH_LIMIT}.`);
  else status = ok(`${result.matches.length} ${result.matches.length === 1 ? "match" : "matches"}.`);

  function toggle(flag: string) {
    setFlags((current) => (current.includes(flag) ? current.replace(flag, "") : current + flag));
  }

  return (
    <div>
      <div className="pane" data-color="sun">
        <label htmlFor="regex-pattern">Pattern</label>
        <input id="regex-pattern" className="input" spellCheck={false} value={pattern} onChange={(event) => setPattern(event.target.value)} />
      </div>
      <div className="options options-row">
        {FLAGS.map(({ flag, label }) => (
          <label className="check" key={flag}>
            <input type="checkbox" checked={flags.includes(flag)} onChange={() => toggle(flag)} />
            {label}
          </label>
        ))}
      </div>
      <div className="panes">
        <div className="pane" data-color="gum">
          <label htmlFor="regex-text">Sample text</label>
          <textarea id="regex-text" className="medium" spellCheck={false} value={text} onChange={(event) => setText(event.target.value)} />
        </div>
        <div className="pane" data-color="mint">
          <span className="pane-label">Matches</span>
          <div className="preview medium" aria-label="Sample text with matches highlighted">
            {segments.map((segment, index) => (segment.hit ? <mark key={index}>{segment.text}</mark> : <span key={index}>{segment.text}</span>))}
          </div>
        </div>
      </div>
      <Status status={status} />
    </div>
  );
}
