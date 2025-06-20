import type { Block } from 'payload'
import { lexicalEditor, FixedToolbarFeature, HeadingFeature } from '@payloadcms/richtext-lexical'

export const TechnicalSpecs: Block = {
  slug: 'technicalSpecs',
  interfaceName: 'TechnicalSpecsBlock',
  fields: [
    {
      name: 'architecture',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h3', 'h4', 'h5'] }),
            FixedToolbarFeature(),
          ]
        },
      }),
      admin: {
        description: 'System architecture and design patterns',
      },
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'System', value: 'system' },
            { label: 'Software', value: 'software' },
            { label: 'Hardware', value: 'hardware' },
            { label: 'Network', value: 'network' },
            { label: 'Security', value: 'security' },
            { label: 'Performance', value: 'performance' },
          ],
          defaultValue: 'system',
        },
        {
          name: 'requirement',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'System and software requirements',
        initCollapsed: true,
      },
    },
    {
      name: 'deployment',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h3', 'h4', 'h5'] }),
            FixedToolbarFeature(),
          ]
        },
      }),
      admin: {
        description: 'Deployment strategy and infrastructure',
      },
    },
    {
      name: 'performance',
      type: 'group',
      fields: [
        {
          name: 'loadTime',
          type: 'text',
          admin: {
            description: 'Page load time (e.g., "< 2s", "1.2s average")',
          },
        },
        {
          name: 'throughput',
          type: 'text',
          admin: {
            description: 'System throughput (e.g., "1000 req/s", "10k concurrent users")',
          },
        },
        {
          name: 'scalability',
          type: 'text',
          admin: {
            description: 'Scalability metrics (e.g., "Auto-scaling to 100 instances")',
          },
        },
        {
          name: 'uptime',
          type: 'text',
          admin: {
            description: 'Uptime/availability (e.g., "99.9%", "24/7")',
          },
        },
      ],
      admin: {
        description: 'Performance metrics and benchmarks',
      },
    },
  ],
  labels: {
    singular: 'Technical Specifications',
    plural: 'Technical Specifications',
  },
}
