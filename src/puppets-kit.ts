// The puppets of «Кіт у чоботях»: the ginger Cat in Boots (barefoot at first: look bosyi), the
// miller's youngest son — poor (syn) and in the king's fine clothes (markiz: the same body, so the
// marquis's things fit both), the king, the princess, the ogre and what he turns into (a lion, a
// little mouse, a balloon), the elder brothers with the donkey, the mowers and the reapers, the
// royal carriage, a rabbit, partridges, the river's water (in front: whoever is in it shows from the
// waist up), the old clothes and the cat's fish stall. Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stitch, stroke } from './characters';

const SKIN = '#f2c4a0';
const GINGER = '#f0a04b';
const GINGER_DARK = '#c46a1c';
const CREAM = '#fde7c8';

/** a thick arm: the ink outline, then the sleeve's colour over it */
const arm = (d: string, fill: string, w = 26) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;

/** a five-pointed star */
const star = (x: number, y: number, r: number, fill: string, outline = '') => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)} `;
  }
  return `<path d="${d}Z" fill="${fill}" ${outline}/>`;
};

// ---------- the Cat in Boots ----------

/**
 * The Cat in Boots: ginger and cream, standing on his hind legs (his face turned to us: two big green
 * eyes). His big cuffed boots (data-part="boots": off for other shoes), a brown hat with a red plume
 * (data-part="hat") and a bag on a strap across his chest (data-part="collar": off for a thing worn
 * round the neck). Barefoot (look bosyi): no boots, hat or bag yet.
 */
const kitChobotar = (dressed: boolean) => {
  const boot = `
    <path d="M-36 -84 L-34 -16 L-6 -16 L-4 -84 Z" fill="#5d3a1e" ${st(4)}/>
    <path d="M-6 -20 L-4 0 L-60 0 Q-66 -18 -36 -22 Z" fill="#5d3a1e" ${st(4)}/>
    <path d="M-46 -98 L-40 -72 L2 -72 L8 -98 Q-20 -108 -46 -98 Z" fill="#8b5a2b" ${st(4)}/>
    <rect x="-29" y="-50" width="18" height="13" rx="2" fill="#ffd54f" ${st(2.5)}/>
    <path d="M-52 -4 q10 -6 22 -4" stroke="#8b6040" stroke-width="3" fill="none"/>`;
  const paw = (x: number) => `<ellipse cx="${x}" cy="-9" rx="22" ry="10" fill="${CREAM}" ${st(4)}/><path d="M${x - 8} -14 v6 M${x} -15 v7 M${x + 8} -14 v6" stroke="${INK}" stroke-width="2"/>`;
  return `
<g data-part="body">
  <!-- tail, curling up behind (swishes) -->
  <g data-part="tail" data-cx="30" data-cy="-80">
    <path d="M30 -80 Q100 -78 104 -150 Q106 -196 74 -206" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/>
    <path d="M30 -80 Q100 -78 104 -150 Q106 -196 74 -206" fill="none" stroke="${GINGER}" stroke-width="17" stroke-linecap="round"/>
    <path d="M94 -110 l14 2 M100 -142 l14 -2 M92 -180 l12 -8" stroke="${GINGER_DARK}" stroke-width="6" stroke-linecap="round"/>
  </g>
  <!-- legs -->
  <path d="M-32 -120 L-30 -14 L-8 -14 L-6 -120 Z M6 -120 L8 -14 L30 -14 L32 -120 Z" fill="${GINGER}" ${st(4)}/>
  ${dressed ? `<g data-part="boots">${boot}<g transform="scale(-1 1)">${boot}</g></g>` : `<path d="M-30 -60 L-30 -10 L-8 -10 L-8 -60 Z M8 -60 L8 -10 L30 -10 L30 -60 Z" fill="${GINGER}"/>${paw(-24)}${paw(24)}`}
  <g data-dress="legs"></g>
  <!-- the body: ginger, a cream belly, darker stripes on the sides -->
  <path d="M-46 -72 Q-58 -150 -36 -198 Q0 -214 36 -198 Q58 -150 46 -72 Q0 -56 -46 -72 Z" fill="${GINGER}" ${stroke}/>
  <path d="M-24 -188 Q-32 -130 -20 -78 Q0 -68 20 -78 Q32 -130 24 -188 Q0 -198 -24 -188 Z" fill="${CREAM}"/>
  <path d="M-48 -150 l14 4 M-50 -120 l14 2 M-48 -92 l12 0 M48 -150 l-14 4 M50 -120 l-14 2 M48 -92 l-12 0" stroke="${GINGER_DARK}" stroke-width="6" stroke-linecap="round"/>
  <!-- arms: one paw on his hip, the other raised as if greeting -->
  ${arm('M-36 -190 Q-72 -160 -56 -126', GINGER, 16)}
  ${arm('M36 -190 Q72 -176 66 -136', GINGER, 16)}
  <g data-dress="torso"></g>
  <circle cx="-54" cy="-122" r="12" fill="${CREAM}" ${st(4)}/>
  <circle cx="66" cy="-130" r="12" fill="${CREAM}" ${st(4)}/>
  ${
    dressed
      ? `<!-- the bag on its strap -->
  <g data-part="collar">
    <path d="M34 -196 L-46 -96" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M34 -196 L-46 -96" stroke="#8b5a2b" stroke-width="7" stroke-linecap="round"/>
    <path d="M-82 -112 L-78 -62 Q-58 -54 -38 -62 L-34 -112 Q-58 -118 -82 -112 Z" fill="#c8a06e" ${st(4)}/>
    <path d="M-84 -112 Q-58 -122 -32 -112 L-36 -90 Q-58 -84 -80 -90 Z" fill="#a1704a" ${st(3.5)}/>
    <circle cx="-58" cy="-90" r="5" fill="#ffd54f" ${st(2)}/>
  </g>`
      : ''
  }
  <!-- the head (tips down to eat) -->
  <g data-part="head" data-cx="0" data-cy="-206">
    <path d="M-50 -266 L-48 -322 L-14 -290 Z" fill="${GINGER}" ${stroke}/>
    <path d="M-44 -280 L-43 -308 L-24 -290 Z" fill="#f4b8b0"/>
    <path d="M14 -290 L48 -322 L50 -266 Z" fill="${GINGER}" ${stroke}/>
    <path d="M24 -290 L43 -308 L44 -280 Z" fill="#f4b8b0"/>
    <ellipse cx="0" cy="-250" rx="54" ry="46" fill="${GINGER}" ${stroke}/>
    <path d="M-12 -294 l6 16 M0 -296 v18 M12 -294 l-6 16" stroke="${GINGER_DARK}" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="-12" cy="-230" rx="24" ry="16" fill="${CREAM}"/>
    <ellipse cx="12" cy="-230" rx="24" ry="16" fill="${CREAM}"/>
    <!-- big green eyes, the sly kind -->
    <g data-part="eyes" data-cx="0" data-cy="-256">
      <ellipse cx="-21" cy="-256" rx="13" ry="14" fill="#9ccc65" ${st(3)}/>
      <ellipse cx="-23" cy="-256" rx="4" ry="10" fill="#2b1a10"/><circle cx="-18" cy="-262" r="3" fill="#fff"/>
      <ellipse cx="21" cy="-256" rx="13" ry="14" fill="#9ccc65" ${st(3)}/>
      <ellipse cx="19" cy="-256" rx="4" ry="10" fill="#2b1a10"/><circle cx="24" cy="-262" r="3" fill="#fff"/>
      <path d="M-34 -268 Q-21 -276 -8 -266 M34 -268 Q21 -276 8 -266" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    </g>
    ${closedEyes(0, -254, 42, 8)}
    <path d="M-7 -240 h14 l-7 8 z" fill="#f06292" ${st(2)}/>
    <path d="M-24 -230 l-48 -8 M-24 -224 l-48 4 M-22 -218 l-40 14 M24 -230 l48 -8 M24 -224 l48 4 M22 -218 l40 14" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    ${mouth(
      `<path d="M-12 -228 q6 8 12 0 q6 8 12 0" fill="none" ${st(3)}/>`,
      `<path d="M-12 -230 q12 26 24 0 z" fill="#8a2a1a" ${st(3)}/><path d="M-8 -228 l3 6 l3 -6 M2 -228 l3 6 l3 -6" fill="#fff"/>`,
    )}
    ${
      dressed
        ? `<!-- the hat: a wide brown brim turned up on one side, a red-and-white plume -->
    <g data-part="hat">
      <path d="M18 -322 Q70 -386 128 -362 Q104 -350 76 -340 Q104 -338 120 -322 Q76 -318 30 -306 Z" fill="#e53935" ${st(4)}/>
      <path d="M28 -316 Q76 -350 118 -356" fill="none" stroke="#fff" stroke-width="4"/>
      <path d="M-44 -296 Q-44 -342 -2 -346 Q40 -342 42 -296 Z" fill="#6d4426" ${stroke}/>
      <rect x="-44" y="-312" width="86" height="12" fill="#e53935" ${st(3)}/>
      <path d="M-84 -292 Q-40 -306 0 -300 Q50 -296 82 -288 Q90 -306 70 -318 Q74 -298 40 -300 L-40 -304 Q-74 -306 -84 -292 Z" fill="#8b5a2b" ${stroke}/>
    </g>`
        : ''
    }
  </g>
