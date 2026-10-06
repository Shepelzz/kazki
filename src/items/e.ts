// Clothes and more things of the heroes' wardrobe, group e (see wardrobe.ts and items/a.ts).
// SETS here ADD to a hero's set (they don't replace it).
//
// The clothes (torso / legs / feet) are drawn in each puppet's own numbers (src/characters.ts):
// over its body, a little wider, so its own shirt and trousers don't show.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** a five-pointed star path */
const starPath = (x: number, y: number, r: number) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return d + 'Z';
};
const star = (x: number, y: number, r: number, fill: string, w = 3) => `<path d="${starPath(x, y, r)}" fill="${fill}" ${st(w)}/>`;

/** an arm (or a leg) as a thick line: ink outline, then the colour; extra: a second pattern stroke */
const limb = (d: string, color: string, w: number, extra = '') =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>` +
  extra;
/** the same shape mirrored to the right (x → -x) */
const both = (s: string) => s + `<g transform="scale(-1 1)">${s}</g>`;
/** small dots spread over a box (polka dots, prints) */
const dots = (pts: [number, number][], r: number, fill: string) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
/** a hibiscus flower */
const flower = (x: number, y: number, r: number, petal: string, mid = '#fff176') =>
  [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - r * 0.55}" rx="${r * 0.42}" ry="${r * 0.6}" fill="${petal}" transform="rotate(${a} ${x} ${y})"/>`).join('') +
  `<circle cx="${x}" cy="${y}" r="${r * 0.3}" fill="${mid}"/>`;
/** a pineapple */
const ananas = (x: number, y: number) =>
  `<path d="M${x} ${y - 8} l-6 -10 l6 4 l0 -8 l4 8 l6 -6 l-4 10 Z" fill="#43a047"/>` +
  `<ellipse cx="${x + 1}" cy="${y + 4}" rx="7" ry="10" fill="#fb8c00" ${st(2)}/>` +
  `<path d="M${x - 4} ${y} l8 8 M${x + 5} ${y - 2} l-8 9" stroke="#bf360c" stroke-width="1.5"/>`;

// ---------------- дід: his body (feet at 0, shirt -255..-112, arms from the shoulders ±60,-250) ----------------
const DID_SHIRT = 'M-67 -262 Q-87 -180 -80 -104 L80 -104 Q87 -180 67 -262 Q0 -282 -67 -262 Z';
const DID_ARM = 'M-60 -250 Q-98 -200 -92 -140';
const didSleeves = (color: string, extra = '') => both(limb(DID_ARM, color, 30, extra));
/** the grandfather's bare arm (short sleeves) */
const didBareArms = both(limb('M-80 -210 Q-96 -180 -92 -140', '#f2c4a0', 26));
// his trousers: two legs, under the shirt to the boots
const didLeg = (fill: string, extra = '') => both(`<path d="M-45 -124 L-47 -10 L-2 -10 L-1 -124 Z" fill="${fill}" ${stroke}/>${extra}`);

// a beard at the mouth (u = 100; the mouth at 0,0): cheek to cheek, down the chest
const BEARD = 'M-86 -58 Q-102 40 -52 100 Q-22 138 0 140 Q22 138 52 100 Q102 40 86 -58 Q70 -20 40 -14 Q0 -22 -40 -14 Q-70 -20 -86 -58 Z';
const MOUSTACHE = 'M0 -14 Q-30 -38 -62 -18 Q-76 -6 -66 8 Q-50 -4 -30 2 Q-12 6 0 0 Q12 6 30 2 Q50 -4 66 8 Q76 -6 62 -18 Q30 -38 0 -14 Z';

