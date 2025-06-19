"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function TypographyShowcase() {
  const typeScales = [
    { name: "Display", className: "text-display", size: "3.815rem / 61px", sample: "Unlock Knowledge" },
    { name: "H1", className: "text-h1", size: "3.052rem / 49px", sample: "Ask Questions" },
    { name: "H2", className: "text-h2", size: "2.441rem / 39px", sample: "Trust the Answers" },
    { name: "H3", className: "text-h3", size: "1.953rem / 31px", sample: "Intelligent Design" },
    { name: "H4", className: "text-h4", size: "1.563rem / 25px", sample: "Modern Interface" },
    { name: "H5", className: "text-h5", size: "1.25rem / 20px", sample: "Clean Typography" },
    { name: "Body", className: "text-body", size: "1rem / 16px", sample: "The quick brown fox jumps over the lazy dog" },
    { name: "Small", className: "text-small", size: "0.8rem / 13px", sample: "Caption text and metadata" },
  ]

  const fontWeights = [
    { name: "Light", weight: "font-light", value: "300" },
    { name: "Regular", weight: "font-normal", value: "400" },
    { name: "Medium", weight: "font-medium", value: "500" },
    { name: "Semibold", weight: "font-semibold", value: "600" },
    { name: "Bold", weight: "font-bold", value: "700" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-6">Typography System</h3>
        <p className="text-muted-foreground mb-8">
          Built with Space Grotesk for headings and body text, and Space Mono for code and technical content.
          The type scale follows a 1.25 ratio for harmonious hierarchy.
        </p>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-6">Type Scale</h4>
        <div className="space-y-4">
          {typeScales.map((scale, index) => (
            <motion.div
              key={scale.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{scale.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{scale.size}</span>
                </div>
                <p className={`${scale.className} font-semibold leading-tight`}>
                  {scale.sample}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-lg font-semibold mb-6">Font Weights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fontWeights.map((weight) => (
            <Card key={weight.name} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{weight.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{weight.value}</span>
              </div>
              <p className={`text-xl ${weight.weight}`}>
                The quick brown fox
              </p>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-lg font-semibold mb-6">Font Families</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h5 className="font-semibold mb-4">Space Grotesk</h5>
            <p className="font-sans mb-2">Primary font for headings and body text</p>
            <p className="font-sans text-2xl">AaBbCcDdEeFfGgHhIiJjKkLlMm</p>
            <p className="font-sans text-2xl">1234567890!@#$%^&*()</p>
          </Card>
          <Card className="p-6">
            <h5 className="font-semibold mb-4">Space Mono</h5>
            <p className="font-mono mb-2">Monospace font for code and technical content</p>
            <p className="font-mono text-2xl">AaBbCcDdEeFfGgHhIiJjKkLlMm</p>
            <p className="font-mono text-2xl">1234567890!@#$%^&*()</p>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-lg font-semibold mb-6">Text Styles</h4>
        <div className="space-y-6">
          <Card className="p-6">
            <h5 className="font-semibold mb-4">Paragraph Text</h5>
            <p className="mb-4">
              Perplexity is where knowledge begins. Our design system emphasizes clarity, 
              readability, and intelligent information hierarchy. Each element is carefully 
              crafted to enhance the user&apos;s journey from question to answer.
            </p>
            <p className="text-muted-foreground">
              Secondary text provides additional context and supporting information. 
              It uses a muted color to create visual hierarchy without overwhelming 
              the primary content.
            </p>
          </Card>

          <Card className="p-6">
            <h5 className="font-semibold mb-4">Lists</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="font-medium mb-2">Unordered List</h6>
                <ul className="list-disc list-inside space-y-1">
                  <li>Clean and minimal design</li>
                  <li>Intelligent color system</li>
                  <li>Responsive typography</li>
                  <li>Accessible components</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium mb-2">Ordered List</h6>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Define your color palette</li>
                  <li>Set up typography scale</li>
                  <li>Build component library</li>
                  <li>Document usage patterns</li>
                </ol>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h5 className="font-semibold mb-4">Special Text Styles</h5>
            <div className="space-y-4">
              <div>
                <p className="gradient-text text-2xl font-bold mb-2">
                  Gradient Text Effect
                </p>
                <p className="text-sm text-muted-foreground">
                  Using CSS gradients for emphasis and visual interest
                </p>
              </div>
              <div>
                <p className="text-lg">
                  Regular text with <strong>bold emphasis</strong> and <em>italic style</em>
                </p>
              </div>
              <div>
                <code className="font-mono bg-muted px-2 py-1 rounded text-sm">
                  const knowledge = await perplexity.search(&quot;design systems&quot;)
                </code>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
