"use client";

import { useState } from "react";
import { ResultRow } from "@/components/ResultRow";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { entropyBits, makePassword, MAX_LENGTH, MIN_LENGTH, type PasswordSets, type SetName } from "./logic";

const IDLE = waiting("Choose a length and what to include, then press Make password.");
const SET_LABELS: [SetName, string][] = [
  ["lower", "Lowercase"],
  ["upper", "Uppercase"],
  ["digits", "Digits"],
  ["symbols", "Symbols"],
];

export default function PasswordMaker() {
  const [length, setLength] = useState(20);
  const [sets, setSets] = useState<PasswordSets>({ lower: true, upper: true, digits: true, symbols: true });
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<StatusInfo>(IDLE);
  const [party, setParty] = useState(0);

  function make() {
    const made = makePassword(length, sets);
    if (!made) {
      setPassword("");
      return setStatus(failed("Tick at least one kind of character to include."));
    }
    setPassword(made);
    setLength(made.length);
    setParty((count) => count + 1);
    setStatus(ok(`Made a ${made.length}-character password, about ${entropyBits(made.length, sets)} bits strong. It was made on this device and isn't stored.`));
  }

  return (
    <div>
      <div className="actions">
        <button className="btn btn-primary" onClick={make}>Make password</button>
        <div className="options">
          <label className="check" htmlFor="password-length">Length</label>
          <input id="password-length" className="input input-small" type="number" min={MIN_LENGTH} max={MAX_LENGTH} value={length} onChange={(event) => setLength(Number(event.target.value))} />
          {SET_LABELS.map(([name, label]) => (
            <label className="check" key={name}>
              <input type="checkbox" checked={sets[name]} onChange={(event) => setSets((current) => ({ ...current, [name]: event.target.checked }))} />
              {label}
            </label>
          ))}
        </div>
      </div>
      {password && (
        <div className="rows">
          <ResultRow
            label="Password"
            value={password}
            onCopy={(copied) => setStatus(copied ? ok("Copied the password.") : failed("The browser blocked copying. Select the password and copy it by hand."))}
          />
        </div>
      )}
      <Status status={status} party={party} />
    </div>
  );
}
