// The own things of the heroes of «Кіт у чоботях»: the Cat in Boots, the Marquis of Carabas, the
// king, the princess and the ogre. SETS here ADD to a hero's set.
//
// All of them face us (two eyes: they can wear glasses). The clothes are drawn in each puppet's own
// numbers (puppets-kit.ts: feet at 0,0):
// - the cat: legs at x ±8..32 down to -14, his body from the shoulders at -198 to the hips at -72
//   (widest ±57 at -150), the arms from ±36,-190 to the paws at -54,-122 and 66,-130; his own boots
//   (up to -100), hat and bag come off for shoes, a hat, a thing round the neck;
// - the marquis: legs at x ±6..40 from -122 to -14, the coat from the shoulders at -258 to -100, the
//   arms from ±60,-250 to the hands at ±88,-132;
// - the king: legs at x ±4..38 from -100 to -14, the robe from -252 to -84 (widest ±118 at -160), the
//   arms from ±78,-244 to the hands at ±107,-132, the sceptre at x 112;
// - the princess: the bodice from -248 to -172, the gown's skirt from -178 to -10 (±98 at the hem),
//   the arms from ±52,-224 to the hands at ±62,-156, her shoes at x ±22;
// - the ogre: legs at x ±24..62 from -110 to -16, the caftan from -390 to -90 (widest ±178 at -250),
//   the arms from ±110,-376 to the hands at ±162,-200.
// Accessories are drawn for u = 100 as everywhere (head: the origin on top of the head; face: between
// the eyes, the eyes at ±34; mouth; neck: under the chin).

import { INK, st, stroke } from '../characters';
import type { Item } from '../wardrobe';

/** a five-pointed star */
const star = (x: number, y: number, r: number, fill: string, w = 0) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}" ${w ? st(w) : ''}/>`;
};

/** a pair: one shoe drawn for the right foot, mirrored for the left */
const pair = (shoe: string) => `<g transform="scale(-1 1)">${shoe}</g>${shoe}`;

