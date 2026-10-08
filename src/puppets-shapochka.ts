// The puppets of «Червона Шапочка»: the girl herself (a red hood and a long red cape over a blue
// polka-dot dress, a basket with pies and a pot of butter on her arm; look bez — before the hood was
// given her, bez_koshyka — the hood but no basket yet, kvity — with a bunch of flowers too), her mother
// (a braid round her head, an apron dusted with flour), the hunter (a green hat with a feather, a gun
// on his back) and the woodcutter (an axe on his shoulder) — the hunters; the grandmother is baba of
// characters.ts (look chepets: in bed, in a frilled nightcap and glasses), the wolf is vovk (look
// babusia: in her nightcap and glasses, big paws out over the blanket); grandma's cottage by the
// forest (a door with the string to pull), her bed (lizhko_babusi: the headboard and the pillow,
// behind) and its quilt (kovdra: in front — who is in bed shows from the shoulders up), the wolf's
// tail poking out from under it, the basket of pies, two patches of flowers, butterflies, a pile of
// stones. And the cover: the girl on the path, the wolf peeping from behind a tree. Same conventions
// as characters.ts.

import { INK, baba, closedEyes, eyes, mouth, st, stitch, stroke, vovk } from './characters';

const SKIN = '#f2c4a0';
const RED = '#d62828';
const RED_DARK = '#9e1b1b';
const BLUE = '#5aa9e6';
const HAIR = '#e8b04a';
const HAIR_DARK = '#c48a2a';

/** a thick limb: the ink outline, then its colour over it */
const limb = (d: string, fill: string, w: number) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;

/** a pie lying on its side: its bottom in the middle at x, y */
const pie = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 0 Q-30 -28 0 -30 Q30 -28 26 0 Z" fill="#e2a24a" ${st(3)}/>` +
  `<path d="M-14 -6 q5 -7 0 -14 M0 -6 q5 -9 0 -18 M14 -6 q5 -7 0 -14" stroke="#b5762a" stroke-width="3" fill="none"/></g>`;

/**
 * The basket with the pies and the pot of butter, its bottom in the middle at x, y: wicker, a
 * handle over it, a red-and-white checked napkin with the pies peeping out, a little clay pot with
 * a yellow lump of butter showing under its lid.
 */
const basket = (x: number, y: number, s = 1) => {
  let weave = '';
  for (let i = 0; i < 4; i++) weave += `<path d="M-38 ${-44 + i * 11} Q0 ${-38 + i * 11} 38 ${-44 + i * 11}" stroke="#9c6b35" stroke-width="3" fill="none"/>`;
  for (let i = -3; i <= 3; i++) weave += `<path d="M${i * 11} -50 L${i * 9} -2" stroke="#9c6b35" stroke-width="2.5"/>`;
  let checks = '';
  for (let i = 0; i < 5; i++) checks += `<path d="M${-30 + i * 14} -66 l-6 18" stroke="${RED}" stroke-width="5"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-36 -52 Q0 -128 36 -52" fill="none" stroke="${INK}" stroke-width="11"/>
    <path d="M-36 -52 Q0 -128 36 -52" fill="none" stroke="#c8955a" stroke-width="5"/>
    ${pie(-16, -50, 0.8)}
    <path d="M-6 -78 h26 v6 q6 2 6 10 v14 h-38 v-14 q0 -8 6 -10 z" fill="#c0703a" ${st(3)}/>
    <ellipse cx="7" cy="-78" rx="15" ry="5" fill="#ffe066" ${st(2.5)}/>
    <path d="M-2 -82 q9 -10 18 0" fill="#a0522d" ${st(2.5)}/>
    <path d="M-42 -52 L-34 0 L34 0 L42 -52 Q0 -44 -42 -52 Z" fill="#d9a865" ${st(4)}/>
    ${weave}
    <path d="M-42 -52 L-34 0 L34 0 L42 -52 Q0 -44 -42 -52 Z" fill="none" ${st(4)}/>
    <path d="M-44 -54 Q-30 -70 -4 -62 Q22 -72 44 -54 L40 -44 Q0 -36 -40 -44 Z" fill="#fff" ${st(3)}/>
    ${checks}
    <path d="M-40 -50 Q0 -42 40 -50" stroke="${RED}" stroke-width="4" fill="none"/>
  </g>`;
};

/** a bunch of flowers held in a hand at x, y */
const bunch = (x: number, y: number) => {
  const head = (dx: number, dy: number, c: string) =>
    `<circle cx="${dx - 6}" cy="${dy}" r="7" fill="${c}" ${st(2)}/><circle cx="${dx + 6}" cy="${dy}" r="7" fill="${c}" ${st(2)}/><circle cx="${dx}" cy="${dy - 7}" r="7" fill="${c}" ${st(2)}/><circle cx="${dx}" cy="${dy + 6}" r="7" fill="${c}" ${st(2)}/><circle cx="${dx}" cy="${dy}" r="5" fill="#ffd54f"/>`;
  return `<g transform="translate(${x} ${y})">
    <path d="M0 6 L-22 -50 M0 6 L0 -60 M0 6 L22 -48 M0 6 L-8 -40 M0 6 L12 -38" stroke="#3d7a30" stroke-width="4"/>
    <path d="M-12 -24 q-16 -4 -18 -16 q14 0 18 16 z M10 -22 q16 -6 20 -18 q-14 2 -20 18 z" fill="#66bb6a" ${st(2)}/>
    ${head(-22, -56, '#e53935')}${head(0, -66, '#fff')}${head(22, -54, '#8e24aa')}${head(-10, -44, '#fdd835')}${head(12, -42, '#1e88e5')}
    <path d="M-6 0 l6 -8 l6 8 l-2 8 h-8 z" fill="#ef5350" ${st(2)}/>
  </g>`;
};

interface Look {
  /** the red hood and the cape (no: before grandma gave them) */
  hood: boolean;
  /** the basket on her right arm */
  basket: boolean;
  /** a bunch of flowers in her left hand */
  flowers?: boolean;
}

