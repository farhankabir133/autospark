import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const ContactPage = () => {
  // Showroom and Service Center Details
  const showroom = {
    address: 'Station Road, Near Shuvo Petroleum, Sheroil, Ghoramara, Boalia Rajshahi, Rajshahi, Bangladesh, 6207',
    city: 'Rajshahi, Rajshahi Division, Bangladesh',
    website: 'autosparkbd.com',
    youtube: 'https://www.youtube.com/@autosparkbd1131',
    tiktok: 'https://www.tiktok.com/@auto_spark0',
    phone: '+880 1760-401605',
    email: 'autosparkbd@gmail.com',
    name: 'AutoSpark',
  logo: `${import.meta.env.BASE_URL}logo/logoAS3.svg`,
    awards: ['Award', 'Verified', 'Security', 'Certificate'],
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
  logo: `${import.meta.env.BASE_URL}logo/logoassc.svg`,
    awards: ['Award', 'Verified', 'Security', 'Certificate'],
  };
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div>
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Showroom & Service Center Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Showroom Card */}
          <Card className="p-6 flex flex-col items-center text-center shadow-lg bg-white dark:bg-gray-900">
            <img src={showroom.logo} alt="Showroom Logo" className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-bold text-[#C00000] mb-2">{showroom.name}</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{showroom.address}</div>
            <div className="text-xs text-gray-500 mb-2">{showroom.city}</div>
            {/* Phone, Email, Website removed as requested */}
            <div className="flex gap-4 mb-2">
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
            </div>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold border border-yellow-300">🏆 Award</span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold border border-blue-300">✔️ Verified</span>
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold border border-green-300">🛡️ Security</span>
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold border border-purple-300">📄 Certificate</span>
            </div>
          </Card>
          {/* Service Center Card */}
          <Card className="p-6 flex flex-col items-center text-center shadow-lg bg-white dark:bg-gray-900">
            <img src={serviceCenter.logo} alt="Service Center Logo" className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-bold text-[#C00000] mb-2">{serviceCenter.name}</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{serviceCenter.address}</div>
            <div className="text-xs text-gray-500 mb-2">{serviceCenter.city}</div>
            {/* Phone, Email, Website removed as requested */}
            <div className="flex gap-4 mb-2">
              <a href="https://www.facebook.com/autosparkbd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/autosparkbd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/@autosparkbd1131" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Mail className="w-6 h-6" />
              </a>
              <a href="http://www.tiktok.com/@easycareeasylife" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <MapPin className="w-6 h-6" />
              </a>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold border border-yellow-300">🏆 Award</span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold border border-blue-300">✔️ Verified</span>
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold border border-green-300">🛡️ Security</span>
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold border border-purple-300">📄 Certificate</span>
            </div>
          </Card>
        </div>
      </section>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-transparent' : 'bg-gray-50'} pt-20`}>
        <div className="bg-gradient-to-r from-[#0D0D0D] to-[#1a0a0a] text-white py-10 sm:py-12 md:py-16">
          <div className="container mx-auto px-3 sm:px-4 md:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">{t('contact.title')}</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              {language === 'en' ? 'Visit our showroom or get in touch with us' : 'আমাদের শোরুম পরিদর্শন করুন বা আমাদের সাথে যোগাযোগ করুন'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
            {/* Showroom Address Card */}
            <Card className={`p-4 sm:p-6 text-center ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> 
                {showroom.name}
              </h3>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{showroom.address}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>{showroom.city}</p>
            </Card>
            {/* Service Center Address Card */}
            <Card className={`p-4 sm:p-6 text-center ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> 
                {serviceCenter.name}
              </h3>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{serviceCenter.address}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>{serviceCenter.city}</p>
            </Card>
          </div>
        {/* Add Call Us and Email Us cards inside the main grid */}
        <Card className={`p-4 sm:p-6 text-center ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
          <Phone className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
          <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> 
            {language === 'en' ? 'Call Us' : 'কল করুন'}
          </h3>
          <div className="flex flex-col gap-1">
            <a href={`tel:+8801760401605`} className="text-[#C00000] hover:text-[#FF1A1A] text-sm sm:text-base font-semibold">Showroom: +880 1760-401605</a>
            <a href={`tel:+8801321233670`} className="text-[#C00000] hover:text-[#FF1A1A] text-sm sm:text-base font-semibold">Service Center: +880 1321-233670</a>
          </div>
        </Card>
        <Card className={`p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1 ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
          <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
          <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> 
            {language === 'en' ? 'Email Us' : 'ইমেইল করুন'}
          </h3>
          <div className="flex flex-col gap-1">
            <a href="mailto:autosparkbd@gmail.com" className="text-[#C00000] hover:text-[#FF1A1A] text-sm sm:text-base font-semibold break-all">Showroom: autosparkbd@gmail.com</a>
            <a href="mailto:autosparkbd@gmail.com" className="text-[#C00000] hover:text-[#FF1A1A] text-sm sm:text-base font-semibold break-all">Service Center: autosparkbd@gmail.com</a>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className={`p-4 sm:p-6 md:p-8 ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {language === 'en' ? 'Send us a Message' : 'আমাদের একটি বার্তা পাঠান'}
          </h2>
          <form className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.name')} *
                </label>
                <input
                  type="text"
                  required
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.email')} *
                </label>
                <input
                  type="email"
                  required
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.message')} *
                </label>
                <textarea
                  rows={5}
                  required
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                ></textarea>
              </div>
              <Button type="submit" className="w-full min-h-[44px]">
                {t('form.submit')}
              </Button>
            </form>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            <Card className={`p-4 sm:p-6 ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
              <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#C00000] mr-2" />
                {t('contact.hours')}
              </h3>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{t('contact.hours_value')}</p>
            </Card>

            <div className="space-y-6">
              {/* Showroom Map */}
              <div className="rounded-lg overflow-hidden shadow-lg h-64 sm:h-80 md:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.3846758707845!2d88.60447931496736!3d24.374532984292816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbefa96a38d031%3A0x10f93a950ed6b5f9!2sStation%20Road%2C%20Rajshahi!5e0!3m2!1sen!2sbd!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              {/* Service Center Map */}
              <div className="rounded-lg overflow-hidden shadow-lg h-64 sm:h-80 md:h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.3846758707845!2d88.6346711!3d24.3817492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbf17f21c0ee57:0x373f79532c58e48a!2sAuto+Spark+Service+Center!5e0!3m2!1sen!2sbd!4v1709999999999"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
