import { siteConfig } from "@/config/site";
import { loadLibrary } from "@/lib/articles";
import { articleHref, kindMeta, kindOf, articleScore, byFreshest } from "@/lib/content";
import { formatScore } from "@/config/scoring";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const library = await loadLibrary();
  /* Sorted by revision date: a re-tested guide is news again. */
  const entries = [...library.articles].sort(byFreshest).slice(0, 25);

  const items = entries
    .map((article) => {
      const url = new URL(articleHref(article), siteConfig.siteUrl).toString();
      const score = articleScore(article);
      const label = kindMeta[kindOf(article)].label;
      const description =
        score === undefined
          ? article.data.excerpt
          : `${formatScore(score)}/10 — ${article.data.excerpt}`;

      return `<item>
  <title>${escapeXml(article.data.title)}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <category>${escapeXml(label)}</category>
  <category>${escapeXml(article.data.category)}</category>
  <pubDate>${(article.data.updatedDate ?? article.data.date).toUTCString()}</pubDate>
  <description>${escapeXml(description)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteConfig.name)}</title>
  <link>${siteConfig.siteUrl}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  <language>${escapeXml(siteConfig.language)}</language>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
