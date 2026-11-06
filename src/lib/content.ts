import type { CollectionEntry } from "astro:content";
import { categories, categoryMeta, categorySlug, type Category } from "@/config/categories";
import { overallScore, type AwardKey } from "@/config/scoring";
import { siteConfig } from "@/config/site";

export { categories, categoryMeta, categorySlug, type Category };

export type Review = CollectionEntry<"reviews">;
export type Comparison = CollectionEntry<"comparisons">;
export type Post = CollectionEntry<"posts">;

/** Everything a reader reads. */
export type Article = Review | Comparison | Post;

export const articleKinds = ["review", "comparison", "post"] as const;
export type ArticleKind = (typeof articleKinds)[number];

/**
 * One place that knows what each content type is called and where it lives.
 * Renaming "Posts" to "Guides", or moving comparisons to a different path, is a
 * change to this object and nothing else.
 */
export const kindMeta: Record<
  ArticleKind,
  { label: string; plural: string; href: string; archive: string; blurb: string }
> = {
  review: {
    label: "Review",
    plural: "Reviews",
    href: "/review/",
    archive: "/reviews/",
    blurb: "One product, bought at retail, measured and then lived with.",
  },
  comparison: {
    label: "Comparison",
    plural: "Comparisons",
    href: "/comparison/",
    archive: "/comparisons/",
    blurb: "Two products, the same tests, and a straight answer about which to buy.",
  },
  post: {
    label: "Guide",
    plural: "Guides",
    href: "/post/",
    archive: "/blog/",
    blurb: "Buying advice, roundups, and how the testing works.",
  },
};

/* ============================================================== identity === */

export const kindOf = (article: Article): ArticleKind => {
  if (article.collection === "reviews") return "review";
  if (article.collection === "comparisons") return "comparison";
  return "post";
};

export const articleHref = (article: Article) => `${kindMeta[kindOf(article)].href}${article.id}/`;

export const categoryHref = (category: Category) => `/category/${categorySlug(category)}/`;

export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const tagHref = (tag: string) => `/tag/${tagSlug(tag)}/`;

export const authorSlug = (author: string) =>
  author
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const authorHref = (author: string) => `/author/${authorSlug(author)}/`;

/** Monogram fallback for reviewers with no portrait in `src/config/authors.ts`. */
export const authorInitials = (author: string) =>
  author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

/* ================================================================ bylines === */

export interface Byline {
  name: string;
  role: string;
}

export const articleBylines = (article: Article): Byline[] => [
  article.data.author,
  ...article.data.coauthors,
];

/* ============================================================== filtering === */

export const byNewest = (a: Article, b: Article) => b.data.date.getTime() - a.data.date.getTime();

/** Newest first, counting a revision as news. */
export const byFreshest = (a: Article, b: Article) =>
  (b.data.updatedDate ?? b.data.date).getTime() - (a.data.updatedDate ?? a.data.date).getTime();

export const published = <T extends Article>(articles: T[]): T[] =>
  articles.filter((article) => !article.data.draft).sort(byNewest);

export const exclude = <T extends { id: string; collection: string }>(items: T[], removed: T[]) => {
  const ids = new Set(removed.map((item) => `${item.collection}/${item.id}`));
  return items.filter((item) => !ids.has(`${item.collection}/${item.id}`));
};

export const inCategory = <T extends Article>(
  articles: T[],
  category: Category,
  limit?: number,
) => {
  const list = articles.filter((article) => article.data.category === category);
  return typeof limit === "number" ? list.slice(0, limit) : list;
};

/** Pinned entries first, then everything else by date. */
export const featuredFirst = <T extends Article>(articles: T[]) => [
  ...articles.filter((article) => article.data.featured),
  ...articles.filter((article) => !article.data.featured),
];

export const allTags = (articles: Article[]) =>
  Array.from(new Set(articles.flatMap((article) => article.data.tags))).sort((a, b) =>
    a.localeCompare(b),
  );

/* ================================================================ reading === */

const wordPattern = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

/**
 * Read time estimated from the body at build time, so nothing carries a
 * hand-maintained number in frontmatter. Code, MDX tags, URLs, and Markdown
 * punctuation are stripped first so only prose is counted.
 */
export const readMinutes = (article: Article) => {
  const prose = (article.body ?? "")
    .replace(/^---\n[\s\S]*?\n---/, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}\[[^\]]+\]:.*$/gm, " ");
  const words = prose.match(wordPattern)?.length ?? 0;
  return Math.max(1, Math.round(words / siteConfig.wordsPerMinute));
};

export const formatDate = (date: Date, style: "short" | "long" = "short") =>
  new Intl.DateTimeFormat(siteConfig.dateLocale, {
    month: style === "short" ? "short" : "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

/* ================================================================= scores === */

/** The published score for a review: the weighted mean of its breakdown. */
export const reviewScore = (review: Review) => overallScore(review.data.scores, review.data.score);

/** Only reviews carry a score; a comparison's authority is its winner. */
export const articleScore = (article: Article): number | undefined =>
  article.collection === "reviews" ? reviewScore(article) : undefined;

export const articleAward = (article: Article): AwardKey | undefined =>
  article.collection === "reviews" ? article.data.award : undefined;

/* ============================================================== summaries === */

/**
 * The shape every card, row, and search result renders. Building it once here
 * is what lets one `ArticleCard` handle three content types without a switch
 * statement in the markup.
 */
export interface ArticleSummary {
  id: string;
  kind: ArticleKind;
  title: string;
  excerpt: string;
  href: string;
  category: Category;
  date: Date;
  updatedDate?: Date;
  cover: Article["data"]["cover"];
  bylines: Byline[];
  tags: string[];
  minutes: number;
  score?: number;
  award?: AwardKey;
  /** The product a review covers, for search and card subtitles. */
  productName?: string;
}

export const summarize = (article: Article): ArticleSummary => ({
  id: article.id,
  kind: kindOf(article),
  title: article.data.title,
  excerpt: article.data.excerpt,
  href: articleHref(article),
  category: article.data.category,
  date: article.data.date,
  updatedDate: article.data.updatedDate,
  cover: article.data.cover,
  bylines: articleBylines(article),
  tags: article.data.tags,
  minutes: readMinutes(article),
  score: articleScore(article),
  award: articleAward(article),
  productName:
    article.collection === "reviews"
      ? `${article.data.product.brand} ${article.data.product.name}`
      : undefined,
});

/**
 * Related reading: same category first, then the same content type, then
 * whatever is newest.
 */
export const relatedArticles = (pool: Article[], current: Article, limit = 3) =>
  pool
    .filter((article) => !(article.collection === current.collection && article.id === current.id))
    .sort((a, b) => {
      const categoryScore =
        Number(b.data.category === current.data.category) -
        Number(a.data.category === current.data.category);
      if (categoryScore) return categoryScore;
      const kindScore =
        Number(b.collection === current.collection) - Number(a.collection === current.collection);
      return kindScore || byNewest(a, b);
    })
    .slice(0, limit);
