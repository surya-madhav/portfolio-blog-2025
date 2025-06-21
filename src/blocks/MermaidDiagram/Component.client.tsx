'use client'
import React, { useEffect, useRef } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/utilities/ui'
import { Loader2 } from 'lucide-react'

interface MermaidDiagramProps {
  diagramCode: string
  diagramType: string
  className?: string
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'none' | 'sm' | 'default' | 'lg'
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  diagramCode,
  diagramType,
  className,
  variant = 'default',
  padding = 'default',
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const themeHook = useTheme()
  const theme = themeHook?.theme ?? 'default'

  useEffect(() => {
    const renderMermaid = async () => {
      if (!mermaidRef.current || !diagramCode) return

      try {
        console.log('🚀 Starting render...')
        const mermaid = (await import('mermaid')).default

        // Theme-specific configurations with proper text contrast
        const themeVariables =
          theme === 'dark'
            ? {
                // Dark theme
                primaryColor: '#20808D',
                primaryTextColor: '#ffffff',
                primaryBorderColor: '#20808D',
                lineColor: '#A84B2F',
                secondaryColor: '#1FB8CD',
                tertiaryColor: '#374151',
                background: '#111827',
                mainBkg: '#1F2937',
                secondBkg: '#374151',
                tertiaryBkg: '#4B5563',
                textColor: '#F9FAFB',
                nodeBkg: '#1F2937',
                nodeTextColor: '#F9FAFB',
                edgeLabelBackground: '#1F2937',
                clusterBkg: '#374151',
                clusterTextColor: '#F9FAFB',
                // Additional edge styling
                edgeColor: '#A84B2F',
                arrowheadColor: '#A84B2F',
                darkMode: true,
              }
            : {
                // Light theme with proper contrast
                primaryColor: '#20808D',
                primaryTextColor: '#ffffff',
                primaryBorderColor: '#20808D',
                lineColor: '#944464',
                secondaryColor: '#1FB8CD',
                tertiaryColor: '#F3F4F6',
                background: '#ffffff',
                mainBkg: '#ffffff',
                secondBkg: '#F9FAFB',
                tertiaryBkg: '#F3F4F6',
                textColor: '#111827',
                nodeBkg: '#ffffff',
                nodeTextColor: '#111827',
                edgeLabelBackground: '#ffffff',
                clusterBkg: '#F9FAFB',
                clusterTextColor: '#111827',
                // Additional edge styling
                edgeColor: '#944464',
                arrowheadColor: '#944464',
                darkMode: false,
              }

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          themeVariables,
        })

        // Generate unique ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        console.log('🎯 Rendering with ID:', id)
        const { svg } = await mermaid.render(id, diagramCode)

        console.log('✅ Success, inserting SVG')
        mermaidRef.current.innerHTML = svg
      } catch (error) {
        console.error('❌ Error:', error)
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="flex items-center justify-center p-8 text-destructive">
              <div class="text-center space-y-2">
                <p class="text-sm font-medium">Failed to render diagram</p>
                <p class="text-xs text-muted-foreground">${error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            </div>
          `
        }
      }
    }

    renderMermaid()
  }, [diagramCode, theme])

  // Variant styles following Card component pattern
  const variants = {
    default: 'bg-card border border-border',
    elevated:
      'bg-card border border-border shadow-md hover:shadow-lg transition-shadow duration-200',
    outlined: 'bg-transparent border-2 border-border',
  }

  // Padding options following Card component pattern
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        // Base styles following design system
        'mermaid-container rounded-lg overflow-x-auto',
        // Variant styles
        variants[variant],
        // Padding
        paddings[padding],
        // Custom className
        className,
      )}
      role="img"
      aria-label={`${diagramType} diagram`}
    >
      <div ref={mermaidRef} className="min-h-[100px] flex items-center justify-center">
        {/* Loading state with design system styling */}
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading diagram...</span>
        </div>
      </div>
    </div>
  )
}
