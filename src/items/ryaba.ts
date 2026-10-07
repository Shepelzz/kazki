// The speckled hen's own things (Курочка Ряба). SETS here ADD to a hero's set.
//
// She faces left, her head turned to us (two eyes: she can wear glasses). On the head (u ≈ 53, the
// origin on top of the head where her comb is — it comes off for a hat), over the eyes (×0.4), at
// the beak (×0.4; the origin in the middle of the beak, its tip to the left at x ≈ -30, its base at
// +40), round the neck (×0.45) and the clothes in her own numbers (puppets-ryaba.ts: feet at 0,0,
// the body an ellipse round 4,-84 of 62×50, the wing over it, the legs at x -12 and 14 from -40 down).

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** her body and her wing, for the clothes to take their shape */
const BODY = 'M4 -136 A64 52 0 1 1 3.9 -136 Z';
const WING = 'M-8 -106 Q40 -118 60 -78 Q50 -56 18 -56 Q-6 -64 -8 -106 Z';
/** the two legs */
const legs = (one: (x: number) => string) => [-12, 14].map(one).join('');

/** a cherry pair on a stalk */
const cherries = (x: number, y: number) =>
  `<path d="M${x} ${y - 14} q-2 8 -6 12 M${x} ${y - 14} q4 8 6 12" stroke="#2e7d32" stroke-width="2.5" fill="none"/>` +
  `<path d="M${x} ${y - 14} q6 -4 10 -2 q-4 4 -10 2 z" fill="#43a047"/>` +
  `<circle cx="${x - 6}" cy="${y}" r="5" fill="#d32f2f" ${st(2)}/><circle cx="${x + 6}" cy="${y}" r="5" fill="#d32f2f" ${st(2)}/>` +
  `<circle cx="${x - 7.5}" cy="${y - 1.5}" r="1.4" fill="#fff"/><circle cx="${x + 4.5}" cy="${y - 1.5}" r="1.4" fill="#fff"/>`;

