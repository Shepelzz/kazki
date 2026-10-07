// The heroes of the shelf's tales (everyone with a hello), and the coin: known to the app from the
// start; the heroes' page itself (heroes-page.ts) is fetched when it is opened.

import type { Story } from './story';
import type { Voice } from './voiceKey';

export interface Hero {
  id: string;
  name: string;
  voice: Voice;
  /** the narrator's voice of its home tale (for the page's own words) */
  narrator: Voice;
}

/** the heroes: every character with a hello, in the order of the tales on the shelf */
export function heroesOf(stories: Pick<Story, 'voices'>[]): Hero[] {
  const out: Hero[] = [];
  for (const s of stories)
    for (const [id, v] of Object.entries(s.voices))
      if (v.hello && !out.some((h) => h.id === id)) out.push({ id, name: v.name, voice: v, narrator: s.voices.narrator });
  return out;
}

/** a gold coin with a star, for prices and the purse */
export const COIN =
  '<svg class="coin" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#ffc83d" stroke="#c98a12" stroke-width="3"/><circle cx="20" cy="20" r="12" fill="none" stroke="#eaa51c" stroke-width="2.5"/><path d="M20 12.5l2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.8-3.6 5.2-.8z" fill="#fff3c4"/></svg>';
