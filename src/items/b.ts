// Things of the heroes' wardrobe, group b: drawn for u = 100 (see wardrobe.ts). Every id is
// <hero>_<thing>; SETS gives each of this group's heroes everything it can wear.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** points along a quadratic curve (for beads, spikes and the like round a neck) */
const along = (n: number, x0: number, y0: number, cx: number, cy: number, x1: number, y1: number) =>
  Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const a = (1 - t) * (1 - t);
    const b = 2 * t * (1 - t);
    const c = t * t;
    return [a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1].map((v) => Math.round(v)) as [number, number];
  });

/** a bone lying along x from x0 to x1 at y */
const bone = (x0: number, x1: number, y: number, h: number, fill: string) => {
  const r = h * 0.75;
  const ends = [x0, x1].map((x) => `<circle cx="${x}" cy="${y - h / 2}" r="${r}" fill="${fill}" ${st(4)}/><circle cx="${x}" cy="${y + h / 2}" r="${r}" fill="${fill}" ${st(4)}/>`).join('');
  return ends + `<rect x="${x0}" y="${y - h / 2}" width="${x1 - x0}" height="${h}" fill="${fill}"/>` + `<path d="M${x0 + r * 0.6} ${y - h / 2} H${x1 - r * 0.6} M${x0 + r * 0.6} ${y + h / 2} H${x1 - r * 0.6}" ${st(4)}/>`;
};

