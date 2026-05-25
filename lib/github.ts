import { GitHubUser, GitHubRepo, LanguageStats } from '@/types/github'

const GITHUB_API = 'https://api.github.com'

async function fetchGitHub<T>(endpoint: string, revalidate = 3600): Promise<T> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const res = await fetch(`${GITHUB_API}${endpoint}`, { 
    headers,
    next: { revalidate }
  } as RequestInit)

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('User not found')
    }
    if (res.status === 403) {
      throw new Error('Rate limit exceeded. Add a GitHub token for higher limits.')
    }
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
