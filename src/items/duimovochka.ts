// The own things of the heroes of «Дюймовочка». SETS here ADD to a hero's set.
//
// All five face us (two eyes: they can wear glasses). The accessories are drawn for u = 100 as
// everywhere (head: the origin on top of the head; face: between the eyes, the eyes at ±34; mouth;
// neck: under the chin). The clothes, in each puppet's own numbers (puppets-duimovochka.ts, feet at 0,0):
// - Duimovochka: the bodice from the shoulders at -242 to the waist at -172 (a belt of sepals at
//   -190), petal sleeves at ±46,-228, the arms down to the hands at ±54,-160; the skirt of petals
//   from -186 down to -50, ±90 at its widest; bare legs at x ±8..24, leaf slippers ±8..46 below -22;
// - the May beetle: the body an ellipse round 0,-150 (72 × 104: -254…-46), the arms from ±56,-214 to
//   ±96,-150 (and ±60,-150 to ±80,-96); his two legs from ±26,-84 to ±34,-10 (only below the body,
//   under -60, they show), the feet at ±34…56, -8;
// - the mole: his velvet coat from -250 down to the fur hem at -30, ±92 at its widest; the sleeves
//   from ±76,-224 to ±104,-140; trousers go over the coat's lower half (he has no legs to speak of);
//   pink feet ellipses round ±34,-12 (34 × 14);
// - the swallow: the body an ellipse round 0,-144 (74 × 104: -248…-40), the wings at her sides; her
//   short legs at x ±16 from -46 to -8 (a skirt shows below the body, from about -60), toes ±4…28;
// - the prince of the elves: the tunic from -242 to the hem at -108, the arms from ±42,-224 to the
//   hands at ±56,-156; the legs in white tights at x ±7..24 from -96, shoes ±8..54 below -20.
// No lettering anywhere: a hero turned the other way shows its things mirrored.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** a pair: one shoe drawn for the right foot, mirrored for the left */
const pair = (shoe: string) => `<g transform="scale(-1 1)">${shoe}</g>${shoe}`;

/** two sleeves along the right arm's path (mirrored for the left), w wide */
const sleeves = (d: string, fill: string, w = 21, extra = '') => {
  const one = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>${extra}`;
  return `<g transform="scale(-1 1)">${one}</g>${one}`;
};

/** a flower of n round petals round x, y */
const bloom = (x: number, y: number, r: number, petal: string, middle: string, n = 5) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(r * 0.75).toFixed(1)}" fill="${petal}" ${st(2)}/>`;
  }).join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="${middle}" ${st(2)}/>`;

/** a five-pointed star */
const star = (x: number, y: number, r: number, fill: string, edge = '') => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}" ${edge}/>`;
};

/** a shiny drop of water */
const drop = (x: number, y: number, r: number) =>
  `<path d="M${x} ${y - r * 1.6} Q${x + r} ${y - r * 0.2} ${x} ${y + r} Q${x - r} ${y - r * 0.2} ${x} ${y - r * 1.6} Z" fill="#b3e5fc" ${st(2)}/><circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${(r * 0.25).toFixed(1)}" fill="#fff"/>`;

// ---------------- Duimovochka ----------------

const D_TOP = 'M-40 -244 Q-52 -206 -46 -170 L46 -170 Q52 -206 40 -244 Q0 -256 -40 -244 Z';
const D_ARM = 'M40 -230 Q60 -198 54 -168';
const D_SKIRT = 'M-34 -190 Q-98 -130 -92 -56 Q0 -36 92 -56 Q98 -130 34 -190 Q0 -198 -34 -190 Z';
/** a top for her: sleeves, a puff on each shoulder, the bodice */
const dTop = (fill: string, puff: string) =>
  sleeves(D_ARM, fill, 16) + `<circle cx="-46" cy="-230" r="18" fill="${puff}" ${st(3.5)}/><circle cx="46" cy="-230" r="18" fill="${puff}" ${st(3.5)}/>` + `<path d="${D_TOP}" fill="${fill}" ${stroke}/>`;

