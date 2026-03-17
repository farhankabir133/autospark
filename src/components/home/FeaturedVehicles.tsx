

import type { Vehicle } from '../../types';

type Props = { vehicles: Vehicle[] };

// Ultra-minimal, no CSS, no classes, no animation, only semantic HTML
export default function FeaturedVehicles({ vehicles }: Props) {
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section aria-label="Featured vehicles">
      <h3>Featured Vehicles</h3>
      <ul>
        {vehicles.map(v => (
          <li key={v.id}>
            <a href={`/vehicle/${v.id}`} aria-label={`${v.model} ${v.year}`}>
              <img
                src={v.images && v.images[0] && v.images[0].image_url ? v.images[0].image_url : '/imgs/vehicle-placeholder.webp'}
                alt={v.model}
                loading="lazy"
                onError={e => { (e.currentTarget as HTMLImageElement).src = '/imgs/vehicle-placeholder.webp'; }}
                width="120"
                height="60"
              />
              <div>{v.model} · {v.year}</div>
              <div>{v.price ? `৳${(v.price).toLocaleString()}` : ''}</div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
