"use client";

import { useState } from "react";
import { Cat, type CatState } from "@/components/Cat";
import { formatJson, type Indent } from "./logic";

const SAMPLE = '{"name":"bytebox","tools":["json","base64","uuid"],"uploads":false,"lives":9}';

type Status = { tone: "idle" | "ok" | "error"; text: string; cat: CatState };

const WAITING: Status = { tone: "idle", text: "Paste some JSON, then press Format.", cat: "sleepy" };

export default function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<Indent>(2);
  const [status, setStatus] = useState<Status>(WAITING);
  // Bumped on every success so the dance floor animation restarts.
  const [party, setParty] = useState(0);

  function run(minify: boolean) {
    const source = input.trim();
    if (!source) return setStatus(WAITING);
    const result = formatJson(source, minify ? "none" : indent);
    if (!result.ok) {
      setOutput("");
      return setStatus({ tone: "error", text: `That isn't valid JSON. ${result.error}`, cat: "alarmed" });
    }
    setOutput(result.output);
    setParty((count) => count + 1);
    setStatus({
      tone: "ok",
      text: minify
        ? `Valid JSON, squeezed to ${result.output.length} characters.`
        : `Valid JSON, ${result.lines} ${result.lines === 1 ? "line" : "lines"}.`,
      cat: "disco",
    });
  }

  async function copy() {
    if (!output) return setStatus({ tone: "idle", text: "Nothing to copy yet. Format something first.", cat: "idle" });
    try {
      await navigator.clipboard.writeText(output);
      setStatus({ tone: "ok", text: "Copied the result.", cat: "disco" });
    } catch {
      setStatus({ tone: "error", text: "The browser blocked copying. Select the result and copy it by hand.", cat: "alarmed" });
    }
  }

  function clear() {
    setInput("");
    setOutput("");
    setStatus(WAITING);
  }

  return (
    <div>
      <div className="actions">
        <button className="btn btn-primary" onClick={() => run(false)}>Format</button>
        <button className="btn" onClick={() => run(true)}>Minify</button>
        <button className="btn" onClick={copy}>Copy result</button>
        <button className="btn" onClick={clear}>Clear</button>
        <label htmlFor="indent">Indent</label>
        <select
          id="indent"
          value={indent}
          onChange={(event) => setIndent(event.target.value === "tab" ? "tab" : (Number(event.target.value) as Indent))}
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="tab">Tab</option>
        </select>
      </div>
      <div className="panes">
        <div className="pane" data-color="sun">
          <label htmlFor="json-in">Paste JSON</label>
          <textarea id="json-in" spellCheck={false} value={input} onChange={(event) => setInput(event.target.value)} />
        </div>
        <div className="pane" data-color="mint">
          <label htmlFor="json-out">Result</label>
          <textarea id="json-out" spellCheck={false} readOnly value={output} />
        </div>
      </div>
      <div className="status" data-tone={status.tone} aria-live="polite">
        <div key={party} className={`diecut diecut-small${party ? " party" : ""}`}>
          <Cat state={status.cat} px={4} />
          <div className="floor" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        </div>
        <p className="bubble">{status.text}</p>
      </div>
    </div>
  );
}
