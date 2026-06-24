import React from 'react';

interface StepIndicatorProps {
  step: number;
  setStep: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ step, setStep }) => {
  return (
    <div className="hidden md:block mb-12 max-w-2xl mx-auto">
      <div className="flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-surface-container-highest -z-10 -translate-y-1/2 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-primary to-primary-container -z-10 -translate-y-1/2 transition-all duration-500 rounded-full"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        ></div>
        
        {/* Stepper items */}
        {[
          { label: 'Pesan', icon: 'edit_note' },
          { label: 'Tema', icon: 'palette' },
          { label: 'Galeri', icon: 'photo_library' },
          { label: 'Musik', icon: 'music_note' },
          { label: 'Kirim', icon: 'send' }
        ].map((sObj, idx) => {
          const sNum = idx + 1;
          const isVisited = step >= sNum;
          const isCurrent = step === sNum;
          return (
            <div key={sObj.label} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(sNum)}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${
                isCurrent 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' 
                  : isVisited 
                    ? 'bg-primary-fixed border-primary-fixed text-primary' 
                    : 'bg-white border-surface-container-highest text-on-surface-variant'
              }`}>
                <span className={`material-symbols-outlined text-[20px] ${isVisited ? 'fill-icon' : ''}`}>{sObj.icon}</span>
              </div>
              <span className={`font-label-md text-[11px] tracking-wide uppercase transition-colors ${isCurrent ? 'text-primary font-extrabold' : 'text-on-surface-variant'}`}>{sObj.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
