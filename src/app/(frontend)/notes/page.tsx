import type { Metadata } from 'next'
import { PageHeader } from '@/components/patterns/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Notes | Sai Surya Rebbapragada',
  description: 'Quick thoughts, learnings, and insights on development and technology.',
}

export default function NotesPage() {
  return (
    <div className="container py-16">
      <PageHeader
        title="Notes"
        description="A space for my quick thoughts, learnings, and half-baked ideas."
      />

      <div className="mt-8">
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl">📝</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Still Brewing...</h3>
            <p className="text-muted-foreground mb-6">
              This section is under construction as I&apos;m setting up a system to share my notes.
              In the meantime, feel free to check out my projects.
            </p>
            <Button asChild>
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
