// Text-to-speech helper with device voice detection and offline support

export interface SpeechOptions {
  lang?: 'hi' | 'en' | string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceURI?: string;
  onEnd?: () => void;
  onError?: () => void;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
};

// Populate voices when loaded by browser
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = (): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};

export const speak = (
  text: string,
  options: SpeechOptions = {}
): SpeechSynthesisUtterance | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || text.trim() === '') return null;

  const utterance = new SpeechSynthesisUtterance(text);
  const lang = options.lang || (localStorage.getItem('picksy_language') as 'hi' | 'en') || 'hi';

  const voices = getAvailableVoices();
  const targetLangCode = lang === 'hi' ? 'hi-IN' : 'en-US';
  utterance.lang = targetLangCode;

  // Find preferred voice or matching language voice
  if (options.voiceURI) {
    const matched = voices.find((v) => v.voiceURI === options.voiceURI);
    if (matched) utterance.voice = matched;
  }

  if (!utterance.voice && voices.length > 0) {
    const langVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(lang === 'hi' ? 'hi' : 'en') ||
        (lang === 'hi' && (v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india')))
    );
    if (langVoice) {
      utterance.voice = langVoice;
    }
  }

  // Rate & pitch from options or saved settings
  const savedRate = localStorage.getItem('picksy_speech_rate');
  const savedPitch = localStorage.getItem('picksy_speech_pitch');

  utterance.rate = options.rate ?? (savedRate ? parseFloat(savedRate) : 0.85);
  utterance.pitch = options.pitch ?? (savedPitch ? parseFloat(savedPitch) : 1.05);
  utterance.volume = options.volume ?? 1;

  if (options.onEnd) {
    utterance.onend = () => options.onEnd?.();
  }
  if (options.onError) {
    utterance.onerror = () => options.onError?.();
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
};
