// The things the heroes wear, fetched when needed: each thing is a little file of its own
// (virtual:item/<id>, drawn when the app is built), so the app holds only the drawings of what is
// worn (and, on the heroes' page, of the hero whose card is open), never the whole wardrobe.

import ART from 'virtual:wardrobe-art';
import type { Wearable } from './dress';
import { progress } from './progress';

const got = new Map<string, Wearable>();
const coming = new Map<string, Promise<void>>();

/** Fetch these things (once each; a thing that isn't there any more is skipped). */
export function loadItems(ids: string[]): Promise<void> {
  return Promise.all(
    ids.map((id) => {
      if (got.has(id) || !ART[id]) return Promise.resolve();
      let p = coming.get(id);
      if (!p) {
        p = ART[id]()
          .then((m) => {
            const a = m.default;
            got.set(id, { id: a.id, slot: a.slot, beard: a.beard, draw: () => a.svg });
          })
          .catch(() => {
            // no Wi-Fi: worn next time
          })
          .then(() => {
            coming.delete(id);
          });
        coming.set(id, p);
      }
      return p;
    }),
  ).then(() => undefined);
}

/** a thing fetched already */
export const wearable = (id: string) => got.get(id);

/** what a hero has on (bought, worn, its checkbox on): the ids */
export function outfitIds(hero: string): string[] {
  if (!progress.dressed(hero)) return [];
  const w = progress.wearing(hero);
  return Object.keys(w)
    .map((slot) => w[slot])
    .filter((id) => progress.owns(id));
}

/** Fetch what these heroes have on. */
export const loadOutfits = (heroes: string[]) => loadItems(([] as string[]).concat(...heroes.map(outfitIds)));

/** what a hero has on, of the things fetched (loadOutfits first) */
export function outfitOf(hero: string): Wearable[] {
  return outfitIds(hero)
    .map((id) => got.get(id))
    .filter((i): i is Wearable => !!i);
}