/**
 * Little Red Riding Hood: golden hair with a fringe; the big red hood round her face, tied under
 * her chin with a bow (data-part hat: off for a hat — the hair shows), the long red cape behind her
 * down to her knees; a sky-blue dress with white polka dots, a round white collar, puffed sleeves;
 * white socks, black shoes with a strap; the basket on her right arm.
 */
const girl = (o: Look) => {
  let dots = '';
  for (const [x, y] of [[-40, -150], [-14, -136], [14, -150], [40, -136], [-56, -100], [-28, -106], [0, -96], [28, -110], [56, -96], [-44, -80], [42, -78], [-6, -122]]) dots += `<circle cx="${x}" cy="${y}" r="4.5" fill="#fff"/>`;
  return `
<g data-part="body">
  ${o.hood ? `<!-- the long cape, behind her -->
  <path d="M-40 -246 Q-92 -170 -96 -62 Q-70 -50 -50 -60 L-40 -180 M40 -246 Q92 -170 96 -62 Q70 -50 50 -60 L40 -180" fill="${RED}" ${stroke}/>
  <path d="M-40 -246 Q-92 -170 -96 -62 Q-70 -50 -50 -60 L-40 -180 L40 -180 L50 -60 Q70 -50 96 -62 Q92 -170 40 -246 Z" fill="${RED}" ${stroke}/>
  <path d="M-80 -150 Q-86 -110 -84 -70 M80 -150 Q86 -110 84 -70" stroke="${RED_DARK}" stroke-width="5" fill="none"/>` : ''}
  ${o.hood ? `<!-- the back of the hood, behind her head and shoulders -->
  <path data-part="hat" d="M-56 -224 Q-66 -318 0 -322 Q66 -318 56 -224 Q46 -206 0 -204 Q-46 -206 -56 -224 Z" fill="${RED}" ${stroke}/>` : ''}
  <!-- legs in white socks, black shoes with a strap -->
  <rect x="-28" y="-84" width="20" height="74" rx="8" fill="${SKIN}" ${st(4)}/>
  <rect x="8" y="-84" width="20" height="74" rx="8" fill="${SKIN}" ${st(4)}/>
  <path d="M-28 -44 h20 v30 h-20 z M8 -44 h20 v30 h-20 z" fill="#fff" ${st(3)}/>
  <path d="M-28 -38 h20 M8 -38 h20" stroke="#90caf9" stroke-width="3"/>
  <path d="M-44 0 q0 -20 14 -22 h24 v22 z" fill="#263238" ${st(4)}/>
  <path d="M44 0 q0 -20 -14 -22 h-24 v22 z" fill="#263238" ${st(4)}/>
  <path d="M-30 -18 h22 M8 -18 h22" stroke="#455a64" stroke-width="4"/><circle cx="-12" cy="-18" r="3" fill="#ffd54f"/><circle cx="12" cy="-18" r="3" fill="#ffd54f"/>
  <!-- the blue polka-dot dress: a flared skirt with a white petticoat peeping out -->
  <path d="M-74 -70 Q0 -58 74 -70 L76 -62 Q0 -48 -76 -62 Z" fill="#fff" ${st(3)}/>
  <path d="M-46 -178 L-74 -70 Q0 -58 74 -70 L46 -178 Z" fill="${BLUE}" ${stroke}/>
  ${dots}
  <g data-dress="legs"></g>
  <!-- the bodice, a red belt with a bow -->
  <path d="M-44 -238 Q-54 -206 -48 -176 L48 -176 Q54 -206 44 -238 Q0 -252 -44 -238 Z" fill="${BLUE}" ${stroke}/>
  <circle cx="-22" cy="-210" r="4" fill="#fff"/><circle cx="20" cy="-200" r="4" fill="#fff"/><circle cx="2" cy="-224" r="4" fill="#fff"/>
  <rect x="-48" y="-186" width="96" height="14" rx="5" fill="${RED}" ${st(3)}/>
  <path d="M14 -179 l-12 -9 v18 z M14 -179 l12 -9 v18 z" fill="${RED}" ${st(2.5)}/>
  <!-- arms: puffed sleeves, then bare arms -->
  ${limb('M-50 -216 Q-66 -190 -60 -162', SKIN, 14)}
  ${limb('M50 -216 Q66 -190 60 -162', SKIN, 14)}
  <circle cx="-52" cy="-224" r="18" fill="${BLUE}" ${st(4)}/><circle cx="52" cy="-224" r="18" fill="${BLUE}" ${st(4)}/>
  <circle cx="-56" cy="-228" r="3.5" fill="#fff"/><circle cx="50" cy="-220" r="3.5" fill="#fff"/>
  <!-- the round white collar -->
  <path d="M-30 -244 Q-34 -224 -12 -222 Q-2 -228 0 -236 Q2 -228 12 -222 Q34 -224 30 -244 Q0 -252 -30 -244 Z" fill="#fff" ${st(3)}/>
  <g data-dress="torso"></g>
  <circle cx="-60" cy="-156" r="11" fill="${SKIN}" ${st(4)}/>
  ${o.flowers ? bunch(-62, -150) : ''}
  ${o.basket ? `<!-- the basket on her right arm -->${basket(72, -84)}` : ''}
  <circle cx="60" cy="-156" r="11" fill="${SKIN}" ${st(4)}/>
  ${o.basket ? `<path d="M50 -156 q12 -8 22 -2" stroke="#c8955a" stroke-width="5" fill="none"/>` : ''}
  <!-- the hair: golden, falling to her shoulders -->
  <path d="M-38 -250 Q-46 -210 -40 -200 Q-26 -206 -24 -232 Z M38 -250 Q46 -210 40 -200 Q26 -206 24 -232 Z" fill="${HAIR}" ${st(3)}/>
  <ellipse cx="0" cy="-246" rx="36" ry="38" fill="${SKIN}" ${stroke}/>
  <!-- the fringe -->
  <path d="M-36 -252 Q-36 -288 0 -288 Q36 -288 36 -252 Q30 -264 22 -262 Q18 -272 8 -266 Q0 -276 -8 -266 Q-18 -272 -22 -262 Q-30 -264 -36 -252 Z" fill="${HAIR}" ${st(3)}/>
  <path d="M-20 -280 q8 -4 16 -2" stroke="${HAIR_DARK}" stroke-width="3" fill="none"/>
  ${o.hood ? `<g data-part="hat">
    <!-- the hood's rim round her face, a little peak on top, the bow under her chin -->
    <path d="M-50 -222 Q-60 -302 0 -306 Q60 -302 50 -222 Q48 -270 0 -280 Q-48 -270 -50 -222 Z" fill="${RED}" ${stroke}/>
    <path d="M-40 -246 Q-36 -282 0 -290 Q36 -282 40 -246" stroke="${RED_DARK}" stroke-width="5" fill="none"/>
    <path d="M-6 -304 Q0 -324 10 -330 Q8 -314 6 -304 Z" fill="${RED}" ${st(3)}/>
    <path d="M-48 -224 Q-40 -212 -10 -210 M48 -224 Q40 -212 10 -210" stroke="${RED}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M0 -208 l-20 -10 v22 z M0 -208 l20 -10 v22 z" fill="${RED}" ${st(3)}/>
    <path d="M-4 -204 l-6 12 M4 -204 l6 12" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="0" cy="-208" r="5" fill="${RED_DARK}" ${st(2)}/>
  </g>` : `<!-- no hood yet: a red ribbon in her hair -->
  <path d="M30 -280 l14 -16 l6 14 z M30 -280 l20 4 l-12 10 z" fill="#ef5350" ${st(2)}/>`}
  ${eyes(0, -248, 28, 6)}
  ${closedEyes(0, -248, 28, 6)}
  <ellipse cx="-20" cy="-232" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  <ellipse cx="20" cy="-232" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  <ellipse cx="0" cy="-238" rx="4" ry="3" fill="#e8a383"/>
  ${mouth(`<path d="M-9 -225 q9 9 18 0" fill="none" ${st(4)}/>`, `<path d="M-9 -227 q9 16 18 0 z" fill="#7a2a1a" ${st(3)}/>`)}
</g>`;
};

