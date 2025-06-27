'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef, useState } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props
  const [isClient, setIsClient] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    setIsClient(true)

    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename, url } = resource

    // Use absolute URL if available, otherwise construct it
    const videoSrc = url || getMediaUrl(`/media/${filename}`)

    if (!isClient) {
      // Show loading placeholder during SSR/hydration
      return (
        <div
          className={cn(
            videoClassName,
            'bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center',
          )}
          suppressHydrationWarning={true}
        >
          <div className="text-muted-foreground text-sm opacity-50">Loading video...</div>
        </div>
      )
    }

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
        key={videoSrc} // Force re-render when src changes
      >
        <source src={videoSrc} type={resource.mimeType || undefined} />
      </video>
    )
  }

  return null
}