// ---------------- the Did ----------------
const didItems: Item[] = [
  // ---- hats
  {
    id: 'did_vushanka',
    slot: 'head',
    name: 'Вушанка',
    price: 15,
    draw: () =>
      // one flap down, the other sticking up like a wing
      `<path d="M50 -20 Q100 -60 118 -110 Q126 -84 112 -50 Q96 -14 62 0 Z" fill="#6d4c41" ${stroke}/>` +
      `<path d="M-60 -6 Q-82 30 -78 76 Q-60 90 -44 74 Q-44 30 -36 -2 Z" fill="#6d4c41" ${stroke}/>` +
      `<path d="M-74 66 Q-62 80 -48 68" stroke="#d7ccc8" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M-60 4 Q-66 -70 0 -80 Q66 -70 60 4 Z" fill="#795548" ${stroke}/>` +
      `<path d="M-72 -26 Q0 -44 72 -26 L72 8 Q0 -6 -72 8 Z" fill="#d7ccc8" ${stroke}/>` +
      [-56, -34, -12, 12, 34, 56].map((x) => `<path d="M${x - 6} -22 q6 -10 12 0" stroke="#a1887f" stroke-width="3" fill="none"/>`).join('') +
      star(0, -50, 16, '#e53935'),
  },
  {
    id: 'did_kovboi',
    slot: 'head',
    name: 'Ковбойський капелюх',
    price: 20,
    draw: () =>
      `<path d="M-52 -10 Q-60 -84 -40 -96 Q-20 -84 0 -98 Q20 -84 40 -96 Q60 -84 52 -10 Z" fill="#b5763a" ${stroke}/>` +
      `<path d="M-6 -90 Q0 -60 -4 -30" stroke="#8d5524" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-54 -34 Q0 -24 54 -34 L54 -16 Q0 -6 -54 -16 Z" fill="#3e2723" ${st(4)}/>` +
      star(0, -26, 12, '#ffd54f') +
      `<path d="M-120 -30 Q-110 6 -64 4 Q0 18 64 4 Q110 6 120 -30 Q96 -8 60 -16 Q0 -26 -60 -16 Q-96 -8 -120 -30 Z" fill="#c68642" ${stroke}/>`,
  },
  {
    id: 'did_kepka',
    slot: 'head',
    name: 'Кепка задом наперед',
    price: 10,
    draw: () =>
      // the peak sticks out behind, up and to the side
      `<path d="M14 -56 Q70 -112 128 -96 Q118 -64 44 -30 Z" fill="#1565c0" ${stroke}/>` +
      `<path d="M-62 6 Q-64 -72 0 -76 Q64 -72 62 6 Z" fill="#29b6f6" ${stroke}/>` +
      `<path d="M0 -76 Q-18 -40 -20 4 M0 -76 Q18 -40 20 4" stroke="#0288d1" stroke-width="4" fill="none"/>` +
      `<circle cx="0" cy="-76" r="8" fill="#1565c0" ${st(3)}/>` +
      // the strap hole at the front, the head showing through
      `<path d="M-24 6 Q-24 -26 0 -26 Q24 -26 24 6 Z" fill="#f2c4a0" ${st(4)}/>` +
      `<path d="M-24 -6 H24" stroke="#1565c0" stroke-width="8"/>`,
  },
  {
    id: 'did_pompon',
    slot: 'head',
    name: 'Шапка з помпоном',
    price: 10,
    draw: () =>
      `<path d="M-60 0 Q-64 -84 0 -90 Q64 -84 60 0 Z" fill="#43a047" ${stroke}/>` +
      `<path d="M-62 -30 Q0 -44 62 -30 M-58 -58 Q0 -72 58 -58" stroke="#fff" stroke-width="12" fill="none"/>` +
      `<path d="M-60 0 Q-64 -84 0 -90 Q64 -84 60 0" fill="none" ${stroke}/>` +
      `<rect x="-68" y="-14" width="136" height="26" rx="10" fill="#e53935" ${stroke}/>` +
      Array.from({ length: 9 }, (_, i) => `<path d="M${-56 + i * 14} -10 v18" stroke="#b71c1c" stroke-width="4"/>`).join('') +
      [0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${(Math.cos((a * Math.PI) / 180) * 16).toFixed(1)}" cy="${(-112 + Math.sin((a * Math.PI) / 180) * 16).toFixed(1)}" r="14" fill="#fff59d" ${st(3)}/>`).join('') +
      `<circle cx="0" cy="-112" r="16" fill="#fff59d"/>`,
  },
  {
    id: 'did_tsylindr',
    slot: 'head',
    name: 'Циліндр з ромашкою',
    price: 20,
    draw: () =>
      `<g transform="rotate(-8)">` +
      `<path d="M-46 -4 L-54 -150 L54 -150 L46 -4 Z" fill="#4a148c" ${stroke}/>` +
      `<ellipse cx="0" cy="-150" rx="54" ry="10" fill="#6a1b9a" ${st(4)}/>` +
      `<path d="M-50 -46 L50 -46 L49 -24 L-49 -24 Z" fill="#ffd54f" ${st(4)}/>` +
      // a daisy on a wobbly stem
      `<path d="M30 -40 Q70 -120 40 -200" stroke="#43a047" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M52 -110 q22 -16 30 2 q-18 10 -30 -2 Z" fill="#66bb6a" ${st(3)}/>` +
      Array.from({ length: 10 }, (_, i) => `<ellipse cx="40" cy="-222" rx="8" ry="20" fill="#fff" ${st(3)} transform="rotate(${i * 36} 40 -200)"/>`).join('') +
      `<circle cx="40" cy="-200" r="13" fill="#fdd835" ${st(3)}/>` +
      `<rect x="-86" y="-12" width="172" height="20" rx="10" fill="#4a148c" ${stroke}/>` +
      `</g>`,
  },
  {
    id: 'did_vikinh',
    slot: 'head',
    name: 'Шолом вікінга',
    price: 20,
    draw: () =>
      `<path d="M-56 -30 Q-100 -40 -110 -110 Q-86 -70 -52 -66 Z" fill="#fff8e1" ${stroke}/>` +
      `<path d="M56 -30 Q100 -40 110 -110 Q86 -70 52 -66 Z" fill="#fff8e1" ${stroke}/>` +
      `<path d="M-62 6 Q-66 -84 0 -88 Q66 -84 62 6 Z" fill="#b0bec5" ${stroke}/>` +
      `<path d="M0 -88 V6" stroke="#78909c" stroke-width="10"/>` +
      `<rect x="-66" y="-16" width="132" height="22" rx="6" fill="#8d6e63" ${st(4)}/>` +
      [-48, -24, 24, 48].map((x) => `<circle cx="${x}" cy="-5" r="4" fill="#ffd54f"/>`).join(''),
  },
  // ---- beards and moustaches (his own beard comes off)
  {
    id: 'did_ruda',
    beard: true,
    slot: 'mouth',
    name: 'Руда борода',
    price: 15,
    draw: () =>
      `<path d="${BEARD}" fill="#ef6c00" ${stroke}/>` +
      [[-50, 40], [-20, 70], [20, 60], [50, 30], [0, 104], [-40, 90], [36, 96]].map(([x, y]) => `<path d="M${x - 10} ${y} q10 -14 20 0 q-4 12 -12 6" stroke="#bf360c" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') +
      `<path d="${MOUSTACHE}" fill="#ff8f00" ${st(4)}/>`,
  },
  {
    id: 'did_kosychka',
    beard: true,
    slot: 'mouth',
    name: 'Борода-косичка',
    price: 15,
    draw: () =>
      `<path d="M-84 -56 Q-96 30 -40 70 L40 70 Q96 30 84 -56 Q66 -18 36 -14 Q0 -22 -36 -14 Q-66 -18 -84 -56 Z" fill="#eceff1" ${stroke}/>` +
      // the plait: fat little loaves down to a red bow
      Array.from({ length: 6 }, (_, i) => {
        const x = i % 2 ? 10 : -10;
        const y = 70 + i * 34;
        return `<ellipse cx="${x}" cy="${y}" rx="30" ry="22" fill="#eceff1" ${st(4)} transform="rotate(${i % 2 ? -28 : 28} ${x} ${y})"/>`;
      }).join('') +
      `<path d="M0 262 L-46 236 Q-54 264 -46 290 Z M0 262 L46 236 Q54 264 46 290 Z" fill="#e53935" ${stroke}/><circle cx="0" cy="262" r="13" fill="#ef9a9a" ${st(4)}/>` +
      `<path d="M-6 276 Q-20 310 -4 330 M6 276 Q20 306 12 326" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/>` +
      `<path d="M-6 276 Q-20 310 -4 330 M6 276 Q20 306 12 326" stroke="#eceff1" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<path d="${MOUSTACHE}" fill="#fff" ${st(4)}/>`,
  },

  {
    id: 'did_zakrutky',
    beard: true,
    slot: 'mouth',
    name: 'Вуса-закрутки',
    price: 10,
    draw: () =>
      both(
        `<path d="M0 -10 Q-36 -44 -76 -20 Q-100 -6 -118 -30 Q-132 -58 -108 -70 Q-86 -76 -86 -56 Q-88 -44 -100 -48 Q-90 -40 -84 -38 Q-62 -30 -52 0 Q-26 16 0 4 Z" fill="#3e2723" ${st(5)}/>` +
          `<path d="M-30 -22 Q-56 -30 -76 -14" stroke="#8d6e63" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      ),
  },

  {
    id: 'did_lopata',
    beard: true,
    slot: 'mouth',
    name: 'Чорна борода-лопата',
    price: 15,
    draw: () =>
      `<path d="M-86 -58 Q-94 20 -84 70 Q-104 150 -80 168 L80 168 Q104 150 84 70 Q94 20 86 -58 Q70 -20 40 -14 Q0 -22 -40 -14 Q-70 -20 -86 -58 Z" fill="#212121" ${stroke}/>` +
      `<path d="M-60 40 Q-70 100 -60 156 M-30 30 Q-36 100 -30 160 M0 34 V162 M30 30 Q36 100 30 160 M60 40 Q70 100 60 156" stroke="#555" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="${MOUSTACHE}" fill="#3a3a3a" ${st(4)}/>`,
  },

  {
    id: 'did_fioletova',
    beard: true,
    slot: 'mouth',
    name: 'Фіолетова борода',
    price: 20,
    draw: () =>
      `<path d="${BEARD}" fill="#8e24aa" ${stroke}/>` +
      `<path d="M-40 20 q4 40 0 70 M0 30 q4 50 0 90 M40 20 q-4 40 0 70" stroke="#6a1b9a" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      star(-52, 50, 10, '#fff59d') +
      star(30, 84, 9, '#fff59d') +
      star(56, 20, 7, '#fff59d') +
      `<path d="${MOUSTACHE}" fill="#ab47bc" ${st(4)}/>`,
  },
  {
    id: 'did_veselka',
    beard: true,
    slot: 'mouth',
    name: 'Борода-веселка',
    price: 25,
    draw: () =>
      `<path d="${BEARD}" fill="#8e24aa" ${stroke}/>` +
      ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5']
        .map((c, i) => {
          const w = 80 - i * 15;
          const b = 126 - i * 17;
          const t = [-40, -26, -14, -6, 0][i];
          return `<path d="M${-w} ${t} Q${-w - 4} ${b - 30} 0 ${b} Q${w + 4} ${b - 30} ${w} ${t}" stroke="${c}" stroke-width="16" fill="none"/>`;
        })
        .join('') +
      `<path d="${BEARD}" fill="none" ${stroke}/>` +
      `<path d="${MOUSTACHE}" fill="#fff" ${st(4)}/>`,
  },

  // ---- shirts and jackets
  {
    id: 'did_kovboika',
    slot: 'torso',
    name: 'Ковбойська сорочка',
    price: 20,
    draw: () =>
      `<path d="${DID_SHIRT}" fill="#e53935"/>` +
      [-48, -16, 16, 48].map((x) => `<path d="M${x} -256 V-106" stroke="#b71c1c" stroke-width="12" opacity=".8"/>`).join('') +
      [-236, -200, -164, -128].map((y) => `<path d="M-74 ${y} H74" stroke="#b71c1c" stroke-width="12" opacity=".8"/>`).join('') +
      [-32, 0, 32].map((x) => `<path d="M${x} -256 V-106" stroke="#fff" stroke-width="3" opacity=".7"/>`).join('') +
      `<path d="${DID_SHIRT}" fill="none" ${stroke}/>` +
      `<path d="M-74 -216 Q-40 -196 0 -214 Q40 -196 74 -216" stroke="#fff8e1" stroke-width="6" fill="none"/>` +
      [-180, -150, -120].map((y) => `<circle cx="0" cy="${y}" r="5" fill="#fff8e1" ${st(2)}/>`).join('') +
      didSleeves('#e53935', both(`<path d="${DID_ARM}" fill="none" stroke="#b71c1c" stroke-width="30" stroke-dasharray="8 14"/>`)),
  },
  {
    id: 'did_havaika',
    slot: 'torso',
    name: 'Гавайка з ананасами',
    price: 20,
    draw: () =>
      didBareArms +
      `<path d="${DID_SHIRT}" fill="#4dd0e1" ${stroke}/>` +
      flower(-50, -230, 18, '#ec407a') +
      flower(46, -176, 20, '#ec407a') +
      flower(-34, -138, 16, '#ff7043') +
      flower(56, -238, 14, '#ff7043') +
      ananas(-56, -186) +
      ananas(20, -130) +
      ananas(30, -222) +
      `<path d="M0 -205 V-106" stroke="${INK}" stroke-width="4"/>` +
      [-180, -150, -120].map((y) => `<circle cx="6" cy="${y}" r="4" fill="#fff"/>`).join('') +
      both(`<path d="M-60 -254 Q-92 -236 -96 -196 L-68 -186 Q-66 -210 -56 -226 Z" fill="#4dd0e1" ${stroke}/>` + flower(-78, -214, 10, '#ec407a')),
  },
  {
    id: 'did_olimpiika',
    slot: 'torso',
    name: 'Дідова олімпійка',
    price: 15,
    draw: () =>
      `<path d="${DID_SHIRT}" fill="#1e4fd8" ${stroke}/>` +
      `<path d="M-79 -122 L79 -122" stroke="#fff" stroke-width="8"/>` +
      `<path d="M0 -205 V-104" stroke="#cfd8dc" stroke-width="6"/>` +
      `<path d="M0 -205 V-104" stroke="${INK}" stroke-width="2" stroke-dasharray="3 3"/>` +
      `<rect x="-6" y="-196" width="12" height="18" rx="3" fill="#ffd54f" ${st(2)}/>` +
      star(-40, -150, 14, '#ffd54f') +
      didSleeves('#1e4fd8') +
      both(`<path d="M-64 -252 Q-104 -200 -98 -146 M-56 -250 Q-94 -200 -88 -144" fill="none" stroke="#fff" stroke-width="5"/>`),
  },
  // ---- trousers
  {
    id: 'did_pidtiazhky',
    slot: 'legs',
    name: 'Штани на підтяжках',
    price: 15,
    draw: () =>
      didLeg('#8d6e63', `<path d="M-40 -60 H-6" stroke="#6d4c41" stroke-width="3" stroke-dasharray="5 4"/>`) +
      // the braces have slipped off the shoulders: they hang down in loops
      both(
        `<path d="M-40 -112 Q-62 -80 -50 -46 Q-44 -34 -34 -46 Q-30 -80 -24 -112" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
          `<path d="M-40 -112 Q-62 -80 -50 -46 Q-44 -34 -34 -46 Q-30 -80 -24 -112" stroke="#e53935" stroke-width="6" fill="none" stroke-linecap="round"/>` +
          `<rect x="-50" y="-48" width="12" height="9" rx="2" fill="#ffd54f" ${st(2)}/>`,
      ),
  },

  {
    id: 'did_sharovary',
    slot: 'legs',
    name: 'Козацькі шаровари',
    price: 20,
    draw: () =>
      both(
        `<path d="M-1 -124 Q-80 -128 -72 -62 Q-68 -24 -42 -14 L-8 -14 Q-2 -40 -1 -124 Z" fill="#d32f2f" ${stroke}/>` +
          `<path d="M-50 -96 Q-60 -60 -46 -30 M-30 -100 Q-38 -60 -26 -24" stroke="#b71c1c" stroke-width="5" fill="none" stroke-linecap="round"/>` +
          `<path d="M-44 -18 L-8 -18" stroke="#ffd54f" stroke-width="8" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'did_zebra',
    slot: 'legs',
    name: 'Штани-зебра',
    price: 15,
    draw: () =>
      didLeg(
        '#fff',
        [-108, -84, -60, -36].map((y) => `<path d="M-44 ${y} Q-30 ${y - 10} -22 ${y + 2} Q-14 ${y + 12} -2 ${y - 4} L-2 ${y + 8} Q-14 ${y + 22} -24 ${y + 10} Q-32 ${y} -44 ${y + 10} Z" fill="#212121"/>`).join('') +
          `<path d="M-45 -124 L-47 -10 L-2 -10 L-1 -124 Z" fill="none" ${stroke}/>`,
      ),
  },
  // ---- shoes
  {
    id: 'did_chobity',
    slot: 'feet',
    name: 'Ковбойські чоботи',
    price: 20,
    draw: () =>
      both(
        `<path d="M-6 -66 L-44 -66 L-42 -24 Q-62 -22 -70 -8 Q-70 2 -58 2 L-4 2 Z" fill="#a0522d" ${stroke}/>` +
          `<path d="M-46 -66 L-4 -66 L-6 -54 L-44 -54 Z" fill="#6d3b1a" ${st(4)}/>` +
          star(-24, -36, 9, '#ffd54f') +
          `<path d="M-16 2 h14 v-10 h-14 Z" fill="#3e2723" ${st(3)}/>` +
          `<circle cx="2" cy="-12" r="6" fill="#ffd54f" ${st(2)}/>`,
      ),
  },
  {
    id: 'did_kedy',
    slot: 'feet',
    name: 'Червоні кеди',
    price: 15,
    draw: () =>
      both(
        `<path d="M-4 -44 L-40 -44 L-42 -18 Q-62 -16 -62 -4 L-62 2 L-4 2 Z" fill="#e53935" ${stroke}/>` +
          `<path d="M-62 -6 Q-62 -18 -44 -18 L-40 -6 Z" fill="#fff" ${st(3)}/>` +
          `<path d="M-64 -6 L-3 -6 L-3 3 L-64 3 Z" fill="#fff" ${st(3)}/>` +
          `<path d="M-36 -36 l12 6 M-36 -28 l12 6 M-24 -36 l-12 6 M-24 -28 l-12 6" stroke="#fff" stroke-width="3"/>` +
          `<circle cx="-12" cy="-30" r="7" fill="#fff" ${st(2)}/>` +
          star(-12, -30, 5, '#1e88e5', 0),
      ),
  },
  {
    id: 'did_shlopantsi',
    slot: 'feet',
    name: 'Шльопанці зі шкарпетками',
    price: 10,
    draw: () =>
      both(
        `<path d="M-4 -54 L-42 -54 L-42 -14 Q-60 -14 -60 -4 L-4 -4 Z" fill="#fff" ${stroke}/>` +
          `<path d="M-42 -48 H-4 M-42 -40 H-4" stroke="#e53935" stroke-width="5"/>` +
          `<rect x="-66" y="-6" width="66" height="9" rx="4" fill="#1e88e5" ${st(3)}/>` +
          `<path d="M-60 -6 Q-56 -24 -34 -24 L-34 -6 Z" fill="#1e88e5" ${st(3)}/>`,
      ),
  },
];

// ---------------- shapes that follow a body ----------------
/** half the width of an ellipse at height y */
const ellW = (cx: number, cy: number, rx: number, ry: number) => (y: number) => {
  void cx;
  const t = (y - cy) / ry;
  return t * t >= 1 ? 0 : rx * Math.sqrt(1 - t * t);
};
/** half the width of a symmetric body drawn by a cubic from its top middle down its right side */
const cubicW = (p: [number, number][]) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const a = (1 - t) ** 3;
    const b = 3 * (1 - t) ** 2 * t;
    const c = 3 * (1 - t) * t * t;
    const d = t ** 3;
    pts.push([a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]]);
  }
  pts.sort((u, v) => u[1] - v[1]);
  return (y: number) => {
    if (y <= pts[0][1]) return pts[0][0];
    for (let i = 1; i < pts.length; i++)
      if (y <= pts[i][1]) {
        const [x0, y0] = pts[i - 1];
        const [x1, y1] = pts[i];
        return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0 || 1);
      }
    return pts[pts.length - 1][0];
  };
};
/** horizontal bands of colour inside a body (its half width hw(y)), from y0 down to y1, in cx */
const bands = (colors: string[], y0: number, y1: number, h: number, hw: (y: number) => number, cx = 0) => {
  let s = '';
  for (let y = y0, i = 0; y < y1; y += h, i++) {
    const ya = y;
    const yb = Math.min(y + h, y1);
    const L: string[] = [];
    const R: string[] = [];
    for (let k = 0; k <= 4; k++) {
      const yy = ya + ((yb - ya) * k) / 4;
      const w = hw(yy);
      L.push(`${(cx - w).toFixed(1)} ${yy.toFixed(1)}`);
      R.unshift(`${(cx + w).toFixed(1)} ${yy.toFixed(1)}`);
    }
    s += `<path d="M${L.join(' L')} L${R.join(' L')} Z" fill="${colors[i % colors.length]}"/>`;
  }
  return s;
};
const text = (x: number, y: number, size: number, fill: string, t: string, rot = 0) =>
  `<text x="${x}" y="${y}" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="900" font-size="${size}" text-anchor="middle" fill="${fill}" stroke="${INK}" stroke-width="1.5"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${t}</text>`;

// ---------------- баба (skirt -170..-6, blouse -238..-165, arms folded in front) ----------------
const BABA_TOP = 'M-60 -246 Q-74 -200 -65 -156 L65 -156 Q74 -200 60 -246 Q0 -264 -60 -246 Z';
const BABA_ARM = 'M-52 -232 Q-86 -190 -40 -170';
const BABA_SKIRT = 'M-62 -176 L-93 -2 Q0 8 93 -2 L62 -176 Z';
const babaShoes = (one: string) => both(`<g transform="translate(-46 0)">${one}</g>`);

const babaItems: Item[] = [
  {
    id: 'baba_leopard',
    slot: 'torso',
    name: 'Леопардова кофта',
    price: 20,
    draw: () => {
      const spot = (x: number, y: number) =>
        `<path d="M${x - 7} ${y} q2 -8 8 -7 q8 2 6 9 q-3 7 -9 5 q-6 -1 -5 -7 Z" fill="#c8862f" stroke="#3e2723" stroke-width="3"/>`;
      return (
        `<path d="${BABA_TOP}" fill="#f6c25a" ${stroke}/>` +
        [[-40, -230], [-12, -214], [24, -226], [44, -200], [-46, -190], [-16, -180], [16, -192], [40, -170], [-30, -164], [6, -164]].map(([x, y]) => spot(x, y)).join('') +
        both(limb(BABA_ARM, '#f6c25a', 30, `<path d="${BABA_ARM}" fill="none" stroke="#3e2723" stroke-width="10" stroke-dasharray="3 14"/>`))
      );
    },
  },
  {
    id: 'baba_sport',
    slot: 'torso',
    name: 'Рожева олімпійка',
    price: 15,
    draw: () =>
      `<path d="${BABA_TOP}" fill="#f06292" ${stroke}/>` +
      `<path d="M0 -232 V-156" stroke="#fce4ec" stroke-width="6"/><path d="M0 -232 V-156" stroke="${INK}" stroke-width="2" stroke-dasharray="3 3"/>` +
      `<path d="M-30 -196 q-8 -10 0 -14 q6 -2 8 4 q2 -6 8 -4 q8 4 0 14 l-8 8 Z" fill="#fff" ${st(2)}/>` +
      both(limb(BABA_ARM, '#f06292', 30, `<path d="M-60 -236 Q-96 -190 -46 -162" fill="none" stroke="#fff" stroke-width="5"/>`)),
  },
  {
    id: 'baba_disko',
    slot: 'torso',
    name: 'Кофта з блискітками',
    price: 25,
    draw: () =>
      `<path d="${BABA_TOP}" fill="#ffca28" ${stroke}/>` +
      Array.from({ length: 30 }, (_, i) => {
        const x = -54 + (i % 6) * 21 + (Math.floor(i / 6) % 2) * 10;
        const y = -238 + Math.floor(i / 6) * 16;
        return `<circle cx="${x}" cy="${y}" r="5" fill="${i % 3 ? '#fff8e1' : '#ff8f00'}" opacity=".9"/>`;
      }).join('') +
      `<path d="${BABA_TOP}" fill="none" ${stroke}/>` +
      both(limb(BABA_ARM, '#ffca28', 30, `<path d="${BABA_ARM}" fill="none" stroke="#fff8e1" stroke-width="10" stroke-dasharray="0 12" stroke-linecap="round"/>`)) +
      star(58, -250, 10, '#fff') +
      star(-64, -150, 8, '#fff'),
  },
  {
    id: 'baba_kurochky',
    slot: 'legs',
    name: 'Спідниця з курочками',
    price: 15,
    draw: () => {
      const kurka = (x: number, y: number) =>
        `<ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="#fff" ${st(2)}/><circle cx="${x - 9}" cy="${y - 7}" r="5" fill="#fff" ${st(2)}/>` +
        `<path d="M${x - 12} ${y - 12} l2 -4 l2 3 l2 -3 l1 4" fill="#e53935"/><path d="M${x - 14} ${y - 7} l-4 1 l4 2 Z" fill="#ffa000"/>` +
        `<circle cx="${x - 10}" cy="${y - 8}" r="1.2" fill="${INK}"/><path d="M${x - 2} ${y + 8} v4 M${x + 3} ${y + 8} v4" stroke="#ffa000" stroke-width="2"/>`;
      return (
        `<path d="${BABA_SKIRT}" fill="#66bb6a" ${stroke}/>` +
        [[-30, -144], [26, -150], [-52, -100], [6, -106], [56, -96], [-68, -46], [-18, -52], [34, -48], [76, -36]].map(([x, y]) => kurka(x, y)).join('') +
        `<path d="M-90 -14 Q0 -4 90 -14" stroke="#fdd835" stroke-width="7" fill="none"/>`
      );
    },
  },

  {
    id: 'baba_abazhur',
    slot: 'legs',
    name: 'Спідниця-абажур',
    price: 20,
    draw: () =>
      `<path d="M-62 -176 L-93 -14 L93 -14 L62 -176 Z" fill="#ffb74d" ${stroke}/>` +
      [-48, -24, 0, 24, 48].map((x) => `<path d="M${x * 0.66} -176 L${x * 1.0} -14" stroke="#f57c00" stroke-width="4"/>`).join('') +
      `<rect x="-66" y="-182" width="132" height="14" rx="5" fill="#8d6e63" ${st(4)}/>` +
      `<rect x="-97" y="-22" width="194" height="12" rx="4" fill="#8d6e63" ${st(4)}/>` +
      Array.from({ length: 13 }, (_, i) => {
        const x = -88 + i * 14.7;
        return `<path d="M${x.toFixed(1)} -10 V0" stroke="${INK}" stroke-width="3"/><circle cx="${x.toFixed(1)}" cy="2" r="4" fill="#e53935" ${st(2)}/>`;
      }).join(''),
  },

  {
    id: 'baba_klesh',
    slot: 'legs',
    name: 'Штани-клеш',
    price: 20,
    draw: () =>
      `<path d="M-62 -176 L-96 -2 L-4 -2 L0 -90 L4 -2 L96 -2 L62 -176 Z" fill="#7e57c2" ${stroke}/>` +
      `<path d="M-60 -16 H-10 M10 -16 H60" stroke="#ffd54f" stroke-width="6"/>` +
      star(-44, -120, 9, '#ffd54f') +
      star(40, -80, 8, '#ffd54f') +
      star(-60, -50, 7, '#fff') +
      star(64, -40, 9, '#fff'),
  },
  {
    id: 'baba_valianky',
    slot: 'feet',
    name: 'Валянки з калошами',
    price: 10,
    draw: () =>
      babaShoes(
        `<path d="M-16 -34 L16 -34 L18 -8 Q30 -6 30 2 L-26 2 L-22 -8 Z" fill="#9e9e9e" ${stroke}/>` +
          `<path d="M-24 -8 Q-10 -12 18 -8 Q30 -6 30 2 L-26 2 Z" fill="#212121" ${st(4)}/>` +
          `<path d="M-10 -26 h20 M-12 -18 h22" stroke="#bdbdbd" stroke-width="3"/>`,
      ),
  },
  {
    id: 'baba_neon',
    slot: 'feet',
    name: 'Неонові кросівки',
    price: 15,
    draw: () =>
      babaShoes(
        `<path d="M-24 -20 Q-20 -30 2 -30 Q20 -30 26 -14 Q34 -10 32 2 L-28 2 Z" fill="#c6ff00" ${stroke}/>` +
          `<rect x="-30" y="-4" width="64" height="8" rx="4" fill="#ff4081" ${st(3)}/>` +
          `<path d="M-8 -26 l10 6 M-2 -28 l10 6 M-8 -20 l10 -6" stroke="#ff4081" stroke-width="3"/>`,
      ),
  },
  {
    id: 'baba_kaptsi',
    slot: 'feet',
    name: 'Капці з помпонами',
    price: 10,
    draw: () =>
      babaShoes(
        `<path d="M-30 2 Q-34 -22 -2 -22 Q30 -22 30 2 Z" fill="#42a5f5" ${stroke}/>` +
          `<path d="M-28 -6 H28" stroke="#1565c0" stroke-width="4"/>` +
          [0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${(Math.cos((a * Math.PI) / 180) * 9).toFixed(1)}" cy="${(-26 + Math.sin((a * Math.PI) / 180) * 9).toFixed(1)}" r="8" fill="#ff80ab" ${st(3)}/>`).join('') +
          `<circle cx="0" cy="-26" r="9" fill="#ff80ab"/>`,
      ),
  },

];

