import { useState } from 'react';
import { Upload, DollarSign, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

export const SellCarPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    mileage: 0,
    condition: 'good',
    description: '',
  });
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'idle' });

    // Client-side validation
    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.customerPhone.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(formData.customerPhone)) {
      setStatus({ type: 'error', message: 'Enter a valid Bangladesh mobile number (01XXXXXXXXX).' });
      return;
    }
    if (formData.vehicleYear < 1990 || formData.vehicleYear > new Date().getFullYear() + 1) {
      setStatus({ type: 'error', message: 'Enter a valid vehicle year.' });
      return;
    }
    if (formData.mileage < 0) {
      setStatus({ type: 'error', message: 'Mileage cannot be negative.' });
      return;
    }

    try {
      const { error } = await supabase.from('trade_in_requests').insert({
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        vehicle_brand: formData.vehicleBrand,
        vehicle_model: formData.vehicleModel,
        vehicle_year: formData.vehicleYear,
        mileage: formData.mileage,
        condition: formData.condition,
        description: formData.description,
        status: 'pending',
      });

      if (!error) {
        setStatus({ type: 'success', message: t('common.success') });
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleYear: new Date().getFullYear(),
          mileage: 0,
          condition: 'good',
          description: '',
        });
      } else {
        setStatus({ type: 'error', message: 'Submission failed. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Submission failed. Please try again later.' });
    }
  };

  return (
    <div className={`min-h-screen pt-20 ${theme === 'dark' ? 'bg-transparent' : 'bg-gray-50'}`}>
      <div className="bg-gradient-to-r from-[#0D0D0D] to-[#1a0a0a] text-white py-12 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t('sell.title')}</h1>
          <p className="text-lg sm:text-xl text-gray-300">{t('sell.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            {[
              {
                icon: DollarSign,
                title: language === 'en' ? 'Best Price' : 'সেরা মূল্য',
                description: language === 'en' ? 'Get the best value for your vehicle' : 'আপনার গাড়ির জন্য সেরা মূল্য পান',
              },
              {
                icon: Upload,
                title: language === 'en' ? 'Quick Process' : 'দ্রুত প্রক্রিয়া',
                description: language === 'en' ? 'Simple and fast evaluation' : 'সহজ এবং দ্রুত মূল্যায়ন',
              },
              {
                icon: CreditCard,
                title: language === 'en' ? 'Instant Payment' : 'তাৎক্ষণিক পেমেন্ট',
                description: language === 'en' ? 'Get paid immediately' : 'অবিলম্বে অর্থ প্রদান পান',
              },
            ].map((feature, index) => (
              <Card key={index} className={`p-4 sm:p-6 text-center ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
                <feature.icon className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 ${theme === 'dark' ? 'text-[#FF1A1A]' : 'text-[#C00000]'}`} />
                <h3 className={`text-base sm:text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
              </Card>
            ))}
          </div>

          <Card className={`p-4 sm:p-6 md:p-8 ${theme === 'dark' ? 'bg-black/30 backdrop-blur-sm border-gray-800' : ''}`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('sell.valuation')}
            </h2>
            {status.type !== 'idle' && (
              <div role="alert" className={`mb-4 p-3 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {status.type === 'success' ? <CheckCircle size={18} className="inline-block mr-2" /> : <AlertCircle size={18} className="inline-block mr-2" />}
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sell-name" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('form.name')} *
                  </label>
                  <input
                    id="sell-name"
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="sell-email" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('form.email')} *
                  </label>
                  <input
                    id="sell-email"
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="sell-phone" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.phone')} *
                </label>
                <input
                  id="sell-phone"
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="sell-brand" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('filter.brand')} *
                  </label>
                  <input
                    id="sell-brand"
                    type="text"
                    required
                    value={formData.vehicleBrand}
                    onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="sell-model" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('filter.model')} *
                  </label>
                  <input
                    id="sell-model"
                    type="text"
                    required
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                  />
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                  <label htmlFor="sell-year" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('vehicle.year')} *
                  </label>
                  <input
                    id="sell-year"
                    type="number"
                    required
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: parseInt(e.target.value) || 0 })}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sell-mileage" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('vehicle.mileage')} (km) *
                  </label>
                  <input
                    id="sell-mileage"
                    type="number"
                    required
                    min="0"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label htmlFor="sell-condition" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('vehicle.condition')} *
                  </label>
                  <select
                    id="sell-condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white' : 'border-gray-300'}`}
                  >
                    <option value="excellent">{language === 'en' ? 'Excellent' : 'চমৎকার'}</option>
                    <option value="good">{language === 'en' ? 'Good' : 'ভালো'}</option>
                    <option value="fair">{language === 'en' ? 'Fair' : 'মোটামুটি'}</option>
                    <option value="poor">{language === 'en' ? 'Poor' : 'খারাপ'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="sell-description" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t('form.message')}
                </label>
                <textarea
                  id="sell-description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === 'en' ? 'Tell us more about your vehicle...' : 'আপনার গাড়ি সম্পর্কে আরও বলুন...'}
                  className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#C00000] focus:border-transparent ${theme === 'dark' ? 'bg-black/50 border-gray-700 text-white placeholder-gray-500' : 'border-gray-300'}`}
                ></textarea>
              </div>

              <Button type="submit" size="lg" className="w-full">
                {t('sell.submit')}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
