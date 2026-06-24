import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { FRONTEND_URL } from '../../utils/constants';

interface Step5Props {
  savedSlug: string | null;
  isSaving: boolean;
  generateBackendShareLink: () => Promise<string>;
  getShareLink: () => string;
  copyShareLink: () => void;
  shareWhatsApp: () => void;
  showToast: (msg: string) => void;
}

export const Step5Share: React.FC<Step5Props> = ({ 
  savedSlug,
  isSaving,
  generateBackendShareLink,
  getShareLink,
  copyShareLink,
  shareWhatsApp,
  showToast
}) => {
  return (
    <div className="flex flex-col gap-6 animate-envelope text-center w-full">
      {!savedSlug ? (
        <div className="flex flex-col gap-1 items-center justify-center text-center px-4">
          <h2 className="text-xl font-extrabold text-on-surface mb-3">Kartu Siap Dikirim!</h2>
          <p className="text-on-surface-variant text-sm mb-6">Kartu ucapan Anda sudah siap. Buat tautan & barcode sekarang untuk membagikannya ke orang terdekat.</p>
          
          <button 
            onClick={async () => {
              showToast('Menyiapkan tautan dan barcode...');
              await generateBackendShareLink();
            }}
            disabled={isSaving}
            className="w-full h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-primary-fixed-dim active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined">qr_code_2</span>
            {isSaving ? 'Menyimpan...' : 'Buat Tautan & Barcode Sekarang'}
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1 items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mb-3 animate-slide-up-1">
              <span className="material-symbols-outlined text-3xl text-[#1e8e3e]">check_circle</span>
            </div>
            <h2 className="text-xl font-extrabold text-on-surface animate-slide-up-2">Kartu Berhasil Dibuat!</h2>
            <p className="text-on-surface-variant text-sm animate-slide-up-3">Kartu ucapan Anda telah tersimpan. Bagikan via Tautan atau Barcode di bawah ini.</p>
          </div>

          <div className="bg-stone-50 border border-stone-100 p-6 rounded-2xl flex flex-col items-center gap-5 text-center animate-slide-up-4">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-100">
              <QRCode 
                id="qr-code-canvas"
                value={`${FRONTEND_URL}/g/${savedSlug}`}
                size={180}
                ecLevel="H"
                qrStyle="dots"
                eyeRadius={8}
                eyeColor="#b90a5a"
                fgColor="#b90a5a"
                logoImage={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23b90a5a"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`}
                logoWidth={40}
                logoHeight={40}
                removeQrCodeBehindLogo={true}
                logoPadding={4}
                logoPaddingStyle="circle"
              />
            </div>
            
            <button
              onClick={() => {
                const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
                if (canvas) {
                  const url = canvas.toDataURL('image/png');
                  const link = document.createElement('a');
                  link.download = `kartu-ucapan-${savedSlug}.png`;
                  link.href = url;
                  link.click();
                  showToast('Barcode berhasil diunduh! 📸');
                }
              }}
              className="px-6 py-2.5 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 active:scale-95 transition-all flex items-center gap-2 text-xs"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              Simpan Barcode
            </button>

            <div className="w-full flex gap-2 bg-white p-2 rounded-xl border border-stone-200 shadow-inner mt-2">
              <input 
                type="text" 
                readOnly 
                value={getShareLink()} 
                className="flex-1 bg-transparent border-none text-[11px] outline-none select-all text-stone-850 font-medium px-2 overflow-ellipsis"
              />
              <button 
                onClick={copyShareLink}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold shadow-md hover:bg-primary-fixed-dim transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Salin
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2">
              <button 
                onClick={shareWhatsApp}
                className="h-14 bg-[#25d366] text-white font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg active:scale-95 hover:bg-[#20ba59] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">send</span>
                Kirim WhatsApp
              </button>
              <button 
                onClick={() => window.open(`${FRONTEND_URL}/g/${savedSlug}`, '_blank')}
                className="h-14 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg active:scale-95 hover:bg-black transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">open_in_new</span>
                Buka Pratinjau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
