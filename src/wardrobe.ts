// The clothes and bits a hero can wear (bought with the coins for endings): every thing, and each
// hero's set. How they are put on a puppet is dress.ts.
//
// The app doesn't load this: it is run when the app is built (vite.config.ts), and each thing is
// drawn into a little file of its own (virtual:item/<id>), fetched only when worn or shown; the
// names, prices and sets go to the heroes' page (virtual:wardrobe-catalog). fit.html (dev) uses it
// whole.

import { INK, st, stroke } from './characters';
import { BODY, type Slot, type Wearable } from './dress';
import wardrobeEdits from './wardrobe-edits.json';
import * as groupA from './items/a';
import * as groupB from './items/b';
import * as groupC from './items/c';
import * as groupD from './items/d';
import * as groupE from './items/e';
import * as groupF from './items/f';
import * as groupG from './items/g';
import * as groupH from './items/h';
import * as groupZmiy from './items/zmiy';
import * as groupRyaba from './items/ryaba';
import * as groupMariyka from './items/mariyka';
import * as groupKit from './items/kit';
import * as groupVedmedi from './items/vedmedi';
import * as groupDuimovochka from './items/duimovochka';

export * from './dress';

export interface Item extends Wearable {
  name: string;
  price: number;
  /** what it needs of the one wearing it: 'twoEyes' — glasses and masks, for a face seen from the front */
  needs?: 'twoEyes';
}

const star = (x: number, y: number, r: number, fill: string) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}" ${st(3)}/>`;
};

