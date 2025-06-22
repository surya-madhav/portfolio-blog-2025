import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Technology } from '@/payload-types'

// Define the category names and order
type CategoryName =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "cloud"
  | "ai-ml"

const categoryOrder: CategoryName[] = [
  "frontend",
  "backend", 
  "database",
  "devops",
  "cloud",
  "ai-ml"
]

const categoryLabels: Record<CategoryName, string> = {
  "frontend": "Frontend",
  "backend": "Backend",
  "database": "Database",
  "devops": "DevOps", 
  "cloud": "Cloud",
  "ai-ml": "AI/ML"
}

const Skills = async () => {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const technologies = await payload.find({
      collection: 'technologies',
      limit: 100,
      sort: 'name',
      depth: 1,
    })

    // Group technologies by category
    const techByCategory: Record<string, Technology[]> = {}
    
    technologies.docs.forEach(tech => {
      const category = tech.category
      if (!techByCategory[category]) {
        techByCategory[category] = []
      }
      techByCategory[category].push(tech)
    })

    return (
      <section id="skills" className="container mx-auto py-4 px-4 pt-20 pb-20">
        <h1 className='text-4xl font-bold text-center lg:text-left mt-12 mb-6'>Skills</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categoryOrder.map((category) => {
            const categoryTechs = techByCategory[category] || []
            
            if (!categoryTechs.length) {
              return null
            }

            // Determine grid columns based on number of items
            const gridColsClass =
              categoryTechs.length <= 3 ? "grid-cols-3" :
              categoryTechs.length <= 6 ? "grid-cols-3" :
              categoryTechs.length <= 9 ? "grid-cols-3" :
              "grid-cols-4"

            return (
              <div
                key={category}
                className="p-4 border border-border rounded-lg bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
              >
                <h2 className="text-lg font-semibold mb-3 text-primary">
                  {categoryLabels[category]}
                </h2>
                <div className={`grid ${gridColsClass} gap-2`}>
                  {categoryTechs.map((tech) => (
                    <div
                      key={tech.id}
                      className="p-2 flex flex-col items-center justify-center border border-border rounded-md hover:border-primary hover:bg-muted/50 bg-background/30 backdrop-blur-sm transition-all duration-200 h-16 min-h-16"
                    >
                      <div className="h-7 w-7 relative mb-1">
                        <div className="w-full h-full bg-muted rounded flex items-center justify-center text-xs">
                          {tech.name.charAt(0)}
                        </div>
                      </div>
                      <span className="text-xs text-center font-light line-clamp-1" title={tech.name}>
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error fetching technologies:', error)
    return (
      <section id="skills" className="container mx-auto py-4 px-4 pt-20 pb-20">
        <h1 className='text-4xl font-bold text-center lg:text-left mt-12 mb-6'>Skills</h1>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Unable to load skills at this time.</p>
        </div>
      </section>
    )
  }
}

export default Skills
