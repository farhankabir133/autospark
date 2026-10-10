import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { GeoBanner } from './components/GeoBanner';
import { RouteFallback } from './components/RouteFallback';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const InventoryPage = lazy(() => import('./pages/InventoryPage').then(m => ({ default: m.InventoryPage })));
const VehicleDetailsPage = lazy(() => import('./pages/VehicleDetailsPage').then(m => ({ default: m.VehicleDetailsPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const AccessoriesPage = lazy(() => import('./pages/AccessoriesPage').then(m => ({ default: m.default })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.default })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const SellCarPage = lazy(() => import('./pages/SellCarPage').then(m => ({ default: m.SellCarPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const VehicleExperiencePage = lazy(() => import('./pages/VehicleExperiencePage').then(m => ({ default: m.VehicleExperiencePage })));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage').then(m => ({ default: m.TestimonialsPage })));
const ColorPreviewPage = lazy(() => import('./pages/ColorPreviewPage').then(m => ({ default: m.ColorPreviewPage })));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const InventoryManagementPage = lazy(() => import('./pages/InventoryManagementPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const PaymentFailPage = lazy(() => import('./pages/PaymentFailPage'));
const PaymentCancelPage = lazy(() => import('./pages/PaymentCancelPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
    <h1 className="text-6xl font-black text-[var(--brand-red,#C00000)] mb-2">404</h1>
    <p className="text-lg mb-4">Page not found</p>
    <a href="/" className="px-6 py-2 bg-[var(--brand-red,#C00000)] text-white rounded-lg">Go Home</a>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <ErrorBoundary>
            <Router>
              <ScrollToTop />
              <GeoBanner />
              <Layout>
                <Routes>
                  <Route path="/" element={<Suspense fallback={<RouteFallback />}><HomePage /></Suspense>} />
                  <Route path="/inventory" element={<Suspense fallback={<RouteFallback />}><InventoryPage /></Suspense>} />
                  <Route path="/vehicle/:id" element={<Suspense fallback={<RouteFallback />}><VehicleDetailsPage /></Suspense>} />
                  <Route path="/experience" element={<Suspense fallback={<RouteFallback />}><VehicleExperiencePage /></Suspense>} />
                  <Route path="/services" element={<Suspense fallback={<RouteFallback />}><ServicesPage /></Suspense>} />
                  <Route path="/accessories" element={<Suspense fallback={<RouteFallback />}><AccessoriesPage /></Suspense>} />
                  <Route path="/product/:id" element={<Suspense fallback={<RouteFallback />}><ProductDetailPage /></Suspense>} />
                  <Route path="/cart" element={<Suspense fallback={<RouteFallback />}><CartPage /></Suspense>} />
                  <Route path="/checkout" element={<Suspense fallback={<RouteFallback />}><CheckoutPage /></Suspense>} />
                  <Route path="/payment" element={<Navigate to="/checkout" replace />} />
                  <Route path="/inventory-management" element={<Suspense fallback={<RouteFallback />}><InventoryManagementPage /></Suspense>} />
                  <Route path="/about" element={<Suspense fallback={<RouteFallback />}><AboutPage /></Suspense>} />
                  <Route path="/testimonials" element={<Suspense fallback={<RouteFallback />}><TestimonialsPage /></Suspense>} />
                  <Route path="/sell" element={<Suspense fallback={<RouteFallback />}><SellCarPage /></Suspense>} />
                  <Route path="/contact" element={<Suspense fallback={<RouteFallback />}><ContactPage /></Suspense>} />
                  <Route path="/color-preview" element={<Suspense fallback={<RouteFallback />}><ColorPreviewPage /></Suspense>} />
                  <Route path="/payment-success" element={<Suspense fallback={<RouteFallback />}><PaymentSuccessPage /></Suspense>} />
                  <Route path="/payment-fail" element={<Suspense fallback={<RouteFallback />}><PaymentFailPage /></Suspense>} />
                  <Route path="/payment-cancel" element={<Suspense fallback={<RouteFallback />}><PaymentCancelPage /></Suspense>} />
                  <Route path="/payment/success" element={<Navigate to="/payment-success" replace />} />
                  <Route path="/payment/fail" element={<Navigate to="/payment-fail" replace />} />
                  <Route path="/payment/cancel" element={<Navigate to="/payment-cancel" replace />} />
                  <Route path="/thank-you" element={<Suspense fallback={<RouteFallback />}><ThankYouPage /></Suspense>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
          </ErrorBoundary>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