export const chervona_shapochka = () => girl({ hood: true, basket: true });
/** before grandma's present: no hood, no cape, a ribbon in her hair */
export const chervona_shapochka_bez = () => girl({ hood: false, basket: false });
/** the hood on, the basket not given her yet */
export const chervona_shapochka_bez_koshyka = () => girl({ hood: true, basket: false });
/** the basket, and a bunch of flowers picked in the forest */
export const chervona_shapochka_kvity = () => girl({ hood: true, basket: true, flowers: true });

/**
 * Her mother: dark-brown hair in a braid wound round her head, a white embroidered blouse, a green
 * skirt, a white apron dusted with flour, a wooden spoon in her hand.
 */
export const mama = () => `
<g data-part="body">
  <path d="M-42 0 q0 -18 12 -22 h22 v22 z M42 0 q0 -18 -12 -22 h-22 v22 z" fill="#6d4c41" ${st(4)}/>
  <!-- the green skirt with a yellow band -->
  <path d="M-52 -176 L-82 -12 Q0 0 82 -12 L52 -176 Z" fill="#388e3c" ${stroke}/>
  <path d="M-80 -30 Q0 -18 80 -30" stroke="#fdd835" stroke-width="9" fill="none"/>
  <!-- the apron, flour on it -->
  <path d="M-34 -170 L-44 -40 L44 -40 L34 -170 Z" fill="#fbf7ee" ${st(4)}/>
  ${stitch(-40, -58, 80)}
  <circle cx="-14" cy="-120" r="7" fill="#fff" opacity=".9"/><circle cx="10" cy="-96" r="9" fill="#fff" opacity=".9"/><circle cx="20" cy="-136" r="5" fill="#fff" opacity=".9"/>
  <path d="M-20 -130 q6 -4 10 0 M4 -110 q8 -6 14 0" stroke="#e0dacb" stroke-width="3" fill="none"/>
  <g data-dress="legs"></g>
  <!-- the blouse -->
  <path d="M-50 -246 Q-62 -206 -54 -170 L54 -170 Q62 -206 50 -246 Q0 -262 -50 -246 Z" fill="#fbf7ee" ${stroke}/>
  ${stitch(-7, -244, 14, 64, true)}
  <rect x="-56" y="-180" width="112" height="14" rx="5" fill="#c62828" ${st(4)}/>
  ${limb('M-48 -238 Q-80 -196 -62 -150', '#fbf7ee', 22)}
  ${limb('M48 -238 Q80 -196 62 -150', '#fbf7ee', 22)}
  ${stitch(-76, -206, 28)}
  ${stitch(48, -206, 28)}
  <g data-dress="torso"></g>
  <circle cx="-62" cy="-144" r="12" fill="${SKIN}" ${st(4)}/>
  <!-- the wooden spoon -->
  <path d="M66 -150 L84 -232" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M66 -150 L84 -232" stroke="#c8955a" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="86" cy="-244" rx="10" ry="16" fill="#c8955a" ${st(3)} transform="rotate(12 86 -244)"/>
  <circle cx="62" cy="-144" r="12" fill="${SKIN}" ${st(4)}/>
  <!-- the head, the braid round it like a crown -->
  <ellipse cx="0" cy="-292" rx="38" ry="42" fill="${SKIN}" ${stroke}/>
  <path d="M-38 -296 Q-38 -336 0 -336 Q38 -336 38 -296 Q26 -318 0 -318 Q-26 -318 -38 -296 Z" fill="#5d3a1a" ${st(4)}/>
  <g data-part="hat">
    <path d="M-46 -300 Q-50 -352 0 -356 Q50 -352 46 -300" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
    <path d="M-46 -300 Q-50 -352 0 -356 Q50 -352 46 -300" fill="none" stroke="#6d4426" stroke-width="13" stroke-linecap="round"/>
    ${[[-44, -316], [-36, -336], [-20, -350], [0, -354], [20, -350], [36, -336], [44, -316]].map(([x, y]) => `<path d="M${x - 5} ${y + 3} l5 -6 l5 6" stroke="#4e2f18" stroke-width="3" fill="none"/>`).join('')}
    <circle cx="36" cy="-338" r="8" fill="#e53935" ${st(2)}/><circle cx="46" cy="-326" r="6" fill="#fdd835" ${st(2)}/>
  </g>
  ${eyes(0, -296, 30, 6)}
  ${closedEyes(0, -296, 30, 6)}
  <ellipse cx="0" cy="-282" rx="6" ry="5" fill="#e8a383"/>
  <ellipse cx="-22" cy="-276" rx="9" ry="5" fill="#f0786a" opacity=".6"/>
  <ellipse cx="22" cy="-276" rx="9" ry="5" fill="#f0786a" opacity=".6"/>
  ${mouth(`<path d="M-11 -266 q11 9 22 0" fill="none" ${st(4)}/>`, `<path d="M-11 -268 q11 16 22 0 z" fill="#7a2a1a" ${st(3)}/>`)}
  <path d="M-32 -252 l-4 8 M32 -252 l4 8" stroke="#f2c94c" stroke-width="5" stroke-linecap="round"/>
</g>`;

