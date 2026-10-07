// The dragon's own things (Кирило Кожум'яка). SETS here ADD to a hero's set.
//
// He is seen from the side, facing left, and is unlike the others, so his things are drawn for him
// alone. On the head (u ≈ 121, the origin on top of the head between the horns), at the mouth
// (×0.37: the eyes are small; the origin at the mouth, the snout to the left), round the neck
// (×1.03) and the clothes in his own numbers (puppets-kyrylo.ts: feet at 0,0, the body an ellipse
// round 30,-140, the wings up to 260,-400, the legs at -60..-20 and 60..100).

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** the vertical span of an ellipse at x (to keep stripes inside a blanket) */
const span = (cx: number, cy: number, rx: number, ry: number, x: number) => {
  const k = 1 - ((x - cx) / rx) ** 2;
  return k <= 0 ? null : ry * Math.sqrt(k);
};

/** the plaid: a blanket round his back, with a fringe */
const pled = () => {
  const cx = 30;
  const cy = -150;
  const rx = 152;
  const ry = 92;
  const bottom = -86;
  let lines = '';
  for (let x = -100; x <= 160; x += 36) {
    const h = span(cx, cy, rx, ry, x);
    if (h === null) continue;
    lines += `<path d="M${x} ${(cy - h + 6).toFixed(0)} V${bottom - 4}" stroke="#1b5e20" stroke-width="12" opacity=".75"/>`;
    lines += `<path d="M${x + 14} ${(cy - h + 8).toFixed(0)} V${bottom - 4}" stroke="#fdd835" stroke-width="3"/>`;
  }
  for (let y = -220; y <= -100; y += 32) {
    const w = rx * Math.sqrt(Math.max(0, 1 - ((y - cy) / ry) ** 2)) - 8;
    lines += `<path d="M${(cx - w).toFixed(0)} ${y} H${(cx + w).toFixed(0)}" stroke="#1b5e20" stroke-width="10" opacity=".6"/>`;
  }
  let fringe = '';
  for (let x = -112; x <= 174; x += 14) fringe += `<path d="M${x} ${bottom} v16" stroke="#c62828" stroke-width="5" stroke-linecap="round"/>`;
  return (
    fringe +
    `<path d="M${cx - rx} ${bottom} L${cx - rx} ${cy} A${rx} ${ry} 0 0 1 ${cx + rx} ${cy} L${cx + rx} ${bottom} Z" fill="#c62828" ${stroke}/>` +
    lines +
    `<path d="M${cx - rx} ${bottom} H${cx + rx}" stroke="${INK}" stroke-width="6"/>`
  );
};

/** one wing of a butterfly: two lobes with spots */
const wing = (flip: boolean) => {
  const t = flip ? 'transform="translate(300 0) scale(-1 1)"' : '';
  return (
    `<g ${t}>` +
    `<path d="M150 -300 Q60 -470 -10 -420 Q-40 -360 40 -320 Q90 -305 150 -300 Z" fill="#ec407a" ${stroke}/>` +
    `<path d="M150 -300 Q70 -300 30 -250 Q20 -200 80 -220 Q130 -240 150 -300 Z" fill="#ab47bc" ${stroke}/>` +
    `<circle cx="40" cy="-385" r="20" fill="#fff59d" ${st(3)}/><circle cx="90" cy="-350" r="11" fill="#fff" ${st(3)}/>` +
    `<circle cx="70" cy="-250" r="12" fill="#fff59d" ${st(3)}/>` +
    `</g>`
  );
};

/** a marshmallow toasted on a horn */
const zefir = (x: number, y: number, tilt: number) =>
  `<g transform="translate(${x} ${y}) rotate(${tilt})">` +
  `<rect x="-11" y="-14" width="22" height="26" rx="8" fill="#fce4ec" ${st(3)}/>` +
  `<path d="M-10 -6 Q0 -16 10 -6 L10 -10 Q0 -20 -10 -10 Z" fill="#a1887f"/>` +
  `<path d="M-2 -22 q-6 -8 2 -16 q2 8 6 10 q-2 4 -8 6 Z" fill="#ff7043"/>` +
  `</g>`;

