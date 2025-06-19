"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check } from "lucide-react"

interface ColorCardProps {
  name: string
  value: string
  className?: string
  textColor?: string
}

function ColorCard({ name, value, className = "", textColor = "text-foreground" }: ColorCardProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    toast({
      description: `Copied ${value} to clipboard`,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${className}`}
        onClick={copyToClipboard}
      >
        <div className="aspect-[3/2] w-full" />
        <div className={`absolute inset-0 p-4 flex flex-col justify-between ${textColor}`}>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm opacity-80">{value}</p>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            className={`self-end h-8 w-8 ${textColor} hover:bg-transparent`}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export function ColorPalette() {
  // Color definitions based on CSS variables and Perplexity brand
  const coreColors = [
    { name: "Offblack", value: "#091717", className: "bg-perplexity-offblack", textColor: "text-white" },
    { name: "Paper White", value: "#FBFAF4", className: "bg-perplexity-paper-white" },
    { name: "True Turquoise", value: "#20808D", className: "bg-perplexity-true-turquoise", textColor: "text-white" },
  ]

  const secondaryColors = [
    { name: "Inky Blue", value: "#13343B", className: "bg-perplexity-inky-blue", textColor: "text-white" },
    { name: "Peacock", value: "#2E565E", className: "bg-perplexity-peacock", textColor: "text-white" },
    { name: "Plex Blue", value: "#1FB8CD", className: "bg-perplexity-plex-blue", textColor: "text-white" },
    { name: "Sky", value: "#BADEDD", className: "bg-perplexity-sky" },
  ]

  const productColors = [
    { name: "Deepest Slate", value: "#2A2A32", className: "bg-perplexity-deepest-slate", textColor: "text-white" },
    { name: "Peacock 75", value: "#628085", className: "bg-perplexity-peacock-75", textColor: "text-white" },
    { name: "Peacock 50", value: "#96AAAE", className: "bg-perplexity-peacock-50" },
    { name: "Peacock 20", value: "#D5DDD9", className: "bg-perplexity-peacock-20" },
    { name: "Peacock 10", value: "#EAEEEF", className: "bg-perplexity-peacock-10" },
    { name: "Vintage White", value: "#F3F3EE", className: "bg-perplexity-vintage-white" },
  ]

  const accentColors = [
    { name: "Ecru", value: "#E4E3D4", className: "bg-perplexity-ecru" },
    { name: "Apricot", value: "#FFD2A6", className: "bg-perplexity-apricot" },
    { name: "Terra Cotta", value: "#A84B2F", className: "bg-perplexity-terra-cotta", textColor: "text-white" },
    { name: "Boysenberry", value: "#944464", className: "bg-perplexity-boysenberry", textColor: "text-white" },
  ]

  const systemColors = [
    { name: "Primary", value: "var(--primary)", className: "bg-primary", textColor: "text-primary-foreground" },
    { name: "Secondary", value: "var(--secondary)", className: "bg-secondary", textColor: "text-secondary-foreground" },
    { name: "Accent", value: "var(--accent)", className: "bg-accent", textColor: "text-accent-foreground" },
    { name: "Muted", value: "var(--muted)", className: "bg-muted", textColor: "text-muted-foreground" },
    { name: "Destructive", value: "var(--destructive)", className: "bg-destructive", textColor: "text-destructive-foreground" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-6">Color System</h3>
        <p className="text-muted-foreground mb-8">
          The Perplexity color palette is built for flexibility, combining cool blues 
          with warm accents to create a sophisticated and intelligent visual language.
        </p>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Core Brand Colors</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreColors.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Secondary Blues</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {secondaryColors.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Product Colors</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {productColors.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Accent Colors</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {accentColors.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">System Colors</h4>
        <p className="text-sm text-muted-foreground mb-4">
          These colors adapt based on the current theme (light/dark mode)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {systemColors.map((color) => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Color Combinations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6 bg-perplexity-true-turquoise text-white">
            <h5 className="font-semibold mb-2">High Contrast</h5>
            <p className="text-sm">True Turquoise on Paper White</p>
          </Card>
          <Card className="p-6 bg-perplexity-peacock text-white">
            <h5 className="font-semibold mb-2">Subtle Depth</h5>
            <p className="text-sm">Peacock on Sky</p>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-perplexity-true-turquoise to-perplexity-plex-blue text-white">
            <h5 className="font-semibold mb-2">Gradient</h5>
            <p className="text-sm">True Turquoise to Plex Blue</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
