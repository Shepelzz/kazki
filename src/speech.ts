// Speaks the tale aloud. Every phrase is pre-recorded (public/voice, npm run voice), because old
// iPads on iOS 12 have no Ukrainian voice and would read it with a Russian one. The browser's speech
// synthesis is only a fallback for a phrase with no recording yet.
//
// A recording fetched on the spot starts late on an iPad over Wi-Fi, so the phrases of the scene
// being told and of the scenes a choice can lead to are fetched ahead into memory (preload).
// Between phrases the system may put the audio output to sleep, and waking it (Bluetooth speakers
// especially) swallows the start of the next phrase: a silent Web Audio loop keeps it awake.

import manifest from './voice-manifest.json';
import { voiceKey, type Voice } from './voiceKey';

/** recorded phrase key → fingerprint of its file */
const recorded = new Map<string, string>(Object.entries(manifest as Record<string, string>));
const synth: SpeechSynthesis | undefined = window.speechSynthesis;
let synthVoice: SpeechSynthesisVoice | null = null;
let enabled = true;
// One element reused for every phrase: iOS unlocks playback per element on the first tap.
let audio: HTMLAudioElement | null = null;
let finishCurrent: (() => void) | null = null;
/** the pause button: the phrase stops where it is and goes on from there */
let paused = false;
/** a phrase asked for while paused starts on resume */
let startOnResume: (() => void) | null = null;
/** the recording was playing when paused (not just sitting there finished) */
let resumeAudio = false;

/** like setTimeout, but the clock stands still while paused */
function pausableTimeout(ms: number, fn: () => void) {
  let left = ms;
  let last = Date.now();
  const iv = setInterval(() => {
    const now = Date.now();
    if (!paused) left -= now - last;
    last = now;
    if (left <= 0) {
      clearInterval(iv);
      fn();
    }
  }, 100);
}

function pickVoice() {
  if (!synth) return;
  const uk = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('uk'));
  synthVoice = uk.find((v) => v.localService) || uk[0] || null;
}
if (synth) {
  pickVoice();
  synth.onvoiceschanged = pickVoice;
}

// ---------- recordings kept in memory ----------
//
// Old iPads start an <audio> element late every time its source changes (a good part of a second),
// which left long gaps between the lines. So recordings are fetched ahead as bytes, decoded into
// Web Audio buffers and played from those: the next line starts at once, and the silence at the
// ends of a recording is cut off. The <audio> element is only the fallback (no Web Audio, or a
// recording not fetched yet).

const fileUrl = (key: string) => `${import.meta.env.BASE_URL}voice/${key}.m4a?v=${recorded.get(key)}`;
/** key → the recording's bytes, oldest first */
const bytes = new Map<string, ArrayBuffer>();
/** key → decoded and trimmed, oldest first (big: kept few) */
const decoded = new Map<string, { buf: AudioBuffer; from: number; to: number }>();
const decoding = new Map<string, Promise<boolean>>();
const queue: string[] = [];
let fetching = 0;
const KEEP_BYTES = 120;
const KEEP_DECODED = 18;

function touch<V>(m: Map<string, V>, k: string, v: V, keep: number) {
  m.delete(k);
  m.set(k, v);
  for (const old of m.keys()) {
    if (m.size <= keep) break;
    m.delete(old);
  }
}

function pump() {
  while (fetching < 2 && queue.length) {
    const key = queue.shift()!;
    if (bytes.has(key)) {
      void decode(key);
      continue;
    }
    fetching++;
    fetch(fileUrl(key))
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .then((b) => {
        if (!b) return;
        touch(bytes, key, b, KEEP_BYTES);
        return decode(key);
      })
      .catch(() => {})
      .then(() => {
        fetching--;
        pump();
      });
  }
}

