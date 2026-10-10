import type { Metadata } from "next";
import Link from "next/link";
import { ConsentChoice } from "@/components/ConsentChoice";
import { InfoPage } from "@/components/InfoPage";
import { CONTACT_EMAIL, pageUrl, REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Bytebox collects and what it does not: tool input stays in your browser, and page views are measured with Google Analytics only if you allow it.",
  alternates: { canonical: pageUrl("/privacy/") },
};

export default function Privacy() {
  return (
    <InfoPage title="Privacy policy" color="lilac">
      <p className="article-note">Last updated 11 October 2026.</p>
      <p>
        This policy covers the Bytebox website. In short: what you type or paste into a tool stays in your browser,
        and the site measures page views with Google Analytics only if you allow it.
      </p>

      <h2>What you put into the tools</h2>
      <p>
        Text you enter into a tool is processed on your device and is not sent to Bytebox or to anyone else. This
        includes passwords and UUIDs the site generates, which are made in your browser and are not stored. Bytebox
        does not save your input between visits, and it has no accounts or sign-in.
      </p>
      <p>
        The copy buttons write to your clipboard only when you press them. The site never reads your clipboard.
      </p>

      <h2>Page-view statistics</h2>
      <p>
        If you allow it, Bytebox uses Google Analytics to see which pages are visited and roughly how many people use
        the site. It stays off until you press Allow in the notice at the bottom of the page. Once allowed, Google
        Analytics sets cookies in your browser and collects information such as the pages you open, the site you came
        from, your browser and device type, and your approximate location worked out from your IP address. It does not
        receive anything you enter into a tool.
      </p>
      <p>
        Your choice is remembered in this browser's storage so that you are not asked on every visit. If you decline
        or later change your mind, the Google Analytics cookies for this site are removed.
      </p>
      <ConsentChoice />
      <p>
        Google describes how it handles this information in{" "}
        <a href="https://policies.google.com/technologies/partner-sites">
          How Google uses information from sites or apps that use its services
        </a>
        . You can also stop Google Analytics from measuring your visits on every site with the{" "}
        <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out browser add-on</a>. The tools work
        the same whatever you choose.
      </p>

      <h2>Hosting</h2>
      <p>
        The site is hosted on GitHub Pages. Like any web host, GitHub receives technical details when your browser
        requests a page, including your IP address, and may keep them in logs for security. See the{" "}
        <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
          GitHub privacy statement
        </a>
        . The fonts are served from this site, not from a third party.
      </p>

      <h2>Advertising</h2>
      <p>
        Bytebox does not show advertising at the moment. If that changes, this page will be updated first to say which
        advertising partners are used, what cookies they set and how to opt out of personalised ads.
      </p>

      <h2>Links to other sites</h2>
      <p>
        Bytebox links to GitHub and to nuwan.dev. Those sites have their own privacy policies, and this one does not
        cover them.
      </p>

      <h2>Children</h2>
      <p>Bytebox is a tool for developers. It is not directed at children and does not knowingly collect their data.</p>

      <h2>Changes to this policy</h2>
      <p>
        When this policy changes, the date at the top changes with it. The full history of the page is public in the{" "}
        <a href={REPO_URL}>GitHub repository</a>.
      </p>

      <h2>Questions</h2>
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or see the{" "}
        <Link href="/contact/">contact page</Link>.
      </p>
    </InfoPage>
  );
}