/** a rubber duck */
const duck = (x: number, y: number) =>
  `<g transform="translate(${x} ${y})">` +
  `<path d="M-12 0 Q-14 -10 -4 -10 Q-6 -20 4 -20 Q14 -20 12 -10 Q18 -8 16 0 Z" fill="#ffeb3b" ${st(2.5)}/>` +
  `<path d="M12 -15 l8 2 l-8 3 z" fill="#ff9800"/><circle cx="6" cy="-15" r="1.8" fill="${INK}"/>` +
  `</g>`;

/** a fireplace poker: a rod with a hook at the end and a ring for the hand */
const poker = (d: string, hook: string, ring: [number, number]) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
  `<path d="${d}" fill="none" stroke="#546e7a" stroke-width="9" stroke-linecap="round"/>` +
  `<path d="${hook}" fill="none" stroke="#37474f" stroke-width="12" stroke-linecap="round"/>` +
  `<circle cx="${ring[0]}" cy="${ring[1]}" r="16" fill="none" stroke="#d4a017" stroke-width="8"/>`;

/** a balloon on its string, from the knot at the neck */
const balloon = (x: number, y: number, fill: string) =>
  `<path d="M6 -6 Q${x / 2} ${y / 2 + 30} ${x} ${y + 26}" fill="none" stroke="${INK}" stroke-width="2.5"/>` +
  `<ellipse cx="${x}" cy="${y}" rx="22" ry="27" fill="${fill}" ${st(3)}/>` +
  `<path d="M${x - 4} ${y + 26} l4 6 l4 -6 z" fill="${fill}" ${st(2)}/>` +
  `<ellipse cx="${x - 8}" cy="${y - 10}" rx="5" ry="8" fill="#fff" opacity=".6"/>`;

/** a painted claw */
const claw = (x: number, polish: string) =>
  `<path d="M${x} -12 Q${x - 24} -12 ${x - 30} 6 Q${x - 10} 8 ${x} 4 Z" fill="${polish}" ${st(3)}/>` +
  `<circle cx="${x - 14}" cy="-4" r="2.6" fill="#fff"/>`;