/**
 * The hunter: a green hat with a pheasant feather (data-part hat), a bushy brown moustache
 * (data-part beard), a green jacket with a belt and a leather pouch, brown trousers, tall boots,
 * the gun slung on his back (its barrel over his shoulder).
 */
export const myslyvets = () => `
<g data-part="body">
  <!-- the gun on his back, the barrel up over his left shoulder -->
  <path d="M-70 -110 L118 -344" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
  <path d="M-70 -110 L118 -344" stroke="#546e7a" stroke-width="8" stroke-linecap="round"/>
  <path d="M-92 -70 L-56 -140 L-40 -128 L-66 -66 Z" fill="#8d5524" ${st(4)}/>
  <!-- tall boots and trousers -->
  <path d="M-38 -130 L-40 -60 L-6 -60 L-4 -130 Z M4 -130 L6 -60 L40 -60 L38 -130 Z" fill="#8d6e63" ${stroke}/>
  <path d="M-44 0 V-66 H-4 V-20 Q-4 0 -20 0 Z M44 0 V-66 H4 V-20 Q4 0 20 0 Z" fill="#4e342e" ${stroke}/>
  <path d="M-58 0 q0 -16 16 -20 h20 v20 z M58 0 q0 -16 -16 -20 h-20 v20 z" fill="#3e2723" ${st(4)}/>
  <path d="M-44 -60 h40 M4 -60 h40" stroke="#6d4c41" stroke-width="8"/>
  <g data-dress="legs"></g>
  <!-- the green jacket, its pockets and buttons, the belt with a pouch -->
  <path d="M-64 -262 Q-82 -190 -72 -116 L72 -116 Q82 -190 64 -262 Q0 -282 -64 -262 Z" fill="#558b2f" ${stroke}/>
  <path d="M0 -270 V-118" stroke="${INK}" stroke-width="3"/>
  ${[-240, -206, -172].map((y) => `<circle cx="-8" cy="${y}" r="5" fill="#a1887f" ${st(2)}/>`).join('')}
  <path d="M-56 -210 h30 v22 h-30 z M26 -210 h30 v22 h-30 z" fill="#689f38" ${st(3)}/>
  <rect x="-74" y="-150" width="148" height="18" rx="5" fill="#6d4426" ${st(4)}/>
  <rect x="-12" y="-152" width="24" height="22" rx="3" fill="#ffca28" ${st(3)}/><rect x="-5" y="-146" width="10" height="10" fill="#6d4426"/>
  <path d="M30 -134 h34 v40 q-17 10 -34 0 z" fill="#8d6e63" ${st(3)}/><path d="M30 -134 q17 14 34 0" fill="#a1887f" ${st(3)}/>
  <!-- the gun's strap across his chest -->
  <path d="M-58 -252 L50 -126" stroke="#795548" stroke-width="9"/>
  <!-- arms -->
  ${limb('M-62 -256 Q-100 -206 -92 -146', '#558b2f', 24)}
  ${limb('M62 -256 Q100 -206 92 -146', '#558b2f', 24)}
  <path d="M-104 -160 h22 M82 -160 h22" stroke="#33691e" stroke-width="6"/>
  <g data-dress="torso"></g>
  <circle cx="-92" cy="-136" r="14" fill="${SKIN}" ${st(4)}/>
  <circle cx="92" cy="-136" r="14" fill="${SKIN}" ${st(4)}/>
  <!-- the head -->
  <ellipse cx="0" cy="-314" rx="44" ry="46" fill="${SKIN}" ${stroke}/>
  <circle cx="-44" cy="-310" r="10" fill="${SKIN}" ${st(4)}/>
  <circle cx="44" cy="-310" r="10" fill="${SKIN}" ${st(4)}/>
  <path d="M-42 -326 Q-40 -356 -20 -356 L20 -356 Q40 -356 42 -326 Q30 -340 0 -340 Q-30 -340 -42 -326 Z" fill="#6d4426" ${st(3)}/>
  ${mouth(`<path d="M-10 -276 q10 6 20 0" fill="none" ${st(4)}/>`, `<ellipse cx="0" cy="-274" rx="10" ry="8" fill="#7a2a1a" ${st(3)}/>`)}
  <path data-part="beard" d="M-4 -292 Q-20 -302 -38 -290 Q-42 -278 -28 -280 Q-16 -288 -4 -282 Q0 -286 4 -282 Q16 -288 28 -280 Q42 -278 38 -290 Q20 -302 4 -292 Z" fill="#6d4426" ${st(3)}/>
  <ellipse cx="0" cy="-302" rx="9" ry="8" fill="#e8a383"/>
  ${eyes(0, -322, 32, 6)}
  ${closedEyes(0, -322, 32, 6)}
  <path d="M-28 -338 l18 -2 M28 -338 l-18 -2" stroke="#4e342e" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-26" cy="-300" rx="8" ry="5" fill="#f19a8e" opacity=".6"/>
  <ellipse cx="26" cy="-300" rx="8" ry="5" fill="#f19a8e" opacity=".6"/>
  <g data-part="hat">
    <!-- the hunter's hat: a green crown with a dent, a band, a feather -->
    <path d="M-40 -352 Q-40 -408 0 -404 Q40 -408 40 -352 Z" fill="#33691e" ${stroke}/>
    <path d="M-12 -404 q12 10 24 0" stroke="#1b5e20" stroke-width="4" fill="none"/>
    <path d="M-40 -366 H40" stroke="#6d4426" stroke-width="10"/>
    <ellipse cx="0" cy="-352" rx="68" ry="12" fill="#33691e" ${stroke}/>
    <path d="M30 -368 Q60 -420 96 -446 Q74 -404 36 -362 Z" fill="#a1887f" ${st(3)}/>
    <path d="M34 -366 Q62 -410 92 -440" stroke="#5d4037" stroke-width="2.5" fill="none"/>
    <path d="M52 -392 l10 -2 M62 -408 l10 -2 M74 -422 l9 -2" stroke="#fff" stroke-width="2.5"/>
  </g>
</g>`;

