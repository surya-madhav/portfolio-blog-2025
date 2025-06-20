import React from 'react'
import RichText from '@/components/RichText'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export type TechnicalSpecsProps = {
  architecture?: any
  requirements?: {
    category: 'system' | 'software' | 'hardware' | 'network' | 'security' | 'performance'
    requirement: string
    id?: string
  }[]
  deployment?: any
  performance?: {
    loadTime?: string
    throughput?: string
    scalability?: string
    uptime?: string
  }
  blockType: 'technicalSpecs'
}

type Props = TechnicalSpecsProps & {
  className?: string
}

const categoryColors = {
  system: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  software: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  hardware: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  network: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  security: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  performance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
}

const categoryLabels = {
  system: 'System',
  software: 'Software',
  hardware: 'Hardware',
  network: 'Network',
  security: 'Security',
  performance: 'Performance',
}

export const TechnicalSpecsBlock: React.FC<Props> = ({
  className,
  architecture,
  requirements,
  deployment,
  performance,
}) => {
  const hasPerformanceMetrics = performance && Object.values(performance).some((value) => value)

  return (
    <div className={['space-y-8', className].filter(Boolean).join(' ')}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Technical Specifications</h2>
        <p className="text-muted-foreground">Architecture, requirements, and performance details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Architecture */}
        {architecture && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-blue-600">🏗️</span>
                Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RichText data={architecture} enableGutter={false} />
            </CardContent>
          </Card>
        )}

        {/* Deployment */}
        {deployment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-green-600">🚀</span>
                Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RichText data={deployment} enableGutter={false} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Requirements */}
      {requirements && requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-purple-600">📋</span>
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                requirements.reduce(
                  (acc, req) => {
                    const key = req.category
                    if (!acc[key]) acc[key] = []
                    acc[key]!.push(req)
                    return acc
                  },
                  {} as Record<string, typeof requirements>,
                ),
              ).map(([category, reqs]) => (
                <div key={category}>
                  <div className="mb-3">
                    <Badge
                      variant="secondary"
                      className={categoryColors[category as keyof typeof categoryColors]}
                    >
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </Badge>
                  </div>
                  <ul className="space-y-2 ml-4">
                    {reqs.map((req, index) => (
                      <li key={req.id || index} className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1.5">•</span>
                        <span>{req.requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {hasPerformanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-yellow-600">⚡</span>
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performance?.loadTime && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {performance.loadTime}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">
                    Load Time
                  </div>
                </div>
              )}
              {performance?.throughput && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {performance.throughput}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">
                    Throughput
                  </div>
                </div>
              )}
              {performance?.scalability && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {performance.scalability}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">
                    Scalability
                  </div>
                </div>
              )}
              {performance?.uptime && (
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">{performance.uptime}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">
                    Uptime
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
