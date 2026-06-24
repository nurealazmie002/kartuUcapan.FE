// Audio Helper for KirimUcapan
// Provides background music using MP3 audio streams and a Web Audio API Synthesizer fallback.

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  mood: 'birthday' | 'wedding' | 'chill' | 'playful' | 'classic';
  duration: string;
}

export const TRACK_LIST: Track[] = [
  {
    id: 'track1',
    title: 'Ceria / Birthday Waltz',
    artist: 'Instrumental Piano',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    mood: 'birthday',
    duration: '06:12'
  },
  {
    id: 'track2',
    title: 'Elegan / Classical Dream',
    artist: 'Cinematic Orchestral',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    mood: 'wedding',
    duration: '07:05'
  },
  {
    id: 'track3',
    title: 'Klasik / Vintage Memory',
    artist: 'Harpsichord & Flute',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    mood: 'classic',
    duration: '05:44'
  },
  {
    id: 'track4',
    title: 'Playful / Chiptune Joy',
    artist: 'Bouncy 8-bit Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    mood: 'playful',
    duration: '05:02'
  },
  {
    id: 'track5',
    title: 'Serenity / Nature Meditation',
    artist: 'Acoustic Guitar & Pad',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    mood: 'chill',
    duration: '06:03'
  }
];

class AudioController {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private synthInterval: any = null;
  private currentTrackId: string | null = null;
  private isPlaying: boolean = false;
  private useSynthFallback: boolean = false;

  public playTrack(track: { id: string; url: string; mood: string }, onPlayStateChange?: (isPlaying: boolean) => void) {
    this.stop();
    this.currentTrackId = track.id;

    if (track.id === 'synth') {
      this.playSynth('chill');
      this.isPlaying = true;
      if (onPlayStateChange) onPlayStateChange(true);
      return;
    }

    if (this.useSynthFallback) {
      this.playSynth(track.mood as any);
      this.isPlaying = true;
      if (onPlayStateChange) onPlayStateChange(true);
      return;
    }

    try {
      this.audio = new Audio(track.url);
      this.audio.loop = true;
      this.audio.volume = 0.5;
      
      // Optimistically set playing state to true while buffering
      this.isPlaying = true;
      if (onPlayStateChange) onPlayStateChange(true);

      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .catch(error => {
            console.warn("Autoplay blocked or URL failed. Falling back to Web Audio API Synth.", error);
            this.playSynth(track.mood as any);
            this.isPlaying = true;
            if (onPlayStateChange) onPlayStateChange(true);
          });
      }
    } catch (e) {
      console.warn("Audio element failed. Falling back to Web Audio API Synth.", e);
      this.playSynth(track.mood as any);
      this.isPlaying = true;
      if (onPlayStateChange) onPlayStateChange(true);
    }
  }

  public play(trackId: string, onPlayStateChange?: (isPlaying: boolean) => void) {
    if (trackId === 'synth') {
      return this.playTrack({ id: 'synth', url: '', mood: 'chill' }, onPlayStateChange);
    }
    const track = TRACK_LIST.find(t => t.id === trackId);
    if (!track) return;
    this.playTrack({ id: track.id, url: track.url, mood: track.mood }, onPlayStateChange);
  }

  public togglePlay(onPlayStateChange?: (isPlaying: boolean) => void) {
    if (this.isPlaying) {
      this.pause();
      if (onPlayStateChange) onPlayStateChange(false);
    } else if (this.currentTrackId) {
      this.play(this.currentTrackId, onPlayStateChange);
    }
  }

  public togglePlayCustom(track: { id: string; url: string; mood: string }, onPlayStateChange?: (isPlaying: boolean) => void) {
    if (this.isPlaying && this.currentTrackId === track.id) {
      this.pause();
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      this.playTrack(track, onPlayStateChange);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.audio) {
      this.audio.pause();
    }
    this.stopSynth();
  }

  public stop() {
    this.isPlaying = false;
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    this.stopSynth();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  public setUseSynthOnly(val: boolean) {
    this.useSynthFallback = val;
  }

  // Web Audio API Synthesizer Fallback
  private playSynth(mood: 'birthday' | 'wedding' | 'chill' | 'playful' | 'classic') {
    this.stopSynth();
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    try {
      this.audioCtx = new AudioContextClass();
    } catch (e) {
      console.error("Could not create AudioContext", e);
      return;
    }

    let chordIndex = 0;
    
    // Beautiful chord progressions for each mood
    const chordBook = {
      birthday: [
        [261.63, 329.63, 392.00, 523.25], // C4, E4, G4, C5 (C Major)
        [349.23, 440.00, 523.25, 698.46], // F4, A4, C5, F5 (F Major)
        [392.00, 493.88, 587.33, 783.99], // G4, B4, D5, G5 (G Major)
        [349.23, 440.00, 523.25, 698.46]  // F4, A4, C5, F5
      ],
      wedding: [
        [293.66, 369.99, 440.00, 587.33], // D4, F#4, A4, D5 (D Major)
        [329.63, 415.30, 493.88, 659.25], // E4, G#4, B4, E5 (E Major)
        [349.23, 440.00, 523.25, 698.46], // F4, A4, C5, F5 (F Major)
        [392.00, 493.88, 587.33, 783.99]  // G4, B4, D5, G5
      ],
      chill: [
        [220.00, 261.63, 329.63, 440.00], // A3, C4, E4, A4 (A Minor)
        [261.63, 329.63, 392.00, 523.25], // C4, E4, G4, C5 (C Major)
        [293.66, 349.23, 440.00, 587.33], // D4, F4, A4, D5 (D Minor)
        [196.00, 246.94, 293.66, 392.00]  // G3, B3, D4, G4 (G Major)
      ],
      playful: [
        [261.63, 329.63, 392.00, 523.25], // C4, E4, G4, C5
        [293.66, 349.23, 440.00, 587.33], // D4, F4, A4, D5
        [329.63, 392.00, 493.88, 659.25], // E4, G4, B4, E5
        [349.23, 440.00, 523.25, 698.46]  // F4, A4, C5, F5
      ],
      classic: [
        [220.00, 261.63, 329.63, 440.00], // Am
        [293.66, 349.23, 440.00, 587.33], // Dm
        [246.94, 293.66, 392.00, 493.88], // G
        [261.63, 329.63, 392.00, 523.25]  // C
      ]
    };

    const chords = chordBook[mood] || chordBook.chill;

    const playChord = () => {
      if (!this.audioCtx) return;
      
      // Resume context if suspended (browser security policy)
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const activeChord = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      // Soft ambient synth sound using sine & triangle oscillators with a slow attack filter
      activeChord.forEach((freq, i) => {
        if (!this.audioCtx) return;
        
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        
        // Root notes are deep sines, higher notes are warm triangles
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12); // Slightly arpeggiated entry
        
        gainNode.gain.setValueAtTime(0, now);
        
        // Gentle slow fade-in (attack)
        gainNode.gain.linearRampToValueAtTime(0.03, now + 0.8);
        
        // Gentle decay & sustain
        gainNode.gain.setValueAtTime(0.03, now + 2.5);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        
        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 4.8);
      });
    };

    playChord();
    this.synthInterval = setInterval(playChord, 4000);
  }

  private stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {
        // Audio context already closed
      }
      this.audioCtx = null;
    }
  }
}

export const audioController = new AudioController();
