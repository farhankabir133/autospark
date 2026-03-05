import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/inventory', label: t('nav.inventory') },
    { to: '/services', label: t('nav.services') },
    { to: '/accessories', label: t('nav.accessories') },
    { to: '/about', label: t('nav.about') },
    { to: '/testimonials', label: t('nav.testimonials') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className={`relative z-20 ${theme === 'dark' ? 'bg-black/60 backdrop-blur-md border-t border-gray-800/50' : 'bg-[#0D0D0D] border-t border-gray-800'} text-gray-300`}>
      {/* Subtle red glow at top of footer */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#C00000]/50 to-transparent' : 'bg-gradient-to-r from-transparent via-[#C00000]/30 to-transparent'}`} />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          <div className="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              {/* Logo Image */}
              <img 
                src={`${import.meta.env.BASE_URL}logo/as.svg`}
                alt="Auto Spark BD" 
                className="h-10 w-10 sm:h-12 sm:w-12 drop-shadow-lg"
                width={48}
                height={48}
              />
              <span className="text-lg sm:text-xl font-bold text-white">{t('site.title')}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{t('footer.description')}</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:text-[#FF1A1A] hover:bg-white/5' : 'hover:text-[#C00000]'} transition-colors`}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:text-[#FF1A1A] hover:bg-white/5' : 'hover:text-[#C00000]'} transition-colors`}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">{t('footer.quick_links')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`text-xs sm:text-sm py-1 inline-block ${theme === 'dark' ? 'hover:text-[#FF1A1A]' : 'hover:text-[#C00000]'} transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">{t('footer.contact_info')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'dark' ? 'text-[#FF1A1A]' : 'text-[#C00000]'} flex-shrink-0 mt-0.5`} />
                <span className="text-xs sm:text-sm">{t('contact.address')}</span>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3">
                <Phone className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'dark' ? 'text-[#FF1A1A]' : 'text-[#C00000]'} flex-shrink-0`} />
                <a href="tel:+8801700000000" className={`text-xs sm:text-sm ${theme === 'dark' ? 'hover:text-[#FF1A1A]' : 'hover:text-[#C00000]'} transition-colors`}>
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3">
                <Mail className={`h-4 w-4 sm:h-5 sm:w-5 ${theme === 'dark' ? 'text-[#FF1A1A]' : 'text-[#C00000]'} flex-shrink-0`} />
                <a href="mailto:info@autosparkbd.com" className={`text-xs sm:text-sm break-all ${theme === 'dark' ? 'hover:text-[#FF1A1A]' : 'hover:text-[#C00000]'} transition-colors`}>
                  info@autosparkbd.com
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-white font-semibold text-base sm:text-lg mb-3 sm:mb-4">{t('contact.hours')}</h3>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4">{t('contact.hours_value')}</p>
            <Link
              to="/contact"
              className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-[#C00000] hover:bg-[#FF1A1A] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(192,0,0,0.4)] min-h-[44px] flex items-center justify-center"
            >
              {t('contact.title')}
            </Link>
          </div>
        </div>

        <div className={`mt-8 sm:mt-12 pt-6 sm:pt-8 ${theme === 'dark' ? 'border-t border-gray-800' : 'border-t border-gray-700'} text-center`}>
          <p className="text-xs sm:text-sm">
            &copy; {currentYear} {t('site.title')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
