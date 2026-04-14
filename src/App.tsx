import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { SplashScreen } from './components/SplashScreen';

// Lazy load pages for better code splitting and performance
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const InventoryPage = lazy(() => import('./pages/InventoryPage').then(m => ({ default: m.InventoryPage })));
const VehicleDetailsPage = lazy(() => import('./pages/VehicleDetailsPage').then(m => ({ default: m.VehicleDetailsPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const AccessoriesPage = lazy(() => import('./pages/AccessoriesPage').then(m => ({ default: m.AccessoriesPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SellCarPage = lazy(() => import('./pages/SellCarPage').then(m => ({ default: m.SellCarPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const VehicleExperiencePage = lazy(() => import('./pages/VehicleExperiencePage').then(m => ({ default: m.VehicleExperiencePage })));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage').then(m => ({ default: m.TestimonialsPage })));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const PaymentFailPage = lazy(() => import('./pages/PaymentFailPage').then(m => ({ default: m.PaymentFailPage })));
const PaymentCancelPage = lazy(() => import('./pages/PaymentCancelPage').then(m => ({ default: m.PaymentCancelPage })));

// Minimal loading fallback to prevent CLS
const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#C00000] border-t-transparent rounded-full animate-spin" />
  </div>
);

// Use root for custom domain deployment
const basename = '/';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem('hasVisitedAutoSpark');
    if (hasVisited) {
      setIsFirstVisit(false);
      setShowSplash(false);
    } else {
      // FAIL-SAFE: Force-kill splash after 4s even if SplashScreen chunk fails to load
      // or onComplete never fires (prevents permanent black screen)
      const failSafe = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasVisitedAutoSpark', 'true');
      }, 4000);
      return () => clearTimeout(failSafe);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasVisitedAutoSpark', 'true');
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ErrorBoundary>
        <Router basename={basename}>
          <Layout>
            {/* Splash overlay — shown on first visit, auto-removed after duration */}
            {isFirstVisit && showSplash && (
              <SplashScreen onComplete={handleSplashComplete} duration={1200} />
            )}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
                <Route path="/experience" element={<VehicleExperiencePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/accessories" element={<AccessoriesPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/payment-fail" element={<PaymentFailPage />} />
                <Route path="/payment-cancel" element={<PaymentCancelPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/sell" element={<SellCarPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
        </ErrorBoundary>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
