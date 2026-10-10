import { MapPin, Phone, Clock } from 'lucide-react';

const SHOWROOMS = [
  { name: 'Rajshahi Showroom', address: 'Rajshahi, Bangladesh', phone: '+8801760401605', hours: 'Sat–Thu, 9am–8pm' },
];

/** Single source of truth for showroom cards (About/Contact/Home reuse). */
export function ShowroomCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {SHOWROOMS.map(s => (
        <div key={s.name} className="rounded-xl border p-5">
          <h3 className="font-semibold flex items-center gap-2"><MapPin size={16} aria-hidden />{s.name}</h3>
          <p className="mt-1 text-sm opacity-80">{s.address}</p>
          <p className="mt-2 text-sm flex items-center gap-2"><Phone size={14} aria-hidden /><a href={`tel:${s.phone}`}>{s.phone}</a></p>
          <p className="mt-1 text-sm flex items-center gap-2"><Clock size={14} aria-hidden />{s.hours}</p>
        </div>
      ))}
    </div>
  );
}
