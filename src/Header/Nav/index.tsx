'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

import type { Header as HeaderType } from '@/payload-types'

interface NavigationItem {
  title: string
  href: string
  type: 'internal' | 'cta'
}

const navigationItems: NavigationItem[] = [
  { title: 'About Me', href: '#about', type: 'internal' },
  { title: 'Projects', href: '/projects', type: 'internal' },
  { title: 'Blog', href: '/posts', type: 'internal' },
  { title: 'Notes', href: '/notes', type: 'internal' },
  { title: 'Contact Me', href: '#contact', type: 'cta' },
]

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data: _data }) => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        about: document.getElementById('about')?.offsetTop,
        projects: document.getElementById('projects')?.offsetTop,
        contact: document.getElementById('contact')?.offsetTop,
      }

      const scrollPosition = window.scrollY + 100

      if (sections.contact && scrollPosition >= sections.contact) {
        setActiveSection('#contact')
      } else if (sections.projects && scrollPosition >= sections.projects) {
        setActiveSection('#projects')
      } else if (sections.about && scrollPosition >= sections.about) {
        setActiveSection('#about')
      } else {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavLinkClick = (href: string) => {
    setNavbarOpen(false)

    if (href.startsWith('#')) {
      const targetElement = document.querySelector(href)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex flex-row gap-6">
          {navigationItems.map((item, index) => {
            const isActive = item.href.startsWith('#')
              ? activeSection === item.href
              : pathname === item.href

            if (item.type === 'cta') {
              return (
                <li key={index}>
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.href.startsWith('#')) {
                          e.preventDefault()
                          handleNavLinkClick(item.href)
                        }
                      }}
                    >
                      {item.title}
                    </Link>
                  </Button>
                </li>
              )
            }

            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`block py-2 px-3 transition-colors ${
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  onClick={(e) => {
                    if (item.href.startsWith('#')) {
                      e.preventDefault()
                      handleNavLinkClick(item.href)
                    }
                  }}
                >
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="border border-border"
        >
          {navbarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {navbarOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border">
          <ul className="flex flex-col py-4 items-center space-y-4">
            {navigationItems.map((item, index) => {
              const isActive = item.href.startsWith('#')
                ? activeSection === item.href
                : pathname === item.href

              if (item.type === 'cta') {
                return (
                  <li key={index}>
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          if (item.href.startsWith('#')) {
                            e.preventDefault()
                            handleNavLinkClick(item.href)
                          }
                        }}
                      >
                        {item.title}
                      </Link>
                    </Button>
                  </li>
                )
              }

              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`block py-2 px-4 transition-colors ${
                      isActive
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        e.preventDefault()
                        handleNavLinkClick(item.href)
                      }
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}
