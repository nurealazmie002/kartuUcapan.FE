import { useState, useEffect } from 'react';
import type { CardData, UploadedPhoto, UploadedMusicFile, StoryChapter } from '../types';
import { DEFAULT_CARD, BACKEND_URL, FRONTEND_URL } from '../utils/constants';
import { encodeCard, decodeCard } from '../utils/helpers';
import { audioController, TRACK_LIST } from '../audioHelper';

export const useAppLogic = () => {
  const [activeAccordionId, setActiveAccordionId] = useState<string>('intro');
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  // API Backend states
  const [dbThemes, setDbThemes] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  // Photos states
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(0);

  // Music states
  const [currentTrack, setCurrentTrack] = useState<string>('track1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadedMusicFile, setUploadedMusicFile] = useState<UploadedMusicFile | null>(null);
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);

  // Reader state
  const [readerMode, setReaderMode] = useState(false);
  const [readerData, setReaderData] = useState<CardData | null>(null);
  const [readerPhotos, setReaderPhotos] = useState<any[]>([]);

  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [loadingReader, setLoadingReader] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Membuka amplop ucapan hangat...');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const seedDatabase = async () => {
    try {
      const themeRes = await fetch(`${BACKEND_URL}/api/v1/themes?activeOnly=true`);
      const themeJson = await themeRes.json();
      if (themeJson.success && themeJson.data.length === 0) {
        const defaultThemes = [
          { id: 'Ceria', name: 'Ceria', background_gradient: 'theme-bg-ceria', confetti_colors: ["#f472b6", "#facc15", "#60a5fa", "#c084fc", "#fb923c", "#2dd4bf"] },
          { id: 'Elegan', name: 'Elegan', background_gradient: 'theme-bg-elegan', confetti_colors: ["#ffd700"] },
          { id: 'Klasik', name: 'Klasik', background_gradient: 'theme-bg-klasik', confetti_colors: ["#8b5a2b"] },
          { id: 'Playful', name: 'Playful', background_gradient: 'theme-bg-playful', confetti_colors: ["#ff4d8d", "#fdc003"] },
          { id: 'Minimalist', name: 'Minimalist', background_gradient: 'theme-bg-minimalist', confetti_colors: ["#78716c"] },
          { id: 'Serenity', name: 'Serenity', background_gradient: 'theme-bg-serenity', confetti_colors: ["#2dd4bf", "#60a5fa"] }
        ];
        for (const t of defaultThemes) {
          await fetch(`${BACKEND_URL}/api/v1/themes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t)
          });
        }
      }
    } catch (e) {
      console.warn("DB Seeding failed", e);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const params = new URLSearchParams(window.location.search);
      let slugParam = params.get('s') || params.get('slug');
      const cardParam = params.get('card');

      if (!slugParam && window.location.pathname.startsWith('/g/')) {
        slugParam = window.location.pathname.split('/g/')[1];
      }

      if (slugParam) {
        setLoadingReader(true);
        setReaderMode(true);
        setLoadingStatus('Membuka amplop ucapan hangat...');
        try {
          let json: any = null;
          const retryDelays = [0, 8000, 12000, 15000, 15000];
          const statusMessages = [
            'Membuka amplop ucapan hangat...',
            'Server sedang bangun dari tidur, mohon tunggu... ☕',
            'Hampir siap! Memuat kartu ucapan...',
            'Sedikit lagi... Server sedang diaktifkan kembali...',
            'Percobaan terakhir...'
          ];

          try {
            const stored = localStorage.getItem('kartuUcapan_preview_' + slugParam);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && parsed.success) {
                json = parsed;
              }
            }
          } catch(e) {}

          if (!json) {
            for (let attempt = 0; attempt < retryDelays.length; attempt++) {
              setLoadingStatus(statusMessages[attempt]);
              if (retryDelays[attempt] > 0) {
                await new Promise(r => setTimeout(r, retryDelays[attempt]));
              }
              try {
                const res = await fetch(`${BACKEND_URL}/api/v1/greeting/slug/${slugParam}`);
                json = await res.json();
                if (json.success && json.data) break;
              } catch (fetchErr) {
                if (attempt === retryDelays.length - 1) {
                  console.warn('Primary fetch failed, trying fallback list endpoint...');
                }
              }
            }
          }

          if (!json || !json.success || !json.data) {
            try {
              const fbRes = await fetch(`${BACKEND_URL}/api/v1/greeting?limit=100`);
              const fbJson = await fbRes.json();
              if (fbJson.success && fbJson.data && fbJson.data.length > 0) {
                const matchedGreeting = fbJson.data.find((g: any) => g.slug === slugParam);
                if (matchedGreeting) {
                  json = { success: true, data: matchedGreeting };
                  if (json.data.music_source === 'upload' && json.data.uploaded_music_file_id) {
                    try {
                      const fileRes = await fetch(`${BACKEND_URL}/api/v1/files/${json.data.uploaded_music_file_id}`);
                      const fileJson = await fileRes.json();
                      if (fileJson.success && fileJson.data) {
                        json.data.uploaded_music_file = fileJson.data;
                      }
                    } catch (e) { console.warn('Failed to fetch music file details'); }
                  }
                }
              }
            } catch (e) {
              console.warn('Fallback fetch also failed', e);
            }
          }

          if (json.success && json.data) {
            const data = json.data;
            
            let parsedStory = DEFAULT_CARD.story;
            try {
              const parsed = JSON.parse(data.message);
              if (Array.isArray(parsed)) parsedStory = parsed;
            } catch(e) {
              parsedStory = [
                { id: 'cover-1', type: 'cover', title: 'Sebuah Pesan Untukmu', content: 'Pelan-pelan dibuka, ya.' },
                { id: 'letter-1', type: 'letter', title: 'Pesan', content: data.message }
              ];
            }

            const mappedData: CardData = {
              recipient: data.recipient_name,
              sender: data.sender_name || 'Teman Baikmu',
              moment: data.occasion,
              message: data.message,
              theme: data.theme_id || 'Ceria',
              music: data.music_source === 'upload' ? 'custom_upload' : (data.music_id || 'track1'),
              story: parsedStory
            };
            setReaderData(mappedData);

            const uploadedMusic = data.uploaded_music || data.uploaded_music_file;
            if (data.music_source === 'upload' && uploadedMusic) {
              let safeUrl = uploadedMusic.file_url;
              if (safeUrl && safeUrl.startsWith('http://')) {
                safeUrl = safeUrl.replace('http://', 'https://');
              }
              setUploadedMusicFile({
                fileId: uploadedMusic.id,
                fileName: uploadedMusic.file_name?.replace(/\.[^/.]+$/, '') || 'Lagu Anda',
                fileUrl: safeUrl
              });
            }

            if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
              const sorted = data.photos.sort((a: any, b: any) => a.display_order - b.display_order);
              const photosWithUrls = await Promise.all(
                sorted.map(async (photo: any) => {
                  if (photo.file_url || photo.file?.file_url) {
                    let safeUrl = photo.file_url || photo.file.file_url;
                    if (safeUrl && safeUrl.startsWith('http://')) safeUrl = safeUrl.replace('http://', 'https://');
                    return { ...photo, file_url: safeUrl };
                  }
                  if (photo.file_id) {
                    try {
                      const fileRes = await fetch(`${BACKEND_URL}/api/v1/files/${photo.file_id}`);
                      const fileJson = await fileRes.json();
                      if (fileJson.success && fileJson.data?.file_url) {
                        let safeUrl = fileJson.data.file_url;
                        if (safeUrl && safeUrl.startsWith('http://')) safeUrl = safeUrl.replace('http://', 'https://');
                        return { ...photo, file_url: safeUrl };
                      }
                    } catch (e) {
                      console.warn("Failed to resolve file URL for photo:", photo.file_id, e);
                    }
                  }
                  return photo;
                })
              );
              setReaderPhotos(photosWithUrls);
            }

            fetch(`${BACKEND_URL}/api/v1/greeting-view`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ greeting_id: data.id })
            }).catch(() => {});
          } else {
            handleCardParamFallback(cardParam);
          }
        } catch (e) {
          handleCardParamFallback(cardParam);
        } finally {
          setLoadingReader(false);
        }
      } else if (cardParam) {
        handleCardParamFallback(cardParam);
      }

      await seedDatabase();

      try {
        const themeRes = await fetch(`${BACKEND_URL}/api/v1/themes?activeOnly=true`);
        const themeJson = await themeRes.json();
        if (themeJson.success && themeJson.data.length > 0) {
          setDbThemes(themeJson.data);
        }
      } catch (e) {
        console.warn("Could not load dynamic theme records.", e);
      }
    };

    initialize();
  }, []);

  const handleCardParamFallback = (cardParam: string | null) => {
    if (cardParam) {
      const decoded = decodeCard(cardParam);
      if (decoded) {
        setReaderData(decoded);
        setReaderMode(true);
        if (decoded.music) setCurrentTrack(decoded.music);
      }
    }
  };

  const handlePlayMusic = (trackId: string) => {
    if (currentTrack === trackId && isPlaying) {
      audioController.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackId);
      setCardData(prev => ({ ...prev, music: trackId }));
      setSavedSlug(null);
      audioController.play(trackId, (playing) => setIsPlaying(playing));
      setIsPlaying(true);
    }
  };

  const togglePlayback = () => {
    audioController.togglePlay((playing) => setIsPlaying(playing));
  };

  const uploadSinglePhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('images', file);
    const res = await fetch(`${BACKEND_URL}/api/v1/files/upload/images`, {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      let safeUrl = json.data[0].file_url;
      if (safeUrl && safeUrl.startsWith('http://')) {
        safeUrl = safeUrl.replace('http://', 'https://');
      }
      return safeUrl;
    }
    throw new Error('Gagal mengunggah foto');
  };

  const uploadPhotoFile = async (item: { localId: string, file: File }) => {
    const formData = new FormData();
    formData.append('images', item.file);
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/files/upload/images`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        const fileRecord = json.data[0];
        setUploadedPhotos(prev => prev.map(p => p.localId === item.localId ? {
          ...p,
          uploadedId: fileRecord.id,
          fileUrl: fileRecord.file_url,
          isUploading: false,
          error: null
        } : p));
      } else {
        throw new Error(json.message || 'Gagal mengunggah foto');
      }
    } catch (err: any) {
      setUploadedPhotos(prev => prev.map(p => p.localId === item.localId ? {
        ...p,
        isUploading: false,
        error: err.message || 'Gagal mengunggah'
      } : p));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const currentCount = uploadedPhotos.length;
    const filesToAdd = files.slice(0, 10 - currentCount);
    
    if (files.length + currentCount > 10) {
      showToast('Maksimal 10 foto yang dapat diunggah.');
    }

    const newItems = filesToAdd.map((file) => {
      const localId = Math.random().toString(36).substring(2, 9);
      const item = {
        localId,
        file,
        previewUrl: URL.createObjectURL(file),
        uploadedId: null,
        fileUrl: null,
        isUploading: true,
        error: null
      };
      
      uploadPhotoFile(item);
      return item;
    });

    setUploadedPhotos(prev => [...prev, ...newItems]);
  };

  const handleRemovePhoto = (localId: string) => {
    setUploadedPhotos(prev => {
      const item = prev.find(p => p.localId === localId);
      if (item && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter(p => p.localId !== localId);
    });
    setSavedSlug(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'none'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `rotateX(0deg) rotateY(0deg)`,
      transition: 'transform 0.5s ease'
    });
  };

  const handleAddChapter = (type: 'cover' | 'photo_text' | 'video' | 'letter') => {
    const newChapter: StoryChapter = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title: type === 'photo_text' ? 'Momen Indah' : type === 'video' ? 'Video Spesial' : type === 'letter' ? 'Pesan Tambahan' : 'Bagian Baru',
      content: ''
    };
    setCardData(prev => ({ ...prev, story: [...prev.story, newChapter] }));
    setActiveAccordionId(newChapter.id);
  };

  const handleUpdateChapter = (id: string, updates: Partial<StoryChapter>) => {
    setCardData(prev => ({
      ...prev,
      story: prev.story.map(ch => ch.id === id ? { ...ch, ...updates } : ch)
    }));
  };

  const handleRemoveChapter = (id: string) => {
    setCardData(prev => ({
      ...prev,
      story: prev.story.filter(ch => ch.id !== id)
    }));
  };

  const handleSelectMoment = (moment: string) => {
    let message = cardData.message;
    if (moment === 'Ulang Tahun') {
      message = 'Selamat hari lahir! Semoga panjang umur, sehat selalu, dilancarkan rezekinya, dan semua impianmu segera terwujud. Selamat merayakan hari spesialmu! 🎉🎂';
    } else if (moment === 'Kelulusan') {
      message = 'Selamat atas kelulusanmu! Semoga ilmu yang didapatkan berkah dan bermanfaat untuk masa depan yang cerah. Bangga padamu! 🎓✨';
    } else if (moment === 'Pernikahan') {
      message = 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Senantiasa dipenuhi cinta dan kebahagiaan. 💍❤️';
    } else if (moment === 'Terima Kasih') {
      message = 'Terima kasih banyak atas segala dukungan, bantuan, dan waktu yang telah kamu berikan. Keberadaanmu sangat berarti bagiku. 🙏🌟';
    } else if (moment === 'Lainnya') {
      message = 'Selamat ya atas pencapaian barumu! Teruslah berkarya, berkembang, dan menyebarkan kebaikan serta kebahagiaan ke sekelilingmu. 🎈🙌';
    }

    setCardData({ ...cardData, moment, message });
  };

  const generateBackendShareLink = async () => {
    setIsSaving(true);
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let generatedSlug = '';
    for (let i = 0; i < 8; i++) {
      generatedSlug += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const payload: Record<string, any> = {
      slug: generatedSlug,
      recipient_name: cardData.recipient,
      sender_name: cardData.sender,
      occasion: cardData.moment,
      message: JSON.stringify(cardData.story),
      theme_id: cardData.theme,
      status: 'published'
    };

    if (uploadedMusicFile && currentTrack === 'custom_upload') {
      payload.music_source = 'upload';
      payload.uploaded_music_file_id = uploadedMusicFile.fileId;
      payload.music_id = null;
    } else {
      payload.music_source = 'library';
      payload.music_id = null;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/greeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success && json.data?.slug) {
        const greeting = json.data;
        const slug = greeting.slug;
        
        let currentPhotos = [...uploadedPhotos];
        const pendingPhotos = currentPhotos.filter(p => !p.uploadedId);
        
        if (pendingPhotos.length > 0) {
          await Promise.all(pendingPhotos.map(async (p) => {
            if (!p.file) return;
            const formData = new FormData();
            formData.append('images', p.file);
            try {
              const uploadRes = await fetch(`${BACKEND_URL}/api/v1/files/upload/images`, { method: 'POST', body: formData });
              const uploadJson = await uploadRes.json();
              if (uploadJson.success && uploadJson.data?.length > 0) {
                const fileRecord = uploadJson.data[0];
                const index = currentPhotos.findIndex(x => x.localId === p.localId);
                if (index !== -1) {
                  currentPhotos[index] = {
                    ...currentPhotos[index],
                    uploadedId: fileRecord.id,
                    fileUrl: fileRecord.file_url,
                    isUploading: false,
                    error: null
                  };
                }
              }
            } catch (e) {}
          }));
          setUploadedPhotos(currentPhotos);
        }

        const validPhotos = currentPhotos.filter(p => p.uploadedId);
        if (validPhotos.length > 0) {
          await Promise.all(validPhotos.map((photo, index) => {
            return fetch(`${BACKEND_URL}/api/v1/greeting-photo`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                greeting_id: greeting.id,
                file_id: photo.uploadedId,
                display_order: index + 1,
                caption: ''
              })
            }).catch(err => console.warn("Failed to link photo:", err));
          }));
        }

        try {
          const previewData = {
            success: true,
            data: {
              ...greeting,
              music_source: payload.music_source,
              uploaded_music_file: payload.music_source === 'upload' ? {
                id: uploadedMusicFile?.fileId,
                file_name: uploadedMusicFile?.fileName,
                file_url: uploadedMusicFile?.previewUrl || uploadedMusicFile?.fileUrl
              } : null,
              photos: validPhotos.map((p, i) => ({
                display_order: i + 1,
                file_id: p.uploadedId,
                file_url: p.fileUrl || p.previewUrl
              }))
            }
          };
          localStorage.setItem('kartuUcapan_preview_' + slug, JSON.stringify(previewData));
        } catch(e) {}

        setSavedSlug(slug);
        setIsSaving(false);
        return `${FRONTEND_URL}/g/${slug}`;
      } else {
        console.warn("Failed saving greeting card to backend:", json);
      }
    } catch (e) {
      console.warn("Failed saving greeting card. Falling back to local URL.", e);
    }
    
    setIsSaving(false);
    const encoded = encodeCard({ ...cardData, music: '' });
    return `${FRONTEND_URL}/?card=${encoded}`;
  };

  const getShareLink = () => {
    if (savedSlug) {
      return `${FRONTEND_URL}/g/${savedSlug}`;
    }
    const encoded = encodeCard({ ...cardData, music: '' });
    return `${FRONTEND_URL}/?card=${encoded}`;
  };

  const copyShareLink = async () => {
    let link = '';
    if (savedSlug) {
      link = `${FRONTEND_URL}/g/${savedSlug}`;
    } else {
      showToast('Menyimpan ucapan ke server...');
      link = await generateBackendShareLink();
    }
    
    navigator.clipboard.writeText(link).then(() => {
      showToast('Tautan kartu ucapan berhasil disalin! 🔗');
    }).catch(() => {
      showToast('Gagal menyalin tautan.');
    });
  };

  const shareWhatsApp = async () => {
    let link = '';
    if (savedSlug) {
      link = `${FRONTEND_URL}/g/${savedSlug}`;
    } else {
      showToast('Menyimpan ucapan ke server...');
      link = await generateBackendShareLink();
    }
    
    const text = `Halo! Ada kartu ucapan digital spesial dari aku untuk kamu. Buka di sini ya: ${link}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openEnvelope = () => {
    if (envelopeOpening) return;
    setEnvelopeOpening(true);

    // BROWSER AUTOPLAY FIX: Musik harus dipanggil secara sinkron langsung saat layar diketuk,
    // tidak boleh di dalam setTimeout agar tidak diblokir oleh sistem keamanan HP (Safari/Chrome).
    if (readerMode && readerData && readerData.music && readerData.music !== 'none') {
      const isCustom = readerData.music === 'custom_upload';
      const audioUrl = isCustom 
        ? (uploadedMusicFile?.previewUrl || uploadedMusicFile?.fileUrl)
        : TRACK_LIST.find(t => t.id === readerData.music)?.url;

      if (audioUrl) {
        audioController.playTrack(
          { id: readerData.music, url: audioUrl, mood: 'chill' },
          setIsPlaying
        );
      }
    }

    setTimeout(() => {
      setEnvelopeOpened(true);
      setEnvelopeOpening(false);
    }, 1500);
  };

  const handleUploadMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      showToast('File harus berupa audio (MP3, WAV, dll).');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast('Ukuran file maksimal 20MB.');
      return;
    }

    setIsUploadingMusic(true);
    audioController.stop();
    setIsPlaying(false);

    try {
      const formData = new FormData();
      formData.append('music', file);
      const res = await fetch(`${BACKEND_URL}/api/v1/files/upload/music`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (json.success && json.data) {
        const fileRecord = json.data;
        const localBlobUrl = URL.createObjectURL(file);
        setUploadedMusicFile({
          fileId: fileRecord.id,
          fileName: file.name.replace(/\.[^/.]+$/, ''),
          fileUrl: fileRecord.file_url,
          previewUrl: localBlobUrl
        });
        setCurrentTrack('custom_upload');
        setCardData(prev => ({ ...prev, music: 'custom_upload' }));
        setSavedSlug(null);
        audioController.playTrack(
          { id: 'custom_upload', url: localBlobUrl, mood: 'chill' },
          setIsPlaying
        );
        showToast('Musik berhasil diunggah! 🎵');
      } else {
        showToast('Gagal mengunggah musik. Coba lagi.');
      }
    } catch (err) {
      showToast('Gagal mengunggah musik. Periksa koneksi internet.');
    } finally {
      setIsUploadingMusic(false);
      e.target.value = '';
    }
  };

  return {
    activeAccordionId, setActiveAccordionId,
    cardData, setCardData,
    toastMessage, showToast,
    tiltStyle, handleMouseMove, handleMouseLeave,
    dbThemes,
    isSaving,
    savedSlug, setSavedSlug,
    uploadedPhotos, setUploadedPhotos,
    previewPhotoIndex, setPreviewPhotoIndex,
    currentTrack, setCurrentTrack,
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
    handleRemovePhoto,
    uploadSinglePhoto
  };
};