export const ITEMS: Item[] = [
  // ---- on the head: the origin is the top of the head, the thing stands on it
  {
    id: 'koruna',
    slot: 'head',
    name: 'Корона',
    price: 20,
    draw: () =>
      `<path d="M-62 6 L-72 -70 L-36 -34 L0 -88 L36 -34 L72 -70 L62 6 Z" fill="#ffd54f" ${stroke}/>` +
      `<rect x="-64" y="-8" width="128" height="16" rx="6" fill="#ffb300" ${st(4)}/>` +
      `<circle cx="0" cy="-30" r="10" fill="#e53935" ${st(3)}/><circle cx="-38" cy="-2" r="6" fill="#1e88e5"/><circle cx="38" cy="-2" r="6" fill="#43a047"/>` +
      `<circle cx="-72" cy="-74" r="7" fill="#fff59d" ${st(3)}/><circle cx="0" cy="-92" r="7" fill="#fff59d" ${st(3)}/><circle cx="72" cy="-74" r="7" fill="#fff59d" ${st(3)}/>`,
  },
  {
    id: 'kovpak',
    slot: 'head',
    name: 'Святковий ковпак',
    price: 10,
    draw: () =>
      `<g transform="scale(.85)"><path d="M-50 6 L0 -130 L50 6 Z" fill="#7e57c2" ${stroke}/>` +
      `<path d="M-32 -46 L-14 -96 M8 -2 L30 -64 M-38 -10 L-24 -50" stroke="#ffeb3b" stroke-width="10" stroke-linecap="round"/>` +
      `<circle cx="0" cy="-134" r="16" fill="#ff7043" ${st(4)}/></g>`,
  },
  {
    id: 'tsylindr',
    slot: 'head',
    name: 'Циліндр',
    price: 15,
    draw: () =>
      `<rect x="-78" y="-10" width="156" height="20" rx="10" fill="#37474f" ${stroke}/>` +
      `<path d="M-48 -4 L-52 -118 L52 -118 L48 -4 Z" fill="#455a64" ${stroke}/>` +
      `<rect x="-50" y="-34" width="100" height="18" fill="#e53935" ${st(3)}/>`,
  },
  {
    id: 'bant',
    slot: 'head',
    name: 'Бант',
    price: 5,
    draw: () =>
      `<g transform="translate(26 -2) rotate(-12) scale(.72)">` +
      `<path d="M0 0 L-70 -44 Q-84 0 -70 44 Z" fill="#ec407a" ${stroke}/>` +
      `<path d="M0 0 L70 -44 Q84 0 70 44 Z" fill="#ec407a" ${stroke}/>` +
      `<circle cx="0" cy="0" r="18" fill="#f48fb1" ${st(4)}/></g>`,
  },
  {
    id: 'vinok',
    slot: 'head',
    name: 'Віночок',
    price: 10,
    draw: () =>
      ['#e53935', '#fdd835', '#1e88e5', '#e53935', '#8e24aa', '#fdd835', '#e53935']
        .map((c, i) => {
          const a = Math.PI * (1.08 + (i / 6) * 0.84);
          return `<circle cx="${(Math.cos(a) * 80).toFixed(0)}" cy="${(30 + Math.sin(a) * 52).toFixed(0)}" r="20" fill="${c}" ${st(3)}/><circle cx="${(Math.cos(a) * 80).toFixed(0)}" cy="${(30 + Math.sin(a) * 52).toFixed(0)}" r="6" fill="#fff59d"/>`;
        })
        .join('') +
      `<path d="M70 20 Q90 90 70 150 M80 18 Q110 80 100 140" stroke="#e53935" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<path d="M74 22 Q100 86 86 146" stroke="#1e88e5" stroke-width="7" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'shapka',
    slot: 'head',
    name: 'Козацька шапка',
    price: 15,
    draw: () =>
      `<path d="M-64 8 Q-70 -60 -40 -78 Q0 -94 40 -78 Q70 -60 64 8 Z" fill="#3e2723" ${stroke}/>` +
      `<path d="M-30 -74 Q10 -120 50 -96 Q60 -60 34 -50 Q10 -66 -30 -74 Z" fill="#c62828" ${st(4)}/>` +
      `<circle cx="52" cy="-50" r="9" fill="#fdd835" ${st(3)}/>` +
      Array.from({ length: 7 }, (_, i) => `<path d="M${-54 + i * 18} 0 q4 -10 8 0" stroke="#5d4037" stroke-width="4" fill="none"/>`).join(''),
  },
  {
    id: 'shelom',
    slot: 'head',
    name: 'Шолом богатиря',
    price: 20,
    draw: () =>
      `<path d="M-66 10 Q-70 -70 0 -110 Q70 -70 66 10 Z" fill="#b0bec5" ${stroke}/>` +
      `<path d="M0 -110 L0 -150" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="-154" r="9" fill="#fdd835" ${st(3)}/>` +
      `<rect x="-70" y="-6" width="140" height="18" rx="6" fill="#ffb300" ${st(4)}/>` +
      `<path d="M-8 10 L-8 60 L8 60 L8 10 Z" fill="#90a4ae" ${st(4)}/>` +
      `<path d="M-40 -60 Q-30 -86 -6 -96" stroke="#eceff1" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'kukhar',
    slot: 'head',
    name: 'Кухарський ковпак',
    price: 10,
    draw: () =>
      `<rect x="-46" y="-40" width="92" height="46" rx="6" fill="#fff" ${stroke}/>` +
      `<path d="M-46 -36 Q-84 -60 -60 -100 Q-46 -126 -14 -112 Q0 -140 24 -116 Q60 -128 66 -92 Q84 -60 46 -36 Z" fill="#fff" ${stroke}/>` +
      `<path d="M-20 -40 V-6 M10 -40 V-6" stroke="#e0e0e0" stroke-width="5"/>`,
  },
  {
    id: 'trykutka',
    slot: 'head',
    name: 'Піратський капелюх',
    price: 15,
    draw: () =>
      `<path d="M-96 0 Q-70 -30 -50 -84 Q0 -110 50 -84 Q70 -30 96 0 Q0 -28 -96 0 Z" fill="#263238" ${stroke}/>` +
      `<path d="M-74 -14 Q0 -40 74 -14" stroke="#fdd835" stroke-width="7" fill="none"/>` +
      `<circle cx="0" cy="-62" r="16" fill="#fff" ${st(3)}/><circle cx="-6" cy="-64" r="3.5" fill="#263238"/><circle cx="6" cy="-64" r="3.5" fill="#263238"/>` +
      `<path d="M-14 -40 L14 -48 M-14 -48 L14 -40" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'pero',
    slot: 'head',
    name: 'Капелюшок з пір’ям',
    price: 10,
    draw: () =>
      `<ellipse cx="0" cy="0" rx="80" ry="16" fill="#2e7d32" ${stroke}/>` +
      `<path d="M-46 -4 Q-48 -70 0 -72 Q48 -70 46 -4 Z" fill="#43a047" ${stroke}/>` +
      `<rect x="-46" y="-22" width="92" height="14" fill="#fdd835" ${st(3)}/>` +
      `<path d="M30 -20 Q70 -90 120 -110 Q90 -60 40 -14 Z" fill="#e53935" ${st(4)}/><path d="M40 -22 Q76 -70 112 -102" stroke="#ffcdd2" stroke-width="3" fill="none"/>`,
  },
  {
    id: 'kvitka',
    slot: 'head',
    name: 'Квіточка',
    price: 5,
    draw: () =>
      `<g transform="translate(48 20)">` +
      [0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-26" rx="16" ry="24" fill="#f06292" ${st(3)} transform="rotate(${a})"/>`).join('') +
      `<circle cx="0" cy="0" r="16" fill="#fdd835" ${st(3)}/></g>`,
  },
  // ---- over the eyes: the origin is between the eyes
  {
    id: 'okuliary',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри',
    price: 10,
    draw: () =>
      `<circle cx="-34" cy="0" r="30" fill="#e3f2fd" fill-opacity=".35" stroke="${INK}" stroke-width="8"/>` +
      `<circle cx="34" cy="0" r="30" fill="#e3f2fd" fill-opacity=".35" stroke="${INK}" stroke-width="8"/>` +
      `<path d="M-6 -4 Q0 -12 6 -4" stroke="${INK}" stroke-width="7" fill="none"/>`,
  },
  {
    id: 'sontsezakhysni',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Сонячні окуляри',
    price: 15,
    draw: () =>
      `<path d="M-72 -18 H-4 Q0 30 -38 30 Q-72 30 -72 -18 Z" fill="#212121" ${st(5)}/>` +
      `<path d="M72 -18 H4 Q0 30 38 30 Q72 30 72 -18 Z" fill="#212121" ${st(5)}/>` +
      `<path d="M-60 -8 l16 0 M14 -8 l16 0" stroke="#90caf9" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-6 -14 H6" stroke="${INK}" stroke-width="7"/>`,
  },
  {
    id: 'piratska',
    slot: 'face',
    name: 'Піратська пов’язка',
    price: 10,
    draw: () =>
      `<path d="M-80 -40 L80 26" stroke="#212121" stroke-width="8" stroke-linecap="round"/>` +
      `<ellipse cx="-34" cy="-6" rx="30" ry="26" fill="#212121" ${st(4)}/>` +
      `<path d="M-44 -10 l8 8 M-34 -10 l-8 8" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'maska',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Маска супергероя',
    price: 15,
    draw: () =>
      `<path d="M-84 -12 Q-60 -34 -30 -26 Q0 -14 30 -26 Q60 -34 84 -12 Q76 30 40 28 Q10 26 0 10 Q-10 26 -40 28 Q-76 30 -84 -12 Z" fill="#e53935" ${stroke}/>` +
      `<ellipse cx="-36" cy="0" rx="18" ry="12" fill="#fff"/><ellipse cx="36" cy="0" rx="18" ry="12" fill="#fff"/>` +
      `<circle cx="-36" cy="0" r="6" fill="#2b1a10"/><circle cx="36" cy="0" r="6" fill="#2b1a10"/>`,
  },
  {
    id: 'monokl',
    slot: 'face',
    name: 'Монокль',
    price: 10,
    draw: () =>
      `<circle cx="34" cy="0" r="30" fill="#e3f2fd" fill-opacity=".4" stroke="#c99a1e" stroke-width="8"/>` +
      `<path d="M58 18 Q70 60 40 100" stroke="#c99a1e" stroke-width="4" fill="none"/>`,
  },
  {
    id: 'serdechka',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-сердечка',
    price: 15,
    draw: () =>
      [-36, 36].map((x) => `<path d="M${x} 26 C${x - 46} -6 ${x - 30} -40 ${x} -18 C${x + 30} -40 ${x + 46} -6 ${x} 26 Z" fill="#ec407a" fill-opacity=".85" ${st(5)}/>`).join('') +
      `<path d="M-6 -8 Q0 -14 6 -8" stroke="${INK}" stroke-width="6" fill="none"/>`,
  },
  // ---- at the mouth: the origin is the mouth
  {
    id: 'vusa',
    slot: 'mouth',
    name: 'Вуса',
    price: 5,
    draw: () =>
      `<path d="M0 -8 Q-30 -24 -54 -6 Q-70 6 -60 18 Q-58 0 -40 4 Q-20 8 0 0 Q20 8 40 4 Q58 0 60 18 Q70 6 54 -6 Q30 -24 0 -8 Z" fill="#5d4037" ${st(4)}/>`,
  },
  {
    id: 'boroda',
    slot: 'mouth',
    name: 'Борода',
    price: 10,
    draw: () =>
      `<path d="M-56 0 Q-70 60 -40 96 Q-20 130 0 136 Q20 130 40 96 Q70 60 56 0 Q30 30 0 26 Q-30 30 -56 0 Z" fill="#8d6e63" ${stroke}/>` +
      `<path d="M-22 50 q4 30 0 54 M0 54 q4 34 0 66 M22 50 q-4 30 0 54" stroke="#6d4c41" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'kozatski',
    slot: 'mouth',
    name: 'Козацькі вуса',
    price: 10,
    draw: () =>
      `<path d="M0 -10 Q-40 -26 -60 10 Q-74 50 -64 90 Q-84 50 -78 10 Q-60 -40 0 -22 Q60 -40 78 10 Q84 50 64 90 Q74 50 60 10 Q40 -26 0 -10 Z" fill="#3e2723" ${st(4)}/>`,
  },
  // ---- round the neck: the origin is under the chin
  {
    id: 'sharf',
    slot: 'neck',
    name: 'Шарфик',
    price: 10,
    draw: () =>
      `<path d="M-70 -14 Q0 24 70 -14 L74 18 Q0 56 -74 18 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M-40 6 L-34 30 M0 14 L0 40 M40 6 L34 30" stroke="#fff59d" stroke-width="9"/>` +
      `<path d="M30 24 L48 110 L82 100 L60 16 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M50 104 l4 18 M62 102 l4 18 M74 100 l4 18" stroke="#fdd835" stroke-width="6" stroke-linecap="round"/>`,
  },
  {
    id: 'metelyk',
    slot: 'neck',
    name: 'Метелик',
    price: 5,
    draw: () =>
      `<path d="M0 0 L-52 -30 Q-62 0 -52 30 Z" fill="#1e88e5" ${stroke}/>` +
      `<path d="M0 0 L52 -30 Q62 0 52 30 Z" fill="#1e88e5" ${stroke}/>` +
      `<circle cx="0" cy="0" r="13" fill="#64b5f6" ${st(4)}/>` +
      star(-30, 0, 9, '#fff59d') +
      star(30, 0, 9, '#fff59d'),
  },
  {
    id: 'namysto',
    slot: 'neck',
    name: 'Намисто',
    price: 15,
    draw: () =>
      Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI * (0.12 + (i / 10) * 0.76);
        return `<circle cx="${(-Math.cos(a) * 74).toFixed(0)}" cy="${(Math.sin(a) * 44 - 20).toFixed(0)}" r="${i === 5 ? 15 : 11}" fill="${i % 2 ? '#c62828' : '#e53935'}" ${st(3)}/>`;
      }).join(''),
  },
  {
    id: 'medal',
    slot: 'neck',
    name: 'Медаль',
    price: 15,
    draw: () =>
      `<path d="M-30 -20 L-12 40 L12 40 L30 -20" fill="none" stroke="#1e88e5" stroke-width="14"/>` +
      `<path d="M-20 -20 L-4 36 M20 -20 L4 36" stroke="#fdd835" stroke-width="5"/>` +
      `<circle cx="0" cy="62" r="28" fill="#ffc83d" ${stroke}/>` +
      star(0, 62, 16, '#fff3c4'),
  },
  {
    id: 'dzvinochok',
    slot: 'neck',
    name: 'Дзвіночок',
    price: 5,
    draw: () =>
      `<path d="M-64 -14 Q0 24 64 -14" stroke="#e53935" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      `<path d="M-22 44 Q-22 4 0 4 Q22 4 22 44 L28 52 L-28 52 Z" fill="#ffc83d" ${stroke}/>` +
      `<circle cx="0" cy="56" r="7" fill="#c98a12" ${st(3)}/>`,
  },
  {
    id: 'kravatka',
    slot: 'neck',
    name: 'Краватка',
    price: 10,
    draw: () =>
      `<path d="M-14 -6 L14 -6 L8 12 L-8 12 Z" fill="#43a047" ${st(4)}/>` +
      `<path d="M-8 12 L-20 92 L0 116 L20 92 L8 12 Z" fill="#43a047" ${stroke}/>` +
      `<path d="M-14 40 L12 30 M-16 70 L16 58 M-12 98 L10 88" stroke="#fdd835" stroke-width="6"/>`,
  },
];

// the heroes' own things (src/items/*.ts)
for (const g of [groupA, groupB, groupC, groupD, groupE, groupF, groupG, groupH, groupZmiy, groupRyaba, groupMariyka, groupKit, groupVedmedi, groupDuimovochka]) ITEMS.push(...g.ITEMS);

/**
 * Changes made on fit.html (dev server, src/wardrobe-edits.json): things taken away from the
 * wardrobe, and things moved to another slot.
 */
export const EDITS = wardrobeEdits as { removed: string[]; slot: Record<string, Slot> };
/** prices: 40% off what the things were drawn with (coins come only from endings: ~60 a tale) */
const PRICE = 0.6;
for (const it of ITEMS) it.price = Math.max(3, Math.round(it.price * PRICE));

/** where each thing was drawn to go (before a move on fit.html) */
export const DRAWN_SLOT: Record<string, Slot> = {};
for (const it of ITEMS) {
  DRAWN_SLOT[it.id] = it.slot;
  if (EDITS.slot[it.id]) it.slot = EDITS.slot[it.id];
}

export const itemById = (id: string) => ITEMS.find((i) => i.id === id);

// ---------- each hero's own things: what suits it ----------
const SETS: Record<string, string> = {
  elder: 'shapka pero koruna okuliary monokl kozatski medal kravatka',
  bogatyr: 'shelom shapka koruna sontsezakhysni maska kozatski medal sharf',
  boy: 'pero kovpak trykutka piratska okuliary sontsezakhysni metelyk sharf',
  girl: 'kvitka bant koruna serdechka sontsezakhysni namysto dzvinochok',
  dog: 'kovpak trykutka bant piratska okuliary dzvinochok metelyk medal',
  cat: 'koruna bant tsylindr monokl serdechka vusa dzvinochok kravatka',
  bird: 'pero koruna kovpak monokl metelyk sharf kravatka',
  dragon: 'koruna shelom sontsezakhysni maska vusa metelyk medal',
};
const HERO_ITEMS: Record<string, string> = {
  did: SETS.elder,
  knyaz: 'koruna shapka pero monokl okuliary kozatski medal namysto',
  koval: 'shapka kukhar pero sontsezakhysni okuliary kozatski medal sharf',
  muzhychok: 'kovpak koruna pero monokl okuliary vusa medal metelyk',
  baba: 'kukhar kvitka vinok okuliary serdechka namysto sharf',
  kolobok: 'kovpak koruna bant kukhar sontsezakhysni serdechka vusa metelyk',
  zayets: 'bant pero kovpak okuliary maska metelyk sharf',
  vovk: 'trykutka tsylindr piratska sontsezakhysni kozatski kravatka medal',
  vedmid: 'koruna shapka kovpak okuliary boroda sharf medal',
  lysytsia: 'kvitka bant pero serdechka sontsezakhysni namysto sharf',
  myshka: 'kvitka bant kovpak okuliary serdechka namysto dzvinochok',
  zhabka: 'koruna sontsezakhysni serdechka namysto metelyk',
  kaban: 'shapka trykutka piratska sontsezakhysni kozatski medal',
  koza: 'vinok kvitka bant sharf namysto',
  yizhachok: 'pero kovpak okuliary maska metelyk sharf',
  rak: 'koruna trykutka piratska sontsezakhysni vusa kravatka',
  hryfon: 'shelom trykutka piratska monokl medal sharf',
  solombychok: 'kvitka vinok kovpak okuliary dzvinochok metelyk',
  vnuchka: SETS.girl,
  nevista: SETS.girl,
  knyazivna: 'kvitka bant serdechka sontsezakhysni namysto dzvinochok',
  olenka: 'koruna kvitka bant serdechka maska namysto metelyk',
  telesyk: SETS.boy,
  pastushok: SETS.boy,
  kyrylo: SETS.bogatyr,
  kotyhoroshko: SETS.bogatyr,
  vernyhora: SETS.bogatyr,
  vernydub: SETS.bogatyr,
  krutyvus: SETS.bogatyr,
  zhuchka: SETS.dog,
  sobaka: SETS.dog,
  sirko: SETS.dog,
  kishka: SETS.cat,
  kit: SETS.cat,
  pivnyk: SETS.bird,
  zhuravel: SETS.bird,
  gusenia: SETS.bird,
  // his own things only (items/zmiy.ts)
  zmiy: '',
  zmiyuchka: SETS.dragon,
  // and her own things (items/ryaba.ts)
  ryaba: 'koruna bant kvitka serdechka namysto',
  // and hers (items/mariyka.ts)
  mariyka: 'kvitka bant serdechka sontsezakhysni namysto',
  // the heroes of «Кіт у чоботях»: a few common things, and their own (items/kit.ts)
  kit_chobotar: 'monokl metelyk kravatka',
  markiz: 'tsylindr okuliary metelyk',
  korol: 'koruna monokl medal',
  pryntsesa: 'koruna bant serdechka namysto',
  lyudozher: 'kovpak sontsezakhysni sharf',
  // the heroes of «Три ведмеді»: a few common things, and their own (items/vedmedi.ts)
  masha: 'bant serdechka namysto',
  vedmedytsia: 'kvitka okuliary namysto',
  mishko: 'kovpak metelyk sharf',
  // the heroes of «Дюймовочка»: a few common things, and their own (items/duimovochka.ts)
  duimovochka: 'kvitka koruna namysto',
  zhuk: 'kovpak monokl metelyk',
  krit: 'tsylindr medal kravatka',
  lastivka: 'pero bant sharf',
  elf: 'pero metelyk sharf',
};

for (const g of [groupA, groupB, groupC, groupD]) Object.assign(HERO_ITEMS, g.SETS);
// the later groups add to the sets
for (const g of [groupE, groupF, groupG, groupH, groupZmiy, groupRyaba, groupMariyka, groupKit, groupVedmedi, groupDuimovochka])
  for (const h of Object.keys(g.SETS)) HERO_ITEMS[h] = ((HERO_ITEMS[h] || '') + ' ' + g.SETS[h]).trim();

export const FITTED_HEROES = Object.keys(HERO_ITEMS);

/** the things this hero can wear (everything, for one not listed) */
export function itemsFor(hero: string): Item[] {
  return allItemsFor(hero).filter((i) => EDITS.removed.indexOf(i.id) < 0);
}

/** the things of this hero's set, the ones taken away too (for fit.html) */
export function allItemsFor(hero: string): Item[] {
  const ids = HERO_ITEMS[hero];
  const list = ids === undefined ? ITEMS : ids ? ids.split(' ').map((id) => itemById(id)!).filter(Boolean) : [];
  const body = BODY[hero];
  const side = body && body.view === 'side';
  return list.filter((i) => !(side && i.needs === 'twoEyes') && !(body && body.never && body.never.indexOf(i.id) >= 0));
}

