"use client";

import { useState } from "react";
import { ResultRow } from "@/components/ResultRow";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { parseUrl } from "./logic";

const SAMPLE = "https://user@devtools.nuwan.dev:8443/tools/url-parser/?q=caf%C3%A9+au+lait&tag=a&tag=b#results";

export default function UrlParser() {
  const [text, setText] = useState(SAMPLE);
  const [copyStatus, setCopyStatus] = useState<StatusInfo | null>(null);
  const result = parseUrl(text);

  const count = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const status: StatusInfo =
    copyStatus ??
    (!text.trim()
      ? waiting("Paste a full URL. It is split up as you type.")
      : result.ok
        ? ok(`Found ${count(result.parts.length, "part")} and ${count(result.params.length, "query parameter")}.`)
        : failed(result.error));

  const onCopy = (copied: boolean, label: string) =>
    setCopyStatus(copied ? ok(`Copied the ${label}.`) : failed("The browser blocked copying. Select the value and copy it by hand."));

  return (
    <div>
      <div className="pane" data-color="cobalt">
        <label htmlFor="url-in">URL</label>
        <input id="url-in" className="input" spellCheck={false} value={text} onChange={(event) => { setText(event.target.value); setCopyStatus(null); }} />
      </div>
      {result.ok && (
        <>
          <div className="rows">
            {result.parts.map((part) => (
              <ResultRow key={part.label} label={part.label} value={part.value} onCopy={(copied) => onCopy(copied, part.label.toLowerCase())} />
            ))}
          </div>
          {result.params.length > 0 && (
            <>
              <h2 className="subhead">Query parameters</h2>
              <div className="rows">
                {result.params.map((param, index) => (
                  <ResultRow key={`${param.key}-${index}`} label={param.key || "(empty)"} value={param.value} onCopy={(copied) => onCopy(copied, `value of ${param.key}`)} />
                ))}
              </div>
            </>
          )}
        </>
      )}
      <Status status={status} />
    </div>
  );
}
