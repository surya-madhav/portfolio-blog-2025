'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'
import './hero-animations.css'

import { ContactMeDialog } from './ContactMeDialog'
import { DownloadButton } from './DownloadButton'

const HeroSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle scroll for content animations
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY

      // Calculate scroll progress (0 to 1 over the viewport height)
      const progress = Math.min(scrollY / (viewportHeight * 0.6), 1)
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
    <div id="about" className="h-full flex items-center justify-center px-2 sm:px-4 lg:px-8">
      <div
        ref={contentRef}
        className={cn(
          'w-full max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 hero-content hero-text-shadow transform-gpu',
        )}
        style={{
          opacity: Math.max(1 - scrollProgress * 1.2, 0),
          transform: `translateY(${scrollProgress * 50}px) scale(${1 - scrollProgress * 0.1})`,
        }}
      >
        {/* Main heading using design system typography */}
        <div className="space-y-4">
          <h1 className="text-h2 md:text-h1 lg:text-display font-bold leading-tight">
            {/* <span className="block text-foreground/90">Hello, I'm</span> */}
            <span className="block mt-2 text-transparent text-perplexity-apricot ">
              Sai Surya Rebbapragada
            </span>
          </h1>
        </div>

        {/* Role badges using Badge component */}
        <div className="hero-badges flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto px-2">
          <Badge
            variant="outline"
            className="bg-background/10 backdrop-blur-md border-border/20 text-foreground/90 text-xs sm:text-sm badge"
          >
            Data Systems Engineer
          </Badge>
          <Badge
            variant="outline"
            className="bg-background/10 backdrop-blur-md border-border/20 text-foreground/90 text-xs sm:text-sm badge"
          >
            Full-Stack Developer
          </Badge>
          <Badge
            variant="outline"
            className="bg-background/10 backdrop-blur-md border-border/20 text-foreground/90 text-xs sm:text-sm badge"
          >
            Distributed Systems Architect
          </Badge>
          <Badge
            variant="outline"
            className="bg-background/10 backdrop-blur-md border-border/20 text-foreground/90 text-xs sm:text-sm badge"
          >
            Generative AI Engineer
          </Badge>
          <Badge
            variant="outline"
            className="bg-background/10 backdrop-blur-md border-border/20 text-foreground/90 text-xs sm:text-sm badge"
          >
            DevOps & MLOps Specialist
          </Badge>
        </div>

        {/* Description using design system typography and spacing */}
        <div className="max-w-3xl mx-auto px-2">
          <div className="hero-glass-content rounded-lg p-4 sm:p-6">
            <p className="text-body md:text-h5 lg:text-h4 leading-relaxed text-foreground/90">
              I design and implement high-performance data pipelines and scalable architectures
              processing millions of events daily. Skilled in Airflow, Snowflake, DBT, AWS, GCP, and
              modern web technologies (React, Next.js, Node.js). Passionate about Generative AI and
              delivering production-grade solutions.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <ContactMeDialog />
          <DownloadButton />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
