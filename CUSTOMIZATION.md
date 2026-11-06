# Customization Guide

Everything below is a change to a config file, a frontmatter field, or a CSS
token. You should rarely need to edit a component to re-skin or re-scope the
site.

---

## Site settings

`src/config/site.ts` holds the identity, commercial behaviour, and navigation.

| Field                              | What it does                                                           |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `name`, `tagline`                  | Wordmark and the strapline in the footer                               |
| `title`, `description`             | Default `<title>` and meta description                                 |
| `siteUrl`                          | Canonical URLs, OG images, sitemap, RSS. **Set this before building.** |
| `wordsPerMinute`                   | Reading speed for the "min read" line                                  |
| `dateLocale`, `locale`, `language` | Date formatting and `<html lang>`                                      |
| `socialImage`                      | Default Open Graph image, from `public/`                               |
| `bio`                              | Blurb in the footer and on the About page                              |
| `featuredReviews`                  | Review slugs pinned to the homepage lead, in order                     |
| `editor`                           | The byline fronting the About page                                     |
| `affiliate`                        | Commercial behaviour — see below                                       |
| `newsletter`, `contact`            | Form providers; both ship disabled                                     |
| `socials`                          | Footer and mobile-menu links                                           |

Navigation is derived at the bottom of the same file. `primaryNavigation` is the
header bar; `footerNavigation` is the three footer columns. Categories are
injected automatically from `categories.ts`.

A `primaryNavigation` item can take three shapes:

- **A link** — `{ label, href }`.
- **A dropdown** — add `children`, and the desktop bar shows a small panel of
  links under it.
- **The category panel** — add `mega: true`, and the desktop bar shows a
  full-width panel instead: one tile per category, each carrying the cover of
  that desk's most recent article and its article count. Nothing to configure
  and no artwork to source; a category with nothing published is left out. Keep
  `children` alongside it — the mobile menu uses that list.

An item's `href` is where a click lands, not what makes it the current page: an
item with `children` is marked current when the page belongs to one of its
children, so a parent whose href doubles as another item's page does not
underline both.

### Affiliate settings

```ts
affiliate: {
  enabled: true,
  ctaLabel: "Check price",
  rel: "sponsored noopener noreferrer",
  disclosure: "We earn a commission when you buy through these links…",
  disclosureHref: "/about/#independence",
}
```

`rel` is applied to every outbound retailer link the theme renders — buy boxes,
`<BuyButton>`, `<Pick>`, and the comparison winner's button. With `enabled: false`
the retailer lists stay and the disclosure disappears.

**There are no price fields anywhere in the theme.** Prices move faster than
anyone can maintain them across a catalogue, and a stale one costs more trust
than it earns, so every commercial control is a _Check price_ button pointing at
the retailer. `ctaLabel` is what that button says.

---

## Categories

`src/config/categories.ts`.

```ts
export const categories = [
  "Audio",
  "Computing",
  "Cameras",
  "Kitchen",
  "Fitness",
  "Workspace",
] as const;
```

Renaming or adding an entry updates the navigation, the category pages, the
homepage tiles, and the frontmatter enum at once. Each category also carries:

- `question` — the buying question printed on the category card
- `description` — printed under the category page heading and used as its meta description
- `from`, `via`, `to` — the three stops of the category's gradient
- `ink` — a saturated version of the same hue, used for the small category label

### The category colour

This is where the theme gets its colour. `categoryStyle(category)` returns the
three gradient stops as an inline `style`, and any element carrying them can
paint itself with `.cat-band` — the article hero, archive headers, and category
cards.

Keep the three stops **pale**. They sit behind large dark type, and anything
saturated enough to look pretty on its own will fail contrast.

A category's hue appears nowhere else. Card labels, counts, and eyebrows are set
in the theme's greys on purpose: six saturated inks on one grid of cards reads as
a colour chart, and the label is the smallest type on the card.

---

## Scoring

`src/config/scoring.ts` owns every number the theme prints.

- `SCORE_MAX` — the top of the scale. Change it to 5 and every badge, meter, and
  structured-data rating follows.
