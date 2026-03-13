# Auto Spark BD - Premium Car Dealership Website

A production-ready, bilingual (English + Bengali) luxury car dealership website built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Core Functionality
- **Bilingual Support**: Seamless language switching between English and Bengali
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Performance Optimized**: Fast loading with lazy loading, code splitting, and optimized images

### Pages & Features

#### 1. Home Page
- Full-screen hero section with call-to-actions
- Statistics showcase
- Featured vehicles carousel
- Customer testimonials
- Service highlights

#### 2. Inventory Page
- Dynamic vehicle listing with grid/list views
- Advanced filtering system:
  - Brand, Model, Year
  - Price range slider
  - Fuel type, Transmission
  - Real-time AJAX filtering
- Vehicle cards with images, specs, and pricing

#### 3. Vehicle Details Page
- Image gallery with navigation
- Complete vehicle specifications
- EMI Calculator
- WhatsApp & Phone quick contact
- Reserve vehicle functionality
- Features list

#### 4. Service Center
- Multi-step service booking system
- Service types:
  - Oil Change
  - AC Service
  - Diagnostics
  - Battery Replacement
  - Parking Sensors
  - Engine Repair
- Calendar-based appointment scheduling
- Real-time availability

#### 5. Accessories & Parts E-Commerce
- Product catalog with categories
- Search and filter functionality
- Shopping cart system
- Stock status indicators
- Add to cart functionality

#### 6. Sell Your Car
- Vehicle valuation form
- Trade-in request system
- Photo upload capability
- Instant submission to admin

#### 7. About Page
- Company history and story
- Core values showcase
- Statistics display
- Brand positioning

#### 8. Contact Page
- Contact information display
- Interactive Google Maps integration
- Contact form
- Business hours
- Click-to-call and email links

### Design Elements
- **Color Palette**: Matte Black, Electric Blue accents, White backgrounds
- **Typography**: Inter for English, Hind Siliguri for Bengali
- **Animations**: Smooth fade-ins, hover effects, transitions
- **UI Components**: Custom buttons, cards, forms with consistent styling

### Technical Features
- **Database**: Supabase with comprehensive schema
- **Authentication Ready**: RLS policies configured
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context for language switching
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom utilities

## Database Schema

### Tables
- `vehicles` - Vehicle inventory management
- `vehicle_images` - Multiple images per vehicle
- `vehicle_features` - Feature lists
- `products` - Accessories and parts
- `product_images` - Product image gallery
- `service_types` - Available services
- `service_appointments` - Service bookings
- `car_reservations` - Vehicle purchase reservations
- `trade_in_requests` - Sell car submissions
- `testimonials` - Customer reviews
- `blog_posts` - SEO content
- `brands` - Car brands
- `cart_items` - Shopping cart
- `orders` - Order management
- `order_items` - Order details

All tables include Row Level Security (RLS) policies for data protection.

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Configuration

### Customization Points

1. **Contact Information**:
   - Update phone numbers in `Header.tsx`, `Footer.tsx`, `ContactPage.tsx`
   - Update email addresses in `Footer.tsx`, `ContactPage.tsx`
   - Update address in `Footer.tsx`, `ContactPage.tsx`

2. **WhatsApp Integration**:
   - Update WhatsApp number in `Layout.tsx` and `VehicleDetailsPage.tsx`

3. **Google Maps**:
   - Update coordinates in `ContactPage.tsx`

4. **Translations**:
   - Add/modify translations in `contexts/LanguageContext.tsx`

5. **Styling**:
   - Modify colors in `tailwind.config.js` or component files
   - Update fonts in `index.css`

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Footer with links
│   └── Layout.tsx       # Main layout wrapper
├── contexts/
│   └── LanguageContext.tsx  # Bilingual support
├── lib/
│   └── supabase.ts      # Supabase client
├── pages/
│   ├── HomePage.tsx
│   ├── InventoryPage.tsx
│   ├── VehicleDetailsPage.tsx
│   ├── ServicesPage.tsx
│   ├── AccessoriesPage.tsx
│   ├── AboutPage.tsx
│   ├── SellCarPage.tsx
│   └── ContactPage.tsx
├── types/
│   └── index.ts         # TypeScript definitions
├── utils/
│   └── format.ts        # Helper functions
├── App.tsx              # Main app with routing
├── main.tsx             # App entry point
└── index.css            # Global styles
```

## Performance Optimizations

- Image lazy loading
- Code splitting with dynamic imports
- Optimized bundle size
- Bengali font subsetting
- CSS purging for production
- Minification of JS and CSS

## SEO Features

- Comprehensive meta tags
- Open Graph tags for social sharing
- Twitter Card support
- Semantic HTML structure
- Structured data ready
- Mobile-friendly design
- Fast page load times

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Auto Spark BD

## Support

For support, contact: info@autosparkbd.com
