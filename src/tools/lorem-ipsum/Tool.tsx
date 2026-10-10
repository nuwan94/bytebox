"use client";

import { useState } from "react";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { copyText } from "@/lib/copy";
import { makeLorem, MAX_PARAGRAPHS } from "./logic";

const IDLE = waiting("Pick how many paragraphs you need, then press Make text.");

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<StatusInfo>(IDLE);
  const [party, setParty] = useState(0);

  function make() {
    const made = makeLorem(paragraphs, Math.floor(Math.random() * 2 ** 32));
    const count = made.split("\n\n").length;
    setText(made);
    setParagraphs(count);
    setParty((value) => value + 1);
    setStatus(ok(`Made ${count} ${count === 1 ? "paragraph" : "paragraphs"}.`));
  }

  async function copy() {
    if (!text) return setStatus({ tone: "idle", text: "Nothing to copy yet. Make some text first.", cat: "idle" });
    setStatus((await copyText(text)) ? ok("Copied the text.") : failed("The browser blocked copying. Select the text and copy it by hand."));
  }

  return (
    <div>
      <div className="actions">
        <button className="btn btn-primary" onClick={make}>Make text</button>
        <button className="btn" onClick={copy}>Copy</button>
        <div className="options">
          <label className="check" htmlFor="lorem-count">Paragraphs</label>
          <input id="lorem-count" className="input input-small" type="number" min={1} max={MAX_PARAGRAPHS} value={paragraphs} onChange={(event) => setParagraphs(Number(event.target.value))} />
        </div>
      </div>
      <div className="pane" data-color="gum">
        <label htmlFor="lorem-out">Placeholder text</label>
        <textarea id="lorem-out" className="prose" readOnly value={text} />
      </div>
      <Status status={status} party={party} />
    </div>
  );
}
