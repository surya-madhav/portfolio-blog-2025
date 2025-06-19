"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/utilities/ui"

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function SearchInput({ 
  placeholder = "Search...", 
  value, 
  onChange,
  className 
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pl-8" 
      />
    </div>
  )
}

export function PerplexitySearchInput({ 
  placeholder = "Ask anything...", 
  value, 
  onChange,
  className 
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-3 h-5 w-5 text-perplexity-true-turquoise" />
      <Input 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pl-10 h-12 text-base border-perplexity-true-turquoise/30 focus:border-perplexity-true-turquoise" 
      />
    </div>
  )
}
