"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeSwitcher } from "@/components/theme-switcher"

// Component sections - will be implemented
import { ColorPalette } from "./components/color-palette"
import { TypographyShowcase } from "./components/typography-showcase"
import { ComponentsGallery } from "./components/components-gallery"
import { AnimationPlayground } from "./components/animation-playground"
import { GridSystemDemo } from "./components/grid-system-demo"
import { CheatSheet } from "./components/cheat-sheet"

export default function DesignSystemPage() {
  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Background grid pattern */}
      <div className="fixed inset-0 grid-pattern opacity-[0.02] z-[-1]" />
      
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Design System</h1>
            <p className="text-sm text-muted-foreground">Portfolio Blog 2025</p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container px-4 py-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-h3 font-semibold mb-2">
                Ask questions. Trust the answers.
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                A comprehensive design system built with Tailwind CSS and shadcn/ui, 
                inspired by Perplexity&apos;s clean and intelligent interface design.
              </p>
            </div>

            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full max-w-3xl grid-cols-6 mb-8">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="animations">Animations</TabsTrigger>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="cheatsheet">Cheat Sheet</TabsTrigger>
              </TabsList>

              <div className="rounded-lg border bg-card p-6">
                <TabsContent value="colors" className="mt-0">
                  <ColorPalette />
                </TabsContent>

                <TabsContent value="typography" className="mt-0">
                  <TypographyShowcase />
                </TabsContent>

                <TabsContent value="components" className="mt-0">
                  <ComponentsGallery />
                </TabsContent>

                <TabsContent value="animations" className="mt-0">
                  <AnimationPlayground />
                </TabsContent>

                <TabsContent value="grid" className="mt-0">
                  <GridSystemDemo />
                </TabsContent>

                <TabsContent value="cheatsheet" className="mt-0">
                  <CheatSheet />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
