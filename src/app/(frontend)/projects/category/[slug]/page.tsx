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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Folder } from 'lucide-react'
import Link from 'next/link'

import type { ProjectCategory } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'project-categories',
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return categories.docs.map(({ slug }) => ({ slug }))
}

interface SearchParams {
  page?: string
  sort?: 'newest' | 'oldest' | 'title' | 'featured'
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

export default async function CategoryProjectsPage({ params, searchParams }: Props) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const payload = await getPayload({ config: configPromise })

  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const limit = 12
  const sort = resolvedSearchParams.sort || 'newest'

  try {
    // Find the category first
    const categoryResult = await payload.find({
      collection: 'project-categories',
      where: {
        slug: { equals: slug }
      },
      limit: 1,
      depth: 1,
    })

    const category = categoryResult.docs[0]
    if (!category) {
      return notFound()
    }

    // Build sort clause
    const sortClause = sort === 'oldest' ? 'createdAt' : 
                      sort === 'title' ? 'title' :
                      sort === 'featured' ? ['-featured', '-updatedAt'] :
                      '-updatedAt'

    // Find projects in this category
    const projectsResult = await payload.find({
      collection: 'projects',
      where: {
        _status: { equals: 'published' },
        'categories.slug': { equals: slug }
      },
      sort: sortClause,
      limit,
      page,
      depth: 2,
      overrideAccess: false,
    })

    // Get related categories (categories used in the same projects)
    const relatedCategorySlugs = new Set<string>()
    projectsResult.docs.forEach(project => {
      if (project.categories && Array.isArray(project.categories)) {
        project.categories.forEach(cat => {
          if (typeof cat === 'object' && cat.slug && cat.slug !== slug) {
            relatedCategorySlugs.add(cat.slug)
          }
        })
      }
    })

    // Fetch related categories
    const relatedCategories = relatedCategorySlugs.size > 0 ? await payload.find({
      collection: 'project-categories',
      where: {
        slug: { in: Array.from(relatedCategorySlugs) }
      },
      limit: 8,
      sort: 'name',
    }) : { docs: [] }

    // Get all categories for navigation
    const allCategories = await payload.find({
      collection: 'project-categories',
      limit: 50,
      sort: 'name',
    })

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
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                {category.icon && typeof category.icon !== 'string' ? (
                  <img 
                    src={category.icon.url} 
                    alt={`${category.name} icon`}
                    className="w-8 h-8"
                  />
                ) : (
                  <Folder className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <PageHeader
                title={`${category.name} Projects`}
                description={
                  category.description ? 
                    `${category.description} • Showing ${projectsResult.totalDocs} project${projectsResult.totalDocs === 1 ? '' : 's'}` :
                    `Projects in the ${category.name} category • ${projectsResult.totalDocs} project${projectsResult.totalDocs === 1 ? '' : 's'}`
                }
              />
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        {allCategories.docs.length > 1 && (
          <div className="container mb-12">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
              <div className="flex flex-wrap gap-3">
                {allCategories.docs.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/projects/category/${cat.slug}`}
                    className="hover:scale-105 transition-transform"
                  >
                    <Badge 
                      variant={cat.slug === slug ? 'default' : 'outline'}
                      className="gap-2 py-2 px-4 text-sm"
                      style={{
                        backgroundColor: cat.slug === slug && cat.color ? cat.color : undefined,
                        borderColor: cat.color || undefined,
                        color: cat.slug !== slug && cat.color ? cat.color : undefined,
                      }}
                    >
                      {cat.icon && typeof cat.icon !== 'string' && (
                        <img 
                          src={cat.icon.url} 
                          alt={`${cat.name} icon`}
                          className="w-4 h-4"
                        />
                      )}
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

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
                    <Link href={`/projects/category/${slug}?sort=${option.value}`}>
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
              description={`No projects have been categorized as ${category.name} yet.`}
              action={{
                label: "View All Projects",
                href: "/projects"
              }}
            />
          </div>
        )}

        {/* Related Categories */}
        {relatedCategories.docs.length > 0 && (
          <section className="container border-t border-border pt-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-4">Related Categories</h2>
              <p className="text-muted-foreground mb-8">
                Other categories frequently found alongside {category.name} projects
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {relatedCategories.docs.map((relatedCat) => (
                  <Link
                    key={relatedCat.id}
                    href={`/projects/category/${relatedCat.slug}`}
                    className="hover:scale-105 transition-transform"
                  >
                    <Badge 
                      variant="outline"
                      className="gap-2 py-2 px-4"
                      style={{
                        borderColor: relatedCat.color || undefined,
                        color: relatedCat.color || undefined,
                      }}
                    >
                      {relatedCat.icon && typeof relatedCat.icon !== 'string' && (
                        <img 
                          src={relatedCat.icon.url} 
                          alt={`${relatedCat.name} icon`}
                          className="w-4 h-4"
                        />
                      )}
                      {relatedCat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error fetching category projects:', error)
    return notFound()
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  try {
    const categoryResult = await payload.find({
      collection: 'project-categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const category = categoryResult.docs[0]

    if (!category) {
      return {
        title: 'Category Not Found',
      }
    }

    return {
      title: `${category.name} Projects | Portfolio`,
      description: category.description || `Projects in the ${category.name} category`,
      openGraph: {
        title: `${category.name} Projects | Portfolio`,
        description: category.description || `Projects in the ${category.name} category`,
        type: 'website',
      },
    }
  } catch {
    return {
      title: 'Category Projects | Portfolio',
    }
  }
}
