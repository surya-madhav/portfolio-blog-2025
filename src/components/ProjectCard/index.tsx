'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Project, Technology, ProjectCategory } from '@/payload-types'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { TechnologyList } from '@/components/TechnologyBadge'

// Define the project data type for card display
export type CardProjectData = Pick<
  Project,
  'slug' | 'title' | 'description' | 'projectStatus' | 'featured' | 'heroImage' | 'meta'
> & {
  technologies?: Technology[]
  categories?: ProjectCategory[]
}

export const ProjectCard: React.FC<{
  className?: string
  doc?: CardProjectData
  showTechnologies?: boolean
  showStatus?: boolean
  showCategories?: boolean
  featured?: boolean
}> = (props) => {
  const { card, link } = useClickableCard({})
  const {
    className,
    doc,
    showTechnologies = true,
    showStatus = true,
    showCategories = false,
    featured = false,
  } = props

  if (!doc) return null

  const { slug, title, description, projectStatus, heroImage, technologies, categories, meta } = doc
  const { image: metaImage } = meta || {}

  // Use hero image first, then meta image as fallback
  const displayImage = heroImage || metaImage

  const href = `/projects/${slug}`

  // Status badge variants
  const statusVariants = {
    completed: 'default' as const,
    'in-progress': 'secondary' as const,
    archived: 'outline' as const,
  }

  return (
    <article
      className={cn(
        'group border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer transition-all duration-300',
        'hover:shadow-lg hover:border-primary/20 hover:-translate-y-1',
        featured && 'ring-2 ring-primary/20 border-primary/30',
        className,
      )}
      ref={card.ref}
    >
      {/* Project Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {displayImage && typeof displayImage !== 'string' ? (
          <Media
            resource={displayImage}
            size="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-sm">No preview available</p>
            </div>
          </div>
        )}

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          </div>
        )}

        {/* Status badge */}
        {showStatus && projectStatus && (
          <div className="absolute top-3 left-3">
            <Badge variant={statusVariants[projectStatus]} className="capitalize">
              {projectStatus.replace('-', ' ')}
            </Badge>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6 space-y-4">
        {/* Categories */}
        {showCategories && categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => {
              if (typeof category === 'object' && category.name) {
                return (
                  <Badge key={index} variant="outline" className="text-xs">
                    {category.name}
                  </Badge>
                )
              }
              return null
            })}
          </div>
        )}

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={href} ref={link.ref} className="no-underline">
              {title}
            </Link>
          </h3>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
          )}
        </div>

        {/* Technologies */}
        {showTechnologies && technologies && technologies.length > 0 && (
          <div className="pt-2 border-t border-border">
            <TechnologyList
              technologies={technologies.slice(0, 6)} // Show max 6 technologies
              size="sm"
              variant="outline"
              className="justify-start"
            />
            {technologies.length > 6 && (
              <Badge variant="outline" className="mt-2 text-xs">
                +{technologies.length - 6} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

// Projects Archive component (similar to CollectionArchive)
export const ProjectsArchive: React.FC<{
  projects: CardProjectData[]
  className?: string
}> = ({ projects, className }) => {
  return (
    <div className={cn('container', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug || index}
            doc={project}
            featured={project.featured ?? undefined}
            className="h-full"
          />
        ))}
      </div>
    </div>
  )
}
