import { getPayload } from 'payload'
import type { Payload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Types for our data structure
interface TechnologyData {
  name: string
  description: string
  icon: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'cloud' | 'ai-ml'
  officialWebsite?: string
  documentation?: string
  color?: string
}

interface CategoryData {
  name: string
  description: string
  color: string
  slug: string
}

interface ProjectContentBlock {
  blockType: string
  [key: string]: unknown
}

interface ProjectData {
  title: string
  description: string
  projectStatus: 'completed' | 'in-progress' | 'archived'
  featured: boolean
  heroImage?: string
  links?: {
    github?: string
    liveDemo?: string
    documentation?: string
  }
  technologies: string[]
  categories: string[]
  tags: string[]
  startDate?: string
  completionDate?: string
  slug: string
  content?: {
    [key: string]: ProjectContentBlock
  }
}

interface PortfolioData {
  categories: CategoryData[]
  technologies: Record<string, TechnologyData>
  projects: ProjectData[]
}

// Utility functions
const log = (message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') => {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
  }
  const reset = '\x1b[0m'
  console.log(`${colors[type]}[${type.toUpperCase()}]${reset} ${message}`)
}

const copyMediaFile = async (sourcePath: string, filename: string): Promise<string> => {
  const publicMediaDir = path.join(process.cwd(), 'public', 'media')

  // Ensure the media directory exists
  if (!fs.existsSync(publicMediaDir)) {
    fs.mkdirSync(publicMediaDir, { recursive: true })
  }

  const sourceFile = path.join(
    __dirname,
    '..',
    'docs',
    'data',
    'public',
    sourcePath.replace(/^\//, ''),
  )
  const destinationFile = path.join(publicMediaDir, filename)

  try {
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, destinationFile)
      log(`Copied media file: ${filename}`, 'success')
      return `/media/${filename}`
    } else {
      log(`Media file not found: ${sourceFile}`, 'warn')
      return sourcePath // Return original path as fallback
    }
  } catch (error) {
    log(`Error copying media file ${filename}: ${error}`, 'error')
    return sourcePath // Return original path as fallback
  }
}

const uploadMediaToPayload = async (filePath: string, alt: string, payload: Payload) => {
  try {
    // Copy file to public/media directory
    const filename = path.basename(filePath)
    const publicPath = await copyMediaFile(filePath, filename)

    const fullPath = path.join(process.cwd(), 'public', 'media', filename)

    // Only create if file exists
    if (!fs.existsSync(fullPath)) {
      log(`File not found after copy: ${fullPath}`, 'warn')
      return null
    }

    // Create media record in Payload
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: alt,
        filename: filename,
        mimeType: getMimeType(filename),
        filesize: getFileSize(fullPath),
        url: publicPath,
      },
      file: {
        data: fs.readFileSync(fullPath),
        mimetype: getMimeType(filename),
        name: filename,
        size: getFileSize(fullPath),
      },
    })

    log(`Uploaded media: ${filename}`, 'success')
    return media.id
  } catch (error) {
    log(`Error uploading media ${filePath}: ${error}`, 'error')
    return null
  }
}

const getMimeType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

const getFileSize = (filePath: string): number => {
  try {
    return fs.statSync(filePath).size
  } catch {
    return 0
  }
}

