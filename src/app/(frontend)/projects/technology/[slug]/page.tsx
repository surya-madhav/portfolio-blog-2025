import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/patterns/page-header'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/patterns/empty-state'
import { TechnologyBadge } from '@/components/TechnologyBadge'
import { ProjectArchiveBlock } from '@/blocks/ProjectArchive/Component'
import type { Technology, ProjectCategory } from '@/payload-types'

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
  const { page = '1', sort = 'newest' } = await searchParams
  const currentPage = parseInt(page, 10)
  const limit = 12

  const payload = await getPayload({ config: configPromise })

  try {
    // Fetch the technology
    const technologyResult = await payload.find({
      collection: 'technologies',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const technology = technologyResult.docs[0]

    if (!technology) {
      notFound()
    }

    // Build sort query
    let sortQuery: string
    switch (sort) {
      case 'oldest':
        sortQuery = 'createdAt'
        break
      case 'title':
        sortQuery = 'title'
        break
      case 'featured':
        sortQuery = '-featured,-createdAt'
        break
      default:
        sortQuery = '-createdAt'
    }

    // Fetch projects using this technology
    const projectsResult = await payload.find({
      collection: 'projects',
      where: {
        and: [
          {
            technologies: {
              in: [technology.id],
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      sort: sortQuery,
      page: currentPage,
      limit,
      depth: 2,
    })

    // Fetch related technologies (other technologies used in the same projects)
    const relatedTechnologyIds = new Set<number>()
    projectsResult.docs.forEach((project) => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach((tech) => {
          if (typeof tech === 'object' && tech !== null && tech.id && tech.id !== technology.id) {
            relatedTechnologyIds.add(tech.id)
          }
        })
      }
    })

    // Fetch related technologies
    const relatedTechnologies =
      relatedTechnologyIds.size > 0
        ? await payload.find({
            collection: 'technologies',
            where: {
              id: { in: Array.from(relatedTechnologyIds) },
            },
            limit: 8,
            sort: 'name',
          })
        : { docs: [] }

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
                  technology.description
                    ? `${technology.description} • Showing ${projectsResult.totalDocs} project${projectsResult.totalDocs === 1 ? '' : 's'}`
                    : `Projects built with ${technology.name} • ${projectsResult.totalDocs} project${projectsResult.totalDocs === 1 ? '' : 's'}`
                }
              />

              {/* Technology Links */}
              <div className="flex flex-wrap gap-3 mt-6">
                {technology.officialWebsite && (
                  <Button asChild variant="outline" size="sm">
                    <a href={technology.officialWebsite} target="_blank" rel="noopener noreferrer">
                      Official Website
                    </a>
                  </Button>
                )}
                {technology.documentation && (
                  <Button asChild variant="outline" size="sm">
                    <a href={technology.documentation} target="_blank" rel="noopener noreferrer">
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
              collectionLabels={{
                plural: 'Projects',
                singular: 'Project',
              }}
              currentPage={projectsResult.page || 1}
              limit={limit}
              totalDocs={projectsResult.totalDocs || 0}
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
          <section className="container mb-12">
            <ProjectArchiveBlock
              populateBy="selection"
              selectedDocs={projectsResult.docs.map((project) => ({
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
        ) : (
          <div className="container">
            <EmptyState
              title="No projects found"
              description={`No projects found using ${technology.name}.`}
              action={{
                label: 'Browse All Projects',
                href: '/projects',
              }}
            />
          </div>
        )}

        {/* Pagination */}
        {projectsResult.totalPages && projectsResult.totalPages > 1 && (
          <div className="container mt-16">
            <Pagination page={projectsResult.page || 1} totalPages={projectsResult.totalPages} />
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
                    <TechnologyBadge technology={relatedTech} size="md" variant="outline" />
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
