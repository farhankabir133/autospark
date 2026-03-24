
import { Award, Shield, Users, TrendingUp, Target, Eye, Star, Car, CheckCircle, Quote, Phone, Mail, Linkedin, Facebook, Instagram, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/Card';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { lazy, Suspense, useEffect, useState } from 'react';
const Testimonials = lazy(() => import('../components/about/Testimonials'));
const TeamCard = lazy(() => import('../components/about/TeamCard'));

export const AboutPage = () => {
  // Showroom and Service Center Details
  const showroom = {
    address: 'Station Road, Near Shuvo Petroleum, Sheroil, Ghoramara, Boalia Rajshahi, Rajshahi, Bangladesh, 6207',
    city: 'Rajshahi, Rajshahi Division, Bangladesh',
    website: 'autosparkbd.com',
    youtube: 'https://www.youtube.com/@autosparkbd1131',
    tiktok: 'https://www.tiktok.com/@auto_spark0',
    phone: '+880 1760-401605',
    email: 'autosparkbd@gmail.com',
    name: 'AutoSpark',
  logo: `${import.meta.env.BASE_URL}logo/logoAS3.svg`,
    awards: ['Award', 'Verified', 'Security', 'Certificate'],
  };
  const serviceCenter = {
    address: 'Meherchandi, West Side of School Mor, Rajshahi, Rajshahi, Bangladesh, 6202',
    city: 'Rajshahi, Rajshahi Division, Bangladesh',
    website: 'autosparkbd.com',
    youtube: 'https://www.youtube.com/@autosparkbd1131',
    tiktok: 'http://www.tiktok.com/@easycareeasylife',
    phone: '+880 1321-233670',
    email: 'autosparkbd@gmail.com',
    name: 'Auto Spark Service Center',
  logo: `${import.meta.env.BASE_URL}logo/logoassc.svg`,
    awards: ['Award', 'Verified', 'Security', 'Certificate'],
  };
  const { language } = useLanguage();
  const { theme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const m = typeof window !== 'undefined' && (window.innerWidth || 0) < 768;
    setIsMobile(Boolean(m));
  }, []);

  // Company Statistics
  const stats = [
    { value: '12+', label: language === 'en' ? 'Years of Excellence' : 'বছরের অভিজ্ঞতা' },
    { value: '2500+', label: language === 'en' ? 'Vehicles Sold' : 'গাড়ি বিক্রি' },
    { value: '5000+', label: language === 'en' ? 'Happy Customers' : 'সন্তুষ্ট গ্রাহক' },
    { value: '98%', label: language === 'en' ? 'Satisfaction Rate' : 'সন্তুষ্টির হার' },
  ];

  // Company Values
  const values = [
    {
      icon: Award,
      title: language === 'en' ? 'Premium Quality' : 'প্রিমিয়াম মান',
      description: language === 'en' ? 'We handpick only the finest vehicles that meet our rigorous standards' : 'আমরা শুধুমাত্র সেরা গাড়ি নির্বাচন করি যা আমাদের কঠোর মানদণ্ড পূরণ করে',
    },
    {
      icon: Shield,
      title: language === 'en' ? 'Trust & Transparency' : 'বিশ্বাস ও স্বচ্ছতা',
      description: language === 'en' ? 'Complete vehicle history, fair pricing, and honest dealings' : 'সম্পূর্ণ গাড়ির ইতিহাস, সঠিক মূল্য এবং সৎ লেনদেন',
    },
    {
      icon: Users,
      title: language === 'en' ? 'Customer First' : 'গ্রাহক প্রথম',
      description: language === 'en' ? 'Personalized service tailored to your unique needs and preferences' : 'আপনার অনন্য চাহিদা অনুযায়ী ব্যক্তিগত সেবা',
    },
    {
      icon: TrendingUp,
      title: language === 'en' ? 'Market Leadership' : 'বাজার নেতৃত্ব',
      description: language === 'en' ? "North Bengal's most trusted name in premium automobiles" : 'উত্তরবঙ্গের প্রিমিয়াম গাড়িতে সবচেয়ে বিশ্বস্ত নাম',
    },
  ];

  // Company Timeline/Milestones
  const milestones = [
    {
      year: '2014',
      title: language === 'en' ? 'Foundation' : 'প্রতিষ্ঠা',
      description: language === 'en' ? 'Auto Spark BD was established in Rajshahi with a vision to revolutionize the premium car market' : 'প্রিমিয়াম গাড়ির বাজারে বিপ্লব আনার লক্ষ্যে রাজশাহীতে অটো স্পার্ক বিডি প্রতিষ্ঠিত হয়',
    },
    {
      year: '2016',
      title: language === 'en' ? 'Service Center Launch' : 'সার্ভিস সেন্টার উদ্বোধন',
      description: language === 'en' ? 'Opened state-of-the-art service center with certified technicians' : 'সার্টিফাইড টেকনিশিয়ানদের সাথে অত্যাধুনিক সার্ভিস সেন্টার চালু',
    },
    {
      year: '2018',
      title: language === 'en' ? 'Regional Expansion' : 'আঞ্চলিক সম্প্রসারণ',
      description: language === 'en' ? 'Became the leading premium car dealer across North Bengal region' : 'উত্তরবঙ্গ জুড়ে শীর্ষস্থানীয় প্রিমিয়াম গাড়ি বিক্রেতা হয়ে উঠল',
    },
    {
      year: '2020',
      title: language === 'en' ? '1000+ Cars Milestone' : '১০০০+ গাড়ি বিক্রি',
      description: language === 'en' ? 'Celebrated selling over 1000 premium vehicles to satisfied customers' : 'সন্তুষ্ট গ্রাহকদের কাছে ১০০০+ প্রিমিয়াম গাড়ি বিক্রি উদযাপন',
    },
    {
      year: '2023',
      title: language === 'en' ? 'Digital Transformation' : 'ডিজিটাল রূপান্তর',
      description: language === 'en' ? 'Launched online platform for seamless car buying experience' : 'নিরবচ্ছিন্ন গাড়ি কেনার অভিজ্ঞতার জন্য অনলাইন প্ল্যাটফর্ম চালু',
    },
    {
      year: '2026',
      title: language === 'en' ? 'Excellence Continues' : 'উৎকর্ষতা অব্যাহত',
      description: language === 'en' ? 'Continuing to set new standards in premium automotive retail' : 'প্রিমিয়াম অটোমোটিভ রিটেইলে নতুন মান স্থাপন অব্যাহত',
    },
  ];

  // Customer Testimonials
  const testimonials = [
    {
      name: language === 'en' ? 'Rahman Ahmed' : 'রহমান আহমেদ',
      role: language === 'en' ? 'Business Owner' : 'ব্যবসার মালিক',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      quote: language === 'en' 
        ? 'Auto Spark BD made my dream of owning a Land Cruiser come true. Their professionalism and attention to detail is unmatched in the region.'
        : 'অটো স্পার্ক বিডি আমার ল্যান্ড ক্রুজার কেনার স্বপ্ন পূরণ করেছে। তাদের পেশাদারিত্ব এবং বিস্তারিত মনোযোগ এই অঞ্চলে অতুলনীয়।',
    },
    {
      name: language === 'en' ? 'Dr. Fatima Khan' : 'ডা. ফাতিমা খান',
      role: language === 'en' ? 'Medical Professional' : 'চিকিৎসা পেশাজীবী',
      image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=300',
      quote: language === 'en'
        ? 'Excellent service from start to finish. The team helped me find the perfect car within my budget. Highly recommended!'
        : 'শুরু থেকে শেষ পর্যন্ত চমৎকার সেবা। টিম আমার বাজেটের মধ্যে নিখুঁত গাড়ি খুঁজে পেতে সাহায্য করেছে।',
    },
    {
      name: language === 'en' ? 'Kamal Hossain' : 'কামাল হোসেন',
      role: language === 'en' ? 'Government Official' : 'সরকারি কর্মকর্তা',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      quote: language === 'en'
        ? 'I have purchased three vehicles from Auto Spark BD over the years. Their after-sales service keeps me coming back.'
        : 'আমি বছরের পর বছর অটো স্পার্ক বিডি থেকে তিনটি গাড়ি কিনেছি। তাদের বিক্রয়োত্তর সেবা আমাকে বারবার ফিরিয়ে আনে।',
    },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <>
      <PageHead
        title={language === 'en' ? 'About — AutoSpark' : 'অটো স্পার্ক সম্পর্কে'}
        description={language === 'en'
          ? 'AutoSpark BD — premier premium car dealership and service center in Rajshahi. Learn about our mission, team, and milestones.'
          : 'অটো স্পার্ক বিডি — রাজশাহীর একটি প্রিমিয়াম গাড়ি ডিলার এবং সার্ভিস সেন্টার। আমাদের মিশন, টিম এবং মাইলস্টোন সম্পর্কে জানুন।'
        }
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/about`}
        image={`${import.meta.env.BASE_URL}img/og/about-og.jpg`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AutoDealer",
          name: showroom.name,
          url: `https://${showroom.website}`,
          logo: `${import.meta.env.BASE_URL}logo/logoAS3.svg`,
          telephone: showroom.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: showroom.address,
            addressLocality: showroom.city,
            addressCountry: "BD",
          },
        }}
      />
      <main>
        <header className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl sm:text-5xl font-bold">
            {language === 'en' ? 'About AutoSpark' : 'অটো স্পার্ক সম্পর্কে'}
          </h1>
        </header>
    <div>
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Showroom & Service Center Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Showroom Card */}
          <Card className="p-6 flex flex-col items-center text-center shadow-lg bg-white dark:bg-gray-900">
            <img src={showroom.logo} alt="Showroom Logo" className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-bold text-[#C00000] mb-2">{showroom.name}</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{showroom.address}</div>
            <div className="text-xs text-gray-500 mb-2">{showroom.city}</div>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              <a href={`tel:${showroom.phone}`} className="text-xs underline text-blue-600">{showroom.phone}</a>
              <a href={`mailto:${showroom.email}`} className="text-xs underline text-blue-600">{showroom.email}</a>
              <a href={`https://${showroom.website}`} className="text-xs underline text-blue-600">{showroom.website}</a>
            </div>
            <div className="flex gap-4 mb-2">
              <a href="https://www.facebook.com/autosparkbd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/autosparkbd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/@autosparkbd1131" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Mail className="w-6 h-6" />
              </a>
              <a href="https://www.tiktok.com/@auto_spark0" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <MapPin className="w-6 h-6" />
              </a>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold border border-yellow-300">🏆 Award</span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold border border-blue-300">✔️ Verified</span>
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold border border-green-300">🛡️ Security</span>
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold border border-purple-300">📄 Certificate</span>
            </div>
          </Card>
          {/* Service Center Card */}
          <Card className="p-6 flex flex-col items-center text-center shadow-lg bg-white dark:bg-gray-900">
            <img src={serviceCenter.logo} alt="Service Center Logo" className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-bold text-[#C00000] mb-2">{serviceCenter.name}</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">{serviceCenter.address}</div>
            <div className="text-xs text-gray-500 mb-2">{serviceCenter.city}</div>
            <div className="flex gap-4 mb-2">
              <a href="https://www.facebook.com/autosparkbd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/autosparkbd" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/@autosparkbd1131" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <Mail className="w-6 h-6" />
              </a>
              <a href="http://www.tiktok.com/@easycareeasylife" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF1A1A]">
                <MapPin className="w-6 h-6" />
              </a>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold border border-yellow-300">🏆 Award</span>
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold border border-blue-300">✔️ Verified</span>
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold border border-green-300">🛡️ Security</span>
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold border border-purple-300">📄 Certificate</span>
            </div>
          </Card>
        </div>
      </section>
      {/* ...existing code... */}
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-transparent' : 'bg-gray-50'} pt-20`}>
        {/* Hero Section */}
        <div className="relative h-[500px] overflow-hidden">
          {/* Parallax Animated Gradient Background */}
          <motion.div
            className="absolute inset-0 z-0 bg-gradient-to-br from-[#C00000]/30 via-[#181818]/60 to-[#FF1A1A]/20 animate-gradientMove"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ backgroundSize: '200% 200%', backgroundPosition: '0% 50%' }}
            aria-hidden="true"
          />
          {/* Floating Interactive Icons with Tooltips */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <motion.button
              className="absolute left-10 top-16 focus:outline-none"
              animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
              aria-label="Premium Cars"
              tabIndex={0}
            >
              <Car className="w-10 h-10 text-blue-400 drop-shadow-lg" />
              <span className="sr-only">Premium Cars</span>
              <span className="absolute left-12 top-0 bg-blue-900 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-focus:opacity-100 group-hover:opacity-100 transition-opacity">Premium Cars</span>
            </motion.button>
            <motion.button
              className="absolute right-16 top-24 focus:outline-none"
              animate={{ y: [0, 15, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
              aria-label="Trusted Dealer"
              tabIndex={0}
            >
              <Award className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
              <span className="sr-only">Trusted Dealer</span>
              <span className="absolute right-12 top-0 bg-yellow-700 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-focus:opacity-100 group-hover:opacity-100 transition-opacity">Trusted Dealer</span>
            </motion.button>
            <motion.button
              className="absolute left-24 bottom-20 focus:outline-none"
              animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 7, repeat: Infinity }}
              aria-label="Security & Assurance"
              tabIndex={0}
            >
              <Shield className="w-10 h-10 text-green-400 drop-shadow-lg" />
              <span className="sr-only">Security & Assurance</span>
              <span className="absolute left-12 bottom-0 bg-green-700 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-focus:opacity-100 group-hover:opacity-100 transition-opacity">Security & Assurance</span>
            </motion.button>
            <motion.button
              className="absolute right-24 bottom-16 focus:outline-none"
              animate={{ y: [0, 12, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
              aria-label="Excellence"
              tabIndex={0}
            >
              <Star className="w-10 h-10 text-pink-400 drop-shadow-lg" />
              <span className="sr-only">Excellence</span>
              <span className="absolute right-12 bottom-0 bg-pink-700 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-focus:opacity-100 group-hover:opacity-100 transition-opacity">Excellence</span>
            </motion.button>
          </div>
          <div className="relative container mx-auto px-4 h-full flex items-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              {/* Animated Underline for Headline */}
              <motion.div
                className="w-32 h-1 bg-gradient-to-r from-[#C00000] via-[#FF1A1A] to-[#C00000] rounded-full mb-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ transformOrigin: 'left' }}
                aria-hidden="true"
              />
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-[#C00000]/20 text-[#FF1A1A] rounded-full text-sm font-medium mb-4 border border-[#C00000]/30"
            >
              {language === 'en' ? 'Established 2014' : 'প্রতিষ্ঠিত ২০১৪'}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6"
            >
              {language === 'en' ? 'About Auto Spark BD' : 'অটো স্পার্ক বিডি সম্পর্কে'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed"
            >
              {language === 'en'
                ? "North Bengal's premier destination for luxury and premium automobiles. Where passion meets excellence."
                : 'উত্তরবঙ্গের বিলাসবহুল এবং প্রিমিয়াম গাড়ির প্রধান গন্তব্য। যেখানে আবেগ উৎকর্ষতার সাথে মিলিত হয়।'}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative -mt-16 z-10">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-2xl p-6 text-center shadow-xl border backdrop-blur-sm`}
              >
                <div className="text-3xl md:text-4xl font-bold text-[#C00000] mb-2">{stat.value}</div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Our Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="text-center mb-6">
            <span className="text-[#C00000] font-semibold text-sm uppercase tracking-wider">
              {language === 'en' ? 'Our Journey' : 'আমাদের যাত্রা'}
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
              {language === 'en' ? 'The Auto Spark Story' : 'অটো স্পার্ক কাহিনী'}
            </h2>
          </div>
          <Card className={`p-8 md:p-12 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white'}`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-6">
                <motion.img
                  src="https://images.pexels.com/photos/36496123/pexels-photo-36496123.png"
                  alt="Auto Spark BD Showroom 1"
                  className="rounded-xl shadow-lg w-full h-72 object-cover"
                  loading="lazy"
                  width={600}
                  height={400}
                  decoding="async"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                <motion.img
                  src="https://images.pexels.com/photos/36496048/pexels-photo-36496048.png"
                  alt="Auto Spark BD Showroom 2"
                  className="rounded-xl shadow-lg w-full h-72 object-cover"
                  loading="lazy"
                  width={600}
                  height={400}
                  decoding="async"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                />
              </div>
              <div className={`prose prose-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed space-y-4 w-full md:w-full`}>
                <p>
                  {language === 'en'
                    ? 'Auto Spark BD was founded in 2014 with a singular vision: to bring world-class automotive excellence to Rajshahi and the greater North Bengal region. What began as a modest showroom driven by passion has evolved into the region\'s most trusted name in premium automobiles.'
                    : 'অটো স্পার্ক বিডি ২০১৪ সালে একটি একক দৃষ্টিভঙ্গি নিয়ে প্রতিষ্ঠিত হয়েছিল: রাজশাহী এবং বৃহত্তর উত্তরবঙ্গ অঞ্চলে বিশ্বমানের অটোমোটিভ উৎকর্ষতা নিয়ে আসা।'}
                </p>
                <p>
                  {language === 'en'
                    ? 'We specialize in premium and luxury vehicles, meticulously curating a selection of the finest automobiles from around the world. Every vehicle in our collection undergoes rigorous inspection to ensure it meets our exacting standards.'
                    : 'আমরা প্রিমিয়াম এবং বিলাসবহুল গাড়িতে বিশেষজ্ঞ, বিশ্বজুড়ে সেরা অটোমোবাইলের একটি যত্নশীল সংগ্রহ অফার করি।'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mission & Vision Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          <motion.div variants={fadeInUp}>
            <Card className={`p-8 h-full ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white'} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C00000]/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-[#C00000]/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-[#C00000]" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {language === 'en' ? 'Our Mission' : 'আমাদের মিশন'}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                  {language === 'en'
                    ? 'To provide an unparalleled automotive experience by offering premium vehicles, exceptional service, and building lasting relationships with our customers. We strive to make luxury accessible while maintaining the highest standards of quality and integrity.'
                    : 'প্রিমিয়াম গাড়ি, ব্যতিক্রমী সেবা প্রদান এবং আমাদের গ্রাহকদের সাথে স্থায়ী সম্পর্ক গড়ে তোলার মাধ্যমে একটি অতুলনীয় অটোমোটিভ অভিজ্ঞতা প্রদান করা।'}
                </p>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Card className={`p-8 h-full ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white'} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C00000]/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-[#C00000]/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-[#C00000]" />
                </div>
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                  {language === 'en' ? 'Our Vision' : 'আমাদের ভিশন'}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                  {language === 'en'
                    ? 'To be the most trusted and admired automotive brand in Bangladesh, setting new benchmarks in customer satisfaction, vehicle quality, and after-sales excellence. We envision expanding our presence while staying true to our core values.'
                    : 'বাংলাদেশে সবচেয়ে বিশ্বস্ত এবং প্রশংসিত অটোমোটিভ ব্র্যান্ড হওয়া, গ্রাহক সন্তুষ্টি, গাড়ির মান এবং বিক্রয়োত্তর উৎকর্ষতায় নতুন মানদণ্ড স্থাপন করা।'}
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Founder/Owner Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <span className="text-[#C00000] font-semibold text-sm uppercase tracking-wider">
              {language === 'en' ? 'Leadership' : 'নেতৃত্ব'}
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
              {language === 'en' ? 'Meet Our Founder' : 'আমাদের প্রতিষ্ঠাতার সাথে পরিচিত হন'}
            </h2>
          </div>
          
          <Card className={`p-8 md:p-12 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800' : 'bg-gradient-to-br from-white to-gray-50'} overflow-hidden relative`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C00000]/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C00000]/5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="grid md:grid-cols-3 gap-8 items-center relative">
              {/* Founder Image */}
              <div className="md:col-span-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C00000] to-[#8B0000] rounded-2xl transform rotate-3"></div>
                  <img
                    src="https://images.pexels.com/photos/36365285/pexels-photo-36365285.png?auto=compress&cs=tinysrgb&w=400&fm=webp"
                    alt="Founder - Auto Spark BD"
                    className="relative rounded-2xl w-full h-80 object-cover object-top shadow-2xl transform -rotate-0 hover:rotate-0 transition-transform duration-500"
                    loading="lazy"
                    width={400}
                    height={500}
                    decoding="async"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-[#C00000] text-white px-4 py-2 rounded-lg shadow-lg">
                    <span className="font-bold">{language === 'en' ? 'CEO & Founder' : 'সিইও এবং প্রতিষ্ঠাতা'}</span>
                  </div>
                </div>
              </div>
              
              {/* Founder Info */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {language === 'en' ? 'A.B.M. Raihanul Amin' : 'এ.বি.এম. রায়হানুল আমিন'}
                  </h3>
                  <p className="text-[#C00000] font-semibold text-lg">
                    {language === 'en' ? 'Founder & Managing Director' : 'প্রতিষ্ঠাতা এবং ব্যবস্থাপনা পরিচালক'}
                  </p>
                </div>
                
                <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} space-y-4 leading-relaxed`}>
                  <p>
                    {language === 'en'
                      ? 'With over two decades of experience in the automotive industry, Mohammad Abdul Karim founded Auto Spark BD with a passion for bringing world-class vehicles to his hometown of Rajshahi. His vision was simple yet ambitious: to create a dealership that prioritizes customer trust and vehicle quality above all else.'
                      : 'অটোমোটিভ শিল্পে দুই দশকেরও বেশি অভিজ্ঞতার সাথে, মোহাম্মদ আব্দুল করিম তার জন্মস্থান রাজশাহীতে বিশ্বমানের গাড়ি আনার আবেগ নিয়ে অটো স্পার্ক বিডি প্রতিষ্ঠা করেন।'}
                  </p>
                  <p>
                    {language === 'en'
                      ? '"Every car we sell carries our reputation. That\'s why we never compromise on quality or customer service. Our success is measured not just in sales, but in the lasting relationships we build with every customer."'
                      : '"আমরা যে প্রতিটি গাড়ি বিক্রি করি তা আমাদের সুনাম বহন করে। এজন্য আমরা মান বা গ্রাহক সেবায় কখনো আপস করি না।"'}
                  </p>
                </div>
                
                {/* Founder's Achievements */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className={`flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                    <CheckCircle className="w-5 h-5 text-[#C00000]" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'en' ? '20+ Years Experience' : '২০+ বছরের অভিজ্ঞতা'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                    <CheckCircle className="w-5 h-5 text-[#C00000]" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'en' ? 'Industry Pioneer' : 'শিল্প অগ্রদূত'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}>
                    <CheckCircle className="w-5 h-5 text-[#C00000]" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'en' ? 'Community Leader' : 'সম্প্রদায়ের নেতা'}
                    </span>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="flex gap-4 pt-4">
                    <a href={showroom.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#C00000]/10 hover:bg-[#C00000] text-[#C00000] hover:text-white rounded-lg flex items-center justify-center transition-colors" aria-label="YouTube">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href={`https://${showroom.website}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#C00000]/10 hover:bg-[#C00000] text-[#C00000] hover:text-white rounded-lg flex items-center justify-center transition-colors" aria-label="Website">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  <a href="mailto:founder@autosparkbd.com" className="w-10 h-10 bg-[#C00000]/10 hover:bg-[#C00000] text-[#C00000] hover:text-white rounded-lg flex items-center justify-center transition-colors" aria-label="Email">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Company Values */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <span className="text-[#C00000] font-semibold text-sm uppercase tracking-wider">
              {language === 'en' ? 'What We Stand For' : 'আমরা কিসের পক্ষে দাঁড়াই'}
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
              {language === 'en' ? 'Our Core Values' : 'আমাদের মূল মূল্যবোধ'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className={`p-6 text-center h-full ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800 hover:border-[#C00000]/50' : 'bg-white hover:border-[#C00000]/30'} transition-all duration-300 hover:shadow-lg hover:shadow-[#C00000]/10`}>
                  <div className="w-16 h-16 bg-[#C00000]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-[#C00000]" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>{value.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed`}>{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-12"
        >
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[#C00000] font-semibold text-xs sm:text-sm uppercase tracking-wider">
              {language === 'en' ? 'Our Journey' : 'আমাদের যাত্রা'}
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
              {language === 'en' ? 'Milestones & Achievements' : 'মাইলফলক এবং অর্জন'}
            </h2>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-3 sm:left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C00000] via-[#C00000]/50 to-transparent transform md:-translate-x-1/2"></div>
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-6 sm:mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-8 sm:pl-12 md:pl-0`}>
                  <Card className={`p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white'}`}>
                    <span className="text-[#C00000] font-bold text-base sm:text-lg">{milestone.year}</span>
                    <h4 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1 mb-2`}>{milestone.title}</h4>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>{milestone.description}</p>
                  </Card>
                </div>
                
                {/* Timeline Dot */}
                <div className="absolute left-1 sm:left-2 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#C00000] rounded-full transform md:-translate-x-1/2 border-2 sm:border-4 border-white dark:border-gray-950 shadow-lg"></div>
                
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Meet Our Experts Section - Timeline Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-12"
        >
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[#C00000] font-semibold text-xs sm:text-sm uppercase tracking-wider">
              {language === 'en' ? 'The People Behind Our Success' : 'আমাদের সাফল্যের পেছনের মানুষ'}
            </span>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
              {language === 'en' ? 'Meet Our Experts' : 'আমাদের বিশেষজ্ঞদের সাথে পরিচিত হন'}
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-3 sm:left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C00000] via-[#C00000]/50 to-transparent transform md:-translate-x-1/2"></div>
            
            {/* Expert 1 - Farhan Kabir (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative flex items-center mb-6 sm:mb-8 md:flex-row"
            >
              <div className="w-full md:w-5/12 md:pr-12 md:text-right pl-8 sm:pl-12 md:pl-0">
                <Suspense fallback={<div className="p-6">Loading team member…</div>}>
                  <TeamCard
                    person={{
                      name: language === 'en' ? 'Farhan Kabir' : 'ফারহান কবির',
                      role: language === 'en' ? 'Lead Engineer / Lead Developer' : 'প্রধান প্রকৌশলী / প্রধান ডেভেলপার',
                      title: language === 'en' ? '💻 Lead Engineer' : '💻 লিড ইঞ্জিনিয়ার',
                      image: 'https://images.pexels.com/photos/34067041/pexels-photo-34067041.png?auto=compress&cs=tinysrgb&w=600&fm=webp',
                      bio: language === 'en' ? 'Driving digital innovation and creating seamless experiences for our customers.' : 'ডিজিটাল উদ্ভাবন চালনা এবং গ্রাহকদের জন্য নিরবচ্ছিন্ন অভিজ্ঞতা তৈরি করছেন।',
                    }}
                    language={language}
                    theme={theme}
                    showroom={showroom}
                  />
                </Suspense>
              </div>
              
              {/* Timeline Dot */}
              <div className="absolute left-1 sm:left-2 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#C00000] rounded-full transform md:-translate-x-1/2 border-2 sm:border-4 border-white dark:border-gray-950 shadow-lg"></div>
              
              <div className="hidden md:block w-5/12"></div>
            </motion.div>

            {/* Expert 2 - Abu Hasan (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex items-center mb-6 sm:mb-8 md:flex-row-reverse"
            >
              <div className="w-full md:w-5/12 md:pl-12 pl-8 sm:pl-12 md:text-left">
                <Suspense fallback={<div className="p-6">Loading team member…</div>}>
                  <TeamCard
                    person={{
                      name: language === 'en' ? 'Abu Hasan' : 'আবু হাসান',
                      role: language === 'en' ? 'General Manager' : 'জেনারেল ম্যানেজার',
                      title: language === 'en' ? '👔 Leadership' : '👔 নেতৃত্ব',
                      image: 'https://images.pexels.com/photos/36705238/pexels-photo-36705238.png?auto=compress&cs=tinysrgb&w=600&fm=webp',
                      bio: language === 'en' ? 'Leading our operations with strategic vision and excellence in customer service.' : 'কৌশলগত দৃষ্টিভঙ্গি এবং গ্রাহক সেবায় উৎকর্ষতার সাথে আমাদের কার্যক্রম পরিচালনা করছেন।',
                    }}
                    language={language}
                    theme={theme}
                    showroom={showroom}
                  />
                </Suspense>
              </div>
              
              {/* Timeline Dot */}
              <div className="absolute left-1 sm:left-2 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#C00000] rounded-full transform md:-translate-x-1/2 border-2 sm:border-4 border-white dark:border-gray-950 shadow-lg"></div>
              
              <div className="hidden md:block w-5/12"></div>
            </motion.div>

            {/* Expert 3 - Sohan Ahmed (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative flex items-center mb-6 sm:mb-8 md:flex-row"
            >
              <div className="w-full md:w-5/12 md:pr-12 md:text-right pl-8 sm:pl-12 md:pl-0">
                <Card className={`p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white'} overflow-hidden group hover:shadow-xl transition-all duration-300`}>
                  <div className="flex flex-col md:flex-row-reverse md:items-center gap-4">
                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto md:mx-0 flex-shrink-0">
                      <img
                        src="https://images.pexels.com/photos/36705239/pexels-photo-36705239.png"
                        alt="Sohan Ahmed"
                        className="w-full h-full rounded-full object-cover border-3 border-[#C00000]/30 group-hover:border-[#C00000] transition-colors duration-300"
                        loading="lazy"
                        width={208}
                        height={208}
                        decoding="async"
                      />
                      <motion.div 
                        className="absolute -top-1 -right-1 bg-[#C00000] text-white p-1.5 rounded-full text-xs shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                      >
                        🚗
                      </motion.div>
                    </div>
                    <div className="text-center md:text-right flex-1">
                      <span className="text-[#C00000] font-bold text-xs sm:text-sm">🚗 Sales Expert</span>
                      <h4 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1`}>
                        {language === 'en' ? 'Sohan Ahmed' : 'সোহান আহমেদ'}
                      </h4>
                      <p className="text-[#C00000] font-semibold text-xs sm:text-sm mb-2">
                        {language === 'en' ? 'Senior Sales Executive' : 'সিনিয়র সেলস এক্সিকিউটিভ'}
                      </p>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>
                        {language === 'en' 
                          ? 'Helping customers find their perfect vehicle with personalized guidance.'
                          : 'ব্যক্তিগত নির্দেশনার মাধ্যমে গ্রাহকদের তাদের নিখুঁত গাড়ি খুঁজে পেতে সাহায্য করছেন।'}
                      </p>
                      <div className="flex justify-center md:justify-end gap-2 mt-3">
                        <a href={`https://${showroom.website}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#C00000]/10 flex items-center justify-center hover:bg-[#C00000] hover:text-white transition-colors" aria-label="Website">
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a href={showroom.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#C00000]/10 flex items-center justify-center hover:bg-[#C00000] hover:text-white transition-colors" aria-label="YouTube">
                          <Facebook className="w-4 h-4" />
                        </a>
                        <a href={`tel:${showroom.phone}`} className="w-8 h-8 rounded-full bg-[#C00000]/10 flex items-center justify-center hover:bg-[#C00000] hover:text-white transition-colors" aria-label="Phone">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Timeline Dot */}
              <div className="absolute left-1 sm:left-2 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#C00000] rounded-full transform md:-translate-x-1/2 border-2 sm:border-4 border-white dark:border-gray-950 shadow-lg"></div>
              
              <div className="hidden md:block w-5/12"></div>
            </motion.div>

            {/* Expert 4 - Amir Rahman (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative flex items-center mb-6 sm:mb-8 md:flex-row-reverse"
            >
              <div className="w-full md:w-5/12 md:pl-12 pl-8 sm:pl-12 md:text-left">
                <Suspense fallback={<div className="p-6">Loading team member…</div>}>
                  <TeamCard
                    person={{
                      name: language === 'en' ? 'Amir Rahman' : 'আমির রহমান',
                      role: language === 'en' ? 'Senior Technician' : 'সিনিয়র টেকনিশিয়ান',
                      title: language === 'en' ? '🔧 Tech Expert' : '🔧 টেক এক্সপার্ট',
                      image: 'https://images.pexels.com/photos/8961065/pexels-photo-8961065.jpeg?auto=compress&cs=tinysrgb&w=600&fm=webp',
                      bio: language === 'en' ? 'Ensuring every vehicle meets our rigorous quality and safety standards.' : 'প্রতিটি গাড়ি আমাদের কঠোর মান এবং নিরাপত্তা মানদণ্ড পূরণ করছে তা নিশ্চিত করছেন।',
                    }}
                    language={language}
                    theme={theme}
                    showroom={showroom}
                  />
                </Suspense>
              </div>
              
              {/* Timeline Dot */}
              <div className="absolute left-1 sm:left-2 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#C00000] rounded-full transform md:-translate-x-1/2 border-2 sm:border-4 border-white dark:border-gray-950 shadow-lg"></div>
              
              <div className="hidden md:block w-5/12"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="text-center mb-6">
            <span className="text-[#C00000] font-semibold text-sm uppercase tracking-wider">
              {language === 'en' ? 'Testimonials' : 'প্রশংসাপত্র'}
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2`}>
              {language === 'en' ? 'What Our Customers Say' : 'আমাদের গ্রাহকরা কি বলেন'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Suspense fallback={<div className="p-6">Loading testimonials…</div>}>
              <Testimonials items={testimonials} language={language} theme={theme} />
            </Suspense>
          </div>
        </motion.div>

        {/* Why Choose Us CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-r from-[#C00000] to-[#8B0000] text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'en' ? 'Ready to Find Your Dream Car?' : 'আপনার স্বপ্নের গাড়ি খুঁজতে প্রস্তুত?'}
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                {language === 'en'
                  ? 'With over a decade of experience, we understand the needs of discerning customers who demand excellence. Visit our showroom or browse our inventory online.'
                  : 'এক দশকের বেশি অভিজ্ঞতার সাথে, আমরা বিচক্ষণ গ্রাহকদের চাহিদা বুঝি যারা উৎকর্ষতা দাবি করেন।'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/inventory"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#C00000] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <Car className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Browse Inventory' : 'ইনভেন্টরি দেখুন'}
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Contact Us' : 'যোগাযোগ করুন'}
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
    {/* Close main parent div */}
  </div>
      </main>
    </>
  );
};
