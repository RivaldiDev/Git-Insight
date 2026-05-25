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
