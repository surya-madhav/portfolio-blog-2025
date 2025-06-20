'use client'
import React, { useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { X, Search, Filter } from 'lucide-react'
import type { Technology, ProjectCategory } from '@/payload-types'
import { TechnologyBadge } from '@/components/TechnologyBadge'

interface ProjectFilterProps {
  technologies: Technology[]
  categories: ProjectCategory[]
  className?: string
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  technologies,
  categories,
  className
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get current filter values
  const currentSearch = searchParams.get('search') || ''
  const currentStatus = searchParams.get('status') || ''
  const currentTechnology = searchParams.get('technology') || ''
  const currentCategory = searchParams.get('category') || ''
  const currentSort = searchParams.get('sort') || 'newest'

  // Helper function to update URL params
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    // Reset to first page when filters change
    if (Object.keys(updates).some(key => key !== 'page')) {
      params.delete('page')
    }

    router.push(`/projects?${params.toString()}`)
  }, [searchParams, router])

  // Handle search input
  const handleSearchChange = useCallback((value: string) => {
    updateFilters({ search: value || null })
  }, [updateFilters])

  // Handle filter changes
  const handleStatusChange = useCallback((value: string) => {
    updateFilters({ status: value === 'all' ? null : value })
  }, [updateFilters])

  const handleTechnologyChange = useCallback((technologySlug: string) => {
    updateFilters({ technology: technologySlug === 'all' ? null : technologySlug })
  }, [updateFilters])

  const handleCategoryChange = useCallback((categorySlug: string) => {
    updateFilters({ category: categorySlug === 'all' ? null : categorySlug })
  }, [updateFilters])

  const handleSortChange = useCallback((value: string) => {
    updateFilters({ sort: value })
  }, [updateFilters])

  // Clear all filters
  const clearFilters = useCallback(() => {
    router.push('/projects')
  }, [router])

  // Check if any filters are active
  const hasActiveFilters = !!(currentSearch || currentStatus || currentTechnology || currentCategory)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        </div>

        {/* Status Filter */}
        <Select value={currentStatus || 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Technology Filter */}
        <Select value={currentTechnology || 'all'} onValueChange={handleTechnologyChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            {technologies
              .filter(tech => tech.slug && tech.slug.trim() !== '') // Filter out empty slugs
              .map((tech) => (
              <SelectItem key={tech.id} value={tech.slug}>
                <div className="flex items-center gap-2">
                  {tech.icon && typeof tech.icon !== 'string' && (
                    <img 
                      src={tech.icon.url} 
                      alt={`${tech.name} icon`}
                      className="w-4 h-4"
                    />
                  )}
                  {tech.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={currentCategory || 'all'} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories
              .filter(category => category.slug && category.slug.trim() !== '') // Filter out empty slugs
              .map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="featured">Featured First</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentSearch && (
            <Badge variant="secondary" className="gap-2">
              Search: "{currentSearch}"
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleSearchChange('')}
              />
            </Badge>
          )}
          
          {currentStatus && (
            <Badge variant="secondary" className="gap-2 capitalize">
              Status: {currentStatus.replace('-', ' ')}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleStatusChange('all')}
              />
            </Badge>
          )}
          
          {currentTechnology && (
            <Badge variant="secondary" className="gap-2">
              Tech: {technologies.find(t => t.slug === currentTechnology)?.name}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleTechnologyChange('all')}
              />
            </Badge>
          )}
          
          {currentCategory && (
            <Badge variant="secondary" className="gap-2">
              Category: {categories.find(c => c.slug === currentCategory)?.name}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => handleCategoryChange('all')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Quick Technology Filter Buttons */}
      {technologies.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Quick Filters by Technology:</h4>
          <div className="flex flex-wrap gap-2">
            {technologies
              .filter(tech => tech.slug && tech.slug.trim() !== '') // Filter out empty slugs
              .slice(0, 8).map((tech) => ( // Show top 8 technologies
              <TechnologyBadge
                key={tech.id}
                technology={tech}
                size="sm"
                variant={currentTechnology === tech.slug ? 'default' : 'outline'}
                onClick={() => handleTechnologyChange(tech.slug)}
                className="cursor-pointer hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
