import React from 'react'
import { MermaidDiagram } from './Component.client'

export type MermaidDiagramProps = {
  diagramType: string
  diagramCode: string
  title?: string
  description?: string
  blockType: 'mermaidDiagram'
}

type Props = MermaidDiagramProps & {
  className?: string
}

export const MermaidDiagramBlock: React.FC<Props> = ({
  className,
  diagramCode,
  diagramType,
  title,
  description,
}) => {
  return (
    <div className={[className, 'not-prose'].filter(Boolean).join(' ')}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      {description && (
        <div className="mb-6">
          <p className="text-muted-foreground">{description}</p>
        </div>
      )}
      <MermaidDiagram diagramCode={diagramCode} diagramType={diagramType} />
    </div>
  )
}
