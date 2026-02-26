import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Phone, MessageCircle, Calculator, Fuel, Settings, Calendar, Gauge } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import type { Vehicle } from '../types';
import { formatPrice, calculateEMI } from '../utils/format';

export const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  const [emiParams, setEmiParams] = useState({
    downPayment: 0,
    interestRate: 10,
    years: 5,
  });

  useEffect(() => {
    if (id) {
      fetchVehicle();
      incrementViewCount();
    }
  }, [id]);

  const fetchVehicle = async () => {
    const { data } = await supabase
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(*),
        features:vehicle_features(*)
      `)
      .eq('id', id)
      .single();

    if (data) {
      setVehicle(data);
    }
  };

  const incrementViewCount = async () => {
    await supabase.rpc('increment', { row_id: id });
  };

  const nextImage = () => {
    if (vehicle?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevImage = () => {
    if (vehicle?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };

  const calculateMonthlyEMI = () => {
    if (!vehicle) return 0;
    const loanAmount = vehicle.price - emiParams.downPayment;
    return calculateEMI(loanAmount, emiParams.interestRate, emiParams.years);
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const images = vehicle.images || [];
  const currentImage = images[currentImageIndex]?.image_url || 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1200';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <Link to="/inventory" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          {language === 'en' ? 'Back to Inventory' : 'ইনভেন্টরিতে ফিরে যান'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="relative rounded-lg overflow-hidden shadow-xl mb-4">
              <img
                src={currentImage}
                alt={`${vehicle.brand_name} ${vehicle.model}`}
                className="w-full h-96 object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-blue-600' : ''
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-sm text-gray-500 mb-2">
                {t('vehicle.stock')}: {vehicle.stock_number}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {vehicle.brand_name} {vehicle.model}
              </h1>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {formatPrice(vehicle.price, language)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">{t('vehicle.year')}</div>
                    <div className="font-semibold">{vehicle.year}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Gauge className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">{t('vehicle.mileage')}</div>
                    <div className="font-semibold">{vehicle.mileage.toLocaleString()} km</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Fuel className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">{t('vehicle.fuel')}</div>
                    <div className="font-semibold">{vehicle.fuel_type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">{t('vehicle.transmission')}</div>
                    <div className="font-semibold">{vehicle.transmission}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link to={`/reserve/${vehicle.id}`}>
                  <Button className="w-full" size="lg">
                    {t('vehicle.reserve')}
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:+8801700000000`}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{t('vehicle.contact')}</span>
                  </a>
                  <a
                    href={`https://wa.me/8801700000000?text=${encodeURIComponent(`I'm interested in ${vehicle.brand_name} ${vehicle.model}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{t('vehicle.whatsapp')}</span>
                  </a>
                </div>
                <button
                  onClick={() => setShowEMICalculator(!showEMICalculator)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                >
                  <Calculator className="h-5 w-5" />
                  <span>{t('vehicle.calculate_emi')}</span>
                </button>
              </div>
            </div>

            {showEMICalculator && (
              <Card className="mt-4 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'EMI Calculator' : 'ইএমআই ক্যালকুলেটর'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Down Payment' : 'ডাউন পেমেন্ট'}
                    </label>
                    <input
                      type="number"
                      value={emiParams.downPayment}
                      onChange={(e) => setEmiParams({ ...emiParams, downPayment: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Interest Rate (%)' : 'সুদের হার (%)'}
                    </label>
                    <input
                      type="number"
                      value={emiParams.interestRate}
                      onChange={(e) => setEmiParams({ ...emiParams, interestRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Loan Period (years)' : 'লোনের মেয়াদ (বছর)'}
                    </label>
                    <input
                      type="number"
                      value={emiParams.years}
                      onChange={(e) => setEmiParams({ ...emiParams, years: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">
                      {language === 'en' ? 'Monthly EMI' : 'মাসিক ইএমআই'}
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(calculateMonthlyEMI(), language)}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{language === 'en' ? 'Description' : 'বিবরণ'}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {language === 'en' ? vehicle.description_en : vehicle.description_bn || vehicle.description_en}
              </p>
            </Card>

            {vehicle.features && vehicle.features.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('vehicle.features')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">
                        {language === 'en' ? feature.feature_en : feature.feature_bn}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('vehicle.specifications')}</h2>
              <dl className="space-y-3">
                {[
                  { label: t('vehicle.year'), value: vehicle.year },
                  { label: t('filter.brand'), value: vehicle.brand_name },
                  { label: t('filter.model'), value: vehicle.model },
                  { label: t('vehicle.condition'), value: vehicle.condition },
                  { label: t('vehicle.fuel'), value: vehicle.fuel_type },
                  { label: t('vehicle.transmission'), value: vehicle.transmission },
                  { label: language === 'en' ? 'Engine' : 'ইঞ্জিন', value: vehicle.engine_capacity },
                  { label: language === 'en' ? 'Body Type' : 'বডি টাইপ', value: vehicle.body_type },
                  { label: language === 'en' ? 'Exterior Color' : 'বাহ্যিক রঙ', value: vehicle.color_exterior },
                  { label: language === 'en' ? 'Interior Color' : 'অভ্যন্তরীণ রঙ', value: vehicle.color_interior },
                ].map((spec) => spec.value && (
                  <div key={spec.label} className="flex justify-between py-2 border-b border-gray-200">
                    <dt className="text-gray-600">{spec.label}</dt>
                    <dd className="font-semibold text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
