import type { Block } from 'payload'

export const MermaidDiagram: Block = {
  slug: 'mermaidDiagram',
  interfaceName: 'MermaidDiagramBlock',
  fields: [
    {
      name: 'diagramType',
      type: 'select',
      required: true,
      defaultValue: 'flowchart',
      options: [
        {
          label: 'Flowchart',
          value: 'flowchart',
        },
        {
          label: 'Sequence Diagram',
          value: 'sequence',
        },
        {
          label: 'Class Diagram',
          value: 'class',
        },
        {
          label: 'State Diagram',
          value: 'state',
        },
        {
          label: 'Entity Relationship',
          value: 'er',
        },
        {
          label: 'Gantt Chart',
          value: 'gantt',
        },
        {
          label: 'Git Graph',
          value: 'gitgraph',
        },
        {
          label: 'User Journey',
          value: 'journey',
        },
        {
          label: 'Pie Chart',
          value: 'pie',
        },
      ],
      admin: {
        description: 'Type of Mermaid diagram to render',
      },
    },
    {
      name: 'diagramCode',
      type: 'textarea',
      required: true,
      admin: {
        rows: 15,
        description: 'Mermaid diagram syntax. Visit mermaid.js.org for documentation.',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional title/caption for the diagram',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional explanation of the diagram',
      },
    },
  ],
  labels: {
    singular: 'Mermaid Diagram',
    plural: 'Mermaid Diagrams',
  },
}
