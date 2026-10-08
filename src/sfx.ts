// Sounds of what happens on the stage — a blow, a knock, a crack, a growl, a bark — made on the spot
// with Web Audio (no files to fetch). The tales say which with the word of an effect (fx bang / hit
// word: «ТУК-ТУК!», «ТРІСЬ!», «Р-Р-Р!»…): the word picks the sound and is never shown.
// Quiet under the voice; silent while the sound is off (the speaker button).

import { audioContext, speechEnabled } from './speech';

type Kind =
  | 'thud'
  | 'boom'
  | 'knock'
  | 'crack'
  | 'snap'
  | 'crunch'
  | 'ding'
  | 'growl'
  | 'whoosh'
  | 'bloop'
  | 'squeak'
  | 'pop'
  | 'bark'
  | 'meow'
  | 'cluck'
  | 'heehaw'
  | 'fanfare'
  | 'laugh'
  | 'sizzle'
  | 'slide'
  | 'call'
  | 'clatter'
  | 'splash'
  | 'sneeze'
  | 'snore'
  | 'snip'
  | 'coins';

/** the words of the tales → their sound (the first that matches; checked without the "!") */
const BY_WORD: [RegExp, Kind][] = [
  [/^ТУК|^ТИЦЬ|^КЛЮЄ/, 'knock'],
  [/^ТРІСЬ|^ХРЯСЬ/, 'crack'],
  [/^ХРУМ/, 'crunch'],
  [/^ХР-Р|^ХРР/, 'snore'],
  [/^ЧИК/, 'snip'],
  [/^ХАП|^ЦАП|^ГАМ|^ЛИП/, 'snap'],
  [/^ДЗЕНЬ/, 'ding'],
  [/^ДЗИНЬ/, 'coins'],
  [/^Р-Р|^ГУР|^ФРР/, 'growl'],
  [/^ШУ|^ФУ/, 'whoosh'],
  [/^БУЛЬК/, 'bloop'],
  [/^ПЛЮХ|^ХЛЮП/, 'splash'],
  [/^АПЧХ/, 'sneeze'],
  [/^КЛАЦ/, 'snap'],
  [/^ЩИ/, 'squeak'],
  [/^ГОП/, 'pop'],
  [/^ГАВ/, 'bark'],
  [/^МЯУ/, 'meow'],
  [/^КО/, 'cluck'],
  [/^ІА/, 'heehaw'],
  [/^УРА|^ГОЛ|^МОЛОДЦІ|^ВЕСІЛЛЯ/, 'fanfare'],
  [/^ХА-ХА/, 'laugh'],
  [/^ПЕЧЕ|^ГАРЯЧЕ/, 'sizzle'],
  [/^ОЙ|^АЙ|^ОСЬ ВОНА/, 'slide'],
  [/^АУ|^РЯТУЙТЕ/, 'call'],
  [/^СВАРКА|^БАМ-БАМ/, 'clatter'],
  [/^БАХ|^ТРАХ|^ГРІМ|^БАМ|^БУБУХ/, 'boom'],
  [/^ГУП|^БУХ|^ТУЦ|^БУЦ|^ШТУРХ|^КОП|^ТУП/, 'thud'],
];

const kindOf = (word: string | undefined, fallback: Kind): Kind => {
  const w = (word || '').toUpperCase().replace(/[!?.]+$/, '');
  for (const [re, k] of BY_WORD) if (re.test(w)) return k;
  return fallback;
};

/** how many times a word says it: «ТУК-ТУК» knocks twice, «КО-КО-КО» clucks three times */
const times = (word: string | undefined) => Math.min(4, (word || '').split('-').filter((p) => /[А-ЯІЇЄҐA-Z]/i.test(p)).length || 1);

let noiseBuf: AudioBuffer | null = null;
function noise(c: AudioContext) {
  if (!noiseBuf || noiseBuf.sampleRate !== c.sampleRate) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = c.createBufferSource();
  s.buffer = noiseBuf;
  return s;
}

/** a gain that rises in `a` seconds to `peak` and falls away by `len` */
function env(c: AudioContext, out: AudioNode, t: number, peak: number, a: number, len: number) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  g.connect(out);
  return g;
}

function tone(c: AudioContext, out: AudioNode, t: number, type: OscillatorType, f0: number, f1: number, len: number, peak: number, a = 0.005) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + len);
  o.connect(env(c, out, t, peak, a, len));
  o.start(t);
  o.stop(t + len + 0.05);
  return o;
}

function hiss(c: AudioContext, out: AudioNode, t: number, filter: BiquadFilterType, f0: number, f1: number, len: number, peak: number, q = 1, a = 0.004) {
  const n = noise(c);
  const f = c.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + len);
  n.connect(f);
  f.connect(env(c, out, t, peak, a, len));
  n.start(t, Math.random() * 0.5);
  n.stop(t + len + 0.05);
}

