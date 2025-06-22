'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { ProjectCard, type CardProjectData } from '@/components/ProjectCard'

interface ProjectsGridProps {
  projects: CardProjectData[]
}

// Animation variants for staggered project cards
const containerAnimations: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  // Determine grid columns based on number of projects
  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-md mx-auto'
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
    if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <motion.div
      variants={containerAnimations}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={`grid gap-8 ${getGridCols(projects.length)}`}
    >
      {projects.map((project, index) => (
        <motion.div key={project.slug || index} variants={itemAnimations} className="h-full">
          <ProjectCard
            doc={project}
            featured={project.featured ?? false}
            showTechnologies={true}
            showStatus={true}
            showCategories={false}
            className="h-full hover:shadow-xl transition-shadow duration-300"
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
