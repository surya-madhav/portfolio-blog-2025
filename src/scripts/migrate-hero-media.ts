// Migration helper for updating existing projects to use heroMedia field
// This script helps transition from heroImage to heroMedia field

import { getPayload } from 'payload'
import configPromise from '../payload.config.js'

async function migrateProjectHeroMedia() {
  const payload = await getPayload({ config: configPromise })

  try {
    console.log('Starting project hero media migration...')

    // Get all projects
    const projects = await payload.find({
      collection: 'projects',
      limit: 1000,
      depth: 1,
    })

    console.log(`Found ${projects.docs.length} projects to check`)

    let updatedCount = 0

    for (const project of projects.docs) {
      // If project already has heroMedia, skip it
      if (project.heroMedia) {
        console.log(`✓ Project "${project.title}" already has heroMedia`)
        continue
      }

      // If project has heroImage but no heroMedia, migrate it
      if (project.heroImage && !project.heroMedia) {
        console.log(`→ Migrating project "${project.title}"...`)
        
        await payload.update({
          collection: 'projects',
          id: project.id,
          data: {
            heroMedia: project.heroImage,
          },
        })

        updatedCount++
        console.log(`✓ Updated project "${project.title}"`)
      }
    }

    console.log(`\nMigration complete! Updated ${updatedCount} projects.`)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Run the migration
migrateProjectHeroMedia()
