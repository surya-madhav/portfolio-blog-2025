'use client'
import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import { TechnologyList } from '@/components/TechnologyBadge'
import { ExternalLink, Github, FileText, Calendar, Clock, Star } from 'lucide-react'

import type { Project } from '@/payload-types'

interface ProjectHeroProps {
  project: Project
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  const {
    title,
    description,
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

  const currentStatus = statusConfig[projectStatus] || statusConfig['completed']

  return (
    <section className="relative py-24 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Project Info */}
          <div className="space-y-8">
            {/* Project Meta */}
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

            {/* Project Title */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">{title}</h1>

              {description && (
                <p className="text-xl text-muted-foreground leading-relaxed">{description}</p>
              )}
            </div>

            {/* Project Timeline */}
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
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Technologies Used</h3>
                <TechnologyList
                  technologies={technologies as any[]}
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

          {/* Right Column - Project Media */}
          <div className="lg:sticky lg:top-24">
            <div className="relative rounded-2xl overflow-hidden bg-muted shadow-2xl">
              {heroVideo ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${heroVideo}`}
                    title={`${title} - Demo Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : heroImage && typeof heroImage !== 'string' ? (
                <div className="aspect-video">
                  <Media
                    resource={heroImage}
                    size="(max-width: 768px) 100vw, 50vw"
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-muted-foreground/10 flex items-center justify-center">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">No Preview Available</h3>
                      <p className="text-sm">Project preview coming soon</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
