'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utilities/ui'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('mb-8', className)}
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
      {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  )
}
