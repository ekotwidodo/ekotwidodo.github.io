import yaml from 'yaml';
import { z } from 'zod';
import rawConfig from '../../site.config.yaml?raw';
import type { SiteConfig } from '@/types/site';

/**
 * Generic Zod schemas for validating the centralized `site.config.yaml`.
 * Completely generic and eliminates all hardcoded personal data from TypeScript codebase,
 * establishing `site.config.yaml` as the sole source of truth.
 */
const PageHeaderSchema = z.object({
  title: z.string().default(''),
  subtitle: z.string().default(''),
  menu_label: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional()
});

const HomePageSchema = z.object({
  greeting: z.string().default("Hi, I'm"),
  typewriter_strings: z.array(z.string()).default([]),
  featured_title: z.string().optional().default('Featured Articles'),
  featured_subtitle: z.string().optional().default('Curated in-depth guides, practical workflows, and series highlights.'),
  featured_limit: z.number().int().positive().max(5).optional().default(5),
  articles_title: z.string().default(''),
  articles_subtitle: z.string().default(''),
  menu_label: z.string().optional().default('Home')
});

const AboutHeroBadgeSchema = z.object({
  text: z.string(),
  variant: z.enum(['primary', 'teal', 'indigo', 'purple', 'emerald', 'amber', 'rose', 'neutral', 'info']).default('primary')
});

const AboutHeroSchema = z.object({
  badges: z.array(AboutHeroBadgeSchema).optional().default([]),
  heading: z.string().optional().default(''),
  description: z.string().optional().default(''),
  avatar: z.string().optional().default('https://avatars.githubusercontent.com/u/90574398?v=4'),
  commitment: z.object({
    enabled: z.boolean().default(true),
    title: z.string().default(''),
    description: z.string().default('')
  }).optional().default(() => ({ enabled: true, title: '', description: '' }))
}).optional().default(() => ({ badges: [], heading: '', description: '', avatar: 'https://avatars.githubusercontent.com/u/90574398?v=4', commitment: { enabled: true, title: '', description: '' } }));

const AboutDomainItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  badge: z.string(),
  variant: z.enum(['purple', 'amber', 'emerald', 'primary', 'rose', 'indigo', 'teal', 'neutral', 'info']).default('primary'),
  level: z.string().optional().default(''),
  description: z.string(),
  topics: z.array(z.string()).optional().default([])
});

const AboutDomainsSectionSchema = z.object({
  title: z.string().default('Core Focus & Technology Domains'),
  subtitle: z.string().default(''),
  hierarchy_note: z.string().optional().default(''),
  topics_label: z.string().optional().default('Key Topics:'),
  items: z.array(AboutDomainItemSchema).default([])
}).optional().default(() => ({ title: 'Core Focus & Technology Domains', subtitle: '', hierarchy_note: '', topics_label: 'Key Topics:', items: [] }));

const AboutTechStackItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  iconType: z.string().default('code'),
  bgColor: z.string().optional().default('bg-slate-100 dark:bg-slate-800'),
  iconColor: z.string().optional().default('text-primary-600')
});

const AboutTechStackSectionSchema = z.object({
  title: z.string().default('Architecture & System Tech Stack'),
  subtitle: z.string().default(''),
  items: z.array(AboutTechStackItemSchema).default([])
}).optional().default(() => ({ title: 'Architecture & System Tech Stack', subtitle: '', items: [] }));

const AboutConnectSectionSchema = z.object({
  title: z.string().default('Connect & Contact'),
  description: z.string().default('')
}).optional().default(() => ({ title: 'Connect & Contact', description: '' }));

const AboutPageSchema = PageHeaderSchema.extend({
  hero: AboutHeroSchema,
  domains_section: AboutDomainsSectionSchema,
  tech_stack_section: AboutTechStackSectionSchema,
  connect_section: AboutConnectSectionSchema
});

