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
const fileUrl = (key: string) => `${import.meta.env.BASE_URL}voice/${key}.m4a?v=${recorded.get(key)}`;
const ready = new Map<string, string>();
const queue: string[] = [];
let fetching = 0;
const KEEP = 80;

function pump() {
  while (fetching < 2 && queue.length) {
    const key = queue.shift()!;
    if (ready.has(key)) continue;
    fetching++;
    fetch(fileUrl(key))
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => {
        if (!blob || ready.has(key)) return;
        ready.set(key, URL.createObjectURL(blob));
        for (const [k, url] of ready) {
          if (ready.size <= KEEP) break;
          if (audio && audio.src === url) continue;
          URL.revokeObjectURL(url);
          ready.delete(k);
        }
      })
      .catch(() => {})
      .then(() => {
        fetching--;
        pump();
      });
  }
}

/** Fetch these phrases ahead, in this order (first = needed soonest). */
export function preload(phrases: { voice: Voice; text: string }[]) {
  const keys = phrases.map((p) => voiceKey(p.voice, p.text)).filter((k) => recorded.has(k) && !ready.has(k));
  for (const k of keys.reverse()) {
    const i = queue.indexOf(k);
    if (i >= 0) queue.splice(i, 1);
    queue.unshift(k);
  }
  pump();
}

// ---------- keeping the audio output awake ----------
let ctx: AudioContext | null = null;

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
    }
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    // no Web Audio: phrases just start a little later
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
  if (document.visibilityState === 'visible') void ctx.resume();
  else void ctx.suspend();
});

export function stopSpeech() {
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
      setTimeout(finish, 1200 + text.length * 45);
      return;
    }
    const key = voiceKey(voice, text);
    if (recorded.has(key)) {
      if (!audio) audio = new Audio();
      const a = audio;
      a.onended = finish;
      a.onerror = () => {
        if (!done && finishCurrent === finish) speakWithSynth(voice, text, finish);
      };
      const url = ready.get(key);
      if (url) {
        ready.delete(key);
        ready.set(key, url);
      }
      a.src = url || fileUrl(key);
      const p = a.play();
      if (p)
        p.catch((err: DOMException) => {
          if (err && err.name !== 'AbortError') finish();
        });
      return;
    }
    speakWithSynth(voice, text, finish);
  });
}

function speakWithSynth(voice: Voice, text: string, finish: () => void) {
  if (!synth) {
    setTimeout(finish, 1200 + text.length * 45);
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
  setTimeout(finish, 2500 + text.length * 120);
  synth.speak(u);
}
