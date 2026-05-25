# Git Insight Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a visual GitHub profile analyzer with advanced metrics, repo health scoring, and shareable profile cards.

**Architecture:** Next.js 14 app router with server-side GitHub API calls, shadcn/ui + Aceternity UI for components, Recharts for data visualization, and html-to-image for PNG export.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Aceternity UI, Recharts, GitHub REST API v3, html-to-image

---

## Phase 1: Project Setup

### Task 1: Initialize Next.js Project

**Objective:** Create Next.js 14 app with TypeScript and Tailwind CSS

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`

**Step 1: Create Next.js app**

```bash
cd /home/rival/Ngoding/Git-Insight
npx create-next-app@latest . --typescript --tailwind --app --no-eslint --no-src-dir --import-alias "@/*"
```

**Step 2: Verify setup**

```bash
npm run dev
# Open http://localhost:3000
# Should see Next.js welcome page
```

**Step 3: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js 14 project with TypeScript and Tailwind"
```

---

### Task 2: Install and Configure shadcn/ui

**Objective:** Set up shadcn/ui component library

**Files:**
- Create: `components.json`, `lib/utils.ts`
- Modify: `tailwind.config.ts`

**Step 1: Initialize shadcn**

```bash
npx shadcn@latest init
# Select: New York style, Zinc base color, CSS variables: yes
```

**Step 2: Install base components**

```bash
npx shadcn@latest add card button badge tabs tooltip progress avatar sheet separator
```

**Step 3: Verify components**

```bash
ls components/ui/
# Should see: card.tsx, button.tsx, badge.tsx, tabs.tsx, tooltip.tsx, progress.tsx, avatar.tsx, sheet.tsx, separator.tsx
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add shadcn/ui with base components"
```

---

### Task 3: Install Aceternity UI and Recharts

**Objective:** Set up Aceternity UI components and Recharts

**Files:**
- Create: `components/aceternity/` directory

**Step 1: Install Aceternity UI**

```bash
npm install framer-motion
npx aceternity-ui-cli@latest init
# Follow prompts to install components
```

**Step 2: Install required Aceternity components**

```bash
npx aceternity-ui-cli@latest add bento-grid
npx aceternity-ui-cli@latest add number-ticker
npx aceternity-ui-cli@latest add spotlight
npx aceternity-ui-cli@latest add animated-beam
npx aceternity-ui-cli@latest add hero-highlight
npx aceternity-ui-cli@latest add direction-aware-hover
npx aceternity-ui-cli@latest add globe
```

**Step 3: Install Recharts**

```bash
npm install recharts
```

**Step 4: Install html-to-image for export**

```bash
npm install html-to-image
```

**Step 5: Verify installations**

```bash
npm list framer-motion recharts html-to-image
```

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Aceternity UI, Recharts, and html-to-image"
```

---

## Phase 2: GitHub API Integration

### Task 4: Create GitHub API Client

**Objective:** Build typed GitHub REST API wrapper with caching

**Files:**
- Create: `lib/github.ts`, `types/github.ts`

**Step 1: Create type definitions**

```typescript
// types/github.ts
export interface GitHubUser {
  login: string
  avatar_url: string
  name: string | null
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  size: number
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  license: { name: string } | null
  has_wiki: boolean
  default_branch: string
}

export interface RepoHealth {
  repo: string
  score: number
  hasReadme: boolean
  hasLicense: boolean
  hasDescription: boolean
  hasCI: boolean
  hasDocs: boolean
  isRecent: boolean
}

export interface LanguageStats {
  [language: string]: number
}

export interface CommitActivity {
  month: string
  added: number
  deleted: number
}

export interface SkillRadar {
  frontend: number
  backend: number
  devops: number
  testing: number
  docs: number
}
```

**Step 2: Create GitHub API client**

```typescript
// lib/github.ts
import { GitHubUser, GitHubRepo, LanguageStats, RepoHealth, SkillRadar } from '@/types/github'

const GITHUB_API = 'https://api.github.com'

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const res = await fetch(`${GITHUB_API}${endpoint}`, { 
    headers,
    next: { revalidate: 3600 } // Cache for 1 hour
  })

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getUser(username: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${username}`)
}

export async function getRepos(username: string): Promise<GitHubRepo[]> {
  return fetchGitHub<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`)
}

