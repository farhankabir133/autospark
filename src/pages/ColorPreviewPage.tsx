import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// framer-motion not required here (kept minimal)

interface VehicleColor {
  name: string;
  hex: string;
  rgb: string;
  filterClass: string;
  image?: string;
}

export const ColorPreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as {
    vehicleModel?: string;
    selectedColor?: VehicleColor;
    availableColors?: VehicleColor[];
    displayImage?: string;
  };

  // Fallback: support query params for direct links (model, color, image)
  const query = new URLSearchParams(location.search);
  const fallbackModel = query.get('model') || state.vehicleModel || 'Vehicle';
  const fallbackColorName = query.get('color') || state.selectedColor?.name || '';
  const fallbackImage = query.get('image') || state.displayImage || '';

  const [vehicleModel] = useState<string>(fallbackModel);
  const [selectedColor, setSelectedColor] = useState<VehicleColor | null>(state.selectedColor || (fallbackColorName ? { name: fallbackColorName, hex: '#999', rgb: '', filterClass: '', image: fallbackImage } : null));
  const [availableColors] = useState<VehicleColor[]>(state.availableColors || (selectedColor ? [selectedColor] : []));
  const [displayImage, setDisplayImage] = useState<string>(state.displayImage || fallbackImage || '');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Preload available colors images
    availableColors.forEach(c => { if (c.image) { const img = new Image(); img.src = c.image; } });
  }, [availableColors]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [navigate]);

  const handleColorClick = (c: VehicleColor) => {
    setSelectedColor(c);
    if (c.image) setDisplayImage(c.image);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="px-3 py-2 rounded-md border">Back</button>
          <h1 className="text-xl font-bold">{vehicleModel} — {selectedColor?.name || ''}</h1>
          <div />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/5 dark:bg-black rounded-lg flex items-center justify-center min-h-[320px]">
            {!imageLoaded && (
              <div className="w-full h-full p-6">
                <div className="w-full h-80 md:h-[520px] rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
            )}

            {displayImage && (
              <img
                src={displayImage}
                alt={`${vehicleModel} ${selectedColor?.name}`}
                className={`w-full h-full object-contain p-6 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            )}
          </div>

          <div>
            <h2 className="font-semibold mb-3">Choose a color</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
              {availableColors.map(c => (
                <button key={c.name} onClick={() => handleColorClick(c)} className={`w-full aspect-square rounded-xl border-2 ${selectedColor?.name === c.name ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-gray-700'}`} style={{ backgroundColor: c.hex }}>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-sm">{selectedColor?.name}</p>
              <div className="flex gap-3">
                <button onClick={() => navigate(`/inventory?model=${encodeURIComponent(vehicleModel)}&color=${encodeURIComponent(selectedColor?.name || '')}`)} className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">Open in Inventory</button>
                <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPreviewPage;
