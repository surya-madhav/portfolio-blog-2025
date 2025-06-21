import type { GlobalAfterChangeHook } from 'payload'
import { getBaseURL } from '../../utilities/getBaseURL'

export const revalidateHeader: GlobalAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    const baseURL = getBaseURL()
    payload.logger.info(`Revalidating header`)

    // Don't await to avoid blocking
    fetch(`${baseURL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: ['global_header']
      }),
    }).catch((error) => {
      payload.logger.error('Failed to revalidate header:', error)
    })
  }

  return doc
}