const DUIM: Item[] = [
  // ---- on the head
  {
    id: 'duim_rosa',
    slot: 'head',
    name: 'Корона з роси',
    price: 16,
    draw: () =>
      // a thin silver band, crystal-clear dew drops standing up on it, the biggest in the middle
      `<path d="M-62 6 Q0 -10 62 6" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-62 6 Q0 -10 62 6" stroke="#cfd8dc" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      drop(-46, -14, 10) + drop(-24, -26, 13) + drop(0, -40, 18) + drop(24, -26, 13) + drop(46, -14, 10) +
      `<path d="M-6 -70 l6 -12 l6 12 M-16 -64 l-8 -4 M16 -64 l8 -4" stroke="#fff59d" stroke-width="3" stroke-linecap="round" fill="none"/>`,
  },
  {
    id: 'duim_prolisok',
    slot: 'head',
    name: 'Капелюшок-пролісок',
    price: 12,
    draw: () =>
      // a big blue snowdrop (scilla) upside down for a hat: six pointed petals round her head, a stalk
      // curling up on top with a little leaf
      `<path d="M0 -60 Q-6 -100 20 -120" stroke="${INK}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M0 -60 Q-6 -100 20 -120" stroke="#66bb6a" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M4 -96 Q30 -110 40 -92 Q20 -84 4 -96 Z" fill="#81c784" ${st(2.5)}/>` +
      [-60, -36, -12, 12, 36, 60].map((x, i) => `<path d="M${x * 0.6} -56 Q${x - 10} -30 ${x} 14 Q${x + 12} -26 ${x * 0.6 + 8} -56 Z" fill="${i % 2 ? '#42a5f5' : '#5c6bc0'}" ${st(3)}/>`).join('') +
      `<ellipse cx="0" cy="-56" rx="30" ry="12" fill="#3949ab" ${st(3)}/>`,
  },
  // ---- over the eyes
  {
    id: 'duim_zernia',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-зернятка',
    price: 12,
    draw: () =>
      // each lens a golden barley grain (pointed at both ends) with its whisker sticking out
      [-36, 36]
        .map(
          (x) =>
            `<path d="M${x - 34} 0 Q${x} -32 ${x + 34} 0 Q${x} 32 ${x - 34} 0 Z" fill="#fff8e1" fill-opacity=".35" stroke="#e0a82e" stroke-width="7"/>` +
            `<path d="M${x - 20} -8 q20 -10 40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>` +
            `<path d="M${x + (x < 0 ? -34 : 34)} 0 l${x < 0 ? -26 : 26} -20" stroke="#c99a1e" stroke-width="3" stroke-linecap="round"/>`,
        )
        .join('') + `<path d="M-4 -4 Q0 -10 4 -4" stroke="#c99a1e" stroke-width="6" fill="none"/>`,
  },
  // ---- the body
  {
    id: 'duim_veslo',
    slot: 'neck',
    name: 'Весло з волосинки',
    price: 10,
    draw: () =>
      // her oar from the tale: a long white horse hair over her shoulder, a petal blade at its end
      `<path d="M-60 140 Q10 40 70 -110" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-60 140 Q10 40 70 -110" stroke="#fafafa" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M70 -110 Q60 -160 90 -190 Q118 -160 92 -112 Z" fill="#ef5350" ${st(3)}/><path d="M80 -120 Q82 -150 92 -176" stroke="#ffcdd2" stroke-width="3" fill="none"/>`,
  },
  {
    id: 'duim_arfa',
    slot: 'neck',
    name: 'Маленька арфа',
    price: 15,
    draw: () =>
      // a golden harp held at her side, its strings of spider silk
      `<g transform="translate(64 50)">` +
      `<path d="M-30 70 L-30 -60 Q10 -90 40 -50 Q20 -10 30 70 Z" fill="none" stroke="${INK}" stroke-width="13" stroke-linejoin="round"/>` +
      `<path d="M-30 70 L-30 -60 Q10 -90 40 -50 Q20 -10 30 70 Z" fill="none" stroke="#ffca28" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="M-18 -62 V70 M-6 -66 V70 M6 -66 V70 M18 -58 V70 M28 -46 V70" stroke="#eceff1" stroke-width="2"/>` +
      `<circle cx="40" cy="-52" r="8" fill="#ec407a" ${st(2.5)}/><rect x="-38" y="64" width="76" height="14" rx="5" fill="#ffb300" ${st(3)}/></g>`,
  },
  // ---- clothes, in her own numbers
  {
    id: 'duim_fialka',
    slot: 'torso',
    name: 'Кофтинка-фіалка',
    price: 16,
    draw: () =>
      // violet petals for a top, a yellow eye of the violet on her chest, dark purple veins
      dTop('#7e57c2', '#9575cd') +
      `<path d="M-40 -230 Q-20 -200 -30 -176 M40 -230 Q20 -200 30 -176" stroke="#4527a0" stroke-width="3" fill="none"/>` +
      bloom(0, -200, 13, '#b39ddb', '#ffeb3b', 5) +
      `<path d="M-6 -200 l-8 -6 M6 -200 l8 -6 M0 -194 v8" stroke="#4527a0" stroke-width="2"/>`,
  },
  {
    id: 'duim_konyushyna',
    slot: 'torso',
    name: 'Кофтинка-конюшина',
    price: 15,
    draw: () =>
      // a green top sewn with three-leaf clovers and one pink clover flower at the neck
      dTop('#81c784', '#a5d6a7') +
      [[-22, -224], [22, -214], [-18, -186], [20, -184]].map(([x, y]) => [0, 120, 240].map((a) => `<circle cx="${x}" cy="${y - 7}" r="6" fill="#2e7d32" transform="rotate(${a} ${x} ${y})"/>`).join('')).join('') +
      `<g transform="translate(0 -236)">${Array.from({ length: 9 }, (_, i) => `<circle cx="${(Math.cos(i * 0.7) * 7).toFixed(1)}" cy="${(Math.sin(i * 0.7) * 6 - 4).toFixed(1)}" r="4.5" fill="#f06292" ${st(1.5)}/>`).join('')}</g>`,
  },
  {
    id: 'duim_babka',
    slot: 'torso',
    name: 'Кофтинка з бабкою',
    price: 17,
    draw: () =>
      // a sky-blue top with a big turquoise dragonfly across the chest, its see-through wings spread
      dTop('#90caf9', '#bbdefb') +
      `<path d="M0 -232 V-176" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M0 -232 V-176" stroke="#00897b" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="0" cy="-234" r="6" fill="#00897b" ${st(2)}/>` +
      [[-1, -222], [1, -222], [-1, -210], [1, -210]].map(([sx, y]) => `<ellipse cx="${sx * 22}" cy="${y}" rx="20" ry="6" fill="#e0f7fa" fill-opacity=".85" stroke="#26a69a" stroke-width="2"/>`).join(''),
  },
  {
    id: 'duim_pavutynka',
    slot: 'legs',
    name: 'Спідниця-павутинка',
    price: 16,
    draw: () => {
      // a silvery skirt woven like a spider's web, dew drops sparkling on its threads
      let web = '';
      for (const k of [0.3, 0.55, 0.8]) web += `<path d="M${-34 - 58 * k} ${-190 + 134 * k} Q0 ${-176 + 134 * k} ${34 + 58 * k} ${-190 + 134 * k}" stroke="#90a4ae" stroke-width="2" fill="none"/>`;
      for (const x of [-60, -30, 0, 30, 60]) web += `<path d="M${x * 0.4} -188 L${x * 1.3} -48" stroke="#90a4ae" stroke-width="2"/>`;
      return `<path d="${D_SKIRT}" fill="#eceff1" ${stroke}/>` + web + drop(-40, -100, 5) + drop(22, -130, 5) + drop(52, -76, 5) + drop(-12, -70, 4);
    },
  },
  {
    id: 'duim_ozhyna',
    slot: 'legs',
    name: 'Спідниця-ожина',
    price: 15,
    draw: () => {
      // a dark-green skirt with blackberries round the hem and white blackberry flowers
      let berries = '';
      for (const [bx, by] of [[-66, -66], [-30, -60], [8, -58], [44, -62], [72, -70], [-50, -110], [30, -118]])
        for (const [dx, dy] of [[0, 0], [-6, -6], [6, -6], [0, -12], [-6, 6], [6, 6]]) berries += `<circle cx="${bx + dx}" cy="${by + dy}" r="4.5" fill="#311b92" ${st(1.5)}/>`;
      return `<path d="${D_SKIRT}" fill="#558b2f" ${stroke}/>` + berries + bloom(-10, -150, 7, '#fafafa', '#fdd835') + bloom(56, -150, 6, '#fafafa', '#fdd835');
    },
  },
  {
    id: 'duim_lavanda',
    slot: 'legs',
    name: 'Спідниця-лаванда',
    price: 14,
    draw: () =>
      // a lilac skirt with sprigs of lavender standing up from the hem
      `<path d="${D_SKIRT}" fill="#ce93d8" ${stroke}/>` +
      [-70, -44, -16, 14, 42, 70]
        .map((x) => `<path d="M${x} -50 V-130" stroke="#6a994e" stroke-width="3"/>` + [0, 1, 2, 3, 4].map((i) => `<ellipse cx="${x + (i % 2 ? 4 : -4)}" cy="${-110 - i * 9}" rx="4" ry="6" fill="#7b1fa2"/>`).join(''))
        .join(''),
  },
  {
    id: 'duim_kvasolynky',
    slot: 'feet',
    name: 'Черевички-квасолинки',
    price: 12,
    draw: () =>
      // each shoe a fat speckled bean, a green pod curling up at the heel
      pair(
        `<path d="M8 -26 Q2 -40 14 -44 Q22 -34 16 -24 Z" fill="#7cb342" ${st(2.5)}/>` +
          `<path d="M6 -6 Q4 -26 26 -26 Q50 -26 52 -10 Q50 4 28 2 Q8 2 6 -6 Z" fill="#c62828" ${st(3)}/>` +
          `<circle cx="20" cy="-16" r="3" fill="#ffcdd2"/><circle cx="34" cy="-10" r="3" fill="#ffcdd2"/><circle cx="42" cy="-18" r="2.5" fill="#ffcdd2"/>`,
      ),
  },
  {
    id: 'duim_slyvky',
    slot: 'feet',
    name: 'Черевички-сливки',
    price: 12,
    draw: () =>
      // two ripe blue plums with a bloom on them, a stalk and a leaf at the toe
      pair(
        `<ellipse cx="28" cy="-12" rx="24" ry="15" fill="#5c6bc0" ${st(3)}/>` +
          `<path d="M14 -18 q8 -6 16 -4" stroke="#c5cae9" stroke-width="3" fill="none" stroke-linecap="round"/>` +
          `<path d="M46 -22 l8 -10" stroke="#6d4426" stroke-width="3"/><path d="M52 -30 Q66 -36 66 -24 Q58 -22 52 -30 Z" fill="#7cb342" ${st(2)}/>`,
      ),
  },
  {
    id: 'duim_olyvky',
    slot: 'feet',
    name: 'Черевички-оливки',
    price: 11,
    draw: () =>
      // green olives for shoes, each with a red pepper stuffing at the toe
      pair(`<ellipse cx="26" cy="-12" rx="24" ry="14" fill="#9e9d24" ${st(3)}/><ellipse cx="46" cy="-12" rx="7" ry="6" fill="#e53935" ${st(2)}/><path d="M12 -18 q10 -6 20 -4" stroke="#dce775" stroke-width="3" fill="none"/>`),
  },
];

// ---------------- the May beetle ----------------

const Z_BODY = 'M-70 -232 Q-86 -150 -68 -70 Q0 -48 68 -70 Q86 -150 70 -232 Q0 -266 -70 -232 Z';
const Z_ARM = 'M56 -214 Q92 -196 96 -152';
const Z_ARM2 = 'M60 -150 Q86 -128 80 -98';
const zTop = (fill: string) => sleeves(Z_ARM, fill, 12) + sleeves(Z_ARM2, fill, 11) + `<path d="${Z_BODY}" fill="${fill}" ${stroke}/>`;
const Z_PANTS = 'M-56 -96 L-60 -30 L-12 -30 L0 -70 L12 -30 L60 -30 L56 -96 Z';

