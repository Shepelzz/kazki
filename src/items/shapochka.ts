// The own things of the heroes of «Червона Шапочка». SETS here ADD to a hero's set.
//
// Both face us (two eyes: they can wear glasses). The accessories are drawn for u = 100 as everywhere
// (head: the origin on top of the head; face: between the eyes, the eyes at ±34; mouth; neck: under
// the chin). The clothes in their own numbers (puppets-shapochka.ts, feet at 0,0):
// • Червона Шапочка — the bodice from the shoulders at −240 to the waist at −176, puffed sleeves
//   (round ±52,−224) and bare arms down to the hands at ±60,−156; the skirt from the waist at −178
//   flaring to ±74 at −70 (the petticoat to −50); the legs at x ±8..28 down to the shoes below −22.
//   Her cape and hood stay on (a hat takes the hood off): her tops go over the dress, under the cape.
// • Мисливець — the jacket from the shoulders at −262 to the hips at −116 (±64..±82), the arms from
//   ±62,−256 to the hands at ±92,−136; the legs at x ±4..44 from −130 down, tall boots up to −66,
//   the soles to ±58 at 0.
// No lettering anywhere.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** a pair: one shoe drawn for the right foot, mirrored for the left */
const pair = (shoe: string) => `<g transform="scale(-1 1)">${shoe}</g>${shoe}`;

/** a thick line: the ink outline, then its colour over it */
const limb = (d: string, fill: string, w: number) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;

// ---------------- Червона Шапочка ----------------

/** her sleeves: a puff at the shoulder and a sleeve down to the wrist (both sides) */
const girlSleeves = (fill: string, extra = '') => {
  const one = `${limb('M50 -216 Q66 -190 60 -166', fill, 16)}<circle cx="52" cy="-224" r="19" fill="${fill}" ${st(4)}/>${extra}`;
  return `<g transform="scale(-1 1)">${one}</g>${one}`;
};
/** her top: from the shoulders down over the top of her skirt (a long top, a tunic) */
const GIRL_TOP = 'M-46 -242 Q-56 -206 -52 -176 L-60 -138 Q0 -128 60 -138 L52 -176 Q56 -206 46 -242 Q0 -256 -46 -242 Z';
/** a skirt over her dress, down to y */
const skirt = (y = -48) => `M-48 -180 L-80 ${y + 4} Q0 ${y + 16} 80 ${y + 4} L48 -180 Q0 -186 -48 -180 Z`;

