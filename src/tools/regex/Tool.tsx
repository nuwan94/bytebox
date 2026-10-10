"use client";

import { useState } from "react";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { MATCH_LIMIT, toSegments } from "./logic";
import { TIME_LIMIT_MS, useMatches } from "./useMatches";
import { COMMON_PATTERNS, PIECES, SAMPLE_TEXT } from "./patterns";

const FLAGS = [
  { flag: "i", label: "Ignore case" },
  { flag: "m", label: "^ and $ match each line" },
  { flag: "s", label: ". matches line breaks" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState(COMMON_PATTERNS[3].pattern);
  const [flags, setFlags] = useState("");
  const [text, setText] = useState(SAMPLE_TEXT);

  const { result, timedOut } = useMatches(pattern, flags, text);
  const segments = result.ok ? toSegments(text, result.matches) : [{ text, hit: false }];

  let status: StatusInfo;
  if (timedOut) status = failed(`That pattern took more than ${TIME_LIMIT_MS / 1000} seconds on this text, so it was stopped. A repeat inside a repeat, like (a+)+, is the usual cause.`);
  else if (!result.ok) status = failed(`That pattern doesn't compile. ${result.error}`);
  else if (!pattern) status = waiting("Pick a common pattern or type your own.");
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
      <div className="builder">
        <h2 id="regex-common">Start from a common pattern</h2>
        <div className="chips" role="group" aria-labelledby="regex-common">
          {COMMON_PATTERNS.map((item) => (
            <button key={item.name} aria-pressed={pattern === item.pattern} onClick={() => setPattern(item.pattern)}>
              {item.name}
            </button>
          ))}
        </div>
        <h2 id="regex-pieces">Add a piece to the end</h2>
        <div className="chips" role="group" aria-labelledby="regex-pieces">
          {PIECES.map((piece) => (
            <button key={piece.name} onClick={() => setPattern((current) => current + piece.insert)}>
              {piece.name} <code>{piece.insert}</code>
            </button>
          ))}
          <button className="chip-plain" onClick={() => setPattern("")}>Clear pattern</button>
        </div>
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
