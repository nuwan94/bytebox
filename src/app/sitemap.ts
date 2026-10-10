import type { MetadataRoute } from "next";
import { pageUrl } from "@/lib/site";
import { tools } from "@/tools/registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: pageUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...tools.map((tool) => ({ url: pageUrl(`/tools/${tool.slug}/`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...["/about/", "/privacy/", "/contact/"].map((path) => ({ url: pageUrl(path), changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
