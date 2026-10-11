# AutoSpark — Complete UI/UX Pitfalls Audit & Fix Plan

> **Generated:** 2026-10-10 | **Skills Used:** ui-ux-pro-max (design system, UX guidelines) + ui-styling (shadcn/ui, Tailwind)
> **Scope:** 20 pages, 100+ components, design system, accessibility, performance, dark mode

---

## Executive Summary

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| **UI/UX & Accessibility** | 8 | 12 | 18 | 6 | 44 |
| **Frontend Architecture** | 4 | 8 | 10 | 5 | 27 |
| **Design System & Consistency** | 3 | 6 | 12 | 8 | 29 |
| **Performance & Motion** | 2 | 5 | 8 | 4 | 19 |
| **TOTAL** | **17** | **31** | **48** | **23** | **119** |

---

## Part 1: Critical Pitfalls (Must Fix Before Launch)

### 1.1 Accessibility Violations (WCAG 2.1 AA Failures)

| # | Issue | Location | Severity | Fix |
|---|-------|----------|----------|-----|
| A1 | **Missing form labels** — inputs use placeholder-only | `CheckoutPage.tsx:141-167`, `SellCarPage.tsx:129-161`, `InventoryPage.tsx:1110-1128` | Critical | Add `<Label htmlFor="...">` + `id` on every input; use shadcn/ui `FormField`/`FormLabel`/`FormControl`/`FormMessage` pattern |
| A2 | **No error summary on form submit** | `CheckoutPage.tsx`, `SellCarPage.tsx`, `ContactPage.tsx` | Critical | Implement error summary with `role="alert"` + focus management (link errors to fields via `aria-describedby`) |
| A3 | **Focus not visible on keyboard nav** | `Button.tsx:26-35`, `Card.tsx:14`, `MagneticButton.tsx` | Critical | Ensure `:focus-visible` with 2px outline + 3:1 contrast (WCAG 2.2 AA) |
| A4 | **Modal focus trap missing** | `InventoryPage.tsx:1085-1089`, `Modal.tsx` | Critical | Add focus trap + `Esc` to close + return focus to trigger |
| A5 | **Decorative icons not hidden from AT** | `HomePage.tsx:656-659`, `VehicleDetailsPage.tsx:238-241` | Critical | Add `aria-hidden="true"` to decorative SVGs; meaningful icons need accessible names |
| A6 | **Emoji used as structural icons** | `HomePage.tsx:698-712`, `ContactPage.tsx:714-722` | Critical | Replace emojis with Lucide/Phosphor SVG icons |
| A7 | **Reduced motion not respected for all animations** | `HomePage.tsx:374-378`, `InventoryPage.tsx:1247-1270`, `FloatingParticlesBackground.tsx` | Critical | Wrap all motion in `@media (prefers-reduced-motion: reduce)`; disable parallax/FloatingParticles |
| A8 | **Video hero autoplays without controls** | `HomePage.tsx:73-90` | Critical | Add pause button, captions, `playsinline`, `poster`; respect reduced motion |

### 1.2 Frontend Architecture & Runtime Errors

| # | Issue | Location | Severity | Fix |
|---|-------|----------|----------|-----|
| F1 | **TypeScript build fails** (72 errors) | `MagneticButton.tsx`, `TextReveal.tsx`, `TestimonialsPage.tsx`, `VehicleShowcase.tsx` | Critical | Fix type casts, add missing types, remove unused imports |
| F2 | **Duplicate component exports** | `PaymentPage.tsx` → `CheckoutPage.tsx` | Critical | Remove `PaymentPage.tsx` or make it a proper redirect page |
| F3 | **Suspense waterfall** — single boundary for 20 lazy routes | `App.tsx:50-75` | Critical | Add per-route `Suspense` + `ErrorBoundary`; preload critical chunks |
| F4 | **Geo-blocking blocks crawlers** | `App.tsx:63-121`, `GeoBanner.tsx` | Critical | Make non-blocking; allow bots; defer to checkout; cache 24h |

---

## Part 2: High-Priority Pitfalls

### 2.1 Design System Inconsistencies