</g>`;
};

export const kit_chobotar = () => kitChobotar(true);
export const kit_chobotar_bosyi = () => kitChobotar(false);

// ---------- the miller's son: poor, then the marquis ----------

/**
 * The miller's youngest son, a curly-haired lad. Poor (syn): a patched brown shirt with a rope belt,
 * grey patched trousers, old shoes. The Marquis of Carabas (markiz): the same lad in the king's fine
 * clothes — a blue coat with gold trim, a white jabot, white breeches, tall black boots
 * (data-part="boots") and a blue hat with a white feather (data-part="hat").
 */
const lad = (fine: boolean) => {
  const coat = fine ? '#1e5aa8' : '#a1887f';
  const legs = fine ? '#fafafa' : '#8d8a84';
  const patch = (x: number, y: number, c: string) => `<rect x="${x - 10}" y="${y - 9}" width="20" height="18" fill="${c}" ${st(2.5)} transform="rotate(${(x % 9) - 4} ${x} ${y})"/><path d="M${x - 6} ${y - 5} l2 2 M${x + 4} ${y + 3} l2 2" stroke="${INK}" stroke-width="1.5"/>`;
  const boots = fine
    ? `<g data-part="boots"><path d="M-42 -74 L-42 -14 L-6 -14 L-6 -74 Q-24 -80 -42 -74 Z M6 -74 L6 -14 L42 -14 L42 -74 Q24 -80 6 -74 Z" fill="#263238" ${st(4)}/>
       <path d="M-54 0 q2 -18 14 -18 h34 v18 z M54 0 q-2 -18 -14 -18 h-34 v18 z" fill="#263238" ${st(4)}/>
       <path d="M-44 -66 h40 M4 -66 h40" stroke="#ffd54f" stroke-width="5"/></g>`
    : `<path d="M-52 0 q2 -16 14 -16 h30 v16 z M52 0 q-2 -16 -14 -16 h-30 v16 z" fill="#6d4c41" ${st(4)}/>
       <path d="M-46 -6 l6 -2 M42 -8 l6 2" stroke="#3e2723" stroke-width="3"/>`;
  return `
