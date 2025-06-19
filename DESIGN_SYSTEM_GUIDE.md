# Portfolio Blog 2025 - Design System Usage Guide

## Table of Contents
1. [Design System Overview](#design-system-overview)
2. [Core Design Principles](#core-design-principles)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Component Library](#component-library)
6. [Layout System](#layout-system)
7. [Theme System](#theme-system)
8. [Development Workflow](#development-workflow)
9. [Customization Guide](#customization-guide)

## Design System Overview

This design system is inspired by Perplexity's clean, intelligent interface design with the following characteristics:

- **Brand Colors**: True Turquoise (#20808D) and Plex Blue (#1FB8CD)
- **Typography**: Space Grotesk (headings/body) + Space Mono (code)
- **Border Radius**: Sharp 4px corners
- **Spacing**: 8px grid system
- **Theme Support**: Light/Dark modes with system preference

## Core Design Principles

### 1. **Consistency First**
- Use semantic color tokens (not hardcoded colors)
- Follow the 8px spacing grid
- Maintain consistent component usage

### 2. **Accessibility**
- WCAG AA compliant color contrast
- Proper focus states on all interactive elements
- Semantic HTML structure

### 3. **Performance**
- Minimal CSS with Tailwind utilities
- Optimized animations with Framer Motion
- Lazy loading for heavy components

## Color System

### Semantic Color Usage

```tsx
// ✅ ALWAYS use semantic colors
<div className="bg-background text-foreground">
  <Card className="bg-card text-card-foreground">
    <Button variant="primary">Action</Button>
  </Card>
</div>

// ❌ NEVER hardcode colors
<div className="bg-white text-black">
  <div className="bg-gray-100 text-gray-900">
    <button className="bg-blue-600">Action</button>
  </div>
</div>
```

### Color Tokens Reference

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|--------|
| `background` | Paper White | Offblack | Page background |
| `foreground` | Offblack | Paper White | Primary text |
| `card` | Paper White | Slightly lighter | Card backgrounds |
| `primary` | True Turquoise | True Turquoise | Primary actions |
| `secondary` | Peacock | Darker Peacock | Secondary actions |
| `accent` | Plex Blue | Plex Blue | Accents/highlights |
| `muted` | Peacock 20 | Inky Blue | Subtle backgrounds |
| `success` | Green | Light Green | Success states |
| `warning` | Yellow | Light Yellow | Warning states |
| `error` | Red | Light Red | Error states |

### Brand Color Classes

```tsx
// Perplexity brand colors available as utilities
<div className="bg-perplexity-true-turquoise text-white">
  Brand colored section
</div>

<Badge className="bg-gradient-to-r from-perplexity-true-turquoise to-perplexity-plex-blue">
  Gradient Badge
</Badge>
```

## Typography

### Type Scale

```tsx
// Display text (61px) - Hero sections
<h1 className="text-display">Unlock Knowledge</h1>

// H1 (49px) - Page titles
<h1 className="text-h1">Page Title</h1>

// H2 (39px) - Section headings
<h2 className="text-h2">Section Heading</h2>

// H3 (31px) - Subsections
<h3 className="text-h3">Subsection</h3>

// Body (16px) - Regular content
<p className="text-body">Regular paragraph text</p>

// Small (13px) - Captions
<span className="text-small text-muted-foreground">Caption</span>
```

### Font Weights

```tsx
<p className="font-light">Light (300)</p>
<p className="font-normal">Regular (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<p className="font-bold">Bold (700)</p>
```

### Special Text Effects

```tsx
// Gradient text
<h2 className="gradient-text">Gradient Heading</h2>

// Code blocks
<code className="font-mono bg-muted px-2 py-1 rounded">
  const example = "code"
</code>
```

## Component Library

### Button Component

```tsx
import { Button } from "@/components/ui/button"

// Variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Style</Button>
<Button variant="destructive">Delete</Button>

// Semantic variants
<Button variant="success">Save</Button>
<Button variant="warning">Caution</Button>
<Button variant="info">Information</Button>
<Button variant="brand">Brand Action</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Icon buttons
<Button size="icon"><Search /></Button>
<Button size="icon-sm"><X /></Button>
<Button size="icon-lg"><Menu /></Button>

// With icons
<Button leftIcon={<Save />}>Save Changes</Button>
<Button rightIcon={<ArrowRight />}>Continue</Button>

// Loading state
<Button loading={isLoading}>Processing...</Button>

// As Link
<Button asChild>
  <Link href="/path">Link Button</Link>
</Button>
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

// Variants
<Card variant="default">Default card</Card>
<Card variant="elevated">Elevated with hover</Card>
<Card variant="flat">No shadow</Card>
<Card variant="outlined">2px border</Card>
<Card variant="ghost">Transparent</Card>

// Padding options
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="default">Default padding</Card>
<Card padding="lg">Large padding</Card>

// Complete card
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Supporting description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Alert Component

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

// Default
<Alert>
  <AlertTitle>Note</AlertTitle>
  <AlertDescription>Default alert message</AlertDescription>
</Alert>

// Success
<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Operation completed successfully</AlertDescription>
</Alert>

// Warning
<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Please review before proceeding</AlertDescription>
</Alert>

// Error
<Alert variant="destructive">
  <XCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong</AlertDescription>
</Alert>

// Info
<Alert variant="info">
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>Here's something you should know</AlertDescription>
</Alert>
```

### Badge Component

```tsx
import { Badge } from "@/components/ui/badge"

// All variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>

// Custom styling
<Badge className="bg-perplexity-true-turquoise text-white">
  Custom Brand
</Badge>
```

### Pattern Components

```tsx
// Page Header with animation
import { PageHeader } from "@/components/patterns"

<PageHeader 
  title="Dashboard"
  description="Welcome to your analytics dashboard"
>
  <Button>Get Started</Button>
</PageHeader>

// Data Card
import { DataCard } from "@/components/patterns"

<DataCard
  title="Total Revenue"
  value="$12,345"
  description="Last 30 days"
  icon={DollarSign}
  trend={{ value: 12.5, isPositive: true }}
  badge={{ label: "Monthly", variant: "secondary" }}
/>

// Feature Card
import { FeatureCard } from "@/components/patterns"

<FeatureCard
  title="Advanced Analytics"
  description="Deep insights into your data"
  icon={BarChart}
  features={["Real-time data", "Custom reports", "Export options"]}
  badge="Pro"
  gradient={true}
  delay={0.2}
/>

// Empty State
import { EmptyState } from "@/components/patterns"

<EmptyState
  icon={FileText}
  title="No posts yet"
  description="Create your first post to get started"
  action={{
    label: "Create Post",
    onClick: () => router.push('/admin/posts/create')
  }}
/>
```

## Layout System

### Container Classes

```tsx
// Standard container
<div className="container">
  Centered with responsive padding
</div>

// Custom containers from patterns
<div className="container-content">
  Max-width content container
</div>

// Section spacing
<section className="section-spacing">
  Standard section with vertical padding
</section>

// Content spacing
<div className="content-spacing">
  Spacing between content elements
</div>
```

### Grid System

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>

// 12-column grid
<div className="grid grid-cols-4 lg:grid-cols-12 gap-6">
  <div className="col-span-4 lg:col-span-8">Main content</div>
  <div className="col-span-4 lg:col-span-4">Sidebar</div>
</div>
```

### Spacing Utilities

```tsx
// Use the 8px grid system
<div className="p-4">      // 16px padding
<div className="p-6">      // 24px padding
<div className="p-8">      // 32px padding

<div className="space-y-4"> // 16px vertical spacing
<div className="gap-6">     // 24px gap in grid/flex
```

## Theme System

### Using the Theme

```tsx
import { useTheme } from '@/hooks/use-theme'

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  // theme: 'light' | 'dark' | 'system'
  // resolvedTheme: 'light' | 'dark' (actual applied theme)
  
  return (
    <div>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

### Theme-Aware Styling

```tsx
// Components automatically adapt to theme
<Card> // Will use appropriate colors for light/dark

// Conditional styling based on theme
<div className="bg-white dark:bg-black">
  Manually controlled theming
</div>

// Using data-theme attribute
<div data-theme="dark">
  This section is always dark
</div>
```

## Development Workflow

### 1. Creating New Components

```tsx
// Always use semantic colors and existing patterns
import { cn } from '@/utilities/ui'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MyComponentProps {
  className?: string
  variant?: 'default' | 'special'
}

export function MyComponent({ className, variant = 'default' }: MyComponentProps) {
  return (
    <Card 
      className={cn(
        'p-6', // Use spacing utilities
        variant === 'special' && 'bg-gradient-to-r from-primary to-accent text-white',
        className
      )}
    >
      <h3 className="text-h4 font-semibold mb-4">Component Title</h3>
      <p className="text-muted-foreground mb-6">Description text</p>
      <Button variant="primary">Action</Button>
    </Card>
  )
}
```

### 2. Page Layouts

```tsx
// Standard page structure
export default function MyPage() {
  return (
    <>
      <PageHeader 
        title="Page Title"
        description="Page description"
      />
      
      <section className="section-spacing">
        <div className="container-content">
          <div className="content-spacing">
            {/* Page content */}
          </div>
        </div>
      </section>
      
      <section className="section-spacing bg-muted/30">
        <div className="container-content">
          {/* Alternative section */}
        </div>
      </section>
    </>
  )
}
```

### 3. Form Patterns

```tsx
import { FormField } from '@/components/patterns'

<form className="space-y-6">
  <FormField
    label="Email"
    id="email"
    type="email"
    required
    hint="We'll never share your email"
    error={errors.email}
  />
  
  <FormField
    label="Message"
    id="message"
    type="textarea"
    required
    error={errors.message}
  />
  
  <Button type="submit" loading={isSubmitting}>
    Send Message
  </Button>
</form>
```

## Customization Guide

### Changing Brand Colors

To modify the design system colors while maintaining consistency:

1. **Update CSS Variables** in `globals.css`:
```css
:root {
  /* Change primary brand color */
  --primary: 220 80% 50%; /* Your new HSL value */
  --primary-foreground: 0 0% 100%;
  
  /* Update other brand colors */
  --accent: 260 80% 60%;
}
```

2. **Update Tailwind Config** if adding new colors:
```js
// tailwind.config.mjs
colors: {
  brand: {
    primary: 'hsl(var(--primary))',
    accent: 'hsl(var(--accent))',
  }
}
```

3. **Update Perplexity Brand Colors**:
```js
perplexity: {
  'true-turquoise': '#YOUR_COLOR',
  'plex-blue': '#YOUR_COLOR',
}
```

### Changing Typography

1. **Import New Fonts** in `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@300..700&display=swap');
```

2. **Update Tailwind Config**:
```js
fontFamily: {
  sans: ['Your Font', 'system-ui', 'sans-serif'],
  mono: ['Your Mono Font', 'monospace']
}
```

3. **Update Font Sizes** if needed:
```js
fontSize: {
  'display': ['4rem', { lineHeight: '1.1' }],
  'h1': ['3rem', { lineHeight: '1.2' }],
  // etc...
}
```

### Adding New Component Variants

1. **Extend Existing Components**:
```tsx
// In button.tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        // Add new variant
        gradient: "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90",
      }
    }
  }
)
```

2. **Create Compound Components**:
```tsx
// Create specialized versions
export function GradientButton(props: ButtonProps) {
  return <Button {...props} variant="gradient" />
}
```

### Theme Customization

1. **Add New Theme**:
```tsx
// In globals.css
[data-theme='brand'] {
  --background: 220 20% 10%;
  --foreground: 0 0% 100%;
  /* Define all color variables */
}
```

2. **Extend Theme Options**:
```tsx
// Update theme hooks and components
type Theme = 'light' | 'dark' | 'brand' | 'system'
```

## Best Practices

### DO's ✅

1. **Use Semantic Colors**
   ```tsx
   <div className="bg-background text-foreground">
   ```

2. **Follow Spacing Grid**
   ```tsx
   <div className="p-4 space-y-6">
   ```

3. **Use Component Variants**
   ```tsx
   <Button variant="secondary" size="lg">
   ```

4. **Maintain Consistency**
   ```tsx
   <Card variant="elevated" padding="default">
   ```

5. **Handle Loading States**
   ```tsx
   <Button loading={isLoading}>Submit</Button>
   ```

### DON'Ts ❌

1. **Hardcode Colors**
   ```tsx
   // Bad
   <div className="bg-blue-600 text-white">
   ```

2. **Random Spacing**
   ```tsx
   // Bad
   <div className="p-[13px] mt-[27px]">
   ```

3. **Inline Styles**
   ```tsx
   // Bad
   <div style={{ backgroundColor: '#20808D' }}>
   ```

4. **Mix Design Systems**
   ```tsx
   // Bad - Don't mix MUI with our system
   <MuiButton color="primary">
   ```

5. **Override Core Styles**
   ```tsx
   // Bad
   .btn { background: red !important; }
   ```

## Component Decision Tree

When building new features, follow this decision tree:

1. **Does a pattern component exist?**
   - Yes → Use pattern component
   - No → Continue to #2

2. **Does a UI component exist?**
   - Yes → Use UI component with appropriate variant
   - No → Continue to #3

3. **Can you compose from existing components?**
   - Yes → Create composition
   - No → Build new component following design system

4. **Is it reusable?**
   - Yes → Add to pattern library
   - No → Keep in feature folder

## Resources

- **Design System Page**: `/design-system` - Interactive component gallery
- **Figma**: Link to design files (if available)
- **Storybook**: Component playground (if set up)
- **Icons**: Use Lucide React icons consistently

## Migration Guide

When updating existing components:

1. Replace hardcoded colors with semantic tokens
2. Update spacing to use 8px grid
3. Replace custom buttons with Button component
4. Use Card component for containers
5. Apply consistent typography classes
6. Ensure dark mode compatibility

Remember: The design system is a living document. When in doubt, prioritize consistency and user experience over rigid adherence to rules.
