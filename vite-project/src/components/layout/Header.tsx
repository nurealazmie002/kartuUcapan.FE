import React from 'react';

interface HeaderProps {
  step: number;
  setStep: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ step, setStep }) => {
  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-margin-mobile md:px-lg h-16 bg-white/70 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-extrabold tracking-tight select-none">KirimUcapan</h1>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-1 bg-surface-container/60 p-1 rounded-full border border-surface-container-highest">
          {['Pesan', 'Tema', 'Galeri', 'Musik', 'Kirim'].map((stepLabel, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            return (
              <button 
                key={stepLabel}
                onClick={() => setStep(stepNum)} 
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${isActive ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                {stepLabel}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
