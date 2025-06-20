import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        {
          label: 'TypeScript',
          value: 'typescript',
        },
        {
          label: 'JavaScript',
          value: 'javascript',
        },
        {
          label: 'Python',
          value: 'python',
        },
        {
          label: 'Java',
          value: 'java',
        },
        {
          label: 'C++',
          value: 'cpp',
        },
        {
          label: 'C#',
          value: 'csharp',
        },
        {
          label: 'Go',
          value: 'go',
        },
        {
          label: 'Rust',
          value: 'rust',
        },
        {
          label: 'PHP',
          value: 'php',
        },
        {
          label: 'Ruby',
          value: 'ruby',
        },
        {
          label: 'Swift',
          value: 'swift',
        },
        {
          label: 'Kotlin',
          value: 'kotlin',
        },
        {
          label: 'SQL',
          value: 'sql',
        },
        {
          label: 'HTML',
          value: 'html',
        },
        {
          label: 'CSS',
          value: 'css',
        },
        {
          label: 'SCSS',
          value: 'scss',
        },
        {
          label: 'JSON',
          value: 'json',
        },
        {
          label: 'YAML',
          value: 'yaml',
        },
        {
          label: 'XML',
          value: 'xml',
        },
        {
          label: 'Markdown',
          value: 'markdown',
        },
        {
          label: 'Bash',
          value: 'bash',
        },
        {
          label: 'PowerShell',
          value: 'powershell',
        },
        {
          label: 'Docker',
          value: 'dockerfile',
        },
      ],
    },
    {
      name: 'filename',
      type: 'text',
      admin: {
        description: 'Optional filename to display (e.g., "app.tsx", "config.json")',
      },
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
    {
      name: 'highlightLines',
      type: 'text',
      admin: {
        description: 'Comma-separated line numbers to highlight (e.g., "1,3,5-7")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description or explanation of the code',
      },
    },
  ],
}
