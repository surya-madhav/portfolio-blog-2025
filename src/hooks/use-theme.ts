'use client'

import { useTheme as useNextTheme } from 'next-themes'

export const useTheme = () => {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  
  return {
    theme: theme as 'light' | 'dark' | 'system' | undefined,
    setTheme: (newTheme: 'light' | 'dark' | 'system' | null) => {
      if (newTheme === null) {
        setTheme('system')
      } else {
        setTheme(newTheme)
      }
    },
    resolvedTheme: resolvedTheme as 'light' | 'dark' | undefined
  }
}