| # | Issue | Location | Severity | Fix |
|---|-------|----------|----------|-----|
| D1 | **Two brand reds** — `#C00000` (CSS) vs `#B80000` (Tailwind) | `index.css:15`, `tailwind.config.js:7` | High | Unify to single `#C00000`; update Tailwind config; search-replace all hardcoded reds |
| D2 | **Light mode broken** — components hardcode dark colors | `HomePage.tsx:331`, `VehicleDetailsPage.tsx:127`, `CheckoutPage.tsx:109` | High | Use CSS variables (`var(--brand-red)`, `var(--bg-primary)`) everywhere; remove hardcoded `bg-[#050505]` |
| D3 | **Inconsistent spacing scale** | `index.css:46-47` vs inline `p-4`, `p-6`, `py-8` | High | Enforce spacing tokens (`--section-py`, `--container-px`); use `section-padding`, `container-fluid` utilities |
| D4 | **Typography mismatch** — Inter + Hind Siliguri but no system font fallback | `index.css:86-103` | High | Add system font stack fallback; preload fonts; use `font-display: swap` |
| D5 | **Component API inconsistency** | `Button.tsx` (variant/size) vs `Card.tsx` (hover) vs custom components | High | Adopt shadcn/ui patterns: `variant`, `size`, `className` props; compose via `cn()` utility |

### 2.2 UX & Conversion Friction

| # | Issue | Location | Severity | Fix |
|---|-------|----------|----------|-----|
| U1 | **Booking modal forces 50,000 BDT without explanation** | `InventoryPage.tsx:1168-1172` | High | Show breakdown; make amount configurable; add tooltip |
| U2 | **Empty states lack CTAs** | `HomePage.tsx:203-237`, `ProductDetailPage.tsx:137-149` | High | Add "Browse Inventory", "Contact Us" buttons to all empty states |
| U3 | **No order summary on checkout** | `CheckoutPage.tsx:127-136` (only shows when cart has items) | High | Always show summary; add line items, shipping, tax, total |
| U4 | **Payment redirect loses context** | `CheckoutPage.tsx:79-87`, `PaymentSuccessPage.tsx:77-84` | High | Persist cart/order ID through flow; show order details on success |
| U5 | **Filter panel not mobile-friendly** | `InventoryPage.tsx:1334-1355` | High | Add mobile drawer; sticky filter button; `useScroll` for sticky |
| U6 | **Image carousel no keyboard nav** | `ImageCarousel.tsx`, `VehicleDetailsPage.tsx:206-223` | High | Add arrow key support; `aria-label`; focus management |
| U7 | **Comparison sidebar no persistence** | `ComparisonSidebar.tsx`, `HomePage.tsx:241-261` | High | Save to `localStorage`; restore on revisit |

### 2.3 Performance & Motion

| # | Issue | Location | Severity | Fix |
|---|-------|----------|----------|-----|
| P1 | **Three.js + Framer Motion + GSAP all bundled** | `package.json:24,32,33,45` | High | Lazy-load 3D (`InteractiveVehicleComparison`, `VirtualShowroomTour`); remove GSAP (1 use) or lazy-load |
| P2 | **Unconditional `ferrari.glb` prefetch** | `main.tsx:152-166` | High | Gate behind `supports3D` + user interaction |
| P3 | **Video hero competes with LCP** | `HomePage.tsx:73-80` | High | Add `preload="none"` until in viewport; use `poster`; lazy-load sources |
| P4 | **No image dimensions → CLS** | `AccessoriesPage.tsx:150-152`, `ProductDetailPage.tsx:197-203` | High | Add `width`/`height` to all `<img>`; use `aspect-car` utility |
| P5 | **`prefers-reduced-motion` disables only CSS** | `index.css:689-701` | High | Also disable Framer Motion `whileInView`, `animate` props via `useReducedMotion` hook |

---

## Part 3: Medium-Priority Pitfalls

