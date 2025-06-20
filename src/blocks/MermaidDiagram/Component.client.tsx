'use client'
import { useEffect, useRef, useState } from 'react'

type Props = {
  diagramCode: string
  diagramType: string
}

export const MermaidDiagram: React.FC<Props> = ({ diagramCode, diagramType }) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!diagramCode || !elementRef.current) return

      try {
        setIsLoading(true)
        setError(null)

        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import('mermaid')).default

        // Initialize mermaid with configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#3b82f6',
            primaryTextColor: '#ffffff',
            primaryBorderColor: '#1e40af',
            lineColor: '#6b7280',
            secondaryColor: '#1f2937',
            tertiaryColor: '#374151',
            background: '#000000',
            mainBkg: '#111827',
            secondBkg: '#1f2937',
            tertiaryBkg: '#374151',
          },
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        })

        // Clear previous content
        elementRef.current.innerHTML = ''

        // Generate unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg } = await mermaid.render(id, diagramCode)

        if (elementRef.current) {
          elementRef.current.innerHTML = svg
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
        setIsLoading(false)
      }
    }

    renderDiagram()
  }, [diagramCode, diagramType])

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Diagram Error</h4>
        </div>
        <p className="text-sm text-red-700 dark:text-red-300 font-mono">{error}</p>
        <details className="mt-2">
          <summary className="text-sm text-red-600 dark:text-red-400 cursor-pointer hover:text-red-800 dark:hover:text-red-200">
            Show diagram code
          </summary>
          <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900 p-2 rounded overflow-x-auto">
            {diagramCode}
          </pre>
        </details>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Rendering diagram...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mermaid-container border border-border rounded-lg p-4 bg-black overflow-x-auto">
      <div ref={elementRef} className="mermaid-diagram" />
    </div>
  )
}
