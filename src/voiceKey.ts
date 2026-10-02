// Shared by the app and scripts/build-voice.ts: a recorded phrase is stored as public/voice/<key>.m4a.

/** FNV-1a hash, as 8 hex digits. */
export function hash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export interface Voice {
  /** shown above the subtitle; empty for the narrator */
  name: string;
  /** 1 = the voice's normal pitch */
  pitch: number;
  /** 1 = normal speed */
  rate: number;
}

/** The same words said by another voice (or with another pitch) are another recording. */
export const voiceKey = (voice: Voice, text: string) => hash(`${voice.pitch}/${voice.rate}/${text}`);
