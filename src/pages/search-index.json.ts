import { loadLibrary } from "@/lib/articles";
import { formatDate, kindMeta, summarize } from "@/lib/content";

/**
 * One index for both searches — the header palette and `/search/`.
 *
 * Reviews carry the product name and brand separately from the headline,
 * because the thing a reader types is usually a product name rather than the
 * title we gave the article about it.
 */
export async function GET() {
  const library = await loadLibrary();

  const index = library.articles.map((article) => {
    const summary = summarize(article);
    const product = article.collection === "reviews" ? article.data.product : undefined;

    return {
      title: summary.title,
      excerpt: summary.excerpt,
      href: summary.href,
      kind: kindMeta[summary.kind].label,
      category: summary.category,
      score: summary.score ?? null,
      product: product?.name ?? null,
      brand: product?.brand ?? null,
      tags: summary.tags,
      bylines: summary.bylines.map((byline) => byline.name),
      date: formatDate(summary.updatedDate ?? summary.date),
    };
  });

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
