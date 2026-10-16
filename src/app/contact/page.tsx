import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { CONTACT_EMAIL, pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to report a problem with a Bytebox tool, suggest a new one, or reach the person who makes it.",
  alternates: { canonical: pageUrl("/contact/") },
};

const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function Contact() {
  return (
    <InfoPage title="Contact" color="tang">
      <p>Bytebox is run by one person. Email {email} for any of the following.</p>

      <h2>Report a problem</h2>
      <p>
        If a tool gives a wrong result or a page looks broken, say which tool, what you entered and what you expected.
        Leave out anything private, such as real tokens or passwords: a made-up example that shows the same problem is
        enough.
      </p>

      <h2>Suggest a tool</h2>
      <p>Ideas for new tools are welcome. A sentence on what you would use it for helps decide what to build next.</p>

      <h2>Anything else</h2>
      <p>Questions about privacy or sponsorship go to the same address.</p>
    </InfoPage>
  );
}
