"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  title: string
  code: string
  language?: string
}

function CodeBlock({ title, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast({
      description: "Code copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={copyToClipboard}
          className="h-6 w-6"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  )
}

export function CheatSheet() {
  const componentExamples = [
    {
      title: "Basic Button",
      code: `<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>`
    },
    {
      title: "Button with Icon",
      code: `<Button>
  <Search className="mr-2 h-4 w-4" />
  Search
</Button>`
    },
    {
      title: "Card Layout",
      code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`
    },
    {
      title: "Form Field",
      code: `<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="email@example.com" />
</div>`
    }
  ]

  const colorExamples = [
    {
      title: "Brand Colors",
      code: `bg-perplexity-true-turquoise
bg-perplexity-plex-blue
bg-perplexity-peacock
text-perplexity-true-turquoise`
    },
    {
      title: "System Colors",
      code: `bg-primary text-primary-foreground
bg-secondary text-secondary-foreground
bg-accent text-accent-foreground
bg-muted text-muted-foreground`
    },
    {
      title: "Gradient Examples",
      code: `bg-gradient-to-r from-perplexity-true-turquoise to-perplexity-plex-blue
bg-gradient-to-br from-primary to-accent`
    }
  ]

  const layoutExamples = [
    {
      title: "Grid Layouts",
      code: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
grid grid-cols-4 lg:grid-cols-12 gap-6
grid grid-cols-1 lg:grid-cols-4 gap-4`
    },
    {
      title: "Flexbox Utilities",
      code: `flex items-center justify-between
flex flex-col space-y-4
flex flex-wrap gap-4`
    },
    {
      title: "Spacing System",
      code: `space-y-4  // Vertical spacing
space-x-4  // Horizontal spacing
gap-4      // Grid/flex gap
p-6       // Padding
m-4       // Margin`
    }
  ]

  const typographyExamples = [
    {
      title: "Typography Scale",
      code: `text-display  // 3.815rem
text-h1      // 3.052rem
text-h2      // 2.441rem
text-h3      // 1.953rem
text-h4      // 1.563rem
text-body    // 1rem
text-small   // 0.8rem`
    },
    {
      title: "Font Weights",
      code: `font-light    // 300
font-normal   // 400
font-medium   // 500
font-semibold // 600
font-bold     // 700`
    },
    {
      title: "Special Effects",
      code: `gradient-text // Gradient text effect
font-mono     // Space Mono font
tracking-tight // Letter spacing`
    }
  ]

  const animationExamples = [
    {
      title: "Framer Motion Basics",
      code: `<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>`
    },
    {
      title: "Hover Animations",
      code: `<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive element
</motion.div>`
    },
    {
      title: "Stagger Children",
      code: `const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}`
    }
  ]

  const responsiveExamples = [
    {
      title: "Responsive Grid",
      code: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
    },
    {
      title: "Responsive Text",
      code: `text-sm md:text-base lg:text-lg
text-2xl md:text-3xl lg:text-4xl`
    },
    {
      title: "Responsive Spacing",
      code: `p-4 md:p-6 lg:p-8
space-y-4 md:space-y-6 lg:space-y-8`
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-6">Developer Cheat Sheet</h3>
        <p className="text-muted-foreground mb-8">
          Quick reference guide for common patterns, utilities, and code snippets
          used throughout the design system.
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline">Copy & Paste Ready</Badge>
          <Badge variant="outline">TypeScript</Badge>
          <Badge variant="outline">Tailwind CSS</Badge>
          <Badge variant="outline">Framer Motion</Badge>
        </div>
      </div>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-6">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
          <TabsTrigger value="responsive">Responsive</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {componentExamples.map((example, index) => (
              <CodeBlock key={index} {...example} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {colorExamples.map((example, index) => (
              <CodeBlock key={index} {...example} language="css" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {layoutExamples.map((example, index) => (
              <CodeBlock key={index} {...example} language="css" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {typographyExamples.map((example, index) => (
              <CodeBlock key={index} {...example} language="css" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="animations" className="space-y-4">
          <div className="space-y-4">
            {animationExamples.map((example, index) => (
              <CodeBlock key={index} {...example} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responsive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {responsiveExamples.map((example, index) => (
              <CodeBlock key={index} {...example} language="css" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Quick Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h5 className="font-semibold mb-2">Design Tokens</h5>
            <p className="text-sm text-muted-foreground">
              Always use semantic color names (primary, secondary) instead of specific colors (blue, red)
            </p>
          </Card>
          <Card className="p-4">
            <h5 className="font-semibold mb-2">Responsive Design</h5>
            <p className="text-sm text-muted-foreground">
              Use mobile-first approach: base styles, then sm:, md:, lg:, xl: modifiers
            </p>
          </Card>
          <Card className="p-4">
            <h5 className="font-semibold mb-2">Accessibility</h5>
            <p className="text-sm text-muted-foreground">
              Include proper ARIA labels, maintain focus states, and ensure color contrast
            </p>
          </Card>
          <Card className="p-4">
            <h5 className="font-semibold mb-2">Performance</h5>
            <p className="text-sm text-muted-foreground">
              Use framer-motion sparingly, prefer CSS transitions for simple animations
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
