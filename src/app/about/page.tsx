import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";
import { pageUrl, SPONSOR_URL } from "@/lib/site";
import { tools } from "@/tools/registry";

export const metadata: Metadata = {
  title: "About",
  description: "What Bytebox is, how its browser-only developer tools work, who makes it and how it is paid for.",
  alternates: { canonical: pageUrl("/about/") },
};

export default function About() {
  return (
    <InfoPage title="About Bytebox" color="mint">
      <p>
        Bytebox is a set of {tools.length} small tools for everyday development work: formatting JSON, decoding a
        token, testing a regular expression, comparing two pieces of text and so on. Each one opens instantly and does
        one job.
      </p>

      <h2>How the tools work</h2>
      <p>
        Every tool runs in your browser. When you paste text into a tool, the work happens on your own device with
        JavaScript, and the text is not sent to a server. Bytebox has no server of its own to send it to: the whole
        site is a set of static files.
      </p>
      <p>
        That matters for the things developers tend to paste into tools like these, such as access tokens,
        configuration files and customer data. The <Link href="/privacy/">privacy policy</Link> describes what the
        site does collect, which is page-view statistics.
      </p>

      <h2>Who makes it</h2>
      <p>
        Bytebox is made by Nuwan Alawatta, whose other work is at <a href="https://nuwan.dev">nuwan.dev</a>.
      </p>

      <h2>Feedback</h2>
      <p>
        If a tool gives a wrong result, or there is one you wish existed, the{" "}
        <Link href="/contact/">contact page</Link> says how to get in touch.
      </p>

      <h2>How it is paid for</h2>
      <p>
        Bytebox is free to use. If it saves you time, you can{" "}
        <a href={SPONSOR_URL}>sponsor the project on GitHub</a>.
      </p>

      <h2>The cat</h2>
      <p>
        The pixel cat reacts to what you do. It dozes while a tool is empty, puts on sunglasses when your input is
        valid, and looks alarmed when something is wrong, with a note saying what to fix.
      </p>
    </InfoPage>
  );
}
