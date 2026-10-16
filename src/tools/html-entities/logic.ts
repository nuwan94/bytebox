const BASIC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapes text for HTML. With `allNonAscii`, every character above ASCII becomes a numeric reference. */
export function encodeEntities(text: string, allNonAscii = false): string {
  let output = text.replace(/[&<>"']/g, (char) => BASIC[char]);
  if (allNonAscii) output = output.replace(/[^\x00-\x7e]/gu, (char) => `&#x${char.codePointAt(0)!.toString(16).toUpperCase()};`);
  return output;
}

// The named references people meet most often. Names are case-sensitive.
export const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  copy: "©", reg: "®", trade: "™", hellip: "…", mdash: "—", ndash: "–",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", laquo: "«", raquo: "»",
  euro: "€", pound: "£", yen: "¥", cent: "¢", deg: "°", times: "×", divide: "÷",
  plusmn: "±", middot: "·", bull: "•", sect: "§", para: "¶", frac12: "½", frac14: "¼", frac34: "¾",
  larr: "←", rarr: "→", uarr: "↑", darr: "↓", check: "✓",
  eacute: "é", Eacute: "É", egrave: "è", agrave: "à", aacute: "á", ccedil: "ç", ntilde: "ñ", ouml: "ö", uuml: "ü", auml: "ä", szlig: "ß",
};

/** Turns numeric references and the common named ones back into characters. Unknown names are left alone. */
export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (whole, body: string) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : whole;
    }
    return NAMED[body] ?? whole;
  });
}
