import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ImageCarousel } from '../components/ImageCarousel';
import { useSeedPradoImages } from '../hooks/useSeedPradoImages';
import { supabase } from '../lib/supabase';
import type { Vehicle } from '../types';
import { formatPrice } from '../utils/format';

export const InventoryPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Seed Prado images automatically
  useSeedPradoImages();

  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    year: '',
    fuelType: '',
    transmission: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, vehicles]);

  const fetchVehicles = async () => {
    setLoading(true);
    
    // MOCK DATA - Since Supabase is in dummy mode during dev
    const mockVehicles = [
      {
        id: '1',
        brand_name: 'Toyota',
        model: 'Prado',
        title: 'Toyota Prado 2023',
        title_bn: 'টয়োটা প্রাডো ২০২৩',
        year: 2023,
        price: 7200000,
        mileage: 15000,
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        engine_capacity: '2.7L V6',
        color_exterior: 'White',
        description: 'Premium 7-seater SUV with advanced features',
        description_bn: 'উন্নত বৈশিষ্ট্য সহ প্রিমিয়াম 7-সিটার এসইউভি',
        stock_number: 'PRADO-001',
        is_available: true,
        images: [
          { image_url: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png', url: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png' },
          { image_url: 'https://images.pexels.com/photos/36318403/pexels-photo-36318403.png', url: 'https://images.pexels.com/photos/36318403/pexels-photo-36318403.png' },
          { image_url: 'https://images.pexels.com/photos/36318404/pexels-photo-36318404.png', url: 'https://images.pexels.com/photos/36318404/pexels-photo-36318404.png' },
          { image_url: 'https://images.pexels.com/photos/36318405/pexels-photo-36318405.png', url: 'https://images.pexels.com/photos/36318405/pexels-photo-36318405.png' },
        ]
      },
      {
        id: '2',
        brand_name: 'Honda',
        model: 'Civic',
        title: 'Honda Civic 2023',
        title_bn: 'হোন্ডা সিভিক ২০২৩',
        year: 2023,
        price: 3200000,
        mileage: 5000,
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        engine_capacity: '1.8L',
        color_exterior: 'Blue',
        description: 'Sporty sedan with modern technology',
        description_bn: 'আধুনিক প্রযুক্তি সহ স্পোর্টি সেডান',
        stock_number: 'CIVIC-001',
        is_available: true,
        images: [
          { image_url: 'https://images.pexels.com/photos/3769173/pexels-photo-3769173.jpeg?auto=compress&cs=tinysrgb&w=800', url: 'https://images.pexels.com/photos/3769173/pexels-photo-3769173.jpeg?auto=compress&cs=tinysrgb&w=800' },
        ]
      },
      {
        id: '3',
        brand_name: 'Toyota',
        model: 'Corolla Cross',
        title: 'Toyota Corolla Cross 2023',
        title_bn: 'টয়োটা করোলা ক্রস ২০২৩',
        year: 2023,
        price: 2800000,
        mileage: 3000,
        fuel_type: 'Hybrid',
        transmission: 'CVT',
        engine_capacity: '1.8L Hybrid',
        color_exterior: 'Silver',
        description: 'Eco-friendly compact crossover',
        description_bn: 'পরিবেশ বান্ধব কমপ্যাক্ট ক্রসওভার',
        stock_number: 'CCROSS-001',
        is_available: true,
        images: [
          { image_url: 'https://images.pexels.com/photos/3839293/pexels-photo-3839293.jpeg?auto=compress&cs=tinysrgb&w=800', url: 'https://images.pexels.com/photos/3839293/pexels-photo-3839293.jpeg?auto=compress&cs=tinysrgb&w=800' },
        ]
      },
      {
        id: '4',
        brand_name: 'Honda',
        model: 'CR-V',
        title: 'Honda CR-V 2023',
        title_bn: 'হোন্ডা CR-V ২০२३',
        year: 2023,
        price: 4200000,
        mileage: 8000,
        fuel_type: 'Petrol',
        transmission: 'Automatic',
        engine_capacity: '1.5L Turbo',
        color_exterior: 'Black',
        description: 'Reliable family SUV with spacious interior',
        description_bn: 'নির্ভরযোগ্য পারিবারিক এসইউভি বিস্তৃত অভ্যন্তরীণ সহ',
        stock_number: 'CRV-001',
        is_available: true,
        images: [
          { image_url: 'https://images.pexels.com/photos/3807518/pexels-photo-3807518.jpeg?auto=compress&cs=tinysrgb&w=800', url: 'https://images.pexels.com/photos/3807518/pexels-photo-3807518.jpeg?auto=compress&cs=tinysrgb&w=800' },
        ]
      },
      {
        id: '5',
        brand_name: 'Toyota',
        model: 'Yaris Cross',
        title: 'Toyota Yaris Cross 2023',
        title_bn: 'টয়োটা ইয়ারিস ক্রস २०२३',
        year: 2023,
        price: 3800000,
        mileage: 4500,
        fuel_type: 'Hybrid',
        transmission: 'CVT',
        engine_capacity: '1.5L Hybrid',
        color_exterior: 'Pearl White',
        description: 'Compact crossover with excellent fuel efficiency',
        description_bn: 'চমৎকার জ্বালানি দক্ষতা সহ কম্পাক্ট ক্রসওভার',
        stock_number: 'YARISCROSS-001',
        is_available: true,
        images: [
          { image_url: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png', url: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png' },
          { image_url: 'https://images.pexels.com/photos/36319316/pexels-photo-36319316.png', url: 'https://images.pexels.com/photos/36319316/pexels-photo-36319316.png' },
          { image_url: 'https://images.pexels.com/photos/36319315/pexels-photo-36319315.png', url: 'https://images.pexels.com/photos/36319315/pexels-photo-36319315.png' },
          { image_url: 'https://images.pexels.com/photos/36319314/pexels-photo-36319314.png', url: 'https://images.pexels.com/photos/36319314/pexels-photo-36319314.png' },
        ]
      },
    ];

    setVehicles(mockVehicles);
    setFilteredVehicles(mockVehicles);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...vehicles];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.brand_name.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower) ||
          v.stock_number.toLowerCase().includes(searchLower)
      );
    }

    if (filters.brand) {
      filtered = filtered.filter((v) => v.brand_name === filters.brand);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((v) => v.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((v) => v.price <= parseFloat(filters.maxPrice));
    }

    if (filters.year) {
      filtered = filtered.filter((v) => v.year === parseInt(filters.year));
    }

    if (filters.fuelType) {
      filtered = filtered.filter((v) => v.fuel_type === filters.fuelType);
    }

    if (filters.transmission) {
      filtered = filtered.filter((v) => v.transmission === filters.transmission);
    }

    setFilteredVehicles(filtered);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      year: '',
      fuelType: '',
      transmission: '',
    });
  };

  const brands = [...new Set(vehicles.map((v) => v.brand_name))].sort();
  const years = [...new Set(vehicles.map((v) => v.year))].sort((a, b) => b - a);
  const fuelTypes = [...new Set(vehicles.map((v) => v.fuel_type))];
  const transmissions = [...new Set(vehicles.map((v) => v.transmission))];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('nav.inventory')}</h1>
          <p className="text-xl text-gray-300">
            {language === 'en' ? `${filteredVehicles.length} vehicles available` : `${filteredVehicles.length} টি গাড়ি পাওয়া যাচ্ছে`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('filter.search')}</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-blue-600"
                >
                  <SlidersHorizontal className="h-6 w-6" />
                </button>
              </div>

              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div>
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search...' : 'অনুসন্ধান...'}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filter.brand')}
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? 'All Brands' : 'সব ব্র্যান্ড'}</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filter.year')}
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? 'All Years' : 'সব বছর'}</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filter.price')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filter.fuel')}
                  </label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? 'All Types' : 'সব ধরন'}</option>
                    {fuelTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('filter.transmission')}
                  </label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? 'All Types' : 'সব ধরন'}</option>
                    {transmissions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={resetFilters} variant="outline" className="w-full">
                  {t('filter.reset')}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                {language === 'en' ? `Showing ${filteredVehicles.length} results` : `${filteredVehicles.length} টি ফলাফল দেখানো হচ্ছে`}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">{t('common.loading')}</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-20">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">
                  {language === 'en' ? 'No vehicles found' : 'কোনো গাড়ি পাওয়া যায়নি'}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                {filteredVehicles.map((vehicle, index) => {
                  // Prepare carousel images - use vehicle images or fallback to default
                  const carouselImages = (vehicle.images && vehicle.images.length > 0)
                    ? vehicle.images.map((img: any) => ({
                        url: img.image_url || img.url || 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800',
                        alt: `${vehicle.brand_name} ${vehicle.model}`
                      }))
                    : [{
                        url: 'https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=800',
                        alt: `${vehicle.brand_name} ${vehicle.model}`
                      }];

                  return (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                    >
                      <Card hover className={viewMode === 'list' ? 'flex' : ''}>
                        <Link to={`/vehicle/${vehicle.id}`} className={viewMode === 'list' ? 'flex w-full' : 'w-full'}>
                          <div className={viewMode === 'list' ? 'w-1/3' : 'w-full'}>
                            <ImageCarousel
                              images={carouselImages}
                              autoPlay={true}
                              autoPlayInterval={4000}
                              showIndicators={true}
                              showArrows={carouselImages.length > 1}
                              height={viewMode === 'list' ? 'h-48' : 'h-64'}
                            />
                          </div>
                          <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : 'w-full'}`}>
                            <div className="text-sm text-gray-500 mb-1">
                              {t('vehicle.stock')}: {vehicle.stock_number}
                            </div>
                            <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} ${viewMode === 'list' ? 'text-lg' : 'text-xl'}`}>
                              {vehicle.brand_name} {vehicle.model}
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-2xl font-bold text-blue-600">
                                {formatPrice(vehicle.price, language)}
                              </span>
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {vehicle.mileage.toLocaleString()} km
                              </span>
                            </div>
                            <div className={`grid grid-cols-2 gap-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                              <div>{vehicle.fuel_type}</div>
                              <div>{vehicle.transmission}</div>
                              {vehicle.engine_capacity && <div>{vehicle.engine_capacity}</div>}
                              {vehicle.color_exterior && <div>{vehicle.color_exterior}</div>}
                            </div>
                            <Button className="w-full">
                              {t('vehicle.view_details')}
                            </Button>
                          </div>
                        </Link>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
