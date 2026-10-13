/**
 * Site metadata and configuration types
 */
export interface AuthorSocials {
  github?: string;
  linkedin?: string;
  medium?: string;
  instagram?: string;
  x?: string;
  googleScholar?: string;
  researchGate?: string;
  email?: string;
}

export interface AuthorProfile {
  name: string;
  title: string;
  affiliation: string;
  location: string;
  avatar: string;
  bio: string;
  email?: string;
  socials: AuthorSocials;
}

export interface SiteMenuConfig {
  home: boolean;
  archives: boolean;
  research: boolean;
  projects: boolean;
  about: boolean;
  contact: boolean;
  cv?: boolean;
}

export interface ContactMapConfig {
  enabled: boolean;
  title: string;
  embed_url: string;
}

export interface ContactConfig {
  email: string;
  location: string;
  timezone: string;
  coordinates: string;
  map: ContactMapConfig;
}

export interface PageHeaderConfig {
  title: string;
  subtitle: string;
  menu_label?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface HomePageConfig {
  greeting?: string;
  typewriter_strings?: string[];
  featured_title?: string;
  featured_subtitle?: string;
  featured_limit?: number;
  articles_title?: string;
  articles_subtitle?: string;
  menu_label?: string;
}

export interface AboutHeroBadge {
  text: string;
  variant?: 'primary' | 'teal' | 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'neutral' | 'info';
}

export interface AboutHeroConfig {
  badges?: AboutHeroBadge[];
  heading?: string;
  description?: string;
  avatar?: string;
  commitment?: {
    enabled?: boolean;
    title?: string;
    description?: string;
  };
}

export interface AboutDomainItem {
  id: string;
  title: string;
  badge: string;
  variant?: 'purple' | 'amber' | 'emerald' | 'primary' | 'rose' | 'indigo' | 'teal' | 'neutral' | 'info';
  level?: string;
  description: string;
  topics?: string[];
}

export interface AboutDomainsSection {
  title?: string;
  subtitle?: string;
  hierarchy_note?: string;
  topics_label?: string;
  items?: AboutDomainItem[];
}

export interface AboutTechStackItem {
  name: string;
  category: string;
  iconType: string;
  bgColor?: string;
  iconColor?: string;
}

export interface AboutTechStackSection {
  title?: string;
  subtitle?: string;
  items?: AboutTechStackItem[];
}

export interface AboutConnectSection {
  title?: string;
  description?: string;
}

export interface AboutPageConfig extends PageHeaderConfig {
  hero?: AboutHeroConfig;
  domains_section?: AboutDomainsSection;
  tech_stack_section?: AboutTechStackSection;
  connect_section?: AboutConnectSection;
}

export interface SitePagesConfig {
  home: HomePageConfig;
  archives: PageHeaderConfig;
  about: AboutPageConfig;
  research: PageHeaderConfig;
  projects: PageHeaderConfig;
  contact: PageHeaderConfig;
  cv: PageHeaderConfig;
}

export interface SiteConfig {
  name: string;
  short_name?: string;
  logo?: string;
  favicon?: string;
  title: string;
  tagline?: string;
  version?: string;
  subtitle?: string;
  description: string;
  url: string;
  author: AuthorProfile;
  pagination: {
    articlesPerPage: number;
    researchPerPage: number;
    projectsPerPage: number;
  };
  menu: SiteMenuConfig;
  pages: SitePagesConfig;
  contact: ContactConfig;
}
