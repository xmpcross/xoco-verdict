// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import { siteConfig } from "./src/config/site.ts";
import { codeTheme } from "./src/config/code.ts";

const shikiConfig = /** @type {const} */ ({
  theme: codeTheme,
});

export default defineConfig({
  site: siteConfig.siteUrl,
  integrations: [
    /* Reviews, guides, and comparisons are MDX so a writer can drop a
       measurement table or a callout into the middle of an argument. */
    mdx(),
    sitemap({
      filter: (page) => page !== new URL("/search/", siteConfig.siteUrl).toString(),
    }),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeSlug],
    }),
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