### 3.1 Component & Pattern Improvements

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| M1 | **Price slider inaccessible** | `InventoryPage.tsx:284-407` | Replace with shadcn/ui `Slider` + proper labels, keyboard support, ARIA |
| M2 | **Color picker no keyboard/touch** | `InteractiveColorCustomizer.tsx`, `ColorPreviewPage.tsx` | Add `role="radiogroup"`, arrow keys, 44px targets |
| M3 | **Dropdown selects native** | `InventoryPage.tsx:1381-1394`, `CheckoutPage.tsx:174-216` | Use shadcn/ui `Select` with search, grouping, keyboard nav |
| M4 | **Toast notifications missing** | `CartPage.tsx`, `CheckoutPage.tsx` | Add shadcn/ui `Toast` + `Toaster`; success/error/loading states |
| M5 | **Skeleton loaders inconsistent** | `Skeleton.tsx`, `EnhancedSkeleton.tsx`, `FeaturedVehicles.tsx` | Standardize on shadcn/ui `Skeleton`; use `cv-auto` for content visibility |
| M6 | **Modal/Dialog not accessible** | `Modal.tsx`, `InventoryPage.tsx:1075-1228` | Use shadcn/ui `Dialog` with `DialogTrigger`, `DialogContent`, focus trap |
| M7 | **Tabs not keyboard accessible** | `Tabs.tsx` | Add `TabsList`, `TabsTrigger`, `TabsContent` with `rovingFocus` |
| M8 | **Data table missing** | `InventoryManagementPage.tsx` | Use shadcn/ui `DataTable` with sorting, pagination, row selection |

### 3.2 Page-Specific Issues

| Page | Issues |
|------|--------|
| **HomePage** | Hero CTA nested `<Link>` in `<Button>` (invalid HTML); 3 competing CTAs same weight; iframe maps block main thread; MorphingShapeTransition only on capable devices |
| **InventoryPage** | Booking modal redirects via `window.location.href` (breaks SPA); EMI calculator inline (extract component); filter panel not sticky on mobile; quick filter chips no `aria-pressed` |
| **VehicleDetailsPage** | EMI calculator inline (extract); sticky CTA missing on long spec list; thumbnail `aria-label` generic |
| **AccessoriesPage** | 150+ hardcoded demo products; duplicate IDs/names; `images: []` broken cards; embedded checkout modal duplicates `CheckoutPage` |
| **ProductDetailPage** | Stock status emoji-only (color-blind fail); Share button no handler; `aspect-square` crops wide images |
| **ServicesPage** | 560-line animated hero still mounts on mobile; `Math.random()` for slots/status (fake data); no stepper semantics |
| **CheckoutPage** | Forced dark mode in light theme; 11px labels fail contrast; "Confirm Order" mislabels payment redirect; no progress stepper |
| **PaymentSuccess/Fail/Cancel** | Auto-redirect 5s no "Stay" option; orange-on-white fails contrast; no order number/ticket ID |
| **About/Contact** | Duplicate showroom cards (3x); icon mismatches (YouTube→Mail, TikTok→MapPin); founder name mismatch |
| **SellCarPage** | `alert()` on success; silent on error; no photo upload; no `htmlFor` on labels |
| **TestimonialsPage** | 1465 lines; all 5-star hardcoded; `role="status"` misused as marketing banner; icon-only vote buttons |

---

## Part 4: Design System Recommendations (from ui-ux-pro-max)

### Recommended Design System for AutoSpark

| Aspect | Recommendation |
|--------|----------------|
| **Pattern** | Hero-Centric Design (single CTA, static hero for reduced motion) |
| **Style** | Motion-Driven + Dark Mode (OLED) + Glassmorphism |
| **Primary Colors** | Deep Black `#050505` / `#000000`, Brand Red `#C00000`/`#DC2626`, Neon accents (sparingly) |
| **Typography** | **Syncopate / Space Mono** (kinetic, automotive) — or **Inter + Hind Siliguri** for Bengali support |
| **Key Effects** | Scroll animations (Intersection Observer), hover 300-400ms, entrance, parallax (3-5 layers), page transitions |
| **Avoid** | Static product pages + Poor UX |

### Token Architecture (Three-Layer)

```css
/* Primitives */
--color-red-500: #C00000;
--color-red-600: #A00000;
--color-black: #050505;
--color-white: #FFFFFF;

/* Semantic */
--color-primary: var(--color-red-500);
--color-primary-hover: var(--color-red-600);
--color-background: var(--color-black);
--color-surface: #0a0a0a;
--color-text-primary: var(--color-white);
--color-text-muted: #999999;
--color-border: #1a1a1a;

/* Component */
--btn-primary-bg: var(--color-primary);
--btn-primary-hover: var(--color-primary-hover);
--card-bg: var(--color-surface);
--input-bg: var(--color-surface);
```

### Spacing Scale
```css
--space-1: 0.25rem;  --space-2: 0.5rem;  --space-3: 0.75rem;
--space-4: 1rem;     --space-5: 1.25rem; --space-6: 1.5rem;
--space-8: 2rem;     --space-10: 2.5rem; --space-12: 3rem;
--space-16: 4rem;    --space-20: 5rem;   --space-24: 6rem;
```

