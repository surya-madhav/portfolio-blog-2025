'use client'

import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <div className={clsx('text-sm text-primary opacity-80 font-medium font-mono', className)}>
      rssmv.
    </div>
  )
}
