import React from 'react';
import type { UploadedPhoto } from '../../types';

interface Step3Props {
  uploadedPhotos: UploadedPhoto[];
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemovePhoto: (localId: string) => void;
}

export const Step3Gallery: React.FC<Step3Props> = ({ 
  uploadedPhotos, 
  handlePhotoChange, 
  handleRemovePhoto 
}) => {
  return (
    <div className="flex flex-col gap-5 animate-envelope">
      <div className="flex flex-col gap-1">
        <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">Unggah Foto Kenangan 📸</h2>
        <p className="text-on-surface-variant text-sm">Tambahkan foto kenangan spesial untuk melengkapi kebahagiaan di kartumu. Maks. 10 foto.</p>
      </div>

      {/* Upload zone - drag and drop feel */}
      {uploadedPhotos.length === 0 ? (
        <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-stone-200 hover:border-primary/40 hover:bg-primary/5 rounded-3xl p-10 cursor-pointer active:scale-99 transition-all group">
          <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
          <div className="w-16 h-16 rounded-2xl bg-stone-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-3xl text-stone-400 group-hover:text-primary transition-colors">add_a_photo</span>
          </div>
          <div className="text-center">
            <p className="font-extrabold text-sm text-stone-700">Klik untuk unggah foto</p>
            <p className="text-xs text-stone-400 mt-1">JPG, PNG, WEBP — hingga 10 foto</p>
          </div>
        </label>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Counter bar */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-stone-600 uppercase tracking-wider">
              {uploadedPhotos.length} Foto Ditambahkan
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${
              uploadedPhotos.length >= 10 ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'
            }`}>
              {uploadedPhotos.length} / 10
            </span>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {uploadedPhotos.map((photo) => (
              <div key={photo.localId} className="aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative group shadow-sm hover:shadow-md transition-shadow">
                <img src={photo.previewUrl} alt="Preview" className="w-full h-full object-cover" />

                {/* Uploading Overlay */}
                {photo.isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 gap-2">
                    <span className="material-symbols-outlined text-white text-xl animate-spin">sync</span>
                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-wider">Mengunggah...</span>
                  </div>
                )}

                {/* Success overlay (brief) */}
                {!photo.isUploading && !photo.error && photo.uploadedId && (
                  <div className="absolute top-2 left-2 z-10 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow">
                    <span className="material-symbols-outlined fill-icon text-white" style={{fontSize:'12px'}}>check</span>
                  </div>
                )}

                {/* Error Overlay */}
                {photo.error && (
                  <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 z-10 text-center gap-1">
                    <span className="material-symbols-outlined text-red-300 text-xl">error</span>
                    <span className="text-[9px] text-red-200 font-bold leading-tight">Gagal Unggah</span>
                  </div>
                )}

                {/* Hover overlay with delete */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all z-10 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.localId)}
                    className="opacity-0 group-hover:opacity-100 w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
                  >
                    <span className="material-symbols-outlined" style={{fontSize:'18px'}}>delete</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add more button */}
            {uploadedPhotos.length < 10 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 group">
                <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
                <span className="material-symbols-outlined text-stone-300 group-hover:text-primary transition-colors text-3xl">add</span>
                <span className="text-[10px] text-stone-400 group-hover:text-primary font-bold uppercase tracking-wider transition-colors">Tambah</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* Tip */}
      <p className="text-[10px] text-stone-400 text-center">
        💡 Foto akan tampil sebagai slideshow di dalam kartu ucapan penerima
      </p>
    </div>
  );
};
