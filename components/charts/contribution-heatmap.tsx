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
