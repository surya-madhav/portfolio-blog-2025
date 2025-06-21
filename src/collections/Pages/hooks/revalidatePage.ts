import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { getBaseURL } from '../../../utilities/getBaseURL'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const baseURL = getBaseURL()
    const revalidationPromises: Promise<Response | void>[] = []

    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      payload.logger.info(`Revalidating page at path: ${path}`)

      revalidationPromises.push(
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: [path],
            tags: ['pages-sitemap'],
          }),
        }).catch((error) => {
          payload.logger.error(`Failed to revalidate page ${doc.slug}:`, error)
        }),
      )
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      revalidationPromises.push(
        fetch(`${baseURL}/api/revalidate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: [oldPath],
            tags: ['pages-sitemap'],
          }),
        }).catch((error) => {
          payload.logger.error(`Failed to revalidate old page ${previousDoc.slug}:`, error)
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

export const revalidateDelete: CollectionAfterDeleteHook<Page> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.slug) {
    const baseURL = getBaseURL()
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    payload.logger.info(`Revalidating deleted page at path: ${path}`)

    // Don't await to avoid blocking
    fetch(`${baseURL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paths: [path],
        tags: ['pages-sitemap'],
      }),
    }).catch((error) => {
      payload.logger.error(`Failed to revalidate deleted page ${doc.slug}:`, error)
    })
  }

  return doc
}
