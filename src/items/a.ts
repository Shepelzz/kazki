// Things of the heroes' wardrobe, group a: drawn for u = 100 (see wardrobe.ts). Every id is
// <hero>_<thing>; SETS gives each of this group's heroes everything it can wear.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** points along an arc round the neck: n points from the left to the right, sagging by `sag` */
const along = (n: number, w: number, sag: number, y0 = -16) =>
  Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const x = -w + 2 * w * t;
    return [x, y0 + sag * (1 - (2 * t - 1) ** 2)] as [number, number];
  });

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

/** a music note */
const note = (x: number, y: number, c: string) =>
  `<ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="${c}" ${st(3)} transform="rotate(-20 ${x} ${y})"/>` +
  `<path d="M${x + 8} ${y - 2} V${y - 34} Q${x + 18} ${y - 26} ${x + 22} ${y - 18}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`;

/** a bagel */
const bublyk = (x: number, y: number, r: number) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#e0a458" ${st(3)}/>` +
  `<circle cx="${x}" cy="${y}" r="${(r * 0.36).toFixed(1)}" fill="#fff3d6" ${st(3)}/>` +
  `<circle cx="${x - r * 0.55}" cy="${y - r * 0.4}" r="1.8" fill="${INK}"/><circle cx="${x + r * 0.5}" cy="${y - r * 0.5}" r="1.8" fill="${INK}"/><circle cx="${x + r * 0.2}" cy="${y + r * 0.62}" r="1.8" fill="${INK}"/>`;

