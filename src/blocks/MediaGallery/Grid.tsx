import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

type GridProps = {
  media: {
    image: MediaType
    caption?: string
    alt: string
    id?: string
  }[]
  columns: '2' | '3' | '4'
  aspectRatio: 'auto' | '16-9' | '4-3' | '1-1' | '3-2'
  showCaptions: boolean
  className?: string
}

const aspectRatioClasses = {
  'auto': '',
  '16-9': 'aspect-video',
  '4-3': 'aspect-[4/3]',
  '1-1': 'aspect-square',
  '3-2': 'aspect-[3/2]',
}

const columnClasses = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export const MediaGalleryGrid: React.FC<GridProps> = ({ 
  media, 
  columns, 
  aspectRatio, 
  showCaptions, 
  className 
}) => {
  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div className={`grid gap-4 ${columnClasses[columns]}`}>
        {media.map((item, index) => (
          <div key={item.id || index} className="group">
            <div className={`relative overflow-hidden rounded-lg bg-muted ${aspectRatioClasses[aspectRatio]}`}>
              <Media
                resource={item.image}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                alt={item.alt}
              />
              {showCaptions && item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-sm">{item.caption}</p>
                </div>
              )}
            </div>
            {showCaptions && item.caption && aspectRatio === 'auto' && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