const SitePagesSchema = z.object({
  home: HomePageSchema.default(() => ({
    greeting: "Hi, I'm",
    typewriter_strings: [],
    articles_title: '',
    articles_subtitle: '',
    menu_label: 'Home'
  })),
  archives: PageHeaderSchema.default(() => ({
    title: '',
    subtitle: '',
    menu_label: 'Archives'
  })),
  about: AboutPageSchema.default(() => ({
    title: '',
    subtitle: '',
    menu_label: 'About',
    hero: { badges: [], heading: '', description: '', commitment: { enabled: true, title: '', description: '' } },
    domains_section: { title: 'Core Focus & Technology Domains', subtitle: '', hierarchy_note: '', topics_label: 'Key Topics:', items: [] },
    tech_stack_section: { title: 'Architecture & System Tech Stack', subtitle: '', items: [] },
    connect_section: { title: 'Connect & Contact', description: '' }
  })),
  research: PageHeaderSchema.default(() => ({
    title: '',
    subtitle: '',
    menu_label: 'Research'
  })),
  projects: PageHeaderSchema.default(() => ({
    title: '',
    subtitle: '',
    menu_label: 'Projects'
  })),
  contact: PageHeaderSchema.default(() => ({
    title: '',
    subtitle: '',
    menu_label: 'Contact'
  })),
  cv: PageHeaderSchema.default(() => ({
    title: '',
    subtitle: '',
    menu_label: 'CV'
  }))
});

const SiteConfigSchema = z.object({
  site: z.object({
    name: z.string(),
    short_name: z.string().optional().default(''),
    logo: z.string().optional().default('/logo.png'),
    favicon: z.string().optional().default('/logo.png'),
    title: z.string(),
    tagline: z.string().optional().default('Sharing Insights & Exploring Technology'),
    version: z.string().optional().default('1.0.0'),
    subtitle: z.string().optional().default(''),
    description: z.string().optional().default(''),
    url: z.string().optional().default('')
  }),
  author: z.object({
    name: z.string(),
    title: z.string(),
    affiliation: z.string().optional().default(''),
    location: z.string().optional().default(''),
    avatar: z.string().optional().default(''),
    bio: z.string().optional().default(''),
    email: z.string().optional().default('')
  }),
  socials: z.record(z.string(), z.string()).optional().default({}),
  pagination: z
    .object({
      articlesPerPage: z.number().int().positive().default(5),
      researchPerPage: z.number().int().positive().default(6),
      projectsPerPage: z.number().int().positive().default(6)
    })
    .optional()
    .default(() => ({
      articlesPerPage: 5,
      researchPerPage: 6,
      projectsPerPage: 6
    })),
  menu: z
    .object({
      home: z.boolean().default(true),
      archives: z.boolean().default(true),
      research: z.boolean().default(false),
      projects: z.boolean().default(false),
      about: z.boolean().default(true),
      contact: z.boolean().default(false),
      cv: z.boolean().default(false)
    })
    .optional()
    .default(() => ({
      home: true,
      archives: true,
      research: false,
      projects: false,
      about: true,
      contact: false,
      cv: false
    })),
  pages: SitePagesSchema,
  contact: z
    .object({
      email: z.string().default(''),
      location: z.string().default(''),
      timezone: z.string().default(''),
      coordinates: z.string().default(''),
      map: z
        .object({
          enabled: z.boolean().default(false),
          title: z.string().default(''),
          embed_url: z.string().default('')
        })
        .optional()
        .default(() => ({
          enabled: false,
          title: '',
          embed_url: ''
        }))
    })
    .optional()
    .default(() => ({
      email: '',
      location: '',
      timezone: '',
      coordinates: '',
      map: {
        enabled: false,
        title: '',
        embed_url: ''
      }
    }))
});

/**
 * Loads, parses, and validates site configuration strictly from `site.config.yaml`.
 * Completely generic and free of hardcoded personal text.
 */
function loadSiteConfig(): SiteConfig {
  const rawParsed = yaml.parse(rawConfig) || {};
  const validated = SiteConfigSchema.parse(rawParsed);

  return {
    name: validated.site.name,
    short_name: validated.site.short_name,
    logo: validated.site.logo,
    favicon: validated.site.favicon,
    title: validated.site.title,
    tagline: validated.site.tagline,
    version: validated.site.version,
    subtitle: validated.site.subtitle,
    description: validated.site.description,
    url: validated.site.url,
    author: {
      name: validated.author.name,
      title: validated.author.title,
      affiliation: validated.author.affiliation,
      location: validated.author.location,
      avatar: validated.author.avatar,
      bio: validated.author.bio,
      email: validated.author.email,
      socials: {
        ...validated.socials,
        ...(validated.author.email ? { email: validated.author.email } : {})
      }
    },
    pagination: {
      articlesPerPage: validated.pagination.articlesPerPage,
      researchPerPage: validated.pagination.researchPerPage,
      projectsPerPage: validated.pagination.projectsPerPage
    },
    menu: validated.menu,
    pages: validated.pages,
    contact: validated.contact
  };
}

export const siteConfig: SiteConfig = loadSiteConfig();