/**
 * The woodcutter: a big fellow in a red-and-black checked shirt, a woolly brown cap, a ginger
 * beard, braces, an axe on his shoulder.
 */
export const drovorub = () => {
  let checks = '';
  for (let i = 0; i < 6; i++) checks += `<path d="M${-60 + i * 24} -268 V-120" stroke="#212121" stroke-width="7" opacity=".55"/>`;
  for (let i = 0; i < 6; i++) checks += `<path d="M-70 ${-250 + i * 24} H70" stroke="#212121" stroke-width="7" opacity=".55"/>`;
  return `
<g data-part="body">
  <path d="M-38 -126 L-40 -14 L-6 -14 L-4 -126 Z M4 -126 L6 -14 L40 -14 L38 -126 Z" fill="#37474f" ${stroke}/>
  <path d="M-56 0 q2 -18 14 -18 h34 v18 z M56 0 q-2 -18 -14 -18 h-34 v18 z" fill="#4e342e" ${st(4)}/>
  <g data-dress="legs"></g>
  <path d="M-70 -270 Q-86 -190 -76 -118 L76 -118 Q86 -190 70 -270 Q0 -290 -70 -270 Z" fill="#c62828" ${stroke}/>
  <clipPath id="drovorub-shirt"><path d="M-70 -270 Q-86 -190 -76 -118 L76 -118 Q86 -190 70 -270 Q0 -290 -70 -270 Z"/></clipPath>
  <g clip-path="url(#drovorub-shirt)">${checks}</g>
  <path d="M-70 -270 Q-86 -190 -76 -118 L76 -118 Q86 -190 70 -270 Q0 -290 -70 -270 Z" fill="none" ${stroke}/>
  <path d="M-36 -276 V-118 M36 -276 V-118" stroke="#3e2723" stroke-width="9"/>
  ${limb('M-66 -262 Q-104 -210 -96 -148', '#c62828', 26)}
  <g data-dress="torso"></g>
  <circle cx="-96" cy="-138" r="15" fill="${SKIN}" ${st(4)}/>
  <!-- the axe on his right shoulder: the handle down to his hand, the head up behind -->
  <path d="M96 -140 L40 -380" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M96 -140 L40 -380" stroke="#c8955a" stroke-width="9" stroke-linecap="round"/>
  <path d="M30 -392 Q4 -420 -8 -396 Q-14 -364 22 -352 L48 -362 Z" fill="#b0bec5" ${st(4)}/>
  <path d="M-4 -398 Q-12 -372 16 -358" stroke="#eceff1" stroke-width="4" fill="none"/>
  ${limb('M66 -262 Q104 -210 96 -148', '#c62828', 26)}
  <circle cx="96" cy="-138" r="15" fill="${SKIN}" ${st(4)}/>
  <!-- the head, the ginger beard, the woolly cap -->
  <ellipse cx="0" cy="-322" rx="46" ry="48" fill="${SKIN}" ${stroke}/>
  <path data-part="beard" d="M-46 -318 Q-52 -240 0 -226 Q52 -240 46 -318 Q34 -288 0 -290 Q-34 -288 -46 -318 Z" fill="#e07a2e" ${stroke}/>
  ${mouth(`<path d="M-12 -280 q12 8 24 0" fill="none" ${st(4)}/>`, `<ellipse cx="0" cy="-278" rx="11" ry="8" fill="#7a2a1a" ${st(3)}/>`)}
  <ellipse cx="0" cy="-304" rx="10" ry="9" fill="#e8a383"/>
  ${eyes(0, -326, 32, 6)}
  ${closedEyes(0, -326, 32, 6)}
  <path d="M-30 -344 l18 -2 M30 -344 l-18 -2" stroke="#bf5f1c" stroke-width="7" stroke-linecap="round"/>
  <g data-part="hat">
    <path d="M-48 -340 Q-50 -400 0 -404 Q50 -400 48 -340 Z" fill="#795548" ${stroke}/>
    <path d="M-50 -350 H50 V-336 H-50 Z" fill="#5d4037" ${st(4)}/>
    <path d="M-30 -394 v40 M-10 -402 v46 M10 -402 v46 M30 -394 v40" stroke="#6d4c41" stroke-width="4"/>
    <circle cx="0" cy="-408" r="14" fill="#a1887f" ${st(3)}/>
  </g>
</g>`;
};

// ---------- the grandmother and the wolf, in bed ----------

/** a white frilled nightcap round a face whose middle is at cx, cy (rx, ry: the face) */
const nightcap = (cx: number, cy: number, rx: number, ry: number, k = 1) => {
  let frill = '';
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * (0.95 + (i / n) * 1.1);
    frill += `<circle cx="${(cx + Math.cos(a) * (rx + 8 * k)).toFixed(1)}" cy="${(cy + Math.sin(a) * (ry + 8 * k)).toFixed(1)}" r="${9 * k}" fill="#fff" ${st(2.5)}/>`;
  }
  return frill;
};