export const ITEMS: Item[] = [
  // ======== дід ========
  {
    id: 'did_ripka',
    slot: 'head',
    name: 'Ріпка-капелюх',
    price: 15,
    draw: () =>
      `<path d="M-6 -92 Q-40 -120 -46 -168 Q-14 -150 -4 -96 Z" fill="#66bb6a" ${st(4)}/>` +
      `<path d="M6 -92 Q40 -120 48 -164 Q14 -150 4 -96 Z" fill="#43a047" ${st(4)}/>` +
      `<path d="M0 -94 Q-8 -140 0 -184 Q10 -140 4 -94 Z" fill="#7cb342" ${st(4)}/>` +
      `<ellipse cx="0" cy="-46" rx="64" ry="52" fill="#fff8e1" ${stroke}/>` +
      `<path d="M-63 -52 Q-58 -96 0 -98 Q58 -96 63 -52 Q30 -40 0 -46 Q-30 -40 -63 -52 Z" fill="#ab47bc" ${st(4)}/>` +
      `<path d="M-30 -20 q6 6 14 4 M18 -14 q8 4 14 -2" stroke="#d7ccc8" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'did_lupy',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-лупи',
    price: 15,
    draw: () =>
      [-38, 38]
        .map(
          (x) =>
            `<circle cx="${x}" cy="0" r="36" fill="#e3f2fd" ${st(8)}/>` +
            `<circle cx="${x}" cy="2" r="24" fill="#fff" ${st(3)}/>` +
            `<circle cx="${x + (x < 0 ? 4 : -4)}" cy="4" r="13" fill="#2b1a10"/><circle cx="${x + (x < 0 ? 8 : 0)}" cy="-2" r="5" fill="#fff"/>`,
        )
        .join('') +
      `<path d="M-6 -6 Q0 -14 6 -6" stroke="${INK}" stroke-width="7" fill="none"/>` +
      `<path d="M-74 -4 L-90 -10 M74 -4 L90 -10" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`,
  },
  {
    id: 'did_lulka',
    slot: 'mouth',
    name: 'Люлька',
    price: 10,
    draw: () =>
      `<path d="M-4 0 L56 30" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M-4 0 L56 30" stroke="#8d6e63" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M52 6 L90 6 L86 44 Q71 56 56 44 Z" fill="#6d4c41" ${stroke}/>` +
      `<ellipse cx="71" cy="6" rx="19" ry="6" fill="#3e2723" ${st(3)}/>` +
      `<circle cx="84" cy="-14" r="9" fill="#eceff1" ${st(3)}/><circle cx="102" cy="-34" r="12" fill="#eceff1" ${st(3)}/><circle cx="96" cy="-64" r="15" fill="#eceff1" ${st(3)}/>`,
  },
  {
    id: 'did_tsybulia',
    slot: 'neck',
    name: 'Цибуляне намисто',
    price: 10,
    draw: () =>
      `<path d="M-74 -16 Q0 56 74 -16" stroke="#a1887f" stroke-width="5" fill="none"/>` +
      along(5, 60, 40, -8)
        .map(
          ([x, y]) =>
            `<path d="M${x} ${y - 10} Q${x + 22} ${y + 10} ${x + 14} ${y + 26} Q${x} ${y + 36} ${x - 14} ${y + 26} Q${x - 22} ${y + 10} ${x} ${y - 10} Z" fill="#f2b84b" ${st(4)}/>` +
            `<path d="M${x} ${y - 10} q-4 -10 2 -14" stroke="#7cb342" stroke-width="5" fill="none" stroke-linecap="round"/>` +
            `<path d="M${x - 4} ${y + 2} Q${x - 8} ${y + 16} ${x - 4} ${y + 28}" stroke="#c98a12" stroke-width="3" fill="none"/>`,
        )
        .join(''),
  },

  // ======== баба ========
  {
    id: 'baba_kastrulia',
    slot: 'head',
    name: 'Каструля-капелюх',
    price: 15,
    draw: () =>
      `<path d="M-74 -46 Q-96 -46 -92 -30 Q-88 -20 -66 -24" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M74 -46 Q96 -46 92 -30 Q88 -20 66 -24" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M-64 8 L-60 -68 L60 -68 L64 8 Z" fill="#e53935" ${stroke}/>` +
      `<circle cx="-34" cy="-40" r="8" fill="#fff"/><circle cx="0" cy="-20" r="8" fill="#fff"/><circle cx="32" cy="-44" r="8" fill="#fff"/><circle cx="-30" cy="-6" r="6" fill="#fff"/><circle cx="36" cy="-10" r="6" fill="#fff"/>` +
      `<rect x="-70" y="-6" width="140" height="14" rx="7" fill="#c62828" ${st(4)}/>` +
      `<path d="M-64 -66 Q0 -104 64 -66 Z" fill="#ef5350" ${stroke}/>` +
      `<rect x="-12" y="-104" width="24" height="16" rx="7" fill="#424242" ${st(4)}/>` +
      `<path d="M-30 -110 q-6 -14 0 -26 M30 -110 q6 -14 0 -26" stroke="#b0bec5" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'baba_pyrizhok',
    slot: 'mouth',
    name: 'Пиріжок у зубах',
    price: 10,
    draw: () =>
      `<path d="M-46 14 Q-44 -24 0 -26 Q44 -24 46 14 Q0 24 -46 14 Z" fill="#f0b45a" ${stroke}/>` +
      `<path d="M-34 -10 q6 -8 12 0 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0 q6 -8 12 0" stroke="#c98a2e" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="-10" cy="4" rx="10" ry="4" fill="#ffe0a3"/>` +
      `<path d="M-20 -36 q-8 -12 0 -24 M0 -38 q-8 -12 0 -24 M20 -36 q-8 -12 0 -24" stroke="#cfd8dc" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'baba_bublyky',
    slot: 'neck',
    name: 'Намисто з бубликів',
    price: 15,
    draw: () =>
      `<path d="M-78 -12 Q0 64 78 -12" stroke="#8d6e63" stroke-width="4" fill="none"/>` +
      along(5, 68, 44, -4)
        .map(([x, y]) => bublyk(x, y, 23))
        .join(''),
  },

  // ======== колобок ========
  {
    id: 'kolobok_maslo',
    slot: 'head',
    name: 'Шматочок масла',
    price: 10,
    draw: () =>
      `<path d="M-46 4 Q-50 -4 -40 -6 L40 -6 Q50 -4 46 4 Q50 16 40 14 Q34 30 26 14 Q10 18 -2 12 Q-8 26 -16 12 Q-30 18 -40 14 Q-52 14 -46 4 Z" fill="#fff59d" ${st(4)}/>` +
      `<path d="M-36 -44 L-20 -60 L48 -60 L32 -44 Z" fill="#fffde7" ${st(4)}/>` +
      `<path d="M32 -44 L48 -60 L48 -14 L32 2 Z" fill="#fdd835" ${st(4)}/>` +
      `<rect x="-36" y="-44" width="68" height="46" fill="#fff176" ${st(4)}/>` +
      `<path d="M-26 -34 h18" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'kolobok_bublyky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-бублики',
    price: 15,
    draw: () =>
      [-38, 38]
        .map(
          (x) =>
            `<circle cx="${x}" cy="0" r="36" fill="none" stroke="${INK}" stroke-width="20"/>` +
            `<circle cx="${x}" cy="0" r="36" fill="none" stroke="#e0a458" stroke-width="14"/>` +
            `<circle cx="${x - 20}" cy="-28" r="2" fill="${INK}"/><circle cx="${x + 26}" cy="-22" r="2" fill="${INK}"/><circle cx="${x + 30}" cy="20" r="2" fill="${INK}"/><circle cx="${x - 26}" cy="24" r="2" fill="${INK}"/><circle cx="${x}" cy="-36" r="2" fill="${INK}"/>`,
        )
        .join('') +
      `<path d="M-6 -6 Q0 -12 6 -6" stroke="${INK}" stroke-width="7" fill="none"/>`,
  },
  {
    id: 'kolobok_harmoshka',
    slot: 'mouth',
    name: 'Губна гармошка',
    price: 15,
    draw: () =>
      `<rect x="-48" y="-12" width="96" height="26" rx="6" fill="#cfd8dc" ${stroke}/>` +
      `<rect x="-48" y="-12" width="96" height="8" rx="4" fill="#90a4ae" ${st(3)}/>` +
      Array.from({ length: 7 }, (_, i) => `<rect x="${-40 + i * 12}" y="2" width="7" height="7" rx="2" fill="${INK}"/>`).join('') +
      note(60, -24, '#e53935') +
      note(84, -56, '#1e88e5') +
      note(-70, -36, '#43a047'),
  },

  // ======== заєць ========
  {
    id: 'zayets_morkva',
    slot: 'head',
    name: 'Морквина за вухом',
    price: 10,
    draw: () =>
      `<g transform="translate(54 -76) rotate(35)">` +
      `<path d="M-2 -62 Q-12 -84 -24 -88 M2 -62 Q4 -88 0 -98 M6 -62 Q16 -80 28 -84" stroke="#43a047" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      `<path d="M-16 -60 Q0 -68 16 -60 L3 52 Q0 58 -3 52 Z" fill="#ff8f00" ${stroke}/>` +
      `<path d="M-10 -36 h8 M4 -14 h7 M-7 10 h7 M2 30 h4" stroke="#e65100" stroke-width="4" stroke-linecap="round"/></g>`,
  },
  {
    id: 'zayets_binokl',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Бінокль',
    price: 20,
    draw: () =>
      `<path d="M-60 26 Q-70 80 -40 110 M60 26 Q70 80 40 110" stroke="#8d6e63" stroke-width="5" fill="none"/>` +
      `<rect x="-14" y="-14" width="28" height="22" rx="6" fill="#37474f" ${st(4)}/>` +
      [-36, 36]
        .map(
          (x) =>
            `<circle cx="${x}" cy="0" r="30" fill="#455a64" ${stroke}/>` +
            `<circle cx="${x}" cy="0" r="18" fill="#81d4fa" ${st(4)}/>` +
            `<path d="M${x - 8} -8 l8 -4" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
        )
        .join(''),
  },
  {
    id: 'zayets_kapusta',
    slot: 'mouth',
    name: 'Капустяний листок',
    price: 5,
    draw: () =>
      `<path d="M-6 0 Q-20 -40 -60 -34 Q-90 -20 -82 12 Q-74 44 -40 40 Q-16 34 -6 0 Z" fill="#9ccc65" ${stroke}/>` +
      `<path d="M-6 0 Q-40 -6 -70 -6 M-30 -4 Q-44 -20 -54 -26 M-34 -4 Q-46 14 -58 24" stroke="#dcedc8" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'zayets_sekundomir',
    slot: 'neck',
    name: 'Секундомір',
    price: 15,
    draw: () =>
      `<path d="M-50 -16 L-4 26 M50 -16 L4 26" stroke="#1e88e5" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<rect x="-7" y="18" width="14" height="12" rx="3" fill="#b0bec5" ${st(3)}/>` +
      `<circle cx="0" cy="58" r="30" fill="#cfd8dc" ${stroke}/>` +
      `<circle cx="0" cy="58" r="22" fill="#fff" ${st(3)}/>` +
      `<path d="M0 58 L0 42 M0 58 L12 64" stroke="#e53935" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M0 38 v4 M20 58 h-4 M0 78 v-4 M-20 58 h4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  },

  // ======== вовк ========
  {
    id: 'vovk_bandana',
    slot: 'head',
    name: 'Бандана',
    price: 15,
    draw: () =>
      `<path d="M58 -8 L100 -24 L94 8 Z" fill="#d32f2f" ${st(4)}/><path d="M58 -4 L96 18 L74 34 Z" fill="#d32f2f" ${st(4)}/>` +
      `<path d="M-66 8 Q-66 -56 0 -62 Q66 -56 66 8 Q0 -10 -66 8 Z" fill="#e53935" ${stroke}/>` +
      `<circle cx="-30" cy="-30" r="5" fill="#fff"/><circle cx="0" cy="-44" r="5" fill="#fff"/><circle cx="28" cy="-28" r="5" fill="#fff"/><circle cx="-44" cy="-6" r="4" fill="#fff"/><circle cx="44" cy="-6" r="4" fill="#fff"/><circle cx="0" cy="-16" r="4" fill="#fff"/>` +
      `<circle cx="62" cy="-2" r="11" fill="#c62828" ${st(4)}/>`,
  },
  {
    id: 'vovk_ovechka',
    slot: 'head',
    name: 'Овеча шкурка',
    price: 20,
    draw: () =>
      `<ellipse cx="-66" cy="2" rx="12" ry="24" fill="#ffccbc" ${st(4)} transform="rotate(30 -66 2)"/>` +
      `<ellipse cx="66" cy="2" rx="12" ry="24" fill="#ffccbc" ${st(4)} transform="rotate(-30 66 2)"/>` +
      [
        [-48, -10, 24],
        [-26, -40, 26],
        [6, -54, 28],
        [36, -38, 26],
        [52, -10, 22],
        [-16, -10, 26],
        [20, -12, 26],
      ]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fafafa" ${st(4)}/>`)
        .join('') +
      `<path d="M-20 -30 q6 -8 12 0 M14 -36 q6 -8 12 0 M-4 -6 q6 -8 12 0" stroke="#bdbdbd" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'vovk_lantsyug',
    slot: 'neck',
    name: 'Золотий ланцюг',
    price: 25,
    draw: () =>
      along(13, 64, 46, -14)
        .map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${i % 2 ? 6 : 10}" ry="${i % 2 ? 10 : 6}" fill="none" stroke="#f9a825" stroke-width="6"/>`)
        .join('') +
      `<path d="M-14 42 L14 42 Q12 80 0 92 Q-12 80 -14 42 Z" fill="#ffd54f" ${stroke}/>` +
      `<path d="M-4 52 Q-4 70 0 80" stroke="#fff8e1" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'vovk_kistka',
    slot: 'mouth',
    name: 'Кісточка',
    price: 10,
    draw: () =>
      `<g transform="rotate(-8)">` +
      `<rect x="-44" y="-8" width="88" height="16" fill="#fff8e1" ${st(4)}/>` +
      `<circle cx="-46" cy="-10" r="12" fill="#fff8e1" ${st(4)}/><circle cx="-46" cy="10" r="12" fill="#fff8e1" ${st(4)}/>` +
      `<circle cx="46" cy="-10" r="12" fill="#fff8e1" ${st(4)}/><circle cx="46" cy="10" r="12" fill="#fff8e1" ${st(4)}/>` +
      `<rect x="-40" y="-6" width="80" height="12" fill="#fff8e1"/></g>`,
  },

  // ======== ведмідь ========
  {
    id: 'vedmid_horshchyk',
    slot: 'head',
    name: 'Горщик меду',
    price: 20,
    draw: () =>
      `<path d="M-56 -6 Q-74 -56 -40 -96 L40 -96 Q74 -56 56 -6 Z" fill="#c1693c" ${stroke}/>` +
      `<rect x="-36" y="-108" width="72" height="16" rx="6" fill="#a0522d" ${st(4)}/>` +
      `<rect x="-62" y="-10" width="124" height="18" rx="8" fill="#a0522d" ${st(4)}/>` +
      `<path d="M-50 4 Q-52 30 -44 34 Q-36 30 -38 6 Q-20 8 -16 6 Q-18 46 -8 48 Q2 44 -2 8 L30 8 Q28 26 36 28 Q44 24 42 6 Z" fill="#ffb300" ${st(4)}/>` +
      `<text x="0" y="-42" font-family="sans-serif" font-weight="900" font-size="30" text-anchor="middle" fill="#fff3c4">МЕД</text>`,
  },
  {
    id: 'vedmid_bdzhola',
    slot: 'face',
    name: 'Бджілка на носі',
    price: 10,
    draw: () =>
      `<g transform="translate(4 52) scale(1.5)">` +
      `<path d="M-60 -10 q-10 -20 -24 -10 q-10 -20 -24 -6" stroke="${INK}" stroke-width="3" stroke-dasharray="6 6" fill="none"/>` +
      `<ellipse cx="-6" cy="-22" rx="12" ry="16" fill="#e1f5fe" fill-opacity=".85" ${st(3)} transform="rotate(-25 -6 -22)"/>` +
      `<ellipse cx="10" cy="-22" rx="12" ry="16" fill="#e1f5fe" fill-opacity=".85" ${st(3)} transform="rotate(25 10 -22)"/>` +
      `<ellipse cx="0" cy="0" rx="24" ry="16" fill="#fdd835" ${st(4)}/>` +
      `<path d="M-8 -15 V15 M6 -15 V15" stroke="${INK}" stroke-width="6"/>` +
      `<path d="M24 0 l10 2 l-10 3" fill="${INK}" ${st(2)}/>` +
      `<circle cx="-15" cy="-3" r="3" fill="${INK}"/></g>`,
  },
  {
    id: 'vedmid_lozhka',
    slot: 'mouth',
    name: 'Ложка меду',
    price: 10,
    draw: () =>
      `<g transform="scale(1.35)">` +
      `<path d="M4 0 L76 -42" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M4 0 L76 -42" stroke="#d7a15a" stroke-width="7" stroke-linecap="round"/>` +
      `<ellipse cx="-8" cy="4" rx="22" ry="15" fill="#d7a15a" ${stroke}/>` +
      `<ellipse cx="-8" cy="2" rx="14" ry="8" fill="#ffb300"/>` +
      `<path d="M-14 16 Q-16 30 -10 34 Q-4 30 -6 16 Z" fill="#ffb300" ${st(3)}/></g>`,
  },
  {
    id: 'vedmid_slyniavchyk',
    slot: 'neck',
    name: 'Слинявчик',
    price: 10,
    draw: () =>
      `<path d="M-52 -14 Q0 12 52 -14 Q66 56 0 82 Q-66 56 -52 -14 Z" fill="#fff" ${stroke}/>` +
      `<path d="M-48 -4 Q0 18 48 -4 Q58 52 0 72 Q-58 52 -48 -4 Z" fill="none" stroke="#ef5350" stroke-width="5" stroke-dasharray="10 7"/>` +
      `<path d="M-14 26 Q-26 30 -20 44 Q-10 48 -4 38 Q4 46 0 32 Z" fill="#ffb300" ${st(3)}/>` +
      `<circle cx="20" cy="50" r="6" fill="#ffb300" ${st(2)}/><circle cx="12" cy="20" r="4" fill="#ffb300"/>`,
  },

  // ======== лисиця ========
  {
    id: 'lysytsia_kapeliukh',
    slot: 'head',
    name: 'Капелюшок пані',
    price: 20,
    draw: () =>
      `<path d="M28 -40 Q70 -110 120 -96 Q84 -80 40 -30 Z" fill="#fff" ${st(4)}/>` +
      `<ellipse cx="0" cy="-4" rx="78" ry="16" fill="#8e24aa" ${stroke}/>` +
      `<path d="M-42 -8 Q-44 -58 0 -60 Q44 -58 42 -8 Z" fill="#ab47bc" ${stroke}/>` +
      `<rect x="-43" y="-26" width="86" height="12" fill="#f8bbd0" ${st(3)}/>` +
      [0, 72, 144, 216, 288].map((a) => `<ellipse cx="-30" cy="-34" rx="9" ry="13" fill="#ec407a" ${st(3)} transform="rotate(${a} -30 -20)"/>`).join('') +
      `<circle cx="-30" cy="-20" r="8" fill="#fdd835" ${st(3)}/>`,
  },
  {
    id: 'lysytsia_kotiachi',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Хитрі окуляри',
    price: 15,
    draw: () =>
      `<path d="M-74 -26 Q-40 -16 -8 -8 Q-6 24 -36 24 Q-66 22 -74 -26 Z" fill="#f8bbd0" fill-opacity=".6" stroke="#d81b60" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="M74 -26 Q40 -16 8 -8 Q6 24 36 24 Q66 22 74 -26 Z" fill="#f8bbd0" fill-opacity=".6" stroke="#d81b60" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="M-8 -8 Q0 -14 8 -8" stroke="#d81b60" stroke-width="6" fill="none"/>` +
      `<path d="${starPath(-72, -28, 9)} ${starPath(72, -28, 9)}" fill="#fff59d" ${st(2)}/>`,
  },
  {
    id: 'lysytsia_piria',
    slot: 'mouth',
    name: 'Пір’ячко в зубах',
    price: 10,
    draw: () =>
      `<path d="M-2 2 Q-36 -30 -76 -26 Q-56 -4 -2 2 Z" fill="#fff" ${st(4)}/>` +
      `<path d="M-4 2 Q-40 -12 -66 -22" stroke="#bdbdbd" stroke-width="3" fill="none"/>` +
      `<path d="M2 4 Q-20 30 -58 34 Q-40 8 2 4 Z" fill="#fff3e0" ${st(4)}/>` +
      `<path d="M0 4 Q-26 22 -50 30" stroke="#bdbdbd" stroke-width="3" fill="none"/>`,
  },
  {
    id: 'lysytsia_boa',
    slot: 'neck',
    name: 'Боа з пір’я',
    price: 15,
    draw: () =>
      [...along(7, 60, 30, -12), [64, 22], [70, 50], [64, 78], [72, 104]]
        .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i > 6 ? 15 : 17}" fill="${i % 2 ? '#f48fb1' : '#f06292'}" ${st(3)}/>`)
        .join('') +
      along(7, 60, 30, -12)
        .map(([x, y]) => `<path d="M${x - 8} ${y - 4} q4 -6 8 0 q4 -6 8 0" stroke="#fce4ec" stroke-width="3" fill="none"/>`)
        .join(''),
  },

  // ======== внучка ========
  {
    id: 'vnuchka_panamka',
    slot: 'head',
    name: 'Панамка з вушками',
    price: 15,
    draw: () =>
      `<ellipse cx="-30" cy="-84" rx="14" ry="34" fill="#f8bbd0" ${stroke} transform="rotate(-18 -30 -60)"/>` +
      `<ellipse cx="30" cy="-84" rx="14" ry="34" fill="#f8bbd0" ${stroke} transform="rotate(18 30 -60)"/>` +
      `<ellipse cx="-30" cy="-84" rx="6" ry="22" fill="#f06292" transform="rotate(-18 -30 -60)"/>` +
      `<ellipse cx="30" cy="-84" rx="6" ry="22" fill="#f06292" transform="rotate(18 30 -60)"/>` +
      `<path d="M-74 10 Q-60 -10 -46 -12 Q-46 -66 0 -66 Q46 -66 46 -12 Q60 -10 74 10 Q0 -6 -74 10 Z" fill="#fff176" ${stroke}/>` +
      `<circle cx="-20" cy="-40" r="5" fill="#ef5350"/><circle cx="16" cy="-48" r="5" fill="#42a5f5"/><circle cx="24" cy="-24" r="5" fill="#66bb6a"/><circle cx="-26" cy="-18" r="4" fill="#ab47bc"/>`,
  },
  {
    id: 'vnuchka_zirochky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-зірочки',
    price: 15,
    draw: () =>
      `<path d="${starPath(-38, 2, 40)}" fill="#ffee58" fill-opacity=".7" ${st(6)}/>` +
      `<path d="${starPath(38, 2, 40)}" fill="#ffee58" fill-opacity=".7" ${st(6)}/>` +
      `<path d="M-8 -6 Q0 -12 8 -6" stroke="${INK}" stroke-width="6" fill="none"/>`,
  },
  {
    id: 'vnuchka_zhuika',
    slot: 'mouth',
    name: 'Бульбашка з жуйки',
    price: 10,
    draw: () =>
      `<g transform="translate(0 8) scale(1.4)">` +
      `<circle cx="4" cy="6" r="44" fill="#f48fb1" fill-opacity=".92" ${stroke}/>` +
      `<path d="M-18 -18 Q-6 -30 10 -28" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<circle cx="-22" cy="-6" r="5" fill="#fff"/>` +
      `<path d="M-8 40 Q4 34 16 40" stroke="#ec407a" stroke-width="4" fill="none" stroke-linecap="round"/></g>`,
  },
  {
    id: 'vnuchka_tsukerky',
    slot: 'neck',
    name: 'Намисто з цукерок',
    price: 15,
    draw: () =>
      `<g transform="scale(1.3)">` +
      `<path d="M-70 -14 Q0 50 70 -14" stroke="#ec407a" stroke-width="4" fill="none"/>` +
      along(5, 56, 36, -8)
        .map(([x, y], i) => {
          const c = ['#e53935', '#1e88e5', '#fdd835', '#43a047', '#8e24aa'][i];
          return (
            `<g transform="translate(${x} ${y}) rotate(${(x / 3).toFixed(0)})">` +
            `<path d="M-12 0 L-24 -9 L-24 9 Z M12 0 L24 -9 L24 9 Z" fill="${c}" ${st(3)}/>` +
            `<ellipse cx="0" cy="0" rx="14" ry="11" fill="${c}" ${st(3)}/>` +
            `<path d="M-6 -4 q3 -3 6 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>`
          );
        })
        .join('') +
      `</g>`,
  },

  // ======== жучка ========
  {
    id: 'zhuchka_myska',
    slot: 'head',
    name: 'Мисочка на голові',
    price: 10,
    draw: () =>
      `<path d="M-70 6 L-48 -52 L48 -52 L70 6 Z" fill="#1e88e5" ${stroke}/>` +
      `<rect x="-52" y="-62" width="104" height="14" rx="7" fill="#1565c0" ${st(4)}/>` +
      `<g transform="translate(0 -22)">` +
      `<rect x="-20" y="-5" width="40" height="10" fill="#fff"/>` +
      `<circle cx="-20" cy="-6" r="7" fill="#fff"/><circle cx="-20" cy="6" r="7" fill="#fff"/><circle cx="20" cy="-6" r="7" fill="#fff"/><circle cx="20" cy="6" r="7" fill="#fff"/></g>` +
      `<circle cx="-62" cy="-30" r="6" fill="#8d6e63" ${st(3)}/><circle cx="66" cy="-46" r="6" fill="#8d6e63" ${st(3)}/><circle cx="54" cy="-78" r="5" fill="#8d6e63" ${st(3)}/>`,
  },
  {
    id: 'zhuchka_kapets',
    slot: 'mouth',
    name: 'Капець у зубах',
    price: 10,
    draw: () =>
      `<path d="M-90 10 Q-96 -14 -70 -16 L30 -12 Q56 -10 54 8 Q52 24 30 22 L-70 26 Q-88 26 -90 10 Z" fill="#f48fb1" ${stroke}/>` +
      `<path d="M-60 -14 Q-50 -44 -14 -40 Q14 -36 20 -12 Z" fill="#ec407a" ${stroke}/>` +
      `<circle cx="-30" cy="-44" r="14" fill="#fce4ec" ${st(4)}/>` +
      `<path d="M-86 16 Q-20 22 50 12" stroke="#ad1457" stroke-width="4" fill="none"/>`,
  },
  {
    id: 'zhuchka_oshiynyk',
    slot: 'neck',
    name: 'Ошийник з шипами',
    price: 15,
    draw: () =>
      along(7, 54, 26, -14)
        .map(([x, y]) => `<path d="M${x - 8} ${y + 6} L${x} ${y + 26} L${x + 8} ${y + 6} Z" fill="#cfd8dc" ${st(3)}/>`)
        .join('') +
      `<path d="M-66 -16 Q0 40 66 -16" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>` +
      `<path d="M-66 -16 Q0 40 66 -16" stroke="#e53935" stroke-width="14" fill="none" stroke-linecap="round"/>` +
      `<path d="M-14 42 C-34 26 -24 8 0 22 C24 8 34 26 14 42 L0 56 Z" fill="#fdd835" ${st(4)}/>`,
  },

  // ======== кішка ========
  {
    id: 'kishka_klubok',
    slot: 'head',
    name: 'Клубок ниток',
    price: 10,
    draw: () =>
      `<path d="M-30 -96 L-62 -150 M24 -100 L64 -146" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` +
      `<path d="M-30 -96 L-62 -150 M24 -100 L64 -146" stroke="#bdbdbd" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="-62" cy="-150" r="7" fill="#fdd835" ${st(3)}/><circle cx="64" cy="-146" r="7" fill="#fdd835" ${st(3)}/>` +
      `<circle cx="0" cy="-46" r="52" fill="#e57373" ${stroke}/>` +
      `<path d="M-40 -76 Q0 -40 34 -90 M-50 -40 Q0 -10 44 -78 M-46 -16 Q10 -6 50 -40 M-20 -94 Q-30 -40 0 4" stroke="#c62828" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M48 -24 Q80 0 70 40 Q64 70 84 92" stroke="#e57373" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'kishka_son',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Маска для сну',
    price: 15,
    draw: () =>
      `<path d="M-90 -6 L-74 -4 M90 -6 L74 -4" stroke="#7e57c2" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M-76 -14 Q-60 -36 -30 -30 Q0 -22 30 -30 Q60 -36 76 -14 Q78 22 44 26 Q14 28 0 14 Q-14 28 -44 26 Q-78 22 -76 -14 Z" fill="#9575cd" ${stroke}/>` +
      `<path d="M-52 2 Q-36 14 -20 2 M20 2 Q36 14 52 2" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-52 4 l-4 8 M-36 9 v9 M-20 4 l4 8 M20 4 l-4 8 M36 9 v9 M52 4 l4 8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` +
      `<text x="60" y="-46" font-family="sans-serif" font-weight="900" font-size="22" fill="#7e57c2">z</text>` +
      `<text x="76" y="-66" font-family="sans-serif" font-weight="900" font-size="30" fill="#7e57c2">Z</text>`,
  },
  {
    id: 'kishka_rybka',
    slot: 'mouth',
    name: 'Рибка в зубах',
    price: 10,
    draw: () =>
      `<path d="M60 0 L90 -22 L86 0 L90 22 Z" fill="#4fc3f7" ${stroke}/>` +
      `<path d="M-50 0 Q-30 -26 10 -24 Q50 -20 62 0 Q50 20 10 24 Q-30 26 -50 0 Z" fill="#81d4fa" ${stroke}/>` +
      `<path d="M10 -24 Q20 -40 36 -20" fill="#4fc3f7" ${st(3)}/>` +
      `<path d="M8 -10 q8 10 0 20 M24 -10 q8 10 0 20 M40 -8 q6 8 0 16" stroke="#0288d1" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<path d="M-38 -8 l6 6 M-32 -8 l-6 6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  },
  {
    id: 'kishka_sosysky',
    slot: 'neck',
    name: 'Намисто з сосисок',
    price: 20,
    draw: () =>
      `<g transform="scale(1.35) translate(0 -10)">` +
      along(5, 56, 34, -8)
        .map(([x, y], i, all) => {
          const n = all[i + 1];
          const a = n ? (Math.atan2(n[1] - y, n[0] - x) * 180) / Math.PI : 40;
          return (
            `<g transform="translate(${x} ${y}) rotate(${a.toFixed(0)})">` +
            `<rect x="-17" y="-10" width="34" height="20" rx="10" fill="#e57373" ${st(4)}/>` +
            `<path d="M-8 -4 h10" stroke="#ffcdd2" stroke-width="3" stroke-linecap="round"/></g>`
          );
        })
        .join('') +
      along(5, 56, 34, -8)
        .slice(0, 4)
        .map(([x, y], i) => {
          const n = along(5, 56, 34, -8)[i + 1];
          return `<circle cx="${((x + n[0]) / 2).toFixed(1)}" cy="${((y + n[1]) / 2).toFixed(1)}" r="4" fill="#fff" ${st(2)}/>`;
        })
        .join('') +
      `</g>`,
  },
];

export const SETS: Record<string, string> = {
  did: 'did_ripka did_lupy did_lulka did_tsybulia',
  baba: 'baba_kastrulia baba_pyrizhok baba_bublyky okuliary',
  kolobok: 'kolobok_maslo kolobok_bublyky kolobok_harmoshka kovpak kukhar',
  zayets: 'zayets_morkva zayets_binokl zayets_kapusta zayets_sekundomir maska',
  vovk: 'vovk_bandana vovk_ovechka vovk_lantsyug vovk_kistka sontsezakhysni',
  vedmid: 'vedmid_horshchyk vedmid_bdzhola vedmid_lozhka vedmid_slyniavchyk boroda',
  lysytsia: 'lysytsia_kapeliukh lysytsia_kotiachi lysytsia_piria lysytsia_boa',
  vnuchka: 'vnuchka_panamka vnuchka_zirochky vnuchka_zhuika vnuchka_tsukerky kvitka',
  zhuchka: 'zhuchka_myska zhuchka_kapets zhuchka_oshiynyk medal',
  kishka: 'kishka_klubok kishka_son kishka_rybka kishka_sosysky',
};
