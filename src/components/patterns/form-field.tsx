"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/utilities/ui"

interface FormFieldProps {
  label: string
  id: string
  type?: 'text' | 'email' | 'password' | 'textarea' | 'number'
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  hint?: string
  error?: string
  className?: string
}

export function FormField({
  label,
  id,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange,
  hint,
  error,
  className
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={cn(error && "border-destructive")}
          aria-invalid={!!error}
        />
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={cn(error && "border-destructive")}
          aria-invalid={!!error}
        />
      )}
      
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