// ---------------- колобок (a ball: centre 0,-50, r 50; face a little to the right) ----------------
const kolobokItems: Item[] = [
  {
    id: 'kolobok_kotelok',
    slot: 'head',
    name: 'Капелюх-котелок',
    price: 15,
    draw: () =>
      `<g transform="rotate(-10)">` +
      `<path d="M-46 -2 Q-52 -78 0 -80 Q52 -78 46 -2 Z" fill="#263238" ${stroke}/>` +
      `<path d="M-48 -22 Q0 -14 48 -22 L47 -6 Q0 2 -47 -6 Z" fill="#e53935" ${st(4)}/>` +
      `<path d="M-24 -62 Q-8 -72 8 -70" stroke="#607d8b" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M-80 2 Q-74 -10 -48 -6 Q0 0 48 -6 Q74 -10 80 2 Q60 16 0 14 Q-60 16 -80 2 Z" fill="#37474f" ${stroke}/>` +
      `</g>`,
  },
  {
    id: 'kolobok_navushnyky',
    slot: 'head',
    name: 'Навушники діджея',
    price: 20,
    draw: () =>
      `<path d="M-88 50 Q-96 -40 0 -44 Q96 -40 88 50" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>` +
      `<path d="M-88 50 Q-96 -40 0 -44 Q96 -40 88 50" stroke="#212121" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      both(
        `<rect x="-110" y="36" width="34" height="64" rx="16" fill="#e53935" ${stroke}/>` +
          `<rect x="-98" y="44" width="16" height="48" rx="8" fill="#212121"/>` +
          `<path d="M-120 50 q-8 18 0 36" stroke="#ff8a80" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      ) +
      `<g transform="translate(92 -66)"><ellipse cx="0" cy="0" rx="9" ry="7" fill="#212121" transform="rotate(-20)"/><path d="M8 -2 V-30 Q18 -24 20 -14" stroke="#212121" stroke-width="4" fill="none" stroke-linecap="round"/></g>` +
      `<g transform="translate(-122 -10)"><ellipse cx="0" cy="0" rx="9" ry="7" fill="#e53935" transform="rotate(-20)"/><path d="M8 -2 V-30 Q18 -24 20 -14" stroke="#e53935" stroke-width="4" fill="none" stroke-linecap="round"/></g>`,
  },
  {
    id: 'kolobok_aviatory',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-авіатори',
    price: 20,
    draw: () =>
      both(
        `<path d="M-6 -16 Q-30 -24 -62 -18 Q-74 -14 -70 4 Q-64 34 -36 34 Q-10 32 -6 4 Z" fill="#1b5e20" stroke="#c99a1e" stroke-width="7" stroke-linejoin="round"/>` +
          `<path d="M-56 -8 L-34 -10 M-60 2 L-46 0" stroke="#a5d6a7" stroke-width="5" stroke-linecap="round" opacity=".8"/>` +
          `<path d="M-68 -12 L-92 -18" stroke="#c99a1e" stroke-width="6" stroke-linecap="round"/>`,
      ) + `<path d="M-8 -18 Q0 -24 8 -18 M-8 -4 Q0 -10 8 -4" stroke="#c99a1e" stroke-width="5" fill="none"/>`,
  },
  {
    id: 'kolobok_zirky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-зірки',
    price: 15,
    draw: () =>
      `<path d="${starPath(-36, 2, 40)}" fill="#ff4081" fill-opacity=".85" ${st(5)}/>` +
      `<path d="${starPath(36, 2, 40)}" fill="#ffd600" fill-opacity=".85" ${st(5)}/>` +
      `<circle cx="-36" cy="4" r="13" fill="#fff" fill-opacity=".5"/><circle cx="36" cy="4" r="13" fill="#fff" fill-opacity=".5"/>` +
      `<path d="M-10 -2 Q0 -10 10 -2" stroke="${INK}" stroke-width="6" fill="none"/>`,
  },
  {
    id: 'kolobok_dzhentlmen',
    slot: 'mouth',
    name: 'Вуса джентльмена',
    price: 10,
    draw: () =>
      both(`<path d="M0 -10 Q-20 -22 -44 -12 Q-60 -4 -64 -18 Q-68 -30 -58 -32 Q-62 -22 -54 -20 Q-46 -18 -44 -14 Q-60 4 -36 4 Q-16 4 0 -2 Z" fill="#3e2723" ${st(4)}/>`),
  },
  {
    id: 'kolobok_sonechko',
    slot: 'neck',
    name: 'Кулон-сонечко',
    price: 20,
    draw: () =>
      // a cord round the bottom of the bun (the neck point is under it), a little sun in the middle
      `<path d="M-86 -78 Q0 -22 86 -78" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M-86 -78 Q0 -22 86 -78" stroke="#e53935" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      Array.from({ length: 10 }, (_, i) => {
        const a = (i * Math.PI) / 5;
        return `<path d="M${(Math.cos(a) * 20).toFixed(1)} ${(-30 + Math.sin(a) * 20).toFixed(1)} L${(Math.cos(a) * 32).toFixed(1)} ${(-30 + Math.sin(a) * 32).toFixed(1)}" stroke="#ff9800" stroke-width="7" stroke-linecap="round"/>`;
      }).join('') +
      `<circle cx="0" cy="-30" r="20" fill="#ffeb3b" ${st(4)}/>` +
      `<circle cx="-7" cy="-33" r="2.5" fill="${INK}"/><circle cx="7" cy="-33" r="2.5" fill="${INK}"/>` +
      `<path d="M-7 -25 Q0 -19 7 -25" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },

  {
    id: 'kolobok_smokinh',
    slot: 'torso',
    name: 'Смокінг з метеликом',
    price: 25,
    draw: () =>
      // the lower half of the bun, under the mouth
      `<path d="M-48 -24 A53 53 0 0 0 48 -24 L16 -20 L6 -2 L-4 -20 Z" fill="#263238" ${stroke}/>` +
      `<path d="M-4 -20 L6 -2 L16 -20 Q6 -17 -4 -20 Z" fill="#fff" ${st(3)}/>` +
      `<path d="M-4 -20 L-14 -2 L-8 -2 Z M16 -20 L26 -2 L20 -2 Z" fill="#455a64"/>` +
      `<circle cx="6" cy="-8" r="2" fill="${INK}"/>` +
      `<path d="M6 -18 L-8 -25 L-8 -11 Z M6 -18 L20 -25 L20 -11 Z" fill="#e53935" ${st(3)}/><circle cx="6" cy="-18" r="3.5" fill="#b71c1c" ${st(2)}/>` +
      `<circle cx="-28" cy="-14" r="5" fill="#fff" ${st(2)}/><circle cx="-28" cy="-14" r="2" fill="#ffd54f"/>`,
  },
  {
    id: 'kolobok_krosivky',
    slot: 'feet',
    name: 'Кросівки-стрибунці',
    price: 15,
    draw: () =>
      both(
        `<g transform="translate(-8 0) scale(.62)">` +
          `<path d="M-6 -12 Q-8 -24 -24 -24 Q-36 -24 -42 -12 Q-50 -8 -48 2 L-4 2 Z" fill="#1e88e5" ${st(4)}/>` +
          `<rect x="-50" y="-3" width="48" height="7" rx="3" fill="#fff" ${st(3)}/>` +
          `<path d="M-26 -22 l6 8 M-20 -22 l-6 8" stroke="#fff" stroke-width="2.5"/>` +
          `<path d="M-40 -14 l10 -4" stroke="#ffeb3b" stroke-width="4" stroke-linecap="round"/>` +
          `</g>`,
      ),
  },
];

// ---------------- заєць (body: ellipse 0,-70 46×58; one arm in front; feet at -34,-8 and 16,-8) ----------------
const ZAYETS_W = ellW(0, -70, 51, 63);
const ZAYETS_TOP = 'M-50.4 -60 A51 63 0 1 1 50.4 -60 Q0 -48 -50.4 -60 Z';
const ZAYETS_ARM = 'M-32 -104 q-20 26 -8 40';
const ZAYETS_SHORTS = 'M-51 -70 H51 Q53 -42 38 -22 L6 -22 L0 -34 L-6 -22 L-38 -22 Q-53 -42 -51 -70 Z';
const zayetsFeet = (left: string, right: string) => `<g transform="translate(-34 0)">${left}</g><g transform="translate(16 0)">${right}</g>`;