const ZHUK: Item[] = [
  {
    id: 'zhuk_kaska',
    slot: 'head',
    name: 'Каска мотоцикліста',
    price: 15,
    draw: () =>
      // a round red motorbike helmet with a white stripe and holes for the antennae, goggles pushed up
      `<path d="M-64 10 Q-68 -74 0 -84 Q68 -74 64 10 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M-10 -82 Q-12 -30 -8 8 M10 -82 Q12 -30 8 8" stroke="#fafafa" stroke-width="7"/>` +
      `<circle cx="-30" cy="-56" r="7" fill="#212121"/><circle cx="30" cy="-56" r="7" fill="#212121"/>` +
      `<rect x="-56" y="-24" width="112" height="14" rx="6" fill="#5d4037" ${st(3)}/>` +
      `<circle cx="-24" cy="-22" r="13" fill="#b3e5fc" ${st(3)}/><circle cx="24" cy="-22" r="13" fill="#b3e5fc" ${st(3)}/>`,
  },
  {
    id: 'zhuk_fasetky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-фасетки',
    price: 14,
    draw: () =>
      // insect goggles: each lens a honeycomb of little shiny cells, green and gold
      [-36, 36]
        .map((x) => {
          let cells = '';
          for (const [dx, dy] of [[0, 0], [-14, -8], [14, -8], [-14, 8], [14, 8], [0, -16], [0, 16]])
            cells += `<path d="M${x + dx - 7} ${dy} l3.5 -6 h7 l3.5 6 l-3.5 6 h-7 z" fill="${(dx + dy) % 3 ? '#9ccc65' : '#ffd54f'}" fill-opacity=".85" stroke="#33691e" stroke-width="1.5"/>`;
          return `<circle cx="${x}" cy="0" r="30" fill="#f1f8e9" fill-opacity=".3" stroke="#33691e" stroke-width="7"/>` + cells;
        })
        .join('') + `<path d="M-6 -4 Q0 -12 6 -4" stroke="#33691e" stroke-width="6" fill="none"/>`,
  },
  {
    id: 'zhuk_buzok',
    slot: 'mouth',
    name: 'Гілочка бузку в зубах',
    price: 10,
    draw: () =>
      // a sprig of lilac (the May beetle's month!) held in his jaws, the blossom off to the side
      `<path d="M-10 4 L70 -20" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-10 4 L70 -20" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M30 -8 Q34 -36 54 -40 Q50 -16 30 -8 Z" fill="#66bb6a" ${st(2)}/>` +
      Array.from({ length: 14 }, (_, i) => `<circle cx="${70 + (i % 4) * 9 - (i > 9 ? -4 : 0)}" cy="${-34 + Math.floor(i / 4) * 10}" r="6" fill="${i % 3 ? '#ba68c8' : '#ce93d8'}" ${st(1.5)}/>`).join(''),
  },
  {
    id: 'zhuk_akordeon',
    slot: 'neck',
    name: 'Акордеон',
    price: 18,
    draw: () =>
      // a red accordion on his chest: black-and-white keys on one side, buttons on the other, the bellows
      `<g transform="translate(0 110)">` +
      `<rect x="-70" y="-46" width="30" height="92" rx="6" fill="#c62828" ${st(4)}/>` +
      `<rect x="40" y="-46" width="30" height="92" rx="6" fill="#c62828" ${st(4)}/>` +
      `<path d="M-40 -42 L-26 42 L-12 -42 L2 42 L16 -42 L30 42 L40 -42" fill="none" stroke="${INK}" stroke-width="3"/>` +
      `<rect x="-40" y="-44" width="80" height="88" fill="#ef9a9a" fill-opacity=".5" ${st(3)}/>` +
      Array.from({ length: 6 }, (_, i) => `<rect x="-66" y="${-40 + i * 14}" width="22" height="11" fill="${i % 2 ? '#212121' : '#fafafa'}"/>`).join('') +
      [-30, -10, 10, 30].map((y) => `<circle cx="55" cy="${y}" r="5" fill="#fafafa" ${st(1.5)}/>`).join('') +
      `<path d="M-60 -46 Q-40 -110 0 -110 Q40 -110 60 -46" stroke="#5d4037" stroke-width="6" fill="none"/></g>`,
  },
  {
    id: 'zhuk_soty',
    slot: 'torso',
    name: 'Жилет-соти',
    price: 16,
    draw: () => {
      // a honey-yellow vest of honeycomb cells, a drop of honey running down
      let cells = '';
      for (let r = 0; r < 7; r++)
        for (let c = -3; c <= 3; c++) {
          const x = c * 22 + (r % 2) * 11;
          const y = -222 + r * 22;
          if (Math.abs(x) > 62 - Math.abs(r - 3) * 4) continue;
          cells += `<path d="M${x - 10} ${y} l5 -9 h10 l5 9 l-5 9 h-10 z" fill="none" stroke="#e0a000" stroke-width="2.5"/>`;
        }
      return zTop('#ffd54f') + cells + `<path d="M30 -150 q-6 20 0 30 q6 6 10 -2 q4 -10 -10 -28 Z" fill="#ffb300" ${st(2)}/>`;
    },
  },
  {
    id: 'zhuk_brokoli',
    slot: 'torso',
    name: 'Костюм броколі',
    price: 17,
    draw: () =>
      // dressed up as broccoli: a pale-green stalk for a body, green florets round his shoulders
      zTop('#c5e1a5') +
      `<path d="M-30 -200 Q-20 -130 -26 -70 M30 -200 Q20 -130 26 -70 M0 -206 V-60" stroke="#9ccc65" stroke-width="5" fill="none"/>` +
      [-64, -42, -20, 0, 20, 42, 64].map((x, i) => `<circle cx="${x}" cy="${-226 - (i % 2) * 10}" r="${20 - Math.abs(x) * 0.08}" fill="${i % 2 ? '#43a047' : '#388e3c'}" ${st(3)}/>`).join('') +
      [-50, -10, 30, 54].map((x) => `<circle cx="${x}" cy="${-232}" r="3" fill="#81c784"/>`).join(''),
  },
  {
    id: 'zhuk_klaptyky',
    slot: 'torso',
    name: 'Светр з клаптиків',
    price: 15,
    draw: () =>
      // a knitted jumper sewn of patches of every colour, with big stitches
      zTop('#ffab91') +
      `<path d="M-64 -150 H64 M-66 -110 H66 M0 -240 V-56 M-40 -230 V-62 M40 -230 V-62" stroke="${INK}" stroke-width="2.5"/>` +
      [[-52, -200, '#4fc3f7'], [-20, -200, '#fff176'], [20, -200, '#81c784'], [52, -200, '#ce93d8'], [-52, -130, '#fff176'], [-20, -130, '#ef5350'], [20, -130, '#4fc3f7'], [52, -130, '#a1887f'], [-20, -84, '#81c784'], [20, -84, '#ce93d8']]
        .map(([x, y, c]) => `<rect x="${Number(x) - 17}" y="${Number(y) - 18}" width="34" height="34" rx="3" fill="${c}" opacity=".85"/>`)
        .join('') +
      `<path d="M-40 -160 l6 6 M-34 -160 l-6 6 M14 -110 l6 6 M20 -110 l-6 6" stroke="${INK}" stroke-width="2"/>`,
  },
  {
    id: 'zhuk_hriadky',
    slot: 'legs',
    name: 'Штани-грядки',
    price: 14,
    draw: () =>
      // brown earth-coloured trousers with rows of little cabbages and carrot tops growing on them
      `<path d="${Z_PANTS}" fill="#8d6e63" ${stroke}/>` +
      `<path d="M-54 -60 H-14 M14 -60 H54 M-56 -42 H-14 M14 -42 H56" stroke="#6d4c41" stroke-width="3"/>` +
      [-46, -24, 24, 46].map((x) => `<circle cx="${x}" cy="${-66}" r="7" fill="#9ccc65" ${st(1.5)}/>`).join('') +
      [-40, -20, 20, 40].map((x) => `<path d="M${x} -46 l-4 -10 M${x} -46 l0 -12 M${x} -46 l4 -10" stroke="#43a047" stroke-width="2.5"/>`).join(''),
  },
  {
    id: 'zhuk_dyni',
    slot: 'legs',
    name: 'Штани-дині',
    price: 13,
    draw: () =>
      // two round yellow melons with green stripes for trouser legs
      [-1, 1].map((s) => `<ellipse cx="${s * 34}" cy="-56" rx="30" ry="34" fill="#fdd835" ${stroke}/><path d="M${s * 34 - 14} -86 Q${s * 34 - 20} -56 ${s * 34 - 14} -26 M${s * 34} -90 V-22 M${s * 34 + 14} -86 Q${s * 34 + 20} -56 ${s * 34 + 14} -26" stroke="#9ccc65" stroke-width="3" fill="none"/>`).join(''),
  },
  {
    id: 'zhuk_dzhungli',
    slot: 'legs',
    name: 'Шорти-джунглі',
    price: 14,
    draw: () =>
      // bright green shorts with big jungle leaves and a little orange parrot
      `<path d="${Z_PANTS}" fill="#26a69a" ${stroke}/>` +
      `<path d="M-50 -60 Q-34 -90 -18 -62 Q-34 -54 -50 -60 Z M20 -80 Q40 -100 52 -72 Q36 -66 20 -80 Z M14 -44 Q30 -60 44 -40 Q28 -34 14 -44 Z" fill="#1b5e20" ${st(2)}/>` +
      `<ellipse cx="-30" cy="-42" rx="7" ry="9" fill="#ff7043" ${st(2)}/><circle cx="-30" cy="-52" r="5" fill="#ff7043" ${st(2)}/><path d="M-34 -52 l-5 2 l5 2 z" fill="#fdd835"/>`,
  },
  {
    id: 'zhuk_vafli',
    slot: 'feet',
    name: 'Капці-вафлі',
    price: 12,
    draw: () =>
      // golden waffles for slippers, a blob of cream and a strawberry on each
      pair(
        `<rect x="18" y="-24" width="44" height="24" rx="5" fill="#e0a85e" ${st(3)}/>` +
          `<path d="M29 -24 V0 M40 -24 V0 M51 -24 V0 M18 -12 H62" stroke="#a1683a" stroke-width="2.5"/>` +
          `<path d="M28 -24 Q34 -36 44 -30 Q52 -38 54 -24 Z" fill="#fff8e1" ${st(2)}/><circle cx="44" cy="-34" r="5" fill="#e53935" ${st(1.5)}/>`,
      ),
  },
  {
    id: 'zhuk_kashtany',
    slot: 'feet',
    name: 'Кросівки-каштани',
    price: 13,
    draw: () =>
      // shiny brown chestnuts for trainers, a white sole and the prickly green husk open at the heel
      pair(
        `<path d="M14 -6 Q12 -28 30 -30 Q56 -30 60 -10 L60 -2 L14 -2 Z" fill="#8d4e1e" ${st(3)}/>` +
          `<path d="M24 -24 q10 -6 22 -2" stroke="#d7a86e" stroke-width="3" fill="none"/>` +
          `<rect x="12" y="-4" width="52" height="7" rx="3" fill="#fafafa" ${st(2)}/>` +
          `<path d="M14 -10 Q4 -22 12 -32 Q18 -22 20 -14 Z" fill="#7cb342" ${st(2)}/><path d="M6 -26 l-4 -2 M8 -18 l-5 1" stroke="${INK}" stroke-width="1.5"/>`,
      ),
  },
  {
    id: 'zhuk_televizory',
    slot: 'feet',
    name: 'Черевики-телевізори',
    price: 15,
    draw: () =>
      // little old box TVs for shoes, a cartoon on each screen and two antennae on top
      pair(
        `<rect x="18" y="-34" width="44" height="34" rx="6" fill="#8d6e63" ${st(3)}/>` +
          `<rect x="23" y="-29" width="28" height="24" rx="4" fill="#4fc3f7" ${st(2)}/>` +
          `<circle cx="37" cy="-17" r="5" fill="#fdd835"/><path d="M27 -9 q10 -8 20 0" stroke="#43a047" stroke-width="3" fill="none"/>` +
          `<circle cx="56" cy="-24" r="2.5" fill="#fafafa"/><circle cx="56" cy="-14" r="2.5" fill="#fafafa"/>` +
          `<path d="M36 -34 l-8 -12 M40 -34 l8 -12" stroke="${INK}" stroke-width="2"/>`,
      ),
  },
];

