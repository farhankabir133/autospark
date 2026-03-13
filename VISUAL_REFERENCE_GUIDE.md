# 🎨 VISUAL REFERENCE GUIDE
## Auto Spark BD - Animation & Component Standards

---

## 📐 ANIMATION TIMING STANDARDS

### Critical Paths (Must Be Fast)
```
Button Hover:           200ms (immediate feedback)
Input Focus:            150ms (feels responsive)
Ripple Effect:          300-400ms (smooth spread)
Quick Transition:       300-500ms (snappy)
Modal Entrance:         300-400ms (quick appear)
Form Validation:        200-300ms (immediate feedback)
```

### Standard Interactions
```
Page Transition:        400-600ms (smooth navigation)
Section Reveal:         600-800ms (nice flow)
Element Stagger:        50-100ms between items
Hover Scale:            200-300ms (smooth change)
Loading Spinner:        1500-2000ms (steady rhythm)
```

### Slow, Engaging Animations
```
Parallax Scroll:        Full length (continuous)
Auto-play Carousel:     4000-5000ms between slides
Floating Elements:      15-25s full cycle (very slow)
Gradient Shift:         10-15s full cycle (subtle)
Number Counter:         2000-3000ms to finish
```

### Mobile Optimizations
```
Reduce Duration:        70-80% of desktop time
Simplify Complexity:    Remove extra effects
Delay Start:            Add 200-300ms delay for readiness
Reduce Stagger:         100-150ms → 50-75ms
Disable Heavy Effects:  Parallax, particles on mobile
```

---

## 🎬 EASING FUNCTIONS REFERENCE

### Recommended Easing Functions

#### Entrance Animations
```
@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
Animation: ease-out (or cubic-bezier(0.25, 0.46, 0.45, 0.94))
Duration: 600-800ms
```

#### Exit Animations
```
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
Animation: ease-in (or cubic-bezier(0.95, 0.05, 0.795, 0.035))
Duration: 300-400ms
```

#### Hover States
```
@keyframes hoverScale {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}
Animation: cubic-bezier(0.34, 1.56, 0.64, 1) [bounce easing]
Duration: 200-300ms
```

#### Continuous Animations
```
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
Animation: linear
Duration: 2000ms (smooth full rotation)
```

#### Spring Animations (Framer Motion)
```
type: 'spring'
stiffness: 100-400 (higher = faster)
damping: 10-50 (higher = less bouncy)

Snappy: stiffness: 400, damping: 25
Bouncy: stiffness: 200, damping: 15
Smooth: stiffness: 100, damping: 30
```

---

## 🎯 ANIMATION PATTERNS

### Pattern 1: Fade In + Slide Up
```
Initial: opacity: 0, y: 20
Animate: opacity: 1, y: 0
Timing: 600ms ease-out
When: Page load, section reveal, card entrance
```

### Pattern 2: Staggered Children
```
Container: staggerChildren: 0.1
Child 1: delay 0ms
Child 2: delay 100ms
Child 3: delay 200ms
When: List items, grid cards, multiple elements
```

### Pattern 3: Scale on Hover
```
From: scale(1)
To: scale(1.05)
Duration: 200ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
When: Card hover, button hover, link hover
```

### Pattern 4: Color Transition
```
From: color-1
To: color-2
Duration: 300-400ms
When: Hover states, theme change, status update
```

### Pattern 5: Number Counter
```
From: 0
To: target value
Duration: 2000-3000ms
Easing: easeOut
When: Stats section, milestone counters
```

### Pattern 6: Parallax Scroll
```
Background: moves slower than foreground
Offset: 30-50% of scroll distance
Applies to: Hero sections, featured vehicles
```

### Pattern 7: Modal Entrance
```
Background: fade in 200ms
Modal: scale from center 300ms
Content: fade in with stagger 200ms
Exit: reverse sequence
```

### Pattern 8: Loading Skeleton Shimmer
```
Background: gradient left to right
Duration: 2000ms infinite
Easing: ease-in-out
Colors: gray-200 → gray-100 → gray-200
```

---

## 🎨 COLOR & CONTRAST ANIMATIONS

### Hover Color Changes
```
Primary Button:         #0EA5E9 → #0284C7 (darker)
Secondary Button:       #F3F4F6 → #E5E7EB (darker)
Link:                   #0284C7 → #0EA5E9 (brighter)
Success:                #10B981 → #059669 (darker)
Error:                  #EF4444 → #DC2626 (darker)
```

