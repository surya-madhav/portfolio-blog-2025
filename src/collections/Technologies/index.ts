import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'category', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Technology name (e.g., React, Node.js, PostgreSQL)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the technology',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Technology icon/logo (SVG preferred for best quality)',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Database', value: 'database' },
        { label: 'DevOps', value: 'devops' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Desktop', value: 'desktop' },
        { label: 'Cloud', value: 'cloud' },
        { label: 'AI/ML', value: 'ai-ml' },
        { label: 'Testing', value: 'testing' },
        { label: 'Tools', value: 'tools' },
      ],
      required: true,
      admin: {
        description: 'Category for organizing technologies',
      },
    },
    {
      name: 'officialWebsite',
      type: 'text',
      validate: (val) => !val || val.startsWith('http') || 'Must be a valid URL',
      admin: {
        description: 'Official website URL',
      },
    },
    {
      name: 'documentation',
      type: 'text',
      validate: (val) => !val || val.startsWith('http') || 'Must be a valid URL',
      admin: {
        description: 'Documentation URL',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Brand color for UI theming (hex code, e.g., #61DAFB)',
      },
      validate: (val) => !val || /^#[0-9A-F]{6}$/i.test(val) || 'Must be a valid hex color code (e.g., #61DAFB)',
    },
    ...slugField(),
  ],
  timestamps: true,
}
