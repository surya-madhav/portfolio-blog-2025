import type { Block } from 'payload'

export const ProjectMetrics: Block = {
  slug: 'projectMetrics',
  interfaceName: 'ProjectMetricsBlock',
  fields: [
    {
      name: 'metrics',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Metric label (e.g., "Performance Score", "Bundle Size")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Metric value (e.g., "95", "2.3MB", "< 1s")',
          },
        },
        {
          name: 'unit',
          type: 'text',
          admin: {
            description: 'Unit or suffix (e.g., "%", "ms", "MB", "users")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional description explaining the metric',
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional icon for the metric',
          },
        },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Red', value: 'red' },
            { label: 'Purple', value: 'purple' },
            { label: 'Pink', value: 'pink' },
            { label: 'Gray', value: 'gray' },
          ],
          admin: {
            description: 'Color theme for the metric',
          },
        },
      ],
      admin: {
        description: 'Key project metrics to display',
        initCollapsed: true,
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'cards',
      options: [
        {
          label: 'Cards',
          value: 'cards',
        },
        {
          label: 'List',
          value: 'list',
        },
        {
          label: 'Grid',
          value: 'grid',
        },
      ],
      admin: {
        description: 'How to display the metrics',
      },
    },
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Project Metrics',
      admin: {
        description: 'Section title',
      },
    },
  ],
  labels: {
    singular: 'Project Metrics',
    plural: 'Project Metrics',
  },
}
