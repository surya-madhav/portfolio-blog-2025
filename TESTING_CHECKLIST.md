# Manual Testing Checklist for Payload-Sonar Implementation

## Prerequisites
1. [ ] Run `pnpm install` to install all new dependencies
2. [ ] Run `pnpm dev` to start the development server
3. [ ] Open browser to `http://localhost:3000`

## 1. Design System Page Testing

### Access Design System
- [ ] Navigate to `/design-system` route
- [ ] Page loads without errors
- [ ] Header displays "Design System" and "Portfolio Blog 2025"
- [ ] Grid pattern background is visible (subtle)
- [ ] Page content animates in smoothly

### Theme Switching
- [ ] Theme switcher dropdown is visible in top-right
- [ ] Click theme switcher to open dropdown
- [ ] Select "Light" theme - page switches to light mode
- [ ] Select "Dark" theme - page switches to dark mode  
- [ ] Select "System" theme - follows system preference
- [ ] Theme changes are smooth with transitions
- [ ] Page refresh maintains selected theme
- [ ] CSS variables update correctly in developer tools

### Tab Navigation
- [ ] Six tabs are visible: Colors, Typography, Components, Animations, Grid, Cheat Sheet
- [ ] Default tab is "Colors"
- [ ] Click each tab to verify content loads
- [ ] Tab selection is highlighted correctly
- [ ] Content area updates smoothly between tabs

## 2. Colors Tab Testing

### Color Palette Display
- [ ] "Core Brand Colors" section displays 3 color cards
- [ ] "Secondary Blues" section displays 4 color cards  
- [ ] "Product Colors" section displays 6 color cards
- [ ] "Accent Colors" section displays 4 color cards
- [ ] "System Colors" section displays 5 adaptive color cards
- [ ] Color cards show correct names and hex/CSS values
- [ ] Proper text contrast on each color card

### Color Interaction
- [ ] Click any color card - shows copy confirmation
- [ ] Toast notification appears saying "Copied [value] to clipboard"
- [ ] Paste clipboard content - should match clicked color value
- [ ] Copy button icons change from Copy to Check when clicked
- [ ] Color combinations section displays 3 gradient examples

### Theme-Aware Colors
- [ ] Switch to dark theme - system colors adapt correctly
- [ ] Brand colors remain consistent across themes
- [ ] Text contrast maintains readability in both themes

## 3. Typography Tab Testing

### Type Scale Display
- [ ] 8 typography scales displayed (Display through Small)
- [ ] Each scale shows name, size, and sample text
- [ ] Font sizes are visually hierarchical
- [ ] Space Grotesk font family is applied
- [ ] Cards animate in with stagger effect

### Font Weights Section
- [ ] 5 font weight examples (Light through Bold)
- [ ] Weight values are correctly displayed (300-700)
- [ ] Visual weight differences are apparent
- [ ] "The quick brown fox" sample text for each

### Font Families Section
- [ ] Space Grotesk card shows sans-serif characters and numbers
- [ ] Space Mono card shows monospace characters and numbers
- [ ] Font families are correctly applied
- [ ] Character samples display properly

### Text Styles Section
- [ ] Paragraph text examples with primary/secondary text
- [ ] Unordered and ordered lists display correctly
- [ ] Gradient text effect is visible and working
- [ ] Code block has proper monospace font and background
- [ ] Bold and italic text styles work

## 4. Components Tab Testing

### Button Variations
- [ ] 10 button variants display: Primary, Secondary, Destructive, Outline, Ghost, Link, Success, Warning, Info, Brand
- [ ] Disabled button is properly styled
- [ ] Size variants: Small, Large, Extra Large
- [ ] Button with icon displays correctly
- [ ] Hover effects work on all buttons
- [ ] Focus states are visible with keyboard navigation

### Card Variations
- [ ] 4 card examples: Default, Elevated, Outlined, Gradient
- [ ] Elevated card has hover shadow effect
- [ ] Gradient card uses brand colors
- [ ] Card headers, content, and footers display properly

### Badges
- [ ] 6 badge variants including custom and gradient
- [ ] Badge colors and styles are distinct
- [ ] Text contrast is readable

### Alerts
- [ ] Default alert with icon and description
- [ ] Custom info alert with brand colors
- [ ] Icons display correctly
- [ ] Alert styling is consistent

### Form Controls
- [ ] Email and search input fields
- [ ] Search field has icon inside
- [ ] Checkbox with label is clickable
- [ ] Switch toggles and shows state change
- [ ] Slider moves and displays current value
- [ ] All form controls have proper focus states

### Progress & Loading
- [ ] Progress bar animates from 13% to 66%
- [ ] Skeleton loaders display with pulse animation
- [ ] Loading states look realistic

### Avatars
- [ ] 3 avatar examples with different sizes
- [ ] Avatar with image fallback
- [ ] Custom background color avatar
- [ ] Large avatar variant

### Toast Notifications
- [ ] "Show Toast" button displays success message
- [ ] "Show Error Toast" button displays error message
- [ ] Toast appears in corner with proper styling
- [ ] Toast auto-dismisses after timeout
- [ ] Multiple toasts stack properly

## 5. Animations Tab Testing

### Entrance Animations
- [ ] Play/Pause button controls stagger animation
- [ ] Replay button restarts animation sequence
- [ ] 8 cards animate in cascading sequence
- [ ] Scale-in animation demonstrates spring physics

### Interaction Animations
- [ ] Hover over "Scale" card - grows larger
- [ ] Hover over "Lift" card - moves up
- [ ] Hover over "Rotate" card - rotates slightly  
- [ ] Animations are smooth and responsive

