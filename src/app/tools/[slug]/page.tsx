import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolGuide } from "@/components/ToolGuide";
import { ToolView } from "@/components/ToolView";
import { guides } from "@/tools/guides";
import { pageUrl, SITE_NAME } from "@/lib/site";
import { getTool, tools, type Tool } from "@/tools/registry";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

// Setting openGraph on a page replaces the site-wide share image, so name it again.
const SHARE_IMAGE = { url: pageUrl("/opengraph-image.png"), width: 1200, height: 630, alt: "Bytebox: small tools for developers that run in your browser" };

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool((await params).slug);
  if (!tool) return {};
  const title = `${tool.name} online`;
  const description = `${tool.does}. A free ${tool.name} tool that runs in your browser, so nothing you paste is uploaded.`;
  const url = pageUrl(`/tools/${tool.slug}/`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: SITE_NAME, url, title: `${title} | ${SITE_NAME}`, description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", images: [SHARE_IMAGE.url] },
  };
}

// Tells search engines each page is a free web application.
function structuredData(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} | ${SITE_NAME}`,
    url: pageUrl(`/tools/${tool.slug}/`),
    description: tool.does,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export default async function ToolPage({ params }: Props) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  const guide = guides[tool.slug];

  return (
    <main className="tool">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(tool)) }} />
      <div className="tool-head">
        <Link className="btn" href="/">Back to the sheet</Link>
        <h1 data-color={tool.color}>{tool.name}</h1>
      </div>
      <div className="page">
        <ToolView slug={tool.slug} />
        <ul className="others" aria-label="Other tools">
          {tools
            .filter((other) => other.slug !== tool.slug)
            .map((other) => (
              <li key={other.slug}>
                <Link href={`/tools/${other.slug}/`} data-color={other.color}>{other.name}</Link>
              </li>
            ))}
        </ul>
      </div>
      {guide && <ToolGuide tool={tool} guide={guide} />}
    </main>
  );
}
