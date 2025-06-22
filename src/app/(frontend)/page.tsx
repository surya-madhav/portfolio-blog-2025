import type { Metadata } from 'next'
import { DotPattern } from '@/components/ui/patterns/dot-pattern'
import HeroSection from './components/portfolio/HeroSection'
import Projects from './components/portfolio/Projects'
import Skills from './components/portfolio/Skills'

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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Dot Pattern Background */}
      <DotPattern 
        width={28} 
        height={28} 
        cx={1.5}
        cy={1.5}
        cr={1.2}
        glow={true} 
        className="text-primary absolute inset-0 h-full w-full" 
      />
      
      {/* Main Content */}
      <main className="flex min-h-screen flex-col items-center relative z-10">
        {/* Hero/About Section */}
        <HeroSection />
        
        {/* Projects Section */}
        <Projects />
        
        {/* Skills Section */}
        <Skills />
        
        {/* Contact Section Anchor */}
        <div id="contact" className="h-px" />
      </main>
    </div>
  )
}