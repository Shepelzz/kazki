// Clothes and more things of the heroes' wardrobe, group h (see wardrobe.ts and items/a.ts).
// SETS here ADD to a hero's set (they don't replace it).
// Clothes (torso / legs / feet) are drawn in the puppet's own numbers (its feet at 0,0):
// Котигорошко (puppets-kotyhoroshko.ts), the three bogatyrs sharing one body, the muzhychok and the
// griffin (puppets-kotyhoroshko2.ts).

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

type P = [number, number];

/** x of a quadratic curve at the height y (the side of a shirt), to keep stripes inside it */
const qx = (p0: P, c: P, p1: P, y: number) => {
  let best = p0[0];
  let bd = Infinity;
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const yy = (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t * t * p1[1];
    if (Math.abs(yy - y) < bd) {
      bd = Math.abs(yy - y);
      best = (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t * t * p1[0];
    }
  }
  return best;
};

/** a sleeve along the puppet's own arm: an outline and the cloth over it */
const sleeve = (d: string, w: number, fill: string, more = '') =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round"/>` +
  `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${w - 11}" stroke-linecap="round"/>` +
  more;

/** Котигорошко: the arms, the shirt's side, a body a little wider than his shirt */
const KH_ARMS = ['M-70 -264 Q-112 -214 -104 -150', 'M70 -264 Q112 -214 104 -150'];
const KH_SIDE: [P, P, P] = [[78, -278], [98, -190], [87, -98]];
const KH_BODY = 'M-78 -278 Q-98 -190 -87 -98 L87 -98 Q98 -190 78 -278 Q0 -300 -78 -278 Z';

/** the bogatyrs (Вернигора, Вернидуб, Крутивус): one body for the three */
const BH_ARMS = ['M-82 -282 Q-126 -230 -116 -160', 'M82 -282 Q126 -230 116 -160'];
const BH_SIDE: [P, P, P] = [[90, -296], [112, -200], [99, -114]];
const BH_BODY = 'M-90 -296 Q-112 -200 -99 -114 L99 -114 Q112 -200 90 -296 Q0 -322 -90 -296 Z';
const bhHalf = (y: number) => qx(...BH_SIDE, y);
/** both legs of a bogatyr's trousers, a little wider than his own */
const BH_LEGS = 'M-54 -136 L-58 -10 L-6 -10 L-3 -136 Z M54 -136 L58 -10 L6 -10 L3 -136 Z';

const pea = (x: number, y: number, r = 9) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#7cb342" ${st(3)}/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${(r * 0.3).toFixed(1)}" fill="#dcedc8"/>`;

const flower = (x: number, y: number, r: number, petal: string) =>
  [0, 72, 144, 216, 288]
    .map((a) => `<circle cx="${(x + Math.cos((a * Math.PI) / 180) * r).toFixed(1)}" cy="${(y + Math.sin((a * Math.PI) / 180) * r).toFixed(1)}" r="${(r * 0.7).toFixed(1)}" fill="${petal}"/>`)
    .join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.55).toFixed(1)}" fill="#fff59d"/>`;

const acorn = (x: number, y: number) =>
  `<g transform="translate(${x} ${y}) scale(.7)"><ellipse cx="0" cy="6" rx="9" ry="11" fill="#c98a3a" ${st(2.5)}/>` +
  `<path d="M-11 2 Q-11 -9 0 -9 Q11 -9 11 2 Z" fill="#6d4c41" ${st(2.5)}/><path d="M0 -9 V-14" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;

/** a yellow five-pointed star */
const starAt = (x: number, y: number, r: number) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="#ffeb3b" ${st(2.5)}/>`;
};

const mirror = (s: string) => `${s}<g transform="scale(-1 1)">${s}</g>`;

