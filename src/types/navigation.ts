/**
 * Navigation item representation
 */
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
  isExternal?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
}
