'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import './hero-animations.css'

interface HeroBackgroundProps {
  className?: string
}

export function HeroBackground({ className }: HeroBackgroundProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const backgroundRef = useRef<HTMLDivElement>(null)

  // Handle scroll for blur and scale effects
  useEffect(() => {
    const handleScroll = () => {
      if (!backgroundRef.current) return

      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY

      // Calculate scroll progress (0 to 1 over the viewport height)
      const progress = Math.min(scrollY / (viewportHeight * 0.8), 1)
      setScrollProgress(progress)
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial calculation
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={cn('absolute inset-0 w-full h-full hero-section', className)}>
      {/* Background Image with scroll effects */}
      <div
        ref={backgroundRef}
        className={cn(
          'hero-background absolute inset-0 w-full h-full transform-gpu',
          scrollProgress > 0 && 'blurred'
        )}
        style={{
          filter: `blur(${scrollProgress * 15}px)`,
          transform: `scale(${1 + scrollProgress * 0.1})`,
        }}
      >
        <Image
          src="/hero-background.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
      </div>
      
      {/* Background Video (commented out for now) */}
      {/* <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
          videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ opacity: videoLoaded ? videoOpacity : 0 }}
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={handleVideoLoad}
        onError={() => {
          console.log('Video failed to load, using image fallback')
        }}
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video> */}
      
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/30" />
      
      {/* Subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-background/20" />
    </div>
  )
}
