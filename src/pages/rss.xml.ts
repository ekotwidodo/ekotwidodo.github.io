import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteConfig } from '@/config/site';
import { getAllArticles } from '@/utils/content';

/**
 * RSS Feed endpoint for published articles
 * Generates standards-compliant XML feed for RSS readers
 */
export async function GET(context: APIContext) {
  const articles = await getAllArticles();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.url,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.summary,
      link: `/articles/${article.id.replace(/\.(md|mdx)$/, '')}/`,
      categories: [article.data.category, ...(article.data.tags || [])]
    })),
    customData: `<language>en-us</language>`
  });
}