export async function getLanguages(owner: string, repo: string): Promise<LanguageStats> {
  return fetchGitHub<LanguageStats>(`/repos/${owner}/${repo}/languages`)
}

export async function checkRepoContents(owner: string, repo: string): Promise<{
  hasReadme: boolean
  hasLicense: boolean
  hasCI: boolean
  hasDocs: boolean
}> {
  try {
    const contents = await fetchGitHub<{ name: string; type: string }[]>(
      `/repos/${owner}/${repo}/contents`
    )
    
    const names = contents.map(c => c.name.toLowerCase())
    
    return {
      hasReadme: names.some(n => n.startsWith('readme')),
      hasLicense: names.some(n => n === 'license' || n === 'license.md' || n === 'license.txt'),
      hasCI: names.some(n => n === '.github' || n === '.circleci' || n === '.travis.yml'),
      hasDocs: names.some(n => n === 'docs' || n === 'doc' || n === 'documentation'),
    }
  } catch {
    return { hasReadme: false, hasLicense: false, hasCI: false, hasDocs: false }
  }
}
```

**Step 3: Verify types compile**

```bash
npm run build
# Should compile without errors
```

**Step 4: Commit**

```bash
git add lib/github.ts types/github.ts
git commit -m "feat: add GitHub API client with type definitions"
```

---

### Task 5: Create Analytics Functions

**Objective:** Build health scoring, language aggregation, and skill analysis

**Files:**
- Create: `lib/analytics.ts`

**Step 1: Create analytics module**

```typescript
// lib/analytics.ts
import { GitHubRepo, RepoHealth, LanguageStats, SkillRadar } from '@/types/github'
import { checkRepoContents } from './github'

export function calculateRepoHealthScore(repo: GitHubRepo, checks: {
  hasReadme: boolean
  hasLicense: boolean
  hasCI: boolean
  hasDocs: boolean
}): RepoHealth {
  let score = 0

  // README: 20 points
  if (checks.hasReadme) score += 20

  // LICENSE: 15 points
  if (checks.hasLicense) score += 15

  // Description: 15 points
  if (repo.description) score += 15

  // CI/CD: 20 points
  if (checks.hasCI) score += 20

  // Docs: 15 points
  if (checks.hasDocs) score += 15

  // Recent activity: 15 points
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const isRecent = new Date(repo.pushed_at) > sixMonthsAgo
  if (isRecent) score += 15

  return {
    repo: repo.name,
    score,
    hasReadme: checks.hasReadme,
    hasLicense: checks.hasLicense,
    hasDescription: !!repo.description,
    hasCI: checks.hasCI,
    hasDocs: checks.hasDocs,
    isRecent,
  }
}

export function aggregateLanguages(repos: GitHubRepo[]): LanguageStats {
  const languages: LanguageStats = {}
  
  for (const repo of repos) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + repo.size
    }
  }

  // Sort by size descending
  return Object.fromEntries(
    Object.entries(languages).sort(([, a], [, b]) => b - a)
  )
}

