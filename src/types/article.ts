/**
 * Article domain entity definition
 */
export interface ArticleFrontmatter {
  title: string;
  date: Date;
  summary: string;
  category: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}

export interface ArticleArchiveItem {
  id: string;
  slug: string;
  title: string;
  date: Date;
  year: number;
  month: string;
  summary: string;
  category: string;
  tags: string[];
}