- `SCORE_PRECISION` — decimal places on a printed score.
- `scoreBands` — the five bands, highest first. Each has a `min`, a `label`, a
  `meaning` printed beside the badge, and a `tone` that maps to a
  `--score-<tone>` colour token in `global.css`. The list must stay sorted
  downwards and the last entry must start at `0`.
- `awards` — the award keys usable in frontmatter and on `<Pick>`. Add your own;
  nothing else needs to know about it.
- `overallScore()` — the weighted average. This is what produces the published
  number, so an editor cannot type a headline score the breakdown does not
  support.

---

## Content types

Three collections, defined in `src/content.config.ts`. Entries that carry images
live in a folder with the images beside them; entries that do not can be a
single file. The folder or file name is the slug and the URL.

### Shared fields

Every article type takes these:

| Field                                         | Required | Notes                                      |
| --------------------------------------------- | -------- | ------------------------------------------ |
| `title`, `excerpt`                            | yes      | Excerpt is used on cards, search, and meta |
| `category`                                    | yes      | Must be one of `categories`                |
| `date`                                        | yes      |                                            |
| `updatedDate`                                 | no       | When set, printed **instead of** `date`    |
| `author` `{ name, role }`                     | yes      |                                            |
| `coauthors[]`                                 | no       | Same shape; portraits stack on the byline  |
| `tags[]`                                      | no       |                                            |
| `cover` `{ src, alt, creditName, creditUrl }` | yes      | Credit fields are required on purpose      |
| `featured`                                    | no       | Pins to the top of its archive             |
| `draft`                                       | no       | Filtered out of every listing and route    |

### `reviews`

Adds a `product` object and the judgement fields.

```yaml
product:
  name: Atlas II
  brand: Northbeam Audio
  image: { src: ./product.jpg, alt: …, creditName: …, creditUrl: … } # optional
  retailers:
    - name: Northbeam Direct
      url: https://…
      note: Two-year warranty when registered
  specs:
    - group: Acoustics
      items:
        - { label: Driver, value: 40 mm dynamic }

verdict: The bottom line, in one paragraph.
scores: # weighted breakdown
  - { label: Noise cancellation, value: 9.4, weight: 2, note: 31.4 dB at 100 Hz }
score: 8.8 # only used when `scores` is empty
pros: [At least one]
cons: [At least one]
award: editors-choice # optional
bestFor: Who should buy it.
skipIf: Who should not.
testedFor: six weeks
sourcing: Bought at retail with our own money.
```

`cons` requires at least one entry. That is deliberate: a review with nothing
bad to say about a product is an advertisement.

If `product.image` is omitted the cover is reused for the product thumbnail.

### `comparisons`

```yaml
items: # two to four; these are the table columns
  - name: Northbeam Atlas II
    brand: Northbeam Audio
    image: { src: ./item-1.jpg, … }
    score: 8.8 # optional
    reviewHref: /review/…/ # optional
    retailer: { name: …, url: … } # optional
winner: 0 # index into `items`
verdict: The short answer.
intro: | # optional paragraph between the answer and the table
  What the two products are, and what the numbers below measure.
rows: # `values` lines up with `items` by index
  - label: Isolation, 100 Hz
    values: ["31.4 dB", "24.1 dB"]
    winner: 0 # optional; omit where neither side wins
scenarios:
  - { label: If you commute by train, item: 0, detail: … }
```

`winner` and every `scenarios[].item` are validated against the length of
`items` at build time, so an out-of-range index fails the build rather than
rendering a blank name.

### `posts`

Everything else. Adds only `keyTakeaways: string[]`, printed as a summary panel
above the body. Leave it empty and the panel disappears.

Commercial blocks come from MDX components instead of the schema, which is how
a roundup or a buying guide is built.

---

## MDX components

Import them at the top of any `.mdx` body.

### `<Pick>` — one recommendation in a roundup

```mdx
import Pick from "@/components/mdx/Pick.astro";
import shot from "./pick-1.jpg";

<Pick
  rank={1}
  award="best-overall"
  brand="Northbeam Audio"
  name="Atlas II"
  image={shot}
  imageAlt="Over-ear headphones on a metal surface"
  imageFit="cover"
  score={8.8}
  href="/review/northbeam-atlas-2-review/"
  buyUrl="https://example.com/northbeam/atlas-2"
  buyLabel="Northbeam Direct"
>
  The best measured isolation under $400, and a tuning that does not tire.
</Pick>
```

