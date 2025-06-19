import React from 'react'
import { HeaderThemeProvider } from './HeaderTheme'
import { EnhancedThemeProvider } from './EnhancedTheme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <EnhancedThemeProvider>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </EnhancedThemeProvider>
  )
}
