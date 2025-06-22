import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProjectCard, type CardProjectData } from '@/components/ProjectCard'
import type { Project, Technology, ProjectCategory } from '@/payload-types'
import { PageHeader } from '@/components/patterns/page-header'

const Projects = async () => {
  try {
    const payload = await getPayload({ config: configPromise })

    const projects = await payload.find({
      collection: 'projects',
      where: {
        _status: { equals: 'published' },
        featured: { equals: true },
      },
      limit: 6,
      sort: '-updatedAt',
      depth: 2,
    })

    const projectDocs: CardProjectData[] =
      projects.docs?.map((project: Project) => {
        const { technologies, categories, ...rest } = project

        const filteredTechnologies =
          technologies?.filter((t): t is Technology => typeof t === 'object' && t !== null) || []

        const filteredCategories =
          categories?.filter((c): c is ProjectCategory => typeof c === 'object' && c !== null) || []

        return {
          ...rest,
          technologies: filteredTechnologies,
          categories: filteredCategories,
        }
      }) || []

    return (
      <section id="projects" className="container mx-auto py-16 px-4">
        <PageHeader
          title="Featured Projects"
          description="Here are some of the projects I'm most proud of. For a full list, visit the projects page."
          className="mb-12"
        />

        {projectDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {projectDocs.map((project) => (
              <ProjectCard
                key={project.slug}
                doc={project}
                featured={project.featured ?? false}
                showTechnologies={true}
                showStatus={true}
                showCategories={false}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">📋</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Featured Projects Yet</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon to see my latest work. Projects marked as &lsquo;featured&rsquo; in
                the CMS will appear here.
              </p>
            </div>
          </div>
        )}
      </section>
    )
  } catch (error) {
    console.error('Error fetching projects:', error)
    return (
      <section id="projects" className="container mx-auto py-16 px-4">
        <PageHeader
          title="Featured Projects"
          description="An error occurred while trying to load projects."
          className="mb-12"
        />
        <div className="text-center py-16">
          <p className="text-muted-foreground">Unable to load projects at this time.</p>
        </div>
      </section>
    )
  }
}

export default Projects
