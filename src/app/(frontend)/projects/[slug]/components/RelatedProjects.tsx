import React from 'react'
import Link from 'next/link'
import { ProjectCard } from '@/components/ProjectCard'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/payload-types'

interface RelatedProjectsProps {
  project: Project
}

export const RelatedProjects: React.FC<RelatedProjectsProps> = ({ project }) => {
  const { relatedProjects } = project

  // Filter out invalid related projects and the current project
  const validRelatedProjects = relatedProjects?.filter(
    (relatedProject) => 
      typeof relatedProject === 'object' && 
      relatedProject !== null &&
      relatedProject.id !== project.id
  ) || []

  if (validRelatedProjects.length === 0) {
    return null
  }

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Related Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore more projects that showcase similar technologies and approaches
            </p>
          </div>

          {/* Related Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {validRelatedProjects.slice(0, 3).map((relatedProject) => (
              <ProjectCard
                key={relatedProject.id}
                doc={relatedProject as any}
                featured={relatedProject.featured}
                className="h-full"
              />
            ))}
          </div>

          {/* View All Projects Button */}
          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/projects">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
