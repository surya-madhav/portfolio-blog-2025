import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paths, tags } = body

    // Revalidate paths if provided
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        if (typeof path === 'string') {
          revalidatePath(path)
          console.log(`Revalidated path: ${path}`)
        }
      }
    }

    // Revalidate tags if provided
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag === 'string') {
          revalidateTag(tag)
          console.log(`Revalidated tag: ${tag}`)
        }
      }
    }

    return NextResponse.json(
      { 
        message: 'Revalidation successful',
        revalidated: { paths: paths || [], tags: tags || [] }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    )
  }
}
