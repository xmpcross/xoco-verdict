import { getCollection } from "astro:content";
import {
  articleBylines,
  byNewest,
  published,
  reviewScore,
  type Article,
  type Comparison,
  type Post,
  type Review,
} from "@/lib/content";

/**
 * The whole archive, loaded once and handed out as one object. Astro runs page
 * modules at build time, so this costs a single pass over `src/content` rather
 * than one per page.
 *
 * Drafts are filtered here and nowhere else: anything downstream can assume
 * what it receives is publishable.
 */
export interface Library {
  reviews: Review[];
  comparisons: Comparison[];
  posts: Post[];
  /** All three types, newest first — for archives, search, and the homepage. */
  articles: Article[];
}

export const loadLibrary = async (): Promise<Library> => {
  const [reviews, comparisons, posts] = await Promise.all([
    getCollection("reviews"),
    getCollection("comparisons"),
    getCollection("posts"),
  ]);

  const visibleReviews = published(reviews);
  const visibleComparisons = published(comparisons);
  const visiblePosts = published(posts);

  return {
    reviews: visibleReviews,
    comparisons: visibleComparisons,
    posts: visiblePosts,
    articles: [...visibleReviews, ...visibleComparisons, ...visiblePosts].sort(byNewest),
  };
};

/** Reviewers with published work, ordered by output. Used by the author pages. */
export const reviewerIndex = (articles: Article[]) => {
  const map = new Map<string, { name: string; role: string; articles: Article[] }>();
  for (const article of articles) {
    for (const byline of articleBylines(article)) {
      const current = map.get(byline.name);
      map.set(byline.name, {
        name: byline.name,
        role: current?.role ?? byline.role,
        articles: [...(current?.articles ?? []), article],
      });
    }
  }
  return [...map.values()].sort(
    (a, b) => b.articles.length - a.articles.length || a.name.localeCompare(b.name),
  );
};

/**
 * Reviews ranked by score, best first — the "top rated" table. Kept here rather
 * than in a component so the homepage and the reviews archive cannot disagree.
 */
export const rankedReviews = (reviews: Review[]) =>
  reviews
    .map((review) => ({ review, score: reviewScore(review) }))
    .sort(
      (a, b) =>
        b.score - a.score || a.review.data.product.name.localeCompare(b.review.data.product.name),
    );
