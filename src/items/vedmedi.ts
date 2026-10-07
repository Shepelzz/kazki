// The own things of the heroes of «Три ведмеді». SETS here ADD to a hero's set.
//
// All three face us (two eyes: they can wear glasses). The accessories are drawn for u = 100 as
// everywhere (head: the origin on top of the head; face: between the eyes, the eyes at ±34; mouth;
// neck: under the chin). The clothes, in each puppet's own numbers (puppets-vedmedi.ts, feet at 0,0):
// - Masha: the bodice from the shoulders at -238 to the waist at -174, puffed sleeves at ±52,-224,
//   the arms down to the hands at ±60,-156; the flared skirt from -180 to ±74 at -70 (a frill below,
//   to -46); the legs at x ±8..28, red shoes from ±8 to ±44 below -22;
// - Nastasia Petrivna: the body an ellipse round 0,-130 (82 × 104: from -234 down to -26), an apron
//   on it; the arms from ±72,-190 to the paws at ±94,-98; the feet ellipses at ±33,-20 (36 × 22);
// - Mishko: the body an ellipse round 0,-80 (56 × 66: from -146 to -14), the arms from ±48,-118 to
//   the paws at ±64,-58; the feet at ±23,-14 (24 × 15).
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

/** a flower of n round petals round x, y */
const bloom = (x: number, y: number, r: number, petal: string, middle: string, n = 5) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(r * 0.75).toFixed(1)}" fill="${petal}" ${st(2)}/>`;
  }).join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="${middle}" ${st(2)}/>`;

// ---------------- Masha ----------------

/** her bodice (a top's body, from the shoulders to just over the hips) */
const MASHA_TOP = 'M-46 -242 Q-56 -206 -50 -150 L50 -150 Q56 -206 46 -242 Q0 -254 -46 -242 Z';
/** a dress over her skirt: the bodice, then flaring to the hem at y */
const mashaDress = (y: number) => `M-46 -242 Q-54 -206 -48 -180 L-80 ${y} Q0 ${y + 14} 80 ${y} L48 -180 Q54 -206 46 -242 Q0 -254 -46 -242 Z`;
/** a skirt from her waist down to y */
const MASHA_SKIRT = (y: number) => `M-50 -180 L-82 ${y + 6} Q0 ${y + 18} 82 ${y + 6} L50 -180 Q0 -186 -50 -180 Z`;
const MASHA_ARM = 'M48 -230 Q74 -200 60 -162';

const MASHA: Item[] = [
  // ---- on the head
  {
    id: 'masha_shyshky',
    slot: 'head',
    name: 'Корона з шишок',
    price: 15,
    draw: () => {
      // a band of moss and fir twigs round the head, five pine cones standing up on it
      const cone = (x: number, h: number) =>
        `<path d="M${x - 13} 0 Q${x - 18} ${-h * 0.6} ${x} ${-h} Q${x + 18} ${-h * 0.6} ${x + 13} 0 Z" fill="#8d5a2b" ${st(3)}/>` +
        [0.25, 0.5, 0.75].map((k) => `<path d="M${x - 11 + k * 4} ${-h * k} q${11 - k * 4} 8 ${22 - k * 8} 0" fill="none" stroke="#5d3b1e" stroke-width="2.5"/>`).join('');
      return (
        `<g transform="translate(0 -4)">` +
        [-60, -30, 30, 60].map((x) => `<path d="M${x} -2 l-10 -22 M${x} -2 l0 -26 M${x} -2 l10 -22" stroke="#2e7d32" stroke-width="4" stroke-linecap="round"/>`).join('') +
        cone(-48, 50) + cone(-24, 62) + cone(0, 74) + cone(24, 62) + cone(48, 50) +
        `<path d="M-70 6 Q0 24 70 6 L66 -10 Q0 6 -66 -10 Z" fill="#6d8f3a" ${st(4)}/>` +
        `<path d="M-50 4 q6 -6 12 0 M-10 10 q6 -6 12 0 M30 6 q6 -6 12 0" stroke="#9ccc65" stroke-width="3" fill="none"/></g>`
      );
    },
  },
  {
    id: 'masha_redyska',
    slot: 'head',
    name: 'Шапка-редиска',
    price: 12,
    draw: () =>
      // a round red radish for a cap (its white tip turned up at the edge), its green leaves on top
      `<path d="M-12 -70 Q-50 -110 -40 -140 Q-14 -120 -6 -76 Z M12 -70 Q50 -110 40 -140 Q14 -120 6 -76 Z M0 -72 Q-6 -120 0 -150 Q8 -120 6 -72 Z" fill="#43a047" ${st(3)}/>` +
      `<path d="M-40 -122 L-20 -96 M40 -122 L20 -96" stroke="#1b5e20" stroke-width="2.5"/>` +
      `<path d="M-66 8 Q-72 -64 0 -76 Q72 -64 66 8 Q0 22 -66 8 Z" fill="#e53962" ${stroke}/>` +
      `<path d="M-66 8 Q0 22 66 8 L64 -6 Q0 8 -64 -6 Z" fill="#fff" ${st(3)}/>` +
      `<path d="M-40 -50 q8 -10 18 -12" stroke="#f48fb1" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<path d="M62 2 q22 2 26 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  },
  // ---- over the eyes
  {
    id: 'masha_kivi',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-ківі',
    price: 14,
    draw: () =>
      // each lens a slice of kiwi: brown skin, green flesh with black seeds, the eye in the pale middle
      [-36, 36]
        .map(
          (x) =>
            `<circle cx="${x}" cy="0" r="30" fill="none" stroke="#8d6e63" stroke-width="7"/>` +
            `<circle cx="${x}" cy="0" r="22" fill="none" stroke="#8bc34a" stroke-width="11"/>` +
            `<circle cx="${x}" cy="0" r="15" fill="#f0f4c3" fill-opacity=".35" stroke="#dce775" stroke-width="2"/>` +
            Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return `<ellipse cx="${(x + Math.cos(a) * 21).toFixed(1)}" cy="${(Math.sin(a) * 21).toFixed(1)}" rx="2" ry="3.4" fill="#212121" transform="rotate(${(a * 180) / Math.PI + 90} ${(x + Math.cos(a) * 21).toFixed(1)} ${(Math.sin(a) * 21).toFixed(1)})"/>`;
            }).join('') +
            `<circle cx="${x}" cy="0" r="33" fill="none" ${st(3)}/>`,
        )
        .join('') + `<path d="M-6 -4 Q0 -12 6 -4" stroke="#8d6e63" stroke-width="6" fill="none"/>`,
  },
  // ---- at the mouth
  {
    id: 'masha_vata',
    slot: 'mouth',
    name: 'Цукрова вата',
    price: 10,
    draw: () =>
      // a stick in her mouth, a big pink cloud of candy floss on it, off to the side
      `<path d="M6 4 L74 -56" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M6 4 L74 -56" stroke="#fff8e1" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M66 -48 Q48 -60 58 -80 Q50 -104 76 -110 Q86 -132 108 -120 Q132 -126 132 -100 Q150 -84 132 -66 Q130 -44 106 -48 Q90 -34 66 -48 Z" fill="#f8bbd0" ${stroke}/>` +
      `<path d="M74 -70 q10 -14 24 -8 M104 -98 q10 -6 18 4 M96 -64 q10 4 16 -4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  },
  // ---- the body
  {
    id: 'masha_sachok',
    slot: 'neck',
    name: 'Сачок для метеликів',
    price: 12,
    draw: () =>
      // a long bamboo pole over her shoulder, a white net on a ring up beside her head
      `<path d="M-40 150 L76 -86" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-40 150 L76 -86" stroke="#d4b26a" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M-14 98 l6 3 M14 40 l6 3 M42 -16 l6 3" stroke="#8d6e3b" stroke-width="3"/>` +
      `<path d="M66 -100 Q100 -40 120 -110" fill="#fff" fill-opacity=".7" ${st(3)}/>` +
      `<path d="M74 -96 L100 -60 M86 -104 L106 -70 M100 -108 L112 -84 M70 -84 L114 -96" stroke="#bdbdbd" stroke-width="2"/>` +
      `<ellipse cx="94" cy="-108" rx="32" ry="12" fill="none" stroke="#8d6e3b" stroke-width="6" transform="rotate(-10 94 -108)"/>`,
  },
  {
    id: 'masha_hitara',
    slot: 'neck',
    name: 'Гітара',
    price: 18,
    draw: () =>
      // a little orange guitar on a red strap across her chest
      `<path d="M-50 -10 Q0 100 70 150" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-50 -10 Q0 100 70 150" stroke="#e53935" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<g transform="translate(24 110) rotate(-40)">` +
      `<rect x="-6" y="-120" width="12" height="80" fill="#6d4c41" ${st(3)}/>` +
      `<rect x="-10" y="-138" width="20" height="22" rx="4" fill="#4e342e" ${st(3)}/>` +
      `<path d="M-14 -134 h-6 M-14 -124 h-6 M14 -134 h6 M14 -124 h6" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M0 -46 C-30 -46 -34 -20 -22 -8 C-44 6 -40 46 0 46 C40 46 44 6 22 -8 C34 -20 30 -46 0 -46 Z" fill="#ff9800" ${stroke}/>` +
      `<circle cx="0" cy="-6" r="10" fill="#4e342e"/><rect x="-14" y="22" width="28" height="7" rx="3" fill="#4e342e"/>` +
      `<path d="M-2 -116 V24 M2 -116 V24" stroke="#eceff1" stroke-width="1.5"/></g>`,
  },
  // ---- clothes, in her own numbers
  {
    id: 'masha_matroska',
    slot: 'torso',
    name: 'Матроска',
    price: 18,
    draw: () =>
      // a white sailor top, the big blue collar with white stripes over the shoulders, a red tie
      sleeves(MASHA_ARM, '#fafafa', 22, `<path d="M70 -172 L50 -170" stroke="#1e3a8a" stroke-width="8" stroke-linecap="round"/>`) +
      `<path d="${MASHA_TOP}" fill="#fafafa" ${stroke}/>` +
      `<path d="M-48 -244 L-56 -196 L-8 -196 L0 -186 L8 -196 L56 -196 L48 -244 Q0 -258 -48 -244 Z" fill="#1e3a8a" ${st(4)}/>` +
      `<path d="M-50 -206 H-12 M12 -206 H50" stroke="#fff" stroke-width="4"/>` +
      `<path d="M-10 -196 L0 -176 L10 -196 Z" fill="#e53935" ${st(3)}/>` +
      `<path d="M-4 -178 L-14 -150 L-2 -156 Z M4 -178 L14 -150 L2 -156 Z" fill="#e53935" ${st(2.5)}/>` +
      `<path d="M-48 -158 H48" stroke="#1e3a8a" stroke-width="8"/>`,
  },
  {
    id: 'masha_shpakivnia',
    slot: 'torso',
    name: 'Кофтинка-шпаківня',
    price: 20,
    draw: () =>
      // a wooden birdhouse of a top: a red roof over the shoulders, a round door on the chest with a
      // starling looking out of it, a little perch below
      sleeves(MASHA_ARM, '#c8955a') +
      `<path d="${MASHA_TOP}" fill="#c8955a" ${stroke}/>` +
      `<path d="M-30 -232 V-152 M0 -238 V-152 M30 -232 V-152" stroke="#a1704a" stroke-width="3"/>` +
      `<path d="M-60 -226 L0 -258 L60 -226 L54 -214 L0 -242 L-54 -214 Z" fill="#d32f2f" ${st(4)}/>` +
      `<circle cx="0" cy="-174" r="20" fill="#3e2723" ${st(4)}/>` +
      // the starling: a black head, white dots, a yellow beak, round eyes
      `<circle cx="0" cy="-172" r="13" fill="#263238"/>` +
      `<circle cx="-5" cy="-176" r="3.5" fill="#fff"/><circle cx="5" cy="-176" r="3.5" fill="#fff"/><circle cx="-5" cy="-176" r="1.8" fill="${INK}"/><circle cx="5" cy="-176" r="1.8" fill="${INK}"/>` +
      `<path d="M-5 -169 L0 -159 L5 -169 Z" fill="#fdd835" ${st(2)}/>` +
      
      `<path d="M-14 -148 H14" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-14 -148 H14" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: 'masha_vynohrad',
    slot: 'torso',
    name: 'Сукенка-виноград',
    price: 20,
    draw: () => {
      // a green dress hung with bunches of purple grapes, a vine leaf on each shoulder, a curly tendril
      const bunch = (x: number, y: number) =>
        [[0, 0], [-8, -10], [8, -10], [-14, -22], [0, -22], [14, -22], [-6, -34], [6, -34]]
          .map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="7" fill="#7b1fa2" ${st(2)}/><circle cx="${x + dx - 2}" cy="${y + dy - 2}" r="2" fill="#ce93d8"/>`)
          .join('') + `<path d="M${x} ${y - 40} v-8" stroke="#6d4c41" stroke-width="3"/>`;
      return (
        sleeves(MASHA_ARM, '#9ccc65') +
        `<path d="${mashaDress(-66)}" fill="#9ccc65" ${stroke}/>` +
        bunch(-34, -86) + bunch(32, -100) + bunch(0, -150) + bunch(-44, -170) + bunch(40, -190) +
        `<path d="M-48 -244 q-20 -6 -26 10 q12 2 14 14 q12 -8 12 -24 z M48 -244 q20 -6 26 10 q-12 2 -14 14 q-12 -8 -12 -24 z" fill="#388e3c" ${st(2.5)}/>` +
        `<path d="M16 -130 q14 -4 10 -16 q-6 -8 -12 0" stroke="#558b2f" stroke-width="3" fill="none"/>`
      );
    },
  },
  {
    id: 'masha_notky',
    slot: 'legs',
    name: 'Штанці в нотки',
    price: 14,
    draw: () => {
      // pale blue trousers, the five lines of a stave across each leg, black notes dancing on them
      const note = (x: number, y: number) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="#212121" transform="rotate(-20 ${x} ${y})"/><path d="M${x + 5} ${y - 1} v-20 q8 4 10 12" stroke="#212121" stroke-width="2.5" fill="none"/>`;
      let staves = '';
      for (let i = 0; i < 5; i++) staves += `<path d="M-70 ${-150 + i * 8} H-6 M6 ${-150 + i * 8} H70" stroke="#5c6bc0" stroke-width="1.5"/>`;
      return (
        `<path d="M-52 -180 L-82 -32 L-6 -32 L0 -120 L6 -32 L82 -32 L52 -180 Q0 -188 -52 -180 Z" fill="#bbdefb" ${stroke}/>` +
        staves +
        note(-50, -134) + note(-26, -146) + note(30, -138) + note(54, -122) +
        note(-58, -70) + note(-30, -84) + note(36, -66) + note(62, -80) +
        `<path d="M-82 -40 H-6 M6 -40 H82" stroke="#1e88e5" stroke-width="6"/>`
      );
    },
  },
  {
    id: 'masha_rusalka',
    slot: 'legs',
    name: 'Спідниця-русалка',
    price: 18,
    draw: () => {
      // a teal skirt of fish scales, narrow at the knees, a mermaid's tail fin flaring at her ankles
      let scales = '';
      for (let r = 0; r < 6; r++) {
        const y = -166 + r * 18;
        const w = 48 - r * 4;
        for (let x = -w; x <= w; x += 16) scales += `<path d="M${x - 8} ${y} q8 12 16 0" fill="none" stroke="#00897b" stroke-width="2.5"/>`;
      }
      return (
        `<path d="M-54 -30 Q-82 -10 -80 -2 Q-40 -10 -6 -26 Z M54 -30 Q82 -10 80 -2 Q40 -10 6 -26 Z" fill="#4dd0e1" ${st(3.5)}/>` +
        `<path d="M-50 -180 Q-60 -110 -30 -60 Q-44 -40 -54 -30 L-6 -26 L6 -26 L54 -30 Q44 -40 30 -60 Q60 -110 50 -180 Q0 -188 -50 -180 Z" fill="#26a69a" ${stroke}/>` +
        scales +
        `<path d="M-30 -60 Q0 -52 30 -60" stroke="#ffd54f" stroke-width="5" fill="none"/>` +
        `<circle cx="-14" cy="-176" r="4" fill="#fff59d"/><circle cx="0" cy="-178" r="4" fill="#fff59d"/><circle cx="14" cy="-176" r="4" fill="#fff59d"/>`
      );
    },
  },
  {
    id: 'masha_pivonia',
    slot: 'legs',
    name: 'Спідниця-півонія',
    price: 16,
    draw: () => {
      // three rows of round pink petals, the darkest at the top, a belt of green leaves
      const row = (y: number, w: number, fill: string) => {
        let s = '';
        for (let x = -w; x <= w + 0.1; x += (2 * w) / 6) s += `<circle cx="${x.toFixed(1)}" cy="${y}" r="17" fill="${fill}" ${st(2.5)}/>`;
        return s;
      };
      return (
        `<path d="${MASHA_SKIRT(-60)}" fill="#f8bbd0" ${stroke}/>` +
        row(-62, 70, '#fce4ec') + row(-98, 62, '#f8bbd0') + row(-134, 54, '#f48fb1') + row(-164, 46, '#ec407a') +
        `<path d="M-52 -180 Q0 -190 52 -180" stroke="#43a047" stroke-width="10" fill="none" stroke-linecap="round"/>` +
        `<path d="M-30 -184 l-14 -10 l18 0 z M10 -186 l14 -10 l4 12 z" fill="#66bb6a" ${st(2)}/>`
      );
    },
  },
  {
    id: 'masha_snihuri',
    slot: 'feet',
    name: 'Черевички-снігурі',
    price: 14,
    draw: () =>
      // each shoe a plump bullfinch: a grey-blue back, a red breast, a black cap and a little beak at the toe
      pair(
        `<path d="M8 -30 Q-2 -40 6 -46 Q14 -40 14 -32 Z" fill="#37474f" ${st(2.5)}/>` +
          `<ellipse cx="26" cy="-15" rx="22" ry="16" fill="#78909c" ${st(3)}/>` +
          `<path d="M14 -6 Q26 2 44 -8 Q48 -20 38 -24 Q24 -12 14 -6 Z" fill="#ef5350" ${st(2.5)}/>` +
          `<circle cx="42" cy="-24" r="10" fill="#263238" ${st(2.5)}/>` +
          `<circle cx="44" cy="-26" r="2.4" fill="#fff"/>` +
          `<path d="M50 -24 l8 2 l-8 3 z" fill="#37474f" ${st(1.5)}/>`,
      ),
  },
  {
    id: 'masha_valizky',
    slot: 'feet',
    name: 'Черевички-валізки',
    price: 15,
    draw: () =>
      // each shoe a little brown suitcase: a handle on top, two straps, round travel stickers
      pair(
        `<path d="M18 -34 q0 -10 9 -10 q9 0 9 10" fill="none" stroke="${INK}" stroke-width="5"/>` +
          `<rect x="6" y="-34" width="42" height="34" rx="6" fill="#8d6e63" ${st(3)}/>` +
          `<path d="M16 -34 V0 M38 -34 V0" stroke="#5d4037" stroke-width="5"/>` +
          `<circle cx="27" cy="-22" r="6" fill="#4fc3f7" ${st(1.5)}/><circle cx="27" cy="-9" r="5" fill="#ffd54f" ${st(1.5)}/>` +
          `<rect x="40" y="-28" width="7" height="9" fill="#ef5350"/>`,
      ),
  },
  {
    id: 'masha_chereshni',
    slot: 'feet',
    name: 'Черевички-черешні',
    price: 13,
    draw: () =>
      // each shoe a big shiny red cherry, its stalk and a leaf going up to the ankle
      pair(
        `<path d="M24 -30 Q20 -50 12 -60" stroke="#558b2f" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          `<path d="M14 -56 q16 -12 26 -2 q-14 10 -26 2 z" fill="#66bb6a" ${st(2)}/>` +
          `<path d="M24 -28 Q6 -34 6 -16 Q6 0 26 0 Q46 0 46 -16 Q46 -34 24 -28 Z" fill="#c62828" ${st(3)}/>` +
          `<ellipse cx="34" cy="-20" rx="5" ry="3" fill="#fff" opacity=".7" transform="rotate(-30 34 -20)"/>`,
      ),
  },
];