### Background Gradients
```
Hero Section:           black → transparent → blue
Success State:          green → lighter green
Error State:            red → lighter red
Card Hover:             gray → subtle glow
```

### Text Color Transitions
```
Label on focus:         gray-500 → blue-600
Error message:          gray-600 → red-600
Success message:        gray-600 → green-600
Link hover:             current → blue-700
```

---

## 📦 COMPONENT ANIMATION SPECS

### Button Component
```
State: Idle
- Appearance: Solid background
- Border: Subtle
- Shadow: Minimal

State: Hover
- Scale: 1.02x
- Shadow: elevation-md
- Duration: 200ms
- Icon: Move right 4px

State: Active/Pressed
- Scale: 0.98x
- Shadow: inset
- Duration: 100ms

State: Disabled
- Opacity: 0.6
- Cursor: not-allowed
- No hover effects

State: Loading
- Opacity: 0.8
- Spinner: rotating
- Button text: hidden
- Disabled: true

State: Success
- Checkmark: appears with bounce
- Background: green
- Duration: 500ms total
```

### Input Field Component
```
State: Idle
- Border: gray-300
- Background: white
- Shadow: none

State: Focused
- Border: blue-600
- Shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
- Transition: 150ms

State: Valid
- Border: green-500
- Icon: checkmark appears
- Checkmark: animates in

State: Error
- Border: red-500
- Icon: warning appears
- Message: slides in from left
- Transition: 200ms ease-out

State: Filled
- Background: light-blue
- Value: fade in
```

### Card Component
```
State: Normal
- Shadow: small
- Border-radius: 8px
- Background: white/dark

State: Hover
- Shadow: large (elevation-lg)
- Transform: translateY(-4px)
- Duration: 200ms
- Cursor: pointer

State: Loading
- Skeleton: shimmer across card
- Content: hidden/opacity-30
- Height: maintains space

State: Expanded/Active
- Scale: 1.02x
- Shadow: elevation-xl
- Border: blue highlight
```

### Modal/Dialog Component
```
Entrance:
- Background overlay: fade in 200ms (0 → 0.5 opacity)
- Modal container: scale in 300ms (0.8 → 1 scale)
- Modal content: fade in 200ms delay-100ms
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1)

Overlay Click:
- Close animation: reverse order
- Duration: 200ms total

Exit:
- Content fade out: 100ms
- Modal scale out: 200ms
- Overlay fade out: 100ms
- Total: 300ms
```

### Carousel Component
```
Auto-play:
- Transition between slides: 500-700ms
- Pause on hover: immediately
- Resume: 300ms after mouse leave
- Easing: ease-in-out

Manual Navigation:
- Arrow click: immediate rotate + fade
- Duration: 300ms
- Easing: ease-out
- Prevent duplicate clicks: disable during transition

Indicators:
- Active dot: scale 1.3x
- Transition: 200ms
- Color change: smooth
```

### Form Component
```
Field Appearance:
- Entrance: fade in + slide from left (100ms stagger)
- Focus: glow effect (200ms)
- Error: shake animation (200ms total, 4 shakes)
- Success: checkmark animation + green (300ms)

Submission:
- Button: loading spinner (immediate)
- Form: opacity 0.6, disabled
- Fields: disabled
- Duration: until response

Result:
- Success: celebrate animation + toast
- Error: shake + error toast
- Both: 300-500ms duration
```

---

## 📱 MOBILE ANIMATION SPECIFICATIONS

### Touch Feedback
```
Button Press:
- Scale: 0.95x (instead of hover)
- Duration: 100ms
- Ripple: center outward
- Immediate response (no delay)

Card Tap:
- Scale: 0.98x
- Duration: 150ms
- Provide visual feedback
```

### Scroll Animations
```
Page Load:
- Reduced complexity (70% of desktop)
- Stagger: 75ms between items
- Duration: 500ms (instead of 600+ms)

Parallax:
- Disable on mobile entirely
- Or use 20% offset (instead of 30-50%)
- CPU intensive, skip

Scroll Triggers:
- Higher threshold (0.3 instead of 0.1)
- Slightly longer duration
- Reduced stagger
```

