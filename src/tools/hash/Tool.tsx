"use client";

import { useEffect, useState } from "react";
import { ResultRow } from "@/components/ResultRow";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { ALGORITHMS, hashText, type Algorithm } from "./logic";

const IDLE = waiting("Type or paste text. The hashes update as you type.");

export default function HashMaker() {
  const [text, setText] = useState("bytebox");
  const [hashes, setHashes] = useState<Partial<Record<Algorithm, string>>>({});
  const [status, setStatus] = useState<StatusInfo>(IDLE);

  useEffect(() => {
    let stale = false;
    Promise.all(ALGORITHMS.map((algorithm) => hashText(text, algorithm)))
      .then((values) => {
        if (!stale) setHashes(Object.fromEntries(ALGORITHMS.map((algorithm, index) => [algorithm, values[index]])));
      })
      .catch(() => {
        if (!stale) setStatus(failed("This browser can't compute hashes here. The page needs HTTPS."));
      });
    return () => {
      stale = true;
    };
  }, [text]);

  return (
    <div>
      <div className="pane" data-color="lilac">
        <label htmlFor="hash-in">Text to hash</label>
        <textarea id="hash-in" className="short" spellCheck={false} value={text} onChange={(event) => { setText(event.target.value); setStatus(IDLE); }} />
      </div>
      <div className="rows">
        {ALGORITHMS.map((algorithm) => (
          <ResultRow
            key={algorithm}
            label={algorithm}
            value={hashes[algorithm] ?? ""}
            onCopy={(copied, label) => setStatus(copied ? ok(`Copied the ${label} hash.`) : failed("The browser blocked copying. Select the hash and copy it by hand."))}
          />
        ))}
      </div>
      <Status status={status} />
    </div>
  );
}
