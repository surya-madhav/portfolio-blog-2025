import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { Project } from '@/payload-types'

interface ProjectContentProps {
  project: Project
}

export const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
  const { layout } = project

  if (!layout || !Array.isArray(layout) || layout.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
              <p className="text-muted-foreground">
                Detailed content for this project is coming soon.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <RenderBlocks blocks={layout} />
        </div>
      </div>
    </section>
  )
}