Everything except `name` is optional. `buyUrl` gets the affiliate `rel`
automatically, and `buyLabel` names the retailer on the button.

A white card with a coloured tab on its top edge: the picture, the product, one
or two sentences, and the way to buy it. This is the only real card in the
theme, and it earns one — in a column of prose the reader needs to see at a
glance where a recommendation starts and the argument resumes.

**Keep the card to the recommendation.** Reasons, measurements, and caveats go
in the body copy after the block, where they can be argued instead of listed.
The card deliberately has no room for them: a roundup of five picks that each
carry a bullet list stops being readable somewhere around the third one.

The tab prints the award's label. `headline` overrides that wording when you
want something other than the standard label, and `rank` adds the position. Both
are optional; with neither an award nor a headline, the tab is not drawn.

`imageFit` defaults to `cover`, which suits a photograph. Set it to `contain`
for a retailer cut-out on white — the shot is then set inside the frame on a
neutral panel instead of being cropped to it, so a tall product is not trimmed.

### `<BuyButton>` — a single call to action mid-article

```mdx
<BuyButton name="Atlas II" retailer="Northbeam Direct" url="https://…" />
```

Prints the inline disclosure unless `showDisclosure={false}`.

### `<Callout>` — an aside

`tone` is `note` (blue), `tip` (green), `caution` (amber), or `method` (grey).

```mdx
<Callout tone="method" title="How we measured this">
  Three runs, pads reseated between each.
</Callout>
```

### `<KeyNumbers>` — a row of measured figures

```mdx
<KeyNumbers
  items={[
    { value: "31.4", unit: "dB", label: "Isolation at 100 Hz", note: "Class average: 24.0 dB" },
  ]}
/>
```

### `<TestBench>` — measurements against a reference

```mdx
<TestBench
  caption="Sealed room, three runs averaged."
  referenceLabel="Class average"
  rows={[{ label: "Isolation, 100 Hz", result: "31.4 dB", reference: "24.0 dB", better: true }]}
/>
```

`better: true` marks the row as a win; omit it where "better" is not meaningful.

### `<SpecTable>` and `<ProsCons>`

Both live outside `components/mdx/`, but a post body can import them like any
other component:

```mdx
import SpecTable from "@/components/product/SpecTable.astro";
import ProsCons from "@/components/review/ProsCons.astro";

<SpecTable specs={[{ group: "Acoustics", items: [{ label: "Driver", value: "40 mm" }] }]} />
<ProsCons pros={["Cheap"]} cons={["Feels cheap"]} />
```

---

## Pages and routes

| Path                                                         | What it is                                                                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                                                          | Home: cover hero, lead review with a review rail, blog grid, scored reviews, comparisons beside the score ranking, categories, more advice |
| `/reviews/`                                                  | Review archive, paginated                                                                                                                  |
| `/review/<slug>/`                                            | A scored review                                                                                                                            |
| `/comparisons/`                                              | Comparison archive, paginated                                                                                                              |
| `/comparison/<slug>/`                                        | A head-to-head                                                                                                                             |
| `/blog/`                                                     | Post archive, paginated                                                                                                                    |
| `/post/<slug>/`                                              | A post                                                                                                                                     |
| `/category/<slug>/`                                          | Everything in one category, paginated                                                                                                      |
| `/tag/<slug>/`                                               | Everything under one tag                                                                                                                   |
| `/author/`                                                   | The reviewers                                                                                                                              |
| `/author/<slug>/`                                            | One reviewer's work                                                                                                                        |
| `/search/`                                                   | Search results — `noindex`, and kept out of the sitemap                                                                                    |
| `/about/` `/contact/` `/privacy/`                            | Static pages                                                                                                                               |
| `/rss.xml` `/sitemap.xml` `/robots.txt` `/search-index.json` | Feeds and indexes                                                                                                                          |

The four paginated archives share `src/layouts/ArchiveLayout.astro`; the tag and
reviewer pages build their own listing from the same `ArticleCard`.

