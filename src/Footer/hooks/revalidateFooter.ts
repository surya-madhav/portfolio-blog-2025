import type { GlobalAfterChangeHook } from 'payload'
import { getBaseURL } from '../../utilities/getBaseURL'

export const revalidateFooter: GlobalAfterChangeHook = async ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    const baseURL = getBaseURL()
    payload.logger.info(`Revalidating footer`)

    // Don't await to avoid blocking
    fetch(`${baseURL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tags: ['global_footer']
      }),
    }).catch((error) => {
      payload.logger.error('Failed to revalidate footer:', error)
    })
  }

  return doc
}
