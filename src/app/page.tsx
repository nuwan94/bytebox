import type { CSSProperties } from "react";
import { Cat } from "@/components/Cat";
import { StickerSheet } from "@/components/StickerSheet";
import { pageUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// One paper scrap per letter: background, text colour, rotation, vertical nudge.
const LETTERS: [string, string, string, number, number][] = [
  ["B", "var(--gum)", "var(--ink)", -5, 0],
  ["Y", "var(--paper)", "var(--ink)", 3, 8],
  ["T", "var(--cobalt)", "#fff", -2, 0],
  ["E", "var(--mint)", "var(--ink)", 4, -6],
  ["B", "var(--tang)", "var(--ink)", -4, 6],
  ["O", "var(--ink)", "var(--sun)", 2, 0],
  ["X", "var(--lilac)", "var(--ink)", -3, 10],
];

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: pageUrl("/"), description: SITE_DESCRIPTION }),
        }}
      />
      <section className="hero">
        <div>
          <h1 className="cutout" aria-label="Bytebox">
            {LETTERS.map(([letter, paper, ink, tilt, nudge], index) => (
              <span
                key={index}
                aria-hidden="true"
                style={{ "--c": paper, "--t": ink, "--r": `${tilt}deg`, "--y": `${nudge}px` } as CSSProperties}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className="lede">Small tools for developers. They run in your browser, so nothing you paste gets uploaded.</p>
        </div>
        <div className="mascot">
          <p className="bubble">Peel a sticker to open a tool.</p>
          <div className="diecut">
            <Cat state="idle" px={9} />
            <div className="floor" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          </div>
        </div>
      </section>
      <StickerSheet />
    </main>
  );
}
