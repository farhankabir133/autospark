import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export const Footer = () => {
  // Accessibility state
  const [highContrast, setHighContrast] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(1);
  const handleContrastToggle = () => setHighContrast((v) => !v);
  const handleFontSize = (delta: number) => setFontSize((s) => Math.max(1, s + delta));
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

  const showroom = {
    address: 'Station Road, Near Shuvo Petroleum, Sheroil, Ghoramara , Boalia Rajshahi , Rajshahi, Bangladesh, 6207',
    city: 'Rajshahi, Rajshahi Division, Bangladesh',
    website: 'autosparkbd.com',
    youtube: 'https://www.youtube.com/@autosparkbd1131',
    tiktok: 'www.tiktok.com/@auto_spark0',
    phone: '+880 1760-401605',
    email: 'autosparkbd@gmail.com',
    name: 'AutoSpark',
  };
  const serviceCenter = {
    address: 'Meherchandi, West Side of School Mor, Rajshahi, Rajshahi, Bangladesh, 6202',
    city: 'Rajshahi, Rajshahi Division, Bangladesh',
    website: 'autosparkbd.com',
    youtube: 'https://www.youtube.com/@autosparkbd1131',
    tiktok: 'http://www.tiktok.com/@easycareeasylife',
    phone: '+880 1321-233670',
    email: 'autosparkbd@gmail.com',
    name: 'Auto Spark Service Center',
  };
  return (
    <footer
      className={`relative z-20 ${theme === 'dark' ? 'bg-black/80 backdrop-blur-lg border-t border-gray-800/60' : 'bg-[#181818] border-t border-gray-800'} text-gray-300 font-inter transition-all duration-300 ${highContrast ? 'bg-yellow-900 text-yellow-200' : ''}`}
      style={{ fontSize: `${fontSize}em` }}
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-[#C00000]/60 to-transparent' : 'bg-gradient-to-r from-transparent via-[#C00000]/40 to-transparent'}`} />
      <div className="container mx-auto px-4 py-12">
        {/* Animated gradient/parallax background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-full bg-gradient-to-br from-[#C00000]/10 via-[#181818]/60 to-[#FF1A1A]/10 animate-gradientMove" />
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 z-10">
          {/* Brand & Info */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <img src="/autospark/logo/logoAS3.svg" alt="Auto Spark BD" className="h-20 w-20 drop-shadow-lg" width={80} height={80} />
              <span className="text-xl font-bold text-white tracking-tight">{t('site.title')}</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{t('footer.description')}</p>
            <div className="space-y-1">
              <span className="font-semibold text-xs text-[#C00000]">Showroom:</span>
              <div className="text-xs text-gray-300">{showroom.address}</div>
              <div className="text-xs text-gray-400">{showroom.city}</div>
              <div className="text-xs">Phone: <a href={`tel:${showroom.phone}`} className="underline hover:text-[#FF1A1A]">{showroom.phone}</a></div>
              <div className="text-xs">Email: <a href={`mailto:${showroom.email}`} className="underline hover:text-[#FF1A1A]">{showroom.email}</a></div>
              <div className="text-xs">Website: <a href={`https://${showroom.website}`} className="underline hover:text-[#FF1A1A]">{showroom.website}</a></div>
            </div>
            <div className="space-y-1 mt-2">
              <span className="font-semibold text-xs text-[#C00000]">Service Center:</span>
              <div className="text-xs text-gray-300">{serviceCenter.address}</div>
              <div className="text-xs text-gray-400">{serviceCenter.city}</div>
              <div className="text-xs">Phone: <a href={`tel:${serviceCenter.phone}`} className="underline hover:text-[#FF1A1A]">{serviceCenter.phone}</a></div>
              <div className="text-xs">Email: <a href={`mailto:${serviceCenter.email}`} className="underline hover:text-[#FF1A1A]">{serviceCenter.email}</a></div>
              <div className="text-xs">Website: <a href={`https://${serviceCenter.website}`} className="underline hover:text-[#FF1A1A]">{serviceCenter.website}</a></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide">{t('footer.quick_links')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`text-sm py-1 inline-block ${theme === 'dark' ? 'hover:text-[#FF1A1A]' : 'hover:text-[#C00000]'} transition-colors font-medium`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide">{t('contact.hours')}</h3>
            <p className="text-sm mb-4 text-gray-400">{t('contact.hours_value')}</p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-[#C00000] hover:bg-[#FF1A1A] text-white text-sm font-semibold rounded-lg transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(192,0,0,0.4)] flex items-center justify-center"
            >
              {t('contact.title')}
            </Link>
          </div>

          {/* Social & Media */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a href="https://www.facebook.com/autosparkbd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/autosparkbd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/@autosparkbd1131" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Mail className="w-6 h-6" />
              </a>
              <a href="https://www.tiktok.com/@auto_spark0" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <MapPin className="w-6 h-6" />
              </a>
              <a href={`tel:${showroom.phone}`} className="hover:text-[#FF1A1A]">
                <Phone className="w-6 h-6" />
              </a>
              <a href={`mailto:${showroom.email}`} className="hover:text-[#FF1A1A]">
                <Mail className="w-6 h-6" />
              </a>
              <a href={`https://${showroom.website}`} className="hover:text-[#FF1A1A]">
                <MapPin className="w-6 h-6" />
              </a>
            </div>
            {/* Awards/Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold border border-yellow-300">🏆 Award</span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold border border-blue-300">✔️ Verified</span>
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold border border-green-300">🛡️ Security</span>
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold border border-purple-300">📄 Certificate</span>
            </div>
            {/* Mini Gallery/Instagram Feed */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-white mb-2">Latest Gallery</h4>
              <div className="flex gap-2">
                <img src="https://images.pexels.com/photos/1409999/pexels-photo-1409999.jpeg?auto=compress&h=60&w=60" alt="Gallery1" className="rounded-lg h-10 w-10 object-cover" />
                <img src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&h=60&w=60" alt="Gallery2" className="rounded-lg h-10 w-10 object-cover" />
                <img src="https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg?auto=compress&h=60&w=60" alt="Gallery3" className="rounded-lg h-10 w-10 object-cover" />
                <img src="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&h=60&w=60" alt="Gallery4" className="rounded-lg h-10 w-10 object-cover" />
              </div>
            </div>
            {/* Accessibility Features */}
            <div className="flex gap-2 items-center mb-4">
              <button
                className="px-2 py-1 rounded bg-gray-700 text-xs text-white hover:bg-gray-900"
                onClick={handleContrastToggle}
                aria-label="Toggle high contrast"
              >
                High Contrast
              </button>
              <button
                className="px-2 py-1 rounded bg-gray-700 text-xs text-white hover:bg-gray-900"
                onClick={() => handleFontSize(0.1)}
                aria-label="Increase font size"
              >
                A+
              </button>
              <button
                className="px-2 py-1 rounded bg-gray-700 text-xs text-white hover:bg-gray-900"
                onClick={() => handleFontSize(-0.1)}
                aria-label="Decrease font size"
              >
                A-
              </button>
            </div>
            {/* Feedback Button */}
            <div>
              <a
                href="mailto:feedback@autosparkbd.com"
                className="inline-block px-4 py-2 bg-[#C00000] hover:bg-[#FF1A1A] text-white text-xs font-semibold rounded-lg transition-colors shadow-md"
                aria-label="Send feedback"
              >
                Feedback / Suggestions
              </a>
            </div>
          </div>
        </div>
        <div className={`mt-12 pt-6 border-t border-gray-700 text-center`}> 
          <p className="text-xs sm:text-sm text-gray-400">
            &copy; {currentYear} {t('site.title')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
