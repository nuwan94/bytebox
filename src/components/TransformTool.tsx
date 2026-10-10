"use client";

import { useState, type ReactNode } from "react";
import { copyText } from "@/lib/copy";
import type { TextResult } from "@/tools/types";
import { failed, ok, Status, waiting, type StatusInfo } from "./Status";

export type TransformAction = {
  label: string;
  /** Said by the cat when the action works. */
  done: string;
  /** Prefix for the reason when it fails. */
  problem: string;
  run: (input: string) => TextResult;
};

type Props = {
  id: string;
  inputLabel: string;
  outputLabel: string;
  sample: string;
  idle: string;
  actions: TransformAction[];
  /** Extra controls shown at the end of the button row. */
  children?: ReactNode;
};

/** Shared layout for tools that turn one block of text into another. */
export function TransformTool({ id, inputLabel, outputLabel, sample, idle, actions, children }: Props) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<StatusInfo>(waiting(idle));
  const [party, setParty] = useState(0);

  function run(action: TransformAction) {
    if (!input) return setStatus(waiting(idle));
    const result = action.run(input);
    if (!result.ok) {
      setOutput("");
      return setStatus(failed(`${action.problem} ${result.error}`));
    }
    setOutput(result.output);
    setParty((count) => count + 1);
    setStatus(ok(action.done));
  }

  async function copy() {
    if (!output) return setStatus({ tone: "idle", text: "Nothing to copy yet.", cat: "idle" });
    setStatus((await copyText(output)) ? ok("Copied the result.") : failed("The browser blocked copying. Select the result and copy it by hand."));
  }

  function clear() {
    setInput("");
    setOutput("");
    setStatus(waiting(idle));
  }

  return (
    <div>
      <div className="actions">
        {actions.map((action, index) => (
          <button key={action.label} className={index === 0 ? "btn btn-primary" : "btn"} onClick={() => run(action)}>
            {action.label}
          </button>
        ))}
        <button className="btn" onClick={copy}>Copy result</button>
        <button className="btn" onClick={clear}>Clear</button>
        {children && <div className="options">{children}</div>}
      </div>
      <div className="panes">
        <div className="pane" data-color="sun">
          <label htmlFor={`${id}-in`}>{inputLabel}</label>
          <textarea id={`${id}-in`} spellCheck={false} value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="pane" data-color="mint">
          <label htmlFor={`${id}-out`}>{outputLabel}</label>
          <textarea id={`${id}-out`} spellCheck={false} readOnly value={output} />
        </div>
      </div>
      <Status status={status} party={party} />
    </div>
  );
}
