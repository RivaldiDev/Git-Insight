'use server'

import { getUser, getRepos, checkRepoContents } from '@/lib/github'
import { calculateRepoHealthScore, aggregateLanguages, calculateSkillRadar } from '@/lib/analytics'
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
  const skills = calculateSkillRadar(repos)
  
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0)

  const healthScores: RepoHealth[] = []
  for (const repo of repos.slice(0, 10)) {
    const checks = await checkRepoContents(user.login, repo.name)
    healthScores.push(calculateRepoHealthScore(repo, checks))
  }

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
