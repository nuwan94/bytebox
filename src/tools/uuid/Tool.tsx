"use client";

import { useState } from "react";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { copyText } from "@/lib/copy";
import { makeUuids, MAX_UUIDS } from "./logic";

const IDLE = waiting("Pick how many you need, then press Make UUIDs.");

export default function UuidMaker() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [ids, setIds] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusInfo>(IDLE);
  const [party, setParty] = useState(0);

  function make() {
    const made = makeUuids(count, { uppercase, hyphens });
    setIds(made);
    setCount(made.length);
    setParty((value) => value + 1);
    setStatus(ok(`Made ${made.length} ${made.length === 1 ? "UUID" : "UUIDs"}.`));
  }

  async function copy() {
    if (ids.length === 0) return setStatus({ tone: "idle", text: "Nothing to copy yet. Make some first.", cat: "idle" });
    setStatus((await copyText(ids.join("\n"))) ? ok("Copied them all, one per line.") : failed("The browser blocked copying. Select the list and copy it by hand."));
  }

  return (
    <div>
      <div className="actions">
        <button className="btn btn-primary" onClick={make}>Make UUIDs</button>
        <button className="btn" onClick={copy}>Copy all</button>
        <div className="options">
          <label className="check" htmlFor="uuid-count">How many</label>
          <input id="uuid-count" className="input input-small" type="number" min={1} max={MAX_UUIDS} value={count} onChange={(event) => setCount(Number(event.target.value))} />
          <label className="check">
            <input type="checkbox" checked={uppercase} onChange={(event) => setUppercase(event.target.checked)} />
            Uppercase
          </label>
          <label className="check">
            <input type="checkbox" checked={hyphens} onChange={(event) => setHyphens(event.target.checked)} />
            Hyphens
          </label>
        </div>
      </div>
      <div className="pane" data-color="tang">
        <label htmlFor="uuid-out">UUIDs</label>
        <textarea id="uuid-out" spellCheck={false} readOnly value={ids.join("\n")} />
      </div>
      <Status status={status} party={party} />
    </div>
  );
}
