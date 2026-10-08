// The own things of the heroes of «Троє поросят». SETS here ADD to a hero's set.
//
// All three piglets face us (two eyes: they can wear glasses). The accessories are drawn for u = 100
// as everywhere (head: the origin on top of the head; face: between the eyes, the eyes at ±34; mouth;
// neck: under the chin). The clothes, in the piglets' own numbers (puppets-porosiata.ts, feet at 0,0,
// the same body for all three): the round body an ellipse round 0,-124 (64 × 76: from -200 down to
// -48), a top from the shoulders at -190 to the hips at -86; the arms from ±52,-172 to the hooves at
// ±76,-102; the legs at x ±12..38 from -70 down to -10, the hooves from ±8 to ±42 below -20. What is
// worn on the legs goes over the round body from the waist at -104 (a top covers its waistband):
// shorts reach -30, trousers -16. Naf-Naf's leather apron hangs down to -76: his tops are a little longer, over it.
// No lettering anywhere: a hero turned the other way shows its things mirrored.

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** a pair: one shoe drawn for the right foot, mirrored for the left */
const pair = (shoe: string) => `<g transform="scale(-1 1)">${shoe}</g>${shoe}`;

/** the right arm's path; sleeves go along it (mirrored for the left) */
const ARM = 'M52 -172 Q86 -144 76 -106';
const sleeves = (fill: string, w = 24, extra = '') => {
  const one = `<path d="${ARM}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${ARM}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>${extra}`;
  return `<g transform="scale(-1 1)">${one}</g>${one}`;
};

/** a top: from the shoulders to the hips (y), over the round body */
const top = (y = -84) => `M-60 -188 Q-76 -130 -68 ${y + 2} Q0 ${y + 14} 68 ${y + 2} Q76 -130 60 -188 Q0 -212 -60 -188 Z`;
/** Naf-Naf's tops, a little longer: down over his apron */
const LONG = top(-70);
/** shorts: two wide legs down to y, the crotch between */
const shorts = (y = -30) => `M-66 -104 Q-70 -60 -50 ${y} L-6 ${y} L0 -56 L6 ${y} L50 ${y} Q70 -60 66 -104 Z`;
/** trousers down to the hooves */
const TROUSERS = 'M-66 -104 Q-68 -60 -46 -16 L-6 -16 L0 -58 L6 -16 L46 -16 Q68 -60 66 -104 Z';

/** a flower of n round petals round x, y */
const bloom = (x: number, y: number, r: number, petal: string, middle: string, n = 5) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(r * 0.7).toFixed(1)}" fill="${petal}" ${st(1.5)}/>`;
  }).join('') + `<circle cx="${x}" cy="${y}" r="${(r * 0.55).toFixed(1)}" fill="${middle}" ${st(1.5)}/>`;

/** a little pig's face (the print on Nif-Nif's shirt) */
const pigFace = (x: number, y: number) =>
  `<path d="M${x - 10} ${y - 6} l-3 -10 l9 5 z M${x + 10} ${y - 6} l3 -10 l-9 5 z" fill="#f48fb1"/>` +
  `<circle cx="${x}" cy="${y}" r="11" fill="#f8bbd0" ${st(1.5)}/><ellipse cx="${x}" cy="${y + 3}" rx="5" ry="3.5" fill="#f06292"/>` +
  `<circle cx="${x - 4}" cy="${y - 4}" r="1.6" fill="${INK}"/><circle cx="${x + 4}" cy="${y - 4}" r="1.6" fill="${INK}"/>`;

// ---------------- Nif-Nif ----------------