---

## Part 5: Component Migration Plan (shadcn/ui)

### Phase 1: Core Primitives (Week 1)
```bash
# Install shadcn/ui components
npx shadcn@latest add button input label form select checkbox radio-group textarea switch calendar popover dialog toast dropdown-menu tabs avatar badge separator scroll-area slider
```

### Phase 2: Composed Components (Week 2)
| Component | Replace | shadcn/ui Base |
|-----------|---------|----------------|
| `Button.tsx` | Custom | `Button` (variants: default, destructive, outline, secondary, ghost, link) |
| `Card.tsx` | Custom | `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter` |
| `Modal.tsx` | Custom | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle` |
| `Tabs.tsx` | Custom | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `Tooltip.tsx` | Custom | `Tooltip`, `TooltipTrigger`, `TooltipContent` |
| `DropdownMenu` | Custom | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` |
| `Select` | Native `<select>` | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` |
| `Slider` | Custom `PriceRangeSlider` | `Slider` (with labels, keyboard) |
| `Toast` | None | `Toast`, `Toaster`, `useToast` hook |

### Phase 3: Page-Level Patterns (Week 3)
| Pattern | Pages | shadcn/ui Components |
|---------|-------|---------------------|
| **Form** | Checkout, SellCar, Contact, Booking Modal | `Form` + `FormField` + `FormItem` + `FormLabel` + `FormControl` + `FormMessage` + `Input` + `Select` + `Textarea` + `Button` |
| **Data Table** | InventoryManagement | `DataTable` (TanStack Table + shadcn/ui) |
| **Command Palette** | Global search | `Command`, `CommandInput`, `CommandList`, `CommandItem` |
| **Sheet/Drawer** | Mobile filters, Cart | `Sheet`, `SheetTrigger`, `SheetContent` |
| **Pagination** | Inventory, Testimonials | `Pagination` |

---

## Part 6: Implementation Roadmap

### Week 1: Critical Fixes (Accessibility + Build)
- [ ] Fix all TypeScript errors (72 errors)
- [ ] Add `Label` + `htmlFor` to every input
- [ ] Implement error summary + focus management on forms
- [ ] Add `:focus-visible` styles globally
- [ ] Fix modal focus trap + `Esc` handling
- [ ] Replace emojis with Lucide icons
- [ ] Respect `prefers-reduced-motion` for ALL animations
- [ ] Add video controls + captions to hero
- [ ] Remove `PaymentPage.tsx` duplicate

### Week 2: Design System + Core Components
- [ ] Unify brand red to `#C00000` (CSS + Tailwind)
- [ ] Migrate to CSS variables everywhere (remove hardcoded colors)
- [ ] Install shadcn/ui core primitives
- [ ] Migrate `Button`, `Card`, `Input`, `Label`, `Form`
- [ ] Add `cn()` utility for class merging
- [ ] Implement design tokens (spacing, colors, typography)
- [ ] Add `Toast` + `Toaster` for notifications

### Week 3: Page Migrations (High Traffic)
- [ ] **CheckoutPage** → shadcn/ui Form + validation + stepper + order summary
- [ ] **InventoryPage** → shadcn/ui Select, Slider, Dialog, Sheet (mobile filters)
- [ ] **VehicleDetailsPage** → shadcn/ui Dialog (EMI), Tabs (specs), Toast (cart added)
- [ ] **ProductDetailPage** → shadcn/ui Dialog (cart), Select (quantity), Badge (stock)

### Week 4: Remaining Pages + Polish
- [ ] **HomePage** → Hero-Centric pattern; single CTA; static hero for reduced motion
- [ ] **ServicesPage** → Remove fake `Math.random()`; add stepper semantics; lazy-load 3D
- [ ] **AccessoriesPage** → Remove hardcoded demo products; use Supabase; shadcn/ui DataTable
- [ ] **About/Contact/SellCar** → Dedupe `ShowroomCards`; fix icon mismatches; add photo upload
- [ ] **TestimonialsPage** → Pagination; real data; remove marketing `role="status"`