<g data-part="body">
  <path d="M-38 -122 L-40 -14 L-8 -14 L-6 -122 Z M6 -122 L8 -14 L40 -14 L38 -122 Z" fill="${legs}" ${stroke}/>
  ${fine ? '' : patch(-24, -60, '#b0a28e') + patch(24, -92, '#7d8b6a')}
  ${boots}
  <g data-dress="legs"></g>
  <!-- the coat (or the old shirt) -->
  <path d="M-62 -258 Q-82 -180 -74 -100 L74 -100 Q82 -180 62 -258 Q0 -276 -62 -258 Z" fill="${coat}" ${stroke}/>
  ${
    fine
      ? `<path d="M-8 -256 L-8 -102 M8 -256 L8 -102" stroke="#ffd54f" stroke-width="6"/>
  <path d="M-74 -108 H74" stroke="#ffd54f" stroke-width="8"/>
  ${[-226, -196, -166, -136].map((y) => `<circle cx="-22" cy="${y}" r="5" fill="#ffd54f" ${st(2)}/><circle cx="22" cy="${y}" r="5" fill="#ffd54f" ${st(2)}/>`).join('')}
  <path d="M-72 -150 Q0 -138 72 -150 L72 -136 Q0 -124 -72 -136 Z" fill="#c62828" ${st(3)}/>`
      : `${patch(-34, -200, '#d7ccc8')}${patch(40, -150, '#bcaaa4')}${patch(-20, -128, '#8d6e63')}
  <path d="M-74 -142 Q0 -132 74 -142" stroke="#c8a06e" stroke-width="9" fill="none"/><path d="M-10 -138 l-6 24 M-2 -138 l4 22" stroke="#c8a06e" stroke-width="6" stroke-linecap="round"/>
  <path d="M-22 -258 L0 -230 L22 -258" fill="none" ${st(4)}/>`
  }
  ${arm('M-60 -250 Q-96 -200 -88 -142', coat, 22)}
  ${arm('M60 -250 Q96 -200 88 -142', coat, 22)}
  ${fine ? `<path d="M-100 -150 L-76 -148 M76 -148 L100 -150" stroke="#ffd54f" stroke-width="7" stroke-linecap="round"/>` : patch(-84, -196, '#d7ccc8')}
  <g data-dress="torso"></g>
  ${fine ? `<!-- the white jabot --><path d="M-20 -262 Q0 -246 20 -262 L14 -226 Q0 -216 -14 -226 Z" fill="#fff" ${st(3)}/><path d="M-10 -246 q10 8 20 0 M-8 -234 q8 6 16 0" fill="none" stroke="#bdbdbd" stroke-width="2"/>` : ''}
  <circle cx="-88" cy="-132" r="14" fill="${SKIN}" ${st(4)}/>
  <circle cx="88" cy="-132" r="14" fill="${SKIN}" ${st(4)}/>
  <!-- head, curly chestnut hair -->
  <circle cx="-40" cy="-300" r="9" fill="${SKIN}" ${st(4)}/>
  <circle cx="40" cy="-300" r="9" fill="${SKIN}" ${st(4)}/>
  <ellipse cx="0" cy="-304" rx="40" ry="44" fill="${SKIN}" ${stroke}/>
  <path d="M-42 -306 Q-46 -352 -10 -354 Q30 -360 44 -320 Q44 -306 40 -300 Q30 -326 10 -324 L2 -336 L-8 -322 Q-30 -328 -42 -306 Z" fill="#8d4a1e" ${st(4)}/>
  <path d="M-34 -338 q8 -10 16 -2 M-6 -350 q8 -10 16 -2 M20 -344 q8 -8 14 2" fill="none" stroke="#6d3412" stroke-width="3" stroke-linecap="round"/>
  ${fine ? '' : `<path d="M-30 -350 l-14 -16 M-24 -352 l-4 -20 M30 -346 l14 -14" stroke="#e2b45a" stroke-width="4" stroke-linecap="round"/>`}
  ${eyes(0, -308, 30, 6)}
  ${closedEyes(0, -308, 30, 6)}
  <path d="M-24 -322 q8 -5 16 -2 M24 -322 q-8 -5 -16 -2" fill="none" stroke="#6d3412" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="0" cy="-292" rx="7" ry="6" fill="#e8a383"/>
  <ellipse cx="-22" cy="-286" rx="8" ry="5" fill="#f0786a" opacity=".6"/>
  <ellipse cx="22" cy="-286" rx="8" ry="5" fill="#f0786a" opacity=".6"/>
  ${fine ? '' : `<ellipse cx="26" cy="-276" rx="7" ry="4" fill="#a1887f" opacity=".5"/>`}
  ${mouth(
    `<path d="M-11 -276 q11 9 22 0" fill="none" ${st(4)}/>`,
    `<path d="M-11 -278 q11 17 22 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
  ${
    fine
      ? `<g data-part="hat">
    <path d="M-12 -350 Q-60 -410 -110 -392 Q-70 -384 -40 -350 Z" fill="#fff" ${st(3.5)}/>
    <path d="M-20 -354 Q-62 -392 -100 -390" fill="none" stroke="#cfd8dc" stroke-width="3"/>
    <ellipse cx="0" cy="-344" rx="66" ry="13" fill="#1e5aa8" ${stroke}/>
    <path d="M-36 -348 Q-34 -386 0 -388 Q34 -386 36 -348 Z" fill="#1565c0" ${stroke}/>
    <rect x="-36" y="-362" width="72" height="10" fill="#ffd54f" ${st(2.5)}/>
  </g>`
      : ''
  }
</g>`;
};

export const markiz = () => lad(true);
export const syn = () => lad(false);

// ---------- the king and the princess ----------

/** ermine: white fur with little black tails */
const ermine = (spots: [number, number][]) => spots.map(([x, y]) => `<path d="M${x} ${y - 5} l-3 9 h6 z" fill="#212121"/>`).join('');

/**
 * The king: round and jolly, a red robe edged with ermine, a gold belt, a sceptre, a short white
 * beard and a big curly moustache (data-part="beard"), a red nose, a gold crown (data-part="hat").
 */
export const korol = () => `
<g data-part="body">
  <path d="M-36 -100 L-38 -14 L-6 -14 L-4 -100 Z M4 -100 L6 -14 L38 -14 L36 -100 Z" fill="#fafafa" ${st(4)}/>
  <path d="M-54 0 q2 -18 14 -18 h32 v18 z M54 0 q-2 -18 -14 -18 h-32 v18 z" fill="#c62828" ${st(4)}/>
  <rect x="-34" y="-16" width="12" height="8" fill="#ffd54f"/><rect x="22" y="-16" width="12" height="8" fill="#ffd54f"/>
  <g data-dress="legs"></g>
  <!-- the robe, round over the belly -->
  <path d="M-80 -252 Q-118 -160 -90 -84 L90 -84 Q118 -160 80 -252 Q0 -276 -80 -252 Z" fill="#c62828" ${stroke}/>
  <path d="M-16 -246 L-16 -86 L16 -86 L16 -246 Z" fill="#fafafa" ${st(3)}/>
  <path d="M-92 -104 Q0 -92 92 -104 L90 -82 Q0 -72 -90 -82 Z" fill="#fafafa" ${st(3)}/>
  ${ermine([[0, -226], [0, -190], [0, -150], [0, -112], [-70, -92], [-40, -88], [40, -88], [70, -92]])}
  <path d="M-104 -160 Q0 -140 104 -160 L102 -142 Q0 -122 -102 -142 Z" fill="#ffc107" ${st(4)}/>
  <rect x="-16" y="-162" width="32" height="26" rx="5" fill="#ffd54f" ${st(3)}/><circle cx="0" cy="-149" r="6" fill="#1e88e5"/>
  ${arm('M-78 -244 Q-116 -200 -106 -142', '#c62828', 28)}
  ${arm('M78 -244 Q116 -200 106 -142', '#c62828', 28)}
  <path d="M-124 -150 L-90 -146 M90 -146 L124 -150" stroke="#fafafa" stroke-width="12" stroke-linecap="round"/>
  <g data-dress="torso"></g>
  <!-- the ermine collar -->
  <path d="M-86 -256 Q0 -224 86 -256 Q74 -222 0 -212 Q-74 -222 -86 -256 Z" fill="#fafafa" ${st(4)}/>
  ${ermine([[-50, -238], [-20, -228], [20, -228], [50, -238]])}
  <!-- the sceptre in his right hand -->
  <path d="M112 -40 L114 -236" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M112 -40 L114 -236" stroke="#ffc107" stroke-width="7" stroke-linecap="round"/>
  <circle cx="114" cy="-248" r="16" fill="#ffd54f" ${st(4)}/><circle cx="110" cy="-252" r="5" fill="#fff8e1"/>
  ${star(114, -276, 12, '#e53935', st(2.5))}
  <circle cx="-106" cy="-132" r="15" fill="${SKIN}" ${st(4)}/>
  <circle cx="108" cy="-132" r="15" fill="${SKIN}" ${st(4)}/>
  <!-- head -->
  <circle cx="-46" cy="-298" r="10" fill="${SKIN}" ${st(4)}/>
  <circle cx="46" cy="-298" r="10" fill="${SKIN}" ${st(4)}/>
  <ellipse cx="0" cy="-302" rx="46" ry="46" fill="${SKIN}" ${stroke}/>
  <g data-part="beard"><path d="M-44 -294 Q-50 -236 0 -222 Q50 -236 44 -294 Q30 -266 0 -266 Q-30 -266 -44 -294 Z" fill="#f5f5f5" ${stroke}/></g>
  ${mouth('', '<ellipse cx="0" cy="-262" rx="10" ry="8" fill="#7a2a1a"/>')}
  <g data-part="beard"><path d="M0 -276 Q-20 -292 -44 -284 Q-60 -276 -54 -260 Q-50 -276 -34 -276 Q-16 -272 0 -270 Q16 -272 34 -276 Q50 -276 54 -260 Q60 -276 44 -284 Q20 -292 0 -276 Z" fill="#fff" ${st(3.5)}/></g>
  <ellipse cx="0" cy="-286" rx="12" ry="11" fill="#ef9a9a" ${st(3)}/>
  ${eyes(0, -312, 32, 6)}
  ${closedEyes(0, -312, 32, 6)}
  <path d="M-30 -328 q12 -10 24 -2 M30 -328 q-12 -10 -24 -2" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="-28" cy="-292" rx="9" ry="6" fill="#f19a8e" opacity=".7"/>
  <ellipse cx="28" cy="-292" rx="9" ry="6" fill="#f19a8e" opacity=".7"/>
  <g data-part="hat">
    <path d="M-44 -336 Q0 -350 44 -336 L42 -350 Q0 -364 -42 -350 Z" fill="#c62828" ${st(3)}/>
    <path d="M-46 -338 L-54 -394 L-26 -368 L0 -408 L26 -368 L54 -394 L46 -338 Q0 -352 -46 -338 Z" fill="#ffd54f" ${stroke}/>
    <path d="M-46 -346 Q0 -360 46 -346" fill="none" stroke="#ffb300" stroke-width="8"/>
    <circle cx="0" cy="-372" r="8" fill="#e53935" ${st(2.5)}/><circle cx="-30" cy="-354" r="5" fill="#1e88e5"/><circle cx="30" cy="-354" r="5" fill="#43a047"/>
    <circle cx="-54" cy="-398" r="6" fill="#fff59d" ${st(2.5)}/><circle cx="0" cy="-412" r="6" fill="#fff59d" ${st(2.5)}/><circle cx="54" cy="-398" r="6" fill="#fff59d" ${st(2.5)}/>
  </g>
</g>`;

/**
 * The princess: long golden hair, a pink gown with a lacy neckline and puffed sleeves, a skirt down
 * to her shoes with a golden hem, a little tiara (data-part="hat").
 */
export const pryntsesa = () => `
<g data-part="body">
  <ellipse cx="-22" cy="-7" rx="18" ry="8" fill="#ad1457" ${st(3.5)}/>
  <ellipse cx="22" cy="-7" rx="18" ry="8" fill="#ad1457" ${st(3.5)}/>
  <!-- golden hair down her back -->
  <path d="M-38 -282 Q-70 -230 -62 -150 Q-44 -160 -36 -190 Z M38 -282 Q70 -230 62 -150 Q44 -160 36 -190 Z" fill="#ffd54f" ${st(4)}/>
  <!-- the gown's skirt -->
  <path d="M-48 -178 Q-78 -96 -98 -10 Q0 6 98 -10 Q78 -96 48 -178 Z" fill="#f06292" ${stroke}/>
  <path d="M-22 -176 Q-34 -96 -40 -6 L40 -6 Q34 -96 22 -176 Z" fill="#f8bbd0"/>
  <path d="M-96 -16 Q0 0 96 -16" fill="none" stroke="#ffd54f" stroke-width="9"/>
  ${[-70, -40, -10, 20, 50].map((x, i) => `<circle cx="${x + 10}" cy="${-46 - (i % 2) * 40}" r="5" fill="#fff59d" ${st(1.5)}/>`).join('')}
  <path d="M-30 -120 q8 10 16 0 M14 -80 q8 10 16 0 M-50 -60 q8 10 16 0" fill="none" stroke="#ec407a" stroke-width="3"/>
  <g data-dress="legs"></g>
  <!-- the bodice, puffed sleeves, bare arms -->
  <path d="M-44 -248 Q-52 -210 -46 -172 L46 -172 Q52 -210 44 -248 Q0 -262 -44 -248 Z" fill="#ec407a" ${stroke}/>
  <path d="M-46 -178 Q0 -168 46 -178" fill="none" stroke="#ffd54f" stroke-width="7"/>
  ${arm('M-52 -224 Q-76 -194 -62 -162', SKIN, 14)}
  ${arm('M52 -224 Q76 -194 62 -162', SKIN, 14)}
  <circle cx="-52" cy="-224" r="17" fill="#f8bbd0" ${st(4)}/><circle cx="52" cy="-224" r="17" fill="#f8bbd0" ${st(4)}/>
  <g data-dress="torso"></g>
  <path d="M-34 -250 Q0 -226 34 -250" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="6 4"/>
  <circle cx="0" cy="-232" r="6" fill="#e1f5fe" ${st(2)}/>
  <circle cx="-62" cy="-156" r="11" fill="${SKIN}" ${st(4)}/>
  <circle cx="62" cy="-156" r="11" fill="${SKIN}" ${st(4)}/>
  <!-- the head -->
  <ellipse cx="0" cy="-266" rx="36" ry="38" fill="${SKIN}" ${stroke}/>
  <path d="M-40 -264 Q-44 -312 0 -310 Q44 -312 40 -264 Q30 -290 8 -290 Q-6 -284 -14 -292 Q-30 -290 -40 -264 Z" fill="#ffd54f" ${st(4)}/>
  ${eyes(0, -266, 28, 6)}
  ${closedEyes(0, -266, 28, 6)}
  <ellipse cx="-20" cy="-252" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  <ellipse cx="20" cy="-252" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  ${mouth(
    `<path d="M-8 -246 q8 7 16 0" fill="none" stroke="#c2185b" stroke-width="4" stroke-linecap="round"/>`,
    `<path d="M-8 -248 q8 14 16 0 z" fill="#ad1457" ${st(3)}/>`,
  )}
  <g data-part="hat">
    <path d="M-30 -298 L-24 -322 L-12 -306 L0 -332 L12 -306 L24 -322 L30 -298 Q0 -306 -30 -298 Z" fill="#ffd54f" ${st(3.5)}/>
    <circle cx="0" cy="-314" r="5" fill="#ec407a" ${st(2)}/>
  </g>
</g>`;

// ---------- the ogre and his shapes ----------

/** the ogre's black shaggy beard, its top middle at x, y, s: its size */
const ogreBeard = (x: number, y: number, s: number) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M-64 0 Q-92 70 -62 120 Q-46 104 -40 130 Q-20 112 -10 146 Q4 116 14 144 Q26 110 42 130 Q50 102 64 118 Q92 70 64 0 Q40 44 0 42 Q-40 44 -64 0 Z" fill="#2b2b33" ${stroke}/>`;

/**
 * The ogre (Людожер): huge and round, shaggy black hair and a black beard (data-part="beard"), bushy
 * brows, a potato nose, two little tusks, a red caftan with gold buttons over his big belly, a wide
 * belt with a giant fork and knife stuck in it, big boots (data-part="boots") and a tall fur hat
 * (data-part="hat").
 */
export const lyudozher = () => {
  const boot = `<path d="M-66 -96 L-64 -20 L-20 -20 L-18 -96 Z" fill="#4e342e" ${st(4)}/><path d="M-18 -24 L-16 4 L-96 4 Q-104 -22 -62 -26 Z" fill="#4e342e" ${st(4)}/><path d="M-70 -100 h56" stroke="#3e2723" stroke-width="12" stroke-linecap="round"/>`;
  return `
<g data-part="body">
  <path d="M-62 -110 L-60 -16 L-24 -16 L-26 -110 Z M26 -110 L24 -16 L60 -16 L62 -110 Z" fill="#455a64" ${st(4)}/>
  <g data-part="boots">${boot}<g transform="scale(-1 1)">${boot}</g></g>
  <g data-dress="legs"></g>
  <!-- the caftan, wide over his big belly -->
  <path d="M-110 -390 Q-178 -250 -150 -90 Q0 -66 150 -90 Q178 -250 110 -390 Q0 -420 -110 -390 Z" fill="#b23b2e" ${stroke}/>
  <path d="M0 -404 V-80" stroke="#ffd54f" stroke-width="7"/>
  ${[-340, -290, -240, -150, -110].map((y) => `<circle cx="-16" cy="${y}" r="7" fill="#ffd54f" ${st(2.5)}/><circle cx="16" cy="${y}" r="7" fill="#ffd54f" ${st(2.5)}/>`).join('')}
  <path d="M-150 -96 Q0 -72 150 -96" fill="none" stroke="#ffd54f" stroke-width="10"/>
  <!-- the belt, a fork and a knife stuck in it -->
  <path d="M-170 -214 Q0 -182 170 -214 L168 -180 Q0 -148 -168 -180 Z" fill="#3e2723" ${st(4)}/>
  <rect x="-24" y="-206" width="48" height="36" rx="6" fill="#ffd54f" ${st(4)}/><rect x="-12" y="-196" width="24" height="16" fill="#3e2723"/>
  <path d="M-110 -150 L-90 -290" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-110 -150 L-90 -290" stroke="#b0bec5" stroke-width="8" stroke-linecap="round"/>
  <path d="M-104 -286 l-6 -50 M-92 -288 l-2 -50 M-80 -286 l4 -50 M-106 -290 Q-92 -300 -78 -290" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
  <path d="M-104 -286 l-6 -50 M-92 -288 l-2 -50 M-80 -286 l4 -50" fill="none" stroke="#cfd8dc" stroke-width="5" stroke-linecap="round"/>
  <path d="M100 -150 L96 -220" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M100 -150 L96 -220" stroke="#6d4426" stroke-width="10" stroke-linecap="round"/>
  <path d="M90 -218 Q86 -320 112 -340 Q118 -280 104 -218 Z" fill="#cfd8dc" ${st(4)}/>
  ${arm('M-110 -376 Q-178 -310 -160 -214', '#b23b2e', 42)}
  ${arm('M110 -376 Q178 -310 160 -214', '#b23b2e', 42)}
  <path d="M-188 -226 L-132 -214 M132 -214 L188 -226" stroke="#ffd54f" stroke-width="12" stroke-linecap="round"/>
  <g data-dress="torso"></g>
  <circle cx="-162" cy="-200" r="26" fill="${SKIN}" ${stroke}/>
  <circle cx="162" cy="-200" r="26" fill="${SKIN}" ${stroke}/>
  <!-- the head: shaggy black hair, big ears -->
  <path d="M-72 -440 Q-96 -500 -60 -536 Q0 -560 60 -536 Q96 -500 72 -440 Z" fill="#2b2b33" ${stroke}/>
  <circle cx="-66" cy="-466" r="16" fill="${SKIN}" ${st(4)}/>
  <circle cx="66" cy="-466" r="16" fill="${SKIN}" ${st(4)}/>
  <ellipse cx="0" cy="-470" rx="66" ry="62" fill="${SKIN}" ${stroke}/>
  <path d="M-62 -484 Q-60 -528 -20 -530 Q-10 -510 0 -530 Q12 -510 22 -530 Q60 -528 62 -484 Q44 -510 30 -504 L20 -514 L6 -500 L-8 -514 L-22 -500 L-36 -510 Q-50 -506 -62 -484 Z" fill="#2b2b33" ${st(4)}/>
  <g data-part="beard">${ogreBeard(0, -444, 1)}</g>
  ${mouth(
    `<path d="M-22 -418 q22 12 44 0" fill="none" ${st(5)}/><path d="M-18 -416 l5 -14 l5 13 M8 -413 l5 -13 l5 14" fill="#fffde7" ${st(2.5)}/>`,
    `<path d="M-24 -422 Q0 -384 24 -422 Q0 -412 -24 -422 Z" fill="#7a2a1a" ${st(4)}/><path d="M-20 -420 l5 -14 l5 13 M10 -416 l5 -13 l5 14" fill="#fffde7" ${st(2.5)}/>`,
  )}
  <ellipse cx="0" cy="-450" rx="22" ry="18" fill="#f19a8e" ${st(4)}/>
  ${eyes(0, -482, 48, 8)}
  ${closedEyes(0, -482, 48, 8)}
  <path d="M-54 -500 L-8 -508 M54 -500 L8 -508" fill="none" stroke="#2b2b33" stroke-width="13" stroke-linecap="round"/>
  <ellipse cx="-44" cy="-454" rx="12" ry="8" fill="#f19a8e" opacity=".6"/>
  <ellipse cx="44" cy="-454" rx="12" ry="8" fill="#f19a8e" opacity=".6"/>
  <!-- a tall fur hat with a gold clasp and a feather -->
  <g data-part="hat" transform="translate(0 -16)">
    <path d="M30 -560 Q70 -640 40 -680 Q34 -630 14 -566 Z" fill="#43a047" ${st(4)}/>
    <path d="M-62 -520 Q-70 -600 -40 -632 Q0 -650 40 -632 Q70 -600 62 -520 Q0 -540 -62 -520 Z" fill="#5d4037" ${stroke}/>
    <path d="M-40 -600 q10 -10 20 0 M0 -616 q10 -10 20 0 M-20 -570 q10 -10 20 0 M24 -580 q10 -10 20 0" fill="none" stroke="#3e2723" stroke-width="4" stroke-linecap="round"/>
    <path d="M-70 -516 Q0 -546 70 -516 L68 -496 Q0 -524 -68 -496 Z" fill="#3e2723" ${st(4)}/>
    <circle cx="0" cy="-530" r="10" fill="#ffd54f" ${st(3)}/>
  </g>
</g>`;
};

/** the ogre turned into a lion: golden, a great shaggy mane; facing left */
export const lev = () => {
  let mane = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    mane += `<ellipse cx="${(-90 + Math.cos(a) * 70).toFixed(0)}" cy="${(-196 + Math.sin(a) * 70).toFixed(0)}" rx="34" ry="22" fill="${i % 2 ? '#d35400' : '#e67e22'}" ${st(4)} transform="rotate(${((a * 180) / Math.PI).toFixed(0)} ${(-90 + Math.cos(a) * 70).toFixed(0)} ${(-196 + Math.sin(a) * 70).toFixed(0)})"/>`;
  }
  return `
<g data-part="body">
  <!-- tail with a tuft -->
  <path d="M120 -130 Q190 -150 186 -220" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
  <path d="M120 -130 Q190 -150 186 -220" fill="none" stroke="#f4c26b" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="186" cy="-232" rx="16" ry="22" fill="#d35400" ${st(4)}/>
  <!-- legs, the far ones darker -->
  <rect x="70" y="-110" width="36" height="104" rx="16" fill="#e0a84a" ${st(4)}/>
  <rect x="-40" y="-110" width="36" height="104" rx="16" fill="#e0a84a" ${st(4)}/>
  <ellipse cx="0" cy="-130" rx="130" ry="72" fill="#f4c26b" ${stroke}/>
  <rect x="100" y="-110" width="38" height="108" rx="17" fill="#f4c26b" ${st(4)}/>
  <rect x="-80" y="-110" width="38" height="108" rx="17" fill="#f4c26b" ${st(4)}/>
  <ellipse cx="-60" cy="-6" rx="26" ry="10" fill="#f4c26b" ${st(4)}/><ellipse cx="120" cy="-6" rx="26" ry="10" fill="#f4c26b" ${st(4)}/>
  <!-- the mane and the face -->
  ${mane}
  <circle cx="-90" cy="-196" r="66" fill="#e67e22" ${stroke}/>
  <circle cx="-94" cy="-190" r="52" fill="#f4c26b" ${stroke}/>
  <circle cx="-136" cy="-238" r="13" fill="#f4c26b" ${st(4)}/><circle cx="-52" cy="-240" r="13" fill="#f4c26b" ${st(4)}/>
  ${eyes(-96, -206, 34, 6)}
  ${closedEyes(-96, -206, 34, 6)}
  <path d="M-124 -226 l18 6 M-68 -226 l-18 6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="-96" cy="-176" rx="24" ry="16" fill="#fde7c8"/>
  <path d="M-106 -186 h20 l-10 10 z" fill="#5d4037" ${st(2)}/>
  ${mouth(
    `<path d="M-110 -164 q7 7 14 0 q7 7 14 0" fill="none" ${st(3)}/>`,
    `<path d="M-122 -170 Q-96 -120 -70 -170 Q-96 -160 -122 -170 Z" fill="#8a2a1a" ${st(3)}/><path d="M-116 -168 l5 12 l5 -12 M-82 -168 l5 12 l5 -12" fill="#fff" ${st(1.5)}/>`,
  )}
</g>`;
};

