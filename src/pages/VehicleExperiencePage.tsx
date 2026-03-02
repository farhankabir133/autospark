import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { InteractiveVehicleComparison } from '../components/3d/InteractiveVehicleComparison';
import { VirtualShowroomTour } from '../components/3d/VirtualShowroomTour';

export const VehicleExperiencePage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen pt-32 pb-20 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {language === 'en' ? 'Vehicle Experience' : 'গাড়ি অভিজ্ঞতা'}
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {language === 'en' 
              ? 'Explore our interactive tools to compare vehicles and tour our showroom in 360°'
              : '360° তে আমাদের শোরুম ট্যুর করতে এবং গাড়ি তুলনা করতে আমাদের ইন্টারেক্টিভ সরঞ্জামগুলি অন্বেষণ করুন'}
          </p>
        </motion.div>

        {/* Interactive Vehicle Comparison Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Interactive Vehicle Comparison' : 'ইন্টারেক্টিভ গাড়ি তুলনা'}
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? 'Compare multiple vehicles side-by-side with detailed specifications'
                  : 'বিস্তারিত স্পেসিফিকেশন সহ একাধিক গাড়ি পাশাপাশি তুলনা করুন'}
              </p>
            </motion.div>
            <div className="mt-4 h-1 w-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <InteractiveVehicleComparison />
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className={`my-16 h-1 w-full rounded-full ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent'
              : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'
          }`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        />

        {/* Virtual Showroom Tour Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'en' ? 'Virtual Showroom Tour' : 'ভার্চুয়াল শোরুম ট্যুর'}
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {language === 'en' 
                  ? 'Take a guided tour of our showroom and service facilities in 360°'
                  : '360° এ আমাদের শোরুম এবং পরিষেবা সুবিধাগুলির একটি গাইডেড ট্যুর করুন'}
              </p>
            </motion.div>
            <div className="mt-4 h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <VirtualShowroomTour />
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className={`rounded-2xl p-12 text-center mt-20 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-blue-900 to-cyan-900'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600'
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ 
            boxShadow: theme === 'dark' 
              ? '0 20px 40px rgba(59, 130, 246, 0.2)' 
              : '0 20px 40px rgba(37, 99, 235, 0.3)' 
          }}
        >
          <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white">
            {language === 'en' ? 'Ready to Find Your Perfect Vehicle?' : 'আপনার নিখুঁত গাড়ি খুঁজতে প্রস্তুত?'}
          </h3>
          <p className="text-lg mb-8 text-blue-100">
            {language === 'en' 
              ? 'Use these interactive tools to explore our inventory and discover the vehicle that matches your needs'
              : 'আমাদের ইনভেন্টরি অন্বেষণ করতে এবং আপনার প্রয়োজন অনুসারে গাড়ি আবিষ্কার করতে এই ইন্টারেক্টিভ সরঞ্জামগুলি ব্যবহার করুন'}
          </p>
          <motion.button
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
              theme === 'dark'
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-white/20 hover:bg-white/30'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === 'en' ? 'View Inventory' : 'ইনভেন্টরি দেখুন'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
