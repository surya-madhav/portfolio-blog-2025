const fs = require('fs')
const path = require('path')

// Simple data loading script for Node.js
const loadPortfolioData = async () => {
  try {
    console.log('🚀 Starting portfolio data loading process...')
    
    // Dynamic import of ES modules
    const { getPayload } = await import('payload')
    
    // Import the config (this might need to be adjusted based on your setup)
    const configPath = path.join(process.cwd(), 'src', 'payload.config.ts')
    let config
    
    try {
      // Try to load the config
      const configModule = await import(configPath)
      config = configModule.default || configModule
    } catch (error) {
      console.error('❌ Could not load payload config:', error.message)
      console.log('💡 Make sure to run this script from the project root directory')
      process.exit(1)
    }
    
    const payload = await getPayload({ config })
    
    // Read the portfolio data
    const dataPath = path.join(__dirname, '..', 'docs', 'data', 'portfolio-data.json')
    
    if (!fs.existsSync(dataPath)) {
      console.error('❌ Portfolio data file not found:', dataPath)
      process.exit(1)
    }
    
    const portfolioData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    
    console.log(`📊 Loaded data:`)
    console.log(`   - ${Object.keys(portfolioData.technologies).length} technologies`)
    console.log(`   - ${portfolioData.categories.length} categories`)
    console.log(`   - ${portfolioData.projects.length} projects`)

    // Helper function to copy media files
    const copyMediaFile = (sourcePath, filename) => {
      const publicMediaDir = path.join(process.cwd(), 'public', 'media')
      
      if (!fs.existsSync(publicMediaDir)) {
        fs.mkdirSync(publicMediaDir, { recursive: true })
      }

      const sourceFile = path.join(__dirname, '..', 'docs', 'data', 'public', sourcePath.replace(/^\//, ''))
      const destinationFile = path.join(publicMediaDir, filename)
      
      try {
        if (fs.existsSync(sourceFile)) {
          fs.copyFileSync(sourceFile, destinationFile)
          console.log(`✅ Copied media file: ${filename}`)
          return `/media/${filename}`
        } else {
          console.log(`⚠️  Media file not found: ${sourceFile}`)
          return sourcePath
        }
      } catch (error) {
        console.error(`❌ Error copying media file ${filename}:`, error.message)
        return sourcePath
      }
    }

    // Helper function to get MIME type
    const getMimeType = (filename) => {
      const ext = path.extname(filename).toLowerCase()
      const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.gif': 'image/gif'
      }
      return mimeTypes[ext] || 'application/octet-stream'
    }

    // Helper function to get file size
    const getFileSize = (filePath) => {
      try {
        return fs.statSync(filePath).size
      } catch {
        return 0
      }
    }

    // Helper function to upload media to Payload
    const uploadMediaToPayload = async (filePath, alt) => {
      try {
        const filename = path.basename(filePath)
        const publicPath = copyMediaFile(filePath, filename)
        
        const fullPath = path.join(process.cwd(), 'public', 'media', filename)
        
        if (!fs.existsSync(fullPath)) {
          console.log(`⚠️  File not found after copy: ${fullPath}`)
          return null
        }
        
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: alt,
            filename: filename,
            mimeType: getMimeType(filename),
            filesize: getFileSize(fullPath),
            url: publicPath,
          },
        })
        
        console.log(`✅ Uploaded media: ${filename}`)
        return media.id
      } catch (error) {
        console.error(`❌ Error uploading media ${filePath}:`, error.message)
        return null
      }
    }

    // Step 1: Load Technologies
    console.log('🔧 Loading technologies...')
    const technologyMap = new Map()
    
    for (const [techKey, techData] of Object.entries(portfolioData.technologies)) {
      try {
        // Check if technology already exists
        const existing = await payload.find({
          collection: 'technologies',
          where: { name: { equals: techData.name } },
          limit: 1,
        })
        
        if (existing.docs.length > 0) {
          console.log(`⚠️  Technology '${techData.name}' already exists, skipping`)
          technologyMap.set(techKey, existing.docs[0].id)
          continue
        }
        
        // Upload icon if it exists
        let iconId = null
        if (techData.icon) {
          iconId = await uploadMediaToPayload(techData.icon, `${techData.name} icon`)
        }
        
        // Create technology
        const technology = await payload.create({
          collection: 'technologies',
          data: {
            name: techData.name,
            description: techData.description,
            icon: iconId,
            category: techData.category,
            officialWebsite: techData.officialWebsite,
            documentation: techData.documentation,
            color: techData.color,
            slug: techKey.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          },
        })
        
        technologyMap.set(techKey, technology.id)
        console.log(`✅ Created technology: ${techData.name}`)
        
      } catch (error) {
        console.error(`❌ Error creating technology '${techData.name}':`, error.message)
      }
    }
    
    // Step 2: Load Project Categories
    console.log('📁 Loading project categories...')
    const categoryMap = new Map()
    
    for (const categoryData of portfolioData.categories) {
      try {
        // Check if category already exists
        const existing = await payload.find({
          collection: 'project-categories',
          where: { name: { equals: categoryData.name } },
          limit: 1,
        })
        
        if (existing.docs.length > 0) {
          console.log(`⚠️  Category '${categoryData.name}' already exists, skipping`)
          categoryMap.set(categoryData.name, existing.docs[0].id)
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
        
        categoryMap.set(categoryData.name, category.id)
        console.log(`✅ Created category: ${categoryData.name}`)
        
      } catch (error) {
        console.error(`❌ Error creating category '${categoryData.name}':`, error.message)
      }
    }
    
    // Step 3: Load Projects
    console.log('🚀 Loading projects...')
    
    for (const projectData of portfolioData.projects) {
      try {
        // Check if project already exists
        const existing = await payload.find({
          collection: 'projects',
          where: { title: { equals: projectData.title } },
          limit: 1,
        })
        
        if (existing.docs.length > 0) {
          console.log(`⚠️  Project '${projectData.title}' already exists, skipping`)
          continue
        }
        
        // Upload hero image if it exists
        let heroImageId = null
        if (projectData.heroImage) {
          heroImageId = await uploadMediaToPayload(
            projectData.heroImage, 
            `${projectData.title} hero image`
          )
        }
        
        // Map technologies to IDs
        const technologyIds = projectData.technologies
          .map(techName => {
            // Find technology by name
            for (const [key, id] of technologyMap.entries()) {
              if (portfolioData.technologies[key]?.name === techName) {
                return id
              }
            }
            console.log(`⚠️  Technology '${techName}' not found for project '${projectData.title}'`)
            return null
          })
          .filter(id => id !== null)
        
        // Map categories to IDs
        const categoryIds = projectData.categories
          .map(categoryName => categoryMap.get(categoryName))
          .filter(id => id !== undefined)
        
        // Prepare content layout blocks
        let layout = []
        if (projectData.content) {
          for (const [blockType, blockData] of Object.entries(projectData.content)) {
            layout.push({
              blockType,
              ...blockData,
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
            layout: layout,
            _status: 'published',
          },
        })
        
        console.log(`✅ Created project: ${projectData.title}`)
        
      } catch (error) {
        console.error(`❌ Error creating project '${projectData.title}':`, error.message)
      }
    }
    
    console.log('🎉 Portfolio data loading completed successfully!')
    console.log('📊 Final summary:')
    console.log(`   - Technologies: ${technologyMap.size} loaded`)
    console.log(`   - Categories: ${categoryMap.size} loaded`)
    console.log(`   - Projects: Loading completed`)
    
  } catch (error) {
    console.error('💥 Critical error during data loading:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Run the script
loadPortfolioData()
  .then(() => {
    console.log('✨ Script execution completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script execution failed:', error.message)
    process.exit(1)
  })
