// Clothes and more things of the heroes' wardrobe, group g (see wardrobe.ts and items/a.ts).
// SETS here ADD to a hero's set (they don't replace it).
//
// Clothes (torso / legs / feet) are drawn in the puppet's own numbers (its feet at 0,0), right
// over its body; the head things at u = 100 from their slot's point.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

const star = (x: number, y: number, r: number, fill: string, w = 3) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}" ${st(w)}/>`;
};
/** a thick limb or band: an ink outline and the colour inside */
const band = (d: string, w: number, color: string, cap = 'round') =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 9}" stroke-linecap="${cap}"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="${cap}"/>`;
const mirror = (s: string) => `${s}<g transform="scale(-1 1)">${s}</g>`;
/** a maple leaf */
const maple = (x: number, y: number, r: number, fill: string) => {
  const half = [[0, -1], [0.18, -0.55], [0.48, -0.72], [0.4, -0.28], [0.92, -0.32], [0.58, 0.05], [0.75, 0.34], [0.22, 0.22], [0.04, 0.44]];
  const pts = [...half, ...half.slice(1).reverse().map(([a, b]) => [-a, b])];
  return (
    `<path d="${pts.map(([a, b], i) => `${i ? 'L' : 'M'}${(x + a * r).toFixed(1)} ${(y + b * r).toFixed(1)}`).join(' ')} Z" fill="${fill}" ${st(2.5)}/>` +
    `<path d="M${x} ${y + r * 0.44} V${y + r} M${x} ${y + r * 0.3} V${y - r * 0.6}" stroke="#6d4c41" stroke-width="2"/>`
  );
};
const hand = (x: number, y: number, r: number, skin: string) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${skin}" ${st(r > 12 ? 4 : 3)}/>`;
/** a hexagon (a nut) */
const hex = (x: number, y: number, r: number, fill: string, w = 3) =>
  `<path d="${Array.from({ length: 6 }, (_, i) => `${i ? 'L' : 'M'}${(x + Math.cos((i * Math.PI) / 3) * r).toFixed(1)} ${(y + Math.sin((i * Math.PI) / 3) * r).toFixed(1)}`).join(' ')} Z" fill="${fill}" ${st(w)}/>`;
/** a ruffled ring (a tutu, a ruff): points out and in round an ellipse */
const ruffle = (cx: number, cy: number, rx: number, ry: number, n: number, depth: number, fill: string, w = 4) => {
  const pt = (a: number, k: number) => `${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`;
  let d = `M${pt(0, 1)} `;
  for (let i = 0; i < n; i++) {
    const a0 = (i * 2 * Math.PI) / n;
    const a1 = ((i + 1) * 2 * Math.PI) / n;
    d += `Q${pt((a0 + a1) / 2, 1 + depth * 1.6)} ${pt(a1, 1)} `;
  }
  return `<path d="${d}Z" fill="${fill}" ${st(w)}/>`;
};