const SOUNDS: Record<Kind, (c: AudioContext, o: AudioNode, t: number, n: number) => void> = {
  thud: (c, o, t, n) => {
    for (let i = 0; i < n; i++) {
      tone(c, o, t + i * 0.22, 'sine', 150, 45, 0.28, 0.9);
      hiss(c, o, t + i * 0.22, 'lowpass', 900, 120, 0.18, 0.5);
    }
  },
  boom: (c, o, t) => {
    tone(c, o, t, 'sine', 110, 30, 0.7, 1);
    hiss(c, o, t, 'lowpass', 2200, 80, 0.8, 0.8);
    hiss(c, o, t, 'bandpass', 3000, 600, 0.15, 0.3, 0.7);
  },
  knock: (c, o, t, n) => {
    for (let i = 0; i < n; i++) {
      const at = t + i * 0.2;
      tone(c, o, at, 'sine', 700, 320, 0.09, 0.6, 0.002);
      hiss(c, o, at, 'bandpass', 1800, 900, 0.06, 0.6, 3, 0.002);
    }
  },
  crack: (c, o, t) => {
    for (let i = 0; i < 5; i++) hiss(c, o, t + i * 0.035 + Math.random() * 0.02, 'highpass', 2500 - i * 300, 1200, 0.07, 0.7 - i * 0.1, 0.8, 0.002);
    tone(c, o, t + 0.05, 'triangle', 220, 90, 0.18, 0.3);
  },
  snap: (c, o, t) => {
    hiss(c, o, t, 'bandpass', 2600, 1500, 0.05, 0.8, 4, 0.002);
    tone(c, o, t, 'square', 420, 180, 0.06, 0.25, 0.002);
  },
  crunch: (c, o, t) => {
    for (let i = 0; i < 6; i++) hiss(c, o, t + i * 0.045, 'bandpass', 1400 + Math.random() * 1600, 700, 0.05, 0.5, 2, 0.002);
  },
  ding: (c, o, t) => {
    for (const [f, p] of [[1760, 0.35], [2640, 0.22], [3960, 0.14]] as const) tone(c, o, t, 'sine', f, f * 0.995, 1.1, p, 0.002);
    hiss(c, o, t, 'highpass', 5000, 4000, 0.12, 0.4, 0.7, 0.002);
  },
  growl: (c, o, t) => {
    const len = 0.9;
    const s = c.createOscillator();
    s.type = 'sawtooth';
    s.frequency.setValueAtTime(85, t);
    s.frequency.linearRampToValueAtTime(70, t + len);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 520;
    // the rolling "р-р-р": the loudness flutters
    const trem = c.createGain();
    trem.gain.value = 0.5;
    const lfo = c.createOscillator();
    lfo.frequency.value = 24;
    const depth = c.createGain();
    depth.gain.value = 0.5;
    lfo.connect(depth);
    depth.connect(trem.gain);
    s.connect(lp);
    lp.connect(trem);
    trem.connect(env(c, o, t, 0.9, 0.06, len));
    s.start(t);
    lfo.start(t);
    s.stop(t + len + 0.05);
    lfo.stop(t + len + 0.05);
  },
  whoosh: (c, o, t) => hiss(c, o, t, 'bandpass', 300, 2400, 0.7, 0.8, 1.5, 0.25),
  bloop: (c, o, t) => {
    tone(c, o, t, 'sine', 220, 900, 0.14, 0.6, 0.003);
    tone(c, o, t + 0.12, 'sine', 300, 1100, 0.12, 0.4, 0.003);
  },
  squeak: (c, o, t) => tone(c, o, t, 'sine', 1400, 2600, 0.12, 0.35, 0.003),
  pop: (c, o, t) => {
    tone(c, o, t, 'sine', 380, 900, 0.1, 0.6, 0.002);
    hiss(c, o, t, 'bandpass', 1200, 800, 0.05, 0.4, 2, 0.002);
  },
  bark: (c, o, t, n) => {
    for (let i = 0; i < Math.max(1, n); i++) {
      const at = t + i * 0.28;
      tone(c, o, at, 'sawtooth', 520, 260, 0.14, 0.35, 0.01);
      hiss(c, o, at, 'bandpass', 1100, 500, 0.12, 0.4, 2, 0.01);
    }
  },
  meow: (c, o, t) => {
    const s = c.createOscillator();
    s.type = 'triangle';
    s.frequency.setValueAtTime(480, t);
    s.frequency.linearRampToValueAtTime(820, t + 0.25);
    s.frequency.linearRampToValueAtTime(420, t + 0.6);
    s.connect(env(c, o, t, 0.4, 0.05, 0.65));
    s.start(t);
    s.stop(t + 0.7);
  },
  cluck: (c, o, t, n) => {
    for (let i = 0; i < n; i++) tone(c, o, t + i * 0.16, 'square', 760, 520, 0.07, 0.18, 0.003);
  },
  heehaw: (c, o, t) => {
    tone(c, o, t, 'sawtooth', 900, 820, 0.28, 0.25, 0.02);
    tone(c, o, t + 0.3, 'sawtooth', 330, 280, 0.4, 0.28, 0.02);
  },
  fanfare: (c, o, t) => {
    [523, 659, 784, 1047].forEach((f, i) => tone(c, o, t + i * 0.11, 'triangle', f, f, i === 3 ? 0.55 : 0.16, 0.35, 0.01));
  },
  laugh: (c, o, t) => {
    for (let i = 0; i < 3; i++) tone(c, o, t + i * 0.17, 'triangle', 620 - i * 60, 480 - i * 60, 0.12, 0.3, 0.01);
  },
  sizzle: (c, o, t) => {
    hiss(c, o, t, 'highpass', 4000, 5200, 0.8, 0.45, 0.7, 0.02);
    for (let i = 0; i < 6; i++) hiss(c, o, t + Math.random() * 0.6, 'highpass', 6000, 5000, 0.03, 0.4, 0.7, 0.002);
  },
  slide: (c, o, t) => tone(c, o, t, 'sine', 1300, 380, 0.45, 0.35, 0.01),
  call: (c, o, t) => {
    tone(c, o, t, 'sine', 660, 700, 0.3, 0.3, 0.04);
    tone(c, o, t + 0.32, 'sine', 520, 480, 0.45, 0.3, 0.04);
  },
  splash: (c, o, t) => {
    hiss(c, o, t, 'lowpass', 3000, 400, 0.5, 0.8, 0.8, 0.005);
    tone(c, o, t, 'sine', 160, 60, 0.25, 0.5);
    for (let i = 0; i < 4; i++) tone(c, o, t + 0.1 + i * 0.07, 'sine', 600 + Math.random() * 500, 1400, 0.06, 0.25, 0.002);
  },
  sneeze: (c, o, t) => {
    // the breath in, then the burst out
    hiss(c, o, t, 'bandpass', 600, 1400, 0.4, 0.25, 1.2, 0.3);
    hiss(c, o, t + 0.45, 'highpass', 2500, 1500, 0.3, 0.9, 0.7, 0.003);
    tone(c, o, t + 0.45, 'sawtooth', 420, 200, 0.12, 0.2, 0.003);
  },
  snore: (c, o, t) => {
    // a long rumbling breath in through the nose, then a whistle out
    const len = 1.1;
    const s = c.createOscillator();
    s.type = 'sawtooth';
    s.frequency.setValueAtTime(60, t);
    s.frequency.linearRampToValueAtTime(48, t + len);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 380;
    const trem = c.createGain();
    trem.gain.value = 0.5;
    const lfo = c.createOscillator();
    lfo.frequency.value = 13;
    const depth = c.createGain();
    depth.gain.value = 0.5;
    lfo.connect(depth);
    depth.connect(trem.gain);
    s.connect(lp);
    lp.connect(trem);
    trem.connect(env(c, o, t, 0.9, 0.4, len));
    s.start(t);
    lfo.start(t);
    s.stop(t + len + 0.05);
    lfo.stop(t + len + 0.05);
    hiss(c, o, t + len - 0.1, 'bandpass', 1800, 2600, 0.45, 0.25, 6, 0.08);
  },
  snip: (c, o, t, n) => {
    // the blades of big scissors: a bright click, twice for «ЧИК-ЧИК»
    for (let i = 0; i < n; i++) {
      const at = t + i * 0.18;
      hiss(c, o, at, 'highpass', 5000, 3500, 0.06, 0.6, 1, 0.002);
      tone(c, o, at, 'triangle', 2400, 1600, 0.05, 0.25, 0.002);
    }
  },
  coins: (c, o, t) => {
    // a handful of coins: bright pings one after another
    for (let i = 0; i < 6; i++) {
      const f = 2200 + Math.random() * 1600;
      tone(c, o, t + i * 0.06 + Math.random() * 0.03, 'sine', f, f * 0.98, 0.35, 0.28, 0.002);
      tone(c, o, t + i * 0.06, 'triangle', f * 1.5, f * 1.48, 0.2, 0.12, 0.002);
    }
  },
  clatter: (c, o, t) => {
    for (let i = 0; i < 5; i++) {
      const at = t + i * 0.09 + Math.random() * 0.04;
      tone(c, o, at, 'sine', 300 + Math.random() * 300, 90, 0.12, 0.45, 0.002);
      hiss(c, o, at, 'bandpass', 2000 + Math.random() * 1500, 900, 0.06, 0.35, 2, 0.002);
    }
  },
};

/** Play the sound of a stage effect: its word picks it (bang → a boom, hit → a thud by default). */
export function sfx(word: string | undefined, fallback: Kind = 'thud') {
  if (!speechEnabled()) return;
  const c = audioContext();
  if (!c) return;
  try {
    const out = c.createGain();
    // under the voice
    out.gain.value = 0.35;
    out.connect(c.destination);
    SOUNDS[kindOf(word, fallback)](c, out, c.currentTime + 0.01, times(word));
    setTimeout(() => out.disconnect(), 2500);
  } catch {
    // an old browser without some node: no sound, the tale goes on
  }
}
