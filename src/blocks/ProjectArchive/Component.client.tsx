'use client'
import React, { useState, useEffect } from 'react'
import RichText from '@/components/RichText'
import { TechnologyList } from '@/components/TechnologyBadge'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExternalLink, Github } from 'lucide-react'
import type { ProjectArchiveProps } from './Component'
import type { Project } from '@/payload-types'

// Mock function - in real implementation, this would be an API call
const fetchProjects = async (filters: any): Promise<{ projects: Project[], total: number }> => {
  // This is a placeholder - would be replaced with actual API call
  return { projects: [], total: 0 }
}

export const ProjectArchiveClient: React.FC<ProjectArchiveProps & { className?: string }> = ({
  className,
  introContent,
  populateBy,
  categories,
  technologies,
  projectStatus = 'all',
  featuredOnly = false,
  limit = 10,
  selectedDocs,
  displayStyle,
  columns = '3',
  showFilters,
  showPagination,
}) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: '',
    technology: '',
    status: projectStatus,
  })

  useEffect(() => {
    if (populateBy === 'selection' && selectedDocs) {
      setProjects(selectedDocs)
      setTotal(selectedDocs.length)
    } else {
      loadProjects()
    }
  }, [populateBy, selectedDocs, filters, currentPage])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const result = await fetchProjects({
        categories: categories?.map(c => c.id),
        technologies: technologies?.map(t => t.id),
        status: filters.status !== 'all' ? filters.status : undefined,
        featured: featuredOnly || undefined,
        limit,
        page: currentPage,
      })
      setProjects(result.projects)
      setTotal(result.total)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderProject = (project: Project, index: number) => {
    if (displayStyle === 'list') {
      return (
        <div key={project.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
          {project.heroImage && (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
              <Media resource={project.heroImage} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              {project.featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
            {project.technologies && project.technologies.length > 0 && (
              <TechnologyList 
                technologies={project.technologies as any}
                size="sm"
                className="mb-3"
              />
            )}
            <div className="flex gap-2">
              {project.links?.github && (
                <Button size="sm" variant="outline" asChild>
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </a>
                </Button>
              )}
              {project.links?.liveDemo && (
                <Button size="sm" variant="outline" asChild>
                  <a href={project.links.liveDemo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Demo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <Card key={project.id} className="group hover:shadow-lg transition-shadow">
        {project.heroImage && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <Media 
              resource={project.heroImage} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold">{project.title}</h3>
            {project.featured && (
              <Badge variant="secondary">Featured</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
          {project.technologies && project.technologies.length > 0 && (
            <TechnologyList 
              technologies={project.technologies as any}
              size="sm"
            />
          )}
        </CardContent>
        <CardFooter className="flex gap-2 pt-0">
          {project.links?.github && (
            <Button size="sm" variant="outline" asChild>
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-1" />
                Code
              </a>
            </Button>
          )}
          {project.links?.liveDemo && (
            <Button size="sm" variant="outline" asChild>
              <a href={project.links.liveDemo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Demo
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  const getGridClasses = () => {
    if (displayStyle === 'list') return ''
    
    const columnClasses = {
      '2': 'grid-cols-1 md:grid-cols-2',
      '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    }
    
    return `grid gap-6 ${columnClasses[columns || '3']}`
  }

  return (
    <div className={['space-y-8', className].filter(Boolean).join(' ')}>
      {/* Intro Content */}
      {introContent && (
        <div className="text-center">
          <RichText data={introContent} enableGutter={false} />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
          <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Additional filters would go here */}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Projects */}
      {!loading && (
        <div className={displayStyle === 'list' ? 'space-y-4' : getGridClasses()}>
          {projects.map((project, index) => renderProject(project, index))}
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      )}

      {/* Pagination */}
      {showPagination && total > limit && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {currentPage} of {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= Math.ceil(total / limit)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
