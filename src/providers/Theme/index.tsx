'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '@/hooks/use-theme'

type Props = {
  diagramCode: string
  diagramType: string
}

export const MermaidDiagram: React.FC<Props> = ({ diagramCode, diagramType }) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const renderCountRef = useRef(0)
  const hasRenderedRef = useRef(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const themeHook = useTheme()

  // Fallback for undefined theme
  const theme = themeHook?.theme ?? 'default'

  console.log('🔍 MermaidDiagram render:', {
    renderCount: renderCountRef.current,
    mounted,
    isLoading,
    error: !!error,
    theme,
    themeHookResult: themeHook,
    diagramCode: diagramCode.substring(0, 50) + '...',
    diagramType,
    hasRendered: hasRenderedRef.current,
  })

  const getMermaidThemeConfig = useCallback((currentTheme: string) => {
    const isDark = currentTheme === 'dark'

    if (isDark) {
      return {
        theme: 'dark' as const,
        themeVariables: {
          primaryColor: '#20808D',
          primaryTextColor: '#FEFEFE',
          primaryBorderColor: '#1FB8CD',
          lineColor: '#9CA3AF',
          secondaryColor: '#0C2B33',
          tertiaryColor: '#1A6B73',
          background: '#0A0F0F',
          mainBkg: '#111827',
          secondBkg: '#1F2937',
          tertiaryBkg: '#374151',
        },
      }
    } else {
      return {
        theme: 'default' as const,
        themeVariables: {
          primaryColor: '#20808D',
          primaryTextColor: '#0A0F0F',
          primaryBorderColor: '#1FB8CD',
          lineColor: '#6B7280',
          secondaryColor: '#F3F4F6',
          tertiaryColor: '#218B94',
          background: '#FEFEFE',
          mainBkg: '#FFFFFF',
          secondBkg: '#F9FAFB',
          tertiaryBkg: '#F3F4F6',
        },
      }
    }
  }, [])

  const renderDiagram = useCallback(async () => {
    // Prevent multiple renders of the same content
    if (hasRenderedRef.current) {
      console.log('⏭️ Already rendered, skipping...')
      return
    }

    renderCountRef.current += 1
    const currentRender = renderCountRef.current

    console.log('🎨 Starting renderDiagram:', {
      renderAttempt: currentRender,
      diagramCode: !!diagramCode,
      elementRef: !!elementRef.current,
      mounted,
      theme,
      hasRendered: hasRenderedRef.current,
    })

    if (!diagramCode || !elementRef.current || !mounted) {
      console.log('⚠️ Skipping render - missing requirements:', {
        diagramCode: !!diagramCode,
        elementRef: !!elementRef.current,
        mounted,
      })
      return
    }

    try {
      console.log('🚀 Setting loading state...')
      setIsLoading(true)
      setError(null)

      console.log('📦 Importing mermaid...')
      const mermaid = (await import('mermaid')).default
      console.log('✅ Mermaid imported successfully')

      const themeConfig = getMermaidThemeConfig(theme)
      console.log('🎨 Theme config:', themeConfig)

      console.log('⚙️ Initializing mermaid...')
      mermaid.initialize({
        startOnLoad: false,
        fontFamily: 'Space Grotesk, system-ui, sans-serif',
        ...themeConfig,
      })
      console.log('✅ Mermaid initialized')

      console.log('🧹 Clearing previous content...')
      elementRef.current.innerHTML = ''

      const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      console.log('🆔 Generated ID:', id)

      console.log('🎯 Rendering diagram with code:', diagramCode.substring(0, 100))
      const { svg } = await mermaid.render(id, diagramCode)
      console.log('✅ Diagram rendered, SVG length:', svg.length)

      if (elementRef.current) {
        console.log('📋 Inserting SVG into DOM...')
        elementRef.current.innerHTML = svg

        const svgElement = elementRef.current.querySelector('svg')
        if (svgElement) {
          svgElement.style.maxWidth = '100%'
          svgElement.style.height = 'auto'
          console.log('🎨 Applied SVG styling')
        }

        hasRenderedRef.current = true
      }

      console.log('✅ Render complete, setting loading false')
      setIsLoading(false)
    } catch (err) {
      console.error('❌ Mermaid rendering error:', err)
      setError(err instanceof Error ? err.message : 'Failed to render diagram')
      setIsLoading(false)
    }
  }, [diagramCode, theme, getMermaidThemeConfig, mounted])

  // Mount detection
  useEffect(() => {
    console.log('🏗️ Component mounting...')
    setMounted(true)
    return () => {
      console.log('🏗️ Component unmounting...')
      hasRenderedRef.current = false
    }
  }, [])

  // Reset render state when diagram code changes
  useEffect(() => {
    console.log('🔄 Diagram code changed, resetting render state')
    hasRenderedRef.current = false
    setIsLoading(true)
    setError(null)
  }, [diagramCode])

  // Single render effect
  useEffect(() => {
    if (mounted && diagramCode && !hasRenderedRef.current) {
      console.log('🚀 Conditions met, scheduling render...')

      const timeoutId = setTimeout(() => {
        if (elementRef.current) {
          console.log('✅ Element ref available, starting render')
          renderDiagram()
        } else {
          console.log('❌ Element ref not available after timeout')
        }
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [mounted, diagramCode, renderDiagram])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span className="text-sm text-muted-foreground">Loading diagram...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-destructive/50 bg-destructive/10 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-destructive mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <h4 className="text-sm font-medium text-destructive">Diagram Error</h4>
        </div>
        <p className="text-sm text-destructive/80 font-mono mb-2">{error}</p>
        <details className="group">
          <summary className="text-sm text-destructive/70 cursor-pointer hover:text-destructive transition-colors list-none">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1 transform transition-transform group-open:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Show diagram code
            </div>
          </summary>
          <pre className="mt-2 text-xs bg-destructive/5 border border-destructive/20 p-3 rounded overflow-x-auto">
            <code>{diagramCode}</code>
          </pre>
        </details>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 border border-border rounded-lg bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span className="text-sm text-muted-foreground">Rendering diagram...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mermaid-container border border-border rounded-lg p-6 bg-card overflow-x-auto">
      <div
        ref={elementRef}
        className="mermaid-diagram flex justify-center"
        style={{ minHeight: '100px' }}
      />
    </div>
  )
}