const NIF: Item[] = [
  {
    id: 'nif_kaliuzha',
    slot: 'head',
    name: 'Капелюх-калюжка',
    price: 12,
    draw: () =>
      // a round blue puddle on his head: splashes jumping up out of it, ripples, a yellow leaf afloat
      `<path d="M-30 -20 q-10 -30 -24 -40 M0 -24 q0 -34 6 -54 M30 -20 q12 -28 28 -36" stroke="#4fc3f7" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<circle cx="-56" cy="-64" r="8" fill="#4fc3f7" ${st(2.5)}/><circle cx="6" cy="-84" r="9" fill="#4fc3f7" ${st(2.5)}/><circle cx="60" cy="-60" r="7" fill="#4fc3f7" ${st(2.5)}/>` +
      `<path d="M-84 0 Q-90 -26 -50 -28 Q-20 -40 20 -30 Q70 -34 84 -10 Q90 12 50 14 Q0 22 -50 14 Q-84 14 -84 0 Z" fill="#29b6f6" ${stroke}/>` +
      `<ellipse cx="-10" cy="-6" rx="40" ry="10" fill="none" stroke="#b3e5fc" stroke-width="4"/><ellipse cx="-10" cy="-6" rx="20" ry="5" fill="none" stroke="#e1f5fe" stroke-width="3"/>` +
      `<path d="M30 -8 q14 -16 32 -10 q-6 16 -32 10 z" fill="#fbc02d" ${st(2.5)}/><path d="M32 -8 l26 -8" stroke="#f57f17" stroke-width="2"/>`,
  },
  {
    id: 'nif_vitriachky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-вітрячки',
    price: 14,
    draw: () =>
      // a paper pinwheel over each eye, four bright blades, a pin in the middle; a wire between them
      `<path d="M-6 -2 Q0 -10 6 -2" stroke="${INK}" stroke-width="5" fill="none"/>` +
      [-36, 36]
        .map((x, k) =>
          [0, 90, 180, 270]
            .map((a, i) => `<path d="M0 0 L0 -32 Q22 -30 26 -8 Z" fill="${['#e53935', '#fdd835', '#43a047', '#1e88e5'][(i + k) % 4]}" ${st(2.5)} transform="translate(${x} 0) rotate(${a + (k ? 20 : 0)})"/>`)
            .join('') + `<circle cx="${x}" cy="0" r="6" fill="#fff" ${st(2.5)}/>`,
        )
        .join(''),
  },
  {
    id: 'nif_travynka',
    slot: 'mouth',
    name: 'Травинка в зубах',
    price: 6,
    draw: () =>
      // a long stalk of grass in the corner of the mouth, bending away, its fluffy seed head bobbing
      `<path d="M-4 2 Q60 -10 96 -60" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      `<path d="M-4 2 Q60 -10 96 -60" stroke="#9ccc65" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M40 -6 q10 -18 26 -20 q-6 16 -26 20 z" fill="#7cb342" ${st(2)}/>` +
      `<ellipse cx="100" cy="-76" rx="9" ry="20" fill="#d4e157" ${st(2.5)} transform="rotate(30 100 -76)"/>` +
      `<path d="M94 -86 l-8 -4 M100 -94 l-4 -8 M108 -84 l8 -4 M104 -72 l9 2" stroke="#9e9d24" stroke-width="2.5" stroke-linecap="round"/>`,
  },
  {
    id: 'nif_vudochka',
    slot: 'neck',
    name: 'Вудочка через плече',
    price: 15,
    draw: () =>
      // a fishing rod over his shoulder, the line hanging down in front — and an old boot caught on it
      `<path d="M-50 150 L96 -120" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-50 150 L96 -120" stroke="#c8955a" stroke-width="6" stroke-linecap="round"/>` +
      `<circle cx="-30" cy="114" r="12" fill="#90a4ae" ${st(3)}/><path d="M-30 114 l8 -6" stroke="${INK}" stroke-width="3"/>` +
      `<path d="M96 -120 Q130 -60 128 40" stroke="#eceff1" stroke-width="2.5" fill="none"/>` +
      `<circle cx="128" cy="0" r="7" fill="#e53935" ${st(2)}/>` +
      `<path d="M128 40 q-4 10 4 12" stroke="${INK}" stroke-width="3" fill="none"/>` +
      `<path d="M112 48 h30 v34 q22 4 24 18 h-60 z" fill="#6d4c41" ${st(3)}/><path d="M112 92 h54" stroke="#3e2723" stroke-width="4"/>` +
      `<path d="M118 58 q8 4 16 0 M118 68 q8 4 16 0" stroke="#3e2723" stroke-width="2" fill="none"/>`,
  },
  {
    id: 'nif_zamazura',
    slot: 'torso',
    name: 'Костюм замазури',
    price: 16,
    draw: () =>
      // a sand-coloured top all splattered with mud: big brown splodges, drips, a muddy hoofprint
      sleeves('#e8d3a8', 24, `<circle cx="74" cy="-132" r="9" fill="#795548"/><circle cx="62" cy="-156" r="6" fill="#6d4c41"/>`) +
      `<path d="${top()}" fill="#e8d3a8" ${stroke}/>` +
      `<path d="M-50 -170 q-12 14 4 26 q18 6 22 -10 q-4 -22 -26 -16 z M20 -150 q16 -12 30 2 q6 22 -16 24 q-20 -6 -14 -26 z M-30 -112 q10 -8 22 0 q4 12 -10 14 q-14 -2 -12 -14 z" fill="#795548"/>` +
      `<path d="M-38 -144 v20 M36 -128 v26 M-16 -100 v12" stroke="#795548" stroke-width="5" stroke-linecap="round"/>` +
      `<g transform="translate(10 -186)"><ellipse rx="10" ry="12" fill="#5d4037"/><ellipse cx="-12" cy="-12" rx="5" ry="6" fill="#5d4037"/><ellipse cx="12" cy="-12" rx="5" ry="6" fill="#5d4037"/></g>` +
      `<circle cx="44" cy="-104" r="6" fill="#6d4c41"/><circle cx="-56" cy="-120" r="5" fill="#6d4c41"/>`,
  },
  {
    id: 'nif_opudalo',
    slot: 'torso',
    name: 'Костюм опудала',
    price: 18,
    draw: () =>
      // a sack of a coat with bright patches, a rope belt, straw poking out of the sleeves and the collar
      sleeves('#bfa074', 24, `<path d="M76 -100 l-6 20 M76 -100 l6 20 M76 -100 l16 12 M76 -100 l-16 10" stroke="#f2cf66" stroke-width="5" stroke-linecap="round"/>`) +
      `<path d="${top()}" fill="#bfa074" ${stroke}/>` +
      `<path d="M-40 -200 l-6 -18 M-20 -206 l-2 -20 M20 -206 l2 -20 M40 -200 l6 -18" stroke="#f2cf66" stroke-width="5" stroke-linecap="round"/>` +
      `<rect x="-46" y="-170" width="34" height="30" fill="#e53935" ${st(3)}/><path d="M-46 -170 l34 30 M-12 -170 l-34 30" stroke="#fff" stroke-width="2" stroke-dasharray="4 4"/>` +
      `<rect x="14" y="-150" width="30" height="28" fill="#42a5f5" ${st(3)}/><path d="M14 -136 h30 M29 -150 v28" stroke="#fff" stroke-width="2"/>` +
      `<path d="M-68 -100 Q0 -88 68 -100" stroke="#a1887f" stroke-width="9" fill="none"/><path d="M-6 -94 l-8 26 M6 -94 l8 26" stroke="#a1887f" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M-60 -86 l-4 14 M-40 -82 l-2 16 M40 -82 l2 16 M60 -86 l4 14" stroke="#f2cf66" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: 'nif_khriushky',
    slot: 'torso',
    name: 'Сорочка з хрюшками',
    price: 14,
    draw: () =>
      // a sky-blue shirt printed with little smiling pig faces, a white collar, white buttons
      sleeves('#81d4fa') +
      `<path d="${top()}" fill="#81d4fa" ${stroke}/>` +
      pigFace(-36, -150) + pigFace(28, -168) + pigFace(36, -116) + pigFace(-24, -106) +
      `<path d="M-30 -196 L0 -178 L30 -196 L22 -206 L0 -192 L-22 -206 Z" fill="#fff" ${st(3)}/>` +
      `<circle cx="0" cy="-160" r="4" fill="#fff" ${st(1.5)}/><circle cx="0" cy="-136" r="4" fill="#fff" ${st(1.5)}/><circle cx="0" cy="-112" r="4" fill="#fff" ${st(1.5)}/>`,
  },
  {
    id: 'nif_pisochnytsia',
    slot: 'legs',
    name: 'Шорти-пісочниця',
    price: 12,
    draw: () =>
      // sandy shorts: a little sand castle with a flag on one leg, a red bucket and a blue spade on the other
      `<path d="${shorts()}" fill="#ffe0a3" ${stroke}/>` +
      `<circle cx="-30" cy="-44" r="2" fill="#d7a86e"/><circle cx="-14" cy="-36" r="2" fill="#d7a86e"/><circle cx="20" cy="-40" r="2" fill="#d7a86e"/><circle cx="46" cy="-36" r="2" fill="#d7a86e"/>` +
      `<path d="M-48 -32 v-18 h6 v6 h6 v-6 h6 v6 h6 v-6 h6 v18 z" fill="#e6b85c" ${st(2)}/><path d="M-30 -50 v-12" stroke="${INK}" stroke-width="2"/><path d="M-30 -62 l10 4 l-10 4 z" fill="#e53935"/>` +
      `<path d="M14 -48 h18 l-3 16 h-12 z" fill="#e53935" ${st(2)}/><path d="M16 -48 q7 -10 14 0" fill="none" stroke="${INK}" stroke-width="2"/>` +
      `<path d="M40 -56 l6 18" stroke="#1e88e5" stroke-width="4"/><path d="M42 -40 l8 -2 l2 10 l-8 2 z" fill="#1e88e5" ${st(1.5)}/>`,
  },
  {
    id: 'nif_voloshky',
    slot: 'legs',
    name: 'Штанці-волошки',
    price: 12,
    draw: () =>
      // white trousers sprinkled with blue cornflowers and wheat-gold stems
      `<path d="${TROUSERS}" fill="#fafafa" ${stroke}/>` +
      [[-34, -56], [-50, -28], [-22, -30], [30, -50], [48, -26], [20, -24]]
        .map(([x, y]) => `<path d="M${x} ${y + 4} l-4 10" stroke="#9e9d24" stroke-width="2"/>` + bloom(x, y, 5, '#3f51b5', '#7986cb', 6))
        .join('') +
      `<path d="M-46 -18 H-8 M8 -18 H46" stroke="#3f51b5" stroke-width="4"/>`,
  },
  {
    id: 'nif_malynnyk',
    slot: 'legs',
    name: 'Штанці-малинник',
    price: 13,
    draw: () => {
      // green shorts hung with ripe raspberries, a leaf here and there
      const berry = (x: number, y: number) =>
        [[0, 0], [-4, -4], [4, -4], [-4, 4], [4, 4], [0, -7], [0, 7]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="3" fill="#d81b60" stroke="#880e4f" stroke-width="1"/>`).join('');
      return (
        `<path d="${shorts()}" fill="#66bb6a" ${stroke}/>` +
        berry(-36, -48) + berry(-20, -36) + berry(30, -46) + berry(46, -36) +
        `<path d="M-48 -56 q10 -10 20 -4 q-8 10 -20 4 z M16 -56 q10 -10 20 -4 q-8 10 -20 4 z" fill="#2e7d32" ${st(1.5)}/>`
      );
    },
  },
  {
    id: 'nif_mashynky',
    slot: 'feet',
    name: 'Черевики-машинки',
    price: 15,
    draw: () =>
      // each shoe a little red toy car: a blue window, a headlight, two black wheels
      pair(
        `<path d="M4 -10 v-12 q0 -6 8 -8 l8 -10 h18 l8 10 q8 2 8 8 v12 z" fill="#e53935" ${st(3)}/>` +
          `<path d="M22 -38 h14 l6 8 h-24 z" fill="#81d4fa" ${st(2)}/>` +
          `<circle cx="52" cy="-20" r="4" fill="#fff176" ${st(1.5)}/>` +
          `<circle cx="16" cy="-8" r="8" fill="#263238" ${st(2)}/><circle cx="16" cy="-8" r="3" fill="#b0bec5"/>` +
          `<circle cx="42" cy="-8" r="8" fill="#263238" ${st(2)}/><circle cx="42" cy="-8" r="3" fill="#b0bec5"/>`,
      ),
  },
  {
    id: 'nif_liiky',
    slot: 'feet',
    name: 'Черевики-лійки',
    price: 13,
    draw: () =>
      // each shoe a green watering can: a handle on top, the long spout out to the side, drops
      pair(
        `<path d="M14 -36 q12 -16 24 0" fill="none" stroke="${INK}" stroke-width="5"/>` +
          `<path d="M42 -20 L64 -40" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M42 -20 L64 -40" stroke="#66bb6a" stroke-width="4" stroke-linecap="round"/>` +
          `<rect x="60" y="-48" width="12" height="10" rx="2" fill="#43a047" ${st(2)} transform="rotate(-40 66 -43)"/>` +
          `<rect x="8" y="-34" width="38" height="34" rx="6" fill="#43a047" ${st(3)}/>` +
          `<path d="M12 -22 h30" stroke="#81c784" stroke-width="4"/>` +
          `<circle cx="72" cy="-30" r="2.5" fill="#4fc3f7"/><circle cx="76" cy="-22" r="2.5" fill="#4fc3f7"/>`,
      ),
  },
  {
    id: 'nif_horikhy',
    slot: 'feet',
    name: 'Капці-горішки',
    price: 11,
    draw: () =>
      // each slipper half a walnut shell, wrinkly and brown, a green leaf on the toe
      pair(
        `<path d="M6 0 Q2 -30 26 -32 Q50 -30 46 0 Z" fill="#a1764a" ${st(3)}/>` +
          `<path d="M14 -6 q4 -10 0 -18 M24 -4 q-4 -12 2 -24 M34 -6 q4 -10 0 -20 M42 -8 q-4 -8 0 -14" stroke="#6d4c41" stroke-width="2.5" fill="none"/>` +
          `<path d="M26 -32 q10 -12 24 -8 q-8 12 -24 8 z" fill="#7cb342" ${st(2)}/>`,
      ),
  },
];

