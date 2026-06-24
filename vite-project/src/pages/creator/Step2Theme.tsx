import React from 'react';
import type { CardData } from '../../types';
import { themeConfigs, themeImages } from '../../utils/constants';

interface Step2Props {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  setSavedSlug: (slug: string | null) => void;
  dbThemes: any[];
}

export const Step2Theme: React.FC<Step2Props> = ({ 
  cardData, 
  setCardData, 
  setSavedSlug, 
  dbThemes 
}) => {
  return (
    <div className="flex flex-col gap-6 animate-envelope">
      <div className="flex flex-col gap-1">
        <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">Pilih Tema Visual 🎨</h2>
        <p className="text-on-surface-variant text-sm">Sesuaikan nuansa pesanmu dengan koleksi tema eksklusif kami.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {(dbThemes.length > 0 ? dbThemes.map(t => t.id) : Object.keys(themeConfigs)).map((themeName) => {
          const isActive = cardData.theme === themeName;
          return (
            <div
              key={themeName}
              onClick={() => {
                setCardData({ ...cardData, theme: themeName });
                setSavedSlug(null);
              }}
              className={`group relative bg-white border-2 rounded-2xl p-3.5 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-md ${
                isActive 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-stone-100 hover:border-primary/20'
              }`}
            >
              <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 relative bg-stone-50">
                <img 
                  src={themeImages[themeName as keyof typeof themeImages] || themeImages.Ceria} 
                  alt={themeName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 bg-primary text-white rounded-full p-1.5 flex items-center justify-center shadow-md border border-white/20 scale-105 animate-bounce-slow">
                    <span className="material-symbols-outlined text-xs fill-icon">check_circle</span>
                  </div>
                )}
              </div>
              <div className="px-1 pb-1">
                <h3 className="text-sm font-extrabold text-stone-800">{themeName}</h3>
                <p className="text-[10px] text-stone-500 leading-tight mt-1">
                  {themeName === 'Ceria' && 'Penuh warna, ceria, dan partikel konfeti.'}
                  {themeName === 'Elegan' && 'Mewah, navy-gold, dan kilau bintang mewah.'}
                  {themeName === 'Klasik' && 'Nuansa kertas kuno tradisi, hangat dan klasik.'}
                  {themeName === 'Playful' && 'Gaya stiker pop, retro tebal 3D dinamis.'}
                  {themeName === 'Minimalist' && 'Sederhana, tenang, bersih, fokus pada tulisan.'}
                  {themeName === 'Serenity' && 'Warna pastel gelembung watercolor mengalir.'}
                  {!['Ceria','Elegan','Klasik','Playful','Minimalist','Serenity'].includes(themeName) && 'Koleksi tema khusus dari database backend.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
