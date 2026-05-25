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
