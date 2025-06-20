import type { Block } from 'payload'
import { lexicalEditor, FixedToolbarFeature, HeadingFeature } from '@payloadcms/richtext-lexical'

export const ProjectHero: Block = {
  slug: 'projectHero',
  interfaceName: 'ProjectHeroBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Hero title (defaults to project title if not provided)',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle or tagline',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional background image (will overlay with hero content)',
      },
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Stat label (e.g., "Lines of Code", "Performance Score")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Stat value (e.g., "10,000+", "95%", "< 2s")',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional icon for the stat',
          },
        },
      ],
      admin: {
        description: 'Key project statistics to highlight',
        initCollapsed: true,
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
          ]
        },
      }),
      admin: {
        description: 'Optional rich text content for the hero section',
      },
    },
  ],
  labels: {
    singular: 'Project Hero',
    plural: 'Project Heroes',
  },
}