### Layout Animations
- [ ] "Toggle Modal" button opens overlay
- [ ] Modal appears with scale and fade animation
- [ ] Click outside modal to close
- [ ] Modal exits with reverse animation
- [ ] Background overlay fades properly

### Page Animations
- [ ] Content demonstrates page load animation
- [ ] 4 items animate in with staggered delays
- [ ] Page transition examples are smooth

## 6. Grid Tab Testing

### Container Demonstrations
- [ ] Small, Content, and Full container examples
- [ ] Container sizes are visually distinct
- [ ] Dashed borders show container boundaries

### Grid System
- [ ] Toggle "Show/Hide Grid Overlay" button
- [ ] 12-column grid is visible when overlay is on
- [ ] Grid columns are numbered 1-12
- [ ] Grid pattern background toggles correctly

### Layout Patterns
- [ ] Two Column (6-6) layout is responsive
- [ ] Three Column (4-4-4) stacks on mobile
- [ ] Sidebar Layout (8-4) works on different screen sizes
- [ ] Complex Grid Layout demonstrates spanning

### Responsive Breakpoints
- [ ] 4 breakpoint cards show Mobile, Tablet, Desktop, Large
- [ ] Breakpoint descriptions are accurate
- [ ] Cards stack responsively

### Spacing System
- [ ] Gap size examples are visually different
- [ ] Spacing increases from gap-1 to gap-8
- [ ] Font-mono labels are correctly styled

## 7. Cheat Sheet Tab Testing

### Tab Navigation
- [ ] 6 sub-tabs: Components, Colors, Layout, Typography, Animations, Responsive
- [ ] Default tab is "Components"
- [ ] Each tab loads different code examples

### Code Block Functionality
- [ ] Copy buttons appear on each code block
- [ ] Click copy button - changes to check icon
- [ ] Toast notification confirms copy action
- [ ] Pasted content matches code block content
- [ ] Code syntax highlighting is readable

### Content Sections
- [ ] Components tab: 4 TypeScript/React examples
- [ ] Colors tab: CSS class examples
- [ ] Layout tab: Grid and flexbox utilities
- [ ] Typography tab: Font size and weight classes
- [ ] Animations tab: Framer Motion examples
- [ ] Responsive tab: Breakpoint utilities

### Quick Tips
- [ ] 4 tip cards display at bottom
- [ ] Tips cover Design Tokens, Responsive Design, Accessibility, Performance
- [ ] Card layout is responsive

## 8. Admin Panel Testing

### Access Admin Panel
- [ ] Navigate to `/admin` route
- [ ] Admin panel loads with custom styling
- [ ] Space Grotesk font is applied
- [ ] Brand colors are used throughout

### Theme Consistency
- [ ] Admin panel respects light/dark theme from frontend
- [ ] Navigation uses brand colors
- [ ] Form fields have consistent styling
- [ ] Buttons match design system

### Admin Elements
- [ ] Navigation sidebar has brand styling
- [ ] Form inputs have proper border radius and colors
- [ ] Tables use consistent spacing and typography
- [ ] Cards and buttons match frontend design
- [ ] Status indicators use brand colors

## 9. Responsive Design Testing

### Mobile (< 640px)
- [ ] Design system page is fully functional
- [ ] Tabs stack or scroll horizontally
- [ ] Color cards grid appropriately
- [ ] Typography examples are readable
- [ ] Component examples work on small screens
- [ ] Animation examples perform well

### Tablet (640px - 1024px)
- [ ] Grid layouts adapt to 2-column where appropriate
- [ ] Tab content is properly spaced
- [ ] Interactive elements are touch-friendly
- [ ] Navigation remains usable

### Desktop (> 1024px)
- [ ] Full layout is utilized
- [ ] Grid examples show proper column spanning
- [ ] All interactive elements are accessible
- [ ] Animations perform smoothly

## 10. Performance & Accessibility Testing

### Performance
- [ ] Page loads quickly (< 3 seconds)
- [ ] Animations are smooth (60fps)
- [ ] No console errors in developer tools
- [ ] Images and assets load properly
- [ ] Theme switching is instant

### Accessibility
- [ ] Tab navigation works with keyboard
- [ ] Focus states are visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader can navigate content
- [ ] All buttons and links have proper labels

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox  
- [ ] Works in Safari
- [ ] Works in Edge

## 11. Integration Testing

### Frontend Integration
- [ ] Design system integrates with existing site navigation
- [ ] Theme switching affects entire site
- [ ] No conflicts with existing styles
- [ ] Pattern components work in other pages

### Admin Integration
- [ ] Admin panel styling doesn't break existing functionality
- [ ] Custom SCSS applies correctly
- [ ] Theme variables work in admin interface
- [ ] No styling conflicts with Payload UI

## Completion Criteria

✅ **Implementation Complete When:**
- [ ] All 77 test items above pass
- [ ] No console errors during testing
- [ ] All features work across device sizes
- [ ] Both light and dark themes function properly
- [ ] Admin panel integrates seamlessly
- [ ] Design system is fully interactive and functional

## Notes Section
_Document any issues found during testing:_

- 
- 
- 

## Sign-off
- [ ] Frontend Design System: ✅ Passed Testing
- [ ] Admin Panel Integration: ✅ Passed Testing  
- [ ] Responsive Design: ✅ Passed Testing
- [ ] Theme System: ✅ Passed Testing
- [ ] Performance: ✅ Passed Testing

**Testing Completed By:** ________________  
**Date:** ________________  
**Build Version:** ________________