export function calculateSkillRadar(repos: GitHubRepo[]): SkillRadar {
  const skills: SkillRadar = {
    frontend: 0,
    backend: 0,
    devops: 0,
    testing: 0,
    docs: 0,
  }

  const frontendLangs = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'React', 'Svelte']
  const backendLangs = ['Python', 'Java', 'Go', 'Rust', 'C#', 'PHP', 'Ruby', 'Node']
  const devopsTools = ['Dockerfile', 'YAML', 'Shell', 'Terraform', 'Kubernetes']
  const testingPatterns = ['test', 'spec', 'jest', 'pytest', 'mocha']

  for (const repo of repos) {
    // Frontend score
    if (repo.language && frontendLangs.includes(repo.language)) {
      skills.frontend += repo.size
    }

    // Backend score
    if (repo.language && backendLangs.includes(repo.language)) {
      skills.backend += repo.size
    }

    // DevOps score (check topics and language)
    if (repo.language && devopsTools.includes(repo.language)) {
      skills.devops += repo.size
    }
    if (repo.topics.some(t => ['docker', 'kubernetes', 'ci-cd', 'devops'].includes(t))) {
      skills.devops += 1000
    }

    // Testing score (check topics and name)
    if (repo.name.toLowerCase().match(/test|spec/)) {
      skills.testing += repo.size
    }
    if (repo.topics.some(t => testingPatterns.includes(t))) {
      skills.testing += 1000
    }

    // Documentation score
    if (repo.has_wiki || repo.description) {
      skills.docs += 1000
    }
    if (repo.topics.some(t => ['documentation', 'docs'].includes(t))) {
      skills.docs += 1000
    }
  }

  // Normalize to 0-100
  const max = Math.max(skills.frontend, skills.backend, skills.devops, skills.testing, skills.docs, 1)
  return {
    frontend: Math.round((skills.frontend / max) * 100),
    backend: Math.round((skills.backend / max) * 100),
    devops: Math.round((skills.devops / max) * 100),
    testing: Math.round((skills.testing / max) * 100),
    docs: Math.round((skills.docs / max) * 100),
  }
}

export async function getRepoHealthScores(owner: string, repos: GitHubRepo[]): Promise<RepoHealth[]> {
  const scores: RepoHealth[] = []
  
  for (const repo of repos.slice(0, 20)) { // Limit to 20 repos for rate limits
    const checks = await checkRepoContents(owner, repo.name)
    scores.push(calculateRepoHealthScore(repo, checks))
  }

  return scores.sort((a, b) => b.score - a.score)
}
```

**Step 2: Verify compilation**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add lib/analytics.ts
git commit -m "feat: add analytics functions for health scoring and skill radar"
```

---

## Phase 3: UI Components

### Task 6: Create Profile Overview Component

**Objective:** Display user avatar, name, bio, stats

**Files:**
- Create: `components/profile-overview.tsx`

**Step 1: Create component**

```typescript
// components/profile-overview.tsx
'use client'

import { GitHubUser } from '@/types/github'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NumberTicker } from '@/components/aceternity/number-ticker'
import { MapPin, Calendar, Users, GitFork, Star } from 'lucide-react'

interface ProfileOverviewProps {
  user: GitHubUser
  totalStars: number
  totalForks: number
}

export function ProfileOverview({ user, totalStars, totalForks }: ProfileOverviewProps) {
  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback>{user.login[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <CardTitle className="text-2xl">{user.name || user.login}</CardTitle>
            <p className="text-muted-foreground">@{user.login}</p>
            
            {user.bio && (
              <p className="mt-2 text-sm">{user.bio}</p>
            )}
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {joinDate}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              <NumberTicker value={user.public_repos} />
            </div>
            <p className="text-xs text-muted-foreground">Repositories</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              <NumberTicker value={totalStars} />
            </div>
            <p className="text-xs text-muted-foreground">Stars</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              <NumberTicker value={user.followers} />
            </div>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              <NumberTicker value={user.following} />
            </div>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add components/profile-overview.tsx
git commit -m "feat: add ProfileOverview component with animated stats"
```

---

### Task 7: Create Language Donut Chart

**Objective:** Interactive donut chart for language distribution

**Files:**
- Create: `components/charts/language-donut.tsx`

**Step 1: Create component**

```typescript
// components/charts/language-donut.tsx
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LanguageDonutProps {
  languages: Record<string, number>
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
]

export function LanguageDonut({ languages }: LanguageDonutProps) {
  const data = Object.entries(languages)
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }))

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [
                  `${((value / total) * 100).toFixed(1)}%`,
                  'Usage'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="flex flex-col gap-2">
            {data.slice(0, 5).map((lang, index) => (
              <div key={lang.name} className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{lang.name}</span>
                <Badge variant="secondary" className="ml-auto">
                  {((lang.value / total) * 100).toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add components/charts/language-donut.tsx
git commit -m "feat: add LanguageDonut chart component"
```

---

### Task 8: Create Contribution Heatmap

**Objective:** GitHub-style calendar heatmap

**Files:**
- Create: `components/charts/contribution-heatmap.tsx`

**Step 1: Create component**