/** the ogre turned into a little grey mouse (still with his black brows and a tuft of black beard); facing left */
export const myshenia = () => `
<g data-part="body">
  <path d="M26 -16 Q76 -8 80 -40 Q82 -62 62 -64" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
  <path d="M26 -16 Q76 -8 80 -40 Q82 -62 62 -64" fill="none" stroke="#f3a6a6" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="-12" cy="-5" rx="12" ry="6" fill="#f3a6a6" ${st(3)}/><ellipse cx="18" cy="-5" rx="12" ry="6" fill="#f3a6a6" ${st(3)}/>
  <ellipse cx="6" cy="-32" rx="40" ry="28" fill="#9e9ea6" ${stroke}/>
  <circle cx="-24" cy="-74" r="15" fill="#9e9ea6" ${st(4)}/><circle cx="-24" cy="-74" r="8" fill="#f6b8bb"/>
  <circle cx="2" cy="-74" r="15" fill="#9e9ea6" ${st(4)}/><circle cx="2" cy="-74" r="8" fill="#f6b8bb"/>
  <path d="M-10 -76 Q16 -74 16 -50 Q14 -32 -6 -30 Q-30 -32 -48 -42 Q-56 -48 -50 -56 Q-38 -76 -10 -76 Z" fill="#9e9ea6" ${stroke}/>
  <path d="M-40 -36 q4 14 12 16 q4 -10 4 -18 z" fill="#2b2b33" ${st(2)}/>
  <circle cx="-54" cy="-48" r="5" fill="#f06292" ${st(2)}/>
  <path d="M-46 -48 l-22 -6 M-46 -44 l-22 4" stroke="${INK}" stroke-width="2" opacity=".55"/>
  ${eyes(-20, -56, 16, 4)}
  ${closedEyes(-20, -56, 16, 4)}
  <path d="M-32 -66 l10 -2 M-16 -68 l10 2" stroke="#2b2b33" stroke-width="4" stroke-linecap="round"/>
  ${mouth(`<path d="M-42 -38 q5 4 10 0" fill="none" ${st(2.5)}/>`, `<ellipse cx="-37" cy="-37" rx="5" ry="4" fill="#8a2a1a" ${st(2)}/>`)}
</g>`;