// ---------------- Nuf-Nuf ----------------

const NUF: Item[] = [
  {
    id: 'nuf_rohy',
    slot: 'head',
    name: 'Роги з гілочок',
    price: 12,
    draw: () => {
      // two twigs stuck up like a deer's antlers, forking, a few green leaves and a red berry
      const horn = `<path d="M24 4 Q34 -40 60 -70 M44 -44 Q62 -46 76 -34 M56 -64 Q52 -90 62 -106 M60 -70 Q80 -80 92 -96" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
        `<path d="M24 4 Q34 -40 60 -70 M44 -44 Q62 -46 76 -34 M56 -64 Q52 -90 62 -106 M60 -70 Q80 -80 92 -96" fill="none" stroke="#8b5e34" stroke-width="6" stroke-linecap="round"/>` +
        `<path d="M76 -34 q14 -12 24 0 q-12 10 -24 0 z M62 -106 q4 -18 18 -18 q0 16 -18 18 z" fill="#7cb342" ${st(2)}/>`;
      return `<g transform="scale(-1 1)">${horn}</g>${horn}<circle cx="92" cy="-96" r="7" fill="#e53935" ${st(2)}/>`;
    },
  },
  {
    id: 'nuf_plativky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-платівки',
    price: 14,
    draw: () =>
      // a little black record over each eye, its grooves shining, a red label with the eye showing through
      [-36, 36]
        .map(
          (x) =>
            `<circle cx="${x}" cy="0" r="32" fill="#212121" ${st(3)}/>` +
            `<circle cx="${x}" cy="0" r="25" fill="none" stroke="#424242" stroke-width="2"/><circle cx="${x}" cy="0" r="19" fill="none" stroke="#424242" stroke-width="2"/>` +
            `<path d="M${x - 22} -14 q8 -12 22 -16" stroke="#9e9e9e" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
            `<circle cx="${x}" cy="0" r="13" fill="#ef5350" fill-opacity=".45" stroke="#e53935" stroke-width="2"/>`,
        )
        .join('') + `<path d="M-6 -4 Q0 -12 6 -4" stroke="#212121" stroke-width="6" fill="none"/>`,
  },
  {
    id: 'nuf_svyshchyk',
    slot: 'mouth',
    name: 'Свищик-пташка',
    price: 10,
    draw: () =>
      // a little clay bird whistle in his mouth, painted with flowers; notes fly out of its tail
      `<path d="M58 -6 l18 -14 l-2 18 z" fill="#ffb74d" ${st(2.5)}/>` +
      `<ellipse cx="32" cy="2" rx="30" ry="18" fill="#ffcc80" ${st(3)}/>` +
      `<circle cx="16" cy="-12" r="12" fill="#ffcc80" ${st(3)}/><path d="M6 -14 l-10 4 l10 4 z" fill="#e65100" ${st(2)}/>` +
      `<circle cx="18" cy="-15" r="2.5" fill="${INK}"/>` +
      `<circle cx="34" cy="4" r="5" fill="#1e88e5"/><circle cx="46" cy="0" r="4" fill="#e53935"/><path d="M26 10 q10 6 22 0" stroke="#43a047" stroke-width="3" fill="none"/>` +
      `<g fill="#5c6bc0"><ellipse cx="88" cy="-34" rx="6" ry="4.5"/><path d="M93 -36 v-16" stroke="#5c6bc0" stroke-width="2.5"/><ellipse cx="104" cy="-52" rx="5" ry="4"/><path d="M108 -54 v-14" stroke="#5c6bc0" stroke-width="2.5"/></g>`,
  },
  {
    id: 'nuf_marakasy',
    slot: 'neck',
    name: 'Маракаси',
    price: 13,
    draw: () => {
      // two striped maracas crossed on his chest, hung on a yellow ribbon round the neck
      const mar = (rot: number, a: string, b: string) =>
        `<g transform="rotate(${rot} 0 70)"><rect x="-6" y="70" width="12" height="54" rx="5" fill="#8d6e63" ${st(2.5)}/>` +
        `<ellipse cx="0" cy="44" rx="26" ry="32" fill="${a}" ${st(3)}/><path d="M-24 34 Q0 44 24 34 M-25 52 Q0 62 25 52" stroke="${b}" stroke-width="6" fill="none"/>` +
        `<circle cx="-8" cy="26" r="4" fill="#fff" opacity=".7"/></g>`;
      return (
        `<path d="M-50 -10 Q-40 50 0 70 Q40 50 50 -10" stroke="${INK}" stroke-width="10" fill="none"/><path d="M-50 -10 Q-40 50 0 70 Q40 50 50 -10" stroke="#fdd835" stroke-width="5" fill="none"/>` +
        mar(-30, '#e53935', '#fdd835') + mar(30, '#43a047', '#ff9800')
      );
    },
  },
  {
    id: 'nuf_lama',
    slot: 'torso',
    name: 'Светр-лама',
    price: 18,
    draw: () =>
      // a fluffy cream sweater, curly all over, a llama's face on the chest with long ears and a smile, tassels
      sleeves('#fff3e0', 26, `<path d="M64 -150 q6 -4 10 2 M70 -128 q6 -4 10 2" stroke="#d7ccc8" stroke-width="3" fill="none"/>`) +
      `<path d="${top()}" fill="#fff3e0" ${stroke}/>` +
      Array.from({ length: 9 }, (_, i) => `<path d="M${-58 + i * 14} -96 q7 -8 14 0" stroke="#d7ccc8" stroke-width="3" fill="none"/>`).join('') +
      `<path d="M-18 -178 l-6 -22 l12 14 z M18 -178 l6 -22 l-12 14 z" fill="#fafafa" ${st(2.5)}/>` +
      `<ellipse cx="0" cy="-150" rx="24" ry="30" fill="#fafafa" ${st(3)}/>` +
      `<circle cx="-9" cy="-158" r="3" fill="${INK}"/><circle cx="9" cy="-158" r="3" fill="${INK}"/>` +
      `<ellipse cx="0" cy="-136" rx="10" ry="7" fill="#f8bbd0"/><path d="M-6 -128 q6 5 12 0" stroke="${INK}" stroke-width="2" fill="none"/>` +
      `<path d="M-24 -176 h48" stroke="#e53935" stroke-width="5"/><circle cx="-14" cy="-176" r="4" fill="#fdd835"/><circle cx="14" cy="-176" r="4" fill="#43a047"/>` +
      [-50, -30, 30, 50].map((x, i) => `<path d="M${x} -92 v14" stroke="${['#e53935', '#1e88e5', '#fdd835', '#43a047'][i]}" stroke-width="5" stroke-linecap="round"/>`).join(''),
  },
  {
    id: 'nuf_krab',
    slot: 'torso',
    name: 'Костюм краба',
    price: 20,
    draw: () => {
      // a red crab's shell for a top, its eyes on stalks on the shoulders, big pincers over the hooves
      const claw = `<g transform="translate(90 -84) rotate(-10) scale(1.5)"><path d="M0 0 Q-20 -16 -10 -38 Q10 -46 22 -30 L8 -22 L24 -8 Q16 10 0 0 Z" fill="#e53935" ${st(3)}/></g>`;
      const stalk = `<path d="M56 -186 Q70 -206 72 -232" stroke="${INK}" stroke-width="8" fill="none"/><path d="M56 -186 Q70 -206 72 -232" stroke="#e53935" stroke-width="3" fill="none"/><circle cx="72" cy="-240" r="10" fill="#fff" ${st(2.5)}/><circle cx="74" cy="-240" r="4.5" fill="${INK}"/>`;
      return (
        sleeves('#ef5350') +
        `<g transform="scale(-1 1)">${claw}${stalk}</g>${claw}${stalk}` +
        `<path d="${top()}" fill="#e53935" ${stroke}/>` +
        `<path d="M-50 -180 Q0 -200 50 -180 M-60 -150 Q0 -166 60 -150 M-64 -120 Q0 -134 64 -120" stroke="#c62828" stroke-width="4" fill="none"/>` +
        `<circle cx="-30" cy="-136" r="5" fill="#ffcdd2"/><circle cx="24" cy="-166" r="4" fill="#ffcdd2"/><circle cx="36" cy="-110" r="5" fill="#ffcdd2"/>` +
        `<path d="M-68 -96 l-14 10 M-66 -108 l-16 2 M68 -96 l14 10 M66 -108 l16 2" stroke="#e53935" stroke-width="5" stroke-linecap="round"/>`
      );
    },
  },
  {
    id: 'nuf_praportsi',
    slot: 'torso',
    name: 'Жилет з прапорцями',
    price: 15,
    draw: () => {
      // a white shirt, a green waistcoat over it and a string of little bright flags across, like a fair
      let flags = '';
      const xs = [-52, -34, -16, 2, 20, 38, 54];
      xs.forEach((x, i) => {
        const y = -170 + Math.pow((x - 1) / 52, 2) * -10 + 18 * (1 - Math.pow((x - 1) / 56, 2));
        flags += `<path d="M${x - 8} ${y.toFixed(0)} h16 l-8 16 z" fill="${['#e53935', '#fdd835', '#1e88e5', '#43a047', '#ff9800', '#8e24aa', '#e53935'][i]}" ${st(1.5)}/>`;
      });
      return (
        sleeves('#fafafa') +
        `<path d="${top()}" fill="#fafafa" ${stroke}/>` +
        `<path d="M-60 -188 Q-76 -130 -68 -82 Q-40 -74 -16 -76 L-10 -190 Q-36 -198 -60 -188 Z M60 -188 Q76 -130 68 -82 Q40 -74 16 -76 L10 -190 Q36 -198 60 -188 Z" fill="#2e7d32" ${st(3.5)}/>` +
        `<circle cx="-22" cy="-140" r="3.5" fill="#fdd835"/><circle cx="-22" cy="-114" r="3.5" fill="#fdd835"/>` +
        `<path d="M-60 -172 Q0 -144 60 -172" stroke="${INK}" stroke-width="2" fill="none"/>` +
        flags
      );
    },
  },
  {
    id: 'nuf_drabynky',
    slot: 'legs',
    name: 'Штанці-драбинки',
    price: 12,
    draw: () => {
      // yellow trousers, each leg a little wooden ladder: two rails and the rungs between
      let rungs = '';
      for (let y = -96; y < -20; y += 14) rungs += `<path d="M-40 ${y} H-16 M16 ${y} H40" stroke="#8d6e63" stroke-width="4"/>`;
      return (
        `<path d="${TROUSERS}" fill="#ffe082" ${stroke}/>` +
        `<path d="M-42 -100 V-18 M-14 -100 V-18 M14 -100 V-18 M42 -100 V-18" stroke="#8d6e63" stroke-width="5"/>` +
        rungs
      );
    },
  },
  {
    id: 'nuf_drazhe',
    slot: 'legs',
    name: 'Шорти-драже',
    price: 10,
    draw: () =>
      // white shorts covered with shiny round sweets of every colour
      `<path d="${shorts()}" fill="#fafafa" ${stroke}/>` +
      [[-44, -50, '#e53935'], [-26, -40, '#fdd835'], [-36, -34, '#1e88e5'], [-14, -48, '#43a047'], [20, -48, '#ff9800'], [36, -40, '#8e24aa'], [48, -50, '#e91e63'], [26, -34, '#00bcd4']]
        .map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="5" fill="${c}" ${st(1.5)}/><circle cx="${Number(x) - 2}" cy="${Number(y) - 2}" r="1.5" fill="#fff"/>`)
        .join(''),
  },
  {
    id: 'nuf_smorodynky',
    slot: 'legs',
    name: 'Штанці-смородинки',
    price: 12,
    draw: () => {
      // pale green trousers with bunches of black and red currants hanging on thin stems
      const bunch = (x: number, y: number, c: string) =>
        `<path d="M${x} ${y - 14} q4 8 0 22" stroke="#558b2f" stroke-width="2" fill="none"/>` +
        [[0, 0], [-5, 6], [5, 8], [0, 14]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="3.6" fill="${c}" ${st(1)}/>`).join('');
      return `<path d="${TROUSERS}" fill="#dcedc8" ${stroke}/>` + bunch(-36, -64, '#311b92') + bunch(-24, -40, '#d32f2f') + bunch(30, -60, '#d32f2f') + bunch(40, -38, '#311b92');
    },
  },
  {
    id: 'nuf_papuhy',
    slot: 'feet',
    name: 'Капці-папуги',
    price: 14,
    draw: () =>
      // each slipper a green parrot: a hooked yellow beak at the toe, a round eye, a red crest, a blue wing
      pair(
        `<path d="M6 0 Q2 -30 28 -30 Q50 -28 48 0 Z" fill="#43a047" ${st(3)}/>` +
          `<path d="M14 -8 q10 -12 22 -4 q-10 8 -22 4 z" fill="#1e88e5" ${st(2)}/>` +
          `<path d="M28 -30 l-4 -12 l8 6 l4 -10 l2 12" fill="#e53935" ${st(2)}/>` +
          `<circle cx="38" cy="-18" r="5" fill="#fff" ${st(1.5)}/><circle cx="39" cy="-18" r="2.2" fill="${INK}"/>` +
          `<path d="M46 -16 q14 0 10 14 q-6 -6 -12 -4 z" fill="#fdd835" ${st(2)}/>`,
      ),
  },
  {
    id: 'nuf_kruasany',
    slot: 'feet',
    name: 'Черевики-круасани',
    price: 12,
    draw: () =>
      // each shoe a golden croissant, curled round the hoof, its rolls shiny
      pair(
        `<path d="M2 -8 Q0 -30 26 -32 Q54 -30 52 -8 Q46 0 40 -4 Q26 -10 14 -4 Q6 0 2 -8 Z" fill="#f0b45a" ${st(3)}/>` +
          `<path d="M14 -28 q-2 12 4 22 M26 -32 q-2 14 2 24 M38 -28 q2 12 -2 22" stroke="#c77e2b" stroke-width="3" fill="none"/>` +
          `<path d="M18 -24 q8 -4 16 -2" stroke="#ffe0a3" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'nuf_tistechka',
    slot: 'feet',
    name: 'Капці-тістечка',
    price: 13,
    draw: () =>
      // each slipper a cupcake: a ribbed paper cup, a swirl of pink cream, a cherry on top
      pair(
        `<path d="M8 -16 L12 0 H42 L46 -16 Z" fill="#4fc3f7" ${st(3)}/><path d="M18 -14 v12 M27 -14 v12 M36 -14 v12" stroke="#0288d1" stroke-width="2"/>` +
          `<path d="M6 -16 Q4 -30 18 -30 Q20 -42 30 -38 Q44 -38 44 -28 Q52 -24 48 -16 Z" fill="#f48fb1" ${st(3)}/>` +
          `<circle cx="20" cy="-24" r="2" fill="#fff"/><circle cx="36" cy="-22" r="2" fill="#fdd835"/>` +
          `<circle cx="30" cy="-44" r="6" fill="#d32f2f" ${st(2)}/><path d="M30 -50 q4 -8 10 -8" stroke="#558b2f" stroke-width="2" fill="none"/>`,
      ),
  },
];

// ---------------- Naf-Naf ----------------

const NAF: Item[] = [
  {
    id: 'naf_dymar',
    slot: 'head',
    name: 'Шапка-димар',
    price: 15,
    draw: () => {
      // a little brick chimney for a hat, a curl of smoke coming out of its top
      let rows = '';
      for (let i = 0, y = -16; y > -96; i++, y -= 16) {
        rows += `<path d="M-40 ${y} H40" stroke="#8e3a26" stroke-width="2.5"/>`;
        for (let x = -40 + (i % 2 ? 13 : 0); x < 40; x += 26) rows += `<path d="M${x} ${y} v16" stroke="#8e3a26" stroke-width="2.5"/>`;
      }
      return (
        `<path d="M-46 8 L-40 -96 L40 -96 L46 8 Z" fill="#c9603f" ${stroke}/>` +
        rows +
        `<rect x="-50" y="-112" width="100" height="18" rx="4" fill="#8e3a26" ${st(4)}/>` +
        `<circle cx="-4" cy="-130" r="14" fill="#eceff1" ${st(2)}/><circle cx="14" cy="-152" r="18" fill="#eceff1" ${st(2)}/><circle cx="-6" cy="-180" r="22" fill="#eceff1" ${st(2)}/>`
      );
    },
  },
  {
    id: 'naf_vaterpas',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-ватерпаси',
    price: 16,
    draw: () =>
      // a yellow spirit level across his eyes: a round green window over each eye, a bubble in each
      `<rect x="-86" y="-20" width="172" height="40" rx="8" fill="#fdd835" ${stroke}/>` +
      `<path d="M-80 -12 h6 M-80 12 h6 M74 -12 h6 M74 12 h6" stroke="${INK}" stroke-width="2"/>` +
      [-34, 34].map((x) => `<circle cx="${x}" cy="0" r="22" fill="#c5e1a5" fill-opacity=".45" stroke="#7cb342" stroke-width="4"/><ellipse cx="${x + 8}" cy="-10" rx="8" ry="4" fill="#fff" opacity=".9"/><path d="M${x - 8} -22 v-6 M${x + 8} -22 v-6" stroke="${INK}" stroke-width="2"/>`).join(''),
  },
  {
    id: 'naf_ruletka',
    slot: 'mouth',
    name: 'Рулетка в зубах',
    price: 10,
    draw: () =>
      // a tape measure held in his teeth, its yellow tape pulled out to the side, little marks on it
      `<path d="M4 -2 L120 6 L120 20 L4 12 Z" fill="#ffeb3b" ${st(2.5)}/>` +
      Array.from({ length: 11 }, (_, i) => `<path d="M${14 + i * 10} ${-1 + i * 0.7} v${i % 2 ? 5 : 8}" stroke="${INK}" stroke-width="1.5"/>`).join('') +
      `<rect x="116" y="2" width="8" height="22" rx="2" fill="#78909c" ${st(2)}/>` +
      `<rect x="-36" y="-22" width="44" height="44" rx="12" fill="#ff9800" ${stroke}/>` +
      `<circle cx="-14" cy="0" r="10" fill="#e65100" ${st(2)}/><rect x="-40" y="-6" width="8" height="18" rx="3" fill="#455a64"/>`,
  },
  {
    id: 'naf_pylka',
    slot: 'neck',
    name: 'Пилка через плече',
    price: 14,
    draw: () =>
      // a carpenter's saw on his shoulder: the shiny blade with its teeth, the wooden handle in front
      `<g transform="translate(10 40) scale(.72) rotate(-50 0 60)">` +
      `<path d="M-10 40 L180 26 L180 64 L-10 80 Z" fill="#cfd8dc" ${st(3)}/>` +
      Array.from({ length: 18 }, (_, i) => `<path d="M${-6 + i * 10.5} ${80 - i * 0.84} l5 8 l5 -8" fill="#cfd8dc" stroke="${INK}" stroke-width="1.5"/>`).join('') +
      `<path d="M10 52 L160 40" stroke="#fff" stroke-width="3"/>` +
      `<path d="M-54 30 Q-60 60 -54 92 L-6 84 L-6 36 Z" fill="#a1704a" ${stroke}/><ellipse cx="-34" cy="62" rx="10" ry="16" fill="#f6eedf" ${st(2.5)}/>` +
      `</g>`,
  },
  {
    id: 'naf_fortetsia',
    slot: 'torso',
    name: 'Светр-фортеця',
    price: 20,
    draw: () => {
      // a stone-grey sweater knitted like a castle wall: battlements at the shoulders, stones, a little
      // gate with a portcullis on the tummy, a flag on a tower on one shoulder
      let stones = '';
      for (let r = 0; r < 5; r++) for (let x = -60 + (r % 2 ? 14 : 0); x + 24 <= 62; x += 28) stones += `<rect x="${x}" y="${-176 + r * 20}" width="24" height="16" rx="4" fill="none" stroke="#78909c" stroke-width="2"/>`;
      return (
        sleeves('#b0bec5') +
        `<path d="${LONG}" fill="#b0bec5" ${stroke}/>` +
        stones +
        `<path d="M-60 -188 v-14 h14 v10 h14 v-10 h14 v10 h12 v-10 h14 v10 h14 v-10 h14 v10 h14 v-10 h10 v14" fill="#b0bec5" ${st(3)}/>` +
        `<path d="M-20 -70 V-100 Q0 -120 20 -100 V-70 Z" fill="#5d4037" ${st(3)}/><path d="M-10 -72 V-110 M0 -72 V-114 M10 -72 V-110 M-20 -88 H20" stroke="#9e9e9e" stroke-width="2.5"/>` +
        `<rect x="40" y="-230" width="22" height="40" fill="#b0bec5" ${st(3)}/><path d="M51 -230 v-26" stroke="${INK}" stroke-width="3"/><path d="M51 -256 l20 6 l-20 6 z" fill="#e53935" ${st(1.5)}/>`
      );
    },
  },
  {
    id: 'naf_kreslennia',
    slot: 'torso',
    name: 'Сорочка-креслення',
    price: 16,
    draw: () => {
      // a blueprint-blue shirt: a white grid, and a house drawn on it in white lines with its sizes
      let grid = '';
      for (let x = -60; x <= 60; x += 15) grid += `<path d="M${x} -196 V-72" stroke="#5c8fd6" stroke-width="1.2"/>`;
      for (let y = -190; y < -72; y += 15) grid += `<path d="M-70 ${y} H70" stroke="#5c8fd6" stroke-width="1.2"/>`;
      return (
        sleeves('#1565c0') +
        `<path d="${LONG}" fill="#1565c0" ${stroke}/>` +
        grid +
        `<path d="M-30 -96 V-136 L0 -162 L30 -136 V-96 Z M-10 -96 V-118 H8 V-96 M14 -132 h12 v10 h-12 z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>` +
        `<path d="M-30 -86 H30 M-30 -90 v8 M30 -90 v8 M40 -96 V-136 M36 -96 h8 M36 -136 h8" stroke="#bbdefb" stroke-width="2"/>` +
        `<path d="${LONG}" fill="none" ${stroke}/>`
      );
    },
  },
  {
    id: 'naf_lisoruba',
    slot: 'torso',
    name: 'Сорочка лісоруба',
    price: 15,
    draw: () => {
      // a red-and-black checked shirt with rolled-up sleeves and a pocket, buttoned to the top
      let checks = '';
      for (let x = -56; x < 56; x += 24) checks += `<rect x="${x}" y="-190" width="12" height="122" fill="#212121" opacity=".5"/>`;
      for (let y = -182; y < -72; y += 24) checks += `<rect x="-62" y="${y}" width="124" height="12" fill="#212121" opacity=".5"/>`;
      return (
        sleeves('#c62828', 24, `<path d="M64 -140 l22 -8 l4 14 l-22 8 z" fill="#212121" ${st(2)}/>`) +
        `<path d="${LONG}" fill="#c62828" ${stroke}/>` +
        checks +
        `<path d="${LONG}" fill="none" ${stroke}/>` +
        `<path d="M-20 -196 L0 -180 L20 -196" fill="none" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M0 -180 V-72" stroke="${INK}" stroke-width="2.5"/>` +
        [-160, -130, -100].map((y) => `<circle cx="0" cy="${y}" r="3.5" fill="#fff" ${st(1)}/>`).join('') +
        `<rect x="14" y="-160" width="30" height="26" rx="3" fill="#c62828" ${st(2.5)}/>`
      );
    },
  },
  {
    id: 'naf_kolony',
    slot: 'legs',
    name: 'Штани-колони',
    price: 16,
    draw: () =>
      // white marble trousers, each leg a fluted column, a scrolled capital at the top and a base at the hoof
      `<path d="${TROUSERS}" fill="#fafafa" ${stroke}/>` +
      `<path d="M-40 -96 V-26 M-30 -96 V-26 M-20 -96 V-26 M20 -96 V-26 M30 -96 V-26 M40 -96 V-26" stroke="#cfd8dc" stroke-width="3"/>` +
      `<path d="M-50 -26 H-6 V-16 H-50 Z M6 -26 H50 V-16 H6 Z" fill="#eceff1" ${st(2.5)}/>` +
      `<circle cx="-44" cy="-62" r="5" fill="none" stroke="#b0bec5" stroke-width="2.5"/><circle cx="-12" cy="-62" r="5" fill="none" stroke="#b0bec5" stroke-width="2.5"/>` +
      `<circle cx="12" cy="-62" r="5" fill="none" stroke="#b0bec5" stroke-width="2.5"/><circle cx="44" cy="-62" r="5" fill="none" stroke="#b0bec5" stroke-width="2.5"/>`,
  },
  {
    id: 'naf_betonomishalky',
    slot: 'legs',
    name: 'Штани-бетономішалки',
    price: 17,
    draw: () =>
      // each leg the orange drum of a concrete mixer, striped round and round, a little wheel at the bottom
      `<path d="${TROUSERS}" fill="#ff9800" ${stroke}/>` +
      `<path d="M-50 -70 L-8 -82 M-50 -52 L-8 -64 M-48 -34 L-8 -46 M8 -82 L50 -70 M8 -64 L50 -52 M8 -46 L48 -34" stroke="#e65100" stroke-width="6"/>` +
      `<path d="M-46 -24 H-8 M8 -24 H46" stroke="#455a64" stroke-width="6"/>` +
      `<circle cx="-27" cy="-16" r="7" fill="#263238" ${st(2)}/><circle cx="27" cy="-16" r="7" fill="#263238" ${st(2)}/>`,
  },
  {
    id: 'naf_cherepytsia',
    slot: 'legs',
    name: 'Штани-черепиця',
    price: 14,
    draw: () => {
      // terracotta trousers laid with roof tiles: rows of rounded scallops, one under another
      let tiles = '';
      for (let r = 0; r < 6; r++) for (let x = -56 + (r % 2 ? 7 : 0); x < 56; x += 14) if (Math.abs(x) > 6) tiles += `<path d="M${x - 7} ${-90 + r * 12} q7 10 14 0" fill="none" stroke="#8e3a26" stroke-width="2.5"/>`;
      return `<path d="${TROUSERS}" fill="#d0603f" ${stroke}/>` + tiles;
    },
  },
  {
    id: 'naf_rubanky',
    slot: 'feet',
    name: 'Черевики-рубанки',
    price: 14,
    draw: () =>
      // each shoe a carpenter's wooden plane: a block, a round knob in front, the iron blade, a curl of shaving
      pair(
        `<rect x="4" y="-20" width="50" height="20" rx="4" fill="#c8955a" ${st(3)}/>` +
          `<path d="M24 -20 L30 -34 L36 -20" fill="#90a4ae" ${st(2)}/>` +
          `<circle cx="46" cy="-26" r="7" fill="#8d5524" ${st(2)}/>` +
          `<path d="M10 -20 q-10 -10 -2 -18 q8 -4 8 4" stroke="#f2cf66" stroke-width="3" fill="none"/>` +
          `<path d="M8 -10 h42" stroke="#a1704a" stroke-width="2"/>`,
      ),
  },
  {
    id: 'naf_penzli',
    slot: 'feet',
    name: 'Черевики-пензлі',
    price: 12,
    draw: () =>
      // each shoe a fat paintbrush: a wooden handle at the heel, the silver band, bristles dipped in paint
      pair(
        `<rect x="4" y="-16" width="20" height="12" rx="5" fill="#a1704a" ${st(2.5)}/>` +
          `<rect x="22" y="-22" width="10" height="22" fill="#b0bec5" ${st(2.5)}/>` +
          `<path d="M32 -22 Q52 -24 56 -10 Q52 4 32 0 Z" fill="#fff8e1" ${st(2.5)}/>` +
          `<path d="M42 -22 Q54 -20 56 -10 Q54 2 42 0 Z" fill="#42a5f5"/>` +
          `<circle cx="60" cy="2" r="3" fill="#42a5f5"/>`,
      ),
  },
  {
    id: 'naf_kelmy',
    slot: 'feet',
    name: 'Черевики-кельми',
    price: 13,
    draw: () =>
      // each shoe a builder's trowel lying flat: the shiny blade pointing forward, the wooden handle up behind
      pair(
        `<path d="M10 -18 L12 -40" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M10 -18 L12 -40" stroke="#a1704a" stroke-width="5" stroke-linecap="round"/>` +
          `<path d="M4 0 L8 -16 L44 -14 L60 0 Z" fill="#cfd8dc" ${st(3)}/>` +
          `<path d="M14 -6 H48" stroke="#fff" stroke-width="2.5"/>` +
          `<circle cx="34" cy="-6" r="3" fill="#bcaaa4"/>`,
      ),
  },
];

export const ITEMS: Item[] = [...NIF, ...NUF, ...NAF];

const ids = (list: Item[]) => list.map((i) => i.id).join(' ');
export const SETS: Record<string, string> = {
  nifnif: 'kovpak sontsezakhysni metelyk ' + ids(NIF),
  nufnuf: 'bant okuliary sharf ' + ids(NUF),
  nafnaf: 'kukhar monokl kravatka ' + ids(NAF),
};
