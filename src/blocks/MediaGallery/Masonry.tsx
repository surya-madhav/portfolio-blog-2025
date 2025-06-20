import React from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

type MasonryProps = {
  media: {
    image: MediaType
    caption?: string
    alt: string
    id?: string
  }[]
  columns: '2' | '3' | '4'
  showCaptions: boolean
  className?: string
}

const columnClasses = {
  '2': 'columns-1 md:columns-2',
  '3': 'columns-1 md:columns-2 lg:columns-3',
  '4': 'columns-1 md:columns-2 lg:columns-3 xl:columns-4',
}

export const MediaGalleryMasonry: React.FC<MasonryProps> = ({ 
  media, 
  columns, 
  showCaptions, 
  className 
}) => {
  return (
    <div className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div className={`${columnClasses[columns]} gap-4 space-y-4`}>
        {media.map((item, index) => (
          <div key={item.id || index} className="break-inside-avoid group">
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <Media
                resource={item.image}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                alt={item.alt}
              />
              {showCaptions && item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white text-xs">{item.caption}</p>
                </div>
              )}
            </div>
            {showCaptions && item.caption && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">{item.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
