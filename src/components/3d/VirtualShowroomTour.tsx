import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface ShowroomRoom {
  id: string;
  name: string;
  description: string;
  image: string;
  audioUrl?: string;
  points: { x: number; y: number; label: string; info: string }[];
}

interface VirtualShowroomTourProps {
  showrooms?: ShowroomRoom[];
}

export const VirtualShowroomTour: React.FC<VirtualShowroomTourProps> = ({
  showrooms = [
    {
      id: '1',
      name: 'Premium Sedans',
      description: 'Honda Civic, Honda Insight, and Toyota Crown Collection',
      image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221920%22 height=%221080%22%3E%3Cdefs%3E%3ClinearGradient id=%22grad1%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23fecaca%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23fed7aa%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23grad1)%22 width=%221920%22 height=%221080%22/%3E%3Ctext x=%2750%25%27 y=%2715%25%27 font-size=%2748%27 font-weight=%27bold%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EPremium Sedans Showroom%3C/text%3E%3Crect x=%27100%27 y=%27250%27 width=%27450%27 height=%27400%27 rx=%2720%27 fill=%27%23fecaca%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%27325%27 y=%27700%27 font-size=%2724%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EHonda Civic%3C/text%3E%3Crect x=%27735%27 y=%27250%27 width=%27450%27 height=%27400%27 rx=%2720%27 fill=%27%23d1fae5%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%27960%27 y=%27700%27 font-size=%2724%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EHonda Insight%3C/text%3E%3Crect x=%271370%27 y=%27250%27 width=%27450%27 height=%27400%27 rx=%2720%27 fill=%27%23c7d2fe%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%271595%27 y=%27700%27 font-size=%2724%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EToyota Crown%3C/text%3E%3C/svg%3E',
      points: [
        { x: 20, y: 50, label: 'Honda Civic', info: '2022-2023 | 1.8L i-VTEC | 141 HP' },
        { x: 50, y: 40, label: 'Honda Insight', info: '2022-2023 | 1.5L Hybrid | 131 HP' },
        { x: 80, y: 50, label: 'Toyota Crown', info: '2022-2023 | 2.5L Dual VVT-i | 203 HP' },
        { x: 50, y: 75, label: 'Reception', info: 'Test drive booking & inquiries' },
      ],
    },
    {
      id: '2',
      name: 'SUV & Crossover Section',
      description: 'Toyota Corolla Cross, Harrier, Honda CR-V, and Prado',
      image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221920%22 height=%221080%22%3E%3Cdefs%3E%3ClinearGradient id=%22grad2%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23dbeafe%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23bfdbfe%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23grad2)%22 width=%221920%22 height=%221080%22/%3E%3Ctext x=%2750%25%27 y=%2715%25%27 font-size=%2748%27 font-weight=%27bold%27 fill=%27%23374151%27 text-anchor=%27middle%27%3ESUV %26 Crossover Collection%3C/text%3E%3Crect x=%2780%27 y=%27250%27 width=%27400%27 height=%27400%27 rx=%2720%27 fill=%27%23e5e7eb%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%27280%27 y=%27700%27 font-size=%2720%27 fill=%27%23374151%27 text-anchor=%27middle%27%3ECorolla Cross%3C/text%3E%3Crect x=%27560%27 y=%27250%27 width=%27400%27 height=%27400%27 rx=%2720%27 fill=%27%23dbeafe%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%27760%27 y=%27700%27 font-size=%2720%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EHarrier%3C/text%3E%3Crect x=%271040%27 y=%27250%27 width=%27400%27 height=%27400%27 rx=%2720%27 fill=%27%23fed7aa%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%271240%27 y=%27700%27 font-size=%2720%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EHonda CR-V%3C/text%3E%3Crect x=%271520%27 y=%27250%27 width=%27400%27 height=%27400%27 rx=%2720%27 fill=%27%23fef3c7%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%271720%27 y=%27700%27 font-size=%2720%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EPrado%3C/text%3E%3C/svg%3E',
      points: [
        { x: 20, y: 50, label: 'Toyota Corolla Cross', info: '2022-2023 | 1.8L Hybrid | 122 HP' },
        { x: 50, y: 50, label: 'Toyota Harrier', info: '2022-2023 | 2.0L Dynamic Force | 169 HP' },
        { x: 80, y: 50, label: 'Honda CR-V', info: '2022-2023 | 1.5L Turbo | 190 HP' },
        { x: 50, y: 75, label: 'Toyota Prado', info: '2022-2023 | 2.7L V6 | 163 HP' },
      ],
    },
    {
      id: '3',
      name: 'Service Center',
      description: 'State-of-the-art maintenance facility for all brands',
      image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221920%22 height=%221080%22%3E%3Cdefs%3E%3ClinearGradient id=%22grad3%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23e5e7eb%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23f3f4f6%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23grad3)%22 width=%221920%22 height=%221080%22/%3E%3Ctext x=%2750%25%27 y=%2715%25%27 font-size=%2748%27 font-weight=%27bold%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EService Center%3C/text%3E%3Crect x=%27200%27 y=%27250%27 width=%27550%27 height=%27450%27 rx=%2720%27 fill=%27%23dbeafe%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%27475%27 y=%27700%27 font-size=%2724%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EService Bay 1%3C/text%3E%3Crect x=%271170%27 y=%27250%27 width=%27550%27 height=%27450%27 rx=%2720%27 fill=%27%23fed7aa%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%271445%27 y=%27700%27 font-size=%2724%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EService Bay 2%3C/text%3E%3C/svg%3E',
      points: [
        { x: 30, y: 40, label: 'Service Bay 1', info: 'Regular maintenance & repairs' },
        { x: 70, y: 40, label: 'Service Bay 2', info: 'Advanced diagnostics & tuning' },
        { x: 50, y: 75, label: 'Parts Store', info: 'Genuine OEM parts availability' },
      ],
    },
    {
      id: '4',
      name: 'Accessories & Customization',
      description: 'Premium add-ons and customizations for all models',
      image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221920%22 height=%221080%22%3E%3Cdefs%3E%3ClinearGradient id=%22grad4%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23f3e8ff%22/%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23ede9fe%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23grad4)%22 width=%221920%22 height=%221080%22/%3E%3Ctext x=%2750%25%27 y=%2715%25%27 font-size=%2748%27 font-weight=%27bold%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EAccessories %26 Customization%3C/text%3E%3Crect x=%27140%27 y=%27280%27 width=%27480%27 height=%27380%27 rx=%2720%27 fill=%27%23fce7f3%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%27380%27 y=%27700%27 font-size=%2724%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EInterior Upgrades%3C/text%3E%3Crect x=%27720%27 y=%27280%27 width=%27480%27 height=%27380%27 rx=%2720%27 fill=%27%23e0e7ff%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%27960%27 y=%27700%27 font-size=%2724%27 fill=%27%23374151%27 text-anchor=%27middle%27%3ETech Packages%3C/text%3E%3Crect x=%271300%27 y=%27280%27 width=%27480%27 height=%27380%27 rx=%2720%27 fill=%27%23dcfce7%27 stroke=%27%236b7280%27 stroke-width=%274%27/%3E%3Ctext x=%271540%27 y=%27700%27 font-size=%2724%27 fill=%27%23374151%27 text-anchor=%27middle%27%3EExterior Mods%3C/text%3E%3C/svg%3E',
      points: [
        { x: 20, y: 50, label: 'Interior Upgrades', info: 'Leather seats & premium dashboards' },
        { x: 50, y: 50, label: 'Tech Packages', info: 'Infotainment & safety systems' },
        { x: 80, y: 50, label: 'Exterior Mods', info: 'Wheels, bumpers, lighting kits' },
      ],
    },
  ],
}) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const currentRoom = showrooms[currentRoomIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const nextRoom = () => {
    setCurrentRoomIndex((prev) => (prev + 1) % showrooms.length);
    setSelectedPoint(null);
  };

  const prevRoom = () => {
    setCurrentRoomIndex((prev) => (prev - 1 + showrooms.length) % showrooms.length);
    setSelectedPoint(null);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio play failed, disable audio
        setAudioEnabled(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-white rounded-2xl overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 md:p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Virtual Showroom Tour</h2>
        <p className="text-purple-100">Explore our facilities in 360°</p>
      </div>

      {/* Main Viewer */}
      <div className="relative overflow-hidden bg-gray-900">
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative aspect-video overflow-hidden cursor-crosshair"
        >
          {/* Background Image */}
          <motion.img
            key={currentRoom.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={currentRoom.image}
            alt={currentRoom.name}
            className="w-full h-full object-cover"
          />

          {/* Parallax Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"
            animate={{
              x: (mousePosition.x - 50) * 20,
              y: (mousePosition.y - 50) * 20,
            }}
            transition={{ type: 'tween', ease: 'linear', duration: 0 }}
          />

          {/* Interactive Points */}
          {currentRoom.points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={() => setSelectedPoint(selectedPoint === index ? null : index)}
            >
              {/* Pulse Circle */}
              <motion.div
                className="absolute -inset-4 border-2 border-blue-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Center Dot */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg hover:bg-blue-600 transition"
              />

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: -40 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="absolute left-0 bottom-full mb-2 whitespace-nowrap bg-white text-gray-900 px-3 py-1 rounded-lg text-xs font-semibold shadow-lg"
              >
                {point.label}
              </motion.div>
            </motion.div>
          ))}

          {/* Room Title Overlay */}
          <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
            <h3 className="font-bold text-lg">{currentRoom.name}</h3>
            <p className="text-sm text-gray-300">{currentRoom.description}</p>
          </div>

          {/* Audio Toggle */}
          <motion.button
            onClick={toggleAudio}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
          >
            {audioEnabled ? (
              <Volume2 className="h-6 w-6" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </motion.button>

          {/* Navigation Arrows */}
          <motion.button
            onClick={prevRoom}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>

          <motion.button
            onClick={nextRoom}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>

          {/* Info Panel */}
          {selectedPoint !== null && (
            <motion.div
              key={selectedPoint}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm text-gray-900 p-4 rounded-lg shadow-2xl"
            >
              <h4 className="font-bold text-lg mb-2">{currentRoom.points[selectedPoint].label}</h4>
              <p className="text-gray-700">{currentRoom.points[selectedPoint].info}</p>
              <button
                onClick={() => setSelectedPoint(null)}
                className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Close ✕
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Room Navigation */}
      <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Tour Rooms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {showrooms.map((room, index) => (
              <motion.button
                key={room.id}
                onClick={() => {
                  setCurrentRoomIndex(index);
                  setSelectedPoint(null);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-lg border-2 transition text-left ${
                  currentRoomIndex === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-16 object-cover rounded mb-2"
                />
                <div className="text-xs font-semibold text-gray-900">{room.name}</div>
                <div className="text-xs text-gray-500">{room.points.length} points</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Room Info */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-gray-900">
              {currentRoomIndex + 1} / {showrooms.length}
            </h4>
            <span className="text-sm font-semibold text-blue-600">
              {currentRoom.points.length} Points of Interest
            </span>
          </div>
          <p className="text-sm text-gray-600">{currentRoom.description}</p>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
          <p className="font-semibold mb-2">How to explore:</p>
          <ul className="space-y-1 text-xs">
            <li>• Click on blue dots to see information</li>
            <li>• Move your mouse to see parallax effect</li>
            <li>• Use arrows to navigate between rooms</li>
            <li>• Enable audio for room descriptions</li>
          </ul>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        loop
      />
    </motion.div>
  );
};