### Gestures
```
Swipe Left/Right:
- Carousel slide: 300ms
- Drawer open: 250ms
- Page transition: 400ms

Pinch/Zoom:
- Scale animation: follow gesture
- Momentum: ease-out deceleration
- Max scale: 3x

Long Press:
- Delay: 500ms
- Haptic feedback: if supported
- Action menu: slide in
```

### Performance Settings
```
Reduce Motion Query:
- Animations: instant or 200ms max
- Transitions: remove fade/slide
- Parallax: disable
- Particles: disable
- Stagger: remove
- Keep: essential feedback only
```

---

## 🎬 PAGE-SPECIFIC ANIMATION SEQUENCE

### HomePage Timeline
```
0ms:
  - Page load
  - Scroll progress bar: initialize

100ms:
  - Hero section: background fade in (1000ms)
  - Hero text: character reveal (char-by-char)

500ms:
  - Hero subtitle: fade in
  - Hero buttons: staggered entrance

1200ms:
  - Scroll indicator: bounce animation (continuous)

Scroll to Stats Section:
  - Background color: fade in (400ms)
  - Stat cards: staggered entrance (100ms stagger)
  - Counters: count up (2000ms each)

Scroll to Featured Vehicles:
  - Section title: fade in
  - Vehicle cards: staggered (150ms stagger)
  - Images: hover scale 1.15x on hover

Scroll to Services:
  - Service icons: rotate in (600ms)
  - Service descriptions: fade in with delay

Scroll to Testimonials:
  - Testimonial cards: slide in from sides (alternating)
  - Stars: animate fill (300ms)
  - Quotes: animate quote marks (400ms)

Bottom:
  - Footer: fade in on scroll into view
  - Social icons: appear with stagger
```

### InventoryPage Timeline
```
0ms:
  - Loading skeletons: appear
  - Shimmer animation: start

Data Arrives:
  - Skeletons: fade out (200ms)
  - Vehicle cards: fade in (300ms)
  - Stagger: 100ms between cards

User Filters:
  - Applied filters: bounce in
  - Old cards: scale out + fade (200ms)
  - Results counter: count down/up (500ms)
  - New cards: stagger in (100ms stagger)
  - Loading skeleton: reappear while fetching

Pagination:
  - Current page: fade out (200ms)
  - Next page: fade in (300ms)
  - Smooth scroll to top (500ms)
```

### VehicleDetailsPage Timeline
```
0ms:
  - Hero image: zoom in slow (1500ms)
  - Specs: fade in with stagger (100ms delay each)

Image Carousel:
  - Navigation: 3D flip effect (400ms)
  - Thumbnail hover: zoom (200ms)
  - Lightbox open: scale from thumbnail (300ms)

Specs Tabs:
  - Tab click: content crossfade (200ms)
  - Tab underline: slide to new tab (250ms)

EMI Calculator:
  - Input change: number counter animates
  - Result: reveal from bottom (300ms)

Related Vehicles:
  - Section: fade in on scroll
  - Cards: staggered entrance
  - Carousel: auto-play smooth
```

---

## 🚀 PERFORMANCE BENCHMARKS

### Target Metrics
```
Frames Per Second:
- Desktop: 60 FPS minimum
- Mobile: 30+ FPS acceptable
- Critical path: never drop below 24 FPS

Input Response:
- Button click: <50ms visual feedback
- Form input: <16ms keystroke response
- Scroll: <16ms per frame

Animation Quality:
- No jank or stutter
- Smooth curves, not steps
- Consistent timing
- No memory leaks
```

### GPU Acceleration
```
Use These (GPU Accelerated):
✓ transform (translate, scale, rotate)
✓ opacity
✓ filter

Avoid These (CPU Intensive):
✗ width/height changes
✗ left/right/top/bottom
✗ padding/margin
✗ border properties
✗ background-position
✗ box-shadow (heavy)
```

---

## 📋 ANIMATION CHECKLIST FOR EACH COMPONENT

When adding animation to component:
```
□ Purpose identified (why animate?)
□ Timing specified (how long?)
□ Easing chosen (how to move?)
□ Performance checked (60 FPS?)
□ Mobile optimized (slower/simpler?)
□ Accessibility tested (reduced-motion?)
□ Cross-browser tested
□ No memory leaks
□ User can't break it
□ Fallback for older browsers
□ Documentation added
□ Code reviewed
```

---

This reference guide is your north star for all animations! 🌟