const SHAPOCHKA: Item[] = [
  {
    id: 'shap_koshyk',
    slot: 'head',
    name: 'Капелюх-кошик',
    price: 14,
    draw: () => {
      // an upside-down wicker basket for a hat, its handle arching over the top, a little bird
      // sitting on the handle, two pies peeping from a pocket in the brim
      let weave = '';
      for (let i = 0; i < 4; i++) weave += `<path d="M-52 ${-12 - i * 13} Q0 ${-4 - i * 13} 52 ${-12 - i * 13}" stroke="#9c6b35" stroke-width="3" fill="none"/>`;
      for (let x = -40; x <= 40; x += 16) weave += `<path d="M${x} -2 L${x * 0.8} -62" stroke="#9c6b35" stroke-width="2.5"/>`;
      return (
        `<path d="M-42 -60 Q0 -150 42 -60" fill="none" stroke="${INK}" stroke-width="12"/><path d="M-42 -60 Q0 -150 42 -60" fill="none" stroke="#c8955a" stroke-width="6"/>` +
        `<path d="M-62 4 L-46 -64 Q0 -72 46 -64 L62 4 Q0 14 -62 4 Z" fill="#d9a865" ${stroke}/>` +
        weave +
        `<path d="M-62 4 L-46 -64 Q0 -72 46 -64 L62 4 Q0 14 -62 4 Z" fill="none" ${stroke}/>` +
        `<path d="M-80 6 Q0 24 80 6 Q86 -4 76 -8 Q0 6 -76 -8 Q-86 -4 -80 6 Z" fill="#c8955a" ${st(3)}/>` +
        // the bird on the handle
        `<g transform="translate(14 -108)"><ellipse cx="0" cy="0" rx="16" ry="12" fill="#42a5f5" ${st(2.5)}/><circle cx="-12" cy="-8" r="9" fill="#42a5f5" ${st(2.5)}/>` +
        `<path d="M-20 -8 l-8 3 l8 2 z" fill="#ffb300" ${st(1.5)}/><circle cx="-13" cy="-10" r="2" fill="${INK}"/><path d="M14 -4 l14 -8 l-4 12 z" fill="#1e88e5" ${st(2)}/></g>` +
        // the pies by the brim
        `<g transform="translate(-58 -6) rotate(-14)"><path d="M-14 0 Q-16 -16 0 -18 Q16 -16 14 0 Z" fill="#e2a24a" ${st(2.5)}/><path d="M-6 -4 q3 -5 0 -9 M4 -4 q3 -5 0 -9" stroke="#b5762a" stroke-width="2" fill="none"/></g>`
      );
    },
  },
  {
    id: 'shap_vyshenky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-вишеньки',
    price: 13,
    draw: () =>
      // two shiny red cherries for lenses, joined at the top by their stalks and a green leaf
      `<path d="M-30 -24 Q-14 -60 0 -62 Q14 -60 30 -24" fill="none" stroke="#558b2f" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M0 -62 q20 -16 40 -6 q-18 18 -40 6 z" fill="#7cb342" ${st(2.5)}/><path d="M2 -62 q16 -6 34 -6" stroke="#558b2f" stroke-width="2" fill="none"/>` +
      [-34, 34]
        .map((x) => `<circle cx="${x}" cy="0" r="28" fill="#e53935" fill-opacity=".55" stroke="#b71c1c" stroke-width="7"/><ellipse cx="${x - 10}" cy="-12" rx="7" ry="4" fill="#fff" opacity=".8" transform="rotate(-30 ${x - 10} -12)"/>`)
        .join(''),
  },
  {
    id: 'shap_kulbaba',
    slot: 'mouth',
    name: 'Кульбабка-дмухавець',
    price: 9,
    draw: () =>
      // a dandelion clock held up to her lips: the white fluffy ball, and the seeds blown away
      `<g transform="scale(1.6)">` +
      `<path d="M0 14 Q24 10 44 -24" stroke="#7cb342" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<g transform="translate(50 -46)">` +
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const x = Math.cos(a) * 26;
        const y = Math.sin(a) * 26;
        return `<path d="M0 0 L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#e0e0e0" stroke-width="2"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#fff" ${st(1)}/>`;
      }).join('') +
      `<circle r="6" fill="#c5e1a5" ${st(1.5)}/></g>` +
      [[100, -80], [118, -50], [92, -110], [130, -96]].map(([x, y]) => `<path d="M${x} ${y} l-10 8" stroke="#bdbdbd" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="5" fill="#fff" ${st(1)}/>`).join('') +
      `</g>`,
  },
  {
    id: 'shap_yizhachok',
    slot: 'neck',
    name: 'Їжачок-друг на плечі',
    price: 15,
    draw: () =>
      // a little hedgehog riding on her shoulder, an apple stuck on its prickles, waving
      `<g transform="translate(84 26) scale(1.45)">` +
      `<path d="M-40 10 Q-44 -30 -10 -40 Q30 -44 44 -10 Q48 14 30 18 L-30 18 Q-42 18 -40 10 Z" fill="#6d4c41" ${stroke}/>` +
      Array.from({ length: 9 }, (_, i) => `<path d="M${-34 + i * 9} ${-24 + Math.abs(i - 4) * 4} l-6 -16 l10 10" fill="#4e342e" ${st(1.5)}/>`).join('') +
      `<path d="M-40 4 Q-62 0 -66 14 Q-56 22 -36 18 Z" fill="#d7b48a" ${st(2.5)}/><circle cx="-66" cy="12" r="5" fill="${INK}"/>` +
      `<circle cx="-46" cy="6" r="3" fill="${INK}"/>` +
      `<path d="M-30 16 q-6 -18 -16 -26" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><circle cx="-48" cy="-12" r="5" fill="#d7b48a" ${st(2)}/>` +
      `<circle cx="16" cy="-38" r="13" fill="#e53935" ${st(2.5)}/><path d="M16 -50 q2 -8 8 -10" stroke="#5d4037" stroke-width="3" fill="none"/><path d="M18 -52 q10 -10 18 -2 q-10 6 -18 2 z" fill="#7cb342" ${st(1.5)}/></g>`,
  },
  {
    id: 'shap_mapa',
    slot: 'torso',
    name: 'Курточка-мапа до бабусі',
    price: 17,
    draw: () =>
      // a cream jacket printed as a map: mum's house, the dotted path past trees and the mill, grandma's cottage with a heart
      girlSleeves('#f5e6c4', `<path d="M56 -200 l6 -6 l6 6 M54 -186 l6 -6 l6 6" stroke="#43a047" stroke-width="3" fill="none"/>`) +
      `<path d="${GIRL_TOP}" fill="#f5e6c4" ${stroke}/>` +
      `<path d="M-34 -150 Q-10 -190 10 -168 Q30 -150 30 -196" stroke="#a1704a" stroke-width="3" stroke-dasharray="5 5" fill="none"/>` +
      `<path d="M-46 -150 v-16 l9 -9 l9 9 v16 z" fill="#fff" ${st(2)}/><path d="M-48 -166 l11 -11 l11 11" fill="#e53935" ${st(2)}/>` +
      `<circle cx="-14" cy="-190" r="8" fill="#43a047" ${st(1.5)}/><path d="M-14 -182 v7" stroke="#6d4426" stroke-width="2"/>` +
      `<circle cx="-34" cy="-212" r="7" fill="#2e7d32" ${st(1.5)}/>` +
      `<path d="M12 -160 l-4 -18 h8 z" fill="#c8955a" ${st(1.5)}/><path d="M12 -178 l-9 -7 M12 -178 l9 -7 M12 -178 l-7 9 M12 -178 l7 9" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M22 -200 v-14 l10 -8 l10 8 v14 z" fill="#fff" ${st(2)}/><path d="M32 -210 l-4 -4 q4 -5 4 0 q0 -5 4 0 z" fill="#e53935"/>` +
      `<path d="M-6 -242 Q0 -236 6 -242" stroke="${INK}" stroke-width="3" fill="none"/>`,
  },
  {
    id: 'shap_vovchyk',
    slot: 'torso',
    name: 'Светрик з усміхненим вовчиком',
    price: 16,
    draw: () =>
      // a soft yellow jumper with a friendly grey wolf's face knitted on it, his tongue out, a little heart
      girlSleeves('#ffd54f', `<path d="M50 -168 h20" stroke="#ffb300" stroke-width="6"/>`) +
      `<path d="${GIRL_TOP}" fill="#ffd54f" ${stroke}/>` +
      `<path d="M-58 -146 Q0 -136 58 -146" stroke="#ffb300" stroke-width="7" fill="none"/>` +
      `<g transform="translate(0 -170) scale(1.15)">` +
      `<path d="M-20 -8 l4 -18 l10 12 z M20 -8 l-4 -18 l-10 12 z" fill="#78909c" ${st(2)}/>` +
      `<ellipse cx="0" cy="6" rx="22" ry="18" fill="#90a4ae" ${st(2.5)}/>` +
      `<ellipse cx="0" cy="14" rx="11" ry="8" fill="#eceff1" ${st(1.5)}/><circle cx="0" cy="10" r="3" fill="${INK}"/>` +
      `<circle cx="-8" cy="0" r="2.5" fill="${INK}"/><circle cx="8" cy="0" r="2.5" fill="${INK}"/>` +
      `<path d="M-6 18 q6 5 12 0" stroke="${INK}" stroke-width="2" fill="none"/><path d="M-2 19 q2 6 4 0" fill="#f06292"/></g>` +
      `<path d="M-34 -222 c-4 -6 -12 -2 -8 4 l8 6 l8 -6 c4 -6 -4 -10 -8 -4 z" fill="#e53935"/>`,
  },
  {
    id: 'shap_kosyk',
    slot: 'torso',
    name: 'Жилетка-кошик',
    price: 14,
    draw: () => {
      // a waistcoat woven of willow like a basket, a checked napkin peeping from its pocket
      let weave = '';
      for (let y = -236; y < -136; y += 10) weave += `<path d="M-50 ${y} Q0 ${y + 6} 50 ${y}" stroke="#9c6b35" stroke-width="3" fill="none"/>`;
      for (let x = -48; x <= 48; x += 12) weave += `<path d="M${x} -246 V-130" stroke="#9c6b35" stroke-width="2"/>`;
      return (
        girlSleeves('#fff8e1') +
        `<clipPath id="shap-kosyk"><path d="${GIRL_TOP}"/></clipPath>` +
        `<path d="${GIRL_TOP}" fill="#d9a865" ${stroke}/><g clip-path="url(#shap-kosyk)">${weave}</g><path d="${GIRL_TOP}" fill="none" ${stroke}/>` +
        `<path d="M-14 -246 L0 -214 L14 -246" fill="#fff8e1" ${st(2.5)}/>` +
        `<rect x="14" y="-170" width="28" height="24" rx="3" fill="#c8955a" ${st(2.5)}/>` +
        `<path d="M16 -170 l6 -10 l6 8 l6 -9 l6 11 z" fill="#fff" ${st(1.5)}/><path d="M20 -176 h4 M28 -178 h4" stroke="#e53935" stroke-width="3"/>`
      );
    },
  },
  {
    id: 'shap_zozulia',
    slot: 'legs',
    name: 'Спідниця з зозулею',
    price: 16,
    draw: () =>
      // a skirt made like a cuckoo clock: a carved wooden front, the clock face, a little door the
      // cuckoo pops out of, pine-cone weights swinging below the hem
      `<path d="${skirt(-50)}" fill="#a0703c" ${stroke}/>` +
      `<path d="M-60 -60 Q0 -48 60 -60" stroke="#6d4426" stroke-width="6" fill="none"/>` +
      `<circle cx="0" cy="-118" r="26" fill="#fff8e1" ${st(3)}/><path d="M0 -118 V-136 M0 -118 h14" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
      [0, 1, 2, 3].map((i) => `<circle cx="${(Math.cos((i * Math.PI) / 2) * 20).toFixed(1)}" cy="${(-118 + Math.sin((i * Math.PI) / 2) * 20).toFixed(1)}" r="2.5" fill="${INK}"/>`).join('') +
      `<rect x="-12" y="-176" width="24" height="20" fill="#3e2723" ${st(2)}/>` +
      `<g transform="translate(0 -166)"><ellipse cx="10" cy="0" rx="12" ry="8" fill="#fdd835" ${st(2)}/><path d="M22 -2 l8 2 l-8 3 z" fill="#ff8f00"/><circle cx="16" cy="-2" r="1.6" fill="${INK}"/></g>` +
      `<path d="M-40 -170 l10 -10 l10 10 M20 -170 l10 -10 l10 10" stroke="#6d4426" stroke-width="5" fill="none"/>` +
      `<path d="M-24 -40 V-20 M24 -40 V-10" stroke="${INK}" stroke-width="2"/>` +
      `<ellipse cx="-24" cy="-12" rx="7" ry="12" fill="#795548" ${st(2)}/><ellipse cx="24" cy="-2" rx="7" ry="12" fill="#795548" ${st(2)}/>`,
  },
  {
    id: 'shap_stezhky',
    slot: 'legs',
    name: 'Штанці-стежинки',
    price: 13,
    draw: () =>
      // light green trousers with winding dotted paths running down them, little footprints, tiny flowers
      `<path d="M-46 -180 Q-56 -110 -34 -18 L-6 -18 L0 -110 L6 -18 L34 -18 Q56 -110 46 -180 Q0 -186 -46 -180 Z" fill="#c5e1a5" ${stroke}/>` +
      `<path d="M-30 -172 Q-14 -140 -32 -110 Q-46 -80 -20 -30 M30 -172 Q16 -140 32 -110 Q46 -80 20 -30" stroke="#a1704a" stroke-width="5" stroke-dasharray="6 6" fill="none"/>` +
      [[-12, -150], [-38, -86], [12, -130], [38, -70]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.5" ry="5" fill="#6d4c41"/><ellipse cx="${x + 6}" cy="${y + 8}" rx="3.5" ry="5" fill="#6d4c41"/>`).join('') +
      [[-20, -106, '#e53935'], [22, -100, '#fdd835'], [-40, -50, '#8e24aa'], [40, -40, '#1e88e5']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c}" ${st(1.5)}/>`).join(''),
  },
  {
    id: 'shap_dysko',
    slot: 'legs',
    name: 'Спідниця-диско',
    price: 18,
    draw: () => {
      // a skirt of little mirror squares like a disco ball, glints flashing off it
      let tiles = '';
      for (let r = 0; r < 7; r++)
        for (let i = -6; i <= 6; i++) {
          const y = -172 + r * 18;
          const w = 50 + r * 4.5;
          const x = i * 12;
          if (Math.abs(x) > w) continue;
          tiles += `<rect x="${x - 5}" y="${y}" width="10" height="15" fill="${['#cfd8dc', '#eceff1', '#b0bec5', '#e1f5fe', '#f3e5f5'][(i + r + 20) % 5]}"/>`;
        }
      return (
        `<clipPath id="shap-dysko"><path d="${skirt(-50)}"/></clipPath>` +
        `<path d="${skirt(-50)}" fill="#90a4ae" ${stroke}/><g clip-path="url(#shap-dysko)">${tiles}</g><path d="${skirt(-50)}" fill="none" ${stroke}/>` +
        [[-36, -120], [30, -96], [-4, -150], [50, -60]].map(([x, y]) => `<path d="M${x} ${y - 10} V${y + 10} M${x - 10} ${y} H${x + 10}" stroke="#fff" stroke-width="3"/>`).join('') +
        `<path d="M-100 -110 l-14 -4 M-100 -90 l-16 2 M100 -110 l14 -4 M100 -90 l16 2" stroke="#f06292" stroke-width="4" stroke-linecap="round"/>`
      );
    },
  },
  {
    id: 'shap_shkatulky',
    slot: 'feet',
    name: 'Черевички-скриньки з балериною',
    price: 17,
    draw: () =>
      // each shoe a little music box: a pink box with gold corners, its lid open, a tiny dancer on top
      pair(
        `<rect x="2" y="-26" width="46" height="26" rx="4" fill="#f48fb1" ${st(3)}/>` +
          `<path d="M2 -26 L-4 -40 L42 -40 L48 -26" fill="#f8bbd0" ${st(2.5)}/>` +
          `<circle cx="6" cy="-4" r="3" fill="#ffd54f"/><circle cx="44" cy="-4" r="3" fill="#ffd54f"/>` +
          `<path d="M25 -26 v-8" stroke="${INK}" stroke-width="2"/><circle cx="25" cy="-52" r="4" fill="#f2c4a0" ${st(1.5)}/>` +
          `<path d="M25 -48 v10 M19 -38 h12 l-6 -6 z M25 -48 l-8 -6 M25 -48 l8 -6" stroke="${INK}" stroke-width="2" fill="#fff"/>` +
          `<path d="M48 -14 q8 -4 6 -10" stroke="#ffd54f" stroke-width="3" fill="none"/><circle cx="56" cy="-30" r="3" fill="${INK}"/><path d="M56 -30 v-10 l6 2" stroke="${INK}" stroke-width="2" fill="none"/>`,
      ),
  },
  {
    id: 'shap_makaruny',
    slot: 'feet',
    name: 'Черевички-макаруни',
    price: 12,
    draw: () =>
      // each shoe a macaron: two round pastel biscuits with a cream filling between
      pair(
        `<path d="M2 -12 Q2 -26 24 -26 Q50 -26 50 -12 Z" fill="#b39ddb" ${st(2.5)}/>` +
          `<rect x="2" y="-13" width="48" height="6" rx="3" fill="#fff8e1" ${st(2)}/>` +
          `<path d="M2 -7 Q2 0 24 0 Q50 0 50 -7 Z" fill="#b39ddb" ${st(2.5)}/>` +
          `<path d="M6 -14 l3 -3 M14 -14 l3 -3 M22 -14 l3 -3 M30 -14 l3 -3 M38 -14 l3 -3" stroke="#9575cd" stroke-width="2"/>` +
          `<circle cx="36" cy="-20" r="2.5" fill="#fff"/>`,
      ),
  },
  {
    id: 'shap_chornytsi',
    slot: 'feet',
    name: 'Черевички-чорнички',
    price: 11,
    draw: () =>
      // each shoe a fat round blueberry with its little crown, a leaf and two small berries by the toe
      pair(
        `<ellipse cx="24" cy="-14" rx="24" ry="15" fill="#3949ab" ${st(3)}/>` +
          `<path d="M18 -26 l6 -6 l6 6 l-6 3 z" fill="#283593" ${st(1.5)}/><ellipse cx="14" cy="-18" rx="6" ry="3" fill="#7986cb"/>` +
          `<circle cx="50" cy="-6" r="7" fill="#5c6bc0" ${st(2)}/><circle cx="44" cy="2" r="5" fill="#3949ab" ${st(1.5)}/>` +
          `<path d="M30 -28 q12 -10 22 -2 q-12 8 -22 2 z" fill="#66bb6a" ${st(1.5)}/>`,
      ),
  },
];

