'use client'
import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import { TechnologyList } from '@/components/TechnologyBadge'
import { ExternalLink, Github, FileText, Calendar, Clock, Star } from 'lucide-react'

import type { Project, Technology } from '@/payload-types'

interface ProjectHeroFallbackProps {
  project: Project
}

// Fallback hero component for browsers that don't support modern features
// or when the enhanced hero needs to be disabled
export const ProjectHeroFallback: React.FC<ProjectHeroFallbackProps> = ({ project }) => {
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
  const mediaResource = heroMedia || heroImage

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Media */}
          {(mediaResource || heroVideo) && (
            <div className="mb-12 rounded-2xl overflow-hidden bg-muted shadow-xl">
              {heroVideo && !mediaResource ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${heroVideo}`}
                    title={`${title} - Demo Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : mediaResource && typeof mediaResource !== 'string' ? (
                <div className="aspect-video">
                  <Media
                    resource={mediaResource}
                    size="100vw"
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Project Info */}
          <div className="space-y-8">
            {/* Meta Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={currentStatus.variant} className="gap-2">
                {currentStatus.icon}
                {currentStatus.label}
              </Badge>

              {featured && (
                <Badge variant="default" className="gap-2 bg-primary">
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

            {/* Title and Description */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-xl text-muted-foreground max-w-3xl">{description}</p>
              )}
            </div>

            {/* Timeline */}
            {(startDate || completionDate) && (
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
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
            )}

            {/* Technologies */}
            {technologies && technologies.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Technologies Used</h3>
                <TechnologyList
                  technologies={technologies as Technology[]}
                  size="md"
                  showIcons={true}
                  onTechnologyClick={(tech) => {
                    window.location.href = `/projects/technology/${tech.slug}`
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {links?.github && (
                <Button asChild size="lg" className="gap-2">
                  <a href={links.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" />
                    View Source
                  </a>
                </Button>
              )}

              {links?.liveDemo && (
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a href={links.liveDemo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" />
                    Live Demo
                  </a>
                </Button>
              )}

              {links?.documentation && (
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a href={links.documentation} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-5 h-5" />
                    Documentation
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
