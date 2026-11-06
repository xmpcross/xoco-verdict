/**
 * The scoring system. Everything numeric the theme prints — badges, meters,
 * leaderboards, comparison winners — reads from this file, so a publication can
 * move to a 5-point scale or rename the bands without touching a component.
 */

/** Highest score a review can award. Scores are stored on this scale. */
export const SCORE_MAX = 10;

/** Decimal places printed on a score. `8.65` prints as `8.7` at 1. */
export const SCORE_PRECISION = 1;

/**
 * Verdict bands, highest first. The first band whose `min` a score reaches wins,
 * so the list must stay sorted downwards and the last entry must start at 0.
 *
 * `tone` maps to the colour tokens in `global.css` (`--score-<tone>`), which is
 * where the actual hues live.
 */
export interface ScoreBand {
  min: number;
  label: string;
  tone: "exceptional" | "strong" | "fair" | "weak" | "poor";
  /** One line printed beside the badge on review and product pages. */
  meaning: string;
}

export const scoreBands: ScoreBand[] = [
  {
    min: 9,
    label: "Exceptional",
    tone: "exceptional",
    meaning: "Best in its class. We buy this with our own money.",
  },
  {
    min: 8,
    label: "Strong buy",
    tone: "strong",
    meaning: "Recommended without caveats for most people.",
  },
  {
    min: 6.5,
    label: "Good, with caveats",
    tone: "fair",
    meaning: "Worth buying if the compromises below suit you.",
  },
  {
    min: 5,
    label: "Only on sale",
    tone: "weak",
    meaning: "Hard to recommend at list price.",
  },
  { min: 0, label: "Skip it", tone: "poor", meaning: "Something else does this better for less." },
];

export const scoreBandFor = (score: number): ScoreBand =>
  scoreBands.find((band) => score >= band.min) ?? scoreBands[scoreBands.length - 1];

/** `8.7`, never `8.70` or `9`. */
export const formatScore = (score: number) => score.toFixed(SCORE_PRECISION);

/** 0–1, for meters and bar widths. */
export const scoreFraction = (score: number) => Math.min(Math.max(score / SCORE_MAX, 0), 1);

/**
 * Awards a review or a guide pick can carry. The key goes in frontmatter; the
 * label is what readers see. Add your own — nothing else needs to know about it.
 */
export const awards = {
  "editors-choice": { label: "Editors' Choice" },
  "best-overall": { label: "Best Overall" },
  "best-value": { label: "Best Value" },
  "best-budget": { label: "Best Budget" },
  "best-upgrade": { label: "Best Upgrade" },
  "runner-up": { label: "Runner-up" },
  "also-great": { label: "Also Great" },
} as const;

export type AwardKey = keyof typeof awards;

export const awardKeys = Object.keys(awards) as [AwardKey, ...AwardKey[]];

export const awardMeta = (key: AwardKey) => awards[key];

/** One weighted subscore on a review — "Sound", "Battery", "Build". */
export interface Subscore {
  label: string;
  value: number;
  weight?: number;
  note?: string;
}

/**
 * The number a review actually publishes. Subscores are averaged by weight
 * (default 1 each) so an editor cannot quietly print a headline number the
 * breakdown does not support; a review with no subscores falls back to the
 * explicit `score` in its frontmatter.
 */
export const overallScore = (subscores: Subscore[], explicit?: number) => {
  if (subscores.length === 0) return explicit ?? 0;
  const totalWeight = subscores.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  if (totalWeight === 0) return explicit ?? 0;
  const weighted = subscores.reduce((sum, item) => sum + item.value * (item.weight ?? 1), 0);
  return Math.round((weighted / totalWeight) * 10) / 10;
};
