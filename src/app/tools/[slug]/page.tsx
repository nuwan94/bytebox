import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolView } from "@/components/ToolView";
import { getTool, tools } from "@/tools/registry";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool((await params).slug);
  return tool ? { title: tool.name, description: tool.does } : {};
}

export default async function ToolPage({ params }: Props) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();

  return (
    <main className="tool">
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
    </main>
  );
}
