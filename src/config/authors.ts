import type { ImageMetadata } from "astro";
import danaWhitlock from "@/assets/authors/dana-whitlock.jpg";
import junePark from "@/assets/authors/june-park.jpg";
import marcusOyelaran from "@/assets/authors/marcus-oyelaran.jpg";
import nilsHalvorsen from "@/assets/authors/nils-halvorsen.jpg";
import priyaRaghunathan from "@/assets/authors/priya-raghunathan.jpg";
import sofiaAlmeida from "@/assets/authors/sofia-almeida.jpg";

/**
 * Reviewer portraits and bios, keyed by the `author.name` used in article
 * frontmatter. A name with no entry falls back to a monogram avatar and the
 * role printed on the byline, so this map is optional — add a reviewer here
 * once you have a photo and a bio for them.
 *
 * The bundled portraits are Unsplash placeholders of models with no connection
 * to these fictional bylines. Replace them with photos of your actual
 * contributors before publishing.
 *
 * Provenance of the bundled files, all Unsplash and all free to use without
 * attribution — kept here as a record for whoever swaps them out:
 *
 *   dana-whitlock.jpg       mehdi pezhvak      unsplash.com/photos/43AUR3OGt3I
 *   priya-raghunathan.jpg   Junior REIS        unsplash.com/photos/p98UJsuyVRU
 *   marcus-oyelaran.jpg     Ayo Ogunseinde     unsplash.com/photos/8VghbLlZUdQ
 *   sofia-almeida.jpg       Cemrecan Yurtman   unsplash.com/photos/ih03D0F6M6M
 *   nils-halvorsen.jpg      Ryan Hoffman       unsplash.com/photos/2QDYXAEfFPk
 *   june-park.jpg           Albert Dera        unsplash.com/photos/ILip77SbmOE
 */
export interface AuthorProfile {
  image: ImageMetadata;
  /** Printed on the reviewer archive and in the article footer. */
  bio?: string;
  /** What this reviewer is trusted on — shown as chips on their archive page. */
  beats?: string[];
}

export const authorProfiles: Record<string, AuthorProfile> = {
  "Dana Whitlock": {
    image: danaWhitlock,
    bio: "Editor-in-chief. Sets the test protocols, signs off every score, and keeps the spreadsheet where a product's price stays hidden until the testing is done.",
    beats: ["Test methodology", "Scoring", "Workspace"],
  },
  "Priya Raghunathan": {
    image: priyaRaghunathan,
    bio: "Runs the audio bench: a fixed head-and-torso rig, a sealed room, and a commute she has taken so many times it counts as a control group.",
    beats: ["Headphones", "Earbuds", "Speakers"],
  },
  "Marcus Oyelaran": {
    image: marcusOyelaran,
    bio: "Nine years of shipping laptops back to manufacturers with the battery report attached. Cares more about sustained clocks than peak ones.",
    beats: ["Laptops", "Monitors", "Keyboards"],
  },
  "Sofia Almeida": {
    image: sofiaAlmeida,
    bio: "Pulled espresso professionally for six years before writing about the machines. Owns four thermometers and trusts two of them.",
    beats: ["Espresso", "Grinders", "Kettles"],
  },
  "Nils Halvorsen": {
    image: nilsHalvorsen,
    bio: "Puts roughly 60 miles a week into whatever the lab sends him, with a chest strap on and a track that does not lie about distance.",
    beats: ["Running shoes", "GPS watches", "Wearables"],
  },
  "June Park": {
    image: junePark,
    bio: "Assembles every chair and desk twice — once by the manual, once the way a tired person would at 9pm — and reports both experiences.",
    beats: ["Chairs", "Desks", "Lighting"],
  },
};

export const authorProfile = (name: string): AuthorProfile | undefined => authorProfiles[name];

/** Backwards-compatible alias used by the avatar component. */
export const authorPortrait = authorProfile;
