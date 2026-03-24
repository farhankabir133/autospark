import React from 'react';
import { Card } from '../../components/ui/Card';
import { Linkedin, Facebook, Phone, Mail } from 'lucide-react';

type Person = {
  name: string;
  role: string;
  title?: string;
  image?: string;
  bio?: string;
};

const TeamCard: React.FC<{ person: Person; language: string; theme: string; showroom: any }> = ({ person, language, theme, showroom }) => {
  return (
    <Card className={`p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white'} overflow-hidden group hover:shadow-xl transition-all duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto md:mx-0 flex-shrink-0">
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full rounded-full object-cover border-3 border-[#C00000]/30 group-hover:border-[#C00000] transition-colors duration-300"
            loading="lazy"
            width={208}
            height={208}
            decoding="async"
            srcSet={`${person.image}&fm=webp&w=300 300w, ${person.image}&fm=webp&w=600 600w`}
            sizes="(max-width: 640px) 160px, 208px"
          />
        </div>
        <div className="text-center md:text-left flex-1">
          <span className="text-[#C00000] font-bold text-xs sm:text-sm">{person.title || ''}</span>
          <h4 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-1`}>{person.name}</h4>
          <p className="text-[#C00000] font-semibold text-xs sm:text-sm mb-2">{person.role}</p>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>{person.bio}</p>
          <div className="flex justify-center md:justify-start gap-2 mt-3">
            <a href={`https://${showroom.website}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#C00000]/10 flex items-center justify-center hover:bg-[#C00000] hover:text-white transition-colors" aria-label="Website">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href={showroom.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#C00000]/10 flex items-center justify-center hover:bg-[#C00000] hover:text-white transition-colors" aria-label="YouTube">
              <Facebook className="w-4 h-4" />
            </a>
            <a href={`tel:${showroom.phone}`} className="w-8 h-8 rounded-full bg-[#C00000]/10 flex items-center justify-center hover:bg-[#C00000] hover:text-white transition-colors" aria-label="Phone">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeamCard;
