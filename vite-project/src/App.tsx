import React, { Component, useState } from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { renderParticles } from './components/ui/Particles';

import { Toast } from './components/ui/Toast';
import { Header } from './components/layout/Header';
import { AccordionEditor } from './pages/creator/AccordionEditor';
import { ReaderMode } from './pages/reader/ReaderMode';

// Error Boundary to catch render errors
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: unknown }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-red-100">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
            <h1 className="text-xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h1>
            <p className="text-sm text-slate-600 mb-6">Maaf, aplikasi mengalami masalah saat memuat data. Silakan muat ulang halaman.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-md hover:bg-black transition-all"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  // Semua state dan logika bisnis diambil dari useAppLogic
  const {
    activeAccordionId, setActiveAccordionId,
    cardData, setCardData,
    toastMessage, showToast,
    tiltStyle, handleMouseMove, handleMouseLeave,
    dbThemes,
    isSaving,
    savedSlug,
    uploadedPhotos,

    currentTrack,
    isPlaying, setIsPlaying,
    uploadedMusicFile,
    isUploadingMusic,
    readerMode, setReaderMode,
    readerData,
    readerPhotos, setReaderPhotos,

    envelopeOpened,
    envelopeOpening,
    loadingReader,
    loadingStatus,
    
    handleAddChapter,
    handleUpdateChapter,
    handleRemoveChapter,
    uploadSinglePhoto,
    generateBackendShareLink,
    getShareLink,
    copyShareLink,
    shareWhatsApp,
    openEnvelope,
    handleUploadMusic,
    handlePlayMusic
  } = useAppLogic();

  // LOADING SCREEN FOR READER MODE
  if (loadingReader) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border border-stone-100 animate-pulse-slow">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            <span className="material-symbols-outlined text-primary text-2xl">mail</span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-800 tracking-tight mb-2">Memuat Kartu...</h2>
          <p className="text-sm text-stone-500 font-medium leading-relaxed">{loadingStatus}</p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // READER RENDERING
  // ----------------------------------------------------
  if (readerMode && readerData) {
    return (
      <ReaderMode 
        readerData={readerData} 
        readerPhotos={readerPhotos} 
        envelopeOpened={envelopeOpened} 
        envelopeOpening={envelopeOpening} 
        setReaderMode={setReaderMode} 
        setReaderPhotos={setReaderPhotos} 
        openEnvelope={openEnvelope} 
        renderParticles={renderParticles} 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying} 
        uploadedMusicFile={uploadedMusicFile} 
        handleMouseMove={handleMouseMove} 
        handleMouseLeave={handleMouseLeave} 
        tiltStyle={tiltStyle} 
      />
    );
  }

  // ----------------------------------------------------
  // WRITER / CREATOR RENDERING (True Studio Layout)
  // ----------------------------------------------------
  return (
    <div className="h-screen w-screen bg-surface flex flex-col font-body-md relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <Header />

      {/* Main Studio Area */}
      <main className="flex-1 pt-16 flex w-full max-w-[1600px] mx-auto overflow-hidden relative">
        <Toast message={toastMessage} />

        {/* Left Column: Editor (Independent Scroll) */}
        <section className="flex-1 w-full lg:max-w-[55%] h-full overflow-y-auto custom-scrollbar px-4 md:px-8 py-8 pb-32">
          <div className="max-w-3xl mx-auto w-full">
            <AccordionEditor 
              activeAccordionId={activeAccordionId}
              setActiveAccordionId={setActiveAccordionId}
              cardData={cardData}
              setCardData={setCardData}
              dbThemes={dbThemes}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              uploadedMusicFile={uploadedMusicFile}
              isUploadingMusic={isUploadingMusic}
              handlePlayMusic={handlePlayMusic}
              handleUploadMusic={handleUploadMusic}
              handleAddChapter={handleAddChapter}
              handleUpdateChapter={handleUpdateChapter}
              handleRemoveChapter={handleRemoveChapter}
              uploadSinglePhoto={uploadSinglePhoto}
              savedSlug={savedSlug}
              isSaving={isSaving}
              generateBackendShareLink={generateBackendShareLink}
              getShareLink={getShareLink}
              copyShareLink={copyShareLink}
              shareWhatsApp={shareWhatsApp}
              showToast={showToast}
            />
          </div>
        </section>

        {/* Right Column: Live Preview (Fixed & Centered) */}
        <aside className="hidden lg:flex flex-1 lg:max-w-[45%] bg-stone-100/50 border-l border-stone-200 h-full relative">
          
          <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-20">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Live Preview Studio</span>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm">
              <span className="material-symbols-outlined text-[10px] text-primary animate-pulse">visibility</span>
              <span className="text-[9px] text-stone-600 font-extrabold uppercase tracking-wider">Aktif</span>
            </div>
          </div>

          <div className="w-full h-full flex flex-col items-center justify-center p-6 pt-20 pb-8">
            <div className="w-full max-w-[360px] h-full max-h-[720px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-stone-200 overflow-hidden relative flex flex-col shrink-0">
              <ReaderMode 
                readerData={cardData} 
                readerPhotos={uploadedPhotos} 
                envelopeOpened={true} 
                envelopeOpening={false} 
                setReaderMode={() => {}} 
                setReaderPhotos={() => {}} 
                openEnvelope={() => {}} 
                renderParticles={renderParticles} 
                isPlaying={false} 
                setIsPlaying={() => {}} 
                uploadedMusicFile={uploadedMusicFile} 
                handleMouseMove={handleMouseMove} 
                handleMouseLeave={handleMouseLeave} 
                tiltStyle={tiltStyle} 
                isPreview={true}
              />
            </div>
            <p className="text-[10px] text-stone-400 text-center font-medium mt-4 max-w-[280px]">
              Tampilan simulasi di layar HP penerima
            </p>
          </div>
        </aside>

        {/* Mobile Preview FAB */}
        <button 
           className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-white px-5 py-4 rounded-full shadow-[0_8px_30px_rgba(185,10,90,0.4)] flex items-center gap-2 font-bold active:scale-95 transition-all border-2 border-white"
           onClick={() => setShowMobilePreview(true)}
        >
           <span className="material-symbols-outlined fill-icon">phone_iphone</span>
           <span className="text-sm">Lihat Preview</span>
        </button>

        {/* Mobile Preview Overlay */}
        {showMobilePreview && (
           <div className="lg:hidden fixed inset-0 z-50 bg-stone-900/95 backdrop-blur-md flex flex-col transition-all duration-300">
             <div className="p-4 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white/70 text-sm">visibility</span>
                  <span className="text-white/90 text-xs font-bold uppercase tracking-widest">Live Preview</span>
                </div>
                <button onClick={() => setShowMobilePreview(false)} className="bg-white/10 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all">
                   <span className="material-symbols-outlined text-lg">close</span>
                </button>
             </div>
             <div className="flex-1 overflow-hidden flex justify-center py-6 px-4">
                <div className="w-full max-w-[360px] h-full shrink-0 bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative border-4 border-stone-700">
                   <ReaderMode 
                    readerData={cardData} 
                    readerPhotos={uploadedPhotos} 
                    envelopeOpened={true} 
                    envelopeOpening={false} 
                    setReaderMode={() => {}} 
                    setReaderPhotos={() => {}} 
                    openEnvelope={() => {}} 
                    renderParticles={renderParticles} 
                    isPlaying={false} 
                    setIsPlaying={() => {}} 
                    uploadedMusicFile={uploadedMusicFile} 
                    handleMouseMove={handleMouseMove} 
                    handleMouseLeave={handleMouseLeave} 
                    tiltStyle={tiltStyle} 
                    isPreview={true}
                  />
                </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
