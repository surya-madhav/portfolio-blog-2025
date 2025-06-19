import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { cn } from "@/utilities/ui"

interface DataCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  action?: {
    label: string
    onClick: () => void
  }
  badge?: {
    label: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
}

export function DataCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  action,
  badge
}: DataCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {badge && (
          <Badge variant={badge.variant}>{badge.label}</Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <p className={cn(
            "text-xs mt-2",
            trend.isPositive ? "text-green-600 dark:text-green-400" : "text-destructive"
          )}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </p>
        )}
        {action && (
          <Button 
            variant="link" 
            className="p-0 h-auto mt-2 text-xs"
            onClick={action.onClick}
          >
            {action.label} →
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
