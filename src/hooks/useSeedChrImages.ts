import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// C-HR vehicle images
const CHR_IMAGES = [
  {
    url: 'https://images.pexels.com/photos/36324034/pexels-photo-36324034.png',
    order: 1,
    isPrimary: true,
  },
  {
    url: 'https://images.pexels.com/photos/36324033/pexels-photo-36324033.png',
    order: 2,
    isPrimary: false,
  },
  {
    url: 'https://images.pexels.com/photos/36324031/pexels-photo-36324031.png',
    order: 3,
    isPrimary: false,
  },
  {
    url: 'https://images.pexels.com/photos/36324032/pexels-photo-36324032.png',
    order: 4,
    isPrimary: false,
  },
];

export const useSeedChrImages = () => {
  const [isSeeded, setIsSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const seedChrImages = async () => {
      try {
        // Find the C-HR vehicle
        const { data: vehicles, error: vehicleError } = await supabase
          .from('vehicles')
          .select('id')
          .eq('model', 'C-HR')
          .eq('brand_name', 'Toyota')
          .limit(1);

        if (vehicleError) {
          console.warn('Could not fetch C-HR vehicle:', vehicleError);
          setError(vehicleError.message);
          return;
        }

        if (!vehicles || vehicles.length === 0) {
          console.warn('C-HR vehicle not found in database');
          setError('C-HR vehicle not found');
          return;
        }

        const chrId = vehicles[0].id;

        // Check if images already exist
        const { data: existingImages, error: checkError } = await supabase
          .from('vehicle_images')
          .select('id')
          .eq('vehicle_id', chrId);

        if (checkError) {
          console.warn('Could not check existing images:', checkError);
          return;
        }

        // Only add images if they don't exist
        if (existingImages && existingImages.length === 0) {
          const imagesToInsert = CHR_IMAGES.map((img) => ({
            vehicle_id: chrId,
            image_url: img.url,
            display_order: img.order,
            is_primary: img.isPrimary,
          }));

          const { error: insertError } = await supabase
            .from('vehicle_images')
            .insert(imagesToInsert);

          if (insertError) {
            console.warn('Could not insert C-HR images:', insertError);
            setError(insertError.message);
            return;
          }

          console.log('✅ C-HR images seeded successfully');
          setIsSeeded(true);
        } else {
          console.log('✅ C-HR images already exist');
          setIsSeeded(true);
        }
      } catch (err) {
        console.warn('Error seeding C-HR images:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    seedChrImages();
  }, []);

  return { isSeeded, error };
};
