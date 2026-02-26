import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Car, Wrench, DollarSign, Shield, Users, Award, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useCounter } from '../hooks/useCounter';
import { useAnimationOnScroll } from '../hooks/useAnimationOnScroll';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ImageCarousel } from '../components/ImageCarousel';
import { ALL_VEHICLES } from '../hooks/vehicleDataAll';
import { supabase } from '../lib/supabase';
import type { Vehicle, Testimonial } from '../types';
import { formatPrice } from '../utils/format';
import { VehicleViewer360Enhanced } from '../components/3d/VehicleViewer360Enhanced';
import { ARViewerEnhanced } from '../components/3d/ARViewerEnhanced';
import { InteractiveVehicleComparison } from '../components/3d/InteractiveVehicleComparison';
import { VirtualShowroomTour } from '../components/3d/VirtualShowroomTour';
import CarFocusCarousel, { carSlides, CarFocusCarouselHandle } from '../components/CarFocusCarousel';

export const HomePage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showcaseVehicle, setShowcaseVehicle] = useState<'prado' | 'yaris' | 'chr' | 'harrier' | 'crown' | 'premio' | 'noah'>('prado');
  const [selectedCarId, setSelectedCarId] = useState<string | undefined>(undefined);
  const carouselRef = useRef<CarFocusCarouselHandle>(null);
  const carouselSectionRef = useRef<HTMLDivElement>(null);
  const [stats] = useState({
    vehicles: 150,
    customers: 500,
    years: 10,
    satisfaction: 98,
  });

  useEffect(() => {
    fetchFeaturedVehicles();
    fetchTestimonials();
  }, []);

  const fetchFeaturedVehicles = async () => {
    const { data } = await supabase
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(*)
      `)
      .eq('is_featured', true)
      .eq('is_available', true)
      .limit(6);

    if (data) setFeaturedVehicles(data);
  };

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .eq('is_featured', true)
      .limit(3);

    if (data) setTestimonials(data);
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  // Handler for clicking on a car in the Premium Collection
  const handleCarSelect = (carId: string) => {
    setSelectedCarId(carId);
    // Use the ref to navigate to the specific car
    if (carouselRef.current) {
      carouselRef.current.goToCarById(carId);
    }
    // Scroll to the carousel section
    if (carouselSectionRef.current) {
      carouselSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* HERO SECTION WITH TEXT REVEAL */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              {t('hero.title').split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.05, delay: 0.05 * index }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link to="/inventory">
                <Button size="lg" className="w-full sm:w-auto">
                  {t('hero.browse')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link to="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white">
                  {t('hero.book_service')}
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link to="/sell">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t('hero.sell')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8" />
        </motion.button>
      </section>

      {/* PREMIUM CAR FOCUS CAROUSEL */}
      <div ref={carouselSectionRef}>
        <CarFocusCarousel 
          ref={carouselRef} 
          initialCarId={selectedCarId}
          onCarChange={(carId) => setSelectedCarId(carId)}
        />
      </div>

      {/* PREMIUM COLLECTION - CLICKABLE CAR GRID */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {language === 'en' ? 'Browse Our Collection' : 'আমাদের সংগ্রহ দেখুন'}
            </span>
            <h2 className={`text-4xl md:text-5xl font-bold mt-2 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Premium Collection' : 'প্রিমিয়াম সংগ্রহ'}
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en' 
                ? 'Click on any vehicle to view it in the showcase carousel above' 
                : 'উপরের শোকেস ক্যারোসেলে দেখতে যেকোনো গাড়িতে ক্লিক করুন'}
            </p>
          </motion.div>

          {/* Car Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {carSlides.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCarSelect(car.id)}
                className={`cursor-pointer group relative overflow-hidden rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-400'
                } transition-all duration-300 shadow-lg hover:shadow-xl ${
                  selectedCarId === car.id 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' 
                    : ''
                }`}
              >
                {/* Selected indicator */}
                {selectedCarId === car.id && (
                  <div className="absolute top-2 right-2 z-10 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                )}

                {/* Car Image */}
                <div className="relative h-32 md:h-40 overflow-hidden">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    theme === 'dark' ? 'from-gray-800' : 'from-white'
                  } via-transparent to-transparent opacity-60`} />
                  
                  {/* Year badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full">
                    {car.year}
                  </span>
                </div>

                {/* Car Info */}
                <div className="p-3 md:p-4">
                  {/* Brand */}
                  <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {car.brand}
                  </p>
                  
                  {/* Model */}
                  <h3 className={`text-sm md:text-base font-bold mb-1 line-clamp-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {car.model}
                  </h3>
                  
                  {/* Body Type */}
                  <p className={`text-[10px] md:text-xs mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {car.bodyType}
                  </p>
                  
                  {/* Price */}
                  <p className={`text-xs md:text-sm font-bold ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {car.price}
                  </p>
                </div>

                {/* Hover overlay with "View" text */}
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10'
                }`}>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    theme === 'dark' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                  }`}>
                    {language === 'en' ? 'View in Carousel' : 'ক্যারোসেলে দেখুন'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION WITH ANIMATED COUNTERS */}
      <motion.section 
        className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'By The Numbers' : 'সংখ্যায়'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: 150, label: language === 'en' ? 'Vehicles' : 'গাড়ি', icon: Car },
              { value: 500, label: language === 'en' ? 'Happy Customers' : 'সন্তুষ্ট গ্রাহক', icon: Users },
              { value: 10, label: language === 'en' ? 'Years Experience' : 'বছরের অভিজ্ঞতা', icon: Award },
              { value: 98, label: language === 'en' ? 'Satisfaction %' : 'সন্তুষ্টি %', icon: Shield },
            ].map((stat, index) => {
              const { ref, isInView } = useAnimationOnScroll(0.1);
              const count = useCounter({ end: stat.value, duration: 2000, shouldStart: isInView });

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`text-center p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                >
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {count}{stat.value >= 100 ? '+' : ''}
                  </div>
                  <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* FEATURED VEHICLES WITH CARD LIFT EFFECTS */}
      {featuredVehicles.length > 0 && (
        <motion.section 
          className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Featured Vehicles' : 'বৈশিষ্ট্যযুক্ত গাড়ি'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/vehicles/${vehicle.id}`}>
                    <Card className={`overflow-hidden cursor-pointer transition-all ${theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl'}`}>
                      <div className="relative h-64 overflow-hidden">
                        <motion.img
                          src={vehicle.images?.[0]?.url || 'https://images.pexels.com/photos/3964962/pexels-photo-3964962.jpeg'}
                          alt={vehicle.title}
                          className="w-full h-full object-contain"
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {language === 'en' ? vehicle.title : vehicle.title_bn || vehicle.title}
                        </h3>
                        <div className={`flex items-center justify-between mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          <span>{vehicle.year}</span>
                          <span>{formatPrice(vehicle.price)}</span>
                        </div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {language === 'en' ? vehicle.description : vehicle.description_bn || vehicle.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* CAROUSEL SHOWCASE WITH FLIP ANIMATIONS */}
      <motion.section 
        className={`py-20 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Background decoration */}
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-300'}`} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Explore Our Premium Collection' : 'আমাদের প্রিমিয়াম সংগ্রহ অন্বেষণ করুন'}
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en' 
                ? 'Stunning 360° views of each vehicle with interactive carousel' 
                : 'প্রতিটি গাড়ির অসাধারণ 360° ভিউ ইন্টারেক্টিভ ক্যারোসেলের সাথে'}
            </p>
          </motion.div>

          {/* Main Carousel with Flip Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Large carousel with curved styling */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Curved background frame */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme === 'dark' ? 'from-blue-900/20 to-purple-900/20' : 'from-blue-200/30 to-purple-200/30'} rounded-3xl blur-2xl`} />
                
                {/* Main carousel container with curved styling */}
                <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 ${theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300/50'} backdrop-blur-sm`}>
                  <ImageCarousel
                    images={
                      showcaseVehicle === 'prado' ? [
                        { url: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png', alt: 'Prado Front' },
                        { url: 'https://images.pexels.com/photos/36318403/pexels-photo-36318403.png', alt: 'Prado Side' },
                        { url: 'https://images.pexels.com/photos/36318404/pexels-photo-36318404.png', alt: 'Prado Rear' },
                        { url: 'https://images.pexels.com/photos/36318405/pexels-photo-36318405.png', alt: 'Prado Back' },
                      ] : showcaseVehicle === 'yaris' ? [
                        { url: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png', alt: 'Yaris Cross Front' },
                        { url: 'https://images.pexels.com/photos/36319316/pexels-photo-36319316.png', alt: 'Yaris Cross Side' },
                        { url: 'https://images.pexels.com/photos/36319315/pexels-photo-36319315.png', alt: 'Yaris Cross Rear' },
                        { url: 'https://images.pexels.com/photos/36319314/pexels-photo-36319314.png', alt: 'Yaris Cross Back' },
                      ] : showcaseVehicle === 'chr' ? [
                        { url: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png', alt: 'C-HR Front' },
                        { url: 'https://images.pexels.com/photos/36324033/pexels-photo-36324033.png', alt: 'C-HR Side' },
                        { url: 'https://images.pexels.com/photos/36324031/pexels-photo-36324031.png', alt: 'C-HR Rear' },
                        { url: 'https://images.pexels.com/photos/36324032/pexels-photo-36324032.png', alt: 'C-HR Back' },
                      ] : showcaseVehicle === 'harrier' ? [
                        { url: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png', alt: 'Harrier Front' },
                      ] : showcaseVehicle === 'crown' ? [
                        { url: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png', alt: 'Crown Front' },
                      ] : showcaseVehicle === 'premio' ? [
                        { url: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png', alt: 'Premio Front' },
                      ] : [
                        { url: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png', alt: 'Noah Front' },
                      ]
                    }
                    autoPlay={true}
                    autoPlayInterval={4000}
                    showIndicators={true}
                    showArrows={true}
                    height="h-96"
                  />
                </div>

                {/* Vehicle selector buttons - Scrollable for mobile */}
                <div className="flex gap-2 mt-6 justify-center flex-wrap">
                  <motion.button
                    onClick={() => setShowcaseVehicle('prado')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'prado'
                        ? theme === 'dark' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50' : 'bg-blue-500 text-white shadow-lg shadow-blue-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Prado
                  </motion.button>
                  <motion.button
                    onClick={() => setShowcaseVehicle('harrier')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'harrier'
                        ? theme === 'dark' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-purple-500 text-white shadow-lg shadow-purple-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Harrier
                  </motion.button>
                  <motion.button
                    onClick={() => setShowcaseVehicle('crown')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'crown'
                        ? theme === 'dark' ? 'bg-red-600 text-white shadow-lg shadow-red-500/50' : 'bg-red-500 text-white shadow-lg shadow-red-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Crown
                  </motion.button>
                  <motion.button
                    onClick={() => setShowcaseVehicle('yaris')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'yaris'
                        ? theme === 'dark' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/50' : 'bg-amber-500 text-white shadow-lg shadow-amber-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Yaris
                  </motion.button>
                  <motion.button
                    onClick={() => setShowcaseVehicle('chr')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'chr'
                        ? theme === 'dark' ? 'bg-green-600 text-white shadow-lg shadow-green-500/50' : 'bg-green-500 text-white shadow-lg shadow-green-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    C-HR
                  </motion.button>
                  <motion.button
                    onClick={() => setShowcaseVehicle('premio')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'premio'
                        ? theme === 'dark' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/50' : 'bg-pink-500 text-white shadow-lg shadow-pink-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Premio
                  </motion.button>
                  <motion.button
                    onClick={() => setShowcaseVehicle('noah')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      showcaseVehicle === 'noah'
                        ? theme === 'dark' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/50' : 'bg-cyan-500 text-white shadow-lg shadow-cyan-400/50'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Noah
                  </motion.button>
                </div>

                {/* Decorative elements */}
                <motion.div
                  className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-300/30'}`}
                  animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className={`absolute -top-6 -right-6 w-32 h-32 rounded-full ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-300/30'}`}
                  animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Right side - Flip card gallery - SYNCED with carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                {/* Synced flip cards - matches carousel vehicles */}
                {[
                  {
                    id: 'prado',
                    name: language === 'en' ? 'Toyota Prado' : 'টয়োটা প্রাডো',
                    subtitle: language === 'en' ? 'Premium 7-Seater SUV' : 'প্রিমিয়াম 7-সিটার এসইউভি',
                    price: '৳ 72,00,000',
                    image: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png',
                    engine: '2.7L V6',
                    fuel: 'Petrol',
                    transmission: 'Automatic',
                    year: 2024,
                    gradient: 'from-blue-600 to-blue-800',
                    lightGradient: 'from-blue-500 to-blue-600',
                  },
                  {
                    id: 'harrier',
                    name: language === 'en' ? 'Toyota Harrier' : 'টয়োটা হ্যারিয়ার',
                    subtitle: language === 'en' ? 'Luxury Premium SUV' : 'বিলাসবহুল প্রিমিয়াম এসইউভি',
                    price: '৳ 75,00,000',
                    image: 'https://images.pexels.com/photos/35515996/pexels-photo-35515996.png',
                    engine: '2.5L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2024,
                    gradient: 'from-purple-600 to-purple-800',
                    lightGradient: 'from-purple-500 to-purple-600',
                  },
                  {
                    id: 'crown',
                    name: language === 'en' ? 'Toyota Crown RS' : 'টয়োটা ক্রাউন আরএস',
                    subtitle: language === 'en' ? 'Executive Premium Sedan' : 'এক্সিকিউটিভ প্রিমিয়াম সেডান',
                    price: '৳ 70,00,000',
                    image: 'https://images.pexels.com/photos/35509198/pexels-photo-35509198.png',
                    engine: '2.5L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'Automatic',
                    year: 2024,
                    gradient: 'from-red-600 to-red-800',
                    lightGradient: 'from-red-500 to-red-600',
                  },
                  {
                    id: 'yaris',
                    name: language === 'en' ? 'Toyota Yaris Cross' : 'টয়োটা ইয়ারিস ক্রস',
                    subtitle: language === 'en' ? 'Compact Hybrid Crossover' : 'কম্পাক্ট হাইব্রিড ক্রসওভার',
                    price: '৳ 38,00,000',
                    image: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png',
                    engine: '1.5L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2023,
                    gradient: 'from-amber-600 to-amber-800',
                    lightGradient: 'from-amber-500 to-amber-600',
                  },
                  {
                    id: 'chr',
                    name: language === 'en' ? 'Toyota C-HR' : 'টয়োটা C-HR',
                    subtitle: language === 'en' ? 'Stylish Compact SUV' : 'স্টাইলিশ কমপ্যাক্ট এসইউভি',
                    price: '৳ 45,00,000',
                    image: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png',
                    engine: '1.8L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2023,
                    gradient: 'from-green-600 to-green-800',
                    lightGradient: 'from-green-500 to-green-600',
                  },
                  {
                    id: 'premio',
                    name: language === 'en' ? 'Toyota Premio' : 'টয়োটা প্রিমিও',
                    subtitle: language === 'en' ? 'Fuel-Efficient Sedan' : 'জ্বালানি-দক্ষ সেডান',
                    price: '৳ 40,00,000',
                    image: 'https://images.pexels.com/photos/35516334/pexels-photo-35516334.png',
                    engine: '1.5L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2023,
                    gradient: 'from-pink-600 to-pink-800',
                    lightGradient: 'from-pink-500 to-pink-600',
                  },
                  {
                    id: 'noah',
                    name: language === 'en' ? 'Toyota Noah' : 'টয়োটা নোয়াহ',
                    subtitle: language === 'en' ? 'Family MPV 8-Seater' : 'পারিবারিক এমপিভি 8-সিটার',
                    price: '৳ 38,00,000',
                    image: 'https://images.pexels.com/photos/35516440/pexels-photo-35516440.png',
                    engine: '1.8L Hybrid',
                    fuel: 'Hybrid',
                    transmission: 'CVT',
                    year: 2023,
                    gradient: 'from-cyan-600 to-cyan-800',
                    lightGradient: 'from-cyan-500 to-cyan-600',
                  },
                ].map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    className={`relative h-32 cursor-pointer group ${
                      showcaseVehicle === vehicle.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                    }`}
                    style={{ perspective: '1000px' }}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => setShowcaseVehicle(vehicle.id as typeof showcaseVehicle)}
                  >
                    {/* Card Container - handles the flip */}
                    <motion.div
                      className="relative w-full h-full"
                      style={{ transformStyle: 'preserve-3d' }}
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      {/* FRONT FACE */}
                      <div 
                        className={`absolute inset-0 rounded-xl p-4 flex items-center gap-4 bg-gradient-to-br ${
                          theme === 'dark' ? vehicle.gradient : vehicle.lightGradient
                        } shadow-lg`}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {/* Vehicle Thumbnail */}
                        <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-black/20">
                          <img 
                            src={vehicle.image} 
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Year badge */}
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-white/90 text-gray-800 rounded">
                            {vehicle.year}
                          </span>
                          {/* Hybrid badge */}
                          {vehicle.fuel === 'Hybrid' && (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[8px] font-bold bg-green-500 text-white rounded">
                              HYBRID
                            </span>
                          )}
                        </div>
                        
                        {/* Vehicle Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-base truncate">{vehicle.name}</h3>
                          <p className="text-white/80 text-xs mt-0.5 truncate">{vehicle.subtitle}</p>
                          <p className="text-white font-bold text-sm mt-2">{vehicle.price}</p>
                        </div>

                        {/* Selected indicator */}
                        {showcaseVehicle === vehicle.id && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse" />
                        )}

                        {/* Hover hint */}
                        <div className="absolute bottom-2 right-2 text-white/60 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                          {language === 'en' ? 'Hover to see specs →' : 'স্পেক দেখতে হোভার করুন →'}
                        </div>
                      </div>

                      {/* BACK FACE - Vehicle Specs */}
                      <div 
                        className={`absolute inset-0 rounded-xl p-4 bg-gradient-to-br ${
                          theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-gray-100 to-white'
                        } shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="flex h-full">
                          {/* Specs */}
                          <div className="flex-1">
                            <h4 className={`font-bold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {vehicle.name}
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>{vehicle.engine}</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                                </svg>
                                <span>{vehicle.fuel}</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{vehicle.transmission}</span>
                              </div>
                              <div className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{vehicle.year}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex flex-col justify-center gap-2 ml-3">
                            <Link to={`/inventory`}>
                              <motion.button 
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {language === 'en' ? 'Details' : 'বিস্তারিত'}
                              </motion.button>
                            </Link>
                            <motion.button 
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                theme === 'dark' 
                                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowcaseVehicle(vehicle.id as typeof showcaseVehicle);
                              }}
                            >
                              {language === 'en' ? 'View 360°' : '360° দেখুন'}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Call-to-action */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/inventory">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  {language === 'en' ? 'View All Vehicles' : 'সমস্ত গাড়ি দেখুন'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* WHY CHOOSE US SECTION */}
      <motion.section 
        className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Why Choose Auto Spark BD?' : 'কেন অটো স্পার্ক বিডি বেছে নেবেন?'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Car,
                title: language === 'en' ? 'Premium Selection' : 'প্রিমিয়াম নির্বাচন',
                description: language === 'en' ? 'Carefully curated collection of luxury and premium vehicles' : 'বিলাসবহুল এবং প্রিমিয়াম গাড়ির সাবধানে নির্বাচিত সংগ্রহ',
              },
              {
                icon: Shield,
                title: language === 'en' ? 'Quality Assurance' : 'মান নিশ্চিতকরণ',
                description: language === 'en' ? 'Thorough inspection and certification for every vehicle' : 'প্রতিটি গাড়ির জন্য পুঙ্খানুপুঙ্খ পরিদর্শন এবং সার্টিফিকেশন',
              },
              {
                icon: Wrench,
                title: language === 'en' ? 'Expert Service' : 'বিশেষজ্ঞ সেবা',
                description: language === 'en' ? 'State-of-the-art service center with experienced technicians' : 'অভিজ্ঞ প্রযুক্তিবিদদের সাথে অত্যাধুনিক সার্ভিস সেন্টার',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className={`p-8 text-center ${theme === 'dark' ? 'hover:shadow-lg' : 'hover:shadow-xl'}`}>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <feature.icon className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  </motion.div>
                  <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {testimonials.length > 0 && (
        <motion.section 
          className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'What Our Customers Say' : 'আমাদের গ্রাহকরা কি বলেন'}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial: any, index: number) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
                          <svg className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        </motion.div>
                      ))}
                    </div>
                    <p className={`mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'en' ? testimonial.review_en : testimonial.review_bn || testimonial.review_en}
                    </p>
                    <div className="flex items-center">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-600'}`}>
                        {testimonial.customer_name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {language === 'en' ? testimonial.customer_name : testimonial.customer_name_bn || testimonial.customer_name}
                        </div>
                        {testimonial.vehicle_purchased && (
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.vehicle_purchased}</div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 3D & Interactive Elements Section */}
      <section className={`py-20 bg-gradient-to-b ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-white to-gray-50'}`}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? '3D Interactive Experience' : '3D ইন্টারেক্টিভ অভিজ্ঞতা'}
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {language === 'en' 
                ? 'Explore our vehicles with cutting-edge 3D visualization and interactive tools' 
                : 'অত্যাধুনিক 3D ভিজুয়ালাইজেশন এবং ইন্টারেক্টিভ সরঞ্জামগুলির সাথে আমাদের গাড়িগুলি অন্বেষণ করুন'}
            </p>
          </motion.div>

          {/* 1. 360° Vehicle Viewer */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? '360° Vehicle Viewer' : '360° গাড়ি দর্শক'}
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'en' 
                  ? 'Rotate and inspect vehicles from every angle with our interactive 3D viewer'
                  : 'আমাদের ইন্টারেক্টিভ 3D ভিউয়ার দিয়ে প্রতিটি কোণ থেকে গাড়িগুলি ঘোরান এবং পরিদর্শন করুন'}
              </p>
            </div>
            <VehicleViewer360Enhanced />
          </motion.div>

          {/* 2. Augmented Reality Viewer */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Augmented Reality (AR) Preview' : 'অগমেন্টেড রিয়েলিটি (AR) প্রিভিউ'}
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'en' 
                  ? 'Visualize how a car looks in your space using your device camera'
                  : 'আপনার ডিভাইস ক্যামেরা ব্যবহার করে একটি গাড়ি আপনার স্থানে কীভাবে দেখায় তা কল্পনা করুন'}
              </p>
            </div>
            <ARViewerEnhanced />
          </motion.div>

          {/* 3. Interactive Vehicle Comparison */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Interactive Vehicle Comparison' : 'ইন্টারেক্টিভ গাড়ি তুলনা'}
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'en' 
                  ? 'Compare multiple vehicles side-by-side with detailed specifications'
                  : 'বিস্তারিত স্পেসিফিকেশন সহ একাধিক গাড়ি পাশাপাশি তুলনা করুন'}
              </p>
            </div>
            <InteractiveVehicleComparison />
          </motion.div>

          {/* 4. Virtual Showroom Tour */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Virtual Showroom Tour' : 'ভার্চুয়াল শোরুম ট্যুর'}
              </h3>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                {language === 'en' 
                  ? 'Take a guided tour of our showroom and service facilities in 360°'
                  : '360° এ আমাদের শোরুম এবং পরিষেবা সুবিধাগুলির একটি গাইডেড ট্যুর করুন'}
              </p>
            </div>
            <VirtualShowroomTour />
          </motion.div>

          {/* CTA for Interactive Experience */}
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)' }}
          >
            <h3 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Ready to Explore?' : 'অন্বেষণ করতে প্রস্তুত?'}
            </h3>
            <p className="mb-6 text-blue-100">
              {language === 'en' 
                ? 'Use these interactive tools to find your perfect vehicle'
                : 'আপনার নিখুঁত গাড়ি খুঁজে পেতে এই ইন্টারেক্টিভ সরঞ্জামগুলি ব্যবহার করুন'}
            </p>
            <motion.div
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/inventory">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                  {language === 'en' ? 'View Full Inventory' : 'সম্পূর্ণ ইনভেন্টরি দেখুন'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <motion.section 
        className={`py-20 bg-gradient-to-r from-blue-600 to-blue-800`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {language === 'en' ? 'Ready to Find Your Dream Car?' : 'আপনার স্বপ্নের গাড়ি খুঁজে পেতে প্রস্তুত?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {language === 'en' ? 'Browse our extensive inventory or visit our showroom in Rajshahi' : 'আমাদের বিস্তৃত ইনভেন্টরি ব্রাউজ করুন বা রাজশাহীতে আমাদের শোরুম পরিদর্শন করুন'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/inventory">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                    {language === 'en' ? 'Browse Inventory' : 'ইনভেন্টরি ব্রাউজ করুন'}
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    {language === 'en' ? 'Contact Us' : 'যোগাযোগ করুন'}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>  );
};