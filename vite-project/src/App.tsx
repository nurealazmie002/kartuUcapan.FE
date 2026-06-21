import React, { useState, useEffect } from 'react';
import { audioController, TRACK_LIST } from './audioHelper';

interface CardData {
  recipient: string;
  moment: string;
  message: string;
  theme: string;
  music: string;
}

const DEFAULT_CARD: CardData = {
  recipient: 'Sarah Anderson',
  moment: 'Kelulusan',
  message: 'Selamat atas kelulusanmu! Semoga ilmu yang didapatkan berkah dan bermanfaat untuk masa depan yang cerah. Bangga padamu!',
  theme: 'Ceria',
  music: 'track1'
};

const iconMap: Record<string, string> = {
  'Ulang Tahun': 'cake',
  'Kelulusan': 'school',
  'Pernikahan': 'favorite',
  'Terima Kasih': 'thumb_up',
  'Lainnya': 'celebration'
};

const momentTitleMap: Record<string, string> = {
  'Ulang Tahun': 'Happy Birthday!',
  'Kelulusan': 'Happy Graduation!',
  'Pernikahan': 'Happy Wedding!',
  'Terima Kasih': 'Thank You!',
  'Lainnya': 'Special Gift!'
};

const themeImages = {
  Ceria: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoKRSFl_IuOVuKYyF3Jlvkpyf4U-wNjzgYYR3IQ2dl6ytSamBQsrKWNNWDaz3Kw5zcidu6NCjaRvmZFquvBWExAVbJ1dkHM3ADfcrr9edeYGbPllNir7dr7i92zznhPN_4X7A9kXzNsPzPSZ7aFMOldMkGve8f7DpuTMb4wAQJmbRm264IKtx0Ztqh33rc6TP4Jd_84FDSqq8lmK-7xf64kbQYOXeIm9nN1O07a0cMtDB7I3_zBlnC0XZDXqTf_SHleDKcM5VteZw',
  Elegan: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUf4QhnzyIrDdfAmgA6KGmJF1IWabQxHaGjv3RbfMhnPZEQGZX5Pd8WX-fFobjMshVLir2kxMqyEtreYFGep7ubmuDOVVyuGMNSWLrhqTY26UJCAHp8LMYI81owhpPWCWms4-2dF9_kj7U2_Lc609FmcK5STPPMyPUqLZsSw-ZIMYO_qkF3sastT9MLZgTT7mymvcs91TIqPINUmlumclcYLfWr6Gw3Qh4h7y5IKlFy7OYui4Uyf5zlM11c9W-Q4r0WhdAxRBcmpA',
  Klasik: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6_Xfmes2WoC2fu6IWJlpU-bXGNyeJMiZxB6BY9C8h5JubMpJj-BF_lZYXjJlWvUn19YoG97IBmqqB3tH7TVRkj8U6T3mADZF7gHM2c45z7QGcDtCct_5zYRa4gd-dnEQNxTep_q1ngLZsxK4VDYnfrUKvMu_WwDSfZLtfyviIq27bzr85RgA07aWWJ5lfcVH6XGwYsnh6lTv7unQMaW9ThYoDwh0L1iEFUOFIsJCjuTjOl30tlbiVYSyPzGjx-9lCf3MYfplVFEg',
  Playful: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpjDbaMrRGOpKZ4Ak34ab9ibzs-94TqttgZ8CDQOtNLw4CoimbY7rkb4Hcg3AHhB7y0ebufZoSALYUc8T6_Ps0ewtek9kTmqrIdxO2VLVxuaelo-pABIUTITq9NV_G8sI8pdstSGspYLLxYYUTCuEgXFYiLun8ygCqZhz1SFLxO6KFXZaViNGZtvMWinLfto9RbqwhV5DwCChn_rzDGLe1BSu1mMiPvBESfqa64D1tr9p0bKPiOu60mIogctQCZNLbjsQYlBZtaA4',
  Minimalist: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0zkAGZH0dg0_xzq-V0fpjscwEigovxG4sZY_OX7EhlTkPpTUa3eAXS00h46LccCOsjcz3NRS_l-92gncL0qfsigdhLVXGf8UWtqgtKPJ4W7xRJmj4xf7B9pmJFBpshn-64wNMTVOrJ_HGGkJrNMl2dggpp5MUIj-G3JkF50S4V4eANYfRAQaCkCXD1TChD_YoR776C37nfLsgJTZWLI-xbqTv8WdG1xzXWxD443VpkD-hsQ3Hc001xtEe6Gy91UxQoK1Lf7vustQ',
  Serenity: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADO_c373zZyKbZ_A2l30jeBX__cTLigcWwtrA_eOdHDYxVfs6VA1_fQfg0z2x-BWD4Kzog0RUt4jXTDIO7H86r8k4cCooXI_uRRqP_rOTslALO4bTpyIMP771rtXd_gJtngz3zIqusxQjZv374LNapYrbTuWjIy1sHEvvbdRdoG_2SdW_K_jdgSAkLbVabBodpClGBKw5JNB9_klm66JuxEwQFdg0t7wLPhFxaF55HzbGJO5u_iCeiB7pq6jXYcyP6gxNAQ48CxOo'
};

