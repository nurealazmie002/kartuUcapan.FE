import React, { Component } from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { renderParticles } from './components/ui/Particles';

import { Toast } from './components/ui/Toast';
import { Header } from './components/layout/Header';
import { StepIndicator } from './components/layout/StepIndicator';

import { Step1Message } from './pages/creator/Step1Message';
import { Step2Theme } from './pages/creator/Step2Theme';
import { Step3Gallery } from './pages/creator/Step3Gallery';
import { Step4Music } from './pages/creator/Step4Music';
import { Step5Share } from './pages/creator/Step5Share';
import { ReaderMode } from './pages/reader/ReaderMode';

// Error Boundary to catch render errors
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
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
  // Semua state dan logika bisnis diambil dari useAppLogic
  const {
    step, setStep,
    cardData, setCardData,
    toastMessage, showToast,
    tiltStyle, handleMouseMove, handleMouseLeave,
    dbThemes,
    isSaving,
    savedSlug, setSavedSlug,
    uploadedPhotos,
    previewPhotoIndex, setPreviewPhotoIndex,
    currentTrack, setCurrentTrack,
    isPlaying, setIsPlaying,
    uploadedMusicFile,
    isUploadingMusic,
    readerMode, setReaderMode,
    readerData,
    readerPhotos, setReaderPhotos,
    readerPhotoIndex, setReaderPhotoIndex,
    envelopeOpened,
    envelopeOpening,
    loadingReader,
    loadingStatus,
    handleNextStep,
    handlePrevStep,
    handleSelectMoment,
    generateBackendShareLink,
    getShareLink,
    copyShareLink,
    shareWhatsApp,
    openEnvelope,
    handleUploadMusic,
    handlePlayMusic,
    togglePlayback,
    handlePhotoChange,
    handleRemovePhoto
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
        readerPhotoIndex={readerPhotoIndex} 
        setReaderPhotoIndex={setReaderPhotoIndex} 
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
  // WRITER / CREATOR RENDERING
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-surface flex flex-col font-body-md relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

      <Header step={step} setStep={setStep} />

      {/* Main Workspace */}
      <main className="flex-1 pt-28 pb-32 px-margin-mobile md:px-lg max-w-max-width w-full mx-auto z-10">
        <StepIndicator step={step} setStep={setStep} />
        <Toast message={toastMessage} />

        {/* Two-Column Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form Cards */}
          <section className="lg:col-span-7 bg-white rounded-3xl border border-surface-container-high shadow-sm p-6 md:p-8 flex flex-col gap-8 min-h-[480px] overflow-hidden">
            <div key={step} className="animate-step-transition flex flex-col gap-8 flex-1">
              {step === 1 && (
                <Step1Message 
                  cardData={cardData} 
                  setCardData={setCardData} 
                  setSavedSlug={setSavedSlug} 
                  handleSelectMoment={handleSelectMoment} 
                />
              )}
              {step === 2 && (
                <Step2Theme 
                  cardData={cardData} 
                  setCardData={setCardData} 
                  setSavedSlug={setSavedSlug} 
                  dbThemes={dbThemes} 
                />
              )}
              {step === 3 && (
                <Step3Gallery 
                  uploadedPhotos={uploadedPhotos} 
                  handlePhotoChange={handlePhotoChange} 
                  handleRemovePhoto={handleRemovePhoto} 
                />
              )}
              {step === 4 && (
                <Step4Music 
                  setCardData={setCardData} 
                  currentTrack={currentTrack} 
                  setCurrentTrack={setCurrentTrack} 
                  isPlaying={isPlaying} 
                  setIsPlaying={setIsPlaying} 
                  uploadedMusicFile={uploadedMusicFile} 
                  isUploadingMusic={isUploadingMusic} 
                  handlePlayMusic={handlePlayMusic} 
                  handleUploadMusic={handleUploadMusic} 
                  togglePlayback={togglePlayback} 
                  setSavedSlug={setSavedSlug} 
                />
              )}
              {step === 5 && (
                <Step5Share 
                  savedSlug={savedSlug} 
                  isSaving={isSaving} 
                  generateBackendShareLink={generateBackendShareLink} 
                  getShareLink={getShareLink} 
                  copyShareLink={copyShareLink} 
                  shareWhatsApp={shareWhatsApp} 
                  showToast={showToast} 
                />
              )}
            </div>

            {/* Navigation button rows */}
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100 relative">
              <button 
                type="button"
                onClick={handlePrevStep}
                className={`px-8 py-3 rounded-full border border-primary text-primary font-bold active:scale-95 transition-all flex items-center gap-2 hover:bg-primary-fixed/30 ${step === 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                disabled={step === 1}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Kembali
              </button>

              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center pointer-events-none">
                <p className="text-caption font-caption text-on-surface-variant uppercase tracking-widest text-[10px] leading-tight">
                  Langkah {step} dari 5
                </p>
                <p className="text-xs font-extrabold text-primary uppercase tracking-wider mt-0.5 leading-tight">
                  {step === 1 && 'Nama & Pesan'}
                  {step === 2 && `Tema: ${cardData.theme}`}
                  {step === 3 && 'Galeri Foto'}
                  {step === 4 && 'Musik Pengiring'}
                  {step === 5 && 'Bagikan Kartu'}
                </p>
              </div>

              {step < 5 ? (
                <button 
                  type="button"
                  onClick={handleNextStep}
                  className="px-12 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg active:scale-95 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Lanjut</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="px-12 py-3 rounded-full bg-slate-900 text-white font-bold shadow-lg active:scale-95 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Buat Baru</span>
                  <span className="material-symbols-outlined">restart_alt</span>
                </button>
              )}
            </div>
          </section>

          {/* Right Column: Parallax Live Preview Studio */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl border border-surface-container-high shadow-sm p-6 md:p-8 flex flex-col gap-6 items-center justify-between min-h-[580px]">
              
              <div className="w-full flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80"></span>
                </div>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-extrabold select-none">Live Preview Studio</span>
                <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-100 select-none">
                  <span className="material-symbols-outlined text-[10px] text-stone-400 fill-icon animate-pulse">visibility</span>
                  <span className="text-[9px] text-stone-500 font-extrabold uppercase tracking-wider">Aktif</span>
                </div>
              </div>

              {/* Tampilan Miniatur Kartu diganti memanggil komponen ReaderMode tapi disable fitur kliknya */}
              <div className="scale-90 transform origin-top w-full select-none z-10">
                 <ReaderMode 
                  readerData={cardData} 
                  readerPhotos={uploadedPhotos} 
                  readerPhotoIndex={previewPhotoIndex} 
                  setReaderPhotoIndex={setPreviewPhotoIndex} 
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

              <p className="text-[10px] text-stone-400 text-center font-semibold max-w-[250px] leading-relaxed select-none">
                Pratinjau ini menunjukkan bagaimana penerima akan melihat kartu ucapan Anda.
              </p>
            </div>
          </aside>
        </div>
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
