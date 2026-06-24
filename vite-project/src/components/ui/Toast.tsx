import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white px-6 py-3.5 rounded-full shadow-2xl z-50 text-center flex items-center gap-2.5 animate-envelope border border-white/10">
      <span className="material-symbols-outlined text-green-400">check_circle</span>
      <span className="font-semibold text-xs tracking-wide">{message}</span>
    </div>
  );
};
