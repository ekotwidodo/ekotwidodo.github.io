import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Service layer for querying and filtering content collections.
 * Encapsulates data fetching and sorting logic to preserve Clean Architecture.
 */

export type ArticleEntry = CollectionEntry<'articles'>;
export type ResearchEntry = CollectionEntry<'research'>;
export type ProjectEntry = CollectionEntry<'projects'>;
export type AboutEntry = CollectionEntry<'about'>;

function isTemplate(id: string): boolean {
  const normalized = id.toLowerCase().replace(/\\/g, '/');
  return (
    normalized === 'template' ||
    normalized === 'template.md' ||
    normalized === 'template.mdx' ||
    normalized.endsWith('/template') ||
    normalized.endsWith('/template.md') ||
    normalized.endsWith('/template.mdx')
  );
}

/**
 * Fetch all published articles sorted by datetime descending (newest first)
 */
export async function getAllArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection('articles', ({ id, data }) => {
    if (isTemplate(id)) return false;
    return !data.draft;
  });

  return articles.sort((a, b) => {
    const timeA = new Date(a.data.date).getTime();
    const timeB = new Date(b.data.date).getTime();
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    // Fallback tie-breaker if timestamps are identical:
    // Sort reverse-alphabetically by id/filename so latest files appear first
    return b.id.localeCompare(a.id);
  });
}

/**
 * Fetch featured articles sorted by featuredOrder ascending (if present), then date descending
 */
export async function getFeaturedArticles(limit: number = 5): Promise<ArticleEntry[]> {
  const articles = await getAllArticles();
  const featured = articles.filter((a) => a.data.featured);

  const sorted = featured.sort((a, b) => {
    // If both have featuredOrder, sort by order ascending
    if (a.data.featuredOrder !== undefined && b.data.featuredOrder !== undefined) {
      if (a.data.featuredOrder !== b.data.featuredOrder) {
        return a.data.featuredOrder - b.data.featuredOrder;
      }
    } else if (a.data.featuredOrder !== undefined) {
      return -1;
    } else if (b.data.featuredOrder !== undefined) {
      return 1;
    }

    // Default to date descending
    const timeA = new Date(a.data.date).getTime();
    const timeB = new Date(b.data.date).getTime();
    return timeB - timeA;
  });

  // Strictly enforce maximum of 5 featured articles
  const effectiveLimit = Math.min(Math.max(1, limit), 5);
  return sorted.slice(0, effectiveLimit);
}

/**
 * Fetch all articles belonging to a specific series, sorted by part number ascending
 */
export async function getArticlesBySeries(seriesName: string): Promise<ArticleEntry[]> {
  const articles = await getAllArticles();
  const normalizedTarget = seriesName.trim().toLowerCase();

  const seriesArticles = articles.filter(
    (a) => a.data.series && a.data.series.name.trim().toLowerCase() === normalizedTarget
  );

  return seriesArticles.sort((a, b) => {
    const partA = a.data.series?.part ?? 0;
    const partB = b.data.series?.part ?? 0;
    return partA - partB;
  });
}

/**
 * Interface representing series navigation context for an article
 */
export interface SeriesNavigationInfo {
  seriesName: string;
  currentPart: number;
  totalParts: number;
  allParts: ArticleEntry[];
  prevArticle?: ArticleEntry;
  nextArticle?: ArticleEntry;
}

/**
 * Get series navigation details for a given article
 */
export async function getSeriesNavigation(
  currentArticle: ArticleEntry
): Promise<SeriesNavigationInfo | undefined> {
  if (!currentArticle.data.series) return undefined;

  const seriesName = currentArticle.data.series.name;
  const currentPart = currentArticle.data.series.part;
  const allParts = await getArticlesBySeries(seriesName);

  if (allParts.length === 0) return undefined;

  const currentIndex = allParts.findIndex((item) => item.id === currentArticle.id);
  const prevArticle = currentIndex > 0 ? allParts[currentIndex - 1] : undefined;
  const nextArticle =
    currentIndex >= 0 && currentIndex < allParts.length - 1 ? allParts[currentIndex + 1] : undefined;

  return {
    seriesName,
    currentPart,
    totalParts: allParts.length,
    allParts,
    prevArticle,
    nextArticle
  };
}

/**
 * Extract all distinct series names with article counts
 */
export async function getAllSeries(): Promise<{ name: string; count: number; articles: ArticleEntry[] }[]> {
  const articles = await getAllArticles();
  const seriesMap = new Map<string, ArticleEntry[]>();

  for (const article of articles) {
    if (article.data.series?.name) {
      const name = article.data.series.name.trim();
      const existing = seriesMap.get(name) || [];
      existing.push(article);
      seriesMap.set(name, existing);
    }
  }

  const result: { name: string; count: number; articles: ArticleEntry[] }[] = [];
  for (const [name, seriesArticles] of seriesMap.entries()) {
    seriesArticles.sort((a, b) => (a.data.series?.part ?? 0) - (b.data.series?.part ?? 0));
    result.push({
      name,
      count: seriesArticles.length,
      articles: seriesArticles
    });
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetch all research entries sorted by year and datetime descending
 */
export async function getAllResearch(): Promise<ResearchEntry[]> {
  const research = await getCollection('research', ({ id, data }) => {
    if (isTemplate(id)) return false;
    return !data.draft;
  });
  return research.sort((a, b) => {
    if (b.data.year !== a.data.year) {
      return b.data.year - a.data.year;
    }
    const diff = new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    if (diff !== 0) return diff;
    return b.id.localeCompare(a.id);
  });
}

/**
 * Fetch all projects sorted by datetime descending
 */
export async function getAllProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects', ({ id, data }) => {
    if (isTemplate(id)) return false;
    return !data.draft;
  });
  return projects.sort((a, b) => {
    const diff = new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    if (diff !== 0) return diff;
    return b.id.localeCompare(a.id);
  });
}

/**
 * Fetch the single author profile / about document
 */
export async function getAboutProfile(): Promise<AboutEntry | undefined> {
  const aboutEntries = await getCollection('about');
  return aboutEntries[0];
}

/**
 * Extract distinct tags from articles
 */
export async function getAllTags(): Promise<string[]> {
  const articles = await getAllArticles();
  const tagsSet = new Set<string>();
  for (const article of articles) {
    if (article.data.tags) {
      for (const tag of article.data.tags) {
        tagsSet.add(tag);
      }
    }
  }
  return Array.from(tagsSet).sort();
}

/**
 * Extract distinct categories from articles
 */
export async function getAllCategories(): Promise<string[]> {
  const articles = await getAllArticles();
  const categoriesSet = new Set<string>();
  for (const article of articles) {
    if (article.data.category) {
      categoriesSet.add(article.data.category);
    }
  }
  return Array.from(categoriesSet).sort();
}

/**
 * Extract distinct publication years from articles
 */
export async function getAllArticleYears(): Promise<number[]> {
  const articles = await getAllArticles();
  const yearsSet = new Set<number>();
  for (const article of articles) {
    yearsSet.add(new Date(article.data.date).getFullYear());
  }
  return Array.from(yearsSet).sort((a, b) => b - a);
}
