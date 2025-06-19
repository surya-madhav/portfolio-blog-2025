"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function GridSystemDemo() {
  const [showGrid, setShowGrid] = useState(true)

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-6">Grid System</h3>
        <p className="text-muted-foreground mb-8">
          Responsive grid system built with CSS Grid and Tailwind utilities,
          following a 12-column layout with consistent spacing.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Button
          variant={showGrid ? "default" : "outline"}
          onClick={() => setShowGrid(!showGrid)}
          size="sm"
        >
          {showGrid ? "Hide" : "Show"} Grid Overlay
        </Button>
        <Badge variant="outline">12 Column System</Badge>
      </div>

      {/* Container Sizes */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Container Sizes</h4>
        <div className="space-y-4">
          <div className="max-w-sm mx-auto bg-muted/30 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <p className="text-center text-sm">Small Container (max-w-sm)</p>
          </div>
          <div className="max-w-4xl mx-auto bg-muted/30 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <p className="text-center text-sm">Content Container (max-w-4xl)</p>
          </div>
          <div className="max-w-7xl mx-auto bg-muted/30 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <p className="text-center text-sm">Full Container (max-w-7xl)</p>
          </div>
        </div>
      </div>

      {/* 12 Column Grid */}
      <div>
        <h4 className="text-lg font-semibold mb-4">12 Column Grid</h4>
        <div className={`relative ${showGrid ? 'grid-pattern' : ''}`}>
          <div className="grid grid-cols-12 gap-4 p-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-perplexity-true-turquoise/20 border border-perplexity-true-turquoise/40 p-2 rounded text-center text-xs font-mono"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common Layout Patterns */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Common Layout Patterns</h4>
        <div className="space-y-6">
          
          {/* Two Column */}
          <div>
            <h5 className="font-medium mb-2 text-sm text-muted-foreground">Two Column (6-6)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h6 className="font-semibold mb-2">Left Column</h6>
                <p className="text-sm text-muted-foreground">Equal width content</p>
              </Card>
              <Card className="p-4">
                <h6 className="font-semibold mb-2">Right Column</h6>
                <p className="text-sm text-muted-foreground">Equal width content</p>
              </Card>
            </div>
          </div>

          {/* Three Column */}
          <div>
            <h5 className="font-medium mb-2 text-sm text-muted-foreground">Three Column (4-4-4)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4">
                <h6 className="font-semibold mb-2">Column 1</h6>
                <p className="text-sm text-muted-foreground">Responsive columns</p>
              </Card>
              <Card className="p-4">
                <h6 className="font-semibold mb-2">Column 2</h6>
                <p className="text-sm text-muted-foreground">Responsive columns</p>
              </Card>
              <Card className="p-4">
                <h6 className="font-semibold mb-2">Column 3</h6>
                <p className="text-sm text-muted-foreground">Responsive columns</p>
              </Card>
            </div>
          </div>

          {/* Sidebar Layout */}
          <div>
            <h5 className="font-medium mb-2 text-sm text-muted-foreground">Sidebar Layout (8-4)</h5>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Card className="lg:col-span-3 p-4">
                <h6 className="font-semibold mb-2">Main Content</h6>
                <p className="text-sm text-muted-foreground">
                  Primary content area takes up 3/4 of the space on large screens,
                  full width on smaller screens.
                </p>
              </Card>
              <Card className="p-4">
                <h6 className="font-semibold mb-2">Sidebar</h6>
                <p className="text-sm text-muted-foreground">
                  Sidebar content
                </p>
              </Card>
            </div>
          </div>

          {/* Complex Grid */}
          <div>
            <h5 className="font-medium mb-2 text-sm text-muted-foreground">Complex Grid Layout</h5>
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
              <Card className="md:col-span-6 lg:col-span-8 p-4">
                <h6 className="font-semibold mb-2">Featured Content</h6>
                <p className="text-sm text-muted-foreground">
                  Large featured area that spans 8 columns on desktop
                </p>
              </Card>
              <Card className="md:col-span-3 lg:col-span-2 p-4">
                <h6 className="font-semibold mb-2">Widget 1</h6>
                <p className="text-sm text-muted-foreground">Small widget</p>
              </Card>
              <Card className="md:col-span-3 lg:col-span-2 p-4">
                <h6 className="font-semibold mb-2">Widget 2</h6>
                <p className="text-sm text-muted-foreground">Small widget</p>
              </Card>
              <Card className="md:col-span-2 lg:col-span-4 p-4">
                <h6 className="font-semibold mb-2">Medium Section</h6>
                <p className="text-sm text-muted-foreground">Medium sized content</p>
              </Card>
              <Card className="md:col-span-4 lg:col-span-8 p-4">
                <h6 className="font-semibold mb-2">Wide Section</h6>
                <p className="text-sm text-muted-foreground">Wide content area</p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Breakpoints */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Responsive Breakpoints</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <h6 className="font-semibold mb-2">Mobile</h6>
            <p className="text-sm text-muted-foreground mb-2">&lt; 640px</p>
            <Badge variant="outline">xs</Badge>
          </Card>
          <Card className="p-4 text-center">
            <h6 className="font-semibold mb-2">Tablet</h6>
            <p className="text-sm text-muted-foreground mb-2">≥ 640px</p>
            <Badge variant="outline">sm</Badge>
          </Card>
          <Card className="p-4 text-center">
            <h6 className="font-semibold mb-2">Desktop</h6>
            <p className="text-sm text-muted-foreground mb-2">≥ 1024px</p>
            <Badge variant="outline">lg</Badge>
          </Card>
          <Card className="p-4 text-center">
            <h6 className="font-semibold mb-2">Large</h6>
            <p className="text-sm text-muted-foreground mb-2">≥ 1280px</p>
            <Badge variant="outline">xl</Badge>
          </Card>
        </div>
      </div>

      {/* Spacing System */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Spacing System</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Gap Sizes</p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-muted p-2 rounded">
                <span className="text-xs font-mono">gap-1</span>
              </div>
              <div className="flex items-center gap-2 bg-muted p-2 rounded">
                <span className="text-xs font-mono">gap-2</span>
              </div>
              <div className="flex items-center gap-4 bg-muted p-2 rounded">
                <span className="text-xs font-mono">gap-4</span>
              </div>
              <div className="flex items-center gap-6 bg-muted p-2 rounded">
                <span className="text-xs font-mono">gap-6</span>
              </div>
              <div className="flex items-center gap-8 bg-muted p-2 rounded">
                <span className="text-xs font-mono">gap-8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
