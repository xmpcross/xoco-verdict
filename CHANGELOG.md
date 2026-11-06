# Changelog

All notable changes to Verdict are documented here.

## 1.0.1 - 2026-10-21

- Updated Astro to 7.4.1 and other dependencies.
- Updated `AGENTS.md` for Astro 7.
- Files check out with LF line endings on every platform.
- Removed the Credits section from the README.

## 1.0.0 - 2026-08-29

- Initial commercial release.
- Astro 7 review and affiliate theme with static home, review, comparison, post, review/comparison/blog/category archives, tag, reviewer, search, about, contact, privacy, RSS, robots, sitemap, and 404 routes.
- Three content collections — reviews, comparisons, and posts — with frontmatter validated at build time for products, retailers, specifications, weighted scores, pros and cons, awards, tags, bylines, and revision dates.
- Scores computed at build time as the weighted average of a review's published breakdown, so the badge on the page can never disagree with the table under it.
- Five score bands with their own colours, labels, and meanings, and seven award keys, all defined in `src/config/scoring.ts`; the scale maximum is one number, so a 5-point site is a one-line change.
- Retailer buy boxes, an inline `<BuyButton>`, and a `<Pick>` block for roundups, with the configured affiliate `rel` on every outbound link and the disclosure printed under the retailer table and beside the button. There are no price fields anywhere — every commercial control is a _Check price_ button pointing at the retailer.
- Comparison pages that open on the answer, with a side-by-side product header and a table where products are columns, criteria are rows, the winning cell is marked, and the criterion column stays pinned while the product columns scroll on a phone.
- MDX components for post bodies — `<Pick>`, `<BuyButton>`, `<Callout>`, `<KeyNumbers>`, and `<TestBench>` — plus `<SpecTable>` and `<ProsCons>` from the review page, so a roundup or a buying guide needs no schema changes.
- A colour per category, defined as three gradient stops in `src/config/categories.ts` and carried to the band behind an article headline, the archive header, and the face of its category card. Article pages need no featured image; a cover is only used on cards.
- Full-height front-page hero over a pinned review, a coloured lead band with a review rail beside it, blog and review grids, comparisons beside a compact score ranking, category tiles, and a further advice grid.
- A full-width category menu in the header — one tile per desk carrying the cover of its most recent article — opening and closing on explicit state rather than on a chain of CSS hovers, and usable on a touch screen.
- Built-in client-side search with a keyboard command palette (`/` or `⌘K`) and a dedicated results page, both reading one build-time index that covers product names and brands, not only headlines.
- A share sheet with eleven targets, the long tail folded behind _More_, plus the page link and a copy button, built on a native `<dialog>` so the focus trap, the Escape key, and the backdrop come from the browser.
- Revision dates treated as first-class: with `updatedDate` set, cards and article headers print it instead of the publication date, the RSS feed re-sorts on it, and the article footer prints a dated revision note.
- Canonical URLs, sitemap, RSS, Open Graph, Twitter/X cards, and JSON-LD — `Review` carrying the same rating and scale the page prints, `Article` for everything else.
- Square design system on one radius scale, a warm neutral ramp with a single cobalt accent, and pure-CSS motion — load entrances, scroll-driven reveals, and hover polish — flattened under `prefers-reduced-motion`.
- Static output with no framework islands; client JavaScript is limited to four progressive-enhancement scripts for the header's search palette and menus, the share sheet, the search results page, and the reading-progress bar.
- Self-hosted Jost and Inter variable fonts subset to latin and latin-ext, and a local Phosphor icon set with its license notice — no external font or icon requests.
- Accessible skip link, landmarks, one `h1` per page, visible focus states, keyboard-operable menus and dialogs with focus trapping, and alt text on every meaningful image.
- Provider-neutral newsletter and contact forms, both shipping disabled and saying so in the UI, plus about, contact, and privacy starter pages.