// ---------------- Мисливець ----------------

/** his sleeves along his arms (both sides), over the jacket */
const hunterSleeves = (fill: string, extra = '') => {
  const one = `${limb('M62 -256 Q100 -206 92 -150', fill, 26)}${extra}`;
  return `<g transform="scale(-1 1)">${one}</g>${one}`;
};
const HUNTER_TOP = 'M-66 -266 Q-86 -190 -76 -112 L76 -112 Q86 -190 66 -266 Q0 -286 -66 -266 Z';
/** trousers down to y (over the boots' tops) */
const hunterTrousers = (y = -40) => `M-48 -134 L-46 ${y} L-4 ${y} L0 -96 L4 ${y} L46 ${y} L48 -134 Z`;

const MYSLYVETS: Item[] = [
  {
    id: 'mysl_borsuk',
    slot: 'head',
    name: 'Шапка-борсук',
    price: 15,
    draw: () =>
      // a fat sleepy badger curled up on his head for a hat: the striped black-and-white face, a paw over its nose
      `<path d="M-70 4 Q-80 -60 -20 -74 Q40 -84 72 -40 Q86 -10 70 6 Q0 18 -70 4 Z" fill="#9e9e9e" ${stroke}/>` +
      `<path d="M-30 -60 q20 -10 40 -4 M10 -70 q20 -2 34 10" stroke="#757575" stroke-width="4" fill="none"/>` +
      `<g transform="translate(-60 -12)"><path d="M0 0 Q-4 -34 22 -40 Q48 -34 44 0 Q22 12 0 0 Z" fill="#fff" ${st(3)}/>` +
      `<path d="M14 -38 Q10 -14 16 4 M30 -38 Q34 -14 28 4" stroke="#212121" stroke-width="8"/>` +
      `<path d="M10 -18 q4 4 8 0 M26 -18 q4 4 8 0" stroke="${INK}" stroke-width="2.5" fill="none"/><ellipse cx="22" cy="-4" rx="6" ry="4" fill="#212121"/></g>` +
      `<path d="M-30 4 q10 -14 22 -6 q-4 10 -22 6 z" fill="#757575" ${st(2)}/>` +
      `<path d="M72 -30 q18 -6 20 10 q-10 0 -20 -10 z" fill="#9e9e9e" ${st(2.5)}/>`,
  },
  {
    id: 'mysl_nichni',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри нічного бачення',
    price: 16,
    draw: () =>
      // a pair of chunky goggle tubes on a head strap, the lenses glowing green
      `<path d="M-70 -4 Q-80 -30 -60 -36 M70 -4 Q80 -30 60 -36" stroke="#37474f" stroke-width="8" fill="none"/>` +
      [-34, 34]
        .map((x) => `<rect x="${x - 26}" y="-24" width="52" height="44" rx="10" fill="#455a64" ${st(3)}/><circle cx="${x}" cy="-2" r="17" fill="#76ff03" ${st(3)}/><circle cx="${x}" cy="-2" r="10" fill="#b2ff59"/><circle cx="${x - 6}" cy="-8" r="4" fill="#fff"/>`)
        .join('') +
      `<rect x="-10" y="-14" width="20" height="16" fill="#37474f" ${st(2)}/><rect x="-6" y="-46" width="12" height="22" fill="#263238" ${st(2)}/><circle cx="0" cy="-48" r="4" fill="#e53935"/>`,
  },
  {
    id: 'mysl_bilky',
    slot: 'mouth',
    beard: true,
    name: 'Вуса-білячі хвости',
    price: 12,
    draw: () =>
      // a moustache of two fluffy ginger squirrel tails curling up at the ends
      [-1, 1]
        .map((d) => `<path d="M0 -6 Q${d * 30} -24 ${d * 60} -6 Q${d * 92} 10 ${d * 84} -34 Q${d * 74} -60 ${d * 56} -46 Q${d * 74} -30 ${d * 62} -20 Q${d * 40} -6 ${d * 2} 6 Z" fill="#e07a2e" ${st(3)}/>` + `<path d="M${d * 20} -6 q${d * 20} -8 ${d * 40} 0 M${d * 66} -16 q${d * 10} -12 ${d * 4} -24" stroke="#bf5f1c" stroke-width="3" fill="none"/>`)
        .join(''),
  },
  {
    id: 'mysl_termos',
    slot: 'neck',
    name: 'Термос на ремінці',
    price: 11,
    draw: () =>
      // a red thermos flask hung on a strap across him, its cup for a lid, steam curling up
      `<g transform="scale(1.3)">` +
      `<path d="M-50 -24 Q-10 60 40 120" stroke="#5d4037" stroke-width="9" fill="none"/>` +
      `<rect x="30" y="100" width="40" height="96" rx="14" fill="#e53935" ${stroke}/>` +
      `<rect x="28" y="92" width="44" height="20" rx="6" fill="#bdbdbd" ${st(3)}/>` +
      `<path d="M30 140 h40" stroke="#fff" stroke-width="6"/>` +
      `<path d="M42 84 q-6 -10 2 -18 q8 -8 0 -18 M58 84 q-6 -10 2 -18" stroke="#eceff1" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `</g>`,
  },
  {
    id: 'mysl_aptechka',
    slot: 'torso',
    name: 'Жилет-аптечка',
    price: 15,
    draw: () =>
      // a white rescuer's vest over a green shirt: a red cross, pockets of plasters, a bandage roll, a bright stripe
      hunterSleeves('#7cb342') +
      `<path d="${HUNTER_TOP}" fill="#fafafa" ${stroke}/>` +
      `<path d="M-74 -150 H74" stroke="#ff9800" stroke-width="10"/>` +
      `<path d="M-6 -250 h12 v16 h16 v12 h-16 v16 h-12 v-16 h-16 v-12 h16 z" fill="#e53935" ${st(2)}/>` +
      `<rect x="-60" y="-210" width="36" height="34" rx="4" fill="#ffcdd2" ${st(2.5)}/><rect x="-54" y="-200" width="24" height="10" rx="4" fill="#ffe0b2" ${st(1.5)}/>` +
      `<rect x="26" y="-210" width="36" height="34" rx="4" fill="#ffcdd2" ${st(2.5)}/><circle cx="44" cy="-193" r="10" fill="#fff" ${st(2)}/><circle cx="44" cy="-193" r="4" fill="#e0e0e0"/>` +
      `<path d="M0 -270 V-114" stroke="${INK}" stroke-width="3"/>`,
  },
  {
    id: 'mysl_namet',
    slot: 'torso',
    name: 'Плащ-намет',
    price: 17,
    draw: () =>
      // a little orange tent for a coat: a pointed top at his collar, a zipped door down the front, guy ropes and pegs
      hunterSleeves('#ff9800', `<path d="M92 -156 l20 30" stroke="#795548" stroke-width="3"/><path d="M110 -128 l4 12" stroke="#5d4037" stroke-width="5"/>`) +
      `<path d="M0 -290 L-86 -110 L86 -110 Z" fill="#ff9800" ${stroke}/>` +
      `<path d="M0 -270 L-34 -112 L34 -112 Z" fill="#ef6c00" ${st(3)}/>` +
      `<path d="M0 -268 V-112" stroke="#ffe0b2" stroke-width="4" stroke-dasharray="4 4"/>` +
      `<path d="M-86 -110 l-20 6 M86 -110 l20 6" stroke="#795548" stroke-width="3"/><path d="M-106 -104 v12 M106 -104 v12" stroke="#5d4037" stroke-width="5"/>` +
      `<path d="M0 -290 l18 -18" stroke="#e53935" stroke-width="4"/><path d="M18 -308 l14 4 l-10 8 z" fill="#e53935"/>`,
  },
  {
    id: 'mysl_diatel',
    slot: 'torso',
    name: 'Костюм дятла',
    price: 16,
    draw: () =>
      // a woodpecker suit: black-and-white barred wings for sleeves, a white front with a red patch, a little beak at the collar
      hunterSleeves('#212121', `<path d="M74 -232 l14 10 M84 -210 l14 6 M90 -186 l14 4" stroke="#fff" stroke-width="5"/>`) +
      `<path d="${HUNTER_TOP}" fill="#212121" ${stroke}/>` +
      `<path d="M-40 -262 Q-56 -190 -44 -114 L44 -114 Q56 -190 40 -262 Q0 -274 -40 -262 Z" fill="#fafafa" ${st(3)}/>` +
      `<path d="M-26 -150 Q0 -170 26 -150 L30 -116 L-30 -116 Z" fill="#e53935" ${st(2.5)}/>` +
      `<path d="M-60 -220 h10 M-62 -196 h10 M-64 -172 h10 M50 -220 h10 M52 -196 h10 M54 -172 h10" stroke="#fff" stroke-width="5"/>` +
      `<path d="M-10 -266 L0 -240 L10 -266 Z" fill="#9e9e9e" ${st(2)}/>`,
  },
  {
    id: 'mysl_berizky',
    slot: 'legs',
    name: 'Штани-берізки',
    price: 13,
    draw: () =>
      // white trousers marked like birch trunks: black dashes, little green leaves sprouting at the knees
      `<path d="${hunterTrousers(-30)}" fill="#fafafa" ${stroke}/>` +
      `<path d="M-40 -120 h12 M-30 -96 h14 M-42 -76 h10 M-24 -56 h12 M-38 -44 h14 M20 -118 h14 M30 -94 h12 M18 -74 h12 M34 -58 h10 M22 -42 h14" stroke="#212121" stroke-width="5" stroke-linecap="round"/>` +
      [[-44, -86, -1], [44, -82, 1]].map(([x, y, d]) => `<path d="M${x} ${y} q${d * 16} -10 ${d * 22} 4 q${d * -12} 10 ${d * -22} -4 z" fill="#8bc34a" ${st(2)}/>`).join(''),
  },
  {
    id: 'mysl_zaichyk',
    slot: 'legs',
    name: 'Шорти із зайчиком у кишені',
    price: 14,
    draw: () =>
      // khaki shorts with big pockets — a little grey hare peeking out of one, a carrot sticking out of the other
      `<path d="M-48 -134 L-48 -74 L-4 -74 L0 -104 L4 -74 L48 -74 L48 -134 Z" fill="#a1887f" ${stroke}/>` +
      `<rect x="-44" y="-110" width="30" height="28" rx="4" fill="#8d6e63" ${st(2.5)}/><rect x="14" y="-110" width="30" height="28" rx="4" fill="#8d6e63" ${st(2.5)}/>` +
      `<path d="M-36 -110 q-4 -28 2 -30 q4 4 2 30 M-24 -110 q0 -28 6 -28 q2 6 -2 28" fill="#bdbdbd" ${st(2)}/>` +
      `<ellipse cx="-29" cy="-112" rx="12" ry="9" fill="#bdbdbd" ${st(2)}/><circle cx="-33" cy="-114" r="2" fill="${INK}"/><circle cx="-25" cy="-114" r="2" fill="${INK}"/><circle cx="-29" cy="-109" r="2" fill="#f48fb1"/>` +
      `<path d="M24 -110 l6 -24 l6 24 z" fill="#ff9800" ${st(2)}/><path d="M30 -134 l-4 -8 M30 -134 l4 -8" stroke="#43a047" stroke-width="3"/>`,
  },
  {
    id: 'mysl_ocheret',
    slot: 'legs',
    name: 'Штани-очерет',
    price: 13,
    draw: () =>
      // green trousers with tall reeds growing up them, brown velvet bulrush heads, a frog on one knee
      `<path d="${hunterTrousers(-30)}" fill="#4db6ac" ${stroke}/>` +
      `<path d="M-40 -32 Q-42 -80 -34 -120 M-22 -32 Q-26 -70 -16 -110 M24 -32 Q26 -80 18 -118 M40 -32 Q38 -70 44 -104" stroke="#2e7d32" stroke-width="4" fill="none"/>` +
      [[-34, -124], [-16, -114], [18, -122], [44, -108]].map(([x, y]) => `<rect x="${x - 4}" y="${y - 10}" width="8" height="20" rx="4" fill="#6d4c41" ${st(1.5)}/>`).join('') +
      `<g transform="translate(-30 -66)"><ellipse rx="10" ry="7" fill="#8bc34a" ${st(2)}/><circle cx="-5" cy="-6" r="3" fill="#fff" ${st(1)}/><circle cx="5" cy="-6" r="3" fill="#fff" ${st(1)}/></g>`,
  },
  {
    id: 'mysl_snihostupy',
    slot: 'feet',
    name: 'Снігоступи-ракетки',
    price: 13,
    draw: () =>
      // under each boot a long oval snowshoe like a tennis racket: a wooden rim and a criss-cross of laces
      pair(
        `<ellipse cx="34" cy="-4" rx="40" ry="10" fill="#fff8e1" stroke="#8d6e63" stroke-width="5"/>` +
          `<path d="M4 -8 L60 2 M10 2 L60 -10 M20 -12 L30 6 M38 -12 L46 6" stroke="#bcaaa4" stroke-width="2"/>` +
          `<path d="M14 -6 Q14 -26 30 -26 Q50 -26 54 -8 Z" fill="#4e342e" ${st(3)}/>` +
          `<path d="M24 -16 l14 -6 M24 -10 l18 -6" stroke="#ff7043" stroke-width="3"/>`,
      ),
  },
  {
    id: 'mysl_bobry',
    slot: 'feet',
    name: 'Чоботи-бобри',
    price: 15,
    draw: () =>
      // each boot a beaver: a brown furry boot, its face at the toe with two big front teeth, the flat tail at the heel
      pair(
        `<path d="M-8 -6 Q-24 -10 -22 2 Q-10 8 2 0 Z" fill="#5d4037" ${st(2.5)}/><path d="M-20 -4 l4 4 M-14 -6 l4 4" stroke="#3e2723" stroke-width="1.5"/>` +
          `<path d="M2 0 V-66 H42 V-30 Q62 -30 62 -12 Q62 0 46 0 Z" fill="#8d6e63" ${st(3)}/>` +
          `<circle cx="50" cy="-22" r="3" fill="${INK}"/><ellipse cx="60" cy="-14" rx="4" ry="3" fill="#3e2723"/>` +
          `<rect x="50" y="-8" width="8" height="10" rx="1" fill="#fff" ${st(1.5)}/><path d="M54 -8 v10" stroke="${INK}" stroke-width="1"/>` +
          `<circle cx="40" cy="-32" r="5" fill="#8d6e63" ${st(2)}/>`,
      ),
  },
  {
    id: 'mysl_taksy',
    slot: 'feet',
    name: 'Чоботи-такси',
    price: 16,
    draw: () =>
      // each boot a long dachshund: its long brown body under the foot, the head with a floppy ear at the toe, the tail up at the heel
      pair(
        `<path d="M0 -16 q-12 -10 -14 -24" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 -16 q-12 -10 -14 -24" stroke="#a1662f" stroke-width="3" fill="none" stroke-linecap="round"/>` +
          `<rect x="-2" y="-30" width="58" height="22" rx="11" fill="#a1662f" ${st(3)}/>` +
          `<path d="M6 -8 v8 M18 -8 v8 M40 -8 v8 M50 -8 v8" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
          `<ellipse cx="62" cy="-34" rx="14" ry="11" fill="#a1662f" ${st(3)}/><ellipse cx="74" cy="-30" rx="8" ry="5" fill="#a1662f" ${st(2.5)}/><circle cx="80" cy="-31" r="3" fill="${INK}"/>` +
          `<circle cx="64" cy="-38" r="2.2" fill="${INK}"/><path d="M56 -40 q-8 6 -4 20 q8 -4 8 -16 z" fill="#6d4426" ${st(2)}/>` +
          `<rect x="2" y="-70" width="40" height="42" rx="6" fill="#6d4426" ${st(3)}/>`,
      ),
  },
];

export const ITEMS: Item[] = [...SHAPOCHKA, ...MYSLYVETS];

const ids = (list: Item[]) => list.map((i) => i.id).join(' ');
export const SETS: Record<string, string> = {
  chervona_shapochka: 'bant serdechka namysto ' + ids(SHAPOCHKA),
  myslyvets: 'pero okuliary sharf ' + ids(MYSLYVETS),
};
