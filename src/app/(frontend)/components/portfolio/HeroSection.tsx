'use client'

import React from 'react'
import Spline from '@splinetool/react-spline'

import { ContactMeDialog } from './ContactMeDialog'
import { DownloadButton } from './DownloadButton'

// Dynamically import Spline to avoid SSR issues

const HeroSection = () => {
  return (
    <section id="about" className="container mx-auto py-4 px-4 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="col-span-7 flex flex-col space-y-4">
          <h1 className="text-4xl font-bold leading-tight text-foreground">
            Hello, I&apos;m
            <br />
            <span className="gradient-text">Sai Surya Rebbapragada</span>
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="inline-block border border-primary px-3 py-1 rounded-full text-sm font-medium">
              Data Systems Engineer
            </span>
            <span className="inline-block border border-primary px-3 py-1 rounded-full text-sm font-medium">
              Full-Stack Developer
            </span>
            <span className="inline-block border border-primary px-3 py-1 rounded-full text-sm font-medium">
              Distributed Systems Architect
            </span>
            <span className="inline-block border border-primary px-3 py-1 rounded-full text-sm font-medium">
              Generative AI Engineer
            </span>
            <span className="inline-block border border-primary px-3 py-1 rounded-full text-sm font-medium">
              DevOps & MLOps Specialist
            </span>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl">
            I design and implement high-performance data pipelines and scalable architectures
            processing millions of events daily. Skilled in Airflow, Snowflake, DBT, AWS, GCP, and
            modern web technologies (React, Next.js, Node.js). Passionate about Generative AI and
            delivering production-grade solutions. Seeking new opportunities to drive innovation and
            impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <ContactMeDialog />
            <DownloadButton />
          </div>
        </div>
        <div className="col-span-5 flex items-center justify-center mt-6 lg:mt-0">
          {/* Interactive 3D Spline Scene */}
          <div className="relative w-full max-w-lg h-96 lg:h-[500px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-background/5 backdrop-blur-sm border border-muted shadow-2xl">
              <Spline
                scene="https://prod.spline.design/ZFQi0Ry3lSZrD4HR/scene.splinecode"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '1rem',
                }}
                onLoad={() => {
                  console.log('Spline scene loaded successfully')
                }}
                onError={(error) => {
                  console.error('Error loading Spline scene:', error)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
