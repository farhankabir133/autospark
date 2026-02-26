# 💻 CODE EXAMPLES & SNIPPETS
## Auto Spark BD - Ready-to-Use Implementations

---

## 🎬 QUICK CODE EXAMPLES

### Example 1: Toast Notification System

#### Installation:
```bash
npm install react-hot-toast
```

#### Usage Throughout App:
```tsx
// In ContactPage.tsx or any form
import { useState } from 'react';
import toast from 'react-hot-toast';

export const ContactPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // API call here
      const response = await submitForm(formData);
      
      // Success toast
      toast.success('Message sent successfully! We\'ll get back to you soon.', {
        duration: 4000,
        position: 'top-center',
        icon: '✉️',
      });
      
      // Reset form
      setFormData({ /* reset */ });
    } catch (error) {
      // Error toast
      toast.error('Failed to send message. Please try again.', {
        duration: 4000,
        position: 'top-center',
        icon: '❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
};
```

#### Toast Types:
```tsx
// Success
toast.success('Vehicle added to favorites!');

// Error
toast.error('Failed to add vehicle');

// Loading
const toastId = toast.loading('Processing...');
// Later: toast.success('Done!', { id: toastId });

// Custom
toast.custom((t) => (
  <div className="bg-blue-500 text-white p-4 rounded">
    Custom notification
  </div>
));

// Promise-based (for async)
toast.promise(
  fetchData(),
  {
    loading: 'Loading data...',
    success: 'Data loaded!',
    error: 'Failed to load data'
  }
);
```

---

### Example 2: Scroll Progress Bar

#### Create: `/src/components/ScrollProgressBar.tsx`
```tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50"
      style={{ width: `${progress}%` }}
      initial={{ width: '0%' }}
      transition={{ type: 'tween', duration: 0 }}
    />
  );
};
```

#### Add to Layout.tsx:
```tsx
import { ScrollProgressBar } from './ScrollProgressBar';

export const Layout = ({ children }) => {
  return (
    <>
      <ScrollProgressBar />
      <Header />
      {children}
      <Footer />
    </>
  );
};
```

---

### Example 3: Loading Skeleton Component

#### Create: `/src/components/skeletons/VehicleCardSkeleton.tsx`
```tsx
import { motion } from 'framer-motion';

export const VehicleCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md p-4">
      {/* Image skeleton */}
      <motion.div
        className="h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mb-4"
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
        }}
        style={{
          backgroundSize: '200% 100%',
        }}
      />

      {/* Title skeleton */}
      <motion.div
        className="h-6 bg-gray-200 rounded mb-3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Price skeleton */}
      <motion.div
        className="h-5 bg-gray-200 rounded w-1/3 mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Description skeleton */}
      <motion.div className="space-y-2">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-4 bg-gray-200 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Usage in InventoryPage.tsx
const [loading, setLoading] = useState(true);

return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {loading ? (
      <>
        <VehicleCardSkeleton />
        <VehicleCardSkeleton />
        <VehicleCardSkeleton />
      </>
    ) : (
      // Actual vehicles
    )}
  </div>
);
```

---

### Example 4: Enhanced Button with Animations

#### Create: `/src/components/ui/EnhancedButton.tsx`
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface EnhancedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: ReactNode;
}

