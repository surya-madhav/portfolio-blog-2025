import React from 'react'
import { ContactMeDialog } from './ContactMeDialog'
import { DownloadButton } from './DownloadButton'

const HeroSection = () => {
  return (
    <section id="about" className="container mx-auto py-4 px-4 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="col-span-7 place-self-center flex flex-col">
          <h1 className="text-foreground text-center lg:text-start">
            Hello, I&apos;m
            <br />
            <span className="gradient-text">Sai Surya Rebbapragada</span>
            <div className="text-center lg:text-start mb-1">
              <span className="inline-block border border-primary text-foreground px-3 py-1 rounded-full text-sm mr-2">
                Full Stack Web Developer
              </span>
              <span className="inline-block border border-primary text-foreground px-3 py-1 rounded-full text-sm mr-2">
                Front End Developer
              </span>
              <span className="inline-block border border-primary text-foreground px-3 py-1 rounded-full text-sm mr-2">
                Generative AI Engineer
              </span>
              <span className="inline-block border border-primary text-foreground px-3 py-1 rounded-full text-sm mr-2">
                Backend Systems Architect
              </span>
              <span className="inline-block border border-primary text-foreground px-3 py-1 rounded-full text-sm mr-2">
                DevOps Engineer
              </span>
            </div>
          </h1>
          <p className="text-muted-foreground text-center lg:text-left">
            I&apos;m a full-stack developer with 3 years working experience at high velocity fintech
            startups. I specialize in building robust, scalable web applications and websites. I
            have a deep passion for product design and development, and I consistently use a
            user-centric approach to drive innovation and streamline user experiences. I am
            currently looking for new opportunities to work on exciting projects.
          </p>
          <div className="flex flex-col mt-4 w-full lg:text-left flex-1 sm:justify-center sm:flex-row lg:justify-start md:flex-row px-8 sm:px-0">
            <ContactMeDialog />
            <DownloadButton />
          </div>
        </div>
        <div className="col-span-5">
          <div className="w-full h-full flex items-center justify-center place-self-center mt-4 lg:mt-0 mb-6">
            {/* Placeholder for profile image */}
            <div className="rounded-full w-72 h-72 bg-muted shadow-lg border border-primary flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-2">👨‍💻</div>
                <div className="text-sm">Profile Image</div>
                <div className="text-xs">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
