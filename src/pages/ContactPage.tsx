import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const ContactPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  return (
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
          <Card className={`p-4 sm:p-6 text-center ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
            <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Visit Us' : 'আমাদের পরিদর্শন করুন'}
            </h3>
            <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('contact.address')}</p>
          </Card>

          <Card className={`p-4 sm:p-6 text-center ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
            <Phone className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Call Us' : 'কল করুন'}
            </h3>
            <a href="tel:+8801700000000" className="text-[#C00000] hover:text-[#FF1A1A] text-sm sm:text-base">
              +880 1700-000000
            </a>
          </Card>

          <Card className={`p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1 ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
            <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
            <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Email Us' : 'ইমেইল করুন'}
            </h3>
            <a href="mailto:info@autosparkbd.com" className="text-[#C00000] hover:text-[#FF1A1A] text-sm sm:text-base break-all">
              info@autosparkbd.com
            </a>
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
          </div>
        </div>
      </div>
    </div>
  );
};
