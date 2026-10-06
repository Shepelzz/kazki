// Clothes and more things of the heroes' wardrobe, group f (see wardrobe.ts and items/a.ts).
// SETS here ADD to a hero's set (they don't replace it).
//
// Everything here is clothes for the body (torso / legs / feet): drawn in the puppet's own numbers
// (its feet at 0,0), over its body, put in at the puppet's data-dress markers.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** horizontal stripes inside an ellipse (for knitted and sailor things), from y0 to y1 */
const stripesIn = (cx: number, cy: number, rx: number, ry: number, y0: number, y1: number, step: number, color: string, w: number) => {
  let s = '';
  for (let y = y0; y <= y1; y += step) {
    const t = (y - cy) / ry;
    if (Math.abs(t) >= 0.97) continue;
    const h = rx * Math.sqrt(1 - t * t) - w / 2 - 2;
    s += `<path d="M${(cx - h).toFixed(1)} ${y} H${(cx + h).toFixed(1)}" stroke="${color}" stroke-width="${w}"/>`;
  }
  return s;
};

/** dots scattered over a box, only those inside the ellipse */
const dotsIn = (cx: number, cy: number, rx: number, ry: number, gap: number, r: number, color: string) => {
  let s = '';
  let row = 0;
  for (let y = cy - ry + gap / 2; y < cy + ry; y += gap, row++)
    for (let x = cx - rx + (row % 2 ? gap : gap / 2); x < cx + rx; x += gap) {
      const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (d < 0.78) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${color}"/>`;
    }
  return s;
};

