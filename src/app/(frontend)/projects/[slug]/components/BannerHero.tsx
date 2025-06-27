'use client'
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import { TechnologyList } from '@/components/TechnologyBadge'
import { ExternalLink, Github, FileText, Calendar, Clock, Star } from 'lucide-react'
import { cn } from '@/utilities/ui'
import './hero-styles.css'

import type { Project, Technology } from '@/payload-types'

interface BannerHeroProps {
  project: Project
}

export const BannerHero: React.FC<BannerHeroProps> = ({ project }) => {
  const {
    title,
    description,
    heroMedia,
    heroImage,
    heroVideo,
    projectStatus,
    featured,
    technologies,
    categories,
    links,
    startDate,
    completionDate,
  } = project

  // Scroll blur effect state
  const [scrollProgress, setScrollProgress] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Handle scroll for blur effect
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return

      const heroHeight = heroRef.current.offsetHeight
      const scrollY = window.scrollY

      // Calculate scroll progress (0 to 1)
      const progress = Math.min(scrollY / (heroHeight * 0.8), 1)
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

  // Status configurations
  const statusConfig = {
    completed: {
      label: 'Completed',
      variant: 'default' as const,
      icon: <Clock className="w-4 h-4" />,
    },
    'in-progress': {
      label: 'In Progress',
      variant: 'secondary' as const,
      icon: <Clock className="w-4 h-4" />,
    },
    archived: {
      label: 'Archived',
      variant: 'outline' as const,
      icon: <Clock className="w-4 h-4" />,
    },
  }

  const currentStatus = statusConfig[projectStatus || 'completed'] || statusConfig['completed']

  // Determine which media to use (prioritize heroMedia, fallback to legacy fields)
  const mediaResource = heroMedia || heroImage
  const _isVideo =
    mediaResource &&
    typeof mediaResource === 'object' &&
    'mimeType' in mediaResource &&
    mediaResource.mimeType?.includes('video')

  return (
    <>
      {/* Full-screen banner with blur effect */}
      <section
        ref={heroRef}
        className="project-hero-banner relative h-screen overflow-hidden -mt-16"
      >
        {/* Background media */}
        <div className="absolute inset-0">
          {/* Media container with blur effect */}
          <div
            className={cn(
              'project-hero-media absolute inset-0 transform-gpu transition-all duration-300',
              scrollProgress > 0 && 'blurred',
            )}
            style={{
              filter: `blur(${scrollProgress * 20}px)`,
              transform: `scale(${1 + scrollProgress * 0.1})`,
            }}
          >
            {heroVideo && !mediaResource ? (
              // Legacy YouTube video support
              <>
                <div className="hero-video-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${heroVideo}?autoplay=1&mute=1&loop=1&playlist=${heroVideo}&controls=0&showinfo=0&modestbranding=1`}
                    title={`${title} - Demo Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </>
            ) : mediaResource && typeof mediaResource !== 'string' ? (
              // Media from collection (image or video)
              <>
                <Media
                  resource={mediaResource}
                  size="100vw"
                  className="absolute inset-0 w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  videoClassName="w-full h-full object-cover"
                  priority
                />
              </>
            ) : (
              // Fallback when no media is available
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-muted/40" />
              </>
            )}
          </div>

          {/* Gradient overlay for text readability */}
          <div className="hero-gradient-overlay absolute inset-0" />
        </div>

        {/* Hero content overlay */}
        <div className="hero-content-overlay relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Project Meta */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <Badge variant={currentStatus.variant} className="gap-2 badge">
                  {currentStatus.icon}
                  {currentStatus.label}
                </Badge>

                {featured && (
                  <Badge variant="default" className="gap-2 bg-primary badge">
                    <Star className="w-4 h-4" />
                    Featured
                  </Badge>
                )}

                {categories && categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => {
                      if (typeof category === 'object' && category.name) {
                        return (
                          <Link
                            key={index}
                            href={`/projects/category/${category.slug}`}
                            className="hover:scale-105 transition-transform"
                          >
                            <Badge
                              variant="outline"
                              className="badge"
                              style={{
                                borderColor: category.color || undefined,
                                color: category.color || undefined,
                              }}
                            >
                              {category.name}
                            </Badge>
                          </Link>
                        )
                      }
                      return null
                    })}
                  </div>
                )}
              </div>

              {/* Project Title and Description */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-white">
                {title}
              </h1>

              {description && (
                <p className="text-xl md:text-2xl text-white/90 max-w-3xl">{description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content section below hero */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left column - Technologies and Timeline */}
              <div className="lg:col-span-2 space-y-8">
                {/* Technologies */}
                {technologies && technologies.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Technologies Used</h3>
                    <TechnologyList
                      technologies={technologies as Technology[]}
                      size="lg"
                      showIcons={true}
                      onTechnologyClick={(tech) => {
                        window.location.href = `/projects/technology/${tech.slug}`
                      }}
                    />
                  </div>
                )}

                {/* Project Timeline */}
                {(startDate || completionDate) && (
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold">Timeline</h3>
                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                      {startDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Started: {new Date(startDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {completionDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Completed: {new Date(completionDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - Action Buttons */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <h3 className="text-2xl font-semibold mb-6">Project Links</h3>

                  {links?.github && (
                    <Button asChild size="lg" className="w-full gap-2">
                      <a href={links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5" />
                        View Source Code
                      </a>
                    </Button>
                  )}

                  {links?.liveDemo && (
                    <Button asChild variant="outline" size="lg" className="w-full gap-2">
                      <a href={links.liveDemo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5" />
                        Live Demo
                      </a>
                    </Button>
                  )}

                  {links?.documentation && (
                    <Button asChild variant="outline" size="lg" className="w-full gap-2">
                      <a href={links.documentation} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-5 h-5" />
                        Documentation
                      </a>
                    </Button>
                  )}

                  {!links?.github && !links?.liveDemo && !links?.documentation && (
                    <p className="text-muted-foreground text-sm">
                      No external links available for this project.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