/** sleeves over two arms (given as the right one's path, mirrored) */
const sleeves = (d: string, fill: string, w: number, extra = '') => {
  const one = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>${extra}`;
  return `<g transform="scale(-1 1)">${one}</g>${one}`;
};

/** a heart */
const heart = (x: number, y: number, r: number, fill: string) =>
  `<path d="M${x} ${y + r} C${x - r * 1.6} ${y - r * 0.2} ${x - r * 0.8} ${y - r * 1.5} ${x} ${y - r * 0.5} C${x + r * 0.8} ${y - r * 1.5} ${x + r * 1.6} ${y - r * 0.2} ${x} ${y + r} Z" fill="${fill}" ${st(2)}/>`;

// ===================== the Cat in Boots =====================

/** the cat's arms (right one; the left is drawn mirrored — his left paw is a bit lower, near enough) */
const CAT_ARM = 'M36 -190 Q70 -168 62 -132';
/** a top over the cat's body, from the shoulders to the hips */
const CAT_TOP = 'M-48 -74 Q-60 -150 -38 -200 Q0 -216 38 -200 Q60 -150 48 -74 Q0 -60 -48 -74 Z';
/** trousers for the cat, from the hips (-100) down to h */
const catPants = (h: number) => `M-50 -104 Q0 -116 50 -104 L46 ${h} L6 ${h} L0 -66 L-6 ${h} L-46 ${h} Z`;

const CAT: Item[] = [
  {
    id: 'kit_chobotar_akvarium',
    slot: 'head',
    name: 'Акваріум на голові',
    price: 20,
    draw: () =>
      // a round glass bowl: water, a goldfish, a little castle and bubbles
      `<path d="M-74 -10 Q-96 -90 -50 -140 L50 -140 Q96 -90 74 -10 Q0 16 -74 -10 Z" fill="#b3e5fc" fill-opacity=".55" ${stroke}/>` +
      `<path d="M-84 -80 Q0 -66 84 -80 Q90 -40 74 -10 Q0 16 -74 -10 Q-90 -40 -84 -80 Z" fill="#4fc3f7" opacity=".7"/>` +
      `<path d="M-40 -14 v-34 h10 v8 h8 v-8 h10 v8 h8 v-8 h10 v34 Z" fill="#f8bbd0" ${st(2.5)}/>` +
      `<path d="M14 -60 q20 -18 40 0 q-20 18 -40 0 z" fill="#ff9800" ${st(2.5)}/><path d="M54 -60 l14 -10 v20 z" fill="#ff9800" ${st(2.5)}/><circle cx="24" cy="-62" r="3" fill="${INK}"/>` +
      `<circle cx="6" cy="-84" r="5" fill="#fff" ${st(1.5)}/><circle cx="-4" cy="-104" r="7" fill="#fff" ${st(1.5)}/><circle cx="8" cy="-124" r="4" fill="#fff" ${st(1.5)}/>` +
      `<ellipse cx="0" cy="-140" rx="50" ry="10" fill="#e1f5fe" ${st(4)}/>` +
      `<path d="M-60 -110 Q-66 -70 -56 -40" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".8"/>`,
  },
  {
    id: 'kit_chobotar_mysholovka',
    slot: 'head',
    name: 'Шапка-мишоловка',
    price: 15,
    draw: () =>
      // a wooden mousetrap worn as a hat: the spring bar up, a wedge of cheese as bait
      `<g transform="rotate(-6)">` +
      `<rect x="-76" y="-26" width="152" height="30" rx="5" fill="#d7a86e" ${stroke}/>` +
      `<path d="M-60 -16 h40 M-10 -10 h50 M44 -18 h22" stroke="#b07a45" stroke-width="3"/>` +
      `<path d="M-56 -26 Q-60 -92 0 -96 Q60 -92 56 -26" fill="none" stroke="${INK}" stroke-width="12"/><path d="M-56 -26 Q-60 -92 0 -96 Q60 -92 56 -26" fill="none" stroke="#b0bec5" stroke-width="6"/>` +
      `<circle cx="-56" cy="-26" r="10" fill="#90a4ae" ${st(3)}/><circle cx="56" cy="-26" r="10" fill="#90a4ae" ${st(3)}/>` +
      `<path d="M8 -26 L50 -26 L44 -62 Z" fill="#ffd54f" ${st(3)}/><circle cx="26" cy="-36" r="4" fill="#f9a825"/><circle cx="40" cy="-44" r="3" fill="#f9a825"/>` +
      `</g>`,
  },
  {
    id: 'kit_chobotar_kotiachi',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри «котячі очі»',
    price: 15,
    draw: () =>
      // pink cat-eye glasses, their corners swept up, little rhinestones
      [-1, 1]
        .map(
          (d) =>
            `<path d="M${d * 6} -6 Q${d * 10} 28 ${d * 38} 26 Q${d * 66} 22 ${d * 70} -8 Q${d * 80} -28 ${d * 92} -36 Q${d * 50} -30 ${d * 6} -6 Z" fill="#e1f5fe" fill-opacity=".35" stroke="#ec407a" stroke-width="9" stroke-linejoin="round"/>` +
            `<circle cx="${d * 80}" cy="-26" r="5" fill="#fff" ${st(2)}/><circle cx="${d * 64}" cy="-20" r="3.5" fill="#fff" ${st(1.5)}/>`,
        )
        .join('') + `<path d="M-8 -6 Q0 -14 8 -6" stroke="#ec407a" stroke-width="7" fill="none"/>`,
  },
  {
    id: 'kit_chobotar_kanapka',
    slot: 'mouth',
    name: 'Канапка на шпажці',
    price: 10,
    draw: () =>
      // a canapé on a toothpick held in the teeth: bread, cheese, a slice of sausage, an olive on top
      `<g transform="rotate(-20) translate(30 0)">` +
      `<path d="M-30 0 H40" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-30 0 H40" stroke="#ffe0b2" stroke-width="4" stroke-linecap="round"/>` +
      `<rect x="6" y="-16" width="16" height="34" rx="3" fill="#d7a86e" ${st(2.5)}/>` +
      `<rect x="18" y="-14" width="12" height="30" fill="#ffd54f" ${st(2.5)}/>` +
      `<ellipse cx="34" cy="0" rx="6" ry="16" fill="#e57373" ${st(2.5)}/>` +
      `<ellipse cx="46" cy="0" rx="9" ry="11" fill="#689f38" ${st(2.5)}/><circle cx="46" cy="0" r="3" fill="#e53935"/>` +
      `</g>`,
  },
  {
    id: 'kit_chobotar_shpaha',
    slot: 'neck',
    name: 'Шпага на перев’язі',
    price: 18,
    draw: () =>
      // a red sash over the shoulder, a rapier hanging at the hip with a gold guard
      `<path d="M-60 -16 L60 150" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M-60 -16 L60 150" stroke="#c62828" stroke-width="22" stroke-linecap="round"/>` +
      `<path d="M-50 -2 L52 140" stroke="#ffd54f" stroke-width="4" stroke-dasharray="10 8"/>` +
      `<path d="M66 156 L20 290" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M66 156 L20 290" stroke="#e0e0e0" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M52 150 Q66 128 88 148 Q76 170 52 150 Z" fill="#ffd54f" ${st(3)}/>` +
      `<path d="M72 146 L84 116" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><circle cx="86" cy="112" r="7" fill="#ffd54f" ${st(2.5)}/>`,
  },
  // ---- clothes, in his own numbers
  {
    id: 'kit_chobotar_mushketer',
    slot: 'torso',
    name: 'Плащ мушкетера',
    price: 22,
    draw: () =>
      // a blue tabard with a white cross and gold edges, blue sleeves with white cuffs
      sleeves(CAT_ARM, '#1565c0', 17, `<path d="M52 -142 L72 -138" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`) +
      `<path d="${CAT_TOP}" fill="#1565c0" ${stroke}/>` +
      `<path d="M-6 -186 h12 v36 h26 v12 h-26 v52 h-12 v-52 h-26 v-12 h26 Z" fill="#fff" ${st(2.5)}/>` +
      `<path d="M-46 -80 Q0 -66 46 -80" fill="none" stroke="#ffd54f" stroke-width="7"/>` +
      `<path d="M-38 -198 Q0 -184 38 -198" fill="none" stroke="#ffd54f" stroke-width="7"/>` +
      [-36, -12, 12, 36].map((x) => `<path d="M${x - 8} -76 l8 14 l8 -14" fill="#ffd54f" ${st(2)}/>`).join(''),
  },
  {
    id: 'kit_chobotar_sitka',
    slot: 'torso',
    name: 'Жилет-рибальська сітка',
    price: 18,
    draw: () => {
      // a fishing net for a vest: knotted mesh, red-and-white floats, a fish caught in it
      let mesh = '';
      for (let x = -60; x <= 60; x += 16) mesh += `<path d="M${x} -206 L${x + 40} -70" stroke="#795548" stroke-width="3"/><path d="M${x} -206 L${x - 40} -70" stroke="#795548" stroke-width="3"/>`;
      return (
        `<clipPath id="kit-sitka"><path d="${CAT_TOP}"/></clipPath>` +
        `<path d="${CAT_TOP}" fill="#c8e6c9" fill-opacity=".35"/>` +
        `<g clip-path="url(#kit-sitka)">${mesh}</g>` +
        `<path d="${CAT_TOP}" fill="none" ${stroke}/>` +
        [[-36, -190], [0, -204], [36, -190]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="8" fill="#e53935" ${st(2.5)}/><path d="M${x - 10} ${y} h20" stroke="#fff" stroke-width="4"/>`).join('') +
        `<g transform="translate(6 -128) rotate(-14)"><path d="M-26 0 Q-4 -18 18 0 Q-4 18 -26 0 Z" fill="#90caf9" ${st(3)}/><path d="M16 0 l14 -12 v24 z" fill="#64b5f6" ${st(3)}/><circle cx="-16" cy="-3" r="3" fill="${INK}"/></g>`
      );
    },
  },
  {
    id: 'kit_chobotar_lystonosha',
    slot: 'torso',
    name: 'Куртка листоноші',
    price: 20,
    draw: () =>
      // a navy postman's jacket with a yellow badge, a pocket full of letters
      sleeves(CAT_ARM, '#283593', 17, `<path d="M52 -142 L72 -138" stroke="#ffd54f" stroke-width="7" stroke-linecap="round"/>`) +
      `<path d="${CAT_TOP}" fill="#283593" ${stroke}/>` +
      `<path d="M0 -206 V-66" stroke="#1a237e" stroke-width="5"/>` +
      [-180, -150, -120, -90].map((y) => `<circle cx="-8" cy="${y}" r="4.5" fill="#ffd54f" ${st(2)}/>`).join('') +
      `<rect x="10" y="-176" width="34" height="16" rx="3" fill="#ffd54f" ${st(2.5)}/><text x="27" y="-163.5" font-size="11" font-weight="900" text-anchor="middle" fill="#283593">ПОШТА</text>` +
      `<rect x="-42" y="-130" width="12" height="30" fill="#fff" ${st(2)} transform="rotate(-12 -36 -115)"/><rect x="-36" y="-132" width="12" height="30" fill="#ffccbc" ${st(2)} transform="rotate(8 -30 -117)"/>` +
      `<rect x="-46" y="-116" width="36" height="34" rx="4" fill="#1a237e" ${st(3)}/>` +
      `<path d="M-24 -190 Q0 -170 24 -190" fill="none" stroke="#ffd54f" stroke-width="4"/>`,
  },
  {
    id: 'kit_chobotar_lapky',
    slot: 'legs',
    name: 'Штани-лапки',
    price: 15,
    draw: () =>
      // pink trousers printed all over with little paw prints
      `<path d="${catPants(-20)}" fill="#f48fb1" ${stroke}/>` +
      [[-30, -88], [24, -92], [-26, -50], [28, -46], [-34, -30], [34, -70]]
        .map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse rx="6" ry="5" fill="#ad1457"/><circle cx="-6" cy="-7" r="2.5" fill="#ad1457"/><circle cx="0" cy="-9" r="2.5" fill="#ad1457"/><circle cx="6" cy="-7" r="2.5" fill="#ad1457"/></g>`)
        .join(''),
  },
  {
    id: 'kit_chobotar_bryzhi',
    slot: 'legs',
    name: 'Бриджі мушкетера з бантами',
    price: 16,
    draw: () =>
      // puffy velvet knee breeches, a ribbon bow at each knee
      `<path d="M-54 -104 Q0 -116 54 -104 Q70 -60 44 -34 L6 -34 L0 -60 L-6 -34 L-44 -34 Q-70 -60 -54 -104 Z" fill="#6a1b9a" ${stroke}/>` +
      `<path d="M-32 -70 Q-38 -52 -28 -38 M32 -70 Q38 -52 28 -38" stroke="#8e24aa" stroke-width="6" fill="none"/>` +
      [-25, 25]
        .map((x) => `<path d="M${x} -34 l-16 -10 l0 20 z M${x} -34 l16 -10 l0 20 z" fill="#fdd835" ${st(2.5)}/><circle cx="${x}" cy="-34" r="5" fill="#f9a825" ${st(2)}/>`)
        .join(''),
  },
  {
    id: 'kit_chobotar_sardynky',
    slot: 'legs',
    name: 'Шорти-сардинки',
    price: 14,
    draw: () =>
      // silver shorts printed with open tins of sardines
      `<path d="M-52 -104 Q0 -116 52 -104 L52 -32 L6 -32 L0 -58 L-6 -32 L-52 -32 Z" fill="#cfd8dc" ${stroke}/>` +
      [[-27, -48], [27, -48]]
        .map(
          ([x, y]) =>
            `<rect x="${x - 16}" y="${y - 12}" width="32" height="24" rx="6" fill="#90a4ae" ${st(2.5)}/>` +
            `<path d="M${x - 12} ${y - 4} q6 -6 12 0 q-6 6 -12 0 z M${x} ${y + 4} q6 -6 12 0 q-6 6 -12 0 z" fill="#e0e0e0" ${st(1.5)}/>`,
        )
        .join(''),
  },
  {
    id: 'kit_chobotar_klubochky',
    slot: 'feet',
    name: 'Черевики-клубочки',
    price: 14,
    draw: () =>
      // each shoe a ball of red wool, a loose thread curling off, two knitting needles stuck in
      pair(
        `<path d="M40 -30 L52 -64 M30 -34 L48 -60" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/>` +
          `<circle cx="28" cy="-22" r="24" fill="#e53935" ${st(3.5)}/>` +
          `<path d="M10 -34 Q28 -16 46 -34 M8 -18 Q28 0 48 -18 M14 -40 Q30 -6 40 -2" stroke="#b71c1c" stroke-width="3" fill="none"/>` +
          `<path d="M50 -10 q14 4 10 -8 q-4 -10 6 -12" stroke="#e53935" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'kit_chobotar_moloko',
    slot: 'feet',
    name: 'Черевики-пакети з молоком',
    price: 15,
    draw: () =>
      // little milk cartons: white and blue, a cow's spots, a gabled top
      pair(
        `<path d="M6 0 V-46 L22 -62 L50 -62 L52 0 Z" fill="#fafafa" ${st(3)}/>` +
          `<path d="M6 -46 H52" stroke="${INK}" stroke-width="3"/><path d="M6 -24 H52 V0 H6 Z" fill="#42a5f5" ${st(2.5)}/>` +
          `<ellipse cx="20" cy="-36" rx="6" ry="4" fill="#212121"/><ellipse cx="40" cy="-38" rx="5" ry="3.5" fill="#212121"/>` +
          `<path d="M29 -20 q-7 9 -7 12 a7 7 0 0 0 14 0 q0 -3 -7 -12 z" fill="#fff" ${st(1.5)}/>`,
      ),
  },
  {
    id: 'kit_chobotar_podushky',
    slot: 'feet',
    name: 'Черевики-подушки',
    price: 13,
    draw: () =>
      // two soft little pillows with tassels at the corners — for a cat who likes to nap on the go
      pair(
        `<path d="M4 -34 Q30 -42 56 -34 Q62 -16 56 0 Q30 6 4 0 Q-2 -16 4 -34 Z" fill="#b39ddb" ${st(3)}/>` +
          `<path d="M14 -18 q16 6 32 0" stroke="#7e57c2" stroke-width="3" fill="none"/>` +
          `<circle cx="4" cy="-34" r="5" fill="#ffd54f" ${st(2)}/><circle cx="56" cy="-34" r="5" fill="#ffd54f" ${st(2)}/><circle cx="56" cy="0" r="5" fill="#ffd54f" ${st(2)}/>` +
          `<path d="M24 -22 l4 -6 l4 6 l-4 6 z" fill="#ffd54f"/>`,
      ),
  },
];

// ===================== the Marquis of Carabas =====================

const MARKIZ_ARM = 'M60 -250 Q96 -200 88 -142';
const MARKIZ_TOP = 'M-62 -258 Q-82 -180 -74 -100 L74 -100 Q82 -180 62 -258 Q0 -276 -62 -258 Z';
const markizPants = (fill: string) => `<path d="M-74 -128 Q0 -138 74 -128 L46 -14 L6 -14 L0 -96 L-6 -14 L-46 -14 Z" fill="${fill}" ${stroke}/>`;

const MARKIZ: Item[] = [
  {
    id: 'markiz_kartonna',
    slot: 'head',
    name: 'Картонна корона',
    price: 10,
    draw: () =>
      // a crooked crown cut out of a cardboard box, coloured with crayons, «Я МАРКІЗ» on it
      `<g transform="rotate(-8)">` +
      `<path d="M-66 6 L-70 -60 L-40 -30 L-14 -78 L10 -32 L40 -70 L70 -24 L64 6 Z" fill="#d7a86e" ${stroke}/>` +
      `<path d="M-58 -40 l8 -6 M-20 -54 l6 -8 M30 -46 l8 -6" stroke="#e53935" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="-14" cy="-60" r="6" fill="#43a047"/><circle cx="40" cy="-52" r="6" fill="#1e88e5"/>` +
      `<text x="0" y="-6" font-size="18" font-weight="900" text-anchor="middle" fill="#6d4c41">Я МАРКІЗ</text>` +
      `</g>`,
  },
  {
    id: 'markiz_kolesa',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-колеса',
    price: 15,
    draw: () =>
      // two carriage wheels for lenses: red rims, gold hubs, spokes
      [-38, 38]
        .map((x) => {
          let spokes = '';
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            spokes += `<path d="M${x} 0 l${(Math.cos(a) * 26).toFixed(1)} ${(Math.sin(a) * 26).toFixed(1)}" stroke="#c99a1e" stroke-width="3"/>`;
          }
          return `<circle cx="${x}" cy="0" r="30" fill="#e3f2fd" fill-opacity=".3" stroke="${INK}" stroke-width="12"/><circle cx="${x}" cy="0" r="30" fill="none" stroke="#c62828" stroke-width="6"/>${spokes}<circle cx="${x}" cy="0" r="6" fill="#ffd54f" ${st(2)}/>`;
        })
        .join('') + `<path d="M-8 -4 Q0 -12 8 -4" stroke="${INK}" stroke-width="7" fill="none"/>`,
  },
  {
    id: 'markiz_kolosok',
    slot: 'mouth',
    name: 'Колосок у зубах',
    price: 6,
    draw: () =>
      // an ear of wheat held in the corner of the mouth, like a true miller's son
      `<g transform="rotate(-24) translate(10 0)">` +
      `<path d="M-6 0 H90" stroke="#c9a227" stroke-width="5" stroke-linecap="round"/>` +
      Array.from({ length: 6 }, (_, i) => `<ellipse cx="${70 + i * 9}" cy="-6" rx="7" ry="4" fill="#e8bd45" ${st(1.5)} transform="rotate(-30 ${70 + i * 9} -6)"/><ellipse cx="${70 + i * 9}" cy="6" rx="7" ry="4" fill="#e8bd45" ${st(1.5)} transform="rotate(30 ${70 + i * 9} 6)"/>`).join('') +
      `<path d="M122 0 l18 -4 M122 0 l18 4" stroke="#c9a227" stroke-width="2"/>` +
      `</g>`,
  },
  {
    id: 'markiz_vorona',
    slot: 'neck',
    name: 'Ворона на плечі',
    price: 15,
    draw: () =>
      // a black crow sitting on his shoulder, head cocked, a shiny button in her beak
      `<g transform="translate(112 34)">` +
      `<path d="M10 -10 L52 30 L40 36 Z" fill="#37474f" ${st(3)}/>` +
      `<ellipse cx="0" cy="-20" rx="30" ry="22" fill="#37474f" ${stroke}/>` +
      `<circle cx="-20" cy="-48" r="17" fill="#37474f" ${st(4)}/>` +
      `<circle cx="-24" cy="-52" r="5" fill="#fff"/><circle cx="-25" cy="-52" r="2.5" fill="${INK}"/>` +
      `<path d="M-34 -48 L-56 -42 L-34 -38 Z" fill="#455a64" ${st(2.5)}/>` +
      `<circle cx="-58" cy="-40" r="6" fill="#ffd54f" ${st(2)}/>` +
      `<path d="M-6 0 v12 M6 0 v12" stroke="#ffb300" stroke-width="4"/>` +
      `<path d="M4 -26 q14 -4 24 6" stroke="#546e7a" stroke-width="3" fill="none"/></g>`,
  },
  {
    id: 'markiz_vitriak',
    slot: 'torso',
    name: 'Костюм вітряка',
    price: 22,
    draw: () =>
      // a windmill costume: a wooden tower of planks with a little door, four white sails on the chest
      sleeves(MARKIZ_ARM, '#c98a4b', 22) +
      `<path d="M-60 -262 L-80 -100 L80 -100 L60 -262 Q0 -276 -60 -262 Z" fill="#c98a4b" ${stroke}/>` +
      [-232, -204, -176, -148, -124].map((y) => `<path d="M-70 ${y} H70" stroke="#8b5a2b" stroke-width="3"/>`).join('') +
      `<path d="M-16 -100 v-40 q16 -16 32 0 v40 Z" fill="#5d3b22" ${st(3)}/>` +
      [30, 120, 210, 300]
        .map((a) => `<g transform="rotate(${a} 0 -196)"><path d="M0 -196 V-262" stroke="#5a3a22" stroke-width="5"/><rect x="2" y="-262" width="20" height="60" fill="#fbf7ee" ${st(2.5)}/></g>`)
        .join('') +
      `<circle cx="0" cy="-196" r="9" fill="#5d3b22" ${st(2)}/>`,
  },
  {
    id: 'markiz_svetr',
    slot: 'torso',
    name: 'Светр «МАРКІЗ»',
    price: 16,
    draw: () =>
      // a cosy red jumper with «МАРКІЗ» knitted on it, and the cat's paw print for a signature
      sleeves(MARKIZ_ARM, '#e53935', 22, `<path d="M78 -150 L98 -150" stroke="#fafafa" stroke-width="10" stroke-linecap="round"/>`) +
      `<path d="${MARKIZ_TOP}" fill="#e53935" ${stroke}/>` +
      `<path d="M-74 -112 H74" stroke="#fafafa" stroke-width="12"/>` +
      `<path d="M-30 -262 Q0 -240 30 -262" fill="none" stroke="#fafafa" stroke-width="10"/>` +
      `<text x="0" y="-188" font-size="26" font-weight="900" text-anchor="middle" fill="#fff">МАРКІЗ</text>` +
      `<g transform="translate(28 -150)"><ellipse rx="10" ry="8" fill="#ffd54f"/><circle cx="-10" cy="-11" r="4" fill="#ffd54f"/><circle cx="0" cy="-14" r="4" fill="#ffd54f"/><circle cx="10" cy="-11" r="4" fill="#ffd54f"/></g>` +
      [-160, -136].map((y) => `<path d="M-60 ${y} l8 -8 l8 8 l8 -8 l8 8" stroke="#fff" stroke-width="3" fill="none"/>`).join(''),
  },
  {
    id: 'markiz_pryanyk',
    slot: 'torso',
    name: 'Каптан з пряників',
    price: 20,
    draw: () =>
      // a caftan of gingerbread: brown, white icing curls, candy buttons
      sleeves(MARKIZ_ARM, '#b5651d', 22, `<path d="M70 -196 q8 6 16 0 M76 -170 q8 6 16 0" stroke="#fff" stroke-width="4" fill="none"/>`) +
      `<path d="M-62 -258 Q-86 -170 -80 -96 L80 -96 Q86 -170 62 -258 Q0 -276 -62 -258 Z" fill="#b5651d" ${stroke}/>` +
      `<path d="M-74 -110 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0 q10 -10 20 0" stroke="#fff" stroke-width="5" fill="none"/>` +
      `<path d="M-40 -250 q-10 30 0 60 M40 -250 q10 30 0 60" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      [[-12, -230, '#e53935'], [-12, -196, '#43a047'], [-12, -162, '#1e88e5'], [12, -230, '#fdd835'], [12, -196, '#e53935'], [12, -162, '#43a047']]
        .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" ${st(2.5)}/>`)
        .join('') +
      heart(-46, -146, 12, '#f48fb1') + heart(46, -146, 12, '#f48fb1'),
  },
  {
    id: 'markiz_mishky',
    slot: 'legs',
    name: 'Штани з мішків з-під борошна',
    price: 14,
    draw: () =>
      // trousers sewn from flour sacks: «БОРОШНО» stamped on, a dusting of flour, rope for a belt
      markizPants('#f5ecd7') +
      `<text x="-26" y="-70" font-size="13" font-weight="900" text-anchor="middle" fill="#8d6e63" transform="rotate(-80 -26 -70)">БОРОШНО</text>` +
      `<text x="26" y="-70" font-size="13" font-weight="900" text-anchor="middle" fill="#8d6e63" transform="rotate(80 26 -70)">БОРОШНО</text>` +
      `<path d="M-74 -128 Q0 -138 74 -128" stroke="#a1887f" stroke-width="8" fill="none"/>` +
      [[-40, -40], [30, -30], [-14, -110], [44, -96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".9"/>`).join(''),
  },
  {
    id: 'markiz_karta',
    slot: 'legs',
    name: 'Штани-карта скарбів',
    price: 18,
    draw: () =>
      // old-paper trousers: a dotted path, a palm, a ship, the red X where the treasure is
      markizPants('#f3e2b3') +
      `<path d="M-48 -110 q20 20 0 40 q-16 20 6 44" stroke="#8d6e63" stroke-width="4" stroke-dasharray="7 6" fill="none"/>` +
      `<path d="M14 -100 q20 10 18 34 q-4 20 10 44" stroke="#8d6e63" stroke-width="4" stroke-dasharray="7 6" fill="none"/>` +
      `<path d="M36 -30 l12 12 M48 -30 l-12 12" stroke="#e53935" stroke-width="5" stroke-linecap="round"/>` +
      `<path d="M-30 -120 v-10 M-30 -130 q-10 -4 -14 4 M-30 -130 q10 -4 14 4" stroke="#2e7d32" stroke-width="4" fill="none"/>` +
      `<path d="M-46 -40 h20 l-4 8 h-12 z M-36 -40 v-14 l8 8 z" fill="#6d4c41" ${st(2)}/>`,
  },
  {
    id: 'markiz_gudzyky',
    slot: 'legs',
    name: 'Штани в ґудзики',
    price: 15,
    draw: () =>
      // navy trousers sewn all over with buttons of every colour
      markizPants('#3949ab') +
      [[-50, -118, '#e53935'], [-30, -96, '#fdd835'], [-44, -70, '#43a047'], [-26, -44, '#ff7043'], [-38, -24, '#ab47bc'], [22, -118, '#4fc3f7'], [44, -98, '#fdd835'], [28, -72, '#e53935'], [42, -46, '#43a047'], [26, -26, '#fff']]
        .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" ${st(2)}/><circle cx="${Number(x) - 2}" cy="${y}" r="1.4" fill="${INK}"/><circle cx="${Number(x) + 2}" cy="${y}" r="1.4" fill="${INK}"/>`)
        .join(''),
  },
  {
    id: 'markiz_zhorna',
    slot: 'feet',
    name: 'Черевики-жорна',
    price: 14,
    draw: () =>
      // two round millstones for shoes, grooved, a little sack of flour tied on each
      pair(
        `<ellipse cx="28" cy="-16" rx="30" ry="16" fill="#9e9e9e" ${st(3.5)}/>` +
          `<path d="M4 -16 h48 M10 -24 l36 16 M10 -8 l36 -16" stroke="#757575" stroke-width="2.5"/>` +
          `<circle cx="28" cy="-16" r="5" fill="#616161" ${st(2)}/>` +
          `<path d="M34 -30 q-4 -14 6 -18 l10 0 q8 6 4 18 z" fill="#fff8e1" ${st(2.5)}/>`,
      ),
  },
  {
    id: 'markiz_vinyky',
    slot: 'feet',
    name: 'Черевики-віники',
    price: 12,
    draw: () =>
      // little brooms for shoes: straw bristles in front, a red binding, the stick sticking up
      pair(
        `<path d="M12 -2 L12 -70" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M12 -2 L12 -70" stroke="#a1704a" stroke-width="5" stroke-linecap="round"/>` +
          `<path d="M8 -26 Q36 -32 60 -4 L60 2 L8 2 Z" fill="#e2b45a" ${st(3)}/>` +
          Array.from({ length: 6 }, (_, i) => `<path d="M${18 + i * 7} -20 L${22 + i * 7} 0" stroke="#b8862e" stroke-width="2"/>`).join('') +
          `<rect x="6" y="-30" width="16" height="10" fill="#e53935" ${st(2)}/>`,
      ),
  },
  {
    id: 'markiz_koshyky',
    slot: 'feet',
    name: 'Черевики-кошики з яблуками',
    price: 15,
    draw: () =>
      // wicker baskets for shoes, each with red apples on top
      pair(
        `<path d="M4 -30 L10 0 L52 0 L58 -30 Z" fill="#c8a06e" ${st(3)}/>` +
          `<path d="M6 -20 H56 M8 -10 H54" stroke="#8b5a2b" stroke-width="2.5"/>` +
          `<circle cx="20" cy="-36" r="10" fill="#e53935" ${st(2.5)}/><circle cx="40" cy="-36" r="10" fill="#e53935" ${st(2.5)}/><circle cx="30" cy="-46" r="9" fill="#c62828" ${st(2.5)}/>` +
          `<path d="M30 -54 l2 -8 M30 -58 q6 -4 10 0" stroke="#5d4037" stroke-width="2" fill="#7cb342"/>`,
      ),
  },
];

// ===================== the king =====================

const KOROL_ARM = 'M78 -244 Q116 -200 106 -142';
const KOROL_TOP = 'M-80 -252 Q-118 -160 -90 -84 L90 -84 Q118 -160 80 -252 Q0 -276 -80 -252 Z';
const korolPants = (h: number, fill: string) => `<path d="M-90 -110 Q0 -124 90 -110 L46 ${h} L6 ${h} L0 -70 L-6 ${h} L-46 ${h} Z" fill="${fill}" ${stroke}/>`;

const KOROL: Item[] = [
  {
    id: 'korol_banany',
    slot: 'head',
    name: 'Корона з бананів',
    price: 15,
    draw: () =>
      // a crown made of bananas standing in a ring, a gold band holding them, a cherry on top
      [-58, -30, 0, 30, 58]
        .map((x, i) => `<path d="M${x - 12} 0 Q${x - 18} ${-60 - (i % 2) * 14} ${x + 6} ${-86 - (i === 2 ? 14 : 0)} Q${x + 2} ${-50} ${x + 12} 0 Z" fill="#ffeb3b" ${st(3.5)} transform="rotate(${(x / 58) * 14} ${x} 0)"/>`)
        .join('') +
      `<rect x="-74" y="-16" width="148" height="22" rx="8" fill="#ffc107" ${stroke}/>` +
      `<circle cx="4" cy="-104" r="11" fill="#e53935" ${st(3)}/><path d="M4 -114 q4 -12 14 -14" stroke="#5d4037" stroke-width="3" fill="none"/>`,
  },
  {
    id: 'korol_fontan',
    slot: 'head',
    name: 'Капелюх-фонтан',
    price: 20,
    draw: () =>
      // a stone fountain worn as a hat: a bowl, a column, water arching out on all sides
      `<path d="M-70 0 Q-74 -30 -40 -36 L40 -36 Q74 -30 70 0 Z" fill="#cfd8dc" ${stroke}/>` +
      `<ellipse cx="0" cy="-36" rx="44" ry="9" fill="#4fc3f7" ${st(3)}/>` +
      `<rect x="-8" y="-90" width="16" height="54" fill="#b0bec5" ${st(3)}/>` +
      `<ellipse cx="0" cy="-92" rx="24" ry="7" fill="#b0bec5" ${st(3)}/>` +
      `<path d="M0 -96 Q-10 -150 -60 -110 M0 -96 Q10 -150 60 -110 M0 -96 Q0 -160 0 -140 M0 -96 Q-30 -170 -84 -60 M0 -96 Q30 -170 84 -60" stroke="#4fc3f7" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      [[-62, -104], [62, -104], [-84, -54], [84, -54], [0, -146]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#b3e5fc" ${st(1.5)}/>`).join(''),
  },
  {
    id: 'korol_monetky',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри-монетки',
    price: 15,
    draw: () =>
      // two gold coins with a hole cut out to look through, a crown stamped above
      [-36, 36]
        .map((x) => `<circle cx="${x}" cy="0" r="32" fill="#ffd54f" ${stroke}/><circle cx="${x}" cy="0" r="24" fill="none" stroke="#f9a825" stroke-width="3"/><circle cx="${x}" cy="4" r="15" fill="#fffde7" ${st(3)}/>` +
          `<path d="M${x - 10} -14 l2 -8 l4 4 l4 -6 l4 6 l4 -4 l2 8 z" fill="#f9a825"/>`)
        .join('') + `<path d="M-6 -4 Q0 -12 6 -4" stroke="#c99a1e" stroke-width="6" fill="none"/>`,
  },
  {
    id: 'korol_buterbrod',
    slot: 'mouth',
    name: 'Величезний бутерброд',
    price: 12,
    draw: () =>
      // a huge sandwich held in his mouth: bread, lettuce, cheese, sausage, a tomato
      `<g transform="rotate(-6)">` +
      `<path d="M-90 10 Q-92 30 -70 34 L70 34 Q92 30 90 10 Z" fill="#d7a86e" ${st(4)}/>` +
      `<path d="M-90 6 q15 12 30 0 q15 12 30 0 q15 12 30 0 q15 12 30 0 q15 12 30 0 q15 12 30 0" fill="#7cb342" ${st(3)}/>` +
      `<rect x="-84" y="-8" width="168" height="12" fill="#ffd54f" ${st(2.5)}/>` +
      `<ellipse cx="-40" cy="-14" rx="26" ry="9" fill="#e57373" ${st(2.5)}/><ellipse cx="34" cy="-14" rx="26" ry="9" fill="#e57373" ${st(2.5)}/>` +
      `<path d="M-92 -18 Q-90 -48 -60 -50 L60 -50 Q90 -48 92 -18 Z" fill="#e2b45a" ${st(4)}/>` +
      `<path d="M-50 -38 l6 -3 M-10 -42 l6 -3 M30 -38 l6 -3" stroke="#fff8e1" stroke-width="3" stroke-linecap="round"/>` +
      `</g>`,
  },
  {
    id: 'korol_pechatka',
    slot: 'neck',
    name: 'Королівська печатка',
    price: 15,
    draw: () =>
      // a big red wax seal with a «К» and a crown, hanging on a gold chain
      `<path d="M-46 -10 Q-30 60 0 80 Q30 60 46 -10" fill="none" stroke="#ffc107" stroke-width="7" stroke-dasharray="8 4"/>` +
      `<path d="M0 84 m-36 0 q-8 -16 6 -26 q4 -16 20 -12 q14 -10 26 2 q16 0 14 18 q12 14 -2 26 q0 18 -18 16 q-12 12 -26 0 q-18 2 -18 -16 q-12 -8 -2 -8 z" fill="#c62828" ${stroke}/>` +
      `<circle cx="0" cy="90" r="22" fill="#b71c1c" ${st(3)}/>` +
      `<text x="0" y="100" font-size="26" font-weight="900" text-anchor="middle" fill="#ffcdd2">К</text>` +
      `<path d="M-12 74 l3 -8 l5 5 l4 -8 l4 8 l5 -5 l3 8 z" fill="#ffd54f"/>`,
  },
  {
    id: 'korol_cherepakha',
    slot: 'torso',
    name: 'Костюм черепахи',
    price: 22,
    draw: () =>
      // a turtle costume: a green shell of hexagons over the belly, a pale front edge, green sleeves
      sleeves(KOROL_ARM, '#7cb342', 28) +
      `<path d="${KOROL_TOP}" fill="#8bc34a" ${stroke}/>` +
      `<ellipse cx="0" cy="-168" rx="96" ry="78" fill="#558b2f" ${stroke}/>` +
      [[0, -168], [-50, -196], [50, -196], [-50, -138], [50, -138], [0, -224], [0, -112]]
        .map(([x, y]) => `<path d="M${x - 22} ${y} l11 -19 h22 l11 19 l-11 19 h-22 z" fill="#7cb342" stroke="#33691e" stroke-width="3"/>`)
        .join('') +
      `<path d="M-96 -168 Q0 -60 96 -168" fill="none" stroke="#dcedc8" stroke-width="7"/>`,
  },
  {
    id: 'korol_toha',
    slot: 'torso',
    name: 'Римська тога',
    price: 20,
    draw: () =>
      // a white toga thrown over one shoulder, a purple band, a laurel pattern along the hem
      sleeves(KOROL_ARM, '#fafafa', 28) +
      `<path d="${KOROL_TOP}" fill="#fafafa" ${stroke}/>` +
      `<path d="M-80 -250 Q20 -200 90 -90 L60 -86 Q0 -180 -70 -224 Z" fill="#7b1fa2" ${st(3)}/>` +
      `<path d="M-90 -100 Q0 -88 90 -100" fill="none" stroke="#ffc107" stroke-width="6"/>` +
      Array.from({ length: 8 }, (_, i) => `<ellipse cx="${-76 + i * 22}" cy="${-110 + Math.abs(i - 3.5) * 1}" rx="7" ry="4" fill="#43a047" transform="rotate(${i % 2 ? 30 : -30} ${-76 + i * 22} -110)"/>`).join('') +
      `<path d="M-50 -160 q10 30 0 60 M40 -230 q-10 40 6 70" stroke="#e0e0e0" stroke-width="4" fill="none"/>`,
  },
  {
    id: 'korol_sontse',
    slot: 'torso',
    name: 'Костюм Короля-Сонце',
    price: 22,
    draw: () => {
      // a golden-orange suit with sun rays all round and a smiling sun on the belly
      let rays = '';
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        rays += `<path d="M${(Math.cos(a) * 46).toFixed(0)} ${(-168 + Math.sin(a) * 46).toFixed(0)} L${(Math.cos(a) * 66).toFixed(0)} ${(-168 + Math.sin(a) * 66).toFixed(0)}" stroke="#ffeb3b" stroke-width="9" stroke-linecap="round"/>`;
      }
      return (
        sleeves(KOROL_ARM, '#ff9800', 28, `<path d="M96 -150 L118 -150" stroke="#ffeb3b" stroke-width="10" stroke-linecap="round"/>`) +
        `<path d="${KOROL_TOP}" fill="#ff9800" ${stroke}/>` +
        rays +
        `<circle cx="0" cy="-168" r="40" fill="#ffeb3b" ${st(4)}/>` +
        `<circle cx="-13" cy="-176" r="5" fill="${INK}"/><circle cx="13" cy="-176" r="5" fill="${INK}"/><path d="M-16 -160 q16 14 32 0" fill="none" ${st(4)}/>`
      );
    },
  },
  {
    id: 'korol_konyachka',
    slot: 'legs',
    name: 'Штани-конячка',
    price: 20,
    draw: () =>
      // a hobby-horse costume round his waist: the horse's head in front, a tail behind, his own legs below
      korolPants(-14, '#8d6e63') +
      `<ellipse cx="0" cy="-64" rx="104" ry="26" fill="#a1887f" ${stroke}/>` +
      `<path d="M-96 -70 Q-150 -84 -156 -120 L-128 -130 Q-120 -100 -80 -84 Z" fill="#a1887f" ${stroke}/>` +
      `<ellipse cx="-158" cy="-126" rx="30" ry="18" fill="#a1887f" ${stroke} transform="rotate(-20 -158 -126)"/>` +
      `<ellipse cx="-182" cy="-116" rx="9" ry="7" fill="#d7ccc8" ${st(2)}/>` +
      `<circle cx="-156" cy="-134" r="4" fill="${INK}"/><path d="M-146 -146 l8 -16 l6 14" fill="#a1887f" ${st(3)}/>` +
      `<path d="M-132 -130 Q-118 -104 -94 -84" stroke="#fdd835" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<path d="M100 -66 Q140 -60 134 -16" stroke="#fdd835" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      `<path d="M-70 -62 h140" stroke="#e53935" stroke-width="6"/>`,
  },
  {
    id: 'korol_karty',
    slot: 'legs',
    name: 'Штани з гральних карт',
    price: 16,
    draw: () =>
      // trousers patched together from playing cards: hearts, spades, diamonds, clubs
      korolPants(-14, '#fafafa') +
      [[-26, -50, '♥', '#e53935', -6], [26, -50, '♠', '#212121', 6]]
        .map(([x, y, c, f, r]) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${Number(x) - 16}" y="${Number(y) - 24}" width="32" height="46" rx="4" fill="#fff" ${st(2.5)}/><text x="${x}" y="${Number(y) + 9}" font-size="26" text-anchor="middle" fill="${f}">${c}</text></g>`)
        .join('') +
      `<text x="-40" y="-20" font-size="16" fill="#e53935">♦</text><text x="30" y="-20" font-size="16" fill="#212121">♣</text>`,
  },
  {
    id: 'korol_keksyky',
    slot: 'legs',
    name: 'Шорти-кексики',
    price: 15,
    draw: () =>
      // pink shorts shaped like two cupcakes: pleated paper cups, frosting, sprinkles, cherries
      `<path d="M-90 -110 Q0 -124 90 -110 L80 -36 L6 -36 L0 -64 L-6 -36 L-80 -36 Z" fill="#f8bbd0" ${stroke}/>` +
      [-1, 1]
        .map(
          (d) =>
            Array.from({ length: 5 }, (_, i) => `<path d="M${d * (14 + i * 14)} -66 L${d * (12 + i * 14)} -38" stroke="#ec407a" stroke-width="3"/>`).join('') +
            `<path d="M${d * 6} -70 Q${d * 46} -86 ${d * 82} -72" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/>` +
            `<circle cx="${d * 44}" cy="-82" r="7" fill="#e53935" ${st(2)}/>` +
            [[20, -76, '#43a047'], [64, -76, '#1e88e5'], [32, -72, '#fdd835']].map(([x, y, c]) => `<rect x="${d * Number(x) - 4}" y="${y}" width="8" height="3" rx="1.5" fill="${c}"/>`).join(''),
        )
        .join(''),
  },
  {
    id: 'korol_lebedi',
    slot: 'feet',
    name: 'Капці-лебеді',
    price: 15,
    draw: () =>
      // white slippers, each a swan: a long curved neck at the toe, an orange beak, a little crown
      pair(
        `<ellipse cx="28" cy="-14" rx="30" ry="14" fill="#fafafa" ${st(3.5)}/>` +
          `<path d="M10 -18 q10 -10 22 -4" stroke="#e0e0e0" stroke-width="3" fill="none"/>` +
          `<path d="M50 -14 Q66 -40 52 -56 Q44 -66 54 -72" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M50 -14 Q66 -40 52 -56 Q44 -66 54 -72" stroke="#fafafa" stroke-width="6" fill="none" stroke-linecap="round"/>` +
          `<path d="M56 -74 l12 2 l-10 6 z" fill="#ff9800" ${st(2)}/><circle cx="54" cy="-74" r="1.8" fill="${INK}"/>` +
          `<path d="M48 -78 l2 -8 l4 4 l4 -6 l2 8 z" fill="#ffd54f" ${st(1.5)}/>`,
      ),
  },
  {
    id: 'korol_trony',
    slot: 'feet',
    name: 'Черевики-трони',
    price: 18,
    draw: () =>
      // each shoe a tiny golden throne with a red cushion and a crown on its back
      pair(
        `<path d="M8 0 V-60 Q8 -72 20 -72 Q30 -72 30 -60 V-26 H54 V0 Z" fill="#ffd54f" ${st(3)}/>` +
          `<rect x="14" y="-58" width="12" height="30" fill="#e53935"/>` +
          `<rect x="22" y="-30" width="36" height="12" rx="4" fill="#e53935" ${st(2.5)}/>` +
          `<path d="M12 -72 l2 -10 l4 4 l2 -8 l2 8 l4 -4 l2 10 z" fill="#ffd54f" ${st(2)}/>`,
      ),
  },
  {
    id: 'korol_tsehlynky',
    slot: 'feet',
    name: 'Черевики-цеглинки',
    price: 14,
    draw: () =>
      // shoes built of toy bricks: red, blue and yellow, studs on top
      pair(
        `<rect x="4" y="-22" width="30" height="22" fill="#e53935" ${st(3)}/><rect x="34" y="-22" width="26" height="22" fill="#1e88e5" ${st(3)}/>` +
          `<rect x="10" y="-42" width="32" height="20" fill="#fdd835" ${st(3)}/>` +
          [12, 26, 40, 52].map((x) => `<rect x="${x - 4}" y="-27" width="9" height="5" rx="1" fill="${x < 34 ? '#e53935' : '#1e88e5'}" ${st(1.5)}/>`).join('') +
          [18, 32].map((x) => `<rect x="${x - 4}" y="-47" width="9" height="5" rx="1" fill="#fdd835" ${st(1.5)}/>`).join(''),
      ),
  },
];

