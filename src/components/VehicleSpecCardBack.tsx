import { motion } from 'framer-motion';
import { Zap, Fuel, Cog, Calendar, Shield, Award, Gauge, Droplet } from 'lucide-react';

interface VehicleSpecCardBackProps {
  vehicle: {
    id: string;
    name: string;
    engine: string;
    fuel: string;
    transmission: string;
    year: number;
    gradient: string;
    lightGradient: string;
    price: string;
    safetyRating?: number; // 1-5
    warrantyYears?: number;
    mileage?: string;
    emissions?: string;
    horsepower?: number;
    torque?: string;
    efficiency?: number; // km/l
    features?: string[];
  };
  theme: string;
}

export const VehicleSpecCardBack = ({
  vehicle,
  theme,
}: VehicleSpecCardBackProps) => {
  const specIcons = {
    engine: <Zap className="w-4 h-4" />,
    fuel: <Fuel className="w-4 h-4" />,
    transmission: <Cog className="w-4 h-4" />,
    year: <Calendar className="w-4 h-4" />,
    safety: <Shield className="w-4 h-4" />,
    warranty: <Award className="w-4 h-4" />,
    mileage: <Gauge className="w-4 h-4" />,
    emissions: <Droplet className="w-4 h-4" />,
  };

  const fuelTypeColors: Record<string, string> = {
    'Petrol': 'bg-orange-500',
    'Diesel': 'bg-green-700',
    'Hybrid': 'bg-blue-600',
    'Electric': 'bg-purple-600',
  };

  const safetyStars = vehicle.safetyRating ? Array(Math.min(vehicle.safetyRating, 5)).fill(0) : [];

  return (
    <div className={`absolute inset-0 rounded-xl p-4 bg-gradient-to-br ${
      theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-gray-100 to-white'
    } shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="mb-3">
          <h4 className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {vehicle.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded text-white ${fuelTypeColors[vehicle.fuel] || 'bg-gray-600'}`}>
              {vehicle.fuel}
            </span>
            <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {vehicle.year}
            </span>
          </div>
        </div>

        {/* Main Specs Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Engine */}
          <motion.div
            className={`flex items-center gap-1.5 p-2 rounded ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-orange-500">{specIcons.engine}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Engine</p>
              <p className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {vehicle.engine}
              </p>
            </div>
          </motion.div>

          {/* Transmission */}
          <motion.div
            className={`flex items-center gap-1.5 p-2 rounded ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="text-blue-500">{specIcons.transmission}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Trans</p>
              <p className={`text-xs font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {vehicle.transmission}
              </p>
            </div>
          </motion.div>

          {/* Efficiency */}
          {vehicle.efficiency && (
            <motion.div
              className={`flex items-center gap-1.5 p-2 rounded ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-green-500">{specIcons.mileage}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Mileage</p>
                <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {vehicle.efficiency}km/l
                </p>
              </div>
            </motion.div>
          )}

          {/* Horsepower */}
          {vehicle.horsepower && (
            <motion.div
              className={`flex items-center gap-1.5 p-2 rounded ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-red-500">{specIcons.engine}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>HP</p>
                <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {vehicle.horsepower}hp
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Extended Info */}
        <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mb-2">
          <div className="space-y-1.5">
            {/* Safety Rating */}
            {vehicle.safetyRating && (
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="text-yellow-500">{specIcons.safety}</div>
                  <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Safety
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {safetyStars.map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * i }}
                      viewport={{ once: true }}
                      className="text-yellow-500"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Warranty */}
            {vehicle.warrantyYears && (
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="text-green-500">{specIcons.warranty}</div>
                  <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Warranty
                  </span>
                </div>
                <span className={`text-xs font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {vehicle.warrantyYears} years
                </span>
              </motion.div>
            )}

            {/* Emissions */}
            {vehicle.emissions && (
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="text-blue-500">{specIcons.emissions}</div>
                  <span className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Emissions
                  </span>
                </div>
                <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {vehicle.emissions}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mb-2 flex-1">
            <p className={`text-[10px] font-bold mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Key Features
            </p>
            <div className="flex flex-wrap gap-1">
              {vehicle.features.slice(0, 4).map((feature, i) => (
                <motion.span
                  key={i}
                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    theme === 'dark'
                      ? 'bg-blue-600/20 text-blue-300'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  viewport={{ once: true }}
                >
                  {feature}
                </motion.span>
              ))}
              {vehicle.features.length > 4 && (
                <motion.span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    theme === 'dark'
                      ? 'bg-gray-600/50 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  +{vehicle.features.length - 4}
                </motion.span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
