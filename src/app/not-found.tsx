import Link from "next/link";
import { Cat } from "@/components/Cat";

export default function NotFound() {
  return (
    <main className="tool">
      <div className="tool-head">
        <h1 data-color="tang">Page not found</h1>
      </div>
      <div className="page">
        <div className="status" data-tone="error">
          <div className="diecut diecut-small">
            <Cat state="alarmed" px={4} />
            <div className="floor" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          </div>
          <p className="bubble">That page isn't on the sheet. The address may be mistyped.</p>
        </div>
        <p><Link className="btn" href="/">Back to the sheet</Link></p>
      </div>
    </main>
  );
}
