import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { PageHeader } from '@/components/patterns/page-header'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/patterns/empty-state'
import { ProjectFilter } from '@/components/ProjectFilter'
import { ProjectArchiveBlock } from '@/blocks/ProjectArchive/Component'
import type { Technology, ProjectCategory } from '@/payload-types'

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

// Type for Payload where clause
type WhereClause = {
  _status: { equals: 'published' }
  or?: Array<{ [key: string]: { contains: string } }>
  projectStatus?: { equals: string }
  'technologies.slug'?: { equals: string }
  'categories.slug'?: { equals: string }
}

// Helper function to build where clause
function buildWhereClause(params: SearchParams): WhereClause {
  const where: WhereClause = {
    _status: { equals: 'published' },
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
    const featuredProjects = projectsResult.docs.filter((project) => project.featured)
    const regularProjects = projectsResult.docs.filter((project) => !project.featured)

    // Get filter summary
    const hasFilters = !!(
      resolvedParams.search ||
      resolvedParams.status ||
      resolvedParams.technology ||
      resolvedParams.category
    )
    const filterSummary = []
    if (resolvedParams.search) filterSummary.push(`search: "${resolvedParams.search}"`)
    if (resolvedParams.status) filterSummary.push(`status: ${resolvedParams.status}`)
    if (resolvedParams.technology) {
      const tech = technologiesResult.docs.find((t) => t.slug === resolvedParams.technology)
      if (tech) filterSummary.push(`technology: ${tech.name}`)
    }
    if (resolvedParams.category) {
      const cat = categoriesResult.docs.find((c) => c.slug === resolvedParams.category)
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
            collectionLabels={{
              plural: 'Projects',
              singular: 'Project',
            }}
            currentPage={projectsResult.page || 1}
            limit={limit}
            totalDocs={projectsResult.totalDocs || 0}
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
                <ProjectArchiveBlock
                  populateBy="selection"
                  selectedDocs={featuredProjects.map((project) => ({
                    ...project,
                    technologies:
                      project.technologies?.filter(
                        (tech): tech is Technology => typeof tech === 'object' && tech !== null,
                      ) || [],
                    categories:
                      project.categories?.filter(
                        (cat): cat is ProjectCategory => typeof cat === 'object' && cat !== null,
                      ) || [],
                  }))}
                  displayStyle="grid"
                  showFilters={false}
                  showPagination={false}
                  blockType="projectArchive"
                />
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
              <ProjectArchiveBlock
                populateBy="selection"
                selectedDocs={(hasFilters ? projectsResult.docs : regularProjects).map(
                  (project) => ({
                    ...project,
                    technologies:
                      project.technologies?.filter(
                        (tech): tech is Technology => typeof tech === 'object' && tech !== null,
                      ) || [],
                    categories:
                      project.categories?.filter(
                        (cat): cat is ProjectCategory => typeof cat === 'object' && cat !== null,
                      ) || [],
                  }),
                )}
                displayStyle="grid"
                showFilters={false}
                showPagination={false}
                blockType="projectArchive"
              />
            </section>
          </>
        ) : (
          <div className="container mb-12">
            <EmptyState
              title="No projects found"
              description={
                hasFilters
                  ? 'No projects match your current filters. Try adjusting your search criteria.'
                  : 'No projects are currently available.'
              }
              action={
                hasFilters
                  ? {
                      label: 'Clear Filters',
                      href: '/projects',
                    }
                  : undefined
              }
            />
          </div>
        )}

        {/* Pagination */}
        {projectsResult.totalPages && projectsResult.totalPages > 1 && (
          <div className="container mt-16">
            <Pagination page={projectsResult.page || 1} totalPages={projectsResult.totalPages} />
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching projects:', error)
    return (
      <div className="py-24">
        <div className="container">
          <EmptyState
            title="Error loading projects"
            description="There was an error loading the projects. Please try again later."
            action={{
              label: 'Try Again',
              href: '/projects',
            }}
          />
        </div>
      </div>
    )
  }
}

export function generateMetadata(): Metadata {
  return {
    title: 'Projects | Portfolio',
    description:
      'Explore my portfolio of projects showcasing web development, mobile apps, and technical solutions.',
    openGraph: {
      title: 'Projects | Portfolio',
      description:
        'Explore my portfolio of projects showcasing web development, mobile apps, and technical solutions.',
      type: 'website',
    },
  }
}
