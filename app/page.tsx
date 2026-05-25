'use client'

import { useState } from 'react'
import { fetchProfile, ProfileData } from './actions'
import { ProfileOverview } from '@/components/profile-overview'
import { LanguageDonut } from '@/components/charts/language-donut'
import { ContributionHeatmap } from '@/components/charts/contribution-heatmap'
import { RepoHealthCard } from '@/components/cards/repo-health-card'
import { SkillRadar } from '@/components/charts/skill-radar'
import { ProfileCard } from '@/components/cards/profile-card'
import { exportToPng } from '@/lib/export'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Search, Download } from 'lucide-react'

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

  const handleExport = async () => {
    const element = document.getElementById('profile-card')
    if (element && data) {
      try {
        await exportToPng(element, `${data.user.login}-profile`)
      } catch {
        setError('Failed to export profile card')
      }
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Git Insight</h1>
          <p className="mt-2 text-muted-foreground">
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
                <div className="flex flex-col items-center gap-4">
                  <div id="profile-card">
                    <ProfileCard
                      user={data.user}
                      topLanguages={Object.keys(data.languages)}
                      totalStars={data.totalStars}
                      totalRepos={data.user.public_repos}
                    />
                  </div>
                  <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Profile Card
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  )
}
