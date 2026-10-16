export type UrlParts = {
  ok: true;
  parts: { label: string; value: string }[];
  params: { key: string; value: string }[];
};
export type UrlResult = UrlParts | { ok: false; error: string };

const decode = (text: string) => {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
};

/** Splits a URL into its parts, with query parameters decoded. */
export function parseUrl(input: string): UrlResult {
  const text = input.trim();
  if (!text) return { ok: false, error: "There's no URL to read." };
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return {
      ok: false,
      error: /^[a-z][a-z0-9+.-]*:/i.test(text)
        ? "The browser can't read that as a URL. Check for spaces or a broken host name."
        : "That isn't a full URL. Include the scheme at the start, such as https://.",
    };
  }

  const parts = [
    { label: "Scheme", value: url.protocol.replace(/:$/, "") },
    { label: "Username", value: decode(url.username) },
    { label: "Password", value: decode(url.password) },
    { label: "Host", value: url.hostname },
    { label: "Port", value: url.port },
    { label: "Path", value: decode(url.pathname) },
    { label: "Query", value: url.search },
    { label: "Fragment", value: decode(url.hash.replace(/^#/, "")) },
    { label: "Origin", value: url.origin === "null" ? "" : url.origin },
  ].filter((part) => part.value !== "");

  return { ok: true, parts, params: [...url.searchParams].map(([key, value]) => ({ key, value })) };
}
