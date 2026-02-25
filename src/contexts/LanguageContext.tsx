import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored === 'bn' ? 'bn' : 'en') as Language;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    'site.title': 'Auto Spark BD',
    'site.tagline': 'Exclusive Cars in Rajshahi',
    'site.description': 'North Bengal\'s Leading Premium Car Showroom',

    'nav.home': 'Home',
    'nav.inventory': 'Inventory',
    'nav.services': 'Services',
    'nav.accessories': 'Accessories',
    'nav.about': 'About',
    'nav.sell': 'Sell Your Car',
    'nav.contact': 'Contact',

    'hero.title': 'Exclusive Cars in Rajshahi',
    'hero.subtitle': 'North Bengal\'s Leading Premium Car Showroom',
    'hero.browse': 'Browse Inventory',
    'hero.book_service': 'Book Service',
    'hero.sell': 'Sell Your Car',

    'filter.brand': 'Brand',
    'filter.model': 'Model',
    'filter.year': 'Year',
    'filter.price': 'Price Range',
    'filter.fuel': 'Fuel Type',
    'filter.transmission': 'Transmission',
    'filter.search': 'Search',
    'filter.reset': 'Reset Filters',

    'vehicle.view_details': 'View Details',
    'vehicle.reserve': 'Reserve Now',
    'vehicle.stock': 'Stock #',
    'vehicle.price': 'Price',
    'vehicle.year': 'Year',
    'vehicle.mileage': 'Mileage',
    'vehicle.fuel': 'Fuel Type',
    'vehicle.transmission': 'Transmission',
    'vehicle.condition': 'Condition',
    'vehicle.features': 'Features',
    'vehicle.specifications': 'Specifications',
    'vehicle.contact': 'Contact Us',
    'vehicle.whatsapp': 'WhatsApp',
    'vehicle.calculate_emi': 'Calculate EMI',
    'vehicle.trade_in': 'Trade-in Value',

    'service.title': 'Advanced Automotive Service Center',
    'service.subtitle': 'Expert care for your vehicle',
    'service.book': 'Book Service',
    'service.oil_change': 'Oil Change',
    'service.ac': 'AC Service',
    'service.diagnostics': 'Diagnostics',
    'service.battery': 'Battery Replacement',
    'service.parking': 'Parking Sensors',
    'service.engine': 'Engine Repair',

    'booking.select_service': 'Select Service',
    'booking.select_date': 'Select Date',
    'booking.select_time': 'Select Time',
    'booking.your_info': 'Your Information',
    'booking.confirm': 'Confirm Booking',
    'booking.success': 'Booking Confirmed',

    'form.name': 'Full Name',
    'form.email': 'Email Address',
    'form.phone': 'Phone Number',
    'form.address': 'Address',
    'form.message': 'Message',
    'form.submit': 'Submit',
    'form.required': 'Required',

    'shop.add_to_cart': 'Add to Cart',
    'shop.view_cart': 'View Cart',
    'shop.checkout': 'Checkout',
    'shop.category': 'Category',
    'shop.in_stock': 'In Stock',
    'shop.out_of_stock': 'Out of Stock',

    'contact.title': 'Get in Touch',
    'contact.address': 'Station Road, Sheroil, Boalia, Rajshahi, Bangladesh',
    'contact.hours': 'Business Hours',
    'contact.hours_value': 'Sat-Thu: 9AM - 8PM',

    'footer.about': 'About Auto Spark BD',
    'footer.description': 'Leading exclusive car showroom in North Bengal, offering premium vehicles and expert service.',
    'footer.quick_links': 'Quick Links',
    'footer.contact_info': 'Contact Info',
    'footer.follow': 'Follow Us',
    'footer.rights': 'All rights reserved.',

    'about.title': 'About Us',
    'about.story': 'Our Story',
    'about.values': 'Our Values',
    'about.team': 'Our Team',

    'sell.title': 'Sell Your Car',
    'sell.subtitle': 'Get the best value for your vehicle',
    'sell.valuation': 'Get Free Valuation',
    'sell.upload': 'Upload Photos',
    'sell.submit': 'Submit Request',

    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.bdt': 'BDT',
  },
  bn: {
    'site.title': 'অটো স্পার্ক বিডি',
    'site.tagline': 'রাজশাহীতে এক্সক্লুসিভ গাড়ি',
    'site.description': 'উত্তরবঙ্গের শীর্ষস্থানীয় প্রিমিয়াম গাড়ির শোরুম',

    'nav.home': 'হোম',
    'nav.inventory': 'গাড়ি',
    'nav.services': 'সেবা',
    'nav.accessories': 'এক্সেসরিজ',
    'nav.about': 'সম্পর্কে',
    'nav.sell': 'গাড়ি বিক্রয়',
    'nav.contact': 'যোগাযোগ',

    'hero.title': 'রাজশাহীতে এক্সক্লুসিভ গাড়ি',
    'hero.subtitle': 'উত্তরবঙ্গের শীর্ষস্থানীয় প্রিমিয়াম গাড়ির শোরুম',
    'hero.browse': 'গাড়ি দেখুন',
    'hero.book_service': 'সার্ভিস বুক করুন',
    'hero.sell': 'গাড়ি বিক্রয় করুন',

    'filter.brand': 'ব্র্যান্ড',
    'filter.model': 'মডেল',
    'filter.year': 'বছর',
    'filter.price': 'মূল্য সীমা',
    'filter.fuel': 'জ্বালানি ধরন',
    'filter.transmission': 'ট্রান্সমিশন',
    'filter.search': 'অনুসন্ধান',
    'filter.reset': 'রিসেট',

    'vehicle.view_details': 'বিস্তারিত দেখুন',
    'vehicle.reserve': 'রিজার্ভ করুন',
    'vehicle.stock': 'স্টক নং',
    'vehicle.price': 'মূল্য',
    'vehicle.year': 'বছর',
    'vehicle.mileage': 'মাইলেজ',
    'vehicle.fuel': 'জ্বালানি',
    'vehicle.transmission': 'ট্রান্সমিশন',
    'vehicle.condition': 'অবস্থা',
    'vehicle.features': 'বৈশিষ্ট্য',
    'vehicle.specifications': 'স্পেসিফিকেশন',
    'vehicle.contact': 'যোগাযোগ',
    'vehicle.whatsapp': 'হোয়াটসঅ্যাপ',
    'vehicle.calculate_emi': 'ইএমআই হিসাব',
    'vehicle.trade_in': 'পুরাতন গাড়ির মূল্য',

    'service.title': 'উন্নত অটোমোটিভ সার্ভিস সেন্টার',
    'service.subtitle': 'আপনার গাড়ির জন্য বিশেষজ্ঞ পরিচর্যা',
    'service.book': 'সার্ভিস বুক করুন',
    'service.oil_change': 'অয়েল চেঞ্জ',
    'service.ac': 'এসি সার্ভিস',
    'service.diagnostics': 'ডায়াগনস্টিকস',
    'service.battery': 'ব্যাটারি প্রতিস্থাপন',
    'service.parking': 'পার্কিং সেন্সর',
    'service.engine': 'ইঞ্জিন মেরামত',

    'booking.select_service': 'সেবা নির্বাচন করুন',
    'booking.select_date': 'তারিখ নির্বাচন করুন',
    'booking.select_time': 'সময় নির্বাচন করুন',
    'booking.your_info': 'আপনার তথ্য',
    'booking.confirm': 'নিশ্চিত করুন',
    'booking.success': 'বুকিং সফল',

    'form.name': 'পূর্ণ নাম',
    'form.email': 'ইমেইল',
    'form.phone': 'ফোন নম্বর',
    'form.address': 'ঠিকানা',
    'form.message': 'বার্তা',
    'form.submit': 'জমা দিন',
    'form.required': 'প্রয়োজনীয়',

    'shop.add_to_cart': 'কার্টে যোগ করুন',
    'shop.view_cart': 'কার্ট দেখুন',
    'shop.checkout': 'চেকআউট',
    'shop.category': 'ক্যাটাগরি',
    'shop.in_stock': 'স্টকে আছে',
    'shop.out_of_stock': 'স্টক শেষ',

    'contact.title': 'যোগাযোগ করুন',
    'contact.address': 'স্টেশন রোড, শেরোইল, বোয়ালিয়া, রাজশাহী, বাংলাদেশ',
    'contact.hours': 'ব্যবসার সময়',
    'contact.hours_value': 'শনি-বৃহঃ: সকাল ৯টা - রাত ৮টা',

    'footer.about': 'অটো স্পার্ক বিডি সম্পর্কে',
    'footer.description': 'উত্তরবঙ্গের শীর্ষস্থানীয় এক্সক্লুসিভ গাড়ির শোরুম, প্রিমিয়াম গাড়ি এবং বিশেষজ্ঞ সেবা প্রদান করে।',
    'footer.quick_links': 'দ্রুত লিংক',
    'footer.contact_info': 'যোগাযোগের তথ্য',
    'footer.follow': 'ফলো করুন',
    'footer.rights': 'সর্বস্বত্ব সংরক্ষিত।',

    'about.title': 'আমাদের সম্পর্কে',
    'about.story': 'আমাদের কাহিনী',
    'about.values': 'আমাদের মূল্যবোধ',
    'about.team': 'আমাদের টিম',

    'sell.title': 'আপনার গাড়ি বিক্রয় করুন',
    'sell.subtitle': 'আপনার গাড়ির জন্য সেরা মূল্য পান',
    'sell.valuation': 'বিনামূল্যে মূল্যায়ন পান',
    'sell.upload': 'ছবি আপলোড করুন',
    'sell.submit': 'অনুরোধ জমা দিন',

    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'একটি সমস্যা হয়েছে',
    'common.success': 'সফল!',
    'common.close': 'বন্ধ করুন',
    'common.next': 'পরবর্তী',
    'common.previous': 'পূর্ববর্তী',
    'common.save': 'সংরক্ষণ',
    'common.cancel': 'বাতিল',
    'common.delete': 'মুছুন',
    'common.edit': 'সম্পাদনা',
    'common.view': 'দেখুন',
    'common.bdt': '৳',
  },
};
