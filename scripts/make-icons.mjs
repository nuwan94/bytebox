// Regenerates the favicon, Apple touch icon and social share image.
// Run with: node scripts/make-icons.mjs
// The share image uses Arial Black, so run it on a machine that has that font.
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

// sharp ships as a dependency of Next.js rather than of this project.
const sharp = createRequire(createRequire(import.meta.url).resolve("next/package.json"))("sharp");

// Same sprite as src/components/Cat.tsx (idle face).
const CAT = [
  "..d..........d..",
  ".dod........dod.",
  ".dood......dood.",
  ".doooddddddoood.",
  ".dooooooooooood.",
  ".dooooooooooood.",
  ".dowkoooooowkod.",
  ".dowkoooooowkod.",
  ".doooooppoooood.",
  ".dpooodoodooopd.",
  ".doooooddoooood.",
  ".dooooooooooood.",
  "..dddddddddddd..",
];
const INKS = { o: "#ff7a2f", d: "#000", w: "#fff", k: "#000", p: "#ff6fb0" };

function cat(x, y, px) {
  let out = "";
  CAT.forEach((row, r) => {
    let c = 0;
    while (c < row.length) {
      const char = row[c];
      let end = c;
      while (end < row.length && row[end] === char) end++;
      if (char !== ".") out += `<rect x="${x + c * px}" y="${y + r * px}" width="${(end - c) * px}" height="${px}" fill="${INKS[char]}"/>`;
      c = end;
    }
  });
  return out;
}

const icon = (size, px, radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
  `<rect width="${size}" height="${size}" rx="${radius}" fill="#ffd400"/>${cat((size - 16 * px) / 2, (size - 13 * px) / 2, px)}</svg>`;

const LETTERS = [
  ["B", "#ff6fb0", "#000", -5],
  ["Y", "#fff", "#000", 3],
  ["T", "#2b3fe0", "#fff", -2],
  ["E", "#2ed3a6", "#000", 4],
  ["B", "#ff7a2f", "#000", -4],
  ["O", "#000", "#ffd400", 2],
  ["X", "#b79cff", "#000", -3],
];

function shareImage() {
  const tile = 118;
  const letters = LETTERS.map(([letter, paper, ink, tilt], index) => {
    const x = 70 + index * (tile + 12);
    const y = 120 + (index % 2) * 10;
    return (
      `<g transform="rotate(${tilt} ${x + tile / 2} ${y + tile / 2})">` +
      `<rect x="${x + 7}" y="${y + 7}" width="${tile}" height="${tile}" fill="#000"/>` +
      `<rect x="${x}" y="${y}" width="${tile}" height="${tile}" fill="${paper}" stroke="#000" stroke-width="5"/>` +
      `<text x="${x + tile / 2}" y="${y + 92}" text-anchor="middle" font-family="Arial Black, Arial" font-weight="900" font-size="96" fill="${ink}">${letter}</text></g>`
    );
  }).join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">` +
    `<rect width="1200" height="630" fill="#ffd400"/>` +
    `<circle cx="1130" cy="90" r="70" fill="none" stroke="#2b3fe0" stroke-width="22"/>` +
    letters +
    `<text x="70" y="350" font-family="Arial, sans-serif" font-weight="700" font-size="44" fill="#000">Small tools for developers.</text>` +
    `<text x="70" y="408" font-family="Arial, sans-serif" font-weight="700" font-size="44" fill="#000">They run in your browser.</text>` +
    `<text x="70" y="540" font-family="Arial, sans-serif" font-weight="700" font-size="30" fill="#000">JSON, Base64, UUID, regex, hashes, diff and more</text>` +
    `<g><rect x="868" y="318" width="290" height="250" rx="34" fill="#000"/>` +
    `<rect x="858" y="308" width="290" height="250" rx="34" fill="#fff" stroke="#000" stroke-width="6"/>${cat(875, 336, 16)}</g>` +
    `</svg>`
  );
}

writeFileSync("src/app/icon.svg", icon(32, 2, 6));
await sharp(Buffer.from(icon(180, 10, 0))).png().toFile("src/app/apple-icon.png");
await sharp(Buffer.from(shareImage())).png().toFile("src/app/opengraph-image.png");
writeFileSync("src/app/opengraph-image.alt.txt", "Bytebox: small tools for developers that run in your browser");
console.log("Wrote icon.svg, apple-icon.png, opengraph-image.png");
