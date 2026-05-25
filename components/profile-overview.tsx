'use client'

import { GitHubUser } from '@/types/github'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
            <div className="text-2xl font-bold">{user.public_repos}</div>
            <p className="text-xs text-muted-foreground">Repositories</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalStars}</div>
            <p className="text-xs text-muted-foreground">Stars</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.followers}</div>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.following}</div>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
