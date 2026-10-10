import { Cat, type CatState } from "./Cat";

export type StatusInfo = { tone: "idle" | "ok" | "error"; text: string; cat: CatState };

export const ok = (text: string): StatusInfo => ({ tone: "ok", text, cat: "disco" });
export const failed = (text: string): StatusInfo => ({ tone: "error", text, cat: "alarmed" });
export const waiting = (text: string): StatusInfo => ({ tone: "idle", text, cat: "sleepy" });

/** The cat and its speech bubble. Bump `party` to replay the dance floor. */
export function Status({ status, party = 0 }: { status: StatusInfo; party?: number }) {
  return (
    <div className="status" data-tone={status.tone} aria-live="polite">
      <div key={party} className={`diecut diecut-small${party ? " party" : ""}`}>
        <Cat state={status.cat} px={4} />
        <div className="floor" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      </div>
      <p className="bubble">{status.text}</p>
    </div>
  );
}
