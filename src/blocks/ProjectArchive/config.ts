import type { Block } from 'payload'
import { lexicalEditor, FixedToolbarFeature, HeadingFeature } from '@payloadcms/richtext-lexical'

export const ProjectArchive: Block = {
  slug: 'projectArchive',
  interfaceName: 'ProjectArchiveBlock',
  fields: [
    {
      name: 'introContent',
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
        description: 'Optional introduction content above the project listing',
      },
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
      admin: {
        description: 'How to populate the project archive',
      },
    },
    {
      name: 'relationTo',
      type: 'select',
      defaultValue: 'projects',
      options: [
        {
          label: 'Projects',
          value: 'projects',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'project-categories',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection' && siblingData?.relationTo === 'projects',
        description: 'Filter projects by categories',
      },
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection' && siblingData?.relationTo === 'projects',
        description: 'Filter projects by technologies',
      },
    },
    {
      name: 'projectStatus',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'all',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection' && siblingData?.relationTo === 'projects',
        description: 'Filter projects by status',
      },
    },
    {
      name: 'featuredOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection' && siblingData?.relationTo === 'projects',
        description: 'Show only featured projects',
      },
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 10,
      min: 1,
      max: 50,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'collection',
        description: 'Maximum number of projects to display',
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
        description: 'Select specific projects to display',
      },
    },
    {
      name: 'displayStyle',
      type: 'select',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'List',
          value: 'list',
        },
        {
          label: 'Cards',
          value: 'cards',
        },
      ],
      admin: {
        description: 'How to display the projects',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.displayStyle === 'grid' || siblingData?.displayStyle === 'cards',
        description: 'Number of columns for grid/cards layout',
      },
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show filtering interface above the project archive',
      },
    },
    {
      name: 'showPagination',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show pagination controls',
      },
    },
  ],
  labels: {
    singular: 'Project Archive',
    plural: 'Project Archives',
  },
}
