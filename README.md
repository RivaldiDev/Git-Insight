<div align="center">

# Git Insight

**Visual GitHub profile analyzer with advanced code metrics, repo health scoring, and shareable profile cards.**

[![Tech Stack](https://skillicons.dev/icons?i=nextjs,tailwind,typescript,github&theme=dark&perline=4)](https://skillicons.dev)

![Analytics](https://img.shields.io/badge/Analytics-Advanced%20Metrics-1A1918?style=for-the-badge)
![Health](https://img.shields.io/badge/Health-Repo%20Scoring-22C55E?style=for-the-badge)
![Visual](https://img.shields.io/badge/Visual-Interactive%20Charts-3B82F6?style=for-the-badge)
![Export](https://img.shields.io/badge/Export-PNG%20Cards-F59E0B?style=for-the-badge)

[Overview](#overview) · [Features](#features) · [Analytics](#analytics) · [Visualizations](#visualizations) · [Setup](#setup) · [API](#api) · [Tech Stack](#tech-stack)

</div>

---

## Overview

Git Insight is a developer analytics dashboard that transforms any public GitHub profile into actionable insights. Enter a username and get a comprehensive visual breakdown of coding activity, language distribution, repo health, and commit patterns through interactive charts and shareable profile cards.

Built with Next.js 14, shadcn/ui, Aceternity UI, and Recharts. Powered by the GitHub REST API v3 with no authentication required for public profiles.

## Features

| Area | What it does |
| --- | --- |
| **Profile Overview** | Displays avatar, bio, location, join date, follower/following count, and total public repos. |
| **Language Breakdown** | Interactive donut chart showing language distribution across all repositories. |
| **Contribution Heatmap** | Calendar grid visualization of commit activity across the year. |
| **Repo Health Score** | Scores each repo 0-100 based on README, LICENSE, CI, description, and documentation coverage. |
| **Code Frequency** | Bar chart showing lines added and deleted per repository over time. |
| **Commit Quality** | Breakdown of commit message patterns: length, emoji usage, conventional commits percentage. |
| **Skill Radar Chart** | Multi-dimensional chart covering frontend, backend, DevOps, testing, and documentation. |
| **Profile Card Export** | Downloadable PNG card with stats overlay for social media sharing. |
| **GitHub Wrapped** | Yearly summary view with top repos, languages, and activity highlights. |

## Analytics

### Repo Health Score

Each repository is scored 0-100 based on:

| Factor | Points | Criteria |
| --- | --- | --- |
| README | 20 | Has README.md with content |
| LICENSE | 15 | Has LICENSE file |
| Description | 15 | Non-empty repo description |
| CI/CD | 20 | Has GitHub Actions or other CI config |
| Documentation | 15 | Has docs folder or wiki |
| Activity | 15 | Has commits in last 6 months |

### Commit Quality Score

Commit messages are analyzed for:

- **Length** — Average commit message length
- **Conventional Commits** — Percentage following `type(scope): message` format
- **Emoji Usage** — Percentage with emoji prefixes
- **Clarity** — Presence of descriptive body text

### Code Frequency

Lines added and deleted per repository, aggregated monthly:

- Total lines contributed
- Net lines (added - deleted)
- Most active repositories by code churn

## Visualizations

| Chart | Library | Description |
| --- | --- | --- |
| Language Donut | Recharts | Interactive donut with hover details and percentages |
| Contribution Heatmap | Custom | GitHub-style calendar grid with intensity colors |
| Code Frequency | Recharts | Stacked bar chart for lines added/deleted |
| Skill Radar | Recharts | Multi-axis radar for skill dimensions |
| Repo Timeline | Recharts | Bar chart showing repo creation over time |
| Commit Pattern | Recharts | Line chart for commit frequency over months |

## Setup

```bash
git clone https://github.com/RivaldiDev/Git-Insight.git
cd Git-Insight
npm install
```

Create `.env.local`:

```bash
# Optional: GitHub personal access token for higher rate limits
# Without token: 60 requests/hour
# With token: 5000 requests/hour
GITHUB_TOKEN=
```

Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API

### GitHub REST API v3 Endpoints Used

| Endpoint | Purpose |
| --- | --- |
| `GET /users/{username}` | Profile info: avatar, bio, location, join date, followers |
| `GET /users/{username}/repos` | All public repositories with language, stars, forks |
| `GET /repos/{owner}/{repo}/languages` | Language breakdown per repository |
| `GET /repos/{owner}/{repo}/commits` | Commit history for activity analysis |
| `GET /repos/{owner}/{repo}/contents` | Check for README, LICENSE, CI configs |
| `GET /repos/{owner}/{repo}/actions/workflows` | CI/CD workflow detection |

### Rate Limits

| Auth Status | Limit | Recommended |
| --- | --- | --- |
| No token | 60 requests/hour | Development and testing |
| With token | 5000 requests/hour | Production and demos |

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Framework | Next.js 14 | App router, server components, API routes |
| Styling | Tailwind CSS | Utility-first CSS framework |
| UI Components | shadcn/ui | Cards, tabs, badges, buttons, tooltips, progress bars |
| Animations | Aceternity UI | Bento grid, spotlight, animated beams, globe, number ticker |
| Charts | Recharts | Interactive charts and data visualization |
| API | GitHub REST API v3 | Profile and repository data |
| Export | html-to-image | Profile card PNG generation |
| Language | TypeScript | Type safety and better developer experience |

### Aceternity Components

| Component | Usage |
| --- | --- |
| `BentoGrid` | Layout for stat cards and metric sections |
| `Globe` | Contributor location visualization |
| `NumberTicker` | Animated stats display (stars, commits, repos) |
| `Spotlight` | Hover effect on cards and interactive elements |
| `AnimatedBeam` | Connect repo nodes in dependency visualization |
| `HeroHighlight` | Hero section with username input |
| `DirectionAwareHover` | Repository cards with directional hover effects |

### shadcn Components

| Component | Usage |
| --- | --- |
| `Card` | Stat containers and metric displays |
| `Tabs` | Switch between different visualization views |
| `Progress` | Health score bars and percentage indicators |
| `Badge` | Language tags and status indicators |
| `Tooltip` | Hover details for charts and metrics |
| `Button` | Actions and navigation |
| `Sheet` | GitHub Wrapped slide panel |
| `Avatar` | User profile image display |

## Repository Layout

| Path | Purpose |
| --- | --- |
| `app/` | Next.js app router pages and layouts |
| `components/` | Reusable UI components (shadcn + custom) |
| `components/ui/` | shadcn/ui base components |
| `components/aceternity/` | Aceternity UI components |
| `components/charts/` | Recharts visualization components |
| `components/cards/` | Profile and stat card components |
| `lib/` | Utility functions and GitHub API client |
| `lib/github.ts` | GitHub REST API wrapper with caching |
| `lib/analytics.ts` | Health scoring and commit analysis logic |
| `lib/export.ts` | Profile card PNG export functionality |
| `types/` | TypeScript type definitions |
| `public/` | Static assets and images |

## Checks

```bash
npm run lint
npm run type-check
npm run build
```

Current verification:

```text
TypeScript: no errors
ESLint: no warnings
Build: successful
```

## Update Discipline

Before every commit:

1. Patch source.
2. Update this README if features or setup change.
3. Run checks.
4. Scan for secrets.
5. Commit and push to `RivaldiDev/Git-Insight`.

## Security

- Keep GitHub tokens in `.env.local` only.
- Never commit API keys, secrets, or runtime state.
- `.env.example` must contain placeholders only.
- All API calls are server-side to protect tokens.

## Project Status

Active. Current baseline includes profile analysis, language breakdown, contribution heatmap, repo health scoring, code frequency analysis, commit quality metrics, skill radar chart, profile card export, and GitHub Wrapped summary.

## Update History

- **2026-05-25** — Initial project setup with Next.js 14, shadcn/ui, Aceternity UI, and Recharts. Basic profile overview and language breakdown.
