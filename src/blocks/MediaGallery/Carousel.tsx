'use client'
import React, { useState } from 'react'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Media as MediaType } from '@/payload-types'

type CarouselProps = {
  media: {
    image: MediaType
    caption?: string
    alt: string
    id?: string
  }[]
  showCaptions: boolean
  className?: string
}

export const MediaGalleryCarousel: React.FC<CarouselProps> = ({
  media,
  showCaptions,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? media.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === media.length - 1 ? 0 : prevIndex + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (media.length === 0) return null

  const currentItem = media[currentIndex]

  if (!currentItem) return null

  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      {/* Main Carousel */}
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <Media
          resource={currentItem.image}
          className="w-full h-full object-cover"
          alt={currentItem.alt}
        />

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Caption Overlay */}
        {showCaptions && currentItem.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm">{currentItem.caption}</p>
          </div>
        )}

        {/* Slide Counter */}
        {media.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {media.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {media.map((item, index) => (
            <button
              key={item.id || index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                index === currentIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Media resource={item.image} className="w-full h-full object-cover" alt={item.alt} />
            </button>
          ))}
        </div>
      )}

      {/* Caption Below (when not overlay) */}
      {showCaptions && currentItem.caption && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{currentItem.caption}</p>
        </div>
      )}
    </div>
  )
}