const zayetsItems: Item[] = [
  {
    id: 'zayets_hudi',
    slot: 'torso',
    name: 'Худі з вушками',
    price: 20,
    draw: () =>
      // the hood round the head, with its own little ears
      `<path d="M-46 -176 L-62 -214 L-34 -190 Z M30 -190 L50 -216 L46 -176 Z" fill="#ab47bc" ${st(4)}/>` +
      `<ellipse cx="-8" cy="-150" rx="53" ry="46" fill="#ab47bc" ${stroke}/>` +
      `<path d="${ZAYETS_TOP}" fill="#ab47bc" ${stroke}/>` +
      `<path d="M-30 -84 Q0 -78 30 -84 L26 -62 L-26 -62 Z" fill="#8e24aa" ${st(3)}/>` +
      `<path d="M-14 -112 v20 M10 -112 v20" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="-14" cy="-90" r="3" fill="#fff"/><circle cx="10" cy="-90" r="3" fill="#fff"/>` +
      limb(ZAYETS_ARM, '#ab47bc', 18),
  },

  {
    id: 'zayets_morkvy',
    slot: 'torso',
    name: 'Сорочка в морквинки',
    price: 15,
    draw: () => {
      const m = (x: number, y: number) =>
        `<path d="M${x - 4} ${y - 6} L${x + 4} ${y - 6} L${x} ${y + 8} Z" fill="#fb8c00"/><path d="M${x - 2} ${y - 6} l-2 -5 M${x + 2} ${y - 6} l2 -5" stroke="#43a047" stroke-width="2" stroke-linecap="round"/>`;
      return (
        `<path d="${ZAYETS_TOP}" fill="#fffde7" ${stroke}/>` +
        [[-30, -112], [10, -118], [36, -100], [-12, -94], [20, -76], [-36, -74], [-4, -66]].map(([x, y]) => m(x, y)).join('') +
        `<path d="M-20 -126 L-4 -110 L-2 -124 Z M16 -126 L0 -110 L-2 -124 Z" fill="#fff" ${st(3)}/>` +
        limb(ZAYETS_ARM, '#fffde7', 18, `<path d="M-46 -66 h12" stroke="#fb8c00" stroke-width="4"/>`)
      );
    },
  },

  {
    id: 'zayets_khmarynka',
    slot: 'torso',
    name: 'Кожушок-хмаринка',
    price: 20,
    draw: () =>
      // fluffy all round: puffs along the edge of the coat
      Array.from({ length: 17 }, (_, i) => {
        const a = Math.PI * (0.85 + (i / 16) * 1.3);
        return `<circle cx="${(Math.cos(a) * 50).toFixed(1)}" cy="${(-70 + Math.sin(a) * 60).toFixed(1)}" r="11" fill="#fff" ${st(4)}/>`;
      }).join('') +
      [-44, -22, 0, 22, 44].map((x) => `<circle cx="${x}" cy="-58" r="11" fill="#fff" ${st(4)}/>`).join('') +
      `<path d="${ZAYETS_TOP}" fill="#fff"/>` +
      `<circle cx="-12" cy="-96" r="9" fill="#e3f2fd"/><circle cx="16" cy="-80" r="12" fill="#e3f2fd"/>` +
      limb(ZAYETS_ARM, '#fff', 20, `<circle cx="-40" cy="-68" r="10" fill="#fff" ${st(4)}/>`),
  },

  {
    id: 'zayets_velo',
    slot: 'legs',
    name: 'Велосипедки',
    price: 10,
    draw: () =>
      `<path d="${ZAYETS_SHORTS}" fill="#263238" ${stroke}/>` +
      `<path d="M-50 -58 Q-46 -36 -36 -24 M50 -58 Q46 -36 36 -24" stroke="#76ff03" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M-38 -26 H-6 M6 -26 H38" stroke="#76ff03" stroke-width="4"/>`,
  },

  {
    id: 'zayets_morkvianky',
    slot: 'legs',
    name: 'Штани-морквинки',
    price: 15,
    draw: () =>
      `<path d="M-51 -70 H51 Q50 -40 22 -12 L4 -12 L0 -30 L-4 -12 L-22 -12 Q-50 -40 -51 -70 Z" fill="#fb8c00" ${stroke}/>` +
      `<path d="M-40 -56 l12 2 M-30 -38 l10 2 M30 -54 l12 -2 M22 -36 l10 -2 M-12 -60 l8 2 M10 -62 l8 -2" stroke="#e65100" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M-30 -70 q-10 -20 0 -22 q4 10 4 22 M0 -70 q-4 -24 6 -26 q4 14 0 26 M30 -70 q10 -20 0 -22 q-4 10 -4 22" fill="#66bb6a" ${st(3)}/>`,
  },
  {
    id: 'zayets_strybuntsi',
    slot: 'legs',
    name: 'Шорти-стрибунці',
    price: 15,
    draw: () =>
      `<path d="M-51 -70 H51 Q53 -50 44 -36 L6 -36 L0 -46 L-6 -36 L-44 -36 Q-53 -50 -51 -70 Z" fill="#ffee58" ${stroke}/>` +
      // springs under the hems: bounce!
      both(`<path d="M-40 -36 l-6 5 l12 4 l-12 4 l12 4 l-12 4 l6 3" stroke="#90a4ae" stroke-width="4" fill="none" stroke-linejoin="round"/>`) +
      dots([[-30, -58], [-10, -52], [14, -60], [34, -50]], 5, '#42a5f5'),
  },

  {
    id: 'zayets_krylati',
    slot: 'feet',
    name: 'Крилаті кросівки',
    price: 25,
    draw: () => {
      const shoe = (w: number) =>
        `<path d="M${w * 0.9} -18 Q${w} -4 ${w * 0.9} 2 L${-w * 1.1} 2 Q${-w * 1.2} -8 ${-w * 0.8} -14 Q${-w * 0.3} -24 ${w * 0.9} -18 Z" fill="#ffca28" ${stroke}/>` +
        `<rect x="${-w * 1.15}" y="-2" width="${w * 2.1}" height="6" rx="3" fill="#fff" ${st(3)}/>` +
        `<path d="M${w * 0.6} -18 Q${w * 1.3} -40 ${w * 1.6} -30 Q${w * 1.3} -26 ${w * 1.5} -18 Q${w * 1.2} -16 ${w * 0.9} -12 Z" fill="#fff" ${st(3)}/>`;
      return zayetsFeet(shoe(32), shoe(28));
    },
  },
  {
    id: 'zayets_cheshky',
    slot: 'feet',
    name: 'Чешки балерини',
    price: 15,
    draw: () => {
      const shoe = (w: number) =>
        `<path d="M${-w} -8 Q${-w} -20 0 -20 Q${w} -20 ${w} -8 Q${w} 4 0 4 Q${-w} 4 ${-w} -8 Z" fill="#f48fb1" ${stroke}/>` +
        `<path d="M-6 -18 L-14 -36 M6 -18 L16 -38 M-14 -36 L16 -38" stroke="#ec407a" stroke-width="4" stroke-linecap="round"/>` +
        `<path d="M-6 -14 q6 -6 12 0 q-6 6 -12 0" fill="#ec407a"/>`;
      return zayetsFeet(shoe(33), shoe(29));
    },
  },
  {
    id: 'zayets_cherevyky',
    slot: 'feet',
    name: 'Черевики-морквинки',
    price: 15,
    draw: () => {
      const boot = (w: number) =>
        `<path d="M${-w * 0.4} -30 L${w * 0.5} -30 L${w * 0.6} -10 Q${w * 1.1} -6 ${w} 2 L${-w * 1.2} 2 Q${-w * 1.3} -6 ${-w * 0.5} -12 Z" fill="#fb8c00" ${stroke}/>` +
        `<path d="M${-w * 0.2} -22 h${w * 0.5} M${-w * 0.6} -6 h${w * 0.5} M${w * 0.1} -12 h${w * 0.4}" stroke="#e65100" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M${-w * 0.3} -30 q-6 -16 2 -20 q4 10 4 20 M0 -30 q0 -20 8 -22 q2 12 -2 22 M${w * 0.3} -30 q8 -14 14 -12 q-4 8 -10 12" fill="#66bb6a" ${st(3)}/>`;
      return zayetsFeet(boot(28), boot(24));
    },
  },

];

// ---------------- вовк (body ellipse 2,-150 58×80; legs -90..-10; one arm in front) ----------------
const VOVK_BODY = 'M2 -236 A62 86 0 1 1 1.9 -236 Z';
const VOVK_ARM = 'M-46 -190 Q-80 -150 -64 -110';
const VOVK_LEGS = (fill: string, extra = '') =>
  `<path d="M-36 -98 L-42 -12 L0 -12 L1 -98 Z" fill="${fill}" ${stroke}/><path d="M3 -98 L4 -12 L46 -12 L42 -98 Z" fill="${fill}" ${stroke}/>${extra}`;
const vovkFeet = (one: string) => `<g transform="translate(-26 0)">${one}</g><g transform="translate(26 0)">${one}</g>`;

