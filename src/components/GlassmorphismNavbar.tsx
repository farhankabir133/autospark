import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Car, Moon, Sun, Globe, Phone, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { AudioManager } from '../utils/AudioManager';

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
    { to: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    AudioManager.playClick();
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const handleToggleTheme = () => {
    AudioManager.playClick();
    toggleTheme();
  };

  const handleNavClick = (to: string) => {
    AudioManager.playButtonClick();
    setActiveLink(to);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    AudioManager.playClick();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Animation variants
  const navbarContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2, ease: 'easeIn' },
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
    ? 'bg-gray-900/40 backdrop-blur-xl border border-gray-700/30'
    : 'bg-white/40 backdrop-blur-xl border border-white/30';

  const glassBackgroundScrolled = theme === 'dark'
    ? 'bg-gray-900/80 backdrop-blur-2xl border border-gray-700/40 shadow-2xl shadow-black/20'
    : 'bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-black/10';

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarContainerVariants}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* Glassmorphic background */}
      <div className={`${isScrolled ? glassBackgroundScrolled : glassBackground} transition-all duration-300`}>
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="flex items-center space-x-2 sm:space-x-3 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 group-hover:shadow-lg group-hover:shadow-blue-500/50'
                    : 'bg-gradient-to-br from-blue-600 to-cyan-600 group-hover:shadow-lg group-hover:shadow-blue-600/50'
                }`}>
                  <Car className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <span className={`text-lg sm:text-xl lg:text-2xl font-bold tracking-tight transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {t('site.title')}
                  </span>
                  <div className={`text-xs sm:hidden ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>
                    Premium Cars
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                      activeLink === link.to
                        ? theme === 'dark'
                          ? 'text-cyan-400'
                          : 'text-blue-600'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                    
                    {/* Active indicator with glassmorphism */}
                    {activeLink === link.to && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute inset-0 rounded-lg -z-10 ${
                          theme === 'dark'
                            ? 'bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30'
                            : 'bg-blue-500/20 backdrop-blur-md border border-blue-500/30'
                        }`}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Button - Desktop */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => AudioManager.playClick()}
                className={`hidden md:flex p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400'
                    : 'hover:bg-gray-100/50 text-gray-600 hover:text-blue-600'
                }`}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleTheme}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-yellow-400'
                    : 'hover:bg-gray-100/50 text-gray-800'
                }`}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.button>

              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className={`p-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700/50 text-cyan-400'
                    : 'hover:bg-gray-100/50 text-blue-600'
                }`}
                aria-label="Toggle language"
              >
                <Globe className="h-5 w-5" />
              </motion.button>

              {/* CTA Button - Desktop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => AudioManager.playButtonClick()}
                className={`hidden sm:flex px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/30'
                }`}
              >
                {t('nav.contact')}
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
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
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
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
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => handleNavClick(link.to)}
                        className={`block px-4 py-3 rounded-lg transition-all ${
                          activeLink === link.to
                            ? theme === 'dark'
                              ? 'bg-cyan-500/30 border border-cyan-500/50 text-cyan-400'
                              : 'bg-blue-500/30 border border-blue-500/50 text-blue-600'
                            : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700/30 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100/30 hover:text-gray-900'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile CTA Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    onClick={() => {
                      AudioManager.playButtonClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all mt-4 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                    }`}
                  >
                    {language === 'en' ? 'Book Test Drive' : 'টেস্ট ড্রাইভ বুক করুন'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Bottom gradient accent line */}
      <motion.div
        animate={{ opacity: isScrolled ? 0.5 : 0.3 }}
        transition={{ duration: 0.3 }}
        className={`h-px bg-gradient-to-r ${
          theme === 'dark'
            ? 'from-transparent via-cyan-500 to-transparent'
            : 'from-transparent via-blue-500 to-transparent'
        }`}
      />
    </motion.header>
  );
};
