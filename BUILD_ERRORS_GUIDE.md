# Next.js + Payload CMS Build Errors Prevention Guide

## Common Build Errors and Solutions

### 0. TypeScript Type Errors

**Error:**
```
Type error: Type '"clear"' is not assignable to type '"default" | "icon" | "sm" | "lg" | "xl" | "icon-sm" | "icon-lg" | null | undefined'
```

**Cause:** Trying to assign an invalid value to a strictly typed prop.

**Solution:**
```tsx
// ❌ Bad - Using invalid value
const size = appearance === 'link' ? 'clear' : sizeFromProps

// ✅ Good - Use undefined or valid value
const size = appearance === 'link' ? undefined : sizeFromProps

// ✅ Also good - Use a valid size
const size = appearance === 'link' ? 'sm' : sizeFromProps
```

### 1. React.Children.only Error with Radix UI Slot

**Error:**
```
React.Children.only expected to receive a single React element child
```

**Cause:** When using `asChild` prop with Radix UI's Slot component, it expects exactly one child element.

**Solution:**
```tsx
// ❌ Bad - Multiple children
<Button asChild>
  <Link href="/path">
    {label && label}
    {children && children}
  </Link>
</Button>

// ✅ Good - Single child
<Button asChild>
  <Link href="/path">
    {label || children}
  </Link>
</Button>

// ✅ Also good - Conditional rendering for asChild
{asChild ? (
  children
) : (
  <>
    {loading && <Spinner />}
    {leftIcon}
    {children}
    {rightIcon}
  </>
)}
```

### 2. ESLint Warnings for Unused Variables

**Error:**
```
Warning: 'variable' is defined but never used. Allowed unused vars must match /^_/u.
```

**Solutions:**

#### a) Remove unused imports
```tsx
// ❌ Bad
import { Card, CardContent, CardDescription } from "@/components/ui/card"
// Only using Card and CardContent

// ✅ Good
import { Card, CardContent } from "@/components/ui/card"
```

#### b) Prefix with underscore for intentionally unused parameters
```tsx
// ❌ Bad
function CodeBlock({ title, code, language }: CodeBlockProps) {
  // language not used
}

// ✅ Good - Remove if not needed
function CodeBlock({ title, code }: CodeBlockProps) {
}

// ✅ Also good - Prefix with underscore if needed for type
function CodeBlock({ title, code, _language }: CodeBlockProps) {
}
```

#### c) Fix destructuring duplicates
```tsx
// ❌ Bad
export const hook = async ({ doc, req, req: { payload } }) => {

// ✅ Good
export const hook = async ({ doc, req: { payload } }) => {
```

### 3. React Unescaped Entities

**Error:**
```
Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.
Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.
```

**Solution:**
```tsx
// ❌ Bad
<p>Perplexity's clean design</p>
<code>const knowledge = await search("design systems")</code>

// ✅ Good
<p>Perplexity&apos;s clean design</p>
<code>const knowledge = await search(&quot;design systems&quot;)</code>

// ✅ Also good - Use template literals or variables
<p>{`Perplexity's clean design`}</p>
```

### 4. TypeScript Type-Only Import Issues

**Error:**
```
Warning: 'actionTypes' is assigned a value but only used as a type.
```

**Solution:**
```tsx
// ❌ Bad - Defining const that's only used for types
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
} as const

type ActionType = typeof actionTypes
type Action = {
  type: ActionType["ADD_TOAST"]
}

// ✅ Good - Use literal types directly
type Action = 
  | { type: "ADD_TOAST" }
  | { type: "UPDATE_TOAST" }
```

## ESLint Configuration Rules

Add these rules to `.eslintrc.json` to prevent common issues:

```json
{
  "rules": {
    // Warn on unused variables, allow underscore prefix
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    
    // Prevent unescaped entities
    "react/no-unescaped-entities": "error",
    
    // Ensure proper React imports
    "react/react-in-jsx-scope": "off", // Not needed in Next.js
    
    // Prevent missing key props
    "react/jsx-key": "error"
  }
}
```

## Build Command Best Practices

### Development Build Testing
```bash
# Clear cache and test build
rm -rf .next
pnpm build

# Test with type checking
pnpm tsc --noEmit

# Run ESLint separately
pnpm lint
```

### Fix Commands
```bash
# Auto-fix ESLint issues
pnpm lint:fix

# Type check without emitting
pnpm tsc --noEmit --pretty
```

## Component Best Practices

### 1. Radix UI Slot Component Usage
- Always ensure single child when using `asChild`
- Handle conditional rendering outside of Slot
- Test with different prop combinations

### 2. Import Management
- Only import what you use
- Group imports logically
- Use barrel exports sparingly

### 3. Type Safety
- Define proper interfaces for all props
- Use strict TypeScript settings
- Avoid `any` types

### 4. String Content
- Use HTML entities for special characters
- Consider using template literals for complex strings
- Use internationalization for user-facing text

## Pre-commit Checklist

Before committing, ensure:

1. ✅ No ESLint warnings/errors: `pnpm lint`
2. ✅ TypeScript compiles: `pnpm tsc --noEmit`
3. ✅ Build succeeds: `pnpm build`
4. ✅ No console errors in development
5. ✅ All imports are used
6. ✅ No unescaped entities in JSX
7. ✅ Radix UI components have proper children

## Debugging Tips

### For React.Children.only errors:
1. Check the error stack trace for the component
2. Look for `asChild` prop usage
3. Ensure single child element
4. Check conditional rendering

### For ESLint warnings:
1. Use VS Code ESLint extension for real-time feedback
2. Run `pnpm lint` before committing
3. Use `_` prefix for intentionally unused variables
4. Remove truly unused imports

### For build failures:
1. Check `.next` build output for detailed errors
2. Clear cache: `rm -rf .next`
3. Check for hydration mismatches
4. Verify environment variables

## CI/CD Considerations

Add these checks to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Type Check
  run: pnpm tsc --noEmit

- name: Lint
  run: pnpm lint

- name: Build
  run: pnpm build
```

This guide should help prevent the most common build errors in your Next.js + Payload CMS project.
