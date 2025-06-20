import React from 'react'
import { RichText } from '@/components/RichText'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

export type ProjectHeroProps = {
  title: string
  subtitle?: string
  backgroundImage?: MediaType
  stats?: {
    label: string
    value: string
    icon?: MediaType
    id?: string
  }[]
  content?: any
  blockType: 'projectHero'
}

type Props = ProjectHeroProps & {
  className?: string
}

export const ProjectHeroBlock: React.FC<Props> = ({ 
  className, 
  title, 
  subtitle, 
  backgroundImage, 
  stats, 
  content 
}) => {
  return (
    <div className={['relative', className].filter(Boolean).join(' ')}>
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Media
            resource={backgroundImage}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      
      {/* Content */}
      <div className={`relative z-10 py-16 md:py-24 ${backgroundImage ? 'text-white' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title and Subtitle */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {title}
              </h1>
              {subtitle && (
                <p className={`text-xl md:text-2xl ${backgroundImage ? 'text-white/90' : 'text-muted-foreground'}`}>
                  {subtitle}
                </p>
              )}
            </div>

            {/* Rich Text Content */}
            {content && (
              <div className="mb-12 max-w-3xl mx-auto">
                <RichText
                  data={content}
                  enableGutter={false}
                  className={backgroundImage ? 'text-white/90' : ''}
                />
              </div>
            )}

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={stat.id || index} className="text-center">
                    {stat.icon && (
                      <div className="mb-3 flex justify-center">
                        <Media
                          resource={stat.icon}
                          className="w-8 h-8"
                        />
                      </div>
                    )}
                    <div className="text-3xl md:text-4xl font-bold mb-1">
                      {stat.value}
                    </div>
                    <div className={`text-sm uppercase tracking-wide ${backgroundImage ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