const themeConfigs: Record<string, {
  bgClass: string;
  cardClass: string;
  titleClass: string;
  textClass: string;
  dividerClass: string;
  recipientClass: string;
  fontFamily: string;
}> = {
  Ceria: {
    bgClass: 'theme-bg-ceria',
    cardClass: 'bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-6 md:p-8',
    titleClass: 'text-primary font-headline-md font-bold',
    textClass: 'text-on-surface-variant italic leading-relaxed font-body-md',
    dividerClass: 'h-[2px] w-12 bg-primary/30 mx-auto',
    recipientClass: 'text-on-surface font-extrabold font-display-lg-mobile tracking-tight',
    fontFamily: 'font-body-md'
  },
  Elegan: {
    bgClass: 'theme-bg-elegan',
    cardClass: 'bg-slate-900/60 backdrop-blur-lg border border-[#ffd700]/30 shadow-2xl rounded-3xl p-6 md:p-8 text-[#ffd700]',
    titleClass: 'text-[#ffd700] font-serif text-2xl font-semibold uppercase tracking-widest',
    textClass: 'text-[#fff3d1] italic leading-relaxed font-serif text-base',
    dividerClass: 'h-[1px] w-16 bg-[#ffd700]/50 mx-auto',
    recipientClass: 'text-white font-serif text-3xl font-bold tracking-wide my-1',
    fontFamily: 'font-serif'
  },
  Klasik: {
    bgClass: 'theme-bg-klasik',
    cardClass: 'bg-[#faf0d9]/95 border-2 border-double border-[#8b5a2b]/30 shadow-lg rounded-2xl p-6 md:p-8 text-[#4a3b32] relative overflow-hidden',
    titleClass: 'text-[#8b5a2b] font-serif text-2xl font-bold italic',
    textClass: 'text-[#5c4a3c] leading-relaxed font-serif text-base',
    dividerClass: 'h-[2px] w-20 bg-[#8b5a2b]/20 mx-auto my-1',
    recipientClass: 'text-[#4a3b32] font-serif text-3xl font-extrabold tracking-tight',
    fontFamily: 'font-serif'
  },
  Playful: {
    bgClass: 'theme-bg-playful',
    cardClass: 'bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] rounded-2xl p-6 md:p-8 text-black',
    titleClass: 'text-primary font-bold text-2xl tracking-tighter uppercase',
    textClass: 'text-stone-800 font-semibold leading-relaxed text-base',
    dividerClass: 'h-1 w-14 bg-black mx-auto',
    recipientClass: 'text-black font-black text-3xl tracking-tight uppercase my-1',
    fontFamily: 'font-display-lg-mobile'
  },
  Minimalist: {
    bgClass: 'theme-bg-minimalist',
    cardClass: 'bg-white border border-stone-200 rounded-none shadow-sm p-8 text-stone-900',
    titleClass: 'text-stone-500 font-light uppercase tracking-widest text-sm',
    textClass: 'text-stone-700 leading-relaxed font-light text-base',
    dividerClass: 'h-[1px] w-8 bg-stone-300 mx-auto',
    recipientClass: 'text-stone-950 font-bold text-2xl tracking-tight my-2',
    fontFamily: 'font-caption'
  },
  Serenity: {
    bgClass: 'theme-bg-serenity',
    cardClass: 'bg-white/50 backdrop-blur-xl border border-teal-100 shadow-xl rounded-[2rem] p-6 md:p-8 text-teal-900',
    titleClass: 'text-teal-700 font-semibold tracking-wider',
    textClass: 'text-teal-800/80 leading-relaxed font-normal text-base',
    dividerClass: 'h-[2px] w-12 bg-teal-400/40 mx-auto',
    recipientClass: 'text-teal-950 font-bold text-3xl tracking-tight',
    fontFamily: 'font-headline-md'
  }
};

// Base64 helper for query params
function encodeCard(data: CardData): string {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return window.btoa(binary);
  } catch (e) {
    return '';
  }
}

