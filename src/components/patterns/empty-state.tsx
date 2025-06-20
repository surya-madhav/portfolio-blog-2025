import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <CardContent>
        {Icon && <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action && (
          action.href ? (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )
        )}
      </CardContent>
    </Card>
  )
}
