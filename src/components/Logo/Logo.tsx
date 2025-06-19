'use client'

import clsx from 'clsx'
import React from 'react'
import { useTheme } from '@/hooks/use-theme'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  // Use a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={clsx('max-w-[9.375rem] w-full h-[34px]', className)} />
    )
  }

  const logoSrc = resolvedTheme === 'dark' 
    ? 'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg'
    : 'https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-dark.svg'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[34px]', className)}
      src={logoSrc}
    />
  )
}
