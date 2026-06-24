import React from 'react';
import type { CardData, UploadedMusicFile } from '../../types';
import { audioController, TRACK_LIST } from '../../audioHelper';

interface Step4Props {

  setCardData: React.Dispatch<React.SetStateAction<CardData>>;
  currentTrack: string;
  setCurrentTrack: (track: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  uploadedMusicFile: UploadedMusicFile | null;
  isUploadingMusic: boolean;
  handlePlayMusic: (trackId: string) => void;
  handleUploadMusic: (e: React.ChangeEvent<HTMLInputElement>) => void;
  togglePlayback: () => void;
  setSavedSlug: (slug: string | null) => void;
}

export const Step4Music: React.FC<Step4Props> = ({ 

  setCardData, 
  currentTrack,
  setCurrentTrack,
  isPlaying,
  setIsPlaying,
  uploadedMusicFile,
  isUploadingMusic,
  handlePlayMusic,
  handleUploadMusic,
  togglePlayback,
  setSavedSlug
}) => {
  return (
    <div className="flex flex-col gap-6 animate-envelope">
      <div className="flex flex-col gap-1">
        <h2 className="font-headline-lg text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">Pilih Musik Pengiring 🎵</h2>
        <p className="text-on-surface-variant text-sm">Tambahkan melodi indah yang akan mengiringi kartu ucapanmu saat dibuka.</p>
      </div>

      {/* Tanpa Musik option */}
      <div
        onClick={() => {
          audioController.stop();
          setIsPlaying(false);
          setCurrentTrack('none');
          setCardData(prev => ({ ...prev, music: 'none' }));
          setSavedSlug(null);
        }}
        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
          currentTrack === 'none'
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-stone-100 hover:border-primary/20 hover:bg-stone-50/50'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-stone-600 ${
            currentTrack === 'none' ? 'bg-primary/10 text-primary' : 'bg-stone-100'
          }`}>
            <span className="material-symbols-outlined text-[18px]">music_off</span>
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-stone-800 leading-tight">Tanpa Musik</h4>
            <p className="text-[10px] text-stone-500 mt-0.5">Kartu akan tampil dalam keheningan</p>
          </div>
        </div>
        {currentTrack === 'none' && (
          <span className="material-symbols-outlined text-primary fill-icon text-base">check_circle</span>
        )}
      </div>

      {/* Generative Synth row */}
      <div
        onClick={() => handlePlayMusic('synth')}
        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
          currentTrack === 'synth'
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-stone-100 hover:border-primary/20 hover:bg-stone-50/50'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <button type="button" className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white transition-all ${
            currentTrack === 'synth' && isPlaying ? 'bg-primary animate-cd' : 'bg-slate-700 hover:bg-slate-800'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {currentTrack === 'synth' && isPlaying ? 'pause' : 'music_note'}
            </span>
          </button>
          <div>
            <h4 className="font-extrabold text-xs text-stone-800 leading-tight">Offline Web Audio Synth</h4>
            <p className="text-[10px] text-stone-500 mt-0.5">Generative Ambient Pad</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentTrack === 'synth' && isPlaying && (
            <div className="flex items-end gap-[2.5px] h-5 mr-1">
              <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.1s', width: '2.5px' }}></span>
              <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.3s', width: '2.5px' }}></span>
              <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.5s', width: '2.5px' }}></span>
            </div>
          )}
          <span className="text-[9px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-md">Synth</span>
        </div>
      </div>

      {/* MP3 Track List */}
      <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pr-1">
        {TRACK_LIST.map((track) => {
          const isSelected = currentTrack === track.id;
          const isTrackPlaying = isSelected && isPlaying;
          return (
            <div
              key={track.id}
              onClick={() => handlePlayMusic(track.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-stone-100 hover:border-primary/20 hover:bg-stone-50/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button type="button" className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white transition-all ${
                  isTrackPlaying ? 'bg-primary animate-cd' : 'bg-primary-container hover:bg-primary'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {isTrackPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <div>
                  <h4 className="font-extrabold text-xs text-stone-800 leading-tight">{track.title}</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {isTrackPlaying && (
                  <div className="flex items-end gap-[2.5px] h-5 mr-1">
                    <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.1s', width: '2.5px' }}></span>
                    <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.3s', width: '2.5px' }}></span>
                    <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.5s', width: '2.5px' }}></span>
                  </div>
                )}
                <span className="text-[10px] text-stone-500 font-bold">{track.duration}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-stone-100" />
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">atau</span>
        <div className="flex-1 h-px bg-stone-100" />
      </div>

      {/* Upload Your Own Music */}
      <div className={`relative rounded-2xl border-2 transition-all overflow-hidden ${
        currentTrack === 'custom_upload'
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-dashed border-stone-200 hover:border-primary/40 hover:bg-primary/5'
      }`}>
        {/* If already uploaded, show the file info */}
        {uploadedMusicFile && currentTrack === 'custom_upload' ? (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3.5">
              <div
                onClick={() => {
                  audioController.togglePlayCustom(
                    { id: 'custom_upload', url: uploadedMusicFile.previewUrl || uploadedMusicFile.fileUrl, mood: 'chill' },
                    setIsPlaying
                  );
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white cursor-pointer transition-all ${
                  currentTrack === 'custom_upload' && isPlaying ? 'bg-primary animate-cd' : 'bg-primary-container hover:bg-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {currentTrack === 'custom_upload' && isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-primary leading-tight">{uploadedMusicFile.fileName}</h4>
                <p className="text-[10px] text-stone-500 mt-0.5">Musik kustom Anda</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentTrack === 'custom_upload' && isPlaying && (
                <div className="flex items-end gap-[2.5px] h-5">
                  <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.1s', width: '2.5px' }}></span>
                  <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.3s', width: '2.5px' }}></span>
                  <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.5s', width: '2.5px' }}></span>
                </div>
              )}
              {/* Replace button */}
              <label className="text-[10px] text-stone-400 hover:text-primary font-bold cursor-pointer transition-colors">
                <input type="file" accept="audio/*" onChange={handleUploadMusic} className="hidden" />
                Ganti
              </label>
            </div>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center gap-2.5 p-5 cursor-pointer ${
            isUploadingMusic ? 'pointer-events-none' : ''
          }`}>
            <input type="file" accept="audio/*" onChange={handleUploadMusic} className="hidden" disabled={isUploadingMusic} />
            {isUploadingMusic ? (
              <>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-xs font-bold text-primary">Mengunggah musik...</p>
              </>
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-stone-400 text-xl">upload_file</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-extrabold text-stone-700">Upload Musik Sendiri</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">MP3, WAV, OGG — Maks. 20MB</p>
                </div>
              </>
            )}
          </label>
        )}
      </div>

      {/* Now Playing pill */}
      {isPlaying && currentTrack !== 'none' && (
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-2xl p-3.5">
          <div className="flex items-end gap-[2.5px] h-5">
            <span className="equalizer-bar bg-primary" style={{ animationDelay: '0s', width: '2.5px' }}></span>
            <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.2s', width: '2.5px' }}></span>
            <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.4s', width: '2.5px' }}></span>
            <span className="equalizer-bar bg-primary" style={{ animationDelay: '0.6s', width: '2.5px' }}></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Sedang Diputar</p>
            <p className="text-xs font-extrabold text-primary truncate">
              {currentTrack === 'synth'
                ? 'Offline Web Audio Synth'
                : currentTrack === 'custom_upload' && uploadedMusicFile
                  ? uploadedMusicFile.fileName
                  : TRACK_LIST.find(t => t.id === currentTrack)?.title || currentTrack}
            </p>
          </div>
          <button
            type="button"
            onClick={togglePlayback}
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow text-sm active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-sm">pause</span>
          </button>
        </div>
      )}
    </div>
  );
};
