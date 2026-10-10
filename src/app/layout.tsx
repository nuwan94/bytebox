import type { Metadata, Viewport } from "next";
import { DM_Mono, Gochi_Hand, Rubik, Titan_One } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { Confetti } from "@/components/Confetti";
import { Analytics } from "@/components/Analytics";
import { pageUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SPONSOR_URL } from "@/lib/site";
import "./globals.css";

const display = Titan_One({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Rubik({ subsets: ["latin"], variable: "--font-body" });
const hand = Gochi_Hand({ weight: "400", subsets: ["latin"], variable: "--font-hand" });
const mono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: "Bytebox: developer tools that run in your browser", template: "%s | Bytebox" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Nuwan Alawatta", url: "https://nuwan.dev" }],
  alternates: { canonical: pageUrl("/") },
  openGraph: { type: "website", siteName: SITE_NAME, url: pageUrl("/"), title: "Bytebox: developer tools that run in your browser", description: SITE_DESCRIPTION },
  twitter: { card: "summary_large_image" },
  verification: { google: "xY6Lj6K_vFQjAG6PpATMA6TFhHNj57xPsnvA0TbpJKM" },
};

export const viewport: Viewport = { themeColor: "#ffd400" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable} ${mono.variable}`}>
      <body>
        <Confetti />
        <div className="wrap">
          <header className="bar">
            <Link className="mark" href="/">Bytebox</Link>
          </header>
          {children}
          <footer>
            <span>What you paste into a tool stays on this device.</span>
            <nav className="foot-links" aria-label="About this site">
              <Link href="/about/">About</Link>
              <Link href="/privacy/">Privacy</Link>
              <Link href="/contact/">Contact</Link>
            </nav>
            <a className="maker" href="https://nuwan.dev">nuwan.dev</a>
            <a className="sponsor" href={SPONSOR_URL}>Sponsor on GitHub</a>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
