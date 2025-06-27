'use client'

import { cn } from '@/utilities/ui'
import React from 'react'

interface ShimmerOverlayProps {
  className?: string
  duration?: number
  delay?: number
  intensity?: 'low' | 'medium' | 'high'
  direction?: 'horizontal' | 'diagonal'
}

export function ShimmerOverlay({
  className,
  duration = 3,
  delay = 0,
  intensity = 'medium',
  direction = 'horizontal',
}: ShimmerOverlayProps) {
  const intensityStyles = {
    low: 'rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%',
    medium: 'rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 100%',
    high: 'rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.1) 100%'
  }

  const directionAngle = direction === 'horizontal' ? '90deg' : '120deg'

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        className
      )}
    >
      <div
        className="absolute inset-0 w-full h-full shimmer-gradient"
        style={{
          background: `linear-gradient(${directionAngle}, ${intensityStyles[intensity]})`,
          transform: 'translateX(-100%)',
          animation: `shimmer-sweep ${duration}s infinite ease-in-out`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  )
}