// ---------------- the mole ----------------

const K_COAT = 'M-84 -238 Q-104 -130 -90 -34 Q0 -16 90 -34 Q104 -130 84 -238 Q40 -262 0 -254 Q-40 -262 -84 -238 Z';
const K_ARM = 'M76 -224 Q112 -190 104 -146';
const kTop = (fill: string) => sleeves(K_ARM, fill, 26) + `<path d="${K_COAT}" fill="${fill}" ${stroke}/>`;
/** his trousers over the lower half of the coat, two short legs down to the feet */
const K_PANTS = 'M-92 -116 Q-100 -60 -86 -14 L-10 -14 L0 -40 L10 -14 L86 -14 Q100 -60 92 -116 Q0 -100 -92 -116 Z';

const KRIT: Item[] = [
  {
    id: 'krit_kartoplia',
    slot: 'head',
    name: 'Шапка-картоплина',
    price: 11,
    draw: () =>
      // a big lumpy potato with its eyes and a little green sprout on top
      `<path d="M-60 8 Q-72 -40 -40 -66 Q0 -84 40 -66 Q74 -44 60 8 Q0 20 -60 8 Z" fill="#d7a86e" ${stroke}/>` +
      `<circle cx="-30" cy="-30" r="4" fill="#8d6e3b"/><circle cx="16" cy="-50" r="4" fill="#8d6e3b"/><circle cx="34" cy="-16" r="4" fill="#8d6e3b"/><circle cx="-8" cy="-6" r="3" fill="#8d6e3b"/>` +
      `<path d="M10 -74 Q8 -96 22 -104" stroke="#43a047" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M20 -100 Q36 -110 36 -94 Q26 -92 20 -100 Z" fill="#66bb6a" ${st(2)}/>`,
  },
  {
    id: 'krit_teleskopy',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-телескопи',
    price: 16,
    draw: () =>
      // two long brass telescope tubes in front of his little eyes: now he sees the stars!
      [-36, 36]
        .map(
          (x) =>
            `<rect x="${x - 16}" y="-16" width="32" height="32" rx="6" fill="#ffca28" ${st(4)}/>` +
            `<rect x="${x - 22}" y="-22" width="44" height="44" rx="8" fill="none" stroke="#c99a1e" stroke-width="5"/>` +
            `<circle cx="${x}" cy="0" r="11" fill="#bbdefb" ${st(3)}/><circle cx="${x - 4}" cy="-4" r="3" fill="#fff"/>`,
        )
        .join('') + `<path d="M-14 0 H14" stroke="#c99a1e" stroke-width="6"/>`,
  },
  {
    id: 'krit_sukharyk',
    slot: 'mouth',
    name: 'Сухарик у зубах',
    price: 8,
    draw: () =>
      // a crunchy rye rusk, crumbs falling
      `<rect x="-6" y="-14" width="66" height="26" rx="6" fill="#a1683a" ${st(3)} transform="rotate(-10 26 0)"/>` +
      `<path d="M8 -6 l4 4 M24 -10 l4 4 M40 -12 l4 4 M18 4 l4 -3" stroke="#6d4426" stroke-width="2.5"/>` +
      `<circle cx="20" cy="26" r="3" fill="#a1683a"/><circle cx="36" cy="34" r="2.5" fill="#a1683a"/><circle cx="10" cy="40" r="2" fill="#a1683a"/>`,
  },
  {
    id: 'krit_lopatka',
    slot: 'neck',
    name: 'Лопатка через плече',
    price: 12,
    draw: () =>
      // a little garden spade over his shoulder: a wooden handle, a shiny iron blade
      `<path d="M-70 -60 L70 150" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-70 -60 L70 150" stroke="#c08a52" stroke-width="7" stroke-linecap="round"/>` +
      `<path d="M-86 -66 h32" stroke="${INK}" stroke-width="12" stroke-linecap="round" transform="rotate(56 -70 -60)"/>` +
      `<path d="M60 130 L96 110 L120 160 Q100 190 80 176 Z" fill="#b0bec5" ${st(4)}/><path d="M86 124 l20 40" stroke="#eceff1" stroke-width="4"/>`,
  },
  {
    id: 'krit_hnylushka',
    slot: 'neck',
    name: 'Світна гнилушка',
    price: 13,
    draw: () =>
      // the glowing rotten twig he lights the tunnel with (from the tale), held up beside him
      `<g transform="translate(80 40)">` +
      `<circle cx="0" cy="-70" r="46" fill="#ccff90" opacity=".35"/><circle cx="0" cy="-70" r="28" fill="#f4ff81" opacity=".45"/>` +
      `<path d="M0 60 Q-8 0 0 -70" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M0 60 Q-8 0 0 -70" stroke="#a1887f" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      `<path d="M-6 -70 Q0 -96 8 -70 Q4 -58 -6 -70 Z" fill="#c6ff00" ${st(2)}/>` +
      `<path d="M-30 -96 l4 -4 M26 -100 l4 -4 M-34 -50 l-4 2 M34 -46 l4 2" stroke="#eeff41" stroke-width="3" stroke-linecap="round"/></g>`,
  },
  {
    id: 'krit_fufaika',
    slot: 'torso',
    name: 'Фуфайка шахтаря',
    price: 15,
    draw: () =>
      // a quilted dark-blue padded jacket, a bright orange reflective band across it
      kTop('#37474f') +
      `<path d="M-90 -200 H90 M-96 -160 H96 M-98 -120 H98 M-96 -80 H96 M-92 -44 H92" stroke="#263238" stroke-width="3"/>` +
      `<path d="M-100 -150 H100 V-130 H-100 Z" fill="#ff9800"/><path d="M-100 -142 H100" stroke="#fff59d" stroke-width="4"/>` +
      `<path d="M0 -252 V-24" stroke="#263238" stroke-width="5"/>` + [-210, -100, -60].map((y) => `<circle cx="10" cy="${y}" r="5" fill="#90a4ae"/>`).join(''),
  },
  {
    id: 'krit_hlobus',
    slot: 'torso',
    name: 'Костюм глобуса',
    price: 18,
    draw: () =>
      // a big round globe on a golden stand: blue seas, green and yellow lands, lines of latitude
      kTop('#1e88e5') +
      `<circle cx="0" cy="-140" r="92" fill="#42a5f5" ${stroke}/>` +
      `<path d="M-60 -200 Q-30 -220 -10 -196 Q-20 -170 -50 -176 Q-70 -180 -60 -200 Z M20 -150 Q50 -170 70 -140 Q60 -100 30 -110 Q10 -130 20 -150 Z M-50 -110 Q-30 -120 -20 -96 Q-34 -76 -56 -88 Z" fill="#66bb6a" ${st(2.5)}/>` +
      `<path d="M30 -210 Q44 -214 50 -200 Q40 -190 30 -210 Z" fill="#fdd835" ${st(2)}/>` +
      `<path d="M-90 -140 H90 M-80 -184 Q0 -170 80 -184 M-80 -96 Q0 -110 80 -96 M0 -232 Q-50 -140 0 -48" stroke="#bbdefb" stroke-width="2.5" fill="none"/>` +
      `<path d="M-100 -140 A100 100 0 0 0 0 -40" stroke="#ffb300" stroke-width="9" fill="none"/>`,
  },
  {
    id: 'krit_seif',
    slot: 'torso',
    name: 'Костюм-сейф',
    price: 18,
    draw: () =>
      // the rich mole's iron safe: a heavy grey box, a round dial, a handle, gold coins peeping out
      kTop('#78909c') +
      `<rect x="-86" y="-240" width="172" height="210" rx="14" fill="#90a4ae" ${stroke}/>` +
      `<rect x="-70" y="-224" width="140" height="178" rx="8" fill="none" stroke="#607d8b" stroke-width="5"/>` +
      `<circle cx="-12" cy="-140" r="26" fill="#cfd8dc" ${st(4)}/><path d="M-12 -140 l12 -14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
      Array.from({ length: 8 }, (_, i) => `<path d="M${-12 + Math.cos((i * Math.PI) / 4) * 20} ${-140 + Math.sin((i * Math.PI) / 4) * 20} l${Math.cos((i * Math.PI) / 4) * 5} ${Math.sin((i * Math.PI) / 4) * 5}" stroke="${INK}" stroke-width="2"/>`).join('') +
      `<rect x="36" y="-160" width="14" height="44" rx="6" fill="#455a64" ${st(3)}/>` +
      [-60, -40, -20].map((x, i) => `<ellipse cx="${x}" cy="${-40 - i * 3}" rx="12" ry="5" fill="#ffca28" ${st(2)}/>`).join(''),
  },
  {
    id: 'krit_buriaky',
    slot: 'legs',
    name: 'Штани-буряки',
    price: 13,
    draw: () =>
      // beetroot-red trousers with round beets on them, green tops sticking up
      `<path d="${K_PANTS}" fill="#ad1457" ${stroke}/>` +
      [[-54, -70], [-20, -86], [24, -84], [58, -66], [-50, -32], [50, -32]]
        .map(([x, y]) => `<path d="M${x} ${y - 10} l-5 -10 M${x} ${y - 10} l5 -12" stroke="#43a047" stroke-width="3" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="10" fill="#880e4f" ${st(2)}/>`)
        .join(''),
  },
  {
    id: 'krit_bankir',
    slot: 'legs',
    name: 'Штани банкіра в смужку',
    price: 14,
    draw: () =>
      // grey pinstripe trousers with sharp creases, a gold watch chain hanging from the pocket
      `<path d="${K_PANTS}" fill="#546e7a" ${stroke}/>` +
      Array.from({ length: 13 }, (_, i) => `<path d="M${-84 + i * 14} -110 V-16" stroke="#b0bec5" stroke-width="1.5"/>`).join('') +
      `<path d="M-48 -110 V-16 M48 -110 V-16" stroke="#37474f" stroke-width="3"/>` +
      `<path d="M30 -104 Q50 -80 70 -100" stroke="#ffca28" stroke-width="4" fill="none"/><circle cx="70" cy="-98" r="7" fill="#ffca28" ${st(2)}/>`,
  },
  {
    id: 'krit_shokolad',
    slot: 'legs',
    name: 'Штани-шоколадки',
    price: 13,
    draw: () =>
      // trousers of chocolate bar squares, the silver foil peeled back at the bottom
      `<path d="${K_PANTS}" fill="#6d4c41" ${stroke}/>` +
      Array.from({ length: 8 }, (_, i) => `<path d="M${-84 + i * 24} -108 V-26" stroke="#4e342e" stroke-width="3"/>`).join('') +
      `<path d="M-96 -84 H96 M-96 -54 H96" stroke="#4e342e" stroke-width="3"/>` +
      `<path d="M-86 -28 L-60 -40 L-40 -26 L-20 -38 L-10 -24 Z M10 -24 L20 -38 L40 -26 L60 -40 L86 -28 Z" fill="#cfd8dc" ${st(2)}/>`,
  },
  {
    id: 'krit_ekskavatory',
    slot: 'feet',
    name: 'Черевики-екскаватори',
    price: 16,
    draw: () =>
      // little yellow diggers for boots: caterpillar tracks, a cab, a bucket at the toe
      pair(
        `<rect x="6" y="-12" width="60" height="14" rx="7" fill="#424242" ${st(3)}/>` +
          [14, 26, 38, 50, 60].map((x) => `<circle cx="${x}" cy="-5" r="3" fill="#9e9e9e"/>`).join('') +
          `<rect x="12" y="-34" width="38" height="22" rx="4" fill="#fdd835" ${st(3)}/><rect x="18" y="-30" width="14" height="12" fill="#b3e5fc" ${st(1.5)}/>` +
          `<path d="M50 -28 L70 -36 L80 -20 L66 -10 Z" fill="#fbc02d" ${st(2.5)}/>`,
      ),
  },
  {
    id: 'krit_hrilky',
    slot: 'feet',
    name: 'Капці-грілки',
    price: 12,
    draw: () =>
      // two red rubber hot-water bottles for slippers, steam curling from the stoppers
      pair(
        `<rect x="10" y="-26" width="60" height="26" rx="10" fill="#e53935" ${st(3)}/>` +
          `<path d="M18 -18 H62 M18 -10 H62" stroke="#c62828" stroke-width="2"/>` +
          `<rect x="66" y="-20" width="10" height="12" rx="3" fill="#212121"/>` +
          `<path d="M80 -20 q-6 -8 0 -16 q6 -8 0 -16" stroke="#eceff1" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'krit_vahonetky',
    slot: 'feet',
    name: 'Черевики-вагонетки',
    price: 14,
    draw: () =>
      // two little mine carts on wheels, piled up with shiny black coal and one gold nugget
      pair(
        `<path d="M8 -30 L70 -30 L64 -6 L14 -6 Z" fill="#8d6e63" ${st(3)}/>` +
          `<circle cx="22" cy="-4" r="7" fill="#424242" ${st(2)}/><circle cx="56" cy="-4" r="7" fill="#424242" ${st(2)}/>` +
          `<circle cx="24" cy="-34" r="7" fill="#212121"/><circle cx="38" cy="-36" r="8" fill="#212121"/><circle cx="54" cy="-34" r="7" fill="#212121"/>` +
          `<circle cx="46" cy="-40" r="5" fill="#ffca28" ${st(1.5)}/>`,
      ),
  },
];

// ---------------- the swallow ----------------

const L_BODY = 'M-66 -212 Q-86 -130 -62 -58 Q0 -32 62 -58 Q86 -130 66 -212 Q0 -244 -66 -212 Z';
/** a little skirt or shorts below her body (only the part under it shows) */
const L_SKIRT = (y: number) => `M-56 -90 Q-76 ${y - 20} -70 ${y} Q0 ${y + 14} 70 ${y} Q76 ${y - 20} 56 -90 Z`;

const LASTIVKA: Item[] = [
  {
    id: 'lastivka_beret',
    slot: 'head',
    name: 'Береточка художниці',
    price: 12,
    draw: () =>
      // a soft red beret tilted to one side, a little stalk on top and a paintbrush tucked in
      `<path d="M58 -40 L96 -96" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M58 -40 L96 -96" stroke="#ffb74d" stroke-width="4" stroke-linecap="round"/><path d="M92 -92 l10 -16 l6 6 z" fill="#1e88e5" ${st(2)}/>` +
      `<path d="M-74 0 Q-80 -50 -10 -58 Q70 -60 82 -14 Q40 -2 -74 0 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M4 -58 l2 -14" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
  },
  {
    id: 'lastivka_iliuminatory',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-ілюмінатори',
    price: 14,
    draw: () =>
      // two round ship's portholes: thick brass rims with rivets, the sea and a seagull in the glass
      [-36, 36]
        .map(
          (x) =>
            `<circle cx="${x}" cy="0" r="30" fill="#b3e5fc" fill-opacity=".45" stroke="#c99a1e" stroke-width="9"/>` +
            Array.from({ length: 6 }, (_, i) => `<circle cx="${(x + Math.cos((i * Math.PI) / 3) * 30).toFixed(1)}" cy="${(Math.sin((i * Math.PI) / 3) * 30).toFixed(1)}" r="3" fill="#8d6e3b"/>`).join('') +
            `<path d="M${x - 24} 14 q12 -6 24 0 q12 6 24 0" stroke="#1e88e5" stroke-width="4" fill="none"/>`,
        )
        .join('') + `<path d="M-6 -4 Q0 -10 6 -4" stroke="#c99a1e" stroke-width="6" fill="none"/>`,
  },
  {
    id: 'lastivka_lystivka',
    slot: 'mouth',
    name: 'Листівка в дзьобі',
    price: 10,
    draw: () =>
      // a spring postcard held in her beak: a red tulip on it and a stamp in the corner
      `<g transform="translate(36 18) rotate(-12)"><rect x="-10" y="-30" width="96" height="62" rx="4" fill="#fffde7" ${st(3)}/>` +
      `<rect x="56" y="-24" width="22" height="26" fill="#90caf9" ${st(2)}/><circle cx="67" cy="-11" r="5" fill="#fdd835"/>` +
      `<path d="M20 24 V-4" stroke="#43a047" stroke-width="3"/><path d="M12 -2 Q10 -20 20 -20 Q30 -20 28 -2 Z" fill="#e53935" ${st(2)}/></g>`,
  },
  {
    id: 'lastivka_riukzak',
    slot: 'neck',
    name: 'Рюкзачок мандрівниці',
    price: 15,
    draw: () =>
      // a little green travel backpack on her front: straps, a rolled-up blanket on top, a compass pocket
      `<path d="M-50 -10 Q-40 40 -40 90 M50 -10 Q40 40 40 90" stroke="#5d4037" stroke-width="8" fill="none"/>` +
      `<rect x="-46" y="40" width="92" height="96" rx="20" fill="#558b2f" ${stroke}/>` +
      `<rect x="-30" y="80" width="60" height="40" rx="10" fill="#7cb342" ${st(3)}/><circle cx="0" cy="100" r="9" fill="#fafafa" ${st(2)}/><path d="M0 92 l3 8 l-3 8 l-3 -8 z" fill="#e53935"/>` +
      `<rect x="-50" y="22" width="100" height="22" rx="11" fill="#ef6c00" ${st(3)}/>`,
  },
  {
    id: 'lastivka_chaiky',
    slot: 'torso',
    name: 'Кофтинка з морем і чайками',
    price: 17,
    draw: () =>
      // a sky-blue top: blue waves along the hem, white seagulls flying over them, a yellow sun
      `<path d="${L_BODY}" fill="#b3e5fc" ${stroke}/>` +
      `<path d="M-74 -100 q14 -12 28 0 q14 12 28 0 q14 -12 28 0 q14 12 28 0 q14 -12 28 0 L78 -60 Q0 -30 -78 -60 Z" fill="#1e88e5" ${st(3)}/>` +
      `<circle cx="34" cy="-196" r="14" fill="#ffeb3b" ${st(2)}/>` +
      [[-34, -170], [6, -146], [-10, -200]].map(([x, y]) => `<path d="M${x - 14} ${y} q7 -8 14 0 q7 -8 14 0" stroke="#fafafa" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${x - 14} ${y} q7 -8 14 0 q7 -8 14 0" stroke="${INK}" stroke-width="1" fill="none"/>`).join(''),
  },
  {
    id: 'lastivka_sakura',
    slot: 'torso',
    name: 'Кофтинка-сакура',
    price: 16,
    draw: () =>
      // a pale-pink top with a branch of cherry blossom across it, petals drifting down
      `<path d="${L_BODY}" fill="#fce4ec" ${stroke}/>` +
      `<path d="M-70 -110 Q-20 -150 30 -170 Q50 -180 70 -176 M10 -160 Q20 -130 40 -120" stroke="#5d4037" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      [[-40, -130], [0, -156], [36, -172], [40, -120], [-6, -126], [60, -180]].map(([x, y]) => bloom(x, y, 7, '#f48fb1', '#fff59d')).join('') +
      `<ellipse cx="-30" cy="-80" rx="5" ry="3" fill="#f48fb1"/><ellipse cx="20" cy="-70" rx="5" ry="3" fill="#f48fb1" transform="rotate(30 20 -70)"/>`,
  },
  {
    id: 'lastivka_pysanka',
    slot: 'torso',
    name: 'Кофтинка-писанка',
    price: 18,
    draw: () =>
      // painted like an Easter pysanka: red bands, a yellow zig-zag, little stars and wheat ears
      `<path d="${L_BODY}" fill="#c62828" ${stroke}/>` +
      `<path d="M-80 -160 H80 M-80 -110 H80" stroke="#212121" stroke-width="6"/>` +
      `<path d="M-78 -136 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 l12 -12 l12 12 l12 -12" stroke="#fdd835" stroke-width="5" fill="none"/>` +
      [-40, 0, 40].map((x) => star(x, -192, 12, '#fdd835', st(1.5))).join('') +
      [-40, 0, 40].map((x) => `<path d="M${x} -66 V-96 M${x} -88 l-8 -6 M${x} -88 l8 -6 M${x} -78 l-8 -6 M${x} -78 l8 -6" stroke="#fdd835" stroke-width="3" fill="none"/>`).join(''),
  },
  {
    id: 'lastivka_kava',
    slot: 'legs',
    name: 'Штанці з кавовими зернами',
    price: 12,
    draw: () =>
      // creamy latte-coloured shorts sprinkled with coffee beans
      `<path d="${L_SKIRT(-24)}" fill="#d7ccc8" ${stroke}/>` +
      [[-44, -50], [-14, -40], [20, -46], [50, -36], [-30, -30], [34, -64]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#5d4037" transform="rotate(30 ${x} ${y})"/><path d="M${x - 4} ${y - 2} q4 3 8 4" stroke="#d7ccc8" stroke-width="1.5" fill="none"/>`).join(''),
  },
  {
    id: 'lastivka_iris',
    slot: 'legs',
    name: 'Спідничка-ірис',
    price: 14,
    draw: () =>
      // three ruffled purple iris petals for a skirt, yellow beards down their middles
      [-1, 0, 1].map((k) => `<path d="M${k * 36} -86 Q${k * 36 - 40} -50 ${k * 46} -10 Q${k * 36 + 40} -50 ${k * 36} -86 Z" fill="${k ? '#7e57c2' : '#9575cd'}" ${st(3)}/><path d="M${k * 36} -76 Q${k * 40} -50 ${k * 44} -26" stroke="#ffca28" stroke-width="4" fill="none" stroke-linecap="round"/>`).join(''),
  },
  {
    id: 'lastivka_abrykosa',
    slot: 'legs',
    name: 'Спідничка-абрикоска',
    price: 13,
    draw: () =>
      // a round apricot-orange skirt with a rosy blush, a leaf at the waist
      `<path d="${L_SKIRT(-18)}" fill="#ffb74d" ${stroke}/>` +
      `<ellipse cx="30" cy="-50" rx="26" ry="16" fill="#ff8a65" opacity=".7"/>` +
      `<path d="M0 -90 Q-4 -60 0 -24" stroke="#f57c00" stroke-width="3" fill="none"/>` +
      `<path d="M-56 -86 Q-80 -110 -60 -116 Q-48 -100 -56 -86 Z" fill="#66bb6a" ${st(2)}/>`,
  },
  {
    id: 'lastivka_litachky',
    slot: 'feet',
    name: 'Черевички-літачки',
    price: 15,
    draw: () =>
      // tiny white aeroplanes for shoes: wings, a red tail, a propeller at the nose
      pair(
        `<path d="M6 -12 Q6 -22 18 -22 L48 -22 Q58 -16 48 -6 L18 -6 Q6 -6 6 -12 Z" fill="#fafafa" ${st(2.5)}/>` +
          `<path d="M24 -14 L36 -14 L40 4 L30 4 Z" fill="#90caf9" ${st(2)}/>` +
          `<path d="M8 -20 L2 -32 L12 -22 Z" fill="#e53935" ${st(2)}/>` +
          `<path d="M54 -24 V-2" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="52" cy="-14" r="3" fill="#fdd835"/>`,
      ),
  },
  {
    id: 'lastivka_mandaryny',
    slot: 'feet',
    name: 'Черевички-мандарини',
    price: 12,
    draw: () =>
      // two round orange tangerines with a green leaf each
      pair(`<circle cx="22" cy="-12" r="14" fill="#ff9800" ${st(3)}/><circle cx="18" cy="-16" r="3" fill="#ffcc80"/><path d="M24 -26 Q34 -34 38 -24 Q30 -20 24 -26 Z" fill="#43a047" ${st(2)}/>`),
  },
  {
    id: 'lastivka_dzyhy',
    slot: 'feet',
    name: 'Черевички-дзиґи',
    price: 13,
    draw: () =>
      // striped spinning tops for shoes, spinning on their points
      pair(
        `<path d="M4 -14 Q20 -32 40 -14 L22 2 Z" fill="#fdd835" ${st(2.5)}/>` +
          `<path d="M10 -18 Q22 -26 34 -18 M14 -10 Q22 -16 30 -10" stroke="#e53935" stroke-width="4" fill="none"/>` +
          `<path d="M22 -26 V-34" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M6 4 q-4 -4 -8 0 M40 4 q4 -4 8 0" stroke="#90a4ae" stroke-width="2" fill="none"/>`,
      ),
  },
];

