'use client'
import React, { useEffect, useState, useRef, ReactNode } from 'react'
import { cn } from '@/utilities/ui'

interface ScrollBlurWrapperProps {
  children: ReactNode
  className?: string
  maxBlur?: number
  blurStart?: number
  scaleAmount?: number
}

export const ScrollBlurWrapper: React.FC<ScrollBlurWrapperProps> = ({
  children,
  className,
  maxBlur = 20,
  blurStart = 0.8,
  scaleAmount = 0.1,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return

      const elementTop = wrapperRef.current.offsetTop
      const elementHeight = wrapperRef.current.offsetHeight
      const scrollY = window.scrollY
      
      // Calculate scroll progress relative to the element (0 to 1)
      const relativeScroll = scrollY - elementTop
      const progress = Math.max(0, Math.min(relativeScroll / (elementHeight * blurStart), 1))
      
      setScrollProgress(progress)
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial calculation
      
      // Use requestAnimationFrame for smooth updates
      let ticking = false
      const updateScroll = () => {
        handleScroll()
        ticking = false
      }
      
      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll)
          ticking = true
        }
      }
      
      window.addEventListener('scroll', requestTick, { passive: true })
      
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('scroll', requestTick)
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [blurStart])

  return (
    <div ref={wrapperRef} className={cn('relative overflow-hidden', className)}>
      <div 
        className="transform-gpu transition-all duration-300 will-change-transform"
        style={{
          filter: `blur(${scrollProgress * maxBlur}px)`,
          transform: `scale(${1 + scrollProgress * scaleAmount})`,
          // Add backdrop filter for better performance on some browsers
          backfaceVisibility: 'hidden',
          perspective: 1000,
        }}
      >
        {children}
      </div>
    </div>
  )
}
