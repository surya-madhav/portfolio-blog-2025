'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import React from 'react'

export function DownloadButton() {
  const handleDownloadResume = () => {
    window.location.href = '/Sai-Surya-Rebbapragada-Resume.pdf'
  }

  return (
    <Button
      variant="outline"
      className="mt-4 rounded-md border border-primary px-6 py-3 hover:text-primary sm:mt-0 sm:w-fit md:ml-4"
      onClick={handleDownloadResume}
    >
      <Download className="mr-2 h-4 w-4" />
      Download Resume
    </Button>
  )
}
