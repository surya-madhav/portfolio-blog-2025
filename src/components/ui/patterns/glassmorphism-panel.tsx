'use client'

import { cn } from '@/utilities/ui'
import React from 'react'
import { ShimmerOverlay } from '../effects/shimmer-overlay'
import { NoiseGradient } from '../effects/noise-gradient'

interface GlassmorphismPanelProps {
  children: React.ReactNode
  className?: string
  shimmer?: boolean
  shimmerIntensity?: 'low' | 'medium' | 'high'
  shimmerDuration?: number
  noise?: boolean
  noiseOpacity?: number
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl'
  transparency?: 'low' | 'medium' | 'high'
  border?: boolean
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export function GlassmorphismPanel({
  children,
  className,
  shimmer = true,
  shimmerIntensity = 'medium',
  shimmerDuration = 3,
  noise = true,
  noiseOpacity = 0.3,
  blurIntensity = 'md',
  transparency = 'medium',
  border = true,
  rounded = 'xl',
  padding = 'lg',
}: GlassmorphismPanelProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  }

  const transparencyClasses = {
    low: 'bg-background/60',
    medium: 'bg-background/40',
    high: 'bg-background/20',
  }

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        blurClasses[blurIntensity],
        transparencyClasses[transparency],
        roundedClasses[rounded],
        paddingClasses[padding],
        border && 'border border-border/50',
        'transition-all duration-300 ease-out',
        className
      )}
    >
      {/* Shimmer overlay */}
      {shimmer && (
        <ShimmerOverlay
          intensity={shimmerIntensity}
          duration={shimmerDuration}
          className="rounded-inherit"
        />
      )}
      
      {/* Noise gradient overlay */}
      {noise && (
        <NoiseGradient
          opacity={noiseOpacity}
          className="rounded-inherit"
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
