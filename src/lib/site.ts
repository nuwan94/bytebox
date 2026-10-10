// The deploy workflow passes the published address in. It already includes any
// base path, so page URLs are built by appending to it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://devtools.nuwan.dev").replace(/\/$/, "");

export const SITE_NAME = "Bytebox";
export const SITE_DESCRIPTION =
  "Free developer tools that run in your browser: JSON formatter, Base64, UUID, regex tester, hashes, text diff and more. Nothing you paste is uploaded.";

export const GA_MEASUREMENT_ID = "G-31Q12L3CTG";
export const SPONSOR_URL = "https://github.com/sponsors/nuwan94";

/** Absolute URL for a path such as "/tools/base64/". */
export const pageUrl = (path = "/") => `${SITE_URL}${path}`;
