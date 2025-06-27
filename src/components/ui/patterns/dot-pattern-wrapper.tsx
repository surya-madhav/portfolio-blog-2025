'use client'

import React from 'react'
import { DotPattern } from '@/components/ui/patterns/dot-pattern'
import { cn } from '@/utilities/ui'

interface DotPatternWrapperProps {
  children: React.ReactNode
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  glow?: boolean
}

export function DotPatternWrapper({ 
  children, 
  className,
  intensity = 'medium',
  glow = true 
}: DotPatternWrapperProps) {
  const intensityClasses = {
    low: 'text-primary/10',
    medium: 'text-primary/20', 
    high: 'text-primary/30'
  }

  return (
    <div className={cn('relative min-h-screen w-full', className)}>
      {/* Dot Pattern Background */}
      <DotPattern 
        width={28} 
        height={28} 
        cx={1.5}
        cy={1.5}
        cr={1.2}
        glow={glow}
        className={cn(
          'absolute inset-0 h-full w-full',
          intensityClasses[intensity]
        )}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
