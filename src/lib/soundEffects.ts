// Web Audio API Synthesizer - 100% Offline, zero external audio files needed

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  try {
    localStorage.setItem('picksy_sound_enabled', JSON.stringify(enabled));
  } catch {}
};

export const getSoundEnabled = (): boolean => {
  try {
    const saved = localStorage.getItem('picksy_sound_enabled');
    if (saved !== null) {
      soundEnabled = JSON.parse(saved);
    }
  } catch {}
  return soundEnabled;
};

// Initial check
getSoundEnabled();

/**
 * Play a cute bubble pop sound for general clicks
 */
export const playPop = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const now = ctx.currentTime;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.08);
};

/**
 * Play a bright cheerful bell ding when selecting an answer
 */
export const playDing = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(587.33, now); // D5
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
};

/**
 * Play a cheerful success chime (major third / chord arpeggio)
 */
export const playSuccess = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noteTime = ctx.currentTime + idx * 0.07;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.25, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.25);
  });
};

/**
 * Play a gentle friendly "boing" for wrong / no answer (kid-friendly, non-punitive)
 */
export const playGentleTap = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
};

/**
 * Play a celebratory fanfare for completing the assessment
 */
export const playFanfare = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // C4, E4, G4, C5, E5, G5
  const melody = [
    { freq: 523.25, time: 0.0, dur: 0.12 },
    { freq: 659.25, time: 0.12, dur: 0.12 },
    { freq: 783.99, time: 0.24, dur: 0.12 },
    { freq: 1046.5, time: 0.38, dur: 0.4 },
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = ctx.currentTime + note.time;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, startTime);

    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + note.dur);
  });
};