// ===================== the princess =====================

const PR_ARM = 'M52 -224 Q76 -194 62 -162';
const PR_TOP = 'M-46 -252 Q-56 -210 -48 -168 L48 -168 Q56 -210 46 -252 Q0 -266 -46 -252 Z';
/** a long skirt over her gown, its hem at -8 */
const PR_SKIRT = 'M-50 -182 Q-82 -98 -102 -8 Q0 8 102 -8 Q82 -98 50 -182 Q0 -190 -50 -182 Z';

const PRYNTSESA: Item[] = [
  {
    id: 'pryntsesa_klitka',
    slot: 'head',
    name: 'Клітка з канарейкою',
    price: 20,
    draw: () =>
      // a tall golden birdcage worn on her hair, a yellow canary singing on the swing inside
      `<path d="M-50 4 V-90 Q-50 -150 0 -156 Q50 -150 50 -90 V4" fill="#fff8e1" fill-opacity=".4" ${stroke}/>` +
      [-30, -10, 10, 30].map((x) => `<path d="M${x} 4 V-${Math.round(146 - Math.abs(x) * 0.9)}" stroke="#c99a1e" stroke-width="4"/>`).join('') +
      `<path d="M-58 4 H58" stroke="#c99a1e" stroke-width="10" stroke-linecap="round"/><path d="M-50 -90 H50" stroke="#c99a1e" stroke-width="4"/>` +
      `<circle cx="0" cy="-164" r="10" fill="#ffd54f" ${st(3)}/>` +
      `<path d="M-22 -40 Q0 -30 22 -40" stroke="#8b5a2b" stroke-width="4" fill="none"/>` +
      `<ellipse cx="2" cy="-54" rx="16" ry="12" fill="#ffeb3b" ${st(2.5)}/><circle cx="-10" cy="-66" r="9" fill="#ffeb3b" ${st(2.5)}/>` +
      `<circle cx="-12" cy="-68" r="2" fill="${INK}"/><path d="M-19 -66 l-7 2 l7 3 z" fill="#ff9800"/>` +
      `<path d="M-34 -96 q-4 -8 2 -12 M-42 -86 q-6 -4 -2 -12" stroke="${INK}" stroke-width="2.5" fill="none"/>`,
  },
  {
    id: 'pryntsesa_bulbashky',
    slot: 'head',
    name: 'Корона з мильних бульбашок',
    price: 15,
    draw: () =>
      // a crown of soap bubbles: shimmering, in a ring and floating up
      [[-56, -16, 18], [-28, -34, 22], [6, -44, 26], [38, -30, 20], [62, -12, 16], [-16, -80, 12], [24, -92, 10], [0, -122, 8]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e1f5fe" fill-opacity=".45" stroke="#4fc3f7" stroke-width="3.5"/><path d="M${Number(x) - Number(r) * 0.5} ${Number(y) - Number(r) * 0.3} q${Number(r) * 0.3} ${-Number(r) * 0.4} ${Number(r) * 0.6} -${Number(r) * 0.3}" stroke="#fff" stroke-width="3" fill="none"/><path d="M${Number(x) + Number(r) * 0.2} ${Number(y) + Number(r) * 0.5} q${Number(r) * 0.3} -2 ${Number(r) * 0.5} -${Number(r) * 0.4}" stroke="#f48fb1" stroke-width="2.5" fill="none"/>`)
        .join(''),
  },
  {
    id: 'pryntsesa_maska',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Карнавальна маска з пір’ям',
    price: 18,
    draw: () =>
      // a purple masquerade mask with gold trim, a fan of feathers on one side, a stick to hold it
      `<path d="M-80 -6 Q-70 -36 -34 -30 Q-10 -26 0 -14 Q10 -26 34 -30 Q70 -36 80 -6 Q72 24 38 24 Q14 22 0 6 Q-14 22 -38 24 Q-72 24 -80 -6 Z" fill="#7b1fa2" ${stroke}/>` +
      `<ellipse cx="-36" cy="-2" rx="18" ry="11" fill="#fff" fill-opacity=".15" stroke="#ffd54f" stroke-width="4"/><ellipse cx="36" cy="-2" rx="18" ry="11" fill="#fff" fill-opacity=".15" stroke="#ffd54f" stroke-width="4"/>` +
      `<path d="M70 -20 Q100 -80 90 -110 Q76 -70 66 -26 Z M74 -16 Q118 -60 128 -88 Q100 -60 74 -24 Z" fill="#ec407a" ${st(3)}/>` +
      `<path d="M-70 18 L-96 100" stroke="#ffd54f" stroke-width="6" stroke-linecap="round"/>` +
      [-60, -20, 20, 60].map((x) => `<circle cx="${x}" cy="${x < 0 ? -26 : -26}" r="3.5" fill="#fff59d"/>`).join(''),
  },
  {
    id: 'pryntsesa_viialo',
    slot: 'mouth',
    name: 'Мереживне віяло',
    price: 12,
    draw: () => {
      // a lacy pink fan held up to her mouth, coyly
      let ribs = '';
      for (let i = 0; i <= 8; i++) {
        const a = Math.PI * (1.05 + (i / 8) * 0.9);
        ribs += `<path d="M30 40 L${(30 + Math.cos(a) * 78).toFixed(0)} ${(40 + Math.sin(a) * 78).toFixed(0)}" stroke="#c2185b" stroke-width="2.5"/>`;
      }
      return (
        `<path d="M30 40 L${(30 + Math.cos(Math.PI * 1.05) * 82).toFixed(0)} ${(40 + Math.sin(Math.PI * 1.05) * 82).toFixed(0)} A82 82 0 0 1 ${(30 + Math.cos(Math.PI * 1.95) * 82).toFixed(0)} ${(40 + Math.sin(Math.PI * 1.95) * 82).toFixed(0)} Z" fill="#f8bbd0" ${st(3.5)}/>` +
        ribs +
        Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI * (1.05 + (i / 8) * 0.9);
          return `<circle cx="${(30 + Math.cos(a) * 80).toFixed(0)}" cy="${(40 + Math.sin(a) * 80).toFixed(0)}" r="6" fill="#fff" ${st(1.5)}/>`;
        }).join('') +
        `<circle cx="30" cy="40" r="6" fill="#ffd54f" ${st(2)}/>`
      );
    },
  },
  {
    id: 'pryntsesa_krolyk',
    slot: 'neck',
    name: 'Кролик на руках',
    price: 18,
    draw: () =>
      // a fluffy white bunny held to her chest, ears up, a pink bow
      `<g transform="translate(0 70)">` +
      `<path d="M-26 -50 Q-40 -110 -22 -114 Q-10 -90 -12 -50 Z M10 -50 Q14 -112 32 -110 Q36 -80 22 -46 Z" fill="#fafafa" ${st(3.5)}/>` +
      `<path d="M-24 -60 Q-30 -96 -22 -102 M16 -60 Q22 -96 28 -100" stroke="#f8bbd0" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="0" cy="10" rx="46" ry="36" fill="#fafafa" ${stroke}/>` +
      `<circle cx="0" cy="-34" r="30" fill="#fafafa" ${stroke}/>` +
      `<circle cx="-11" cy="-38" r="4" fill="${INK}"/><circle cx="11" cy="-38" r="4" fill="${INK}"/><ellipse cx="0" cy="-26" rx="5" ry="4" fill="#f48fb1"/>` +
      `<path d="M-4 -20 q4 4 8 0" fill="none" ${st(2)}/>` +
      `<path d="M10 -62 l14 -8 l0 16 z M10 -62 l-2 -14 l14 6 z" fill="#ec407a" ${st(2)}/>` +
      `</g>`,
  },
  {
    id: 'pryntsesa_kotyk',
    slot: 'torso',
    name: 'Кофтинка з Котом у чоботях',
    price: 18,
    draw: () =>
      // a lilac top with a picture of the Cat in Boots on it (her favourite!)
      sleeves(PR_ARM, '#ce93d8', 14) +
      `<circle cx="-52" cy="-224" r="18" fill="#ce93d8" ${st(4)}/><circle cx="52" cy="-224" r="18" fill="#ce93d8" ${st(4)}/>` +
      `<path d="${PR_TOP}" fill="#ce93d8" ${stroke}/>` +
      `<circle cx="0" cy="-206" r="20" fill="#f0a04b" ${st(3)}/>` +
      `<path d="M-18 -216 l2 -16 l10 10 z M18 -216 l-2 -16 l-10 10 z" fill="#f0a04b" ${st(2.5)}/>` +
      `<circle cx="-7" cy="-208" r="3" fill="#2b1a10"/><circle cx="7" cy="-208" r="3" fill="#2b1a10"/><path d="M-3 -200 h6 l-3 3 z" fill="#f06292"/>` +
      `<path d="M-28 -222 Q0 -232 28 -222 L22 -228 Q0 -244 -22 -228 Z" fill="#6d4426" ${st(2)}/><path d="M14 -232 q14 -10 22 -4" stroke="#e53935" stroke-width="4" fill="none"/>` +
      `<path d="M-14 -186 v12 M14 -186 v12" stroke="#5d3a1e" stroke-width="8"/>`,
  },
  {
    id: 'pryntsesa_yizhachok',
    slot: 'torso',
    name: 'Кофтинка з їжачком',
    price: 16,
    draw: () =>
      // a mint-green top with a hedgehog carrying apples on its spines
      sleeves(PR_ARM, '#a5d6a7', 14) +
      `<circle cx="-52" cy="-224" r="18" fill="#a5d6a7" ${st(4)}/><circle cx="52" cy="-224" r="18" fill="#a5d6a7" ${st(4)}/>` +
      `<path d="${PR_TOP}" fill="#a5d6a7" ${stroke}/>` +
      `<path d="M-30 -186 Q-28 -226 6 -228 Q34 -224 32 -186 Z" fill="#6d4c41" ${st(3)}/>` +
      Array.from({ length: 7 }, (_, i) => `<path d="M${-24 + i * 8} ${-212 + Math.abs(i - 3) * 3} l4 -12 l4 12" fill="#5d4037" stroke="#3e2723" stroke-width="1.5"/>`).join('') +
      `<path d="M-30 -186 Q-44 -196 -36 -204 Q-28 -200 -24 -192 Z" fill="#d7ccc8" ${st(2.5)}/><circle cx="-40" cy="-200" r="2.5" fill="${INK}"/><circle cx="-26" cy="-200" r="2" fill="${INK}"/>` +
      `<circle cx="-4" cy="-232" r="7" fill="#e53935" ${st(2)}/><circle cx="16" cy="-228" r="7" fill="#e53935" ${st(2)}/>`,
  },
  {
    id: 'pryntsesa_sadivnytsia',
    slot: 'torso',
    name: 'Жакет садівниці',
    price: 18,
    draw: () =>
      // a green gardener's jacket: a watering can peeping out of the pocket, flowers on the lapel
      sleeves(PR_ARM, '#558b2f', 14, `<path d="M54 -172 L70 -170" stroke="#fdd835" stroke-width="6" stroke-linecap="round"/>`) +
      `<path d="${PR_TOP}" fill="#558b2f" ${stroke}/>` +
      `<path d="M-20 -256 L0 -200 L20 -256" fill="#fafafa" ${st(3)}/>` +
      `<rect x="8" y="-196" width="30" height="26" rx="4" fill="#33691e" ${st(2.5)}/>` +
      `<path d="M14 -196 L14 -214 Q22 -222 30 -214 L30 -196 Z" fill="#90caf9" ${st(2)}/><path d="M30 -208 L44 -218" stroke="#64b5f6" stroke-width="4"/>` +
      [[-26, -230, '#e53935'], [-34, -214, '#fdd835'], [-20, -212, '#ab47bc']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}" ${st(1.5)}/><circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join(''),
  },
  {
    id: 'pryntsesa_kareta',
    slot: 'legs',
    name: 'Спідниця-карета',
    price: 22,
    draw: () =>
      // a skirt shaped like a golden carriage: windows with curtains, gold curls, two wheels at the hem
      `<path d="${PR_SKIRT}" fill="#ffd54f" ${stroke}/>` +
      `<path d="M-34 -150 Q-38 -110 -40 -90 L-6 -90 L-6 -150 Z M6 -150 L6 -90 L40 -90 Q38 -110 34 -150 Z" fill="#b3e5fc" ${st(3)}/>` +
      `<path d="M-34 -150 q14 14 28 0 M6 -150 q14 14 28 0" fill="#e53935" ${st(2)}/>` +
      `<path d="M-70 -60 q20 -20 40 0 q20 20 40 0 q20 -20 40 0" stroke="#c99a1e" stroke-width="5" fill="none"/>` +
      [-62, 62]
        .map((x) => `<circle cx="${x}" cy="-26" r="24" fill="none" stroke="${INK}" stroke-width="10"/><circle cx="${x}" cy="-26" r="24" fill="none" stroke="#c62828" stroke-width="5"/><path d="M${x - 20} -26 h40 M${x} -46 v40" stroke="#c99a1e" stroke-width="3"/><circle cx="${x}" cy="-26" r="5" fill="#ffd54f" ${st(1.5)}/>`)
        .join(''),
  },
  {
    id: 'pryntsesa_farby',
    slot: 'legs',
    name: 'Спідниця з плямами фарби',
    price: 15,
    draw: () =>
      // a white artist's skirt splashed with bright paint, a brush tucked at the waist
      `<path d="${PR_SKIRT}" fill="#fafafa" ${stroke}/>` +
      [[-40, -130, 16, '#e53935'], [30, -150, 12, '#1e88e5'], [-60, -60, 18, '#fdd835'], [20, -90, 20, '#43a047'], [66, -40, 14, '#ab47bc'], [-14, -40, 12, '#ff7043']]
        .map(([x, y, r, c]) => `<path d="M${Number(x) - Number(r)} ${y} q${Number(r) * 0.4} -${r} ${r} -${Number(r) * 0.8} q${r} -${Number(r) * 0.2} ${r} ${Number(r) * 0.8} q${Number(r) * 0.2} ${r} -${r} ${r} q-${r} 0 -${r} -${r} z" fill="${c}"/><circle cx="${Number(x) + Number(r) * 1.3}" cy="${Number(y) + Number(r) * 0.6}" r="${Number(r) * 0.25}" fill="${c}"/>`)
        .join('') +
      `<path d="M30 -186 L60 -120" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M30 -186 L60 -120" stroke="#a1704a" stroke-width="4" stroke-linecap="round"/><path d="M58 -124 l10 20 l-14 -4 z" fill="#e53935" ${st(2)}/>`,
  },
  {
    id: 'pryntsesa_vulyk',
    slot: 'legs',
    name: 'Спідниця-вулик',
    price: 18,
    draw: () =>
      // a skirt like a straw beehive: rounded rings, a little door, bees buzzing about
      `<path d="M-48 -182 Q-96 -120 -100 -8 Q0 8 100 -8 Q96 -120 48 -182 Q0 -192 -48 -182 Z" fill="#f9c74f" ${stroke}/>` +
      [-150, -118, -86, -54, -24].map((y, i) => `<path d="M${-60 - i * 9} ${y} Q0 ${y + 12} ${60 + i * 9} ${y}" stroke="#d4a531" stroke-width="5" fill="none"/>`).join('') +
      `<path d="M-14 -10 v-26 q14 -16 28 0 v26 z" fill="#5d3b22" ${st(2.5)}/>` +
      [[-70, -150], [72, -120], [-60, -40]]
        .map(([x, y]) => `<g transform="translate(${x} ${y})"><ellipse rx="10" ry="7" fill="#fdd835" ${st(2)}/><path d="M-3 -6 v12 M3 -6 v12" stroke="${INK}" stroke-width="2.5"/><ellipse cx="-2" cy="-10" rx="6" ry="4" fill="#e3f2fd" ${st(1.5)}/><ellipse cx="4" cy="-10" rx="6" ry="4" fill="#e3f2fd" ${st(1.5)}/></g>`)
        .join(''),
  },
  {
    id: 'pryntsesa_flamingo',
    slot: 'feet',
    name: 'Черевички-фламінго',
    price: 15,
    draw: () =>
      // pink shoes, each a flamingo: a curly neck at the toe, a black-tipped beak
      pair(
        `<ellipse cx="22" cy="-10" rx="24" ry="11" fill="#f48fb1" ${st(3)}/>` +
          `<path d="M14 -16 q8 -8 18 -2" stroke="#ec407a" stroke-width="3" fill="none"/>` +
          `<path d="M40 -12 Q56 -30 44 -46 Q36 -58 48 -62" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M40 -12 Q56 -30 44 -46 Q36 -58 48 -62" stroke="#f48fb1" stroke-width="4.5" fill="none" stroke-linecap="round"/>` +
          `<path d="M50 -64 l8 6 l-4 4 z" fill="#212121"/><circle cx="48" cy="-64" r="1.6" fill="${INK}"/>`,
      ),
  },
  {
    id: 'pryntsesa_skrypky',
    slot: 'feet',
    name: 'Черевички-скрипки',
    price: 16,
    draw: () =>
      // shoes like little violins: a curved wooden body, strings, a scroll at the toe
      pair(
        `<path d="M4 -10 Q4 -26 16 -24 Q22 -30 30 -24 Q42 -28 46 -14 Q50 -2 40 0 L10 0 Q2 0 4 -10 Z" fill="#a1662f" ${st(3)}/>` +
          `<path d="M12 -12 H44" stroke="#fff3e0" stroke-width="1.5"/><path d="M12 -16 H44 M12 -8 H44" stroke="#fff3e0" stroke-width="1"/>` +
          `<path d="M20 -16 q2 -4 4 0 M30 -16 q2 -4 4 0" stroke="#3e2723" stroke-width="2" fill="none"/>` +
          `<path d="M46 -14 L58 -18 Q66 -22 62 -30 Q56 -32 56 -26" stroke="#5d3a1e" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      ),
  },
  {
    id: 'pryntsesa_dzerkaltsia',
    slot: 'feet',
    name: 'Черевички з дзеркальцями',
    price: 15,
    draw: () =>
      // silver shoes covered with little round mirrors that glint
      pair(
        `<path d="M2 -6 Q4 -24 24 -24 Q44 -24 48 -6 L48 0 L2 0 Z" fill="#b0bec5" ${st(3)}/>` +
          [[12, -12], [24, -16], [36, -10], [22, -6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e1f5fe" ${st(1.5)}/>`).join('') +
          `<path d="M40 -30 l2 -8 l2 8 l8 2 l-8 2 l-2 8 l-2 -8 l-8 -2 z" fill="#fff" ${st(1)}/>`,
      ),
  },
];