/** a little flower */
const flower = (x: number, y: number, r: number, c: string) =>
  [0, 72, 144, 216, 288]
    .map((a) => {
      const rad = (a * Math.PI) / 180;
      return `<circle cx="${(x + Math.cos(rad) * r).toFixed(1)}" cy="${(y + Math.sin(rad) * r).toFixed(1)}" r="${(r * 0.75).toFixed(1)}" fill="${c}"/>`;
    })
    .join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="#fff59d"/>`;

/** a bow (a tie or a ribbon) */
const bow = (x: number, y: number, s: number, c: string) =>
  `<path d="M${x} ${y} L${x - 14 * s} ${y - 9 * s} L${x - 14 * s} ${y + 9 * s} Z M${x} ${y} L${x + 14 * s} ${y - 9 * s} L${x + 14 * s} ${y + 9 * s} Z" fill="${c}" ${st(3)}/>` +
  `<circle cx="${x}" cy="${y}" r="${4 * s}" fill="${c}" ${st(3)}/>`;

// the four legs of the dogs (sobaka, zhuchka): x of the left side of each, 16 wide, from -50 to 0
const DOG_LEGS = [-44, -18, 14, 34];
// the goat's legs: left and right at the top
const GOAT_LEGS: [number, number][] = [[-48, -30], [-22, -6], [26, 42], [50, 68]];
// the straw bull's legs: left side, 20 wide, from -84 to 0
const BULL_LEGS = [-60, -34, 30, 54];

export const ITEMS: Item[] = [
  // ======== собака ========
  {
    id: 'sobaka_svetr',
    slot: 'torso',
    name: 'Светрик з кісточкою',
    price: 15,
    draw: () =>
      `<ellipse cx="2" cy="-68" rx="64" ry="38" fill="#d32f2f" ${stroke}/>` +
      `<path d="M-58 -76 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M-56 -50 Q2 -20 62 -50" fill="none" stroke="#fff" stroke-width="6"/>` +
      // a big white bone on the side
      `<g transform="translate(20 -56) rotate(-12)"><rect x="-18" y="-5" width="36" height="10" fill="#fffaf0" ${st(3)}/>` +
      `<circle cx="-20" cy="-6" r="7" fill="#fffaf0" ${st(3)}/><circle cx="-20" cy="6" r="7" fill="#fffaf0" ${st(3)}/>` +
      `<circle cx="20" cy="-6" r="7" fill="#fffaf0" ${st(3)}/><circle cx="20" cy="6" r="7" fill="#fffaf0" ${st(3)}/>` +
      `<rect x="-16" y="-4" width="32" height="8" fill="#fffaf0"/></g>` +
      `<circle cx="-30" cy="-90" r="3" fill="#fff"/><circle cx="-8" cy="-94" r="3" fill="#fff"/><circle cx="16" cy="-94" r="3" fill="#fff"/><circle cx="40" cy="-88" r="3" fill="#fff"/>`,
  },
  {
    id: 'sobaka_shtantsi',
    slot: 'legs',
    name: 'Смугасті штанці на 4 лапи',
    price: 10,
    draw: () =>
      DOG_LEGS.map(
        (x) =>
          `<rect x="${x - 4}" y="-50" width="24" height="36" rx="7" fill="#1e88e5" ${st(4)}/>` +
          [-42, -32, -22].map((y) => `<path d="M${x - 1} ${y} H${x + 17}" stroke="#fff" stroke-width="5"/>`).join(''),
      ).join(''),
  },
  {
    id: 'sobaka_cherevychky',
    slot: 'feet',
    name: 'Черевички-кісточки',
    price: 15,
    draw: () =>
      // little white shoes shaped like bones: a knob at each end
      DOG_LEGS.map(
        (x) =>
          `<circle cx="${x - 10}" cy="-10" r="6" fill="#fffaf0" ${st(3)}/><circle cx="${x - 10}" cy="-1" r="6" fill="#fffaf0" ${st(3)}/>` +
          `<circle cx="${x + 20}" cy="-10" r="6" fill="#fffaf0" ${st(3)}/><circle cx="${x + 20}" cy="-1" r="6" fill="#fffaf0" ${st(3)}/>` +
          `<rect x="${x - 10}" y="-14" width="30" height="16" rx="3" fill="#fffaf0" ${st(3)}/>` +
          `<rect x="${x - 8}" y="-12" width="26" height="12" fill="#fffaf0"/>` +
          `<path d="M${x - 2} -7 h14" stroke="#c08a52" stroke-width="2.5" stroke-linecap="round"/>`,
      ).join(''),
  },

  // ======== Жучка (the same dog, black) ========
  {
    id: 'zhuchka_doshchovyk',
    slot: 'torso',
    name: 'Жовтий дощовик',
    price: 15,
    draw: () =>
      `<path d="M-62 -84 Q-70 -48 -62 -28 L68 -28 Q72 -50 64 -86 Q2 -112 -62 -84 Z" fill="#fdd835" ${stroke}/>` +
      `<path d="M-62 -40 H68" stroke="#f9a825" stroke-width="4"/>` +
      `<rect x="8" y="-66" width="26" height="20" rx="3" fill="#fbc02d" ${st(3)}/>` +
      [[-24, -84], [-24, -66], [-24, -48]].map(([x, y]) => `<rect x="${x - 7}" y="${y - 3}" width="14" height="6" rx="3" fill="#6d4c41" ${st(2)}/>`).join('') +
      // raindrops running down
      `<path d="M44 -82 q4 8 0 10 q-4 -2 0 -10 Z M50 -54 q4 8 0 10 q-4 -2 0 -10 Z" fill="#81d4fa" ${st(2)}/>`,
  },
  {
    id: 'zhuchka_pelyustky',
    slot: 'legs',
    name: 'Спідничка-пелюстки',
    price: 20,
    draw: () =>
      // big flower petals round the tummy, the back ones under the body
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const x = 4 + Math.cos(a) * 66;
        const y = -44 + Math.sin(a) * 16;
        const c = ['#ff7043', '#ffca28', '#ec407a', '#ab47bc'][i % 4];
        const rot = (Math.atan2(Math.sin(a) * 16, Math.cos(a) * 66) * 180) / Math.PI;
        return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="24" ry="12" fill="${c}" ${st(3)} transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      }).join('') + `<ellipse cx="4" cy="-46" rx="60" ry="12" fill="#66bb6a" ${st(3)}/>`,
  },
  {
    id: 'zhuchka_cheshky',
    slot: 'feet',
    name: 'Чешки з бантиками',
    price: 10,
    draw: () =>
      DOG_LEGS.map(
        (x) =>
          `<path d="M${x - 2} -14 H${x + 18} V0 H${x - 12} Q${x - 16} -10 ${x - 2} -14 Z" fill="#f8bbd0" ${st(3)}/>` +
          `<path d="M${x - 2} -9 L${x + 18} -9" stroke="#ec407a" stroke-width="3"/>` +
          bow(x + 4, -16, 0.45, '#ec407a'),
      ).join(''),
  },

  // ======== мишка ========
  {
    id: 'myshka_sukenka',
    slot: 'torso',
    name: 'Сукенка в горошок',
    price: 15,
    draw: () =>
      `<path d="M-26 -66 Q0 -76 26 -66 Q34 -40 44 -14 Q0 0 -44 -14 Q-34 -40 -26 -66 Z" fill="#ab47bc" ${stroke}/>` +
      [[-12, -54], [12, -56], [-22, -34], [2, -38], [24, -32], [-30, -20], [-8, -18], [16, -16], [34, -20]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff"/>`)
        .join('') +
      `<path d="M-44 -14 Q-38 -6 -30 -12 Q-24 -4 -16 -9 Q-8 -2 0 -7 Q8 -2 16 -9 Q24 -4 30 -12 Q38 -6 44 -14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-20 -66 Q-10 -56 0 -64 Q10 -56 20 -66" fill="#fff" ${st(3)}/>`,
  },
  {
    id: 'myshka_pantalonchyky',
    slot: 'legs',
    name: 'Панталончики з рюшами',
    price: 10,
    draw: () =>
      `<path d="M-35 -36 Q0 -42 35 -36 Q42 -18 36 -8 Q20 -4 4 -8 L0 -16 L-4 -8 Q-20 -4 -36 -8 Q-42 -18 -35 -36 Z" fill="#fff" ${stroke}/>` +
      `<path d="M-34 -32 Q0 -38 34 -32" fill="none" stroke="#f48fb1" stroke-width="5"/>` +
      [-20, 20]
        .map((x) => `<path d="M${x - 17} -8 q4 7 8.5 0 q4 7 8.5 0 q4 7 8.5 0 q4 7 8.5 0" fill="#fff" ${st(3)}/>`)
        .join('') +
      bow(0, -35, 0.55, '#f06292'),
  },
  {
    id: 'myshka_tapky',
    slot: 'feet',
    name: 'Тапочки-зайчики',
    price: 15,
    draw: () =>
      [-16, 16]
        .map((x) => {
          const o = x < 0 ? -1 : 1;
          return (
            `<path d="M${x + o * 4} -8 Q${x + o * 20} -26 ${x + o * 26} -20 Q${x + o * 22} -10 ${x + o * 10} -6 Z" fill="#fff" ${st(3)}/>` +
            `<path d="M${x + o * 8} -8 Q${x + o * 22} -30 ${x + o * 30} -26 Q${x + o * 28} -14 ${x + o * 14} -6 Z" fill="#fff" ${st(3)}/>` +
            `<path d="M${x + o * 10} -9 Q${x + o * 22} -24 ${x + o * 26} -22" stroke="#f8bbd0" stroke-width="4" fill="none" stroke-linecap="round"/>` +
            `<ellipse cx="${x}" cy="-5" rx="18" ry="10" fill="#fff" ${st(3)}/>` +
            `<circle cx="${x - 6}" cy="-8" r="2.5" fill="${INK}"/><circle cx="${x + 6}" cy="-8" r="2.5" fill="${INK}"/>` +
            `<circle cx="${x}" cy="-3" r="3" fill="#f06292"/>`
          );
        })
        .join(''),
  },

  // ======== жабка ========
  {
    id: 'zhabka_krug',
    slot: 'torso',
    name: 'Круг-качечка',
    price: 20,
    draw: () =>
      `<path d="M-62 -26 A62 16 0 0 0 62 -26 L48 -26 A48 8 0 0 1 -48 -26 Z" fill="#fdd835" ${stroke}/>` +
      `<path d="M-46 -16 l-6 10 M-14 -11 l-2 11 M18 -11 l2 11 M46 -16 l6 10" stroke="#e53935" stroke-width="9"/>` +
      `<path d="M-62 -26 A62 16 0 0 0 62 -26 L48 -26 A48 8 0 0 1 -48 -26 Z" fill="none" ${st(4)}/>` +
      // the duck's head on the ring
      `<path d="M52 -26 Q50 -50 62 -58 Q78 -64 82 -50 Q84 -36 66 -30 Z" fill="#fdd835" ${stroke}/>` +
      `<path d="M80 -50 L98 -46 L80 -40 Z" fill="#ff9800" ${st(3)}/>` +
      `<circle cx="70" cy="-50" r="3.5" fill="${INK}"/>`,
  },
  {
    id: 'zhabka_plavky',
    slot: 'legs',
    name: 'Плавки-кавунчики',
    price: 10,
    draw: () =>
      `<path d="M-46 -24 Q0 -16 46 -24 Q46 -8 34 0 Q14 -2 4 4 L0 -4 L-4 4 Q-14 -2 -34 0 Q-46 -8 -46 -24 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M-45 -22 Q0 -14 45 -22" fill="none" stroke="#43a047" stroke-width="7"/>` +
      `<path d="M-45 -22 Q0 -14 45 -22" fill="none" stroke="#a5d6a7" stroke-width="2.5"/>` +
      [[-28, -10], [-16, -6], [-24, -2], [20, -6], [30, -10], [10, -10], [-8, -10]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="3" fill="#2b1a10"/>`)
        .join(''),
  },
  {
    id: 'zhabka_lasty',
    slot: 'feet',
    name: 'Ласти',
    price: 15,
    draw: () =>
      [-1, 1]
        .map(
          (o) =>
            `<path d="M${o * 16} -12 L${o * 64} -22 Q${o * 74} -10 ${o * 66} 4 L${o * 16} 0 Z" fill="#1e88e5" ${stroke}/>` +
            `<path d="M${o * 22} -8 L${o * 64} -14 M${o * 22} -4 L${o * 66} -4 M${o * 22} -2 L${o * 64} 4" stroke="#90caf9" stroke-width="3"/>`,
        )
        .join(''),
  },

  // ======== кабан ========
  {
    id: 'kaban_tilnyashka',
    slot: 'torso',
    name: 'Тільняшка моряка',
    price: 20,
    draw: () =>
      `<ellipse cx="2" cy="-128" rx="86" ry="86" fill="#fff" ${stroke}/>` +
      stripesIn(2, -128, 86, 86, -200, -50, 14, '#1565c0', 7) +
      `<ellipse cx="2" cy="-128" rx="86" ry="86" fill="none" ${stroke}/>` +
      // sailor collar under the chin
      `<path d="M-40 -186 L-16 -150 L28 -150 L52 -186 Z" fill="#1565c0" ${st(4)}/>` +
      `<path d="M-30 -182 L-12 -156 L24 -156 L42 -182" fill="none" stroke="#fff" stroke-width="3"/>` +
      bow(6, -150, 0.9, '#e53935') +
      // a striped sleeve over his arm
      `<path d="M-70 -172 Q-98 -142 -94 -116" fill="none" stroke="${INK}" stroke-width="40" stroke-linecap="round"/>` +
      `<path d="M-70 -172 Q-98 -142 -94 -116" fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round"/>` +
      `<path d="M-70 -172 Q-98 -142 -94 -116" fill="none" stroke="#1565c0" stroke-width="30" stroke-dasharray="6 8"/>`,
  },
  {
    id: 'kaban_shtany',
    slot: 'legs',
    name: 'Штани з латками',
    price: 15,
    draw: () =>
      [-48, 22]
        .map(
          (x) =>
            `<rect x="${x - 5}" y="-76" width="36" height="62" rx="6" fill="#5c6bc0" ${st(4)}/>` +
            `<rect x="${x + 2}" y="-36" width="14" height="13" fill="${x < 0 ? '#ffb300' : '#e53935'}" ${st(2)} transform="rotate(${x < 0 ? -10 : 8} ${x + 9} -30)"/>` +
            `<path d="M${x + 4} -34 l3 3 M${x + 12} -34 l3 3" stroke="${INK}" stroke-width="2"/>` +
            `<path d="M${x - 4} -18 H${x + 30}" stroke="#3949ab" stroke-width="4"/>`,
        )
        .join(''),
  },
  {
    id: 'kaban_kopyttsia',
    slot: 'feet',
    name: 'Копитця на підборах',
    price: 20,
    draw: () =>
      [-48, 22]
        .map(
          (x) =>
            `<path d="M${x - 14} 2 Q${x - 18} -16 ${x - 2} -24 L${x + 30} -24 L${x + 30} -10 L${x + 26} -10 L${x + 28} 8 L${x + 20} 8 L${x + 18} -4 Q${x + 2} -6 ${x - 4} 2 Z" fill="#ec407a" ${stroke}/>` +
            `<path d="M${x - 4} -24 L${x + 30} -24" stroke="#fff" stroke-width="4" stroke-dasharray="3 4"/>` +
            `<circle cx="${x + 6}" cy="-14" r="5" fill="#fff59d" ${st(2)}/>`,
        )
        .join(''),
  },

  // ======== коза ========
  {
    id: 'koza_sukni',
    slot: 'torso',
    name: 'Сукня принцеси',
    price: 25,
    draw: () =>
      `<ellipse cx="12" cy="-100" rx="80" ry="47" fill="#f06292" ${stroke}/>` +
      Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI * (0.12 + (i / 10) * 0.76);
        const x = 12 - Math.cos(a) * 78;
        const y = -100 + Math.sin(a) * 46;
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#f8bbd0" ${st(3)}/>`;
      }).join('') +
      `<path d="M-44 -128 Q12 -116 70 -130" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 7" stroke-linecap="round"/>` +
      `<circle cx="-20" cy="-108" r="4" fill="#fff59d"/><circle cx="20" cy="-96" r="4" fill="#fff59d"/><circle cx="52" cy="-110" r="4" fill="#fff59d"/>` +
      bow(48, -144, 1.4, '#ffeb3b'),
  },
  {
    id: 'koza_hetry',
    slot: 'legs',
    name: 'Смугасті гетри',
    price: 10,
    draw: () =>
      GOAT_LEGS.map(([a, b]) => {
        const c = ['#e53935', '#fdd835', '#43a047', '#1e88e5'];
        return (
          `<rect x="${a - 4}" y="-58" width="${b - a + 8}" height="36" rx="5" fill="#fff" ${st(4)}/>` +
          c.map((col, i) => `<rect x="${a - 2}" y="${-55 + i * 8}" width="${b - a + 4}" height="5" fill="${col}"/>`).join('')
        );
      }).join(''),
  },
  {
    id: 'koza_tufli',
    slot: 'feet',
    name: 'Туфлі на підборах',
    price: 20,
    draw: () =>
      GOAT_LEGS.map(([a, b]) => {
        const x = a - 4;
        const w = b - a + 10;
        return (
          `<path d="M${x - 8} 2 Q${x - 12} -14 ${x + 2} -22 L${x + w} -22 L${x + w} -8 L${x + w - 2} -8 L${x + w - 1} 6 L${x + w - 7} 6 L${x + w - 9} -4 Q${x + 8} -6 ${x + 4} 2 Z" fill="#c62828" ${st(3)}/>` +
          bow(x + 2, -18, 0.45, '#fdd835')
        );
      }).join(''),
  },

  // ======== їжачок ========
  {
    id: 'yizhachok_zhyletka',
    slot: 'torso',
    name: 'Жилетка з годинником',
    price: 15,
    draw: () =>
      `<path d="M-62 -38 Q-62 -92 6 -94 Q76 -92 76 -38 Q42 -30 26 -34 L6 -24 L-14 -34 Q-36 -30 -62 -38 Z" fill="#7b1fa2" ${stroke}/>` +
      `<path d="M6 -24 L6 -90" stroke="#4a148c" stroke-width="4"/>` +
      `<circle cx="14" cy="-74" r="3.5" fill="#ffd54f" ${st(2)}/><circle cx="14" cy="-58" r="3.5" fill="#ffd54f" ${st(2)}/><circle cx="14" cy="-42" r="3.5" fill="#ffd54f" ${st(2)}/>` +
      `<rect x="34" y="-62" width="22" height="12" rx="3" fill="#9c27b0" ${st(3)}/>` +
      // a pocket watch on a gold chain
      `<path d="M16 -58 Q30 -46 44 -56" fill="none" stroke="#ffca28" stroke-width="3"/>` +
      `<circle cx="46" cy="-64" r="9" fill="#ffca28" ${st(3)}/><circle cx="46" cy="-64" r="5.5" fill="#fff"/>` +
      `<path d="M46 -64 v-4 M46 -64 h3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
  },
  {
    id: 'yizhachok_shorty',
    slot: 'legs',
    name: 'Шорти в клітинку',
    price: 10,
    draw: () =>
      `<path d="M-62 -44 L76 -44 Q76 -16 64 -4 L18 -4 L10 -14 L2 -4 L-48 -4 Q-62 -16 -62 -44 Z" fill="#ff7043" ${stroke}/>` +
      [-46, -28, -10, 26, 44, 62].map((x) => `<path d="M${x} -42 V-6" stroke="#fff176" stroke-width="4" opacity=".8"/>`).join('') +
      [-34, -22, -12].map((y) => `<path d="M-58 ${y} H72" stroke="#bf360c" stroke-width="3" opacity=".7"/>`).join('') +
      `<path d="M-62 -44 L76 -44 Q76 -16 64 -4 L18 -4 L10 -14 L2 -4 L-48 -4 Q-62 -16 -62 -44 Z" fill="none" ${stroke}/>`,
  },
  {
    id: 'yizhachok_roliky',
    slot: 'feet',
    name: 'Роликові ковзани',
    price: 20,
    draw: () =>
      [-20, 30]
        .map(
          (c) =>
            `<path d="M${c - 18} -4 Q${c - 20} -16 ${c - 6} -18 L${c + 8} -22 L${c + 14} -4 Z" fill="#26c6da" ${st(3)}/>` +
            `<path d="M${c - 4} -16 l6 6 M${c + 2} -18 l6 6" stroke="#fff" stroke-width="2.5"/>` +
            `<rect x="${c - 20}" y="-6" width="36" height="6" rx="3" fill="#90a4ae" ${st(3)}/>` +
            `<circle cx="${c - 12}" cy="5" r="6" fill="#ff9800" ${st(3)}/><circle cx="${c + 8}" cy="5" r="6" fill="#ff9800" ${st(3)}/>`,
        )
        .join(''),
  },

  // ======== рак ========
  {
    id: 'rak_frak',
    slot: 'torso',
    name: 'Фрак з метеликом',
    price: 25,
    draw: () =>
      // two black halves, open in front (his mouth is there), the tails hanging down at the sides
      `<path d="M-14 -98 Q-50 -98 -60 -60 Q-64 -42 -76 -24 L-52 -28 Q-40 -34 -24 -30 L-14 -46 Z" fill="#263238" ${stroke}/>` +
      `<path d="M14 -98 Q50 -98 60 -60 Q64 -42 76 -24 L52 -28 Q40 -34 24 -30 L14 -46 Z" fill="#263238" ${stroke}/>` +
      `<path d="M-14 -96 L-22 -66 L-12 -60 M14 -96 L22 -66 L12 -60" fill="none" stroke="#546e7a" stroke-width="4"/>` +
      `<circle cx="-20" cy="-40" r="3" fill="#ffd54f"/><circle cx="20" cy="-40" r="3" fill="#ffd54f"/>` +
      `<path d="M-42 -72 l10 0" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
      bow(0, -24, 0.85, '#e53935'),
  },
  {
    id: 'rak_spidnychka',
    slot: 'legs',
    name: 'Спідничка з травички',
    price: 15,
    draw: () =>
      Array.from({ length: 19 }, (_, i) => {
        const x = -54 + i * 6;
        const c = i % 3 === 0 ? '#2e7d32' : i % 3 === 1 ? '#66bb6a' : '#9ccc65';
        const end = x + (x < 0 ? -6 : 6);
        return `<path d="M${x} -30 Q${x + 2} -16 ${end} 0" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${x} -30 Q${x + 2} -16 ${end} 0" stroke="${c}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
      }).join('') +
      `<path d="M-56 -30 Q0 -22 56 -30" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M-56 -30 Q0 -22 56 -30" stroke="#a1887f" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      flower(-40, -29, 4, '#ec407a') + flower(40, -29, 4, '#ffb300'),
  },
  {
    id: 'rak_shkarpetky',
    slot: 'feet',
    name: 'Шкарпетки-веселки',
    price: 10,
    draw: () =>
      (
        [
          [-52, -17, -64, -4, '#e53935'],
          [-31, -12, -38, 0, '#fdd835'],
          [31, -12, 38, 0, '#43a047'],
          [52, -17, 64, -4, '#1e88e5'],
        ] as [number, number, number, number, string][]
      )
        .map(
          ([x0, y0, x1, y1, c]) =>
            `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
            `<path d="M${x0} ${y0} L${x1} ${y1}" stroke="${c}" stroke-width="9" stroke-linecap="round"/>` +
            `<circle cx="${(x0 + x1) / 2}" cy="${(y0 + y1) / 2}" r="2.2" fill="#fff"/>`,
        )
        .join(''),
  },

  // ======== кіт ========
  {
    id: 'kit_superkit',
    slot: 'torso',
    name: 'Костюм Суперкота',
    price: 25,
    draw: () =>
      // the cape, flying out at both sides
      `<path d="M-30 -126 Q-82 -80 -78 -4 L-48 -10 Q-58 -70 -24 -116 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M30 -126 Q86 -84 84 -6 L52 -10 Q60 -70 24 -116 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M-50 -12 Q-63 -92 -26 -130 Q0 -144 26 -130 Q63 -92 50 -12 Q0 6 -50 -12 Z" fill="#1e88e5" ${stroke}/>` +
      `<path d="M0 -106 L20 -86 L0 -62 L-20 -86 Z" fill="#fdd835" ${st(4)}/>` +
      `<path d="M-6 -96 V-74 M-6 -85 L6 -96 M-6 -85 L7 -74" stroke="#e53935" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'kit_truselky',
    slot: 'legs',
    name: 'Труси поверх костюма',
    price: 10,
    draw: () =>
      `<path d="M-52 -46 Q0 -36 52 -46 Q54 -26 48 -12 Q22 -4 8 -12 L0 -20 L-8 -12 Q-22 -4 -48 -12 Q-54 -26 -52 -46 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M-52 -42 Q0 -32 52 -42" fill="none" stroke="#fdd835" stroke-width="6"/>` +
      `<rect x="-8" y="-44" width="16" height="10" rx="2" fill="#fdd835" ${st(3)}/>`,
  },
  {
    id: 'kit_choboty',
    slot: 'feet',
    name: 'Чоботи Кота в чоботях',
    price: 25,
    draw: () =>
      [-24, 24]
        .map(
          (c) =>
            `<path d="M${c - 16} -34 L${c + 16} -34 L${c + 18} -10 Q${c + 24} -2 ${c + 20} 2 L${c - 22} 2 Q${c - 26} -6 ${c - 18} -10 Z" fill="#6d4c41" ${stroke}/>` +
            `<path d="M${c - 22} -46 L${c + 22} -46 L${c + 18} -32 L${c - 18} -32 Z" fill="#8d6e63" ${st(4)}/>` +
            `<rect x="${c - 7}" y="-20" width="14" height="10" rx="2" fill="none" stroke="#ffd54f" stroke-width="3.5"/>`,
        )
        .join(''),
  },

  // ======== кішка (the same cat, orange) ========
  {
    id: 'kishka_kofta',
    slot: 'torso',
    name: 'Кофтинка з мишками',
    price: 15,
    draw: () => {
      const mouse = (x: number, y: number) =>
        `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#9e9e9e" ${st(1.5)}/><circle cx="${x - 4}" cy="${y - 5}" r="3" fill="#9e9e9e" ${st(1.5)}/>` +
        `<circle cx="${x - 7}" cy="${y}" r="1.4" fill="#f06292"/><path d="M${x + 7} ${y} q6 -2 6 -7" stroke="#f06292" stroke-width="1.6" fill="none"/>`;
      return (
        `<path d="M-50 -12 Q-63 -92 -26 -130 Q0 -144 26 -130 Q63 -92 50 -12 Q0 6 -50 -12 Z" fill="#f48fb1" ${stroke}/>` +
        [[-28, -100], [22, -104], [-34, -66], [28, -70], [-22, -34], [30, -34]].map(([x, y]) => mouse(x, y)).join('') +
        `<path d="M-6 -132 L-6 -10 M6 -132 L6 -10" stroke="#ec407a" stroke-width="3"/>` +
        [-110, -86, -62, -38].map((y) => `<circle cx="0" cy="${y}" r="4" fill="#fff" ${st(2)}/>`).join('') +
        `<path d="M-50 -16 Q0 2 50 -16" fill="none" stroke="#ec407a" stroke-width="5"/>`
      );
    },
  },
  {
    id: 'kishka_khmarka',
    slot: 'legs',
    name: 'Спідничка-хмарка',
    price: 15,
    draw: () =>
      [[-50, -30, 16], [-30, -20, 18], [-6, -16, 18], [18, -18, 18], [42, -24, 17], [56, -36, 13], [-58, -42, 12], [-36, -46, 16], [0, -48, 18], [36, -46, 16]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${st(4)}/>`)
        .join('') +
      [[-36, -46, 14], [0, -48, 16], [36, -46, 14], [-30, -24, 14], [-6, -20, 14], [18, -22, 14]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`)
        .join('') +
      `<path d="M-30 -8 l-3 7 M0 -2 l-3 7 M28 -6 l-3 7" stroke="#4fc3f7" stroke-width="3.5" stroke-linecap="round"/>` +
      `<circle cx="-14" cy="-36" r="3" fill="#f48fb1"/><circle cx="14" cy="-36" r="3" fill="#f48fb1"/>`,
  },
  {
    id: 'kishka_cherevychky',
    slot: 'feet',
    name: 'Черевички-рибки',
    price: 15,
    draw: () =>
      [-24, 24]
        .map((c) => {
          const o = c < 0 ? -1 : 1;
          // a fish round each foot: its head to the front, the tail out at the side
          return (
            `<path d="M${c + o * 18} -10 L${c + o * 34} -22 L${c + o * 34} 2 Z" fill="#29b6f6" ${st(3)}/>` +
            `<ellipse cx="${c}" cy="-10" rx="24" ry="13" fill="#4fc3f7" ${st(3)}/>` +
            `<path d="M${c - 6} -20 q4 10 0 20 M${c + 4} -20 q4 10 0 20" stroke="#0288d1" stroke-width="2.5" fill="none"/>` +
            `<circle cx="${c - o * 14}" cy="-13" r="3.5" fill="#fff" ${st(1.5)}/><circle cx="${c - o * 14}" cy="-13" r="1.6" fill="${INK}"/>`
          );
        })
        .join(''),
  },

  // ======== солом'яний бичок ========
  {
    id: 'solombychok_kurtka',
    slot: 'torso',
    name: 'Курточка тореадора',
    price: 25,
    draw: () =>
      `<ellipse cx="8" cy="-120" rx="85" ry="53" fill="#c62828" ${stroke}/>` +
      `<path d="M-68 -100 Q8 -60 86 -100" fill="none" stroke="#ffd54f" stroke-width="7"/>` +
      `<path d="M-60 -140 Q-20 -110 -20 -76 M70 -146 Q40 -110 46 -72" fill="none" stroke="#ffd54f" stroke-width="5"/>` +
      [-36, -6, 24, 54].map((x) => `<circle cx="${x}" cy="${-150 + Math.abs(x - 10) * 0.2}" r="6" fill="#ffd54f" ${st(2)}/>`).join('') +
      // gold fringes on the shoulder
      `<path d="M-40 -170 Q-10 -178 18 -170 L14 -158 Q-10 -164 -36 -158 Z" fill="#ffca28" ${st(3)}/>` +
      Array.from({ length: 7 }, (_, i) => `<path d="M${-34 + i * 8} -158 v12" stroke="#ffca28" stroke-width="3.5" stroke-linecap="round"/>`).join(''),
  },
  {
    id: 'solombychok_dzhynsy',
    slot: 'legs',
    name: 'Джинси з дірками',
    price: 15,
    draw: () =>
      BULL_LEGS.map(
        (x, i) =>
          `<rect x="${x - 4}" y="-90" width="28" height="70" rx="5" fill="#3f6fb5" ${st(4)}/>` +
          `<path d="M${x + 10} -88 V-24" stroke="#ffb300" stroke-width="2" stroke-dasharray="4 3"/>` +
          (i % 2 === 0
            ? `<ellipse cx="${x + 10}" cy="-48" rx="8" ry="5" fill="#e2b45a" ${st(2)}/><path d="M${x + 3} -48 h14 M${x + 4} -45 h12" stroke="#fff" stroke-width="1.6"/>`
            : `<ellipse cx="${x + 10}" cy="-38" rx="7" ry="4" fill="#d4a531" ${st(2)}/><path d="M${x + 4} -38 h12" stroke="#fff" stroke-width="1.6"/>`),
      ).join(''),
  },
  {
    id: 'solombychok_butsy',
    slot: 'feet',
    name: 'Футбольні бутси',
    price: 20,
    draw: () =>
      BULL_LEGS.map(
        (x) =>
          `<path d="M${x - 4} -22 H${x + 24} V0 H${x - 14} Q${x - 18} -10 ${x - 4} -12 Z" fill="#212121" ${st(4)}/>` +
          `<path d="M${x - 2} -12 L${x + 22} -18" stroke="#76ff03" stroke-width="5"/>` +
          [x - 10, x, x + 10, x + 20].map((s) => `<rect x="${s - 2}" y="0" width="5" height="5" fill="#bdbdbd" ${st(1.5)}/>`).join(''),
      ).join(''),
  },

  // ======== півник ========
  {
    id: 'pivnyk_kurtka',
    slot: 'torso',
    name: 'Куртка рок-зірки',
    price: 25,
    draw: () =>
      `<ellipse cx="0" cy="-74" rx="55" ry="44" fill="#212121" ${stroke}/>` +
      // a wing in a leather sleeve, with spikes
      `<path d="M-32 -70 Q0 -36 32 -64 Q10 -92 -32 -70 Z" fill="#424242" ${st(3)}/>` +
      [[-14, -64], [0, -66], [14, -66]].map(([x, y]) => `<path d="M${x - 4} ${y + 3} L${x} ${y - 5} L${x + 4} ${y + 3} Z" fill="#cfd8dc" ${st(1.5)}/>`).join('') +
      `<path d="M-40 -104 L-12 -40" stroke="#bdbdbd" stroke-width="4" stroke-dasharray="3 3"/>` +
      `<path d="M-46 -98 L-26 -88 L-34 -110" fill="#424242" ${st(3)}/>` +
      // a lightning bolt on the back
      `<path d="M30 -108 L18 -88 L28 -88 L20 -66 L40 -94 L30 -94 L38 -108 Z" fill="#ffeb3b" ${st(2.5)}/>`,
  },
  {
    id: 'pivnyk_shtany',
    slot: 'legs',
    name: 'Блискучі штани-кльош',
    price: 20,
    draw: () =>
      [-10, 14]
        .map(
          (x) =>
            `<path d="M${x - 8} -46 L${x + 8} -46 L${x + 18} -12 L${x - 18} -12 Z" fill="#ab47bc" ${st(4)}/>` +
            [[-2, -34], [3, -26], [-5, -18], [6, -14], [0, -12]].map(([dx, y]) => `<circle cx="${x + dx}" cy="${y}" r="1.8" fill="#fff59d"/>`).join(''),
        )
        .join(''),
  },
  {
    id: 'pivnyk_platformy',
    slot: 'feet',
    name: 'Черевики на платформі',
    price: 20,
    draw: () =>
      [-12, 13]
        .map(
          (c) =>
            `<path d="M${c - 12} -22 L${c + 10} -22 L${c + 10} -10 L${c - 14} -10 Z" fill="#ffeb3b" ${st(3)}/>` +
            `<path d="M${c - 16} -10 H${c + 13} V2 H${c - 16} Z" fill="#e91e63" ${st(3)}/>` +
            `<path d="M${c - 6} -1 l3 -6 l3 6 M${c + 1} -1 l3 -6 l3 6" fill="none" stroke="#fff" stroke-width="2"/>`,
        )
        .join(''),
  },

  // ======== журавель ========
  {
    id: 'zhuravel_maika',
    slot: 'torso',
    name: 'Майка чемпіона',
    price: 15,
    draw: () =>
      `<ellipse cx="0" cy="-180" rx="64" ry="44" fill="#43a047" ${stroke}/>` +
      `<path d="M-60 -196 Q0 -160 62 -194" fill="none" stroke="#fff" stroke-width="6"/>` +
      `<rect x="-8" y="-184" width="34" height="30" rx="3" fill="#fff" ${st(3)}/>` +
      `<path d="M4 -176 L10 -180 V-160" stroke="#e53935" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="-4" cy="-180" r="1.8" fill="${INK}"/><circle cx="22" cy="-180" r="1.8" fill="${INK}"/>`,
  },
  {
    id: 'zhuravel_shtany',
    slot: 'legs',
    name: 'Найдовші штани у світі',
    price: 20,
    draw: () =>
      `<path d="M-24 -158 L-2 -158 L-8 -12 L-30 -12 Z" fill="#3949ab" ${st(4)}/>` +
      `<path d="M2 -158 L26 -158 L34 -12 L12 -12 Z" fill="#3949ab" ${st(4)}/>` +
      `<path d="M-32 -24 L-6 -24 M10 -24 L36 -24" stroke="#7986cb" stroke-width="6"/>` +
      `<path d="M-13 -150 L-19 -30 M14 -150 L22 -30" stroke="#ffb300" stroke-width="2" stroke-dasharray="5 4"/>` +
      `<rect x="-22" y="-100" width="12" height="12" fill="#e53935" ${st(2)} transform="rotate(6 -16 -94)"/>`,
  },
  {
    id: 'zhuravel_kloun',
    slot: 'feet',
    name: 'Черевики клоуна',
    price: 20,
    draw: () =>
      [-18, 22]
        .map(
          (c) =>
            `<g transform="translate(${c} 0) scale(1.5) translate(${-c} 0)">` +
            `<ellipse cx="${c - 14}" cy="-8" rx="28" ry="11" fill="#e53935" ${st(4)}/>` +
            `<path d="M${c - 2} -16 Q${c + 10} -18 ${c + 12} -6 L${c + 12} 2 L${c - 6} 2 Z" fill="#fdd835" ${st(3)}/>` +
            `<ellipse cx="${c - 26}" cy="-12" rx="7" ry="4" fill="#fff" opacity=".7"/>` +
            `<circle cx="${c + 4}" cy="-10" r="3" fill="#1e88e5"/></g>`,
        )
        .join(''),
  },
  // ================= round 2: two more of each for myshka, zhabka, kaban, koza, yizhachok, rak, solombychok

  // ======== мишка ========
  {
    id: 'myshka_kostium_syru',
    slot: 'torso',
    name: 'Костюм сиру',
    price: 20,
    draw: () =>
      `<path d="M-36 -10 L-28 -70 Q0 -80 30 -70 L38 -10 Q0 0 -36 -10 Z" fill="#ffd54f" ${stroke}/>` +
      [[-16, -56, 6, 5], [12, -60, 4, 4], [20, -40, 7, 6], [-20, -30, 5, 6], [6, -24, 6, 5], [-4, -44, 3, 3], [26, -18, 4, 4]]
        .map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#f9a825" ${st(2)}/>`)
        .join('') +
      `<path d="M-34 -16 L36 -16" stroke="#fbc02d" stroke-width="3"/>`,
  },
  {
    id: 'myshka_morozyvo',
    slot: 'torso',
    name: 'Костюм морозива',
    price: 20,
    draw: () =>
      `<path d="M-34 -46 L34 -46 L6 -4 L-6 -4 Z" fill="#e0a458" ${stroke}/>` +
      `<path d="M-24 -46 L4 -6 M-6 -46 L16 -20 M12 -46 L24 -28 M24 -46 L-4 -6 M6 -46 L-16 -20 M-12 -46 L-24 -28" stroke="#b5762a" stroke-width="3"/>` +
      `<circle cx="-16" cy="-56" r="18" fill="#f48fb1" ${st(4)}/>` +
      `<circle cx="16" cy="-56" r="18" fill="#a5d6a7" ${st(4)}/>` +
      `<path d="M-36 -48 Q-30 -40 -24 -46 Q-20 -34 -14 -44 Q-6 -38 0 -46 Q6 -38 14 -44 Q20 -34 26 -46 Q32 -40 36 -48" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
      [[-22, -62, '#e53935'], [-10, -54, '#1e88e5'], [12, -62, '#fdd835'], [22, -52, '#ab47bc'], [4, -50, '#ff9800']]
        .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="6" height="2.5" rx="1.2" fill="${c}" transform="rotate(${(+x * 7) % 60} ${x} ${y})"/>`)
        .join(''),
  },
  {
    id: 'myshka_parasolka',
    slot: 'legs',
    name: 'Спідниця-парасолька',
    price: 15,
    draw: () =>
      `<path d="M-46 -12 Q-34 -52 0 -56 Q34 -52 46 -12 Q40 -18 32 -12 Q24 -20 16 -12 Q8 -20 0 -12 Q-8 -20 -16 -12 Q-24 -20 -32 -12 Q-40 -18 -46 -12 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M-16 -12 Q-10 -34 0 -56 M16 -12 Q10 -34 0 -56 M-32 -12 Q-24 -34 0 -56 M32 -12 Q24 -34 0 -56" stroke="${INK}" stroke-width="2.5" fill="none"/>` +
      `<path d="M-16 -12 Q-8 -20 0 -12 Q-4 -34 0 -56 Q-10 -30 -16 -12 Z M16 -12 Q8 -20 0 -12 Q4 -34 0 -56 Q10 -30 16 -12 Z" fill="#fff"/>` +
      `<path d="M38 -16 Q50 -6 46 4" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M38 -16 Q50 -6 46 4" stroke="#8d6e63" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'myshka_tsukerky',
    slot: 'legs',
    name: 'Шаровари-цукерки',
    price: 15,
    draw: () =>
      [-17, 17]
        .map(
          (x) =>
            `<path d="M${x - 18} -38 L${x + 18} -38 Q${x + 22} -20 ${x + 10} -12 L${x - 10} -12 Q${x - 22} -20 ${x - 18} -38 Z" fill="#fff" ${stroke}/>` +
            [-34, -26, -18].map((y) => `<path d="M${x - 18} ${y + 6} L${x + 18} ${y - 4}" stroke="#ec407a" stroke-width="4.5"/>`).join('') +
            `<path d="M${x - 18} -38 L${x + 18} -38 Q${x + 22} -20 ${x + 10} -12 L${x - 10} -12 Q${x - 22} -20 ${x - 18} -38 Z" fill="none" ${stroke}/>` +
            // the wrapper's twist at the ankle
            `<path d="M${x - 10} -12 L${x - 14} -4 L${x} -9 L${x + 14} -4 L${x + 10} -12 Z" fill="#f48fb1" ${st(3)}/>`,
        )
        .join(''),
  },
  {
    id: 'myshka_pechenky',
    slot: 'feet',
    name: 'Черевички-печеньки',
    price: 10,
    draw: () =>
      [-16, 16]
        .map(
          (x) =>
            `<ellipse cx="${x}" cy="-5" rx="19" ry="10" fill="#d9a066" ${st(3)}/>` +
            `<ellipse cx="${x}" cy="-7" rx="15" ry="6" fill="#e8b97a"/>` +
            [[-9, -6], [-2, -10], [6, -5], [11, -9], [0, -2]].map(([dx, y]) => `<circle cx="${x + dx}" cy="${y}" r="2.2" fill="#4e342e"/>`).join('') +
            `<path d="M${x - 10} -12 Q${x} -20 ${x + 10} -12" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>` +
            `<path d="M${x - 10} -12 Q${x} -20 ${x + 10} -12" stroke="#ec407a" stroke-width="3" fill="none" stroke-linecap="round"/>`,
        )
        .join(''),
  },
  {
    id: 'myshka_polunytsi',
    slot: 'feet',
    name: 'Чобітки-полуниці',
    price: 15,
    draw: () =>
      [-16, 16]
        .map(
          (x) =>
            `<path d="M${x - 12} -28 L${x + 12} -28 Q${x + 18} -10 ${x + 10} 2 L${x - 14} 2 Q${x - 22} -2 ${x - 14} -10 Z" fill="#e53935" ${st(3)}/>` +
            `<path d="M${x - 14} -28 L${x - 8} -34 L${x - 2} -28 L${x + 4} -34 L${x + 10} -28 L${x + 15} -33 L${x + 13} -24 L${x - 13} -24 Z" fill="#43a047" ${st(2.5)}/>` +
            [[-6, -16], [4, -20], [6, -8], [-4, -4], [-12, -8]].map(([dx, y]) => `<ellipse cx="${x + dx}" cy="${y}" rx="1.4" ry="2.2" fill="#fff59d"/>`).join(''),
        )
        .join(''),
  },

  // ======== жабка ========
  {
    id: 'zhabka_stavok',
    slot: 'torso',
    name: 'Фартух-ставочок',
    price: 15,
    draw: () =>
      `<path d="M-30 -40 Q0 -34 30 -40 L36 -6 Q0 2 -36 -6 Z" fill="#fff8e1" ${stroke}/>` +
      `<path d="M-30 -38 Q-44 -38 -46 -30 M30 -38 Q44 -38 46 -30" stroke="#ff7043" stroke-width="4" fill="none"/>` +
      // a pocket that is a little pond, with a fish
      `<ellipse cx="0" cy="-17" rx="20" ry="9" fill="#4fc3f7" ${st(3)}/>` +
      `<path d="M-6 -18 q6 -6 12 0 q-6 6 -12 0 z M6 -18 l5 -4 l0 8 z" fill="#ff9800"/>` +
      `<path d="M-14 -12 q3 -2 6 0 M8 -12 q3 -2 6 0" stroke="#fff" stroke-width="2" fill="none"/>` +
      `<path d="M-36 -6 Q-30 0 -24 -5 Q-18 1 -12 -4 Q-6 2 0 -3 Q6 2 12 -4 Q18 1 24 -5 Q30 0 36 -6" fill="none" stroke="#ff7043" stroke-width="3"/>`,
  },
  {
    id: 'zhabka_mushky',
    slot: 'torso',
    name: 'Жилетка з мушками',
    price: 15,
    draw: () => {
      const fly = (x: number, y: number) =>
        `<ellipse cx="${x - 3}" cy="${y - 3}" rx="3.5" ry="2.2" fill="#e3f2fd" ${st(1)}/><ellipse cx="${x + 3}" cy="${y - 3}" rx="3.5" ry="2.2" fill="#e3f2fd" ${st(1)}/><circle cx="${x}" cy="${y}" r="2.6" fill="#263238"/>`;
      return (
        `<path d="M-47 -42 Q-30 -36 -10 -38 L-6 -2 Q-26 0 -40 -6 Q-50 -20 -47 -42 Z" fill="#7e57c2" ${stroke}/>` +
        `<path d="M47 -42 Q30 -36 10 -38 L6 -2 Q26 0 40 -6 Q50 -20 47 -42 Z" fill="#7e57c2" ${stroke}/>` +
        fly(-30, -22) + fly(-18, -12) + fly(28, -24) + fly(20, -10) +
        `<circle cx="-8" cy="-24" r="2.6" fill="#ffd54f" ${st(1.5)}/><circle cx="-7" cy="-12" r="2.6" fill="#ffd54f" ${st(1.5)}/>`
      );
    },
  },
  {
    id: 'zhabka_kuvshynka',
    slot: 'legs',
    name: 'Спідничка-кувшинка',
    price: 15,
    draw: () =>
      [-40, -24, -8, 8, 24, 40]
        .map((x, i) => `<path d="M${x * 0.9} -24 Q${x * 1.15 - 15} -10 ${x * 1.2} 2 Q${x * 1.15 + 15} -10 ${x * 0.9} -24 Z" fill="${i % 2 ? '#f8bbd0' : '#f48fb1'}" ${st(3)}/>`)
        .join('') +
      `<path d="M-46 -26 Q0 -18 46 -26" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      `<path d="M-46 -26 Q0 -18 46 -26" stroke="#66bb6a" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'zhabka_bulbashky',
    slot: 'legs',
    name: 'Шорти-бульбашки',
    price: 10,
    draw: () =>
      `<path d="M-46 -24 Q0 -16 46 -24 Q46 -8 34 0 Q14 -2 4 4 L0 -4 L-4 4 Q-14 -2 -34 0 Q-46 -8 -46 -24 Z" fill="#29b6f6" ${stroke}/>` +
      [[-30, -12, 5], [-18, -6, 3], [-24, -18, 3], [16, -12, 6], [30, -16, 3], [26, -4, 4], [0, -14, 3]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e1f5fe" stroke="#fff" stroke-width="1.5"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.3}" fill="#fff"/>`)
        .join(''),
  },
  {
    id: 'zhabka_kraplynky',
    slot: 'feet',
    name: 'Чобітки-краплинки',
    price: 15,
    draw: () =>
      [-1, 1]
        .map((o) => {
          const x = o * 34;
          return (
            `<path d="M${x} -40 Q${x + 18} -16 ${x + 16} -6 Q${x + 14} 4 ${x} 4 Q${x - 14} 4 ${x - 16} -6 Q${x - 18} -16 ${x} -40 Z" fill="#29b6f6" ${stroke}/>` +
            `<path d="M${x - 8} -14 Q${x - 8} -24 ${x - 3} -28" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>` +
            `<circle cx="${x + 5}" cy="-8" r="2" fill="${INK}"/><circle cx="${x - 3}" cy="-8" r="2" fill="${INK}"/><path d="M${x - 2} -3 q3 3 6 0" stroke="${INK}" stroke-width="1.8" fill="none"/>`
          );
        })
        .join(''),
  },
  {
    id: 'zhabka_lystochky',
    slot: 'feet',
    name: 'Шльопанці-листочки',
    price: 10,
    draw: () =>
      [-1, 1]
        .map((o) => {
          const x = o * 32;
          return (
            `<path d="M${x - 30} -2 Q${x} -16 ${x + 30} -2 Q${x} 10 ${x - 30} -2 Z" fill="#7cb342" ${st(3)}/>` +
            `<path d="M${x - 26} -2 L${x + 26} -2 M${x - 10} -2 l6 -5 M${x + 4} -2 l6 -5 M${x - 10} -2 l6 4 M${x + 4} -2 l6 4" stroke="#33691e" stroke-width="2"/>` +
            `<path d="M${x - 14} -4 Q${x} -20 ${x + 14} -4" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>` +
            `<path d="M${x - 14} -4 Q${x} -20 ${x + 14} -4" stroke="#ffeb3b" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
          );
        })
        .join(''),
  },

  // ======== кабан ========
  {
    id: 'kaban_yalynka',
    slot: 'torso',
    name: 'Костюм ялинки',
    price: 25,
    draw: () => {
      const tier = (top: number, base: number, w: number) =>
        `<path d="M2 ${top} L${2 + w} ${base} Q${2 + w * 0.5} ${base - 8} 2 ${base} Q${2 - w * 0.5} ${base - 8} ${2 - w} ${base} Z" fill="#2e7d32" ${stroke}/>`;
      return (
        tier(-150, -40, 94) + tier(-190, -96, 88) + tier(-226, -144, 82) +
        `<path d="M-60 -150 Q2 -120 70 -156 M-74 -100 Q2 -66 84 -104" stroke="#fdd835" stroke-width="4" fill="none" stroke-dasharray="1 9" stroke-linecap="round"/>` +
        [[-40, -160, '#e53935'], [40, -170, '#1e88e5'], [-50, -110, '#fdd835'], [20, -116, '#e53935'], [60, -112, '#ab47bc'], [-30, -60, '#1e88e5'], [30, -58, '#fdd835'], [-70, -54, '#e53935'], [74, -52, '#ff9800']]
          .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="8" fill="${c}" ${st(3)}/><circle cx="${+x - 2}" cy="${+y - 3}" r="2" fill="#fff"/>`)
          .join('')
      );
    },
  },
  {
    id: 'kaban_harbuz',
    slot: 'torso',
    name: 'Костюм гарбуза',
    price: 20,
    draw: () =>
      `<ellipse cx="2" cy="-128" rx="92" ry="88" fill="#fb8c00" ${stroke}/>` +
      `<path d="M2 -214 Q-30 -128 2 -42 M2 -214 Q34 -128 2 -42 M-40 -206 Q-84 -128 -40 -48 M44 -206 Q88 -128 44 -48" stroke="#e65100" stroke-width="5" fill="none"/>` +
      `<ellipse cx="2" cy="-128" rx="92" ry="88" fill="none" ${stroke}/>` +
      `<path d="M70 -190 Q100 -210 112 -188 Q96 -176 70 -190 Z" fill="#7cb342" ${st(3)}/>` +
      `<path d="M78 -186 q12 -6 24 -2" stroke="#558b2f" stroke-width="2" fill="none"/>` +
      `<path d="M66 -196 q14 -18 4 -30 q-8 10 4 18" stroke="#558b2f" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'kaban_ponchyky',
    slot: 'legs',
    name: 'Шорти-пончики',
    price: 15,
    draw: () =>
      `<path d="M-64 -80 L66 -80 Q72 -50 66 -28 L12 -28 L4 -44 L-4 -28 L-62 -28 Q-70 -50 -64 -80 Z" fill="#b3e5fc" ${stroke}/>` +
      [[-46, -40], [-24, -54], [30, -40], [50, -56], [-50, -64]]
        .map(
          ([x, y]) =>
            `<circle cx="${x}" cy="${y}" r="8" fill="#f48fb1" ${st(2)}/><circle cx="${x}" cy="${y}" r="3" fill="#b3e5fc" ${st(1.5)}/>` +
            `<path d="M${x - 5} ${y - 3} l2 -1 M${x + 3} ${y - 5} l1 2 M${x + 4} ${y + 3} l2 1" stroke="#fdd835" stroke-width="1.8"/>`,
        )
        .join(''),
  },
  {
    id: 'kaban_simeiky',
    slot: 'legs',
    name: 'Труси-сімейки з квіточками',
    price: 15,
    draw: () =>
      `<path d="M-64 -80 L66 -80 Q72 -50 66 -28 L12 -28 L4 -44 L-4 -28 L-62 -28 Q-70 -50 -64 -80 Z" fill="#e3f2fd" ${stroke}/>` +
      [[-48, -40], [-30, -52], [-16, -36], [24, -38], [40, -52], [54, -36]].map(([x, y]) => flower(x, y, 4, '#42a5f5')).join(''),
  },
  {
    id: 'kaban_behemoty',
    slot: 'feet',
    name: 'Черевики-бегемотики',
    price: 20,
    draw: () =>
      [-48, 22]
        .map((x) => {
          const c = x + 13;
          return (
            `<circle cx="${c + 6}" cy="-26" r="5" fill="#9575cd" ${st(3)}/><circle cx="${c + 18}" cy="-24" r="5" fill="#9575cd" ${st(3)}/>` +
            `<ellipse cx="${c}" cy="-10" rx="26" ry="15" fill="#9575cd" ${stroke}/>` +
            `<ellipse cx="${c - 14}" cy="-8" rx="13" ry="10" fill="#b39ddb" ${st(3)}/>` +
            `<ellipse cx="${c - 18}" cy="-10" rx="2" ry="3" fill="${INK}"/><ellipse cx="${c - 10}" cy="-10" rx="2" ry="3" fill="${INK}"/>` +
            `<circle cx="${c + 4}" cy="-16" r="4" fill="#fff" ${st(1.5)}/><circle cx="${c + 3}" cy="-16" r="2" fill="${INK}"/>` +
            `<circle cx="${c + 14}" cy="-15" r="4" fill="#fff" ${st(1.5)}/><circle cx="${c + 13}" cy="-15" r="2" fill="${INK}"/>`
          );
        })
        .join(''),
  },
  {
    id: 'kaban_sabo',
    slot: 'feet',
    name: 'Дерев’яні сабо',
    price: 15,
    draw: () =>
      [-48, 22]
        .map(
          (x) =>
            `<path d="M${x - 24} -14 Q${x - 26} -6 ${x - 18} 2 L${x + 32} 2 L${x + 32} -22 Q${x + 4} -30 ${x - 8} -18 Q${x - 18} -12 ${x - 24} -14 Z" fill="#e0a458" ${stroke}/>` +
            `<path d="M${x - 14} -6 Q${x + 6} -2 ${x + 30} -6" stroke="#b5762a" stroke-width="3" fill="none"/>` +
            flower(x + 10, -14, 3.5, '#e53935') +
            `<path d="M${x + 10} -10 v6" stroke="#43a047" stroke-width="2.5"/>`,
        )
        .join(''),
  },

  // ======== коза ========
  {
    id: 'koza_yedynorih',
    slot: 'torso',
    name: 'Піжама-єдиноріг',
    price: 25,
    draw: () =>
      `<ellipse cx="12" cy="-100" rx="79" ry="46" fill="#e1bee7" ${stroke}/>` +
      ['#e53935', '#ff9800', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#e53935', '#ff9800', '#fdd835']
        .map((c, i) => {
          const a = Math.PI * (1.18 + (i / 8) * 0.6);
          return `<circle cx="${(12 + Math.cos(a) * 74).toFixed(1)}" cy="${(-100 + Math.sin(a) * 42).toFixed(1)}" r="10" fill="${c}" ${st(3)}/>`;
        })
        .join('') +
      [[-20, -96], [20, -82], [50, -104], [-36, -78], [62, -80]]
        .map(([x, y]) => `<path d="M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z" fill="#fff59d" ${st(1.5)}/>`)
        .join('') +
      // a rainbow tail
      `<path d="M84 -116 Q112 -120 110 -86" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/>` +
      `<path d="M84 -116 Q112 -120 110 -86" stroke="#f06292" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<path d="M84 -116 Q112 -120 110 -86" stroke="#fff59d" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'koza_plashch',
    slot: 'torso',
    name: 'Плащ-капуста',
    price: 20,
    draw: () =>
      `<ellipse cx="12" cy="-100" rx="80" ry="46" fill="#9ccc65" ${stroke}/>` +
      [[-40, -96, 30], [-6, -116, 34], [36, -114, 34], [66, -92, 26], [10, -80, 34], [-36, -72, 22], [52, -70, 24]]
        .map(
          ([x, y, r]) =>
            `<path d="M${x - r} ${y + r * 0.5} Q${x - r} ${y - r * 0.8} ${x} ${y - r * 0.8} Q${x + r} ${y - r * 0.8} ${x + r} ${y + r * 0.5} Q${x} ${y + r * 0.2} ${x - r} ${y + r * 0.5} Z" fill="#c5e1a5" ${st(3)}/>` +
            `<path d="M${x} ${y + r * 0.3} V${y - r * 0.6} M${x} ${y - r * 0.1} l${-r * 0.4} ${-r * 0.3} M${x} ${y - r * 0.1} l${r * 0.4} ${-r * 0.3}" stroke="#7cb342" stroke-width="2.5" fill="none"/>`,
        )
        .join(''),
  },
  {
    id: 'koza_zhyrafa',
    slot: 'legs',
    name: 'Лосини-жирафа',
    price: 15,
    draw: () =>
      GOAT_LEGS.map(
        ([a, b]) =>
          `<rect x="${a - 4}" y="-74" width="${b - a + 8}" height="62" rx="5" fill="#ffe082" ${st(4)}/>` +
          [[0.15, -68, 0.45], [0.55, -56, 0.4], [0.1, -44, 0.5], [0.6, -32, 0.35], [0.2, -22, 0.45]]
            .map(([t, y, k]) => {
              const x = a - 2 + (b - a + 4) * t;
              const w = (b - a + 4) * k;
              return `<path d="M${x.toFixed(1)} ${y} l${(w * 0.5).toFixed(1)} -3 l${(w * 0.5).toFixed(1)} 3 l-1 7 l${(-w + 2).toFixed(1)} 1 Z" fill="#a1672c"/>`;
            })
            .join(''),
      ).join(''),
  },
  {
    id: 'koza_bubontsi',
    slot: 'legs',
    name: 'Штанці з бубонцями',
    price: 15,
    draw: () =>
      GOAT_LEGS.map(
        ([a, b]) =>
          `<path d="M${a - 5} -74 L${b + 5} -74 L${b + 8} -26 L${a - 8} -26 Z" fill="#7e57c2" ${st(4)}/>` +
          `<path d="M${a - 8} -26 L${(a + b) / 2 - 4} -18 L${(a + b) / 2 + 4} -18 L${b + 8} -26" fill="#7e57c2" ${st(3)}/>` +
          `<circle cx="${(a + b) / 2}" cy="-14" r="5" fill="#fdd835" ${st(2.5)}/><path d="M${(a + b) / 2 - 2} -12 h4" stroke="${INK}" stroke-width="1.5"/>`,
      ).join(''),
  },
  {
    id: 'koza_sovy',
    slot: 'feet',
    name: 'Тапочки-сови',
    price: 15,
    draw: () =>
      GOAT_LEGS.map(([a, b]) => {
        const c = (a + b) / 2;
        return (
          `<path d="M${c - 12} -16 l-2 -8 l7 5 M${c + 12} -16 l2 -8 l-7 5" fill="#8d6e63" ${st(2.5)}/>` +
          `<ellipse cx="${c}" cy="-7" rx="15" ry="11" fill="#8d6e63" ${st(3)}/>` +
          `<circle cx="${c - 6}" cy="-9" r="5.5" fill="#fff" ${st(1.5)}/><circle cx="${c + 6}" cy="-9" r="5.5" fill="#fff" ${st(1.5)}/>` +
          `<circle cx="${c - 6}" cy="-9" r="2.6" fill="${INK}"/><circle cx="${c + 6}" cy="-9" r="2.6" fill="${INK}"/>` +
          `<path d="M${c - 2} -4 L${c + 2} -4 L${c} 0 Z" fill="#ff9800"/>`
        );
      }).join(''),
  },
  {
    id: 'koza_kaloshi',
    slot: 'feet',
    name: 'Калоші-качечки',
    price: 15,
    draw: () =>
      GOAT_LEGS.map(([a, b]) => {
        const x = a - 4;
        const w = b - a + 8;
        return (
          `<path d="M${x} -16 H${x + w} V2 H${x - 6} Q${x - 10} -10 ${x} -16 Z" fill="#fdd835" ${st(3)}/>` +
          `<circle cx="${x - 4}" cy="-18" r="7" fill="#fdd835" ${st(3)}/>` +
          `<path d="M${x - 10} -19 L${x - 18} -16 L${x - 10} -14 Z" fill="#ff9800" ${st(2)}/>` +
          `<circle cx="${x - 5}" cy="-20" r="1.6" fill="${INK}"/>`
        );
      }).join(''),
  },

  // ======== їжачок ========
  {
    id: 'yizhachok_ananas',
    slot: 'torso',
    name: 'Костюм ананаса',
    price: 25,
    draw: () =>
      // the green crown sticks up behind the apple
      [[-30, 0], [-14, -8], [0, -12], [14, -8], [30, 0]]
        .map(([dx, r]) => `<path d="M${20 + dx * 0.5} -92 Q${20 + dx} ${-120 + r} ${20 + dx * 1.3} ${-136 - r} Q${20 + dx * 0.5 + 6} -112 ${20 + dx * 0.5 + 10} -92 Z" fill="#43a047" ${st(3)}/>`)
        .join('') +
      `<path d="M-62 -34 Q-60 -94 6 -94 Q74 -92 76 -34 Q60 -22 6 -24 Q-48 -22 -62 -34 Z" fill="#ffb300" ${stroke}/>` +
      [-24, -4, 16, 36].map((x) => `<path d="M${x - 12} -82 L${x + 12} -30" stroke="#e65100" stroke-width="2.5"/><path d="M${x + 12} -82 L${x - 12} -30" stroke="#e65100" stroke-width="2.5"/>`).join('') +
      `<path d="M-40 -70 L-28 -40 M52 -78 L62 -48 M52 -48 L62 -72" stroke="#e65100" stroke-width="2.5"/>` +
      `<path d="M-62 -34 Q-60 -94 6 -94 Q74 -92 76 -34 Q60 -22 6 -24 Q-48 -22 -62 -34 Z" fill="none" ${stroke}/>`,
  },
  {
    id: 'yizhachok_kyt',
    slot: 'torso',
    name: 'Костюм кита',
    price: 25,
    draw: () =>
      `<path d="M70 -40 Q92 -52 98 -76 Q86 -70 80 -60 Q84 -78 76 -88 Q72 -66 64 -52 Z" fill="#1e88e5" ${stroke}/>` +
      `<path d="M-62 -34 Q-60 -94 6 -94 Q74 -92 76 -34 Q60 -22 6 -24 Q-48 -22 -62 -34 Z" fill="#1e88e5" ${stroke}/>` +
      `<path d="M-50 -32 Q6 -18 70 -36" stroke="#bbdefb" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M-46 -40 Q6 -26 66 -44" stroke="#bbdefb" stroke-width="3" fill="none"/>` +
      // a water spout from the top
      `<path d="M44 -94 Q42 -112 34 -120 M44 -94 Q46 -114 56 -120 M44 -94 V-122" stroke="#4fc3f7" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<circle cx="32" cy="-124" r="3.5" fill="#4fc3f7"/><circle cx="58" cy="-124" r="3.5" fill="#4fc3f7"/><circle cx="44" cy="-127" r="3.5" fill="#4fc3f7"/>`,
  },
  {
    id: 'yizhachok_hryby',
    slot: 'legs',
    name: 'Шорти-грибочки',
    price: 15,
    draw: () => {
      const mush = (x: number, y: number) =>
        `<path d="M${x - 2} ${y} v6 h4 v-6 z" fill="#fff8e1" ${st(1.5)}/><path d="M${x - 7} ${y} Q${x} ${y - 9} ${x + 7} ${y} Z" fill="#e53935" ${st(1.5)}/><circle cx="${x - 2}" cy="${y - 3}" r="1.2" fill="#fff"/><circle cx="${x + 2}" cy="${y - 4}" r="1.2" fill="#fff"/>`;
      return (
        `<path d="M-62 -44 L76 -44 Q76 -16 64 -4 L18 -4 L10 -14 L2 -4 L-48 -4 Q-62 -16 -62 -44 Z" fill="#a5d6a7" ${stroke}/>` +
        [[-44, -30], [-24, -18], [30, -32], [50, -18], [62, -34], [-10, -34]].map(([x, y]) => mush(x, y)).join('')
      );
    },
  },
  {
    id: 'yizhachok_yabluchka',
    slot: 'legs',
    name: 'Штанці-яблучка',
    price: 15,
    draw: () =>
      `<path d="M-64 -46 L78 -46 Q80 -20 70 -2 L22 -2 L10 -18 L-2 -2 L-52 -2 Q-66 -20 -64 -46 Z" fill="#fff59d" ${stroke}/>` +
      [[-44, -28], [-24, -14], [34, -30], [56, -14], [6, -32]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#e53935" ${st(2)}/><path d="M${x} ${y - 6} l2 -4" stroke="#5d4037" stroke-width="2"/><path d="M${x + 2} ${y - 8} q5 -3 7 1 q-4 2 -7 -1 z" fill="#66bb6a"/>`)
        .join('') +
      `<path d="M-62 -40 H76" stroke="#e53935" stroke-width="4"/>`,
  },
  {
    id: 'yizhachok_barabany',
    slot: 'feet',
    name: 'Чобітки-барабани',
    price: 20,
    draw: () =>
      [-20, 30]
        .map(
          (c) =>
            `<path d="M${c - 15} -18 V0 Q${c} 5 ${c + 15} 0 V-18 Z" fill="#e53935" ${st(3)}/>` +
            `<path d="M${c - 15} -14 L${c - 7} -3 L${c} -14 L${c + 7} -3 L${c + 15} -14" stroke="#ffd54f" stroke-width="2.5" fill="none"/>` +
            `<ellipse cx="${c}" cy="-18" rx="15" ry="5" fill="#fffde7" ${st(3)}/>` +
            `<path d="M${c - 4} -20 L${c + 12} -32 M${c + 4} -20 L${c - 12} -32" stroke="#a1887f" stroke-width="3" stroke-linecap="round"/>` +
            `<circle cx="${c + 12}" cy="-32" r="2.5" fill="#fff"/><circle cx="${c - 12}" cy="-32" r="2.5" fill="#fff"/>`,
        )
        .join(''),
  },
  {
    id: 'yizhachok_zholudi',
    slot: 'feet',
    name: 'Черевики-жолуді',
    price: 15,
    draw: () =>
      [-20, 30]
        .map(
          (c) =>
            `<ellipse cx="${c - 4}" cy="-8" rx="18" ry="10" fill="#c68642" ${st(3)}/>` +
            `<path d="M${c + 2} -18 Q${c + 20} -18 ${c + 20} -8 Q${c + 20} 2 ${c + 2} 2 Z" fill="#795548" ${st(3)}/>` +
            `<path d="M${c + 6} -14 l8 8 M${c + 6} -6 l8 -8 M${c + 12} -16 l6 6" stroke="#4e342e" stroke-width="1.8"/>` +
            `<path d="M${c + 20} -10 q6 -2 6 -8" stroke="#4e342e" stroke-width="3" fill="none" stroke-linecap="round"/>` +
            `<ellipse cx="${c - 12}" cy="-11" rx="4" ry="2" fill="#fff" opacity=".5"/>`,
        )
        .join(''),
  },

  // ======== рак ========
  {
    id: 'rak_perlyny',
    slot: 'torso',
    name: 'Жилетка з перлинами',
    price: 20,
    draw: () =>
      `<path d="M-16 -98 Q-50 -96 -58 -60 Q-60 -40 -50 -28 L-18 -32 Z" fill="#6a1b9a" ${stroke}/>` +
      `<path d="M16 -98 Q50 -96 58 -60 Q60 -40 50 -28 L18 -32 Z" fill="#6a1b9a" ${stroke}/>` +
      [-90, -78, -66, -54, -42].map((y, i) => `<circle cx="${-17 - i * 0.2}" cy="${y}" r="4" fill="#fff" ${st(1.5)}/><circle cx="${17 + i * 0.2}" cy="${y}" r="4" fill="#fff" ${st(1.5)}/>`).join('') +
      `<path d="M-48 -60 q8 -6 14 0 M34 -60 q8 -6 14 0" stroke="#ce93d8" stroke-width="3" fill="none"/>`,
  },
  {
    id: 'rak_pidtiazhky',
    slot: 'torso',
    name: 'Підтяжки з якорями',
    price: 15,
    draw: () => {
      const anchor = (x: number, y: number) =>
        `<path d="M${x} ${y - 5} V${y + 5} M${x - 4} ${y - 2} H${x + 4} M${x - 5} ${y + 2} Q${x} ${y + 8} ${x + 5} ${y + 2}" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
      return (
        `<path d="M-30 -96 L-22 -22" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M-30 -96 L-22 -22" stroke="#1565c0" stroke-width="10" stroke-linecap="round"/>` +
        `<path d="M30 -96 L22 -22" stroke="${INK}" stroke-width="15" stroke-linecap="round"/><path d="M30 -96 L22 -22" stroke="#1565c0" stroke-width="10" stroke-linecap="round"/>` +
        anchor(-28, -76) + anchor(-25, -48) + anchor(28, -76) + anchor(25, -48) +
        `<rect x="-29" y="-30" width="12" height="9" rx="2" fill="#ffd54f" ${st(2)}/><rect x="17" y="-30" width="12" height="9" rx="2" fill="#ffd54f" ${st(2)}/>`
      );
    },
  },
  {
    id: 'rak_meduza',
    slot: 'legs',
    name: 'Спідниця-медуза',
    price: 20,
    draw: () =>
      [-40, -24, -8, 8, 24, 40]
        .map((x) => `<path d="M${x} -20 q-6 8 0 14 q6 6 0 14" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${x} -20 q-6 8 0 14 q6 6 0 14" stroke="#ce93d8" stroke-width="3.5" fill="none" stroke-linecap="round"/>`)
        .join('') +
      `<path d="M-54 -22 Q-50 -36 0 -36 Q50 -36 54 -22 Q46 -14 36 -22 Q27 -14 18 -22 Q9 -14 0 -22 Q-9 -14 -18 -22 Q-27 -14 -36 -22 Q-46 -14 -54 -22 Z" fill="#f48fb1" ${st(3.5)}/>` +
      `<circle cx="-30" cy="-30" r="2.5" fill="#fff"/><circle cx="28" cy="-30" r="2.5" fill="#fff"/>`,
  },
  {
    id: 'rak_koraly',
    slot: 'legs',
    name: 'Шорти-корали',
    price: 15,
    draw: () =>
      `<path d="M-54 -32 Q0 -26 54 -32 Q54 -14 44 -6 L8 -6 L0 -14 L-8 -6 L-44 -6 Q-54 -14 -54 -32 Z" fill="#4dd0e1" ${stroke}/>` +
      [[-34, -8], [30, -8], [-14, -10], [12, -10]]
        .map(([x, y]) => `<path d="M${x} ${y} V${y - 16} M${x} ${y - 8} l-5 -6 M${x} ${y - 12} l5 -5" stroke="#ff7043" stroke-width="3.5" stroke-linecap="round" fill="none"/>`)
        .join(''),
  },
  {
    id: 'rak_zirky',
    slot: 'feet',
    name: 'Капці-морські зірки',
    price: 15,
    draw: () =>
      (
        [
          [-64, -6, '#ff7043'],
          [-38, -2, '#ffca28'],
          [38, -2, '#ffca28'],
          [64, -6, '#ff7043'],
        ] as [number, number, string][]
      )
        .map(([x, y, c]) => {
          let d = '';
          for (let i = 0; i < 10; i++) {
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            const r = i % 2 ? 6 : 15;
            d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)} `;
          }
          return `<path d="${d}Z" fill="${c}" ${st(2.5)}/><circle cx="${x - 3}" cy="${y - 1}" r="1.6" fill="${INK}"/><circle cx="${x + 3}" cy="${y - 1}" r="1.6" fill="${INK}"/><circle cx="${x}" cy="${y - 8}" r="1.2" fill="#fff"/>`;
        })
        .join(''),
  },
  {
    id: 'rak_mushli',
    slot: 'feet',
    name: 'Капці-мушлі',
    price: 15,
    draw: () =>
      (
        [
          [-62, -6, '#f8bbd0'],
          [-38, -2, '#ffe0b2'],
          [38, -2, '#ffe0b2'],
          [62, -6, '#f8bbd0'],
        ] as [number, number, string][]
      )
        .map(
          ([x, y, c]) =>
            `<path d="M${x - 11} ${y + 4} Q${x - 12} ${y - 12} ${x} ${y - 13} Q${x + 12} ${y - 12} ${x + 11} ${y + 4} Z" fill="${c}" ${st(2.5)}/>` +
            `<path d="M${x} ${y + 4} V${y - 12} M${x - 6} ${y + 4} L${x - 4} ${y - 11} M${x + 6} ${y + 4} L${x + 4} ${y - 11}" stroke="#d81b60" stroke-width="1.5" opacity=".6"/>`,
        )
        .join(''),
  },

  // ======== солом'яний бичок ========
  {
    id: 'solombychok_korova',
    slot: 'torso',
    name: 'Костюм корови',
    price: 25,
    draw: () =>
      // a pink udder under the tummy
      `<path d="M-6 -78 Q-10 -56 10 -54 Q30 -56 26 -78 Z" fill="#f8bbd0" ${st(3)}/>` +
      `<path d="M0 -60 v8 M10 -58 v8 M20 -60 v8" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M0 -60 v8 M10 -58 v8 M20 -60 v8" stroke="#f48fb1" stroke-width="2.5" stroke-linecap="round"/>` +
      `<ellipse cx="8" cy="-120" rx="85" ry="53" fill="#fff" ${stroke}/>` +
      `<path d="M-30 -160 Q-6 -170 0 -146 Q-12 -128 -34 -136 Q-46 -150 -30 -160 Z M30 -120 Q60 -132 70 -108 Q62 -88 38 -94 Q22 -106 30 -120 Z M-44 -104 Q-24 -110 -20 -94 Q-30 -80 -46 -88 Z M40 -164 Q60 -168 66 -150 Q52 -142 40 -150 Z" fill="#212121"/>` +
      // a bell
      `<path d="M-44 -96 q-8 0 -9 12 q9 5 18 0 q-1 -12 -9 -12 z" fill="#f5c542" ${st(3)}/>`,
  },
  {
    id: 'solombychok_tyhr',
    slot: 'torso',
    name: 'Костюм тигра',
    price: 25,
    draw: () =>
      `<ellipse cx="8" cy="-120" rx="85" ry="53" fill="#ff9800" ${stroke}/>` +
      `<ellipse cx="0" cy="-86" rx="54" ry="16" fill="#fff3e0"/>` +
      [-46, -18, 10, 38, 64]
        .map((x) => `<path d="M${x - 6} -170 Q${x + 6} -150 ${x - 4} -130 Q${x + 4} -120 ${x} -110 L${x - 8} -130 Q${x - 2} -150 ${x - 12} -168 Z" fill="#212121"/>`)
        .join('') +
      `<path d="M86 -132 l14 -4 l-12 10 M84 -112 l16 2 l-14 6" fill="#212121" ${st(2)}/>` +
      `<ellipse cx="8" cy="-120" rx="85" ry="53" fill="none" ${stroke}/>`,
  },
  {
    id: 'solombychok_bermudy',
    slot: 'legs',
    name: 'Шорти-бермуди з пальмами',
    price: 15,
    draw: () =>
      BULL_LEGS.map(
        (x) =>
          `<path d="M${x - 6} -94 L${x + 26} -94 L${x + 28} -42 L${x - 8} -42 Z" fill="#ff8a65" ${st(4)}/>` +
          `<path d="M${x + 10} -46 Q${x + 8} -56 ${x + 12} -64" stroke="#6d4c41" stroke-width="3" fill="none"/>` +
          `<path d="M${x + 12} -64 q-8 -4 -12 2 M${x + 12} -64 q8 -4 12 2 M${x + 12} -64 q-2 -8 4 -10" stroke="#2e7d32" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      ).join(''),
  },
  {
    id: 'solombychok_misiatsi',
    slot: 'legs',
    name: 'Штани з місяцями',
    price: 15,
    draw: () =>
      BULL_LEGS.map(
        (x) =>
          `<rect x="${x - 4}" y="-92" width="28" height="74" rx="5" fill="#283593" ${st(4)}/>` +
          `<path d="M${x + 6} -60 a6 6 0 1 0 6 -8 a5 5 0 1 1 -6 8 Z" fill="#fff59d"/>` +
          `<path d="M${x + 12} -36 l1.5 3 l3 .5 l-2.3 2 l.6 3 l-2.8 -1.5 l-2.8 1.5 l.6 -3 l-2.3 -2 l3 -.5 z" fill="#fff59d"/>` +
          `<circle cx="${x + 4}" cy="-44" r="1.5" fill="#fff"/><circle cx="${x + 16}" cy="-52" r="1.5" fill="#fff"/>`,
      ).join(''),
  },
  {
    id: 'solombychok_vukha',
    slot: 'feet',
    name: 'Рожеві капці-вушка',
    price: 15,
    draw: () =>
      BULL_LEGS.map(
        (x) =>
          `<path d="M${x + 14} -14 Q${x + 34} -30 ${x + 40} -20 Q${x + 34} -10 ${x + 18} -8 Z" fill="#f48fb1" ${st(3)}/>` +
          `<path d="M${x + 18} -12 Q${x + 30} -22 ${x + 34} -19" stroke="#fce4ec" stroke-width="3" fill="none" stroke-linecap="round"/>` +
          `<ellipse cx="${x + 8}" cy="-7" rx="18" ry="10" fill="#f48fb1" ${st(3)}/>` +
          `<path d="M${x - 6} -10 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0" stroke="#fce4ec" stroke-width="2.5" fill="none"/>`,
      ).join(''),
  },
  {
    id: 'solombychok_pidkovy',
    slot: 'feet',
    name: 'Підкови з блискітками',
    price: 20,
    draw: () =>
      BULL_LEGS.map(
        (x) =>
          `<path d="M${x - 4} -18 L${x - 4} -4 Q${x - 4} 4 ${x + 10} 4 Q${x + 24} 4 ${x + 24} -4 L${x + 24} -18" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/>` +
          `<path d="M${x - 4} -18 L${x - 4} -4 Q${x - 4} 4 ${x + 10} 4 Q${x + 24} 4 ${x + 24} -4 L${x + 24} -18" stroke="#ffca28" stroke-width="6" fill="none" stroke-linecap="round"/>` +
          `<circle cx="${x - 4}" cy="-10" r="1.4" fill="${INK}"/><circle cx="${x + 24}" cy="-10" r="1.4" fill="${INK}"/>` +
          `<path d="M${x - 10} -28 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" fill="#fff59d" ${st(1)}/>`,
      ).join(''),
  },
];

export const SETS: Record<string, string> = {
  sobaka: 'sobaka_svetr sobaka_shtantsi sobaka_cherevychky',
  zhuchka: 'zhuchka_doshchovyk zhuchka_pelyustky zhuchka_cheshky',
  myshka: 'myshka_sukenka myshka_pantalonchyky myshka_tapky myshka_kostium_syru myshka_morozyvo myshka_parasolka myshka_tsukerky myshka_pechenky myshka_polunytsi',
  zhabka: 'zhabka_krug zhabka_plavky zhabka_lasty zhabka_stavok zhabka_mushky zhabka_kuvshynka zhabka_bulbashky zhabka_kraplynky zhabka_lystochky',
  kaban: 'kaban_tilnyashka kaban_shtany kaban_kopyttsia kaban_yalynka kaban_harbuz kaban_ponchyky kaban_simeiky kaban_behemoty kaban_sabo',
  koza: 'koza_sukni koza_hetry koza_tufli koza_yedynorih koza_plashch koza_zhyrafa koza_bubontsi koza_sovy koza_kaloshi',
  yizhachok: 'yizhachok_zhyletka yizhachok_shorty yizhachok_roliky yizhachok_ananas yizhachok_kyt yizhachok_hryby yizhachok_yabluchka yizhachok_barabany yizhachok_zholudi',
  rak: 'rak_frak rak_spidnychka rak_shkarpetky rak_perlyny rak_pidtiazhky rak_meduza rak_koraly rak_zirky rak_mushli',
  kit: 'kit_superkit kit_truselky kit_choboty',
  kishka: 'kishka_kofta kishka_khmarka kishka_cherevychky',
  solombychok: 'solombychok_kurtka solombychok_dzhynsy solombychok_butsy solombychok_korova solombychok_tyhr solombychok_bermudy solombychok_misiatsi solombychok_vukha solombychok_pidkovy',
  pivnyk: 'pivnyk_kurtka pivnyk_shtany pivnyk_platformy',
  zhuravel: 'zhuravel_maika zhuravel_shtany zhuravel_kloun',
};
