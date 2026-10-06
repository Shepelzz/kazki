// What the child has done, in one place: endings found, scenes heard, heroes met, coins, the clothes
// bought and who wears what. Everything else asks this module and never touches the storage itself,
// so the storage can change (today the browser's localStorage; later the app's own files, an account
// synced between the tablet and the phone) without touching the rest.
//
// Kept as one versioned record; an older one is migrated on load (v0 = the separate
// kazky:endings:<tale> / kazky:heard:<tale> keys of the first versions).

const KEY = 'kazky:progress';
const VERSION = 1;

/** coins for an ending heard for the first time, for every ending of a tale found, for one heard again */
export const REWARD = { newEnding: 10, allEndings: 20, again: 2 };

interface Data {
  v: number;
  /** tale → endings found */
  endings: Record<string, string[]>;
  /** tale → scenes heard on a way to an ending (they may be skipped through) */
  heard: Record<string, string[]>;
  /** heroes seen in a tale */
  met: string[];
  coins: number;
  /** clothes bought */
  owned: string[];
  /** hero → slot → the thing worn there */
  wear: Record<string, Record<string, string>>;
  /** hero → the clothes off for now (the checkbox), worn otherwise */
  undressed: Record<string, boolean>;
}

const empty = (): Data => ({ v: VERSION, endings: {}, heard: {}, met: [], coins: 0, owned: [], wear: {}, undressed: {} });

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function load(): Data {
  const ls = storage();
  if (!ls) return empty();
  try {
    const raw = ls.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw) as Partial<Data>;
      return { ...empty(), ...d, v: VERSION };
    }
  } catch {
    // unreadable: start over below (the old keys, if any, still count)
  }
  return migrateV0(ls);
}

/** the first versions kept endings and heard scenes under a key per tale */
function migrateV0(ls: Storage): Data {
  const d = empty();
  const old: string[] = [];
  for (let i = 0; i < ls.length; i++) {
    const k = ls.key(i);
    if (!k) continue;
    const m = /^kazky:(endings|heard):(.+)$/.exec(k);
    if (!m) continue;
    old.push(k);
    try {
      const v = JSON.parse(ls.getItem(k) || '[]');
      if (Array.isArray(v)) d[m[1] as 'endings' | 'heard'][m[2]] = v.map(String);
    } catch {
      // a broken key: skipped
    }
  }
  // endings found before there were coins: paid for now
  for (const id of Object.keys(d.endings)) d.coins += d.endings[id].length * REWARD.newEnding;
  write(d);
  for (const k of old) ls.removeItem(k);
  return d;
}

function write(d: Data) {
  try {
    storage()?.setItem(KEY, JSON.stringify(d));
  } catch {
    // private mode or full: kept for this visit only
  }
}

let data = load();
const save = () => write(data);
const listeners: (() => void)[] = [];
const changed = () => {
  save();
  for (const f of listeners) f();
};

export const progress = {
  /** called after any change (the coin counters redraw) */
  onChange(f: () => void) {
    listeners.push(f);
  },

  endings: (tale: string): string[] => (data.endings[tale] || []).slice(),

  /** An ending reached: remembers it and pays for it. Returns the coins given. */
  reachEnding(tale: string, ending: string, all: string[]): number {
    const got = data.endings[tale] || (data.endings[tale] = []);
    let coins = REWARD.again;
    if (got.indexOf(ending) < 0) {
      got.push(ending);
      coins = REWARD.newEnding;
      if (all.every((e) => got.indexOf(e) >= 0)) coins += REWARD.allEndings;
    }
    data.coins += coins;
    changed();
    return coins;
  },

  heard: (tale: string): string[] => (data.heard[tale] || []).slice(),

  rememberHeard(tale: string, scenes: Iterable<string>) {
    const all = data.heard[tale] || (data.heard[tale] = []);
    for (const s of scenes) if (all.indexOf(s) < 0) all.push(s);
    save();
  },

  met: (hero: string) => data.met.indexOf(hero) >= 0,

  meet(hero: string) {
    if (data.met.indexOf(hero) >= 0) return;
    data.met.push(hero);
    save();
  },

  coins: () => data.coins,

  owns: (item: string) => data.owned.indexOf(item) >= 0,

  /** Buy a thing; false when there aren't coins enough (or it's had already). */
  buy(item: string, price: number): boolean {
    if (data.owned.indexOf(item) >= 0 || data.coins < price) return false;
    data.coins -= price;
    data.owned.push(item);
    changed();
    return true;
  },

  /** slot → the thing a hero wears there */
  wearing: (hero: string): Record<string, string> => ({ ...(data.wear[hero] || {}) }),

  /** Put a thing on (or take the slot's thing off: null). */
  wear(hero: string, slot: string, item: string | null) {
    const w = data.wear[hero] || (data.wear[hero] = {});
    if (item) w[slot] = item;
    else delete w[slot];
    changed();
  },

  /** the clothes on (the hero's checkbox) */
  dressed: (hero: string) => !data.undressed[hero],

  setDressed(hero: string, on: boolean) {
    if (on) delete data.undressed[hero];
    else data.undressed[hero] = true;
    changed();
  },

  /** debug: start over */
  forget() {
    data = empty();
    changed();
  },

  /** debug: some coins to try the shop */
  addCoins(n: number) {
    data.coins += n;
    changed();
  },
};
