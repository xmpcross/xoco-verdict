import { defineCollection, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { categories } from "@/config/categories";
import { awardKeys } from "@/config/scoring";

/**
 * Verdict's data model — three things you can write:
 *
 *   reviews       one product, scored
 *   comparisons   two to four products, side by side
 *   posts         everything else
 *
 * There is deliberately no separate product database. A product's retailers
 * and specifications live in the frontmatter of the article that covers it, so
 * writing a review is editing one file. The same blocks are
 * available to a plain post through the MDX components in
 * `src/components/mdx/`, which is how a buying guide or a "best of" roundup
 * gets built here.
 *
 * Entries that carry images live in their own folder with the image beside
 * them (`reviews/atlas-2-review/index.mdx` + `cover.jpg`); entries that do not
 * are a single file. `generateId` normalises both, so the folder or file name
 * is the slug and the URL.
 */

const contentId = ({ entry }: { entry: string }) =>
  entry.replace(/\/index\.mdx?$/, "").replace(/\.mdx?$/, "");

/** One name on a byline. The lead author and every coauthor take this shape. */
const byline = z.object({
  name: z.string(),
  role: z.string(),
});

/**
 * Photography. Every image the theme renders carries its own credit, because a
 * review site runs on other people's product shots and getting that wrong is
 * expensive.
 */
const media = (image: SchemaContext["image"]) =>
  z.object({
    src: image(),
    alt: z.string(),
    creditName: z.string(),
    creditUrl: z.url(),
  });

/**
 * Where to buy something. The first entry becomes the primary call to action.
 *
 * There is deliberately no price field. Prices move faster than anyone can
 * maintain them across a catalogue, and a stale number is worse than no number
 * — so the theme sends readers to the retailer to see the current one.
 */
const retailer = z.object({
  name: z.string(),
  url: z.url(),
  /** "Ships free over $50", "Refurb stock only". */
  note: z.string().optional(),
});

/** Fields shared by everything readers actually read. */
const articleBase = (image: SchemaContext["image"]) => ({
  title: z.string(),
  excerpt: z.string(),
  category: z.enum(categories),
  date: z.coerce.date(),
  /**
   * Review sites live or die on this. When set, it is printed instead of the
   * publication date and used to sort "recently updated".
   */
  updatedDate: z.coerce.date().optional(),
  author: byline,
  coauthors: z.array(byline).default([]),
  tags: z.array(z.string()).default([]),
  cover: media(image),
  /** Pins the article to the top of its archive and onto the homepage. */
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

/* ------------------------------------------------------------------ reviews --- */

/**
 * One product, tested and scored. The published number is the weighted average
 * of `scores`, so the badge can never disagree with the breakdown under it.
 */
const reviews = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reviews", generateId: contentId }),
  schema: ({ image }) =>
    z.object({
      ...articleBase(image),

      /** The thing being reviewed. Everything commercial hangs off this. */
      product: z.object({
        name: z.string(),
        brand: z.string(),
        /** Falls back to the cover image when omitted. */
        image: media(image).optional(),
        retailers: z.array(retailer).default([]),
        /** Grouped specification table. Omit it and the block disappears. */
        specs: z
          .array(
            z.object({
              group: z.string(),
              items: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
            }),
          )
          .default([]),
      }),

      /** The bottom line, in one paragraph. Printed in the verdict panel. */
      verdict: z.string(),
      /**
       * Weighted breakdown. Weights default to 1, so an unweighted list is a
       * plain average. Leave the array empty only if you also set `score`.
       */
      scores: z
        .array(
          z.object({
            label: z.string(),
            value: z.number().min(0).max(10),
            weight: z.number().positive().optional(),
            note: z.string().optional(),
          }),
        )
        .default([]),
      /** Overall score. Only used when `scores` is empty. */
      score: z.number().min(0).max(10).optional(),
      pros: z.array(z.string()).min(1),
      cons: z.array(z.string()).min(1),
      award: z.enum(awardKeys).optional(),
      /** "Anyone who commutes on a train." Printed in the verdict panel. */
      bestFor: z.string(),
      /** "You need it to survive a toddler." The honest disqualifier. */
      skipIf: z.string(),
      /** How long the unit was used: "six weeks", "400 miles", "80 shots". */
      testedFor: z.string(),
      /** Where the unit came from. Defaults to bought at retail — say so if not. */
      sourcing: z.string().default("Bought at retail with our own money."),
    }),
});

/* -------------------------------------------------------------- comparisons --- */

/**
 * Two to four products, side by side. Each entry in `items` is a column of the
 * comparison table, and `rows[].values` lines up with it by index.
 */
const comparisons = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/comparisons",
    generateId: contentId,
  }),
  schema: ({ image }) =>
    z.object({
      ...articleBase(image),

      items: z
        .array(
          z.object({
            name: z.string(),
            brand: z.string().optional(),
            image: media(image).optional(),
            /** Our score, when we have reviewed it. */
            score: z.number().min(0).max(10).optional(),
            /** Link to the full review, when there is one. */
            reviewHref: z.string().optional(),
            retailer: retailer.optional(),
          }),
        )
        .min(2)
        .max(4),

      /** Index into `items`. Checked against the array length at build time. */
      winner: z.number().int().nonnegative(),
      verdict: z.string(),

      /**
       * A paragraph between the short answer and the table: what the two
       * products are for, and what the numbers below are measuring. Optional —
       * without it the page goes straight from the answer to the table, which
       * is abrupt but not broken.
       */
      intro: z.string().optional(),

      rows: z
        .array(
          z.object({
            label: z.string(),
            values: z.array(z.string()).min(2),
            /** Index into `values`. Omit for rows where neither side wins. */
            winner: z.number().int().nonnegative().optional(),
          }),
        )
        .default([]),

      /** "If you mostly fly" -> which one, and why. The useful half of a versus. */
      scenarios: z
        .array(
          z.object({
            label: z.string(),
            /** Index into `items`. */
            item: z.number().int().nonnegative(),
            detail: z.string(),
          }),
        )
        .default([]),
    }),
});

/* -------------------------------------------------------------------- posts --- */

/**
 * Everything else: buying guides, explainers, news, opinion. A post has no
 * score and no product attached, and builds whatever it needs out of the MDX
 * components — `<Pick>` for a roundup, `<BuyButton>` for a single
 * recommendation, `<SpecTable>`, `<ProsCons>`, `<Callout>`, `<KeyNumbers>`.
 */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts", generateId: contentId }),
  schema: ({ image }) =>
    z.object({
      ...articleBase(image),
      /** Printed as a summary panel above the body. Leave empty to hide it. */
      keyTakeaways: z.array(z.string()).default([]),
    }),
});

export const collections = { reviews, comparisons, posts };
