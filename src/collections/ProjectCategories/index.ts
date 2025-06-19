import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Category name (e.g., Web Application, Mobile App, API)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the project category',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Category color for UI (hex code, e.g., #3B82F6)',
      },
      validate: (val) => !val || /^#[0-9A-F]{6}$/i.test(val) || 'Must be a valid hex color code (e.g., #3B82F6)',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category icon (optional)',
      },
    },
    ...slugField(),
  ],
  timestamps: true,
}
