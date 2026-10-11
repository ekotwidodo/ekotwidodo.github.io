/**
 * Research publication domain entity definition
 */
export type ResearchStatus = 'ongoing' | 'completed';

export interface ResearchFrontmatter {
  title: string;
  abstract: string;
  year: number;
  date: Date;
  venue?: string;
  type?: string;
  status: ResearchStatus;
  doi?: string;
  url?: string;
  keywords?: string[];
  language?: string;
}
