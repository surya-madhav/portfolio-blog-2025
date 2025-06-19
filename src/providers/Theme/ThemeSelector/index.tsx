'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@/hooks/use-theme'

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Select disabled>
        <SelectTrigger
          aria-label="Select a theme"
          className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
        >
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select onValueChange={(value) => setTheme(value as any)} value={theme || 'system'}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="system">Auto</SelectItem>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  )
}
