/**
 * Project and showcase domain entity definition
 */
export type ProjectStatus = 'completed' | 'in-progress' | 'archived';

export interface ProjectFrontmatter {
  title: string;
  description: string;
  date: Date;
  status: ProjectStatus;
  technologies: string[];
  role?: string;
  image?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured?: boolean;
}
