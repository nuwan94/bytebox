/** Loose Memphis shapes that sit behind the page content. */
export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      <svg style={{ right: "8%", bottom: 26 }} width="150" height="40" viewBox="0 0 150 40">
        <path d="M4 30 L24 8 L44 30 L64 8 L84 30 L104 8 L124 30 L144 8" fill="none" stroke="var(--ink)" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <svg style={{ right: -40, top: 640 }} width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" r="62" fill="none" stroke="var(--cobalt)" strokeWidth="18" />
      </svg>
      <svg style={{ left: -26, top: 520 }} width="120" height="120" viewBox="0 0 120 120">
        <polygon points="10,100 60,8 112,104" fill="var(--gum)" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" />
      </svg>
      <svg style={{ left: "8%", top: 1010 }} width="96" height="96" viewBox="0 0 96 96">
        <path d="M36 4h24v32h32v24H60v32H36V60H4V36h32z" fill="var(--mint)" stroke="var(--ink)" strokeWidth="5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