/**
 * Grandma sick in bed: baba of characters.ts in a big white frilled nightcap over her headscarf,
 * round glasses on her nose, a knitted shawl round her shoulders.
 */
export const baba_chepets = () => {
  const base = baba();
  const cap =
    `<path d="M-66 -262 Q-74 -360 0 -366 Q74 -360 66 -262 Q60 -224 0 -220 Q-60 -224 -66 -262 Z M-38 -282 Q-40 -318 0 -320 Q40 -318 38 -282 Q36 -246 0 -244 Q-36 -246 -38 -282 Z" fill="#fdfdfb" fill-rule="evenodd" ${stroke}/>` +
    nightcap(0, -282, 38, 38) +
    `<path d="M-30 -350 Q0 -336 30 -350" stroke="#f8bbd0" stroke-width="6" fill="none"/>` +
    `<path d="M0 -226 l-22 -10 v22 z M0 -226 l22 -10 v22 z" fill="#f48fb1" ${st(3)}/><circle cx="0" cy="-226" r="5" fill="#ec407a" ${st(2)}/>` +
    `<circle cx="-15" cy="-292" r="13" fill="#fff" fill-opacity=".25" ${st(3)}/><circle cx="15" cy="-292" r="13" fill="#fff" fill-opacity=".25" ${st(3)}/><path d="M-2 -292 h4" ${st(3)}/>` +
    `<path d="M-64 -236 Q0 -196 64 -236 L70 -190 Q0 -160 -70 -190 Z" fill="#9575cd" ${st(4)}/>` +
    `<path d="M-50 -214 l10 10 M-30 -204 l10 10 M-10 -198 l10 10 M10 -198 l10 10 M30 -204 l10 10" stroke="#d1c4e9" stroke-width="3"/>`;
  // the cap over her head, under her eyes and mouth (they are drawn last)
  return base.replace('<g data-part="eyes"', `<g>${cap}</g><g data-part="eyes"`);
};

/** the wolf of characters.ts in grandma's nightcap and glasses, his big paws out over the blanket */
export const vovk_babusia = () => {
  const paw = (x: number) =>
    `<g transform="translate(${x} -232)"><ellipse rx="24" ry="17" fill="#7d8790" ${st(4)}/><path d="M-12 -12 v10 M0 -15 v12 M12 -12 v10" stroke="${INK}" stroke-width="3"/>` +
    `<path d="M-20 -12 l-4 -10 M-6 -16 l-2 -11 M8 -16 l2 -11 M20 -12 l4 -10" stroke="#eceff1" stroke-width="4" stroke-linecap="round"/></g>`;
  return vovk().replace(
    /<\/g>\s*$/,
    // the cap over his head (the ears pushed flat under it), its frill round his face
    `<path d="M-40 -286 Q-50 -376 18 -380 Q86 -376 76 -282 Q60 -318 18 -322 Q-24 -318 -40 -286 Z" fill="#fdfdfb" ${stroke}/>` +
      [-34, -20, -2, 18, 38, 56, 70].map((x, i) => `<circle cx="${x}" cy="${-296 - Math.sin((i / 6) * Math.PI) * 24}" r="9" fill="#fff" ${st(2.5)}/>`).join('') +
      `<path d="M-6 -364 Q20 -350 50 -364" stroke="#f8bbd0" stroke-width="6" fill="none"/>` +
      `<path d="M-36 -284 Q-40 -240 -14 -228 M72 -280 Q70 -240 42 -230" stroke="#f8bbd0" stroke-width="6" fill="none"/><path d="M14 -226 l-20 -10 v20 z M14 -226 l20 -10 v20 z" fill="#f48fb1" ${st(3)}/>` +
      // round glasses on the snout
      `<circle cx="-17" cy="-282" r="14" fill="#fff" fill-opacity=".25" ${st(3)}/><circle cx="17" cy="-282" r="14" fill="#fff" fill-opacity=".25" ${st(3)}/><path d="M-3 -284 h6 M31 -284 l18 -6" ${st(3)}/>` +
      paw(-62) +
      paw(62) +
      `</g>`,
  );
};

/**
 * Grandma's bed, the part behind whoever lies in it: a tall carved wooden headboard on the right
 * with a heart cut in it, a big white pillow against it. The quilt (kovdra) goes in front.
 */
export const lizhko_babusi = () => `
<g data-part="body">
  <path d="M150 -10 V-400 Q200 -446 250 -400 V-10 Z" fill="#a0703c" ${stroke}/>
  <path d="M168 -60 V-380 Q200 -412 232 -380 V-60 Z" fill="#c8955a" ${st(4)}/>
  <path d="M200 -330 c-16 -20 -40 0 -20 22 l20 18 l20 -18 c20 -22 -4 -42 -20 -22 z" fill="#8b5a2b" ${st(3)}/>
  <circle cx="200" cy="-412" r="14" fill="#a0703c" ${st(4)}/>
  <path d="M-250 -150 H160 V-110 H-250 Z" fill="#8b5a2b" ${st(4)}/>
  <path d="M-246 -196 H164 V-140 H-246 Z" fill="#fafafa" ${st(3)}/>
  <path d="M40 -240 Q20 -300 70 -304 Q140 -310 170 -296 Q190 -240 170 -184 Q110 -174 60 -180 Q28 -196 40 -240 Z" fill="#fff" ${stroke}/>
  <path d="M70 -280 q40 -8 80 2" stroke="#e0e0e0" stroke-width="4" fill="none"/>
</g>`;

/**
 * Grandma's quilt, in front: a patchwork of bright squares with a white frill, over the bed from the
 * footboard (left) to the pillow; the bed's frame and short legs; its top edge 170 above the floor.
 */
