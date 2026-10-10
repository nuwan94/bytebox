import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { CONTACT_EMAIL, pageUrl, REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to report a problem with a Bytebox tool, suggest a new one, or reach the person who makes it.",
  alternates: { canonical: pageUrl("/contact/") },
};

export default function Contact() {
  return (
    <InfoPage title="Contact" color="tang">
      <h2>Report a problem</h2>
      <p>
        If a tool gives a wrong result or a page looks broken,{" "}
        <a href={`${REPO_URL}/issues/new`}>open an issue on GitHub</a>. It helps to say which tool, what you entered
        and what you expected. Leave out anything private: issues are public.
      </p>

      <h2>Suggest a tool</h2>
      <p>
        Ideas for new tools are welcome in the same place. Check the{" "}
        <a href={`${REPO_URL}/issues`}>existing issues</a> first in case someone has already asked.
      </p>

      <h2>Anything else</h2>
      <p>
        For questions about privacy, sponsorship or anything that should not be public, email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </InfoPage>
  );
}
