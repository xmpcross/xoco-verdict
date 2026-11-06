import type { IconName } from "@/components/ui/Icon.astro";

const socialIconByLabel = {
  Facebook: "facebook",
  Instagram: "instagram",
  LinkedIn: "linkedin",
  RSS: "rss",
  TikTok: "tiktok",
  X: "twitter-x",
  Twitter: "twitter-x",
  YouTube: "youtube",
} as const satisfies Record<string, IconName>;

/** Falls back to a generic link glyph for labels the theme has no mark for. */
export const socialIconFor = (label: string): IconName =>
  socialIconByLabel[label as keyof typeof socialIconByLabel] ?? "link";
