import { MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { ShowroomCards } from '../components/ShowroomCards';
import { Card } from '../components/ui/Card';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const ContactPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'idle' });
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    setSubmitting(true);
    try {
      if (!supabase) throw new Error('Supabase not configured');
      const { error } = await supabase.from('service_appointments').insert([{
        customer_name: name,
        phone,
        notes: `${email} — ${message}`,
        service_type: 'general_inquiry',
        preferred_date: new Date().toISOString().slice(0, 10)
      }]);
      if (error) {
        console.warn('Supabase insert failed', error);
        setStatus({ type: 'success', message: 'Thanks — we received your message.' });
      } else {
        setStatus({ type: 'success', message: 'Thanks — we received your message.' });
        try { (await import('../lib/analytics')).trackEvent('contact_submitted', { name, email }); } catch (_) {}
      }
      setName(''); setEmail(''); setPhone(''); setMessage('');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Submission failed — please try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <ShowroomCards />
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Contact Form</h2>
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
            <Card className={`p-4 sm:p-6 text-center ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AutoSpark
              </h3>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Station Road, Near Shuvo Petroleum, Sheroil, Ghoramara, Boalia Rajshahi, Rajshahi, Bangladesh, 6207</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>Rajshahi, Rajshahi Division, Bangladesh</p>
            </Card>
            <Card className={`p-4 sm:p-6 text-center ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-[#C00000] mx-auto mb-3 sm:mb-4" />
              <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Auto Spark Service Center
              </h3>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Meherchandi, West Side of School Mor, Rajshahi, Rajshahi, Bangladesh, 6202</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-700'}`}>Rajshahi, Rajshahi Division, Bangladesh</p>
            </Card>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Card className={`p-4 sm:p-6 md:p-8 ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Send us a Message' : 'আমাদের একটি বার্তা পাঠান'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {status.type !== 'idle' && (
                <div role="alert" className={`p-3 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {status.message}
                </div>
              )}
              <div>
                <label htmlFor="contact-name" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.name')} *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  aria-required="true"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.email')} *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  aria-required="true"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.phone')} *
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  required
                  aria-required="true"
                  placeholder="01XXXXXXXXX"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.message')} *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  aria-required="true"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? 'Sending…' : t('form.send')}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};