import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { getBaseURL } from '../../../utilities/getBaseURL'

import type { Project } from '../../../payload-types'

export const revalidateProject: CollectionAfterChangeHook<Project> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const baseURL = getBaseURL()
    const revalidationPromises: Promise<Response | void>[] = []

    if (doc._status === 'published') {
      const path = `/projects/${doc.slug}`
      payload.logger.info(`Revalidating project at path: ${path}`)

      // Revalidate the project page and projects listing
      revalidationPromises.push(
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: [path, '/projects'],
            tags: ['projects-sitemap'],
          }),
        }).catch((error) => {
          payload.logger.error(`Failed to revalidate project ${doc.slug}:`, error)
        }),
      )
    }

    // If the project was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/projects/${previousDoc.slug}`
      payload.logger.info(`Revalidating old project at path: ${oldPath}`)

      revalidationPromises.push(
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: [oldPath, '/projects'],
            tags: ['projects-sitemap'],
          }),
        }).catch((error) => {
          payload.logger.error(`Failed to revalidate old project ${previousDoc.slug}:`, error)
        }),
      )
    }

    // Don't await these promises to avoid blocking the request
    if (revalidationPromises.length > 0) {
      Promise.all(revalidationPromises).catch((error) => {
        payload.logger.error('Failed to complete all revalidations:', error)
      })
    }
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Project> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    const baseURL = getBaseURL()
    const path = `/projects/${doc.slug}`
    payload.logger.info(`Revalidating deleted project at path: ${path}`)

    // Don't await to avoid blocking
    fetch(`${baseURL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paths: [path, '/projects'],
        tags: ['projects-sitemap'],
      }),
    }).catch((error) => {
      payload.logger.error(`Failed to revalidate deleted project ${doc.slug}:`, error)
    })
  }

  return doc
}
