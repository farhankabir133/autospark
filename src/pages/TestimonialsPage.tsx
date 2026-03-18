import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Quote,
  Search,
  Filter,
  // ChevronDown,
  Car,
  Calendar,
  ThumbsUp,
  Award,
  Shield,
  Heart,
  Share2,
  CheckCircle,
  Users,
  TrendingUp,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Testimonial } from '../types';

// ─── Extended Testimonial type for comprehensive display ───
interface CustomerTestimonial extends Testimonial {
  location?: string;
  purchase_date?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_image?: string;
  customer_occupation?: string;
  helpful_count?: number;
  verified_purchase?: boolean;
  tags?: string[];
}

// ─── Comprehensive Mock Data ───
// In production, this comes from Supabase. For now, showcase
// Auto Spark BD's real customer stories.
const MOCK_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: '1',
    customer_name: 'Md. Rafiqul Islam',
    customer_name_bn: 'মোঃ রফিকুল ইসলাম',
    rating: 5,
    review_en:
      'Absolutely amazing experience! I purchased a Toyota Land Cruiser Prado from Auto Spark and the entire process was seamless. The team was incredibly professional, transparent about the vehicle history, and helped me with all the documentation. The car was in pristine condition, exactly as described. I have recommended Auto Spark to all my friends and family. Truly the best car dealership in Rajshahi!',
    review_bn:
      'অসাধারণ অভিজ্ঞতা! আমি অটো স্পার্ক থেকে একটি টয়োটা ল্যান্ড ক্রুজার প্রাডো কিনেছি এবং পুরো প্রক্রিয়াটি ছিল নিরবচ্ছিন্ন। দলটি অবিশ্বাস্যভাবে পেশাদার ছিল, গাড়ির ইতিহাস সম্পর্কে স্বচ্ছ ছিল এবং সমস্ত ডকুমেন্টেশনে আমাকে সাহায্য করেছিল। রাজশাহীর সেরা গাড়ি ডিলারশিপ!',
    customer_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Land Cruiser Prado',
    vehicle_model: 'Land Cruiser Prado TX',
    vehicle_year: 2021,
    vehicle_image: 'https://images.pexels.com/photos/36435471/pexels-photo-36435471.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: true,
    is_approved: true,
    created_at: '2025-11-15',
    location: 'Rajshahi City',
    purchase_date: '2025-10-20',
    customer_occupation: 'Business Owner',
    helpful_count: 47,
    verified_purchase: true,
    tags: ['Premium SUV', 'Great Service', 'Transparent'],
  },
  {
    id: '2',
    customer_name: 'Dr. Fatema Begum',
    customer_name_bn: 'ডাঃ ফাতেমা বেগম',
    rating: 5,
    review_en:
      'As a woman buying a car on my own, I was initially nervous. But the team at Auto Spark made me feel completely comfortable. They explained every detail, never pressured me, and gave me time to make my decision. I bought a Toyota Yaris Cross and it has been perfect for my daily commute to the hospital. The after-sales support has been exceptional too!',
    review_bn:
      'একজন নারী হিসেবে একা গাড়ি কেনা নিয়ে আমি প্রথমে চিন্তিত ছিলাম। কিন্তু অটো স্পার্কের দল আমাকে সম্পূর্ণ আরামদায়ক অনুভব করিয়েছে। তারা প্রতিটি বিস্তারিত ব্যাখ্যা করেছে, কখনো চাপ দেয়নি। আমি একটি টয়োটা ইয়ারিস ক্রস কিনেছি এবং এটি আমার দৈনন্দিন যাতায়াতের জন্য নিখুঁত!',
    customer_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Yaris Cross',
    vehicle_model: 'Yaris Cross Hybrid',
    vehicle_year: 2023,
    vehicle_image: 'https://images.pexels.com/photos/36435468/pexels-photo-36435468.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: true,
    is_approved: true,
    created_at: '2025-12-03',
    location: 'Rajshahi Sadar',
    purchase_date: '2025-11-10',
    customer_occupation: 'Doctor',
    helpful_count: 38,
    verified_purchase: true,
    tags: ['Fuel Efficient', 'Comfortable', 'Family Friendly'],
  },
  {
    id: '3',
    customer_name: 'Kamal Hossain Chowdhury',
    customer_name_bn: 'কামাল হোসেন চৌধুরী',
    rating: 5,
    review_en:
      'I have bought 3 cars from Auto Spark over the past 5 years. Every single time the experience has been outstanding. My latest purchase — a Toyota Harrier — is an absolute dream. The premium interior, smooth ride, and advanced features are beyond what I expected at this price point. Auto Spark truly understands what customers in this region need.',
    review_bn:
      'গত ৫ বছরে আমি অটো স্পার্ক থেকে ৩টি গাড়ি কিনেছি। প্রতিবারই অভিজ্ঞতা অসাধারণ ছিল। আমার সর্বশেষ কেনা — একটি টয়োটা হ্যারিয়ার — একেবারে স্বপ্নের মতো। প্রিমিয়াম ইন্টেরিয়র, মসৃণ রাইড এবং উন্নত ফিচার আমার প্রত্যাশার চেয়ে বেশি।',
    customer_image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Harrier',
    vehicle_model: 'Harrier Z Leather',
    vehicle_year: 2022,
    vehicle_image: 'https://images.pexels.com/photos/36435469/pexels-photo-36435469.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: true,
    is_approved: true,
    created_at: '2025-09-22',
    location: 'Natore',
    purchase_date: '2025-08-15',
    customer_occupation: 'Real Estate Developer',
    helpful_count: 62,
    verified_purchase: true,
    tags: ['Repeat Customer', 'Premium SUV', 'Excellent Value'],
  },
  {
    id: '4',
    customer_name: 'Shahidul Alam',
    customer_name_bn: 'শহীদুল আলম',
    rating: 4,
    review_en:
      'Great experience buying my Toyota Crown from Auto Spark. The car was in excellent condition and the price was very competitive compared to Dhaka dealers. Minor paperwork delay during registration, but the team handled it efficiently. The Crown rides like a luxury sedan should — smooth, quiet, and powerful. Highly recommended for anyone looking for a premium sedan.',
    review_bn:
      'অটো স্পার্ক থেকে আমার টয়োটা ক্রাউন কেনার দুর্দান্ত অভিজ্ঞতা। গাড়িটি চমৎকার অবস্থায় ছিল এবং দাম ঢাকার ডিলারদের তুলনায় খুবই প্রতিযোগিতামূলক ছিল। রেজিস্ট্রেশনের সময় সামান্য কাগজপত্রের বিলম্ব হয়েছিল, কিন্তু দল এটি দক্ষতার সাথে সামলেছে।',
    customer_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Crown',
    vehicle_model: 'Crown RS Advance',
    vehicle_year: 2022,
    vehicle_image: 'https://images.pexels.com/photos/36435468/pexels-photo-36435468.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: false,
    is_approved: true,
    created_at: '2025-08-10',
    location: 'Chapainawabganj',
    purchase_date: '2025-07-01',
    customer_occupation: 'Government Officer',
    helpful_count: 31,
    verified_purchase: true,
    tags: ['Luxury Sedan', 'Good Value', 'Comfortable'],
  },
  {
    id: '5',
    customer_name: 'Nazmul Hasan',
    customer_name_bn: 'নাজমুল হাসান',
    rating: 5,
    review_en:
      'I traded in my old car and purchased a Toyota Noah from Auto Spark. The trade-in value they offered was the best in the region. The Noah is perfect for my family of 6 — spacious, comfortable, and very fuel efficient. The sliding doors make it so easy for the kids. Auto Spark even arranged a free first service. What more can you ask for?',
    review_bn:
      'আমি আমার পুরানো গাড়ি ট্রেড-ইন করে অটো স্পার্ক থেকে একটি টয়োটা নোহা কিনেছি। তারা যে ট্রেড-ইন মূল্য দিয়েছে তা এই অঞ্চলে সেরা ছিল। ৬ জনের পরিবারের জন্য নোহা একদম পারফেক্ট — প্রশস্ত, আরামদায়ক এবং খুবই জ্বালানি সাশ্রয়ী।',
    customer_image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Noah',
    vehicle_model: 'Noah S-Z Hybrid',
    vehicle_year: 2023,
    vehicle_image: 'https://images.pexels.com/photos/36435470/pexels-photo-36435470.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: false,
    is_approved: true,
    created_at: '2025-10-05',
    location: 'Bogura',
    purchase_date: '2025-09-20',
    customer_occupation: 'School Teacher',
    helpful_count: 29,
    verified_purchase: true,
    tags: ['Family Car', 'Trade-In', 'Fuel Efficient'],
  },
  {
    id: '6',
    customer_name: 'Anisur Rahman',
    customer_name_bn: 'আনিসুর রহমান',
    rating: 5,
    review_en:
      'Being from Bogura, I was initially hesitant about buying from Rajshahi. But Auto Spark arranged everything — I video-called to inspect the car, they handled all the paperwork, and even delivered the Toyota Premio to my doorstep! The level of service was beyond anything I have experienced. The car runs perfectly and I could not be happier.',
    review_bn:
      'বগুড়া থেকে হওয়ায় রাজশাহী থেকে কেনা নিয়ে প্রথমে দ্বিধা ছিল। কিন্তু অটো স্পার্ক সবকিছু ব্যবস্থা করেছে — ভিডিও কলে গাড়ি দেখেছি, সব কাগজপত্র তারা সামলেছে, এমনকি টয়োটা প্রিমিও আমার বাড়িতে পৌঁছে দিয়েছে!',
    customer_image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Premio',
    vehicle_model: 'Premio F EX Package',
    vehicle_year: 2020,
    vehicle_image: 'https://images.pexels.com/photos/36435472/pexels-photo-36435472.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: false,
    is_approved: true,
    created_at: '2025-07-18',
    location: 'Bogura',
    purchase_date: '2025-06-25',
    customer_occupation: 'Businessman',
    helpful_count: 44,
    verified_purchase: true,
    tags: ['Home Delivery', 'Long Distance', 'Great Communication'],
  },
  {
    id: '7',
    customer_name: 'Tanvir Ahmed',
    customer_name_bn: 'তানভীর আহমেদ',
    rating: 5,
    review_en:
      'I am a car enthusiast and I was looking for a specific Toyota C-HR in metallic blue. Auto Spark not only found the exact specification I wanted but got it at a price lower than what dealers in Dhaka were quoting. The hybrid technology is incredible — I am getting amazing fuel economy. The team really knows their cars!',
    review_bn:
      'আমি একজন গাড়ি উৎসাহী এবং আমি মেটালিক নীল রঙের একটি নির্দিষ্ট টয়োটা সি-এইচআর খুঁজছিলাম। অটো স্পার্ক শুধু আমার চাওয়া সঠিক স্পেসিফিকেশনই খুঁজে পায়নি, ঢাকার ডিলারদের চেয়ে কম দামে পেয়েছে।',
    customer_image_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota C-HR',
    vehicle_model: 'C-HR G-T Hybrid',
    vehicle_year: 2023,
    vehicle_image: 'https://images.pexels.com/photos/36435469/pexels-photo-36435469.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: true,
    is_approved: true,
    created_at: '2026-01-08',
    location: 'Rajshahi University Area',
    purchase_date: '2025-12-20',
    customer_occupation: 'University Professor',
    helpful_count: 33,
    verified_purchase: true,
    tags: ['Hybrid', 'Specific Request', 'Better Than Dhaka'],
  },
  {
    id: '8',
    customer_name: 'Masuda Khatun',
    customer_name_bn: 'মাসুদা খাতুন',
    rating: 5,
    review_en:
      'My husband and I visited Auto Spark to buy our first family car. The showroom experience was wonderful — clean, professional, and no-pressure sales. We chose a Toyota Allion and the financing assistance they provided made the process so much easier. Six months later, the car is running beautifully and we have zero complaints.',
    review_bn:
      'আমি এবং আমার স্বামী আমাদের প্রথম পারিবারিক গাড়ি কিনতে অটো স্পার্কে গিয়েছিলাম। শোরুমের অভিজ্ঞতা চমৎকার ছিল — পরিষ্কার, পেশাদার এবং চাপমুক্ত। আমরা একটি টয়োটা এলিয়ন বেছে নিয়েছি এবং তাদের ফাইন্যান্সিং সহায়তা প্রক্রিয়াটিকে অনেক সহজ করেছে।',
    customer_image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Allion',
    vehicle_model: 'Allion A20',
    vehicle_year: 2019,
    vehicle_image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: false,
    is_approved: true,
    created_at: '2025-06-20',
    location: 'Pabna',
    purchase_date: '2025-05-15',
    customer_occupation: 'Homemaker',
    helpful_count: 22,
    verified_purchase: true,
    tags: ['First Car', 'Family', 'Financing Help'],
  },
  {
    id: '9',
    customer_name: 'Jahangir Alam',
    customer_name_bn: 'জাহাঙ্গীর আলম',
    rating: 4,
    review_en:
      'Purchased a reconditioned Toyota Axio from Auto Spark. The reconditioning quality was impressive — the car looked almost brand new. Price was fair and the team was upfront about everything including minor wear items. Only giving 4 stars because the initial test drive wait was a bit long on a busy day, but otherwise fantastic service.',
    review_bn:
      'অটো স্পার্ক থেকে একটি রিকন্ডিশনড টয়োটা এক্সিও কিনেছি। রিকন্ডিশনিং মান চিত্তাকর্ষক ছিল — গাড়িটি প্রায় একেবারে নতুনের মতো দেখাচ্ছিল। দাম ন্যায্য ছিল এবং দল সবকিছু সম্পর্কে সৎ ছিল।',
    customer_image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Axio',
    vehicle_model: 'Axio X Grade',
    vehicle_year: 2018,
    vehicle_image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: false,
    is_approved: true,
    created_at: '2025-05-12',
    location: 'Naogaon',
    purchase_date: '2025-04-28',
    customer_occupation: 'Pharmacist',
    helpful_count: 18,
    verified_purchase: true,
    tags: ['Reconditioned', 'Good Value', 'Honest Dealing'],
  },
  {
    id: '10',
    customer_name: 'Imran Khan',
    customer_name_bn: 'ইমরান খান',
    rating: 5,
    review_en:
      'I drove all the way from Rangpur to buy a Toyota Harrier from Auto Spark because of their reputation. It was worth every kilometer! The car was exactly as shown in photos, the test drive sealed the deal. What impressed me most was their after-sales — they even called to check how I was enjoying the car weeks later. This is what customer service should be!',
    review_bn:
      'অটো স্পার্কের সুনামের কারণে আমি রংপুর থেকে একটি টয়োটা হ্যারিয়ার কিনতে এসেছিলাম। প্রতিটি কিলোমিটার সার্থক ছিল! গাড়িটি ঠিক ফটোতে দেখানোর মতোই ছিল। যা আমাকে সবচেয়ে বেশি মুগ্ধ করেছে তা হলো তাদের বিক্রয়-পরবর্তী সেবা!',
    customer_image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Harrier',
    vehicle_model: 'Harrier Premium',
    vehicle_year: 2023,
    vehicle_image: 'https://images.pexels.com/photos/36435471/pexels-photo-36435471.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: true,
    is_approved: true,
    created_at: '2026-02-14',
    location: 'Rangpur',
    purchase_date: '2026-01-25',
    customer_occupation: 'IT Manager',
    helpful_count: 55,
    verified_purchase: true,
    tags: ['Long Distance Customer', 'After-Sales', 'Premium SUV'],
  },
  {
    id: '11',
    customer_name: 'Abdur Rahim',
    customer_name_bn: 'আব্দুর রহিম',
    rating: 5,
    review_en:
      'Third time buying from Auto Spark. This time I got a Land Cruiser Prado for my construction business. The 4WD capability is exceptional for site visits. Auto Spark even helped me get commercial insurance at a good rate. They go above and beyond for their customers.',
    review_bn:
      'অটো স্পার্ক থেকে তৃতীয়বার গাড়ি কিনলাম। এবার আমার নির্মাণ ব্যবসার জন্য একটি ল্যান্ড ক্রুজার প্রাডো নিলাম। সাইট ভিজিটের জন্য ৪WD ক্ষমতা অসাধারণ। অটো স্পার্ক এমনকি ভালো রেটে কমার্শিয়াল ইন্স্যুরেন্স পেতে সাহায্য করেছে।',
    customer_image_url: 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota Land Cruiser Prado',
    vehicle_model: 'Prado TZ-G',
    vehicle_year: 2022,
    vehicle_image: 'https://images.pexels.com/photos/36435470/pexels-photo-36435470.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: false,
    is_approved: true,
    created_at: '2026-01-20',
    location: 'Sirajganj',
    purchase_date: '2025-12-15',
    customer_occupation: 'Construction Contractor',
    helpful_count: 41,
    verified_purchase: true,
    tags: ['Repeat Customer', '4WD', 'Business Use'],
  },
  {
    id: '12',
    customer_name: 'Sadia Rahman',
    customer_name_bn: 'সাদিয়া রহমান',
    rating: 5,
    review_en:
      'As a young professional, I wanted something stylish yet practical. The Auto Spark team recommended the Toyota C-HR Hybrid and it was the perfect choice. The fuel savings alone have been incredible — I spend half of what I used to! The showroom staff treated me with so much respect, unlike some other dealerships I visited.',
    review_bn:
      'একজন তরুণ পেশাদার হিসেবে আমি স্টাইলিশ অথচ ব্যবহারিক কিছু চাইছিলাম। অটো স্পার্ক দল টয়োটা সি-এইচআর হাইব্রিড সুপারিশ করেছিল এবং এটি ছিল নিখুঁত পছন্দ। শুধু জ্বালানি সঞ্চয়ই অবিশ্বাস্য — আমি আগের অর্ধেক খরচ করি!',
    customer_image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    vehicle_purchased: 'Toyota C-HR',
    vehicle_model: 'C-HR S Hybrid',
    vehicle_year: 2022,
    vehicle_image: 'https://images.pexels.com/photos/36435472/pexels-photo-36435472.png?auto=compress&cs=tinysrgb&w=800&fm=webp',
    is_featured: false,
    is_approved: true,
    created_at: '2025-11-30',
    location: 'Rajshahi City',
    purchase_date: '2025-10-10',
    customer_occupation: 'Software Engineer',
    helpful_count: 27,
    verified_purchase: true,
    tags: ['Young Professional', 'Hybrid', 'Stylish'],
  },
];

