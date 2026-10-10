import type { ToolGuide as Guide } from "@/tools/guides";
import type { Tool } from "@/tools/registry";

/** The written guide under a tool: what it does, how to use it, an example and common questions. */
export function ToolGuide({ tool, guide }: { tool: Tool; guide: Guide }) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <section className="page guide" aria-labelledby="guide-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />
      <div className="article">
        <h2 id="guide-title">About the {tool.name} tool</h2>
        {guide.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}

        <h2>How to use it</h2>
        <ol>
          {guide.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        {guide.example && (
          <>
            <h2>Example</h2>
            <p>{guide.example.caption}.</p>
            <div className="example">
              <figure>
                <figcaption>You enter</figcaption>
                <pre>{guide.example.input}</pre>
              </figure>
              <figure>
                <figcaption>You get</figcaption>
                <pre>{guide.example.output}</pre>
              </figure>
            </div>
          </>
        )}

        <h2>Common questions</h2>
        {guide.faqs.map((faq) => (
          <div key={faq.q}>
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