/** the ogre turned into a big red balloon: his black brows, his little tusks, his fur hat on top, a string */
export const kulka = () => `
<g data-part="body">
  <path d="M0 -120 Q20 -90 -6 -60 Q-26 -30 6 0" fill="none" stroke="${INK}" stroke-width="4"/>
  <path d="M-12 -116 L0 -136 L12 -116 Z" fill="#c62828" ${st(3)}/>
  <ellipse cx="0" cy="-260" rx="110" ry="128" fill="#e53935" ${stroke}/>
  <ellipse cx="-50" cy="-320" rx="22" ry="40" fill="#fff" opacity=".35" transform="rotate(24 -50 -320)"/>
  ${eyes(0, -282, 50, 8)}
  ${closedEyes(0, -282, 50, 8)}
  <path d="M-56 -306 L-12 -312 M56 -306 L12 -312" stroke="#2b2b33" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="0" cy="-252" rx="18" ry="15" fill="#f19a8e" ${st(3)}/>
  ${mouth(
    `<path d="M-20 -218 q20 12 40 0" fill="none" ${st(4)}/><path d="M-16 -216 l4 -12 l4 11 M8 -214 l4 -11 l4 12" fill="#fffde7" ${st(2)}/>`,
    `<path d="M-22 -222 Q0 -186 22 -222 Q0 -212 -22 -222 Z" fill="#7a2a1a" ${st(3)}/><path d="M-18 -220 l4 -12 l4 11 M10 -217 l4 -11 l4 12" fill="#fffde7" ${st(2)}/>`,
  )}
  <ellipse cx="-50" cy="-246" rx="11" ry="7" fill="#ffcdd2" opacity=".8"/><ellipse cx="50" cy="-246" rx="11" ry="7" fill="#ffcdd2" opacity=".8"/>
  <g transform="translate(0 -384) scale(.6)">
    <path d="M-62 4 Q-70 -76 -40 -108 Q0 -126 40 -108 Q70 -76 62 4 Q0 -16 -62 4 Z" fill="#5d4037" ${stroke}/>
    <path d="M-70 8 Q0 -22 70 8 L68 28 Q0 0 -68 28 Z" fill="#3e2723" ${st(4)}/>
  </g>
</g>`;