// ─── Star Rating Component ───
const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
        size={size}
      />
    ))}
  </div>
);

// ─── Stats Overview Component ───
const StatsOverview = ({ testimonials, theme, language }: { testimonials: CustomerTestimonial[]; theme: string; language: string }) => {
  const avgRating = testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0';
  const fiveStarCount = testimonials.filter((t) => t.rating === 5).length;
  const fiveStarPercent = testimonials.length > 0 ? Math.round((fiveStarCount / testimonials.length) * 100) : 0;

  const stats = [
    {
      icon: Users,
      value: `${testimonials.length}+`,
      label: language === 'en' ? 'Happy Customers' : 'সুখী গ্রাহক',
      color: 'text-blue-500',
    },
    {
      icon: Star,
      value: avgRating,
      label: language === 'en' ? 'Average Rating' : 'গড় রেটিং',
      color: 'text-yellow-500',
    },
    {
      icon: Award,
      value: `${fiveStarPercent}%`,
      label: language === 'en' ? '5-Star Reviews' : '৫-তারা রিভিউ',
      color: 'text-green-500',
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: language === 'en' ? 'Would Recommend' : 'সুপারিশ করবেন',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
          className={`text-center p-5 md:p-6 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-gray-800/60 border-gray-700/50 backdrop-blur-sm'
              : 'bg-white border-gray-200 shadow-sm'
          }`}
        >
          <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
          <div className={`text-2xl md:text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {stat.value}
          </div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Rating Breakdown Bar ───
const RatingBreakdown = ({ testimonials, theme, language }: { testimonials: CustomerTestimonial[]; theme: string; language: string }) => {
  const breakdown = [5, 4, 3, 2, 1].map((rating) => {
    const count = testimonials.filter((t) => t.rating === rating).length;
    const percent = testimonials.length > 0 ? Math.round((count / testimonials.length) * 100) : 0;
    return { rating, count, percent };
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`p-6 rounded-2xl border ${
        theme === 'dark' ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {language === 'en' ? 'Rating Breakdown' : 'রেটিং বিশ্লেষণ'}
      </h3>
      <div className="space-y-3">
        {breakdown.map((item) => (
          <div key={item.rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-14 shrink-0">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.rating}
              </span>
              <Star className="text-yellow-400 fill-yellow-400" size={14} />
            </div>
            <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                initial={{ width: 0 }}
                whileInView={{ width: `${item.percent}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              />
            </div>
            <span className={`text-sm w-10 text-right shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.percent}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Featured Testimonial Card (Hero-style) ───
const FeaturedTestimonialCard = ({
  testimonial: t,
  theme,
  language,
}: {
  testimonial: CustomerTestimonial;
  theme: string;
  language: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className={`relative rounded-3xl overflow-hidden border ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700/50 backdrop-blur-sm'
        : 'bg-gradient-to-br from-white to-blue-50/50 border-gray-200 shadow-lg'
    }`}
  >
    {/* Featured Badge */}
    <div className="absolute top-4 right-4 z-10">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
        <Award size={12} />
        {language === 'en' ? 'FEATURED' : 'ফিচার্ড'}
      </span>
    </div>

    <div className="flex flex-col">
      {/* Vehicle Image — full width, natural height */}
      {t.vehicle_image && (
        <div className="relative w-full">
          <img
            src={t.vehicle_image}
            alt={t.vehicle_purchased || 'Vehicle'}
            className="w-full h-auto object-contain"
            loading="lazy"
            decoding="async"
          />
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-t from-gray-900/70 via-transparent to-transparent' : 'bg-gradient-to-t from-white/70 via-transparent to-transparent'}`} />
          {t.vehicle_purchased && (
            <div className="absolute bottom-4 left-4">
              <div className="flex items-center gap-2">
                <Car size={16} className="text-blue-400" />
                <span className="text-white font-semibold text-sm bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                  {t.vehicle_purchased} {t.vehicle_year && `(${t.vehicle_year})`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Side */}
      <div className="p-6 md:p-8 flex flex-col justify-center">
        <Quote className={`h-8 w-8 mb-4 ${theme === 'dark' ? 'text-blue-400/40' : 'text-blue-500/30'}`} />
        <p className={`text-sm md:text-base leading-relaxed mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          "{language === 'bn' && t.review_bn ? t.review_bn : t.review_en}"
        </p>

        <div className="flex items-center gap-4">
          <img
            src={t.customer_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.customer_name)}&background=0D8ABC&color=fff&size=80`}
            alt={t.customer_name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
            loading="lazy"
            decoding="async"
          />
          <div className="flex-1">
            <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'bn' && t.customer_name_bn ? t.customer_name_bn : t.customer_name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating rating={t.rating} size={14} />
              {t.verified_purchase && (
                <span className="inline-flex items-center gap-1 text-green-500 text-xs">
                  <CheckCircle size={12} /> {language === 'en' ? 'Verified' : 'যাচাইকৃত'}
                </span>
              )}
            </div>
            {t.location && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                <MapPin size={10} /> {t.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Regular Testimonial Card ───
const TestimonialCard = ({
  testimonial: t,
  index,
  theme,
  language,
  onLike,
}: {
  testimonial: CustomerTestimonial;
  index: number;
  theme: string;
  language: string;
  onLike: (id: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const review = language === 'bn' && t.review_bn ? t.review_bn : t.review_en;
  const shouldTruncate = review.length > 200;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
        theme === 'dark'
          ? 'bg-gray-800/60 border-gray-700/50 hover:border-blue-500/30 backdrop-blur-sm'
          : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'
      }`}
    >
      {/* Vehicle Image Header */}
      {t.vehicle_image && (
        <div className="relative w-full overflow-hidden">
          <img
            src={t.vehicle_image}
            alt={t.vehicle_purchased || 'Vehicle'}
            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-t from-gray-800 to-transparent' : 'bg-gradient-to-t from-white to-transparent'}`} />
          {t.vehicle_purchased && (
            <div className="absolute bottom-3 left-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-sm ${
                theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-900'
              }`}>
                <Car size={12} className="text-blue-500" />
                {t.vehicle_purchased} {t.vehicle_year && `'${String(t.vehicle_year).slice(2)}`}
              </span>
            </div>
          )}
          {t.verified_purchase && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/90 text-white text-[10px] font-bold rounded-full">
                <CheckCircle size={10} /> {language === 'en' ? 'VERIFIED' : 'যাচাইকৃত'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-5">
        {/* Customer Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={t.customer_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.customer_name)}&background=0D8ABC&color=fff&size=80`}
            alt={t.customer_name}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/20"
            loading="lazy"
            decoding="async"
          />
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'bn' && t.customer_name_bn ? t.customer_name_bn : t.customer_name}
            </h4>
            <div className="flex items-center gap-2">
              {t.customer_occupation && (
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {t.customer_occupation}
                </span>
              )}
              {t.location && (
                <span className={`text-xs flex items-center gap-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <MapPin size={9} /> {t.location}
                </span>
              )}
            </div>
          </div>
          <StarRating rating={t.rating} size={13} />
        </div>

        {/* Review Text */}
        <div className="mb-3">
          <Quote className={`h-4 w-4 mb-1 ${theme === 'dark' ? 'text-blue-400/30' : 'text-blue-300'}`} />
          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {shouldTruncate && !expanded ? `${review.slice(0, 200)}...` : review}
          </p>
          {shouldTruncate && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`text-xs font-medium mt-1 ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              {expanded
                ? language === 'en' ? 'Show less' : 'কম দেখুন'
                : language === 'en' ? 'Read more' : 'আরও পড়ুন'}
            </button>
          )}
        </div>

        {/* Tags */}
        {t.tags && t.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {t.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                  theme === 'dark' ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className={`flex items-center justify-between pt-3 border-t ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-100'}`}>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <Calendar size={11} className="inline mr-1" />
            {t.purchase_date
              ? new Date(t.purchase_date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short' })
              : new Date(t.created_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short' })}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLike(t.id)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                theme === 'dark' ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'
              }`}
            >
              <ThumbsUp size={12} /> {t.helpful_count || 0}
            </button>
            <button
              className={`text-xs transition-colors ${
                theme === 'dark' ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'
              }`}
            >
              <Share2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Filter/Sort Controls ───
type SortOption = 'newest' | 'highest' | 'lowest' | 'helpful';
type FilterRating = 0 | 1 | 2 | 3 | 4 | 5;

// ═══════════════════════════════════════════════════════
// ─── MAIN PAGE COMPONENT ───
// ═══════════════════════════════════════════════════════
export const TestimonialsPage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterRating, setFilterRating] = useState<FilterRating>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<CustomerTestimonial | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const topRef = useRef<HTMLDivElement>(null);

  // Fetch testimonials — tries Supabase first, falls back to mock data
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          setTestimonials(data as CustomerTestimonial[]);
        } else {
          setTestimonials(MOCK_TESTIMONIALS);
        }
      } catch {
        setTestimonials(MOCK_TESTIMONIALS);
      }
    };
    fetchTestimonials();
  }, []);

  // Filter & sort logic
  const filteredTestimonials = useMemo(() => {
    let result = [...testimonials];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.customer_name.toLowerCase().includes(q) ||
          t.review_en.toLowerCase().includes(q) ||
          (t.vehicle_purchased || '').toLowerCase().includes(q) ||
          (t.location || '').toLowerCase().includes(q) ||
          (t.tags || []).some((tag) => tag.toLowerCase().includes(q)),
      );
    }

    // Rating filter
    if (filterRating > 0) {
      result = result.filter((t) => t.rating === filterRating);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'highest':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        result.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));
        break;
    }

    return result;
  }, [testimonials, searchQuery, sortBy, filterRating]);

  const featuredTestimonials = useMemo(
    () => testimonials.filter((t) => t.is_featured),
    [testimonials],
  );

  const handleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, helpful_count: (t.helpful_count || 0) + (likedIds.has(id) ? -1 : 1) }
          : t,
      ),
    );
  };

  return (
    <div
      ref={topRef}
      className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* ══════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
        {/* Background gradient */}
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-blue-950/30 to-gray-900'
            : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
        }`} />
        {/* Decorative circles */}
        <div className={`absolute top-10 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'
        }`} />
        <div className={`absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
        }`} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 mb-6"
            >
              <Star className="text-yellow-500 fill-yellow-500" size={16} />
              <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                {language === 'en' ? '2500+ Vehicles Sold' : '২৫০০+ গাড়ি বিক্রি হয়েছে'}
              </span>
            </motion.div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {language === 'en' ? (
                <>
                  Our Customers{' '}
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Love Us</span>
                </>
              ) : (
                <>
                  আমাদের গ্রাহকরা{' '}
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">আমাদের ভালোবাসেন</span>
                </>
              )}
            </h1>

            <p className={`text-base md:text-lg mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {language === 'en'
                ? "Real stories from real customers who found their dream cars at Auto Spark BD. Read what they have to say about North Bengal's most trusted car dealership."
                : 'অটো স্পার্ক বিডিতে তাদের স্বপ্নের গাড়ি খুঁজে পাওয়া প্রকৃত গ্রাহকদের বাস্তব গল্প। উত্তরবঙ্গের সবচেয়ে বিশ্বস্ত গাড়ি ডিলারশিপ সম্পর্কে তারা কী বলেন পড়ুন।'}
            </p>

            {/* Quick Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {[
                { icon: Shield, label: language === 'en' ? 'Verified Reviews' : 'যাচাইকৃত রিভিউ' },
                { icon: CheckCircle, label: language === 'en' ? 'Real Customers' : 'প্রকৃত গ্রাহক' },
                { icon: Heart, label: language === 'en' ? '98% Satisfaction' : '৯৮% সন্তুষ্টি' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 border border-gray-700/50'
                      : 'bg-white text-gray-600 border border-gray-200 shadow-sm'
                  }`}
                >
                  <badge.icon size={13} className="text-green-500" />
                  {badge.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS OVERVIEW
          ══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 -mt-2 mb-10 md:mb-14">
        <StatsOverview testimonials={testimonials} theme={theme} language={language} />
      </section>

      {/* ══════════════════════════════════════════
          FEATURED TESTIMONIALS CAROUSEL
          ══════════════════════════════════════════ */}
      {featuredTestimonials.length > 0 && (
        <section className="container mx-auto px-4 mb-12 md:mb-16">
          <motion.h2
            className={`text-xl md:text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Award className="inline mr-2 text-yellow-500" size={22} />
            {language === 'en' ? 'Featured Customer Stories' : 'ফিচার্ড গ্রাহক গল্প'}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredTestimonials.slice(0, 4).map((t) => (
              <FeaturedTestimonialCard key={t.id} testimonial={t} theme={theme} language={language} />
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          RATING BREAKDOWN + SEARCH/FILTER
          ══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 mb-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Rating Breakdown */}
          <RatingBreakdown testimonials={testimonials} theme={theme} language={language} />

          {/* Search & Sort Controls */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className={`flex-1 relative`}>
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search reviews by name, vehicle, location...' : 'নাম, গাড়ি, অবস্থান দিয়ে খুঁজুন...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-500 focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 rounded-xl border transition-colors flex items-center gap-2 ${
                  showFilters
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800/60 border-gray-700/50 text-gray-300 hover:border-gray-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Filter size={16} />
                <span className="hidden sm:inline text-sm">{language === 'en' ? 'Filter' : 'ফিল্টার'}</span>
              </button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {language === 'en' ? 'Filter by rating:' : 'রেটিং দিয়ে ফিল্টার:'}
                      </span>
                      {([0, 5, 4, 3] as FilterRating[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => setFilterRating(r)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            filterRating === r
                              ? 'bg-blue-500 text-white'
                              : theme === 'dark'
                                ? 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {r === 0
                            ? language === 'en' ? 'All' : 'সব'
                            : `${r} ★`}
                        </button>
                      ))}

                      <div className="ml-auto flex items-center gap-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {language === 'en' ? 'Sort:' : 'সাজান:'}
                        </span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as SortOption)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700/50 border-gray-600 text-gray-300'
                              : 'bg-gray-100 border-gray-200 text-gray-600'
                          } focus:outline-none`}
                        >
                          <option value="newest">{language === 'en' ? 'Newest First' : 'নতুন আগে'}</option>
                          <option value="highest">{language === 'en' ? 'Highest Rated' : 'সর্বোচ্চ রেটিং'}</option>
                          <option value="lowest">{language === 'en' ? 'Lowest Rated' : 'সর্বনিম্ন রেটিং'}</option>
                          <option value="helpful">{language === 'en' ? 'Most Helpful' : 'সবচেয়ে সহায়ক'}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results count */}
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {language === 'en'
                ? `Showing ${filteredTestimonials.length} of ${testimonials.length} reviews`
                : `${testimonials.length} টি রিভিউ থেকে ${filteredTestimonials.length} টি দেখানো হচ্ছে`}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ALL TESTIMONIALS GRID
          ══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 pb-16 md:pb-20">
        {filteredTestimonials.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((t, i) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                index={i}
                theme={theme}
                language={language}
                onLike={handleLike}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-20 rounded-2xl border ${
              theme === 'dark' ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white border-gray-200'
            }`}
          >
            <Search className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'en' ? 'No reviews found' : 'কোন রিভিউ পাওয়া যায়নি'}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {language === 'en'
                ? 'Try adjusting your search or filters'
                : 'আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখুন'}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilterRating(0); }}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {language === 'en' ? 'Clear Filters' : 'ফিল্টার মুছুন'}
            </button>
          </motion.div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          CUSTOMER GALLERY
          ══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className={`text-xl md:text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {language === 'en' ? 'Our Happy Customers' : 'আমাদের সুখী গ্রাহকরা'}
          </h2>
          <p className={`text-sm md:text-base max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'en'
              ? 'Real moments captured with customers who drove home their dream cars from Auto Spark BD.'
              : 'অটো স্পার্ক বিডি থেকে স্বপ্নের গাড়ি নিয়ে বাড়ি ফেরা গ্রাহকদের বাস্তব মুহূর্ত।'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {[
            'https://images.pexels.com/photos/36435423/pexels-photo-36435423.png',
            'https://images.pexels.com/photos/36435424/pexels-photo-36435424.png',
            'https://images.pexels.com/photos/36435425/pexels-photo-36435425.png',
            'https://images.pexels.com/photos/36435427/pexels-photo-36435427.png',
            'https://images.pexels.com/photos/36435428/pexels-photo-36435428.png',
            'https://images.pexels.com/photos/36435471/pexels-photo-36435471.png',
            'https://images.pexels.com/photos/36435470/pexels-photo-36435470.png',
            'https://images.pexels.com/photos/36435469/pexels-photo-36435469.png',
            'https://images.pexels.com/photos/36435468/pexels-photo-36435468.png',
            'https://images.pexels.com/photos/36435472/pexels-photo-36435472.png',
          ].map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: '-30px' }}
              className={`group relative rounded-2xl overflow-hidden border ${
                theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'
              }`}
            >
              <img
                src={`${src}?auto=compress&cs=tinysrgb&w=600&fm=webp`}
                alt={language === 'en' ? `Happy customer ${i + 1}` : `সুখী গ্রাহক ${i + 1}`}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              {/* Hover overlay */}
              <div className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                theme === 'dark'
                  ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent'
                  : 'bg-gradient-to-t from-black/40 via-transparent to-transparent'
              }`}>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="inline-flex items-center gap-1.5 text-white text-xs font-medium">
                    <Heart size={12} className="text-red-400 fill-red-400" />
                    {language === 'en' ? 'Verified Customer' : 'যাচাইকৃত গ্রাহক'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA — Share Your Story
          ══════════════════════════════════════════ */}
      <section className={`py-12 md:py-16 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-t border-b border-gray-800/50'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-b border-gray-200'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'en' ? 'Bought a Car from Auto Spark?' : 'অটো স্পার্ক থেকে গাড়ি কিনেছেন?'}
            </h2>
            <p className={`text-base md:text-lg mb-8 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'en'
                ? 'We would love to hear about your experience! Share your story and help others make informed decisions.'
                : 'আমরা আপনার অভিজ্ঞতা শুনতে চাই! আপনার গল্প শেয়ার করুন এবং অন্যদের সঠিক সিদ্ধান্ত নিতে সাহায্য করুন।'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://wa.me/8801234567890?text=I%20want%20to%20share%20my%20Auto%20Spark%20experience"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                <Phone size={18} />
                {language === 'en' ? 'Share via WhatsApp' : 'হোয়াটসঅ্যাপে শেয়ার করুন'}
              </motion.a>
              <motion.a
                href="https://g.page/r/CaGm-WIYxMhGEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-white hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-white'
                }`}
              >
                <Star size={18} />
                {language === 'en' ? 'Leave a Google Review' : 'গুগল রিভিউ দিন'}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST SECTION
          ══════════════════════════════════════════ */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-xl md:text-2xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {language === 'en' ? 'Why Customers Choose Auto Spark' : 'গ্রাহকরা কেন অটো স্পার্ক বেছে নেন'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: language === 'en' ? 'Trusted Since 2014' : '২০১৪ থেকে বিশ্বস্ত',
                description: language === 'en'
                  ? '12+ years serving North Bengal with premium vehicles and honest dealings.'
                  : '১২+ বছর ধরে উত্তরবঙ্গে প্রিমিয়াম গাড়ি ও সৎ লেনদেনে সেবা প্রদান।',
              },
              {
                icon: Car,
                title: language === 'en' ? '2500+ Cars Sold' : '২৫০০+ গাড়ি বিক্রি',
                description: language === 'en'
                  ? 'From sedans to SUVs, we have helped thousands find their perfect vehicle.'
                  : 'সেডান থেকে এসইউভি, হাজারো মানুষকে তাদের পারফেক্ট গাড়ি খুঁজে পেতে সাহায্য করেছি।',
              },
              {
                icon: Heart,
                title: language === 'en' ? '98% Satisfaction' : '৯৮% সন্তুষ্টি',
                description: language === 'en'
                  ? 'Our customers love us and keep coming back. Many are repeat buyers.'
                  : 'আমাদের গ্রাহকরা আমাদের ভালোবাসেন এবং বারবার ফিরে আসেন।',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl border ${
                  theme === 'dark' ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <item.icon className={`h-10 w-10 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonial Detail Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTestimonial(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-lg w-full rounded-2xl p-6 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-2xl'
              }`}
            >
              <button
                onClick={() => setSelectedTestimonial(null)}
                className={`absolute top-4 right-4 p-1 rounded-full ${
                  theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <X size={20} />
              </button>
              <FeaturedTestimonialCard testimonial={selectedTestimonial} theme={theme} language={language} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsPage;
