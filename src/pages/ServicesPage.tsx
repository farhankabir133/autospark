import { useState, useEffect } from 'react';
import { Wrench, Droplet, Wind, Battery, Radio, Settings, Calendar, Clock, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import type { ServiceType } from '../types';

export const ServicesPage = () => {
  const { t, language } = useLanguage();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicleBrand: '',
    vehicleModel: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const fetchServiceTypes = async () => {
    const { data } = await supabase
      .from('service_types')
      .select('*')
      .eq('is_active', true);

    if (data) setServiceTypes(data);
  };

  const handleBookService = (serviceId: string) => {
    setSelectedService(serviceId);
    setShowBooking(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('service_appointments').insert({
      service_type_id: selectedService,
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      vehicle_brand: formData.vehicleBrand,
      vehicle_model: formData.vehicleModel,
      appointment_date: formData.appointmentDate,
      appointment_time: formData.appointmentTime,
      notes: formData.notes,
      status: 'pending',
    });

    if (!error) {
      alert(t('booking.success'));
      setShowBooking(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        vehicleBrand: '',
        vehicleModel: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
      });
    }
  };

  const defaultServices = [
    { icon: Droplet, name_en: 'Oil Change', name_bn: 'অয়েল চেঞ্জ', description_en: 'Complete oil and filter replacement', description_bn: 'সম্পূর্ণ তেল এবং ফিল্টার প্রতিস্থাপন' },
    { icon: Wind, name_en: 'AC Service', name_bn: 'এসি সার্ভিস', description_en: 'Air conditioning maintenance and repair', description_bn: 'এয়ার কন্ডিশনিং রক্ষণাবেক্ষণ এবং মেরামত' },
    { icon: Settings, name_en: 'Diagnostics', name_bn: 'ডায়াগনস্টিকস', description_en: 'Complete vehicle system diagnostics', description_bn: 'সম্পূর্ণ গাড়ির সিস্টেম ডায়াগনস্টিকস' },
    { icon: Battery, name_en: 'Battery Service', name_bn: 'ব্যাটারি সার্ভিস', description_en: 'Battery testing and replacement', description_bn: 'ব্যাটারি পরীক্ষা এবং প্রতিস্থাপন' },
    { icon: Radio, name_en: 'Parking Sensors', name_bn: 'পার্কিং সেন্সর', description_en: 'Installation and calibration', description_bn: 'ইনস্টলেশন এবং ক্যালিব্রেশন' },
    { icon: Wrench, name_en: 'Engine Repair', name_bn: 'ইঞ্জিন মেরামত', description_en: 'Expert engine maintenance', description_bn: 'বিশেষজ্ঞ ইঞ্জিন রক্ষণাবেক্ষণ' },
  ];

  const displayServices = serviceTypes.length > 0 ? serviceTypes : defaultServices;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="relative bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4489737/pexels-photo-4489737.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('service.title')}</h1>
          <p className="text-xl text-gray-300">{t('service.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayServices.map((service, index) => {
            const Icon = 'icon' in service ? Wrench : (service as any).icon;
            return (
              <Card key={'id' in service ? service.id : index} hover className="p-6">
                <Icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? service.name_en : service.name_bn}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'en' ? service.description_en : service.description_bn}
                </p>
                <Button
                  onClick={() => handleBookService('id' in service ? service.id : '')}
                  className="w-full"
                >
                  {t('service.book')}
                </Button>
              </Card>
            );
          })}
        </div>

        <Card className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Check className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {language === 'en' ? 'Expert Technicians' : 'বিশেষজ্ঞ টেকনিশিয়ান'}
              </h3>
              <p className="text-blue-100">
                {language === 'en' ? 'Certified and experienced professionals' : 'সার্টিফাইড এবং অভিজ্ঞ পেশাদার'}
              </p>
            </div>
            <div>
              <Check className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {language === 'en' ? 'Quality Parts' : 'মানসম্পন্ন যন্ত্রাংশ'}
              </h3>
              <p className="text-blue-100">
                {language === 'en' ? 'Genuine and high-quality spare parts' : 'আসল এবং উচ্চমানের খুচরা যন্ত্রাংশ'}
              </p>
            </div>
            <div>
              <Check className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">
                {language === 'en' ? 'Warranty' : 'ওয়ারেন্টি'}
              </h3>
              <p className="text-blue-100">
                {language === 'en' ? 'Service warranty on all work' : 'সমস্ত কাজে সার্ভিস ওয়ারেন্টি'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {showBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('service.book')}</h2>
              <button
                onClick={() => setShowBooking(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Vehicle Brand' : 'গাড়ির ব্র্যান্ড'} *
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
                    {language === 'en' ? 'Vehicle Model' : 'গাড়ির মডেল'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    {t('booking.select_date')} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-2" />
                    {t('booking.select_time')} *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.message')}
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {t('booking.confirm')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBooking(false)}
                  className="flex-1"
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