```typescript
// components/charts/contribution-heatmap.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ContributionHeatmapProps {
  contributions: { date: string; count: number }[]
}

export function ContributionHeatmap({ contributions }: ContributionHeatmapProps) {
  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted'
    if (count < 3) return 'bg-green-200 dark:bg-green-900'
    if (count < 6) return 'bg-green-400 dark:bg-green-700'
    if (count < 9) return 'bg-green-600 dark:bg-green-500'
    return 'bg-green-800 dark:bg-green-300'
  }

  // Group by week
  const weeks: { date: string; count: number }[][] = []
  let currentWeek: { date: string; count: number }[] = []
  
  contributions.forEach((day, i) => {
    currentWeek.push(day)
    if (currentWeek.length === 7 || i === contributions.length - 1) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger>
                      <div
                        className={`h-3 w-3 rounded-sm ${getColor(day.count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{day.count} contributions on {day.date}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </TooltipProvider>
        
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="h-3 w-3 rounded-sm bg-muted" />
          <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-500" />
          <div className="h-3 w-3 rounded-sm bg-green-800 dark:bg-green-300" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add components/charts/contribution-heatmap.tsx
git commit -m "feat: add ContributionHeatmap component"
```

---

### Task 9: Create Repo Health Cards

**Objective:** Display repo health scores with progress bars

**Files:**
- Create: `components/cards/repo-health-card.tsx`

**Step 1: Create component**

```typescript
// components/cards/repo-health-card.tsx
'use client'

import { RepoHealth } from '@/types/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'

interface RepoHealthCardProps {
  repos: RepoHealth[]
}

export function RepoHealthCard({ repos }: RepoHealthCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repository Health Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repos.slice(0, 5).map((repo) => (
            <div key={repo.repo} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{repo.repo}</span>
                <span className={`font-bold ${getScoreColor(repo.score)}`}>
                  {repo.score}/100
                </span>
              </div>
              
              <Progress 
                value={repo.score} 
                className="h-2"
              />
              
              <div className="flex flex-wrap gap-1">
                {repo.hasReadme ? (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    README
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <XCircle className="mr-1 h-3 w-3" />
                    README
                  </Badge>
                )}
                
                {repo.hasLicense ? (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    LICENSE
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <XCircle className="mr-1 h-3 w-3" />
                    LICENSE
                  </Badge>
                )}
                
                {repo.hasCI ? (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    CI/CD
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <XCircle className="mr-1 h-3 w-3" />
                    CI/CD
                  </Badge>
                )}
                
                {repo.hasDocs ? (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Docs
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <XCircle className="mr-1 h-3 w-3" />
                    Docs
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add components/cards/repo-health-card.tsx
git commit -m "feat: add RepoHealthCard component with progress indicators"
```

---

### Task 10: Create Skill Radar Chart

**Objective:** Multi-axis radar chart for skill dimensions

**Files:**
- Create: `components/charts/skill-radar.tsx`

**Step 1: Create component**

```typescript
// components/charts/skill-radar.tsx
'use client'

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkillRadar as SkillRadarType } from '@/types/github'

interface SkillRadarProps {
  skills: SkillRadarType
}

export function SkillRadar({ skills }: SkillRadarProps) {
  const data = [
    { skill: 'Frontend', value: skills.frontend },
    { skill: 'Backend', value: skills.backend },
    { skill: 'DevOps', value: skills.devops },
    { skill: 'Testing', value: skills.testing },
    { skill: 'Docs', value: skills.docs },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--muted-foreground))" />
            <PolarAngleAxis 
              dataKey="skill" 
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={false}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add components/charts/skill-radar.tsx
git commit -m "feat: add SkillRadar chart component"
```

---

## Phase 4: Main Page

### Task 11: Create Main Dashboard Page

**Objective:** Wire up all components on the main page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/actions.ts`

**Step 1: Create server action for fetching data**

```typescript
// app/actions.ts
'use server'

import { getUser, getRepos, getLanguages } from '@/lib/github'
import { getRepoHealthScores, aggregateLanguages, calculateSkillRadar } from '@/lib/analytics'
import { GitHubUser, GitHubRepo, RepoHealth, LanguageStats, SkillRadar } from '@/types/github'

export interface ProfileData {
  user: GitHubUser
  repos: GitHubRepo[]
  languages: LanguageStats
  healthScores: RepoHealth[]
  skills: SkillRadar
  totalStars: number
  totalForks: number
}

export async function fetchProfile(username: string): Promise<ProfileData> {
  const user = await getUser(username)
  const repos = await getRepos(username)
  
  const languages = aggregateLanguages(repos)
  const healthScores = await getRepoHealthScores(user.login, repos)
  const skills = calculateSkillRadar(repos)
  
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0)

  return {
    user,
    repos,
    languages,
    healthScores,
    skills,
    totalStars,
    totalForks,
  }
}
```

**Step 2: Create main page component**

```typescript
// app/page.tsx
'use client'

import { useState } from 'react'
import { fetchProfile, ProfileData } from './actions'
import { ProfileOverview } from '@/components/profile-overview'
import { LanguageDonut } from '@/components/charts/language-donut'
import { ContributionHeatmap } from '@/components/charts/contribution-heatmap'
import { RepoHealthCard } from '@/components/cards/repo-health-card'
import { SkillRadar } from '@/components/charts/skill-radar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HeroHighlight } from '@/components/aceternity/hero-highlight'
import { Loader2, Search } from 'lucide-react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!username.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchProfile(username.trim())
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <HeroHighlight>
        <div className="mx-auto max-w-7xl">
          <h1 className="text-center text-4xl font-bold">Git Insight</h1>
          <p className="mt-2 text-center text-muted-foreground">
            Analyze any GitHub profile with advanced metrics and visualizations
          </p>
          
          <div className="mx-auto mt-8 flex max-w-md gap-2">
            <Input
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Analyze
            </Button>
          </div>
          
          {error && (
            <p className="mt-4 text-center text-red-500">{error}</p>
          )}
        </div>
      </HeroHighlight>

      {data && (
        <div className="mx-auto mt-8 max-w-7xl">
          <ProfileOverview 
            user={data.user} 
            totalStars={data.totalStars}
            totalForks={data.totalForks}
          />

          <Tabs defaultValue="analytics" className="mt-8">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="health">Repo Health</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <LanguageDonut languages={data.languages} />
                <SkillRadar skills={data.skills} />
              </div>
              <div className="mt-4">
                <ContributionHeatmap contributions={[]} />
              </div>
            </TabsContent>
            
            <TabsContent value="health" className="mt-4">
              <RepoHealthCard repos={data.healthScores} />
            </TabsContent>
            
            <TabsContent value="export" className="mt-4">
              {/* Export functionality will be added here */}
              <p>Profile card export coming soon...</p>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </main>
  )
}
```

**Step 3: Verify page loads**

```bash
npm run dev
# Open http://localhost:3000
# Should see the search interface
```

**Step 4: Commit**

```bash
git add app/page.tsx app/actions.ts
git commit -m "feat: create main dashboard page with all components"
```

---

## Phase 5: Export Feature

### Task 12: Create Profile Card Export

**Objective:** Generate downloadable PNG profile cards

**Files:**
- Create: `components/cards/profile-card.tsx`
- Create: `lib/export.ts`

**Step 1: Create export utility**

```typescript
// lib/export.ts
import { toPng } from 'html-to-image'

export async function exportToPng(element: HTMLElement, filename: string): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
    })
    
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = dataUrl
    link.click()
  } catch (err) {
    console.error('Export failed:', err)
    throw new Error('Failed to export profile card')
  }
}
```

**Step 2: Create profile card component**

```typescript
// components/cards/profile-card.tsx
'use client'

import { GitHubUser } from '@/types/github'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface ProfileCardProps {
  user: GitHubUser
  topLanguages: string[]
  totalStars: number
  totalRepos: number
}

export function ProfileCard({ user, topLanguages, totalStars, totalRepos }: ProfileCardProps) {
  return (
    <Card className="w-[400px] bg-gradient-to-br from-background to-muted">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback>{user.login[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="text-xl font-bold">{user.name || user.login}</h3>
            <p className="text-muted-foreground">@{user.login}</p>
          </div>
        </div>
        
        {user.bio && (
          <p className="mt-4 text-sm">{user.bio}</p>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          {topLanguages.slice(0, 3).map((lang) => (
            <Badge key={lang} variant="secondary">{lang}</Badge>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{totalRepos}</div>
            <p className="text-xs text-muted-foreground">Repositories</p>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalStars}</div>
            <p className="text-xs text-muted-foreground">Stars</p>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Generated by Git Insight
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 3: Add export button to main page**

```typescript
// Add to app/page.tsx in the export tab
<TabsContent value="export" className="mt-4">
  <div className="flex flex-col items-center gap-4">
    <div id="profile-card">
      <ProfileCard
        user={data.user}
        topLanguages={Object.keys(data.languages)}
        totalStars={data.totalStars}
        totalRepos={data.user.public_repos}
      />
    </div>
    <Button onClick={() => {
      const element = document.getElementById('profile-card')
      if (element) {
        exportToPng(element, `${data.user.login}-profile`)
      }
    }}>
      Download Profile Card
    </Button>
  </div>
</TabsContent>
```

**Step 4: Test export functionality**

```bash
npm run dev
# Search for a username
# Go to Export tab
# Click Download Profile Card
# Should download a PNG file
```

**Step 5: Commit**

```bash
git add components/cards/profile-card.tsx lib/export.ts app/page.tsx
git commit -m "feat: add profile card export with PNG download"
```

---

## Phase 6: Polish and Deploy

### Task 13: Add Dark Mode Support

**Objective:** Ensure proper dark/light mode styling

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Step 1: Verify dark mode works**

```bash
npm run dev
# Toggle dark mode in browser
# All components should adapt properly
```

**Step 2: Fix any styling issues**

- Check chart colors in both modes
- Verify card backgrounds
- Test badge visibility

**Step 3: Commit**

```bash
git add .
git commit -m "fix: ensure proper dark mode support across all components"
```

---

### Task 14: Final Testing and Cleanup

**Objective:** Comprehensive testing and code cleanup

**Step 1: Run type checking**

```bash
npm run type-check
```

**Step 2: Run linting**

```bash
npm run lint
```

**Step 3: Run build**

```bash
npm run build
```

**Step 4: Test all features**

- Profile search with valid username
- Profile search with invalid username (error handling)
- Language donut chart interactions
- Repo health score display
- Skill radar chart
- Profile card export
- Dark/light mode toggle
- Responsive design on mobile

**Step 5: Final commit**

```bash
git add .
git commit -m "chore: final testing and cleanup"
```

---

### Task 15: Deploy to Vercel

**Objective:** Deploy the application to production

**Step 1: Install Vercel CLI**

```bash
npm i -g vercel
```

**Step 2: Deploy**

```bash
vercel
```

**Step 3: Set environment variables**

```bash
vercel env add GITHUB_TOKEN
# Enter your GitHub personal access token
```

**Step 4: Verify deployment**

- Open the Vercel URL
- Test all features in production
- Share with others

**Step 5: Update README with live URL**

```markdown
## Live Demo

[View Live Demo](https://your-vercel-url.vercel.app)
```

**Step 6: Final commit**

```bash
git add README.md
git commit -m "docs: add live demo URL to README"
git push origin main
```

---

## Summary

| Phase | Tasks | Time Estimate |
| --- | --- | --- |
| Phase 1: Project Setup | 3 tasks | 30 min |
| Phase 2: GitHub API | 2 tasks | 45 min |
| Phase 3: UI Components | 5 tasks | 1.5 hours |
| Phase 4: Main Page | 1 task | 45 min |
| Phase 5: Export Feature | 1 task | 30 min |
| Phase 6: Polish & Deploy | 3 tasks | 45 min |
| **Total** | **15 tasks** | **~4.5 hours** |

## Key Milestones

1. **Milestone 1:** Project setup complete (Task 1-3)
2. **Milestone 2:** API integration working (Task 4-5)
3. **Milestone 3:** All UI components built (Task 6-10)
4. **Milestone 4:** Main dashboard functional (Task 11)
5. **Milestone 5:** Export feature working (Task 12)
6. **Milestone 6:** Production ready (Task 13-15)
