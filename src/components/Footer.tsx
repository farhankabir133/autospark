import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin, Car } from 'lucide-react';
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
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-950 text-gray-300' : 'bg-black text-gray-300'}`}>
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{t('site.title')}</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">{t('footer.description')}</p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-400'} transition-colors`}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-400'} transition-colors`}
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.quick_links')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`text-sm ${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-400'} transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('footer.contact_info')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-400'} flex-shrink-0 mt-0.5`} />
                <span className="text-sm">{t('contact.address')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-400'} flex-shrink-0`} />
                <a href="tel:+8801700000000" className={`text-sm ${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-400'} transition-colors`}>
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-400'} flex-shrink-0`} />
                <a href="mailto:info@autosparkbd.com" className={`text-sm ${theme === 'dark' ? 'hover:text-blue-300' : 'hover:text-blue-400'} transition-colors`}>
                  info@autosparkbd.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t('contact.hours')}</h3>
            <p className="text-sm mb-4">{t('contact.hours_value')}</p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t('contact.title')}
            </Link>
          </div>
        </div>

        <div className={`mt-12 pt-8 ${theme === 'dark' ? 'border-t border-gray-800' : 'border-t border-gray-700'} text-center`}>
          <p className="text-sm">
            &copy; {currentYear} {t('site.title')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
