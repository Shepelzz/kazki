// Things of the heroes' wardrobe, group c: drawn for u = 100 (see wardrobe.ts). Every id is
// <hero>_<thing>; SETS gives each of this group's heroes everything it can wear.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** a fluffy cloud of circles with one outline round it all (a sheep, a wig, curls) */
const fluff = (cs: [number, number, number][], fill: string) =>
  cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${stroke}/>`).join('') +
  cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');

const star = (x: number, y: number, r: number, fill: string, more = '') => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.5 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}" ${more} ${st(4)}/>`;
};

/** points along a necklace's arc, under the chin */
const arc = (n: number, rx: number, ry: number, y0: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = Math.PI * (0.1 + (i / (n - 1)) * 0.8);
    return [Math.round(-Math.cos(a) * rx), Math.round(Math.sin(a) * ry + y0)] as [number, number];
  });

const note = (x: number, y: number) =>
  `<ellipse cx="${x}" cy="${y}" rx="8" ry="6" fill="${INK}" transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 7} ${y - 2} V${y - 30} q8 6 14 4" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;

export const ITEMS: Item[] = [
  // ---------- pastushok: a shepherd boy
  {
    id: 'pastushok_ovechka',
    slot: 'head',
    name: 'Овечка на голові',
    price: 20,
    draw: () =>
      `<path d="M-46 -10 v26 M-24 -6 v24 M20 -6 v24 M42 -10 v26" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M-46 -10 v26 M-24 -6 v24 M20 -6 v24 M42 -10 v26" stroke="#5d4037" stroke-width="6" stroke-linecap="round"/>` +
      fluff(
        [
          [-50, -26, 22],
          [-26, -46, 24],
          [4, -52, 26],
          [34, -42, 22],
          [-34, -12, 20],
          [-4, -14, 24],
          [28, -14, 20],
        ],
        '#fafafa',
      ) +
      `<ellipse cx="66" cy="-30" rx="22" ry="17" fill="#5d4037" ${stroke}/>` +
      `<ellipse cx="54" cy="-46" rx="12" ry="6" fill="#5d4037" ${st(4)} transform="rotate(-30 54 -46)"/>` +
      `<path d="M62 -34 q5 4 10 0 M76 -34 q4 4 8 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M66 -20 q6 4 12 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<text x="-70" y="-74" font-size="26" font-weight="700" fill="#7e57c2" font-family="sans-serif">z</text>` +
      `<text x="-92" y="-96" font-size="20" font-weight="700" fill="#7e57c2" font-family="sans-serif">z</text>`,
  },
  {
    id: 'pastushok_sopilka',
    slot: 'mouth',
    name: 'Сопілка',
    price: 10,
    draw: () =>
      `<g transform="rotate(28)"><rect x="-8" y="-9" width="124" height="18" rx="9" fill="#d7a35a" ${stroke}/>` +
      `<path d="M26 -9 v18" stroke="${INK}" stroke-width="3"/>` +
      [48, 68, 88, 104].map((x) => `<circle cx="${x}" cy="0" r="4.5" fill="${INK}"/>`).join('') +
      `</g>` +
      note(78, -30) +
      note(112, -6),
  },
  {
    id: 'pastushok_rizhok',
    slot: 'neck',
    name: 'Пастуший ріжок',
    price: 15,
    draw: () =>
      `<path d="M-56 -10 Q-40 30 -26 44 M56 -10 Q50 30 34 62" stroke="#8d6e63" stroke-width="5" fill="none"/>` +
      `<path d="M-34 38 Q0 52 30 56 L46 84 Q-4 84 -36 52 Z" fill="#bcaaa4" ${stroke}/>` +
      `<ellipse cx="38" cy="70" rx="9" ry="16" fill="#efebe9" ${st(4)} transform="rotate(-30 38 70)"/>` +
      `<path d="M-14 44 l-4 12 M6 50 l-3 14" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'pastushok_metelyk',
    slot: 'face',
    name: 'Метелик-комаха на носі',
    price: 10,
    draw: () =>
      `<path d="M0 26 Q-30 -10 -40 6 Q-44 24 0 26 Z M0 26 Q30 -10 40 6 Q44 24 0 26 Z" fill="#ff9800" ${st(4)}/>` +
      `<path d="M0 26 Q-30 50 -24 54 Q-12 56 0 26 Z M0 26 Q30 50 24 54 Q12 56 0 26 Z" fill="#ffb74d" ${st(4)}/>` +
      `<circle cx="-24" cy="10" r="5" fill="#fff"/><circle cx="24" cy="10" r="5" fill="#fff"/><circle cx="-16" cy="42" r="3.5" fill="#7e57c2"/><circle cx="16" cy="42" r="3.5" fill="#7e57c2"/>` +
      `<ellipse cx="0" cy="28" rx="5" ry="16" fill="#3e2723"/>` +
      `<path d="M-2 13 q-6 -14 -14 -16 M2 13 q6 -14 14 -16" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<circle cx="-16" cy="-3" r="3" fill="${INK}"/><circle cx="16" cy="-3" r="3" fill="${INK}"/>`,
  },

  // ---------- telesyk: the boy in the golden boat
  {
    id: 'telesyk_chovnyk',
    slot: 'head',
    name: 'Золотий човник',
    price: 20,
    draw: () =>
      `<path d="M0 -26 V-118" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M6 -112 L6 -36 L64 -40 Z" fill="#fff" ${st(4)}/>` +
      `<path d="M0 -118 L-30 -110 L0 -102 Z" fill="#e53935" ${st(3)}/>` +
      `<path d="M-88 -28 L88 -28 L62 6 L-62 6 Z" fill="#ffca28" ${stroke}/>` +
      `<path d="M-72 -14 H72" stroke="#ff8f00" stroke-width="5"/>` +
      `<path d="M-100 -8 q14 -10 28 0 q14 10 28 0 M44 -8 q14 -10 28 0 q14 10 28 0" stroke="#29b6f6" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'telesyk_svystok',
    slot: 'mouth',
    name: 'Свисток капітана',
    price: 10,
    draw: () =>
      `<path d="M50 20 Q40 70 0 76 Q-40 70 -50 20" stroke="#1e88e5" stroke-width="5" fill="none"/>` +
      `<rect x="-4" y="-8" width="64" height="18" rx="5" fill="#cfd8dc" ${stroke}/>` +
      `<circle cx="50" cy="12" r="18" fill="#cfd8dc" ${stroke}/>` +
      `<rect x="20" y="-8" width="12" height="9" fill="#37474f" ${st(3)}/>` +
      `<path d="M10 -4 h40" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M80 -10 l14 -8 M84 6 h16 M80 22 l14 8" stroke="#29b6f6" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'telesyk_okuliary',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри для пірнання',
    price: 15,
    draw: () =>
      `<path d="M-96 -2 H-60 M60 -2 H96" stroke="#ff7043" stroke-width="12" stroke-linecap="round"/>` +
      `<ellipse cx="-34" cy="0" rx="30" ry="25" fill="#80deea" fill-opacity=".5" stroke="#ff7043" stroke-width="10"/>` +
      `<ellipse cx="34" cy="0" rx="30" ry="25" fill="#80deea" fill-opacity=".5" stroke="#ff7043" stroke-width="10"/>` +
      `<path d="M-4 -2 h8" stroke="#ff7043" stroke-width="8"/>` +
      `<path d="M-48 -10 q6 -8 14 -8 M20 -10 q6 -8 14 -8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'telesyk_kolo',
    slot: 'neck',
    name: 'Рятувальне коло',
    price: 15,
    draw: () =>
      `<path d="M-84 16 a84 34 0 1 0 168 0 a84 34 0 1 0 -168 0 Z M-44 16 a44 14 0 1 0 88 0 a44 14 0 1 0 -88 0 Z" fill="#fff" fill-rule="evenodd"/>` +
      `<ellipse cx="0" cy="16" rx="64" ry="24" fill="none" stroke="#e53935" stroke-width="20" stroke-dasharray="36 38"/>` +
      `<ellipse cx="0" cy="16" rx="84" ry="34" fill="none" ${stroke}/>` +
      `<ellipse cx="0" cy="16" rx="44" ry="14" fill="none" ${st(4)}/>`,
  },

  // ---------- zmiyuchka: the little snake
  {
    id: 'zmiyuchka_peruka',
    slot: 'head',
    name: 'Кучерява перука',
    price: 15,
    draw: () =>
      fluff(
        [
          [-64, 18, 18],
          [-66, -6, 20],
          [-54, -32, 22],
          [-30, -50, 22],
          [0, -56, 24],
          [30, -50, 22],
          [54, -32, 22],
          [66, -6, 20],
          [64, 18, 18],
          [-30, -22, 20],
          [0, -26, 22],
          [30, -22, 20],
        ],
        '#ff8a65',
      ) +
      [
        [-54, -32],
        [0, -56],
        [54, -32],
        [-66, -6],
        [66, -6],
        [0, -26],
      ]
        .map(([x, y]) => `<path d="M${x - 8} ${y} q8 -10 12 0 q-2 8 -8 4" stroke="#d84315" stroke-width="4" fill="none" stroke-linecap="round"/>`)
        .join('') +
      `<path d="M-14 -78 l8 6 M14 -78 l-8 6" stroke="#e91e63" stroke-width="6" stroke-linecap="round"/><circle cx="0" cy="-72" r="7" fill="#f06292" ${st(3)}/>`,
  },
  {
    id: 'zmiyuchka_fary',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-фари',
    price: 15,
    draw: () =>
      [-38, 38]
        .map(
          (x) =>
            [0, 45, 90, 135, 180, 225, 270, 315]
              .map((a) => {
                const c = Math.cos((a * Math.PI) / 180);
                const s = Math.sin((a * Math.PI) / 180);
                return `<path d="M${(x + c * 40).toFixed(0)} ${(s * 40).toFixed(0)} L${(x + c * 52).toFixed(0)} ${(s * 52).toFixed(0)}" stroke="#ffeb3b" stroke-width="6" stroke-linecap="round"/>`;
              })
              .join('') +
            `<circle cx="${x}" cy="0" r="32" fill="#b0bec5" ${stroke}/>` +
            `<circle cx="${x}" cy="0" r="22" fill="#fff59d" fill-opacity=".85" ${st(3)}/>` +
            `<path d="M${x - 14} 4 h28 M${x - 10} 12 h20" stroke="#fbc02d" stroke-width="3"/>` +
            `<circle cx="${x - 8}" cy="-9" r="5" fill="#fff"/>`,
        )
        .join('') +
      `<rect x="-10" y="-8" width="20" height="16" rx="3" fill="#78909c" ${st(4)}/>`,
  },
  {
    id: 'zmiyuchka_dudka',
    slot: 'mouth',
    name: 'Святкова дудка',
    price: 10,
    draw: () =>
      `<path d="M36 -12 L118 -16 Q138 -16 138 0 Q138 16 118 16 L36 12 Z" fill="#ffeb3b" ${stroke}/>` +
      `<path d="M56 -12 v24 M76 -14 v28 M96 -15 v30" stroke="#e91e63" stroke-width="6"/>` +
      `<circle cx="122" cy="0" r="8" fill="none" stroke="#e91e63" stroke-width="4"/>` +
      `<rect x="-4" y="-9" width="44" height="18" rx="6" fill="#ab47bc" ${st(4)}/>` +
      `<path d="M150 -24 l10 -8 M154 0 h14 M150 24 l10 8" stroke="#ff7043" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'zmiyuchka_shkarpetka',
    slot: 'neck',
    name: 'Шкарпетка замість шарфа',
    price: 10,
    draw: () =>
      `<path d="M-70 -12 Q0 22 70 -12 L72 14 Q0 50 -72 14 Z" fill="#42a5f5" ${stroke}/>` +
      `<path d="M-40 4 l-2 24 M-14 12 v26 M14 12 v26 M40 4 l2 24" stroke="#fff" stroke-width="7"/>` +
      `<path d="M30 22 L42 86 Q44 104 62 104 L92 100 Q108 94 98 80 L76 74 L64 14 Z" fill="#42a5f5" ${stroke}/>` +
      `<path d="M36 46 L68 40 M40 66 L72 60" stroke="#fff" stroke-width="7"/>` +
      `<path d="M78 100 Q92 98 98 84" fill="#ffca28" ${st(3)}/>` +
      `<circle cx="70" cy="92" r="5" fill="#f4c7a1" ${st(3)}/>`,
  },

  // ---------- olenka
  {
    id: 'olenka_kavun',
    slot: 'head',
    name: 'Кавуновий капелюх',
    price: 15,
    draw: () =>
      `<path d="M-76 6 A76 76 0 0 1 76 6 Z" fill="#2e7d32" ${stroke}/>` +
      `<path d="M-66 6 A66 66 0 0 1 66 6 Z" fill="#f1f8e9"/>` +
      `<path d="M-58 6 A58 58 0 0 1 58 6 Z" fill="#ef5350"/>` +
      `<path d="M-76 6 H76" ${stroke}/>` +
      [
        [-30, -14],
        [-6, -34],
        [20, -22],
        [36, -8],
        [-14, -8],
        [4, -14],
      ]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.5" ry="6" fill="#212121"/>`)
        .join('') +
      `<path d="M-60 -30 q4 -6 10 -12 M-46 -52 q6 -4 12 -8" stroke="#81c784" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'olenka_polunytsi',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-полуниці',
    price: 15,
    draw: () =>
      [-36, 36]
        .map(
          (x) =>
            `<path d="M${x} -24 Q${x + 36} -30 ${x + 32} 0 Q${x + 26} 30 ${x} 38 Q${x - 26} 30 ${x - 32} 0 Q${x - 36} -30 ${x} -24 Z" fill="#e53935" fill-opacity=".75" ${st(5)}/>` +
            [
              [-16, -8],
              [0, -12],
              [16, -8],
              [-12, 10],
              [12, 10],
              [0, 24],
            ]
              .map(([dx, dy]) => `<ellipse cx="${x + dx}" cy="${dy}" rx="2.5" ry="4" fill="#fff59d"/>`)
              .join('') +
            `<path d="M${x - 22} -26 L${x - 12} -40 L${x - 4} -28 L${x + 4} -42 L${x + 12} -28 L${x + 22} -38 L${x + 22} -24 Z" fill="#43a047" ${st(3)}/>`,
        )
        .join('') +
      `<path d="M-6 -6 Q0 -12 6 -6" stroke="${INK}" stroke-width="6" fill="none"/>`,
  },
  {
    id: 'olenka_lodianyk',
    slot: 'mouth',
    name: 'Льодяник',
    price: 10,
    draw: () =>
      `<path d="M2 2 L50 12" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M2 2 L50 12" stroke="#fff" stroke-width="6" stroke-linecap="round"/>` +
      `<circle cx="74" cy="16" r="28" fill="#f48fb1" ${stroke}/>` +
      `<path d="M74 16 m0 -4 a4 4 0 1 1 -4 4 a10 10 0 0 1 10 -10 a16 16 0 0 1 16 16 a22 22 0 0 1 -22 22 a24 24 0 0 1 -24 -24" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'olenka_mushky',
    slot: 'neck',
    name: 'Намисто з мушок',
    price: 15,
    draw: () =>
      `<path d="M-74 -20 Q0 50 74 -20" stroke="#fff" stroke-width="4" fill="none"/>` +
      arc(6, 70, 40, -16)
        .map(
          ([x, y]) =>
            `<ellipse cx="${x - 8}" cy="${y - 10}" rx="9" ry="6" fill="#e1f5fe" fill-opacity=".9" ${st(3)} transform="rotate(30 ${x - 8} ${y - 10})"/>` +
            `<ellipse cx="${x + 8}" cy="${y - 10}" rx="9" ry="6" fill="#e1f5fe" fill-opacity=".9" ${st(3)} transform="rotate(-30 ${x + 8} ${y - 10})"/>` +
            `<ellipse cx="${x}" cy="${y}" rx="9" ry="11" fill="#263238" ${st(3)}/>` +
            `<circle cx="${x - 4}" cy="${y - 6}" r="3.5" fill="#e53935"/><circle cx="${x + 4}" cy="${y - 6}" r="3.5" fill="#e53935"/>`,
        )
        .join(''),
  },

  // ---------- koval: the smith
  {
    id: 'koval_kovadlo',
    slot: 'head',
    name: 'Ковадло-капелюх',
    price: 20,
    draw: () =>
      `<path d="M-104 -60 Q-80 -68 -62 -68 L66 -68 L66 -46 Q32 -46 22 -32 L22 -16 L48 -16 L48 6 L-48 6 L-48 -16 L-22 -16 L-22 -32 Q-32 -46 -62 -46 Q-84 -48 -104 -60 Z" fill="#78909c" ${stroke}/>` +
      `<path d="M-50 -62 H56" stroke="#cfd8dc" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-30 -84 l-8 -12 M0 -88 v-14 M30 -84 l8 -12" stroke="#ff9800" stroke-width="5" stroke-linecap="round"/>` +
      star(-62, -96, 9, '#ffeb3b') +
      star(66, -94, 8, '#ffeb3b'),
  },
  {
    id: 'koval_okuliary',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Ковальські окуляри',
    price: 15,
    draw: () =>
      `<path d="M-96 0 H-62 M62 0 H96" stroke="#6d4c41" stroke-width="12" stroke-linecap="round"/>` +
      [-34, 34]
        .map(
          (x) =>
            `<circle cx="${x}" cy="0" r="30" fill="#9e9e9e" ${stroke}/>` +
            `<circle cx="${x}" cy="0" r="20" fill="#1b5e20" fill-opacity=".85" ${st(3)}/>` +
            `<path d="M${x - 10} -8 q4 -6 10 -6" stroke="#a5d6a7" stroke-width="4" fill="none" stroke-linecap="round"/>` +
            [0, 90, 180, 270].map((a) => `<circle cx="${(x + Math.cos((a * Math.PI) / 180) * 25).toFixed(0)}" cy="${(Math.sin((a * Math.PI) / 180) * 25).toFixed(0)}" r="2.5" fill="${INK}"/>`).join(''),
        )
        .join('') +
      `<path d="M-6 0 h12" stroke="${INK}" stroke-width="8"/>`,
  },
  {
    id: 'koval_tsviakhy',
    slot: 'mouth',
    name: 'Цвяхи в зубах',
    price: 5,
    draw: () =>
      [
        [-4, 0, -54, -10],
        [4, 0, 56, -8],
        [2, 4, 44, 22],
      ]
        .map(([x0, y0, x1, y1]) => {
          const a = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
          return (
            `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>` +
            `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="#eceff1" stroke-width="7" stroke-linecap="round"/>` +
            `<rect x="-4" y="-13" width="9" height="26" rx="3" fill="#cfd8dc" ${st(3)} transform="translate(${x1} ${y1}) rotate(${a.toFixed(0)})"/>`
          );
        })
        .join(''),
  },
  {
    id: 'koval_pidkova',
    slot: 'neck',
    name: 'Підкова на щастя',
    price: 15,
    draw: () =>
      `<path d="M-52 -14 Q-40 20 -28 38 M52 -14 Q40 20 28 38" stroke="${INK}" stroke-width="9" fill="none"/>` +
      `<path d="M-52 -14 Q-40 20 -28 38 M52 -14 Q40 20 28 38" stroke="#ffca28" stroke-width="4" fill="none"/>` +
      `<path d="M-28 36 Q-36 96 0 96 Q36 96 28 36" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/>` +
      `<path d="M-28 36 Q-36 96 0 96 Q36 96 28 36" stroke="#bdbdbd" stroke-width="16" fill="none" stroke-linecap="round"/>` +
      [
        [-28, 52],
        [-24, 76],
        [0, 90],
        [24, 76],
        [28, 52],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${INK}"/>`)
        .join('') +
      star(-48, 70, 8, '#ffeb3b') +
      star(48, 64, 7, '#ffeb3b'),
  },

  // ---------- gusenia: the gosling (seen from the side, the beak to the left)
  {
    id: 'gusenia_shkaralupka',
    slot: 'head',
    name: 'Шкаралупка',
    price: 10,
    draw: () =>
      `<path d="M-58 8 L-46 -8 L-32 8 L-18 -8 L-4 8 L10 -8 L24 8 L38 -8 L52 8 L58 2 Q60 -76 0 -84 Q-60 -76 -58 8 Z" fill="#fffde7" ${stroke}/>` +
      `<path d="M-30 -48 q8 -14 20 -18" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M20 -56 l8 10 l-6 8 l8 10" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="-12" cy="-26" r="4" fill="#d7ccc8"/><circle cx="32" cy="-20" r="3" fill="#d7ccc8"/>`,
  },
  {
    id: 'gusenia_soska',
    slot: 'mouth',
    name: 'Соска',
    price: 10,
    draw: () =>
      `<ellipse cx="-10" cy="0" rx="10" ry="26" fill="#4fc3f7" ${stroke}/>` +
      `<circle cx="-10" cy="0" r="5" fill="#e1f5fe"/>` +
      `<circle cx="-34" cy="0" r="14" fill="none" stroke="${INK}" stroke-width="12"/>` +
      `<circle cx="-34" cy="0" r="14" fill="none" stroke="#f06292" stroke-width="6"/>`,
  },
  {
    id: 'gusenia_kachechka',
    slot: 'neck',
    name: 'Надувний круг-качечка',
    price: 15,
    draw: () =>
      `<path d="M-72 16 a72 30 0 1 0 144 0 a72 30 0 1 0 -144 0 Z M-34 16 a34 11 0 1 0 68 0 a34 11 0 1 0 -68 0 Z" fill="#ffeb3b" fill-rule="evenodd" ${stroke}/>` +
      `<path d="M30 34 q14 -4 26 -14 M-10 40 q14 2 24 0" stroke="#fff9c4" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M-60 2 Q-74 -20 -58 -36" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round"/>` +
      `<path d="M-60 2 Q-74 -20 -58 -36" stroke="#ffeb3b" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      `<circle cx="-56" cy="-44" r="18" fill="#ffeb3b" ${stroke}/>` +
      `<path d="M-72 -46 L-96 -40 L-72 -34 Z" fill="#ff9800" ${st(3)}/>` +
      `<circle cx="-58" cy="-50" r="4" fill="#212121"/>` +
      `<path d="M66 6 l12 -6 v14 Z" fill="#e53935" ${st(3)}/>`,
  },

  // ---------- kyrylo: Kyrylo Kozhumiaka, the strong man
  {
    id: 'kyrylo_hyria',
    slot: 'head',
    name: 'Гиря на голові',
    price: 20,
    draw: () =>
      `<path d="M-28 -70 Q-34 -118 0 -118 Q34 -118 28 -70" stroke="${INK}" stroke-width="18" fill="none"/>` +
      `<path d="M-28 -70 Q-34 -118 0 -118 Q34 -118 28 -70" stroke="#616161" stroke-width="10" fill="none"/>` +
      `<path d="M-50 -2 Q-56 -50 -30 -74 Q0 -88 30 -74 Q56 -50 50 -2 Z" fill="#424242" ${stroke}/>` +
      `<text x="0" y="-26" text-anchor="middle" font-size="30" font-weight="800" fill="#ffd54f" font-family="sans-serif">32</text>` +
      `<path d="M-32 -60 q8 -10 18 -12" stroke="#9e9e9e" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'kyrylo_varenyk',
    slot: 'mouth',
    name: 'Вареник у зубах',
    price: 10,
    draw: () =>
      `<path d="M-8 8 Q28 -44 74 6 Q32 22 -8 8 Z" fill="#fff3e0" ${stroke}/>` +
      `<path d="M2 0 q4 -6 8 -10 M14 -14 q6 -4 10 -6 M30 -22 q6 -2 12 -2 M48 -18 q6 2 10 6 M62 -8 q4 4 6 8" stroke="#d7a35a" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M40 14 q2 14 -4 18 q-8 -2 -6 -16" fill="#fff" ${st(3)}/>` +
      `<path d="M-30 -30 q4 -8 10 -4 M84 -20 q6 -6 10 0" stroke="#b0bec5" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'kyrylo_rushnyk',
    slot: 'neck',
    name: 'Рушник силача',
    price: 15,
    draw: () =>
      `<path d="M-66 -14 Q0 22 66 -14 L60 8 Q0 38 -60 8 Z" fill="#fff" ${stroke}/>` +
      [-1, 1]
        .map((sd) => {
          const x0 = sd * 46;
          return (
            `<path d="M${x0 - 18} 0 L${x0 + 18} 4 L${x0 + 16} 104 L${x0 - 16} 104 Z" fill="#fff" ${stroke}/>` +
            `<path d="M${x0 - 16} 70 H${x0 + 16} M${x0 - 16} 92 H${x0 + 16}" stroke="#e53935" stroke-width="5"/>` +
            `<path d="M${x0 - 10} 81 l5 -5 l5 5 l5 -5 l5 5" stroke="#e53935" stroke-width="3" fill="none"/>` +
            `<path d="M${x0 - 12} 106 v10 M${x0 - 4} 106 v10 M${x0 + 4} 106 v10 M${x0 + 12} 106 v10" stroke="#e53935" stroke-width="3" stroke-linecap="round"/>`
          );
        })
        .join('') +
      `<path d="M-30 10 Q0 24 30 10" stroke="#e53935" stroke-width="4" fill="none" stroke-dasharray="6 5"/>`,
  },

  // ---------- knyaz: the prince
  {
    id: 'knyaz_tort',
    slot: 'head',
    name: 'Корона-торт',
    price: 25,
    draw: () =>
      `<rect x="-66" y="-42" width="132" height="48" rx="8" fill="#f8bbd0" ${stroke}/>` +
      `<path d="M-64 -38 H64 V-28 Q56 -16 48 -28 Q40 -12 30 -28 Q20 -16 8 -28 Q-4 -12 -14 -28 Q-26 -16 -36 -28 Q-46 -12 -56 -28 Q-60 -22 -64 -28 Z" fill="#fff" ${st(3)}/>` +
      `<rect x="-42" y="-78" width="84" height="40" rx="6" fill="#fff59d" ${stroke}/>` +
      `<path d="M-40 -60 H40" stroke="#f48fb1" stroke-width="6"/>` +
      [-24, 0, 24]
        .map(
          (x, i) =>
            `<rect x="${x - 4}" y="-104" width="8" height="26" rx="2" fill="${['#42a5f5', '#ef5350', '#66bb6a'][i]}" ${st(3)}/>` +
            `<path d="M${x} -106 q-8 -10 0 -20 q8 10 0 20 Z" fill="#ffb300" ${st(3)}/>`,
        )
        .join('') +
      `<circle cx="-50" cy="-48" r="8" fill="#e53935" ${st(3)}/><circle cx="50" cy="-48" r="8" fill="#e53935" ${st(3)}/>`,
  },
  {
    id: 'knyaz_lornet',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Лорнет',
    price: 15,
    draw: () =>
      `<path d="M-60 18 L-96 100" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M-60 18 L-96 100" stroke="#ffc107" stroke-width="7" stroke-linecap="round"/>` +
      `<circle cx="-34" cy="0" r="28" fill="#e3f2fd" fill-opacity=".35" stroke="#c99a1e" stroke-width="8"/>` +
      `<circle cx="34" cy="0" r="28" fill="#e3f2fd" fill-opacity=".35" stroke="#c99a1e" stroke-width="8"/>` +
      `<path d="M-6 -4 Q0 -12 6 -4" stroke="#c99a1e" stroke-width="7" fill="none"/>` +
      `<circle cx="-96" cy="100" r="7" fill="#e53935" ${st(3)}/>`,
  },
  {
    id: 'knyaz_lozhka',
    slot: 'mouth',
    name: 'Борщова ложка',
    price: 10,
    draw: () =>
      `<path d="M28 -6 L104 -46" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
      `<path d="M28 -6 L104 -46" stroke="#e0a050" stroke-width="9" stroke-linecap="round"/>` +
      `<circle cx="70" cy="-28" r="3" fill="#e53935"/><circle cx="88" cy="-37" r="3" fill="#43a047"/>` +
      `<ellipse cx="8" cy="0" rx="26" ry="16" fill="#e0a050" ${stroke}/>` +
      `<ellipse cx="8" cy="-2" rx="18" ry="9" fill="#c62828"/>` +
      `<path d="M2 -4 h6 M14 0 h4" stroke="#ff8a65" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M-6 14 q-2 12 2 16 q6 -2 2 -16" fill="#c62828" ${st(2)}/>`,
  },
  {
    id: 'knyaz_orden',
    slot: 'neck',
    name: 'Орден-тарілка',
    price: 25,
    draw: () =>
      `<path d="M-40 -16 L-14 30 M40 -16 L14 30" stroke="${INK}" stroke-width="20"/>` +
      `<path d="M-40 -16 L-14 30 M40 -16 L14 30" stroke="#1e88e5" stroke-width="13"/>` +
      star(0, 74, 66, '#ffc107') +
      `<circle cx="0" cy="74" r="44" fill="#ffd54f" ${stroke}/>` +
      `<circle cx="0" cy="74" r="32" fill="#c62828" ${st(4)}/>` +
      star(0, 74, 22, '#fff') +
      `<path d="M-30 56 q10 -16 26 -20" stroke="#fff8e1" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },

  // ---------- knyazivna: the princess
  {
    id: 'knyazivna_zhabka',
    slot: 'head',
    name: 'Жабка-королевич',
    price: 20,
    draw: () =>
      `<ellipse cx="-34" cy="0" rx="18" ry="8" fill="#66bb6a" ${st(4)}/><ellipse cx="34" cy="0" rx="18" ry="8" fill="#66bb6a" ${st(4)}/>` +
      `<ellipse cx="0" cy="-26" rx="46" ry="30" fill="#66bb6a" ${stroke}/>` +
      `<circle cx="-24" cy="-56" r="15" fill="#66bb6a" ${stroke}/><circle cx="24" cy="-56" r="15" fill="#66bb6a" ${stroke}/>` +
      `<circle cx="-24" cy="-56" r="8" fill="#fff"/><circle cx="24" cy="-56" r="8" fill="#fff"/>` +
      `<circle cx="-22" cy="-55" r="4" fill="#212121"/><circle cx="22" cy="-55" r="4" fill="#212121"/>` +
      `<path d="M-24 -26 Q0 -6 24 -26" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M-6 -12 q6 10 12 0" fill="#f06292" ${st(3)}/>` +
      `<circle cx="-34" cy="-30" r="6" fill="#f48fb1"/><circle cx="34" cy="-30" r="6" fill="#f48fb1"/>` +
      `<path d="M-14 -64 L-16 -86 L-6 -76 L0 -90 L6 -76 L16 -86 L14 -64 Z" fill="#ffd54f" ${st(3)}/>`,
  },
  {
    id: 'knyazivna_zachiska',
    slot: 'head',
    name: 'Зачіска-вежа',
    price: 20,
    draw: () =>
      `<path d="M-52 10 Q-70 -40 -44 -80 Q-56 -120 -24 -150 Q0 -170 24 -150 Q56 -120 44 -80 Q70 -40 52 10 Z" fill="#6d4c41" ${stroke}/>` +
      `<path d="M-30 -30 q20 -14 40 -2 M-24 -70 q20 -12 40 0 M-16 -112 q16 -10 30 0" stroke="#8d6e63" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M-46 -84 l-18 -12 v24 Z M-46 -84 l18 -12 v24 Z" fill="#ec407a" ${st(3)}/><circle cx="-46" cy="-84" r="6" fill="#f48fb1" ${st(3)}/>` +
      `<path d="M-22 -160 Q0 -150 22 -160 Q18 -146 0 -146 Q-18 -146 -22 -160 Z" fill="#a1887f" ${st(3)}/>` +
      `<circle cx="4" cy="-170" r="12" fill="#ffeb3b" ${st(3)}/><path d="M15 -172 l9 3 l-9 3 Z" fill="#ff9800" ${st(2)}/><circle cx="8" cy="-173" r="2.5" fill="#212121"/>`,
  },
  {
    id: 'knyazivna_morozyvo',
    slot: 'mouth',
    name: 'Морозиво',
    price: 10,
    draw: () =>
      `<path d="M54 2 L94 2 L74 68 Z" fill="#ffcc80" ${stroke}/>` +
      `<path d="M60 16 L88 34 M64 30 L82 18 M68 46 L78 38" stroke="#e0a050" stroke-width="3"/>` +
      `<circle cx="74" cy="-10" r="22" fill="#f48fb1" ${stroke}/>` +
      `<circle cx="74" cy="-36" r="17" fill="#a5d6a7" ${stroke}/>` +
      `<circle cx="74" cy="-56" r="7" fill="#e53935" ${st(3)}/>` +
      `<ellipse cx="4" cy="2" rx="12" ry="5" fill="#f48fb1"/><ellipse cx="-14" cy="-4" rx="5" ry="3" fill="#a5d6a7"/>`,
  },
  {
    id: 'knyazivna_komir',
    slot: 'neck',
    name: 'Мереживний комір',
    price: 15,
    draw: () => {
      const bumps = Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return [Math.round(Math.cos(a) * 80), Math.round(18 + Math.sin(a) * 28), 13] as [number, number, number];
      });
      return (
        fluff(bumps, '#fff') +
        `<ellipse cx="0" cy="18" rx="80" ry="28" fill="#fff"/>` +
        bumps.map(([x, y]) => `<path d="M${(x * 0.4).toFixed(0)} ${(18 + (y - 18) * 0.4).toFixed(0)} L${x} ${y}" stroke="#d1c4e9" stroke-width="3"/>`).join('') +
        `<ellipse cx="0" cy="18" rx="32" ry="11" fill="#fff" stroke="#d1c4e9" stroke-width="3"/>` +
        `<circle cx="0" cy="34" r="7" fill="#ec407a" ${st(3)}/>`
      );
    },
  },
];

export const SETS: Record<string, string> = {
  pastushok: 'pastushok_ovechka pastushok_sopilka pastushok_rizhok pastushok_metelyk pero',
  telesyk: 'telesyk_chovnyk telesyk_svystok telesyk_okuliary telesyk_kolo trykutka',
  zmiyuchka: 'zmiyuchka_peruka zmiyuchka_fary zmiyuchka_dudka zmiyuchka_shkarpetka',
  olenka: 'olenka_kavun olenka_polunytsi olenka_lodianyk olenka_mushky',
  koval: 'koval_kovadlo koval_okuliary koval_tsviakhy koval_pidkova',
  gusenia: 'gusenia_shkaralupka gusenia_soska gusenia_kachechka',
  kyrylo: 'kyrylo_hyria kyrylo_varenyk kyrylo_rushnyk',
  knyaz: 'knyaz_tort knyaz_lornet knyaz_lozhka knyaz_orden koruna',
  knyazivna: 'knyazivna_zhabka knyazivna_zachiska knyazivna_morozyvo knyazivna_komir serdechka',
};
