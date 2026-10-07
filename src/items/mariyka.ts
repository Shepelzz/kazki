// Marijka's own things (Марійка і ведмідь). SETS here ADD to a hero's set.
//
// She faces us (two eyes: she can wear glasses). On the head (u ≈ 56, the origin on top of the head;
// her headscarf comes off for a hat; her eyes are 52 below the origin, so a hat stays above 35),
// over the eyes (×0.46, the eyes at x ±30), at the mouth (×0.46), round the neck (×0.47, the origin
// under her chin) and the clothes in her own numbers (puppets-mariyka.ts: feet at 0,0; the blouse
// from the shoulders at -240 to the waist at -172, the arms from ±48,-230 down to the hands at
// ±60,-156; the short skirt from -176 flaring to ±74 at -66; the legs at x ±18, red boots below -36).

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** the sleeves of a top over her arms, in a colour */
const sleeves = (fill: string, cuff = '') =>
  [-1, 1]
    .map(
      (d) =>
        `<path d="M${d * 48} -230 Q${d * 74} -200 ${d * 60} -160" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>` +
        `<path d="M${d * 48} -230 Q${d * 74} -200 ${d * 60} -160" fill="none" stroke="${fill}" stroke-width="21" stroke-linecap="round"/>` +
        (cuff ? `<path d="M${d * 70} -172 L${d * 50} -170" stroke="${cuff}" stroke-width="7" stroke-linecap="round"/>` : ''),
    )
    .join('');

/** n stripes across a trapezoid: top y0 (half-width w0) to bottom y1 (half-width w1) */
const stripes = (y0: number, w0: number, y1: number, w1: number, n: number, a: string, b: string) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t0 = -1 + (2 * i) / n;
    const t1 = -1 + (2 * (i + 1)) / n;
    s += `<path d="M${(t0 * w0).toFixed(1)} ${y0} L${(t1 * w0).toFixed(1)} ${y0} L${(t1 * w1).toFixed(1)} ${y1} L${(t0 * w1).toFixed(1)} ${y1} Z" fill="${i % 2 ? b : a}"/>`;
  }
  return s;
};

/** a flared skirt from her waist down to y (the same outline for her skirts) */
const SKIRT = (y: number) => `M-50 -178 L-80 ${y + 6} Q0 ${y + 18} 80 ${y + 6} L50 -178 Q0 -184 -50 -178 Z`;

/** one shoe drawn for her right foot (toe to the right, from x 8 to 44), mirrored for the left */
const pair = (shoe: string) => `<g transform="scale(-1 1)">${shoe}</g>${shoe}`;

/** a five-pointed star */
const star = (x: number, y: number, r: number, fill: string) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
};

