'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star } from 'lucide-react'
import { ProjectsGrid } from './ProjectsGrid'
import type { CardProjectData } from '@/components/ProjectCard'

interface FeaturedProjectsProps {
  projects: CardProjectData[]
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  return (
    <section id="projects" className="py-24 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Featured Work
              </span>
              <Star className="h-5 w-5 text-primary" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Selected Projects
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {/* TODO: Update with your actual description */}A showcase of recent projects that
              demonstrate technical expertise, creative problem-solving, and measurable business
              impact.
            </p>
          </motion.div>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <ProjectsGrid projects={projects} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Featured Projects Yet</h3>
              <p className="text-muted-foreground mb-6">
                {/* TODO: This will show if no featured projects are found */}
                Featured projects will appear here once they&apos;re marked as featured in the CMS.
              </p>
              <Button asChild variant="outline">
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* View All CTA */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/projects" className="inline-flex items-center gap-2">
                View All Projects
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground mt-4">
              Explore {projects.length} featured project{projects.length !== 1 ? 's' : ''} and more
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
