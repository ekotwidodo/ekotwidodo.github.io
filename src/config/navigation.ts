import type { NavItem } from '@/types/navigation';
import { siteConfig } from '@/config/site';

/**
 * Navigation item definition with corresponding site.config.yaml menu key.
 * Completely dynamic and driven by site.config.yaml.
 */
interface ConfigurableNavItem extends NavItem {
  key: keyof typeof siteConfig.menu;
}

export const allNavItems: ConfigurableNavItem[] = [
  { name: siteConfig.pages.home.menu_label || siteConfig.pages.home.articles_title || 'Home', href: '/', key: 'home' },
  { name: siteConfig.pages.archives.menu_label || siteConfig.pages.archives.title || 'Archives', href: '/archives', key: 'archives' },
  { name: siteConfig.pages.research.menu_label || siteConfig.pages.research.title || 'Research', href: '/research', key: 'research' },
  { name: siteConfig.pages.projects.menu_label || siteConfig.pages.projects.title || 'Projects', href: '/projects', key: 'projects' },
  { name: siteConfig.pages.about.menu_label || siteConfig.pages.about.title || 'About', href: '/about', key: 'about' },
  { name: siteConfig.pages.contact.menu_label || siteConfig.pages.contact.title || 'Contact', href: '/contact', key: 'contact' },
  { name: siteConfig.pages.cv.menu_label || siteConfig.pages.cv.title || 'CV', href: '/cv', key: 'cv' }
];

/**
 * Main navigation links for Header and Footer menus.
 * Automatically filtered based on `menu` toggles in `site.config.yaml`.
 */
export const mainNavItems: NavItem[] = allNavItems
  .filter((item) => siteConfig.menu[item.key] !== false)
  .map(({ key, ...item }) => item);

/**
 * Academic & External profile links derived dynamically from siteConfig.author.socials
 */
export const externalProfiles: NavItem[] = [
  ...(siteConfig.author.socials.googleScholar
    ? [
        {
          name: 'Google Scholar',
          href: siteConfig.author.socials.googleScholar,
          isExternal: true
        }
      ]
    : []),
  ...(siteConfig.author.socials.github
    ? [
        {
          name: 'GitHub',
          href: siteConfig.author.socials.github,
          isExternal: true
        }
      ]
    : [])
];
