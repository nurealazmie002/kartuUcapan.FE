import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-margin-mobile md:px-lg h-16 bg-white/70 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.02)] border-b border-stone-100">
      <div className="flex items-center gap-4">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-extrabold tracking-tight select-none flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">celebration</span>
          KirimUcapan
        </h1>
      </div>
      <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 select-none shadow-inner">
        <span className="material-symbols-outlined text-sm text-stone-500">brush</span>
        <span className="text-[10px] text-stone-600 font-extrabold uppercase tracking-widest">Creator Studio</span>
      </div>
    </header>
  );
};