export const kovdra = () => {
  const colors = ['#ef9a9a', '#fff59d', '#a5d6a7', '#90caf9', '#ce93d8', '#ffcc80'];
  let patches = '';
  for (let r = 0; r < 3; r++)
    for (let i = 0; i < 8; i++) {
      const x = -230 + i * 50;
      const y = -192 + r * 44;
      patches += `<rect x="${x}" y="${y}" width="50" height="44" fill="${colors[(i + r * 2) % colors.length]}"/>`;
      if ((i + r) % 3 === 0) patches += `<circle cx="${x + 25}" cy="${y + 22}" r="8" fill="#fff" opacity=".8"/>`;
    }
  return `
<g data-part="body">
  <path d="M-280 0 V-300 Q-250 -330 -220 -300 V0 Z" fill="#a0703c" ${stroke}/>
  <path d="M-266 -40 V-280 Q-250 -298 -234 -280 V-40 Z" fill="#c8955a" ${st(3)}/>
  <circle cx="-250" cy="-314" r="12" fill="#a0703c" ${st(4)}/>
  <rect x="-240" y="-66" width="420" height="30" fill="#8b5a2b" ${st(4)}/>
  <path d="M-200 -36 v36 M150 -36 v36" stroke="#6d4426" stroke-width="16" stroke-linecap="round"/>
  <clipPath id="kovdra-quilt"><path d="M-232 -170 Q-30 -186 180 -166 L176 -60 Q-30 -48 -232 -60 Z"/></clipPath>
  <g clip-path="url(#kovdra-quilt)">${patches}</g>
  <path d="M-232 -170 Q-30 -186 180 -166 L176 -60 Q-30 -48 -232 -60 Z" fill="none" ${stroke}/>
  <path d="M-232 -60 Q-30 -48 176 -60" stroke="#fff" stroke-width="10" stroke-dasharray="12 8" fill="none"/>
  <path d="M-232 -170 Q-30 -186 180 -166" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M-232 -170 Q-30 -186 180 -166" stroke="${INK}" stroke-width="3" fill="none" stroke-dasharray="4 10"/>
</g>`;
};

/** the wolf's grey tail poking out from under the quilt at the foot of the bed (its root at 0, 0) */
export const khvist = () => `
<g data-part="body">
  <path d="M0 0 Q-60 10 -110 -10 Q-150 -30 -140 -60 Q-110 -40 -70 -40 Q-30 -40 0 -30 Z" fill="#7d8790" ${stroke}/>
  <path d="M-110 -12 Q-146 -30 -140 -60 Q-120 -40 -96 -36 Z" fill="#d6d9dc" ${st(3)}/>
  <path d="M-40 -20 q-10 -6 -20 -2 M-70 -22 q-8 -6 -18 -2" stroke="#5a636b" stroke-width="3" fill="none"/>
</g>`;

// ---------- grandma's cottage ----------

/**
 * Grandma's cottage by the forest: whitewashed walls, a thatched roof with a chimney, a round
 * window with a flower box (at x 120, y −250), the plank door on the left (x −90) with a wooden
 * latch and the string hanging from it — pull it, and the door opens; a step, a bench, hollyhocks.
 */
export const khatynka_babusi = () => `
<g data-part="body">
  <!-- the chimney -->
  <rect x="120" y="-500" width="54" height="120" fill="#c9603f" ${stroke}/>
  <rect x="112" y="-512" width="70" height="20" fill="#8e3a26" ${st(4)}/>
  <!-- the walls -->
  <rect x="-250" y="-330" width="500" height="330" fill="#fbf6ea" ${stroke}/>
  <path d="M-250 -40 H250 V0 H-250 Z" fill="#7aa6d8" ${st(4)}/>
  <!-- the thatched roof -->
  <path d="M-300 -310 Q-150 -470 0 -476 Q150 -470 300 -310 Q150 -330 0 -326 Q-150 -330 -300 -310 Z" fill="#e2b85a" ${stroke}/>
  ${Array.from({ length: 16 }, (_, i) => `<path d="M${-260 + i * 34} -318 Q${-200 + i * 26} -390 ${-120 + i * 16} -460" stroke="#c99a3e" stroke-width="4" fill="none"/>`).join('')}
  <path d="M-300 -310 Q-150 -330 0 -326 Q150 -330 300 -310" stroke="#b5862f" stroke-width="10" fill="none"/>
  <!-- the door: planks, the latch, the string -->
  <rect x="-160" y="-230" width="140" height="230" rx="8" fill="#8b5a2b" ${stroke}/>
  <path d="M-125 -226 V-4 M-90 -226 V-4 M-55 -226 V-4" stroke="#6d4426" stroke-width="4"/>
  <path d="M-160 -190 h140 M-160 -50 h140" stroke="#5d4037" stroke-width="10"/>
  <rect x="-48" y="-140" width="40" height="14" rx="5" fill="#c8955a" ${st(3)}/>
  <path d="M-30 -126 Q-26 -96 -34 -70" stroke="#efe6cf" stroke-width="5" fill="none"/>
  <circle cx="-34" cy="-68" r="7" fill="#e53935" ${st(2)}/>
  <rect x="-178" y="-14" width="176" height="18" rx="4" fill="#a1887f" ${st(4)}/>
  <!-- the round window with lace curtains, a flower box under it -->
  <circle cx="120" cy="-230" r="62" fill="#9fd3f0" ${stroke}/>
  <path d="M120 -292 V-168 M58 -230 H182" stroke="#5a3a22" stroke-width="7"/>
  <path d="M62 -258 Q84 -232 70 -196 L60 -230 Z M178 -258 Q156 -232 170 -196 L180 -230 Z" fill="#fff" ${st(2)}/>
  <circle cx="120" cy="-230" r="62" fill="none" stroke="#5a3a22" stroke-width="10"/>
  <rect x="50" y="-168" width="140" height="26" rx="5" fill="#8d6e63" ${st(4)}/>
  ${[64, 92, 120, 148, 176].map((x, i) => `<circle cx="${x}" cy="-178" r="11" fill="${['#e53935', '#f06292', '#fdd835', '#e53935', '#f06292'][i]}" ${st(2)}/><circle cx="${x}" cy="-178" r="4" fill="#fff59d"/>`).join('')}
  <!-- a bench under the window -->
  <rect x="40" y="-70" width="170" height="16" rx="5" fill="#a0703c" ${st(4)}/>
  <path d="M56 -54 v54 M194 -54 v54" stroke="#6d4426" stroke-width="10"/>
  <!-- hollyhocks by the corner -->
  ${[230, 266].map((x, k) => `<path d="M${x} 0 V${-260 + k * 40}" stroke="#3d7a30" stroke-width="6"/>` + [0, 1, 2, 3].map((i) => `<circle cx="${x + (i % 2 ? 8 : -8)}" cy="${-240 + k * 40 + i * 44}" r="16" fill="${k ? '#ec407a' : '#ab47bc'}" ${st(3)}/><circle cx="${x + (i % 2 ? 8 : -8)}" cy="${-240 + k * 40 + i * 44}" r="5" fill="#fff59d"/>`).join('')).join('')}
</g>`;

