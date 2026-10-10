"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import { readConsent, subscribeConsent, writeConsent } from "@/lib/consent";
import { GA_MEASUREMENT_ID } from "@/lib/site";
import { Cat } from "./Cat";

const LIVE = process.env.NODE_ENV === "production";

// Google Analytics sets its cookies on the widest domain it can, so try each one.
function clearAnalyticsCookies() {
  const parts = location.hostname.split(".");
  const domains = parts.map((_, index) => parts.slice(index).join("."));
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name.startsWith("_ga")) continue;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    for (const domain of domains) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`;
  }
}

/** Loads Google Analytics only after the visitor allows it, and asks if they haven't chosen. */
export function Analytics() {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => "pending" as const);

  useEffect(() => {
    if (consent === "pending") return;
    // Google's documented switch for turning measurement off on a page.
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = consent !== "granted";
    if (consent !== "granted") clearAnalyticsCookies();
  }, [consent]);

  return (
    <>
      {LIVE && consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
      {consent === "unset" && (
        <aside className="consent" aria-label="Cookie choice">
          <Cat state="idle" px={4} />
          <div>
            <p>
              May Bytebox count page views with Google Analytics? It uses cookies. What you type into a tool is never
              included. <Link href="/privacy/">Privacy policy</Link>
            </p>
            <div className="consent-actions">
              <button className="btn" onClick={() => writeConsent("granted")}>Allow</button>
              <button className="btn" onClick={() => writeConsent("denied")}>No thanks</button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
