// Things of the heroes' wardrobe, group d: drawn for u = 100 (see wardrobe.ts). Every id is
// <hero>_<thing>; SETS gives each of this group's heroes everything it can wear.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

const pea = (x: number, y: number, r = 11) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#7cb342" ${st(3)}/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.3}" fill="#dcedc8"/>`;

const acorn = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` +
  `<ellipse cx="0" cy="8" rx="11" ry="14" fill="#c98a3a" ${st(3)}/>` +
  `<path d="M-14 2 Q-14 -12 0 -12 Q14 -12 14 2 Z" fill="#6d4c41" ${st(3)}/>` +
  `<path d="M0 -12 V-18" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;

export const ITEMS: Item[] = [
  // ---------- Котигорошко: the pea boy ----------
  {
    id: 'kotyhoroshko_struchok',
    slot: 'head',
    name: 'Шапка-стручок',
    price: 15,
    draw: () =>
      `<path d="M-74 4 Q-80 -60 -20 -82 Q40 -100 76 -60 Q96 -30 74 4 Z" fill="#8bc34a" ${stroke}/>` +
      `<path d="M-60 -6 Q-56 -60 0 -74 Q52 -80 66 -40" stroke="#558b2f" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      pea(-38, -34) +
      pea(-8, -44) +
      pea(22, -46) +
      pea(50, -30) +
      `<path d="M74 -58 Q100 -84 92 -112 Q84 -96 70 -92" fill="#689f38" ${st(4)}/>` +
      `<path d="M92 -112 Q110 -120 112 -100" stroke="#689f38" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'kotyhoroshko_okuliary',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-горошини',
    price: 10,
    draw: () =>
      `<circle cx="-34" cy="0" r="27" fill="#c5e1a5" fill-opacity=".4" stroke="#558b2f" stroke-width="9"/>` +
      `<circle cx="34" cy="0" r="27" fill="#c5e1a5" fill-opacity=".4" stroke="#558b2f" stroke-width="9"/>` +
      `<path d="M-7 -4 Q0 -12 7 -4" stroke="#558b2f" stroke-width="7" fill="none"/>` +
      pea(-60, -22, 8) +
      pea(60, -22, 8),
  },
  {
    id: 'kotyhoroshko_solominka',
    slot: 'mouth',
    name: 'Стручок у зубах',
    price: 5,
    draw: () =>
      `<g transform="rotate(-14) scale(1.25)"><path d="M-4 0 Q40 -14 92 -6 Q60 12 -4 6 Z" fill="#9ccc65" ${st(4)}/>` +
      `<circle cx="34" cy="-2" r="5" fill="#dcedc8"/><circle cx="52" cy="-3" r="5" fill="#dcedc8"/><circle cx="70" cy="-3" r="4" fill="#dcedc8"/></g>`,
  },
  {
    id: 'kotyhoroshko_namysto',
    slot: 'neck',
    name: 'Горохове намисто',
    price: 10,
    draw: () =>
      Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI * (0.1 + (i / 10) * 0.8);
        return pea(Math.round(-Math.cos(a) * 70), Math.round(Math.sin(a) * 40 - 18), i === 5 ? 15 : 11);
      }).join(''),
  },

  // ---------- Вернигора: turns mountains ----------
  {
    id: 'vernyhora_hora',
    slot: 'head',
    name: 'Гора на голові',
    price: 20,
    draw: () =>
      `<path d="M-74 6 L-30 -70 L-10 -44 L18 -104 L74 6 Z" fill="#8d8d8d" ${stroke}/>` +
      `<path d="M4 -74 L18 -104 L34 -72 L26 -78 L18 -66 L10 -78 Z" fill="#fff" ${st(3)}/>` +
      `<path d="M-38 -56 L-30 -70 L-22 -58 Z" fill="#fff" ${st(3)}/>` +
      `<path d="M18 -104 V-140" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M18 -140 L48 -130 L18 -120 Z" fill="#e53935" ${st(3)}/>` +
      `<path d="M-50 -10 q8 -6 16 0 M20 -20 q8 -6 16 0" stroke="#616161" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'vernyhora_kamin',
    slot: 'neck',
    name: 'Кам’яна медаль',
    price: 15,
    draw: () =>
      `<path d="M-36 -18 L-8 40 M36 -18 L8 40" stroke="#8d6e63" stroke-width="8" stroke-linecap="round"/>` +
      `<path d="M-40 62 Q-46 30 -8 32 Q24 22 42 46 Q56 80 28 98 Q-6 112 -30 96 Q-46 84 -40 62 Z" fill="#9e9e9e" ${stroke}/>` +
      `<path d="M-30 50 L-20 58 M30 50 L36 62 M-26 90 l10 -4" stroke="#616161" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<text x="2" y="84" font-size="42" font-weight="900" font-family="sans-serif" text-anchor="middle" fill="#fdd835" stroke="${INK}" stroke-width="3">1</text>`,
  },
  {
    id: 'vernyhora_okuliary',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри скелелаза',
    price: 15,
    draw: () =>
      `<path d="M-84 -6 H84" stroke="#ff7043" stroke-width="12" stroke-linecap="round"/>` +
      `<rect x="-66" y="-24" width="58" height="44" rx="18" fill="#ffb74d" ${st(5)}/>` +
      `<rect x="8" y="-24" width="58" height="44" rx="18" fill="#ffb74d" ${st(5)}/>` +
      `<rect x="-58" y="-16" width="42" height="28" rx="12" fill="#4fc3f7" ${st(3)}/>` +
      `<rect x="16" y="-16" width="42" height="28" rx="12" fill="#4fc3f7" ${st(3)}/>` +
      `<path d="M-50 -8 l12 0 M24 -8 l12 0" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  },

  // ---------- Вернидуб: turns oaks ----------
  {
    id: 'vernydub_zholud',
    slot: 'head',
    name: 'Шапка-жолудь',
    price: 15,
    draw: () =>
      `<path d="M-72 8 Q-76 -66 0 -74 Q76 -66 72 8 Q0 -6 -72 8 Z" fill="#795548" ${stroke}/>` +
      Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 5 - (r === 3 ? 2 : 0) }, (_, c) => {
          const x = -48 + c * 24 + (r % 2) * 12 + (r === 3 ? 24 : 0);
          return `<path d="M${x - 9} ${-10 - r * 15} l9 9 l9 -9" stroke="#4e342e" stroke-width="4" fill="none" stroke-linecap="round"/>`;
        }).join(''),
      ).join('') +
      `<path d="M0 -72 Q4 -98 18 -110" stroke="#5d4037" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M16 -106 Q50 -130 70 -100 Q40 -84 16 -106 Z" fill="#66bb6a" ${st(3)}/>`,
  },
  {
    id: 'vernydub_hnizdo',
    slot: 'head',
    name: 'Гніздо з пташеням',
    price: 20,
    draw: () =>
      `<path d="M-66 -4 Q-70 -40 -50 -46 L50 -46 Q70 -40 66 -4 Q0 16 -66 -4 Z" fill="#a1887f" ${stroke}/>` +
      `<path d="M-60 -30 Q-20 -18 60 -34 M-62 -16 Q0 -2 62 -18 M-40 -42 Q-10 -30 30 -44" stroke="#6d4c41" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<circle cx="4" cy="-70" r="28" fill="#fff176" ${stroke}/>` +
      `<circle cx="-6" cy="-76" r="5" fill="#2b1a10"/><circle cx="14" cy="-76" r="5" fill="#2b1a10"/>` +
      `<path d="M-6 -62 L4 -76 L14 -62 Z" fill="#ff9800" ${st(3)}/><path d="M-6 -62 L14 -62 L4 -52 Z" fill="#ef6c00" ${st(3)}/>` +
      `<path d="M2 -98 q-6 -12 4 -16 M8 -98 q6 -10 12 -8" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="-40" cy="-48" rx="10" ry="13" fill="#b3e5fc" ${st(3)}/>`,
  },
  {
    id: 'vernydub_lystok',
    slot: 'mouth',
    name: 'Вуса з дубового листя',
    price: 10,
    draw: () =>
      [-1, 1]
        .map(
          (s) =>
            `<g transform="scale(${s * 1.15} 1.25) translate(0 -8)"><path d="M-2 -6 Q-14 -24 -26 -12 Q-34 -30 -46 -14 Q-58 -28 -66 -6 Q-80 -12 -78 8 Q-60 4 -48 10 Q-30 4 -20 8 Q-8 4 -2 -6 Z" fill="#43a047" ${st(4)}/>` +
            `<path d="M-4 -4 Q-40 -6 -72 4" stroke="#1b5e20" stroke-width="3" fill="none"/></g>`,
        )
        .join(''),
  },
  {
    id: 'vernydub_namysto',
    slot: 'neck',
    name: 'Намисто з жолудів',
    price: 10,
    draw: () =>
      `<path d="M-70 -16 Q0 40 70 -16" stroke="#8d6e63" stroke-width="5" fill="none"/>` +
      [-56, -30, 0, 30, 56].map((x) => acorn(x, Math.round(-16 + 56 * (1 - (x / 70) ** 2) * 0.5) + 6, x === 0 ? 1.4 : 1.05)).join(''),
  },

  // ---------- Крутивус: turns rivers with his moustache ----------
  {
    id: 'krutyvus_bihudi',
    slot: 'head',
    name: 'Бігуді для вусів',
    price: 10,
    draw: () =>
      `<path d="M-64 6 Q-70 -60 0 -66 Q70 -60 64 6 Z" fill="#f8bbd0" fill-opacity=".7" ${st(3)}/>` +
      [
        [-44, -20],
        [-18, -40],
        [12, -42],
        [40, -24],
        [-28, -4],
        [26, -6],
      ]
        .map(
          ([x, y], i) =>
            `<rect x="${x - 14}" y="${y - 10}" width="28" height="20" rx="9" fill="${i % 2 ? '#ec407a' : '#42a5f5'}" ${st(3)}/>` +
            `<path d="M${x - 6} ${y - 10} v20 M${x + 6} ${y - 10} v20" stroke="#fff" stroke-width="2.5"/>`,
        )
        .join(''),
  },
  {
    id: 'krutyvus_spirali',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-спіралі',
    price: 15,
    draw: () =>
      [-34, 34]
        .map((x) => {
          let d = `M${x} 0`;
          for (let t = 0.3; t <= Math.PI * 6; t += 0.3) d += ` L${(x + Math.cos(t) * t * 1.35).toFixed(1)} ${(Math.sin(t) * t * 1.35).toFixed(1)}`;
          return `<circle cx="${x}" cy="0" r="28" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="${d}" stroke="#8e24aa" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
        })
        .join('') +
      `<path d="M-6 -4 Q0 -12 6 -4 M-62 -4 L-80 -12 M62 -4 L80 -12" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  },

  {
    id: 'krutyvus_hrebinets',
    slot: 'neck',
    name: 'Гребінець для вусів',
    price: 10,
    draw: () =>
      `<path d="M-50 -14 Q0 30 50 -14" stroke="#e53935" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M0 8 V30" stroke="#e53935" stroke-width="6" stroke-linecap="round"/>` +
      `<rect x="-44" y="28" width="88" height="20" rx="8" fill="#ffca28" ${st(4)}/>` +
      Array.from({ length: 10 }, (_, i) => `<rect x="${-40 + i * 8.6}" y="46" width="4.5" height="24" rx="2" fill="#ffca28" ${st(2)}/>`).join(''),
  },

  // ---------- Мужичок-з-нігтик: tiny, with a beard as long as an elbow ----------
  {
    id: 'muzhychok_svichka',
    slot: 'head',
    name: 'Шапка-свічечка',
    price: 15,
    draw: () =>
      `<ellipse cx="0" cy="0" rx="58" ry="12" fill="#ffc83d" ${stroke}/>` +
      `<path d="M-28 -4 V-86 Q-20 -92 -10 -86 Q0 -80 10 -88 Q20 -94 28 -86 V-4 Z" fill="#fff8e1" ${stroke}/>` +
      `<path d="M-10 -86 Q-14 -66 -6 -60 Q2 -54 -2 -40" stroke="#ffe0b2" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M0 -88 V-100" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M0 -150 Q22 -118 12 -104 Q0 -94 -12 -104 Q-22 -118 0 -150 Z" fill="#ff9800" ${st(4)}/>` +
      `<path d="M0 -128 Q8 -114 4 -108 Q0 -104 -4 -108 Q-8 -114 0 -128 Z" fill="#fff59d"/>` +
      `<path d="M40 -4 Q60 -6 60 -20 Q60 -34 46 -30" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M40 -4 Q60 -6 60 -20 Q60 -34 46 -30" stroke="#ffc83d" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },

  {
    id: 'muzhychok_lupa',
    slot: 'face',
    name: 'Лупа',
    price: 15,
    draw: () =>
      `<path d="M30 30 L70 96" stroke="#6d4c41" stroke-width="16" stroke-linecap="round"/>` +
      `<path d="M30 30 L70 96" stroke="#a1887f" stroke-width="8" stroke-linecap="round"/>` +
      `<circle cx="10" cy="0" r="40" fill="#e3f2fd" ${st(3)}/>` +
      `<circle cx="10" cy="2" r="22" fill="#2b1a10"/><circle cx="18" cy="-6" r="7" fill="#fff"/>` +
      `<circle cx="10" cy="0" r="40" fill="none" stroke="#ffb300" stroke-width="9"/>` +
      `<path d="M-12 -18 Q-2 -28 12 -26" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'muzhychok_bantyk',
    slot: 'mouth',
    name: 'Бантик на бороду',
    price: 5,
    draw: () =>
      `<g transform="translate(-26 92) rotate(-20) scale(.6)">` +
      `<path d="M0 0 L-60 -40 Q-74 0 -60 40 Z" fill="#ec407a" ${stroke}/>` +
      `<path d="M0 0 L60 -40 Q74 0 60 40 Z" fill="#ec407a" ${stroke}/>` +
      `<path d="M-6 8 L-24 60 M6 8 L24 60" stroke="#ec407a" stroke-width="12" stroke-linecap="round"/>` +
      `<circle cx="0" cy="0" r="16" fill="#f48fb1" ${st(4)}/></g>`,
  },

  // ---------- Грифон ----------
  {
    id: 'hryfon_shlem',
    slot: 'head',
    name: 'Шолом льотчика',
    price: 20,
    draw: () =>
      `<path d="M-66 10 Q-72 -70 0 -76 Q72 -70 66 10 Z" fill="#8d6e63" ${stroke}/>` +
      `<path d="M60 0 Q74 30 66 60 Q50 52 50 10" fill="#8d6e63" ${st(4)}/>` +
      `<path d="M0 -76 V6" stroke="#6d4c41" stroke-width="4"/>` +
      `<path d="M-70 -30 H70" stroke="#5d4037" stroke-width="8"/>` +
      `<circle cx="-26" cy="-34" r="20" fill="#81d4fa" ${st(5)}/><circle cx="26" cy="-34" r="20" fill="#81d4fa" ${st(5)}/>` +
      `<path d="M-34 -42 l8 0 M18 -42 l8 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'hryfon_kliuch',
    slot: 'neck',
    name: 'Золотий ключик',
    price: 20,
    draw: () =>
      `<path d="M-60 -14 Q0 30 60 -14" stroke="#6d4c41" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<circle cx="0" cy="26" r="18" fill="#ffc83d" ${stroke}/><circle cx="0" cy="26" r="7" fill="#fff8e1" ${st(3)}/>` +
      `<path d="M-6 42 V112 H8 V100 H20 V90 H8 V80 H18 V70 H8 V42 Z" fill="#ffc83d" ${st(4)}/>`,
  },
  {
    id: 'hryfon_khrobak',
    slot: 'mouth',
    name: 'Черв’ячок у дзьобі',
    price: 5,
    draw: () =>
      `<path d="M-30 0 Q-40 26 -24 40 Q-8 54 -24 70" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/>` +
      `<path d="M-30 0 Q-40 26 -24 40 Q-8 54 -24 70" stroke="#f48fb1" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<circle cx="-27" cy="66" r="2.5" fill="#2b1a10"/><circle cx="-21" cy="68" r="2.5" fill="#2b1a10"/>` +
      `<path d="M-34 24 l8 2 M-30 44 l8 -4" stroke="#ec407a" stroke-width="3" stroke-linecap="round"/>`,
  },

  // ---------- Солом’яний бичок ----------
  {
    id: 'solombychok_bryl',
    slot: 'head',
    name: 'Солом’яний бриль',
    price: 15,
    draw: () =>
      `<ellipse cx="0" cy="-2" rx="84" ry="18" fill="#ffe082" ${stroke}/>` +
      `<path d="M-44 -6 Q-46 -62 0 -64 Q46 -62 44 -6 Z" fill="#ffd54f" ${stroke}/>` +
      `<rect x="-44" y="-24" width="88" height="14" fill="#e53935" ${st(3)}/>` +
      `<path d="M-30 -36 l8 -18 M-10 -40 l4 -20 M12 -40 l-2 -20 M30 -36 l-6 -18 M-64 0 l-10 6 M60 2 l12 4" stroke="#e0a800" stroke-width="3" stroke-linecap="round"/>` +
      `<path d="M30 -20 Q48 -40 46 -54 Q36 -40 24 -40 Z" fill="#fdd835" ${st(3)}/>` +
      `<circle cx="34" cy="-24" r="7" fill="#7e57c2" ${st(3)}/>`,
  },
  {
    id: 'solombychok_kiltse',
    slot: 'mouth',
    name: 'Кільце в носі',
    price: 10,
    draw: () =>
      `<circle cx="0" cy="10" r="20" fill="none" stroke="${INK}" stroke-width="12"/>` +
      `<circle cx="0" cy="10" r="20" fill="none" stroke="#ffc83d" stroke-width="7"/>` +
      `<path d="M-12 22 q6 4 10 2" stroke="#fff8e1" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'solombychok_okuliary',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри з соломки',
    price: 10,
    draw: () =>
      `<circle cx="-30" cy="0" r="24" fill="#fff9c4" fill-opacity=".35" stroke="#e0a800" stroke-width="8"/>` +
      `<circle cx="30" cy="0" r="24" fill="#fff9c4" fill-opacity=".35" stroke="#e0a800" stroke-width="8"/>` +
      `<path d="M-6 -4 Q0 -10 6 -4 M-54 -2 L-74 -10 M54 -2 L74 -10" stroke="#e0a800" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M-60 -20 l6 10 M62 -22 l-4 12 M-14 -30 l4 8" stroke="#fbc02d" stroke-width="3" stroke-linecap="round"/>`,
  },
  {
    id: 'solombychok_kolosky',
    slot: 'neck',
    name: 'Гірлянда з колосків',
    price: 15,
    draw: () =>
      `<path d="M-70 -16 Q0 40 70 -16" stroke="#8d6e63" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      [-56, -28, 0, 28, 56]
        .map((x, i) => {
          const y = Math.round(-16 + 28 * (1 - (x / 70) ** 2)) + 6;
          return (
            `<g transform="translate(${x} ${y}) rotate(${x * 0.3})">` +
            `<path d="M0 -6 V40" stroke="#c99a1e" stroke-width="4"/>` +
            [0, 10, 20].map((dy) => `<ellipse cx="-6" cy="${dy + 6}" rx="5" ry="8" fill="#ffd54f" ${st(2.5)} transform="rotate(-25 -6 ${dy + 6})"/><ellipse cx="6" cy="${dy + 6}" rx="5" ry="8" fill="#ffca28" ${st(2.5)} transform="rotate(25 6 ${dy + 6})"/>`).join('') +
            `<ellipse cx="0" cy="34" rx="5" ry="8" fill="#ffd54f" ${st(2.5)}/>` +
            (i === 2 ? `<circle cx="0" cy="-4" r="9" fill="#1e88e5" ${st(3)}/><circle cx="0" cy="-4" r="3.5" fill="#fff59d"/>` : '') +
            `</g>`
          );
        })
        .join(''),
  },


  // ---------- Півник ----------
  {
    id: 'pivnyk_budylnyk',
    slot: 'head',
    name: 'Будильник',
    price: 20,
    draw: () =>
      `<path d="M-30 -6 L-40 8 M30 -6 L40 8" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M-50 -62 Q-62 -96 -30 -100 Z M50 -62 Q62 -96 30 -100 Z" fill="#fdd835" ${st(4)}/>` +
      `<path d="M0 -92 V-104" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` +
      `<circle cx="0" cy="-48" r="46" fill="#e53935" ${stroke}/>` +
      `<circle cx="0" cy="-48" r="34" fill="#fff" ${st(3)}/>` +
      `<path d="M0 -48 V-72 M0 -48 L16 -40" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-62 -100 l-10 -8 M-68 -86 l-12 -2 M62 -100 l10 -8 M68 -86 l12 -2" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'pivnyk_mehafon',
    slot: 'mouth',
    name: 'Мегафон',
    price: 15,
    draw: () =>
      `<path d="M-4 -12 L-90 -46 L-90 46 L-4 12 Z" fill="#e53935" ${stroke}/>` +
      `<ellipse cx="-90" cy="0" rx="12" ry="46" fill="#ffcdd2" ${st(4)}/>` +
      `<rect x="-8" y="-14" width="18" height="28" rx="5" fill="#fdd835" ${st(4)}/>` +
      `<path d="M-40 14 L-36 40 L-24 40 L-26 10" fill="#424242" ${st(3)}/>` +
      `<path d="M-60 -20 L-60 20" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-112 -30 q-12 -6 -18 -18 M-116 0 h-22 M-112 30 q-12 6 -18 18" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },

  {
    id: 'pivnyk_sonechko',
    slot: 'face',
    name: 'Монокль-сонечко',
    price: 15,
    draw: () =>
      Array.from({ length: 10 }, (_, i) => {
        const a = (i * Math.PI) / 5;
        const c = (r: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
        return `<path d="M${c(30)} L${c(44)}" stroke="#ffb300" stroke-width="8" stroke-linecap="round"/>`;
      }).join('') +
      `<circle cx="0" cy="0" r="28" fill="#fff59d" fill-opacity=".45" stroke="#ffb300" stroke-width="8"/>` +
      `<path d="M-14 -12 Q-6 -20 6 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M20 22 Q30 60 10 96" stroke="#ffb300" stroke-width="4" fill="none"/>`,
  },

  {
    id: 'pivnyk_shalyk',
    slot: 'neck',
    name: 'Шалик співака',
    price: 10,
    draw: () =>
      `<path d="M-60 -14 Q0 22 60 -14 L64 14 Q0 50 -64 14 Z" fill="#42a5f5" ${stroke}/>` +
      `<path d="M-36 4 L-32 30 M-12 12 L-10 38 M12 12 L10 38 M36 4 L32 30" stroke="#fff" stroke-width="8"/>` +
      `<path d="M-50 20 L-70 100 L-40 104 L-30 24 Z" fill="#42a5f5" ${stroke}/>` +
      `<path d="M-64 74 L-36 78 M-60 56 L-34 60" stroke="#fff" stroke-width="7"/>` +
      `<path d="M-68 104 l-2 14 M-56 104 l-1 14 M-44 106 l0 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  },

  // ---------- Журавель ----------
  {
    id: 'zhuravel_hlechyk',
    slot: 'head',
    name: 'Глечик на голові',
    price: 15,
    draw: () =>
      `<path d="M-40 6 Q-60 -30 -36 -60 Q-20 -76 -18 -96 L18 -96 Q20 -76 36 -60 Q60 -30 40 6 Z" fill="#e57373" ${stroke}/>` +
      `<rect x="-26" y="-108" width="52" height="14" rx="6" fill="#ef5350" ${st(4)}/>` +
      `<path d="M38 -54 Q70 -56 64 -26 Q60 -10 46 -14" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      `<path d="M38 -54 Q70 -56 64 -26 Q60 -10 46 -14" stroke="#e57373" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<path d="M-44 -30 Q0 -14 44 -30" stroke="#fff59d" stroke-width="6" fill="none"/>` +
      [-24, 0, 24].map((x) => `<circle cx="${x}" cy="${-22 + Math.abs(x) * 0.1}" r="5" fill="#fff59d"/>`).join(''),
  },
  {
    id: 'zhuravel_zhabka',
    slot: 'mouth',
    name: 'Жабка в дзьобі',
    price: 10,
    draw: () =>
      `<path d="M-18 4 Q-34 30 -24 40 M18 4 Q34 30 24 40" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M-18 4 Q-34 30 -24 40 M18 4 Q34 30 24 40" stroke="#7cb342" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="0" cy="14" rx="24" ry="18" fill="#8bc34a" ${st(4)}/>` +
      `<circle cx="-12" cy="-6" r="10" fill="#8bc34a" ${st(3)}/><circle cx="12" cy="-6" r="10" fill="#8bc34a" ${st(3)}/>` +
      `<circle cx="-12" cy="-7" r="5" fill="#fff"/><circle cx="12" cy="-7" r="5" fill="#fff"/>` +
      `<circle cx="-11" cy="-6" r="2.5" fill="#2b1a10"/><circle cx="13" cy="-6" r="2.5" fill="#2b1a10"/>` +
      `<path d="M-10 18 Q0 24 10 18" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      `<circle cx="-10" cy="10" r="2.5" fill="#558b2f"/><circle cx="12" cy="8" r="2" fill="#558b2f"/>`,
  },

  {
    id: 'zhuravel_servetka',
    slot: 'neck',
    name: 'Серветка для обіду',
    price: 10,
    draw: () =>
      `<path d="M-40 -12 L40 -12 L54 92 L-54 92 Z" fill="#fff" ${stroke}/>` +
      Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => `<rect x="${-42 + c * 22 + (r % 2) * 11}" y="${8 + r * 26}" width="11" height="13" fill="#e53935"/>`).join(''),
      ).join('') +
      `<path d="M-40 -12 L-58 -22 L-50 -6 Z M40 -12 L58 -22 L50 -6 Z" fill="#fff" ${st(3)}/>` +
      `<ellipse cx="16" cy="64" rx="8" ry="6" fill="#ff9800" ${st(2)}/>`,
  },
];

export const SETS: Record<string, string> = {
  kotyhoroshko: 'kotyhoroshko_struchok kotyhoroshko_okuliary kotyhoroshko_solominka kotyhoroshko_namysto shelom',
  vernyhora: 'vernyhora_hora vernyhora_okuliary vernyhora_kamin kozatski',
  vernydub: 'vernydub_zholud vernydub_hnizdo vernydub_lystok vernydub_namysto',
  krutyvus: 'krutyvus_bihudi krutyvus_spirali krutyvus_hrebinets shapka',
  muzhychok: 'muzhychok_svichka muzhychok_lupa muzhychok_bantyk kravatka',
  hryfon: 'hryfon_shlem hryfon_khrobak hryfon_kliuch sharf',
  solombychok: 'solombychok_bryl solombychok_okuliary solombychok_kiltse solombychok_kolosky dzvinochok',
  pivnyk: 'pivnyk_budylnyk pivnyk_sonechko pivnyk_mehafon pivnyk_shalyk',
  zhuravel: 'zhuravel_hlechyk zhuravel_zhabka zhuravel_servetka metelyk',
};
