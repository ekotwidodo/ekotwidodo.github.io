import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Articles Collection Schema
 * Represents blog posts and technical writing
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string().default(''),
    date: z.coerce.date().default(() => new Date()),
    summary: z.string().default(''),
    category: z.string().default(''),
    tags: z.array(z.string()).default([]),
    image: z.string().optional().default(''),
    featured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
    series: z
      .object({
        name: z.string(),
        part: z.number()
      })
      .optional(),
    draft: z.boolean().default(false)
  })
});

/**
 * Research Collection Schema
 * Represents academic publications, theses, and conference papers
 */
const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z.object({
    title: z.string().default(''),
    abstract: z.string().default(''),
    year: z.number().default(() => new Date().getFullYear()),
    date: z.coerce.date().default(() => new Date()),
    venue: z.string().optional().default(''),
    type: z.string().optional().default(''),
    status: z.enum(['ongoing', 'completed']).default('completed'),
    doi: z.string().optional().default(''),
    url: z.string().optional().default(''),
    keywords: z.array(z.string()).default([]),
    language: z.string().default('English'),
    draft: z.boolean().default(false)
  })
});

/**
 * Projects Collection Schema
 * Represents software applications, data pipelines, and engineering showcases
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().default(''),
    description: z.string().default(''),
    date: z.coerce.date().default(() => new Date()),
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    technologies: z.array(z.string()).default([]),
    role: z.string().optional().default(''),
    image: z.string().optional().default(''),
    demoUrl: z.string().optional().default(''),
    repoUrl: z.string().optional().default(''),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

/**
 * About Collection Schema
 * Represents single author bio profile page
 */
const about = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/about' }),
  schema: z.object({
    name: z.string().default(''),
    title: z.string().default(''),
    affiliation: z.string().optional().default(''),
    location: z.string().optional().default(''),
    avatar: z.string().optional().default(''),
    education: z
      .array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          year: z.string(),
          description: z.string().optional()
        })
      )
      .default([]),
    experience: z
      .array(
        z.object({
          position: z.string(),
          company: z.string(),
          period: z.string(),
          description: z.string().optional()
        })
      )
      .default([]),
    skills: z.array(z.string()).default([]),
    researchAreas: z.array(z.string()).default([]),
    specializations: z.array(z.string()).default([]),
    skillCategories: z
      .array(
        z.object({
          category: z.string(),
          skills: z.array(z.string())
        })
      )
      .default([]),
    honorsAndAwards: z
      .array(
        z.object({
          title: z.string(),
          organization: z.string(),
          year: z.string(),
          description: z.string().optional()
        })
      )
      .default([]),
    languages: z
      .array(
        z.object({
          language: z.string(),
          level: z.string(),
          badge: z.string().optional()
        })
      )
      .default([])
  })
});

export const collections = {
  articles,
  research,
  projects,
  about
};