/** a six-armed snowflake frame round a lens */
const flake = (x: number) => {
  let arms = '';
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + Math.PI / 6;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const ex = x + c * 46;
    const ey = s * 46;
    // the arm, with a little V near its end
    arms += `<path d="M${(x + c * 28).toFixed(1)} ${(s * 28).toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#4fc3f7" stroke-width="7" stroke-linecap="round"/>`;
    const mx = x + c * 38;
    const my = s * 38;
    arms += `<path d="M${(mx + Math.cos(a + 0.9) * 9).toFixed(1)} ${(my + Math.sin(a + 0.9) * 9).toFixed(1)} L${mx.toFixed(1)} ${my.toFixed(1)} L${(mx + Math.cos(a - 0.9) * 9).toFixed(1)} ${(my + Math.sin(a - 0.9) * 9).toFixed(1)}" stroke="#4fc3f7" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  }
  return arms + `<circle cx="${x}" cy="0" r="28" fill="#e1f5fe" fill-opacity=".35" stroke="#0288d1" stroke-width="7"/>`;
};

/** a panda's face on a slipper: the toe to the left */
const panda = (x: number) =>
  `<path d="M${x + 14} -2 Q${x + 16} -20 ${x - 4} -20 Q${x - 26} -20 ${x - 28} -6 Q${x - 28} 2 ${x - 18} 2 Z" fill="#fff" ${st(3)}/>` +
  `<circle cx="${x - 22}" cy="-20" r="5" fill="#212121"/><circle cx="${x - 8}" cy="-22" r="5" fill="#212121"/>` +
  `<ellipse cx="${x - 20}" cy="-11" rx="3.5" ry="4.5" fill="#212121"/><ellipse cx="${x - 9}" cy="-12" rx="3.5" ry="4.5" fill="#212121"/>` +
  `<circle cx="${x - 20}" cy="-12" r="1.2" fill="#fff"/><circle cx="${x - 9}" cy="-13" r="1.2" fill="#fff"/>` +
  `<ellipse cx="${x - 25}" cy="-5" rx="2.5" ry="1.8" fill="#212121"/>`;

export const ITEMS: Item[] = [
  // ---- on the head
  {
    id: 'ryaba_sombrero',
    slot: 'head',
    name: 'Сомбреро',
    price: 18,
    draw: () =>
      // a wide straw brim with pompoms hanging off it, a tall crown with a zigzag band
      [-110, -72, 72, 110].map((x, i) => `<path d="M${x} ${10 + Math.abs(x) * 0.06} v14" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="${28 + Math.abs(x) * 0.06}" r="7" fill="${['#e53935', '#43a047', '#fdd835'][i % 3]}" ${st(2.5)}/>`).join('') +
      `<path d="M-128 6 Q-120 -22 -50 -20 L50 -20 Q120 -22 128 6 Q0 34 -128 6 Z" fill="#f2c86a" ${stroke}/>` +
      `<path d="M-46 -16 Q-44 -96 0 -100 Q44 -96 46 -16 Z" fill="#f2c86a" ${stroke}/>` +
      `<path d="M-46 -34 L-36 -46 L-26 -34 L-16 -46 L-6 -34 L4 -46 L14 -34 L24 -46 L34 -34 L44 -46" fill="none" stroke="#e53935" stroke-width="6" stroke-linejoin="round"/>` +
      `<path d="M-100 4 Q0 24 100 4" fill="none" stroke="#43a047" stroke-width="6"/>`,
  },
  {
    id: 'ryaba_vazon',
    slot: 'head',
    name: 'Вазон на голові',
    price: 15,
    draw: () =>
      // a red geranium growing out of a clay pot
      `<path d="M0 -60 Q-4 -100 2 -130" stroke="#388e3c" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M2 -84 Q-36 -104 -40 -78 Q-16 -70 2 -84 Z M2 -96 Q38 -118 44 -92 Q20 -82 2 -96 Z" fill="#66bb6a" ${st(3)}/>` +
      [[-14, -138], [10, -146], [18, -128], [-4, -122], [0, -150], [-20, -126]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#e53935" ${st(2.5)}/><circle cx="${x}" cy="${y}" r="3" fill="#fff59d"/>`).join('') +
      `<path d="M-42 6 L-50 -50 L50 -50 L42 6 Z" fill="#d7703a" ${stroke}/>` +
      `<rect x="-58" y="-66" width="116" height="20" rx="6" fill="#e2884a" ${stroke}/>` +
      `<path d="M-30 -24 q10 -8 20 0 q10 8 20 0 q10 -8 20 0" stroke="#fff3e0" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  // ---- over the eyes
  {
    id: 'ryaba_snizhynky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-сніжинки',
    price: 15,
    draw: () => flake(-34) + flake(34) + `<path d="M-6 -4 Q0 -12 6 -4" stroke="#0288d1" stroke-width="6" fill="none"/>`,
  },
  // ---- at the beak
  {
    id: 'ryaba_pomada',
    slot: 'mouth',
    name: 'Помада на дзьобі',
    price: 10,
    draw: () =>
      // the beak painted glossy red, a kiss-mark heart floating off it
      `<path d="M40 -26 L-32 0 L40 26 Q56 0 40 -26 Z" fill="#e91e63" ${stroke}/>` +
      `<path d="M30 -16 L-10 -2" stroke="#f8bbd0" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M-60 -50 C-74 -64 -92 -48 -76 -34 L-60 -20 L-44 -34 C-28 -48 -46 -64 -60 -50 Z" fill="#f06292" ${st(3)}/>`,
  },
  // ---- round the neck
  {
    id: 'ryaba_rozetka',
    slot: 'neck',
    name: 'Розетка «Королева курника»',
    price: 15,
    draw: () => {
      // a prize rosette: ribbon tails, a pleated ring, a crown in the middle
      let pleats = '';
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        pleats += `<ellipse cx="${(Math.cos(a) * 30).toFixed(1)}" cy="${(30 + Math.sin(a) * 30).toFixed(1)}" rx="14" ry="10" fill="${i % 2 ? '#1e88e5' : '#42a5f5'}" ${st(2.5)} transform="rotate(${((a * 180) / Math.PI).toFixed(0)} ${(Math.cos(a) * 30).toFixed(1)} ${(30 + Math.sin(a) * 30).toFixed(1)})"/>`;
      }
      return (
        `<path d="M-14 50 L-30 116 L-16 106 L-8 120 L4 54 Z M14 50 L30 116 L16 106 L8 120 L-4 54 Z" fill="#1565c0" ${st(3)}/>` +
        pleats +
        `<circle cx="0" cy="30" r="26" fill="#ffd54f" ${stroke}/>` +
        `<path d="M-14 38 L-16 18 L-7 26 L0 14 L7 26 L16 18 L14 38 Z" fill="#ffb300" ${st(3)}/>` +
        `<circle cx="0" cy="14" r="3" fill="#e53935"/>`
      );
    },
  },
  {
    id: 'ryaba_sumochka',
    slot: 'neck',
    name: 'Модна сумочка',
    price: 12,
    draw: () =>
      // on a strap round the neck, the bag hanging at her side
      `<path d="M-40 -6 Q0 30 40 -6 M36 -2 Q70 60 80 110" fill="none" stroke="#6a1b9a" stroke-width="6"/>` +
      `<path d="M50 110 Q48 160 80 166 Q118 166 114 110 Z" fill="#ab47bc" ${stroke}/>` +
      `<path d="M50 110 Q82 134 114 110 Q82 96 50 110 Z" fill="#ce93d8" ${st(3)}/>` +
      `<circle cx="82" cy="122" r="7" fill="#ffd54f" ${st(2.5)}/>` +
      [[64, 146], [96, 150], [80, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#f8bbd0"/>`).join(''),
  },
  // ---- clothes, in her own numbers
  {
    id: 'ryaba_kimono',
    slot: 'torso',
    name: 'Кімоно каратистки',
    price: 20,
    draw: () =>
      `<path d="${BODY}" fill="#fafafa" ${stroke}/>` +
      // the wrap from the neck down, the black belt with its knot and ends
      `<path d="M-40 -128 Q-20 -96 10 -82" fill="none" stroke="#cfcfcf" stroke-width="5"/>` +
      `<path d="M-10 -134 Q-6 -106 10 -82" fill="none" stroke="#cfcfcf" stroke-width="5"/>` +
      `<path d="M-58 -72 Q4 -56 66 -74 L66 -60 Q4 -42 -58 -58 Z" fill="#212121" ${st(3)}/>` +
      `<path d="M-6 -60 l-12 30 l10 2 l8 -26 M2 -60 l10 28 l10 -4 l-12 -24" fill="#212121" ${st(3)}/>` +
      `<circle cx="-2" cy="-60" r="7" fill="#212121" ${st(3)}/>` +
      `<path d="${WING}" fill="#fafafa" ${st(4)}/>` +
      `<path d="M30 -60 Q50 -62 58 -78" fill="none" stroke="#cfcfcf" stroke-width="5"/>`,
  },
  {
    id: 'ryaba_khalat',
    slot: 'torso',
    name: 'Халат лікарки',
    price: 20,
    draw: () =>
      `<path d="${BODY}" fill="#e3f2fd" ${stroke}/>` +
      `<path d="M-30 -132 L-14 -100 L0 -134" fill="none" stroke="#90caf9" stroke-width="5"/>` +
      `<path d="M-14 -100 V-36" stroke="#90caf9" stroke-width="4"/>` +
      [-88, -66, -46].map((y) => `<circle cx="-20" cy="${y}" r="3.5" fill="#1e88e5"/>`).join('') +
      // the stethoscope round the neck
      `<path d="M-44 -122 Q-50 -80 -30 -70 Q-12 -66 -8 -86 M-12 -130 Q-8 -100 -8 -86" fill="none" stroke="#424242" stroke-width="4"/>` +
      `<circle cx="-8" cy="-84" r="7" fill="#b0bec5" ${st(3)}/>` +
      `<path d="${WING}" fill="#e3f2fd" ${st(4)}/>` +
      // a pocket with a red cross on the wing
      `<rect x="14" y="-92" width="28" height="24" rx="4" fill="#fff" ${st(3)}/>` +
      `<path d="M28 -88 v16 M20 -80 h16" stroke="#e53935" stroke-width="5"/>`,
  },
  {
    id: 'ryaba_sarafan',
    slot: 'torso',
    name: 'Сарафан з вишеньками',
    price: 18,
    draw: () => {
      // the dress over the whole body, a red trim at the neck, a white frill along the hem, cherries, a bow
      let frill = '';
      for (let x = -52; x <= 60; x += 10) {
        const d = (x - 4) / 64;
        frill += `<circle cx="${x}" cy="${(-84 + 52 * Math.sqrt(1 - d * d) - 4).toFixed(1)}" r="6" fill="#fff" ${st(2)}/>`;
      }
      return (
        `<path d="${BODY}" fill="#fff176" ${stroke}/>` +
        `<path d="M-52 -112 Q4 -128 60 -112" fill="none" stroke="#e53935" stroke-width="6" stroke-linecap="round"/>` +
        frill +
        cherries(-30, -70) +
        cherries(-4, -96) +
        cherries(-8, -52) +
        `<path d="${WING}" fill="#fff59d" ${st(4)}/>` +
        cherries(30, -82) +
        `<path d="M-16 -116 L-28 -128 L-26 -106 Z M-10 -116 L2 -128 L0 -106 Z" fill="#e53935" ${st(2.5)}/><circle cx="-13" cy="-116" r="4" fill="#c62828" ${st(2)}/>`
      );
    },
  },
  {
    id: 'ryaba_dalmatyn',
    slot: 'legs',
    name: 'Лосини-далматинці',
    price: 12,
    draw: () =>
      legs(
        (x) =>
          `<rect x="${x - 8}" y="-50" width="16" height="38" rx="6" fill="#fff" ${st(3)}/>` +
          `<circle cx="${x - 3}" cy="-38" r="3.5" fill="#212121"/><circle cx="${x + 3}" cy="-26" r="3" fill="#212121"/><circle cx="${x - 2}" cy="-17" r="2.5" fill="#212121"/>`,
      ),
  },
  {
    id: 'ryaba_kulbabky',
    slot: 'legs',
    name: 'Штанці-кульбабки',
    price: 14,
    draw: () =>
      legs((x) => {
        // a white puff round each leg, its seeds sticking out
        let seeds = '';
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          seeds += `<path d="M${x + Math.cos(a) * 12} ${-30 + Math.sin(a) * 12} l${(Math.cos(a) * 8).toFixed(1)} ${(Math.sin(a) * 8).toFixed(1)}" stroke="#bdbdbd" stroke-width="2"/><circle cx="${(x + Math.cos(a) * 21).toFixed(1)}" cy="${(-30 + Math.sin(a) * 21).toFixed(1)}" r="2.5" fill="#fff" stroke="#bdbdbd" stroke-width="1"/>`;
        }
        return seeds + `<circle cx="${x}" cy="-30" r="14" fill="#fafafa" ${st(3)}/><circle cx="${x}" cy="-30" r="4" fill="#cddc39"/>`;
      }),
  },
  {
    id: 'ryaba_apelsynky',
    slot: 'legs',
    name: 'Штанці-апельсинки',
    price: 12,
    draw: () =>
      // two halves of an orange: the cut side out, its segments, the rind round them
      legs(
        (x) =>
          `<path d="M${x - 15} -46 L${x + 15} -46 L${x + 15} -30 A15 15 0 0 1 ${x - 15} -30 Z" fill="#fb8c00" ${st(3)}/>` +
          `<path d="M${x - 11} -42 L${x + 11} -42 L${x + 11} -30 A11 11 0 0 1 ${x - 11} -30 Z" fill="#ffcc80"/>` +
          `<path d="M${x} -42 V-19 M${x} -30 L${x - 9} -22 M${x} -30 L${x + 9} -22 M${x} -30 L${x - 11} -36 M${x} -30 L${x + 11} -36" stroke="#fb8c00" stroke-width="2"/>`,
      ),
  },
  {
    id: 'ryaba_chechitka',
    slot: 'feet',
    name: 'Черевички для чечітки',
    price: 15,
    draw: () =>
      legs(
        (x) =>
          `<path d="M${x + 10} 0 L${x + 10} -12 Q${x + 4} -16 ${x - 6} -14 Q${x - 26} -12 ${x - 28} -2 L${x - 28} 0 Z" fill="#212121" ${st(3)}/>` +
          `<path d="M${x - 12} -12 l6 -6 M${x - 4} -14 l4 -6" stroke="#e53935" stroke-width="3" stroke-linecap="round"/>` +
          `<rect x="${x - 30}" y="0" width="16" height="5" rx="2" fill="#cfd8dc" ${st(1.5)}/><rect x="${x}" y="0" width="12" height="5" rx="2" fill="#cfd8dc" ${st(1.5)}/>` +
          `<path d="M${x - 36} -16 l-6 -6 M${x - 38} -6 l-8 0" stroke="#90a4ae" stroke-width="2.5" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'ryaba_pandy',
    slot: 'feet',
    name: 'Капці-панди',
    price: 12,
    draw: () => legs(panda),
  },
  {
    id: 'ryaba_mokasyny',
    slot: 'feet',
    name: 'Мокасини з пір’ячком',
    price: 14,
    draw: () =>
      legs(
        (x) =>
          `<path d="M${x + 10} 0 L${x + 12} -14 Q${x - 8} -18 ${x - 26} -8 Q${x - 30} 0 ${x - 22} 2 Z" fill="#a1704a" ${st(3)}/>` +
          `<path d="M${x - 20} -6 h4 M${x - 12} -10 h4 M${x - 4} -12 h4" stroke="#fff3e0" stroke-width="2.5" stroke-linecap="round"/>` +
          `<path d="M${x + 10} -10 Q${x + 26} -32 ${x + 22} -42 Q${x + 12} -28 ${x + 8} -12 Z" fill="#26a69a" ${st(2)}/>` +
          `<path d="M${x + 10} -12 Q${x + 18} -26 ${x + 20} -36" stroke="#ffeb3b" stroke-width="1.5" fill="none"/>`,
      ),
  },
];

export const SETS: Record<string, string> = {
  ryaba: ITEMS.map((i) => i.id).join(' '),
};
