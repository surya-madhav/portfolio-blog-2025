import type { Metadata } from 'next/types'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'

import { ProjectsArchive } from '@/components/ProjectCard'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PageHeader } from '@/components/patterns'
import { EmptyState } from '@/components/patterns'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import type { Technology } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const technologies = await payload.find({
    collection: 'technologies',
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return technologies.docs.map(({ slug }) => ({ slug }))
}

interface SearchParams {
  page?: string
  sort?: 'newest' | 'oldest' | 'title' | 'featured'
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

export default async function TechnologyProjectsPage({ params, searchParams }: Props) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: configPromise })

  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const limit = 12
  const sort = resolvedSearchParams.sort || 'newest'

  try {
    // Find the technology first
    const technologyResult = await payload.find({
      collection: 'technologies',
      where: {
        slug: { equals: slug }
      },
      limit: 1,
      depth: 1,
    })

    const technology = technologyResult.docs[0]
    if (!technology) {
      return notFound()
    }

    // Build sort clause
    const sortClause = sort === 'oldest' ? 'createdAt' : 
                      sort === 'title' ? 'title' :
                      sort === 'featured' ? ['-featured', '-updatedAt'] :
                      '-updatedAt'

    // Find projects using this technology
    const projectsResult = await payload.find({
      collection: 'projects',
      where: {
        _status: { equals: 'published' },
        'technologies.slug': { equals: slug }
      },
      sort: sortClause,
      limit,
      page,
      depth: 2,
      overrideAccess: false,
    })

    // Get other related technologies (used in the same projects)
    const relatedTechSlugs = new Set<string>()
    projectsResult.docs.forEach(project => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => {
          if (typeof tech === 'object' && tech.slug && tech.slug !== slug) {
            relatedTechSlugs.add(tech.slug)
          }
        })
      }
    })

    // Fetch related technologies
    const relatedTechnologies = relatedTechSlugs.size > 0 ? await payload.find({
      collection: 'technologies',
      where: {
        slug: { in: Array.from(relatedTechSlugs) }
      },
      limit: 8,
      sort: 'name',
    }) : { docs: [] }

    return (
      <div className="py-24">
        {/* Back Navigation */}
        <div className="container mb-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="container mb-16">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <TechnologyBadge 
                technology={technology}
                size="lg"
                variant="default"
                showDescription={false}
              />
            </div>
            <div className="flex-1">
              <PageHeader
                title={`${technology.name} Projects`}
                description={
                  technology.description ? 
                    `${technology.description} • Showing ${projectsResult.totalDocs} project${projectsResult.totalDocs === 1 ? '' : 's'}` :
                    `Projects built with ${technology.name} • ${projectsResult.totalDocs} project${projectsResult.totalDocs === 1 ? '' : 's'}`
                }
              />
              
              {/* Technology Links */}
              <div className="flex flex-wrap gap-3 mt-6">
                {technology.officialWebsite && (
                  <Button asChild variant="outline" size="sm">
                    <a 
                      href={technology.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Official Website
                    </a>
                  </Button>
                )}
                {technology.documentation && (
                  <Button asChild variant="outline" size="sm">
                    <a 
                      href={technology.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Documentation
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="container mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <PageRange
              collection="projects"
              currentPage={projectsResult.page}
              limit={limit}
              totalDocs={projectsResult.totalDocs}
            />
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex gap-2">
                {[
                  { value: 'newest', label: 'Newest' },
                  { value: 'oldest', label: 'Oldest' },
                  { value: 'title', label: 'Title' },
                  { value: 'featured', label: 'Featured' },
                ].map((option) => (
                  <Button
                    key={option.value}
                    asChild
                    variant={sort === option.value ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <Link href={`/projects/technology/${slug}?sort=${option.value}`}>
                      {option.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {projectsResult.docs.length > 0 ? (
          <>
            <section className="container mb-12">
              <ProjectsArchive projects={projectsResult.docs} />
            </section>

            {/* Pagination */}
            {projectsResult.totalPages > 1 && (
              <div className="container mb-12">
                <Pagination 
                  page={projectsResult.page} 
                  totalPages={projectsResult.totalPages} 
                />
              </div>
            )}
          </>
        ) : (
          <div className="container mb-12">
            <EmptyState
              title="No projects found"
              description={`No projects have been built with ${technology.name} yet.`}
              action={{
                label: "View All Projects",
                href: "/projects"
              }}
            />
          </div>
        )}

        {/* Related Technologies */}
        {relatedTechnologies.docs.length > 0 && (
          <section className="container border-t border-border pt-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Related Technologies</h2>
              <p className="text-muted-foreground mb-8">
                Other technologies frequently used alongside {technology.name}
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {relatedTechnologies.docs.map((relatedTech) => (
                  <Link
                    key={relatedTech.id}
                    href={`/projects/technology/${relatedTech.slug}`}
                    className="hover:scale-105 transition-transform"
                  >
                    <TechnologyBadge 
                      technology={relatedTech}
                      size="md"
                      variant="outline"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching technology projects:', error)
    return notFound()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  try {
    const technologyResult = await payload.find({
      collection: 'technologies',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const technology = technologyResult.docs[0]

    if (!technology) {
      return {
        title: 'Technology Not Found',
      }
    }

    return {
      title: `${technology.name} Projects | Portfolio`,
      description: technology.description || `Projects built with ${technology.name}`,
      openGraph: {
        title: `${technology.name} Projects | Portfolio`,
        description: technology.description || `Projects built with ${technology.name}`,
        type: 'website',
      },
    }
  } catch {
    return {
      title: 'Technology Projects | Portfolio',
    }
  }
}