// ---------------- Nastasia Petrivna ----------------

/** a top over her body (the upper part of the body ellipse) */
const MAMA_TOP = 'M-80 -96 A84 106 0 1 1 80 -96 Q0 -80 -80 -96 Z';
const MAMA_ARM = 'M72 -190 Q104 -164 104 -128';
/** a skirt round her lower body */
const MAMA_SKIRT = 'M-84 -122 H84 Q96 -70 80 -34 Q0 -20 -80 -34 Q-96 -70 -84 -122 Z';

const MAMA: Item[] = [
  // ---- on the head
  {
    id: 'vedmedytsia_kokoshnyk',
    slot: 'head',
    name: 'Кокошник',
    price: 20,
    draw: () =>
      // a tall rounded crest of red velvet with a gold edge, pearls and coloured stones, ribbons down the sides
      `<path d="M-70 14 Q-80 -60 0 -104 Q80 -60 70 14 Q0 2 -70 14 Z" fill="#c62828" ${stroke}/>` +
      `<path d="M-60 6 Q-68 -52 0 -90 Q68 -52 60 6" fill="none" stroke="#ffd54f" stroke-width="6"/>` +
      Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI * (1.05 + (i / 10) * 0.9);
        return `<circle cx="${(Math.cos(a) * 72).toFixed(1)}" cy="${(-6 + Math.sin(a) * 92).toFixed(1)}" r="5" fill="#fff" ${st(1.5)}/>`;
      }).join('') +
      `<path d="M0 -70 l14 22 l-14 22 l-14 -22 z" fill="#1e88e5" ${st(3)}/>` +
      `<circle cx="-32" cy="-34" r="8" fill="#43a047" ${st(2.5)}/><circle cx="32" cy="-34" r="8" fill="#43a047" ${st(2.5)}/>` +
      `<path d="M-66 10 Q-80 60 -70 110 M66 10 Q80 60 70 110" stroke="#ffd54f" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  },
  {
    id: 'vedmedytsia_snihovyk',
    slot: 'head',
    name: 'Сніговик на голові',
    price: 16,
    draw: () =>
      // a little snowman standing on her head: two snowballs, coal eyes, a carrot nose, a bucket for a
      // hat, twig arms and a red scarf
      `<path d="M-30 -66 L-62 -88 M-56 -84 l-6 -12 M30 -66 L62 -88 M56 -84 l6 -12" stroke="#6d4c41" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="0" cy="-36" r="38" fill="#fafafa" ${stroke}/>` +
      `<circle cx="0" cy="-34" r="4" fill="${INK}"/><circle cx="0" cy="-18" r="4" fill="${INK}"/>` +
      `<circle cx="0" cy="-98" r="28" fill="#fafafa" ${stroke}/>` +
      `<path d="M-26 -78 Q0 -66 26 -78 L28 -68 Q0 -56 -28 -68 Z" fill="#e53935" ${st(3)}/><path d="M14 -70 l6 22 l10 -4 z" fill="#e53935" ${st(2.5)}/>` +
      `<circle cx="-10" cy="-104" r="3.5" fill="${INK}"/><circle cx="10" cy="-104" r="3.5" fill="${INK}"/>` +
      `<path d="M-4 -96 L0 -84 L4 -96 Z" fill="#ff9800" ${st(2)}/>` +
      `<path d="M-6 -88 q6 4 12 0" stroke="${INK}" stroke-width="2.5" fill="none"/>` +
      `<path d="M-22 -120 L-18 -148 L18 -148 L22 -120 Z" fill="#78909c" ${st(3)}/>`,
  },
  // ---- over the eyes
  {
    id: 'vedmedytsia_mysky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-мисочки з юшкою',
    price: 15,
    draw: () =>
      // each lens the rim of a little bowl of soup (a red one, a blue one), the bowl hanging under the
      // eye, steam curling up
      [[-36, '#c62828'], [36, '#1e88e5']]
        .map(
          ([x, c]) =>
            `<path d="M${Number(x) - 24} 24 Q${Number(x) - 22} 52 ${x} 54 Q${Number(x) + 22} 52 ${Number(x) + 24} 24 Q${x} 30 ${Number(x) - 24} 24 Z" fill="${c}" ${st(3)}/>` +
            `<circle cx="${Number(x) - 10}" cy="38" r="3" fill="#fff"/><circle cx="${x}" cy="44" r="3" fill="#fff"/><circle cx="${Number(x) + 10}" cy="38" r="3" fill="#fff"/>` +
            `<ellipse cx="${x}" cy="0" rx="29" ry="24" fill="none" stroke="${c}" stroke-width="7"/>` +
            `<ellipse cx="${x}" cy="0" rx="33" ry="28" fill="none" ${st(2.5)}/>` +
            `<path d="M${Number(x) + 14} -30 q-6 -10 0 -18 q6 -8 0 -16" stroke="#cfd8dc" stroke-width="4" fill="none" stroke-linecap="round"/>`,
        )
        .join('') + `<path d="M-6 -4 Q0 -12 6 -4" stroke="#6d4c41" stroke-width="6" fill="none"/>`,
  },
  // ---- at the mouth
  {
    id: 'vedmedytsia_kachalka',
    slot: 'mouth',
    name: 'Качалка в зубах',
    price: 10,
    draw: () =>
      // a wooden rolling pin held across in her teeth, a bit of dough stuck to it
      `<rect x="-112" y="-6" width="34" height="14" rx="7" fill="#c08a52" ${st(3)}/><rect x="78" y="-6" width="34" height="14" rx="7" fill="#c08a52" ${st(3)}/>` +
      `<rect x="-80" y="-14" width="160" height="30" rx="14" fill="#e0b680" ${st(4)}/>` +
      `<path d="M-60 -6 h40 M20 -6 h30" stroke="#f3d3a4" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M30 14 q8 12 20 4 q4 -6 -4 -6 z" fill="#fff8e1" ${st(2)}/>`,
  },
  // ---- the body
  {
    id: 'vedmedytsia_voloshky',
    slot: 'neck',
    name: 'Букет волошок',
    price: 12,
    draw: () => {
      // a bunch of blue cornflowers held at her chest, tied with a yellow ribbon
      const fl = (x: number, y: number) =>
        Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return `<path d="M${x} ${y} L${(x + Math.cos(a - 0.25) * 14).toFixed(1)} ${(y + Math.sin(a - 0.25) * 14).toFixed(1)} L${(x + Math.cos(a) * 18).toFixed(1)} ${(y + Math.sin(a) * 18).toFixed(1)} L${(x + Math.cos(a + 0.25) * 14).toFixed(1)} ${(y + Math.sin(a + 0.25) * 14).toFixed(1)} Z" fill="#3f51b5"/>`;
        }).join('') + `<circle cx="${x}" cy="${y}" r="6" fill="#1a237e"/>`;
      return (
        `<path d="M-30 60 L0 150 M0 50 L0 150 M30 60 L0 150 M-14 40 L0 150 M16 40 L0 150" stroke="#558b2f" stroke-width="5"/>` +
        fl(-34, 54) + fl(34, 54) + fl(0, 40) + fl(-18, 24) + fl(18, 22) +
        `<path d="M-14 118 L14 118 L18 132 L-18 132 Z" fill="#fdd835" ${st(2.5)}/><path d="M-4 130 l-14 26 M4 130 l14 26" stroke="#fdd835" stroke-width="6" stroke-linecap="round"/>`
      );
    },
  },
  {
    id: 'vedmedytsia_avoska',
    slot: 'neck',
    name: 'Авоська з покупками',
    price: 14,
    draw: () =>
      // a string bag on her shoulder hanging at her side: a long loaf, carrots and a bottle of milk in it
      `<path d="M-30 -10 Q60 30 92 120" stroke="${INK}" stroke-width="8" fill="none"/><path d="M-30 -10 Q60 30 92 120" stroke="#ff7043" stroke-width="4" fill="none"/>` +
      `<rect x="98" y="54" width="22" height="64" rx="8" fill="#fafafa" ${st(3)}/><rect x="102" y="42" width="14" height="14" fill="#1e88e5" ${st(2)}/>` +
      `<rect x="56" y="40" width="26" height="90" rx="13" fill="#e2a24a" ${st(3)}/><path d="M60 62 l18 -6 M60 84 l18 -6 M60 106 l18 -6" stroke="#b5762a" stroke-width="3"/>` +
      `<path d="M84 100 L96 160 L104 100 Z" fill="#ff9800" ${st(2.5)}/><path d="M90 100 l-4 -14 M98 100 l4 -14" stroke="#43a047" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M52 110 Q50 170 92 176 Q130 170 126 110 Z" fill="none" stroke="#ff7043" stroke-width="3"/>` +
      `<path d="M58 126 L122 168 M72 112 L124 146 M54 150 L100 112 M70 172 L124 124" stroke="#ff7043" stroke-width="2.5"/>`,
  },
  // ---- clothes, in her own numbers
  {
    id: 'vedmedytsia_vitrazh',
    slot: 'torso',
    name: 'Сукня-вітраж',
    price: 20,
    draw: () => {
      // a top of coloured glass panes in dark lead lines, like a church window with the sun shining through
      const panes: [string, string][] = [
        ['M-80 -96 L-84 -150 L-40 -130 L-30 -90 Z', '#ef5350'],
        ['M-84 -150 L-64 -208 L-20 -180 L-40 -130 Z', '#ffca28'],
        ['M-64 -208 L0 -236 L-20 -180 Z', '#42a5f5'],
        ['M0 -236 L64 -208 L20 -180 Z', '#66bb6a'],
        ['M64 -208 L84 -150 L40 -130 L20 -180 Z', '#ab47bc'],
        ['M84 -150 L80 -96 L30 -90 L40 -130 Z', '#ffca28'],
        ['M-40 -130 L-20 -180 L20 -180 L40 -130 L30 -90 L-30 -90 Z', '#4dd0e1'],
      ];
      return (
        sleeves(MAMA_ARM, '#7e57c2', 38) +
        `<path d="${MAMA_TOP}" fill="#37474f" ${stroke}/>` +
        panes.map(([d, c]) => `<path d="${d}" fill="${c}" stroke="#263238" stroke-width="5" stroke-linejoin="round"/>`).join('') +
        `<circle cx="0" cy="-134" r="18" fill="#fff59d" stroke="#263238" stroke-width="5"/>` +
        `<path d="${MAMA_TOP}" fill="none" ${stroke}/>`
      );
    },
  },
  {
    id: 'vedmedytsia_horod',
    slot: 'torso',
    name: 'Сукня-город',
    price: 18,
    draw: () => {
      // brown garden beds in rows on a green top: carrot tops, round cabbages, red beets peeking out
      const carrot = (x: number, y: number) => `<path d="M${x - 5} ${y} L${x} ${y + 12} L${x + 5} ${y} Z" fill="#ff9800"/><path d="M${x} ${y} l-6 -10 M${x} ${y} l0 -12 M${x} ${y} l6 -10" stroke="#43a047" stroke-width="3" stroke-linecap="round"/>`;
      const cabbage = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="10" fill="#aed581" ${st(2)}/><path d="M${x - 6} ${y} q6 -8 12 0" stroke="#7cb342" stroke-width="2" fill="none"/>`;
      const beet = (x: number, y: number) => `<circle cx="${x}" cy="${y + 3}" r="7" fill="#ad1457" ${st(2)}/><path d="M${x} ${y - 3} q-6 -10 -10 -8 M${x} ${y - 3} q6 -10 10 -8" stroke="#2e7d32" stroke-width="3" fill="none"/>`;
      return (
        sleeves(MAMA_ARM, '#8bc34a', 38) +
        `<path d="${MAMA_TOP}" fill="#8bc34a" ${stroke}/>` +
        [-208, -172, -136, -104].map((y, i) => `<path d="M${-60 - i * 6} ${y} H${60 + i * 6}" stroke="#8d6e63" stroke-width="12" stroke-linecap="round"/>`).join('') +
        [-40, -14, 12, 38].map((x) => carrot(x, -214)).join('') +
        [-56, -28, 0, 28, 56].map((x) => cabbage(x, -176)).join('') +
        [-60, -30, 0, 30, 60].map((x) => beet(x, -140)).join('') +
        [-50, -20, 10, 40].map((x) => carrot(x + 6, -110)).join('')
      );
    },
  },
  {
    id: 'vedmedytsia_motanky',
    slot: 'torso',
    name: 'Кофта з ляльками-мотанками',
    price: 22,
    draw: () => {
      // a cream blouse, a band of little folk dolls across the chest (a cross of red thread for a face,
      // a white kerchief, a red skirt), red embroidery on the sleeves
      const doll = (x: number, y: number, skirt: string) =>
        `<path d="M${x - 12} ${y + 30} L${x - 7} ${y + 6} L${x + 7} ${y + 6} L${x + 12} ${y + 30} Z" fill="${skirt}" ${st(2)}/>` +
        `<path d="M${x - 14} ${y + 10} H${x + 14}" stroke="#fff8e1" stroke-width="5" stroke-linecap="round"/>` +
        `<circle cx="${x}" cy="${y}" r="8" fill="#fff8e1" ${st(2)}/>` +
        `<path d="M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}" stroke="#c62828" stroke-width="2"/>` +
        `<path d="M${x - 9} ${y - 2} Q${x} ${y - 14} ${x + 9} ${y - 2}" fill="#fafafa" ${st(2)}/>`;
      return (
        sleeves(MAMA_ARM, '#fff8e1', 38, `<path d="M84 -176 L100 -150 M96 -168 L108 -140" stroke="#c62828" stroke-width="5" stroke-linecap="round"/>`) +
        `<path d="${MAMA_TOP}" fill="#fff8e1" ${stroke}/>` +
        `<path d="M-76 -178 H76 M-80 -132 H80" stroke="#c62828" stroke-width="4"/>` +
        doll(-52, -168, '#c62828') + doll(-18, -168, '#1e88e5') + doll(18, -168, '#43a047') + doll(52, -168, '#c62828') +
        `<path d="M-30 -218 L0 -200 L30 -218" fill="none" stroke="#c62828" stroke-width="4"/>`
      );
    },
  },
  {
    id: 'vedmedytsia_maky',
    slot: 'legs',
    name: 'Спідниця з маками',
    price: 15,
    draw: () =>
      // a green skirt with big red poppies, their black hearts and a few buds
      `<path d="${MAMA_SKIRT}" fill="#2e7d32" ${stroke}/>` +
      [[-50, -94], [10, -100], [60, -70], [-20, -54], [40, -46]].map(([x, y]) => bloom(x, y, 11, '#e53935', '#212121', 4)).join('') +
      `<path d="M-64 -50 q4 -12 10 -2 M70 -108 q-4 -12 -10 -2" stroke="#81c784" stroke-width="4" fill="none"/>`,
  },
  {
    id: 'vedmedytsia_pivnyky',
    slot: 'legs',
    name: 'Спідниця з півниками',
    price: 15,
    draw: () => {
      // a white skirt with a band of embroidered red-and-black roosters, a red hem
      const rooster = (x: number, y: number) =>
        `<g transform="translate(${x} ${y})"><path d="M-10 0 Q-14 -14 -2 -16 L4 -24 L8 -16 Q14 -10 12 0 Z" fill="#c62828"/>` +
        `<path d="M10 -6 Q20 -20 16 -2 Z" fill="#212121"/><path d="M-4 0 v6 M4 0 v6" stroke="#212121" stroke-width="2"/>` +
        `<path d="M-2 -24 l2 -5 l2 4 l2 -4 l1 5" fill="#c62828"/><path d="M-6 -18 l-5 2 l5 1 z" fill="#ffb300"/></g>`;
      return (
        `<path d="${MAMA_SKIRT}" fill="#fafafa" ${stroke}/>` +
        [-60, -30, 0, 30, 60].map((x) => rooster(x, -76)).join('') +
        `<path d="M-84 -104 H84 M-82 -60 H82" stroke="#212121" stroke-width="3" stroke-dasharray="6 4"/>` +
        `<path d="M-80 -34 Q0 -20 80 -34 L82 -44 Q0 -30 -82 -44 Z" fill="#c62828"/>`
      );
    },
  },
  {
    id: 'vedmedytsia_ohirky',
    slot: 'legs',
    name: 'Шаровари-огірочки',
    price: 14,
    draw: () =>
      // wide green trousers striped and pimply like cucumbers, gathered at the ankles, a yellow flower on the belt
      `<path d="M-84 -122 H84 Q100 -70 78 -40 L8 -40 L0 -64 L-8 -40 L-78 -40 Q-100 -70 -84 -122 Z" fill="#558b2f" ${stroke}/>` +
      `<path d="M-60 -116 Q-70 -80 -56 -46 M-30 -118 Q-36 -84 -30 -48 M30 -118 Q36 -84 30 -48 M60 -116 Q70 -80 56 -46" stroke="#9ccc65" stroke-width="5" fill="none"/>` +
      [[-70, -96], [-44, -70], [-20, -100], [20, -96], [46, -72], [70, -100], [-60, -56], [62, -54]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#33691e"/>`).join('') +
      `<path d="M-78 -40 H-8 M8 -40 H78" stroke="#33691e" stroke-width="7"/>` +
      bloom(0, -116, 6, '#fdd835', '#f57f17'),
  },
  {
    id: 'vedmedytsia_rukavychky',
    slot: 'feet',
    name: 'Капці-рукавички',
    price: 12,
    draw: () =>
      // each slipper a knitted red mitten, a white pattern, a thumb sticking up, a white cuff
      pair(
        `<path d="M50 -24 Q66 -40 60 -54 Q50 -50 46 -34 Z" fill="#e53935" ${st(3)}/>` +
          `<path d="M-2 -12 Q-4 -36 30 -40 Q70 -40 70 -14 Q70 0 34 0 Q-2 0 -2 -12 Z" fill="#e53935" ${st(3)}/>` +
          `<path d="M14 -24 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6" stroke="#fff" stroke-width="3" fill="none"/>` +
          `<circle cx="22" cy="-10" r="2.5" fill="#fff"/><circle cx="38" cy="-10" r="2.5" fill="#fff"/><circle cx="54" cy="-12" r="2.5" fill="#fff"/>` +
          `<rect x="-6" y="-30" width="18" height="30" rx="5" fill="#fafafa" ${st(2.5)}/>`,
      ),
  },
  {
    id: 'vedmedytsia_samovary',
    slot: 'feet',
    name: 'Черевики-самовари',
    price: 18,
    draw: () =>
      // each shoe a shiny brass samovar: a round belly, a tap at the toe, a crown on top with a teapot puff
      pair(
        `<path d="M24 -46 L22 -54 L44 -54 L42 -46 Z" fill="#ffb300" ${st(2.5)}/>` +
          `<path d="M34 -60 q-4 -8 0 -14" stroke="#cfd8dc" stroke-width="3" fill="none" stroke-linecap="round"/>` +
          `<ellipse cx="33" cy="-24" rx="32" ry="24" fill="#ffc107" ${st(3)}/>` +
          `<path d="M8 -28 Q33 -20 58 -28" stroke="#ff8f00" stroke-width="3" fill="none"/>` +
          `<ellipse cx="22" cy="-34" rx="8" ry="4" fill="#fff8e1" opacity=".7"/>` +
          `<path d="M64 -20 h10 v8" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M64 -20 h10 v8" stroke="#ffb300" stroke-width="3" fill="none" stroke-linecap="round"/>` +
          `<path d="M10 -2 h46" stroke="#8d6e63" stroke-width="6" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'vedmedytsia_eklery',
    slot: 'feet',
    name: 'Черевики-еклери',
    price: 14,
    draw: () =>
      // each shoe a long eclair: golden pastry, chocolate icing on top, cream squeezing out of the end
      pair(
        `<rect x="-4" y="-30" width="76" height="30" rx="15" fill="#e2a24a" ${st(3)}/>` +
          `<path d="M2 -24 Q4 -36 20 -34 H56 Q70 -36 70 -22 Q56 -16 40 -20 Q20 -14 2 -24 Z" fill="#5d4037" ${st(2.5)}/>` +
          `<path d="M16 -30 h6 M34 -30 h8 M52 -30 h6" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>` +
          `<path d="M70 -14 q8 -2 10 6 q-6 6 -12 2" fill="#fff8e1" ${st(2)}/>`,
      ),
  },
];

// ---------------- Mishko ----------------

const MISHKO_TOP = 'M-52 -50 A58 68 0 1 1 52 -50 Q0 -38 -52 -50 Z';
const MISHKO_ARM = 'M48 -118 Q72 -98 70 -80';
const MISHKO_PANTS = 'M-56 -66 H56 Q62 -40 50 -22 L6 -22 L0 -36 L-6 -22 L-50 -22 Q-62 -40 -56 -66 Z';
const MISHKO_SHORTS = 'M-56 -66 H56 Q60 -50 54 -38 L6 -38 L0 -48 L-6 -38 L-54 -38 Q-60 -50 -56 -66 Z';

const MISHKO: Item[] = [
  // ---- on the head
  {
    id: 'mishko_kokos',
    slot: 'head',
    name: 'Шапка-кокос',
    price: 14,
    draw: () =>
      // half a hairy brown coconut for a helmet, its white rim showing, a little palm sprouting on top
      `<path d="M0 -60 Q-4 -86 -2 -98 M0 -66 Q-30 -96 -50 -88 M0 -66 Q30 -96 50 -88 M0 -64 Q-20 -110 -34 -112 M0 -64 Q20 -110 34 -112" stroke="#43a047" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      `<path d="M-64 10 Q-68 -64 0 -66 Q68 -64 64 10 Z" fill="#795548" ${stroke}/>` +
      `<path d="M-64 10 Q0 -2 64 10 L62 18 Q0 6 -62 18 Z" fill="#fafafa" ${st(3)}/>` +
      `<path d="M-40 -30 l-8 -8 M-20 -46 l-6 -10 M10 -50 l4 -10 M36 -36 l8 -8 M-50 -6 l-8 -4 M50 -8 l8 -4" stroke="#4e342e" stroke-width="3" stroke-linecap="round"/>` +
      `<circle cx="-12" cy="-26" r="5" fill="#4e342e"/><circle cx="12" cy="-26" r="5" fill="#4e342e"/><circle cx="0" cy="-10" r="5" fill="#4e342e"/>`,
  },
  {
    id: 'mishko_leleka',
    slot: 'head',
    name: 'Шапка-лелека',
    price: 18,
    draw: () =>
      // a twig nest on his head with a white stork standing in it on one long red leg
      `<path d="M2 -40 L2 -86" stroke="#e53935" stroke-width="5"/><path d="M2 -60 L18 -72 L6 -76" stroke="#e53935" stroke-width="5" fill="none"/>` +
      `<ellipse cx="0" cy="-104" rx="34" ry="20" fill="#fafafa" ${stroke}/>` +
      `<path d="M14 -110 Q40 -110 46 -92 Q30 -96 14 -96 Z" fill="#212121" ${st(3)}/>` +
      `<path d="M-24 -110 Q-30 -140 -36 -150" stroke="${INK}" stroke-width="16" stroke-linecap="round" fill="none"/><path d="M-24 -110 Q-30 -140 -36 -150" stroke="#fafafa" stroke-width="9" stroke-linecap="round" fill="none"/>` +
      `<circle cx="-38" cy="-156" r="13" fill="#fafafa" ${st(3)}/><circle cx="-42" cy="-158" r="2.6" fill="${INK}"/>` +
      `<path d="M-50 -160 L-92 -150 L-50 -152 Z" fill="#e53935" ${st(2)}/>` +
      `<path d="M-60 6 Q-64 -34 0 -42 Q64 -34 60 6 Q0 18 -60 6 Z" fill="#a1887f" ${stroke}/>` +
      `<path d="M-56 -14 L40 -30 M-50 -2 L54 -18 M-40 -30 L56 -6 M-58 -24 L20 -38" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>`,
  },
  // ---- over the eyes
  {
    id: 'mishko_yenot',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Маска єнота',
    price: 12,
    draw: () =>
      // a raccoon's mask: a grey band, black patches round the eye holes, white brows, a striped tail at the side
      `<path d="M-80 -14 Q-40 -34 0 -16 Q40 -34 80 -14 Q86 14 60 24 Q30 30 0 12 Q-30 30 -60 24 Q-86 14 -80 -14 Z" fill="#9e9e9e" ${stroke}/>` +
      `<ellipse cx="-36" cy="2" rx="26" ry="18" fill="#263238"/><ellipse cx="36" cy="2" rx="26" ry="18" fill="#263238"/>` +
      `<ellipse cx="-34" cy="0" rx="14" ry="12" fill="#cfe9fb" fill-opacity=".25" stroke="#fff" stroke-width="2"/><ellipse cx="34" cy="0" rx="14" ry="12" fill="#cfe9fb" fill-opacity=".25" stroke="#fff" stroke-width="2"/>` +
      `<path d="M-60 -24 Q-36 -36 -14 -24 M14 -24 Q36 -36 60 -24" stroke="#fafafa" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<g transform="translate(84 4) rotate(30)"><rect x="0" y="-9" width="56" height="18" rx="9" fill="#9e9e9e" ${st(3)}/><path d="M14 -9 v18 M30 -9 v18" stroke="#263238" stroke-width="6"/><path d="M48 -9 v18" stroke="#263238" stroke-width="6"/></g>`,
  },
  // ---- at the mouth
  {
    id: 'mishko_hrusha',
    slot: 'mouth',
    name: 'Груша в зубах',
    price: 10,
    draw: () =>
      // a yellow pear held in his teeth, a bite taken out of it, a stalk and a leaf
      `<path d="M10 4 Q-8 6 -10 24 Q-14 48 10 56 Q36 60 40 34 Q42 10 22 2 Q22 -10 18 -18 Q8 -14 10 4 Z" fill="#dce775" ${stroke}/>` +
      `<path d="M-10 24 q6 4 4 12 q-6 2 -6 -6 z" fill="#fff9c4" ${st(2)}/>` +
      `<ellipse cx="24" cy="32" rx="5" ry="8" fill="#f0f4c3"/>` +
      `<path d="M18 -18 l2 -12" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/><path d="M20 -26 q14 -10 22 0 q-12 8 -22 0 z" fill="#66bb6a" ${st(2)}/>`,
  },
  // ---- the body
  {
    id: 'mishko_zmii',
    slot: 'neck',
    name: 'Повітряний змій',
    price: 16,
    draw: () =>
      // a string from his paw up to a bright kite flying above his shoulder, a tail of bows
      `<path d="M70 70 Q120 -20 120 -110" stroke="#fafafa" stroke-width="3" fill="none"/>` +
      `<path d="M120 -110 L88 -158 L120 -220 L152 -158 Z" fill="#fdd835" ${stroke}/>` +
      `<path d="M120 -110 L88 -158 L120 -158 Z M120 -220 L152 -158 L120 -158 Z" fill="#e53935"/>` +
      `<path d="M88 -158 H152 M120 -220 V-110" stroke="${INK}" stroke-width="3"/>` +
      `<path d="M120 -110 Q130 -80 116 -60 Q104 -40 116 -20" stroke="${INK}" stroke-width="2.5" fill="none"/>` +
      [[124, -84, '#1e88e5'], [110, -50, '#43a047'], [116, -22, '#ab47bc']].map(([x, y, c]) => `<path d="M${Number(x) - 10} ${Number(y) - 6} L${x} ${y} L${Number(x) - 10} ${Number(y) + 6} Z M${Number(x) + 10} ${Number(y) - 6} L${x} ${y} L${Number(x) + 10} ${Number(y) + 6} Z" fill="${c}" ${st(2)}/>`).join(''),
  },
  {
    id: 'mishko_ksylofon',
    slot: 'neck',
    name: 'Ксилофон',
    price: 15,
    draw: () =>
      // a toy xylophone hung on a cord at his belly: rainbow bars on a wooden frame, two mallets
      `<path d="M-46 -10 Q-60 50 -50 90 M46 -10 Q60 50 50 90" stroke="#ff7043" stroke-width="5" fill="none"/>` +
      `<path d="M-64 90 L64 90 L54 140 L-54 140 Z" fill="#8d6e63" ${st(3)}/>` +
      ['#e53935', '#ff9800', '#fdd835', '#43a047', '#1e88e5', '#8e24aa']
        .map((c, i) => `<rect x="${-56 + i * 19}" y="${92 - i * 1}" width="15" height="${46 - i * 4}" rx="3" fill="${c}" ${st(2)}/><circle cx="${-48.5 + i * 19}" cy="${97 - i}" r="1.8" fill="#fff"/>`)
        .join('') +
      `<path d="M-70 60 L-30 110 M70 60 L30 110" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M-70 60 L-30 110 M70 60 L30 110" stroke="#d7a86e" stroke-width="3" stroke-linecap="round"/>` +
      `<circle cx="-30" cy="110" r="7" fill="#e53935" ${st(2)}/><circle cx="30" cy="110" r="7" fill="#1e88e5" ${st(2)}/>`,
  },
  // ---- clothes, in his own numbers
  {
    id: 'mishko_kubyky',
    slot: 'torso',
    name: 'Светрик з кубиками',
    price: 16,
    draw: () => {
      // a yellow jumper with a tower of building blocks on it: a star, a circle, a triangle
      const block = (x: number, y: number, c: string, sign: string) => `<rect x="${x - 13}" y="${y - 13}" width="26" height="26" rx="3" fill="${c}" ${st(2.5)}/>${sign}`;
      return (
        sleeves(MISHKO_ARM, '#ffd54f', 24) +
        `<path d="${MISHKO_TOP}" fill="#ffd54f" ${stroke}/>` +
        block(-16, -66, '#e53935', star(-16, -66, 9, '#fff')) +
        block(16, -66, '#1e88e5', `<circle cx="16" cy="-66" r="7" fill="#fff"/>`) +
        block(0, -94, '#43a047', `<path d="M-8 -88 L0 -102 L8 -88 Z" fill="#fff"/>`) +
        `<path d="M-52 -52 Q0 -40 52 -52" stroke="#f9a825" stroke-width="6" fill="none"/>`
      );
    },
  },
  {
    id: 'mishko_poizd',
    slot: 'torso',
    name: 'Сорочка-поїзд',
    price: 18,
    draw: () => {
      // a sky-blue shirt, a little train running across it on its rails: an engine and two wagons, puffs of smoke
      const wheel = (x: number) => `<circle cx="${x}" cy="-60" r="5" fill="#424242" ${st(1.5)}/>`;
      return (
        sleeves(MISHKO_ARM, '#81d4fa', 24) +
        `<path d="${MISHKO_TOP}" fill="#81d4fa" ${stroke}/>` +
        `<path d="M-50 -55 H50" stroke="#6d4c41" stroke-width="3"/>` +
        `<rect x="-46" y="-80" width="24" height="18" rx="3" fill="#43a047" ${st(2)}/>` +
        `<rect x="-18" y="-80" width="24" height="18" rx="3" fill="#fdd835" ${st(2)}/>` +
        `<rect x="10" y="-86" width="34" height="24" rx="3" fill="#e53935" ${st(2)}/><rect x="28" y="-96" width="14" height="12" fill="#e53935" ${st(2)}/>` +
        `<rect x="14" y="-98" width="7" height="12" fill="#424242"/>` +
        `<circle cx="17" cy="-106" r="5" fill="#fff" opacity=".9"/><circle cx="8" cy="-114" r="6" fill="#fff" opacity=".8"/><circle cx="-4" cy="-120" r="7" fill="#fff" opacity=".7"/>` +
        [-40, -28, -12, 0, 18, 36].map(wheel).join('')
      );
    },
  },
  {
    id: 'mishko_pomidor',
    slot: 'torso',
    name: 'Костюм помідора',
    price: 20,
    draw: () =>
      // a round red tomato suit, shiny, a green star of leaves at the collar with a stalk
      sleeves(MISHKO_ARM, '#e53935', 24) +
      `<ellipse cx="0" cy="-74" rx="64" ry="60" fill="#e53935" ${stroke}/>` +
      `<path d="M-40 -110 Q-50 -80 -40 -50 M40 -110 Q50 -80 40 -50" stroke="#c62828" stroke-width="4" fill="none"/>` +
      `<ellipse cx="-30" cy="-94" rx="10" ry="16" fill="#fff" opacity=".45" transform="rotate(30 -30 -94)"/>` +
      `<path d="M0 -130 L-30 -138 L-12 -124 L-34 -112 L-6 -118 L0 -100 L6 -118 L34 -112 L12 -124 L30 -138 Z" fill="#43a047" ${st(2.5)}/>`,
  },
  {
    id: 'mishko_traktory',
    slot: 'legs',
    name: 'Штанці-трактори',
    price: 14,
    draw: () => {
      // green trousers with little red tractors driving round them, a big back wheel and a small front one
      const tractor = (x: number, y: number) =>
        `<g transform="translate(${x} ${y})"><rect x="-12" y="-12" width="18" height="10" rx="2" fill="#e53935" ${st(1.5)}/><rect x="-6" y="-20" width="9" height="9" fill="#90caf9" ${st(1.5)}/>` +
        `<circle cx="-7" cy="0" r="6" fill="#424242" ${st(1.5)}/><circle cx="8" cy="1" r="4" fill="#424242" ${st(1.5)}/><path d="M4 -12 v-6" stroke="#424242" stroke-width="2"/></g>`;
      return `<path d="${MISHKO_PANTS}" fill="#66bb6a" ${stroke}/>` + tractor(-30, -46) + tractor(30, -50) + tractor(34, -27) + `<path d="M-56 -60 H56" stroke="#2e7d32" stroke-width="5"/>`;
    },
  },
  {
    id: 'mishko_zoshyt',
    slot: 'legs',
    name: 'Штанці-зошит',
    price: 12,
    draw: () => {
      // white trousers in blue squares like an exercise book, scribbled with a sun and a little house
      let grid = '';
      for (let x = -54; x <= 54; x += 9) grid += `<path d="M${x} -66 V-22" stroke="#90caf9" stroke-width="1.2"/>`;
      for (let y = -60; y <= -24; y += 9) grid += `<path d="M-60 ${y} H60" stroke="#90caf9" stroke-width="1.2"/>`;
      return (
        `<clipPath id="mishko-zoshyt-c"><path d="${MISHKO_PANTS}"/></clipPath>` +
        `<path d="${MISHKO_PANTS}" fill="#fafafa"/>` +
        `<g clip-path="url(#mishko-zoshyt-c)">${grid}</g>` +
        `<path d="M-56 -64 H56" stroke="#e53935" stroke-width="2"/>` +
        `<circle cx="-32" cy="-46" r="7" fill="none" stroke="#fb8c00" stroke-width="2.5"/><path d="M-32 -58 v-4 M-20 -46 h4 M-44 -46 h-4 M-32 -34 v4" stroke="#fb8c00" stroke-width="2.5"/>` +
        `<path d="M22 -30 v-14 l10 -10 l10 10 v14 z" fill="none" stroke="#1e88e5" stroke-width="2.5"/>` +
        `<path d="${MISHKO_PANTS}" fill="none" ${stroke}/>`
      );
    },
  },
  {
    id: 'mishko_murakhy',
    slot: 'legs',
    name: 'Шорти з мурашками',
    price: 12,
    draw: () => {
      // orange shorts, a line of little black ants marching round them, one carrying a crumb
      const ant = (x: number, y: number) =>
        `<circle cx="${x - 6}" cy="${y}" r="3" fill="#212121"/><circle cx="${x}" cy="${y}" r="2.5" fill="#212121"/><circle cx="${x + 6}" cy="${y}" r="3.5" fill="#212121"/>` +
        `<path d="M${x - 3} ${y} l-3 5 M${x} ${y} l0 5 M${x + 3} ${y} l3 5 M${x - 9} ${y - 2} l-3 -4" stroke="#212121" stroke-width="1.2"/>`;
      return (
        `<path d="${MISHKO_SHORTS}" fill="#ffa726" ${stroke}/>` +
        `<path d="M-50 -54 Q-20 -46 0 -56 Q20 -64 50 -54" stroke="#ef6c00" stroke-width="2" fill="none" stroke-dasharray="3 3"/>` +
        [-44, -26, -8, 10, 28].map((x, i) => ant(x, -54 + (i % 2) * 4 - (i === 2 ? 6 : 0))).join('') +
        `<rect x="40" y="-62" width="7" height="6" fill="#fff8e1" ${st(1.2)}/>` +
        `<path d="M-54 -40 H-6 M6 -40 H54" stroke="#ef6c00" stroke-width="4"/>`
      );
    },
  },
  {
    id: 'mishko_kehli',
    slot: 'feet',
    name: 'Черевики-кеглі',
    price: 12,
    draw: () =>
      // each shoe a white skittle lying down, two red stripes on its neck
      pair(
        `<path d="M-2 -14 Q-2 -28 14 -26 Q24 -22 30 -18 Q40 -22 46 -20 Q54 -16 54 -10 Q54 -4 46 -2 Q40 0 30 -4 Q24 0 14 0 Q-2 0 -2 -14 Z" fill="#fafafa" ${st(3)}/>` +
          `<path d="M32 -18 v14 M38 -20 v18" stroke="#e53935" stroke-width="3"/>`,
      ),
  },
  {
    id: 'mishko_nosorohy',
    slot: 'feet',
    name: 'Капці-носороги',
    price: 14,
    draw: () =>
      // grey rhino slippers: a horn at the toe, little ears, a sleepy eye
      pair(
        `<path d="M10 -24 l-2 -10 l8 6 M24 -28 l2 -10 l6 8" fill="#90a4ae" ${st(2)}/>` +
          `<ellipse cx="24" cy="-13" rx="27" ry="14" fill="#90a4ae" ${st(3)}/>` +
          `<path d="M42 -18 L56 -34 L50 -12 Z" fill="#eceff1" ${st(2.5)}/>` +
          `<path d="M28 -18 q4 3 8 0" stroke="${INK}" stroke-width="2.5" fill="none"/>` +
          `<circle cx="44" cy="-8" r="2" fill="${INK}"/>`,
      ),
  },
  {
    id: 'mishko_morzhi',
    slot: 'feet',
    name: 'Капці-моржі',
    price: 14,
    draw: () =>
      // brown walrus slippers: a whiskery muzzle at the toe, two long white tusks, round eyes
      pair(
        `<ellipse cx="22" cy="-13" rx="27" ry="15" fill="#a1887f" ${st(3)}/>` +
          `<circle cx="16" cy="-20" r="2.6" fill="${INK}"/><circle cx="28" cy="-22" r="2.6" fill="${INK}"/>` +
          `<ellipse cx="34" cy="-10" rx="12" ry="8" fill="#d7ccc8" ${st(2)}/>` +
          `<path d="M30 -4 L28 10 M38 -4 L40 10" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M30 -4 L28 10 M38 -4 L40 10" stroke="#fafafa" stroke-width="3" stroke-linecap="round"/>` +
          `<path d="M26 -12 h-8 M42 -12 h8 M26 -8 h-8 M42 -8 h8" stroke="${INK}" stroke-width="1.2"/>`,
      ),
  },
];

export const ITEMS: Item[] = [...MASHA, ...MAMA, ...MISHKO];

const ids = (list: Item[]) => list.map((i) => i.id).join(' ');
export const SETS: Record<string, string> = {
  masha: ids(MASHA),
  vedmedytsia: ids(MAMA),
  mishko: ids(MISHKO),
};
