import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Prado vehicle images
const PRADO_IMAGES = [
  {
    url: 'https://images.pexels.com/photos/36318402/pexels-photo-36318402.png',
    order: 1,
    isPrimary: true,
  },
  {
    url: 'https://images.pexels.com/photos/36318403/pexels-photo-36318403.png',
    order: 2,
    isPrimary: false,
  },
  {
    url: 'https://images.pexels.com/photos/36318404/pexels-photo-36318404.png',
    order: 3,
    isPrimary: false,
  },
  {
    url: 'https://images.pexels.com/photos/36318405/pexels-photo-36318405.png',
    order: 4,
    isPrimary: false,
  },
];

export const useSeedPradoImages = () => {
  const [isSeeded, setIsSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const seedPradoImages = async () => {
      try {
        // Find the Prado vehicle
        const { data: vehicles, error: vehicleError } = await supabase
          .from('vehicles')
          .select('id')
          .eq('model', 'Prado')
          .eq('brand_name', 'Toyota')
          .limit(1);

        if (vehicleError) {
          console.warn('Could not fetch Prado vehicle:', vehicleError);
          setError(vehicleError.message);
          return;
        }

        if (!vehicles || vehicles.length === 0) {
          console.warn('Prado vehicle not found in database');
          setError('Prado vehicle not found');
          return;
        }

        const pradoId = vehicles[0].id;

        // Check if images already exist
        const { data: existingImages, error: checkError } = await supabase
          .from('vehicle_images')
          .select('id')
          .eq('vehicle_id', pradoId);

        if (checkError) {
          console.warn('Could not check existing images:', checkError);
          return;
        }

        // Only add images if they don't exist
        if (existingImages && existingImages.length === 0) {
          const imagesToInsert = PRADO_IMAGES.map((img) => ({
            vehicle_id: pradoId,
            image_url: img.url,
            display_order: img.order,
            is_primary: img.isPrimary,
          }));

          const { error: insertError } = await supabase
            .from('vehicle_images')
            .insert(imagesToInsert);

          if (insertError) {
            console.warn('Could not insert Prado images:', insertError);
            setError(insertError.message);
            return;
          }

          console.log('✅ Prado images seeded successfully');
          setIsSeeded(true);
        } else {
          console.log('✅ Prado images already exist');
          setIsSeeded(true);
        }
      } catch (err) {
        console.warn('Error seeding Prado images:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    seedPradoImages();
  }, []);

  return { isSeeded, error };
};