`/sitemap.xml` is a hand-written index pointing at `/sitemap-0.xml`, which
`@astrojs/sitemap` generates — `robots.txt` advertises the first, so the
buyer-facing URL stays the conventional one.

---

## Design tokens

`src/styles/global.css` is the whole design system. The `:root` block is where
you re-skin the theme.

### Colour

Three families, and no fourth. Everything that is not a category band or a score
is grey, ink, or the one accent.

- **Neutrals** — the `--n-*` ramp, warm, so the page reads as paper. Labels,
  counts, eyebrows, and awards live here.
- **Accent** — `--cobalt-*`, used for navigation, links, focus rings, and the
  buy button. Blue sits outside the score ramp on purpose: it never means
  "good". This is the one colour to change if you are re-branding.
- **Category gradients** — set per category in `categories.ts`, not here.
- **Score ramp** — `--score-exceptional` through `--score-poor`. With the
  gradients, the only place hue carries meaning. Changing one changes every
  badge, meter, band label, and About-page swatch that uses it.
- **Judgement** — `--pro`, `--con`, and `--award`, for pros and cons lists and
  the coloured callout variants inside an article body.

### Type

Two families and no third voice:

```css
--font-display: "Jost", …; /* headlines, labels, controls, scores */
--font-sans: "Inter", …; /* body copy, metadata, table keys */
--font-mono: ui-monospace, …; /* code blocks only — no webfont shipped */
```

Jost is geometric, so the display face carries two tracks rather than one:
`--ls-title` (negative, for headlines) and `--ls-eyebrow` / `--ls-control`
(positive, for the capitals). Changing the display family usually means
revisiting all three.

To swap a face, drop the `woff2` into `public/fonts/<family>/`, update the
`@font-face` blocks at the top of `global.css`, and update the two `<link
rel="preload">` tags in `src/layouts/BaseLayout.astro`.

Two small-text styles do most of the labelling:

- `.txt-eyebrow` — capitals on a wide track in the display face. Section
  kickers, category names (`.txt-cat`), buttons, chips, table headers, nav.
  This is the one place the theme sets type in capitals; it is also the fastest
  single class to change if you want a quieter interface.
- `.txt-label` — the body face one step down, for metadata, spec keys, and
  credits. Never capitals.

### Shape and layout

```css
--radius-control: 0; /* buttons, inputs, chips, score badges */
--radius-block: 0; /* cards, panels, media */
--container: 82.5rem; /* the site's measure */
--reading: 42rem; /* article column */
--measure: 56rem; /* article-width blocks: comparisons, article heroes */
--sidebar: 17rem;
--gutter: 1.25rem → 2.25rem; /* responsive */
```

The theme is square. Set both radii to `0.75rem` for a rounded one — every
button, card, panel, badge, and media frame reads them.

Media frames come from one set of classes on `.media`: `--tall` (4:5) is the
portrait crop the card grids and the homepage lead use, and `--wide` (16:10) is
the row card's. `--portrait` (3:4), `--photo` (3:2), `--product` (4:3), and
`--square` are there for blocks of your own. Card covers are cropped from the
centre, so pick covers with the product near the middle of the frame.

### Prose

Prose element rules are written as `:where(.prose) el`, which gives them
specificity `(0,0,1)`. That is deliberate: any component dropped into an article
body styles itself with a plain class and wins, instead of inheriting link
colours and list markers from the reading column. Keep that pattern if you add
prose rules.

---

## Images

Covers and product shots are imported through Astro's image pipeline, so they
are optimised, responsive, and given intrinsic dimensions. Put them beside the
`index.mdx` that uses them and reference them relatively (`./cover.jpg`).

`src/lib/imageSizes.ts` holds the responsive `sizes` strings, each derived from
the same layout tokens the grids use. If you change `--container`, `--gutter`,
or a grid's column count, update the matching string there — a `sizes` value
that understates the rendered width is the usual cause of a soft image.

Every image field requires `creditName` and `creditUrl`. That is intentional for
a site that runs on other people's product photography.

---

## Icons

