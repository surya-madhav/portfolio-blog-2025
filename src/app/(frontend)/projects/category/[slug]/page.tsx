import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/patterns/empty-state'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { ProjectArchiveBlock } from '@/blocks/ProjectArchive/Component'
import type { Technology, ProjectCategory } from '@/payload-types'

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
  const { page = '1', sort = 'newest' } = await searchParams
  const currentPage = parseInt(page, 10)
  const limit = 12

  const payload = await getPayload({ config: configPromise })

  try {
    // Fetch the category
    const categoryResult = await payload.find({
      collection: 'project-categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const category = categoryResult.docs[0]

    if (!category) {
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

    // Fetch projects in this category
    const projectsResult = await payload.find({
      collection: 'projects',
      where: {
        and: [
          {
            categories: {
              in: [category.id],
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

    // Fetch related categories (other categories that have projects)
    const relatedCategories = await payload.find({
      collection: 'project-categories',
      where: {
        and: [
          {
            id: {
              not_equals: category.id,
            },
          },
        ],
      },
      limit: 6,
    })

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                {category.icon &&
                  typeof category.icon === 'object' &&
                  category.icon !== null &&
                  'url' in category.icon && (
                    <Image
                      src={category.icon.url || ''}
                      alt={`${category.name} icon`}
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                  )}
                <h1 className="text-4xl font-bold">{category.name} Projects</h1>
              </div>

              {category.description && (
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {category.description}
                </p>
              )}

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>{projectsResult.totalDocs || 0} projects</span>
                <span>•</span>
                <span>
                  Page {currentPage} of {projectsResult.totalPages || 1}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        {relatedCategories.docs.length > 0 && (
          <div className="container py-8 border-b border-border">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center gap-3">
                {relatedCategories.docs.map((cat) => (
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
                      {cat.icon &&
                        typeof cat.icon === 'object' &&
                        cat.icon !== null &&
                        'url' in cat.icon && (
                          <Image
                            src={cat.icon.url || ''}
                            alt={`${cat.name} icon`}
                            width={16}
                            height={16}
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

            {/* Pagination */}
            {projectsResult.totalPages && projectsResult.totalPages > 1 && (
              <div className="container mt-16">
                <Pagination
                  page={projectsResult.page || 1}
                  totalPages={projectsResult.totalPages}
                />
              </div>
            )}
          </>
        ) : (
          <div className="container mb-12">
            <EmptyState
              title="No projects found"
              description={`No projects found in the ${category.name} category.`}
              action={{
                label: 'Browse All Projects',
                href: '/projects',
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
                      {relatedCat.icon &&
                        typeof relatedCat.icon === 'object' &&
                        relatedCat.icon !== null &&
                        'url' in relatedCat.icon && (
                          <Image
                            src={relatedCat.icon.url || ''}
                            alt={`${relatedCat.name} icon`}
                            width={16}
                            height={16}
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