export const ITEMS: Item[] = [
  // ================= telesyk: the little boy (shirt -40..40, y -150..-66; legs -24..24; feet y -6)
  {
    id: 'telesyk_zhupan',
    slot: 'torso',
    name: 'Козацький жупан',
    price: 20,
    draw: () =>
      `<path d="M-44 -154 Q-56 -110 -48 -46 L48 -46 Q56 -110 44 -154 Q0 -168 -44 -154 Z" fill="#c62828" ${stroke}/>` +
      `<path d="M-6 -160 L-10 -46 M6 -160 L10 -46" stroke="#f5c542" stroke-width="5"/>` +
      [-140, -122, -104].map((y) => `<circle cx="0" cy="${y}" r="4.5" fill="#f5c542" ${st(2)}/>`).join('') +
      `<rect x="-50" y="-92" width="100" height="16" rx="5" fill="#43a047" ${st(4)}/>` +
      `<path d="M30 -78 L26 -48 M38 -78 L40 -50" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M30 -78 L26 -48 M38 -78 L40 -50" stroke="#43a047" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M22 -50 l8 6 l8 -6 M34 -52 l6 6 l6 -6" stroke="#fdd835" stroke-width="3" fill="none"/>` +
      band('M-36 -146 Q-60 -116 -50 -94', 16, '#c62828') +
      band('M36 -146 Q60 -116 50 -94', 16, '#c62828') +
      `<rect x="-62" y="-104" width="24" height="10" rx="4" fill="#f5c542" ${st(3)}/><rect x="38" y="-104" width="24" height="10" rx="4" fill="#f5c542" ${st(3)}/>` +
      hand(-50, -86, 10, '#f2c4a0') +
      hand(50, -86, 10, '#f2c4a0'),
  },
  {
    id: 'telesyk_rybky',
    slot: 'legs',
    name: 'Штани-рибки',
    price: 15,
    draw: () => {
      const fish = (x: number, y: number, c: string, f = 1) =>
        `<g transform="translate(${x} ${y}) scale(${f} 1)"><path d="M5 0 L11 -5 L11 5 Z" fill="${c}" ${st(2)}/><ellipse cx="0" cy="0" rx="7" ry="5" fill="${c}" ${st(2)}/><circle cx="-3" cy="-1" r="1.3" fill="${INK}"/></g>`;
      return (
        mirror(
          `<path d="M-28 -74 L-30 -12 L-1 -12 L-1 -74 Z" fill="#4fc3f7" ${st(4)}/>` +
            `<path d="M-28 -22 q4 -4 8 0 q4 4 8 0 q4 -4 8 0" stroke="#0277bd" stroke-width="3" fill="none"/>`,
        ) +
        fish(-16, -54, '#ff9800') +
        fish(-12, -36, '#fdd835', -1) +
        fish(14, -58, '#ef5350', -1) +
        fish(16, -38, '#ff9800') +
        `<circle cx="-6" cy="-64" r="2.5" fill="#fff" ${st(1)}/><circle cx="22" cy="-48" r="2" fill="#fff" ${st(1)}/>`
      );
    },
  },
  {
    id: 'telesyk_kedy',
    slot: 'feet',
    name: 'Кеди-блискавки',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-33 3 Q-34 -18 -14 -18 Q4 -18 4 3 Z" fill="#e53935" ${st(4)}/>` +
          `<path d="M-33 1 H4" stroke="#fff" stroke-width="6"/>` +
          `<path d="M-33 4 H4" stroke="${INK}" stroke-width="3"/>` +
          `<path d="M-18 -16 L-24 -8 L-16 -8 L-22 0" stroke="#fdd835" stroke-width="4" fill="none" stroke-linejoin="round"/>` +
          `<path d="M-10 -16 l6 4 M-8 -11 l6 4" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`,
      ),
  },

  // ================= zmiyuchka: the snake-witch (neck -30,-110 → -30,-260; coils below)
  {
    id: 'zmiyuchka_svetr',
    slot: 'torso',
    name: 'Смугастий светр-труба',
    price: 15,
    draw: () =>
      band('M-26 -86 Q-56 -200 -30 -256', 64, '#e53935', 'butt') +
      `<path d="M-26 -86 Q-56 -200 -30 -256" fill="none" stroke="#fdd835" stroke-width="64" stroke-dasharray="16 16"/>` +
      `<ellipse cx="-27" cy="-88" rx="40" ry="14" fill="#43a047" ${stroke}/>` +
      `<path d="M-57 -88 v10 M-43 -84 v12 M-27 -82 v12 M-11 -84 v12 M3 -88 v10" stroke="#2e7d32" stroke-width="4"/>` +
      `<circle cx="-46" cy="-176" r="9" fill="#fff" ${st(3)}/><circle cx="-14" cy="-210" r="8" fill="#fff" ${st(3)}/>`,
  },
  {
    id: 'zmiyuchka_hirlianda',
    slot: 'legs',
    name: 'Пояс-гірлянда',
    price: 15,
    draw: () => {
      const cs = ['#e53935', '#fdd835', '#43a047', '#1e88e5', '#ab47bc'];
      let bulbs = '';
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const x = -100 + 200 * t;
        const y = -86 + 2 * t * (1 - t) * 72;
        bulbs += `<rect x="${(x - 4).toFixed(0)}" y="${(y - 2).toFixed(0)}" width="8" height="6" fill="#90a4ae" ${st(2)}/><ellipse cx="${x.toFixed(0)}" cy="${(y + 11).toFixed(0)}" rx="7" ry="10" fill="${cs[i % 5]}" ${st(3)}/><ellipse cx="${(x - 2).toFixed(0)}" cy="${(y + 8).toFixed(0)}" rx="2" ry="3" fill="#fff" opacity=".7"/>`;
      }
      return `<path d="M-104 -88 Q0 -2 104 -88" stroke="#2e7d32" stroke-width="5" fill="none"/>` + bulbs;
    },
  },
  {
    id: 'zmiyuchka_skeit',
    slot: 'feet',
    name: 'Скейтборд',
    price: 20,
    draw: () =>
      `<path d="M-112 -6 Q-128 -6 -128 -16 L-120 -18 Q-118 -10 -104 -10 L144 -10 Q158 -10 160 -18 L168 -16 Q168 -6 152 -6 L152 6 L-112 6 Z" fill="#7e57c2" ${st(4)}/>` +
      `<path d="M-90 0 l20 -6 l-6 8 l22 -8 M60 0 l20 -6 l-6 8 l22 -8" stroke="#ffeb3b" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      [-84, -60, 116, 140].map((x) => `<circle cx="${x}" cy="15" r="9" fill="#ff7043" ${st(3)}/><circle cx="${x}" cy="15" r="3" fill="#fff"/>`).join('') +
      `<path d="M-146 -2 h-18 M-142 12 h-28" stroke="#90a4ae" stroke-width="5" stroke-linecap="round"/>`,
  },

  // ================= olenka: the snake-girl (neck -10,-40 → -14,-170; coil at y -26)
  {
    id: 'olenka_svetr',
    slot: 'torso',
    name: 'Светрик з оленем',
    price: 15,
    draw: () =>
      band('M-9 -30 Q-30 -120 -14 -166', 42, '#c62828', 'butt') +
      `<path d="M-10 -60 Q-26 -120 -14 -160" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>` +
      // a little deer on the chest: a red nose
      `<path d="M-30 -122 l-8 -12 l-6 2 M-38 -134 l-2 -8 M-14 -122 l8 -12 l6 2 M-6 -134 l2 -8" stroke="#6d4c41" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="-22" cy="-110" rx="11" ry="13" fill="#a1887f" ${st(3)}/>` +
      `<circle cx="-26" cy="-114" r="2" fill="${INK}"/><circle cx="-18" cy="-114" r="2" fill="${INK}"/>` +
      `<circle cx="-22" cy="-100" r="5" fill="#ff1744" ${st(2)}/>` +
      `<ellipse cx="-9" cy="-30" rx="28" ry="11" fill="#fff" ${st(4)}/>`,
  },
  {
    id: 'olenka_pachka',
    slot: 'legs',
    name: 'Пачка балерини',
    price: 15,
    draw: () => ruffle(6, -38, 96, 22, 14, 0.12, '#f48fb1') + ruffle(6, -40, 74, 15, 12, 0.14, '#f8bbd0', 3) + star(-56, -40, 7, '#fff59d', 2) + star(66, -38, 7, '#fff59d', 2),
  },
  {
    id: 'olenka_cherevychky',
    slot: 'feet',
    name: 'Черевички-сердечка',
    price: 10,
    draw: () =>
      [-46, 62]
        .map(
          (x) =>
            `<path d="M${x} 8 C${x - 26} -6 ${x - 20} -26 ${x} -14 C${x + 20} -26 ${x + 26} -6 ${x} 8 Z" fill="#e53935" ${st(4)}/>` +
            `<path d="M${x - 9} -16 Q${x} -26 ${x + 9} -16" stroke="#fff59d" stroke-width="4" fill="none" stroke-linecap="round"/>`,
        )
        .join(''),
  },

  // ================= koval: the smith (sleeveless: his arms go over; shirt -84..84, y -260..-114)
  {
    id: 'koval_kaska',
    slot: 'head',
    name: 'Каска будівельника',
    price: 15,
    draw: () =>
      `<ellipse cx="0" cy="2" rx="84" ry="14" fill="#fbc02d" ${stroke}/>` +
      `<path d="M-62 0 Q-66 -84 0 -88 Q66 -84 62 0 Z" fill="#fdd835" ${stroke}/>` +
      `<path d="M0 -86 V-4 M-30 -76 Q-38 -40 -36 -4 M30 -76 Q38 -40 36 -4" stroke="#f9a825" stroke-width="6" fill="none"/>` +
      `<rect x="-16" y="-52" width="32" height="26" rx="6" fill="#455a64" ${st(4)}/>` +
      `<circle cx="0" cy="-39" r="9" fill="#fff59d" ${st(3)}/>` +
      `<path d="M-16 -62 l-10 -14 M0 -64 v-18 M16 -62 l10 -14" stroke="#fff59d" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'koval_vidro',
    slot: 'head',
    name: 'Відро на голові',
    price: 10,
    draw: () =>
      `<path d="M-62 6 L-44 -92 L44 -92 L62 6 Z" fill="#90a4ae" ${stroke}/>` +
      `<ellipse cx="0" cy="-92" rx="44" ry="10" fill="#b0bec5" ${st(4)}/>` +
      `<path d="M-56 -26 H56 M-50 -60 H50" stroke="#607d8b" stroke-width="5"/>` +
      `<path d="M20 -48 q8 6 4 14 q-8 -2 -4 -14" fill="#cfd8dc"/>` +
      `<path d="M-60 0 Q-96 30 -84 60" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M66 -30 q6 12 0 16 q-6 -4 0 -16 Z M78 -6 q5 10 0 14 q-5 -4 0 -14 Z" fill="#4fc3f7" ${st(2)}/>`,
  },
  {
    id: 'koval_zvariuvalna',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Маска зварювальника',
    price: 15,
    draw: () =>
      `<path d="M-80 -24 Q-84 -110 0 -116 Q84 -110 80 -24 Z" fill="#455a64" ${stroke}/>` +
      `<path d="M-50 -60 H50" stroke="#ff7043" stroke-width="8" stroke-linecap="round"/>` +
      `<rect x="-68" y="-22" width="136" height="36" rx="10" fill="none" stroke="#263238" stroke-width="12"/><rect x="-74" y="-28" width="148" height="48" rx="13" fill="none" ${st(4)}/>` +
      `<rect x="-62" y="-16" width="124" height="24" rx="6" fill="#76ff03" fill-opacity=".3"/>` +
      star(-92, -70, 10, '#ffeb3b') +
      star(96, -40, 8, '#ff9800') +
      star(84, -100, 7, '#ffeb3b'),
  },
  {
    id: 'koval_haiky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-гайки',
    price: 15,
    draw: () =>
      hex(-36, 0, 34, '#9e9e9e', 5) +
      hex(36, 0, 34, '#9e9e9e', 5) +
      `<circle cx="-36" cy="0" r="22" fill="#e1f5fe" fill-opacity=".55" ${st(4)}/>` +
      `<circle cx="36" cy="0" r="22" fill="#e1f5fe" fill-opacity=".55" ${st(4)}/>` +
      `<rect x="-10" y="-8" width="20" height="10" rx="2" fill="#bdbdbd" ${st(3)}/>` +
      `<path d="M-30 -10 q6 -6 12 -4 M42 -10 q6 -6 12 -4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'koval_vusa',
    beard: true,
    slot: 'mouth',
    name: 'Вуса-підкова',
    price: 10,
    draw: () =>
      `<g transform="translate(0 -10) scale(1.25)">` +
      band('M-46 62 L-44 0 Q-42 -20 0 -20 Q42 -20 44 0 L46 62', 20, '#90a4ae') +
      [
        [-45, 46],
        [-44, 20],
        [-28, -12],
        [0, -20],
        [28, -12],
        [44, 20],
        [45, 46],
      ]
        .map(([x, y]) => `<rect x="${x - 3}" y="${y - 4}" width="6" height="8" rx="1" fill="${INK}"/>`)
        .join('') +
      `<path d="M-30 -16 Q-10 -24 10 -22" stroke="#eceff1" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `</g>`,
  },
  {
    id: 'koval_vohon',
    beard: true,
    slot: 'mouth',
    name: 'Вогняна борода',
    price: 20,
    draw: () =>
      `<g transform="translate(0 -16) scale(1.5)">` +
      `<path d="M-66 -4 Q-76 50 -56 70 Q-60 40 -40 30 Q-44 80 -20 110 Q-22 70 0 56 Q-4 100 10 140 Q24 90 26 60 Q40 80 34 116 Q62 80 46 34 Q66 46 62 74 Q84 40 66 -4 Q30 22 0 18 Q-30 22 -66 -4 Z" fill="#ff7043" ${stroke}/>` +
      `<path d="M-40 16 Q-34 50 -22 70 Q-16 40 0 34 Q4 70 12 96 Q20 60 22 40 Q36 52 38 70 Q50 40 40 16 Q16 30 0 28 Q-20 30 -40 16 Z" fill="#ffd54f"/>` +
      `<path d="M-12 32 Q0 54 10 34" fill="#fff59d"/>` +
      `</g>`,
  },
  {
    id: 'koval_namysto',
    slot: 'neck',
    name: 'Намисто з гайок',
    price: 15,
    draw: () =>
      `<g transform="scale(1.4)">` +
      `<path d="M-74 -16 Q0 70 74 -16" stroke="${INK}" stroke-width="4" fill="none"/>` +
      Array.from({ length: 9 }, (_, i) => {
        const t = (i + 1) / 10;
        const x = -74 * (1 - t) * (1 - t) + 74 * t * t;
        const y = -16 * (1 - t) * (1 - t) + 2 * 70 * t * (1 - t) - 16 * t * t;
        if (i === 4) return '';
        return i % 2 ? `<rect x="${(x - 5).toFixed(0)}" y="${(y - 11).toFixed(0)}" width="10" height="22" rx="2" fill="#bdbdbd" ${st(3)}/>` : hex(x, y, 11, '#cfd8dc') + `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4" fill="#5d6d74"/>`;
      }).join('') +
      hex(0, 40, 24, '#ffc107', 4) +
      `<circle cx="0" cy="40" r="9" fill="#fff8e1" ${st(3)}/>` +
      `</g>`,
  },
  {
    id: 'koval_polumya',
    slot: 'torso',
    name: 'Фартух у полум’ї',
    price: 25,
    draw: () =>
      `<path d="M-58 -248 L-70 -54 L70 -54 L58 -248 Z" fill="#37474f" ${stroke}/>` +
      `<path d="M-50 -246 L-34 -278 M50 -246 L34 -278" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M-50 -246 L-34 -278 M50 -246 L34 -278" stroke="#37474f" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M-68 -58 Q-74 -110 -56 -140 Q-54 -110 -40 -100 Q-46 -150 -22 -190 Q-18 -140 -4 -126 Q0 -170 20 -200 Q22 -150 36 -128 Q40 -160 56 -170 Q60 -120 52 -100 Q66 -110 66 -130 Q74 -100 68 -58 Z" fill="#ff7043" ${stroke}/>` +
      `<path d="M-56 -60 Q-58 -94 -46 -110 Q-40 -90 -28 -86 Q-30 -120 -14 -146 Q-8 -110 4 -100 Q8 -130 20 -150 Q26 -110 38 -96 Q44 -116 52 -120 Q60 -90 56 -60 Z" fill="#ffd54f"/>` +
      `<path d="M-20 -60 Q-20 -84 -6 -96 Q2 -80 12 -76 Q20 -84 24 -60 Z" fill="#fff59d"/>` +
      `<rect x="-26" y="-236" width="52" height="34" rx="6" fill="#455a64" ${st(4)}/>` +
      `<path d="M-14 -210 L-6 -228 L2 -214 L10 -230" stroke="#ff7043" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      star(-44, -224, 7, '#ffeb3b', 2) +
      star(44, -206, 6, '#ff9800', 2),
  },
  {
    id: 'koval_molotky',
    slot: 'legs',
    name: 'Шорти з молоточками',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-40 -40 L-41 -14 L-11 -14 L-10 -40 Z" fill="#e0b090" ${st(4)}/>` +
          `<path d="M-34 -30 l3 -5 M-22 -26 l3 -5" stroke="#6d4c41" stroke-width="2.5" stroke-linecap="round"/>`,
      ) +
      `<path d="M-58 -62 L-66 -26 L-4 -26 L0 -44 L4 -26 L66 -26 L58 -62 Z" fill="#26a69a" ${stroke}/>` +
      [
        [-40, -48, -30],
        [-18, -46, 30],
        [20, -48, -30],
        [42, -46, 30],
      ]
        .map(
          ([x, y, a]) =>
            `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -2 V9" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/><rect x="-7" y="-8" width="14" height="7" rx="1.5" fill="#cfd8dc" ${st(2)}/></g>`,
        )
        .join(''),
  },
  {
    id: 'koval_kovadla',
    slot: 'feet',
    name: 'Чоботи-ковадла',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-54 3 L-50 -8 L-44 -8 L-42 -20 L-80 -24 Q-70 -34 -56 -34 L-4 -34 L-4 -20 L-16 -20 L-14 -8 L-8 -8 L-6 3 Z" fill="#546e7a" ${stroke}/>` +
          `<path d="M-60 -30 H-10" stroke="#b0bec5" stroke-width="4" stroke-linecap="round"/>` +
          star(-30, -46, 7, '#ffeb3b', 2) +
          `<path d="M-40 -40 l-6 -8 M-20 -40 l6 -8" stroke="#ff9800" stroke-width="3" stroke-linecap="round"/>`,
      ),
  },

  // ================= gusenia: the gosling (body 0,-40 56×30, the beak to the left)
  {
    id: 'gusenia_yaiechko',
    slot: 'torso',
    name: 'Светрик-яєчко',
    price: 15,
    draw: () =>
      `<path d="M-58 -44 L-48 -58 L-36 -46 L-24 -62 L-10 -48 L4 -64 L18 -50 L32 -66 L44 -52 L58 -60 Q66 -30 50 -14 Q30 -4 0 -6 Q-50 -6 -58 -44 Z" fill="#fffde7" ${stroke}/>` +
      `<path d="M-50 -22 Q0 -12 54 -26" stroke="#ffcc80" stroke-width="5" fill="none" stroke-dasharray="6 6"/>` +
      `<ellipse cx="-30" cy="-32" rx="6" ry="4" fill="#ffe082"/><ellipse cx="34" cy="-38" rx="7" ry="5" fill="#ffe082"/><ellipse cx="8" cy="-30" rx="4" ry="3" fill="#ffe082"/>` +
      `<path d="M-6 -40 C-14 -48 -12 -56 -6 -52 C0 -56 2 -48 -6 -40 Z" fill="#f48fb1" ${st(2)}/>`,
  },
  {
    id: 'gusenia_pidguzok',
    slot: 'legs',
    name: 'Підгузок',
    price: 10,
    draw: () =>
      `<path d="M2 -14 Q30 -4 54 -20 Q68 -38 58 -58 Q44 -40 22 -38 Q0 -34 2 -14 Z" fill="#fff" ${stroke}/>` +
      `<rect x="-2" y="-32" width="12" height="9" rx="3" fill="#64b5f6" ${st(3)}/>` +
      `<rect x="52" y="-58" width="12" height="9" rx="3" fill="#64b5f6" ${st(3)}/>` +
      `<circle cx="20" cy="-22" r="3" fill="#f48fb1"/><circle cx="34" cy="-26" r="3" fill="#fff176" ${st(1)}/><circle cx="46" cy="-34" r="3" fill="#81d4fa"/>`,
  },
  {
    id: 'gusenia_shkaralupky',
    slot: 'feet',
    name: 'Черевички-шкаралупки',
    price: 10,
    draw: () =>
      [-16, 10]
        .map(
          (x) =>
            `<path d="M${x - 14} -9 L${x - 9} -15 L${x - 4} -9 L${x + 1} -16 L${x + 6} -9 L${x + 11} -14 Q${x + 14} 4 ${x - 1} 4 Q${x - 16} 4 ${x - 14} -9 Z" fill="#fff" ${st(3)}/>` +
            `<circle cx="${x - 6}" cy="-2" r="1.8" fill="#bdbdbd"/><circle cx="${x + 4}" cy="-4" r="1.5" fill="#bdbdbd"/>`,
        )
        .join(''),
  },

  // ================= kyrylo: the strong tanner (shirt -92..92, y -290..-120; hands ±116,-148)
  {
    id: 'kyrylo_tryko',
    slot: 'torso',
    name: 'Борцівське трико',
    price: 20,
    draw: () =>
      // bare skin first, then the singlet on straps
      `<path d="M-88 -294 Q-108 -200 -96 -116 L-98 -68 L98 -68 L96 -116 Q108 -200 88 -294 Q0 -318 -88 -294 Z" fill="#e0b090" ${stroke}/>` +
      `<path d="M-40 -260 Q-20 -246 -4 -260 M4 -260 Q20 -246 40 -260" stroke="#c48a64" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M-74 -298 L-50 -232 Q0 -214 50 -232 L74 -298 L88 -294 Q108 -200 96 -116 L98 -68 L-98 -68 L-96 -116 Q-108 -200 -88 -294 Z" fill="#d32f2f" ${stroke}/>` +
      `<path d="M-90 -180 Q0 -166 90 -180" stroke="#fdd835" stroke-width="6" fill="none"/>` +
      `<rect x="-98" y="-140" width="196" height="24" rx="8" fill="#ffc107" ${st(4)}/>` +
      `<ellipse cx="0" cy="-128" rx="30" ry="20" fill="#fff59d" ${st(4)}/>` +
      `<path d="M0 -140 L4 -132 L12 -131 L6 -125 L8 -117 L0 -121 L-8 -117 L-6 -125 L-12 -131 L-4 -132 Z" fill="#e53935" ${st(2)}/>` +
      band('M-82 -282 Q-126 -230 -116 -164', 38, '#e0b090') +
      band('M82 -282 Q126 -230 116 -164', 38, '#e0b090') +
      `<path d="M-104 -250 q-14 14 -10 30 M104 -250 q14 14 10 30" stroke="#c48a64" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      hand(-116, -148, 19, '#e0b090') +
      hand(116, -148, 19, '#e0b090'),
  },
  {
    id: 'kyrylo_harmoshka',
    slot: 'legs',
    name: 'Штани-гармошка',
    price: 15,
    draw: () => {
      let folds = '';
      for (let y = -128; y < -16; y += 12) folds += `<path d="M-56 ${y} L-6 ${y}" stroke="#e65100" stroke-width="4"/><path d="M-56 ${y + 6} L-6 ${y + 6}" stroke="#ffe0b2" stroke-width="3"/>`;
      return mirror(
        `<path d="M-52 -136 L-58 -12 L-6 -12 L-5 -136 Z" fill="#ffb300"/>` +
          `<g>${folds}</g>` +
          `<path d="M-52 -136 L-58 -12 L-6 -12 L-5 -136 Z" fill="none" ${st(4)}/>`,
      );
    },
  },
  {
    id: 'kyrylo_bortsivky',
    slot: 'feet',
    name: 'Борцівки',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-55 -44 L-55 -16 Q-68 -14 -66 3 L-8 3 L-8 -44 Z" fill="#1e88e5" ${stroke}/>` +
          `<path d="M-66 0 H-8" stroke="#fff" stroke-width="5"/>` +
          `<path d="M-40 -40 L-24 -34 L-40 -28 L-24 -22 L-40 -16 L-24 -10" stroke="#fff" stroke-width="3" fill="none"/>` +
          `<path d="M-52 -40 L-52 -10" stroke="#fdd835" stroke-width="4"/>`,
      ),
  },

  // ================= knyaz: the old prince (a red kaftan, a grey beard)
  {
    id: 'knyaz_nabakyr',
    slot: 'head',
    name: 'Корона набакир з бантом',
    price: 20,
    draw: () =>
      `<g transform="translate(16 -6) rotate(20)">` +
      `<path d="M-56 6 L-64 -62 L-30 -30 L0 -78 L30 -30 L64 -62 L56 6 Z" fill="#ffd54f" ${stroke}/>` +
      `<rect x="-58" y="-8" width="116" height="16" rx="6" fill="#ffb300" ${st(4)}/>` +
      `<circle cx="0" cy="-28" r="9" fill="#e53935" ${st(3)}/>` +
      `<circle cx="-64" cy="-66" r="6" fill="#fff59d" ${st(3)}/><circle cx="0" cy="-82" r="6" fill="#fff59d" ${st(3)}/><circle cx="64" cy="-66" r="6" fill="#fff59d" ${st(3)}/></g>` +
      // a big pink bow on the low side
      `<g transform="translate(-52 -8) rotate(-20)">` +
      `<path d="M0 0 L-40 -26 Q-48 0 -40 26 Z M0 0 L40 -26 Q48 0 40 26 Z" fill="#ec407a" ${stroke}/>` +
      `<path d="M-4 6 L-16 40 M4 6 L18 38" stroke="#ec407a" stroke-width="8" stroke-linecap="round"/>` +
      `<circle cx="0" cy="0" r="11" fill="#f8bbd0" ${st(4)}/></g>`,
  },
  {
    id: 'knyaz_turban',
    slot: 'head',
    name: 'Тюрбан султана',
    price: 25,
    draw: () =>
      // a tall plume
      `<path d="M0 -60 Q-14 -130 20 -170 Q14 -120 30 -100 Q40 -140 62 -150 Q44 -100 10 -60 Z" fill="#26c6da" ${stroke}/>` +
      `<path d="M8 -70 Q4 -120 20 -160" stroke="#e0f7fa" stroke-width="4" fill="none"/>` +
      `<path d="M-72 8 Q-96 -64 -40 -98 Q0 -118 40 -98 Q96 -64 72 8 Q0 26 -72 8 Z" fill="#fff3e0" ${stroke}/>` +
      `<path d="M-80 -20 Q0 -60 80 -20 M-74 -52 Q0 -88 66 -62 M-60 4 Q-10 -30 60 -80" stroke="#ffb74d" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<circle cx="0" cy="-46" r="20" fill="#ffc107" ${stroke}/>` +
      `<path d="M0 -60 L12 -46 L0 -32 L-12 -46 Z" fill="#e53935" ${st(3)}/>` +
      `<path d="M-6 -50 l4 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  },
  {
    id: 'knyaz_koronky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-корони',
    price: 15,
    draw: () =>
      [-36, 36]
        .map(
          (x) =>
            `<path d="M${x - 24} -22 L${x - 28} -54 L${x - 12} -38 L${x} -60 L${x + 12} -38 L${x + 28} -54 L${x + 24} -22 Z" fill="#ffd54f" ${st(4)}/>` +
            `<circle cx="${x}" cy="-44" r="4" fill="#e53935"/>` +
            `<circle cx="${x}" cy="2" r="28" fill="#e1f5fe" fill-opacity=".45" stroke="#f5b400" stroke-width="8"/>` +
            `<circle cx="${x}" cy="2" r="32" fill="none" ${st(3)}/>`,
        )
        .join('') +
      `<path d="M-6 -6 Q0 -14 6 -6" stroke="#f5b400" stroke-width="7" fill="none"/>`,
  },
  {
    id: 'knyaz_propeler',
    beard: true,
    slot: 'mouth',
    name: 'Вуса-пропелер',
    price: 20,
    draw: () =>
      `<g transform="translate(0 -26) scale(1.4)">` +
      `<path d="M0 -6 Q-36 -36 -76 -18 Q-92 -10 -84 4 Q-70 -14 -40 0 Q-18 8 0 -6 Z" fill="#bdbdbd" ${stroke}/>` +
      `<path d="M0 -6 Q36 24 76 6 Q92 -2 84 -16 Q70 2 40 -12 Q18 -20 0 -6 Z" fill="#bdbdbd" ${stroke}/>` +
      `<circle cx="0" cy="-6" r="11" fill="#e53935" ${st(4)}/><circle cx="0" cy="-6" r="3.5" fill="#fff59d"/>` +
      // it spins: whoosh
      `<path d="M-96 -34 q-12 16 0 34 M-106 -40 q-16 22 0 46 M96 -24 q12 16 0 34 M106 -30 q16 22 0 46" stroke="#90caf9" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="10 8"/></g>`,
  },
  {
    id: 'knyaz_krendeli',
    beard: true,
    slot: 'mouth',
    name: 'Вуса-кренделі',
    price: 15,
    draw: () =>
      mirror(
        `<g transform="translate(-50 -30) rotate(-12) scale(1.35)">` +
          band('M-22 18 C-46 -10 -26 -36 -4 -20 Q8 -8 0 14 M22 18 C46 -10 26 -36 4 -20 Q-8 -8 0 14 M-22 18 Q0 28 22 18', 10, '#d48a3a') +
          `<circle cx="-18" cy="-12" r="2" fill="#fff"/><circle cx="16" cy="-18" r="2" fill="#fff"/><circle cx="-2" cy="20" r="2" fill="#fff"/><circle cx="24" cy="4" r="2" fill="#fff"/></g>`,
      ),
  },
  {
    id: 'knyaz_zhabo',
    slot: 'neck',
    name: 'Жабо',
    price: 15,
    draw: () =>
      `<g transform="scale(1.45)">` +
      ruffle(0, 74, 44, 20, 9, 0.18, '#fff') +
      ruffle(0, 44, 56, 22, 10, 0.18, '#fff8e1') +
      ruffle(0, 12, 70, 24, 12, 0.18, '#fff') +
      `<path d="M-40 8 q10 8 20 0 M20 8 q10 8 20 0 M-24 44 q8 6 16 0 M8 44 q8 6 16 0 M-10 74 q10 6 20 0" stroke="#e0d6c0" stroke-width="3" fill="none"/>` +
      `<path d="M0 -6 L10 8 L0 22 L-10 8 Z" fill="#e53935" ${st(3)}/></g>`,
  },
  {
    id: 'knyaz_pechyvo',
    slot: 'neck',
    name: 'Медаль-печиво',
    price: 15,
    draw: () =>
      `<path d="M-36 -16 L-12 40 M36 -16 L12 40" stroke="${INK}" stroke-width="18"/>` +
      `<path d="M-36 -16 L-12 40 M36 -16 L12 40" stroke="#ab47bc" stroke-width="11"/>` +
      `<path d="M32 58 A34 34 0 1 1 17 41 A10 10 0 0 0 24 47 A10 10 0 0 0 32 58 Z" fill="#d7a35a" ${stroke}/>` +
      [
        [-14, 60],
        [6, 80],
        [-6, 90],
        [16, 66],
        [-20, 82],
        [0, 52],
      ]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3.5" fill="#5d4037"/>`)
        .join('') +
      `<path d="M30 46 l6 -6 M36 54 l8 -2" stroke="#d7a35a" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'knyaz_mantiya',
    slot: 'torso',
    name: 'Мантія з горностаєм',
    price: 30,
    draw: () => {
      const spots = (pts: number[][]) => pts.map(([x, y]) => `<path d="M${x} ${y - 5} l-3 9 h6 Z" fill="#212121"/>`).join('');
      return (
        `<path d="M-64 -270 Q-118 -160 -132 -34 L132 -34 Q118 -160 64 -270 Q0 -292 -64 -270 Z" fill="#6a1b9a" ${stroke}/>` +
        `<path d="M-26 -262 L-38 -36 L38 -36 L26 -262 Z" fill="#f5c542" ${st(4)}/>` +
        `<circle cx="0" cy="-130" r="6" fill="#e53935" ${st(2)}/><circle cx="0" cy="-100" r="6" fill="#e53935" ${st(2)}/><circle cx="0" cy="-70" r="6" fill="#e53935" ${st(2)}/>` +
        // ermine down the opening and along the hem
        `<path d="M-26 -262 L-38 -36 L-58 -36 L-46 -262 Z M26 -262 L38 -36 L58 -36 L46 -262 Z" fill="#fff" ${st(4)}/>` +
        `<path d="M-132 -34 L132 -34 L132 -16 Q0 -6 -132 -16 Z" fill="#fff" ${st(4)}/>` +
        spots([
          [-42, -230],
          [-46, -170],
          [-50, -110],
          [-52, -56],
          [42, -200],
          [46, -140],
          [50, -80],
          [-110, -24],
          [-80, -22],
          [80, -22],
          [110, -24],
        ]) +
        band('M-66 -256 Q-108 -210 -98 -158', 28, '#6a1b9a') +
        band('M66 -256 Q108 -210 98 -158', 28, '#6a1b9a') +
        `<rect x="-118" y="-168" width="40" height="18" rx="8" fill="#fff" ${st(4)}/><rect x="78" y="-168" width="40" height="18" rx="8" fill="#fff" ${st(4)}/>` +
        spots([
          [-104, -158],
          [-90, -160],
          [92, -160],
          [106, -158],
        ]) +
        hand(-96, -140, 15, '#f2c4a0') +
        hand(96, -140, 15, '#f2c4a0') +
        // the ermine cape on the shoulders
        `<path d="M-80 -266 Q-96 -222 -64 -212 Q0 -196 64 -212 Q96 -222 80 -266 Q0 -292 -80 -266 Z" fill="#fff" ${stroke}/>` +
        spots([
          [-66, -232],
          [-36, -218],
          [0, -214],
          [36, -218],
          [66, -232],
        ])
      );
    },
  },
  {
    id: 'knyaz_skafandr',
    slot: 'torso',
    name: 'Скафандр космонавта',
    price: 30,
    draw: () =>
      `<path d="M-76 -268 Q-98 -170 -90 -50 L90 -50 Q98 -170 76 -268 Q0 -288 -76 -268 Z" fill="#eceff1" ${stroke}/>` +
      `<path d="M-90 -80 H90" stroke="#ff7043" stroke-width="10"/>` +
      `<rect x="-34" y="-190" width="68" height="46" rx="8" fill="#455a64" ${st(4)}/>` +
      `<circle cx="-20" cy="-176" r="6" fill="#e53935"/><circle cx="-4" cy="-176" r="6" fill="#fdd835"/><circle cx="12" cy="-176" r="6" fill="#43a047"/>` +
      `<rect x="-24" y="-162" width="48" height="10" rx="3" fill="#80deea"/>` +
      `<path d="M-34 -150 Q-60 -110 -40 -90 M34 -150 Q60 -110 40 -90" stroke="#90a4ae" stroke-width="6" fill="none" stroke-dasharray="3 3"/>` +
      `<rect x="44" y="-232" width="26" height="18" fill="#1e88e5" ${st(3)}/><rect x="44" y="-223" width="26" height="9" fill="#fdd835"/>` +
      star(-56, -220, 10, '#fdd835') +
      band('M-66 -256 Q-106 -210 -98 -160', 30, '#eceff1') +
      band('M66 -256 Q106 -210 98 -160', 30, '#eceff1') +
      `<path d="M-84 -232 l-14 6 M-100 -200 l-14 2 M84 -232 l14 6 M100 -200 l14 2" stroke="#b0bec5" stroke-width="4" stroke-linecap="round"/>` +
      `<rect x="-116" y="-166" width="38" height="12" rx="5" fill="#ff7043" ${st(3)}/><rect x="78" y="-166" width="38" height="12" rx="5" fill="#ff7043" ${st(3)}/>` +
      hand(-96, -140, 17, '#90a4ae') +
      hand(96, -140, 17, '#90a4ae'),
  },
  {
    id: 'knyaz_pantalony',
    slot: 'legs',
    name: 'Пишні панталони',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-50 -70 Q-80 -44 -50 -20 L-6 -20 Q8 -44 -2 -70 Z" fill="#f48fb1" ${stroke}/>` +
          `<path d="M-38 -66 Q-56 -44 -38 -24 M-22 -68 Q-30 -44 -22 -22" stroke="#fff" stroke-width="6" fill="none"/>` +
          `<rect x="-50" y="-26" width="46" height="10" rx="4" fill="#f5c542" ${st(3)}/>`,
      ),
  },
  {
    id: 'knyaz_tufli',
    slot: 'feet',
    name: 'Туфлі-закарлючки',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-56 0 Q-90 2 -92 -22 Q-92 -36 -80 -34" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>` +
          `<path d="M-56 0 Q-90 2 -92 -22 Q-92 -36 -80 -34" fill="none" stroke="#ffc107" stroke-width="6" stroke-linecap="round"/>` +
          `<path d="M-60 3 Q-62 -20 -36 -22 L-6 -22 L-5 3 Z" fill="#ffc107" ${stroke}/>` +
          `<circle cx="-80" cy="-38" r="7" fill="#fff59d" ${st(3)}/>` +
          `<circle cx="-30" cy="-12" r="5" fill="#e53935" ${st(2)}/>`,
      ),
  },

  // ================= pastushok: the shepherd boy (shirt -54..54, y -200..-90; one arm, a stick)
  {
    id: 'pastushok_sheryf',
    slot: 'torso',
    name: 'Жилетка шерифа',
    price: 20,
    draw: () => {
      let checks = '';
      for (let x = -40; x <= 40; x += 16) checks += `<path d="M${x} -206 V-80" stroke="#fff" stroke-width="4" opacity=".7"/>`;
      for (let y = -196; y <= -84; y += 16) checks += `<path d="M-56 ${y} H56" stroke="#fff" stroke-width="4" opacity=".7"/>`;
      return (
        `<path d="M-50 -204 Q-62 -140 -58 -76 L58 -76 Q62 -140 50 -204 Q0 -218 -50 -204 Z" fill="#e53935"/>` +
        `<g>${checks}</g>` +
        `<path d="M-50 -204 Q-62 -140 -58 -76 L58 -76 Q62 -140 50 -204 Q0 -218 -50 -204 Z" fill="none" ${stroke}/>` +
        mirror(
          `<path d="M-50 -204 Q-62 -140 -58 -86 L-14 -86 L-18 -196 Z" fill="#4e342e" ${stroke}/>` +
            `<path d="M-56 -86 v12 M-46 -86 v14 M-36 -86 v12 M-26 -86 v14 M-16 -86 v12" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/>`,
        ) +
        `<rect x="-58" y="-104" width="116" height="12" rx="4" fill="#3e2723" ${st(3)}/>` +
        `<rect x="-12" y="-108" width="24" height="20" rx="4" fill="#fdd835" ${st(3)}/>` +
        star(34, -160, 14, '#ffd54f') +
        band('M-46 -194 Q-70 -160 -64 -132', 17, '#e53935') +
        hand(-64, -124, 11, '#f2c4a0')
      );
    },
  },
  {
    id: 'pastushok_dzhynsy',
    slot: 'legs',
    name: 'Джинси з бахромою',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-34 -100 L-36 -12 L-3 -12 L-2 -100 Z" fill="#3f6fb5" ${st(4)}/>` +
          `<path d="M-30 -96 L-32 -16" stroke="#fdd835" stroke-width="2.5" stroke-dasharray="5 4"/>` +
          `<path d="M-36 -80 l-8 2 M-36 -66 l-8 2 M-37 -52 l-8 2 M-37 -38 l-8 2 M-37 -24 l-8 2" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'pastushok_choboty',
    slot: 'feet',
    name: 'Чоботи зі шпорами',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-35 -38 L-34 -18 Q-46 -16 -46 3 L-3 3 L-3 -38 Z" fill="#a0522d" ${stroke}/>` +
          `<path d="M-37 -38 L-28 -30 L-20 -38 L-12 -30 L-1 -38" stroke="${INK}" stroke-width="3" fill="#7b3f1d"/>` +
          star(-19, -18, 6, '#fdd835', 2) +
          `<path d="M-46 -8 H-54" stroke="${INK}" stroke-width="4"/>` +
          star(-58, -8, 8, '#cfd8dc', 2),
      ),
  },

  // ================= sirko: the old dog (body 4,-82 72×38; four legs; the head to the left)
  {
    id: 'sirko_svetr',
    slot: 'torso',
    name: 'Светрик у ромбик',
    price: 15,
    draw: () =>
      `<path d="M-52 -104 Q-30 -124 10 -122 Q70 -120 76 -84 Q76 -52 50 -46 L-34 -46 Q-60 -60 -52 -104 Z" fill="#8e24aa" ${stroke}/>` +
      [-28, -2, 24, 50].map((x, i) => `<path d="M${x} -100 L${x + 12} -84 L${x} -68 L${x - 12} -84 Z" fill="${i % 2 ? '#fdd835' : '#4dd0e1'}" ${st(3)}/>`).join('') +
      `<path d="M-34 -50 H50" stroke="#6a1b9a" stroke-width="8" stroke-dasharray="4 4"/>` +
      `<path d="M-52 -104 Q-62 -80 -48 -58" stroke="#6a1b9a" stroke-width="10" fill="none" stroke-dasharray="4 4"/>`,
  },
  {
    id: 'sirko_shtany',
    slot: 'legs',
    name: 'Штани на чотири лапи',
    price: 15,
    draw: () =>
      [-48, -20, 32, 56]
        .map(
          (x) =>
            `<rect x="${x - 13}" y="-66" width="26" height="44" rx="6" fill="#ff9800" ${st(4)}/>` +
            `<path d="M${x - 13} -30 H${x + 13}" stroke="#e65100" stroke-width="5"/>`,
        )
        .join('') +
      `<rect x="-58" y="-56" width="12" height="12" fill="#43a047" ${st(2)} transform="rotate(10 -52 -50)"/>`,
  },
  {
    id: 'sirko_kotyky',
    slot: 'feet',
    name: 'Шкарпетки-котики на 4 лапи',
    price: 20,
    draw: () =>
      [-48, -20, 32, 56]
        .map((x, i) => {
          const c = ['#ffb74d', '#bdbdbd', '#ffb74d', '#bdbdbd'][i];
          return (
            `<rect x="${x - 12}" y="-40" width="24" height="44" rx="9" fill="${c}" ${st(4)}/>` +
            `<path d="M${x - 12} -32 H${x + 12}" stroke="#fff" stroke-width="5"/>` +
            `<path d="M${x - 10} -14 L${x - 8} -24 L${x - 2} -17 M${x + 10} -14 L${x + 8} -24 L${x + 2} -17" fill="${c}" ${st(2)}/>` +
            `<circle cx="${x - 4}" cy="-10" r="1.8" fill="${INK}"/><circle cx="${x + 4}" cy="-10" r="1.8" fill="${INK}"/>` +
            `<path d="M${x - 1} -6 h2" stroke="#ec407a" stroke-width="3" stroke-linecap="round"/>` +
            `<path d="M${x - 4} -5 l-7 -1 M${x - 4} -3 l-7 2 M${x + 4} -5 l7 -1 M${x + 4} -3 l7 2" stroke="${INK}" stroke-width="1.2"/>`
          );
        })
        .join(''),
  },

  // ================= the girls (Сірко's bride, the granddaughter, the princess: one drawing)
  // blouse -52..52, y -236..-165, hands at ±30,-176; the dress -80..80 down to -6
  {
    id: 'nevista_yedynorih',
    slot: 'torso',
    name: 'Кофтинка-єдиноріг',
    price: 20,
    draw: () =>
      `<path d="M-56 -240 Q-68 -200 -62 -160 L62 -160 Q68 -200 56 -240 Q0 -256 -56 -240 Z" fill="#f3e5f5" ${stroke}/>` +
      ['#e53935', '#ff9800', '#fdd835', '#43a047', '#1e88e5'].map((c, i) => `<path d="M${-40 + i * 4} -168 Q0 ${-226 + i * 8} ${40 - i * 4} -168" stroke="${c}" stroke-width="5" fill="none"/>`).join('') +
      // the unicorn's head and horn
      `<ellipse cx="0" cy="-196" rx="13" ry="11" fill="#fff" ${st(3)}/>` +
      `<path d="M-4 -206 L2 -228 L6 -205 Z" fill="#ffd54f" ${st(2)}/>` +
      `<circle cx="-4" cy="-197" r="2" fill="${INK}"/><circle cx="5" cy="-197" r="2" fill="${INK}"/>` +
      star(-40, -220, 6, '#fff59d', 2) +
      star(42, -214, 6, '#fff59d', 2) +
      hand(-30, -176, 12, '#f2c4a0') +
      hand(30, -176, 12, '#f2c4a0'),
  },
  {
    id: 'nevista_veselka',
    slot: 'legs',
    name: 'Спідниця-веселка',
    price: 20,
    draw: () => {
      const cs = ['#e53935', '#ff9800', '#fdd835', '#43a047', '#1e88e5', '#8e24aa'];
      const top = -174;
      const bot = -4;
      const w = (y: number) => 60 + ((y - top) / (bot - top)) * 30;
      const h = (bot - top) / cs.length;
      return (
        cs
          .map((c, i) => {
            const y0 = top + i * h;
            const y1 = y0 + h;
            return `<path d="M${-w(y0)} ${y0} L${w(y0)} ${y0} L${w(y1)} ${y1} L${-w(y1)} ${y1} Z" fill="${c}"/>`;
          })
          .join('') + `<path d="M-60 ${top} L60 ${top} L90 ${bot} L-90 ${bot} Z" fill="none" ${stroke}/>`
      );
    },
  },
  {
    id: 'nevista_kryshtalevi',
    slot: 'feet',
    name: 'Кришталеві черевички',
    price: 25,
    draw: () =>
      `<g transform="scale(1.3)">` +
      mirror(
        `<path d="M-46 4 Q-48 -14 -30 -14 Q-12 -14 -10 -6 L-6 4 Z" fill="#b3e5fc" fill-opacity=".85" ${st(4)}/>` +
                    `<path d="M-38 -8 l6 -4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` +
          star(-26, -16, 6, '#fff59d', 2),
      ) +
      `</g>`,
  },
  {
    id: 'vnuchka_kavun',
    slot: 'torso',
    name: 'Кофтинка-кавунчик',
    price: 15,
    draw: () =>
      `<path d="M-56 -240 Q-68 -200 -62 -160 L62 -160 Q68 -200 56 -240 Q0 -256 -56 -240 Z" fill="#ef5350" ${stroke}/>` +
      `<path d="M-60 -168 H60" stroke="#fff" stroke-width="8"/><path d="M-62 -162 H62" stroke="#43a047" stroke-width="10"/>` +
      `<path d="M-62 -160 L62 -160" ${st(4)}/>` +
      [
        [-34, -220],
        [-14, -206],
        [10, -222],
        [30, -204],
        [-28, -190],
        [44, -226],
        [0, -188],
      ]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.5" ry="6" fill="#212121"/>`)
        .join('') +
      hand(-30, -176, 12, '#f2c4a0') +
      hand(30, -176, 12, '#f2c4a0'),
  },
  {
    id: 'vnuchka_romashka',
    slot: 'legs',
    name: 'Спідниця-ромашка',
    price: 15,
    draw: () =>
      `<path d="M-62 -174 L62 -174 L88 -40 L-88 -40 Z" fill="#fdd835" ${stroke}/>` +
      Array.from({ length: 9 }, (_, i) => {
        const x = -80 + i * 20;
        return `<path d="M${x - 10} -46 Q${x - 12} 0 ${x} 0 Q${x + 12} 0 ${x + 10} -46 Z" fill="#fff" ${st(3)}/>`;
      }).join('') +
      [
        [-30, -140],
        [20, -120],
        [-10, -80],
        [44, -70],
        [-50, -66],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#ff8f00"/>`)
        .join(''),
  },
  {
    id: 'vnuchka_zhabky',
    slot: 'feet',
    name: 'Гумаки-жабки',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-48 4 Q-50 -22 -28 -22 Q-6 -22 -6 4 Z" fill="#66bb6a" ${st(4)}/>` +
          `<circle cx="-36" cy="-22" r="7" fill="#fff" ${st(3)}/><circle cx="-20" cy="-22" r="7" fill="#fff" ${st(3)}/>` +
          `<circle cx="-35" cy="-22" r="3" fill="#212121"/><circle cx="-19" cy="-22" r="3" fill="#212121"/>` +
          `<path d="M-38 -8 Q-28 0 -16 -8" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'knyazivna_laty',
    slot: 'torso',
    name: 'Лицарські лати',
    price: 25,
    draw: () =>
      `<path d="M-58 -242 Q-70 -200 -64 -158 L64 -158 Q70 -200 58 -242 Q0 -258 -58 -242 Z" fill="#b0bec5" ${stroke}/>` +
      `<path d="M-74 -244 Q-86 -226 -70 -214 Q-56 -226 -46 -246 Z M74 -244 Q86 -226 70 -214 Q56 -226 46 -246 Z" fill="#90a4ae" ${st(4)}/>` +
      `<path d="M0 -246 V-160 M-44 -220 Q0 -200 44 -220" stroke="#78909c" stroke-width="4" fill="none"/>` +
      `<path d="M-30 -236 Q-20 -244 -8 -240" stroke="#eceff1" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      // a pink heart on the breastplate
      `<path d="M0 -172 C-20 -186 -16 -204 0 -194 C16 -204 20 -186 0 -172 Z" fill="#ec407a" ${st(3)}/>` +
      hand(-30, -176, 12, '#f2c4a0') +
      hand(30, -176, 12, '#f2c4a0'),
  },
  {
    id: 'knyazivna_dzvin',
    slot: 'legs',
    name: 'Спідниця-дзвін',
    price: 20,
    draw: () =>
      `<path d="M-62 -174 Q-106 -60 -98 -4 L98 -4 Q106 -60 62 -174 Z" fill="#f06292" ${stroke}/>` +
      `<path d="M-98 -18 Q0 0 98 -18" stroke="#fff" stroke-width="8" fill="none"/>` +
      [
        [-40, -130],
        [24, -140],
        [-60, -70],
        [0, -90],
        [56, -60],
        [-20, -40],
        [36, -100],
      ]
        .map(([x, y]) => `<path d="M${x} ${y + 8} C${x - 12} ${y} ${x - 9} ${y - 10} ${x} ${y - 4} C${x + 9} ${y - 10} ${x + 12} ${y} ${x} ${y + 8} Z" fill="#fff59d" ${st(2)}/>`)
        .join(''),
  },
  {
    id: 'knyazivna_metelyky',
    slot: 'feet',
    name: 'Балетки-метелики',
    price: 20,
    draw: () =>
      `<g transform="scale(1.25)">` +
      mirror(
        `<path d="M-48 4 Q-50 -12 -28 -12 Q-6 -12 -6 4 Z" fill="#f8bbd0" ${st(4)}/>` +
          `<path d="M-27 -12 L-40 -24 Q-44 -12 -27 -12 Z M-27 -12 L-14 -24 Q-10 -12 -27 -12 Z" fill="#ab47bc" ${st(2)}/>` +
          `<path d="M-27 -12 L-38 -4 Q-34 -12 -27 -12 Z M-27 -12 L-16 -4 Q-20 -12 -27 -12 Z" fill="#fdd835" ${st(2)}/>` +
          `<path d="M-27 -14 l-3 -6 M-27 -14 l3 -6" stroke="${INK}" stroke-width="1.5"/>`,
      ) +
      `</g>`,
  },

  // =====================================================================
  // ROUND 2: more clothes (3 of each kind for every hero of the group)
  // =====================================================================

  // ---------- knyaz
  {
    id: 'knyaz_monety',
    slot: 'torso',
    name: 'Кафтан із золотих монет',
    price: 30,
    draw: () => {
      const half = (y: number) => 66 + ((y + 262) / 202) * 14;
      let coins = '';
      let row = 0;
      for (let y = -250; y <= -70; y += 18, row++)
        for (let x = -80 + (row % 2) * 10; x <= 80; x += 20) if (Math.abs(x) < half(y)) coins += `<circle cx="${x}" cy="${y}" r="10" fill="#ffd54f" ${st(2)}/><circle cx="${x - 3}" cy="${y - 3}" r="2.5" fill="#fff8e1"/>`;
      return (
        `<path d="M-74 -266 Q-96 -170 -88 -56 L88 -56 Q96 -170 74 -266 Q0 -286 -74 -266 Z" fill="#ffb300" ${stroke}/>` +
        `<g>${coins}</g>` +
        `<path d="M-74 -266 Q-96 -170 -88 -56 L88 -56 Q96 -170 74 -266" fill="none" ${stroke}/>` +
        band('M-66 -256 Q-104 -210 -96 -158', 26, '#ffb300') +
        band('M66 -256 Q104 -210 96 -158', 26, '#ffb300') +
        `<path d="M-70 -246 Q-100 -210 -96 -166 M70 -246 Q100 -210 96 -166" fill="none" stroke="#ffd54f" stroke-width="12" stroke-dasharray="0.1 18" stroke-linecap="round"/>` +
        hand(-96, -140, 15, '#f2c4a0') +
        hand(96, -140, 15, '#f2c4a0')
      );
    },
  },
  {
    id: 'knyaz_tyhr',
    slot: 'legs',
    name: 'Лосини-тигр',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-46 -66 L-46 -16 L-5 -16 L-3 -66 Z" fill="#ff9800" ${st(4)}/>` +
          `<path d="M-46 -54 q10 5 16 -2 M-46 -38 q12 5 18 -2 M-46 -24 q10 5 14 -2 M-5 -46 q-10 5 -16 -2 M-5 -30 q-10 5 -14 -2" stroke="#212121" stroke-width="5" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'knyaz_shakhy',
    slot: 'legs',
    name: 'Штани-шахівниця',
    price: 15,
    draw: () => {
      let sq = '';
      for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) sq += `<rect x="${-46 + i * 10.5}" y="${-66 + j * 10}" width="10.5" height="10" fill="${(i + j) % 2 ? '#fff' : '#212121'}"/>`;
      return mirror(sq + `<rect x="-46" y="-66" width="42" height="50" fill="none" ${st(4)}/>`);
    },
  },
  {
    id: 'knyaz_kaptsi',
    slot: 'feet',
    name: 'Капці з коронками',
    price: 15,
    draw: () =>
      mirror(
        `<ellipse cx="-32" cy="-6" rx="28" ry="13" fill="#7b1fa2" ${st(4)}/>` +
          `<path d="M-58 -2 Q-32 8 -6 -2" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>` +
          `<path d="M-58 -2 Q-32 8 -6 -2" stroke="#212121" stroke-width="2" fill="none" stroke-dasharray="1 9" stroke-linecap="round"/>` +
          `<path d="M-44 -14 L-47 -32 L-38 -23 L-32 -36 L-26 -23 L-17 -32 L-20 -14 Z" fill="#ffd54f" ${st(2.5)}/>` +
          `<circle cx="-32" cy="-20" r="2.5" fill="#e53935"/>`,
      ),
  },
  {
    id: 'knyaz_skryni',
    slot: 'feet',
    name: 'Черевики-скрині зі скарбом',
    price: 25,
    draw: () =>
      `<g transform="scale(1 .8)">` +
      mirror(
        `<path d="M-58 -28 L-54 -44 L-12 -44 L-8 -28 Z" fill="#6d4c41" ${st(3)}/>` +
          [-48, -36, -24, -42, -30].map((x, i) => `<circle cx="${x}" cy="${i < 3 ? -28 : -34}" r="6" fill="#ffd54f" ${st(2)}/>`).join('') +
          `<path d="M-46 -40 l3 -6 M-20 -40 l3 -6" stroke="#fff59d" stroke-width="2" stroke-linecap="round"/>` +
          `<rect x="-58" y="-26" width="50" height="29" rx="4" fill="#8d6e63" ${stroke}/>` +
          `<path d="M-48 -26 V3 M-18 -26 V3" stroke="#ffc107" stroke-width="5"/>` +
          `<rect x="-37" y="-18" width="8" height="10" rx="2" fill="#ffc107" ${st(2)}/>`,
      ) +
      `</g>`,
  },

  // ---------- koval (his clothes go over the shirt and the apron; his arms over them)
  {
    id: 'koval_tazyk',
    slot: 'torso',
    name: 'Лати з тазика',
    price: 20,
    draw: () =>
      `<path d="M-70 -264 Q-90 -180 -80 -112 L-62 -54 L62 -54 L80 -112 Q90 -180 70 -264 Q0 -284 -70 -264 Z" fill="#6d4c41" ${stroke}/>` +
      `<path d="M-64 -258 L60 -96 M64 -258 L-60 -96" stroke="#3e2723" stroke-width="10"/>` +
      `<ellipse cx="0" cy="-168" rx="66" ry="78" fill="#b0bec5" ${stroke}/>` +
      `<ellipse cx="0" cy="-168" rx="50" ry="62" fill="#cfd8dc" ${st(3)}/>` +
      `<path d="M-30 -210 q10 -12 26 -14" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M20 -140 q8 4 6 14 M-26 -130 q-6 8 0 14" stroke="#78909c" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      [0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${(Math.cos((a * Math.PI) / 180) * 58).toFixed(0)}" cy="${(-168 + Math.sin((a * Math.PI) / 180) * 70).toFixed(0)}" r="4" fill="#546e7a"/>`).join('') +
      `<rect x="-62" y="-80" width="124" height="20" rx="6" fill="#78909c" ${st(4)}/>`,
  },
  {
    id: 'koval_iskry',
    slot: 'torso',
    name: 'Сорочка з іскрами',
    price: 15,
    draw: () => {
      const burst = (x: number, y: number, c: string) =>
        `<path d="${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `M${x} ${y} l${(Math.cos((a * Math.PI) / 180) * 14).toFixed(1)} ${(Math.sin((a * Math.PI) / 180) * 14).toFixed(1)}`).join(' ')}" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="4" fill="#fff59d"/>`;
      return (
        `<path d="M-70 -264 Q-90 -180 -80 -112 L-62 -54 L62 -54 L80 -112 Q90 -180 70 -264 Q0 -284 -70 -264 Z" fill="#1a237e" ${stroke}/>` +
        burst(-40, -220, '#ffeb3b') +
        burst(42, -196, '#ff7043') +
        burst(-30, -140, '#ff7043') +
        burst(36, -116, '#ffeb3b') +
        burst(-8, -84, '#ffca28') +
        star(10, -168, 7, '#fff59d', 2) +
        star(-56, -100, 6, '#ffeb3b', 2) +
        star(56, -238, 6, '#ffeb3b', 2)
      );
    },
  },
  {
    id: 'koval_zaklepky',
    slot: 'legs',
    name: 'Залізні штани в заклепках',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-58 -62 L-56 -14 L-6 -14 L-4 -62 Z" fill="#78909c" ${st(4)}/>` +
          `<path d="M-57 -40 H-5" stroke="#546e7a" stroke-width="4"/>` +
          [
            [-48, -54],
            [-12, -54],
            [-48, -32],
            [-12, -32],
            [-48, -22],
            [-12, -22],
          ]
            .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#cfd8dc" ${st(1.5)}/>`)
            .join('') +
          `<path d="M-38 -58 q4 8 0 14" stroke="#eceff1" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'koval_tsviashky',
    slot: 'legs',
    name: 'Шорти в цвяшки',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-40 -40 L-41 -14 L-11 -14 L-10 -40 Z" fill="#e0b090" ${st(4)}/>` +
          `<path d="M-34 -30 l3 -5 M-22 -26 l3 -5" stroke="#6d4c41" stroke-width="2.5" stroke-linecap="round"/>`,
      ) +
      `<path d="M-58 -62 L-66 -26 L-4 -26 L0 -44 L4 -26 L66 -26 L58 -62 Z" fill="#fdd835" ${stroke}/>` +
      [
        [-48, -50, 30],
        [-32, -40, -20],
        [-16, -52, 10],
        [16, -50, -30],
        [32, -40, 20],
        [48, -52, -10],
      ]
        .map(
          ([x, y, a]) =>
            `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -6 V7" stroke="#607d8b" stroke-width="3" stroke-linecap="round"/><path d="M-4 -6 H4" stroke="#455a64" stroke-width="3.5" stroke-linecap="round"/></g>`,
        )
        .join(''),
  },
  {
    id: 'koval_prasky',
    slot: 'feet',
    name: 'Черевики-праски',
    price: 20,
    draw: () =>
      mirror(
        `<circle cx="-62" cy="-30" r="4" fill="#eceff1" ${st(1.5)}/><circle cx="-70" cy="-38" r="5" fill="#eceff1" ${st(1.5)}/>` +
          `<path d="M-42 -22 Q-40 -33 -26 -33 Q-14 -33 -12 -22" stroke="${INK}" stroke-width="8" fill="none"/>` +
          `<path d="M-42 -22 Q-40 -33 -26 -33 Q-14 -33 -12 -22" stroke="#212121" stroke-width="3" fill="none"/>` +
          `<path d="M-64 -2 L-50 -24 L-6 -24 L-6 -2 Z" fill="#455a64" ${stroke}/>` +
          `<rect x="-66" y="-4" width="62" height="7" rx="3" fill="#cfd8dc" ${st(3)}/>` +
          `<circle cx="-22" cy="-14" r="4" fill="#ff7043" ${st(1.5)}/>`,
      ),
  },
  {
    id: 'koval_mahnity',
    slot: 'feet',
    name: 'Чоботи-магніти',
    price: 15,
    draw: () =>
      mirror(
        [
          [-56, -26, -70, -34],
          [-60, -10, -74, -12],
          [-36, -32, -40, -46],
          [-16, -32, -12, -46],
        ]
          .map(([x0, y0, x1, y1]) => `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="#90a4ae" stroke-width="3.5" stroke-linecap="round"/><circle cx="${x1}" cy="${y1}" r="3.5" fill="#cfd8dc" ${st(1.5)}/>`)
          .join('') +
          `<path d="M-52 -32 L-52 -16 Q-60 -14 -60 0 L-8 0 L-8 -32 Z" fill="#e53935" ${stroke}/>` +
          `<rect x="-62" y="-4" width="56" height="8" rx="3" fill="#cfd8dc" ${st(3)}/>` +
          `<rect x="-52" y="-32" width="44" height="9" fill="#eceff1" ${st(2)}/>`,
      ),
  },
  {
    id: 'koval_iskrysti',
    slot: 'feet',
    name: 'Підковані чоботи з іскрами',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-52 -30 L-52 -16 Q-60 -14 -60 -2 L-8 -2 L-8 -30 Z" fill="#5d4037" ${stroke}/>` +
          `<path d="M-56 4 Q-56 -4 -34 -4 Q-10 -4 -10 4" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
          `<path d="M-56 4 Q-56 -4 -34 -4 Q-10 -4 -10 4" stroke="#cfd8dc" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          star(-64, 2, 7, '#ffeb3b', 2) +
          star(-46, 12, 5, '#ff9800', 1.5) +
          star(-22, 12, 6, '#ffeb3b', 2) +
          `<path d="M-52 -24 H-8" stroke="#ffb300" stroke-width="4"/>`,
      ),
  },

  // ---------- telesyk
  {
    id: 'telesyk_klen',
    slot: 'torso',
    name: 'Костюм кленового листя',
    price: 20,
    draw: () =>
      `<path d="M-46 -158 Q-60 -110 -50 -58 L50 -58 Q60 -110 46 -158 Q0 -172 -46 -158 Z" fill="#e65100" ${stroke}/>` +
      [
        [-26, -140, '#e53935', 14],
        [22, -142, '#fdd835', 16],
        [0, -112, '#ff9800', 18],
        [-30, -88, '#fdd835', 15],
        [30, -86, '#e53935', 15],
        [0, -72, '#c62828', 12],
      ]
        .map(([x, y, c, r]) => maple(x as number, y as number, r as number, c as string))
        .join('') +
      band('M-36 -146 Q-60 -116 -50 -94', 18, '#ff9800') +
      band('M36 -146 Q60 -116 50 -94', 18, '#ff9800') +
      maple(-56, -124, 9, '#e53935') +
      maple(56, -124, 9, '#fdd835') +
      hand(-50, -86, 10, '#f2c4a0') +
      hand(50, -86, 10, '#f2c4a0'),
  },
  {
    id: 'telesyk_husak',
    slot: 'torso',
    name: 'Костюм гусака',
    price: 20,
    draw: () =>
      `<path d="M-46 -158 Q-62 -110 -50 -56 Q0 -42 50 -56 Q62 -110 46 -158 Q0 -172 -46 -158 Z" fill="#fafafa" ${stroke}/>` +
      `<path d="M-40 -70 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8" stroke="#bdbdbd" stroke-width="3" fill="none"/>` +
      // a little goose looks out of the pocket
      `<path d="M-6 -112 Q-10 -140 4 -142" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-6 -112 Q-10 -140 4 -142" stroke="#fafafa" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<circle cx="6" cy="-144" r="8" fill="#fafafa" ${st(3)}/><path d="M13 -146 l10 2 l-10 4 Z" fill="#ff9800" ${st(2)}/><circle cx="7" cy="-146" r="1.8" fill="${INK}"/>` +
      `<rect x="-22" y="-114" width="40" height="28" rx="6" fill="#64b5f6" ${st(3)}/>` +
      band('M-36 -146 Q-60 -116 -50 -94', 20, '#fafafa') +
      band('M36 -146 Q60 -116 50 -94', 20, '#fafafa') +
      mirror(`<path d="M-60 -104 l-10 2 l7 5 l-8 5 l12 2" fill="#fafafa" ${st(3)}/>`) +
      hand(-50, -86, 10, '#ff9800') +
      hand(50, -86, 10, '#ff9800'),
  },
  {
    id: 'telesyk_lymonchyky',
    slot: 'legs',
    name: 'Шорти-лимончики',
    price: 10,
    draw: () =>
      mirror(`<path d="M-26 -48 L-26 -12 L-3 -12 L-3 -48 Z" fill="#f2c4a0" ${st(4)}/>`) +
      mirror(`<path d="M-29 -76 L-32 -44 L-1 -44 L-1 -76 Z" fill="#fff176" ${st(4)}/>`) +
      [
        [-18, -58],
        [14, -64],
        [16, -52],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#fdd835" ${st(2)}/><path d="M${x - 4} ${y} h8 M${x} ${y - 4} v8 M${x - 3} ${y - 3} l6 6 M${x + 3} ${y - 3} l-6 6" stroke="#fff8c4" stroke-width="1.5"/>`)
        .join(''),
  },
  {
    id: 'telesyk_zhyrafy',
    slot: 'legs',
    name: 'Штани-жирафи',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-28 -74 L-30 -12 L-1 -12 L-1 -74 Z" fill="#ffd54f" ${st(4)}/>` +
          `<path d="M-24 -62 l8 -3 l4 6 l-6 5 l-7 -2 Z M-12 -44 l9 -2 l2 7 l-7 4 l-6 -4 Z M-26 -30 l7 -2 l4 6 l-5 5 l-7 -3 Z M-14 -20 l7 0 l1 5 l-8 1 Z" fill="#8d6e63"/>`,
      ),
  },
  {
    id: 'telesyk_krokodyly',
    slot: 'feet',
    name: 'Капці-крокодили',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-1 4 Q-1 -16 -18 -16 Q-36 -16 -44 -6 L-46 4 Z" fill="#43a047" ${st(4)}/>` +
          `<circle cx="-24" cy="-17" r="5" fill="#66bb6a" ${st(3)}/><circle cx="-12" cy="-17" r="5" fill="#66bb6a" ${st(3)}/>` +
          `<circle cx="-24" cy="-18" r="2" fill="${INK}"/><circle cx="-12" cy="-18" r="2" fill="${INK}"/>` +
          `<path d="M-44 -1 l4 4 l4 -4 l4 4 l4 -4 l4 4" stroke="#fff" stroke-width="2.5" fill="none" stroke-linejoin="round"/>` +
          `<circle cx="-40" cy="-9" r="1.5" fill="${INK}"/>`,
      ),
  },
  {
    id: 'telesyk_paroplavy',
    slot: 'feet',
    name: 'Черевики-пароплави',
    price: 20,
    draw: () =>
      mirror(
        `<circle cx="-12" cy="-40" r="4" fill="#eceff1" ${st(2)}/><circle cx="-6" cy="-50" r="5" fill="#eceff1" ${st(2)}/>` +
          `<rect x="-21" y="-30" width="9" height="16" fill="#e53935" ${st(3)}/><rect x="-21" y="-30" width="9" height="4" fill="#212121"/>` +
          `<path d="M-34 -14 L-29 4 L1 4 L5 -14 Z" fill="#1e88e5" ${st(4)}/>` +
          `<path d="M-33 -10 H4" stroke="#fff" stroke-width="3"/>` +
          `<circle cx="-22" cy="-3" r="3" fill="#fff" ${st(1.5)}/><circle cx="-10" cy="-3" r="3" fill="#fff" ${st(1.5)}/>`,
      ),
  },

  // ---------- zmiyuchka (neck -30,-110 → -56,-200 → -30,-260)
  {
    id: 'zmiyuchka_plashch',
    slot: 'torso',
    name: 'Відьмин плащ з кажанами',
    price: 20,
    draw: () => {
      const bat = (x: number, y: number) =>
        `<path d="M${x} ${y} q-6 -8 -16 -6 q4 4 2 8 q6 -2 6 4 Z M${x} ${y} q6 -8 16 -6 q-4 4 -2 8 q-6 -2 -6 4 Z" fill="#212121"/><circle cx="${x}" cy="${y}" r="4" fill="#212121"/>`;
      return (
        band('M-26 -86 Q-56 -200 -30 -256', 64, '#4a148c', 'butt') +
        bat(-36, -130) +
        bat(-28, -200) +
        `<path d="M-50 -170 a8 8 0 1 0 10 10 a6 6 0 1 1 -10 -10 Z" fill="#fdd835"/>` +
        star(-10, -150, 6, '#fdd835', 1.5) +
        star(-50, -226, 5, '#fdd835', 1.5) +
        `<ellipse cx="-27" cy="-88" rx="40" ry="14" fill="#6a1b9a" ${stroke}/>` +
        `<path d="M-84 -244 L-62 -232 L-56 -256 L-40 -232 L-30 -258 L-18 -232 L-4 -254 L2 -230 L22 -244 L10 -222 L-74 -222 Z" fill="#7b1fa2" ${st(3)}/>`
      );
    },
  },
  {
    id: 'zmiyuchka_mushli',
    slot: 'torso',
    name: 'Светр із мушлями',
    price: 20,
    draw: () => {
      const shell = (x: number, y: number, c: string) =>
        `<path d="M${x - 11} ${y + 6} Q${x - 12} ${y - 10} ${x} ${y - 11} Q${x + 12} ${y - 10} ${x + 11} ${y + 6} Z" fill="${c}" ${st(2.5)}/>` +
        `<path d="M${x} ${y + 6} V${y - 9} M${x - 6} ${y + 6} L${x - 4} ${y - 8} M${x + 6} ${y + 6} L${x + 4} ${y - 8}" stroke="#fff" stroke-width="1.8"/>`;
      return (
        band('M-26 -86 Q-56 -200 -30 -256', 64, '#26a69a', 'butt') +
        `<path d="M-26 -86 Q-56 -200 -30 -256" fill="none" stroke="#80cbc4" stroke-width="64" stroke-dasharray="4 18"/>` +
        shell(-40, -140, '#f8bbd0') +
        shell(-22, -196, '#ffcc80') +
        shell(-36, -232, '#fff59d') +
        star(-20, -110, 11, '#ff7043', 2.5) +
        star(-50, -176, 8, '#ffca28', 2) +
        `<ellipse cx="-27" cy="-88" rx="40" ry="14" fill="#00897b" ${stroke}/>`
      );
    },
  },
  {
    id: 'zmiyuchka_kapusta',
    slot: 'legs',
    name: 'Спідниця з капусти',
    price: 15,
    draw: () =>
      [0.05, 0.95, 0.2, 0.8, 0.35, 0.65, 0.5]
        .map((f) => {
          const a = Math.PI * f;
          const x = Math.cos(a) * 92;
          const y = -80 + Math.sin(a) * 30;
          const r = (Math.atan2(Math.sin(a) * 30, Math.cos(a) * 92) * 180) / Math.PI - 90;
          return (
            `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(0)})">` +
            `<path d="M0 -6 Q-30 6 -24 34 Q0 50 24 34 Q30 6 0 -6 Z" fill="${f === 0.5 ? '#c5e1a5' : '#aed581'}" ${st(3)}/>` +
            `<path d="M0 -2 V38 M0 14 l-12 10 M0 14 l12 10" stroke="#e8f5e9" stroke-width="3" fill="none" stroke-linecap="round"/></g>`
          );
        })
        .join(''),
  },
  {
    id: 'zmiyuchka_bublyky',
    slot: 'legs',
    name: 'Пояс-бублики',
    price: 15,
    draw: () => {
      let b = `<path d="M-100 -40 Q20 30 140 -40" stroke="#8d6e63" stroke-width="4" fill="none"/>`;
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const x = -100 + 240 * t;
        const y = -40 * (1 - t) * (1 - t) + 2 * t * (1 - t) * 30 - 40 * t * t;
        b += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="14" fill="#d7a35a" ${st(3)}/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" fill="#689f38" ${st(2)}/>`;
        b += `<path d="M${(x - 8).toFixed(0)} ${(y - 6).toFixed(0)} l2 1 M${(x + 6).toFixed(0)} ${(y - 8).toFixed(0)} l1 2 M${(x + 7).toFixed(0)} ${(y + 6).toFixed(0)} l-2 1" stroke="#fff" stroke-width="2"/>`;
      }
      return b;
    },
  },
  {
    id: 'zmiyuchka_kylym',
    slot: 'feet',
    name: 'Килим-літак',
    price: 25,
    draw: () =>
      `<path d="M-150 -2 Q-120 -10 -90 -2 Q-60 6 -30 -2 Q0 -10 30 -2 Q60 6 90 -2 Q120 -10 150 -2 L170 16 Q140 8 110 16 Q80 24 50 16 Q20 8 -10 16 Q-40 24 -70 16 Q-100 8 -130 16 Z" fill="#c62828" ${stroke}/>` +
      `<path d="M-140 3 Q-120 -3 -90 4 Q-60 11 -30 4 Q0 -3 30 4 Q60 11 90 4 Q120 -3 152 4" stroke="#fdd835" stroke-width="4" fill="none" stroke-dasharray="8 6"/>` +
      `<path d="M-150 -2 l-10 -4 M-148 2 l-12 0 M-140 14 l-10 6 M-132 16 l-8 8 M170 16 l10 4 M168 12 l12 0" stroke="#fdd835" stroke-width="4" stroke-linecap="round"/>` +
      star(-40, 8, 6, '#fdd835', 2) +
      star(40, 8, 6, '#fdd835', 2) +
      `<path d="M-190 0 h-20 M-186 14 h-30" stroke="#90a4ae" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'zmiyuchka_sanchata',
    slot: 'feet',
    name: 'Санчата',
    price: 15,
    draw: () =>
      `<path d="M-120 -2 V16 M-50 -2 V16 M30 -2 V16 M110 -2 V16" stroke="${INK}" stroke-width="6"/>` +
      `<path d="M-136 16 H140 Q168 16 164 -10" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M-136 16 H140 Q168 16 164 -10" stroke="#ff7043" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<rect x="-136" y="-8" width="276" height="12" rx="4" fill="#a1887f" ${st(4)}/>` +
      `<path d="M-90 -8 v12 M-40 -8 v12 M10 -8 v12 M60 -8 v12 M110 -8 v12" stroke="#6d4c41" stroke-width="3"/>` +
      `<path d="M164 -10 Q190 -30 200 -6" stroke="#fdd835" stroke-width="4" fill="none"/>`,
  },

  // ---------- olenka (neck -10,-40 → -30,-120 → -14,-170; a coil at y -26)
  {
    id: 'olenka_troiandy',
    slot: 'torso',
    name: 'Сукня з трояндами',
    price: 20,
    draw: () => {
      const rose = (x: number, y: number) =>
        `<path d="M${x - 10} ${y + 4} q-6 -10 4 -10 M${x + 10} ${y + 4} q6 -10 -4 -10" fill="#43a047" stroke="#2e7d32" stroke-width="3"/>` +
        `<circle cx="${x}" cy="${y}" r="9" fill="#e53935" ${st(2)}/><path d="M${x} ${y} m0 -2 a2 2 0 1 1 -2 2 a5 5 0 1 1 5 5" stroke="#b71c1c" stroke-width="2" fill="none"/>`;
      return (
        band('M-9 -30 Q-30 -120 -14 -166', 42, '#f8bbd0', 'butt') +
        rose(-12, -60) +
        rose(-24, -100) +
        rose(-20, -142) +
        ruffle(-9, -32, 34, 11, 10, 0.18, '#f48fb1', 3)
      );
    },
  },
  {
    id: 'olenka_tort',
    slot: 'torso',
    name: 'Сукенка-торт',
    price: 20,
    draw: () => {
      const tier = (x: number, y: number, w: number, h: number, c: string, ice: string) =>
        `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="9" fill="${c}" ${stroke}/>` +
        `<path d="M${x - w / 2 + 3} ${y + 4} ${Array.from({ length: Math.floor((w - 6) / 12) }, (_, i) => `q3 ${i % 2 ? 8 : 12} 6 0 q3 -3 6 0`).join(' ')}" stroke="${ice}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      return (
        tier(-12, -72, 88, 40, '#f8bbd0', '#fff') +
        tier(-18, -106, 68, 36, '#fff3e0', '#f06292') +
        tier(-22, -136, 50, 32, '#ce93d8', '#fff') +
        [
          [-46, -46],
          [-12, -44],
          [22, -46],
          [-36, -84],
          [0, -84],
          [-30, -114],
          [-12, -114],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e53935" ${st(2)}/>`)
          .join('')
      );
    },
  },
  {
    id: 'olenka_tsukerky',
    slot: 'legs',
    name: 'Спідниця з цукерок',
    price: 15,
    draw: () => {
      const cs = ['#e53935', '#43a047', '#1e88e5', '#fdd835', '#ab47bc', '#ff7043', '#26c6da'];
      let out = `<path d="M-74 -32 Q10 4 94 -32" stroke="#f06292" stroke-width="6" fill="none"/>`;
      cs.forEach((c, i) => {
        const a = Math.PI * (0.1 + (i / 6) * 0.8);
        const x = 10 - Math.cos(a) * 84;
        const y = -30 + Math.sin(a) * 18;
        out +=
          `<g transform="translate(${x.toFixed(1)} ${(y + 8).toFixed(1)})">` +
          `<path d="M-10 0 L-20 -7 L-20 7 Z M10 0 L20 -7 L20 7 Z" fill="${c}" ${st(2)}/>` +
          `<ellipse cx="0" cy="0" rx="11" ry="8" fill="${c}" ${st(3)}/>` +
          `<path d="M-5 -3 q3 -3 6 -2" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
      });
      return out;
    },
  },
  {
    id: 'olenka_kulky',
    slot: 'legs',
    name: 'Спідниця з повітряних кульок',
    price: 15,
    draw: () => {
      const cs = ['#e53935', '#fdd835', '#43a047', '#1e88e5', '#ab47bc', '#ff7043', '#ec407a'];
      let strings = '';
      let balls = '';
      cs.forEach((c, i) => {
        const a = Math.PI * (0.08 + (i / 6) * 0.84);
        const x = 10 - Math.cos(a) * 92;
        const y = -52 + Math.sin(a) * 12;
        strings += `<path d="M10 -30 Q${((x + 10) / 2).toFixed(0)} -10 ${x.toFixed(0)} ${(y + 14).toFixed(0)}" stroke="${INK}" stroke-width="1.5" fill="none"/>`;
        balls +=
          `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="13" ry="16" fill="${c}" ${st(3)}/>` +
          `<path d="M${(x - 3).toFixed(0)} ${(y + 15).toFixed(0)} l3 4 l3 -4 Z" fill="${c}" ${st(1.5)}/>` +
          `<ellipse cx="${(x - 5).toFixed(0)}" cy="${(y - 6).toFixed(0)}" rx="3" ry="5" fill="#fff" opacity=".7"/>`;
      });
      return `<path d="M-74 -30 Q10 -6 94 -30" stroke="#f06292" stroke-width="6" fill="none"/>` + strings + balls;
    },
  },
  {
    id: 'olenka_sonechka',
    slot: 'feet',
    name: 'Черевички-сонечка',
    price: 15,
    draw: () =>
      [-40, 60]
        .map(
          (x) =>
            `<circle cx="${x - 22}" cy="-4" r="8" fill="#212121" ${st(3)}/>` +
            `<circle cx="${x - 25}" cy="-6" r="2" fill="#fff"/><circle cx="${x - 19}" cy="-6" r="2" fill="#fff"/>` +
            `<path d="M${x - 24} -11 l-4 -8 M${x - 20} -11 l2 -8" stroke="${INK}" stroke-width="2"/>` +
            `<path d="M${x - 18} 5 Q${x - 20} -18 ${x + 2} -18 Q${x + 24} -18 ${x + 22} 5 Z" fill="#e53935" ${st(4)}/>` +
            `<path d="M${x + 2} -18 V5" stroke="${INK}" stroke-width="3"/>` +
            [
              [-9, -8],
              [-6, -1],
              [10, -9],
              [14, -1],
            ]
              .map(([dx, dy]) => `<circle cx="${x + dx}" cy="${dy}" r="3" fill="#212121"/>`)
              .join(''),
        )
        .join(''),
  },
  {
    id: 'olenka_ravlyky',
    slot: 'feet',
    name: 'Черевички-равлики',
    price: 15,
    draw: () =>
      [-40, 60]
        .map(
          (x) =>
            `<path d="M${x - 20} -4 L${x - 27} -20 M${x - 15} -4 L${x - 17} -22" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
            `<circle cx="${x - 27}" cy="-21" r="3" fill="${INK}"/><circle cx="${x - 17}" cy="-23" r="3" fill="${INK}"/>` +
            `<path d="M${x - 24} 5 Q${x - 26} -6 ${x - 12} -6 L${x + 22} -6 Q${x + 28} -6 ${x + 26} 5 Z" fill="#c5e1a5" ${st(3)}/>` +
            `<circle cx="${x + 4}" cy="-14" r="15" fill="#ffb74d" ${st(3)}/>` +
            `<path d="M${x + 4} -14 m0 -3 a3 3 0 1 1 -3 3 a7 7 0 1 1 7 7 a11 11 0 1 1 -11 -11" stroke="#e65100" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
        )
        .join(''),
  },
  {
    id: 'olenka_kachky',
    slot: 'feet',
    name: 'Сабо-качечки',
    price: 15,
    draw: () =>
      [-40, 60]
        .map(
          (x) =>
            `<ellipse cx="${x + 2}" cy="-3" rx="22" ry="10" fill="#ffeb3b" ${st(3)}/>` +
            `<path d="M${x + 18} -8 l10 -6 l-2 10 Z" fill="#ffeb3b" ${st(2)}/>` +
            `<circle cx="${x - 14}" cy="-16" r="10" fill="#ffeb3b" ${st(3)}/>` +
            `<path d="M${x - 23} -15 q-10 0 -12 4 q8 3 12 0 Z" fill="#ff9800" ${st(2)}/>` +
            `<circle cx="${x - 16}" cy="-19" r="2" fill="${INK}"/>` +
            `<path d="M${x - 4} -6 q8 6 16 0" stroke="#fbc02d" stroke-width="3" fill="none"/>`,
        )
        .join(''),
  },

  // ---------- gusenia (the gosling: body 0,-40 56×30; the beak to the left)
  {
    id: 'gusenia_pukhovyk',
    slot: 'torso',
    name: 'Пуховик',
    price: 20,
    draw: () =>
      `<path d="M-58 -46 Q-54 -74 0 -74 Q60 -72 64 -42 Q62 -8 10 -6 Q-52 -6 -58 -46 Z" fill="#29b6f6" ${stroke}/>` +
      `<path d="M-50 -60 Q0 -54 56 -60 M-56 -44 Q0 -36 62 -44 M-52 -26 Q0 -18 58 -26" stroke="#0277bd" stroke-width="4" fill="none"/>` +
      `<path d="M-6 -74 V-6" stroke="#eceff1" stroke-width="4"/>` +
      ruffle(-46, -58, 16, 11, 8, 0.15, '#fff', 3),
  },
  {
    id: 'gusenia_plashch',
    slot: 'torso',
    name: 'Плащ Супергусака',
    price: 20,
    draw: () =>
      `<path d="M-50 -64 Q10 -86 66 -60 Q82 -30 64 -6 Q46 -20 26 -12 Q6 -22 -14 -14 Q-36 -30 -50 -64 Z" fill="#e53935" ${stroke}/>` +
      `<circle cx="28" cy="-42" r="15" fill="#fdd835" ${st(3)}/>` +
      `<text x="28" y="-35" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="20" fill="#e53935">Г</text>` +
      `<circle cx="-46" cy="-60" r="7" fill="#ffc107" ${st(3)}/>`,
  },
  {
    id: 'gusenia_zirochky',
    slot: 'legs',
    name: 'Плавки-зірочки',
    price: 10,
    draw: () =>
      `<path d="M6 -14 Q30 -6 52 -20 Q64 -34 58 -50 Q44 -36 26 -34 Q6 -30 6 -14 Z" fill="#1e88e5" ${stroke}/>` +
      star(22, -22, 5, '#ffeb3b', 1.5) +
      star(40, -30, 5, '#ffeb3b', 1.5) +
      star(52, -42, 4, '#ffeb3b', 1.5),
  },
  {
    id: 'gusenia_husenytsi',
    slot: 'legs',
    name: 'Штанці-гусениці',
    price: 15,
    draw: () =>
      [-16, 10]
        .map(
          (x) =>
            [-2, -10, -18]
              .map((y, i) => `<circle cx="${x + (i % 2 ? 2 : 0)}" cy="${y}" r="6" fill="${i % 2 ? '#9ccc65' : '#8bc34a'}" ${st(2)}/>`)
              .join('') +
            `<circle cx="${x}" cy="-27" r="7" fill="#689f38" ${st(2)}/>` +
            `<circle cx="${x - 3}" cy="-28" r="1.5" fill="#fff"/><circle cx="${x + 2}" cy="-28" r="1.5" fill="#fff"/>` +
            `<path d="M${x - 3} -33 l-3 -6 M${x + 3} -33 l3 -6" stroke="${INK}" stroke-width="1.5"/>`,
        )
        .join(''),
  },
  {
    id: 'gusenia_lilii',
    slot: 'feet',
    name: 'Шльопанці-лілії',
    price: 10,
    draw: () =>
      [-16, 10]
        .map(
          (x) =>
            `<ellipse cx="${x - 3}" cy="1" rx="13" ry="4" fill="#66bb6a" ${st(2)}/>` +
            `<path d="M${x - 12} -2 L${x - 9} -12 L${x - 5} -3 L${x - 2} -14 L${x + 1} -3 L${x + 5} -12 L${x + 6} -2 Z" fill="#f8bbd0" ${st(2)}/>` +
            `<circle cx="${x - 3}" cy="-3" r="2.5" fill="#fdd835"/>`,
        )
        .join(''),
  },
  {
    id: 'gusenia_myshky',
    slot: 'feet',
    name: 'Капці-мишки',
    price: 10,
    draw: () =>
      [-16, 10]
        .map(
          (x) =>
            `<path d="M${x + 8} -4 q10 -2 8 -10" stroke="#f48fb1" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
            `<ellipse cx="${x - 3}" cy="-4" rx="12" ry="7" fill="#bdbdbd" ${st(3)}/>` +
            `<circle cx="${x - 6}" cy="-11" r="4" fill="#bdbdbd" ${st(2)}/><circle cx="${x + 1}" cy="-11" r="4" fill="#bdbdbd" ${st(2)}/>` +
            `<circle cx="${x - 6}" cy="-11" r="1.8" fill="#f8bbd0"/><circle cx="${x + 1}" cy="-11" r="1.8" fill="#f8bbd0"/>` +
            `<circle cx="${x - 9}" cy="-6" r="1.5" fill="${INK}"/><circle cx="${x - 15}" cy="-3" r="2" fill="#f06292"/>`,
        )
        .join(''),
  },

  // ---------- kyrylo (shirt -92..92 down to -68 with the apron; hands ±116,-148)
  {
    id: 'kyrylo_sumo',
    slot: 'torso',
    name: 'Надувний костюм сумоїста',
    price: 25,
    draw: () =>
      band('M-86 -276 Q-140 -230 -142 -170', 44, '#ffccbc') +
      band('M86 -276 Q140 -230 142 -170', 44, '#ffccbc') +
      `<ellipse cx="0" cy="-182" rx="130" ry="128" fill="#ffccbc" ${stroke}/>` +
      `<path d="M-50 -236 q20 14 40 0 M10 -236 q20 14 40 0" stroke="#e8a383" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-6 -150 q6 8 12 0" stroke="#e8a383" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-122 -112 Q0 -80 122 -112 L116 -84 Q0 -52 -116 -84 Z" fill="#263238" ${stroke}/>` +
      `<path d="M-18 -78 L-22 -36 L22 -36 L18 -78 Z" fill="#263238" ${st(4)}/>` +
      `<path d="M-14 -50 v12 M-6 -50 v14 M2 -50 v14 M10 -50 v12" stroke="#fff" stroke-width="3"/>` +
      hand(-142, -158, 19, '#e0b090') +
      hand(142, -158, 19, '#e0b090'),
  },
  {
    id: 'kyrylo_vyshyvanka',
    slot: 'torso',
    name: 'Вишиванка з драконом',
    price: 25,
    draw: () =>
      `<path d="M-88 -294 Q-108 -200 -96 -116 L-98 -68 L98 -68 L96 -116 Q108 -200 88 -294 Q0 -318 -88 -294 Z" fill="#fff" ${stroke}/>` +
      `<path d="M-96 -84 H96" stroke="#c62828" stroke-width="9" stroke-dasharray="7 4"/>` +
      `<path d="M-96 -96 H96" stroke="#212121" stroke-width="4" stroke-dasharray="3 5"/>` +
      // the dragon embroidered on the chest
      `<path d="M-16 -184 Q-40 -220 -10 -226 Q-24 -206 -6 -196 Z M24 -184 Q48 -220 18 -226 Q32 -206 14 -196 Z" fill="#2e7d32" ${st(3)}/>` +
      `<ellipse cx="4" cy="-170" rx="30" ry="20" fill="#43a047" ${st(3)}/>` +
      `<path d="M32 -162 Q56 -150 50 -130 l8 -2 l-6 10" stroke="#43a047" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<circle cx="-28" cy="-188" r="13" fill="#43a047" ${st(3)}/><circle cx="-31" cy="-191" r="2.5" fill="${INK}"/>` +
      `<path d="M-40 -184 q-10 2 -12 -4 M-42 -180 q-10 4 -12 0" stroke="#ff7043" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<path d="M-20 -150 l-4 8 M16 -150 l4 8" stroke="#2e7d32" stroke-width="5" stroke-linecap="round"/>` +
      band('M-82 -282 Q-126 -230 -116 -164', 38, '#fff') +
      band('M82 -282 Q126 -230 116 -164', 38, '#fff') +
      `<path d="M-132 -184 L-98 -172 M132 -184 L98 -172" stroke="#c62828" stroke-width="10"/>` +
      hand(-116, -148, 19, '#e0b090') +
      hand(116, -148, 19, '#e0b090'),
  },
  {
    id: 'kyrylo_kovbasky',
    slot: 'legs',
    name: 'Штани-ковбаски',
    price: 15,
    draw: () =>
      mirror(
        [-136, -96, -56]
          .map(
            (y) =>
              `<rect x="-57" y="${y}" width="52" height="42" rx="19" fill="#e57373" ${st(4)}/>` +
              `<path d="M-46 ${y + 10} q6 -4 14 -4" stroke="#ffcdd2" stroke-width="4" fill="none" stroke-linecap="round"/>` +
              `<circle cx="-24" cy="${y + 26}" r="2" fill="#fff"/><circle cx="-40" cy="${y + 30}" r="2" fill="#fff"/>`,
          )
          .join('') + `<path d="M-34 -96 l-5 -6 M-28 -96 l5 -6 M-34 -56 l-5 -6 M-28 -56 l5 -6" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'kyrylo_boks',
    slot: 'legs',
    name: 'Боксерські шорти',
    price: 15,
    draw: () =>
      mirror(`<path d="M-48 -54 L-50 -14 L-10 -14 L-8 -54 Z" fill="#e0b090" ${st(4)}/>`) +
      `<path d="M-58 -136 L-62 -46 L-4 -46 L0 -76 L4 -46 L62 -46 L58 -136 Z" fill="#d32f2f" ${stroke}/>` +
      `<path d="M-56 -132 L-59 -50 M56 -132 L59 -50" stroke="#fff" stroke-width="6"/>` +
      `<path d="M-60 -52 H-6 M6 -52 H60" stroke="#fdd835" stroke-width="5"/>`,
  },
  {
    id: 'kyrylo_tanky',
    slot: 'feet',
    name: 'Черевики-танки',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-52 -30 H-80" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-52 -30 H-79" stroke="#558b2f" stroke-width="3.5" stroke-linecap="round"/>` +
          `<rect x="-54" y="-38" width="34" height="18" rx="6" fill="#558b2f" ${st(4)}/>` +
          star(-37, -29, 5, '#fdd835', 1.5) +
          `<rect x="-70" y="-22" width="66" height="26" rx="13" fill="#455a64" ${stroke}/>` +
          [-58, -37, -16].map((x) => `<circle cx="${x}" cy="-9" r="6" fill="#90a4ae" ${st(2)}/>`).join(''),
      ),
  },
  {
    id: 'kyrylo_slony',
    slot: 'feet',
    name: 'Чоботи-слони',
    price: 20,
    draw: () =>
      mirror(
        `<path d="M-6 3 L-6 -24 Q-30 -32 -54 -20 Q-62 -8 -58 3 Z" fill="#90a4ae" ${stroke}/>` +
          `<ellipse cx="-20" cy="-22" rx="11" ry="13" fill="#b0bec5" ${st(3)}/>` +
          `<circle cx="-42" cy="-18" r="2.5" fill="${INK}"/>` +
          `<path d="M-56 -10 Q-76 -6 -74 6 Q-72 12 -66 8" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
          `<path d="M-56 -10 Q-76 -6 -74 6 Q-72 12 -66 8" stroke="#90a4ae" stroke-width="5" fill="none" stroke-linecap="round"/>` +
          `<path d="M-50 -4 l-6 6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
      ),
  },

  // ---------- pastushok (shirt -54..54, y -204..-72; one arm on the left with a stick)
  {
    id: 'pastushok_vivtsia',
    slot: 'torso',
    name: 'Костюм вівці',
    price: 20,
    draw: () =>
      ruffle(2, -142, 66, 74, 16, 0.12, '#fafafa') +
      `<path d="M-30 -170 q6 -8 12 0 M10 -150 q6 -8 12 0 M-20 -110 q6 -8 12 0 M24 -100 q6 -8 12 0 M-4 -190 q6 -8 12 0" stroke="#bdbdbd" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      band('M-46 -194 Q-70 -160 -64 -132', 20, '#fafafa') +
      `<circle cx="-62" cy="-176" r="5" fill="none" stroke="#bdbdbd" stroke-width="2.5"/><circle cx="-66" cy="-150" r="5" fill="none" stroke="#bdbdbd" stroke-width="2.5"/>` +
      `<circle cx="-64" cy="-124" r="11" fill="#424242" ${st(3)}/>`,
  },
  {
    id: 'pastushok_harbuz',
    slot: 'torso',
    name: 'Светр-гарбуз',
    price: 15,
    draw: () =>
      `<path d="M-54 -206 Q-68 -140 -60 -70 Q0 -58 60 -70 Q68 -140 54 -206 Q0 -220 -54 -206 Z" fill="#ff9800" ${stroke}/>` +
      `<path d="M-28 -210 Q-42 -140 -30 -64 M0 -214 V-60 M28 -210 Q42 -140 30 -64" stroke="#e65100" stroke-width="4" fill="none"/>` +
      `<path d="M-22 -150 l8 -10 l8 10 Z M8 -150 l8 -10 l8 10 Z" fill="#5d4037"/>` +
      `<path d="M-24 -126 Q0 -104 24 -126 L16 -122 L10 -128 L4 -120 L-4 -128 L-10 -120 L-16 -128 Z" fill="#5d4037"/>` +
      `<path d="M-22 -210 Q0 -196 22 -210 Q12 -222 0 -214 Q-12 -222 -22 -210 Z" fill="#43a047" ${st(3)}/>` +
      band('M-46 -194 Q-70 -160 -64 -132', 17, '#ff9800') +
      hand(-64, -124, 11, '#f2c4a0'),
  },
  {
    id: 'pastushok_sino',
    slot: 'legs',
    name: 'Штани із сіна',
    price: 10,
    draw: () =>
      mirror(
        `<path d="M-35 -100 L-37 -12 L-2 -12 L-1 -100 Z" fill="#e6c35c" ${st(4)}/>` +
          `<path d="M-30 -92 l6 10 M-20 -80 l-4 12 M-12 -94 l4 10 M-28 -62 l8 6 M-14 -54 l-4 10 M-30 -40 l6 8 M-16 -30 l4 10" stroke="#b8902a" stroke-width="3" stroke-linecap="round"/>` +
          `<path d="M-37 -20 l-8 4 M-36 -40 l-9 -2 M-36 -66 l-8 2 M-30 -12 l-3 8 M-18 -12 l0 8 M-8 -12 l3 8" stroke="#d4a531" stroke-width="3.5" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'pastushok_mukhomory',
    slot: 'legs',
    name: 'Шорти-мухомори',
    price: 15,
    draw: () =>
      mirror(`<path d="M-30 -60 L-31 -12 L-6 -12 L-6 -60 Z" fill="#f2c4a0" ${st(4)}/>`) +
      `<path d="M-38 -102 L-40 -50 L-4 -50 L0 -70 L4 -50 L40 -50 L38 -102 Z" fill="#e53935" ${stroke}/>` +
      [
        [-28, -62, 5],
        [-14, -56, 3.5],
        [-30, -54, 3],
        [18, -62, 4],
        [30, -56, 5],
        [12, -54, 3],
      ]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`)
        .join(''),
  },
  {
    id: 'pastushok_tiulpany',
    slot: 'feet',
    name: 'Дерев’яні черевики з тюльпанами',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-46 3 Q-56 2 -54 -12 Q-50 -18 -30 -18 L-4 -18 L-3 3 Z" fill="#ffe082" ${stroke}/>` +
          `<path d="M-22 -2 V-10" stroke="#43a047" stroke-width="3"/>` +
          `<path d="M-28 -12 L-28 -18 L-25 -15 L-22 -19 L-19 -15 L-16 -18 L-16 -12 Q-22 -6 -28 -12 Z" fill="#e53935" ${st(1.5)}/>` +
          `<path d="M-22 -4 q-6 -2 -8 -6 M-22 -5 q6 -2 8 -6" stroke="#43a047" stroke-width="2.5" fill="none"/>`,
      ),
  },
  {
    id: 'pastushok_kastruli',
    slot: 'feet',
    name: 'Чоботи-каструлі',
    price: 15,
    draw: () =>
      mirror(
        `<path d="M-42 -34 h-8 v10 h8" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
          `<path d="M-42 -38 L-40 3 L-4 3 L-2 -38 Z" fill="#b0bec5" ${stroke}/>` +
          `<rect x="-46" y="-44" width="48" height="9" rx="3" fill="#cfd8dc" ${st(3)}/>` +
          `<path d="M-34 -28 V-6" stroke="#eceff1" stroke-width="4" stroke-linecap="round"/>` +
          `<circle cx="-16" cy="-16" r="5" fill="#e53935" ${st(2)}/><circle cx="-16" cy="-16" r="2" fill="#fff"/>`,
      ),
  },
];

export const SETS: Record<string, string> = {
  telesyk: 'telesyk_zhupan telesyk_rybky telesyk_kedy telesyk_klen telesyk_husak telesyk_lymonchyky telesyk_zhyrafy telesyk_krokodyly telesyk_paroplavy',
  zmiyuchka: 'zmiyuchka_svetr zmiyuchka_hirlianda zmiyuchka_skeit zmiyuchka_plashch zmiyuchka_mushli zmiyuchka_kapusta zmiyuchka_bublyky zmiyuchka_kylym zmiyuchka_sanchata',
  olenka: 'olenka_svetr olenka_pachka olenka_cherevychky olenka_troiandy olenka_tort olenka_tsukerky olenka_kulky olenka_sonechka olenka_ravlyky olenka_kachky',
  koval: 'koval_kaska koval_vidro koval_zvariuvalna koval_haiky koval_vusa koval_vohon koval_namysto koval_polumya koval_molotky koval_kovadla koval_tazyk koval_iskry koval_zaklepky koval_tsviashky koval_prasky koval_mahnity koval_iskrysti',
  gusenia: 'gusenia_yaiechko gusenia_pidguzok gusenia_shkaralupky gusenia_pukhovyk gusenia_plashch gusenia_zirochky gusenia_husenytsi gusenia_lilii gusenia_myshky',
  kyrylo: 'kyrylo_tryko kyrylo_harmoshka kyrylo_bortsivky kyrylo_sumo kyrylo_vyshyvanka kyrylo_kovbasky kyrylo_boks kyrylo_tanky kyrylo_slony',
  knyaz: 'knyaz_nabakyr knyaz_turban knyaz_koronky knyaz_propeler knyaz_krendeli knyaz_zhabo knyaz_pechyvo knyaz_mantiya knyaz_skafandr knyaz_pantalony knyaz_tufli knyaz_monety knyaz_tyhr knyaz_shakhy knyaz_kaptsi knyaz_skryni',
  pastushok: 'pastushok_sheryf pastushok_dzhynsy pastushok_choboty pastushok_vivtsia pastushok_harbuz pastushok_sino pastushok_mukhomory pastushok_tiulpany pastushok_kastruli',
  sirko: 'sirko_svetr sirko_shtany sirko_kotyky',
  nevista: 'nevista_yedynorih nevista_veselka nevista_kryshtalevi',
  vnuchka: 'vnuchka_kavun vnuchka_romashka vnuchka_zhabky',
  knyazivna: 'knyazivna_laty knyazivna_dzvin knyazivna_metelyky',
};
