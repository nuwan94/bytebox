"use client";

import { useState } from "react";
import { failed, ok, Status, waiting, type StatusInfo } from "@/components/Status";
import { makeSampleJwt, readJwt } from "./logic";

const SAMPLE = makeSampleJwt({ alg: "HS256", typ: "JWT" }, { sub: "1234567890", name: "Byte Box", admin: false, exp: 1893456000 });
const IDLE = waiting("Paste a token, then press Read token.");

export default function JwtReader() {
  const [token, setToken] = useState(SAMPLE);
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState<StatusInfo>(IDLE);
  const [party, setParty] = useState(0);

  function read() {
    if (!token.trim()) return setStatus(IDLE);
    const result = readJwt(token);
    if (!result.ok) {
      setHeader("");
      setPayload("");
      return setStatus(failed(`That token can't be read. ${result.error}`));
    }
    setHeader(result.header);
    setPayload(result.payload);
    setParty((count) => count + 1);
    let expiry = "";
    if (result.expiresAt !== null) {
      const when = new Date(result.expiresAt).toLocaleString();
      expiry = result.expiresAt < Date.now() ? ` It expired on ${when}.` : ` It expires on ${when}.`;
    }
    setStatus(ok(`Token read.${expiry} The signature isn't checked here.`));
  }

  function clear() {
    setToken("");
    setHeader("");
    setPayload("");
    setStatus(IDLE);
  }

  return (
    <div>
      <div className="actions">
        <button className="btn btn-primary" onClick={read}>Read token</button>
        <button className="btn" onClick={clear}>Clear</button>
      </div>
      <div className="pane" data-color="sun">
        <label htmlFor="jwt-in">Token</label>
        <textarea id="jwt-in" className="short" spellCheck={false} value={token} onChange={(event) => setToken(event.target.value)} />
      </div>
      <div className="panes panes-below">
        <div className="pane" data-color="lilac">
          <label htmlFor="jwt-header">Header</label>
          <textarea id="jwt-header" className="medium" spellCheck={false} readOnly value={header} />
        </div>
        <div className="pane" data-color="mint">
          <label htmlFor="jwt-payload">Payload</label>
          <textarea id="jwt-payload" className="medium" spellCheck={false} readOnly value={payload} />
        </div>
      </div>
      <Status status={status} party={party} />
    </div>
  );
}
