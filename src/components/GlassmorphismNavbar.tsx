import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Globe, Search } from 'lucide-react';
import { m, LazyMotion, domMax, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// Dynamic AudioManager — never imported synchronously in the critical path
const playClick = () => import('../utils/AudioManager').then(mod => mod.AudioManager.playClick());
const playButtonClick = () => import('../utils/AudioManager').then(mod => mod.AudioManager.playButtonClick());

export const GlassmorphismNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // Determine which logo to show based on current page
  const isServicesOrAccessories = location.pathname === '/services' || location.pathname === '/accessories';
  const currentLogo = isServicesOrAccessories 
  ? `${import.meta.env.BASE_URL}logo/logoassc.svg`
  : `${import.meta.env.BASE_URL}logo/logoAS3.svg`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/inventory', label: t('nav.inventory') },
    { to: '/experience', label: language === 'en' ? 'Experience' : 'অভিজ্ঞতা' },
    { to: '/services', label: t('nav.services') },
    { to: '/accessories', label: t('nav.accessories') },
    { to: '/about', label: t('nav.about') },
    { to: '/testimonials', label: t('nav.testimonials') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    playClick();
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const handleToggleTheme = () => {
    playClick();
    toggleTheme();
  };

  const handleNavClick = (to: string) => {
    playButtonClick();
    setActiveLink(to);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    playClick();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Animation variants
  const navbarContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2, ease: 'easeIn' as const },
    },
  };

  const navLinkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 },
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  };

  const glassBackground = theme === 'dark'
  ? 'bg-gray-900/40 backdrop-blur-xl border-b border-gray-700/30'
  : 'bg-white/40 backdrop-blur-xl border-b border-gray-200/30';

  const glassBackgroundScrolled = theme === 'dark'
  ? 'bg-gray-900/80 backdrop-blur-2xl border-b border-gray-700/40 shadow-2xl shadow-black/20'
  : 'bg-white/80 backdrop-blur-2xl border-b border-gray-200/40 shadow-2xl shadow-black/10';

  return (
    <LazyMotion features={domMax}>
    <m.header
      initial="hidden"
      animate="visible"
      variants={navbarContainerVariants}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* Glassmorphic background */}
      <div className={`${isScrolled ? glassBackgroundScrolled : glassBackground} transition-all duration-300`}>
        <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <m.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="flex items-center space-x-2 sm:space-x-3 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {/* Animated Logo Container */}
                <m.div 
                  className="relative"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Glow effect behind logo */}
                  <m.div
                    className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle, rgba(192, 0, 0, 0.7) 0%, rgba(255, 26, 26, 0.3) 50%, transparent 70%)',
                      transform: 'scale(2)'
                    }}
                  />
                  {/* Logo Image - Crystal clear zoomed view */}
                  <m.img
                    src={currentLogo}
                    alt="Auto Spark BD"
                    className="h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 relative z-10 drop-shadow-[0_0_8px_rgba(192,0,0,0.5)]"
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.2 
                    }}
                  />
                </m.div>
                <div>
                  <span className={`text-base sm:text-lg lg:text-xl font-bold tracking-tight transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('site.title')}
                  </span>
                  <div className={`text-xs sm:hidden ${theme === 'dark' ? 'text-[#FF1A1A]' : 'text-[#C00000]'}`}>
                    Premium Cars
                  </div>
                </div>
              </Link>
            </m.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-0.5">
              {navLinks.map((link, index) => (
                <m.div
                  key={link.to}
                  custom={index}
                  variants={navLinkVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="relative"
                >
                    <Link
                      to={link.to}
                      onClick={() => handleNavClick(link.to)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 relative outline-none focus:ring-2 focus:ring-blue-500 ${
                        activeLink === link.to
                          ? theme === 'dark'
                            ? 'text-[#FF1A1A]'
                            : 'text-[#C00000]'
                          : theme === 'dark'
                          ? 'text-gray-300 hover:text-white'
                          : 'text-gray-700 hover:text-gray-900'
                      }`}
                      aria-current={activeLink === link.to ? 'page' : undefined}
                    >
                      {link.label}
                      {/* Active indicator with glassmorphism */}
                      {activeLink === link.to && (
                        <m.div
                          layoutId="activeIndicator"
                          className={`absolute inset-0 rounded-lg -z-10 ${
                            theme === 'dark'
                              ? 'bg-[#C00000]/20 backdrop-blur-md border border-[#C00000]/30'
                              : 'bg-[#C00000]/10 backdrop-blur-md border border-[#C00000]/30'
                          }`}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </m.div>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search Button - Desktop */}
              <m.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playClick()}
                className={`hidden md:flex p-1.5 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-[#FF1A1A]'
                    : 'hover:bg-gray-100/50 text-gray-600 hover:text-[#C00000]'
                }`}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </m.button>

              {/* Theme Toggle */}
              <m.button
                whileHover={{ scale: 1.1, rotate: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleTheme}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-yellow-400'
                    : 'hover:bg-gray-100/50 text-gray-800'
                }`}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </m.button>

              {/* Language Toggle */}
              <m.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-[#FF1A1A]'
                    : 'hover:bg-gray-100/50 text-[#C00000]'
                }`}
                aria-label="Toggle language"
              >
                <Globe className="h-4 w-4" />
              </m.button>

              {/* CTA Button - Desktop */}
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playButtonClick()}
                className={`hidden sm:flex px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-[#C00000] to-[#FF1A1A] hover:from-[#8B0000] hover:to-[#C00000] text-white shadow-lg shadow-[#C00000]/30'
                    : 'bg-gradient-to-r from-[#C00000] to-[#8B0000] hover:from-[#8B0000] hover:to-[#600000] text-white shadow-lg shadow-[#C00000]/30'
                }`}
              >
                {t('nav.contact')}
              </m.button>

              {/* Mobile Menu Button */}
              <m.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMobileMenuToggle}
                className={`lg:hidden p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-gray-400'
                    : 'hover:bg-gray-100/50 text-gray-600'
                }`}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <m.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </m.div>
                  ) : (
                    <m.div
                      key="open"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </m.div>
                  )}
                </AnimatePresence>
              </m.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <m.div
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="lg:hidden mt-4"
              >
                <div className={`space-y-2 p-4 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/30'
                    : 'bg-white/50 backdrop-blur-md border border-white/30'
                }`}>
                  {/* Mobile Navigation Links */}
                  {navLinks.map((link, index) => (
                    <m.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => handleNavClick(link.to)}
                        className={`block px-4 py-4 rounded-lg transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                          activeLink === link.to
                            ? theme === 'dark'
                              ? 'bg-[#C00000]/30 border border-[#C00000]/50 text-[#FF1A1A]'
                              : 'bg-[#C00000]/20 border border-[#C00000]/50 text-[#C00000]'
                            : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700/30 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100/30 hover:text-gray-900'
                        }`}
                        aria-current={activeLink === link.to ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </m.div>
                  ))}

                  {/* Mobile CTA Button */}
                  <m.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    onClick={() => {
                      playButtonClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all mt-4 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-[#C00000] to-[#FF1A1A] hover:from-[#8B0000] hover:to-[#C00000] text-white'
                        : 'bg-gradient-to-r from-[#C00000] to-[#8B0000] hover:from-[#8B0000] hover:to-[#600000] text-white'
                    }`}
                  >
                    {language === 'en' ? 'Book Test Drive' : 'টেস্ট ড্রাইভ বুক করুন'}
                  </m.button>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Bottom gradient accent line */}
      <m.div
        animate={{ opacity: isScrolled ? 0.5 : 0.3 }}
        transition={{ duration: 0.3 }}
        className={`h-px bg-gradient-to-r ${
          theme === 'dark'
            ? 'from-transparent via-[#C00000] to-transparent'
            : 'from-transparent via-[#C00000] to-transparent'
        }`}
      />
    </m.header>
    </LazyMotion>
  );
};