// ---------- the other people ----------

/** a young man (a brother, a mower) at x: shirt colour, hair, and what he holds (drawn after) */
const fellow = (x: number, o: { shirt: string; hair: string; trousers: string; hat?: string }) => `
  <path d="M${x - 28} -100 L${x - 30} -12 L${x - 6} -12 L${x - 4} -100 Z M${x + 4} -100 L${x + 6} -12 L${x + 30} -12 L${x + 28} -100 Z" fill="${o.trousers}" ${st(4)}/>
  <path d="M${x - 40} 0 q2 -14 12 -14 h22 v14 z M${x + 40} 0 q-2 -14 -12 -14 h-22 v14 z" fill="#5d4037" ${st(3)}/>
  <path d="M${x - 46} -214 Q${x - 60} -150 ${x - 54} -92 L${x + 54} -92 Q${x + 60} -150 ${x + 46} -214 Q${x} -228 ${x - 46} -214 Z" fill="${o.shirt}" ${st(4)}/>
  ${stitch(x - 7, -212, 14, 56, true)}
  <path d="M${x - 54} -126 H${x + 54}" stroke="#c62828" stroke-width="8"/>
  <ellipse cx="${x}" cy="-252" rx="32" ry="34" fill="${SKIN}" ${st(4)}/>
  <path d="M${x - 32} -258 Q${x - 30} -290 ${x} -290 Q${x + 30} -290 ${x + 32} -258 Q${x + 16} -272 ${x} -268 Q${x - 16} -272 ${x - 32} -258 Z" fill="${o.hair}" ${st(3)}/>
  ${o.hat ? `<ellipse cx="${x}" cy="-282" rx="52" ry="10" fill="${o.hat}" ${st(3)}/><path d="M${x - 28} -284 Q${x - 26} -312 ${x} -314 Q${x + 26} -312 ${x + 28} -284 Z" fill="${o.hat}" ${st(3)}/><path d="M${x - 28} -292 h56" stroke="#c62828" stroke-width="5"/>` : ''}
  <ellipse cx="${x - 16}" cy="-238" rx="6" ry="4" fill="#f0786a" opacity=".6"/><ellipse cx="${x + 16}" cy="-238" rx="6" ry="4" fill="#f0786a" opacity=".6"/>`;

/** the two elder brothers, white with flour: one with a sack of flour on his shoulder */
export const starshi = () => `
<g data-part="body">
  ${fellow(-70, { shirt: '#fbf7ee', hair: '#5d4037', trousers: '#90a4ae' })}
  ${arm('M-112 -200 Q-130 -150 -116 -110', '#fbf7ee', 18)}
  ${eyes(-70, -256, 22, 5)}
  ${mouth(`<path d="M-78 -236 q8 6 16 0" fill="none" ${st(3)}/>`, `<path d="M-78 -237 q8 12 16 0 z" fill="#7a2a1a" ${st(2.5)}/>`)}
  ${fellow(70, { shirt: '#f1e6c8', hair: '#3e2723', trousers: '#8d6e63' })}
  <!-- the sack on his shoulder -->
  <g transform="translate(56 26)">
  <path d="M60 -292 Q40 -250 70 -210 L150 -220 Q170 -270 140 -300 Q100 -312 60 -292 Z" fill="#fff8e1" ${st(4)}/>
  <path d="M90 -270 h30 M88 -250 h34" stroke="#bdbdbd" stroke-width="4"/>
  </g>
  ${arm('M110 -204 Q136 -230 132 -256', '#f1e6c8', 18)}
  ${eyes(70, -256, 22, 5)}
  ${mouth(`<path d="M62 -236 q8 6 16 0" fill="none" ${st(3)}/>`, `<path d="M62 -237 q8 12 16 0 z" fill="#7a2a1a" ${st(2.5)}/>`)}
  ${[[-90, -180], [-40, -140], [90, -160], [40, -110], [-60, -60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".8"/>`).join('')}
</g>`;

/** the grey donkey, long ears, facing left */
export const osel = () => `
<g data-part="body">
  <path d="M100 -150 Q140 -140 136 -80" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M100 -150 Q140 -140 136 -80" fill="none" stroke="#9e9e9e" stroke-width="5"/>
  <path d="M130 -86 l6 20 l8 -18 z" fill="#424242"/>
  <rect x="50" y="-110" width="24" height="106" rx="10" fill="#8f8f8f" ${st(4)}/><rect x="-60" y="-110" width="24" height="106" rx="10" fill="#8f8f8f" ${st(4)}/>
  <ellipse cx="20" cy="-136" rx="100" ry="54" fill="#a8a8a8" ${stroke}/>
  <rect x="80" y="-110" width="26" height="108" rx="11" fill="#a8a8a8" ${st(4)}/><rect x="-34" y="-110" width="26" height="108" rx="11" fill="#a8a8a8" ${st(4)}/>
  <path d="M84 -8 h22 v8 h-22 z M-34 -8 h26 v8 h-26 z" fill="#424242"/>
  <path d="M-60 -160 Q-90 -210 -100 -240 L-60 -260 Q-40 -210 -20 -170 Z" fill="#a8a8a8" ${stroke}/>
  <path d="M-62 -250 Q-40 -220 -30 -180" stroke="#424242" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M-96 -258 Q-104 -320 -84 -330 Q-74 -300 -78 -256 Z M-70 -262 Q-60 -322 -40 -326 Q-40 -292 -56 -256 Z" fill="#a8a8a8" ${st(4)}/>
  <path d="M-90 -270 Q-92 -306 -86 -316 M-62 -270 Q-54 -304 -46 -312" stroke="#f3a6a6" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="-110" cy="-238" rx="44" ry="30" fill="#a8a8a8" ${stroke} transform="rotate(-20 -110 -238)"/>
  <ellipse cx="-142" cy="-222" rx="20" ry="16" fill="#d7d7d7" ${st(3)}/>
  <circle cx="-150" cy="-226" r="3" fill="${INK}"/>
  ${eyes(-108, -252, 16, 4.5)}
  ${closedEyes(-108, -252, 16, 4.5)}
  ${mouth(`<path d="M-154 -212 q8 4 14 -2" fill="none" ${st(2.5)}/>`, `<ellipse cx="-146" cy="-208" rx="9" ry="6" fill="#8a2a1a" ${st(2)}/>`)}
</g>`;

/** two mowers in straw hats, their scythes over their shoulders */
export const kosari = () => {
  const scythe = (x: number) =>
    `<path d="M${x + 30} -40 L${x + 70} -300" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M${x + 30} -40 L${x + 70} -300" stroke="#a1704a" stroke-width="6" stroke-linecap="round"/>` +
    `<path d="M${x + 70} -300 Q${x + 10} -330 ${x - 60} -300 Q${x} -310 ${x + 66} -290 Z" fill="#cfd8dc" ${st(3)}/>`;
  return `
<g data-part="body">
  ${scythe(-80)}
  ${fellow(-80, { shirt: '#fbf7ee', hair: '#6d4c41', trousers: '#5c6bc0', hat: '#e9c46a' })}
  <circle cx="-44" cy="-140" r="11" fill="${SKIN}" ${st(3)}/>
  ${eyes(-80, -256, 22, 5)}
  ${mouth(`<path d="M-88 -236 q8 6 16 0" fill="none" ${st(3)}/>`, `<path d="M-88 -237 q8 12 16 0 z" fill="#7a2a1a" ${st(2.5)}/>`)}
  <path d="M-94 -232 q-10 6 -14 -2 M-66 -232 q10 6 14 -2" fill="none" stroke="#5d4037" stroke-width="5" stroke-linecap="round"/>
  ${scythe(80)}
  ${fellow(80, { shirt: '#fbf7ee', hair: '#ffb74d', trousers: '#795548', hat: '#e9c46a' })}
  <circle cx="116" cy="-140" r="11" fill="${SKIN}" ${st(3)}/>
  ${eyes(80, -256, 22, 5)}
  ${mouth(`<path d="M72 -236 q8 6 16 0" fill="none" ${st(3)}/>`, `<path d="M72 -237 q8 12 16 0 z" fill="#7a2a1a" ${st(2.5)}/>`)}
</g>`;
};

