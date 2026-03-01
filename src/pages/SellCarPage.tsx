import { useState } from 'react';
import { Upload, DollarSign } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      alert(t('common.success'));
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('sell.title')}</h1>
          <p className="text-xl text-gray-300">{t('sell.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
                icon: DollarSign,
                title: language === 'en' ? 'Instant Payment' : 'তাৎক্ষণিক পেমেন্ট',
                description: language === 'en' ? 'Get paid immediately' : 'অবিলম্বে অর্থ প্রদান পান',
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center">
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('sell.valuation')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
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
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filter.brand')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleBrand}
                    onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filter.model')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vehicle.year')} *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: parseInt(e.target.value) })}
                    min="1990"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vehicle.mileage')} (km) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vehicle.condition')} *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="excellent">{language === 'en' ? 'Excellent' : 'চমৎকার'}</option>
                    <option value="good">{language === 'en' ? 'Good' : 'ভালো'}</option>
                    <option value="fair">{language === 'en' ? 'Fair' : 'মোটামুটি'}</option>
                    <option value="poor">{language === 'en' ? 'Poor' : 'খারাপ'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.message')}
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === 'en' ? 'Tell us more about your vehicle...' : 'আপনার গাড়ি সম্পর্কে আরও বলুন...'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
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
