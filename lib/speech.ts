// Suara announcer: TTS browser (id-ID) + bunyi "ding-dong" via WebAudio.
// Browser memblokir suara sebelum ada interaksi pengguna, sehingga unlockAudio()
// harus dipanggil dari handler klik (tombol "Aktifkan suara").

export type SpeakOpts = { voiceURI: string; rate: number; volume: number; chime: boolean };
export type VoiceInfo = { uri: string; name: string; lang: string };

type AudioCtor = typeof AudioContext;
let ctx: AudioContext | null = null;

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  try {
    const Ctor: AudioCtor | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
    if (Ctor) {
      ctx ??= new Ctor();
      void ctx.resume();
    }
  } catch {
    /* audio tidak tersedia */
  }
  if (ttsSupported()) {
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {
      /* abaikan */
    }
  }
}

export function loadVoices(): Promise<VoiceInfo[]> {
  if (!ttsSupported()) return Promise.resolve([]);
  const synth = window.speechSynthesis;
  const map = () => synth.getVoices().map(v => ({ uri: v.voiceURI, name: v.name, lang: v.lang }));
  const now = map();
  if (now.length) return Promise.resolve(now);
  return new Promise(resolve => {
    const done = () => resolve(map());
    synth.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1500);
  });
}

export function isIndonesian(v: VoiceInfo): boolean {
  const l = v.lang.toLowerCase().replace("_", "-");
  return l === "id-id" || l.startsWith("id-") || l === "id" || /indonesia/i.test(v.name);
}

export function chime(volume: number): Promise<void> {
  if (!ctx) return Promise.resolve();
  const c = ctx;
  const t0 = c.currentTime + 0.02;
  const tone = (freq: number, start: number, dur: number) => {
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0 + start);
    g.gain.exponentialRampToValueAtTime(Math.max(0.02, 0.35 * volume), t0 + start + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
    o.connect(g).connect(c.destination);
    o.start(t0 + start); o.stop(t0 + start + dur + 0.05);
  };
  tone(880, 0, 0.5); tone(660, 0.38, 0.7);
  return new Promise(r => setTimeout(r, 1000));
}

function speakOnce(text: string, o: SpeakOpts): Promise<void> {
  if (!ttsSupported()) return Promise.resolve();
  return new Promise(resolve => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    const voice = synth.getVoices().find(v => v.voiceURI === o.voiceURI);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = "id-ID";
    u.rate = o.rate; u.volume = o.volume;
    const guard = setTimeout(resolve, 20000);
    const end = () => { clearTimeout(guard); resolve(); };
    u.onend = end; u.onerror = end;
    synth.speak(u);
  });
}

// Antrean berurutan: satu pengumuman pada satu waktu (tidak tumpang tindih).
let chain: Promise<void> = Promise.resolve();
export function announce(text: string, o: SpeakOpts): Promise<void> {
  chain = chain.then(async () => {
    if (o.chime) await chime(o.volume);
    await speakOnce(text, o);
  });
  return chain;
}