export const EnhancedButton = ({
  children,
  onClick,
  isLoading = false,
  isSuccess = false,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
}: EnhancedButtonProps) => {
  const baseStyles = 'font-semibold rounded-lg transition-all relative overflow-hidden';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading || isSuccess}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={!isLoading && !isSuccess ? { y: -2 } : {}}
      whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        initial={{ opacity: 0, scale: 0 }}
        whileTap={{ opacity: 0.3, scale: 2 }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <motion.div
        className="relative flex items-center justify-center gap-2"
        initial={{ opacity: 1 }}
        animate={isLoading ? { opacity: 0 } : { opacity: 1 }}
      >
        {icon && <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1, repeat: Infinity }}>
          {icon}
        </motion.span>}
        {children}
      </motion.div>

      {/* Loading spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success checkmark */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
```

---

### Example 5: Form Validation with Animations

#### Using React Hook Form:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Define schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[0-9]{10,}/, 'Invalid phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur', // Validate on blur
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Submit to backend
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name field */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium mb-2">Name</label>
        <motion.input
          {...register('name')}
          className={`w-full px-4 py-2 rounded-lg border transition-all ${
            errors.name 
              ? 'border-red-500 focus:ring-2 focus:ring-red-300' 
              : 'border-gray-300 focus:ring-2 focus:ring-blue-300'
          }`}
          whileFocus={{ scale: 1.01 }}
        />
        {errors.name && (
          <motion.p
            className="text-red-500 text-sm mt-1 flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            ❌ {errors.name.message}
          </motion.p>
        )}
      </motion.div>

      {/* Email field */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium mb-2">Email</label>
        <motion.input
          {...register('email')}
          type="email"
          className={`w-full px-4 py-2 rounded-lg border transition-all ${
            errors.email 
              ? 'border-red-500 focus:ring-2 focus:ring-red-300' 
              : 'border-gray-300 focus:ring-2 focus:ring-blue-300'
          }`}
          whileFocus={{ scale: 1.01 }}
        />
        {errors.email && (
          <motion.p
            className="text-red-500 text-sm mt-1 flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            ❌ {errors.email.message}
          </motion.p>
        )}
      </motion.div>

      {/* Submit button */}
      <motion.button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
        whileHover={{ backgroundColor: '#1d4ed8' }}
        whileTap={{ scale: 0.98 }}
      >
        Send Message
      </motion.button>
    </form>
  );
};
```

---

### Example 6: Enhanced Hero Section

#### Parallel Sections in HomePage.tsx:
```tsx
export const HomePage = () => {
  return (
    <>
      {/* ENHANCED HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Base image */}
          <img
            src="hero-bg.jpg"
            className="w-full h-full object-cover"
            alt="Hero background"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`absolute w-96 h-96 rounded-full blur-3xl opacity-10 ${
                i % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'
              }`}
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                left: `${i * 30}%`,
                top: `${i * 20}%`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div className="relative z-10 text-center text-white container mx-auto px-4">
          {/* Animated title with char reveal */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {t('hero.title').split('').map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.05,
                  delay: 0.05 * idx,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-100 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons with stagger */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 1 }}
          >
            {[
              { label: 'Browse Inventory', to: '/inventory' },
              { label: 'Book Service', to: '/services' },
              { label: 'Sell Your Car', to: '/sell' },
            ].map((btn, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={btn.to}>
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                    {btn.label}
                  </button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.button>
      </section>
    </>
  );
};
```

---

### Example 7: Staggered List Animation

#### Reusable Component:
```tsx
import { motion } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  direction = 'up',
}: StaggerContainerProps) => {
  const getInitialState = () => {
    switch (direction) {
      case 'left':
        return { opacity: 0, x: -50 };
      case 'right':
        return { opacity: 0, x: 50 };
      case 'down':
        return { opacity: 0, y: -50 };
      case 'up':
      default:
        return { opacity: 0, y: 50 };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: getInitialState(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {React.Children.map(children, (child, idx) => (
        <motion.div key={idx} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Usage:
<StaggerContainer staggerDelay={0.1} direction="up">
  <Card>Featured Vehicle 1</Card>
  <Card>Featured Vehicle 2</Card>
  <Card>Featured Vehicle 3</Card>
</StaggerContainer>
```

---

### Example 8: Page Transition Wrapper

#### Create: `/src/components/PageTransition.tsx`
```tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Usage in pages:
export const HomePage = () => {
  return (
    <PageTransition>
      {/* Page content */}
    </PageTransition>
  );
};
```

---

## 🎯 ANIMATION TIMING REFERENCE

### Recommended Durations:
```
- Micro-interactions: 150-200ms
- Button hover: 200-300ms
- Page transitions: 300-500ms
- Scroll animations: 500-800ms
- Modal entrance: 300-400ms
- Loading spinner: 1000-2000ms loop
```

### Easing Functions:
```
- Entrance: easeOut, easeInOut
- Exit: easeIn
- Continuous: linear
- Bounce: spring (stiffness: 100-400)
- Quick: easeIn 150-200ms
- Smooth: easeInOut 300-500ms
```

---

## 📊 PERFORMANCE CHECKLIST

Before considering animations "done":
- [ ] 60 FPS on desktop
- [ ] 30+ FPS on mobile
- [ ] < 3s time to interactive
- [ ] < 100ms input response time
- [ ] No layout shifts during animations
- [ ] GPU accelerated (transform, opacity only)
- [ ] Respects `prefers-reduced-motion`
- [ ] Mobile animations simplified
- [ ] Animations preload early
- [ ] No memory leaks from intervals/observers

---

This is your complete toolkit to transform your website from good to extraordinary! 🚀
