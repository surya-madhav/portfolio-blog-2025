'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ExternalLink } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// TODO: Update navigation items to match your actual pages
type NavItem = {
  readonly label: string
  readonly href: string
  readonly type: 'internal' | 'cta'
  readonly attention?: boolean
}

const navigationItems: readonly NavItem[] = [
  { label: 'About Me', href: '#about', type: 'internal' },
  { label: 'Blog', href: '/posts', type: 'internal' },
  { label: 'Notes', href: '/notes', type: 'internal' }, // TODO: Create notes page
  { label: 'Projects', href: '/projects', type: 'internal', attention: true },
  { label: 'Contact Me', href: '#contact', type: 'cta' },
]

interface FloatingHeaderProps {
  className?: string
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle active section detection
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.6,
    })

    // Observe sections
    const sections = document.querySelectorAll('[id]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Main Floating Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-4 left-4 right-4 z-50 transition-all duration-300',
          isScrolled
            ? 'backdrop-blur-md bg-background/80 border border-border shadow-lg'
            : 'backdrop-blur-sm bg-background/40',
          className,
        )}
        style={{
          borderRadius: '12px',
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              {/* TODO: Replace with your actual name/logo */}
              Your Name
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = item.href.startsWith('#')
                  ? activeSection === item.href.substring(1)
                  : pathname === item.href

                if (item.type === 'cta') {
                  return (
                    <Button key={item.label} asChild size="sm" className="ml-4">
                      <Link href={item.href} onClick={() => handleNavClick(item.href)}>
                        {item.label}
                      </Link>
                    </Button>
                  )
                }

                return (
                  <div key={item.label} className="relative">
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                        'hover:bg-muted hover:text-foreground',
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.attention && (
                      <Badge
                        variant="default"
                        className="absolute -top-1 -right-1 scale-75 bg-primary text-primary-foreground"
                      >
                        New
                      </Badge>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden"
          >
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex flex-col items-center justify-center h-full space-y-8"
            >
              {navigationItems.map((item, index) => {
                const isActive = item.href.startsWith('#')
                  ? activeSection === item.href.substring(1)
                  : pathname === item.href

                return (
                  <motion.div
                    key={item.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        'text-2xl font-medium transition-colors',
                        item.type === 'cta'
                          ? 'text-primary'
                          : isActive
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary',
                      )}
                    >
                      {item.label}
                      {item.type === 'internal' && item.href.startsWith('/') && (
                        <ExternalLink className="inline-block ml-2 h-5 w-5" />
                      )}
                    </Link>
                    {item.attention && (
                      <Badge
                        variant="default"
                        className="absolute -top-2 -right-8 bg-primary text-primary-foreground"
                      >
                        New
                      </Badge>
                    )}
                  </motion.div>
                )
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