/** two reapers in headscarves, sickles in hand, a sheaf of wheat between them */
export const zhentsi = () => {
  const woman = (x: number, skirt: string, scarf: string) => `
    <path d="M${x - 36} -150 L${x - 58} -8 Q${x} 2 ${x + 58} -8 L${x + 36} -150 Z" fill="${skirt}" ${st(4)}/>
    <path d="M${x - 54} -30 Q${x} -20 ${x + 54} -30" stroke="#ffd54f" stroke-width="7" fill="none"/>
    <path d="M${x - 40} -214 Q${x - 50} -180 ${x - 42} -146 L${x + 42} -146 Q${x + 50} -180 ${x + 40} -214 Q${x} -226 ${x - 40} -214 Z" fill="#fbf7ee" ${st(4)}/>
    ${stitch(x - 7, -212, 14, 56, true)}
    <ellipse cx="${x}" cy="-248" rx="30" ry="32" fill="${SKIN}" ${st(4)}/>
    <path d="M${x - 40} -240 Q${x - 44} -296 ${x} -298 Q${x + 44} -296 ${x + 40} -240 Q${x + 32} -268 ${x} -272 Q${x - 32} -268 ${x - 40} -240 Z" fill="${scarf}" ${st(4)}/>
    <ellipse cx="${x - 15}" cy="-234" rx="6" ry="4" fill="#f0786a" opacity=".7"/><ellipse cx="${x + 15}" cy="-234" rx="6" ry="4" fill="#f0786a" opacity=".7"/>`;
  const sickle = (x: number) => `<path d="M${x} -150 l0 -24" stroke="#8b5a2b" stroke-width="7" stroke-linecap="round"/><path d="M${x} -172 Q${x - 6} -214 ${x + 30} -220 Q${x + 4} -206 ${x + 6} -172 Z" fill="#cfd8dc" ${st(2.5)}/>`;
  let ears = '';
  for (let i = 0; i < 9; i++) ears += `<path d="M${-24 + i * 6} -40 q${(i - 4) * 3} -60 ${(i - 4) * 6} -110" stroke="#d4a531" stroke-width="5" fill="none"/><ellipse cx="${-24 + i * 6 + (i - 4) * 6}" cy="-156" rx="5" ry="12" fill="#e8bd45"/>`;
  return `
<g data-part="body">
  ${woman(-90, '#c62828', '#ffca28')}
  ${sickle(-50)}<circle cx="-50" cy="-146" r="10" fill="${SKIN}" ${st(3)}/>
  ${eyes(-90, -250, 20, 4.5)}
  ${mouth(`<path d="M-97 -232 q7 6 14 0" fill="none" ${st(3)}/>`, `<path d="M-97 -233 q7 11 14 0 z" fill="#7a2a1a" ${st(2.5)}/>`)}
  ${ears}<path d="M-30 -36 L30 -36 L20 -2 L-20 -2 Z" fill="#e2b45a" ${st(3)}/><path d="M-26 -60 h52" stroke="#c62828" stroke-width="6"/>
  ${woman(90, '#2e7d32', '#e53935')}
  ${sickle(130)}<circle cx="130" cy="-146" r="10" fill="${SKIN}" ${st(3)}/>
  ${eyes(90, -250, 20, 4.5)}
  ${mouth(`<path d="M83 -232 q7 6 14 0" fill="none" ${st(3)}/>`, `<path d="M83 -233 q7 11 14 0 z" fill="#7a2a1a" ${st(2.5)}/>`)}
</g>`;
};

// ---------- things ----------

/**
 * The king's open carriage, gold with red velvet, pulled by a white horse with a red plume; facing
 * left (the horse in front). Whoever rides in it stands behind it, 40 higher (their legs hidden):
 * the seats are at +20, +130 and +240 from its middle (mirrored when it faces right).
 */
export const kareta = () => {
  const wheel = (x: number, r: number) => {
    let spokes = '';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      spokes += `<path d="M${x} ${-r} l${(Math.cos(a) * r * 0.82).toFixed(1)} ${(Math.sin(a) * r * 0.82).toFixed(1)}" stroke="#b78630" stroke-width="5"/>`;
    }
    return `<circle cx="${x}" cy="${-r}" r="${r}" fill="none" stroke="${INK}" stroke-width="16"/><circle cx="${x}" cy="${-r}" r="${r}" fill="none" stroke="#c62828" stroke-width="9"/>${spokes}<circle cx="${x}" cy="${-r}" r="12" fill="#ffd54f" ${st(3)}/>`;
  };
  const leg = (x: number, c: string) => `<path d="M${x} -120 L${x - 4} -14" stroke="${INK}" stroke-width="24" stroke-linecap="round"/><path d="M${x} -120 L${x - 4} -14" stroke="${c}" stroke-width="15" stroke-linecap="round"/><rect x="${x - 16}" y="-14" width="24" height="14" rx="3" fill="#5d4037" ${st(3)}/>`;
  return `
<g data-part="body">
  <rect x="-140" y="-34" width="450" height="30" fill="#000" opacity=".25" rx="12"/>
  <!-- the horse -->
  ${leg(-400, '#e0e0e0')}${leg(-290, '#e0e0e0')}
  <path d="M-250 -170 Q-200 -170 -196 -100" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M-250 -170 Q-200 -170 -196 -100" fill="none" stroke="#ffe082" stroke-width="13" stroke-linecap="round"/>
  <ellipse cx="-330" cy="-156" rx="96" ry="50" fill="#fafafa" ${stroke}/>
  ${leg(-376, '#fafafa')}${leg(-262, '#fafafa')}
  <path d="M-380 -180 Q-400 -230 -416 -262 L-370 -284 Q-350 -230 -320 -190 Z" fill="#fafafa" ${stroke}/>
  <path d="M-372 -280 Q-340 -240 -322 -196" stroke="#ffd54f" stroke-width="14" fill="none" stroke-linecap="round"/>
  <ellipse cx="-436" cy="-266" rx="54" ry="30" fill="#fafafa" ${stroke} transform="rotate(-24 -436 -266)"/>
  <ellipse cx="-478" cy="-246" rx="16" ry="13" fill="#f8bbd0" ${st(3)}/>
  <path d="M-404 -296 l6 -26 l12 22 z" fill="#fafafa" ${st(3.5)}/>
  <path d="M-392 -300 Q-400 -340 -370 -356 Q-376 -330 -384 -296 Z" fill="#e53935" ${st(3)}/>
  ${eyes(-428, -278, 14, 4)}
  <path d="M-460 -250 L-330 -170 L-230 -150 M-400 -210 L-360 -150" stroke="#c62828" stroke-width="7" fill="none"/>
  <circle cx="-390" cy="-200" r="6" fill="#ffd54f" ${st(2)}/>
  <!-- the shafts -->
  <path d="M-250 -136 L-120 -112" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M-250 -136 L-120 -112" stroke="#8b5a2b" stroke-width="7" stroke-linecap="round"/>
  <!-- the carriage: a tall back, a gold body with red velvet, curls, a crown on its side -->
  <path d="M220 -210 Q226 -300 270 -300 Q320 -296 318 -210 Z" fill="#ffd54f" ${stroke}/>
  <path d="M238 -214 Q244 -280 272 -282 Q302 -278 300 -214 Z" fill="#c62828"/>
  <path d="M-130 -40 L-150 -206 Q-150 -222 -132 -222 L316 -222 Q330 -222 330 -206 L310 -40 Q90 -24 -130 -40 Z" fill="#ffd54f" ${stroke}/>
  <path d="M-110 -200 L-96 -64 Q90 -50 290 -64 L304 -200 Z" fill="#c62828" ${st(3)}/>
  <path d="M-150 -214 H330" stroke="#ffb300" stroke-width="9"/>
  <path d="M-90 -90 q20 -30 40 0 q20 30 40 0 M200 -90 q20 -30 40 0 q20 30 40 0" fill="none" stroke="#ffd54f" stroke-width="6"/>
  <path d="M60 -110 L52 -156 L74 -138 L90 -166 L106 -138 L128 -156 L120 -110 Z" fill="#ffd54f" ${st(3)}/>
  ${wheel(-60, 56)}${wheel(230, 74)}
</g>`;
};

