import type { Metadata } from "next";
import { DM_Mono, Gochi_Hand, Rubik, Titan_One } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { Confetti } from "@/components/Confetti";
import "./globals.css";

const display = Titan_One({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Rubik({ subsets: ["latin"], variable: "--font-body" });
const hand = Gochi_Hand({ weight: "400", subsets: ["latin"], variable: "--font-hand" });
const mono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "Bytebox", template: "%s | Bytebox" },
  description: "Small tools for developers. They run in your browser, so nothing you paste gets uploaded.",
};

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
            <span>Bytebox is a static site. Your input stays on this device.</span>
            <a className="maker" href="https://nuwan.dev">nuwan.dev</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