const vovkItems: Item[] = [
  {
    id: 'vovk_nichna',
    slot: 'torso',
    name: 'Бабусина нічна сорочка',
    price: 20,
    draw: () => {
      const frill = (y: number, w: number) => {
        let d = `M${-w} ${y}`;
        for (let i = 0; i < 8; i++) d += ` q${w / 8} 14 ${w / 4} 0`;
        return `<path d="${d}" fill="#fff" ${st(3)}/>`;
      };
      return (
        `<path d="M-50 -210 Q-66 -120 -62 -40 L66 -40 Q70 -120 54 -210 Q2 -246 -50 -210 Z" fill="#fce4ec" ${stroke}/>` +
        dots([[-30, -190], [20, -200], [-40, -150], [0, -160], [40, -140], [-20, -120], [24, -100], [-44, -84], [2, -70], [44, -66], [-22, -54]], 5, '#90caf9') +
        frill(-44, 64) +
        `<path d="M-30 -226 Q2 -206 34 -226 Q20 -210 2 -208 Q-16 -210 -30 -226 Z" fill="#fff" ${st(3)}/>` +
        `<path d="M-10 -208 l12 10 l12 -10" stroke="#e53935" stroke-width="5" fill="none" stroke-linecap="round"/>` +
        limb(VOVK_ARM, '#fce4ec', 24) +
        `<path d="M-74 -118 q10 8 20 0" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>`
      );
    },
  },
  {
    id: 'vovk_kosukha',
    slot: 'torso',
    name: 'Куртка рокера',
    price: 20,
    draw: () =>
      `<path d="${VOVK_BODY}" fill="#212121" ${stroke}/>` +
      `<path d="M-30 -220 L-6 -150 L-40 -170 Z M40 -220 L14 -150 L46 -176 Z" fill="#424242" ${st(3)}/>` +
      `<path d="M-6 -150 L10 -70" stroke="#bdbdbd" stroke-width="5"/>` +
      [[-40, -120], [-28, -100], [36, -120], [44, -100], [-20, -200], [30, -200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#e0e0e0" ${st(2)}/>`).join('') +
      `<path d="M20 -110 Q40 -126 52 -108" stroke="#757575" stroke-width="4" fill="none"/>` +
      text(30, -84, 18, '#e53935', '★') +
      limb(VOVK_ARM, '#212121', 24, `<path d="M-72 -122 h14" stroke="#bdbdbd" stroke-width="5"/>`),
  },
  {
    id: 'vovk_svetr',
    slot: 'torso',
    name: 'Светр з овечкою',
    price: 15,
    draw: () =>
      `<path d="${VOVK_BODY}" fill="#2e7d32" ${stroke}/>` +
      `<path d="M-44 -82 Q2 -60 48 -82" stroke="#1b5e20" stroke-width="10" fill="none"/>` +
      // the sheep: a fluffy cloud with a face
      [[-16, -150], [4, -160], [24, -150], [-20, -132], [26, -132], [2, -124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#fff" ${st(3)}/>`).join('') +
      `<circle cx="4" cy="-142" r="16" fill="#fff"/>` +
      `<ellipse cx="-30" cy="-142" rx="10" ry="12" fill="#424242" ${st(3)}/><circle cx="-33" cy="-145" r="2" fill="#fff"/>` +
      `<path d="M-8 -116 v12 M14 -116 v12" stroke="#424242" stroke-width="5" stroke-linecap="round"/>` +
      limb(VOVK_ARM, '#2e7d32', 24, `<path d="M-72 -122 h16" stroke="#1b5e20" stroke-width="6"/>`),
  },
  {
    id: 'vovk_dzhynsy',
    slot: 'legs',
    name: 'Рвані джинси',
    price: 15,
    draw: () =>
      VOVK_LEGS(
        '#37474f',
        `<path d="M-30 -60 l6 -4 l6 4 l6 -4 l4 4 l-4 8 l-6 -3 l-6 3 l-6 -2 Z" fill="#6c757d" ${st(2)}/>` +
          `<path d="M14 -44 l6 -4 l6 4 l6 -3 l2 4 l-4 7 l-6 -2 l-6 2 l-4 -3 Z" fill="#6c757d" ${st(2)}/>` +
          `<path d="M-36 -20 H-4 M8 -20 H40" stroke="#90a4ae" stroke-width="3" stroke-dasharray="4 4"/>`,
      ),
  },
  {
    id: 'vovk_zirochky',
    slot: 'legs',
    name: 'Штани в зірочку',
    price: 15,
    draw: () => VOVK_LEGS('#283593', [[-24, -80], [-16, -54], [-28, -30], [22, -84], [30, -58], [18, -34]].map(([x, y]) => star(x, y, 7, '#ffeb3b', 2)).join('')),
  },

  {
    id: 'vovk_sertsia',
    slot: 'legs',
    name: 'Труси в сердечка',
    price: 10,
    draw: () =>
      `<path d="M-40 -100 L-48 -38 L-2 -38 L2 -54 L6 -38 L52 -38 L44 -100 Z" fill="#fff" ${stroke}/>` +
      [[-26, -64], [-14, -50], [30, -66], [22, -50], [-38, -50], [40, -50], [2, -70]]
        .map(([x, y]) => `<path d="M${x} ${y + 5} l-7 -7 a4 4 0 0 1 7 -5 a4 4 0 0 1 7 5 Z" fill="#e53935"/>`)
        .join(''),
  },
  {
    id: 'vovk_skorokhody',
    slot: 'feet',
    name: 'Чоботи-скороходи',
    price: 20,
    draw: () =>
      vovkFeet(
        `<path d="M-14 -66 L18 -66 L18 -14 Q28 -10 26 2 L-28 2 Q-30 -12 -16 -14 Z" fill="#c62828" ${stroke}/>` +
          `<rect x="-18" y="-70" width="40" height="12" rx="4" fill="#ffd54f" ${st(3)}/>` +
          `<path d="M4 -52 L-6 -34 L4 -34 L-4 -18" stroke="#ffd54f" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`,
      ) +
      // speed lines behind
      `<path d="M58 -40 h18 M62 -28 h22 M58 -16 h16" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".6"/>`,
  },

  {
    id: 'vovk_tufli',
    slot: 'feet',
    name: 'Лакові туфлі',
    price: 20,
    draw: () =>
      vovkFeet(
        `<path d="M-26 -2 Q-28 -18 -6 -20 L14 -20 Q28 -18 26 -2 Q26 4 0 4 Q-26 4 -26 -2 Z" fill="#111" ${stroke}/>` +
          `<path d="M-16 -12 Q-8 -16 2 -15" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>`,
      ),
  },
  {
    id: 'vovk_vohnyky',
    slot: 'feet',
    name: 'Кросівки з вогниками',
    price: 20,
    draw: () =>
      vovkFeet(
        `<path d="M-26 -2 Q-28 -22 -2 -24 Q24 -22 26 -2 Z" fill="#fff" ${stroke}/>` +
          `<rect x="-28" y="-6" width="56" height="10" rx="5" fill="#424242" ${st(3)}/>` +
          `<circle cx="-16" cy="-1" r="3" fill="#ff1744"/><circle cx="-5" cy="-1" r="3" fill="#00e5ff"/><circle cx="6" cy="-1" r="3" fill="#76ff03"/><circle cx="17" cy="-1" r="3" fill="#ffea00"/>` +
          `<path d="M-8 -20 l14 6 M-8 -12 l14 -6" stroke="#e53935" stroke-width="3"/>`,
      ),
  },
];

// ---------------- ведмідь (body ellipse 0,-150 96×120; arms out to the sides; feet ±38,-24) ----------------
const VEDMID_TOP = 'M-97 -116 A100 124 0 1 1 97 -116 Q0 -98 -97 -116 Z';
const VEDMID_W = ellW(0, -150, 100, 124);
const VEDMID_ARM = 'M-86 -220 Q-130 -170 -110 -110';
const VEDMID_PANTS = 'M-100 -132 H100 Q104 -80 82 -40 L8 -40 L0 -62 L-8 -40 L-82 -40 Q-104 -80 -100 -132 Z';
const vedmidFeet = (one: string) => both(`<g transform="translate(-38 0)">${one}</g>`);

const vedmidItems: Item[] = [
  {
    id: 'vedmid_pizhama',
    slot: 'torso',
    name: 'Піжама в горошок',
    price: 15,
    draw: () =>
      `<path d="${VEDMID_TOP}" fill="#4fc3f7" ${stroke}/>` +
      dots([[-60, -220], [-20, -240], [24, -232], [64, -214], [-74, -170], [-36, -190], [6, -196], [46, -180], [80, -150], [-56, -136], [-14, -150], [30, -140], [64, -124]], 8, '#fff') +
      `<path d="M-30 -262 L0 -226 L30 -262" fill="#fff" ${st(4)}/>` +
      [-200, -168, -136].map((y) => `<circle cx="0" cy="${y}" r="5" fill="#fff59d" ${st(2)}/>`).join('') +
      both(limb(VEDMID_ARM, '#4fc3f7', 40, `<path d="${VEDMID_ARM}" fill="none" stroke="#fff" stroke-width="12" stroke-dasharray="0 22" stroke-linecap="round"/>`)),
  },
  {
    id: 'vedmid_med',
    slot: 'torso',
    name: 'Футболка «Я люблю мед»',
    price: 15,
    draw: () =>
      `<path d="${VEDMID_TOP}" fill="#ffeb3b" ${stroke}/>` +
      both(limb('M-110 -164 Q-116 -136 -110 -110', '#7b4b2a', 35) + `<path d="M-86 -232 Q-124 -206 -126 -172 L-92 -160 Q-88 -190 -70 -206 Z" fill="#ffeb3b" ${stroke}/>`) +
      text(0, -186, 30, '#6d4c41', 'Я') +
      `<path d="M0 -136 l-22 -22 a12 12 0 0 1 22 -16 a12 12 0 0 1 22 16 Z" fill="#e53935" ${st(3)}/>` +
      text(0, -120, 30, '#ff8f00', 'МЕД'),
  },
  {
    id: 'vedmid_zhylet',
    slot: 'torso',
    name: 'Рятувальний жилет',
    price: 20,
    draw: () =>
      both(limb(VEDMID_ARM, '#7b4b2a', 35)) +
      `<path d="M-90 -116 Q-100 -200 -60 -250 L-30 -258 L-10 -200 L-10 -110 Q-50 -104 -90 -116 Z" fill="#ff6d00" ${stroke}/>` +
      `<path d="M90 -116 Q100 -200 60 -250 L30 -258 L10 -200 L10 -110 Q50 -104 90 -116 Z" fill="#ff6d00" ${stroke}/>` +
      `<path d="M-92 -170 H-10 M10 -170 H92 M-90 -140 H-10 M10 -140 H90" stroke="#eceff1" stroke-width="9"/>` +
      `<rect x="-16" y="-178" width="32" height="16" rx="3" fill="#212121"/><rect x="-16" y="-148" width="32" height="16" rx="3" fill="#212121"/>`,
  },
  {
    id: 'vedmid_pizhamni',
    slot: 'legs',
    name: 'Піжамні штани в горошок',
    price: 10,
    draw: () =>
      `<path d="${VEDMID_PANTS}" fill="#4fc3f7" ${stroke}/>` +
      dots([[-70, -110], [-30, -120], [10, -118], [50, -112], [86, -104], [-84, -80], [-46, -86], [32, -86], [70, -74], [-60, -54], [56, -52], [-26, -60], [24, -60]], 8, '#fff'),
  },
  {
    id: 'vedmid_bavarski',
    slot: 'legs',
    name: 'Шкіряні шорти',
    price: 15,
    draw: () =>
      `<path d="M-52 -260 L-40 -120 M52 -260 L40 -120" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>` +
      `<path d="M-52 -260 L-40 -120 M52 -260 L40 -120" stroke="#2e7d32" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M-48 -200 H48" stroke="${INK}" stroke-width="16"/><path d="M-48 -200 H48" stroke="#2e7d32" stroke-width="9"/>` +
      `<rect x="-14" y="-212" width="28" height="24" rx="4" fill="#fff8e1" ${st(3)}/>` +
      `<path d="M-100 -132 H100 Q104 -100 96 -76 L8 -76 L0 -96 L-8 -76 L-96 -76 Q-104 -100 -100 -132 Z" fill="#8d6e63" ${stroke}/>` +
      `<circle cx="-40" cy="-120" r="5" fill="#ffd54f" ${st(2)}/><circle cx="40" cy="-120" r="5" fill="#ffd54f" ${st(2)}/>` +
      `<path d="M-90 -86 h70 M20 -86 h70" stroke="#6d4c41" stroke-width="4" stroke-dasharray="6 4"/>`,
  },
  {
    id: 'vedmid_hula',
    slot: 'legs',
    name: 'Спідничка-хула',
    price: 20,
    draw: () =>
      Array.from({ length: 25 }, (_, i) => {
        const x = -96 + i * 8;
        const sway = ((i % 3) - 1) * 6;
        return `<path d="M${x.toFixed(1)} -130 Q${(x * 1.05 + sway).toFixed(1)} -90 ${(x * 1.1 + sway * 2).toFixed(1)} -46" stroke="${INK}" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M${x.toFixed(1)} -130 Q${(x * 1.05 + sway).toFixed(1)} -90 ${(x * 1.1 + sway * 2).toFixed(1)} -46" stroke="${i % 2 ? '#8bc34a' : '#c0ca33'}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
      }).join('') +
      `<rect x="-102" y="-142" width="204" height="18" rx="8" fill="#8d6e63" ${st(4)}/>` +
      [-80, -40, 0, 40, 80].map((x, i) => flower(x, -133, 14, i % 2 ? '#ec407a' : '#ff7043')).join(''),
  },
  {
    id: 'vedmid_kaptsi',
    slot: 'feet',
    name: 'Капці-ведмедики',
    price: 15,
    draw: () =>
      vedmidFeet(
        `<circle cx="-28" cy="-46" r="12" fill="#f48fb1" ${st(4)}/><circle cx="28" cy="-46" r="12" fill="#f48fb1" ${st(4)}/>` +
          `<ellipse cx="0" cy="-22" rx="50" ry="30" fill="#f8bbd0" ${stroke}/>` +
          `<circle cx="-12" cy="-26" r="4" fill="${INK}"/><circle cx="12" cy="-26" r="4" fill="${INK}"/>` +
          `<ellipse cx="0" cy="-14" rx="10" ry="7" fill="#fff"/><ellipse cx="0" cy="-16" rx="4" ry="3" fill="${INK}"/>`,
      ),
  },
  {
    id: 'vedmid_lyzhi',
    slot: 'feet',
    name: 'Лижі',
    price: 20,
    draw: () =>
      vedmidFeet(
        `<path d="M-84 6 L66 6 Q86 6 92 -18 Q80 -6 66 -4 L-84 -4 Q-90 1 -84 6 Z" fill="#e53935" ${st(4)}/>` +
          `<path d="M-30 -2 Q-34 -40 0 -46 Q34 -40 30 -2 Z" fill="#1e88e5" ${stroke}/>` +
          `<path d="M-30 -18 H30" stroke="#fdd835" stroke-width="6"/>`,
      ),
  },
  {
    id: 'vedmid_chobotky',
    slot: 'feet',
    name: 'Чоботи-жабки',
    price: 15,
    draw: () =>
      vedmidFeet(
        `<path d="M-30 -60 L30 -60 L32 -30 Q46 -26 44 2 L-44 2 Q-46 -26 -32 -30 Z" fill="#66bb6a" ${stroke}/>` +
          `<circle cx="-16" cy="-28" r="10" fill="#fff" ${st(3)}/><circle cx="16" cy="-28" r="10" fill="#fff" ${st(3)}/>` +
          `<circle cx="-14" cy="-27" r="4" fill="${INK}"/><circle cx="14" cy="-27" r="4" fill="${INK}"/>` +
          `<path d="M-14 -12 Q0 -2 14 -12" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          `<rect x="-32" y="-64" width="64" height="10" rx="4" fill="#388e3c" ${st(3)}/>`,
      ),
  },
];

// ---------------- лисиця (a pear-shaped body -166..-46; short legs in dark socks; paws in front) ----------------
const LYS_BODY = 'M-53 -56 C-63 -112 -45 -168 0 -173 C45 -168 63 -112 53 -56 C35 -36 -35 -36 -53 -56 Z';
const LYS_W = cubicW([[0, -173], [45, -168], [63, -112], [53, -56]]);
const LYS_LEGS = (fill: string, extra = '') =>
  `<path d="M-36 -72 L-37 -12 L-2 -12 L-2 -72 Z" fill="${fill}" ${stroke}/><path d="M4 -72 L4 -12 L39 -12 L37 -72 Z" fill="${fill}" ${stroke}/>${extra}`;
const lysFeet = (one: string) => `<g transform="translate(-22 0)">${one}</g><g transform="translate(22 0) scale(-1 1)">${one}</g>`;

const lysytsiaItems: Item[] = [
  {
    id: 'lysytsia_plashch',
    slot: 'torso',
    name: 'Плащ детектива',
    price: 20,
    draw: () =>
      `<path d="M-53 -60 C-63 -112 -45 -168 0 -173 C45 -168 63 -112 53 -60 L60 -26 L-60 -26 Z" fill="#d4a373" ${stroke}/>` +
      `<path d="M-26 -166 L0 -120 L26 -166 L40 -150 L10 -110 L-10 -110 L-40 -150 Z" fill="#c08552" ${st(4)}/>` +
      `<rect x="-58" y="-92" width="116" height="12" rx="4" fill="#8d5a2b" ${st(3)}/><rect x="-8" y="-95" width="16" height="18" rx="2" fill="none" stroke="#ffd54f" stroke-width="3"/>` +
      [[-16, -104], [16, -104], [-16, -64], [16, -64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#5d4037"/>`).join('') +
      `<path d="M0 -80 V-26" stroke="${INK}" stroke-width="3"/>`,
  },
  {
    id: 'lysytsia_sukenka',
    slot: 'torso',
    name: 'Сукня з рюшами',
    price: 20,
    draw: () => {
      const ruffle = (y: number, w: number, c: string) => {
        let d = `M${-w} ${y - 14}`;
        const n = 7;
        for (let i = 0; i < n; i++) d += ` L${(-w + ((i + 0.5) * 2 * w) / n).toFixed(1)} ${y} L${(-w + ((i + 1) * 2 * w) / n).toFixed(1)} ${y - 14}`;
        return `<path d="M${-w + 6} ${y - 34} L${w - 6} ${y - 34} ${d.replace('M', 'L')} Z" fill="${c}" ${st(4)}/>`;
      };
      return (
        `<path d="${LYS_BODY}" fill="#f06292" ${stroke}/>` +
        ruffle(-36, 66, '#f8bbd0') +
        ruffle(-60, 60, '#f48fb1') +
        `<rect x="-52" y="-120" width="104" height="12" rx="5" fill="#fff" ${st(3)}/>` +
        `<path d="M0 -114 L-20 -128 L-20 -100 Z M0 -114 L20 -128 L20 -100 Z" fill="#fff" ${st(3)}/>` +
        dots([[-24, -150], [20, -144], [-34, -130], [36, -126]], 4, '#fff')
      );
    },
  },
  {
    id: 'lysytsia_veselka',
    slot: 'torso',
    name: 'Кофтинка-веселка',
    price: 15,
    draw: () => bands(['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa'], -173, -44, 11, LYS_W) + `<path d="${LYS_BODY}" fill="none" ${stroke}/>`,
  },
  {
    id: 'lysytsia_panchohy',
    slot: 'legs',
    name: 'Смугасті панчохи',
    price: 10,
    draw: () =>
      LYS_LEGS(
        '#fff',
        [-66, -50, -34, -18].map((y) => `<path d="M-36 ${y} H-2 M4 ${y} H38" stroke="#e53935" stroke-width="8"/>`).join(''),
      ) + `<path d="M-36 -72 L-37 -12 L-2 -12 L-2 -72 Z M4 -72 L4 -12 L39 -12 L37 -72 Z" fill="none" ${stroke}/>`,
  },
  {
    id: 'lysytsia_khvyli',
    slot: 'legs',
    name: 'Шаровари-хвилі',
    price: 15,
    draw: () =>
      both(
        `<path d="M-1 -74 Q-58 -76 -50 -36 Q-46 -18 -32 -14 L-6 -14 Q-2 -30 -1 -74 Z" fill="#1e88e5" ${stroke}/>` +
          `<path d="M-46 -54 q6 -6 12 0 t12 0 t12 0 M-46 -38 q6 -6 12 0 t12 0 t12 0" stroke="#bbdefb" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          `<path d="M-34 -16 H-6" stroke="#ffd54f" stroke-width="6" stroke-linecap="round"/>`,
      ),
  },

  {
    id: 'lysytsia_losyny',
    slot: 'legs',
    name: 'Лосини з блискітками',
    price: 15,
    draw: () => LYS_LEGS('#ab47bc', star(-20, -50, 7, '#fff59d', 2) + star(-14, -26, 5, '#fff', 2) + star(22, -60, 5, '#fff', 2) + star(24, -32, 7, '#fff59d', 2)),
  },
  {
    id: 'lysytsia_shpylky',
    slot: 'feet',
    name: 'Туфлі на шпильках',
    price: 20,
    draw: () =>
      lysFeet(
        `<path d="M14 -10 L14 4 L10 4 L9 -6 Z" fill="#b71c1c" ${st(2)}/>` +
          `<path d="M-22 -2 Q-24 -14 -8 -16 Q8 -16 16 -12 L14 -6 Q0 -6 -6 4 L-20 4 Q-24 2 -22 -2 Z" fill="#e53935" ${st(4)}/>` +
          `<path d="M-6 -16 l-8 -6 l0 10 Z M-6 -16 l8 -6 l0 10 Z" fill="#ffd54f" ${st(2)}/>`,
      ),
  },
  {
    id: 'lysytsia_botforty',
    slot: 'feet',
    name: 'Ботфорти',
    price: 20,
    draw: () =>
      lysFeet(
        `<path d="M-14 -78 L20 -78 L18 -10 Q22 4 10 4 L-26 4 Q-30 -6 -16 -10 Z" fill="#212121" ${stroke}/>` +
          `<path d="M-18 -80 L22 -80 L20 -64 L-16 -64 Z" fill="#424242" ${st(3)}/>` +
          `<rect x="-6" y="-44" width="14" height="10" rx="2" fill="none" stroke="#ffd54f" stroke-width="3"/>` +
          `<path d="M-4 -70 Q-2 -40 0 -16" stroke="#616161" stroke-width="3" fill="none"/>`,
      ),
  },
  {
    id: 'lysytsia_uggi',
    slot: 'feet',
    name: 'Пухнасті чобітки',
    price: 15,
    draw: () =>
      lysFeet(
        `<path d="M-14 -40 L18 -40 L18 -8 Q20 4 6 4 L-24 4 Q-30 -8 -14 -12 Z" fill="#d7a86e" ${stroke}/>` +
          [-14, -4, 6, 16].map((x) => `<circle cx="${x}" cy="-42" r="7" fill="#fff8e1" ${st(3)}/>`).join('') +
          [-14, -4, 6, 16].map((x) => `<circle cx="${x}" cy="-42" r="5" fill="#fff8e1"/>`).join(''),
      ),
  },
];

// ================= round 2 =================

// ---------------- колобок: more (he sits: little legs stick out to the sides from under the bun) ----------------
/** a leg from under the bun out to the side (the left one; mirror for the right) */
const KOLO_LEG = 'M-22 -12 Q-44 -4 -60 -6';
const koloLegs = (color: string, extra = '', w = 11) => both(limb(KOLO_LEG, color, w, extra));
const kolobok2Items: Item[] = [
  {
    id: 'kolobok_fartukh',
    slot: 'torso',
    name: 'Фартух пекаря',
    price: 15,
    draw: () =>
      `<path d="M-30 -30 L30 -30 L36 -4 Q6 4 -24 -4 Z" fill="#fff" ${st(4)}/>` +
      `<path d="M-30 -28 Q-46 -40 -48 -30 M30 -28 Q46 -40 48 -30" stroke="#e53935" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<rect x="-14" y="-20" width="26" height="12" rx="3" fill="#ffcdd2" ${st(2)}/>` +
      `<circle cx="-18" cy="-12" r="4" fill="#f5f5f5" opacity=".9"/><circle cx="20" cy="-18" r="3" fill="#eeeeee"/><circle cx="24" cy="-8" r="2.5" fill="#eeeeee"/>`,
  },
  {
    id: 'kolobok_poncho',
    slot: 'torso',
    name: 'Пончо з кактусами',
    price: 20,
    draw: () =>
      `<path d="M-48 -26 A52 52 0 0 0 48 -26 Q6 -16 -48 -26 Z" fill="#ff7043" ${stroke}/>` +
      `<path d="M-46 -18 Q6 -8 46 -18 M-40 -6 Q6 4 40 -6" stroke="#fdd835" stroke-width="5" fill="none"/>` +
      [-26, 6, 34].map((x) => `<path d="M${x} -2 v-12 m0 6 h-5 v-5 m5 5 h5 v-6" stroke="#2e7d32" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('') +
      both(`<path d="M-44 -18 l-4 10 M-38 -14 l-3 10" stroke="#fdd835" stroke-width="3" stroke-linecap="round"/>`),
  },
  {
    id: 'kolobok_kolhotky',
    slot: 'legs',
    name: 'Ніжки в колготках-сердечках',
    price: 15,
    draw: () =>
      koloLegs('#f48fb1') +
      [[-34, -9], [-50, -6], [34, -9], [50, -6]].map(([x, y]) => `<path d="M${x} ${y + 3} l-3 -3 a2 2 0 0 1 3 -2 a2 2 0 0 1 3 2 Z" fill="#e53935"/>`).join('') +
      both(`<ellipse cx="-62" cy="-6" rx="7" ry="6" fill="#f48fb1" ${st(3)}/>`),
  },
  {
    id: 'kolobok_spahetti',
    slot: 'legs',
    name: 'Ніжки-спагеті',
    price: 15,
    draw: () =>
      both(
        [0, 4, 8].map((d) => `<path d="M-20 ${-14 + d / 2} Q-34 ${-24 + d} -42 ${-6 + d / 3} T-64 ${-6 + d / 3}" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M-20 ${-14 + d / 2} Q-34 ${-24 + d} -42 ${-6 + d / 3} T-64 ${-6 + d / 3}" stroke="#ffe082" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') +
          `<circle cx="-46" cy="-12" r="5" fill="#e53935" ${st(2)}/>`,
      ),
  },
  {
    id: 'kolobok_futbolist',
    slot: 'legs',
    name: 'Ніжки футболіста',
    price: 15,
    draw: () =>
      koloLegs('#fff', `<path d="M-36 -8 L-50 -6" stroke="#1e88e5" stroke-width="13" stroke-linecap="round"/>`) +
      both(`<path d="M-58 -2 Q-70 -2 -68 -10 Q-64 -14 -56 -12 Z" fill="#212121" ${st(3)}/>`) +
      `<g transform="translate(-74 -8)"><circle r="8" fill="#fff" ${st(3)}/><path d="M0 -3 l3 2 -1 3 h-4 l-1 -3 Z" fill="#212121"/></g>`,
  },
  {
    id: 'kolobok_ravlyky',
    slot: 'feet',
    name: 'Кросівки-равлики',
    price: 15,
    draw: () =>
      both(
        `<path d="M-48 2 Q-50 -8 -40 -8 L-6 -8 Q0 -8 -2 2 Z" fill="#a5d6a7" ${st(3)}/>` +
          `<circle cx="-22" cy="-14" r="11" fill="#ffb74d" ${st(3)}/>` +
          `<path d="M-22 -14 m-5 0 a5 5 0 1 1 5 5 a3 3 0 1 1 -2 -4" stroke="#e65100" stroke-width="2" fill="none"/>` +
          `<path d="M-44 -8 l-4 -10 M-40 -8 l0 -10" stroke="${INK}" stroke-width="2"/><circle cx="-48" cy="-19" r="2" fill="${INK}"/><circle cx="-40" cy="-19" r="2" fill="${INK}"/>`,
      ),
  },

  {
    id: 'kolobok_pyrizhky',
    slot: 'feet',
    name: 'Капці-пиріжки',
    price: 10,
    draw: () =>
      both(
        `<path d="M-44 -2 Q-44 -20 -24 -20 Q-4 -20 -4 -2 Z" fill="#d68a3c" ${st(4)}/>` +
          `<path d="M-40 -6 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0 q4 -4 8 0" stroke="#a0581e" stroke-width="2.5" fill="none"/>` +
          `<circle cx="-28" cy="-13" r="1.8" fill="${INK}"/><circle cx="-20" cy="-13" r="1.8" fill="${INK}"/>`,
      ),
  },
];

// ---------------- кіт / кішка (sits: body -126..-12, front paws on top at ±14,-14; feet ±24,-8) ----------------
const KIT_BODY = 'M-51 -10 Q-64 -92 -27 -131 Q0 -146 27 -131 Q64 -92 51 -10 Q0 8 -51 -10 Z';
/** the cat's lap: what covers its bottom half (legs) */
const KIT_LAP = 'M-56 -56 Q0 -46 56 -56 Q58 -30 52 -10 Q0 8 -52 -10 Q-58 -30 -56 -56 Z';
const kitFeet = (one: string) => `<g transform="translate(-32 0) scale(1.3)">${one}</g><g transform="translate(32 0) scale(-1.3 1.3)">${one}</g>`;

const kitItems: Item[] = [
  {
    id: 'kit_banan',
    slot: 'torso',
    name: 'Костюм банана',
    price: 20,
    draw: () =>
      // peel flaps hanging down at the sides
      `<path d="M-30 -126 Q-70 -110 -74 -60 Q-60 -80 -44 -88 Z" fill="#fdd835" ${stroke}/>` +
      `<path d="M30 -126 Q70 -110 74 -60 Q60 -80 44 -88 Z" fill="#fdd835" ${stroke}/>` +
      `<path d="${KIT_BODY}" fill="#ffeb3b" ${stroke}/>` +
      `<path d="M-30 -120 Q-40 -60 -30 -14 M30 -120 Q40 -60 30 -14" stroke="#f9a825" stroke-width="4" fill="none"/>` +
      `<path d="M-6 -134 Q0 -150 8 -146" stroke="#6d4c41" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<circle cx="18" cy="-70" r="3" fill="#8d6e63"/><circle cx="-14" cy="-40" r="2.5" fill="#8d6e63"/>`,
  },
  {
    id: 'kit_khalat',
    slot: 'torso',
    name: 'Халат пана Коцького',
    price: 25,
    draw: () =>
      `<path d="${KIT_BODY}" fill="#7b1fa2" ${stroke}/>` +
      `<path d="M-26 -128 L0 -60 L26 -128" fill="none" stroke="#ffd54f" stroke-width="10"/>` +
      `<path d="M-26 -128 L0 -60 L26 -128" fill="none" stroke="${INK}" stroke-width="2"/>` +
      `<rect x="-54" y="-58" width="108" height="10" rx="4" fill="#ffd54f" ${st(3)}/>` +
      `<path d="M30 -54 l6 26 M38 -54 l10 22" stroke="#ffd54f" stroke-width="5" stroke-linecap="round"/>` +
      `<text x="-28" y="-84" font-family="Arial, sans-serif" font-weight="900" font-size="18" text-anchor="middle" fill="#ffd54f" stroke="${INK}" stroke-width="1">К</text>`,
  },
  {
    id: 'kit_leopard',
    slot: 'legs',
    name: 'Лосини-леопард',
    price: 15,
    draw: () =>
      `<path d="${KIT_LAP}" fill="#ffca7a" ${stroke}/>` +
      [[-40, -44], [-22, -30], [-4, -46], [14, -28], [34, -44], [44, -24], [-44, -20], [4, -14]].map(([x, y]) => `<path d="M${x - 5} ${y} q2 -6 6 -5 q6 2 4 7 q-2 5 -7 3 q-4 -1 -3 -5 Z" fill="#a1662f" stroke="#3e2723" stroke-width="2.5"/>`).join(''),
  },
  {
    id: 'kit_kilt',
    slot: 'legs',
    name: 'Шотландський кілт',
    price: 20,
    draw: () =>
      `<path d="${KIT_LAP}" fill="#c62828"/>` +
      [-40, -20, 0, 20, 40].map((x) => `<path d="M${x} -56 V-4" stroke="#1b5e20" stroke-width="8" opacity=".8"/>`).join('') +
      [-46, -30, -16].map((y) => `<path d="M-56 ${y} H56" stroke="#1b5e20" stroke-width="6" opacity=".8"/>`).join('') +
      [-30, 10].map((x) => `<path d="M${x} -56 V-4" stroke="#fdd835" stroke-width="2"/>`).join('') +
      `<path d="${KIT_LAP}" fill="none" ${stroke}/>` +
      `<path d="M20 -50 L32 -50 L32 -30 L20 -30 Z" fill="#fff" ${st(2)}/><circle cx="26" cy="-34" r="3" fill="#ffd54f"/>`,
  },
  {
    id: 'kit_akuly',
    slot: 'feet',
    name: 'Черевики-акули',
    price: 20,
    draw: () =>
      kitFeet(
        `<path d="M-28 -2 Q-26 -20 0 -20 Q22 -18 22 -2 Z" fill="#78909c" ${stroke}/>` +
          `<path d="M-6 -20 L2 -32 L8 -19 Z" fill="#607d8b" ${st(3)}/>` +
          `<path d="M-26 -6 L-20 -10 L-16 -5 L-12 -10 L-8 -5 L-4 -10 L0 -5" stroke="#fff" stroke-width="2.5" fill="#fff" stroke-linejoin="round"/>` +
          `<circle cx="-18" cy="-14" r="2.5" fill="${INK}"/>`,
      ),
  },
  {
    id: 'kit_hamburhery',
    slot: 'feet',
    name: 'Капці-гамбургери',
    price: 15,
    draw: () =>
      kitFeet(
        `<path d="M-22 -10 Q-22 -26 0 -26 Q22 -26 22 -10 Z" fill="#e0a458" ${st(3)}/>` +
          `<path d="M-24 -10 Q-12 -4 0 -10 Q12 -4 24 -10" stroke="#43a047" stroke-width="5" fill="none"/>` +
          `<rect x="-22" y="-10" width="44" height="6" fill="#6d4c41" ${st(2)}/>` +
          `<rect x="-22" y="-4" width="44" height="7" rx="3" fill="#e0a458" ${st(3)}/>` +
          `<circle cx="-8" cy="-20" r="1.5" fill="#fff8e1"/><circle cx="6" cy="-22" r="1.5" fill="#fff8e1"/>`,
      ),
  },
];

const kishkaItems: Item[] = [
  {
    id: 'kishka_kurcha',
    slot: 'torso',
    name: 'Костюм курчати',
    price: 20,
    draw: () =>
      `<path d="${KIT_BODY}" fill="#ffee58" ${stroke}/>` +
      // fluffy wings and a fluff at the top
      `<path d="M-54 -96 Q-80 -70 -60 -40 Q-50 -60 -44 -80 Z" fill="#fdd835" ${st(4)}/>` +
      `<path d="M54 -96 Q80 -70 60 -40 Q50 -60 44 -80 Z" fill="#fdd835" ${st(4)}/>` +
      [[-30, -40], [0, -30], [30, -44], [-10, -80], [20, -96]].map(([x, y]) => `<path d="M${x - 6} ${y} q6 -8 12 0" stroke="#f9a825" stroke-width="3" fill="none"/>`).join('') +
      `<path d="M-10 -60 L10 -60 L0 -48 Z" fill="#ff9800" ${st(2)}/>`,
  },
  {
    id: 'kishka_bal',
    slot: 'torso',
    name: 'Бальна сукня',
    price: 25,
    draw: () =>
      `<path d="M-40 -60 Q-80 -30 -78 2 Q0 14 78 2 Q80 -30 40 -60 Z" fill="#ba68c8" ${stroke}/>` +
      `<path d="M-60 -20 Q-40 -4 -20 -20 Q0 -4 20 -20 Q40 -4 60 -20" stroke="#f3e5f5" stroke-width="4" fill="none"/>` +
      `<path d="M-46 -60 Q-56 -96 -27 -130 Q0 -142 27 -130 Q56 -96 46 -60 Q0 -50 -46 -60 Z" fill="#8e24aa" ${stroke}/>` +
      `<path d="M-30 -124 Q0 -110 30 -124" stroke="#f3e5f5" stroke-width="5" fill="none"/>` +
      star(-40, -30, 7, '#fff59d', 2) +
      star(44, -14, 6, '#fff59d', 2) +
      star(6, -90, 8, '#fff59d', 2),
  },
  {
    id: 'kishka_tort',
    slot: 'legs',
    name: 'Спідниця-торт',
    price: 20,
    draw: () =>
      `<path d="M-56 -30 L-58 -6 Q0 6 58 -6 L56 -30 Z" fill="#f8bbd0" ${stroke}/>` +
      `<path d="M-50 -54 L-52 -30 Q0 -20 52 -30 L50 -54 Z" fill="#fff3e0" ${stroke}/>` +
      `<path d="M-56 -30 q8 10 16 0 q8 10 16 0 q8 10 16 0 q8 10 16 0 q8 10 16 0 q8 10 16 0 q8 10 16 0" stroke="#fff" stroke-width="5" fill="none"/>` +
      `<path d="M-50 -54 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0 q10 8 20 0" stroke="#ec407a" stroke-width="5" fill="none"/>` +
      `<circle cx="30" cy="-62" r="8" fill="#d50000" ${st(3)}/><path d="M30 -70 q4 -8 10 -8" stroke="#2e7d32" stroke-width="2.5" fill="none"/>` +
      dots([[-30, -40], [-6, -36], [20, -42], [-40, -14], [0, -12], [36, -16]], 2.5, '#ff7043'),
  },
  {
    id: 'kishka_piano',
    slot: 'legs',
    name: 'Штани-піаніно',
    price: 15,
    draw: () =>
      `<path d="${KIT_LAP}" fill="#fff" ${stroke}/>` +
      [-42, -26, -4, 12, 28, 44].map((x) => `<rect x="${x - 4}" y="-54" width="8" height="26" fill="#212121"/>`).join('') +
      [-48, -32, -16, 0, 16, 32, 48].map((x) => `<path d="M${x} -54 V-6" stroke="${INK}" stroke-width="2"/>`).join('') +
      `<path d="${KIT_LAP}" fill="none" ${stroke}/>`,
  },
  {
    id: 'kishka_khomiachky',
    slot: 'feet',
    name: 'Тапки-хом’ячки',
    price: 15,
    draw: () =>
      kitFeet(
        `<circle cx="-8" cy="-20" r="5" fill="#ffcc80" ${st(2)}/><circle cx="10" cy="-20" r="5" fill="#ffcc80" ${st(2)}/>` +
          `<ellipse cx="0" cy="-8" rx="24" ry="13" fill="#ffb74d" ${st(4)}/>` +
          `<ellipse cx="-8" cy="-4" rx="9" ry="6" fill="#fff3e0"/>` +
          `<circle cx="-12" cy="-12" r="2" fill="${INK}"/><circle cx="-2" cy="-12" r="2" fill="${INK}"/><circle cx="-7" cy="-7" r="2" fill="#f06292"/>`,
      ),
  },
  {
    id: 'kishka_dirky',
    slot: 'feet',
    name: 'Шкарпетки з дірками',
    price: 5,
    draw: () =>
      kitFeet(
        `<ellipse cx="0" cy="-8" rx="22" ry="11" fill="#4fc3f7" ${st(4)}/>` +
          `<path d="M-20 -6 h40" stroke="#fff" stroke-width="3"/>` +
          // toes poking out of the holes
          `<circle cx="-14" cy="-10" r="4" fill="#f6c48a" ${st(2)}/><circle cx="6" cy="-12" r="3.5" fill="#f6c48a" ${st(2)}/><circle cx="12" cy="-4" r="3" fill="#f6c48a" ${st(2)}/>`,
      ),
  },
];

// ---------------- собака / жучка (body ellipse 2,-68 58×32; four legs, rects at x -44 -18 14 34, 16 wide) ----------------
const DOG_X = [-44, -18, 14, 34];
const DOG_BODY = 'M2 -105 A63 37 0 1 1 1.9 -105 Z';
const dogLegs = (one: (x: number) => string) => DOG_X.map((x) => one(x + 8)).join('');

const sobakaItems: Item[] = [
  {
    id: 'sobaka_dino',
    slot: 'torso',
    name: 'Костюм динозавра',
    price: 25,
    draw: () =>
      // spikes along the back
      [-30, -10, 10, 30, 48].map((x, i) => `<path d="M${x - 10} ${-98 + Math.abs(x) * 0.12} L${x} ${-120 + Math.abs(x) * 0.1 + (i % 2) * 4} L${x + 10} ${-98 + Math.abs(x) * 0.12} Z" fill="#ff9800" ${st(3)}/>`).join('') +
      `<path d="${DOG_BODY}" fill="#66bb6a" ${stroke}/>` +
      `<path d="M-40 -52 Q2 -38 44 -52" stroke="#a5d6a7" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      dots([[-20, -80], [16, -88], [36, -72], [-6, -66]], 5, '#388e3c'),
  },
  {
    id: 'sobaka_zirka',
    slot: 'torso',
    name: 'Футболка «Я — ЗІРКА»',
    price: 15,
    draw: () =>
      `<path d="${DOG_BODY}" fill="#e91e63" ${stroke}/>` +
      star(-18, -72, 14, '#ffeb3b') +
      text(24, -60, 15, '#fff', 'Я —') +
      text(24, -44, 13, '#ffeb3b', 'ЗІРКА'),
  },
  {
    id: 'sobaka_sosysky',
    slot: 'legs',
    name: 'Штанці-сосиски',
    price: 15,
    draw: () =>
      dogLegs(
        (c) =>
          `<rect x="${c - 11}" y="-54" width="22" height="40" rx="10" fill="#e57373" ${st(4)}/>` +
          `<path d="M${c - 6} -44 l12 4 M${c - 6} -32 l12 4" stroke="#c62828" stroke-width="3" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'sobaka_harmoshky',
    slot: 'legs',
    name: 'Гетри-гармошки',
    price: 10,
    draw: () =>
      dogLegs(
        (c) =>
          `<path d="M${c - 11} -46 q11 -6 22 0 v26 q-11 6 -22 0 Z" fill="#9575cd" ${st(4)}/>` +
          [-40, -34, -28].map((y) => `<path d="M${c - 11} ${y} q11 5 22 0" stroke="#5e35b1" stroke-width="3" fill="none"/>`).join(''),
      ),
  },
  {
    id: 'sobaka_kolesa',
    slot: 'feet',
    name: 'Валянки з колесами',
    price: 20,
    draw: () =>
      dogLegs(
        (c) =>
          `<rect x="${c - 11}" y="-26" width="22" height="22" rx="5" fill="#9e9e9e" ${st(4)}/>` +
          `<circle cx="${c - 6}" cy="0" r="5" fill="#212121" ${st(2)}/><circle cx="${c + 6}" cy="0" r="5" fill="#212121" ${st(2)}/>` +
          `<circle cx="${c - 6}" cy="0" r="1.8" fill="#ffeb3b"/><circle cx="${c + 6}" cy="0" r="1.8" fill="#ffeb3b"/>`,
      ),
  },
  {
    id: 'sobaka_pozhezhnyk',
    slot: 'feet',
    name: 'Чобітки пожежника',
    price: 15,
    draw: () =>
      dogLegs(
        (c) =>
          `<path d="M${c - 10} -30 H${c + 10} L${c + 10} -6 Q${c + 10} 2 ${c} 2 L${c - 14} 2 Q${c - 16} -4 ${c - 10} -8 Z" fill="#d32f2f" ${st(4)}/>` +
          `<path d="M${c - 10} -18 H${c + 10}" stroke="#ffeb3b" stroke-width="4"/>`,
      ),
  },
];

const zhuchkaItems: Item[] = [
  {
    id: 'zhuchka_bdzhilka',
    slot: 'torso',
    name: 'Костюм бджілки',
    price: 20,
    draw: () =>
      `<ellipse cx="20" cy="-110" rx="16" ry="24" fill="#e3f2fd" fill-opacity=".85" ${st(3)} transform="rotate(-20 20 -110)"/>` +
      `<ellipse cx="42" cy="-106" rx="13" ry="20" fill="#e3f2fd" fill-opacity=".85" ${st(3)} transform="rotate(20 42 -106)"/>` +
      bands(['#ffd600', '#212121'], -105, -31, 12, ellW(2, -68, 63, 37), 2) +
      `<path d="${DOG_BODY}" fill="none" ${stroke}/>` +
      `<path d="M64 -66 l12 2 l-12 6 Z" fill="#212121" ${st(2)}/>`,
  },
  {
    id: 'zhuchka_zefirka',
    slot: 'torso',
    name: 'Пуховик-зефірка',
    price: 20,
    draw: () =>
      `<path d="${DOG_BODY}" fill="#f8bbd0" ${stroke}/>` +
      [-78, -62, -46].map((y) => `<path d="M-56 ${y} Q2 ${y + 10} 62 ${y}" stroke="#f48fb1" stroke-width="5" fill="none"/>`).join('') +
      `<path d="M-40 -94 Q2 -106 44 -94" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'zhuchka_lodianyky',
    slot: 'legs',
    name: 'Штанці-льодяники',
    price: 15,
    draw: () =>
      dogLegs(
        (c) =>
          `<rect x="${c - 11}" y="-52" width="22" height="38" rx="7" fill="#fff" ${st(4)}/>` +
          [-46, -36, -26].map((y) => `<path d="M${c - 10} ${y + 6} L${c + 10} ${y - 2}" stroke="#e53935" stroke-width="5"/>`).join('') +
          `<rect x="${c - 11}" y="-52" width="22" height="38" rx="7" fill="none" ${st(4)}/>`,
      ),
  },
  {
    id: 'zhuchka_svitliachky',
    slot: 'legs',
    name: 'Гетри-світлячки',
    price: 15,
    draw: () =>
      dogLegs(
        (c) =>
          `<rect x="${c - 11}" y="-50" width="22" height="34" rx="7" fill="#1a237e" ${st(4)}/>` +
          `<circle cx="${c - 4}" cy="-40" r="3" fill="#eeff41"/><circle cx="${c + 5}" cy="-30" r="2.5" fill="#eeff41"/><circle cx="${c - 3}" cy="-22" r="2" fill="#eeff41"/>`,
      ),
  },
  {
    id: 'zhuchka_raketa',
    slot: 'feet',
    name: 'Ролики з ракетою',
    price: 30,
    draw: () =>
      dogLegs(
        (c) =>
          `<rect x="${c - 11}" y="-22" width="22" height="16" rx="5" fill="#00bcd4" ${st(3)}/>` +
          `<rect x="${c - 13}" y="-7" width="26" height="4" fill="#607d8b"/>` +
          `<circle cx="${c - 7}" cy="0" r="4" fill="#ff9800" ${st(2)}/><circle cx="${c + 7}" cy="0" r="4" fill="#ff9800" ${st(2)}/>`,
      ) +
      // a rocket strapped behind the back legs, fire out of its tail
      `<path d="M58 -40 L88 -40 L88 -22 L58 -22 L48 -31 Z" fill="#eceff1" ${st(3)}/><path d="M80 -40 V-22" stroke="#e53935" stroke-width="4"/>` +
      `<path d="M88 -38 L110 -31 L88 -24 Z" fill="#ff9800"/><path d="M88 -35 L100 -31 L88 -27 Z" fill="#ffeb3b"/>` +
      `<path d="M66 -22 L58 -12" stroke="${INK}" stroke-width="3"/>`,
  },
  {
    id: 'zhuchka_polunytsi',
    slot: 'feet',
    name: 'Калоші-полуниці',
    price: 10,
    draw: () =>
      dogLegs(
        (c) =>
          `<path d="M${c - 13} -2 Q${c - 14} -22 ${c} -22 Q${c + 14} -22 ${c + 13} -2 Q${c} 6 ${c - 13} -2 Z" fill="#e53935" ${st(4)}/>` +
          `<path d="M${c - 8} -22 l4 -6 l4 5 l4 -5 l4 6" fill="#43a047" ${st(2)}/>` +
          `<circle cx="${c - 5}" cy="-12" r="1.5" fill="#fff59d"/><circle cx="${c + 5}" cy="-8" r="1.5" fill="#fff59d"/><circle cx="${c}" cy="-15" r="1.5" fill="#fff59d"/>`,
      ),
  },
];

// ---------------- півник (body ellipse 0,-74 50×40; thin legs at x -10, 14 from -34 down) ----------------
const PIV_BODY = 'M0 -119 A55 45 0 1 1 -0.1 -119 Z';
const pivLegs = (one: (x: number) => string) => [-10, 14].map(one).join('');

const pivnykItems: Item[] = [
  {
    id: 'pivnyk_husar',
    slot: 'torso',
    name: 'Гусарський мундир',
    price: 25,
    draw: () =>
      `<path d="${PIV_BODY}" fill="#c62828" ${stroke}/>` +
      [-96, -82, -68, -54].map((y) => `<path d="M-26 ${y} Q0 ${y + 6} 26 ${y}" stroke="#ffd54f" stroke-width="4" fill="none"/>`).join('') +
      [-96, -82, -68, -54].map((y) => `<circle cx="-28" cy="${y}" r="3.5" fill="#ffd54f"/><circle cx="28" cy="${y}" r="3.5" fill="#ffd54f"/>`).join('') +
      `<path d="M-50 -60 Q0 -24 50 -60" stroke="#1a237e" stroke-width="8" fill="none"/>`,
  },
  {
    id: 'pivnyk_bokser',
    slot: 'torso',
    name: 'Халат боксера',
    price: 20,
    draw: () =>
      `<path d="${PIV_BODY}" fill="#1e88e5" ${stroke}/>` +
      `<path d="M-30 -112 L0 -64 L30 -112" stroke="#fff" stroke-width="8" fill="none"/>` +
      `<rect x="-55" y="-70" width="110" height="9" rx="4" fill="#fff" ${st(2)}/>` +
      text(22, -88, 16, '#ffeb3b', 'ЧЕМП') +
      `<g transform="translate(-36 -48)"><circle r="10" fill="#e53935" ${st(3)}/><rect x="-6" y="8" width="12" height="7" fill="#fff" ${st(2)}/></g>`,
  },
  {
    id: 'pivnyk_shakhy',
    slot: 'legs',
    name: 'Штанці-шахи',
    price: 15,
    draw: () =>
      pivLegs(
        (x) =>
          `<rect x="${x - 8}" y="-44" width="16" height="30" fill="#fff" ${st(3)}/>` +
          [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${x - 8 + (i % 2) * 8}" y="${-44 + Math.floor(i / 2) * 10}" width="8" height="10" fill="#212121"/>`).join('') +
          `<rect x="${x - 8}" y="-44" width="16" height="30" fill="none" ${st(3)}/>`,
      ),
  },
  {
    id: 'pivnyk_kukurudza',
    slot: 'legs',
    name: 'Шорти-кукурудза',
    price: 15,
    draw: () =>
      `<path d="M-26 -46 Q2 -40 30 -46 L32 -22 L4 -22 L2 -32 L0 -22 L-26 -22 Z" fill="#fdd835" ${stroke}/>` +
      dots([[-18, -38], [-10, -34], [-18, -28], [12, -38], [20, -34], [12, -28], [24, -28]], 2.5, '#f9a825') +
      `<path d="M-26 -46 q-8 10 -4 22 M30 -46 q8 10 4 22" stroke="#43a047" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'pivnyk_kovzany',
    slot: 'feet',
    name: 'Ковзани',
    price: 20,
    draw: () =>
      pivLegs(
        (x) =>
          `<path d="M${x - 8} -22 L${x + 8} -22 L${x + 8} -6 L${x - 14} -6 Q${x - 14} -14 ${x - 8} -14 Z" fill="#fff" ${st(3)}/>` +
          `<path d="M${x - 18} 0 H${x + 10}" stroke="#90a4ae" stroke-width="3" stroke-linecap="round"/><path d="M${x - 4} -6 V0 M${x + 4} -6 V0" stroke="#90a4ae" stroke-width="2.5"/>` +
          `<path d="M${x - 6} -18 l10 4 M${x - 6} -12 l10 -4" stroke="#e53935" stroke-width="2"/>`,
      ),
  },
  {
    id: 'pivnyk_chervyachky',
    slot: 'feet',
    name: 'Капці-черв’ячки',
    price: 10,
    draw: () =>
      pivLegs(
        (x) =>
          `<path d="M${x + 10} -4 q-6 -10 -12 0 q-6 -10 -12 0 q-4 -8 -8 -2" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/>` +
          `<path d="M${x + 10} -4 q-6 -10 -12 0 q-6 -10 -12 0 q-4 -8 -8 -2" stroke="#f48fb1" stroke-width="6" fill="none" stroke-linecap="round"/>` +
          `<circle cx="${x - 22}" cy="-8" r="1.8" fill="${INK}"/>`,
      ),
  },
];

// ---------------- журавель (body ellipse 0,-180 60×40; long thin legs from -150 to the ground) ----------------
const ZHUR_BODY = 'M0 -225 A65 45 0 1 1 -0.1 -225 Z';
/** the two legs: x at the top (-150) and at the bottom (-4) */
const ZHUR_LEGS: [number, number][] = [[-12, -18], [14, 22]];

const zhuravelItems: Item[] = [
  {
    id: 'zhuravel_pitsa',
    slot: 'torso',
    name: 'Костюм піци',
    price: 20,
    draw: () =>
      // a whole round pizza with a slice cut out
      `<path d="${ZHUR_BODY}" fill="#d7a04a" ${stroke}/>` +
      `<ellipse cx="0" cy="-180" rx="54" ry="35" fill="#ffca28"/>` +
      `<path d="M0 -180 L54 -180 A54 35 0 0 0 38 -205 Z" fill="#d7a04a"/><path d="M0 -180 L54 -180 M0 -180 L38 -205" stroke="${INK}" stroke-width="3"/>` +
      [[-30, -196], [-6, -160], [24, -168], [-36, -166], [8, -200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#e53935" ${st(2)}/>`).join('') +
      [[-16, -184], [16, -150], [-50, -184]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#43a047"/>`).join('') +
      `<path d="M-20 -146 q3 8 0 14 M30 -150 q3 8 0 14" stroke="#ffca28" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },

  {
    id: 'zhuravel_podushky',
    slot: 'torso',
    name: 'Бронежилет із подушок',
    price: 20,
    draw: () =>
      `<path d="${ZHUR_BODY}" fill="#90a4ae" ${stroke}/>` +
      [[-34, -196, '#f48fb1'], [6, -200, '#81d4fa'], [-22, -160, '#fff59d'], [24, -162, '#a5d6a7']]
        .map(([x, y, c]) => `<rect x="${Number(x) - 18}" y="${Number(y) - 14}" width="36" height="28" rx="10" fill="${c}" ${st(3)}/><path d="M${Number(x) - 18} ${Number(y) - 14} l-4 -4 M${Number(x) + 18} ${Number(y) - 14} l4 -4 M${Number(x) - 18} ${Number(y) + 14} l-4 4 M${Number(x) + 18} ${Number(y) + 14} l4 4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`)
        .join(''),
  },
  {
    id: 'zhuravel_horoshky',
    slot: 'legs',
    name: 'Гольфи-горошки',
    price: 10,
    draw: () =>
      ZHUR_LEGS.map(([a, b]) => {
        const m = (t: number) => a + (b - a) * t;
        return (
          `<path d="M${m(0.45) - 7} -84 L${m(0.45) + 7} -84 L${b + 7} -8 L${b - 7} -8 Z" fill="#fff" ${st(3)}/>` +
          [0.55, 0.7, 0.85].map((t, i) => `<circle cx="${m(t) + (i % 2 ? 2 : -2)}" cy="${-150 + 146 * t}" r="3" fill="#e53935"/>`).join('') +
          `<path d="M${m(0.45) - 8} -84 H${m(0.45) + 8}" stroke="#e53935" stroke-width="4"/>`
        );
      }).join(''),
  },
  {
    id: 'zhuravel_parashuty',
    slot: 'legs',
    name: 'Шорти-парашути',
    price: 15,
    draw: () =>
      `<path d="M-50 -150 Q-80 -130 -60 -100 Q-36 -92 -20 -104 L-2 -104 L0 -120 L4 -104 L22 -104 Q40 -92 64 -100 Q84 -130 56 -150 Z" fill="#ff7043" ${stroke}/>` +
      `<path d="M-40 -146 Q-50 -124 -44 -102 M-14 -148 Q-18 -126 -14 -106 M24 -148 Q28 -126 24 -106 M46 -146 Q58 -124 50 -102" stroke="#ffccbc" stroke-width="4" fill="none"/>`,
  },
  {
    id: 'zhuravel_pruzhyny',
    slot: 'feet',
    name: 'Черевики на пружинах',
    price: 20,
    draw: () =>
      ZHUR_LEGS.map(
        ([, b]) =>
          `<path d="M${b} -36 l-8 4 l16 4 l-16 4 l16 4 l-16 4 l8 4" stroke="#78909c" stroke-width="4" fill="none" stroke-linejoin="round"/>` +
          `<path d="M${b - 18} -6 Q${b - 18} -20 ${b} -20 Q${b + 14} -20 ${b + 12} -6 Z" fill="#7e57c2" ${st(3)}/>` +
          `<rect x="${b - 20}" y="-6" width="34" height="7" rx="3" fill="#fff" ${st(2)}/>`,
      ).join(''),
  },
  {
    id: 'zhuravel_snoubord',
    slot: 'feet',
    name: 'Сноуборд',
    price: 25,
    draw: () =>
      `<path d="M-64 -4 Q-74 -4 -72 4 Q-68 10 -56 8 L60 8 Q74 10 76 2 Q76 -4 66 -4 Z" fill="#00bcd4" ${stroke}/>` +
      `<path d="M-40 2 H52" stroke="#fff" stroke-width="4" stroke-dasharray="10 6"/>` +
      ZHUR_LEGS.map(([, b]) => `<rect x="${b - 10}" y="-14" width="20" height="12" rx="4" fill="#212121" ${st(3)}/>`).join('') +
      star(-50, 2, 5, '#ffeb3b', 1.5),
  },
];

export const ITEMS: Item[] = [...didItems, ...babaItems, ...kolobokItems, ...zayetsItems, ...vovkItems, ...vedmidItems, ...lysytsiaItems, ...kolobok2Items, ...kitItems, ...kishkaItems, ...sobakaItems, ...zhuchkaItems, ...pivnykItems, ...zhuravelItems];

export const SETS: Record<string, string> = {
  did: didItems.map((i) => i.id).join(' '),
  baba: babaItems.map((i) => i.id).join(' '),
  kolobok: [...kolobokItems, ...kolobok2Items].map((i) => i.id).join(' '),
  kit: kitItems.map((i) => i.id).join(' '),
  kishka: kishkaItems.map((i) => i.id).join(' '),
  sobaka: sobakaItems.map((i) => i.id).join(' '),
  zhuchka: zhuchkaItems.map((i) => i.id).join(' '),
  pivnyk: pivnykItems.map((i) => i.id).join(' '),
  zhuravel: zhuravelItems.map((i) => i.id).join(' '),
  zayets: zayetsItems.map((i) => i.id).join(' '),
  vovk: vovkItems.map((i) => i.id).join(' '),
  vedmid: vedmidItems.map((i) => i.id).join(' '),
  lysytsia: lysytsiaItems.map((i) => i.id).join(' '),
};