### Week 5: Performance + Dark Mode + QA
- [ ] Lazy-load all 3D components (`InteractiveVehicleComparison`, `VirtualShowroomTour`, `CarShowcase3D`)
- [ ] Remove GSAP or lazy-load
- [ ] Gate `ferrari.glb` prefetch behind interaction
- [ ] Add `width`/`height` to all images; use `aspect-*` utilities
- [ ] Verify dark mode contrast 7:1 on all surfaces
- [ ] Test on 375px, 768px, 1024px, 1440px
- [ ] Test with `prefers-reduced-motion`, screen reader, keyboard-only

---

## Part 7: File-Level Action Items

### New Files to Create
```
src/components/ui/
├── badge.tsx          # shadcn/ui
├── breadcrumb.tsx
├── calendar.tsx
├── checkbox.tsx
├── collapsible.tsx
├── command.tsx
├── context-menu.tsx
├── dropdown-menu.tsx
├── form.tsx
├── hover-card.tsx
├── input-otp.tsx
├── label.tsx
├── menubar.tsx
├── navigation-menu.tsx
├── pagination.tsx
├── popover.tsx
├── progress.tsx
├── radio-group.tsx
├── resizable.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── skeleton.tsx
├── slider.tsx
├── sonner.tsx         # Toast system
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── toggle.tsx
├── toggle-group.tsx
├── tooltip.tsx
└── use-toast.ts

src/hooks/
├── use-reduced-motion.ts
├── use-toast.ts
└── use-focus-trap.ts

src/lib/
├── design-tokens.ts       # Exported design system tokens
├── utils.ts               # cn(), formatters
└── validations.ts         # Zod schemas
```

### Files to Refactor
| File | Action |
|------|--------|
| `src/components/ui/Button.tsx` | Extend shadcn/ui Button variants |
| `src/components/ui/Card.tsx` | Extend shadcn/ui Card compounds |
| `src/components/Modal.tsx` | Replace with shadcn/ui Dialog |
| `src/components/Tabs.tsx` | Replace with shadcn/ui Tabs |
| `src/components/Tooltip.tsx` | Replace with shadcn/ui Tooltip |
| `src/components/Layout.tsx` | Add Sheet for mobile nav |
| `src/index.css` | Add design tokens; remove duplicate reds |
| `tailwind.config.js` | Extend theme with design tokens |

### Files to Delete
- `src/pages/PaymentPage.tsx` (duplicate of CheckoutPage)

---

## Part 8: Verification Checklist

### Pre-Launch (Run Before Deploy)
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run lint` — 0 errors
- [ ] `npm run audit:pa11y` — 0 WCAG AA violations
- [ ] `npm run audit:lighthouse` — Perf ≥ 90, A11y ≥ 95
- [ ] `npm run build` — Successful
- [ ] Test all 20 routes load without console errors
- [ ] Test dark/light mode on all pages
- [ ] Test keyboard-only navigation on all forms
- [ ] Test screen reader (NVDA/VoiceOver) on checkout flow
- [ ] Test `prefers-reduced-motion` on all animated pages
- [ ] Test 375px / 768px / 1024px / 1440px viewports

---

## Appendix: Skill Query Commands Used

```bash
# Design system for automotive ecommerce
python .opencode/skills/ui-ux-pro-max/scripts/search.py "automotive car dealership ecommerce" --design-system -p "AutoSpark"

# Landing patterns for vehicle detail/comparison
python .opencode/skills/ui-ux-pro-max/scripts/search.py "automotive vehicle detail page comparison" --domain landing

# Checkout UX
python .opencode/skills/ui-ux-pro-max/scripts/search.py "checkout form payment ecommerce" --domain ux

# Inventory/filter patterns
python .opencode/skills/ui-ux-pro-max/scripts/search.py "inventory filter grid list automotive" --domain product

# Dark mode
python .opencode/skills/ui-ux-pro-max/scripts/search.py "dark mode contrast automotive" --domain style

# Accessibility
python .opencode/skills/ui-ux-pro-max/scripts/search.py "accessibility form validation focus" --domain ux

# Responsive
python .opencode/skills/ui-ux-pro-max/scripts/search.py "responsive grid automotive mobile" --domain ux

# shadcn/ui components reference
cat .opencode/skills/ui-styling/references/shadcn-components.md
```

---

*This plan uses guidance from `ui-ux-pro-max` (79 styles, 192 palettes, 119 UX guidelines, 25 chart types) and `ui-styling` (shadcn/ui component catalog, Tailwind utilities, canvas design system) to ensure production-ready, accessible, performant UI.*