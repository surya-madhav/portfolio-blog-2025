import type { Block } from 'payload'

export const MediaGallery: Block = {
  slug: 'mediaGallery',
  interfaceName: 'MediaGalleryBlock',
  fields: [
    {
      name: 'media',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for the image',
          },
        },
        {
          name: 'alt',
          type: 'text',
          required: true,
          admin: {
            description: 'Alt text for accessibility',
          },
        },
      ],
      admin: {
        description: 'Images to display in the gallery',
        initCollapsed: true,
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid',
          value: 'grid',
        },
        {
          label: 'Carousel',
          value: 'carousel',
        },
        {
          label: 'Masonry',
          value: 'masonry',
        },
      ],
      admin: {
        description: 'How to display the images',
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
        condition: (_, siblingData) => siblingData?.layout === 'grid' || siblingData?.layout === 'masonry',
        description: 'Number of columns for grid/masonry layout',
      },
    },
    {
      name: 'showCaptions',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display image captions',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: '16:9', value: '16-9' },
        { label: '4:3', value: '4-3' },
        { label: '1:1', value: '1-1' },
        { label: '3:2', value: '3-2' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'grid',
        description: 'Aspect ratio for grid images',
      },
    },
  ],
  labels: {
    singular: 'Media Gallery',
    plural: 'Media Galleries',
  },
}