/** Decode a fetched recording (needs the audio context: after the first tap). */
function decode(key: string): Promise<boolean> {
  if (decoded.has(key)) return Promise.resolve(true);
  const b = bytes.get(key);
  if (!ctx || !b) return Promise.resolve(false);
  const going = decoding.get(key);
  if (going) return going;
  const c = ctx;
  const p = new Promise<boolean>((resolve) => {
    const ok = (buf: AudioBuffer) => {
      touch(decoded, key, { buf, ...trim(buf) }, KEEP_DECODED);
      resolve(true);
    };
    try {
      // Safari 12 has only the callback form; newer browsers also return a promise
      const r = c.decodeAudioData(b.slice(0), ok, () => resolve(false)) as unknown as Promise<AudioBuffer> | undefined;
      if (r && r.catch) r.catch(() => resolve(false));
    } catch {
      resolve(false);
    }
  }).then((v) => {
    decoding.delete(key);
    return v;
  });
  decoding.set(key, p);
  return p;
}

/** where the voice starts and ends in the recording (the silence around it is skipped) */
function trim(buf: AudioBuffer) {
  const d = buf.getChannelData(0);
  const LOUD = 0.01;
  let a = 0;
  while (a < d.length && Math.abs(d[a]) < LOUD) a++;
  let z = d.length - 1;
  while (z > a && Math.abs(d[z]) < LOUD) z--;
  const sr = buf.sampleRate;
  return { from: Math.max(0, a / sr - 0.03), to: Math.min(buf.duration, z / sr + 0.12) };
}

/** Fetch these phrases ahead, in this order (first = needed soonest). */
export function preload(phrases: { voice: Voice; text: string }[]) {
  const keys = phrases.map((p) => voiceKey(p.voice, p.text)).filter((k) => recorded.has(k) && !decoded.has(k));
  for (const k of keys.reverse()) {
    const i = queue.indexOf(k);
    if (i >= 0) queue.splice(i, 1);
    queue.unshift(k);
  }
  pump();
}

// ---------- the audio context (also keeps the output awake) ----------
let ctx: AudioContext | null = null;
let source: AudioBufferSourceNode | null = null;
/** the recording playing from a buffer: when it started (audio-context time) and how long it is */
let playing: { at: number; dur: number } | null = null;

/**
 * How far into the phrase being said the voice is, 0…1 — or null when that isn't known (muted,
 * the speech synthesis). The subtitles of a long line turn their pages by it. The audio context's
 * clock stands still while paused, so the pages wait too.
 */
export function speechProgress(): number | null {
  if (playing && ctx) return Math.min(1, Math.max(0, (ctx.currentTime - playing.at) / playing.dur));
  if (audio && finishCurrent && !audio.paused && audio.duration > 0) return Math.min(1, audio.currentTime / audio.duration);
  return null;
}

/** Call from a tap (browsers start audio only on a user gesture). */
export function unlockAudio() {
  try {
    if (!ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      ctx = new Ctx();
      const silence = ctx.createBufferSource();
      silence.buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      silence.loop = true;
      silence.connect(ctx.destination);
      silence.start(0);
      // what was fetched before the first tap can be decoded now
      for (const k of bytes.keys()) void decode(k);
    }
    if (ctx.state === 'suspended' && !paused) void ctx.resume();
  } catch {
    // no Web Audio: the <audio> element plays the phrases
  }
  // iOS lets an element play later only if it was started inside a tap once
  if (!audio) {
    audio = new Audio();
    audio.src = 'data:audio/mp4;base64,';
    const p = audio.play();
    if (p) p.catch(() => {});
  }
}

document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.visibilityState === 'visible') {
    if (!paused) void ctx.resume();
  } else void ctx.suspend();
});

export function pauseSpeech() {
  if (paused) return;
  paused = true;
  resumeAudio = !!audio && !audio.paused;
  if (resumeAudio) audio!.pause();
  if (ctx) void ctx.suspend();
  synth?.pause();
}