const loadPortfolioData = async () => {
  try {
    log('Starting portfolio data loading process...', 'info')

    const payload = await getPayload({ config: configPromise })

    // Read the portfolio data
    const dataPath = path.join(__dirname, '..', 'docs', 'data', 'portfolio-data.json')
    const portfolioData: PortfolioData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

    log(
      `Loaded data: ${Object.keys(portfolioData.technologies).length} technologies, ${portfolioData.categories.length} categories, ${portfolioData.projects.length} projects`,
      'info',
    )

    // Step 1: Load Technologies
    log('Loading technologies...', 'info')
    const technologyMap = new Map<string, string>()

    for (const [techKey, techData] of Object.entries(portfolioData.technologies)) {
      try {
        // Check if technology already exists
        const existing = await payload.find({
          collection: 'technologies',
          where: { name: { equals: techData.name } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          log(`Technology '${techData.name}' already exists, skipping`, 'warn')
          technologyMap.set(techKey, existing.docs[0]?.id?.toString() || '')
          continue
        }

        // Upload icon if it exists
        let iconId = null
        if (techData.icon) {
          iconId = await uploadMediaToPayload(techData.icon, `${techData.name} icon`, payload)
        }

        // Create technology
        const technology = await payload.create({
          collection: 'technologies',
          data: {
            name: techData.name,
            description: techData.description,
            icon: iconId as any,
            category: techData.category,
            officialWebsite: techData.officialWebsite,
            documentation: techData.documentation,
            color: techData.color,
            slug: techKey.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
        })

        technologyMap.set(techKey, technology.id?.toString() || '')
        log(`Created technology: ${techData.name}`, 'success')
      } catch (error) {
        log(`Error creating technology '${techData.name}': ${error}`, 'error')
      }
    }

    // Step 2: Load Project Categories
    log('Loading project categories...', 'info')
    const categoryMap = new Map<string, string>()

    for (const categoryData of portfolioData.categories) {
      try {
        // Check if category already exists
        const existing = await payload.find({
          collection: 'project-categories',
          where: { name: { equals: categoryData.name } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          log(`Category '${categoryData.name}' already exists, skipping`, 'warn')
          categoryMap.set(categoryData.name, existing.docs[0]?.id?.toString() || '')
          continue
        }

        // Create category
        const category = await payload.create({
          collection: 'project-categories',
          data: {
            name: categoryData.name,
            description: categoryData.description,
            color: categoryData.color,
            slug: categoryData.slug,
          },
        })

        categoryMap.set(categoryData.name, category.id?.toString() || '')
        log(`Created category: ${categoryData.name}`, 'success')
      } catch (error) {
        log(`Error creating category '${categoryData.name}': ${error}`, 'error')
      }
    }

    // Step 3: Load Projects
    log('Loading projects...', 'info')

    for (const projectData of portfolioData.projects) {
      try {
        // Check if project already exists
        const existing = await payload.find({
          collection: 'projects',
          where: { title: { equals: projectData.title } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          log(`Project '${projectData.title}' already exists, skipping`, 'warn')
          continue
        }

        // Upload hero image if it exists
        let heroImageId = null
        if (projectData.heroImage) {
          heroImageId = await uploadMediaToPayload(
            projectData.heroImage,
            `${projectData.title} hero image`,
            payload,
          )
        }

        // Map technologies to IDs
        const technologyIds = projectData.technologies
          .map((techName) => {
            // Find technology by name
            for (const [key, id] of technologyMap.entries()) {
              if (portfolioData.technologies[key]?.name === techName) {
                return parseInt(id) || null
              }
            }
            log(`Technology '${techName}' not found for project '${projectData.title}'`, 'warn')
            return null
          })
          .filter((id): id is number => id !== null)

        // Map categories to IDs
        const categoryIds = projectData.categories
          .map((categoryName) => {
            const id = categoryMap.get(categoryName)
            return id ? parseInt(id) : null
          })
          .filter((id): id is number => id !== null)

        // Prepare content layout blocks
        let layout: unknown[] = []
        if (projectData.content) {
          for (const [blockType, blockData] of Object.entries(projectData.content)) {
            layout.push({
              ...blockData,
              blockType,
            })
          }
        }

        // Create project
        const project = await payload.create({
          collection: 'projects',
          data: {
            title: projectData.title,
            description: projectData.description,
            projectStatus: projectData.projectStatus,
            featured: projectData.featured,
            heroImage: heroImageId,
            links: projectData.links,
            technologies: technologyIds,
            categories: categoryIds,
            tags: projectData.tags,
            startDate: projectData.startDate,
            completionDate: projectData.completionDate,
            slug: projectData.slug,
            layout: layout as any,
            _status: 'published', // Publish immediately
          },
        })

        log(`Created project: ${projectData.title}`, 'success')
      } catch (error) {
        log(`Error creating project '${projectData.title}': ${error}`, 'error')
        console.error(error)
      }
    }

    log('Portfolio data loading completed successfully!', 'success')
    log(`Final summary:`, 'info')
    log(`- Technologies: ${technologyMap.size} loaded`, 'info')
    log(`- Categories: ${categoryMap.size} loaded`, 'info')
    log(`- Projects: Loading completed (check logs for individual results)`, 'info')
  } catch (error) {
    log(`Critical error during data loading: ${error}`, 'error')
    console.error(error)
    process.exit(1)
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error')
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  log(`Uncaught Exception: ${error.message}`, 'error')
  console.error(error)
  process.exit(1)
})

// Execute the loading process
if (import.meta.url === `file://${process.argv[1]}`) {
  loadPortfolioData()
    .then(() => {
      log('Script execution completed', 'success')
      process.exit(0)
    })
    .catch((error) => {
      log(`Script execution failed: ${error}`, 'error')
      process.exit(1)
    })
}

export { loadPortfolioData }
