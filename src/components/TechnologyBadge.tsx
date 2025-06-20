import React from 'react'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import type { Technology } from '@/payload-types'

type TechnologyBadgeProps = {
  technology: Technology
  showIcon?: boolean
  showDescription?: boolean
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
}

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export const TechnologyBadge: React.FC<TechnologyBadgeProps> = ({
  technology,
  showIcon = true,
  showDescription = false,
  variant = 'secondary',
  size = 'md',
  className,
  onClick,
}) => {
  const badgeContent = (
    <div className="flex items-center gap-1.5">
      {showIcon && technology.icon && (
        <Media
          resource={technology.icon}
          className={iconSizeClasses[size]}
          alt={`${technology.name} icon`}
        />
      )}
      <span>{technology.name}</span>
    </div>
  )

  const badgeStyle = technology.color
    ? {
        backgroundColor: `${technology.color}20`,
        borderColor: `${technology.color}40`,
        color: technology.color,
      }
    : undefined

  if (showDescription && technology.description) {
    return (
      <div className={['inline-flex flex-col items-start gap-1', className].filter(Boolean).join(' ')}>
        <Badge
          variant={variant}
          className={`${sizeClasses[size]} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
          style={badgeStyle}
          onClick={onClick}
        >
          {badgeContent}
        </Badge>
        <p className="text-xs text-muted-foreground max-w-xs">
          {technology.description}
        </p>
      </div>
    )
  }

  return (
    <Badge
      variant={variant}
      className={[
        sizeClasses[size],
        onClick ? 'cursor-pointer hover:opacity-80' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={badgeStyle}
      onClick={onClick}
    >
      {badgeContent}
    </Badge>
  )
}

type TechnologyListProps = {
  technologies: Technology[]
  showIcons?: boolean
  showDescriptions?: boolean
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onTechnologyClick?: (technology: Technology) => void
}

export const TechnologyList: React.FC<TechnologyListProps> = ({
  technologies,
  showIcons = true,
  showDescriptions = false,
  variant = 'secondary',
  size = 'md',
  className,
  onTechnologyClick,
}) => {
  if (!technologies || technologies.length === 0) {
    return null
  }

  return (
    <div className={['flex flex-wrap gap-2', className].filter(Boolean).join(' ')}>
      {technologies.map((technology) => (
        <TechnologyBadge
          key={technology.id}
          technology={technology}
          showIcon={showIcons}
          showDescription={showDescriptions}
          variant={variant}
          size={size}
          onClick={onTechnologyClick ? () => onTechnologyClick(technology) : undefined}
        />
      ))}
    </div>
  )
}

type TechnologyGridProps = {
  technologies: Technology[]
  columns?: 2 | 3 | 4 | 6
  showIcons?: boolean
  showDescriptions?: boolean
  className?: string
  onTechnologyClick?: (technology: Technology) => void
}

const gridClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
}

export const TechnologyGrid: React.FC<TechnologyGridProps> = ({
  technologies,
  columns = 4,
  showIcons = true,
  showDescriptions = true,
  className,
  onTechnologyClick,
}) => {
  if (!technologies || technologies.length === 0) {
    return null
  }

  return (
    <div className={[`grid gap-4 ${gridClasses[columns]}`, className].filter(Boolean).join(' ')}>
      {technologies.map((technology) => (
        <div
          key={technology.id}
          className={`flex flex-col items-center text-center p-4 border rounded-lg hover:shadow-md transition-shadow ${
            onTechnologyClick ? 'cursor-pointer hover:border-primary' : ''
          }`}
          onClick={onTechnologyClick ? () => onTechnologyClick(technology) : undefined}
        >
          {showIcons && technology.icon && (
            <div className="mb-3">
              <Media
                resource={technology.icon}
                className="w-12 h-12"
                alt={`${technology.name} icon`}
              />
            </div>
          )}
          <h3 className="font-semibold mb-1">{technology.name}</h3>
          {showDescriptions && technology.description && (
            <p className="text-sm text-muted-foreground">{technology.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}
