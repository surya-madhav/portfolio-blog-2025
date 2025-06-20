import React from 'react'
import { MediaGalleryGrid } from './Grid'
import { MediaGalleryCarousel } from './Carousel'
import { MediaGalleryMasonry } from './Masonry'
import type { Media as MediaType } from '@/payload-types'

export type MediaGalleryProps = {
  media: {
    image: MediaType
    caption?: string
    alt: string
    id?: string
  }[]
  layout: 'grid' | 'carousel' | 'masonry'
  columns?: '2' | '3' | '4'
  showCaptions: boolean
  aspectRatio?: 'auto' | '16-9' | '4-3' | '1-1' | '3-2'
  blockType: 'mediaGallery'
}

type Props = MediaGalleryProps & {
  className?: string
}

export const MediaGalleryBlock: React.FC<Props> = ({ 
  className, 
  media, 
  layout, 
  columns = '3',
  showCaptions, 
  aspectRatio = 'auto'
}) => {
  if (!media || media.length === 0) {
    return null
  }

  const commonProps = {
    media,
    showCaptions,
    className,
  }

  switch (layout) {
    case 'carousel':
      return <MediaGalleryCarousel {...commonProps} />
    
    case 'masonry':
      return <MediaGalleryMasonry {...commonProps} columns={columns} />
    
    case 'grid':
    default:
      return <MediaGalleryGrid {...commonProps} columns={columns} aspectRatio={aspectRatio} />
  }
}
