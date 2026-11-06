/**
 * Retailer links, as they appear in frontmatter and in the MDX components.
 *
 * The theme prints no prices. A catalogue of prices goes stale within days and
 * a wrong one costs a publication more trust than it earns in clicks, so every
 * commercial control here sends the reader to the retailer to see the current
 * figure instead.
 */
export interface Retailer {
  name: string;
  url: string;
  /** "Ships free over $50", "Refurb stock only". */
  note?: string;
}