`src/components/ui/Icon.astro` registers every icon. They are
[Phosphor](https://phosphoricons.com/) regular-weight SVGs held locally in
`src/icons/phosphor/` — nothing is fetched at runtime and there is no sprite or
icon font.

To add one: drop `<name>.svg` into that folder, import it at the top of
`Icon.astro`, and add it to the `icons` map.

Components that accept a `class` prop spread their remaining props onto the root
element. Keep that when writing new ones — Astro passes a parent's scoped-style
attribute down as a prop, and dropping it makes the parent's CSS vanish from the
build.

---

## Sharing

`src/components/blocks/ShareSheet.astro` holds the whole sheet: two arrays of
targets — the seven that show, and the four folded behind _More_ — each with its
label, icon, brand colour, and share URL. Add, remove, or reorder entries there
and the grid follows. The URL defaults to the canonical URL of the page being
rendered, so a target is never handed a preview host.

`ArticleFooter` renders the one sheet a page gets. `ShareButton` opens it and can
be dropped anywhere on the same page; the theme uses two — `variant="quiet"`
under the byline in `ArticleHero`, and `variant="button"` at the end of the
article.

---

## Search

Both searches read one build-time index at `/search-index.json`, generated by
`src/pages/search-index.json.ts`. Reviews are indexed by product name and brand
as well as by headline, because the thing a reader types is usually a product.

The header palette opens with `/` or `⌘K`. It inlines the ten most recent
entries as a fallback so it works on the first keystroke and on a page that
never reaches the network.

To index more fields, add them in `search-index.json.ts` and include them in the
`haystack` in `src/pages/search.astro` and the ranking function in
`src/components/SiteHeader.astro`.

---

## Newsletter and contact forms

Both ship disabled and say so in the UI rather than silently swallowing input.
To enable, set `enabled: true` and an `action` URL for your provider in
`site.ts`. The email field name is configurable for providers that expect
something other than `email`.

---

## Motion

The motion layer is one CSS section at the foot of `src/styles/global.css` —
there is no animation JavaScript in the theme. It carries three kinds of
movement:

- **Load entrances.** The front-page hero, article gradient bands, and archive
  headers rise in with a short stagger; the front-page cover settles from a
  slight oversize. These blocks always open the page, so a plain `animation`
  on load is all they need.
- **Scroll-driven reveals.** Score breakdown bars grow from the left and cards
  rise a step as they enter, on CSS scroll-driven animations
  (`animation-timeline: view()`) inside an `@supports` guard. A browser
  without view timelines renders the finished state and loses only the
  movement.
- **Hover polish.** Cover images zoom inside their frame, buttons lift and
  press, chips nudge, headlines underline, and a rail of links fades every
  entry but the one under the pointer. These are plain transitions on the
  components themselves.

It holds to two rules that are worth keeping if you extend it.

**Nothing animates opacity.** Every effect moves or grows something already
painted. A reader on a slow phone, or one who screenshots the page half a
second in, loses the movement and keeps the article. The meters are safe to
grow because the figure each bar represents is printed beside it: a bar caught
halfway is short, not wrong.

**Nothing animates a number the page is asserting.** There is no score
count-up, for the same reason a review site exists — a score caught mid-count
is not a rough score, it is a wrong one.

`prefers-reduced-motion: reduce` flattens the whole layer: the reduced-motion
block zeroes every duration, and the scroll-driven rules sit inside a
`no-preference` media query because a scrubbed animation has no duration to
zero.

To add an effect, keep the keyframes to a `from` state only — at rest the
animation then defers to the element's own transform, so hover effects still
compose on top.

---

## Removing things

- **Comparisons or posts** — delete the collection from `content.config.ts`, its
  two route folders, its entry in `kindMeta`, and its navigation links.
- **Awards** — empty the `awards` object in `scoring.ts`; the badges disappear.
- **Reading progress** — remove the `.reading-progress` markup, style block, and
  script from `src/pages/review/[slug].astro`.
- **Motion** — delete the Motion section at the foot of
  `src/styles/global.css`. Each effect is its own rule, so a single one can go
  on its own too.
- **The gradient bands** — delete `.cat-band` from `global.css` and the
  `categoryStyle()` calls in `ArticleHero`, `ArchiveLayout`, `ArticleCard`,
  `CategoryCard`, and `SiteHeader`. The pages fall back to the plain page
  background.
