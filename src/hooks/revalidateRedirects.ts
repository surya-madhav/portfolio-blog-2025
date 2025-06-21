import type { CollectionAfterChangeHook } from 'payload'
import { getBaseURL } from '../utilities/getBaseURL'

export const revalidateRedirects: CollectionAfterChangeHook = async ({ doc, req: { payload } }) => {
  const baseURL = getBaseURL()
  payload.logger.info(`Revalidating redirects`)

  // Don't await to avoid blocking
  fetch(`${baseURL}/api/revalidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tags: ['redirects']
    }),
  }).catch((error) => {
    payload.logger.error('Failed to revalidate redirects:', error)
  })

  return doc
}