/** a flower of round petals */
const flower = (x: number, y: number, r: number, petal: string, mid: string, n = 6) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(r * 0.62).toFixed(1)}" fill="${petal}" ${st(3)}/>`;
  }).join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="${mid}" ${st(3)}/>`;

export const ITEMS: Item[] = [
  // ================= myshka =================
  {
    id: 'myshka_syr',
    slot: 'head',
    name: 'Сирний капелюх',
    price: 10,
    draw: () =>
      `<path d="M-66 6 L56 6 L56 -62 Z" fill="#ffca28" ${stroke}/>` +
      `<path d="M56 -62 L74 -52 L74 14 L56 6 Z" fill="#f9a825" ${stroke}/>` +
      `<circle cx="28" cy="-12" r="10" fill="#f9a825" ${st(3)}/><circle cx="40" cy="-38" r="6" fill="#f9a825" ${st(3)}/><circle cx="-18" cy="-4" r="5" fill="#f9a825" ${st(3)}/><circle cx="66" cy="-14" r="5" fill="#e69500"/>`,
  },
  {
    id: 'myshka_naperstok',
    slot: 'head',
    name: 'Наперсток-шолом',
    price: 15,
    draw: () =>
      `<path d="M-50 8 L-42 -66 Q0 -96 42 -66 L50 8 Z" fill="#cfd8dc" ${stroke}/>` +
      [-60, -44, -28].map((y, r) => [-2, -1, 0, 1, 2].map((c) => `<circle cx="${c * 15 + (r % 2 ? 7 : 0)}" cy="${y}" r="4" fill="#90a4ae"/>`).join('')).join('') +
      `<rect x="-54" y="-10" width="108" height="20" rx="8" fill="#b0bec5" ${st(4)}/>` +
      `<path d="M-30 -62 Q-14 -74 4 -76" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'myshka_syrok',
    slot: 'mouth',
    name: 'Сир у зубах',
    price: 5,
    draw: () =>
      `<path d="M-34 12 L30 12 L30 -26 Z" fill="#ffca28" ${stroke}/>` +
      `<path d="M30 -26 L40 -20 L40 18 L30 12 Z" fill="#f9a825" ${st(4)}/>` +
      `<circle cx="12" cy="2" r="6" fill="#f9a825" ${st(3)}/><circle cx="22" cy="-12" r="3.5" fill="#f9a825"/>`,
  },
  {
    id: 'myshka_horoshok',
    slot: 'neck',
    name: 'Намисто з горошку',
    price: 10,
    draw: () =>
      along(9, -62, -14, 0, 40, 62, -14).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#7cb342" ${st(3)}/><circle cx="${x - 3}" cy="${y - 4}" r="3" fill="#c5e1a5"/>`).join('') +
      `<path d="M-22 20 Q0 70 22 20 Q0 34 -22 20 Z" fill="#558b2f" ${st(4)}/>` +
      `<circle cx="-8" cy="32" r="6" fill="#9ccc65"/><circle cx="6" cy="34" r="6" fill="#9ccc65"/>`,
  },
  // ================= sobaka =================
  {
    id: 'sobaka_korablyk',
    slot: 'head',
    name: 'Паперовий кораблик-шапка',
    price: 10,
    draw: () =>
      `<path d="M-40 -30 L0 -104 L40 -30 Z" fill="#f5f5f5" ${stroke}/>` +
      `<path d="M-78 -32 L78 -32 L58 6 L-58 6 Z" fill="#fafafa" ${stroke}/>` +
      `<path d="M-56 -20 H-10 M4 -20 H50 M-50 -8 H20 M30 -8 H46 M-14 -60 H14 M-20 -48 H22" stroke="#9e9e9e" stroke-width="4" stroke-linecap="round"/>` +
      `<rect x="-30" y="-24" width="18" height="12" fill="#bdbdbd"/>` +
      `<path d="M0 -104 L0 -96" ${st(4)}/>`,
  },
  {
    id: 'sobaka_ponchyky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-пончики',
    price: 15,
    draw: () =>
      [-36, 36]
        .map(
          (x) =>
            `<circle cx="${x}" cy="0" r="24" fill="none" stroke="${INK}" stroke-width="26"/>` +
            `<circle cx="${x}" cy="0" r="24" fill="none" stroke="#e0a458" stroke-width="18"/>` +
            `<circle cx="${x}" cy="-2" r="22" fill="none" stroke="#f48fb1" stroke-width="12"/>` +
            `<path d="M${x - 18} -14 l5 3 M${x + 4} -26 l6 1 M${x + 20} -10 l2 6 M${x - 24} 4 l1 6 M${x + 12} 16 l5 -2" stroke="#fff176" stroke-width="4" stroke-linecap="round"/>`,
        )
        .join('') + `<path d="M-10 -4 Q0 -12 10 -4" stroke="${INK}" stroke-width="7" fill="none"/>`,
  },
  {
    id: 'sobaka_hazeta',
    slot: 'mouth',
    name: 'Газета в зубах',
    price: 5,
    draw: () =>
      `<rect x="-56" y="-14" width="112" height="28" rx="6" fill="#f5f5f0" ${stroke}/>` +
      `<ellipse cx="56" cy="0" rx="8" ry="14" fill="#e0e0d8" ${st(4)}/><ellipse cx="56" cy="0" rx="3" ry="6" fill="none" ${st(2)}/>` +
      `<path d="M-46 -6 H-10 M-2 -6 H30 M-46 4 H6 M14 4 H40" stroke="#757575" stroke-width="3.5" stroke-linecap="round"/>` +
      `<rect x="-36" y="-14" width="18" height="28" fill="#e53935" fill-opacity=".8"/>`,
  },
  {
    id: 'sobaka_beidzh',
    slot: 'neck',
    name: 'Бейдж «ГАВ»',
    price: 15,
    draw: () =>
      `<path d="M-56 -16 L-10 40 M56 -16 L10 40" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M-56 -16 L-10 40 M56 -16 L10 40" stroke="#1e88e5" stroke-width="6" stroke-linecap="round"/>` +
      `<rect x="-34" y="36" width="68" height="52" rx="6" fill="#fff" ${stroke}/>` +
      `<rect x="-34" y="36" width="68" height="14" rx="6" fill="#1e88e5" ${st(4)}/>` +
      `<text x="0" y="78" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="${INK}">ГАВ</text>`,
  },
  // ================= zhabka =================
  {
    id: 'zhabka_lattia',
    slot: 'head',
    name: 'Латаття-капелюх',
    price: 15,
    draw: () =>
      `<path d="M0 0 L-6 16 Q-80 18 -84 -2 Q-80 -22 0 -24 Q80 -22 84 -2 Q80 18 6 16 Z" fill="#43a047" ${stroke}/>` +
      `<path d="M0 -4 L-50 -14 M0 -4 L50 -14 M0 -4 L-30 8 M0 -4 L30 8" stroke="#2e7d32" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M-30 -14 Q-40 -46 -14 -40 Q-10 -70 0 -76 Q10 -70 14 -40 Q40 -46 30 -14 Z" fill="#f48fb1" ${stroke}/>` +
      `<path d="M-14 -40 Q-6 -22 0 -16 Q6 -22 14 -40" stroke="${INK}" stroke-width="3" fill="none"/>` +
      `<circle cx="0" cy="-20" r="7" fill="#fdd835" ${st(3)}/>`,
  },
  {
    id: 'zhabka_vii',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Вії-красуні',
    price: 10,
    draw: () =>
      [-36, 36]
        .map((x) =>
          [-170, -145, -120, -97, -75]
            .map((d) => {
              const a = ((x < 0 ? d : -180 - d) * Math.PI) / 180;
              const bx = x + Math.cos(a) * 30;
              const by = Math.sin(a) * 30;
              const ex = x + Math.cos(a) * 52;
              const ey = Math.sin(a) * 52;
              return `<path d="M${bx.toFixed(0)} ${by.toFixed(0)} Q${(x + Math.cos(a) * 44).toFixed(0)} ${(Math.sin(a) * 44 - 4).toFixed(0)} ${ex.toFixed(0)} ${(ey - 6).toFixed(0)}" stroke="#1a1a1a" stroke-width="7" fill="none" stroke-linecap="round"/>`;
            })
            .join('') + `<path d="M${x - 32} 0 A32 32 0 0 1 ${x + 32} 0" stroke="#1a1a1a" stroke-width="7" fill="none" stroke-linecap="round"/>`,
        )
        .join(''),
  },
  {
    id: 'zhabka_mukha',
    slot: 'mouth',
    name: 'Муха на язиці',
    price: 10,
    draw: () =>
      `<path d="M4 -4 Q-40 18 -76 -2 Q-92 -14 -84 -28" stroke="${INK}" stroke-width="20" fill="none" stroke-linecap="round"/>` +
      `<path d="M4 -4 Q-40 18 -76 -2 Q-92 -14 -84 -28" stroke="#f06292" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="-94" cy="-50" rx="14" ry="10" fill="#cfe8ff" fill-opacity=".85" ${st(3)} transform="rotate(-30 -94 -50)"/>` +
      `<ellipse cx="-76" cy="-52" rx="14" ry="10" fill="#cfe8ff" fill-opacity=".85" ${st(3)} transform="rotate(30 -76 -52)"/>` +
      `<ellipse cx="-86" cy="-38" rx="12" ry="9" fill="#37474f" ${st(3)}/>` +
      `<circle cx="-94" cy="-40" r="4" fill="#e53935"/><circle cx="-84" cy="-42" r="4" fill="#e53935"/>`,
  },
  {
    id: 'zhabka_komaryky',
    slot: 'neck',
    name: 'Намисто з комариків',
    price: 15,
    draw: () =>
      `<path d="M-66 -16 Q0 36 66 -16" stroke="${INK}" stroke-width="4" fill="none"/>` +
      along(5, -48, -2, 0, 30, 48, -2)
        .map(
          ([x, y]) =>
            `<ellipse cx="${x - 7}" cy="${y + 2}" rx="8" ry="5" fill="#e3f2fd" fill-opacity=".9" ${st(2)} transform="rotate(-35 ${x - 7} ${y + 2})"/>` +
            `<ellipse cx="${x + 7}" cy="${y + 2}" rx="8" ry="5" fill="#e3f2fd" fill-opacity=".9" ${st(2)} transform="rotate(35 ${x + 7} ${y + 2})"/>` +
            `<ellipse cx="${x}" cy="${y + 12}" rx="5" ry="9" fill="#795548" ${st(2)}/>` +
            `<path d="M${x} ${y + 21} L${x} ${y + 32} M${x - 4} ${y + 14} l-8 8 M${x + 4} ${y + 14} l8 8" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` +
            `<circle cx="${x}" cy="${y + 2}" r="4" fill="#5d4037"/><circle cx="${x - 1.5}" cy="${y + 1}" r="1.3" fill="#fff"/>`,
        )
        .join(''),
  },
  // ================= kaban =================
  {
    id: 'kaban_kabachok',
    slot: 'head',
    name: 'Шапка-кабачок',
    price: 10,
    draw: () =>
      `<path d="M72 -40 Q90 -52 98 -44 Q96 -34 82 -30" fill="#8d6e63" ${st(4)}/>` +
      `<path d="M-70 6 Q-84 -40 -30 -56 Q30 -70 74 -44 Q92 -26 70 6 Z" fill="#7cb342" ${stroke}/>` +
      `<path d="M-60 -18 Q-20 -46 40 -50 M-56 -4 Q0 -32 60 -30 M-40 4 Q10 -16 66 -12" stroke="#c5e1a5" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-72 2 Q0 -10 72 2 L70 12 Q0 0 -72 12 Z" fill="#f1f8e9" ${st(4)}/>` +
      `<circle cx="-40" cy="-30" r="3" fill="#33691e"/><circle cx="20" cy="-46" r="3" fill="#33691e"/><circle cx="50" cy="-20" r="3" fill="#33691e"/>`,
  },
  {
    id: 'kaban_brovy',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Грізні брови',
    price: 10,
    draw: () =>
      `<path d="M-70 -14 Q-62 -52 -30 -46 Q-12 -42 0 -30 Q12 -42 30 -46 Q62 -52 70 -14 Q52 -28 30 -22 Q14 -16 0 -6 Q-14 -16 -30 -22 Q-52 -28 -70 -14 Z" fill="#212121" ${st(4)}/>` +
      `<path d="M-58 -40 l-8 -10 M-42 -46 l-2 -12 M-24 -44 l2 -12 M24 -44 l-2 -12 M42 -46 l2 -12 M58 -40 l8 -10" stroke="#212121" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'kaban_kachan',
    slot: 'mouth',
    name: 'Качан у зубах',
    price: 10,
    draw: () =>
      `<path d="M-46 0 Q-46 -16 -20 -16 L40 -14 Q56 -12 56 0 Q56 12 40 14 L-20 16 Q-46 16 -46 0 Z" fill="#fdd835" ${stroke}/>` +
      [-28, -12, 4, 20, 36].map((x) => `<path d="M${x} -14 V14" stroke="#f9a825" stroke-width="4"/>`).join('') +
      `<path d="M-40 -6 H52 M-40 6 H52" stroke="#f9a825" stroke-width="4"/>` +
      `<path d="M-40 -4 Q-70 -30 -86 -12 Q-66 -14 -48 6 Z" fill="#7cb342" ${st(4)}/>` +
      `<path d="M-40 4 Q-66 30 -88 18 Q-66 10 -44 -4 Z" fill="#9ccc65" ${st(4)}/>`,
  },
  {
    id: 'kaban_hryby',
    slot: 'neck',
    name: 'Намисто з грибів',
    price: 15,
    draw: () =>
      `<path d="M-68 -16 Q0 34 68 -16" stroke="#8d6e63" stroke-width="5" fill="none"/>` +
      along(5, -50, -4, 0, 30, 50, -4)
        .map(
          ([x, y], i) =>
            `<rect x="${x - 6}" y="${y + 4}" width="12" height="18" rx="5" fill="#fff8e1" ${st(3)}/>` +
            `<path d="M${x - 17} ${y + 8} Q${x - 16} ${y - 10} ${x} ${y - 10} Q${x + 16} ${y - 10} ${x + 17} ${y + 8} Z" fill="${i % 2 ? '#e53935' : '#8d4b25'}" ${st(3)}/>` +
            (i % 2 ? `<circle cx="${x - 5}" cy="${y - 2}" r="3" fill="#fff"/><circle cx="${x + 6}" cy="${y + 2}" r="2.5" fill="#fff"/>` : ''),
        )
        .join(''),
  },
  // ================= koza =================
  {
    id: 'koza_kapusta',
    slot: 'head',
    name: 'Капустяний капелюх',
    price: 10,
    draw: () =>
      `<path d="M-64 8 Q-74 -50 -20 -64 Q20 -76 52 -50 Q76 -24 64 8 Z" fill="#9ccc65" ${stroke}/>` +
      `<path d="M-44 4 Q-52 -40 -6 -50 Q32 -54 44 -24 Q50 -6 44 4" fill="#c5e1a5" ${st(4)}/>` +
      `<path d="M-20 2 Q-24 -26 2 -30 Q24 -28 22 2" fill="#e6f4c9" ${st(4)}/>` +
      `<path d="M-56 -10 Q-40 -20 -38 -40 M54 -16 Q40 -22 36 -40 M0 -30 V-6" stroke="#689f38" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'koza_romashka',
    slot: 'mouth',
    name: 'Ромашка в зубах',
    price: 5,
    draw: () =>
      `<path d="M10 2 Q-20 -6 -52 -34" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M10 2 Q-20 -6 -52 -34" stroke="#66bb6a" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-24 -10 Q-34 4 -46 0 Q-38 -14 -24 -10 Z" fill="#66bb6a" ${st(3)}/>` +
      Array.from({ length: 10 }, (_, i) => `<ellipse cx="-58" cy="-58" rx="7" ry="16" fill="#fff" ${st(3)} transform="rotate(${i * 36} -58 -40)"/>`).join('') +
      `<circle cx="-58" cy="-40" r="10" fill="#fdd835" ${st(3)}/>`,
  },
  {
    id: 'koza_dzvin',
    slot: 'neck',
    name: 'Величезний дзвін',
    price: 15,
    draw: () =>
      `<path d="M-50 -16 Q0 22 50 -16" stroke="${INK}" stroke-width="18" fill="none" stroke-linecap="round"/>` +
      `<path d="M-50 -16 Q0 22 50 -16" stroke="#1e88e5" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M-36 90 Q-36 14 0 14 Q36 14 36 90 L48 104 L-48 104 Z" fill="#ffc83d" ${stroke}/>` +
      `<path d="M-20 70 Q-20 34 -4 26" stroke="#fff3c4" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<rect x="-10" y="2" width="20" height="16" rx="5" fill="#c98a12" ${st(4)}/>` +
      `<circle cx="0" cy="110" r="12" fill="#c98a12" ${st(4)}/>` +
      `<path d="M-64 96 l-14 6 M-62 112 l-16 -2 M64 96 l14 6 M62 112 l16 -2" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  },
  // ================= yizhachok =================
  {
    id: 'yizhachok_hryb',
    slot: 'head',
    name: 'Гриб на голочках',
    price: 10,
    draw: () =>
      `<path d="M-16 6 L-12 -40 L12 -40 L16 6 Z" fill="#fff8e1" ${stroke}/>` +
      `<path d="M-58 -34 Q-54 -96 0 -98 Q54 -96 58 -34 Q0 -22 -58 -34 Z" fill="#8d4b25" ${stroke}/>` +
      `<path d="M-34 -76 Q-20 -88 -2 -88" stroke="#c07a45" stroke-width="7" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'yizhachok_lystok',
    slot: 'head',
    name: 'Листок-парасолька',
    price: 10,
    draw: () =>
      `<path d="M0 6 L0 -76" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` +
      `<path d="M0 6 L0 -76" stroke="#8d6e63" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-80 -70 Q-70 -84 -54 -84 Q-56 -104 -36 -108 Q-30 -132 -6 -130 Q0 -146 12 -130 Q34 -136 38 -110 Q60 -110 58 -86 Q76 -86 82 -70 Q40 -82 0 -76 Q-40 -82 -80 -70 Z" fill="#ff8f00" ${stroke}/>` +
      `<path d="M0 -76 L0 -126 M0 -84 L-32 -104 M0 -84 L34 -106 M0 -80 L-56 -82 M0 -80 L56 -86" stroke="#e65100" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'yizhachok_sunytsia',
    slot: 'mouth',
    name: 'Суничка в зубах',
    price: 5,
    draw: () =>
      `<path d="M-20 -6 Q-22 22 -6 34 Q10 22 8 -6 Q-6 -12 -20 -6 Z" fill="#e53935" ${st(4)}/>` +
      `<path d="M-22 -8 L-14 -16 L-6 -10 L2 -18 L10 -8 Q-6 0 -22 -8 Z" fill="#43a047" ${st(3)}/>` +
      `<circle cx="-10" cy="6" r="2" fill="#fff59d"/><circle cx="0" cy="12" r="2" fill="#fff59d"/><circle cx="-12" cy="18" r="2" fill="#fff59d"/><circle cx="-4" cy="24" r="2" fill="#fff59d"/><circle cx="2" cy="2" r="2" fill="#fff59d"/>`,
  },
  {
    id: 'yizhachok_khustka',
    slot: 'neck',
    name: 'Хустинка в горошок',
    price: 10,
    draw: () =>
      `<path d="M-50 -14 Q0 14 50 -14 L10 70 Q0 80 -8 68 Z" fill="#1e88e5" ${stroke}/>` +
      [[-24, 4], [0, 10], [22, 2], [-6, 32], [12, 30], [0, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`).join('') +
      `<circle cx="0" cy="0" r="10" fill="#1565c0" ${st(4)}/>`,
  },
  // ================= rak =================
  {
    id: 'rak_mushlia',
    slot: 'head',
    name: 'Мушля-капелюх',
    price: 15,
    draw: () =>
      `<path d="M-20 6 L-30 -2 L30 -2 L20 6 Z" fill="#f8bbd0" ${st(4)}/>` +
      `<path d="M-24 -2 Q-80 -20 -64 -66 Q-36 -104 0 -104 Q36 -104 64 -66 Q80 -20 24 -2 Z" fill="#f48fb1" ${stroke}/>` +
      `<path d="M0 -4 L0 -100 M-8 -4 L-34 -96 M-14 -4 L-58 -74 M-20 -4 L-70 -40 M8 -4 L34 -96 M14 -4 L58 -74 M20 -4 L70 -40" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>` +
      `<path d="M-44 -78 Q-30 -92 -14 -96" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'rak_kleshni',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-клешні',
    price: 15,
    draw: () =>
      [-36, 36]
        .map((x) => {
          const s = x < 0 ? -1 : 1;
          return (
            `<path d="M${x + s * 14} -22 Q${x + s * 34} -64 ${x + s * 54} -50 Q${x + s * 40} -46 ${x + s * 34} -30 Z" fill="#e64a19" ${st(4)}/>` +
            `<path d="M${x + s * 24} -18 Q${x + s * 56} -42 ${x + s * 64} -24 Q${x + s * 48} -26 ${x + s * 36} -12 Z" fill="#ff7043" ${st(4)}/>` +
            `<circle cx="${x}" cy="0" r="27" fill="#ffccbc" fill-opacity=".35" stroke="#e64a19" stroke-width="9"/>` +
            `<circle cx="${x}" cy="0" r="32" fill="none" ${st(3)}/>`
          );
        })
        .join('') + `<path d="M-8 -6 Q0 -14 8 -6" stroke="#e64a19" stroke-width="8" fill="none"/>`,
  },
  {
    id: 'rak_kokteil',
    slot: 'mouth',
    name: 'Соломинка з коктейлем',
    price: 15,
    draw: () =>
      `<path d="M0 0 L50 4" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M0 0 L50 4" stroke="#fff" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M12 1 l5 0 M26 2 l5 0 M40 3 l4 0" stroke="#e53935" stroke-width="6"/>` +
      `<g transform="translate(0 -30)"><path d="M24 34 L96 34 L64 74 Z" fill="#ffb74d" fill-opacity=".9" ${stroke}/>` +
      `<path d="M60 74 V104 M44 106 H76" ${st(6)}/>` +
      `<circle cx="92" cy="32" r="13" fill="#fff59d" ${st(3)}/><path d="M92 22 V42 M82 32 H102 M85 25 L99 39 M99 25 L85 39" stroke="#fbc02d" stroke-width="2"/>` +
      `<path d="M66 34 L74 -4" ${st(3)}/><path d="M50 -2 Q74 -26 98 -2 Z" fill="#ec407a" ${st(3)}/></g>`,
  },
  {
    id: 'rak_yakir',
    slot: 'neck',
    name: 'Якір на мотузці',
    price: 15,
    draw: () =>
      `<path d="M-56 -14 Q0 20 56 -14 M-16 6 L0 18 L16 6" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M-56 -14 Q0 20 56 -14 M-16 6 L0 18 L16 6" stroke="#e6c48a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="9 4"/>` +
      `<circle cx="0" cy="28" r="9" fill="none" stroke="${INK}" stroke-width="12"/><circle cx="0" cy="28" r="9" fill="none" stroke="#90a4ae" stroke-width="6"/>` +
      `<path d="M0 37 V92 M-18 50 H18 M-30 74 Q-28 96 0 96 Q28 96 30 74" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/>` +
      `<path d="M0 37 V92 M-18 50 H18 M-30 74 Q-28 96 0 96 Q28 96 30 74" stroke="#90a4ae" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M-38 68 L-30 74 L-24 64 M38 68 L30 74 L24 64" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  // ================= kit =================
  {
    id: 'kit_ninja',
    slot: 'head',
    name: 'Пов’язка кота-ніндзя',
    price: 15,
    draw: () =>
      `<path d="M58 16 Q90 0 112 18 Q92 22 70 28 Z" fill="#212121" ${st(4)}/>` +
      `<path d="M60 26 Q96 34 108 60 Q86 48 64 36 Z" fill="#212121" ${st(4)}/>` +
      `<path d="M-70 4 Q0 -14 70 4 L70 30 Q0 12 -70 30 Z" fill="#212121" ${stroke}/>` +
      `<circle cx="64" cy="20" r="9" fill="#424242" ${st(3)}/>` +
      `<path d="M0 0 L5 9 L14 4 L9 13 L18 18 L9 22 L14 32 L5 26 L0 35 L-5 26 L-14 32 L-9 22 L-18 18 L-9 13 L-14 4 L-5 9 Z" fill="#e0e0e0" ${st(2)} transform="translate(0 -1) scale(.8) translate(0 2)"/>` +
      `<circle cx="0" cy="14" r="3" fill="#212121"/>`,
  },
  {
    id: 'kit_skeletyky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-рибʼячі скелетики',
    price: 15,
    draw: () =>
      [-36, 36]
        .map((x) => {
          const s = x < 0 ? -1 : 1;
          const o = x + s * 30;
          return (
            `<path d="M${o} 0 H${o + s * 46}" ${st(5)}/>` +
            [10, 20, 30].map((d) => `<path d="M${o + s * d} -10 Q${o + s * (d + 4)} 0 ${o + s * d} 10" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('') +
            `<path d="M${o + s * 44} 0 L${o + s * 58} -14 L${o + s * 56} 0 L${o + s * 58} 14 Z" fill="#eceff1" ${st(3)}/>` +
            `<circle cx="${x}" cy="0" r="27" fill="#e0f7fa" fill-opacity=".35" stroke="#eceff1" stroke-width="9"/>` +
            `<circle cx="${x}" cy="0" r="32" fill="none" ${st(3)}/><circle cx="${x}" cy="0" r="22" fill="none" ${st(2)}/>`
          );
        })
        .join('') + `<path d="M-10 -4 Q0 -12 10 -4" stroke="#eceff1" stroke-width="8" fill="none"/><path d="M-10 -4 Q0 -12 10 -4" stroke="${INK}" stroke-width="2" fill="none"/>`,
  },
  {
    id: 'kit_smetana',
    slot: 'mouth',
    name: 'Сметанкові вуса',
    price: 10,
    draw: () =>
      `<path d="M0 -6 Q-16 -18 -38 -12 Q-58 -6 -62 8 Q-50 2 -42 10 Q-30 4 -22 12 Q-10 4 0 8 Q10 4 22 12 Q30 4 42 10 Q50 2 62 8 Q58 -6 38 -12 Q16 -18 0 -6 Z" fill="#fffdf5" ${st(4)}/>` +
      `<path d="M-44 10 Q-46 24 -40 26 Q-34 24 -38 10 M30 12 Q28 30 34 32 Q40 30 38 12" fill="#fffdf5" ${st(3)}/>` +
      `<path d="M8 10 Q14 24 22 16" fill="#f48fb1" ${st(3)}/>` +
      `<circle cx="-24" cy="-4" r="3" fill="#fff"/><circle cx="20" cy="-6" r="3" fill="#fff"/>`,
  },
  {
    id: 'kit_medalion',
    slot: 'neck',
    name: 'Медальйон-рибка',
    price: 20,
    draw: () =>
      along(13, -58, -14, 0, 34, 58, -14).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#ffd54f" ${st(2)}/>`).join('') +
      `<path d="M26 44 L46 30 L46 60 Z" fill="#ffc107" ${stroke}/>` +
      `<path d="M-38 44 Q-18 18 12 22 Q30 28 30 44 Q30 60 12 66 Q-18 70 -38 44 Z" fill="#ffd54f" ${stroke}/>` +
      `<circle cx="-20" cy="40" r="5" fill="#fff" ${st(2)}/><circle cx="-20" cy="40" r="2" fill="${INK}"/>` +
      `<path d="M-4 32 q8 12 0 24 M8 34 q6 10 0 20" stroke="#c99a1e" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-14 30 l6 -4" stroke="#fff8e1" stroke-width="4" stroke-linecap="round"/>`,
  },
  // ================= sirko =================
  {
    id: 'sirko_kovpak',
    slot: 'head',
    name: 'Нічний ковпак',
    price: 10,
    draw: () =>
      `<path d="M-60 6 Q-60 -60 0 -74 Q50 -80 76 -40 Q92 -10 104 20 L88 26 Q72 -16 50 -26 Q60 -6 60 6 Z" fill="#5c6bc0" ${stroke}/>` +
      `<path d="M-40 -42 Q0 -60 30 -60 M-14 -12 Q20 -40 52 -28 M70 -36 Q84 -16 90 4" stroke="#fff59d" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<rect x="-66" y="-10" width="132" height="20" rx="10" fill="#fff" ${st(4)}/>` +
      `<circle cx="98" cy="32" r="16" fill="#fff" ${st(4)}/>`,
  },
  {
    id: 'sirko_kovbasa',
    slot: 'mouth',
    name: 'Ковбаски в зубах',
    price: 10,
    draw: () =>
      [[-10, 4, -20], [6, 38, 10], [10, 76, -10]]
        .map(([x, y, r]) => `<rect x="${x - 26}" y="${y - 13}" width="52" height="26" rx="13" fill="#c0504d" ${stroke} transform="rotate(${r + 70} ${x} ${y})"/><path d="M${x - 4} ${y - 4} q6 -2 10 2" stroke="#e8a09a" stroke-width="4" fill="none" stroke-linecap="round"/>`)
        .join('') +
      `<circle cx="-2" cy="22" r="4" fill="#fff" ${st(2)}/><circle cx="8" cy="58" r="4" fill="#fff" ${st(2)}/>`,
  },
  {
    id: 'sirko_oshyinyk',
    slot: 'neck',
    name: 'Ошийник з кісточкою',
    price: 10,
    draw: () =>
      `<path d="M-66 -16 Q0 20 66 -16 L66 0 Q0 36 -66 0 Z" fill="#8d4b25" ${stroke}/>` +
      along(5, -50, -2, 0, 30, 50, -2).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#ffd54f"/>`).join('') +
      `<path d="M0 18 V30" ${st(4)}/>` +
      `<g transform="translate(0 40) rotate(-10)">${bone(-18, 18, 0, 12, '#ffd54f')}</g>`,
  },
  // ================= nevista =================
  {
    id: 'nevista_fata',
    slot: 'head',
    name: 'Фата до п’ят',
    price: 20,
    draw: () =>
      `<path d="M-56 -4 Q-110 120 -96 300 L-54 300 Q-60 140 -40 10 Z" fill="#fff" fill-opacity=".75" ${st(3)}/>` +
      `<path d="M56 -4 Q110 120 96 300 L54 300 Q60 140 40 10 Z" fill="#fff" fill-opacity=".75" ${st(3)}/>` +
      `<path d="M-60 6 Q-64 -40 0 -46 Q64 -40 60 6 Q0 -14 -60 6 Z" fill="#fff" fill-opacity=".8" ${st(3)}/>` +
      [-52, -30, -8, 14, 36, 56].map((x, i) => flower(x, -16 - Math.round(Math.sin(((i + 0.5) / 6) * Math.PI) * 14), 8, '#fff', '#fdd835', 5)).join(''),
  },
  {
    id: 'nevista_romashky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-ромашки',
    price: 15,
    draw: () =>
      [-36, 36]
        .map(
          (x) =>
            Array.from({ length: 12 }, (_, i) => `<ellipse cx="${x}" cy="-36" rx="8" ry="13" fill="#fff" ${st(3)} transform="rotate(${i * 30} ${x} 0)"/>`).join('') +
            `<circle cx="${x}" cy="0" r="26" fill="#fff59d" fill-opacity=".3" stroke="#fdd835" stroke-width="9"/>`,
        )
        .join('') + `<path d="M-10 -4 Q0 -12 10 -4" stroke="#fdd835" stroke-width="7" fill="none"/>`,
  },
  {
    id: 'nevista_korovai',
    slot: 'mouth',
    name: 'Шматок короваю',
    price: 10,
    draw: () =>
      `<path d="M-30 6 L34 -6 Q46 30 34 46 Q0 52 -30 6 Z" fill="#fff3d6" ${stroke}/>` +
      `<path d="M34 -6 Q52 16 34 46 L44 48 Q62 16 44 -10 Z" fill="#c8812f" ${stroke}/>` +
      `<path d="M-30 6 L34 -6 L44 -10 L-24 -2 Z" fill="#e2a24a" ${st(4)}/>` +
      `<circle cx="-6" cy="12" r="5" fill="#fff3d6" ${st(3)}/><circle cx="4" cy="8" r="5" fill="#fff3d6" ${st(3)}/>` +
      `<circle cx="10" cy="24" r="2.5" fill="#e0c08a"/><circle cx="20" cy="34" r="2.5" fill="#e0c08a"/><circle cx="0" cy="30" r="2" fill="#e0c08a"/>` +
      `<circle cx="-16" cy="44" r="3" fill="#e2a24a"/><circle cx="-4" cy="56" r="2.5" fill="#e2a24a"/>`,
  },
  {
    id: 'nevista_kalyna',
    slot: 'neck',
    name: 'Калинове намисто',
    price: 15,
    draw: () =>
      along(13, -60, -14, 0, 36, 60, -14).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#d32f2f" ${st(3)}/><circle cx="${x - 2}" cy="${y - 3}" r="2" fill="#fff"/>`).join('') +
      `<path d="M0 16 Q-30 10 -36 34 Q-10 40 0 16 Z" fill="#43a047" ${st(3)}/><path d="M0 16 Q30 10 36 34 Q10 40 0 16 Z" fill="#43a047" ${st(3)}/>` +
      [[0, 26], [-10, 34], [10, 34], [0, 42], [-18, 42], [18, 42], [-8, 50], [8, 50], [0, 58]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#e53935" ${st(3)}/><circle cx="${x - 2}" cy="${y - 3}" r="2" fill="#fff"/>`)
        .join(''),
  },
];

export const SETS: Record<string, string> = {
  myshka: 'myshka_syr myshka_naperstok myshka_syrok myshka_horoshok bant',
  sobaka: 'sobaka_korablyk sobaka_ponchyky sobaka_hazeta sobaka_beidzh',
  zhabka: 'zhabka_lattia zhabka_vii zhabka_mukha zhabka_komaryky',
  kaban: 'kaban_kabachok kaban_brovy kaban_kachan kaban_hryby piratska',
  koza: 'koza_kapusta koza_romashka koza_dzvin vinok',
  yizhachok: 'yizhachok_hryb yizhachok_lystok yizhachok_sunytsia yizhachok_khustka',
  rak: 'rak_mushlia rak_kleshni rak_kokteil rak_yakir vusa',
  kit: 'kit_ninja kit_skeletyky kit_smetana kit_medalion tsylindr',
  sirko: 'sirko_kovpak sirko_kovbasa sirko_oshyinyk monokl',
  nevista: 'nevista_fata nevista_romashky nevista_korovai nevista_kalyna namysto',
};
