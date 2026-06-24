import React from 'react';
import type { CardData } from '../../types';
import { iconMap } from '../../utils/constants';

interface Step1Props {
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  setSavedSlug: (slug: string | null) => void;
  handleSelectMoment: (mom: string) => void;
}

export const Step1Message: React.FC<Step1Props> = ({ 
  cardData, 
  setCardData, 
  setSavedSlug, 
  handleSelectMoment 
}) => {
  return (
    <div className="flex flex-col gap-6 animate-envelope">
      <div className="flex flex-col gap-1">
        <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">Tulis Pesan Bahagiamu ✍️</h2>
        <p className="text-on-surface-variant text-sm">Personalisasi ucapanmu agar terasa lebih istimewa bagi mereka.</p>
      </div>
      
      {/* Recipient Input */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold" htmlFor="recipient">Nama Penerima</label>
        <input 
          type="text" 
          id="recipient" 
          value={cardData.recipient}
          onChange={(e) => {
            setCardData({ ...cardData, recipient: e.target.value });
            setSavedSlug(null);
          }}
          placeholder="Contoh: Sarah Anderson"
          className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all rounded-2xl text-stone-800 text-sm font-medium outline-none"
        />
      </div>

      {/* Sender Input */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold" htmlFor="sender">Nama Pengirim</label>
        <input 
          type="text" 
          id="sender" 
          value={cardData.sender}
          onChange={(e) => {
            setCardData({ ...cardData, sender: e.target.value });
            setSavedSlug(null);
          }}
          placeholder="Contoh: Teman Baikmu"
          className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all rounded-2xl text-stone-800 text-sm font-medium outline-none"
        />
      </div>

      {/* Moment selector Chips */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold">Pilih Momen Acara</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['Ulang Tahun', 'Kelulusan', 'Pernikahan', 'Terima Kasih', 'Lainnya'].map((mom) => {
            const isActive = cardData.moment === mom;
            return (
              <button
                key={mom}
                type="button"
                onClick={() => {
                  handleSelectMoment(mom);
                  setSavedSlug(null);
                }}
                className={`group flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer ${
                  isActive 
                    ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                    : 'border-stone-100 bg-white hover:border-primary/20 hover:bg-stone-50/50 text-stone-700'
                }`}
              >
                <span className={`material-symbols-outlined text-[26px] transition-transform group-hover:scale-110 ${isActive ? 'text-primary fill-icon' : 'text-stone-400 group-hover:text-primary'}`}>
                  {iconMap[mom] || 'celebration'}
                </span>
                <span className="text-[11px] font-extrabold tracking-wide uppercase">{mom}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold" htmlFor="message">Isi Ucapan & Doa</label>
        <textarea 
          id="message" 
          rows={4}
          value={cardData.message}
          onChange={(e) => {
            setCardData({ ...cardData, message: e.target.value });
            setSavedSlug(null);
          }}
          placeholder="Tuliskan harapan dan doa tulusmu di sini..."
          className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all rounded-2xl text-stone-800 text-sm font-medium leading-relaxed resize-none outline-none"
        />
      </div>
    </div>
  );
};
