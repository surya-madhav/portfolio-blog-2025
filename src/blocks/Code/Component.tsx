import React from 'react'

import { Code } from './Component.client'

export type CodeBlockProps = {
  code: string
  language?: string
  filename?: string
  highlightLines?: string
  description?: string
  blockType: 'code'
}

type Props = CodeBlockProps & {
  className?: string
}

export const CodeBlock: React.FC<Props> = ({ className, code, language, filename, highlightLines, description }) => {
  return (
    <div className={[className, 'not-prose'].filter(Boolean).join(' ')}>
      {description && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      <Code code={code} language={language} filename={filename} highlightLines={highlightLines} />
    </div>
  )
}
