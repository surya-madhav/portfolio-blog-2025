import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateProject } from './hooks/revalidateProject'

// Import project-specific blocks
import { ProjectHero } from '../../blocks/ProjectHero/config'
import { TechnicalSpecs } from '../../blocks/TechnicalSpecs/config'
import { Code } from '../../blocks/Code/config'
import { MermaidDiagram } from '../../blocks/MermaidDiagram/config'
import { MediaGallery } from '../../blocks/MediaGallery/config'
import { ProjectMetrics } from '../../blocks/ProjectMetrics/config'
import { ProjectArchive } from '../../blocks/ProjectArchive/config'
// Import existing blocks
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    projectStatus: true,
    featured: true,
  },
  admin: {
    defaultColumns: ['title', 'projectStatus', 'featured', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'projects',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'projects',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Project title displayed in listings and project page',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      maxLength: 500,
      admin: {
        description: 'Brief project description for listings and meta description',
      },
    },
    {
      name: 'projectStatus',
      type: 'select',
      options: [
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'completed',
      admin: {
        position: 'sidebar',
        description: 'Current project status',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this project on homepage and top of listings',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main project image displayed in listings and project header',
      },
    },
    {
      name: 'heroVideo',
      type: 'text',
      admin: {
        description: 'YouTube video ID for project demo (overrides hero image)',
      },
    },
    {
      name: 'links',
      type: 'group',
      fields: [
        {
          name: 'github',
          type: 'text',
          validate: (val: unknown) =>
            !val ||
            (val as string).startsWith('https://github.com/') ||
            'Must be a valid GitHub URL',
          admin: {
            description: 'GitHub repository URL',
          },
        },
        {
          name: 'liveDemo',
          type: 'text',
          validate: (val: unknown) =>
            !val || (val as string).startsWith('http') || 'Must be a valid URL',
          admin: {
            description: 'Live demo/production URL',
          },
        },
        {
          name: 'documentation',
          type: 'text',
          validate: (val: unknown) =>
            !val || (val as string).startsWith('http') || 'Must be a valid URL',
          admin: {
            description: 'Documentation URL',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                ProjectHero,
                TechnicalSpecs,
                Code,
                MermaidDiagram,
                MediaGallery,
                ProjectMetrics,
                ProjectArchive,
                CallToAction,
                Content,
                MediaBlock,
              ],
              admin: {
                initCollapsed: true,
                description: 'Build your project page content using blocks',
              },
            },
          ],
        },
        {
          label: 'Technologies',
          fields: [
            {
              name: 'technologies',
              type: 'relationship',
              relationTo: 'technologies',
              hasMany: true,
              admin: {
                description: 'Select technologies used in this project',
              },
            },
            {
              name: 'primaryTechnology',
              type: 'relationship',
              relationTo: 'technologies',
              admin: {
                description: 'Main technology/framework used (for filtering and display)',
              },
            },
          ],
        },
        {
          label: 'Organization',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'project-categories',
              hasMany: true,
              admin: {
                description: 'Project categories for organization',
              },
            },
            {
              name: 'tags',
              type: 'text',
              hasMany: true,
              admin: {
                description: 'Keywords for search and filtering',
              },
            },
            {
              name: 'relatedProjects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              filterOptions: ({ id }) => ({
                id: { not_in: [id] },
              }),
              admin: {
                description: 'Related projects to show in suggestions',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When project development started',
      },
    },
    {
      name: 'completionDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When project was completed',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateProject],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  timestamps: true,
}
