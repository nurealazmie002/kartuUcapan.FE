import React, { useState, useEffect } from 'react';
import type { CardData, UploadedMusicFile } from '../../types';
import { themeConfigs, iconMap, momentTitleMap } from '../../utils/constants';
import { audioController, TRACK_LIST } from '../../audioHelper';

interface ReaderModeProps {
  readerData: CardData | null;
  readerPhotos: any[];
  readerPhotoIndex: number;
  setReaderPhotoIndex: React.Dispatch<React.SetStateAction<number>>;
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
  readerPhotoIndex,
  setReaderPhotoIndex,
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 1 + (readerPhotos?.length || 0);
  const slideDuration = 7000; // 7 detik per slide

  useEffect(() => {
    if (!envelopeOpened || isPreview) return;
    if (currentSlide >= totalSlides - 1) return;

    const timer = setTimeout(() => {
      setCurrentSlide(s => Math.min(s + 1, totalSlides - 1));
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [currentSlide, envelopeOpened, totalSlides, isPreview]);

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide < totalSlides - 1) setCurrentSlide(s => s + 1);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide > 0) setCurrentSlide(s => s - 1);
  };

  useEffect(() => {
    if (envelopeOpened) {
      setShowConfettiBurst(true);
      const timer = setTimeout(() => setShowConfettiBurst(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [envelopeOpened]);

  if (!readerData) return null;

  return (
    <div className={`min-h-screen w-full relative overflow-hidden font-body-md transition-all duration-700 ${themeConfigs[readerData.theme]?.bgClass || 'theme-bg-ceria'}`}>
      
      {/* Confetti Burst perayaan */}
      {showConfettiBurst && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {Array.from({ length: 45 }).map((_, i) => {
            const angle = (i / 45) * 360 + (Math.random() * 15 - 7.5);
            const speed = Math.random() * 180 + 120; // px
            const delay = Math.random() * 0.25;
            const size = Math.random() * 10 + 6;
            const colors = ['bg-pink-500', 'bg-yellow-400', 'bg-blue-400', 'bg-purple-400', 'bg-orange-400', 'bg-red-400'];
            const color = colors[i % colors.length];
            const angleRad = (angle * Math.PI) / 180;
            const targetX = Math.cos(angleRad) * speed;
            const targetY = Math.sin(angleRad) * speed + 180;
            return (
              <div
                key={i}
                className={`absolute left-1/2 top-1/2 rounded-full animate-confetti-burst-particle ${color}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  '--target-x': `${targetX}px`,
                  '--target-y': `${targetY}px`,
                  animationDelay: `${delay}s`,
                  transform: 'translate(-50%, -50%)',
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* Dynamic blurred orbs behind card */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10 animate-watercolor-blob" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 animate-watercolor-blob" style={{ animationDelay: '4s' }}></div>

      {/* Floating particles (Stars, Hearts, watercolor blooms) */}
      {envelopeOpened && renderParticles(readerData.theme)}

      {/* Float Header bar */}
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
                setReaderPhotoIndex(0);
                window.history.pushState({}, '', '/');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              Buat Kartu Sendiri 💌
            </button>
          </div>
        </header>
      )}

      {/* 3D ENVELOPE (Unopened state) */}
      {!envelopeOpened ? (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="flex flex-col items-center gap-10 max-w-md w-full text-center animate-envelope">
            
            {/* Logo/Brand */}
            <div className="flex items-center gap-2 select-none">
              <span className="material-symbols-outlined text-primary fill-icon text-xl">favorite</span>
              <span className="font-extrabold text-primary/80 text-sm tracking-widest uppercase">KirimUcapan</span>
            </div>

            {/* Title block */}
            <div className="flex flex-col gap-3">
              <h2 className="text-4xl font-extrabold text-[#1a1c1e] tracking-tight leading-tight">
                Ada Surat<br/>Spesial Untukmu! 💌
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Seseorang mengirimkan kartu ucapan hangat untuk <strong className="text-slate-700">{readerData.recipient}</strong>.
              </p>
            </div>

            {/* ENVELOPE — SVG Clickable Card */}
            <div
              onClick={openEnvelope}
              className={`cursor-pointer group transition-all duration-[1.5s] ${envelopeOpening ? 'animate-envelope-zoom-fade pointer-events-none' : 'hover:-translate-y-2'}`}
            >
              <div className="w-[300px] h-[225px] bg-[#fbf8f0] rounded-2xl shadow-xl border border-[#e8dcc4] relative" style={{ perspective: '1000px' }}>
                
                {/* Back flap (inside of the envelope) */}
                <div className="absolute inset-0 bg-[#f4ebd0] z-0"></div>

                {/* The miniature card that slides up */}
                <div 
                  className={`absolute left-[5%] right-[5%] h-[90%] bg-white rounded-xl shadow-md z-10 transition-transform duration-[1s] ease-in-out ${envelopeOpening ? '-translate-y-[60%] scale-105' : 'translate-y-[15%]'}`}
                  style={{ transitionDelay: '0.3s' }}
                >
                   {/* Dummy card content to look like a card sliding out */}
                   <div className="p-4 flex flex-col items-center justify-center gap-3 opacity-50 h-full">
                     <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-pink-300 text-lg">favorite</span>
                     </div>
                     <div className="w-32 h-2 bg-stone-200 rounded-full"></div>
                     <div className="w-24 h-2 bg-stone-200 rounded-full"></div>
                   </div>
                </div>

                {/* Bottom fold (covers the card) */}
                <svg className="absolute bottom-0 left-0 w-full z-20" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ height: '50%' }}>
                  <path d="M0,50 L50,0 L100,50 Z" fill="#fcfaf5" stroke="#e8dcc4" strokeWidth="0.5" />
                </svg>

                {/* Top Flap (opens up) */}
                <svg 
                  className={`absolute top-0 left-0 w-full z-30 transition-all duration-700 origin-top`} 
                  viewBox="0 0 100 50" preserveAspectRatio="none" 
                  style={{ height: '50%', transform: envelopeOpening ? 'rotateX(180deg)' : 'rotateX(0deg)', opacity: envelopeOpening ? 0 : 1 }}
                >
                  <path d="M0,0 L50,50 L100,0 Z" fill="#f4ebd0" stroke="#e8dcc4" strokeWidth="0.5" />
                </svg>

                {/* Stamp */}
                <div className={`absolute top-4 right-4 w-10 h-12 border-2 border-dashed border-[#dcc69c]/60 flex items-center justify-center bg-[#fbf8f0]/50 rotate-6 z-30 transition-opacity duration-300 ${envelopeOpening ? 'opacity-0' : 'opacity-100'}`}>
                  <span className="material-symbols-outlined text-[#dcc69c] text-xl">favorite</span>
                </div>

                {/* Center: Wax Seal */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 z-40 ${envelopeOpening ? 'pointer-events-none' : ''}`}>
                  <div className={`wax-seal w-20 h-20 rounded-full flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300 shadow-2xl ${envelopeOpening ? 'animate-seal-pop' : ''}`}>
                    <span className="material-symbols-outlined text-white text-3xl fill-icon animate-pulse">favorite</span>
                    <div className="absolute inset-0 rounded-full border-[3px] border-white/30 animate-ping opacity-60" />
                  </div>
                  <span className={`bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-primary font-extrabold uppercase tracking-widest shadow-sm transition-all duration-300 ${envelopeOpening ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                    Ketuk Untuk Membuka
                  </span>
                </div>

                {/* Micro-interaction: Heart particle burst from seal */}
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
                          style={{
                            '--tx': `${tx}px`,
                            '--ty': `${ty}px`,
                            fontSize: '16px',
                          } as React.CSSProperties}
                        >
                          favorite
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Recipient tag */}
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-stone-100 px-5 py-2.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-primary fill-icon text-sm">person</span>
              <span className="text-xs font-bold text-stone-600">Untuk: <span className="text-primary">{readerData.recipient}</span></span>
            </div>
          </div>
        </div>
      ) : (
        
        // CARD PRESENTATION (Opened State)
        <div className="min-h-screen flex flex-col items-center justify-start pt-24 pb-12 px-6">
          
          {/* Reader Mode Music Pill */}
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
              {/* Vinyl CD Player Icon */}
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full bg-[#1c1917] border border-stone-950 flex items-center justify-center relative shadow-md transition-transform duration-500 ${isPlaying ? 'animate-cd-spin' : ''}`}>
                  {/* Vinyl Grooves */}
                  <div className="absolute inset-1 rounded-full border border-stone-800/40"></div>
                  <div className="absolute inset-2 rounded-full border border-stone-700/30"></div>
                  {/* Center Label */}
                  <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>
                </div>
                {/* Tone arm stylus */}
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

          {/* Card — fixed width, no aspect-ratio trick */}
          <div 
            className="relative animate-envelope"
            style={{ width: '100%', maxWidth: '400px' }}
          >
            {/* Aspect ratio wrapper using padding-bottom */}
            <div style={{ position: 'relative', width: '100%', paddingBottom: '160%' /* taller for stories 16:10 */ }}>
              <div
                className="card-preview-container absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={tiltStyle}
              >
                {/* Background */}
                <div className={`absolute inset-0 z-0 ${themeConfigs[readerData.theme]?.bgClass || 'theme-bg-ceria'}`}>
                  {renderParticles(readerData.theme)}
                </div>

                {/* Border overlay */}
                <div className="absolute inset-0 rounded-[2.5rem] border-4 border-white z-0 pointer-events-none" />

                {/* --- STORY PROGRESS BAR --- */}
                {totalSlides > 1 && (
                  <div className="absolute top-6 left-6 right-6 z-50 flex gap-1.5">
                    {Array.from({ length: totalSlides }).map((_, i) => (
                      <div key={i} className="flex-1 h-1 bg-black/20 rounded-full overflow-hidden shadow-sm">
                        <div 
                          className={`h-full bg-white rounded-full ${i === currentSlide ? 'animate-story-progress' : i < currentSlide ? 'w-full' : 'w-0'}`}
                          style={i === currentSlide ? { animationDuration: `${slideDuration}ms` } : {}}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* --- NAVIGATION TAP ZONES --- */}
                <div className="absolute inset-0 z-40 flex">
                  <div className="w-[30%] h-full cursor-pointer" onClick={handlePrevSlide} />
                  <div className="w-[70%] h-full cursor-pointer" onClick={handleNextSlide} />
                </div>

                {/* Inner Content */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
                  style={{ padding: '32px 24px' }}>

                  {currentSlide === 0 ? (
                    /* --- SLIDE 0: TEXT AND MESSAGE --- */
                    <div className={`${themeConfigs[readerData.theme]?.cardClass || 'glass-panel'} w-full flex flex-col shadow-2xl transition-all duration-700 animate-slide-up-1`}
                      style={{ gap: '24px', padding: '32px 24px' }}>

                      {/* Icon + header */}
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex-shrink-0 bg-primary-container/20 rounded-full flex items-center justify-center border border-primary/10 w-16 h-16 shadow-inner">
                          <span className="material-symbols-outlined text-primary text-4xl">
                            {iconMap[readerData.moment] || 'celebration'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5 mt-2 text-center">
                          <h4 className={themeConfigs[readerData.theme]?.titleClass || 'text-primary font-headline-md font-semibold tracking-wide uppercase text-xs'}>
                            {momentTitleMap[readerData.moment] || 'Special Greeting!'}
                          </h4>
                          <div className={themeConfigs[readerData.theme]?.dividerClass || 'h-[3px] w-16 bg-primary/30 mx-auto rounded-full'} />
                          <h5 className={themeConfigs[readerData.theme]?.recipientClass || 'font-headline-lg-mobile text-on-surface font-black text-3xl tracking-tight leading-none'}>
                            {readerData.recipient}
                          </h5>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="relative px-2 py-4">
                        <span className="material-symbols-outlined absolute -top-2 -left-2 text-primary/20 text-4xl transform -rotate-12">format_quote</span>
                        <p className={`relative z-10 text-center ${themeConfigs[readerData.theme]?.textClass || 'text-body-md text-on-surface-variant font-medium leading-relaxed text-lg'}`}>
                          {readerData.message}
                        </p>
                        <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-primary/20 text-4xl transform rotate-12">format_quote</span>
                      </div>

                      {/* Sender */}
                      <div className="border-t-2 border-slate-200/50 pt-4 flex flex-col items-center justify-center gap-1">
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Dari:</span>
                        <span className="font-black text-primary tracking-wide text-lg">{readerData.sender}</span>
                      </div>
                    </div>
                  ) : (
                    /* --- SLIDE 1-N: PHOTOS POLAROID --- */
                    (() => {
                      const photoIndex = currentSlide - 1;
                      const ph = readerPhotos[photoIndex];
                      if (!ph) return null;
                      const url = ph?.file?.file_url || ph?.file_url || ph?.fileUrl;
                      
                      // Generate slightly random rotation for polaroid
                      const rotations = ['-4deg', '3deg', '-2deg', '5deg', '-5deg', '2deg'];
                      const rotateStr = rotations[photoIndex % rotations.length];

                      return (
                        <div 
                          key={`photo-${photoIndex}`}
                          className="w-full flex items-center justify-center polaroid-frame animate-slide-up-1"
                          style={{ '--polaroid-rotate': rotateStr } as React.CSSProperties}
                        >
                          <div className="w-full bg-stone-100 overflow-hidden" style={{ aspectRatio: '3/4' }}>
                            {url ? (
                              <img src={url} alt="Kenangan" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300">
                                <span className="material-symbols-outlined text-4xl">broken_image</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Optional: Add a subtle tape effect */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 backdrop-blur-sm shadow-sm rotate-[-2deg] border border-white/50" />
                          
                          {/* Slide Counter on Polaroid */}
                          <div className="absolute bottom-3 left-0 w-full text-center">
                            <span className="font-display-lg-mobile text-stone-300 font-bold text-sm">
                              {currentSlide} / {totalSlides - 1}
                            </span>
                          </div>
                        </div>
                      );
                    })()
                  )}

                </div>

                {/* Glow overlays */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-secondary-container rounded-full blur-[40px] opacity-40 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary-container rounded-full blur-[50px] opacity-40 animate-pulse" style={{ animationDelay: '1.2s' }}></div>
              </div>
            </div>
          </div>

          {/* Return CTA */}
          {!isPreview && (
            <div className="flex flex-col gap-2 w-full max-w-[400px] text-center mt-8">
              <p className="text-[10px] text-slate-500 font-semibold select-none">Mau kirim kartu ucapan spesial juga ke orang terdekatmu?</p>
              <button 
                onClick={() => {
                  setReaderMode(false);
                  setReaderPhotos([]);
                  setReaderPhotoIndex(0);
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
