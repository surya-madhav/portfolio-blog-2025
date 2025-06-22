'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Code, Lightbulb, Coffee, MapPin, Calendar, Download, Mail } from 'lucide-react'
import Link from 'next/link'

// TODO: Replace with your actual skills and information
const skills = [
  'React & Next.js',
  'TypeScript',
  'Node.js',
  'Python',
  'PostgreSQL',
  'AWS',
  'Docker',
  'GraphQL',
]

const stats = [
  { icon: Calendar, label: 'Years Experience', value: '5+' },
  { icon: Code, label: 'Projects Completed', value: '20+' },
  { icon: Coffee, label: 'Cups of Coffee', value: '1000+' },
  { icon: Lightbulb, label: 'Ideas Realized', value: '50+' },
]

// Animation variants
const containerAnimations: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemAnimations: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24">
      <div className="container">
        <motion.div
          variants={containerAnimations}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemAnimations} className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                About Me
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Meet Your Developer
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {/* TODO: Replace with your actual introduction */}
              Passionate about creating digital solutions that make a difference. Let&apos;s build
              something amazing together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - About Content */}
            <motion.div variants={itemAnimations} className="space-y-8">
              <Card className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">Hi, I&apos;m [Your Name]</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>[Your Location]</span> {/* TODO: Add your location */}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      {/* TODO: Replace with your actual story */}
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                      nostrud exercitation ullamco laboris.
                    </p>

                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                      in culpa qui officia deserunt mollit anim.
                    </p>

                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg">
                      <Link href="#contact" className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Get In Touch
                      </Link>
                    </Button>

                    <Button variant="outline" size="lg" className="inline-flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Resume {/* TODO: Add actual resume link */}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Skills */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Core Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, _index) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {/* TODO: Update skills with your actual technology stack */}
              </Card>
            </motion.div>

            {/* Right Column - Stats & Visual */}
            <motion.div variants={itemAnimations} className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div key={stat.label} variants={itemAnimations} custom={index}>
                      <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Additional Info Card */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold">What I Bring</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Full-stack development expertise with modern technologies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Strong focus on user experience and performance optimization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Collaborative approach with cross-functional teams</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Continuous learning mindset and adaptation to new technologies</span>
                    </li>
                  </ul>
                  {/* TODO: Update these points with your actual strengths */}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
