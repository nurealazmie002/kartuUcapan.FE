import type { CardData } from '../types';

export const DEFAULT_CARD: CardData = {
  recipient: 'Sarah Anderson',
  sender: 'Teman Baikmu',
  moment: 'Kelulusan',
  message: 'Selamat atas kelulusanmu! Semoga ilmu yang didapatkan berkah dan bermanfaat untuk masa depan yang cerah. Bangga padamu!',
  theme: 'Ceria',
  music: 'track1'
};

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://webucapan-be.onrender.com';
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
export const iconMap: Record<string, string> = {
  'Ulang Tahun': 'cake',
  'Kelulusan': 'school',
  'Pernikahan': 'favorite',
  'Terima Kasih': 'thumb_up',
  'Lainnya': 'celebration'
};

export const momentTitleMap: Record<string, string> = {
  'Ulang Tahun': 'Happy Birthday!',
  'Kelulusan': 'Happy Graduation!',
  'Pernikahan': 'Happy Wedding!',
  'Terima Kasih': 'Thank You!',
  'Lainnya': 'Special Gift!'
};

export const themeImages: Record<string, string> = {
  Ceria: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoKRSFl_IuOVuKYyF3Jlvkpyf4U-wNjzgYYR3IQ2dl6ytSamBQsrKWNNWDaz3Kw5zcidu6NCjaRvmZFquvBWExAVbJ1dkHM3ADfcrr9edeYGbPllNir7dr7i92zznhPN_4X7A9kXzNsPzPSZ7aFMOldMkGve8f7DpuTMb4wAQJmbRm264IKtx0Ztqh33rc6TP4Jd_84FDSqq8lmK-7xf64kbQYOXeIm9nN1O07a0cMtDB7I3_zBlnC0XZDXqTf_SHleDKcM5VteZw',
  Elegan: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUf4QhnzyIrDdfAmgA6KGmJF1IWabQxHaGjv3RbfMhnPZEQGZX5Pd8WX-fFobjMshVLir2kxMqyEtreYFGep7ubmuDOVVyuGMNSWLrhqTY26UJCAHp8LMYI81owhpPWCWms4-2dF9_kj7U2_Lc609FmcK5STPPMyPUqLZsSw-ZIMYO_qkF3sastT9MLZgTT7mymvcs91TIqPINUmlumclcYLfWr6Gw3Qh4h7y5IKlFy7OYui4Uyf5zlM11c9W-Q4r0WhdAxRBcmpA',
  Klasik: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6_Xfmes2WoC2fu6IWJlpU-bXGNyeJMiZxB6BY9C8h5JubMpJj-BF_lZYXjJlWvUn19YoG97IBmqqB3tH7TVRkj8U6T3mADZF7gHM2c45z7QGcDtCct_5zYRa4gd-dnEQNxTep_q1ngLZsxK4VDYnfrUKvMu_WwDSfZLtfyviIq27bzr85RgA07aWWJ5lfcVH6XGwYsnh6lTv7unQMaW9ThYoDwh0L1iEFUOFIsJCjuTjOl30tlbiVYSyPzGjx-9lCf3MYfplVFEg',
  Playful: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpjDbaMrRGOpKZ4Ak34ab9ibzs-94TqttgZ8CDQOtNLw4CoimbY7rkb4Hcg3AHhB7y0ebufZoSALYUc8T6_Ps0ewtek9kTmqrIdxO2VLVxuaelo-pABIUTITq9NV_G8sI8pdstSGspYLLxYYUTCuEgXFYiLun8ygCqZhz1SFLxO6KFXZaViNGZtvMWinLfto9RbqwhV5DwCChn_rzDGLe1BSu1mMiPvBESfqa64D1tr9p0bKPiOu60mIogctQCZNLbjsQYlBZtaA4',
  Minimalist: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0zkAGZH0dg0_xzq-V0fpjscwEigovxG4sZY_OX7EhlTkPpTUa3eAXS00h46LccCOsjcz3NRS_l-92gncL0qfsigdhLVXGf8UWtqgtKPJ4W7xRJmj4xf7B9pmJFBpshn-64wNMTVOrJ_HGGkJrNMl2dggpp5MUIj-G3JkF50S4V4eANYfRAQaCkCXD1TChD_YoR776C37nfLsgJTZWLI-xbqTv8WdG1xzXWxD443VpkD-hsQ3Hc001xtEe6Gy91UxQoK1Lf7vustQ',
  Serenity: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADO_c373zZyKbZ_A2l30jeBX__cTLigcWwtrA_eOdHDYxVfs6VA1_fQfg0z2x-BWD4Kzog0RUt4jXTDIO7H86r8k4cCooXI_uRRqP_rOTslALO4bTpyIMP771rtXd_gJtngz3zIqusxQjZv374LNapYrbTuWjIy1sHEvvbdRdoG_2SdW_K_jdgSAkLbVabBodpClGBKw5JNB9_klm66JuxEwQFdg0t7wLPhFxaF55HzbGJO5u_iCeiB7pq6jXYcyP6gxNAQ48CxOo'
};

export const themeConfigs: Record<string, {
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
    cardClass: 'bg-white/85 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl p-6 md:p-8',
    titleClass: 'text-primary font-headline-md font-bold',
    textClass: 'text-on-surface-variant italic leading-relaxed font-body-md',
    dividerClass: 'h-[2px] w-12 bg-primary/30 mx-auto',
    recipientClass: 'text-on-surface font-extrabold font-display-lg-mobile tracking-tight',
    fontFamily: 'font-body-md'
  },
  Elegan: {
    bgClass: 'theme-bg-elegan',
    cardClass: 'bg-slate-950/70 backdrop-blur-lg border border-[#ffd700]/30 shadow-2xl rounded-3xl p-6 md:p-8 text-[#ffd700]',
    titleClass: 'text-[#ffd700] font-serif text-2xl font-semibold uppercase tracking-widest',
    textClass: 'text-[#fff3d1] italic leading-relaxed font-serif text-base',
    dividerClass: 'h-[1px] w-16 bg-[#ffd700]/50 mx-auto',
    recipientClass: 'text-white font-serif text-3xl font-bold tracking-wide my-1',
    fontFamily: 'font-serif'
  },
  Klasik: {
    bgClass: 'theme-bg-klasik',
    cardClass: 'bg-[#faf0d9]/95 border-2 border-double border-[#8b5a2b]/30 shadow-lg rounded-2xl p-6 md:p-8 text-[#4a3b32] relative',
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