// ---------------- the prince of the elves ----------------

const E_TUNIC = 'M-44 -244 Q-56 -190 -54 -104 L54 -104 Q56 -190 44 -244 Q0 -256 -44 -244 Z';
const E_ARM = 'M42 -226 Q62 -196 56 -164';
const eTop = (fill: string, tunic = E_TUNIC) => sleeves(E_ARM, fill, 17) + `<path d="${tunic}" fill="${fill}" ${stroke}/>`;
const E_LEGS = 'M-30 -112 L-28 -12 L-4 -12 L0 -80 L4 -12 L28 -12 L30 -112 Z';

const ELF: Item[] = [
  {
    id: 'elf_konvalia',
    slot: 'head',
    name: 'Капелюшок-конвалія',
    price: 13,
    draw: () =>
      // a lily-of-the-valley hat: a broad green leaf for the brim, little white bells hanging round
      `<path d="M-74 4 Q-60 -30 0 -36 Q60 -30 74 4 Q0 -6 -74 4 Z" fill="#43a047" ${stroke}/>` +
      `<path d="M-40 -30 Q-10 -110 30 -120" stroke="#43a047" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      [[-34, -50], [-24, -74], [-8, -94], [12, -108]].map(([x, y]) => `<path d="M${x - 10} ${y + 16} Q${x - 12} ${y} ${x} ${y} Q${x + 12} ${y} ${x + 10} ${y + 16} L${x + 6} ${y + 12} L${x} ${y + 18} L${x - 6} ${y + 12} Z" fill="#fafafa" ${st(2.5)}/>`).join(''),
  },
  {
    id: 'elf_krystaly',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-кристали',
    price: 15,
    draw: () =>
      // six-sided lenses cut like crystals, sparkling with rainbow glints
      [-36, 36]
        .map(
          (x) =>
            `<path d="M${x - 30} 0 L${x - 15} -26 L${x + 15} -26 L${x + 30} 0 L${x + 15} 26 L${x - 15} 26 Z" fill="#e1f5fe" fill-opacity=".45" stroke="#7e57c2" stroke-width="6" stroke-linejoin="round"/>` +
            `<path d="M${x - 15} -26 L${x} 0 L${x + 15} -26 M${x - 30} 0 H${x + 30} M${x - 15} 26 L${x} 0 L${x + 15} 26" stroke="#b39ddb" stroke-width="1.5"/>` +
            `<path d="M${x - 18} -14 l6 -6" stroke="#f48fb1" stroke-width="3" stroke-linecap="round"/><path d="M${x + 14} 12 l6 -6" stroke="#80deea" stroke-width="3" stroke-linecap="round"/>`,
        )
        .join('') + `<path d="M-6 -4 Q0 -10 6 -4" stroke="#7e57c2" stroke-width="5" fill="none"/>`,
  },
  {
    id: 'elf_surma',
    slot: 'mouth',
    name: 'Сурма-лілія',
    price: 12,
    draw: () =>
      // he blows a trumpet made of a white lily flower, a little fanfare coming out
      `<path d="M0 0 L70 -14" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M0 0 L70 -14" stroke="#81c784" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M66 -14 L110 -50 Q120 -14 110 22 Z" fill="#fafafa" ${st(3)}/><path d="M110 -50 Q124 -50 120 -36 M110 22 Q124 22 120 8" stroke="${INK}" stroke-width="3" fill="none"/>` +
      `<path d="M130 -30 q8 -6 14 0 M132 -10 h14 M130 10 q8 6 14 0" stroke="#fdd835" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'elf_palychka',
    slot: 'neck',
    name: 'Чарівна паличка',
    price: 14,
    draw: () =>
      // a slim silver wand with a golden star at its tip and a trail of sparkles
      `<path d="M50 120 L90 -60" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M50 120 L90 -60" stroke="#e0e0e0" stroke-width="4" stroke-linecap="round"/>` +
      star(92, -74, 24, '#ffd54f', st(3)) +
      `<circle cx="60" cy="-100" r="4" fill="#fff59d"/><circle cx="120" cy="-96" r="3" fill="#fff59d"/><circle cx="118" cy="-50" r="4" fill="#fff59d"/>`,
  },
  {
    id: 'elf_luk',
    slot: 'neck',
    name: 'Лук зі стрілами',
    price: 16,
    draw: () =>
      // a little bow over his shoulder and a quiver of arrows with feathers on his back
      `<path d="M-60 -60 Q-110 50 -40 150" stroke="${INK}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M-60 -60 Q-110 50 -40 150" stroke="#a1683a" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-60 -60 L-40 150" stroke="#eceff1" stroke-width="2"/>` +
      `<rect x="40" y="-10" width="30" height="100" rx="8" fill="#8d6e63" ${st(3)} transform="rotate(16 55 40)"/>` +
      [[46, -30, '#e53935'], [58, -26, '#1e88e5'], [70, -22, '#43a047']].map(([x, y, c]) => `<path d="M${x} ${Number(y) + 10} l-2 -24" stroke="${INK}" stroke-width="2"/><path d="M${Number(x) - 2} ${Number(y) - 14} l-6 -10 l6 4 l6 -4 z" fill="${c}" ${st(1.5)}/>`).join('') +
      `<path d="M20 -10 L90 110" stroke="#5d4037" stroke-width="5"/>`,
  },
  {
    id: 'elf_misiachne',
    slot: 'torso',
    name: 'Плащ місячного сяйва',
    price: 18,
    draw: () =>
      // a deep-blue cloak over his tunic, a silver moon and little stars on it, a clasp at the neck
      `<path d="M-40 -240 Q-80 -160 -76 -60 Q0 -40 76 -60 Q80 -160 40 -240 Z" fill="#283593" ${stroke}/>` +
      eTop('#5c6bc0', 'M-30 -244 Q-38 -190 -36 -104 L36 -104 Q38 -190 30 -244 Q0 -254 -30 -244 Z') +
      `<path d="M-60 -170 a18 18 0 1 0 12 -26 a14 14 0 1 1 -12 26 Z" fill="#eceff1" ${st(2)}/>` +
      [[50, -190], [-56, -110], [56, -120], [-20, -80], [20, -150]].map(([x, y]) => star(x, y, 8, '#fff59d')).join('') +
      `<circle cx="0" cy="-236" r="9" fill="#cfd8dc" ${st(2.5)}/>`,
  },
  {
    id: 'elf_kamzol',
    slot: 'torso',
    name: 'Камзол принца',
    price: 17,
    draw: () =>
      // a red velvet coat with gold braid across the chest, a white lace jabot, gold buttons
      eTop('#c62828') +
      [-200, -180, -160, -140].map((y) => `<path d="M-30 ${y} H30" stroke="#ffca28" stroke-width="4"/><circle cx="-30" cy="${y}" r="4" fill="#ffca28"/><circle cx="30" cy="${y}" r="4" fill="#ffca28"/>`).join('') +
      `<path d="M-14 -240 Q0 -216 14 -240 L10 -220 Q0 -206 -10 -220 Z" fill="#fafafa" ${st(2)}/>` +
      `<path d="M-54 -108 H54" stroke="#ffca28" stroke-width="6"/>`,
  },
  {
    id: 'elf_tunika',
    slot: 'torso',
    name: 'Туніка лучника',
    price: 15,
    draw: () =>
      // a forest-green archer's tunic with a pointed hem, a brown leather belt and a leaf brooch
      eTop('#2e7d32', 'M-44 -244 Q-56 -190 -54 -120 L-40 -100 L-20 -116 L0 -96 L20 -116 L40 -100 L54 -120 Q56 -190 44 -244 Q0 -256 -44 -244 Z') +
      `<rect x="-52" y="-160" width="104" height="14" rx="4" fill="#6d4c41" ${st(3)}/><rect x="-8" y="-162" width="16" height="18" rx="3" fill="#ffca28" ${st(2)}/>` +
      `<path d="M-24 -226 Q-6 -236 -6 -214 Q-18 -208 -24 -226 Z" fill="#9ccc65" ${st(2)}/>`,
  },
  {
    id: 'elf_stebeltsia',
    slot: 'legs',
    name: 'Лосини-стебельця',
    price: 12,
    draw: () =>
      // green tights like flower stalks, little leaves sprouting along them
      `<path d="${E_LEGS}" fill="#7cb342" ${stroke}/>` +
      [[-26, -90], [-8, -60], [-26, -34], [26, -96], [8, -66], [26, -40]].map(([x, y]) => `<path d="M${x} ${y} Q${x + (x < 0 ? -16 : 16)} ${y - 10} ${x + (x < 0 ? -18 : 18)} ${y + 4} Q${x + (x < 0 ? -8 : 8)} ${y + 6} ${x} ${y} Z" fill="#43a047" ${st(1.5)}/>`).join(''),
  },
  {
    id: 'elf_mokh',
    slot: 'legs',
    name: 'Шорти-мох',
    price: 11,
    draw: () =>
      // soft shorts of green moss, tiny red mushrooms poking out
      `<path d="M-32 -112 L-34 -60 L-4 -60 L0 -84 L4 -60 L34 -60 L32 -112 Z" fill="#689f38" ${stroke}/>` +
      Array.from({ length: 16 }, (_, i) => `<circle cx="${-28 + (i % 8) * 8}" cy="${-104 + Math.floor(i / 8) * 26 + (i % 2) * 6}" r="4" fill="#8bc34a"/>`).join('') +
      `<path d="M-20 -64 v-8 M20 -64 v-8" stroke="#fafafa" stroke-width="3"/><path d="M-26 -72 q6 -8 12 0 z M14 -72 q6 -8 12 0 z" fill="#e53935" ${st(1.5)}/>`,
  },
  {
    id: 'elf_zorepad',
    slot: 'legs',
    name: 'Штанці-зорепад',
    price: 14,
    draw: () =>
      // midnight-blue trousers with falling stars streaking down them
      `<path d="${E_LEGS}" fill="#1a237e" ${stroke}/>` +
      [[-20, -94], [16, -84], [-14, -48], [20, -40]].map(([x, y]) => `<path d="M${x - 10} ${y - 14} L${x} ${y}" stroke="#fff59d" stroke-width="2" opacity=".7"/>` + star(x, y, 6, '#fff59d')).join(''),
  },
  {
    id: 'elf_lodynky',
    slot: 'feet',
    name: 'Черевички-льодинки',
    price: 14,
    draw: () =>
      // shoes of clear blue ice, a frosty curl at the toe, a snowflake glinting inside
      pair(
        `<path d="M8 -22 L8 0 L48 0 Q66 -2 62 -16 Q56 -10 46 -12 L26 -22 Z" fill="#b3e5fc" fill-opacity=".85" ${st(2.5)}/>` +
          `<path d="M62 -16 Q70 -26 60 -30" stroke="#4fc3f7" stroke-width="3" fill="none"/>` +
          `<path d="M30 -12 h12 M36 -18 v12 M32 -16 l8 8 M40 -16 l-8 8" stroke="#fafafa" stroke-width="2"/>`,
      ),
  },
  {
    id: 'elf_perchyky',
    slot: 'feet',
    name: 'Черевички-перчики',
    price: 12,
    draw: () =>
      // two shiny red chilli peppers for shoes, their green stalks at the heel
      pair(`<path d="M10 -18 Q30 -26 52 -14 Q66 -6 70 4 Q50 -4 26 0 Q8 0 10 -18 Z" fill="#e53935" ${st(2.5)}/><path d="M10 -18 Q2 -24 6 -32" stroke="#43a047" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M24 -16 q10 -4 20 0" stroke="#ffcdd2" stroke-width="3" fill="none"/>`),
  },
  {
    id: 'elf_khmelynky',
    slot: 'feet',
    name: 'Черевички-хмелинки',
    price: 12,
    draw: () =>
      // pale-green hop cones for shoes, their scales overlapping like a little pine cone
      pair(
        `<ellipse cx="32" cy="-12" rx="26" ry="13" fill="#c5e1a5" ${st(2.5)}/>` +
          [14, 24, 34, 44].map((x) => `<path d="M${x} -20 q6 8 0 16" stroke="#9ccc65" stroke-width="2.5" fill="none"/>`).join('') +
          `<path d="M58 -14 Q70 -22 72 -12" stroke="#7cb342" stroke-width="3" fill="none"/>`,
      ),
  },
];

export const ITEMS: Item[] = [...DUIM, ...ZHUK, ...KRIT, ...LASTIVKA, ...ELF];

// the little things held or worn on these small heads came out too small: drawn bigger
const BIGGER: Record<string, number> = { duim_rosa: 1.4, duim_arfa: 1.5, zhuk_akordeon: 1.4, zhuk_buzok: 1.4, krit_sukharyk: 1.4, elf_surma: 1.4, elf_palychka: 1.4, elf_luk: 1.3 };
for (const it of ITEMS) {
  const k = BIGGER[it.id];
  if (!k) continue;
  const draw = it.draw;
  it.draw = () => `<g transform="scale(${k})">${draw()}</g>`;
}

const ids = (list: Item[]) => list.map((i) => i.id).join(' ');
export const SETS: Record<string, string> = {
  duimovochka: ids(DUIM),
  zhuk: ids(ZHUK),
  krit: ids(KRIT),
  lastivka: ids(LASTIVKA),
  elf: ids(ELF),
};