export const ITEMS: Item[] = [
  // ---- on the head
  {
    id: 'zmiy_vulkan',
    slot: 'head',
    name: 'Шапка-вулкан',
    price: 20,
    draw: () =>
      // smoke, then the mountain with its crater bubbling
      `<circle cx="-6" cy="-92" r="13" fill="#cfd8dc" ${st(3)}/><circle cx="10" cy="-108" r="16" fill="#eceff1" ${st(3)}/><circle cx="-4" cy="-128" r="11" fill="#cfd8dc" ${st(3)}/>` +
      `<path d="M-62 12 L-22 -68 Q0 -76 22 -68 L62 12 Q0 26 -62 12 Z" fill="#8d6e63" ${stroke}/>` +
      `<path d="M-40 -24 L-30 -44 M30 -30 L40 -10 M-10 -2 L4 -20" stroke="#5d4037" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-22 -68 Q0 -60 22 -68 Q18 -46 12 -40 Q10 -28 4 -38 Q0 -24 -6 -40 Q-14 -30 -14 -48 Q-20 -56 -22 -68 Z" fill="#ff5722" ${st(3)}/>` +
      `<ellipse cx="0" cy="-68" rx="22" ry="6" fill="#ffca28" ${st(3)}/>`,
  },
  {
    id: 'zmiy_zefir',
    slot: 'head',
    name: 'Зефірки на рогах',
    price: 12,
    // on the tips of his two horns
    draw: () => zefir(19, -40, 10) + zefir(-21, -44, -14),
  },
  {
    id: 'zmiy_dush',
    slot: 'head',
    name: 'Шапочка для душу з качечками',
    price: 15,
    draw: () => {
      let frill = '<g transform="translate(0 -8)">';
      for (let x = -62; x <= 62; x += 12) frill += `<circle cx="${x}" cy="${6 - Math.abs(x) * 0.12}" r="8" fill="#b3e5fc" ${st(2.5)}/>`;
      return (
        frill +
        `<path d="M-64 4 Q-70 -70 0 -74 Q70 -70 64 4 Q0 -10 -64 4 Z" fill="#81d4fa" ${stroke}/>` +
        `<circle cx="-30" cy="-44" r="5" fill="#fff" opacity=".8"/><circle cx="20" cy="-56" r="4" fill="#fff" opacity=".8"/><circle cx="40" cy="-30" r="6" fill="#fff" opacity=".8"/>` +
        duck(-14, -18) +
        duck(26, -70) +
        '</g>'
      );
    },
  },
  // ---- at the mouth (the snout to the left)
  {
    id: 'zmiy_vohnehasnyk',
    slot: 'mouth',
    name: 'Вогнегасник у зубах',
    price: 18,
    // held across the jaws, the hose under it to the nozzle in front of the snout
    draw: () =>
      `<g transform="scale(0.8)">` +
      `<circle cx="-190" cy="-10" r="26" fill="#fff" ${st(4)}/><circle cx="-226" cy="10" r="20" fill="#fff" ${st(4)}/><circle cx="-214" cy="-36" r="16" fill="#fff" ${st(4)}/>` +
      `<path d="M176 30 Q110 90 -40 60 Q-130 40 -150 -10" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>` +
      `<path d="M176 30 Q110 90 -40 60 Q-130 40 -150 -10" fill="none" stroke="#424242" stroke-width="11" stroke-linecap="round"/>` +
      `<path d="M-150 -10 l-36 6 l4 -28 z" fill="#212121" ${st(4)}/>` +
      `<rect x="-30" y="-30" width="200" height="66" rx="30" fill="#e53935" ${stroke}/>` +
      `<rect x="160" y="-22" width="34" height="50" rx="8" fill="#9e9e9e" ${st(5)}/>` +
      `<rect x="30" y="-16" width="70" height="36" rx="6" fill="#fff" ${st(4)}/>` +
      `<path d="M44 2 h42" stroke="#e53935" stroke-width="8"/>` +
      `</g>`,
  },
  {
    id: 'zmiy_shchitka',
    slot: 'mouth',
    name: 'Зубна щітка з пастою',
    price: 10,
    draw: () =>
      // the brush in the mouth, the handle out of the snout; foam on the lips
      `<rect x="-260" y="-14" width="250" height="28" rx="14" fill="#29b6f6" ${stroke}/>` +
      `<path d="M-230 -14 v28 M-190 -14 v28 M-150 -14 v28" stroke="#fff" stroke-width="8"/>` +
      `<rect x="-20" y="-40" width="80" height="28" rx="6" fill="#fff" ${st(5)}/>` +
      `<path d="M-10 -40 v-22 M10 -40 v-22 M30 -40 v-22 M50 -40 v-22" stroke="#e0e0e0" stroke-width="12"/>` +
      `<path d="M-16 -64 Q20 -90 56 -64" fill="none" stroke="#66bb6a" stroke-width="12" stroke-linecap="round"/>` +
      `<circle cx="-24" cy="26" r="16" fill="#fff" ${st(3)}/><circle cx="6" cy="34" r="12" fill="#fff" ${st(3)}/><circle cx="-60" cy="30" r="10" fill="#e3f2fd" ${st(3)}/>`,
  },
  {
    id: 'zmiy_vusa',
    slot: 'mouth',
    name: 'Вуса-кочерги',
    price: 14,
    beard: true,
    // two pokers under the nostril: one curling out in front, one back along the cheek
    draw: () =>
      poker('M-110 -40 Q-200 -40 -250 -110', 'M-250 -110 q-10 -30 20 -36', [-110, -40]) + poker('M-80 -40 Q20 -30 90 -100', 'M90 -100 q24 -14 30 14', [-80, -40]),
  },
  // ---- round the neck (and the tail: moved there in dress.ts)
  {
    id: 'zmiy_bant',
    slot: 'neck',
    name: 'Бантик на хвіст',
    price: 8,
    draw: () =>
      `<path d="M-4 4 L-16 44 L-4 38 L2 50 Z M4 4 L18 40 L6 36 L4 50 Z" fill="#ec407a" ${st(3)}/>` +
      `<path d="M0 0 Q-34 -34 -36 -2 Q-34 26 0 0 Z M0 0 Q34 -34 36 -2 Q34 26 0 0 Z" fill="#f48fb1" ${stroke}/>` +
      `<circle cx="-20" cy="-4" r="3" fill="#fff"/><circle cx="-26" cy="8" r="2.5" fill="#fff"/><circle cx="22" cy="-6" r="3" fill="#fff"/><circle cx="24" cy="8" r="2.5" fill="#fff"/>` +
      `<circle cx="0" cy="0" r="9" fill="#ec407a" ${st(3)}/>`,
  },
  {
    id: 'zmiy_kulky',
    slot: 'neck',
    name: 'Повітряні кульки',
    price: 16,
    draw: () =>
      balloon(196, -126, '#ef5350') +
      balloon(244, -100, '#42a5f5') +
      balloon(152, -96, '#ffee58') +
      `<path d="M-8 -8 Q0 4 8 -8 M0 0 l-8 12 M0 0 l8 12" fill="none" stroke="${INK}" stroke-width="3"/>`,
  },
  // ---- clothes, in his own numbers
  {
    id: 'zmiy_pled',
    slot: 'torso',
    name: 'Плед у клітинку',
    price: 18,
    draw: pled,
  },
  {
    id: 'zmiy_metelyk',
    slot: 'torso',
    name: 'Крила-метелики',
    price: 20,
    // on his back, over his own wings; tied on with a ribbon round the belly
    draw: () =>
      `<g transform="translate(40 -40) scale(0.72) translate(-150 0)">${wing(false)}${wing(true)}</g>` +
      `<path d="M68 -256 Q20 -150 70 -60" fill="none" stroke="${INK}" stroke-width="13"/>` +
      `<path d="M68 -256 Q20 -150 70 -60" fill="none" stroke="#f8bbd0" stroke-width="7"/>` +
      `<circle cx="68" cy="-256" r="11" fill="#ab47bc" ${st(4)}/>`,
  },
  {
    id: 'zmiy_bochka',
    slot: 'legs',
    name: 'Бочка замість штанів',
    price: 15,
    draw: () =>
      // the barrel round his middle
      `<path d="M-90 -130 Q-108 -76 -90 -20 L150 -20 Q168 -76 150 -130 Z" fill="#a1662f" ${stroke}/>` +
      `<path d="M-50 -130 Q-60 -76 -50 -20 M-6 -130 Q-10 -76 -6 -20 M40 -130 V-20 M86 -130 Q90 -76 86 -20 M126 -130 Q134 -76 126 -20" stroke="#6d4320" stroke-width="5"/>` +
      `<path d="M-98 -110 H158 M-98 -40 H158" stroke="${INK}" stroke-width="16"/>` +
      `<path d="M-98 -110 H158 M-98 -40 H158" stroke="#9e9e9e" stroke-width="9"/>` +
      `<ellipse cx="30" cy="-130" rx="120" ry="12" fill="#c68a4c" ${st(5)}/>`,
  },
  {
    id: 'zmiy_manikur',
    slot: 'feet',
    name: 'Кігті з манікюром',
    price: 10,
    draw: () =>
      // the front claws of both feet (he faces left), and a sparkle: freshly done
      [-46, -30, -14].map((x) => claw(x, '#e91e63')).join('') +
      [74, 90, 106].map((x) => claw(x, '#9c27b0')).join('') +
      `<path d="M-86 -40 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4 l9 -4 z" fill="#ffeb3b" ${st(2)}/>`,
  },
];

export const SETS: Record<string, string> = {
  zmiy: ITEMS.map((i) => i.id).join(' '),
};
