import { motion } from 'framer-motion';
import { Star, TrendingUp, Zap, AlertTriangle, Heart } from 'lucide-react';
import { useState } from 'react';

export type BadgeType = 'best-value' | 'popular' | 'new-arrival' | 'limited-stock' | 'featured' | 'none';

interface VehicleCardWithBadgesProps {
  id: string;
  brand: string;
  model: string;
  image: string;
  price: string;
  bodyType: string;
  badge?: BadgeType;
  theme: string;
  language: string;
  onCompare?: (vehicleId: string) => void;
}

export const VehicleCardWithBadges = ({
  id,
  brand,
  model,
  image,
  price,
  bodyType,
  badge = 'none',
  theme,
  language,
  onCompare,
}: VehicleCardWithBadgesProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getBadgeContent = () => {
    if (badge === 'none') return null;

    const badgeStyles: Record<Exclude<BadgeType, 'none'>, any> = {
      'best-value': {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
        icon: <Star className="w-4 h-4" />,
        label: language === 'en' ? 'Best Value' : 'সেরা মূল্য',
        animation: { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] },
      },
      'popular': {
        bg: 'bg-gradient-to-r from-red-500 to-pink-600',
        icon: <TrendingUp className="w-4 h-4" />,
        label: language === 'en' ? 'Popular' : 'জনপ্রিয়',
        animation: { rotate: [0, 360] },
      },
      'new-arrival': {
        bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
        icon: <Zap className="w-4 h-4" />,
        label: language === 'en' ? 'New Arrival' : 'নতুন আগমন',
        animation: { y: [0, -5, 0] },
      },
      'limited-stock': {
        bg: 'bg-gradient-to-r from-orange-500 to-red-600',
        icon: <AlertTriangle className="w-4 h-4" />,
        label: language === 'en' ? 'Limited Stock' : 'সীমিত স্টক',
        animation: { scale: [1, 1.15, 1] },
      },
      'featured': {
        bg: 'bg-gradient-to-r from-purple-500 to-indigo-600',
        icon: <Star className="w-4 h-4" />,
        label: language === 'en' ? 'Featured' : 'বৈশিষ্ট্যযুক্ত',
        animation: { rotate: [0, 360] },
      },
    };

    return badgeStyles[badge as Exclude<BadgeType, 'none'>];
  };

  const badgeData = getBadgeContent();

  const bgColor = theme === 'dark'
    ? 'bg-gray-800 hover:bg-gray-750'
    : 'bg-white hover:bg-gray-50';

  const borderColor = theme === 'dark'
    ? 'border-gray-700'
    : 'border-gray-200';

  return (
    <motion.div
      className={`${bgColor} rounded-2xl overflow-hidden border ${borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 group`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <motion.img
          src={image}
          alt={`${brand} ${model}`}
          className="w-full h-full object-cover"
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Badge */}
        {badgeData && badge !== 'none' && (
          <motion.div
            className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1 ${badgeData.bg} shadow-lg`}
            animate={badgeData.animation}
            transition={{
              duration: badge === 'popular' ? 20 : badge === 'limited-stock' ? 1.5 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {badgeData.icon}
            <span>{badgeData.label}</span>
          </motion.div>
        )}

        {/* Wishlist Button */}
        <motion.button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </motion.button>

        {/* Overlay */}
        <motion.div
          className={`absolute inset-0 ${
            theme === 'dark' ? 'bg-black/40' : 'bg-black/20'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <motion.p
          className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {brand}
        </motion.p>

        <motion.h3
          className={`text-lg font-bold mb-1 line-clamp-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {model}
        </motion.h3>

        <motion.p
          className={`text-sm mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {bodyType}
        </motion.p>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <motion.p
            className={`text-lg font-bold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {price}
          </motion.p>

          {onCompare && (
            <motion.button
              onClick={() => onCompare(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'en' ? 'Compare' : 'তুলনা'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