export const ITEMS: Item[] = [
  // ================= Котигорошко =================
  {
    id: 'kotyhoroshko_horokhmen',
    slot: 'torso',
    name: 'Костюм Горох-мена',
    price: 25,
    draw: () =>
      // the cape flaring out behind the arms
      mirror(`<path d="M-70 -268 Q-128 -170 -150 -36 Q-136 -48 -124 -34 Q-114 -50 -100 -40 Q-96 -120 -82 -200 Z" fill="#e53935" ${stroke}/>`) +
      `<path d="${KH_BODY}" fill="#43a047" ${stroke}/>` +
      // the emblem: a pea with a smile
      `<circle cx="0" cy="-196" r="36" fill="#ffeb3b" ${st(5)}/>` +
      `<circle cx="0" cy="-196" r="22" fill="#7cb342" ${st(4)}/><circle cx="-8" cy="-204" r="6" fill="#dcedc8"/>` +
      `<circle cx="-7" cy="-198" r="3" fill="${INK}"/><circle cx="7" cy="-198" r="3" fill="${INK}"/><path d="M-8 -188 q8 7 16 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      // a golden belt and the sleeves with red cuffs
      `<rect x="-90" y="-126" width="180" height="20" rx="7" fill="#ffca28" ${st(4)}/><rect x="-14" y="-130" width="28" height="28" rx="5" fill="#e53935" ${st(4)}/>` +
      KH_ARMS.map((d) => sleeve(d, 48, '#43a047')).join('') +
      `<circle cx="-104" cy="-152" r="20" fill="#e53935" ${st(4)}/><circle cx="104" cy="-152" r="20" fill="#e53935" ${st(4)}/>`,
  },
  {
    id: 'kotyhoroshko_struchky',
    slot: 'legs',
    name: 'Штани-стручки',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-48 -114 L-52 -10 L-4 -10 L-2 -114 Z" fill="#9ccc65" ${stroke}/>` +
          `<path d="M-26 -110 Q-30 -60 -27 -14" stroke="#558b2f" stroke-width="4" fill="none"/>` +
          // the pod split open at the knee, peas peeping out
          `<path d="M-42 -76 Q-26 -96 -10 -76 Q-26 -40 -42 -76 Z" fill="#f1f8e9" ${st(4)}/>` +
          pea(-31, -74, 7) +
          pea(-20, -66, 7) +
          `<path d="M-50 -14 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8" stroke="#558b2f" stroke-width="4" fill="none" stroke-linejoin="round"/>`,
      ),
  },
  {
    id: 'kotyhoroshko_kaptsi',
    slot: 'feet',
    name: 'Капці-горошини',
    price: 10,
    draw: () =>
      mirror(
        `<ellipse cx="-34" cy="-16" rx="32" ry="22" fill="#7cb342" ${stroke}/>` +
          `<ellipse cx="-46" cy="-26" rx="9" ry="6" fill="#dcedc8"/>` +
          `<circle cx="-42" cy="-16" r="6" fill="#fff" ${st(2)}/><circle cx="-26" cy="-16" r="6" fill="#fff" ${st(2)}/>` +
          `<circle cx="-41" cy="-15" r="3" fill="${INK}"/><circle cx="-25" cy="-15" r="3" fill="${INK}"/>` +
          `<path d="M-40 -5 q6 5 12 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
          `<path d="M-34 -38 q-4 -12 6 -16" stroke="#558b2f" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      ),
  },

  // ================= Вернигора =================
  {
    id: 'vernyhora_tryko',
    slot: 'torso',
    name: 'Трико силача',
    price: 25,
    draw: () => {
      // bare strong arms and chest, a striped leotard on one strap
      const top = -244;
      const h = bhHalf(top);
      let stripes = '';
      for (let y = top + 18; y < -150; y += 24) {
        const w = bhHalf(y) - 2;
        stripes += `<path d="M${(-w).toFixed(1)} ${y} H${w.toFixed(1)}" stroke="#e53935" stroke-width="12"/>`;
      }
      return (
        `<path d="${BH_BODY}" fill="#e0b090" ${stroke}/>` +
        `<circle cx="-126" cy="-224" r="22" fill="#e0b090" ${stroke}/><circle cx="126" cy="-224" r="22" fill="#e0b090" ${stroke}/>` +
        BH_ARMS.map((d) => sleeve(d, 52, '#e0b090')).join('') +
        // bulging muscles
        `<path d="M-118 -236 q-26 4 -24 30" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
        `<path d="M118 -236 q26 4 24 30" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
        `<path d="M-136 -214 c-4 -12 8 -14 10 -6 c2 -8 14 -6 10 6 l-10 10 z" fill="#e53935"/>` +
        `<path d="M70 -300 L96 -292 L${(h - 20).toFixed(0)} ${top + 8} L${(h - 50).toFixed(0)} ${top + 10} Z" fill="#fff" ${st(4)}/>` +
        `<path d="M${(-h).toFixed(1)} ${top} Q0 ${top + 22} ${h.toFixed(1)} ${top} L${bhHalf(-118).toFixed(1)} -118 L${(-bhHalf(-118)).toFixed(1)} -118 Z" fill="#fff" ${stroke}/>` +
        stripes +
        `<path d="M${(-h).toFixed(1)} ${top} Q0 ${top + 22} ${h.toFixed(1)} ${top}" stroke="${INK}" stroke-width="6" fill="none"/>` +
        // the champion's belt
        `<rect x="-104" y="-160" width="208" height="30" rx="8" fill="#ffb300" ${st(5)}/>` +
        `<circle cx="0" cy="-145" r="26" fill="#ffe082" ${st(5)}/>` +
        `<text x="0" y="-135" text-anchor="middle" font-size="28" font-weight="900" fill="#e65100" font-family="sans-serif">1</text>` +
        `<circle cx="-60" cy="-145" r="5" fill="#e53935"/><circle cx="60" cy="-145" r="5" fill="#e53935"/>`
      );
    },
  },
  {
    id: 'vernyhora_havaiky',
    slot: 'legs',
    name: 'Шорти-гавайки з квітами',
    price: 15,
    draw: () =>
      // hairy bare legs and bright shorts
      mirror(
        `<path d="M-54 -80 L-55 -16 L-7 -16 L-6 -80 Z" fill="#e0b090" ${stroke}/>` +
          `<path d="M-46 -60 l4 -5 M-36 -48 l4 -5 M-46 -36 l4 -5 M-24 -56 l4 -5 M-28 -34 l4 -5 M-18 -42 l4 -5" stroke="#6d4c41" stroke-width="3" stroke-linecap="round"/>`,
      ) +
      `<path d="M-58 -138 L-64 -66 L-4 -66 L0 -104 L4 -66 L64 -66 L58 -138 Z" fill="#ff9800" ${stroke}/>` +
      flower(-36, -118, 9, '#ec407a') +
      flower(30, -122, 9, '#29b6f6') +
      flower(-30, -84, 8, '#ab47bc') +
      flower(40, -86, 8, '#ec407a') +
      flower(0, -130, 7, '#66bb6a') +
      `<path d="M-50 -100 q8 -10 16 0 M14 -104 q8 -10 16 0" stroke="#2e7d32" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'vernyhora_hyri',
    slot: 'feet',
    name: 'Лапті-гирі',
    price: 20,
    draw: () =>
      mirror(
        // a kettlebell chained to each bast shoe
        `<path d="M-64 -12 Q-74 -6 -82 -10" stroke="#757575" stroke-width="4" fill="none" stroke-dasharray="5 3"/>` +
          `<path d="M-108 -42 Q-108 -60 -92 -60 Q-76 -60 -76 -42" stroke="${INK}" stroke-width="12" fill="none"/>` +
          `<path d="M-108 -42 Q-108 -60 -92 -60 Q-76 -60 -76 -42" stroke="#424242" stroke-width="5" fill="none"/>` +
          `<path d="M-116 0 Q-120 -40 -92 -42 Q-64 -40 -68 0 Z" fill="#424242" ${stroke}/>` +
          `<path d="M-108 -30 q4 -6 10 -6" stroke="#9e9e9e" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          // the bast shoe, laces up the shin
          `<path d="M-52 -26 L-12 -52 M-52 -52 L-12 -26" stroke="#a1887f" stroke-width="5" stroke-linecap="round"/>` +
          `<path d="M-66 2 Q-70 -34 -46 -36 L-12 -34 Q-2 -18 -6 2 Z" fill="#e6c27a" ${stroke}/>` +
          `<path d="M-60 -26 l10 22 M-48 -32 l12 30 M-34 -34 l12 32 M-22 -32 l10 28 M-60 -6 l16 -24 M-48 -2 l18 -30 M-32 -2 l16 -30 M-18 -2 l10 -18" stroke="#b08a40" stroke-width="3"/>`,
      ) +
      [-92, 92].map((x) => `<text x="${x}" y="-12" text-anchor="middle" font-size="15" font-weight="900" fill="#fff" font-family="sans-serif">16</text>`).join(''),
  },

  // ================= Вернидуб =================
  {
    id: 'vernydub_lystia',
    slot: 'torso',
    name: 'Кольчуга з листя',
    price: 25,
    draw: () => {
      // rows of oak leaves like the scales of a mail shirt
      let leaves = '';
      const greens = ['#66bb6a', '#43a047', '#9ccc65', '#7cb342'];
      let r = 0;
      for (let y = -270; y < -150; y += 20, r++) {
        const w = bhHalf(y) - 12;
        for (let x = -w + (r % 2) * 12; x <= w + 1; x += 24)
          leaves += `<path d="M${x.toFixed(1)} ${y - 12} q-12 6 -10 14 q-6 4 -2 10 q6 8 12 10 q6 -2 12 -10 q4 -6 -2 -10 q2 -8 -10 -14 Z" fill="${greens[(r + Math.round(x / 24)) & 3]}" ${st(2.5)}/>` + `<path d="M${x.toFixed(1)} ${y - 10} v20" stroke="#2e7d32" stroke-width="2"/>`;
      }
      return (
        `<path d="${BH_BODY}" fill="#2e7d32" ${stroke}/>` +
        leaves +
        // a belt of twisted branches with an acorn buckle
        `<rect x="${(-bhHalf(-140) - 2).toFixed(1)}" y="-152" width="${(2 * bhHalf(-140) + 4).toFixed(1)}" height="22" rx="8" fill="#8d6e63" ${st(4)}/>` +
        `<path d="M-90 -141 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#5d4037" stroke-width="3" fill="none"/>` +
        acorn(0, -146).replace('scale(.7)', 'scale(1.3)') +
        // leafy sleeves
        BH_ARMS.map((d) => sleeve(d, 50, '#43a047', `<path d="${d}" fill="none" stroke="#9ccc65" stroke-width="30" stroke-dasharray="10 12"/>`)).join('') +
        `<path d="M-30 -300 q-14 -20 4 -24 q4 14 -4 24 Z M30 -300 q14 -20 -4 -24 q-4 14 4 24 Z" fill="#9ccc65" ${st(3)}/>`
      );
    },
  },
  {
    id: 'vernydub_zholudi',
    slot: 'legs',
    name: 'Штани в жолуді',
    price: 15,
    draw: () =>
      `<path d="${BH_LEGS}" fill="#ffe082" ${stroke}/>` +
      [
        [-40, -116],
        [-22, -90],
        [-42, -62],
        [-24, -36],
        [24, -118],
        [42, -92],
        [22, -64],
        [40, -38],
      ]
        .map(([x, y]) => acorn(x, y))
        .join(''),
  },
  {
    id: 'vernydub_penky',
    slot: 'feet',
    name: 'Чоботи-пеньки',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-68 2 L-64 -40 L-8 -40 L-4 2 Z" fill="#8d6e63" ${stroke}/>` +
          `<path d="M-56 -30 V-4 M-42 -34 V-2 M-26 -30 V-6 M-16 -36 V-10" stroke="#5d4037" stroke-width="4" stroke-linecap="round"/>` +
          `<ellipse cx="-36" cy="-40" rx="28" ry="8" fill="#ffcc80" ${st(4)}/>` +
          `<ellipse cx="-36" cy="-40" rx="16" ry="4" fill="none" stroke="#c98a3a" stroke-width="2.5"/>` +
          // a little mushroom on the side
          `<path d="M-70 -14 v-8" stroke="#fff3e0" stroke-width="5"/><path d="M-80 -20 Q-70 -36 -60 -20 Z" fill="#e53935" ${st(3)}/><circle cx="-72" cy="-25" r="2" fill="#fff"/>` +
          `<path d="M-30 -46 q-2 -12 8 -16 q-2 10 -8 16 Z" fill="#66bb6a" ${st(2.5)}/>`,
      ),
  },

  // ================= Крутивус =================
  {
    id: 'krutyvus_sportyvka',
    slot: 'torso',
    name: 'Спортивна куртка силача',
    price: 20,
    draw: () =>
      `<path d="${BH_BODY}" fill="#e53935" ${stroke}/>` +
      // the stand-up collar, the zip, the pockets
      `<path d="M-46 -306 L-40 -284 Q0 -296 40 -284 L46 -306 Q0 -318 -46 -306 Z" fill="#fff" ${st(4)}/>` +
      `<path d="M0 -290 V-120" stroke="#9e9e9e" stroke-width="8"/><path d="M0 -290 V-120" stroke="${INK}" stroke-width="3" stroke-dasharray="4 4"/>` +
      `<rect x="-8" y="-278" width="16" height="20" rx="4" fill="#ffd54f" ${st(3)}/>` +
      `<path d="M-74 -180 l30 4 M44 -176 l30 -4" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
      `<rect x="${(-bhHalf(-140)).toFixed(1)}" y="-150" width="${(2 * bhHalf(-140)).toFixed(1)}" height="30" fill="#fff" ${st(4)}/>` +
      `<path d="M${(-bhHalf(-135)).toFixed(1)} -135 H${bhHalf(-135).toFixed(1)}" stroke="#1e88e5" stroke-width="6"/>` +
      `<text x="-56" y="-220" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" stroke="${INK}" stroke-width="2" font-family="sans-serif">1</text>` +
      BH_ARMS.map((d) =>
        sleeve(d, 50, '#e53935', `<path d="${d}" fill="none" stroke="#fff" stroke-width="10"/><path d="${d}" fill="none" stroke="#1e88e5" stroke-width="3"/>`),
      ).join('') +
      `<circle cx="-116" cy="-162" r="22" fill="#fff" ${st(4)}/><circle cx="116" cy="-162" r="22" fill="#fff" ${st(4)}/>`,
  },
  {
    id: 'krutyvus_lampasy',
    slot: 'legs',
    name: 'Штани з лампасами',
    price: 15,
    draw: () =>
      `<path d="${BH_LEGS}" fill="#e53935" ${stroke}/>` +
      `<path d="M-48 -134 L-51 -12 M48 -134 L51 -12" stroke="#fff" stroke-width="9"/>` +
      `<path d="M-48 -134 L-51 -12 M48 -134 L51 -12" stroke="#1e88e5" stroke-width="3"/>` +
      `<path d="M-57 -22 H-7 M57 -22 H7" stroke="#fff" stroke-width="10"/>` +
      `<path d="M-57 -22 H-7 M57 -22 H7" stroke="${INK}" stroke-width="2" stroke-dasharray="3 3"/>`,
  },
  {
    id: 'krutyvus_chovnyky',
    slot: 'feet',
    name: 'Черевики-човники',
    price: 15,
    draw: () =>
      mirror(
        // little waves, a boat for a shoe, a sail with a flag
        `<path d="M-84 6 q8 -8 16 0 t16 0 t16 0 t16 0 t16 0" stroke="#29b6f6" stroke-width="6" fill="none" stroke-linecap="round"/>` +
          `<path d="M-38 -34 V-70" stroke="${INK}" stroke-width="4"/>` +
          `<path d="M-36 -68 L-14 -42 L-36 -40 Z" fill="#fff" ${st(3)}/><path d="M-38 -70 l-12 4 l12 4 z" fill="#e53935"/>` +
          `<path d="M-80 -30 L-2 -30 Q-6 -6 -20 0 L-62 0 Q-76 -10 -80 -30 Z" fill="#8d6e63" ${stroke}/>` +
          `<path d="M-78 -22 H-4" stroke="#fff" stroke-width="5"/>` +
          `<circle cx="-56" cy="-12" r="5" fill="#e3f2fd" ${st(2.5)}/><circle cx="-36" cy="-12" r="5" fill="#e3f2fd" ${st(2.5)}/>`,
      ),
  },

  // ================= Мужичок-з-нігтик =================
  {
    id: 'muzhychok_mantiia',
    slot: 'torso',
    name: 'Мантія короля-малючка',
    price: 20,
    draw: () =>
      `<path d="M-28 -100 Q-44 -70 -48 -42 Q0 -32 48 -42 Q44 -70 28 -100 Q0 -108 -28 -100 Z" fill="#c62828" ${st(4)}/>` +
      // the ermine hem and collar: white with black tails
      `<path d="M-50 -46 Q0 -36 50 -46 L50 -36 Q0 -26 -50 -36 Z" fill="#fff" ${st(3)}/>` +
      `<path d="M-30 -102 Q0 -90 30 -102 L32 -90 Q0 -78 -32 -90 Z" fill="#fff" ${st(3)}/>` +
      [-38, -22, -6, 10, 26, 40].map((x) => `<path d="M${x} -42 l-2 6 l4 0 z" fill="${INK}"/>`).join('') +
      [-20, 0, 20].map((x) => `<path d="M${x} -94 l-2 6 l4 0 z" fill="${INK}"/>`).join('') +
      `<circle cx="20" cy="-72" r="4" fill="#ffd54f" ${st(2)}/><circle cx="22" cy="-58" r="4" fill="#ffd54f" ${st(2)}/>` +
      `<path d="M-36 -56 l3 -7 l3 7 l-6 -4 h6 z" fill="#ffd54f" stroke="#ffd54f" stroke-width="1.5"/>` +
      `<path d="M30 -56 l3 -7 l3 7 l-6 -4 h6 z" fill="#ffd54f" stroke="#ffd54f" stroke-width="1.5"/>`,
  },
  {
    id: 'muzhychok_klitynka',
    slot: 'legs',
    name: 'Штанці в клітинку',
    price: 10,
    draw: () =>
      mirror(
        `<path d="M-20 -44 L-22 -4 L-1 -4 L-1 -44 Z" fill="#ffeb3b" ${st(3)}/>` +
          `<path d="M-14 -42 V-6 M-7 -42 V-6 M-21 -34 H-1 M-21 -24 H-1 M-22 -14 H-1" stroke="#e53935" stroke-width="2.5"/>` +
          `<path d="M-20 -44 L-22 -4 L-1 -4 L-1 -44 Z" fill="none" ${st(3)}/>`,
      ),
  },
  {
    id: 'muzhychok_cherevyky',
    slot: 'feet',
    name: 'Гномські черевики-закрутки',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-2 0 L-2 -12 Q-14 -16 -26 -12 Q-40 -10 -46 -24 Q-50 -30 -42 -32 Q-36 -30 -40 -24 Q-36 -14 -26 -6 L-24 0 Z" fill="#7e57c2" ${st(3)}/>` +
          `<circle cx="-41" cy="-33" r="4" fill="#ffd54f" ${st(2)}/>` +
          `<path d="M-20 -10 h12" stroke="#ffd54f" stroke-width="3"/>`,
      ),
  },

  // ================= Гриф =================
  {
    id: 'hryfon_kurtka',
    slot: 'torso',
    name: 'Куртка льотчика',
    price: 25,
    draw: () =>
      // the long scarf flying back over the wings
      `<path d="M-84 -186 Q-20 -220 40 -196 Q100 -172 160 -214 Q180 -200 176 -186 Q110 -150 44 -176 Q-20 -196 -80 -168 Z" fill="#fff" ${st(4)}/>` +
      `<path d="M150 -208 l10 12 M162 -212 l8 14" stroke="#e53935" stroke-width="5"/>` +
      `<path d="M-6 -200 l-4 18 M36 -194 l-2 18 M80 -186 l-2 16" stroke="#e53935" stroke-width="6"/>` +
      // the leather jacket over the body
      `<ellipse cx="20" cy="-110" rx="136" ry="66" fill="#8d5524" ${stroke}/>` +
      `<path d="M-60 -160 Q-30 -60 40 -46" stroke="${INK}" stroke-width="4" fill="none"/>` +
      `<path d="M-60 -160 Q-30 -60 40 -46" stroke="#cfd8dc" stroke-width="2" fill="none" stroke-dasharray="3 3"/>` +
      `<rect x="20" y="-140" width="44" height="30" rx="6" fill="#6d3c14" ${st(3)}/><path d="M20 -128 h44" stroke="${INK}" stroke-width="3"/>` +
      // a badge with wings
      `<circle cx="96" cy="-126" r="14" fill="#ffd54f" ${st(3)}/><path d="M80 -128 q-20 -10 -28 4 q14 -2 28 4 M112 -128 q20 -10 28 4 q-14 -2 -28 4" fill="#ffd54f" ${st(2.5)}/>` +
      `<path d="M92 -126 l4 -6 l4 6 l-8 -3 h8 z" fill="#e53935"/>` +
      `<path d="M-114 -100 q20 30 40 52" stroke="#6d3c14" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      // the fur collar round the neck
      [
        [-120, -152],
        [-104, -164],
        [-86, -170],
        [-68, -164],
        [-58, -150],
        [-128, -136],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#f5e6c8" ${st(3)}/>`)
        .join('') +
      `<path d="M-130 -184 Q-104 -196 -78 -186 L-80 -170 Q-104 -180 -128 -168 Z" fill="#e53935" ${st(4)}/>`,
  },
  {
    id: 'hryfon_mantiia',
    slot: 'torso',
    name: 'Мантія чарівника',
    price: 20,
    draw: () =>
      `<path d="M-90 -176 Q20 -230 150 -196 Q210 -160 250 -60 Q220 -76 200 -52 Q180 -76 156 -54 Q140 -110 60 -140 Q-20 -150 -84 -150 Z" fill="#283593" ${stroke}/>` +
      starAt(30, -176, 12) +
      starAt(110, -170, 14) +
      starAt(180, -120, 11) +
      starAt(70, -146, 8) +
      starAt(150, -142, 8) +
      `<path d="M-10 -192 a14 14 0 1 0 14 -14 a10 10 0 1 1 -14 14 Z" fill="#fff59d" ${st(2.5)}/>` +
      `<circle cx="215" cy="-80" r="4" fill="#fff59d"/><circle cx="-40" cy="-170" r="4" fill="#fff59d"/>` +
      `<path d="M-128 -186 Q-104 -198 -78 -188 L-80 -170 Q-104 -180 -126 -168 Z" fill="#8e24aa" ${st(4)}/>` +
      starAt(-104, -180, 9),
  },
  {
    id: 'hryfon_khmarynky',
    slot: 'legs',
    name: 'Штани-хмаринки',
    price: 10,
    draw: () => {
      const puffs: [number, number, number][] = [];
      for (const x of [-30, 40]) puffs.push([x - 10, -54, 13], [x + 10, -56, 13], [x - 12, -36, 13], [x + 12, -36, 13], [x, -24, 13], [x, -46, 13]);
      return (
        puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${stroke}/>`).join('') +
        puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('') +
        [-30, 40].map((x) => `<path d="M${x - 14} -40 q6 -6 12 0 M${x + 2} -28 q6 -6 12 0" stroke="#90caf9" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="${x + 12}" cy="-50" r="2.5" fill="#90caf9"/>`).join('')
      );
    },
  },
  {
    id: 'hryfon_pilot',
    slot: 'feet',
    name: 'Чоботи пілота',
    price: 15,
    draw: () =>
      [-30, 40]
        .map(
          (x) =>
            `<path d="M${x - 14} -34 L${x + 14} -34 L${x + 14} 0 L${x - 32} 0 Q${x - 34} -14 ${x - 14} -14 Z" fill="#6d3c14" ${st(4)}/>` +
            `<path d="M${x - 14} -20 H${x + 14}" stroke="#ffd54f" stroke-width="4"/><rect x="${x - 4}" y="-25" width="9" height="10" fill="none" stroke="#ffd54f" stroke-width="3"/>` +
            `<path d="M${x - 32} -4 H${x + 14}" stroke="${INK}" stroke-width="5"/>` +
            [x - 12, x, x + 12].map((cx) => `<circle cx="${cx}" cy="-38" r="8" fill="#f5e6c8" ${st(2.5)}/>`).join(''),
        )
        .join(''),
  },
];

// ======================= Round 2: more clothes =======================

const skin = '#e0b090';
const hand = (x: number, y: number, r: number, fill = '#f2c4a0') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${st(4)}/>`;
/** a star of any colour */
const starC = (x: number, y: number, r: number, fill: string) => starAt(x, y, r).replace('#ffeb3b', fill);
/** a tier of a skirt: from the top width to the bottom one, with a scalloped hem */
const tier = (top: number, bot: number, wt: number, wb: number, fill: string, n = 8) => {
  let d = `M${-wt} ${top} L${wt} ${top} L${wb} ${bot}`;
  const step = (2 * wb) / n;
  for (let i = 0; i < n; i++) d += ` q${(-step / 2).toFixed(1)} 12 ${(-step).toFixed(1)} 0`;
  return `<path d="${d} Z" fill="${fill}" ${stroke}/>`;
};
/** the girls' blouse (Невіста, Внучка, Князівна): one drawing for the three */
const GIRL_BODY = 'M-56 -240 Q-68 -200 -62 -160 L62 -160 Q68 -200 56 -240 Q0 -256 -56 -240 Z';
const girlHalf = (y: number) => qx([56, -240], [68, -200], [62, -160], y);
const girlHands = hand(-30, -176, 12) + hand(30, -176, 12);
/** the girls' skirt: from the waist (-174) down to the floor */
const SKIRT = 'M-62 -174 L62 -174 L86 -6 L-86 -6 Z';
/** Сірко's four legs (x of each) and his body */
const DOG_LEGS = [-48, -20, 32, 56];
/** the muzhychok's body, a little wider than his coat */
const MZ_BODY = 'M-29 -100 Q-35 -70 -31 -34 L31 -34 Q35 -70 29 -100 Q0 -108 -29 -100 Z';
/** the arms of the bogatyrs: points along the left one, outwards (for spikes) */
const BH_ARM_EDGE: P[] = [[-118, -262], [-132, -236], [-139, -208], [-140, -180]];

ITEMS.push(
  // ================= Котигорошко =================
  {
    id: 'kotyhoroshko_zmiy',
    slot: 'torso',
    name: 'Футболка «Я переміг Змія»',
    price: 20,
    draw: () =>
      KH_ARMS.map((d) => sleeve(d, 46, '#f2c4a0')).join('') +
      `<path d="${KH_BODY}" fill="#fff" ${stroke}/>` +
      ['M-70 -264 Q-90 -242 -96 -222', 'M70 -264 Q90 -242 96 -222'].map((d) => sleeve(d, 48, '#fff')).join('') +
      `<path d="M-30 -290 Q0 -260 30 -290" fill="#f2c4a0" ${st(4)}/>` +
      // a three-headed dragon with crossed-out eyes
      `<ellipse cx="0" cy="-186" rx="38" ry="24" fill="#66bb6a" ${st(4)}/>` +
      [-28, 0, 28]
        .map((x) => `<path d="M${x * 0.6} -204 L${x} -232" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x * 0.6} -204 L${x} -232" stroke="#66bb6a" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="-238" r="11" fill="#66bb6a" ${st(3)}/><path d="M${x - 5} -242 l4 4 m0 -4 l-4 4 M${x + 1} -242 l4 4 m0 -4 l-4 4" stroke="${INK}" stroke-width="1.8"/>`)
        .join('') +
      `<path d="M30 -180 q24 4 26 -14" stroke="#66bb6a" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<text x="0" y="-130" text-anchor="middle" font-size="15" font-weight="900" fill="#e53935" font-family="sans-serif">Я — 1 : ЗМІЙ — 0</text>`,
  },
  {
    id: 'kotyhoroshko_kasha',
    slot: 'torso',
    name: 'Кофта «Горохова каша»',
    price: 20,
    draw: () =>
      `<path d="${KH_BODY}" fill="#e6c27a" ${stroke}/>` +
      KH_ARMS.map((d) => sleeve(d, 48, '#e6c27a', `<path d="${d}" fill="none" stroke="#c8a052" stroke-width="16" stroke-dasharray="3 14" stroke-linecap="round"/>`)).join('') +
      [[-50, -250], [-20, -230], [30, -256], [56, -210], [-60, -180], [-10, -190], [40, -170], [-40, -130], [10, -140], [60, -124], [-70, -220], [20, -206]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#9ccc65" ${st(2.5)}/>`)
        .join('') +
      // a pocket with a wooden spoon, and the steam
      `<rect x="20" y="-238" width="7" height="60" rx="3" fill="#a1662f" ${st(2.5)} transform="rotate(20 24 -208)"/><ellipse cx="14" cy="-246" rx="10" ry="14" fill="#a1662f" ${st(3)} transform="rotate(20 14 -246)"/>` +
      `<rect x="4" y="-212" width="44" height="34" rx="6" fill="#d4a94e" ${st(3)}/>` +
      `<path d="M-50 -278 q-8 -12 0 -22 q8 -10 0 -20 M-30 -284 q-8 -10 0 -20" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>`,
  },
  {
    id: 'kotyhoroshko_kavuny',
    slot: 'legs',
    name: 'Шорти-кавуни',
    price: 15,
    draw: () =>
      mirror(`<path d="M-48 -72 L-49 -16 L-7 -16 L-6 -72 Z" fill="#f2c4a0" ${stroke}/>`) +
      `<path d="M-52 -114 L-58 -60 L-4 -60 L0 -92 L4 -60 L58 -60 L52 -114 Z" fill="#66bb6a" ${stroke}/>` +
      `<path d="M-40 -112 q-6 10 0 20 q6 10 -2 26 M-20 -112 q-6 10 0 20 q6 10 -2 26 M40 -112 q6 10 0 20 q-6 10 2 26 M20 -112 q6 10 0 20 q-6 10 2 26" stroke="#2e7d32" stroke-width="6" fill="none"/>` +
      mirror(
        `<path d="M-58 -60 L-4 -60 L-4 -74 Q-30 -82 -57 -74 Z" fill="#ef5350" ${st(3)}/>` +
          [-46, -34, -22, -12].map((x, i) => `<ellipse cx="${x}" cy="${-70 + (i % 2) * 4}" rx="2.5" ry="4" fill="${INK}"/>`).join(''),
      ),
  },
  {
    id: 'kotyhoroshko_kyshenky',
    slot: 'legs',
    name: 'Штани з кишенями для гороху',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-48 -114 L-52 -10 L-4 -10 L-2 -114 Z" fill="#5c6bc0" ${stroke}/>` +
          [[-46, -104], [-44, -70], [-46, -38]]
            .map(([x, y]) => `<rect x="${x}" y="${y}" width="38" height="24" rx="4" fill="#7986cb" ${st(3)}/>` + pea(x + 12, y - 2, 6) + pea(x + 26, y - 1, 6))
            .join('') +
          pea(-24, -6, 5),
      ),
  },
  {
    id: 'kotyhoroshko_kastruli',
    slot: 'feet',
    name: 'Капці-каструльки',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-64 -26 h-8 M-4 -26 h8" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
          `<path d="M-62 -36 L-60 0 L-8 0 L-6 -36 Z" fill="#e53935" ${stroke}/>` +
          [[-48, -24], [-30, -12], [-18, -26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff"/>`).join('') +
          `<path d="M-66 -36 Q-34 -50 -2 -36 Z" fill="#bdbdbd" ${st(4)}/><circle cx="-34" cy="-46" r="5" fill="${INK}"/>` +
          `<path d="M-46 -56 q-6 -8 0 -16 M-24 -56 q6 -8 0 -16" stroke="#90a4ae" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'kotyhoroshko_bulavy',
    slot: 'feet',
    name: 'Черевики-булави',
    price: 20,
    draw: () =>
      mirror(
        Array.from({ length: 7 }, (_, i) => {
          const a = Math.PI * (1 + (i / 6));
          const c = [-34 + Math.cos(a) * 24, -18 + Math.sin(a) * 24];
          const t = [-34 + Math.cos(a) * 38, -18 + Math.sin(a) * 38];
          return `<path d="M${(c[0] - Math.sin(a) * 6).toFixed(1)} ${(c[1] + Math.cos(a) * 6).toFixed(1)} L${t[0].toFixed(1)} ${t[1].toFixed(1)} L${(c[0] + Math.sin(a) * 6).toFixed(1)} ${(c[1] - Math.cos(a) * 6).toFixed(1)} Z" fill="#cfd8dc" ${st(3)}/>`;
        }).join('') +
          `<path d="M-60 2 Q-62 -42 -34 -42 Q-6 -42 -8 2 Z" fill="#78909c" ${stroke}/>` +
          `<path d="M-50 -30 q8 -6 14 -4" stroke="#eceff1" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          `<rect x="-60" y="-8" width="52" height="8" fill="#455a64"/>`,
      ),
  },

  // ================= Вернигора =================
  {
    id: 'vernyhora_kaminci',
    slot: 'torso',
    name: 'Жилет з камінців',
    price: 20,
    draw: () => {
      const half = `<path d="M-90 -296 Q-112 -200 -99 -114 L-22 -114 L-30 -300 Z" fill="#8d6e63" ${stroke}/>`;
      const stones = [[-80, -270], [-56, -282], [-88, -236], [-62, -244], [-40, -258], [-92, -200], [-68, -208], [-44, -220], [-92, -160], [-70, -172], [-46, -184], [-80, -132], [-56, -140], [-36, -150]]
        .map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${10 + (i % 3) * 2}" ry="${8 + (i % 2) * 2}" fill="${['#bdbdbd', '#9e9e9e', '#d7ccc8', '#a1887f'][i % 4]}" ${st(2.5)}/>`)
        .join('');
      return mirror(half + stones);
    },
  },
  {
    id: 'vernyhora_svetrhora',
    slot: 'torso',
    name: 'Светр-гора з козликом',
    price: 25,
    draw: () =>
      `<path d="${BH_BODY}" fill="#81d4fa" ${stroke}/>` +
      BH_ARMS.map((d) => sleeve(d, 50, '#81d4fa', `<path d="${d}" fill="none" stroke="#fff" stroke-width="6"/>`)).join('') +
      `<circle cx="62" cy="-262" r="16" fill="#ffeb3b" ${st(3)}/>` +
      `<path d="M${(-bhHalf(-140)).toFixed(1)} -140 L-50 -230 L-20 -180 L10 -262 L60 -170 L80 -200 L${bhHalf(-140).toFixed(1)} -140 Z" fill="#8d8d8d" ${st(4)}/>` +
      `<path d="M-50 -230 L-40 -212 L-50 -216 L-58 -214 Z M10 -262 L26 -232 L14 -238 L4 -232 L-4 -238 Z M80 -200 L88 -188 L76 -190 Z" fill="#fff" ${st(2.5)}/>` +
      // a little goat on the top
      `<ellipse cx="10" cy="-274" rx="10" ry="6" fill="#fff" ${st(2.5)}/><circle cx="20" cy="-282" r="5" fill="#fff" ${st(2.5)}/><path d="M18 -286 l-3 -6 M22 -286 l2 -6" stroke="${INK}" stroke-width="2"/><path d="M4 -268 v6 M14 -268 v6" stroke="${INK}" stroke-width="2.5"/>` +
      `<rect x="${(-bhHalf(-128)).toFixed(1)}" y="-140" width="${(2 * bhHalf(-128)).toFixed(1)}" height="24" fill="#4fc3f7" ${st(4)}/>`,
  },
  {
    id: 'vernyhora_kameniuky',
    slot: 'legs',
    name: 'Штани з каменюками',
    price: 15,
    draw: () =>
      `<path d="${BH_LEGS}" fill="#9e9e9e" ${stroke}/>` +
      mirror(
        `<path d="M-50 -120 l10 10 l-6 12 l8 8 M-20 -80 l-8 10 l6 10" stroke="#616161" stroke-width="3" fill="none"/>` +
          `<path d="M-52 -60 Q-56 -76 -40 -78 Q-24 -80 -22 -64 Q-24 -50 -40 -50 Q-54 -50 -52 -60 Z" fill="#bcaaa4" ${st(3)}/>` +
          `<path d="M-46 -34 Q-48 -44 -36 -44 Q-24 -44 -24 -34 Q-26 -24 -36 -24 Q-46 -24 -46 -34 Z" fill="#d7ccc8" ${st(3)}/>` +
          `<path d="M-50 -14 q8 -8 14 -2 q6 -8 12 -2" stroke="#7cb342" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'vernyhora_kuli',
    slot: 'legs',
    name: 'Штани-повітряні кулі',
    price: 20,
    draw: () =>
      mirror(
        `<rect x="-54" y="-30" width="48" height="16" rx="6" fill="#5d4037" ${st(4)}/>` +
          `<ellipse cx="-32" cy="-82" rx="40" ry="56" fill="#ff7043" ${stroke}/>` +
          `<ellipse cx="-32" cy="-82" rx="25" ry="55" fill="#fff176"/>` +
          `<ellipse cx="-32" cy="-82" rx="10" ry="55" fill="#4fc3f7"/>` +
          `<ellipse cx="-32" cy="-82" rx="40" ry="56" fill="none" ${stroke}/>` +
          `<path d="M-46 -118 q-6 10 -4 22" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'vernyhora_skeli',
    slot: 'feet',
    name: 'Черевики-скелі',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-72 2 L-68 -24 L-56 -40 L-40 -32 L-26 -46 L-8 -30 L-4 2 Z" fill="#9e9e9e" ${stroke}/>` +
          `<path d="M-56 -40 L-50 -20 M-26 -46 L-30 -24 L-20 -12" stroke="#616161" stroke-width="3" fill="none"/>` +
          `<path d="M-40 -32 q6 -8 14 -14" stroke="#7cb342" stroke-width="6" fill="none" stroke-linecap="round"/>` +
          `<circle cx="-62" cy="-8" r="3" fill="#757575"/><circle cx="-18" cy="-6" r="3" fill="#757575"/>`,
      ),
  },
  {
    id: 'vernyhora_kroty',
    slot: 'feet',
    name: 'Капці-кроти',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-80 2 Q-78 -12 -64 -12 Q-56 -4 -60 2 Z" fill="#8d6e63" ${st(3)}/>` +
          `<ellipse cx="-34" cy="-16" rx="32" ry="20" fill="#455a64" ${stroke}/>` +
          `<ellipse cx="-64" cy="-14" rx="8" ry="6" fill="#f48fb1" ${st(3)}/>` +
          `<path d="M-42 -24 q4 -3 8 0 M-30 -24 q4 -3 8 0" stroke="#cfd8dc" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
          `<path d="M-50 2 l-6 -8 l8 2 l2 -8 l4 8 l4 -6 l0 10 Z" fill="#f8bbd0" ${st(2)}/>` +
          `<path d="M-58 -12 l-10 -6 M-58 -10 l-12 0" stroke="#cfd8dc" stroke-width="1.5"/>`,
      ),
  },

  // ================= Вернидуб =================
  {
    id: 'vernydub_kora',
    slot: 'torso',
    name: 'Сорочка-кора з білкою',
    price: 25,
    draw: () =>
      `<path d="${BH_BODY}" fill="#795548" ${stroke}/>` +
      `<path d="M-70 -290 q6 40 -2 80 q-6 40 4 90 M-36 -300 q-6 50 2 100 q6 40 -2 82 M36 -300 q6 50 -2 100 q-6 40 2 82 M70 -290 q-6 40 2 80 q6 40 -4 90" stroke="#4e342e" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      BH_ARMS.map((d) => sleeve(d, 50, '#795548', `<path d="${d}" fill="none" stroke="#4e342e" stroke-width="22" stroke-dasharray="4 16"/>`)).join('') +
      // a squirrel peeping out of a hollow, with an acorn (left of the sapling in his belt)
      `<g transform="translate(-26 0)">` +
      `<ellipse cx="-4" cy="-196" rx="34" ry="42" fill="#3e2723" ${st(4)}/>` +
      `<path d="M14 -230 Q50 -260 30 -290 Q60 -270 44 -220 Z" fill="#ff8a3d" ${st(3)}/>` +
      `<circle cx="-4" cy="-200" r="20" fill="#ff8a3d" ${st(3)}/>` +
      `<path d="M-20 -214 l-4 -14 l12 8 Z M12 -214 l4 -14 l-12 8 Z" fill="#ff8a3d" ${st(2.5)}/>` +
      `<circle cx="-11" cy="-204" r="3" fill="${INK}"/><circle cx="3" cy="-204" r="3" fill="${INK}"/><ellipse cx="-4" cy="-194" rx="4" ry="3" fill="${INK}"/>` +
      acorn(-4, -174).replace('scale(.7)', 'scale(1.1)') +
      `</g>`,
  },
  {
    id: 'vernydub_hnizdo_svetr',
    slot: 'torso',
    name: 'Светр-гніздо з пташенятами',
    price: 25,
    draw: () =>
      `<path d="${BH_BODY}" fill="#a1887f" ${stroke}/>` +
      `<path d="M-80 -270 q30 10 50 -6 M20 -280 q30 14 60 0 M-90 -150 q40 -10 70 6 M30 -150 q30 -12 60 4 M-96 -220 q20 6 30 -4 M70 -230 q16 8 26 -6" stroke="#6d4c41" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      BH_ARMS.map((d) => sleeve(d, 50, '#8d6e63', `<path d="${d}" fill="none" stroke="#6d4c41" stroke-width="20" stroke-dasharray="3 9"/>`)).join('') +
      // three chicks in a nest on the chest
      `<g transform="translate(-22 0)">` +
      [-34, 0, 34]
        .map(
          (x, i) =>
            `<circle cx="${x}" cy="${-226 - (i === 1 ? 8 : 0)}" r="17" fill="#fff176" ${st(3)}/>` +
            `<circle cx="${x - 6}" cy="${-232 - (i === 1 ? 8 : 0)}" r="2.5" fill="${INK}"/><circle cx="${x + 6}" cy="${-232 - (i === 1 ? 8 : 0)}" r="2.5" fill="${INK}"/>` +
            `<path d="M${x - 7} ${-222 - (i === 1 ? 8 : 0)} L${x} ${-210 - (i === 1 ? 8 : 0)} L${x + 7} ${-222 - (i === 1 ? 8 : 0)} Z" fill="#ff9800" ${st(2)}/>`,
        )
        .join('') +
      `<path d="M-64 -214 Q0 -230 64 -214 Q58 -170 0 -168 Q-58 -170 -64 -214 Z" fill="#8d6e63" ${st(4)}/>` +
      `<path d="M-60 -206 l40 18 M-40 -214 l60 30 M0 -212 l50 26 M50 -214 l-60 34 M20 -212 l-56 30" stroke="#5d4037" stroke-width="3"/></g>`,
  },
  {
    id: 'vernydub_mukhomory',
    slot: 'legs',
    name: 'Штани-мухомори',
    price: 15,
    draw: () =>
      `<path d="${BH_LEGS}" fill="#e53935" ${stroke}/>` +
      [[-38, -120], [-20, -100], [-42, -92], [-30, -40], [-16, -26], [36, -118], [20, -104], [44, -96], [30, -42], [18, -24], [-44, -24], [44, -28]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`)
        .join('') +
      mirror(`<path d="M-58 -80 L-3 -80 L-3 -64 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0 Z" fill="#fff" ${st(3)}/>`),
  },
  {
    id: 'vernydub_kolody',
    slot: 'legs',
    name: 'Штани-колоди',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-57 -136 L-58 -14 L-4 -14 L-3 -136 Z" fill="#8d6e63" ${stroke}/>` +
          `<path d="M-48 -130 q4 30 -2 60 q-4 30 2 50 M-34 -130 q-4 40 2 70 q2 20 -2 40 M-18 -132 q4 30 0 60 q-4 30 2 54" stroke="#5d4037" stroke-width="4" fill="none"/>` +
          `<ellipse cx="-30" cy="-14" rx="28" ry="8" fill="#ffcc80" ${st(4)}/>` +
          `<ellipse cx="-30" cy="-14" rx="17" ry="4.5" fill="none" stroke="#c98a3a" stroke-width="2"/><ellipse cx="-30" cy="-14" rx="7" ry="2" fill="none" stroke="#c98a3a" stroke-width="2"/>` +
          `<ellipse cx="-30" cy="-84" rx="7" ry="9" fill="#3e2723" ${st(2)}/>`,
      ) +
      `<path d="M58 -60 q14 -6 16 -20 q-14 2 -16 20 Z" fill="#66bb6a" ${st(2.5)}/>`,
  },
  {
    id: 'vernydub_yizhaky',
    slot: 'feet',
    name: 'Чоботи-їжаки',
    price: 20,
    draw: () =>
      mirror(
        Array.from({ length: 7 }, (_, i) => {
          const a = Math.PI * (1.05 + (i / 6) * 0.8);
          const cx = -34 + Math.cos(a) * 30;
          const cy = -8 + Math.sin(a) * 30;
          const tx = -34 + Math.cos(a) * 46;
          const ty = -8 + Math.sin(a) * 46;
          return `<path d="M${(cx - Math.sin(a) * 7).toFixed(1)} ${(cy + Math.cos(a) * 7).toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${(cx + Math.sin(a) * 7).toFixed(1)} ${(cy - Math.cos(a) * 7).toFixed(1)} Z" fill="#5d4037" ${st(3)}/>`;
        }).join('') +
          `<path d="M-70 0 Q-72 -32 -38 -36 Q-6 -36 -6 0 Z" fill="#8d6e63" ${stroke}/>` +
          `<path d="M-70 0 Q-80 -8 -72 -16" fill="#ffcc80" ${st(3)}/>` +
          `<circle cx="-78" cy="-8" r="5" fill="${INK}"/><circle cx="-62" cy="-18" r="3" fill="${INK}"/>`,
      ),
  },
  {
    id: 'vernydub_korinnia',
    slot: 'feet',
    name: 'Чоботи-коріння',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-60 -4 Q-80 -2 -94 6 M-50 0 Q-66 6 -72 10 M-20 0 Q-10 6 -4 10 M-58 -10 Q-80 -14 -90 -8" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
          `<path d="M-60 -4 Q-80 -2 -94 6 M-50 0 Q-66 6 -72 10 M-20 0 Q-10 6 -4 10 M-58 -10 Q-80 -14 -90 -8" stroke="#a1662f" stroke-width="5" fill="none" stroke-linecap="round"/>` +
          `<path d="M-62 2 L-60 -56 L-8 -56 L-6 2 Z" fill="#a1662f" ${stroke}/>` +
          `<path d="M-50 -48 q4 20 -2 40 M-34 -50 q-4 24 2 44 M-18 -48 q4 20 -2 40" stroke="#6d4426" stroke-width="3.5" fill="none"/>`,
      ),
  },

  // ================= Крутивус =================
  {
    id: 'krutyvus_vodolaz',
    slot: 'torso',
    name: 'Костюм водолаза',
    price: 25,
    draw: () =>
      mirror(`<rect x="-86" y="-336" width="28" height="74" rx="13" fill="#fdd835" ${st(4)}/><rect x="-82" y="-344" width="20" height="10" rx="3" fill="#9e9e9e" ${st(3)}/>`) +
      `<path d="${BH_BODY}" fill="#263238" ${stroke}/>` +
      mirror(`<path d="M${(-bhHalf(-280) + 6).toFixed(1)} -280 Q-98 -200 -86 -124" stroke="#fdd835" stroke-width="10" fill="none"/>`) +
      `<path d="M0 -300 V-118" stroke="#9e9e9e" stroke-width="6"/>` +
      `<circle cx="-48" cy="-210" r="18" fill="#eceff1" ${st(4)}/><path d="M-48 -210 l9 -8" stroke="#e53935" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M30 -150 h40 v-20 h-40 z" fill="#ff7043" ${st(3)}/>` +
      BH_ARMS.map((d) => sleeve(d, 50, '#263238', `<path d="${d}" fill="none" stroke="#fdd835" stroke-width="4"/>`)).join(''),
  },
  {
    id: 'krutyvus_vosmynih',
    slot: 'torso',
    name: 'Худі-восьминіг',
    price: 25,
    draw: () =>
      `<path d="M-74 -296 Q-86 -424 0 -428 Q86 -424 74 -296 Z" fill="#8e24aa" ${stroke}/>` +
      `<path d="${BH_BODY}" fill="#ab47bc" ${stroke}/>` +
      // tentacles hanging down from the hem
      [-80, -48, -16, 16, 48, 80]
        .map((x, i) => {
          const d = `M${x} -120 q${i % 2 ? 12 : -12} 20 0 36 q${i % 2 ? -14 : 14} 16 ${i % 2 ? 6 : -6} 28`;
          return `<path d="${d}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#ab47bc" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="-100" r="3" fill="#f8bbd0"/><circle cx="${x}" cy="-84" r="3" fill="#f8bbd0"/>`;
        })
        .join('') +
      `<path d="${BH_BODY}" fill="none" ${stroke}/>` +
      `<circle cx="-30" cy="-216" r="20" fill="#fff" ${st(4)}/><circle cx="30" cy="-216" r="20" fill="#fff" ${st(4)}/>` +
      `<circle cx="-26" cy="-212" r="9" fill="${INK}"/><circle cx="34" cy="-212" r="9" fill="${INK}"/>` +
      `<path d="M-22 -176 q22 18 44 0" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="-56" cy="-186" rx="10" ry="6" fill="#f48fb1"/><ellipse cx="56" cy="-186" rx="10" ry="6" fill="#f48fb1"/>` +
      BH_ARMS.map((d) => sleeve(d, 50, '#ab47bc')).join(''),
  },
  {
    id: 'krutyvus_vodospad',
    slot: 'legs',
    name: 'Штани-водоспад',
    price: 15,
    draw: () =>
      `<path d="${BH_LEGS}" fill="#29b6f6" ${stroke}/>` +
      mirror(`<path d="M-46 -130 q-6 30 0 60 q6 30 -2 54 M-30 -130 q6 30 0 60 q-6 30 2 54 M-14 -130 q-6 30 0 60 q6 30 -2 54" stroke="#e1f5fe" stroke-width="5" fill="none" stroke-linecap="round"/>`) +
      mirror([[-52, -14], [-40, -8], [-28, -14], [-16, -8], [-6, -14]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff" ${st(2.5)}/>`).join('')),
  },
  {
    id: 'krutyvus_matrats',
    slot: 'legs',
    name: 'Штани-надувний матрац',
    price: 15,
    draw: () =>
      mirror(
        Array.from({ length: 6 }, (_, i) => `<rect x="-60" y="${-138 + i * 21}" width="58" height="23" rx="11" fill="${i % 2 ? '#ffee58' : '#ff7043'}" ${st(3.5)}/>`).join('') +
          `<path d="M-50 -132 h14 M-50 -90 h14 M-50 -48 h14" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
      ) +
      `<rect x="54" y="-112" width="10" height="14" rx="3" fill="#fff" ${st(3)}/>`,
  },
  {
    id: 'krutyvus_kachenyata',
    slot: 'feet',
    name: 'Калоші-каченята',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-6 2 L-6 -24 Q-30 -36 -56 -22 Q-70 -12 -64 2 Z" fill="#ffeb3b" ${stroke}/>` +
          `<path d="M-40 -14 q10 8 22 0" stroke="#f9a825" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          `<circle cx="-46" cy="-38" r="15" fill="#ffeb3b" ${st(4)}/>` +
          `<path d="M-58 -40 L-78 -34 L-58 -30 Z" fill="#ff9800" ${st(3)}/>` +
          `<circle cx="-48" cy="-42" r="3.5" fill="${INK}"/>`,
      ),
  },
  {
    id: 'krutyvus_raky',
    slot: 'feet',
    name: 'Капці-раки',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-42 -26 L-46 -44 M-26 -26 L-22 -44" stroke="${INK}" stroke-width="4"/>` +
          `<circle cx="-46" cy="-46" r="6" fill="#fff" ${st(2.5)}/><circle cx="-22" cy="-46" r="6" fill="#fff" ${st(2.5)}/><circle cx="-46" cy="-46" r="2.5" fill="${INK}"/><circle cx="-22" cy="-46" r="2.5" fill="${INK}"/>` +
          `<path d="M-62 -16 Q-90 -26 -86 -46 Q-76 -40 -70 -42 Q-78 -26 -60 -24 Z" fill="#e53935" ${st(4)}/>` +
          `<ellipse cx="-34" cy="-12" rx="30" ry="16" fill="#e53935" ${stroke}/>` +
          `<path d="M-50 -8 h32 M-48 -2 h28" stroke="#b71c1c" stroke-width="3"/>` +
          `<path d="M-40 -18 q6 5 12 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      ),
  },

  // ================= Мужичок-з-нігтик =================
  {
    id: 'muzhychok_borovyk',
    slot: 'torso',
    name: 'Костюм гриба-боровика',
    price: 20,
    draw: () =>
      `<path d="${MZ_BODY}" fill="#fff8e1" ${st(4)}/>` +
      `<path d="M-26 -60 q8 4 14 -2 M8 -50 q8 4 14 -2" stroke="#d7ccc8" stroke-width="3" fill="none"/>` +
      `<path d="M-62 -84 Q-58 -122 0 -122 Q58 -122 62 -84 Q0 -96 -62 -84 Z" fill="#8d5524" ${st(4)}/>` +
      `<path d="M-40 -88 l-4 6 M-24 -91 l-2 6 M24 -91 l2 6 M40 -88 l4 6" stroke="#d7ccc8" stroke-width="2.5"/>` +
      `<path d="M-46 -108 q8 -8 18 -8" stroke="#b07a4a" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      // a worm peeping out of the cap
      `<path d="M52 -96 q10 -10 16 -2 q4 6 -2 10" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M52 -96 q10 -10 16 -2 q4 6 -2 10" stroke="#f48fb1" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="64" cy="-102" r="1.8" fill="${INK}"/>`,
  },
  {
    id: 'muzhychok_hrebinets',
    slot: 'torso',
    name: 'Светрик з гребінцем у кишені',
    price: 15,
    draw: () =>
      `<path d="${MZ_BODY}" fill="#43a047" ${st(4)}/>` +
      `<path d="M-30 -80 H30 M-31 -60 H31" stroke="#fdd835" stroke-width="5" stroke-dasharray="5 4"/>` +
      `<path d="M-24 -44 V-60 M-20 -44 V-60 M-16 -44 V-60 M-12 -44 V-60 M-8 -44 V-60" stroke="${INK}" stroke-width="2"/><rect x="-26" y="-66" width="20" height="8" rx="2" fill="#ffca28" ${st(2)}/>` +
      `<rect x="-28" y="-54" width="24" height="18" rx="3" fill="#2e7d32" ${st(2.5)}/>` +
      `<path d="M-31 -38 H31" stroke="#1b5e20" stroke-width="6"/>`,
  },
  {
    id: 'muzhychok_olivtsi',
    slot: 'legs',
    name: 'Штанці-олівці',
    price: 10,
    draw: () =>
      `<rect x="-21" y="-46" width="20" height="36" fill="#fdd835" ${st(3)}/><path d="M-14 -46 V-10 M-8 -46 V-10" stroke="#f9a825" stroke-width="2"/>` +
      `<path d="M-21 -10 L-11 -2 L-1 -10 Z" fill="#ffe0b2" ${st(2.5)}/><path d="M-14 -5 L-11 -2 L-8 -5 Z" fill="${INK}"/>` +
      `<rect x="1" y="-46" width="20" height="36" fill="#e53935" ${st(3)}/><path d="M8 -46 V-10 M14 -46 V-10" stroke="#b71c1c" stroke-width="2"/>` +
      `<path d="M1 -10 L11 -2 L21 -10 Z" fill="#ffe0b2" ${st(2.5)}/><path d="M8 -5 L11 -2 L14 -5 Z" fill="#e53935"/>` +
      `<rect x="-21" y="-50" width="20" height="6" fill="#f48fb1" ${st(2)}/><rect x="1" y="-50" width="20" height="6" fill="#f48fb1" ${st(2)}/>`,
  },
  {
    id: 'muzhychok_bubontsi',
    slot: 'legs',
    name: 'Штани з бубонцями',
    price: 15,
    draw: () =>
      `<rect x="-21" y="-46" width="20" height="40" rx="4" fill="#e53935" ${st(3)}/>` +
      `<rect x="1" y="-46" width="20" height="40" rx="4" fill="#43a047" ${st(3)}/>` +
      `<path d="M-21 -26 h20" stroke="#fdd835" stroke-width="3"/><path d="M1 -26 h20" stroke="#fdd835" stroke-width="3"/>` +
      [-24, 24].map((x) => `<circle cx="${x}" cy="-12" r="5" fill="#fdd835" ${st(2)}/><path d="M${x - 2} -10 h4" stroke="${INK}" stroke-width="1.5"/>`).join(''),
  },
  {
    id: 'muzhychok_naperstky',
    slot: 'feet',
    name: 'Черевики-наперстки',
    price: 10,
    draw: () =>
      mirror(
        `<path d="M-23 1 L-21 -16 Q-12 -22 -3 -16 L-1 1 Z" fill="#cfd8dc" ${st(3)}/>` +
          [-17, -12, -7].map((x) => `<circle cx="${x}" cy="-12" r="1.4" fill="#78909c"/><circle cx="${x}" cy="-6" r="1.4" fill="#78909c"/>`).join('') +
          `<path d="M-23 -2 H-1" stroke="#90a4ae" stroke-width="3"/>`,
      ),
  },
  {
    id: 'muzhychok_ravlyky',
    slot: 'feet',
    name: 'Черевики-равлики',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-30 -10 L-32 -20 M-25 -10 L-25 -21" stroke="${INK}" stroke-width="2"/><circle cx="-32" cy="-21" r="2" fill="${INK}"/><circle cx="-25" cy="-22" r="2" fill="${INK}"/>` +
          `<path d="M-1 1 L-1 -8 Q-16 -12 -28 -8 Q-36 -4 -32 1 Z" fill="#a5d6a7" ${st(3)}/>` +
          `<circle cx="-12" cy="-14" r="9" fill="#ffb74d" ${st(3)}/>` +
          `<path d="M-12 -14 m-2 0 a2 2 0 1 1 4 0 a4 4 0 1 1 -8 0 a6 6 0 1 1 12 0" stroke="#e65100" stroke-width="1.6" fill="none"/>`,
      ),
  },

  // ================= Гриф =================
  {
    id: 'hryfon_zoloto',
    slot: 'torso',
    name: 'Жилет зі скарбами',
    price: 25,
    draw: () =>
      `<ellipse cx="20" cy="-110" rx="136" ry="66" fill="#6a1b9a" ${stroke}/>` +
      `<ellipse cx="20" cy="-110" rx="124" ry="55" fill="none" stroke="#ffd54f" stroke-width="5" stroke-dasharray="14 6"/>` +
      [[-20, -112], [70, -112]]
        .map(
          ([x, y]) =>
            [-12, 0, 12].map((d, i) => `<circle cx="${x + 22 + d}" cy="${y - 4 - (i % 2) * 6}" r="9" fill="#ffd54f" ${st(2.5)}/>`).join('') +
            `<rect x="${x}" y="${y}" width="44" height="34" rx="6" fill="#8e24aa" ${st(3)}/>` +
            `<path d="M${x} ${y + 8} h44" stroke="${INK}" stroke-width="2.5"/>`,
        )
        .join('') +
      `<path d="M140 -96 l10 -16 l10 16 l-10 12 z" fill="#4fc3f7" ${st(3)}/>` +
      [[-120, -150], [-108, -160], [-94, -164], [-80, -160], [-68, -150]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fffde7" ${st(2.5)}/>`).join('') +
      `<path d="M-94 -156 l-8 16 h16 z" fill="#e53935" ${st(2.5)}/>`,
  },
  {
    id: 'hryfon_holfy',
    slot: 'legs',
    name: 'Гольфи в ромашки',
    price: 10,
    draw: () =>
      [-30, 40]
        .map(
          (x) =>
            `<path d="M${x} -58 V-14" stroke="${INK}" stroke-width="26" stroke-linecap="round"/>` +
            `<path d="M${x} -58 V-14" stroke="#b3e5fc" stroke-width="18" stroke-linecap="round"/>` +
            `<rect x="${x - 13}" y="-60" width="26" height="10" rx="4" fill="#fff" ${st(3)}/>` +
            flower(x, -36, 4, '#fff') +
            flower(x - 2, -20, 3.5, '#fff'),
        )
        .join(''),
  },
  {
    id: 'hryfon_likhtaryky',
    slot: 'legs',
    name: 'Штанці-ліхтарики',
    price: 15,
    draw: () =>
      [-30, 40]
        .map(
          (x) =>
            `<ellipse cx="${x}" cy="-50" rx="22" ry="17" fill="#f48fb1" ${st(4)}/>` +
            `<path d="M${x - 10} -64 q-4 14 0 26 M${x} -66 V-36 M${x + 10} -64 q4 14 0 26" stroke="#ec407a" stroke-width="2.5" fill="none"/>` +
            `<path d="M${x - 14} -34 q4 5 7 0 q4 5 7 0 q4 5 7 0 q4 5 7 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
        )
        .join(''),
  },
  {
    id: 'hryfon_propelery',
    slot: 'feet',
    name: 'Черевики з пропелерами',
    price: 20,
    draw: () =>
      [-30, 40]
        .map(
          (x) =>
            `<path d="M${x} -22 V-36" stroke="${INK}" stroke-width="4"/>` +
            `<ellipse cx="${x - 12}" cy="-38" rx="12" ry="4" fill="#e53935" ${st(2.5)}/><ellipse cx="${x + 12}" cy="-38" rx="12" ry="4" fill="#fdd835" ${st(2.5)}/>` +
            `<circle cx="${x}" cy="-38" r="3.5" fill="#fff" ${st(2)}/>` +
            `<path d="M${x - 14} -22 L${x + 14} -22 L${x + 14} 0 L${x - 32} 0 Q${x - 34} -12 ${x - 14} -12 Z" fill="#1e88e5" ${st(4)}/>` +
            `<path d="M${x - 32} -4 H${x + 14}" stroke="#fff" stroke-width="4"/>`,
        )
        .join(''),
  },
  {
    id: 'hryfon_kihti',
    slot: 'feet',
    name: 'Чоботи з золотими кігтями',
    price: 20,
    draw: () =>
      [-30, 40]
        .map(
          (x) =>
            [-30, -18, -6].map((dx) => `<path d="M${x + dx} -2 q-6 2 -10 10 q8 -2 14 -6 Z" fill="#ffd54f" ${st(2.5)}/>`).join('') +
            `<path d="M${x + 14} -2 q6 2 8 10 q-8 -2 -12 -6 Z" fill="#ffd54f" ${st(2.5)}/>` +
            `<path d="M${x - 14} -36 L${x + 14} -36 L${x + 14} 0 L${x - 32} 0 Q${x - 34} -14 ${x - 14} -14 Z" fill="#c62828" ${st(4)}/>` +
            `<path d="M${x - 16} -34 H${x + 16}" stroke="#ffd54f" stroke-width="5"/>` +
            starC(x, -22, 6, '#ffd54f'),
        )
        .join(''),
  },

  // ================= Сірко =================
  {
    id: 'sirko_khotdog',
    slot: 'torso',
    name: 'Костюм хот-дога',
    price: 25,
    draw: () =>
      `<path d="M-74 -80 Q-80 -34 4 -36 Q88 -34 82 -80 Q4 -64 -74 -80 Z" fill="#e0a458" ${stroke}/>` +
      `<path d="M-70 -92 Q-72 -130 4 -128 Q80 -130 80 -92 Q4 -100 -70 -92 Z" fill="#e0a458" ${stroke}/>` +
      [[-40, -114], [-10, -120], [20, -116], [50, -112], [-24, -106], [36, -104]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.5" fill="#fff8e1" transform="rotate(-20 ${x} ${y})"/>`).join('') +
      `<path d="M-60 -86 l12 -8 l12 8 l12 -8 l12 8 l12 -8 l12 8 l12 -8 l12 8 l12 -8 l12 8 l12 -8" stroke="#fdd835" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` +
      `<path d="M-54 -80 l12 -6 l12 6 l12 -6 l12 6 l12 -6 l12 6 l12 -6 l12 6 l12 -6 l12 6" stroke="#e53935" stroke-width="4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`,
  },
  {
    id: 'sirko_politsiia',
    slot: 'torso',
    name: 'Жилет пса-поліцейського',
    price: 20,
    draw: () =>
      `<path d="M-56 -110 Q-30 -124 10 -124 Q70 -122 78 -86 Q78 -52 52 -46 L-30 -46 Q-62 -60 -56 -110 Z" fill="#1a237e" ${stroke}/>` +
      `<path d="M-50 -60 H66" stroke="#fdd835" stroke-width="7"/>` +
      `<text x="14" y="-76" text-anchor="middle" font-size="19" font-weight="900" fill="#fff" font-family="sans-serif">ПОЛІЦІЯ</text>` +
      starC(-34, -104, 11, '#ffd54f') +
      `<path d="M40 -122 v-10 M48 -122 v-10" stroke="${INK}" stroke-width="3"/><rect x="34" y="-142" width="22" height="12" rx="3" fill="#e53935" ${st(2.5)}/>`,
  },
  {
    id: 'sirko_baklazhany',
    slot: 'legs',
    name: 'Штани-баклажани',
    price: 15,
    draw: () =>
      DOG_LEGS.map(
        (x) =>
          `<ellipse cx="${x}" cy="-32" rx="15" ry="26" fill="#7b1fa2" ${st(4)}/>` +
          `<path d="M${x - 6} -44 q-2 10 0 18" stroke="#ce93d8" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          `<path d="M${x - 15} -66 L${x - 15} -54 L${x - 9} -48 L${x - 4} -56 L${x + 2} -46 L${x + 8} -56 L${x + 15} -50 L${x + 15} -66 Z" fill="#43a047" ${st(3)}/>`,
      ).join(''),
  },
  {
    id: 'sirko_morozyvo',
    slot: 'legs',
    name: 'Штанці-морозиво',
    price: 15,
    draw: () =>
      DOG_LEGS.map((x, i) => {
        const c = ['#f48fb1', '#a5d6a7', '#8d6e63', '#fff59d'][i];
        return (
          `<path d="M${x - 14} -50 L${x + 14} -50 L${x + 6} -6 L${x - 6} -6 Z" fill="#e6b26a" ${st(4)}/>` +
          `<path d="M${x - 10} -42 L${x + 6} -14 M${x - 2} -48 L${x + 10} -28 M${x + 10} -42 L${x - 6} -14 M${x + 2} -48 L${x - 10} -28" stroke="#b5762a" stroke-width="2.5"/>` +
          `<path d="M${x - 16} -50 Q${x - 18} -72 ${x} -72 Q${x + 18} -72 ${x + 16} -50 q-4 8 -8 0 q-4 8 -8 0 q-4 8 -8 0 q-4 8 -8 0 Z" fill="${c}" ${st(3)}/>` +
          (i === 3 ? `<circle cx="${x}" cy="-76" r="6" fill="#e53935" ${st(2.5)}/>` : '')
        );
      }).join(''),
  },
  {
    id: 'sirko_riznokolorovi',
    slot: 'feet',
    name: 'Чотири різні кросівки',
    price: 20,
    draw: () =>
      DOG_LEGS.map((x, i) => {
        const c = ['#e53935', '#1e88e5', '#43a047', '#fdd835'][i];
        return (
          `<path d="M${x + 12} 2 L${x + 12} -22 L${x - 10} -22 Q${x - 24} -14 ${x - 24} -4 L${x - 24} 2 Z" fill="${c}" ${st(4)}/>` +
          `<path d="M${x - 24} -2 H${x + 12}" stroke="#fff" stroke-width="5"/>` +
          `<path d="M${x - 6} -18 l8 4 M${x - 2} -20 l8 4" stroke="#fff" stroke-width="2.5"/>`
        );
      }).join(''),
  },
  {
    id: 'sirko_slonyky',
    slot: 'feet',
    name: 'Капці-слоники',
    price: 15,
    draw: () =>
      DOG_LEGS.map(
        (x) =>
          `<ellipse cx="${x + 8}" cy="-16" rx="8" ry="11" fill="#b0bec5" ${st(3)}/>` +
          `<ellipse cx="${x - 2}" cy="-10" rx="15" ry="12" fill="#90a4ae" ${st(4)}/>` +
          `<path d="M${x - 14} -8 Q${x - 26} -6 ${x - 26} 2 Q${x - 20} 4 ${x - 20} -2" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
          `<path d="M${x - 14} -8 Q${x - 26} -6 ${x - 26} 2 Q${x - 20} 4 ${x - 20} -2" stroke="#90a4ae" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          `<circle cx="${x - 6}" cy="-14" r="2.5" fill="${INK}"/>`,
      ).join(''),
  },

  // ================= Невіста =================
  {
    id: 'nevista_soniashnyk',
    slot: 'torso',
    name: 'Кофтинка-соняшник',
    price: 20,
    draw: () =>
      `<path d="${GIRL_BODY}" fill="#6d4c41" ${stroke}/>` +
      [[-30, -222], [-10, -230], [10, -230], [30, -222], [-40, -200], [-20, -206], [0, -210], [20, -206], [40, -200], [-30, -184], [-10, -188], [10, -188], [30, -184]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#a1887f"/>`)
        .join('') +
      Array.from({ length: 11 }, (_, i) => {
        const x = -60 + i * 12;
        return `<ellipse cx="${x}" cy="-244" rx="7" ry="15" fill="#fdd835" ${st(3)} transform="rotate(${(x / 60) * 30} ${x} -244)"/>`;
      }).join('') +
      mirror(`<ellipse cx="-62" cy="-212" rx="7" ry="15" fill="#fdd835" ${st(3)} transform="rotate(-70 -62 -212)"/><ellipse cx="-66" cy="-186" rx="7" ry="15" fill="#fdd835" ${st(3)} transform="rotate(-90 -66 -186)"/>`) +
      girlHands,
  },
  {
    id: 'nevista_polunytsia',
    slot: 'torso',
    name: 'Кофтинка-полуничка',
    price: 15,
    draw: () =>
      `<path d="${GIRL_BODY}" fill="#e53935" ${stroke}/>` +
      [[-36, -214], [-14, -222], [12, -214], [36, -220], [-40, -188], [-18, -196], [6, -190], [28, -196], [46, -184], [-6, -172], [-30, -168], [24, -170]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.5" ry="4" fill="#fff59d"/>`)
        .join('') +
      `<path d="M-56 -240 L-46 -222 L-36 -244 L-24 -220 L-12 -246 L0 -222 L12 -246 L24 -220 L36 -244 L46 -222 L56 -240 Q0 -256 -56 -240 Z" fill="#43a047" ${st(3)}/>` +
      girlHands,
  },
  {
    id: 'nevista_spidnytsia_korovai',
    slot: 'legs',
    name: 'Спідниця-коровай',
    price: 25,
    draw: () =>
      `<path d="${SKIRT}" fill="#e2a24a" ${stroke}/>` +
      `<path d="M-84 -20 Q0 -4 84 -20" stroke="#b5762a" stroke-width="10" fill="none"/>` +
      `<path d="M-84 -20 Q0 -4 84 -20" stroke="#f0c070" stroke-width="5" fill="none" stroke-dasharray="8 6"/>` +
      // dough birds, leaves and a viburnum
      [[-40, -130], [30, -110], [-20, -70], [50, -60]]
        .map(([x, y]) => `<path d="M${x - 12} ${y} Q${x} ${y - 14} ${x + 12} ${y} Q${x} ${y + 6} ${x - 12} ${y} Z M${x + 10} ${y - 2} l8 -4" fill="#f5d08a" stroke="#b5762a" stroke-width="3"/>`)
        .join('') +
      [[-6, -148], [0, -140], [6, -148], [-52, -82], [-46, -76], [44, -140], [50, -134]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e53935" ${st(2)}/>`).join('') +
      `<path d="M-14 -150 q-10 -6 -16 4 q10 4 16 -4 Z M14 -150 q10 -6 16 4 q-10 4 -16 -4 Z" fill="#66bb6a" ${st(2)}/>`,
  },
  {
    id: 'nevista_parasolka',
    slot: 'legs',
    name: 'Спідниця-карусель',
    price: 20,
    draw: () => {
      const n = 6;
      let d = 'M-62 -174 L62 -174 L92 -16';
      const step = 184 / n;
      for (let i = 0; i < n; i++) d += ` q${-step / 2} -14 ${-step} 0`;
      const panels = Array.from({ length: n }, (_, i) => {
        if (i % 2) return '';
        const t0 = -62 + (124 / n) * i;
        const t1 = t0 + 124 / n;
        const b0 = -92 + step * i;
        const b1 = b0 + step;
        return `<path d="M${t0.toFixed(1)} -174 L${t1.toFixed(1)} -174 L${b1.toFixed(1)} -16 Q${((b0 + b1) / 2).toFixed(1)} -30 ${b0.toFixed(1)} -16 Z" fill="#ffeb3b"/>`;
      }).join('');
      return (
        `<path d="${d} Z" fill="#29b6f6"/>` +
        panels +
        `<path d="${d} Z" fill="none" ${stroke}/>` +
        Array.from({ length: n + 1 }, (_, i) => `<circle cx="${(-92 + step * i).toFixed(1)}" cy="-14" r="4" fill="${INK}"/>`).join('')
      );
    },
  },
  {
    id: 'nevista_lysychky',
    slot: 'feet',
    name: 'Капці-лисички',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-42 -16 L-46 -32 L-34 -22 Z M-12 -16 L-8 -32 L-20 -22 Z" fill="#ff7043" ${st(3)}/>` +
          `<ellipse cx="-27" cy="-6" rx="22" ry="13" fill="#ff7043" ${st(4)}/>` +
          `<path d="M-46 -2 Q-27 10 -8 -2 Q-27 -2 -46 -2 Z" fill="#fff"/>` +
          `<circle cx="-34" cy="-10" r="2.5" fill="${INK}"/><circle cx="-20" cy="-10" r="2.5" fill="${INK}"/><circle cx="-27" cy="-3" r="3" fill="${INK}"/>`,
      ),
  },
  {
    id: 'nevista_dzvinochky',
    slot: 'feet',
    name: 'Чобітки з дзвіночками',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-48 4 Q-50 -14 -32 -16 L-30 -24 L-8 -24 L-6 4 Z" fill="#c62828" ${st(4)}/>` +
          `<path d="M-30 -20 H-8" stroke="#fdd835" stroke-width="4"/>` +
          `<path d="M-32 -18 L-40 -6" stroke="${INK}" stroke-width="2"/>` +
          `<path d="M-48 -2 Q-48 -12 -40 -12 Q-32 -12 -32 -2 Z" fill="#ffd54f" ${st(2.5)}/><circle cx="-40" cy="0" r="2.5" fill="${INK}"/>` +
          `<path d="M-54 -16 l-6 -4 M-54 -8 l-8 0" stroke="#ffb300" stroke-width="2.5" stroke-linecap="round"/>`,
      ),
  },

  // ================= Внучка =================
  {
    id: 'vnuchka_ripka',
    slot: 'torso',
    name: 'Футболка з ріпкою',
    price: 15,
    draw: () =>
      `<path d="${GIRL_BODY}" fill="#fff" ${stroke}/>` +
      `<path d="M-6 -224 Q-20 -246 -30 -240 Q-24 -226 -8 -222 Z M6 -224 Q20 -248 30 -240 Q24 -226 8 -222 Z M0 -224 Q-4 -244 2 -252 Q8 -240 4 -224 Z" fill="#66bb6a" ${st(2.5)}/>` +
      `<ellipse cx="0" cy="-204" rx="24" ry="20" fill="#fff8e1" ${st(3)}/>` +
      `<path d="M-23 -208 Q-20 -222 0 -224 Q20 -222 23 -208 Q0 -200 -23 -208 Z" fill="#ab47bc"/>` +
      `<path d="M0 -184 q-2 6 2 10" stroke="${INK}" stroke-width="2" fill="none"/>` +
      girlHands,
  },
  {
    id: 'vnuchka_kapusta',
    slot: 'torso',
    name: 'Кофтинка-капуста',
    price: 15,
    draw: () =>
      `<path d="${GIRL_BODY}" fill="#c5e1a5" ${stroke}/>` +
      `<path d="M-60 -168 Q-40 -200 -20 -170 Q0 -204 20 -170 Q40 -200 60 -168 L62 -160 L-62 -160 Z" fill="#9ccc65" ${st(3)}/>` +
      `<path d="M-58 -206 Q-30 -236 -6 -206 Q20 -236 46 -206 Q60 -214 64 -200" stroke="#7cb342" stroke-width="4" fill="none"/>` +
      `<path d="M-40 -196 l6 -14 M0 -192 l0 -16 M40 -196 l-6 -14" stroke="#7cb342" stroke-width="3"/>` +
      mirror(`<path d="M-50 -240 Q-80 -236 -72 -204 Q-62 -222 -50 -220 Z" fill="#9ccc65" ${st(3)}/>`) +
      `<path d="M14 -226 q6 -6 12 0 q6 6 0 10" stroke="#795548" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="12" cy="-226" r="2" fill="${INK}"/>` +
      girlHands,
  },
  {
    id: 'vnuchka_yalynka',
    slot: 'legs',
    name: 'Спідниця-ялинка',
    price: 20,
    draw: () =>
      tier(-174, -110, 60, 76, '#2e7d32', 6) +
      tier(-118, -56, 64, 84, '#388e3c', 7) +
      tier(-64, -6, 70, 92, '#43a047', 8) +
      [[-40, -130, '#e53935'], [30, -140, '#fdd835'], [-10, -86, '#1e88e5'], [52, -76, '#e53935'], [-56, -30, '#fdd835'], [16, -24, '#ab47bc'], [-30, -70, '#ff9800']]
        .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" ${st(2.5)}/>`)
        .join('') +
      `<path d="M-60 -150 Q0 -120 60 -140 M-70 -96 Q0 -60 76 -90 M-82 -40 Q0 -10 86 -36" stroke="#fff176" stroke-width="3" fill="none" stroke-dasharray="2 6" stroke-linecap="round"/>`,
  },
  {
    id: 'vnuchka_tsukerka',
    slot: 'legs',
    name: 'Спідниця-цукерка',
    price: 15,
    draw: () =>
      // the wrapper twisted at both hips
      mirror(`<path d="M-62 -150 L-96 -176 L-100 -140 L-92 -112 L-64 -132 Z" fill="#f48fb1" ${st(4)}/><path d="M-92 -170 l2 50" stroke="#fff" stroke-width="3"/>`) +
      `<path d="${SKIRT}" fill="#f48fb1" ${stroke}/>` +
      Array.from({ length: 5 }, (_, i) => {
        const x0 = -50 + i * 24;
        const x1 = x0 + 12;
        const k = 86 / 62;
        return `<path d="M${x0} -174 L${x1} -174 L${(x1 * k).toFixed(1)} -6 L${(x0 * k).toFixed(1)} -6 Z" fill="#fff"/>`;
      }).join('') +
      `<path d="${SKIRT}" fill="none" ${stroke}/>` +
      [[-30, -120], [20, -90], [-10, -50], [50, -40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#e53935" ${st(2)}/>`).join(''),
  },
  {
    id: 'vnuchka_sunychky',
    slot: 'feet',
    name: 'Черевички-сунички',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-48 2 Q-50 -18 -28 -20 Q-6 -18 -6 2 Z" fill="#e53935" ${st(4)}/>` +
          [[-38, -10], [-28, -4], [-18, -10], [-30, -14]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.6" fill="#fff59d"/>`).join('') +
          `<path d="M-42 -18 L-38 -26 L-32 -19 L-28 -28 L-24 -19 L-18 -26 L-14 -18 Z" fill="#43a047" ${st(2.5)}/>`,
      ),
  },
  {
    id: 'vnuchka_pyshchalky',
    slot: 'feet',
    name: 'Черевики-пищалки',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-48 2 Q-50 -16 -28 -18 Q-6 -16 -6 2 Z" fill="#7e57c2" ${st(4)}/>` +
          `<path d="M-50 -2 H-4" stroke="#fff" stroke-width="5"/><circle cx="-28" cy="-10" r="4" fill="#fdd835" ${st(2)}/>` +
          `<path d="M-52 -22 l-6 -6 M-46 -26 l-2 -8" stroke="#e53935" stroke-width="2.5" stroke-linecap="round"/>`,
      ) +
      [-96, 96].map((x) => `<text x="${x}" y="-2" text-anchor="middle" font-size="14" font-weight="900" fill="#e53935" font-family="sans-serif">пі!</text>`).join(''),
  },

  // ================= Князівна =================
  {
    id: 'knyazivna_lyst',
    slot: 'torso',
    name: 'Кофтинка-лист до Кирила',
    price: 20,
    draw: () =>
      `<path d="${GIRL_BODY}" fill="#fff8e1" ${stroke}/>` +
      `<path d="M-50 -232 L0 -196 L50 -232" stroke="${INK}" stroke-width="3" fill="none"/>` +
      `<path d="M-58 -166 L-12 -206 M58 -166 L12 -206" stroke="#bcaaa4" stroke-width="3"/>` +
      `<path d="M0 -184 C-16 -196 -14 -212 0 -204 C14 -212 16 -196 0 -184 Z" fill="#e53935" ${st(3)}/>` +
      `<path d="M-40 -186 h20 M-42 -178 h14 M24 -186 h18 M30 -178 h12" stroke="#5c6bc0" stroke-width="2.5" stroke-linecap="round"/>` +
      // a pigeon carrying it
      `<ellipse cx="40" cy="-224" rx="10" ry="7" fill="#cfd8dc" ${st(2)}/><circle cx="48" cy="-230" r="5" fill="#cfd8dc" ${st(2)}/><path d="M52 -230 l5 1 l-5 2" fill="#ff9800"/><path d="M36 -228 q-4 -10 6 -10" fill="#b0bec5" ${st(2)}/>` +
      girlHands,
  },
  {
    id: 'knyazivna_drakonchyk',
    slot: 'torso',
    name: 'Кофтинка з дракончиком-другом',
    price: 20,
    draw: () =>
      `<path d="${GIRL_BODY}" fill="#b3e5fc" ${stroke}/>` +
      `<path d="M-6 -186 Q-30 -170 -40 -190 Q-28 -184 -20 -192 Z" fill="#9575cd" ${st(2.5)}/>` +
      `<ellipse cx="2" cy="-194" rx="18" ry="14" fill="#9575cd" ${st(3)}/>` +
      `<path d="M-6 -206 L-2 -218 L4 -207 L10 -219 L14 -205" fill="#ffd54f" ${st(2)}/>` +
      `<circle cx="14" cy="-214" r="10" fill="#9575cd" ${st(3)}/><circle cx="17" cy="-216" r="2.5" fill="${INK}"/>` +
      `<path d="M10 -224 l-2 -6 M16 -224 l2 -6" stroke="${INK}" stroke-width="2"/>` +
      // a heart for a flame
      `<path d="M38 -206 C30 -214 34 -224 40 -218 C46 -224 52 -214 44 -206 L41 -202 Z" fill="#ff7043" ${st(2)}/>` +
      `<path d="M24 -212 q6 -2 10 2" stroke="#ff7043" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      starC(-36, -224, 6, '#fff59d') +
      girlHands,
  },
  {
    id: 'knyazivna_zamok',
    slot: 'legs',
    name: 'Спідниця-замок',
    price: 25,
    draw: () =>
      `<path d="${SKIRT}" fill="#cfd8dc" ${stroke}/>` +
      [-150, -120, -90, -60, -30].map((y, r) => {
        const w = 62 + ((y + 174) / 168) * 24;
        return `<path d="M${-w} ${y} H${w}" stroke="#90a4ae" stroke-width="2.5"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${-w + 14 + i * ((2 * w) / 6) + (r % 2) * 10} ${y} v-30" stroke="#90a4ae" stroke-width="2.5"/>`).join('');
      }).join('') +
      // a gate, two windows and the flags
      `<path d="M-22 -6 V-44 Q0 -66 22 -44 V-6 Z" fill="#6d4c41" ${st(4)}/><path d="M-22 -30 H22 M-22 -18 H22 M0 -58 V-6" stroke="#4e342e" stroke-width="2.5"/>` +
      `<path d="M-56 -100 v-16 q8 -12 16 0 v16 Z M40 -100 v-16 q8 -12 16 0 v16 Z" fill="#fff59d" ${st(3)}/>` +
      `<path d="M-74 -42 V-80 M74 -42 V-80" stroke="${INK}" stroke-width="3"/><path d="M-74 -80 l18 6 l-18 6 Z" fill="#e53935" ${st(2)}/><path d="M74 -80 l-18 6 l18 6 Z" fill="#1e88e5" ${st(2)}/>` +
      `<path d="M-86 -6 v-10 h14 v10 M-58 -6 v-10 h14 v10 M44 -6 v-10 h14 v10 M72 -6 v-10 h14 v10" fill="#b0bec5" ${st(2.5)}/>`,
  },
  {
    id: 'knyazivna_pavych',
    slot: 'legs',
    name: 'Спідниця з павиним пір’ям',
    price: 25,
    draw: () =>
      `<path d="${SKIRT}" fill="#00897b" ${stroke}/>` +
      [[-40, -140], [10, -150], [44, -130], [-60, -90], [-16, -96], [30, -90], [66, -70], [-70, -40], [-30, -40], [14, -44], [56, -30]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="#ffd54f" ${st(2)}/><ellipse cx="${x}" cy="${y + 2}" rx="7" ry="9" fill="#43a047"/><ellipse cx="${x}" cy="${y + 3}" rx="4" ry="5" fill="#1a237e"/>`)
        .join('') +
      `<path d="M-86 -6 q11 -14 22 0 q11 -14 22 0 q11 -14 22 0 q11 -14 22 0 q11 -14 22 0 q11 -14 22 0 q11 -14 22 0 q11 -14 22 0" stroke="#4fc3f7" stroke-width="5" fill="none"/>`,
  },
  {
    id: 'knyazivna_korony',
    slot: 'feet',
    name: 'Черевички-корони',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-46 -12 L-44 -30 L-36 -20 L-28 -34 L-20 -20 L-12 -30 L-10 -12 Z" fill="#ffd54f" ${st(3)}/>` +
          `<circle cx="-44" cy="-31" r="3" fill="#e53935"/><circle cx="-28" cy="-35" r="3" fill="#1e88e5"/><circle cx="-12" cy="-31" r="3" fill="#43a047"/>` +
          `<path d="M-48 4 Q-50 -14 -28 -14 Q-6 -14 -6 4 Z" fill="#ffca28" ${st(4)}/>` +
          `<path d="M-40 -6 h24" stroke="#fff59d" stroke-width="3" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'knyazivna_harbuzy',
    slot: 'feet',
    name: 'Черевички-гарбузики',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-27 -22 q-2 -10 6 -14" stroke="#558b2f" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-24 -30 q10 -10 16 0 q-8 6 -16 0 Z" fill="#7cb342" ${st(2)}/>` +
          `<ellipse cx="-27" cy="-8" rx="24" ry="15" fill="#ff9800" ${st(4)}/>` +
          `<path d="M-39 -20 q-6 12 0 24 M-27 -23 V7 M-15 -20 q6 12 0 24" stroke="#e65100" stroke-width="3" fill="none"/>` +
          `<rect x="-31" y="-14" width="8" height="10" rx="3" fill="#fff59d" ${st(2)}/>`,
      ),
  },
);

export const SETS: Record<string, string> = {
  kotyhoroshko: 'kotyhoroshko_horokhmen kotyhoroshko_struchky kotyhoroshko_kaptsi kotyhoroshko_zmiy kotyhoroshko_kasha kotyhoroshko_kavuny kotyhoroshko_kyshenky kotyhoroshko_kastruli kotyhoroshko_bulavy',
  vernyhora: 'vernyhora_tryko vernyhora_havaiky vernyhora_hyri vernyhora_kaminci vernyhora_svetrhora vernyhora_kameniuky vernyhora_kuli vernyhora_skeli vernyhora_kroty',
  vernydub: 'vernydub_lystia vernydub_zholudi vernydub_penky vernydub_kora vernydub_hnizdo_svetr vernydub_mukhomory vernydub_kolody vernydub_yizhaky vernydub_korinnia',
  krutyvus: 'krutyvus_sportyvka krutyvus_lampasy krutyvus_chovnyky krutyvus_vodolaz krutyvus_vosmynih krutyvus_vodospad krutyvus_matrats krutyvus_kachenyata krutyvus_raky',
  muzhychok: 'muzhychok_mantiia muzhychok_klitynka muzhychok_cherevyky muzhychok_borovyk muzhychok_hrebinets muzhychok_olivtsi muzhychok_bubontsi muzhychok_naperstky muzhychok_ravlyky',
  hryfon: 'hryfon_kurtka hryfon_mantiia hryfon_khmarynky hryfon_pilot hryfon_zoloto hryfon_holfy hryfon_likhtaryky hryfon_propelery hryfon_kihti',
  sirko: 'sirko_khotdog sirko_politsiia sirko_baklazhany sirko_morozyvo sirko_riznokolorovi sirko_slonyky',
  nevista: 'nevista_soniashnyk nevista_polunytsia nevista_spidnytsia_korovai nevista_parasolka nevista_lysychky nevista_dzvinochky',
  vnuchka: 'vnuchka_ripka vnuchka_kapusta vnuchka_yalynka vnuchka_tsukerka vnuchka_sunychky vnuchka_pyshchalky',
  knyazivna: 'knyazivna_lyst knyazivna_drakonchyk knyazivna_zamok knyazivna_pavych knyazivna_korony knyazivna_harbuzy',
};
