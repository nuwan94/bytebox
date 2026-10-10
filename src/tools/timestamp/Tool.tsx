"use client";

import { useState } from "react";
import { ResultRow } from "@/components/ResultRow";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { describeMoment, parseMoment, type ReadAs } from "./logic";

const IDLE = waiting("Type a Unix time or a date, then press Convert.");
const READ_AS: Record<ReadAs, string> = {
  seconds: "Read as seconds since 1970.",
  milliseconds: "Read as milliseconds since 1970.",
  date: "Read as a date.",
};

export default function Timestamp() {
  const [input, setInput] = useState("1700000000");
  const [ms, setMs] = useState<number | null>(null);
  const [status, setStatus] = useState<StatusInfo>(IDLE);
  const [party, setParty] = useState(0);

  function convert(text: string) {
    const result = parseMoment(text);
    if (!result.ok) {
      setMs(null);
      return setStatus(failed(`That can't be converted. ${result.error}`));
    }
    setMs(result.ms);
    setParty((count) => count + 1);
    setStatus(ok(READ_AS[result.readAs]));
  }

  function fillNow() {
    const now = String(Math.floor(Date.now() / 1000));
    setInput(now);
    convert(now);
  }

  const onCopy = (copied: boolean, label: string) =>
    setStatus(copied ? ok(`Copied the ${label.toLowerCase()} value.`) : failed("The browser blocked copying. Select the value and copy it by hand."));

  const moment = ms === null ? null : describeMoment(ms);

  return (
    <div>
      <div className="pane" data-color="gum">
        <label htmlFor="time-in">Unix time or date</label>
        <input
          id="time-in"
          className="input"
          spellCheck={false}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && convert(input)}
        />
      </div>
      <div className="actions actions-below">
        <button className="btn btn-primary" onClick={() => convert(input)}>Convert</button>
        <button className="btn" onClick={fillNow}>Use the time now</button>
      </div>
      {moment && ms !== null && (
        <div className="rows">
          <ResultRow label="UTC" value={moment.iso} onCopy={onCopy} />
          <ResultRow label="Local" value={new Date(ms).toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" })} onCopy={onCopy} />
          <ResultRow label="Seconds" value={moment.seconds} onCopy={onCopy} />
          <ResultRow label="Milliseconds" value={moment.milliseconds} onCopy={onCopy} />
        </div>
      )}
      <Status status={status} party={party} />
    </div>
  );
}
