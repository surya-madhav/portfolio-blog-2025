import type { Metadata } from 'next'
import HeroSection from './components/portfolio/HeroSection'
import Projects from './components/portfolio/Projects'
import Skills from './components/portfolio/Skills'
import { HeroBackground } from './components/portfolio/HeroBackground'
import { DotPatternWrapper } from '@/components/ui/patterns/dot-pattern-wrapper'

export const metadata: Metadata = {
  title: 'Sai Surya Rebbapragada | Portfolio',
  description: 'Full-stack developer with 3 years working experience at high velocity fintech startups.',
  openGraph: {
    title: 'Sai Surya Rebbapragada | Portfolio',
    description: 'Full-stack developer specializing in robust, scalable web applications.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@surya_madhav_',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Full-viewport Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image/Video */}
        <HeroBackground />
        
        {/* Hero Content */}
        <div className="relative z-10 h-full">
          <HeroSection />
        </div>
      </section>
      
      {/* Rest of the page content with dot pattern */}
      <DotPatternWrapper className="bg-background">
        <main className="relative z-20">
          {/* Projects Section */}
          <Projects />
          
          {/* Skills Section */}
          <Skills />
          
          {/* Contact Section Anchor */}
          <div id="contact" className="h-px" />
        </main>
      </DotPatternWrapper>
    </>
  )
}