function decodeCard(base64Str: string): CardData | null {
  try {
    const binary = window.atob(base64Str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

export default function App() {
  const [step, setStep] = useState(1);
  const [cardData, setCardData] = useState<CardData>(DEFAULT_CARD);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>('track1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [useSynthOnly, setUseSynthOnly] = useState(false);

  // Reader state
  const [readerMode, setReaderMode] = useState(false);
  const [readerData, setReaderData] = useState<CardData | null>(null);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  // Check URL params for card reader mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get('card');
    if (cardParam) {
      const decoded = decodeCard(cardParam);
      if (decoded) {
        setReaderData(decoded);
        setReaderMode(true);
        // Sync track setting
        setCurrentTrack(decoded.music || 'track1');
      }
    }
  }, []);

  // Update audio helper fallback setting
  useEffect(() => {
    audioController.setUseSynthOnly(useSynthOnly);
  }, [useSynthOnly]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
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

  const handlePlayMusic = (trackId: string) => {
    if (isPlaying && currentTrack === trackId) {
      audioController.pause();
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackId);
      audioController.play(trackId, (playing) => {
        setIsPlaying(playing);
      });
    }
  };

  const togglePlayback = () => {
    audioController.togglePlay((playing) => {
      setIsPlaying(playing);
    });
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSelectMoment = (moment: string) => {
    let message = cardData.message;
    if (moment === 'Ulang Tahun') {
      message = 'Selamat hari lahir! Semoga panjang umur, sehat selalu, dilancarkan rezekinya, dan semua impianmu segera terwujud. Selamat merayakan hari spesialmu!';
    } else if (moment === 'Kelulusan') {
      message = 'Selamat atas kelulusanmu! Semoga ilmu yang didapatkan berkah dan bermanfaat untuk masa depan yang cerah. Bangga padamu!';
    } else if (moment === 'Pernikahan') {
      message = 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Senantiasa dipenuhi cinta dan kebahagiaan.';
    } else if (moment === 'Terima Kasih') {
      message = 'Terima kasih banyak atas segala dukungan, bantuan, dan waktu yang telah kamu berikan. Keberadaanmu sangat berarti bagiku.';
    } else if (moment === 'Lainnya') {
      message = 'Selamat ya atas pencapaian barumu! Teruslah berkarya, berkembang, dan menyebarkan kebaikan serta kebahagiaan ke sekelilingmu.';
    }

    setCardData({
      ...cardData,
      moment,
      message
    });
  };

  const getShareLink = () => {
    const encoded = encodeCard({
      ...cardData,
      music: currentTrack
    });
    return `${window.location.origin}${window.location.pathname}?card=${encoded}`;
  };

  const copyShareLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link).then(() => {
      showToast('Tautan berhasil disalin ke papan klip! 🔗');
    }).catch(() => {
      showToast('Gagal menyalin tautan.');
    });
  };

  const shareWhatsApp = () => {
    const text = `Halo! Ada kartu ucapan digital spesial dari aku untuk kamu. Buka di sini ya: ${getShareLink()}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openEnvelope = () => {
    setEnvelopeOpened(true);
    // Play selected background music upon envelope open (ensures browser interaction matches context)
    const track = readerData?.music || 'track1';
    audioController.play(track, (playing) => {
      setIsPlaying(playing);
    });
  };

  const renderParticles = (theme: string) => {
    if (theme === 'Ceria') {
      const colors = ['bg-pink-400', 'bg-yellow-400', 'bg-blue-400', 'bg-purple-400', 'bg-orange-400', 'bg-teal-400'];
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 25 }).map((_, i) => {
            const color = colors[i % colors.length];
            const size = Math.random() * 10 + 6;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 4;
            return (
              <div
                key={i}
                className={`absolute rounded-full animate-confetti-particle ${color}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  top: '-10px'
                }}
              />
            );
          })}
        </div>
      );
    }

    if (theme === 'Elegan') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 20 }).map((_, i) => {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const size = Math.random() * 4 + 2;
            const delay = Math.random() * 4;
            return (
              <span
                key={i}
                className="material-symbols-outlined absolute text-[#ffd700]/70 animate-sparkle-glow fill-icon"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  fontSize: `${size * 4}px`,
                  animationDelay: `${delay}s`
                }}
              >
                star
              </span>
            );
          })}
        </div>
      );
    }

    if (theme === 'Klasik') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Elegant Vintage Floral Corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#8b5a2b]/30 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#8b5a2b]/30 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#8b5a2b]/30 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#8b5a2b]/30 rounded-br-lg"></div>
          {/* Slow Drifting Dust specs */}
          {Array.from({ length: 15 }).map((_, i) => {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 6;
            return (
              <div
                key={i}
                className="absolute bg-[#8b5a2b]/20 rounded-full animate-pulse"
                style={{
                  width: '4px',
                  height: '4px',
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDuration: `${Math.random() * 4 + 4}s`,
                  animationDelay: `${delay}s`
                }}
              />
            );
          })}
        </div>
      );
    }

    if (theme === 'Playful') {
      const symbols = ['celebration', 'favorite', 'school', 'star', 'music_note'];
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 8 }).map((_, i) => {
            const sym = symbols[i % symbols.length];
            const left = Math.random() * 90 + 5;
            const top = Math.random() * 90 + 5;
            const color = i % 2 === 0 ? 'text-[#ff4d8d]/30' : 'text-[#fdc003]/30';
            const size = Math.random() * 16 + 24;
            const delay = Math.random() * 3;
            return (
              <span
                key={i}
                className={`material-symbols-outlined absolute ${color} animate-float-doodle`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  fontSize: `${size}px`,
                  animationDelay: `${delay}s`
                }}
              >
                {sym}
              </span>
            );
          })}
        </div>
      );
    }

    if (theme === 'Serenity') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-44 h-44 bg-[#e0f2f1]/40 rounded-full blur-3xl animate-watercolor-blob" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-52 h-52 bg-[#e1f5fe]/40 rounded-full blur-3xl animate-watercolor-blob" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 right-10 w-36 h-36 bg-[#f3e5f5]/40 rounded-full blur-3xl animate-watercolor-blob" style={{ animationDelay: '6s' }}></div>
        </div>
      );
    }

    return null;
  };

  // ----------------------------------------------------
  // WRITER / CREATOR RENDERING
  // ----------------------------------------------------
  if (!readerMode) {
    return (
      <div className="min-h-screen bg-surface flex flex-col font-body-md">
        {/* Navigation Header */}
        <header className="fixed top-0 w-full z-50 flex items-center justify-between px-margin-mobile md:px-lg h-14 bg-surface/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { if (step > 1) handlePrevStep(); }}
              className={`material-symbols-outlined text-primary active:scale-95 transition-transform ${step === 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              arrow_back
            </button>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-extrabold tracking-tight">KirimUcapan</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8">
              <button onClick={() => setStep(1)} className={`font-bold transition-opacity hover:opacity-80 ${step === 1 ? 'text-primary' : 'text-on-surface-variant font-medium'}`}>Pesan</button>
              <button onClick={() => setStep(2)} className={`font-bold transition-opacity hover:opacity-80 ${step === 2 ? 'text-primary' : 'text-on-surface-variant font-medium'}`}>Tema</button>
              <button onClick={() => setStep(3)} className={`font-bold transition-opacity hover:opacity-80 ${step === 3 ? 'text-primary' : 'text-on-surface-variant font-medium'}`}>Musik</button>
              <button onClick={() => setStep(4)} className={`font-bold transition-opacity hover:opacity-80 ${step === 4 ? 'text-primary' : 'text-on-surface-variant font-medium'}`}>Kirim</button>
            </nav>
            <button className="material-symbols-outlined text-primary active:scale-95 transition-transform">more_vert</button>
          </div>
        </header>

        {/* Stepper and Main Area */}
        <main className="flex-1 pt-24 pb-32 px-margin-mobile md:px-lg max-w-max-width w-full mx-auto">
          {/* Progress Stepper */}
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -z-10 -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 left-0 h-[2px] bg-primary-container -z-10 -translate-y-1/2 transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>
              
              {/* Stepper Step 1 */}
              <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(1)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= 1 ? 'bg-primary-container text-on-primary shadow-md' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <span className={`material-symbols-outlined text-[20px] ${step >= 1 ? 'fill-icon' : ''}`}>edit_note</span>
                </div>
                <span className={`font-label-md text-label-md transition-colors ${step >= 1 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Pesan</span>
              </div>
              
              {/* Stepper Step 2 */}
              <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(2)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= 2 ? 'bg-primary-container text-on-primary shadow-md' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <span className={`material-symbols-outlined text-[20px] ${step >= 2 ? 'fill-icon' : ''}`}>palette</span>
                </div>
                <span className={`font-label-md text-label-md transition-colors ${step >= 2 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Tema</span>
              </div>

              {/* Stepper Step 3 */}
              <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(3)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= 3 ? 'bg-primary-container text-on-primary shadow-md' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <span className={`material-symbols-outlined text-[20px] ${step >= 3 ? 'fill-icon' : ''}`}>music_note</span>
                </div>
                <span className={`font-label-md text-label-md transition-colors ${step >= 3 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Musik</span>
              </div>
              
              {/* Stepper Step 4 */}
              <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(4)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= 4 ? 'bg-primary-container text-on-primary shadow-md' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  <span className={`material-symbols-outlined text-[20px] ${step >= 4 ? 'fill-icon' : ''}`}>send</span>
                </div>
                <span className={`font-label-md text-label-md transition-colors ${step >= 4 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Kirim</span>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 text-center flex items-center gap-2 animate-bounce-slow">
              <span className="material-symbols-outlined text-green-400">check_circle</span>
              <span className="font-semibold text-sm">{toastMessage}</span>
            </div>
          )}

          {/* Grid Layout (Left Form, Right Preview) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Forms based on step */}
            <section className="lg:col-span-7 flex flex-col gap-8">
              
              {/* STEP 1: ISIPESAN */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Buat Pesan Bahagiamu</h2>
                    <p className="text-on-surface-variant">Personalisasi ucapanmu agar terasa lebih istimewa bagi mereka.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="recipient">Nama Penerima</label>
                    <input 
                      type="text" 
                      id="recipient" 
                      value={cardData.recipient}
                      onChange={(e) => setCardData({ ...cardData, recipient: e.target.value })}
                      placeholder="Contoh: Sarah Anderson"
                      className="w-full px-6 py-4 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl focus:border-primary-container focus:ring-0 transition-colors text-body-lg font-body-lg"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Pilih Momen</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {['Ulang Tahun', 'Kelulusan', 'Pernikahan', 'Terima Kasih', 'Lainnya'].map((mom) => {
                        const isActive = cardData.moment === mom;
                        return (
                          <button
                            key={mom}
                            type="button"
                            onClick={() => handleSelectMoment(mom)}
                            className={`moment-chip group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-95 ${
                              isActive 
                                ? 'border-primary-container bg-primary-container text-white shadow-lg' 
                                : 'border-surface-container-highest bg-surface-container-lowest hover:border-primary-container/30 text-on-surface'
                            }`}
                          >
                            <span className={`material-symbols-outlined text-3xl transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-primary'}`}>
                              {iconMap[mom] || 'celebration'}
                            </span>
                            <span className="font-label-md text-label-md">{mom}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="message">Isi Pesan</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      value={cardData.message}
                      onChange={(e) => setCardData({ ...cardData, message: e.target.value })}
                      placeholder="Tuliskan harapan dan doa tulusmu di sini..."
                      className="w-full px-6 py-4 bg-surface-container-lowest border-2 border-surface-container-highest rounded-xl focus:border-primary-container focus:ring-0 transition-colors text-body-md font-body-md resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: PILIH TEMA */}
              {step === 2 && (
                <div className="flex flex-col gap-6 animate-envelope">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Pilih Tema Kartu Ucapan</h2>
                    <p className="text-on-surface-variant">Sesuaikan nuansa pesanmu dengan koleksi tema eksklusif kami.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(themeConfigs).map((themeName) => {
                      const isActive = cardData.theme === themeName;
                      const dataAltText = `A visual template for ${themeName} theme.`;
                      
                      return (
                        <div
                          key={themeName}
                          onClick={() => setCardData({ ...cardData, theme: themeName })}
                          className={`group relative bg-surface-container-lowest border-2 rounded-[1.5rem] p-4 transition-all duration-300 cursor-pointer overflow-hidden ${
                            isActive 
                              ? 'theme-card-selected border-primary' 
                              : 'border-transparent hover:border-outline-variant hover:shadow-xl'
                          }`}
                        >
                          <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 relative bg-stone-100">
                            <img 
                              src={themeImages[themeName as keyof typeof themeImages]} 
                              alt={dataAltText}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            {isActive && (
                              <div className="absolute top-3 right-3 bg-primary text-on-primary rounded-full p-1 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{themeName}</h3>
                          <p className="text-caption text-on-surface-variant">
                            {themeName === 'Ceria' && 'Penuh warna dan energi untuk momen perayaan.'}
                            {themeName === 'Elegan' && 'Desain mewah dengan sentuhan minimalis dan mewah.'}
                            {themeName === 'Klasik' && 'Nuansa tradisional yang hangat untuk keluarga dekat.'}
                            {themeName === 'Playful' && 'Unik dan ekspresif dengan ilustrasi doodles kreatif.'}
                            {themeName === 'Minimalist' && 'Sederhana dan bersih. Fokus sepenuhnya pada teks ucapan.'}
                            {themeName === 'Serenity' && 'Nuansa tenang yang menenangkan dengan watercolor sage.'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: PILIH MUSIK */}
              {step === 3 && (
                <div className="flex flex-col gap-6 animate-envelope">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Pilih Musik Latar</h2>
                    <p className="text-on-surface-variant">Tambahkan melodi indah yang akan mengiringi kartu ucapanmu.</p>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-highest flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">Synthesizer Fallback Only</h4>
                      <p className="text-caption text-on-surface-variant">Gunakan Web Audio API murni untuk synth lokal yang mulus dan bebas loading.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={useSynthOnly} 
                        onChange={(e) => setUseSynthOnly(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Add Custom Synthesizer Fallback Row */}
                    <div 
                      onClick={() => handlePlayMusic('synth')}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        currentTrack === 'synth' 
                          ? 'border-primary bg-primary-container/10' 
                          : 'border-surface-container-highest bg-surface-container-lowest hover:border-primary-container/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                          <span className="material-symbols-outlined">
                            {currentTrack === 'synth' && isPlaying ? 'pause' : 'music_note'}
                          </span>
                        </button>
                        <div>
                          <h4 className="font-bold text-on-surface">Offline Web Audio Synth</h4>
                          <p className="text-caption text-on-surface-variant">Generative Ambient Pad</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentTrack === 'synth' && isPlaying && (
                          <div className="flex items-end gap-[2px] h-6">
                            <span className="equalizer-bar" style={{ animationDelay: '0.1s' }}></span>
                            <span className="equalizer-bar" style={{ animationDelay: '0.3s' }}></span>
                            <span className="equalizer-bar" style={{ animationDelay: '0.5s' }}></span>
                          </div>
                        )}
                        <span className="text-caption text-on-surface-variant font-bold uppercase bg-primary-container/20 text-primary px-2 py-1 rounded-md">Synth</span>
                      </div>
                    </div>

                    {/* Standard Tracks */}
                    {TRACK_LIST.map((track) => {
                      const isSelected = currentTrack === track.id;
                      const isTrackPlaying = isSelected && isPlaying;
                      return (
                        <div 
                          key={track.id}
                          onClick={() => handlePlayMusic(track.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-primary bg-primary-container/10' 
                              : 'border-surface-container-highest bg-surface-container-lowest hover:border-primary-container/20'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md transition-transform active:scale-90">
                              <span className="material-symbols-outlined">
                                {isTrackPlaying ? 'pause' : 'play_arrow'}
                              </span>
                            </button>
                            <div>
                              <h4 className="font-bold text-on-surface">{track.title}</h4>
                              <p className="text-caption text-on-surface-variant">{track.artist}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {isTrackPlaying && (
                              <div className="flex items-end gap-[2px] h-6">
                                <span className="equalizer-bar" style={{ animationDelay: '0.1s' }}></span>
                                <span className="equalizer-bar" style={{ animationDelay: '0.3s' }}></span>
                                <span className="equalizer-bar" style={{ animationDelay: '0.5s' }}></span>
                              </div>
                            )}
                            <span className="text-caption text-on-surface-variant">{track.duration}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: KIKIRIM & SHARE */}
              {step === 4 && (
                <div className="flex flex-col gap-6 animate-envelope">
                  <div className="flex flex-col gap-2">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Kirim Kartu Ucapanmu</h2>
                    <p className="text-on-surface-variant">Bagikan momen bahagiamu ke teman dan kerabat melalui media sosial.</p>
                  </div>

                  <div className="bg-surface-container-low border border-surface-container-highest p-6 rounded-2xl flex flex-col gap-4">
                    <h3 className="font-bold text-on-surface">Salin & Bagikan Tautan</h3>
                    <p className="text-caption text-on-surface-variant leading-relaxed">
                      Siapapun yang membuka tautan ini akan melihat envelope animasi 3D dan kartu ucapan kustommu disertai lagu latar yang kamu pilih!
                    </p>
                    <div className="flex gap-2 bg-white p-2 rounded-xl border border-surface-container-highest">
                      <input 
                        type="text" 
                        readOnly 
                        value={getShareLink()} 
                        className="flex-1 bg-transparent border-none text-caption outline-none select-all text-on-surface-variant px-2 overflow-ellipsis"
                      />
                      <button 
                        onClick={copyShareLink}
                        className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold shadow-md active:scale-95 transition-all hover:opacity-90 flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Salin
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={shareWhatsApp}
                      className="h-14 bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined">send</span>
                      Kirim via WhatsApp
                    </button>
                    <button 
                      onClick={() => {
                        const encoded = encodeCard({
                          ...cardData,
                          music: currentTrack
                        });
                        window.open(`/?card=${encoded}`, '_blank');
                      }}
                      className="h-14 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined">open_in_new</span>
                      Buka Tab Baru (Preview)
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation button rows (Desktop and Tablet) */}
              <div className="pt-8 border-t border-surface-container-highest flex justify-between items-center">
                <button 
                  type="button"
                  onClick={() => { if (step > 1) handlePrevStep(); }}
                  className={`px-8 py-3 rounded-full border border-primary text-primary font-bold active:scale-95 transition-all flex items-center gap-2 hover:bg-primary-fixed/30 ${step === 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Kembali
                </button>

                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <p className="text-caption font-caption text-on-surface-variant uppercase tracking-widest">
                      {step === 1 && 'Langkah 1 dari 4'}
                      {step === 2 && 'Langkah 2 dari 4'}
                      {step === 3 && 'Langkah 3 dari 4'}
                      {step === 4 && 'Selesai'}
                    </p>
                    <p className="text-body-md font-bold text-primary">
                      {step === 1 && 'Nama & Pesan'}
                      {step === 2 && `Tema: ${cardData.theme}`}
                      {step === 3 && 'Musik & Visual'}
                      {step === 4 && 'Bagikan Kartu'}
                    </p>
                  </div>

                  {step < 4 ? (
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
                      onClick={copyShareLink}
                      className="px-12 py-3 rounded-full bg-primary text-on-primary font-bold shadow-lg active:scale-95 transition-all hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <span>Salin Link</span>
                      <span className="material-symbols-outlined">link</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Right Column: Live card preview */}
            <aside className="lg:col-span-5 sticky top-24">
              <div className="flex flex-col gap-6">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-center">Live Preview</h3>
                
                {/* 3D Tilt Card Container */}
                <div 
                  className="card-preview-container w-full aspect-[3/4] relative cursor-pointer"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={tiltStyle}
                >
                  
                  {/* Theme Background Layer */}
                  <div className={`absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl z-0 border-4 border-white transition-all duration-700 ${themeConfigs[cardData.theme]?.bgClass || 'theme-bg-ceria'}`}>
                    {renderParticles(cardData.theme)}
                  </div>

                  {/* Card Content Overlay */}
                  <div className="absolute inset-0 z-10 flex flex-col p-6 md:p-8 text-center items-center justify-center gap-6">
                    <div className={`${themeConfigs[cardData.theme]?.cardClass || 'glass-panel'} w-full flex flex-col gap-4 shadow-xl transition-all duration-700`}>
                      
                      {/* Event/Moment Icon Badge */}
                      <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-primary/10">
                        <span className="material-symbols-outlined text-4xl text-primary" id="previewIcon">
                          {iconMap[cardData.moment] || 'celebration'}
                        </span>
                      </div>

                      {/* Heading */}
                      <div className="flex flex-col gap-1">
                        <h4 className={`${themeConfigs[cardData.theme]?.titleClass || 'text-primary font-headline-md font-semibold'}`}>
                          {momentTitleMap[cardData.moment] || 'Special Greeting!'}
                        </h4>
                        <div className={themeConfigs[cardData.theme]?.dividerClass || 'h-[2px] w-12 bg-primary/30 mx-auto'} />
                        <h5 className={`${themeConfigs[cardData.theme]?.recipientClass || 'font-headline-lg-mobile text-on-surface font-extrabold'}`}>
                          {cardData.recipient || 'Nama Penerima'}
                        </h5>
                      </div>

                      {/* Paragraph text */}
                      <p className={themeConfigs[cardData.theme]?.textClass || 'text-body-md text-on-surface-variant italic leading-relaxed'}>
                        "{cardData.message || 'Tuliskan harapan dan doa tulusmu di sini...'}"
                      </p>
                    </div>
                  </div>

                  {/* Audio visualization overlay if playing */}
                  {isPlaying && (
                    <div className="absolute bottom-6 right-6 z-20 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 flex items-center gap-2 text-white">
                      <span className="material-symbols-outlined text-sm animate-spin">music_note</span>
                      <div className="flex items-end gap-[1px] h-3">
                        <span className="equalizer-bar" style={{ animationDelay: '0.1s', width: '2px', backgroundColor: '#fff' }}></span>
                        <span className="equalizer-bar" style={{ animationDelay: '0.4s', width: '2px', backgroundColor: '#fff' }}></span>
                        <span className="equalizer-bar" style={{ animationDelay: '0.2s', width: '2px', backgroundColor: '#fff' }}></span>
                      </div>
                    </div>
                  )}

                  {/* Decorative Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-container rounded-full blur-2xl opacity-40 animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Footnote card */}
                <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4 border border-surface-container-highest shadow-sm">
                  <div className="p-2 bg-primary-container/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary">info</span>
                  </div>
                  <p className="text-caption text-on-surface-variant leading-tight">
                    {step === 1 && 'Pratinjau menunjukkan tata letak dasar. Kamu bisa menyesuaikan warna tema di langkah berikutnya.'}
                    {step === 2 && 'Pilih salah satu tema visual. Desain pratinjau akan langsung berganti sesuai tema terpilih.'}
                    {step === 3 && 'Pilih track lagu latar. Kamu bisa mendengarkan preview instan dengan menekan tombol play.'}
                    {step === 4 && 'Selesai! Salin tautan dan bagikan. Penerima akan disajikan envelope pembuka interaktif.'}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Bottom Navigation (Mobile Only Step indicators / trigger back/next) */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-3 pb-6 bg-white/90 backdrop-blur-xl shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl">
          <div 
            onClick={() => setStep(1)}
            className={`flex flex-col items-center justify-center rounded-2xl px-4 py-1 active:scale-90 transition-all cursor-pointer ${step === 1 ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">edit_note</span>
            <span className="font-label-md text-[10px]">Pesan</span>
          </div>
          <div 
            onClick={() => setStep(2)}
            className={`flex flex-col items-center justify-center rounded-2xl px-4 py-1 active:scale-90 transition-all cursor-pointer ${step === 2 ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">palette</span>
            <span className="font-label-md text-[10px]">Tema</span>
          </div>
          <div 
            onClick={() => setStep(3)}
            className={`flex flex-col items-center justify-center rounded-2xl px-4 py-1 active:scale-90 transition-all cursor-pointer ${step === 3 ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">music_note</span>
            <span className="font-label-md text-[10px]">Musik</span>
          </div>
          <div 
            onClick={() => setStep(4)}
            className={`flex flex-col items-center justify-center rounded-2xl px-4 py-1 active:scale-90 transition-all cursor-pointer ${step === 4 ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant'}`}
          >
            <span className="material-symbols-outlined">send</span>
            <span className="font-label-md text-[10px]">Kirim</span>
          </div>
        </nav>
      </div>
    );
  }

  // ----------------------------------------------------
  // RECIPIENT CARD READER RENDERING
  // ----------------------------------------------------
  if (!readerData) return null;

  return (
    <div className={`min-h-screen relative flex items-center justify-center overflow-hidden font-body-md ${themeConfigs[readerData.theme]?.bgClass || 'theme-bg-ceria'}`}>
      
      {/* Floating Theme Particles on Reader Screen */}
      {envelopeOpened && renderParticles(readerData.theme)}

      {/* Floating Header Audio controls */}
      {envelopeOpened && (
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-white/20 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">celebration</span>
            <span className="font-bold text-primary tracking-tight">KirimUcapan</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlayback}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-full shadow-md text-xs font-bold active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">
                {isPlaying ? 'volume_up' : 'volume_off'}
              </span>
              <span>{isPlaying ? 'Mute' : 'Putar Musik'}</span>
            </button>
            <button 
              onClick={() => {
                audioController.stop();
                setIsPlaying(false);
                setReaderMode(false);
                // Clear URL parameters cleanly
                window.history.pushState({}, '', '/');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-md active:scale-95 transition-transform"
            >
              Buat Kartu Sendiri 💌
            </button>
          </div>
        </header>
      )}

      {/* ENVELOPE STAGE (Unopened) */}
      {!envelopeOpened ? (
        <div className="z-10 flex flex-col items-center gap-8 max-w-md w-full px-6 text-center animate-envelope">
          <div className="flex flex-col gap-2">
            <span className="material-symbols-outlined text-primary text-6xl fill-icon animate-bounce-slow">mail</span>
            <h2 className="text-3xl font-extrabold text-[#1a1c1e] tracking-tight">Ada Surat Spesial Untukmu!</h2>
            <p className="text-slate-600 text-sm">
              Seseorang mengirimkan kartu ucapan digital hangat untuk <strong>{readerData.recipient}</strong>. Silakan klik tombol di bawah untuk membukanya.
            </p>
          </div>

          {/* Interactive Envelope Wrapper */}
          <div 
            onClick={openEnvelope}
            className="w-full aspect-[1.6] bg-amber-50 rounded-2xl shadow-2xl border-2 border-primary/20 relative flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden"
          >
            {/* Background design flaps */}
            <div className="absolute top-0 w-0 h-0 border-l-[180px] border-l-transparent border-r-[180px] border-r-transparent border-t-[100px] border-t-amber-100/80 group-hover:-translate-y-2 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-amber-100/50 rounded-b-2xl border-t border-amber-200/40"></div>
            
            <div className="z-10 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg border border-primary/10 flex flex-col items-center gap-1 group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-primary text-3xl">drafts</span>
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest">Buka Ucapan</span>
            </div>
            
            {/* Stamp logo */}
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-lg">favorite</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500">
            *Mengaktifkan lagu latar otomatis setelah surat dibuka.
          </p>
        </div>
      ) : (
        
        // CARD PRESENTATION STAGE (Opened)
        <div className="z-10 max-w-lg w-full px-6 flex flex-col items-center gap-8 py-20 mt-10">
          
          {/* Card Component with interactive tilt */}
          <div 
            className="card-preview-container w-full aspect-[3/4] relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
          >
            {/* Background */}
            <div className={`absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl z-0 border-4 border-white ${themeConfigs[readerData.theme]?.bgClass || 'theme-bg-ceria'}`}>
            </div>

            {/* Inner Content */}
            <div className="absolute inset-0 z-10 flex flex-col p-6 md:p-10 text-center items-center justify-center gap-6">
              <div className={`${themeConfigs[readerData.theme]?.cardClass || 'glass-panel'} w-full flex flex-col gap-4 shadow-2xl`}>
                
                {/* Event/Moment Icon Badge */}
                <div className="w-16 h-16 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-primary/10">
                  <span className="material-symbols-outlined text-4xl text-primary">
                    {iconMap[readerData.moment] || 'celebration'}
                  </span>
                </div>

                {/* Heading */}
                <div className="flex flex-col gap-1">
                  <h4 className={`${themeConfigs[readerData.theme]?.titleClass || 'text-primary font-headline-md font-semibold'}`}>
                    {momentTitleMap[readerData.moment] || 'Special Greeting!'}
                  </h4>
                  <div className={themeConfigs[readerData.theme]?.dividerClass || 'h-[2px] w-12 bg-primary/30 mx-auto'} />
                  <h5 className={`${themeConfigs[readerData.theme]?.recipientClass || 'font-headline-lg-mobile text-on-surface font-extrabold'}`}>
                    {readerData.recipient}
                  </h5>
                </div>

                {/* Message Body */}
                <p className={themeConfigs[readerData.theme]?.textClass || 'text-body-md text-on-surface-variant italic leading-relaxed'}>
                  "{readerData.message}"
                </p>
              </div>
            </div>

            {/* Floating elements inside cards */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-container rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Music status / Player controls details */}
          <div className="bg-white/75 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 flex items-center gap-4 shadow-lg text-slate-800 text-xs w-full max-w-sm justify-between">
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-primary text-base ${isPlaying ? 'animate-spin' : ''}`}>
                music_note
              </span>
              <div>
                <p className="font-bold text-[11px] leading-none text-slate-800">
                  {readerData.music === 'synth' ? 'Offline Web Audio Synth' : TRACK_LIST.find(t => t.id === readerData.music)?.title || 'Hening'}
                </p>
                <p className="text-[10px] text-slate-500 leading-none">
                  {readerData.music === 'synth' ? 'Generative Ambient' : TRACK_LIST.find(t => t.id === readerData.music)?.artist || ''}
                </p>
              </div>
            </div>
            <button 
              onClick={togglePlayback}
              className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md text-sm transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined text-sm">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>

          {/* Floating actions */}
          <div className="flex flex-col gap-2 w-full text-center">
            <p className="text-xs text-slate-600 font-medium">Mau kirim kartu ucapan spesial juga ke orang terdekatmu?</p>
            <button 
              onClick={() => {
                audioController.stop();
                setIsPlaying(false);
                setReaderMode(false);
                window.history.pushState({}, '', '/');
              }}
              className="w-full h-12 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              Buat Kartu Ucapan Digital Gratis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
