import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Project } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderBlocks } from '@/blocks/RenderBlocks'

// Project components to be implemented
import { ProjectHero } from './components/ProjectHero'
import { ProjectContent } from './components/ProjectContent'
import { RelatedProjects } from './components/RelatedProjects'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return projects.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/projects/' + slug

  const project = await queryProjectBySlug({ slug })

  if (!project) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="pb-16">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {/* Live preview listener for draft mode */}
      {draft && <LivePreviewListener />}

      {/* Project Hero Section */}
      <ProjectHero project={project} />

      {/* Project Content */}
      <ProjectContent project={project} />

      {/* Related Projects */}
      <RelatedProjects project={project} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const project = await queryProjectBySlug({ slug })

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.meta?.title || `${project.title} | Projects`,
    description: project.meta?.description || project.description,
    openGraph: {
      title: project.meta?.title || project.title,
      description: project.meta?.description || project.description,
      images: project.meta?.image || project.heroImage ? [
        {
          url: (project.meta?.image as any)?.url || (project.heroImage as any)?.url,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ] : [],
      type: 'article',
      publishedTime: project.publishedAt,
      modifiedTime: project.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.meta?.title || project.title,
      description: project.meta?.description || project.description,
      images: project.meta?.image || project.heroImage ? [
        (project.meta?.image as any)?.url || (project.heroImage as any)?.url
      ] : [],
    },
  }
}

// Cached query function
const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 3, // Deep populate for relationships
  })

  return result.docs?.[0] || null
})
