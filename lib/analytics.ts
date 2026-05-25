import { GitHubRepo, RepoHealth, LanguageStats, SkillRadar } from '@/types/github'

export function calculateRepoHealthScore(repo: GitHubRepo, checks: {
  hasReadme: boolean
  hasLicense: boolean
  hasCI: boolean
  hasDocs: boolean
}): RepoHealth {
  let score = 0

  if (checks.hasReadme) score += 20
  if (checks.hasLicense) score += 15
  if (repo.description) score += 15
  if (checks.hasCI) score += 20
  if (checks.hasDocs) score += 15

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

  for (const repo of repos) {
    if (repo.language && frontendLangs.includes(repo.language)) {
      skills.frontend += repo.size
    }

    if (repo.language && backendLangs.includes(repo.language)) {
      skills.backend += repo.size
    }

    if (repo.language && devopsTools.includes(repo.language)) {
      skills.devops += repo.size
    }
    if (repo.topics.some(t => ['docker', 'kubernetes', 'ci-cd', 'devops'].includes(t))) {
      skills.devops += 1000
    }

    if (repo.name.toLowerCase().match(/test|spec/)) {
      skills.testing += repo.size
    }

    if (repo.has_wiki || repo.description) {
      skills.docs += 1000
    }
    if (repo.topics.some(t => ['documentation', 'docs'].includes(t))) {
      skills.docs += 1000
    }
  }

  const max = Math.max(skills.frontend, skills.backend, skills.devops, skills.testing, skills.docs, 1)
  return {
    frontend: Math.round((skills.frontend / max) * 100),
    backend: Math.round((skills.backend / max) * 100),
    devops: Math.round((skills.devops / max) * 100),
    testing: Math.round((skills.testing / max) * 100),
    docs: Math.round((skills.docs / max) * 100),
  }
}
