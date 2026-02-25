import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const ContactPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-gray-300">
            {language === 'en' ? 'Visit our showroom or get in touch with us' : 'আমাদের শোরুম পরিদর্শন করুন বা আমাদের সাথে যোগাযোগ করুন'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Visit Us' : 'আমাদের পরিদর্শন করুন'}
            </h3>
            <p className="text-gray-600">{t('contact.address')}</p>
          </Card>

          <Card className="p-6 text-center">
            <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Call Us' : 'কল করুন'}
            </h3>
            <a href="tel:+8801700000000" className="text-blue-600 hover:text-blue-700">
              +880 1700-000000
            </a>
          </Card>

          <Card className="p-6 text-center">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Email Us' : 'ইমেইল করুন'}
            </h3>
            <a href="mailto:info@autosparkbd.com" className="text-blue-600 hover:text-blue-700">
              info@autosparkbd.com
            </a>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Send us a Message' : 'আমাদের একটি বার্তা পাঠান'}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.name')} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.email')} *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.message')} *
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                ></textarea>
              </div>
              <Button type="submit" className="w-full">
                {t('form.submit')}
              </Button>
            </form>
          </Card>

          <div>
            <Card className="p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-6 w-6 text-blue-600 mr-2" />
                {t('contact.hours')}
              </h3>
              <p className="text-gray-700">{t('contact.hours_value')}</p>
            </Card>

            <div className="rounded-lg overflow-hidden shadow-lg h-96">
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