// ===================== the ogre =====================

const OGRE_ARM = 'M110 -376 Q178 -310 160 -214';
const OGRE_TOP = 'M-110 -390 Q-178 -250 -150 -90 Q0 -66 150 -90 Q178 -250 110 -390 Q0 -420 -110 -390 Z';
const ogrePants = (h: number, fill: string) => `<path d="M-110 -126 Q0 -140 110 -126 L68 ${h} L22 ${h} L0 -70 L-22 ${h} L-68 ${h} Z" fill="${fill}" ${stroke}/>`;

const LYUDOZHER: Item[] = [
  {
    id: 'lyudozher_khmarochos',
    slot: 'head',
    name: 'Капелюх-хмарочос',
    price: 18,
    draw: () =>
      // a skyscraper for a hat: rows of lit windows, an antenna, a little cloud caught on top
      `<path d="M-46 4 V-170 H46 V4 Z" fill="#78909c" ${stroke}/>` +
      Array.from({ length: 6 }, (_, r) => [-30, -10, 10, 30].map((x, c) => `<rect x="${x - 6}" y="${-156 + r * 26}" width="12" height="14" fill="${(r + c) % 3 ? '#fff59d' : '#455a64'}"/>`).join('')).join('') +
      `<path d="M-30 -170 V-196 H30 V-170" fill="#90a4ae" ${st(4)}/><path d="M0 -196 V-246" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-248" r="6" fill="#e53935"/>` +
      `<path d="M8 -222 q-4 -16 12 -16 q6 -12 20 -4 q16 -2 14 14 q8 10 -6 14 h-34 q-12 -2 -6 -8 z" fill="#fff" ${st(3)}/>` +
      `<rect x="-60" y="-4" width="120" height="12" rx="4" fill="#546e7a" ${st(3)}/>`,
  },
  {
    id: 'lyudozher_maiak',
    slot: 'head',
    name: 'Шапка-маяк',
    price: 18,
    draw: () =>
      // a red-and-white striped lighthouse cap, its lamp shining two beams
      `<path d="M-50 4 L-30 -140 L30 -140 L50 4 Z" fill="#fafafa" ${stroke}/>` +
      `<path d="M-47 -20 L47 -20 L42 -54 L-42 -54 Z M-38 -86 L38 -86 L34 -118 L-34 -118 Z" fill="#e53935"/>` +
      `<path d="M-50 4 L-30 -140 L30 -140 L50 4 Z" fill="none" ${stroke}/>` +
      `<path d="M-30 -150 L-130 -190 L-130 -140 Z M30 -150 L130 -190 L130 -140 Z" fill="#fff59d" opacity=".7"/>` +
      `<rect x="-24" y="-176" width="48" height="36" rx="6" fill="#fff59d" ${st(4)}/>` +
      `<path d="M-30 -176 Q0 -204 30 -176 Z" fill="#e53935" ${st(4)}/><circle cx="0" cy="-196" r="5" fill="${INK}"/>` +
      `<path d="M-12 -2 v-24 q12 -12 24 0 v24 z" fill="#37474f" ${st(2.5)}/>`,
  },
  {
    id: 'lyudozher_3d',
    slot: 'face',
    needs: 'twoEyes',
    name: 'Окуляри 3D',
    price: 14,
    draw: () =>
      // cardboard 3-D glasses: one lens red, one blue
      `<path d="M-84 -26 H84 V24 H10 Q0 10 -10 24 H-84 Z" fill="#fafafa" ${stroke}/>` +
      `<rect x="-74" y="-16" width="58" height="32" rx="4" fill="#e53935" fill-opacity=".7" ${st(3)}/>` +
      `<rect x="16" y="-16" width="58" height="32" rx="4" fill="#1e88e5" fill-opacity=".7" ${st(3)}/>` +
      `<path d="M-84 -20 L-104 -26 M84 -20 L104 -26" stroke="#fafafa" stroke-width="8"/>`,
  },
  {
    id: 'lyudozher_pina',
    slot: 'mouth',
    beard: true,
    name: 'Борода з мильної піни',
    price: 12,
    draw: () =>
      // a big fluffy beard of shaving foam, a razor-shaped rubber duck bobbing in it
      `<path d="M-70 -10 Q-96 30 -76 70 Q-90 100 -56 120 Q-50 150 -14 146 Q0 168 18 146 Q52 152 58 120 Q92 100 78 70 Q98 30 70 -10 Q40 20 0 18 Q-40 20 -70 -10 Z" fill="#fafafa" ${stroke}/>` +
      [[-50, 40, 12], [-20, 80, 16], [30, 60, 14], [10, 120, 10], [-44, 110, 9], [52, 100, 10]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#e0e0e0" stroke-width="3"/>`).join('') +
      `<g transform="translate(40 30)"><ellipse cx="0" cy="0" rx="18" ry="11" fill="#ffeb3b" ${st(2.5)}/><circle cx="-12" cy="-12" r="9" fill="#ffeb3b" ${st(2.5)}/><path d="M-20 -12 l-8 2 l8 3 z" fill="#ff9800"/><circle cx="-13" cy="-14" r="1.8" fill="${INK}"/></g>`,
  },
  {
    id: 'lyudozher_vedmedyk',
    slot: 'neck',
    name: 'Плюшевий ведмедик',
    price: 15,
    draw: () =>
      // a little worn teddy bear hanging on a ribbon round his neck, one button eye
      `<path d="M-50 -14 Q0 50 50 -14" fill="none" stroke="#ec407a" stroke-width="7"/>` +
      `<g transform="translate(0 74)">` +
      `<circle cx="-24" cy="-30" r="12" fill="#a1704a" ${st(3)}/><circle cx="24" cy="-30" r="12" fill="#a1704a" ${st(3)}/>` +
      `<ellipse cx="0" cy="34" rx="30" ry="32" fill="#a1704a" ${stroke}/>` +
      `<circle cx="0" cy="-12" r="28" fill="#a1704a" ${stroke}/>` +
      `<ellipse cx="0" cy="-2" rx="13" ry="10" fill="#d7b48a"/><circle cx="0" cy="-6" r="4" fill="${INK}"/>` +
      `<circle cx="-10" cy="-18" r="4" fill="${INK}"/><path d="M6 -22 l8 8 M14 -22 l-8 8" stroke="${INK}" stroke-width="2.5"/>` +
      `<rect x="10" y="22" width="14" height="12" fill="#81d4fa" ${st(2)} transform="rotate(12 17 28)"/>` +
      `</g>`,
  },
  {
    id: 'lyudozher_morkva',
    slot: 'torso',
    name: 'Футболка «Я вегетаріанець»',
    price: 18,
    draw: () =>
      // a white T-shirt: «Я ВЕГЕТАРІАНЕЦЬ» and a big carrot — he has given up on eating people
      sleeves('M110 -376 Q160 -330 156 -300', '#fafafa', 42) +
      `<path d="${OGRE_TOP}" fill="#fafafa" ${stroke}/>` +
      `<text x="0" y="-262" font-size="28" font-weight="900" text-anchor="middle" fill="#2e7d32">Я ВЕГЕТАРІАНЕЦЬ</text>` +
      `<g transform="translate(0 70) rotate(60 0 -220)"><path d="M-24 -290 Q0 -296 24 -290 L4 -140 Q0 -132 -4 -140 Z" fill="#ff9800" ${st(4)}/>` +
      `<path d="M-14 -260 h12 M4 -230 h12 M-8 -200 h10" stroke="#e65100" stroke-width="3"/>` +
      `<path d="M0 -292 q-20 -30 -10 -50 q8 20 10 50 q6 -30 24 -40 q-4 24 -22 40" fill="#43a047" ${st(3)}/></g>`,
  },
  {
    id: 'lyudozher_koshenia',
    slot: 'torso',
    name: 'Светр з кишенею-кошеням',
    price: 20,
    draw: () =>
      // a knitted mustard jumper with a big front pocket — a little kitten peeks out of it
      sleeves(OGRE_ARM, '#fbc02d', 42, `<path d="M146 -226 L176 -226" stroke="#f57f17" stroke-width="14" stroke-linecap="round"/>`) +
      `<path d="${OGRE_TOP}" fill="#fbc02d" ${stroke}/>` +
      Array.from({ length: 5 }, (_, i) => `<path d="M-120 ${-330 + i * 50} l12 12 l12 -12 l12 12 l12 -12 M60 ${-330 + i * 50} l12 12 l12 -12 l12 12 l12 -12" stroke="#f57f17" stroke-width="4" fill="none"/>`).join('') +
      `<g transform="translate(0 70)">` +
      `<path d="M-60 -250 L-56 -150 L56 -150 L60 -250 Z" fill="#f9a825" ${st(4)}/>` +
      `<path d="M-30 -250 l4 -26 l14 14 Z M30 -250 l-4 -26 l-14 14 Z" fill="#9e9e9e" ${st(3)}/>` +
      `<path d="M-34 -250 Q0 -290 34 -250 Z" fill="#9e9e9e" ${st(3)}/>` +
      `<circle cx="-12" cy="-262" r="4" fill="${INK}"/><circle cx="12" cy="-262" r="4" fill="${INK}"/><path d="M-4 -256 h8 l-4 4 z" fill="#f06292"/>` +
      `<path d="M-30 -246 v-10 M-18 -246 v-10 M18 -246 v-10 M30 -246 v-10" stroke="#757575" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M-60 -250 L60 -250" stroke="${INK}" stroke-width="5"/></g>`,
  },
  {
    id: 'lyudozher_kushch',
    slot: 'torso',
    name: 'Костюм-кущ',
    price: 18,
    draw: () =>
      // a bush costume for hiding (it doesn't work — he's far too big): leaves all over, red berries
      sleeves(OGRE_ARM, '#4f9446', 42) +
      [[-120, -330, 50], [-30, -370, 56], [70, -350, 54], [120, -260, 52], [-130, -220, 54], [-60, -280, 60], [40, -260, 62], [-110, -130, 52], [0, -170, 66], [110, -140, 54]]
        .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? '#3f7f3a' : '#4f9446'}" ${stroke}/>`)
        .join('') +
      [[-100, -320], [30, -360], [100, -250], [-70, -170], [60, -140], [-20, -240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#e53935" ${st(2)}/>`).join(''),
  },
  {
    id: 'lyudozher_podarunky',
    slot: 'legs',
    name: 'Штани-подарунки',
    price: 16,
    draw: () =>
      // trousers wrapped like presents: polka-dot paper, ribbons crossing, a bow on each knee
      ogrePants(-16, '#4fc3f7') +
      [[-60, -110], [-40, -50], [40, -90], [56, -36], [-20, -96], [30, -40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`).join('') +
      `<path d="M-46 -126 L-46 -16 M46 -126 L46 -16 M-100 -70 H-10 M10 -70 H100" stroke="#e53935" stroke-width="10"/>` +
      [-46, 46].map((x) => `<path d="M${x} -70 l-20 -14 v28 z M${x} -70 l20 -14 v28 z" fill="#e53935" ${st(3)}/><circle cx="${x}" cy="-70" r="7" fill="#c62828" ${st(2)}/>`).join(''),
  },
  {
    id: 'lyudozher_baturt',
    slot: 'legs',
    name: 'Шорти-батути',
    price: 15,
    draw: () =>
      // blue shorts with a little trampoline on each leg, a frog jumping on one
      `<path d="M-110 -126 Q0 -140 110 -126 L104 -36 L20 -36 L0 -80 L-20 -36 L-104 -36 Z" fill="#3949ab" ${stroke}/>` +
      [-60, 60]
        .map((x) => `<ellipse cx="${x}" cy="-66" rx="30" ry="8" fill="#212121" ${st(3)}/><ellipse cx="${x}" cy="-68" rx="30" ry="8" fill="none" stroke="#fdd835" stroke-width="4"/><path d="M${x - 24} -62 l-4 18 M${x + 24} -62 l4 18" stroke="#fdd835" stroke-width="4"/>`)
        .join('') +
      `<g transform="translate(60 -102)"><ellipse rx="12" ry="9" fill="#66bb6a" ${st(2.5)}/><circle cx="-6" cy="-8" r="4" fill="#66bb6a" ${st(2)}/><circle cx="6" cy="-8" r="4" fill="#66bb6a" ${st(2)}/><circle cx="-6" cy="-8" r="1.5" fill="${INK}"/><circle cx="6" cy="-8" r="1.5" fill="${INK}"/></g>` +
      `<path d="M60 -84 v-6 M54 -86 v-4 M66 -86 v-4" stroke="#fff" stroke-width="2"/>`,
  },
  {
    id: 'lyudozher_pazly',
    slot: 'legs',
    name: 'Штани-пазли',
    price: 15,
    draw: () =>
      // trousers made of jigsaw pieces, every piece its own colour, one piece missing
      ogrePants(-16, '#ff7043') +
      `<path d="M-100 -96 H-60 q0 -12 10 -12 q10 0 10 12 H-10 M10 -96 H50 q0 -12 10 -12 q10 0 10 12 H100 M-80 -126 V-40 q12 0 12 10 q0 10 -12 10 V-16 M80 -126 V-40 q-12 0 -12 10 q0 10 12 10 V-16 M-40 -96 V-60 M40 -96 V-60 M-90 -60 H-10 M10 -60 H90" stroke="${INK}" stroke-width="3.5" fill="none"/>` +
      `<path d="M-74 -92 h28 v28 h-28 z" fill="#ffd54f"/><path d="M46 -54 h28 v30 h-28 z" fill="#4fc3f7"/><path d="M-60 -54 h18 v34 h-18 z" fill="#81c784"/><path d="M14 -120 h26 v20 h-26 z" fill="#ba68c8"/>` +
      `<path d="M50 -120 h28 v22 h-28 z" fill="#5d4037"/>`,
  },
  {
    id: 'lyudozher_avtobusy',
    slot: 'feet',
    name: 'Черевики-автобуси',
    price: 18,
    draw: () =>
      // a yellow bus for each shoe: windows with little passengers, black wheels
      pair(
        `<rect x="18" y="-56" width="98" height="46" rx="12" fill="#fdd835" ${st(4)}/>` +
          [34, 58, 82].map((x) => `<rect x="${x - 9}" y="-50" width="18" height="16" rx="3" fill="#b3e5fc" ${st(2)}/><circle cx="${x}" cy="-40" r="4" fill="#f2c4a0"/>`).join('') +
          `<rect x="100" y="-50" width="12" height="22" rx="2" fill="#b3e5fc" ${st(2)}/>` +
          `<path d="M20 -26 H114" stroke="#e53935" stroke-width="4"/>` +
          `<circle cx="40" cy="-10" r="11" fill="#37474f" ${st(3)}/><circle cx="96" cy="-10" r="11" fill="#37474f" ${st(3)}/><circle cx="40" cy="-10" r="4" fill="#b0bec5"/><circle cx="96" cy="-10" r="4" fill="#b0bec5"/>`,
      ),
  },
  {
    id: 'lyudozher_khatynky',
    slot: 'feet',
    name: 'Черевики-хатинки',
    price: 16,
    draw: () =>
      // each shoe a little white cottage: a thatched roof, a door, a window, smoke from the chimney
      pair(
        `<rect x="20" y="-46" width="84" height="46" fill="#fbf7ee" ${st(4)}/>` +
          `<path d="M12 -44 L62 -84 L112 -44 Z" fill="#e2b45a" ${st(4)}/>` +
          `<rect x="84" y="-86" width="12" height="22" fill="#8d6e63" ${st(2.5)}/><path d="M90 -92 q-8 -10 2 -18 q8 -8 0 -16" stroke="#e0e0e0" stroke-width="4" fill="none" stroke-linecap="round"/>` +
          `<rect x="34" y="-30" width="18" height="30" fill="#8b5a2b" ${st(2.5)}/>` +
          `<rect x="66" y="-36" width="22" height="18" fill="#9fd3f0" ${st(2.5)}/><path d="M77 -36 v18 M66 -27 h22" stroke="${INK}" stroke-width="2"/>`,
      ),
  },
  {
    id: 'lyudozher_drakonchyky',
    slot: 'feet',
    name: 'Капці-дракончики',
    price: 16,
    draw: () =>
      // green dragon slippers: a snout with nostrils, big friendly eyes, spikes along the back
      pair(
        `<path d="M14 -22 l8 -14 l8 12 l8 -14 l8 12 l8 -14 l6 14" fill="#ffb300" ${st(2.5)}/>` +
          `<path d="M10 0 Q8 -32 50 -30 Q98 -30 110 -12 Q114 0 100 0 Z" fill="#66bb6a" ${st(4)}/>` +
          `<circle cx="66" cy="-30" r="11" fill="#fff" ${st(3)}/><circle cx="69" cy="-30" r="5" fill="${INK}"/>` +
          `<circle cx="98" cy="-14" r="3" fill="${INK}"/><circle cx="106" cy="-12" r="2.5" fill="${INK}"/>` +
          `<path d="M80 -4 l4 -6 l4 6 l4 -6 l4 6" fill="#fff" ${st(1.5)}/>`,
      ),
  },
];

export const ITEMS: Item[] = [...CAT, ...MARKIZ, ...KOROL, ...PRYNTSESA, ...LYUDOZHER];

const ids = (list: Item[]) => list.map((i) => i.id).join(' ');
export const SETS: Record<string, string> = {
  kit_chobotar: ids(CAT),
  markiz: ids(MARKIZ),
  korol: ids(KOROL),
  pryntsesa: ids(PRYNTSESA),
  lyudozher: ids(LYUDOZHER),
};
