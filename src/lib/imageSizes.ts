/**
 * Responsive `sizes` strings, one per layout the theme renders images in.
 *
 * A `sizes` value that understates the rendered width is one of the two usual
 * causes of a soft product shot: the browser picks the srcset candidate for the
 * width it was promised, then paints it into a wider box. Each string below is
 * derived from the same tokens the layout uses, so the two stay in step.
 *
 *   --gutter     1.25rem below 40rem, 1.75rem to 64rem, 2.25rem above — per side
 *   --container  82.5rem, so the track stops growing at 85.5rem of viewport
 *   --sidebar    17rem, plus the 3.5rem `.with-sidebar` gap: 20.5rem comes out
 *                of the track from 64rem up
 *   grid gap     1.5rem between cards
 *
 *   track = min(100vw - 2 x gutter, 82.5rem)
 *   main  = track - 20.5rem   (from 64rem up; the whole track below it)
 *
 * The other cause is the crop. A `sizes` string describes the width of the box,
 * so a portrait frame filled by a landscape source needs the image generated at
 * the frame's own ratio — otherwise the candidate has to be scaled until its
 * height fits and everything comes out soft at the same `sizes`. Components
 * that paint into a fixed ratio pass `width`, `height`, and `fit="cover"` for
 * exactly that reason.
 *
 * When a page lays cards out in something other than the grid a component
 * defaults to, pass the matching string to the component's `sizes` prop rather
 * than letting the default under-request.
 */
export const cardSizes = {
  /** `.grid-cards` on the full track: 3 columns from 64rem, 2 from 40rem. */
  grid3:
    "(min-width: 85.5rem) 26.7rem, (min-width: 64rem) calc((100vw - 5.5rem) / 3), (min-width: 40rem) calc((100vw - 3.75rem) / 2), calc(100vw - 2rem)",

  /** `.grid-cards--4`: 4 columns from 72rem, 2 from 34rem. */
  grid4:
    "(min-width: 85.5rem) 19.7rem, (min-width: 72rem) calc((100vw - 6.75rem) / 4), (min-width: 34rem) calc((100vw - 3.25rem) / 2), calc(100vw - 2rem)",

  /** `.grid-cards--2`: 2 columns from 48rem. */
  grid2:
    "(min-width: 85.5rem) 40.6rem, (min-width: 48rem) calc((100vw - 4.25rem) / 2), calc(100vw - 2rem)",

  /** `.grid-cards` inside the `.with-sidebar` main column. */
  gridMain:
    "(min-width: 85.5rem) 19rem, (min-width: 64rem) calc((100vw - 28.5rem) / 3), (min-width: 40rem) calc((100vw - 3.75rem) / 2), calc(100vw - 2rem)",

  /** The media column of a horizontal row card — a fixed 16rem from 48rem up. */
  rowMedia: "(min-width: 48rem) 16rem, calc(100vw - 2rem)",

  /** The 4rem thumbnail used by sidebar rows and dense lists. */
  thumb: "4rem",

  /**
   * The homepage lead's portrait cover. It takes 0.8 of the 0.8/1 split inside
   * the lead, which itself gives up 19rem and a 4rem gap to the review rail
   * from 68rem up.
   */
  lead: "(min-width: 85.5rem) 26.5rem, (min-width: 68rem) calc((100vw - 27.5rem) * 0.45), (min-width: 48rem) calc((100vw - 6.5rem) * 0.45), calc(100vw - 2.5rem)",

  /** A product shot on its own page — the left column of the product header. */
  productHero:
    "(min-width: 85.5rem) 36rem, (min-width: 64rem) calc((100vw - 3rem) * 0.45), calc(100vw - 2rem)",

  /** An article cover at the top of a review, guide, or comparison. */
  articleCover: "(min-width: 85.5rem) 82.5rem, calc(100vw - 2rem)",
} as const;
