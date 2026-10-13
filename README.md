# Personal Website & Academic Portfolio — Eko Teguh Widodo

A modern, high-performance static website and technical portfolio engineered with **JAMstack** principles. Built as a professional portfolio, academic research archive, project showcase, and technical publication portal. Powered by **Astro**, **Tailwind CSS v4**, and a **Docs-as-Code** (Markdown & MDX) approach, adhering to **Clean Code** and **Clean Architecture** patterns for optimal maintainability and long-term scalability.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Clean Architecture & Modularization](#-clean-architecture--modularization)
- [Project Directory Structure](#-project-directory-structure)
- [Key Features](#-key-features)
- [Centralized Configuration (`site.config.yaml`)](#-centralized-configuration-siteconfigyaml)
- [Content Management Guide (Docs-as-Code)](#-content-management-guide-docs-as-code)
  - [1. Creating a New Article](#1-creating-a-new-article)
  - [2. Adding a Research Publication](#2-adding-a-research-publication)
  - [3. Adding a New Project](#3-adding-a-new-project)
  - [4. Updating the About Profile](#4-updating-the-about-profile)
- [Local Development Guide](#-local-development-guide)
- [CI/CD & Deployment to GitHub Pages](#-cicd--deployment-to-github-pages)
- [Pre-Publish Verification Checklist](#-pre-publish-verification-checklist)

---

## 🏛 Architecture Overview

This website eliminates runtime server databases (*database-less*) in favor of high-performance static compilation:

- **Static Site Generator (SSG):** [Astro](https://astro.build/) — Ships zero JavaScript to the client by default, generating pure HTML and CSS for lightning-fast page loads.
- **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/) — CSS-first configuration via `@tailwindcss/vite`, featuring seamless Light and Dark mode transitions.
- **Typography & Design:** Styled with the *Plus Jakarta Sans Variable* font, a balanced multi-color palette (Purple/AI, Indigo/Knowledge Engineering, Emerald/Data, Amber/Testing, Teal/Semantic Web, Sky/Web Dev, and Slate/Neutral), fully responsive across all screen viewports.
- **Schema Validation:** [Zod](https://zod.dev/) integrated through Astro Content Collections, providing compile-time type safety and frontmatter integrity verification.
- **Hosting & CI/CD:** Fully automated deployment to **GitHub Pages** via GitHub Actions on every push to the `main` branch.

---

## 🧩 Clean Architecture & Modularization

The project maintains a strict **Separation of Concerns** divided into isolated layers:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│   (src/pages, src/layouts, src/components)             │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Service / Utility Layer             │
│   (src/utils: content.ts, date.ts, readingTime.ts)     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│             Domain Entity & Schema Layer               │
│   (src/types, src/content.config.ts, src/config)       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                      Data Source                       │
│   (src/content: articles, research, projects, about)   │
└────────────────────────────────────────────────────────┘
```

1. **Domain Layer (`src/types/` & `src/content.config.ts`):**  
   Defines core data models (`Article`, `Research`, `Project`, `AuthorProfile`, `SiteConfig`) using TypeScript interfaces and Zod schemas. These serve as the single source of truth for all content schemas.
2. **Service / Utility Layer (`src/utils/`):**  
   Pure utility functions handling content filtering (ignoring draft/template files), date formatting, reading-time calculation, and pagination logic without UI coupling.
3. **Presentation Layer (`src/components/` & `src/layouts/`):**  
   Modular, reusable Astro components documented with descriptive props and organized into domain-specific directories (`common/`, `article/`, `research/`, `project/`).
4. **Configuration Layer (`src/config/` & `site.config.yaml`):**  
   All site-wide metadata, author bio, social profiles, navigation visibility switches, and pagination controls are consolidated in one configuration file.

---

## 📁 Project Directory Structure

```
ekotwidodo.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD deployment workflow
├── public/
│   ├── assets/
│   │   └── img/
│   │       └── articles/           # Article featured images & illustrations
│   ├── favicon.svg                 # Website favicon
│   └── robots.txt                  # SEO crawler directives
├── src/
│   ├── config/                     # Centralized TypeScript config readers
│   │   ├── navigation.ts           # Dynamic navigation and footer builder
│   │   └── site.ts                 # Site identity, author profile, and pagination
│   ├── content/                    # Markdown content collections
│   │   ├── about/
│   │   │   └── index.md            # About profile & professional bio template
│   │   ├── articles/
│   │   │   ├── .gitkeep            # Directory tracking
│   │   │   └── template.md         # Template for new articles (excluded from build)
│   │   ├── projects/
│   │   │   ├── .gitkeep
│   │   │   └── template.md         # Template for new projects (excluded from build)
│   │   └── research/
│   │       ├── .gitkeep
│   │       └── template.md         # Template for research papers (excluded from build)
│   ├── content.config.ts           # Astro content collection schemas (Zod)
│   ├── types/                      # Domain TypeScript interfaces
│   │   ├── article.ts
│   │   ├── navigation.ts
│   │   ├── project.ts
│   │   ├── research.ts
│   │   └── site.ts
│   ├── utils/                      # Helper services & pure functions
│   │   ├── content.ts              # Collection querying & template exclusion logic
│   │   ├── date.ts                 # Localized date formatters
│   │   └── readingTime.ts          # Reading time estimator
│   ├── styles/
│   │   └── global.css              # Tailwind CSS v4 setup & theme styles
│   ├── components/                 # UI components
│   │   ├── common/                 # Header, Footer, ThemeToggle, Pagination, etc.
│   │   ├── article/                # ArticleCard and article elements
│   │   ├── research/               # ResearchCard and academic elements
│   │   └── project/                # ProjectCard and showcase elements
│   ├── layouts/
│   │   ├── BaseLayout.astro        # Base HTML wrapper with SEO, metadata & anti-FOUC
│   │   ├── PageLayout.astro        # General page layout with header & footer
│   │   └── ArticleLayout.astro     # Typography-optimized article reader layout
│   └── pages/
│       ├── index.astro             # Home: Hero + latest articles + pagination
│       ├── page/
│       │   └── [page].astro        # Home pagination routes (/page/2)
│       ├── articles/
│       │   └── [slug].astro        # Article detail route
│       ├── archives/
│       │   └── index.astro         # Archives with live search & multi-tag filters
│       ├── research/
│       │   └── index.astro         # Research publication index with status filter
│       ├── projects/
│       │   └── index.astro         # Project showcase with technology filter
│       ├── about/
│       │   └── index.astro         # About me page (rendered from content/about)
│       ├── contact/
│       │   └── index.astro         # Contact channels & inquiry form
│       ├── cv/
│       │   └── index.astro         # Curriculum Vitae / Resume page
│       ├── rss.xml.ts              # Automated RSS 2.0 XML feed
│       └── 404.astro               # Custom 404 Not Found page
├── site.config.yaml            # Single source of truth for site configuration
├── astro.config.mjs            # Astro SSG + Tailwind CSS v4 + Sitemap config
├── package.json
├── tsconfig.json               # Strict TypeScript config with `@/` path alias
└── README.md
```

---

## 🚀 Key Features

1. **Integrated Light / Dark Mode:**
   - Smooth theme switcher button in the top navigation bar.
   - User preference persisted in `localStorage`.
   - Inline anti-FOUC (*Flash of Unstyled Content*) script guarantees seamless rendering on initial page load.
2. **Interactive Home Page (`/`):**
   - Hero section featuring profile photo, title, bio, and typewriter animation.
   - Latest articles feed with customizable pagination controls.
3. **Comprehensive Content Archive (`/archives`):**
   - Instant client-side search across titles, summaries, and tags.
   - Multi-criteria filter options by **Year**, **Category**, and **Tag**.
4. **Academic Research Archive (`/research`):**
   - Displays publications with venue, abstract, year, DOI links, and project status (*Completed* / *Ongoing*).
   - Easily enabled or hidden via `site.config.yaml`.
5. **Project Showcase (`/projects`):**
   - Highlights software systems, technology stacks, roles, GitHub repositories, and live demo links.
   - Easily enabled or hidden via `site.config.yaml`.
6. **Detailed About Profile (`/about`):**
   - Sourced directly from `src/content/about/index.md`.
   - Displays core focus areas, technology domains, system architecture, and professional profile.
7. **Contact Channels (`/contact`):**
   - Direct contact info and accessible message form.
8. **SEO & Web Syndication:**
   - Automatic RSS feed at `/rss.xml`.
   - Automatic XML Sitemap generated at `/sitemap-index.xml`.
   - Open Graph and Twitter Card meta tags embedded on every page.

---

## ⚙️ Centralized Configuration (`site.config.yaml`)

You can customize the entire site identity, author information, social links, and navigation switches from **one central file**: [`site.config.yaml`](site.config.yaml).

```yaml
# 1. Site Identity & Metadata
site:
  name: "Eko Teguh Widodo"
  short_name: "ETW"
  title: "Eko Teguh Widodo | Personal IT, AI & Software Engineering Portal"
  tagline: "Sharing Insights & Exploring Technology"
  subtitle: "A personal technical publication portal dedicated to Artificial Intelligence and Software Engineering."
  description: "Personal IT portal of Eko Teguh Widodo featuring technical articles, research insights, and explorations in Artificial Intelligence."
  url: "https://ekotwidodo.github.io"

# 2. Author Profile
author:
  name: "Eko Teguh Widodo"
  title: "IT Specialist & AI Engineer"
  affiliation: "BPS - Statistics Indonesia"
  location: "Bandar Lampung & Jakarta, Indonesia"
  avatar: "https://avatars.githubusercontent.com/u/90574398?v=4"
  bio: "IT Specialist at Statistics Indonesia, focusing on Data, Knowledge, and Artificial Intelligence Engineering."
  email: "mailto:ekotwidodo@gmail.com"

# 3. Social Media & Professional Profiles
socials:
  github: "https://github.com/ekotwidodo"
  linkedin: "https://www.linkedin.com/in/ekoteguh"
  medium: "https://medium.com/@ekoteguh"
  x: "https://x.com/ekotwidodo"
  instagram: "https://www.instagram.com/ekotwidodo"
  googleScholar: "https://scholar.google.com/citations?hl=en&user=ut1BFicAAAAJ"
  researchGate: "https://www.researchgate.net/profile/Eko-Teguh-Widodo"

# 4. Navigation Menu Visibility Switches
menu:
  home: true
  archives: true
  about: true
  research: false    # Set to true when ready to display Research publications
  projects: false    # Set to true when ready to display Projects showcase
  contact: false     # Set to true when ready to display Contact page
  cv: false          # Set to true when ready to display CV page
```

---

## 📝 Content Management Guide (Docs-as-Code)

All content folders include a `template.md` file designed as a clean boilerplate. **Templates are automatically excluded from the live website build** via `draft: true` and built-in template filters in `src/utils/content.ts`.

### 1. Creating a New Article
To publish a new article:
1. Copy `src/content/articles/template.md` and save it with a new name (e.g., `src/content/articles/2026-10-15-my-new-post.md`).
2. Set `draft: false` and fill in the frontmatter details:

```markdown
---
title: "Your Article Title"
date: 2026-10-15
summary: "A concise 1-2 sentence summary of the article for card previews."
category: "Artificial Intelligence"
image: "/assets/img/articles/sample-cover.jpg"
tags:
  - "Deep Learning"
  - "Transformers"
draft: false
---

## Introduction

Write your article content here using standard Markdown and syntax-highlighted code blocks...
```

### 2. Adding a Research Publication
1. Copy `src/content/research/template.md` to `src/content/research/paper-title.md`.
2. Fill in the publication metadata:

```markdown
---
title: "Research Paper Title"
abstract: "Complete abstract of the research paper..."
year: 2026
date: 2026-10-01
venue: "IEEE International Conference on Big Data 2026"
type: "Conference Paper"
status: "completed" # or "ongoing"
doi: "10.1109/example.doi"
url: "https://doi.org/10.1109/example.doi"
keywords:
  - "Knowledge Graph"
  - "Semantic Web"
language: "English"
---

Additional methodological notes or extended abstracts can be placed here...
```
*(Remember to enable `research: true` in `site.config.yaml` to display the menu item in the navigation bar!)*

### 3. Adding a New Project
1. Copy `src/content/projects/template.md` to `src/content/projects/project-name.md`.
2. Fill in the project details:

```markdown
---
title: "Project Name"
description: "Brief description of the system or application."
date: 2026-09-01
status: "completed" # or "in-progress"
technologies:
  - "Python"
  - "Docker"
  - "PostgreSQL"
role: "Lead Engineer"
demoUrl: "https://example.com"
repoUrl: "https://github.com/ekotwidodo/project-name"
featured: true
---

Detailed system overview, architecture diagram, and technical highlights...
```
*(Remember to enable `projects: true` in `site.config.yaml` to display the menu item in the navigation bar!)*

### 4. Updating the About Profile
Simply open and edit `src/content/about/index.md` to update your narrative biography, education milestones, technical competencies, or work history.

---

## 💻 Local Development Guide

### Prerequisites
- [Node.js](https://nodejs.org/) `>= 20.0.0` (Recommended: Node.js v22 LTS).
- [npm](https://www.npmjs.com/) `>= 10.0.0`.

### Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install all dependencies |
| `npm run dev` | Start the local development server at `http://localhost:4321` with HMR |
| `npm run build` | Compile optimized static production build to `./dist` |
| `npm run preview` | Locally preview the production build from `./dist` |

---

## 🚢 CI/CD & Deployment to GitHub Pages

The repository uses a automated **GitHub Actions** workflow defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **Trigger:** Every `git push` to the `main` branch automatically triggers the build and deployment pipeline.
2. **Build Step:** Spawns an Ubuntu runner, sets up Node.js 22, runs `npm ci`, and executes `npm run build`.
3. **Deploy Step:** Uploads the `./dist` static output and publishes it directly to **GitHub Pages**.
4. **Public URL:** The site is deployed and live at `https://ekotwidodo.github.io`.

### GitHub Repository Setup (One-time check):
To ensure GitHub Pages builds using the workflow:
1. Go to your repository on GitHub: `https://github.com/ekotwidodo/ekotwidodo.github.io`.
2. Click **Settings** > **Pages** (under Code and automation).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.

---

## ✅ Pre-Publish Verification Checklist

Before pushing changes to GitHub, verify the following checklist:

- [x] **Zero Build Errors:** `npm run build` completes successfully with exit code 0.
- [x] **Content Isolation:** All `template.md` files have `draft: true` and are excluded from static route generation.
- [x] **Configuration Centralized:** `site.config.yaml` contains clean, standardized values and valid profile URLs.
- [x] **Dynamic Routing:** All static pages (`/`, `/about`, `/archives`, `/contact`, `/research`, `/projects`, `/cv`, `/404`, `/rss.xml`) generate cleanly.
- [x] **Deployment Workflow Ready:** `.github/workflows/deploy.yml` configured for Node 22 and GitHub Pages deployment.
- [x] **Standardized Language:** Documentation and site interface standardized in professional English.

You are all set to commit and push to `origin/main`!