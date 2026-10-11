// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

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
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
});
