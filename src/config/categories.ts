/**
 * Product categories. Everything the site publishes belongs to exactly one of
 * these, so the list below is the spine of the whole archive. Rename, reorder,
 * add, or remove entries and the navigation, category pages, article hero
 * bands, and card accents all follow.
 *
 * Keep the names short: they are printed as nav items and as labels on cards.
 */
export const categories = [
  "Audio",
  "Computing",
  "Cameras",
  "Kitchen",
  "Fitness",
  "Workspace",
] as const;

export type Category = (typeof categories)[number];

export const categorySlug = (category: Category) =>
  category
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/\s+/g, "-");

export interface CategoryMeta {
  /** Shown under the category page heading and in its meta description. */
  description: string;
  /** The buying question this desk exists to answer, in the reader's words. */
  question: string;
  /**
   * The colour this category carries: a three-stop gradient that paints the
   * band behind an article headline and the face of a category card. It is the
   * only place a category's hue appears — labels and counts are set in the
   * theme's own greys, so a grid of mixed cards stays quiet.
   *
   * Keep the three stops pale. They sit behind large dark type, and anything
   * saturated enough to be pretty on its own will fail contrast.
   */
  from: string;
  via: string;
  to: string;
}

export const categoryMeta: Record<Category, CategoryMeta> = {
  Audio: {
    description:
      "Headphones, earbuds, and speakers measured on a fixed rig and then lived with — commute, open office, and a quiet room at 11pm.",
    question: "What should I put on my ears?",
    from: "#cfeee0",
    via: "#dbe6fb",
    to: "#e8ddfa",
  },
  Computing: {
    description:
      "Laptops, monitors, and the peripherals attached to them, run through the same battery-and-brightness routine until something gives.",
    question: "What will still be fast in three years?",
    from: "#d3e7fb",
    via: "#dcdefb",
    to: "#efdcf6",
  },
  Cameras: {
    description:
      "Bodies and lenses shot side by side on the same subjects, in the same light — then printed big enough to argue about.",
    question: "What actually improves my photographs?",
    from: "#fbe0d6",
    via: "#f7dbe6",
    to: "#e6dcf8",
  },
  Kitchen: {
    description:
      "Espresso machines, grinders, and brewers pulled, ground, and boiled daily for weeks, with a scale and a thermometer in the way.",
    question: "What earns its counter space?",
    from: "#fdeacc",
    via: "#fbdfd2",
    to: "#f6dced",
  },
  Fitness: {
    description:
      "Shoes, watches, and trackers taken outside for real mileage, cross-checked against a chest strap and a track that does not move.",
    question: "What holds up past the first month?",
    from: "#dcf1cd",
    via: "#cfeee6",
    to: "#d7e6fb",
  },
  Workspace: {
    description:
      "Chairs, desks, and lighting assembled, adjusted, and sat in for full working weeks — including the part where you assemble it wrong.",
    question: "What stops my back complaining?",
    from: "#e6dffb",
    via: "#f3dced",
    to: "#fce2dd",
  },
};

/**
 * The inline custom properties an element needs to carry a category's colour.
 * Used by the article hero band, category cards, and archive headers, so the
 * gradient is defined once per category and never hard-coded in a component.
 */
export const categoryStyle = (category: Category) => {
  const meta = categoryMeta[category];
  return `--cat-from:${meta.from};--cat-via:${meta.via};--cat-to:${meta.to}`;
};
