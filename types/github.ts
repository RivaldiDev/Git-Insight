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
