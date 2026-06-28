import React, { useState } from 'react';
import type { CardData, StoryChapter, UploadedMusicFile } from '../../types';
import { TRACK_LIST } from '../../audioHelper';
import { themeConfigs, FRONTEND_URL } from '../../utils/constants';
import { QRCode } from 'react-qrcode-logo';

interface AccordionEditorProps {
  // --- State & Handlers ---
  activeAccordionId: string;
  setActiveAccordionId: (id: string) => void;
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  dbThemes: any[];
  currentTrack: string;
  isPlaying: boolean;
  uploadedMusicFile: UploadedMusicFile | null;
  isUploadingMusic: boolean;
  handlePlayMusic: (id: string) => void;
  handleUploadMusic: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddChapter: (type: 'cover' | 'photo_text' | 'video' | 'letter') => void;
  handleUpdateChapter: (id: string, updates: Partial<StoryChapter>) => void;
  handleRemoveChapter: (id: string) => void;
  uploadSinglePhoto: (file: File) => Promise<string>;
  savedSlug: string | null;
  isSaving: boolean;
  generateBackendShareLink: () => Promise<string>;
  getShareLink: () => string;
  copyShareLink: () => Promise<void>;
  shareWhatsApp: () => Promise<void>;
  showToast: (msg: string) => void;
}

