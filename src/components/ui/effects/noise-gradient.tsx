'use client'

import { cn } from '@/utilities/ui'
import React from 'react'

interface NoiseGradientProps {
  className?: string
  opacity?: number
  blendMode?: 'overlay' | 'multiply' | 'screen' | 'soft-light'
  pattern?: 'noise' | 'grain' | 'texture'
}

export function NoiseGradient({
  className,
  opacity = 0.3,
  blendMode = 'overlay',
  pattern = 'noise',
}: NoiseGradientProps) {
  const patternUrl = pattern === 'noise' ? '/noise.svg' : '/noise.svg'

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        className
      )}
      style={{
        background: `
          linear-gradient(120deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05)),
          url('${patternUrl}')
        `,
        backgroundSize: '200px 200px, 100px 100px',
        opacity,
        mixBlendMode: blendMode,
      }}
    />
  )
}
