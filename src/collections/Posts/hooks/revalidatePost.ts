import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { getBaseURL } from '../../../utilities/getBaseURL'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const baseURL = getBaseURL()
    const revalidationPromises: Promise<Response | void>[] = []

    if (doc._status === 'published') {
      const path = `/posts/${doc.slug}`
      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidationPromises.push(
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: [path],
            tags: ['posts-sitemap'],
          }),
        }).catch((error) => {
          payload.logger.error(`Failed to revalidate post ${doc.slug}:`, error)
        }),
      )
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/posts/${previousDoc.slug}`
      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidationPromises.push(
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: [oldPath],
            tags: ['posts-sitemap'],
          }),
        }).catch((error) => {
          payload.logger.error(`Failed to revalidate old post ${previousDoc.slug}:`, error)
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

export const revalidateDelete: CollectionAfterDeleteHook<Post> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    const baseURL = getBaseURL()
    const path = `/posts/${doc.slug}`
    payload.logger.info(`Revalidating deleted post at path: ${path}`)

    // Don't await to avoid blocking
    fetch(`${baseURL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paths: [path],
        tags: ['posts-sitemap'],
      }),
    }).catch((error) => {
      payload.logger.error(`Failed to revalidate deleted post ${doc.slug}:`, error)
    })
  }

  return doc
}
