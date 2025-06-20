import React from 'react'
import { Media } from '@/components/Media'
import { Card, CardContent } from '@/components/ui/card'
import type { Media as MediaType } from '@/payload-types'

export type ProjectMetricsProps = {
  metrics: {
    label: string
    value: string
    unit?: string
    description?: string
    icon?: MediaType
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink' | 'gray'
    id?: string
  }[]
  layout: 'cards' | 'list' | 'grid'
  title?: string
  blockType: 'projectMetrics'
}

type Props = ProjectMetricsProps & {
  className?: string
}

const colorClasses = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
  purple: 'text-purple-600 dark:text-purple-400',
  pink: 'text-pink-600 dark:text-pink-400',
  gray: 'text-gray-600 dark:text-gray-400',
}

const bgColorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-950',
  green: 'bg-green-50 dark:bg-green-950',
  yellow: 'bg-yellow-50 dark:bg-yellow-950',
  red: 'bg-red-50 dark:bg-red-950',
  purple: 'bg-purple-50 dark:bg-purple-950',
  pink: 'bg-pink-50 dark:bg-pink-950',
  gray: 'bg-gray-50 dark:bg-gray-950',
}

export const ProjectMetricsBlock: React.FC<Props> = ({ 
  className, 
  metrics, 
  layout, 
  title = 'Project Metrics' 
}) => {
  if (!metrics || metrics.length === 0) {
    return null
  }

  const renderMetric = (metric: ProjectMetricsProps['metrics'][0], index: number) => {
    const colorClass = colorClasses[metric.color]
    const bgColorClass = bgColorClasses[metric.color]

    const content = (
      <>
        <div className="flex items-center gap-3 mb-2">
          {metric.icon && (
            <div className={`p-2 rounded-lg ${bgColorClass}`}>
              <Media resource={metric.icon} className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl md:text-3xl font-bold ${colorClass}`}>
                {metric.value}
              </span>
              {metric.unit && (
                <span className={`text-lg ${colorClass} opacity-80`}>
                  {metric.unit}
                </span>
              )}
            </div>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {metric.label}
            </div>
          </div>
        </div>
        {metric.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {metric.description}
          </p>
        )}
      </>
    )

    if (layout === 'list') {
      return (
        <div key={metric.id || index} className="flex items-start justify-between p-4 border-b last:border-b-0">
          <div className="flex items-center gap-3">
            {metric.icon && (
              <div className={`p-2 rounded-lg ${bgColorClass}`}>
                <Media resource={metric.icon} className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="font-medium">{metric.label}</div>
              {metric.description && (
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold ${colorClass}`}>
              {metric.value}{metric.unit}
            </div>
          </div>
        </div>
      )
    }

    return (
      <Card key={metric.id || index} className="p-4">
        <CardContent className="p-0">
          {content}
        </CardContent>
      </Card>
    )
  }

  const getGridClasses = () => {
    if (layout === 'list') return ''
    
    const count = metrics.length
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 md:grid-cols-2'
    if (count === 3) return 'grid-cols-1 md:grid-cols-3'
    if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      {title && (
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">Key performance indicators and project statistics</p>
        </div>
      )}

      {layout === 'list' ? (
        <Card>
          <CardContent className="p-0">
            {metrics.map((metric, index) => renderMetric(metric, index))}
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-4 ${getGridClasses()}`}>
          {metrics.map((metric, index) => renderMetric(metric, index))}
        </div>
      )}
    </div>
  )
}
