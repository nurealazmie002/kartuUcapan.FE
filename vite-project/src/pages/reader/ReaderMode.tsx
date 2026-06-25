import React, { useState, useEffect } from 'react';
import type { CardData, UploadedMusicFile, StoryChapter } from '../../types';
import { themeConfigs, iconMap, momentTitleMap } from '../../utils/constants';
import { audioController, TRACK_LIST } from '../../audioHelper';

interface ReaderModeProps {
  readerData: CardData | null;
  readerPhotos: any[];
  envelopeOpened: boolean;
  envelopeOpening: boolean;
  setReaderMode: (mode: boolean) => void;
  setReaderPhotos: (photos: any[]) => void;
  openEnvelope: () => void;
  renderParticles: (themeId: string) => React.ReactNode;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  uploadedMusicFile: UploadedMusicFile | null;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
  tiltStyle: React.CSSProperties;
  isPreview?: boolean;
}

export const ReaderMode: React.FC<ReaderModeProps> = ({
  readerData,
  readerPhotos,
  envelopeOpened,
  envelopeOpening,
  setReaderMode,
  setReaderPhotos,
  openEnvelope,
  renderParticles,
  isPlaying,
  setIsPlaying,
  uploadedMusicFile,
  handleMouseMove,
  handleMouseLeave,
  tiltStyle,
  isPreview = false
}) => {
  const [showConfettiBurst, setShowConfettiBurst] = useState(false);

  // Fallback for backward compatibility
  const chapters: StoryChapter[] = readerData?.story || [
    { id: 'cover', type: 'cover', title: 'Pesan Spesial', content: readerData?.message || '' },
    ...(readerPhotos || []).map((ph, i) => ({
      id: `photo-${i}`,
      type: 'photo_text' as const,
      title: `Kenangan ${i + 1}`,
      content: '',
      mediaUrl: ph?.file?.file_url || ph?.file_url || ph?.fileUrl || ph?.previewUrl
    }))
  ];

  useEffect(() => {
    if (envelopeOpened) {
      const startTimer = setTimeout(() => setShowConfettiBurst(true), 10);
      const stopTimer = setTimeout(() => setShowConfettiBurst(false), 4000);
      return () => { clearTimeout(startTimer); clearTimeout(stopTimer); };
    }
  }, [envelopeOpened]);

  const [confettiParticles] = useState<any[]>(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const angle = (i / 45) * 360 + (Math.random() * 15 - 7.5);
      const speed = Math.random() * 180 + 120;
      const delay = Math.random() * 0.25;
      const size = Math.random() * 10 + 6;
      const colors = ['bg-pink-500', 'bg-yellow-400', 'bg-blue-400', 'bg-purple-400', 'bg-orange-400', 'bg-red-400'];
      const color = colors[i % colors.length];
      const angleRad = (angle * Math.PI) / 180;
      const targetX = Math.cos(angleRad) * speed;
      const targetY = Math.sin(angleRad) * speed + 180;
      return { id: i, color, size, targetX, targetY, delay };
    });
  });

  if (!readerData) return null;

  return (
    <div className={`${isPreview ? 'w-full h-full flex flex-col' : 'min-h-screen w-full'} relative overflow-hidden transition-all duration-700 bg-stone-50 ${themeConfigs[readerData.theme]?.fontFamily || 'font-body-md'}`}>
      
      {showConfettiBurst && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute left-1/2 top-1/2 rounded-full animate-confetti-burst-particle ${particle.color}`}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                '--target-x': `${particle.targetX}px`,
                '--target-y': `${particle.targetY}px`,
                animationDelay: `${particle.delay}s`,
                transform: 'translate(-50%, -50%)',
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Tampilan partikel tipis (opsional) */}
      {envelopeOpened && renderParticles(readerData.theme)}

      {envelopeOpened && !isPreview && (
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2 select-none">
            <span className="material-symbols-outlined text-primary animate-pulse">celebration</span>
            <span className="font-bold text-primary tracking-tight text-sm md:text-base">KirimUcapan</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setReaderMode(false);
                setReaderPhotos([]);
                window.history.pushState({}, '', '/');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              Buat Kartu Sendiri 💌
            </button>
          </div>
        </header>
      )}

      {!envelopeOpened ? (
        <div className={`${isPreview ? 'flex flex-col items-center justify-center px-4 py-8 flex-1 min-h-0' : 'min-h-screen flex flex-col items-center justify-center px-6 py-12'}`}>
          <div className="flex flex-col items-center gap-8 max-w-md w-full text-center animate-envelope">
            <div className="flex items-center gap-2 select-none">
              <span className="material-symbols-outlined text-primary fill-icon text-xl">favorite</span>
              <span className="font-extrabold text-primary/80 text-sm tracking-widest uppercase">KirimUcapan</span>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-4xl font-extrabold text-[#1a1c1e] tracking-tight leading-tight">
                Ada Surat<br/>Spesial Untukmu! 💌
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Seseorang mengirimkan kartu ucapan hangat untuk <strong className="text-slate-700">{readerData.recipient}</strong>.
              </p>
            </div>

            <div
              onClick={openEnvelope}
              className={`cursor-pointer group transition-all duration-[1.5s] ${envelopeOpening ? 'animate-envelope-zoom-fade pointer-events-none' : 'hover:-translate-y-2'}`}
            >
              <div className="w-[300px] h-[225px] bg-[#fbf8f0] rounded-2xl shadow-xl border border-[#e8dcc4] relative" style={{ perspective: '1000px' }}>
                <div className="absolute inset-0 bg-[#f4ebd0] z-0"></div>
                <div 
                  className={`absolute left-[5%] right-[5%] h-[90%] bg-white rounded-xl shadow-md z-10 transition-transform duration-[1s] ease-in-out ${envelopeOpening ? '-translate-y-[60%] scale-105' : 'translate-y-[15%]'}`}
                  style={{ transitionDelay: '0.3s' }}
                >
                   <div className="p-4 flex flex-col items-center justify-center gap-3 opacity-50 h-full">
                     <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-pink-300 text-lg">favorite</span>
                     </div>
                     <div className="w-32 h-2 bg-stone-200 rounded-full"></div>
                     <div className="w-24 h-2 bg-stone-200 rounded-full"></div>
                   </div>
                </div>
                <svg className="absolute bottom-0 left-0 w-full z-20" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ height: '50%' }}>
                  <path d="M0,50 L50,0 L100,50 Z" fill="#fcfaf5" stroke="#e8dcc4" strokeWidth="0.5" />
                </svg>
                <svg 
                  className={`absolute top-0 left-0 w-full z-30 transition-all duration-700 origin-top`} 
                  viewBox="0 0 100 50" preserveAspectRatio="none" 
                  style={{ height: '50%', transform: envelopeOpening ? 'rotateX(180deg)' : 'rotateX(0deg)', opacity: envelopeOpening ? 0 : 1 }}
                >
                  <path d="M0,0 L50,50 L100,0 Z" fill="#f4ebd0" stroke="#e8dcc4" strokeWidth="0.5" />
                </svg>
                <div className={`absolute top-4 right-4 w-10 h-12 border-2 border-dashed border-[#dcc69c]/60 flex items-center justify-center bg-[#fbf8f0]/50 rotate-6 z-30 transition-opacity duration-300 ${envelopeOpening ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="material-symbols-outlined text-[#dcc69c] text-xl">favorite</span>
                </div>
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 z-40 ${envelopeOpening ? 'pointer-events-none' : ''}`}>
                  <div className={`wax-seal w-20 h-20 rounded-full flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300 shadow-2xl ${envelopeOpening ? 'animate-seal-pop' : ''}`}>
                    <span className="material-symbols-outlined text-white text-3xl fill-icon animate-pulse">favorite</span>
                    <div className="absolute inset-0 rounded-full border-[3px] border-white/30 animate-ping opacity-60" />
                  </div>
                  <span className={`bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-primary font-extrabold uppercase tracking-widest shadow-sm transition-all duration-300 ${envelopeOpening ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                    Ketuk Untuk Membuka
                  </span>
                </div>
                {envelopeOpening && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                    {Array.from({ length: 8 }).map((_, idx) => {
                      const angle = (idx / 8) * 360;
                      const angleRad = (angle * Math.PI) / 180;
                      const dist = 60;
                      const tx = Math.cos(angleRad) * dist;
                      const ty = Math.sin(angleRad) * dist;
                      return (
                        <span
                          key={idx}
                          className="material-symbols-outlined text-primary absolute fill-icon animate-seal-heart-burst"
                          style={{ '--tx': `${tx}px`, '--ty': `${ty}px`, fontSize: '16px' } as React.CSSProperties}
                        >
                          favorite
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-stone-100 px-5 py-2.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-primary fill-icon text-sm">person</span>
              <span className="text-xs font-bold text-stone-600">Untuk: <span className="text-primary">{readerData.recipient}</span></span>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${isPreview ? 'flex flex-col items-center justify-start flex-1 min-h-0 w-full' : 'min-h-screen flex flex-col items-center justify-start pt-24 pb-12 px-6'}`}>
          {readerData?.music && readerData.music !== 'none' && (
            <button 
              type="button"
              onClick={() => {
                const isCustom = readerData.music === 'custom_upload';
                const audioUrl = isCustom 
                  ? (uploadedMusicFile?.previewUrl || uploadedMusicFile?.fileUrl)
                  : TRACK_LIST.find(t => t.id === readerData.music)?.url;
                
                if (!audioUrl) return;

                if (isPlaying) {
                  audioController.pause();
                  setIsPlaying(false);
                } else {
                  audioController.playTrack(
                    { id: readerData.music, url: audioUrl, mood: 'chill' },
                    setIsPlaying
                  );
                }
              }}
              className={`flex items-center gap-3.5 backdrop-blur-md border rounded-full pl-2.5 pr-5 py-2 mb-6 transition-all active:scale-95 shadow-md ${
                isPlaying ? 'bg-primary/10 border-primary/30 hover:bg-primary/20' : 'bg-white/60 border-stone-200 hover:bg-white/90'
              }`}
            >
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full bg-[#1c1917] border border-stone-950 flex items-center justify-center relative shadow-md transition-transform duration-500 ${isPlaying ? 'animate-cd-spin' : ''}`}>
                  <div className="absolute inset-1 rounded-full border border-stone-800/40"></div>
                  <div className="absolute inset-2 rounded-full border border-stone-700/30"></div>
                  <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className={`absolute -top-0.5 -right-0.5 w-3 h-4 origin-top-right transition-transform duration-500 pointer-events-none ${isPlaying ? 'rotate-[15deg]' : 'rotate-0'}`}>
                  <svg viewBox="0 0 10 20" fill="none" className="w-full h-full stroke-stone-400" strokeWidth="2">
                    <path d="M9,2 L4,2 L4,14 L1,16" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col items-start gap-0.5 text-left">
                <span className={`text-[8px] uppercase tracking-widest font-bold ${isPlaying ? 'text-primary/70' : 'text-stone-400'}`}>
                  {isPlaying ? 'Memutar Musik' : 'Musik Jeda'}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold truncate max-w-[150px] ${isPlaying ? 'text-primary' : 'text-stone-700'}`}>
                  {readerData?.music === 'custom_upload' && uploadedMusicFile
                    ? uploadedMusicFile.fileName
                    : TRACK_LIST.find(t => t.id === readerData?.music)?.title?.split(' / ')[0] || 'Musik Aktif'}
                </span>
              </div>
            </button>
          )}

          <div 
            className={`relative animate-envelope w-full ${isPreview ? 'flex-1 min-h-0' : 'max-w-[360px] h-[640px] max-h-[85vh] shadow-2xl'}`}
          >
            <div
              className={`card-preview-container absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#faf8f5] ${!isPreview ? 'rounded-[2rem] shadow-2xl' : ''}`}
              onMouseMove={!isPreview ? handleMouseMove : undefined}
              onMouseLeave={!isPreview ? handleMouseLeave : undefined}
              style={!isPreview ? tiltStyle : {}}
            >
              {/* Background solid yang elegan & minimalis */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#faf8f5] to-[#f4f0e6] fixed pointer-events-none"></div>

              <div className="relative z-10 w-full flex flex-col gap-12 py-10 px-6">
                {chapters.map((chapter, idx) => (
                  <div key={chapter.id || idx} className="w-full flex flex-col items-center animate-slide-up-1" style={{ animationDelay: `${idx * 0.15}s` }}>
                    
                    {chapter.type === 'cover' || chapter.type === 'letter' ? (
                      <div className="w-full flex flex-col"
                        style={{ gap: '16px' }}>
                        <div className="flex flex-col items-center gap-2 text-center shrink-0">
                          <div className="flex-shrink-0 bg-primary-container/20 rounded-full flex items-center justify-center border border-primary/10 w-14 h-14 shadow-sm mb-2">
                            <span className="material-symbols-outlined text-primary text-3xl">
                              {chapter.type === 'cover' ? (iconMap[readerData.moment] || 'celebration') : 'drafts'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1.5 text-center">
                            <h4 className={themeConfigs[readerData.theme]?.titleClass || 'text-primary font-headline-md font-semibold tracking-wide uppercase text-[10px]'}>
                              {chapter.type === 'cover' ? (momentTitleMap[readerData.moment] || 'Special Greeting!') : 'Surat Spesial'}
                            </h4>
                            <div className={themeConfigs[readerData.theme]?.dividerClass || 'h-[2px] w-12 bg-primary/30 mx-auto rounded-full'} />
                            <h5 className={themeConfigs[readerData.theme]?.recipientClass || 'font-headline-lg-mobile text-on-surface font-black text-2xl tracking-tight leading-none'}>
                              {chapter.title}
                            </h5>
                          </div>
                        </div>

                        <div className="relative py-2 flex flex-col items-center justify-center px-2">
                          <span className="material-symbols-outlined absolute top-0 -left-1 text-primary/10 text-3xl transform -rotate-12 pointer-events-none">format_quote</span>
                          <p className={`relative z-10 text-center ${themeConfigs[readerData.theme]?.textClass || 'text-body-md text-on-surface-variant font-medium leading-relaxed text-base'}`}>
                            {chapter.content}
                          </p>
                          <span className="material-symbols-outlined absolute bottom-0 -right-1 text-primary/10 text-3xl transform rotate-12 pointer-events-none">format_quote</span>
                        </div>
                        
                        {chapter.type === 'cover' && (
                          <div className="border-t border-slate-200/50 pt-4 flex flex-col items-center justify-center gap-0.5 shrink-0 mt-2">
                            <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">Dari:</span>
                            <span className="font-black text-primary tracking-wide text-base">{readerData.sender}</span>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {chapter.type === 'photo_text' && (
                       <div className="w-full flex flex-col items-center justify-center gap-3 polaroid-frame" style={{ '--polaroid-rotate': '0deg' } as React.CSSProperties}>
                         <div className="w-full bg-stone-100 overflow-hidden relative shadow-sm" style={{ aspectRatio: '1/1', borderRadius: '1rem' }}>
                           {chapter.mediaUrl ? (
                             <img src={chapter.mediaUrl} alt="Kenangan" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-stone-300">
                               <span className="material-symbols-outlined text-4xl">broken_image</span>
                             </div>
                           )}
                         </div>
                         <div className="text-center w-full px-2">
                           {chapter.title && <h3 className="font-bold text-primary text-lg mb-1">{chapter.title}</h3>}
                           {chapter.content && <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">{chapter.content}</p>}
                         </div>
                       </div>
                    )}

                    {chapter.type === 'video' && (
                      <div className="w-full flex flex-col items-center justify-center gap-3">
                        <div className="w-full bg-black rounded-xl overflow-hidden shadow-sm relative pointer-events-auto" style={{ aspectRatio: '16/9' }}>
                          {(() => {
                            let youtubeId = '';
                            const match = chapter.videoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
                            if (match) youtubeId = match[1];
                            
                            return youtubeId ? (
                              <iframe 
                                src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                                className="w-full h-full"
                                allowFullScreen
                                style={{ zIndex: 100 }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                                Video tidak tersedia
                              </div>
                            );
                          })()}
                        </div>
                        <div className="text-center w-full px-2">
                           {chapter.title && <h3 className="font-bold text-primary text-lg mb-1">{chapter.title}</h3>}
                           {chapter.content && <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">{chapter.content}</p>}
                         </div>
                      </div>
                    )}

                  </div>
                ))}

                {/* Footer text so it doesn't end abruptly */}
                <div className="w-full flex justify-center mt-4 border-t border-stone-200/60 pt-6 pb-2 opacity-50">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">Akhir Cerita</span>
                </div>
              </div>
            </div>
          </div>

          {!isPreview && (
            <div className="flex flex-col gap-2 w-full max-w-[400px] text-center mt-8">
              <p className="text-[10px] text-slate-500 font-semibold select-none">Mau kirim kartu ucapan spesial juga ke orang terdekatmu?</p>
              <button 
                onClick={() => {
                  setReaderMode(false);
                  setReaderPhotos([]);
                  window.history.pushState({}, '', '/');
                }}
                className="w-full h-12 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:bg-primary-fixed-dim active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                Buat Kartu Ucapan Gratis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
