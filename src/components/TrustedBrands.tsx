'use client';

import { Language } from '@/i18n/config';

interface TrustedBrandsProps {
  lang: Language;
}

const brands = [
  { name: 'Nike', logo: 'NIKE' },
  { name: 'Adidas', logo: 'adidas' },
  { name: 'Gucci', logo: 'GUCCI' },
  { name: 'Zara', logo: 'ZARA' },
  { name: 'H&M', logo: 'H&M' },
  { name: 'Puma', logo: 'PUMA' },
  { name: 'Chanel', logo: 'CHANEL' },
  { name: 'Dior', logo: 'DIOR' },
  { name: 'Louis Vuitton', logo: 'LV' },
  { name: 'Balenciaga', logo: 'BALENCIAGA' },
  { name: 'Versace', logo: 'VERSACE' },
  { name: 'Fendi', logo: 'FENDI' },
];

export default function TrustedBrands({ lang }: TrustedBrandsProps) {
  const title = lang === 'en' 
    ? 'Trusted by creators & brands worldwide' 
    : 'La confiance des créateurs et marques du monde entier';

  return (
    <section className="py-16 border-y border-gray-800/50 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-lg sm:text-xl text-gray-400 font-medium mb-12">
          {title}
        </h2>
      </div>

      {/* Scrolling container */}
      <div className="relative">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

        {/* Scrolling brands */}
        <div className="flex animate-scroll">
          {/* First set */}
          <div className="flex items-center gap-16 px-8 shrink-0">
            {brands.map((brand, index) => (
              <div
                key={`brand-1-${index}`}
                className="flex items-center justify-center min-w-[120px] h-12 text-gray-500 hover:text-gray-300 transition-colors duration-300"
              >
                <span className="text-xl sm:text-2xl font-bold tracking-wider whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
                  {brand.logo}
                </span>
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-16 px-8 shrink-0">
            {brands.map((brand, index) => (
              <div
                key={`brand-2-${index}`}
                className="flex items-center justify-center min-w-[120px] h-12 text-gray-500 hover:text-gray-300 transition-colors duration-300"
              >
                <span className="text-xl sm:text-2xl font-bold tracking-wider whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
                  {brand.logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
