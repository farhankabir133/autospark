import { Award, Shield, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from '../components/ui/Card';

export const AboutPage = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="relative h-96 bg-gradient-to-r from-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1409999/pexels-photo-1409999.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-30"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {language === 'en' ? 'About Auto Spark BD' : 'অটো স্পার্ক বিডি সম্পর্কে'}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              {language === 'en'
                ? 'Leading the premium automotive market in North Bengal since 2014'
                : '২০১৪ সাল থেকে উত্তরবঙ্গের প্রিমিয়াম অটোমোটিভ বাজারে নেতৃত্ব দিচ্ছে'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Our Story' : 'আমাদের কাহিনী'}
            </h2>
            <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
              <p>
                {language === 'en'
                  ? 'Auto Spark BD was founded in 2014 with a vision to bring world-class automotive sales and service to Rajshahi. What started as a small showroom has grown into the leading premium car dealership in North Bengal.'
                  : 'অটো স্পার্ক বিডি ২০১৪ সালে রাজশাহীতে বিশ্বমানের অটোমোটিভ বিক্রয় এবং সেবা নিয়ে আসার লক্ষ্যে প্রতিষ্ঠিত হয়েছিল। যা একটি ছোট শোরুম হিসাবে শুরু হয়েছিল তা উত্তরবঙ্গের শীর্ষস্থানীয় প্রিমিয়াম গাড়ির ডিলারশিপে পরিণত হয়েছে।'}
              </p>
              <p>
                {language === 'en'
                  ? 'We specialize in premium and luxury vehicles, offering a curated selection of the finest automobiles from around the world. Our state-of-the-art service center ensures that your vehicle receives expert care from certified technicians.'
                  : 'আমরা প্রিমিয়াম এবং বিলাসবহুল গাড়িতে বিশেষজ্ঞ, বিশ্বজুড়ে সেরা অটোমোবাইলের একটি নির্বাচিত সংগ্রহ অফার করি। আমাদের অত্যাধুনিক সার্ভিস সেন্টার নিশ্চিত করে যে আপনার গাড়ি সার্টিফাইড টেকনিশিয়ানদের কাছ থেকে বিশেষজ্ঞ যত্ন পায়।'}
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: Award,
              title: language === 'en' ? 'Premium Quality' : 'প্রিমিয়াম মান',
              description: language === 'en' ? 'Only the finest vehicles' : 'শুধুমাত্র সেরা গাড়ি',
            },
            {
              icon: Shield,
              title: language === 'en' ? 'Trusted Service' : 'বিশ্বস্ত সেবা',
              description: language === 'en' ? 'Expert care & warranty' : 'বিশেষজ্ঞ যত্ন এবং ওয়ারেন্টি',
            },
            {
              icon: Users,
              title: language === 'en' ? 'Customer First' : 'গ্রাহক প্রথম',
              description: language === 'en' ? 'Personalized experience' : 'ব্যক্তিগত অভিজ্ঞতা',
            },
            {
              icon: TrendingUp,
              title: language === 'en' ? 'Market Leader' : 'বাজার নেতা',
              description: language === 'en' ? 'North Bengal\'s #1' : 'উত্তরবঙ্গের #১',
            },
          ].map((value, index) => (
            <Card key={index} className="p-6 text-center">
              <value.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Why Choose Us?' : 'কেন আমাদের নির্বাচন করবেন?'}
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {language === 'en'
              ? 'With over a decade of experience, we understand the needs of discerning customers who demand excellence. From sales to after-sales service, we are committed to delivering an exceptional experience.'
              : 'এক দশকের বেশি অভিজ্ঞতার সাথে, আমরা বিচক্ষণ গ্রাহকদের চাহিদা বুঝি যারা উৎকর্ষতা দাবি করেন। বিক্রয় থেকে বিক্রয়োত্তর সেবা পর্যন্ত, আমরা একটি ব্যতিক্রমী অভিজ্ঞতা প্রদানে প্রতিশ্রুতিবদ্ধ।'}
          </p>
        </Card>
      </div>
    </div>
  );
};
