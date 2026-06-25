import React, { useState } from 'react';
import type { CardData, StoryChapter } from '../../types';
import { TRACK_LIST } from '../../audioHelper';
import { themeConfigs } from '../../utils/constants';

interface AccordionEditorProps {
  // --- State & Handlers ---
  activeAccordionId: string;
  setActiveAccordionId: (id: string) => void;
  cardData: CardData;
  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  dbThemes: any[];
  currentTrack: string;
  isPlaying: boolean;
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

export const AccordionEditor: React.FC<AccordionEditorProps> = ({
  activeAccordionId, setActiveAccordionId,
  cardData, setCardData, dbThemes,
  currentTrack, isPlaying,
  isUploadingMusic, handlePlayMusic, handleUploadMusic,
  handleAddChapter, handleUpdateChapter, handleRemoveChapter, uploadSinglePhoto,
  savedSlug, isSaving, generateBackendShareLink, getShareLink, copyShareLink, shareWhatsApp, showToast
}) => {
  const [uploadingChapterId, setUploadingChapterId] = useState<string | null>(null);

  const AccordionItem = ({ id, title, icon, subtitle, children, onRemove }: any) => {
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
      <AccordionItem 
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
      <AccordionItem 
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
      <AccordionItem 
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
          <AccordionItem 
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
      <AccordionItem 
        id="share" 
        title="Simpan & Bagikan" 
        icon="send" 
        subtitle="Selesai merangkai"
      >
        <div className="flex flex-col gap-4 mt-4">
          <p className="text-sm text-stone-500 font-medium leading-relaxed">
            Kartu pameranmu sudah siap! Bagikan tautan ini ke orang tersayang agar mereka bisa melihatnya secara langsung.
          </p>

          {!savedSlug ? (
            <button 
              onClick={async () => {
                await generateBackendShareLink();
                showToast('Kartu berhasil disimpan!');
              }}
              disabled={isSaving}
              className="w-full h-14 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined">cloud_upload</span>
              )}
              {isSaving ? 'Menyimpan ke Server...' : 'Simpan Kartu Sekarang'}
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center bg-surface p-2 rounded-xl border border-stone-200">
                <input 
                  type="text" 
                  readOnly 
                  value={getShareLink()} 
                  className="flex-1 bg-transparent text-sm font-medium text-stone-600 px-3 outline-none truncate"
                />
                <button 
                  onClick={copyShareLink}
                  className="w-10 h-10 bg-white rounded-lg shadow-sm border border-stone-100 flex items-center justify-center text-primary hover:bg-stone-50 active:scale-95 transition-all flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
              </div>

              <button 
                onClick={shareWhatsApp}
                className="w-full h-12 bg-[#25D366] text-white font-bold rounded-xl shadow-md hover:bg-[#1ebd5a] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-5 h-5 invert brightness-0" />
                Kirim via WhatsApp
              </button>
            </div>
          )}
        </div>
      </AccordionItem>
    </div>
  );
};
