"use client";

import { useState } from "react";
import { ResultRow } from "@/components/ResultRow";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { describeInteger, parseInteger, type Base } from "./logic";

export default function NumberBases() {
  const [input, setInput] = useState("255");
  const [base, setBase] = useState<Base>(10);
  const [copied, setCopied] = useState<StatusInfo | null>(null);

  const result = input.trim() ? parseInteger(input, base) : null;
  const forms = result?.ok ? describeInteger(result.value) : null;

  let status: StatusInfo;
  if (!result) status = waiting("Type a whole number and pick the base it's written in.");
  else if (!result.ok) status = failed(`That number can't be read. ${result.error}`);
  else status = copied ?? { tone: "ok", text: "Converted. Whole numbers of any size work.", cat: "idle" };

  const onCopy = (done: boolean, label: string) =>
    setCopied(done ? ok(`Copied the ${label.toLowerCase()} value.`) : failed("The browser blocked copying. Select the value and copy it by hand."));

  return (
    <div>
      <div className="pane" data-color="sun">
        <label htmlFor="base-in">Number</label>
        <input id="base-in" className="input" spellCheck={false} value={input} onChange={(event) => { setInput(event.target.value); setCopied(null); }} />
      </div>
      <div className="options options-row">
        <label className="check" htmlFor="base-from">Written in</label>
        <select id="base-from" value={base} onChange={(event) => { setBase(Number(event.target.value) as Base); setCopied(null); }}>
          <option value="10">Decimal</option>
          <option value="16">Hex</option>
          <option value="2">Binary</option>
          <option value="8">Octal</option>
        </select>
      </div>
      {forms && (
        <div className="rows">
          <ResultRow label="Decimal" value={forms.decimal} onCopy={onCopy} />
          <ResultRow label="Hex" value={forms.hex} onCopy={onCopy} />
          <ResultRow label="Binary" value={forms.binary} onCopy={onCopy} />
          <ResultRow label="Octal" value={forms.octal} onCopy={onCopy} />
        </div>
      )}
      <Status status={status} />
    </div>
  );
}
