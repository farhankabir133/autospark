import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Zap, 
  Fuel, 
  Gauge, 
  Users, 
  Wrench, 
  Filter, 
  TrendingUp,
  Award,
  DollarSign,
  Zap as Performance,
  Leaf
} from 'lucide-react';

interface ComparisonVehicle {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  specs: {
    engine: string;
    horsepower: number;
    torque: number;
    fuel_type: string;
    transmission: string;
    seating: number;
    mileage: string;
    acceleration: string;
    top_speed: string;
    warranty: string;
  };
}

interface InteractiveVehicleComparisonProps {
  vehicles?: ComparisonVehicle[];
}

export const InteractiveVehicleComparison: React.FC<InteractiveVehicleComparisonProps> = ({
  vehicles = [
    {
      id: '1',
      name: 'Corolla Cross',
      brand: 'Toyota',
      image: 'https://images.pexels.com/photos/3839293/pexels-photo-3839293.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      price: 2800000,
      specs: {
        engine: '1.8L Hybrid CVT',
        horsepower: 122,
        torque: 163,
        fuel_type: 'Hybrid',
        transmission: 'CVT Automatic',
        seating: 5,
        mileage: '23 km/l',
        acceleration: '10.1s (0-100)',
        top_speed: '200 km/h',
        warranty: '3 years / 100,000 km',
      },
    },
    {
      id: '2',
      name: 'Harrier',
      brand: 'Toyota',
      image: 'https://images.pexels.com/photos/36317728/pexels-photo-36317728.png',
      price: 4500000,
      specs: {
        engine: '2.0L Dynamic Force',
        horsepower: 169,
        torque: 205,
        fuel_type: 'Petrol',
        transmission: 'CVT Automatic',
        seating: 5,
        mileage: '16 km/l',
        acceleration: '9.3s (0-100)',
        top_speed: '210 km/h',
        warranty: '5 years / 100,000 km',
      },
    },
    {
      id: '3',
      name: 'Prado',
      brand: 'Toyota',
      image: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png',
      price: 7200000,
      specs: {
        engine: '2.7L V6 Petrol',
        horsepower: 163,
        torque: 246,
        fuel_type: 'Petrol',
        transmission: '5-Speed Automatic',
        seating: 7,
        mileage: '12 km/l',
        acceleration: '9.8s (0-100)',
        top_speed: '195 km/h',
        warranty: '5 years / 100,000 km',
      },
    },
    {
      id: '4',
      name: 'Civic',
      brand: 'Honda',
      image: 'https://images.pexels.com/photos/3769173/pexels-photo-3769173.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      price: 3200000,
      specs: {
        engine: '1.8L i-VTEC Petrol',
        horsepower: 141,
        torque: 174,
        fuel_type: 'Petrol',
        transmission: 'CVT Automatic',
        seating: 5,
        mileage: '18 km/l',
        acceleration: '8.9s (0-100)',
        top_speed: '220 km/h',
        warranty: '3 years / 90,000 km',
      },
    },
    {
      id: '5',
      name: 'Insight',
      brand: 'Honda',
      image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      price: 2600000,
      specs: {
        engine: '1.5L Hybrid i-VTEC',
        horsepower: 131,
        torque: 156,
        fuel_type: 'Hybrid',
        transmission: 'CVT Automatic',
        seating: 5,
        mileage: '24 km/l',
        acceleration: '9.5s (0-100)',
        top_speed: '210 km/h',
        warranty: '3 years / 90,000 km',
      },
    },
    {
      id: '6',
      name: 'Breeze',
      brand: 'Honda',
      image: 'https://images.pexels.com/photos/4076197/pexels-photo-4076197.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      price: 2200000,
      specs: {
        engine: '1.2L i-VTEC Petrol',
        horsepower: 90,
        torque: 110,
        fuel_type: 'Petrol',
        transmission: 'CVT Automatic',
        seating: 5,
        mileage: '21 km/l',
        acceleration: '10.2s (0-100)',
        top_speed: '195 km/h',
        warranty: '3 years / 90,000 km',
      },
    },
    {
      id: '7',
      name: 'CR-V',
      brand: 'Honda',
      image: 'https://images.pexels.com/photos/3807518/pexels-photo-3807518.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      price: 4200000,
      specs: {
        engine: '1.5L Turbo Petrol',
        horsepower: 190,
        torque: 243,
        fuel_type: 'Petrol',
        transmission: 'CVT Automatic',
        seating: 5,
        mileage: '14 km/l',
        acceleration: '8.3s (0-100)',
        top_speed: '225 km/h',
        warranty: '3 years / 90,000 km',
      },
    },
    {
      id: '8',
      name: 'X-Trail',
      brand: 'Nissan',
      image: 'https://images.pexels.com/photos/36317729/pexels-photo-36317729.png',
      price: 4000000,
      specs: {
        engine: '2.5L 4-Cylinder Petrol',
        horsepower: 181,
        torque: 244,
        fuel_type: 'Petrol',
        transmission: 'CVT Automatic',
        seating: 7,
        mileage: '15 km/l',
        acceleration: '8.9s (0-100)',
        top_speed: '210 km/h',
        warranty: '3 years / 100,000 km',
      },
    },
    {
      id: '9',
      name: 'Crown',
      brand: 'Toyota',
      image: 'https://images.pexels.com/photos/36317642/pexels-photo-36317642.png',
      price: 5600000,
      specs: {
        engine: '2.5L Dual VVT-i Petrol',
        horsepower: 203,
        torque: 243,
        fuel_type: 'Petrol',
        transmission: 'CVT Automatic',
        seating: 5,
        mileage: '13 km/l',
        acceleration: '7.5s (0-100)',
        top_speed: '230 km/h',
        warranty: '5 years / 100,000 km',
      },
    },
    {
      id: '10',
      name: 'Sienta',
      brand: 'Toyota',
      image: 'https://images.pexels.com/photos/36317730/pexels-photo-36317730.png',
      price: 2900000,
      specs: {
        engine: '1.5L Dual VVT-i Petrol',
        horsepower: 103,
        torque: 137,
        fuel_type: 'Petrol',
        transmission: 'CVT Automatic',
        seating: 7,
        mileage: '19 km/l',
        acceleration: '10.8s (0-100)',
        top_speed: '190 km/h',
        warranty: '3 years / 100,000 km',
      },
    },
    {
      id: '11',
      name: 'Yaris Cross',
      brand: 'Toyota',
      image: 'https://images.pexels.com/photos/36319317/pexels-photo-36319317.png',
      price: 3800000,
      specs: {
        engine: '1.5L Hybrid i-VTEC',
        horsepower: 112,
        torque: 148,
        fuel_type: 'Hybrid',
        transmission: 'CVT Automatic',
        seating: 5,
        mileage: '22 km/l',
        acceleration: '9.7s (0-100)',
        top_speed: '205 km/h',
        warranty: '3 years / 100,000 km',
      },
    },
  ],
}) => {
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(['1', '2']);
  const [expandedSpec, setExpandedSpec] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | '3d' | 'charts'>('all');
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 8000000]);
  const [fuelTypeFilter, setFuelTypeFilter] = useState<string[]>(['Hybrid', 'Petrol']);
  const [showFilters, setShowFilters] = useState(false);

  const specsArray = [
    { key: 'engine', label: 'Engine', icon: Wrench },
    { key: 'horsepower', label: 'Horsepower', icon: Zap },
    { key: 'torque', label: 'Torque (Nm)', icon: Gauge },
    { key: 'fuel_type', label: 'Fuel Type', icon: Fuel },
    { key: 'transmission', label: 'Transmission', icon: Wrench },
    { key: 'seating', label: 'Seating Capacity', icon: Users },
    { key: 'mileage', label: 'Fuel Efficiency', icon: Gauge },
    { key: 'acceleration', label: 'Acceleration (0-100)', icon: Zap },
    { key: 'top_speed', label: 'Top Speed', icon: Gauge },
    { key: 'warranty', label: 'Warranty', icon: Wrench },
  ];

  const toggleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId].slice(-4)
    );
  };

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => 
      v.price >= priceFilter[0] && 
      v.price <= priceFilter[1] &&
      fuelTypeFilter.includes(v.specs.fuel_type)
    );
  }, [priceFilter, fuelTypeFilter, vehicles]);

  const getSpecValue = (vehicle: ComparisonVehicle, specKey: string) => {
    return vehicle.specs[specKey as keyof ComparisonVehicle['specs']];
  };

  const selectedVehicleData = vehicles.filter((v) => selectedVehicles.includes(v.id));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Simple Radar Chart Component
  const RadarChart = ({ vehicle }: { vehicle: ComparisonVehicle }) => {
    const size = 200;
    const center = size / 2;
    const radius = 60;
    const categories = ['Power', 'Speed', 'Efficiency', 'Seating', 'Warranty'];
    
    // Normalize values to 0-100 scale
    const values = [
      (vehicle.specs.horsepower / 250) * 100,
      (parseInt(vehicle.specs.top_speed) / 250) * 100,
      (parseInt(vehicle.specs.mileage) / 25) * 100,
      (vehicle.specs.seating / 8) * 100,
      ((vehicle.specs.warranty.includes('5') ? 100 : 60)),
    ];

    const angle = (Math.PI * 2) / categories.length;
    const points = values.map((v, i) => {
      const a = angle * i - Math.PI / 2;
      const x = center + (v / 100) * radius * Math.cos(a);
      const y = center + (v / 100) * radius * Math.sin(a);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
        {/* Background circles */}
        {[20, 40, 60, 80, 100].map((r) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={(r / 100) * radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Axes */}
        {categories.map((_, i) => {
          const a = angle * i - Math.PI / 2;
          const x = center + radius * Math.cos(a);
          const y = center + radius * Math.sin(a);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#d1d5db"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={points}
          fill="#3b82f6"
          fillOpacity="0.2"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Category labels */}
        {categories.map((cat, i) => {
          const a = angle * i - Math.PI / 2;
          const x = center + (radius + 25) * Math.cos(a);
          const y = center + (radius + 25) * Math.sin(a);
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fontWeight="600"
              fill="#4b5563"
            >
              {cat}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-8 md:p-10 text-white shadow-lg">
        <h2 className="text-4xl font-bold mb-3">3D Interactive Vehicle Comparison</h2>
        <p className="text-blue-100 text-lg">Compare up to 3 vehicles side-by-side with detailed specifications</p>
      </div>

      {/* Vehicle Selection */}
      <div className="p-6 md:p-8 border-b border-gray-200">
        {/* Filters Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Select Vehicles to Compare</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <DollarSign size={16} className="inline mr-2" />
                    Price Range: {formatPrice(priceFilter[0])} - {formatPrice(priceFilter[1])}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="8000000"
                    step="100000"
                    value={priceFilter[1]}
                    onChange={(e) => setPriceFilter([priceFilter[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* Fuel Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <Leaf size={16} className="inline mr-2" />
                    Fuel Type
                  </label>
                  <div className="flex gap-3">
                    {['Hybrid', 'Petrol', 'Diesel'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fuelTypeFilter.includes(type)}
                          onChange={() => {
                            setFuelTypeFilter((prev) =>
                              prev.includes(type)
                                ? prev.filter((t) => t !== type)
                                : [...prev, type]
                            );
                          }}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredVehicles.map((vehicle) => (
            <motion.button
              key={vehicle.id}
              onClick={() => toggleVehicleSelection(vehicle.id)}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-2xl border-2 transition duration-300 cursor-pointer shadow-md hover:shadow-xl ${
                selectedVehicles.includes(vehicle.id)
                  ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-400'
              }`}
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 mb-2 overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.name}`}
                  className="w-full h-48 object-contain"
                />
              </div>
              <div className="text-xs font-semibold text-gray-700">{vehicle.brand}</div>
              <div className="text-sm font-bold text-blue-600 mt-1">{vehicle.name}</div>
              <div className="text-xs text-gray-500 mt-2 font-medium">{formatPrice(vehicle.price)}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 3D Comparison View */}
      {selectedVehicleData.length > 0 && (
        <div className="p-6 md:p-8">
          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Wrench size={18} />
              All Specs
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                viewMode === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Award size={18} />
              3D Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('charts')}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                viewMode === 'charts'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <TrendingUp size={18} />
              Charts
            </button>
          </div>

          {/* 3D Visualization */}
          {viewMode === '3d' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 overflow-x-auto bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8"
            >
              <div className="flex gap-10 pb-4 min-w-max">
                {selectedVehicleData.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="flex-shrink-0 w-[28rem]"
                  >
                    <motion.div 
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
                    >
                      <div className="bg-gradient-to-br from-gray-100 via-gray-50 to-white p-6 h-[36rem] flex items-center justify-center">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.brand} ${vehicle.name}`}
                          className="w-full h-full object-contain drop-shadow-lg"
                        />
                      </div>
                    </motion.div>
                    <div className="mt-6 text-center">
                      <h4 className="font-bold text-2xl text-gray-900 mt-2">
                        {vehicle.brand} {vehicle.name}
                      </h4>
                      <p className="text-blue-600 font-bold text-lg mt-2">{formatPrice(vehicle.price)}</p>
                      <p className="text-gray-500 text-sm mt-2">2022-2023 Model | Premium Edition</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Charts View */}
          {viewMode === 'charts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 bg-gradient-to-b from-gray-50 to-white rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Performance Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {selectedVehicleData.map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h4 className="font-bold text-gray-900 mb-4">{vehicle.name}</h4>
                    <RadarChart vehicle={vehicle} />
                  </motion.div>
                ))}
              </div>

              {/* Bar Charts */}
              <div className="mt-12 grid md:grid-cols-2 gap-8">
                {/* Horsepower Comparison */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-blue-600" />
                    Horsepower (HP)
                  </h4>
                  <div className="space-y-3">
                    {selectedVehicleData.map((vehicle) => {
                      const maxHp = 250;
                      const percent = (vehicle.specs.horsepower / maxHp) * 100;
                      return (
                        <div key={vehicle.id}>
                          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                            <span>{vehicle.name}</span>
                            <span className="text-blue-600">{vehicle.specs.horsepower} HP</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Efficiency Comparison */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Leaf size={20} className="text-green-600" />
                    Fuel Efficiency (km/l)
                  </h4>
                  <div className="space-y-3">
                    {selectedVehicleData.map((vehicle) => {
                      const mileage = parseInt(vehicle.specs.mileage);
                      const percent = (mileage / 25) * 100;
                      return (
                        <div key={vehicle.id}>
                          <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                            <span>{vehicle.name}</span>
                            <span className="text-green-600">{vehicle.specs.mileage}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="h-full bg-gradient-to-r from-green-500 to-green-600"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'all' && (
            <div className="mb-8"></div>
          )}

          {/* Specs Comparison - Show in all and 3d modes */}
          {(viewMode === 'all' || viewMode === '3d') && (
          <div className="space-y-3">
            {specsArray.map((spec) => {
              const Icon = spec.icon;
              const isExpanded = expandedSpec === spec.key;

              return (
                <motion.div key={spec.key} className="border border-gray-200 rounded-lg overflow-hidden">
                  <motion.button
                    onClick={() => setExpandedSpec(isExpanded ? null : spec.key)}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{spec.label}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-600" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-4 bg-white">
                          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedVehicleData.length}, 1fr)` }}>
                            {selectedVehicleData.map((vehicle) => (
                              <div key={vehicle.id} className="text-center">
                                <div className="text-xs text-gray-600 mb-2">
                                  {vehicle.brand} {vehicle.name}
                                </div>
                                <div className="font-bold text-lg text-gray-900">
                                  {getSpecValue(vehicle, spec.key)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          )}

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              Compare More Details
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition">
              Request Quote
            </button>
          </div>
        </div>
      )}

      {selectedVehicleData.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-gray-600 text-lg">Select vehicles above to start comparing</p>
        </div>
      )}
    </motion.div>
  );
};
