'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'
import { CopyButton } from './CopyButton'

type Props = {
  code: string
  language?: string
  filename?: string
  highlightLines?: string
}

export const Code: React.FC<Props> = ({ code, language = '', filename, highlightLines }) => {
  if (!code) return null

  // Parse highlighted lines
  const parseHighlightLines = (lines: string): number[] => {
    if (!lines) return []

    const result: number[] = []
    const parts = lines.split(',')

    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-')
        const start = startStr ? parseInt(startStr.trim()) : NaN
        const end = endStr ? parseInt(endStr.trim()) : NaN
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            result.push(i)
          }
        }
      } else {
        const num = parseInt(trimmed)
        if (!isNaN(num)) {
          result.push(num)
        }
      }
    }

    return result
  }

  const highlightedLines = parseHighlightLines(highlightLines || '')

  return (
    <div className="relative">
      {filename && (
        <div className="bg-muted border border-b-0 border-border rounded-t px-4 py-2">
          <span className="text-sm font-mono text-muted-foreground">{filename}</span>
        </div>
      )}
      <Highlight code={code} language={language} theme={themes.vsDark}>
        {({ getLineProps, getTokenProps, tokens }) => (
          <pre
            className={`bg-black p-4 border text-xs border-border overflow-x-auto ${filename ? 'rounded-b rounded-t-none' : 'rounded'}`}
          >
            {tokens.map((line, i) => {
              const lineNumber = i + 1
              const isHighlighted = highlightedLines.includes(lineNumber)
              return (
                <div
                  key={i}
                  {...getLineProps({
                    className: `table-row ${isHighlighted ? 'bg-yellow-500/10 border-l-2 border-yellow-500' : ''}`,
                    line,
                  })}
                >
                  <span className="table-cell select-none text-right text-white/25 pr-4">
                    {lineNumber}
                  </span>
                  <span className={`table-cell ${isHighlighted ? 'pl-2' : 'pl-4'}`}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              )
            })}
            <CopyButton code={code} />
          </pre>
        )}
      </Highlight>
    </div>
  )
}