const AccordionItem = ({ id, title, icon, subtitle, children, onRemove, activeAccordionId, setActiveAccordionId }: any) => {
  const isOpen = activeAccordionId === id;
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-primary shadow-md my-4' : 'border-stone-100 hover:border-stone-300 hover:bg-stone-50 my-2'}`}>
      <div 
        className="p-5 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setActiveAccordionId(isOpen ? '' : id)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-500'}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <h3 className={`font-bold transition-colors ${isOpen ? 'text-primary' : 'text-stone-700'}`}>{title}</h3>
            {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onRemove && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-stone-300 hover:text-red-500 transition-colors"
              title="Hapus"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          )}
          <span className={`material-symbols-outlined text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </div>
      
      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 border-t border-stone-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export const AccordionEditor: React.FC<AccordionEditorProps> = ({
  activeAccordionId, setActiveAccordionId,
  cardData, setCardData, dbThemes,
  currentTrack, isPlaying, uploadedMusicFile,
  isUploadingMusic, handlePlayMusic, handleUploadMusic,
  handleAddChapter, handleUpdateChapter, handleRemoveChapter, uploadSinglePhoto,
  savedSlug, isSaving, generateBackendShareLink, getShareLink, copyShareLink, shareWhatsApp, showToast
}) => {
  const [uploadingChapterId, setUploadingChapterId] = useState<string | null>(null);



  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, chapterId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingChapterId(chapterId);
    try {
      const url = await uploadSinglePhoto(file);
      handleUpdateChapter(chapterId, { mediaUrl: url });
      showToast('Foto berhasil diunggah!');
    } catch (err) {
      showToast('Gagal mengunggah foto. Silakan coba lagi.');
    } finally {
      setUploadingChapterId(null);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 1. Tema Visual */}
      <AccordionItem activeAccordionId={activeAccordionId} setActiveAccordionId={setActiveAccordionId}
        id="theme" 
        title="Tema Visual" 
        icon="palette" 
        subtitle={`Terpilih: ${cardData.theme}`}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {(dbThemes.length > 0 ? dbThemes.map(t => t.id) : Object.keys(themeConfigs)).map((themeName) => {
            const isActive = cardData.theme === themeName;
            return (
              <button
                key={themeName}
                onClick={() => setCardData({ ...cardData, theme: themeName })}
                className={`p-3 rounded-xl border-2 text-left transition-all ${isActive ? 'border-primary bg-primary/5' : 'border-stone-100 hover:border-stone-200'}`}
              >
                <div className="font-bold text-sm text-stone-800">{themeName}</div>
              </button>
            );
          })}
        </div>
      </AccordionItem>

      {/* 2. Informasi Penerima */}
      <AccordionItem activeAccordionId={activeAccordionId} setActiveAccordionId={setActiveAccordionId}
        id="info" 
        title="Untuk Siapa" 
        icon="person" 
        subtitle={cardData.recipient || 'Nama Penerima'}
      >
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Nama Penerima</label>
            <input 
              type="text" 
              value={cardData.recipient} 
              onChange={e => setCardData({ ...cardData, recipient: e.target.value })}
              className="w-full premium-input bg-surface rounded-xl p-3"
              placeholder="Contoh: Sarah Anderson"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Nama Pengirim</label>
            <input 
              type="text" 
              value={cardData.sender} 
              onChange={e => setCardData({ ...cardData, sender: e.target.value })}
              className="w-full premium-input bg-surface rounded-xl p-3"
              placeholder="Contoh: Budi"
            />
          </div>
        </div>
      </AccordionItem>

      {/* 3. Musik Latar */}
      <AccordionItem activeAccordionId={activeAccordionId} setActiveAccordionId={setActiveAccordionId}
        id="music" 
        title="Musik Latar" 
        icon="music_note" 
        subtitle={currentTrack === 'custom_upload' ? 'Lagu Anda Sendiri' : TRACK_LIST.find(t => t.id === currentTrack)?.title || 'Tidak ada lagu'}
      >
        <div className="flex flex-col gap-3 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TRACK_LIST.map((track) => (
              <button
                key={track.id}
                onClick={() => handlePlayMusic(track.id)}
                className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${currentTrack === track.id ? 'border-primary bg-primary/5 text-primary' : 'border-stone-100 hover:border-stone-200 text-stone-600'}`}
              >
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <span className="material-symbols-outlined text-lg">{currentTrack === track.id && isPlaying ? 'pause_circle' : 'play_circle'}</span>
                  {track.title}
                </div>
              </button>
            ))}
            
            {uploadedMusicFile && (
              <button
                onClick={() => handlePlayMusic('custom_upload')}
                className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${currentTrack === 'custom_upload' ? 'border-primary bg-primary/5 text-primary' : 'border-stone-100 hover:border-stone-200 text-stone-600'}`}
                title={uploadedMusicFile.fileName}
              >
                <div className="flex items-center gap-3 text-sm font-semibold truncate">
                  <span className="material-symbols-outlined text-lg flex-shrink-0">{currentTrack === 'custom_upload' && isPlaying ? 'pause_circle' : 'play_circle'}</span>
                  <span className="truncate">{uploadedMusicFile.fileName}</span>
                </div>
              </button>
            )}
          </div>

          <div className="mt-4 p-4 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50">
            <label className="flex items-center justify-center gap-3 cursor-pointer">
              <span className="material-symbols-outlined text-primary text-2xl">upload_file</span>
              <div className="text-sm">
                <span className="font-bold text-primary">Unggah Lagu Sendiri (MP3)</span>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Maks 20MB</p>
              </div>
              <input type="file" accept="audio/*" onChange={handleUploadMusic} className="hidden" disabled={isUploadingMusic} />
            </label>
            {isUploadingMusic && <p className="text-xs text-center text-primary mt-3 font-medium animate-pulse">Mengunggah musik...</p>}
          </div>
        </div>
      </AccordionItem>

      {/* STORY CHAPTERS */}
      {cardData.story.map((chapter, index) => {
        let icon = 'auto_stories';
        if (chapter.type === 'photo_text') icon = 'image';
        if (chapter.type === 'video') icon = 'smart_display';
        if (chapter.type === 'letter') icon = 'drafts';

        return (
          <AccordionItem activeAccordionId={activeAccordionId} setActiveAccordionId={setActiveAccordionId}
            key={chapter.id}
            id={chapter.id} 
            title={chapter.title || `Pameran ${index + 1}`} 
            icon={icon} 
            subtitle={chapter.type === 'photo_text' ? 'Foto & Teks' : chapter.type === 'video' ? 'Video YouTube' : 'Teks Pembuka/Surat'}
            onRemove={cardData.story.length > 1 ? () => handleRemoveChapter(chapter.id) : undefined}
          >
            <div className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Judul Pameran</label>
                <input 
                  type="text" 
                  value={chapter.title} 
                  onChange={e => handleUpdateChapter(chapter.id, { title: e.target.value })}
                  className="w-full premium-input bg-surface rounded-xl p-3 font-semibold"
                  placeholder="Contoh: Awal Cerita"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Isi Pesan / Caption</label>
                <textarea 
                  value={chapter.content} 
                  onChange={e => handleUpdateChapter(chapter.id, { content: e.target.value })}
                  className="w-full premium-input bg-surface rounded-xl p-3 min-h-[100px] resize-y"
                  placeholder="Tuliskan cerita, pesan, atau puisi di sini..."
                />
              </div>

              {chapter.type === 'photo_text' && (
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Pilih Foto</label>
                  {chapter.mediaUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border border-stone-200">
                      <img src={chapter.mediaUrl} alt="Foto Pameran" className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="px-4 py-2 bg-white text-stone-800 font-bold rounded-full cursor-pointer shadow-lg text-sm">
                          Ganti Foto
                          <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, chapter.id)} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 h-32 cursor-pointer hover:border-primary transition-colors">
                      {uploadingChapterId === chapter.id ? (
                        <div className="animate-pulse text-primary font-medium text-sm">Mengunggah...</div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-stone-400 text-3xl mb-2">add_photo_alternate</span>
                          <span className="text-sm font-bold text-stone-600">Klik untuk Unggah Foto</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e, chapter.id)} />
                    </label>
                  )}
                </div>
              )}

              {chapter.type === 'video' && (
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Link YouTube</label>
                  <input 
                    type="text" 
                    value={chapter.videoUrl || ''} 
                    onChange={e => handleUpdateChapter(chapter.id, { videoUrl: e.target.value })}
                    className="w-full premium-input bg-surface rounded-xl p-3"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {chapter.videoUrl && (
                    <p className="text-xs text-stone-400 mt-2">Pastikan video tidak di-private agar bisa diputar.</p>
                  )}
                </div>
              )}
            </div>
          </AccordionItem>
        );
      })}

      {/* Tombol Tambah Cerita */}
      <div className="my-6">
        <div className="relative group">
          <button className="w-full py-4 border-2 border-dashed border-stone-200 text-stone-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-50 hover:border-stone-300 hover:text-stone-700 transition-all">
            <span className="material-symbols-outlined">add</span>
            Tambah Pameran / Bab Baru
          </button>
          
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-stone-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 grid grid-cols-3 gap-2">
            <button onClick={() => handleAddChapter('letter')} className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-stone-50 text-stone-600">
              <span className="material-symbols-outlined">drafts</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Teks Saja</span>
            </button>
            <button onClick={() => handleAddChapter('photo_text')} className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-stone-50 text-stone-600">
              <span className="material-symbols-outlined">image</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Teks + Foto</span>
            </button>
            <button onClick={() => handleAddChapter('video')} className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-stone-50 text-stone-600">
              <span className="material-symbols-outlined">smart_display</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Video YouTube</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share / Selesai */}
      <AccordionItem activeAccordionId={activeAccordionId} setActiveAccordionId={setActiveAccordionId}
        id="share" 
        title="Simpan & Bagikan" 
        icon="send" 
        subtitle="Selesai merangkai"
      >
        <div className="flex flex-col gap-6 w-full mt-4">
          {!savedSlug ? (
            <div className="flex flex-col gap-1 items-center justify-center text-center px-4">
              <h2 className="text-xl font-extrabold text-stone-800 mb-3">Kartu Siap Dikirim!</h2>
              <p className="text-stone-500 text-sm mb-6">Kartu ucapan Anda sudah siap. Buat tautan & barcode sekarang untuk membagikannya ke orang terdekat.</p>
              
              <button 
                onClick={async () => {
                  showToast('Menyiapkan tautan dan barcode...');
                  await generateBackendShareLink();
                }}
                disabled={isSaving}
                className="w-full h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
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
                <h2 className="text-xl font-extrabold text-stone-800 animate-slide-up-2">Kartu Berhasil Dibuat!</h2>
                <p className="text-stone-500 text-sm animate-slide-up-3">Kartu ucapan Anda telah tersimpan. Bagikan via Tautan atau Barcode di bawah ini.</p>
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
                    className="flex-1 bg-transparent border-none text-[11px] outline-none select-all text-stone-800 font-medium px-2 overflow-ellipsis"
                  />
                  <button 
                    onClick={copyShareLink}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
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
      </AccordionItem>
    </div>
  );
};
