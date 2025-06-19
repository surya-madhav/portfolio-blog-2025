import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface ActionCardProps {
  title: string
  description: string
  icon?: LucideIcon
  primaryAction: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  children?: React.ReactNode
}

export function ActionCard({
  title,
  description,
  icon: Icon,
  primaryAction,
  secondaryAction,
  children
}: ActionCardProps) {
  return (
    <Card>
      <CardHeader>
        {Icon && <Icon className="h-8 w-8 text-primary mb-2" />}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <div className="flex gap-4">
          <Button onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
          {secondaryAction && (
            <Button variant="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