// ---------- in the forest ----------

/** a patch of meadow flowers (a different bunch for each seed) */
const flowers = (seed: number) => () => {
  const cols = ['#e53935', '#fff', '#8e24aa', '#fdd835', '#1e88e5', '#ff7043'];
  let s = '';
  for (let i = 0; i < 9; i++) {
    const x = -130 + i * 32 + ((i * seed * 7) % 13) - 6;
    const h = 60 + ((i * 37 + seed * 11) % 50);
    const c = cols[(i + seed) % cols.length];
    s += `<path d="M${x} 0 Q${x + 6} ${-h / 2} ${x} ${-h}" stroke="#3d7a30" stroke-width="5" fill="none"/>`;
    s += `<path d="M${x} ${-h / 3} q-16 -4 -20 -16 q14 0 20 16 z" fill="#66bb6a" ${st(1.5)}/>`;
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      s += `<circle cx="${(x + Math.cos(a) * 10).toFixed(1)}" cy="${(-h + Math.sin(a) * 10).toFixed(1)}" r="8" fill="${c}" ${st(1.5)}/>`;
    }
    s += `<circle cx="${x}" cy="${-h}" r="6" fill="${c === '#fdd835' ? '#ff8f00' : '#ffd54f'}"/>`;
  }
  return `<g data-part="body"><path d="M-160 4 Q0 -24 160 4 Z" fill="#7cb342"/>${s}</g>`;
};
export const kvity = flowers(1);
export const kvity2 = flowers(4);

/** two butterflies, a yellow one and a blue one: their wings flutter (fast when they fly) */
export const metelyky = () => {
  const fly = (x: number, y: number, a: string, b: string) => `
  <path d="M${x} ${y - 10} l-8 -16 M${x} ${y - 10} l8 -16" stroke="${INK}" stroke-width="2.5"/>
  <path d="M${x} ${y} Q${x - 46} ${y - 54} ${x - 40} ${y - 8} Q${x - 46} ${y + 30} ${x} ${y + 6} Z" fill="${a}" ${st(3)}/>
  <path d="M${x} ${y} Q${x + 46} ${y - 54} ${x + 40} ${y - 8} Q${x + 46} ${y + 30} ${x} ${y + 6} Z" fill="${a}" ${st(3)}/>
  <circle cx="${x - 22}" cy="${y - 14}" r="6" fill="${b}"/><circle cx="${x + 22}" cy="${y - 14}" r="6" fill="${b}"/>
  <ellipse cx="${x}" cy="${y}" rx="5" ry="16" fill="${INK}"/>`;
  return `<g data-part="body"><g data-part="wings" data-cy="-60">${fly(-50, -80, '#ffd54f', '#e65100')}${fly(60, -30, '#4fc3f7', '#283593')}</g></g>`;
};

/** a pile of big grey stones */
export const kaminnia = () => `
<g data-part="body">
  <path d="M-110 0 Q-120 -56 -70 -64 Q-30 -66 -20 -20 Q-24 0 -60 0 Z" fill="#9e9e9e" ${stroke}/>
  <path d="M-30 0 Q-40 -70 20 -76 Q80 -74 80 -20 Q76 0 40 0 Z" fill="#8d8d8d" ${stroke}/>
  <path d="M60 0 Q56 -44 96 -48 Q130 -46 124 -10 Q118 0 96 0 Z" fill="#a8a8a8" ${stroke}/>
  <path d="M-60 -70 Q-70 -110 -20 -114 Q26 -110 20 -72 Q-20 -60 -60 -70 Z" fill="#bdbdbd" ${stroke}/>
  <path d="M-84 -40 q16 -8 30 -2 M0 -50 q20 -10 40 0 M-40 -96 q14 -6 30 0" stroke="#6d6d6d" stroke-width="4" fill="none"/>
</g>`;

/** the basket of pies and the pot of butter on its own (the girl's: put down on the table) */
export const koshyk_pyrizhky = () => `<g data-part="body">${basket(0, 0, 1.1)}</g>`;

// ---------- the cover ----------

/** the cover: the girl with her basket on the path, the wolf peeping out from behind an oak */
export const chervona_shapochka_cover = () => `
<g>
  <path d="M-300 30 Q-100 -20 0 0 Q140 20 300 -10 V60 H-300 Z" fill="#8bc34a"/>
  <g transform="translate(110 0)">
    <g transform="translate(60 0) scale(.9)">${vovk()}</g>
    <path d="M50 4 Q74 -200 64 -480 L150 -480 Q140 -200 170 4 Z" fill="#8b5a2b" ${stroke}/>
    <path d="M84 -60 q10 -40 0 -80 M120 -220 q-10 -40 0 -90" stroke="#6d4426" stroke-width="5" fill="none"/>
    <circle cx="40" cy="-520" r="100" fill="#4c9a44" ${stroke}/><circle cx="160" cy="-500" r="96" fill="#5fb052" ${stroke}/><circle cx="100" cy="-600" r="86" fill="#5fb052" ${stroke}/>
  </g>
  ${flowers(2)().replace('<g data-part="body">', '<g transform="translate(-170 12) scale(.6)">')}
  <g transform="translate(-70 0)">${girl({ hood: true, basket: true })}</g>
</g>`;
