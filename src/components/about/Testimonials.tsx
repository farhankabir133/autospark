import React from 'react';
import { Card } from '../../components/ui/Card';
import { Quote, Star } from 'lucide-react';
import { motion } from 'framer-motion';

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const Testimonials: React.FC<{ items: Testimonial[]; language: string; theme: string }> = ({ items, language: _language, theme }) => {
  return (
    <>
      {items.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white'} relative`}>
            <Quote className="absolute top-4 right-4 w-10 h-10 text-[#C00000]/10" />
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#C00000]/30"
                loading="lazy"
                width={56}
                height={56}
                decoding="async"
                srcSet={`${testimonial.image}&fm=webp&w=300 300w, ${testimonial.image}&fm=webp&w=600 600w`}
                sizes="(max-width: 640px) 56px, 56px"
              />
              <div>
                <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</h4>
                <p className="text-[#C00000] text-sm">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed italic`}>
              "{testimonial.quote}"
            </p>
          </Card>
        </motion.div>
      ))}
    </>
  );
};

export default Testimonials;
