"use client"

import { useState } from "react"
// import { motion } from "framer-motion" // Not used in this component
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Search, AlertCircle, Info } from "lucide-react"

interface ComponentSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

function ComponentSection({ title, description, children }: ComponentSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-6 border rounded-lg bg-background">{children}</div>
    </div>
  )
}

export function ComponentsGallery() {
  const [progress, setProgress] = useState(13)
  const [sliderValue, setSliderValue] = useState([50])
  const [switchState, setSwitchState] = useState(false)
  const { toast } = useToast()

  // Simulate progress
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-6">Component Library</h3>
        <p className="text-muted-foreground mb-8">
          A comprehensive collection of components built with shadcn/ui, 
          styled to match the Perplexity design language.
        </p>
      </div>

      {/* Buttons Section */}
      <ComponentSection
        title="Buttons"
        description="Various button styles and states"
      >
        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="info">Info</Button>
          <Button variant="brand">Brand</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button>
            <Search className="mr-2 h-4 w-4" />
            With Icon
          </Button>
        </div>
      </ComponentSection>

      {/* Cards Section */}
      <ComponentSection
        title="Cards"
        description="Content containers with various layouts"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content can include any component or text.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Action</Button>
            </CardFooter>
          </Card>
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>With enhanced shadow on hover</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has an elevated variant with hover effects.</p>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardHeader>
              <CardTitle>Outlined Card</CardTitle>
              <CardDescription>With prominent border</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card uses the outlined variant style.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-perplexity-true-turquoise to-perplexity-plex-blue text-white">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription className="text-white/80">
                With custom gradient background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Eye-catching card variant for special content.</p>
            </CardContent>
          </Card>
        </div>
      </ComponentSection>

      <Separator className="my-8" />

      {/* Badges Section */}
      <ComponentSection
        title="Badges"
        description="Labels and status indicators"
      >
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge className="bg-perplexity-true-turquoise text-white">Custom</Badge>
          <Badge className="bg-gradient-to-r from-perplexity-true-turquoise to-perplexity-plex-blue text-white">
            Gradient
          </Badge>
        </div>
      </ComponentSection>

      <Separator className="my-8" />

      {/* Alerts Section */}
      <ComponentSection
        title="Alerts"
        description="Contextual feedback messages"
      >
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert with an icon and description.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-perplexity-true-turquoise/50 bg-perplexity-true-turquoise/10">
            <Info className="h-4 w-4 text-perplexity-true-turquoise" />
            <AlertTitle>Info Alert</AlertTitle>
            <AlertDescription>
              Custom styled alert for informational messages.
            </AlertDescription>
          </Alert>
        </div>
      </ComponentSection>

      <Separator className="my-8" />

      {/* Form Controls Section */}
      <ComponentSection
        title="Form Controls"
        description="Input elements and form components"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Ask a question..." className="pl-8" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms" className="cursor-pointer">
              Accept terms and conditions
            </Label>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable notifications</Label>
            <Switch 
              id="notifications" 
              checked={switchState}
              onCheckedChange={setSwitchState}
            />
          </div>

          <div className="space-y-2">
            <Label>Volume</Label>
            <Slider 
              value={sliderValue} 
              onValueChange={setSliderValue}
              max={100} 
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">Value: {sliderValue[0]}</p>
          </div>
        </div>
      </ComponentSection>

      <Separator className="my-8" />

      {/* Progress & Loading Section */}
      <ComponentSection
        title="Progress & Loading"
        description="Loading states and progress indicators"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </ComponentSection>

      <Separator className="my-8" />

      {/* Avatars Section */}
      <ComponentSection
        title="Avatars"
        description="User representation components"
      >
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          
          <Avatar>
            <AvatarFallback className="bg-perplexity-true-turquoise text-white">
              PX
            </AvatarFallback>
          </Avatar>
          
          <Avatar className="h-16 w-16">
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
        </div>
      </ComponentSection>

      {/* Toast Demo */}
      <ComponentSection
        title="Toast Notifications"
        description="Temporary notification messages"
      >
        <div className="flex gap-4">
          <Button
            onClick={() => {
              toast({
                title: "Success!",
                description: "Your action was completed successfully.",
              })
            }}
          >
            Show Toast
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toast({
                variant: "destructive",
                title: "Error!",
                description: "Something went wrong. Please try again.",
              })
            }}
          >
            Show Error Toast
          </Button>
        </div>
      </ComponentSection>

      <Toaster />
    </div>
  )
}
