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
 * Fetch all published articles sorted by date (newest first)
 */
export async function getAllArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection('articles', ({ id, data }) => {
    if (isTemplate(id)) return false;
    return !data.draft;
  });

  return articles.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

/**
 * Fetch all research entries sorted by date/year descending
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
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
}

/**
 * Fetch all projects sorted by date descending
 */
export async function getAllProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection('projects', ({ id, data }) => {
    if (isTemplate(id)) return false;
    return !data.draft;
  });
  return projects.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
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
