// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * Astro Project Configuration for ekotwidodo.github.io
 * Clean JAMStack static site generator configuration
 * @see https://astro.build/config
 */
export default defineConfig({
  site: 'https://ekotwidodo.github.io',
  compressHTML: true,
  integrations: [
    mdx(),
    sitemap()
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkMath, { singleDollarTextMath: true }]],
      rehypePlugins: [rehypeKatex]
    })
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
});