/** a soft grey-white rabbit sitting, long ears up, facing left */
export const krolyk = () => `
<g data-part="body">
  <circle cx="44" cy="-34" r="14" fill="#fff" ${st(3.5)}/>
  <ellipse cx="10" cy="-40" rx="44" ry="38" fill="#e7e2dc" ${stroke}/>
  <ellipse cx="-14" cy="-6" rx="22" ry="8" fill="#e7e2dc" ${st(3.5)}/><ellipse cx="22" cy="-6" rx="20" ry="8" fill="#e7e2dc" ${st(3.5)}/>
  <path d="M-38 -96 Q-58 -160 -40 -170 Q-24 -150 -26 -98 Z M-18 -98 Q-12 -160 8 -166 Q16 -140 -4 -96 Z" fill="#e7e2dc" ${st(4)}/>
  <path d="M-38 -104 Q-48 -146 -40 -156 M-12 -106 Q-6 -144 4 -152" stroke="#f4b8b0" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="-28" cy="-80" rx="32" ry="28" fill="#e7e2dc" ${stroke}/>
  ${eyes(-34, -86, 20, 4.5)}
  ${closedEyes(-34, -86, 20, 4.5)}
  <ellipse cx="-56" cy="-72" rx="6" ry="5" fill="#f48fb1"/>
  ${mouth(`<path d="M-56 -66 q-4 6 -10 2 M-56 -66 q3 6 8 2" fill="none" ${st(2.5)}/>`, `<ellipse cx="-56" cy="-62" rx="6" ry="5" fill="#8a2a1a" ${st(2)}/>`)}
</g>`;

/** a pair of partridges, plump and brown with orange faces */
export const kuropatky = () => {
  const bird = (x: number, s: number) => `<g transform="translate(${x} 0) scale(${s})">
    <path d="M-6 -14 V-2 M8 -14 V-2" stroke="#ef8f00" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 -40 Q52 -50 56 -34 Q46 -30 30 -26 Z" fill="#8d6e63" ${st(3)}/>
    <ellipse cx="4" cy="-36" rx="36" ry="26" fill="#a1887f" ${st(4)}/>
    <path d="M-10 -40 q8 6 16 0 M2 -28 q8 6 16 0 M14 -44 q6 4 12 0" stroke="#5d4037" stroke-width="3" fill="none"/>
    <circle cx="-26" cy="-62" r="17" fill="#ff8a50" ${st(3.5)}/>
    <circle cx="-30" cy="-66" r="3.5" fill="${INK}"/>
    <path d="M-42 -62 l-10 3 l10 3 z" fill="#5d4037"/></g>`;
  return `<g data-part="body">${bird(-34, 1)}${bird(38, 0.9)}</g>`;
};

/** the river in front: whoever stands in it shows from the waist up (FRONT in stage.ts) */
export const voda = () => {
  let waves = '';
  for (let i = 0; i < 9; i++) waves += `<path d="M${-300 + i * 70} ${-130 + (i % 3) * 40} q18 -10 36 0" stroke="#d6f0ff" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  let reeds = '';
  for (let i = 0; i < 5; i++) reeds += `<path d="M${-330 + i * 12} 0 V${-210 + (i % 2) * 30}" stroke="#5d8f3a" stroke-width="5"/>`;
  return `
<g data-part="body">
  <path d="M-340 -150 Q-300 -164 -260 -150 Q-220 -136 -180 -150 Q-140 -164 -100 -150 Q-60 -136 -20 -150 Q20 -164 60 -150 Q100 -136 140 -150 Q180 -164 220 -150 Q260 -136 300 -150 Q340 -164 380 -150 L380 400 L-340 400 Z" fill="#4aa3df" opacity=".94"/>
  <path d="M-340 -150 Q-300 -164 -260 -150 Q-220 -136 -180 -150 Q-140 -164 -100 -150 Q-60 -136 -20 -150 Q20 -164 60 -150 Q100 -136 140 -150 Q180 -164 220 -150 Q260 -136 300 -150 Q340 -164 380 -150" fill="none" stroke="#d6f0ff" stroke-width="8"/>
  ${waves}${reeds}
</g>`;
};

/** the old clothes in a heap: a patched shirt, trousers, a worn shoe */
export const lakhmittia = () => `
<g data-part="body">
  <path d="M-60 0 Q-70 -30 -40 -40 Q-10 -60 30 -46 Q66 -40 62 0 Z" fill="#a1887f" ${st(4)}/>
  <path d="M-50 -10 Q-30 -36 0 -30 Q30 -24 52 -8" fill="none" stroke="#8d8a84" stroke-width="14"/>
  <rect x="-30" y="-40" width="18" height="16" fill="#d7ccc8" ${st(2)}/><rect x="16" y="-30" width="16" height="14" fill="#7d8b6a" ${st(2)}/>
  <path d="M40 0 q2 -14 12 -14 h22 v14 z" fill="#6d4c41" ${st(3)}/>
</g>`;

/** the cat's fish stall by the river: a table with a checked cloth, a pot of fish soup over a fire, a sign */
export const restoran = () => `
<g data-part="body">
  <path d="M-200 -380 V0" stroke="${INK}" stroke-width="14"/><path d="M-200 -380 V0" stroke="#8b5a2b" stroke-width="8"/>
  <rect x="-300" y="-430" width="230" height="80" rx="10" fill="#fff3e0" ${stroke}/>
  <text x="-185" y="-400" font-size="26" font-weight="900" text-anchor="middle" fill="#c62828">ЮШКА</text>
  <text x="-185" y="-368" font-size="22" font-weight="900" text-anchor="middle" fill="#1e5aa8">ВІД КОТА</text>
  <path d="M-110 -300 L-150 -320 L-150 -280 Z" fill="#90a4ae" ${st(3)}/><path d="M-110 -300 Q-70 -330 -40 -300 Q-70 -270 -110 -300 Z" fill="#90a4ae" ${st(3)}/><circle cx="-58" cy="-304" r="3" fill="${INK}"/>
  <!-- the table, a red-and-white checked cloth -->
  <rect x="-150" y="-140" width="20" height="140" fill="#8b5a2b" ${st(3)}/><rect x="110" y="-140" width="20" height="140" fill="#8b5a2b" ${st(3)}/>
  <path d="M-170 -170 H150 L160 -110 H-180 Z" fill="#fff" ${stroke}/>
  ${Array.from({ length: 11 }, (_, i) => `<rect x="${-176 + i * 30}" y="${-166 + (i % 2) * 28}" width="28" height="28" fill="#e53935" opacity=".85"/>`).join('')}
  <ellipse cx="-90" cy="-176" rx="34" ry="9" fill="#fafafa" ${st(3)}/><ellipse cx="-90" cy="-180" rx="22" ry="6" fill="#ffcc80"/>
  <ellipse cx="60" cy="-176" rx="34" ry="9" fill="#fafafa" ${st(3)}/><ellipse cx="60" cy="-180" rx="22" ry="6" fill="#ffcc80"/>
  <!-- the pot over the fire -->
  <path d="M190 0 L230 -150 L270 0 M250 0 L230 -150" stroke="${INK}" stroke-width="8"/>
  <path d="M196 -30 q14 -40 34 -10 q10 -40 36 6 q-30 20 -70 4 z" fill="#ff7a1a" ${st(3)}/>
  <path d="M180 -110 Q170 -40 230 -36 Q290 -40 280 -110 Z" fill="#37474f" ${stroke}/>
  <ellipse cx="230" cy="-110" rx="52" ry="10" fill="#ffb74d" ${st(3)}/>
  <path d="M206 -130 q-8 -16 2 -30 q10 -14 0 -28 M236 -132 q-8 -16 2 -30 q10 -14 0 -28" stroke="#e0e0e0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
</g>`;
