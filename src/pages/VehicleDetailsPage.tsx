import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Phone, MessageCircle, Calculator, Fuel, Settings, Calendar, Gauge } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { ALL_VEHICLES } from '../hooks/vehicleDataAll';
import { carSlides } from '../data/carSlides';
import type { Vehicle } from '../types';
import { formatPrice, calculateEMI } from '../utils/format';

export const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
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
    }
  }, [id]);

  const fetchVehicle = async () => {
    setLoading(true);
    
    // First, try to find the vehicle in local mock data
    const localVehicle = ALL_VEHICLES.find(v => v.id === id);
    
    if (localVehicle) {
      setVehicle(localVehicle);
      setLoading(false);
      return;
    }

    // If not found in local dataset, try to match against the lightweight carousel slides
    // (some landing carousel items use different IDs than the inventory dataset)
    const slideMatch: any = carSlides.find((s) => s.id === id);
    if (slideMatch) {
      // Convert the slide representation into the Vehicle shape the details page expects
      const parsedPrice = typeof slideMatch.price === 'string' ? Number(String(slideMatch.price).replace(/[^0-9.-]+/g, '')) : (slideMatch.price || 0);
      const constructed: any = {
        id: slideMatch.id,
        stock_number: slideMatch.id,
        brand_name: slideMatch.brand || slideMatch.title || 'Unknown',
        model: slideMatch.model || slideMatch.title || '',
        year: slideMatch.year || new Date().getFullYear(),
        price: parsedPrice,
        mileage: 0,
        fuel_type: slideMatch.fuel || 'Unknown',
        transmission: slideMatch.transmission || 'Unknown',
        engine_capacity: slideMatch.engine_capacity || undefined,
        color_exterior: slideMatch.color || undefined,
        color_interior: undefined,
        body_type: slideMatch.bodyType || undefined,
        condition: 'New',
        description_en: slideMatch.tagline || slideMatch.subtitle || '',
        description_bn: '',
        is_available: true,
        is_featured: false,
        video_url: '',
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [
          { id: `${slideMatch.id}-1`, vehicle_id: slideMatch.id, image_url: slideMatch.image, display_order: 1, is_primary: true, created_at: new Date().toISOString() }
        ]
      };

      setVehicle(constructed as any);
      setLoading(false);
      return;
    }
    
    // Fallback to Supabase if not found locally
    try {
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
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    }
    
    setLoading(false);
  };

  const nextImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % vehicle.images!.length);
    }
  };

  const prevImage = () => {
    if (vehicle?.images && vehicle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + vehicle.images!.length) % vehicle.images!.length);
    }
  };

  const calculateMonthlyEMI = () => {
    if (!vehicle) return 0;
    const loanAmount = vehicle.price - emiParams.downPayment;
    return calculateEMI(loanAmount, emiParams.interestRate, emiParams.years);
  };

  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={isDark ? 'text-white text-xl' : 'text-gray-900 text-xl'}>Vehicle not found</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>We couldn't find that vehicle. It may have been removed or the link is incorrect.</p>
          <div className="mt-4">
            <Link to="/inventory" className="text-[var(--accent)] underline">Back to inventory</Link>
          </div>
        </div>
      </div>
    );
  }

  const images = vehicle.images || [];
  const currentImage = encodeURI(images[currentImageIndex]?.image_url || 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1200');

  return (
    <div className={`min-h-screen pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
                width={600}
                height={384}
                decoding="async"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    aria-label="Next image"
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
                      src={encodeURI(img.image_url)}
                      alt=""
                      className="w-full h-20 object-cover"
                      loading="lazy"
                      width={150}
                      height={80}
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('vehicle.stock')}: {vehicle.stock_number}
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {vehicle.brand_name} {vehicle.model}
              </h1>
              <div className="text-4xl font-bold text-blue-600 mb-6">
                {vehicle.price && vehicle.price > 0 ? formatPrice(vehicle.price, language) : (language === 'en' ? 'Price on request' : 'মূল্য অনুরোধে')}
              </div>

              <div className={`grid grid-cols-2 gap-4 mb-6 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <Calendar className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('vehicle.year')}</div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{vehicle.year}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Gauge className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('vehicle.mileage')}</div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{vehicle.mileage.toLocaleString()} km</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Fuel className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('vehicle.fuel')}</div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{vehicle.fuel_type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('vehicle.transmission')}</div>
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{vehicle.transmission}</div>
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
                      href={`tel:+8801760401605`}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
                    >
                    <Phone className="h-5 w-5" />
                    <span>{t('vehicle.contact')}</span>
                  </a>
                  <a
                      href={`https://wa.me/8801760401605?text=${encodeURIComponent(`I'm interested in ${vehicle.brand_name} ${vehicle.model}`)}`}
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
            <Card className={`p-6 mb-6 ${isDark ? 'bg-gray-800' : ''}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{language === 'en' ? 'Description' : 'বিবরণ'}</h2>
              <p className={`leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {language === 'en' ? vehicle.description_en : vehicle.description_bn || vehicle.description_en}
              </p>
            </Card>

            {vehicle.features && vehicle.features.length > 0 && (
              <Card className={`p-6 ${isDark ? 'bg-gray-800' : ''}`}>
                <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('vehicle.features')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {language === 'en' ? feature.feature_en : feature.feature_bn}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div>
            <Card className={`p-6 ${isDark ? 'bg-gray-800' : ''}`}>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('vehicle.specifications')}</h2>
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
                  <div key={spec.label} className={`flex justify-between py-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <dt className={isDark ? 'text-gray-400' : 'text-gray-600'}>{spec.label}</dt>
                    <dd className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{spec.value}</dd>
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
