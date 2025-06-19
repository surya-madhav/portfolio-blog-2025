"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { LucideIcon, Sparkles } from "lucide-react"
import { cn } from "@/utilities/ui"

interface FeatureCardProps {
  title: string
  description: string
  icon?: LucideIcon
  features?: string[]
  badge?: string
  gradient?: boolean
  className?: string
  delay?: number
}

export function FeatureCard({
  title,
  description,
  icon: Icon = Sparkles,
  features = [],
  badge,
  gradient = false,
  className,
  delay = 0
}: FeatureCardProps) {
  const cardClass = cn(
    gradient && "bg-gradient-to-br from-perplexity-true-turquoise to-perplexity-plex-blue text-white",
    className
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Card className={cardClass}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Icon className={cn(
              "h-8 w-8",
              gradient ? "text-white/90" : "text-perplexity-true-turquoise"
            )} />
            {badge && (
              <Badge 
                variant={gradient ? "secondary" : "default"}
                className={gradient ? "bg-white/20 text-white" : ""}
              >
                {badge}
              </Badge>
            )}
          </div>
          <CardTitle className={gradient ? "text-white" : ""}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn(
            "mb-4",
            gradient ? "text-white/90" : "text-muted-foreground"
          )}>
            {description}
          </p>
          {features.length > 0 && (
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li 
                  key={index} 
                  className={cn(
                    "flex items-center text-sm",
                    gradient ? "text-white/80" : "text-muted-foreground"
                  )}
                >
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Grid of feature cards with stagger animation
export function FeatureGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  )
}