export const ITEMS: Item[] = [
  // ---- on the head
  {
    id: 'mariyka_lihtaryk',
    slot: 'head',
    name: 'Ліхтарик на лобі',
    price: 15,
    draw: () =>
      // a strap round the forehead, a lamp in the middle shining, a moth flying to its light
      `<g transform="translate(0 8)">` +
      `<path d="M-68 14 Q0 40 68 14" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
      `<path d="M-68 14 Q0 40 68 14" fill="none" stroke="#43a047" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M-30 -60 L-12 4 M0 -70 L0 2 M30 -60 L12 4 M-52 -34 L-18 10 M52 -34 L18 10" stroke="#fff59d" stroke-width="7" stroke-linecap="round" opacity=".9"/>` +
      `<rect x="-24" y="2" width="48" height="30" rx="10" fill="#37474f" ${st(4)}/>` +
      `<circle cx="0" cy="17" r="11" fill="#fff59d" ${st(3)}/><circle cx="-3" cy="14" r="4" fill="#fff"/>` +
      // the moth
      `<g transform="translate(44 -74)"><ellipse cx="-10" cy="0" rx="12" ry="8" fill="#d7ccc8" ${st(2.5)} transform="rotate(-30 -10 0)"/><ellipse cx="10" cy="0" rx="12" ry="8" fill="#d7ccc8" ${st(2.5)} transform="rotate(30 10 0)"/>` +
      `<ellipse cx="0" cy="2" rx="4" ry="10" fill="#8d6e63" ${st(2)}/><path d="M-2 -8 l-6 -8 M2 -8 l6 -8" stroke="${INK}" stroke-width="2"/></g></g>`,
  },
  {
    id: 'mariyka_khmarynka',
    slot: 'head',
    name: 'Хмаринка-дощик',
    price: 18,
    draw: () =>
      // her own little rain cloud over her head, smiling, dripping onto her hair
      `<g transform="translate(0 22)">` +
      [-44, -16, 14, 42, -30, 28].map((x, i) => `<path d="M${x} ${-44 + (i % 3) * 8} q-6 10 0 14 q6 -4 0 -14 z" fill="#4fc3f7" ${st(2)}/>`).join('') +
      `<path d="M-70 -50 Q-90 -52 -88 -72 Q-86 -94 -62 -92 Q-60 -124 -26 -122 Q-8 -146 22 -132 Q52 -144 64 -110 Q92 -108 88 -80 Q86 -50 60 -50 Z" fill="#eceff1" ${stroke}/>` +
      `<circle cx="-16" cy="-86" r="5" fill="${INK}"/><circle cx="16" cy="-86" r="5" fill="${INK}"/>` +
      `<path d="M-10 -72 q10 9 20 0" fill="none" ${st(3.5)}/>` +
      `<ellipse cx="-30" cy="-74" rx="8" ry="5" fill="#f48fb1" opacity=".7"/><ellipse cx="30" cy="-74" rx="8" ry="5" fill="#f48fb1" opacity=".7"/></g>`,
  },
  // ---- over the eyes
  {
    id: 'mariyka_vikontsia',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-віконця',
    price: 15,
    draw: () =>
      // each lens a little window: a wooden frame, a cross, a curtain at the top, a flowerpot on the sill
      `<g transform="scale(1.3)">` +
      [-30, 30]
        .map(
          (x) =>
            `<rect x="${x - 24}" y="-24" width="48" height="48" fill="#b3e5fc" fill-opacity=".25" stroke="#8b5a2b" stroke-width="7"/>` +
            `<path d="M${x - 24} 14 h48" stroke="#8b5a2b" stroke-width="3"/>` +
            `<path d="M${x - 24} -24 h48 l-6 12 q-18 -6 -36 0 z" fill="#e53935" ${st(2)}/>` +
            `<circle cx="${x - 12}" cy="-19" r="2" fill="#fff"/><circle cx="${x + 2}" cy="-19" r="2" fill="#fff"/><circle cx="${x + 14}" cy="-19" r="2" fill="#fff"/>` +
            `<rect x="${x - 30}" y="24" width="60" height="7" rx="3" fill="#a1704a" ${st(2)}/>` +
            `<path d="M${x + 8} 24 l2 -10 h12 l2 10 z" fill="#d7703a" ${st(2)}/><circle cx="${x + 16}" cy="9" r="5" fill="#ec407a" ${st(1.5)}/>`,
        )
        .join('') + `<path d="M-6 -2 Q0 -10 6 -2" stroke="#8b5a2b" stroke-width="6" fill="none"/></g>`,
  },
  // ---- at the mouth
  {
    id: 'mariyka_vampirchyky',
    slot: 'mouth',
    name: 'Зубки-вампірчики',
    price: 10,
    draw: () =>
      // a big grin with two long play fangs, and a little bat fluttering by
      `<g transform="scale(1.5)">` +
      `<path d="M-30 -6 Q0 26 30 -6 Q0 4 -30 -6 Z" fill="#b71c1c" ${st(3.5)}/>` +
      `<path d="M-20 -2 L-14 26 L-8 1 Z M8 1 L14 26 L20 -2 Z" fill="#fff" ${st(2.5)}/>` +
      `<g transform="translate(48 14)"><path d="M0 0 q-10 -12 -22 -6 q4 6 2 12 q8 -4 10 2 q4 -6 10 -8 q6 2 10 8 q2 -6 10 -2 q-2 -6 2 -12 q-12 -6 -22 6 z" fill="#4a148c" ${st(2)}/><circle cx="-3" cy="2" r="1.5" fill="#fff"/><circle cx="3" cy="2" r="1.5" fill="#fff"/></g></g>`,
  },
  // ---- round the neck
  {
    id: 'mariyka_kompas',
    slot: 'neck',
    name: 'Компас на шнурку',
    price: 12,
    draw: () =>
      // a brass compass on a cord: N at the top, the needle red to the north
      `<path d="M-46 -30 Q-34 40 0 52 Q34 40 46 -30" fill="none" stroke="#6d4c41" stroke-width="5"/>` +
      `<circle cx="0" cy="84" r="34" fill="#f2c94c" ${stroke}/>` +
      `<circle cx="0" cy="84" r="25" fill="#fffde7" ${st(3)}/>` +
      `<rect x="-6" y="44" width="12" height="10" rx="3" fill="#f2c94c" ${st(3)}/>` +
      `<path d="M0 62 L7 84 L0 106 L-7 84 Z" fill="#1e88e5" ${st(2)}/><path d="M0 62 L7 84 L-7 84 Z" fill="#e53935" ${st(2)}/>` +
      `<circle cx="0" cy="84" r="3.5" fill="${INK}"/>` +
      [[-17, 84], [17, 84], [0, 101]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${INK}"/>`).join(''),
  },
  {
    id: 'mariyka_skakalka',
    slot: 'neck',
    name: 'Скакалка',
    price: 10,
    draw: () =>
      // a jump rope slung round her neck, its striped handles hanging at her waist
      `<path d="M-48 -26 Q-74 50 -70 130 M48 -26 Q74 50 70 130" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M-48 -26 Q-74 50 -70 130 M48 -26 Q74 50 70 130" fill="none" stroke="#ab47bc" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M-48 -26 Q0 6 48 -26" fill="none" stroke="#ab47bc" stroke-width="6"/>` +
      [-70, 70]
        .map(
          (x) =>
            `<rect x="${x - 10}" y="126" width="20" height="54" rx="9" fill="#ffeb3b" ${st(3)}/>` +
            `<path d="M${x - 10} 142 h20 M${x - 10} 158 h20" stroke="#e53935" stroke-width="6"/>`,
        )
        .join(''),
  },
  // ---- clothes, in her own numbers
  {
    id: 'mariyka_popkorn',
    slot: 'torso',
    name: 'Сукенка-попкорн',
    price: 20,
    draw: () => {
      // a popcorn box of a dress: red and white stripes, popcorn spilling over the shoulders
      let puffs = '';
      for (const [x, y, r] of [[-62, -244, 13], [-46, -252, 12], [-34, -240, 10], [62, -244, 13], [46, -252, 12], [34, -240, 10], [-56, -228, 10], [56, -228, 10]])
        puffs += `<circle cx="${x}" cy="${y}" r="${r}" fill="${r > 11 ? '#fff8e1' : '#ffe082'}" ${st(2.5)}/>`;
      return (
        sleeves('#fafafa', '#e53935') +
        `<path d="M-48 -240 L-74 -64 Q0 -52 74 -64 L48 -240 Q0 -206 -48 -240 Z" fill="#fafafa" ${stroke}/>` +
        stripes(-224, 50, -64, 72, 7, '#e53935', '#fafafa') +
        `<path d="M-48 -240 L-74 -64 Q0 -52 74 -64 L48 -240 Q0 -206 -48 -240 Z" fill="none" ${stroke}/>` +
        `<rect x="-38" y="-160" width="76" height="34" rx="8" fill="#ffd54f" ${st(3)}/>` +
        `<text x="0" y="-136" font-size="20" font-weight="900" text-anchor="middle" fill="#c62828">ПОП!</text>` +
        puffs
      );
    },
  },
  {
    id: 'mariyka_pinhvin',
    slot: 'torso',
    name: 'Кофтинка-пінгвін',
    price: 18,
    draw: () =>
      // a black jumper with a white belly, a penguin's face on it, flippers for sleeves
      sleeves('#263238') +
      `<path d="M-46 -242 Q-58 -200 -54 -146 L54 -146 Q58 -200 46 -242 Q0 -254 -46 -242 Z" fill="#263238" ${stroke}/>` +
      `<path d="M-32 -230 Q-40 -186 -32 -148 L32 -148 Q40 -186 32 -230 Q0 -214 -32 -230 Z" fill="#fafafa" ${st(3)}/>` +
      `<circle cx="-12" cy="-178" r="5.5" fill="#263238"/><circle cx="12" cy="-178" r="5.5" fill="#263238"/><circle cx="-10.5" cy="-179.5" r="1.8" fill="#fff"/><circle cx="13.5" cy="-179.5" r="1.8" fill="#fff"/>` +
      `<path d="M-9 -170 L0 -156 L9 -170 Z" fill="#ff9800" ${st(2.5)}/>` +
      `<ellipse cx="-20" cy="-164" rx="5" ry="3" fill="#f48fb1"/><ellipse cx="20" cy="-164" rx="5" ry="3" fill="#f48fb1"/>` +
      `<path d="M-22 -148 l-8 8 h14 z M22 -148 l8 8 h-14 z" fill="#ff9800" ${st(2.5)}/>`,
  },
  {
    id: 'mariyka_kenguru',
    slot: 'torso',
    name: 'Сукня з кенгуренятком',
    price: 22,
    draw: () =>
      // a kangaroo-brown dress with a pouch on the belly: a joey peeks out of it
      sleeves('#c8834a') +
      `<path d="M-46 -242 Q-54 -206 -50 -178 L-76 -64 Q0 -52 76 -64 L50 -178 Q54 -206 46 -242 Q0 -254 -46 -242 Z" fill="#c8834a" ${stroke}/>` +
      `<path d="M-46 -146 Q0 -130 46 -146 Q48 -96 0 -88 Q-48 -96 -46 -146 Z" fill="#e0a86e" ${st(4)}/>` +
      // the joey: ears, a round head over the pouch's edge, its little paws on it
      `<path d="M-14 -182 Q-20 -206 -10 -210 Q-2 -196 -4 -176 Z M14 -182 Q20 -206 10 -210 Q2 -196 4 -176 Z" fill="#c8834a" ${st(3)}/>` +
      `<circle cx="0" cy="-160" r="18" fill="#c8834a" ${st(3.5)}/>` +
      `<circle cx="-7" cy="-164" r="3" fill="${INK}"/><circle cx="7" cy="-164" r="3" fill="${INK}"/>` +
      `<ellipse cx="0" cy="-154" rx="5" ry="3.5" fill="${INK}"/>` +
      `<path d="M-46 -146 Q0 -130 46 -146" fill="none" ${st(4)}/>` +
      `<ellipse cx="-12" cy="-142" rx="6" ry="5" fill="#c8834a" ${st(2.5)}/><ellipse cx="12" cy="-142" rx="6" ry="5" fill="#c8834a" ${st(2.5)}/>`,
  },
  {
    id: 'mariyka_abetka',
    slot: 'legs',
    name: 'Спідниця-абетка',
    price: 15,
    draw: () =>
      // a yellow skirt of letter blocks: А, Б, В, Г, Ґ, Д
      `<path d="${SKIRT(-68)}" fill="#fff59d" ${stroke}/>` +
      [['А', -50, -96, '#e53935'], ['Б', -16, -100, '#1e88e5'], ['В', 18, -100, '#43a047'], ['Г', 52, -96, '#8e24aa'], ['Ґ', -30, -138, '#fb8c00'], ['Д', 6, -140, '#00897b'], ['Е', 38, -136, '#d81b60']]
        .map(([c, x, y, f]) => `<rect x="${Number(x) - 14}" y="${Number(y) - 22}" width="28" height="28" rx="4" fill="${f}" ${st(2.5)} transform="rotate(${(Number(x) % 7) - 3} ${x} ${y})"/><text x="${x}" y="${Number(y) - 1}" font-size="21" font-weight="900" text-anchor="middle" fill="#fff">${c}</text>`)
        .join(''),
  },
  {
    id: 'mariyka_domino',
    slot: 'legs',
    name: 'Штанці-доміно',
    price: 14,
    draw: () => {
      // wide white trousers marked out in domino tiles, black dots
      const pip = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="4" fill="#212121"/>`;
      return (
        `<path d="M-52 -178 L-82 -32 L-6 -32 L0 -120 L6 -32 L82 -32 L52 -178 Q0 -186 -52 -178 Z" fill="#fafafa" ${stroke}/>` +
        `<path d="M-60 -136 H-4 M4 -136 H60 M-70 -86 H-4 M4 -86 H70" stroke="#212121" stroke-width="4"/>` +
        pip(-30, -160) + pip(26, -164) + pip(36, -152) +
        pip(-50, -114) + pip(-34, -108) + pip(-18, -102) + pip(30, -110) + pip(50, -110) + pip(30, -122) + pip(50, -122) +
        pip(-46, -60) + pip(-30, -60) + pip(46, -60) + pip(30, -54) + pip(62, -66)
      );
    },
  },
  {
    id: 'mariyka_halaktyka',
    slot: 'legs',
    name: 'Спідниця-галактика',
    price: 18,
    draw: () =>
      // a night-blue skirt with stars, a ringed planet and a comet
      `<path d="${SKIRT(-64)}" fill="#1a237e" ${stroke}/>` +
      `<path d="M-40 -150 Q0 -120 46 -150 Q30 -100 -50 -90 Z" fill="#5c6bc0" opacity=".5"/>` +
      [[-44, -156, 7], [34, -132, 6], [-58, -84, 8], [10, -94, 5], [56, -80, 7], [-20, -120, 5], [48, -164, 5]].map(([x, y, r]) => star(x, y, r, '#fff59d')).join('') +
      `<circle cx="14" cy="-150" r="14" fill="#ff7043" ${st(3)}/><ellipse cx="14" cy="-150" rx="26" ry="7" fill="none" stroke="#ffcc80" stroke-width="4" transform="rotate(-18 14 -150)"/>` +
      `<path d="M-30 -84 L-62 -112" stroke="#b3e5fc" stroke-width="6" stroke-linecap="round" opacity=".8"/><circle cx="-28" cy="-82" r="6" fill="#e1f5fe" ${st(2)}/>`,
  },
  {
    id: 'mariyka_poni',
    slot: 'feet',
    name: 'Капці-поні',
    price: 14,
    draw: () =>
      // pink slippers, a pony's head at each toe: a purple mane, ears, a sleepy eye
      pair(
        `<ellipse cx="24" cy="-13" rx="24" ry="14" fill="#f8bbd0" ${st(3)}/>` +
          `<path d="M30 -34 q-4 -14 6 -18 l2 10 M46 -34 q4 -14 -6 -18" fill="#f8bbd0" ${st(2.5)}/>` +
          `<path d="M28 -36 q8 -10 18 -2 q-4 6 -6 12 q-8 -6 -12 -10 z" fill="#9c27b0" ${st(2)}/>` +
          `<ellipse cx="40" cy="-22" rx="14" ry="12" fill="#f8bbd0" ${st(3)}/>` +
          `<ellipse cx="48" cy="-18" rx="7" ry="6" fill="#f48fb1" ${st(2)}/><circle cx="50" cy="-19" r="1.6" fill="${INK}"/>` +
          `<path d="M34 -26 q4 3 7 0" fill="none" ${st(2)}/>`,
      ),
  },
  {
    id: 'mariyka_chainychky',
    slot: 'feet',
    name: 'Черевички-чайнички',
    price: 15,
    draw: () =>
      // little teapots for shoes: a spout at the toe, a lid with a knob, a puff of steam
      pair(
        `<path d="M42 -18 Q56 -18 60 -36" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M42 -18 Q56 -18 60 -36" fill="none" stroke="#42a5f5" stroke-width="5" stroke-linecap="round"/>` +
          `<path d="M6 -24 q-10 0 -8 -10" fill="none" stroke="#42a5f5" stroke-width="5"/>` +
          `<ellipse cx="25" cy="-18" rx="21" ry="18" fill="#42a5f5" ${st(3)}/>` +
          `<circle cx="16" cy="-14" r="3" fill="#fff"/><circle cx="28" cy="-10" r="3" fill="#fff"/><circle cx="32" cy="-24" r="3" fill="#fff"/><circle cx="20" cy="-26" r="2.5" fill="#fff"/>` +
          `<path d="M12 -34 Q25 -42 38 -34" fill="#1e88e5" ${st(2.5)}/><circle cx="25" cy="-40" r="4" fill="#ffeb3b" ${st(2)}/>` +
          `<path d="M62 -42 q-6 -6 0 -12 q6 -6 0 -12" fill="none" stroke="#e0e0e0" stroke-width="3.5" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'mariyka_svitlofory',
    slot: 'feet',
    name: 'Черевички-світлофори',
    price: 14,
    draw: () =>
      // each boot a traffic light: red, yellow, green
      pair(
        `<rect x="8" y="-50" width="34" height="50" rx="8" fill="#37474f" ${st(3)}/>` +
          `<path d="M40 -4 h10 v4 h-10 z" fill="#37474f" ${st(2)}/>` +
          `<circle cx="25" cy="-38" r="6" fill="#e53935" ${st(1.5)}/><circle cx="25" cy="-24" r="6" fill="#fdd835" ${st(1.5)}/><circle cx="25" cy="-10" r="6" fill="#43a047" ${st(1.5)}/>` +
          `<path d="M14 -48 q11 -6 22 0" fill="none" stroke="#263238" stroke-width="5"/>`,
      ),
  },
];

export const SETS: Record<string, string> = {
  mariyka: ITEMS.map((i) => i.id).join(' '),
};
