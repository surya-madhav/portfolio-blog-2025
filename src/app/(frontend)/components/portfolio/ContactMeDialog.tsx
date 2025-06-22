'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/hooks/use-toast'
import { Github, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useState } from 'react'

export function ContactMeDialog({ trigger }: { trigger?: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    message: '',
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically submit to your contact form endpoint
    console.log('Form submitted:', formData)

    // Show a success toast
    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out. I'll get back to you soon.",
    })

    setIsOpen(false)
    setFormData({ email: '', message: '' })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-md bg-gradient-to-r from-primary to-accent px-6 py-3 hover:from-primary/90 hover:to-accent/90 sm:w-fit">
            Contact Me
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Get in Touch</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Fill out the form below to send me a message.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
              />
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <Link
                className="text-muted-foreground transition-colors hover:text-primary"
                href="https://twitter.com/saisuryamadhava"
                target="_blank"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                className="text-muted-foreground transition-colors hover:text-primary"
                href="https://www.linkedin.com/in/saisuryamadhav/"
                target="_blank"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                className="text-muted-foreground transition-colors hover:text-primary"
                href="https://github.com/saisuryamadhav"
                target="_blank"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <DialogFooter className="items-center justify-center sm:justify-center">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Send Message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
