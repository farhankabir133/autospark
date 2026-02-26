import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { InventoryPage } from './pages/InventoryPage';
import { VehicleDetailsPage } from './pages/VehicleDetailsPage';
import { ServicesPage } from './pages/ServicesPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { AboutPage } from './pages/AboutPage';
import { SellCarPage } from './pages/SellCarPage';
import { ContactPage } from './pages/ContactPage';

// GitHub Pages basename - use '/autospark' in production, '/' in development
const basename = import.meta.env.BASE_URL;

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router basename={basename}>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/accessories" element={<AccessoriesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/sell" element={<SellCarPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Layout>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