export function resumeSpeech() {
  if (!paused) return;
  paused = false;
  if (ctx) void ctx.resume();
  if (startOnResume) {
    const f = startOnResume;
    startOnResume = null;
    f();
  } else if (audio && resumeAudio && finishCurrent) {
    const p = audio.play();
    if (p) p.catch(() => {});
  }
  resumeAudio = false;
  synth?.resume();
}

function stopSource() {
  playing = null;
  if (!source) return;
  source.onended = null;
  try {
    source.stop();
  } catch {
    // already stopped
  }
  source = null;
}

export function stopSpeech() {
  startOnResume = null;
  resumeAudio = false;
  stopSource();
  if (audio) audio.pause();
  synth?.cancel();
  const f = finishCurrent;
  finishCurrent = null;
  f?.();
}

export function setSpeechEnabled(on: boolean) {
  enabled = on;
  if (!on) stopSpeech();
}

export const speechEnabled = () => enabled;

/**
 * Say a phrase in a character's voice; resolves when it has been said (or was stopped). Muted, it
 * resolves after about the time reading the subtitle takes.
 */
export function say(voice: Voice, text: string): Promise<void> {
  stopSpeech();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      if (finishCurrent === finish) finishCurrent = null;
      resolve();
    };
    finishCurrent = finish;
    if (!enabled) {
      pausableTimeout(1200 + text.length * 45, finish);
      return;
    }
    if (paused) startOnResume = () => start(voice, text, finish, () => done);
    else start(voice, text, finish, () => done);
  });
}

function start(voice: Voice, text: string, finish: () => void, isDone: () => boolean) {
  if (isDone()) return;
  const key = voiceKey(voice, text);
  if (!recorded.has(key)) return speakWithSynth(voice, text, finish);
  const d = decoded.get(key);
  if (d && ctx) return playBuffer(key, d, finish);
  if (ctx && bytes.has(key)) {
    // fetched but not decoded yet: decoding takes a moment, still quicker than <audio>
    void decode(key).then((ok) => {
      if (isDone() || finishCurrent !== finish) return;
      const dd = decoded.get(key);
      if (ok && dd) playBuffer(key, dd, finish);
      else playElement(key, voice, text, finish, isDone);
    });
    return;
  }
  playElement(key, voice, text, finish, isDone);
  // and have it at hand next time
  preload([{ voice, text }]);
}

function playBuffer(key: string, d: { buf: AudioBuffer; from: number; to: number }, finish: () => void) {
  const c = ctx!;
  touch(decoded, key, d, KEEP_DECODED);
  stopSource();
  const s = c.createBufferSource();
  s.buffer = d.buf;
  s.connect(c.destination);
  s.onended = () => {
    if (source === s) {
      source = null;
      playing = null;
    }
    finish();
  };
  source = s;
  playing = { at: c.currentTime, dur: Math.max(0.1, d.to - d.from) };
  s.start(0, d.from, d.to - d.from);
}

function playElement(key: string, voice: Voice, text: string, finish: () => void, isDone: () => boolean) {
  if (!audio) audio = new Audio();
  const a = audio;
  a.onended = finish;
  a.onerror = () => {
    if (!isDone() && finishCurrent === finish) speakWithSynth(voice, text, finish);
  };
  a.src = fileUrl(key);
  const p = a.play();
  if (p)
    p.catch((err: DOMException) => {
      if (err && err.name !== 'AbortError') finish();
    });
}

function speakWithSynth(voice: Voice, text: string, finish: () => void) {
  if (!synth) {
    pausableTimeout(1200 + text.length * 45, finish);
    return;
  }
  if (!synthVoice) pickVoice();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'uk-UA';
  if (synthVoice) u.voice = synthVoice;
  u.rate = voice.rate;
  u.pitch = Math.min(2, voice.pitch);
  u.onend = finish;
  u.onerror = finish;
  // some Safari versions never fire onend
  pausableTimeout(2500 + text.length * 120, finish);
  synth.speak(u);
}
