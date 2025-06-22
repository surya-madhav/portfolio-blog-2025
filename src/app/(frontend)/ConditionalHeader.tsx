'use client'

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import Header with no SSR to avoid server-side dependencies in client
const Header = dynamic(() => import('@/Header/Component').then(mod => ({ default: mod.Header })), {
  ssr: false,
  loading: () => (
    <div className="container relative z-20">
      <div className="py-8 flex justify-between">
        <div className="w-24 h-8 bg-muted animate-pulse rounded" />
        <div className="w-32 h-8 bg-muted animate-pulse rounded" />
      </div>
    </div>
  )
})

export const ConditionalHeader: React.FC = () => {
  const pathname = usePathname()
  
  // Hide regular header on homepage since we use floating header there
  if (pathname === '/') {
    return null
  }
  
  return <Header />
}