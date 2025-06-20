import type { Metadata } from 'next/types'
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'

import { ProjectsArchive } from '@/components/ProjectCard'
import { ProjectFilter } from '@/components/ProjectFilter'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PageHeader } from '@/components/patterns'
import { EmptyState } from '@/components/patterns'

import type { Project, Technology, ProjectCategory } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 600

interface SearchParams {
  search?: string
  status?: 'completed' | 'in-progress' | 'archived'
  technology?: string
  category?: string
  sort?: 'newest' | 'oldest' | 'title' | 'featured'
  page?: string
}

interface Props {
  searchParams: Promise<SearchParams>
}

// Helper function to build where clause
function buildWhereClause(params: SearchParams) {
  const where: any = {
    _status: { equals: 'published' }
  }

  // Search in title, description, and tags
  if (params.search) {
    where.or = [
      { title: { contains: params.search } },
      { description: { contains: params.search } },
      { tags: { contains: params.search } },
    ]
  }

  // Filter by status
  if (params.status) {
    where.projectStatus = { equals: params.status }
  }

  // Filter by technology
  if (params.technology) {
    where['technologies.slug'] = { equals: params.technology }
  }

  // Filter by category
  if (params.category) {
    where['categories.slug'] = { equals: params.category }
  }

  return where
}

// Helper function to build sort clause
function buildSortClause(sort: string = 'newest') {
  switch (sort) {
    case 'oldest':
      return 'createdAt'
    case 'title':
      return 'title'
    case 'featured':
      return ['-featured', '-updatedAt']
    case 'newest':
    default:
      return '-updatedAt'
  }
}

export default async function ProjectsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const payload = await getPayload({ config: configPromise })

  const page = parseInt(resolvedParams.page || '1', 10)
  const limit = 12

  try {
    // Fetch projects with filtering and pagination
    const where = buildWhereClause(resolvedParams)
    const sort = buildSortClause(resolvedParams.sort)

    const [projectsResult, technologiesResult, categoriesResult] = await Promise.all([
      payload.find({
        collection: 'projects',
        where,
        sort,
        limit,
        page,
        depth: 2,
        overrideAccess: false,
      }),
      payload.find({
        collection: 'technologies',
        limit: 100,
        sort: 'name',
        depth: 1,
        where: {
          slug: { not_equals: '' }, // Exclude empty slugs
        },
      }),
      payload.find({
        collection: 'project-categories',
        limit: 50,
        sort: 'name',
        depth: 0,
        where: {
          slug: { not_equals: '' }, // Exclude empty slugs  
        },
      }),
    ])

    // Separate featured and regular projects
    const featuredProjects = projectsResult.docs.filter(project => project.featured)
    const regularProjects = projectsResult.docs.filter(project => !project.featured)

    // Get filter summary
    const hasFilters = !!(resolvedParams.search || resolvedParams.status || resolvedParams.technology || resolvedParams.category)
    const filterSummary = []
    if (resolvedParams.search) filterSummary.push(`search: "${resolvedParams.search}"`)
    if (resolvedParams.status) filterSummary.push(`status: ${resolvedParams.status}`)
    if (resolvedParams.technology) {
      const tech = technologiesResult.docs.find(t => t.slug === resolvedParams.technology)
      if (tech) filterSummary.push(`technology: ${tech.name}`)
    }
    if (resolvedParams.category) {
      const cat = categoriesResult.docs.find(c => c.slug === resolvedParams.category)
      if (cat) filterSummary.push(`category: ${cat.name}`)
    }

    return (
      <div className="py-24">
        {/* Page Header */}
        <div className="container mb-16">
          <PageHeader
            title="Projects"
            description={
              hasFilters 
                ? `Showing ${projectsResult.totalDocs} project${projectsResult.totalDocs === 1 ? '' : 's'} for ${filterSummary.join(', ')}`
                : `Explore my portfolio of ${projectsResult.totalDocs} project${projectsResult.totalDocs === 1 ? '' : 's'}`
            }
          />
        </div>

        {/* Filter Section */}
        <div className="container mb-12">
          <ProjectFilter
            technologies={technologiesResult.docs}
            categories={categoriesResult.docs}
          />
        </div>

        {/* Results Count and Pagination Info */}
        <div className="container mb-8">
          <PageRange
            collection="projects"
            currentPage={projectsResult.page}
            limit={limit}
            totalDocs={projectsResult.totalDocs}
          />
        </div>

        {/* Projects Display */}
        {projectsResult.docs.length > 0 ? (
          <>
            {/* Featured Projects Section */}
            {!hasFilters && featuredProjects.length > 0 && (
              <section className="container mb-16">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Featured Projects</h2>
                  <p className="text-muted-foreground">Highlighted projects showcasing key work</p>
                </div>
                <ProjectsArchive projects={featuredProjects} />
              </section>
            )}

            {/* All Projects or Regular Projects Section */}
            <section className="container mb-12">
              {!hasFilters && featuredProjects.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">All Projects</h2>
                  <p className="text-muted-foreground">Complete portfolio collection</p>
                </div>
              )}
              <ProjectsArchive 
                projects={hasFilters ? projectsResult.docs : regularProjects} 
              />
            </section>
          </>
        ) : (
          /* Empty State */
          <div className="container">
            <EmptyState
              title="No projects found"
              description={
                hasFilters 
                  ? "No projects match your current filters. Try adjusting your search criteria."
                  : "No projects have been published yet."
              }
              action={
                hasFilters 
                  ? {
                      label: "Clear Filters",
                      href: "/projects"
                    }
                  : undefined
              }
            />
          </div>
        )}

        {/* Pagination */}
        {projectsResult.totalPages > 1 && (
          <div className="container">
            <Pagination 
              page={projectsResult.page} 
              totalPages={projectsResult.totalPages} 
            />
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching projects:', error)
    return notFound()
  }
}

export function generateMetadata(): Metadata {
  return {
    title: 'Projects | Portfolio',
    description: 'Explore my portfolio of web applications, mobile apps, and development projects.',
    openGraph: {
      title: 'Projects | Portfolio',
      description: 'Explore my portfolio of web applications, mobile apps, and development projects.',
      type: 'website',
    },
  }
}
