"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw } from "lucide-react"

export function AnimationPlayground() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold mb-6">Animation Playground</h3>
        <p className="text-muted-foreground mb-8">
          Interactive examples of animations used throughout the design system, 
          powered by Framer Motion.
        </p>
      </div>

      <Tabs defaultValue="entrance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entrance">Entrance</TabsTrigger>
          <TabsTrigger value="interaction">Interaction</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="page">Page</TabsTrigger>
        </TabsList>

        <TabsContent value="entrance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stagger Animation</CardTitle>
              <CardDescription>Items appear with a cascading effect</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  size="sm"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsPlaying(false)
                    setTimeout(() => setIsPlaying(true), 100)
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Replay
                </Button>
              </div>
              
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isPlaying ? "visible" : "hidden"}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className="p-4 text-center">
                      <Badge variant="outline">Item {i + 1}</Badge>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scale In Animation</CardTitle>
              <CardDescription>Elements scale in from the center</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-24 h-24 bg-gradient-to-r from-perplexity-true-turquoise to-perplexity-plex-blue rounded-lg mx-auto"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interaction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hover Effects</CardTitle>
              <CardDescription>Interactive hover animations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="p-6 cursor-pointer">
                    <h5 className="font-semibold">Scale</h5>
                    <p className="text-sm text-muted-foreground">Hover to scale</p>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-6 cursor-pointer">
                    <h5 className="font-semibold">Lift</h5>
                    <p className="text-sm text-muted-foreground">Hover to lift</p>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="p-6 cursor-pointer">
                    <h5 className="font-semibold">Rotate</h5>
                    <p className="text-sm text-muted-foreground">Hover to rotate</p>
                  </Card>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Animations</CardTitle>
              <CardDescription>Smooth layout transitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowModal(!showModal)}
                  variant="outline"
                >
                  Toggle Modal
                </Button>
                
                <AnimatePresence>
                  {showModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                      onClick={() => setShowModal(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Card className="p-6 m-4 max-w-md">
                          <CardHeader>
                            <CardTitle>Animated Modal</CardTitle>
                            <CardDescription>
                              This modal appears with a spring animation
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button onClick={() => setShowModal(false)}>
                              Close
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Transitions</CardTitle>
              <CardDescription>Smooth page enter/exit animations</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h4 className="text-lg font-semibold">Page Content</h4>
                <p className="text-muted-foreground">
                  This content animates in when the page loads, creating a smooth
                  user experience.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 + 0.2 }}
                    >
                      <Card className="p-4">
                        <p className="text-sm">Item {i + 1}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
