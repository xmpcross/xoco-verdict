import { categories, categorySlug } from "./categories";

export const siteConfig = {
  name: "Verdict",
  tagline: "Tested properly. Scored honestly.",
  title: "Verdict - A product review and buyer's guide Astro theme",
  description:
    "An Astro theme for review publications and affiliate sites: scored reviews, head-to-head comparisons, and buying guides.",
  siteUrl: "https://verdict.xocoweb.workers.dev",
  authorName: "Andrei Alba",
  email: "hello@example.com",
  language: "en",
  dateLocale: "en-US",
  /**
   * Reading speed used to estimate the "min read" line on cards and articles.
   * Read time is counted from the article body at build time, so nothing
   * carries it in frontmatter.
   */
  wordsPerMinute: 235,
  locale: "en_US",
  socialImage: "/og-image.png",
  /** Short blurb shown in the footer and under the About page header. */
  bio: "We buy the products, put them on a bench, and then live with them. Every score on this site comes with the measurements behind it and the reason we would still say no.",
  /**
   * Affiliate behaviour. Retailer links come from each product's `retailers`
   * list; this controls how they are labelled and disclosed. The theme prints
   * no prices — a catalogue of them goes stale within days — so every control
   * sends the reader to the retailer to see the current figure. The disclosure
   * is printed anywhere a buy button appears.
   */
  affiliate: {
    enabled: true,
    ctaLabel: "Check price",
    /** Applied to every outbound retailer link. */
    rel: "sponsored noopener noreferrer",
    disclosure:
      "We earn a commission when you buy through these links. It never changes what we recommend, and we buy every unit we test.",
    disclosureHref: "/about/#independence",
  },
  /**
   * Slugs pinned to the homepage lead, in order. Unknown or drafted slugs are
   * skipped and the newest reviews fill any remaining slots, so an empty list
   * gives a purely chronological front page.
   */
  featuredReviews: [
    "kestrel-meridian-14-review",
    "lumenar-vista-r7-review",
    "ardent-stride-5-review",
  ],
  /**
   * The byline that fronts the About page. `name` has to match an `author.name`
   * used in article frontmatter: the block links to that author's archive and is
   * skipped when the name has no published work.
   */
  editor: {
    name: "Dana Whitlock",
    title: "Who runs the lab",
    bio: "Dana has been taking things apart for a living since a magazine paid her to break twelve toasters in 2011. She sets the test protocols, signs off every score, and keeps the spreadsheet where a product's price is hidden from the tester until the scoring is finished.",
  },
  newsletter: {
    enabled: false,
    action: "",
    method: "post",
    emailFieldName: "email",
    title: "Know before you buy.",
    description:
      "One email a week: what we scored, what changed, and what we quietly stopped recommending. No sponsored picks, unsubscribe anytime.",
    terms: "By subscribing you agree to our Terms of Use and Privacy Policy.",
  },
  contact: {
    enabled: false,
    action: "",
    method: "post",
    office: ["Unit 12, Fenwick Works", "Manchester M4 6JG"],
    responseTime: "Usually within two business days.",
  },
  socials: [
    { label: "YouTube", href: "https://www.youtube.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "X", href: "https://x.com" },
    { label: "RSS", href: "/rss.xml" },
  ],
};

export const categoryNavigation = categories.map((category) => ({
  label: category,
  href: `/category/${categorySlug(category)}/`,
}));

/**
 * Desktop navigation. Three content types, then the categories folded into one
 * submenu — which is the whole site, and short enough to read at a glance.
 */
export const primaryNavigation: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  /**
   * Opens the full-width category panel on a desktop bar instead of a plain
   * dropdown. One item at most should carry it; `children` is still used by the
   * mobile menu, and by anything that never reaches the panel.
   */
  mega?: boolean;
}[] = [
  { label: "Reviews", href: "/reviews/" },
  { label: "Compare", href: "/comparisons/" },
  { label: "Guides", href: "/blog/" },
  { label: "Categories", href: "/blog/", children: categoryNavigation, mega: true },
];

export const footerNavigation = [
  {
    title: "Categories",
    links: categoryNavigation,
  },
  {
    title: "Read",
    links: [
      { label: "Reviews", href: "/reviews/" },
      { label: "Comparisons", href: "/comparisons/" },
      { label: "Guides", href: "/blog/" },
      { label: "Reviewers", href: "/author/" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "How we test", href: "/post/how-we-test/" },
      { label: "About us", href: "/about/" },
      { label: "Contact", href: "/contact/" },
      { label: "Privacy", href: "/privacy/" },
      { label: "RSS", href: "/rss.xml" },
    ],
  },
];
