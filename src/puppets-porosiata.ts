// The puppets of «Троє поросят»: the three piglet brothers, all three standing up and facing us —
// Nif-Nif (the palest pink, a yellow T-shirt, green shorts on braces, a green cap with a straw
// stuck in it), Nuf-Nuf (rosy, a blue-and-white striped T-shirt, red shorts, a red knitted hat with
// a pompom) and Naf-Naf (coral pink, a blue work shirt, a leather apron with a hammer in its
// pocket, an orange hard hat, a trowel in his hoof); their three houses — of straw, of twigs and of
// bricks (with a chimney: the wolf climbs to it), and the silly one of pillows; a stack of bricks,
// a trowel, a bundle of straw, a bundle of twigs, the pot of boiling water (with its lid on:
// look kryshka), the scarecrow; the wolf of characters.ts in feathers (look pirya) and in a hard
// hat (look kaska). And the cover: the three brothers. Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stroke, vovk } from './characters';

const HOOF = '#8d5a4a';

/** a thick limb: the ink outline, then its colour over it */
const limb = (d: string, fill: string, w: number) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;

interface Piglet {
  skin: string;
  /** the snout, the inside of the ears */
  dark: string;
  /** over the legs: shorts or trousers */
  legs: string;
  /** over the body: the shirt (and the apron) */
  shirt: string;
  /** over the arms: sleeves */
  sleeves: string;
  /** the own hat (data-part="hat") */
  hat: string;
  /** held in the hoof, in front of everything */
  held?: string;
}

/**
 * A piglet standing on its hind legs, facing us: short legs with little hooves, a round body, the
 * curly tail sticking out at the side, a big round head with pointed ears, a round snout with
 * two nostrils between the eyes and the smile.
 */
const piglet = (p: Piglet) => `
<g data-part="body">
  <!-- the curly tail, behind -->
  <path d="M56 -92 q34 -2 32 -26 q-2 -16 -16 -8 q-10 10 4 16 q20 6 26 -14" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
  <path d="M56 -92 q34 -2 32 -26 q-2 -16 -16 -8 q-10 10 4 16 q20 6 26 -14" fill="none" stroke="${p.skin}" stroke-width="5" stroke-linecap="round"/>
  <!-- the legs and the hooves -->
  <rect x="-38" y="-70" width="26" height="60" rx="11" fill="${p.skin}" ${st(4)}/>
  <rect x="12" y="-70" width="26" height="60" rx="11" fill="${p.skin}" ${st(4)}/>
  <path d="M-42 0 q0 -20 17 -20 q17 0 17 20 z M8 0 q0 -20 17 -20 q17 0 17 20 z" fill="${HOOF}" ${st(4)}/>
  <path d="M-25 -2 v-10 M25 -2 v-10" stroke="${INK}" stroke-width="3"/>
  ${p.legs}
  <!-- the round body, a lighter belly (trousers worn go over it, up to the waist) -->
  <ellipse cx="0" cy="-124" rx="64" ry="76" fill="${p.skin}" ${stroke}/>
  <ellipse cx="0" cy="-110" rx="38" ry="46" fill="#fff" opacity=".22"/>
  <g data-dress="legs"></g>
  ${p.shirt}
  <!-- the arms, the sleeves -->
  ${limb('M-52 -172 Q-86 -144 -76 -106', p.skin, 20)}
  ${limb('M52 -172 Q86 -144 76 -106', p.skin, 20)}
  ${p.sleeves}
  <g data-dress="torso"></g>
  <circle cx="-76" cy="-102" r="14" fill="${p.skin}" ${st(4)}/><path d="M-82 -92 l6 -10 l6 10" fill="none" stroke="${INK}" stroke-width="3"/>
  <circle cx="76" cy="-102" r="14" fill="${p.skin}" ${st(4)}/><path d="M70 -92 l6 -10 l6 10" fill="none" stroke="${INK}" stroke-width="3"/>
  ${p.held || ''}
  <!-- the pointed ears, then the head -->
  <path d="M-52 -272 L-74 -330 L-18 -292 Z" fill="${p.skin}" ${st(4)}/><path d="M-50 -284 L-62 -314 L-32 -294 Z" fill="${p.dark}"/>
  <path d="M52 -272 L74 -330 L18 -292 Z" fill="${p.skin}" ${st(4)}/><path d="M50 -284 L62 -314 L32 -294 Z" fill="${p.dark}"/>
  <ellipse cx="0" cy="-240" rx="60" ry="54" fill="${p.skin}" ${stroke}/>
  <ellipse cx="-38" cy="-218" rx="10" ry="6" fill="#f06292" opacity=".45"/>
  <ellipse cx="38" cy="-218" rx="10" ry="6" fill="#f06292" opacity=".45"/>
  <ellipse cx="0" cy="-224" rx="24" ry="17" fill="${p.dark}" ${st(4)}/>
  <ellipse cx="-8" cy="-224" rx="4" ry="6.5" fill="#7a2f3e"/><ellipse cx="8" cy="-224" rx="4" ry="6.5" fill="#7a2f3e"/>
  ${eyes(0, -258, 46, 7)}
  ${closedEyes(0, -258, 46, 7)}
  <path d="M-34 -276 q10 -6 18 -2 M34 -276 q-10 -6 -18 -2" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
  ${mouth(
    `<path d="M-14 -200 q14 10 28 0" fill="none" ${st(4)}/>`,
    `<path d="M-15 -202 q15 22 30 0 z" fill="#8a2a1a" ${st(3)}/>`,
  )}
  <g data-part="hat">${p.hat}</g>
</g>`;

/** the shirt's body: a top from the shoulders to the hips, over the round body */
const TOP = 'M-56 -178 Q-70 -130 -64 -92 Q0 -80 64 -92 Q70 -130 56 -178 Q0 -204 -56 -178 Z';
/** short sleeves: a puff on each shoulder */
const shortSleeves = (fill: string) => `<circle cx="-56" cy="-168" r="18" fill="${fill}" ${st(4)}/><circle cx="56" cy="-168" r="18" fill="${fill}" ${st(4)}/>`;

/** Nif-Nif: the palest, the merriest — a yellow T-shirt, green shorts on braces, a green cap */
export const nifnif = () =>
  piglet({
    skin: '#fbd3dc',
    dark: '#f3a6b8',
    legs: `<path d="M-64 -102 Q-68 -70 -42 -50 L-6 -50 L0 -62 L6 -50 L42 -50 Q68 -70 64 -102 Z" fill="#43a047" ${stroke}/>` + `<path d="M-30 -56 v-10 M30 -56 v-10" stroke="#2e7d32" stroke-width="4"/>`,
    shirt:
      `<path d="${TOP}" fill="#ffe066" ${stroke}/>` +
      // the braces, two buttons
      `<path d="M-30 -96 L-36 -184 M30 -96 L36 -184" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M-30 -96 L-36 -184 M30 -96 L36 -184" stroke="#43a047" stroke-width="7" stroke-linecap="round"/>` +
      `<circle cx="-30" cy="-102" r="5" fill="#fff" ${st(2)}/><circle cx="30" cy="-102" r="5" fill="#fff" ${st(2)}/>` +
      `<path d="M-64 -100 Q0 -88 64 -100 L64 -90 Q0 -78 -64 -90 Z" fill="#43a047" ${st(4)}/>`,
    sleeves: shortSleeves('#ffe066'),
    hat:
      // a green cap with its peak to the side, a straw stalk stuck in it
      `<path d="M38 -300 L74 -344" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M38 -300 L74 -344" stroke="#f2cf66" stroke-width="4" stroke-linecap="round"/>` +
      `<path d="M-50 -284 Q-48 -330 0 -332 Q48 -330 50 -284 Q0 -296 -50 -284 Z" fill="#66bb6a" ${stroke}/>` +
      `<path d="M-46 -286 Q-92 -292 -100 -276 Q-74 -266 -40 -278 Z" fill="#2e7d32" ${st(4)}/>` +
      `<path d="M0 -330 V-292 M-30 -322 Q-20 -300 -22 -288 M30 -322 Q20 -300 22 -288" stroke="#388e3c" stroke-width="3" fill="none"/>` +
      `<circle cx="0" cy="-332" r="7" fill="#2e7d32" ${st(3)}/>`,
  });

/** Nuf-Nuf: rosy — a striped T-shirt, red shorts, a red knitted hat with a white pompom */
export const nufnuf = () => {
  // the blue stripes across the T-shirt, as wide as the shirt is at each height
  let stripes = '';
  for (const y of [-176, -158, -140, -122, -104]) {
    const w = 64 * Math.sqrt(Math.max(0, 1 - ((y + 124) / 78) ** 2)) + 2;
    stripes += `<path d="M${(-w).toFixed(0)} ${y} H${w.toFixed(0)}" stroke="#1e88e5" stroke-width="8"/>`;
  }
  return piglet({
    skin: '#f7a9c0',
    dark: '#e57f9c',
    legs: `<path d="M-64 -102 Q-68 -70 -42 -50 L-6 -50 L0 -62 L6 -50 L42 -50 Q68 -70 64 -102 Z" fill="#e53935" ${stroke}/>` + `<circle cx="-40" cy="-76" r="5" fill="#fff"/><circle cx="40" cy="-76" r="5" fill="#fff"/>`,
    shirt: `<path d="${TOP}" fill="#fafafa" ${stroke}/>${stripes}<path d="${TOP}" fill="none" ${stroke}/>`,
    sleeves: shortSleeves('#fafafa') + `<path d="M-72 -168 H-40 M40 -168 H72" stroke="#1e88e5" stroke-width="6"/>`,
    hat:
      // a red knitted hat pulled down to the brows (the ears poke out), its turned-up rim, a pompom
      `<path d="M-56 -272 Q-60 -338 0 -340 Q60 -338 56 -272 Z" fill="#e53935" ${stroke}/>` +
      `<path d="M-30 -330 v52 M-10 -338 v60 M10 -338 v60 M30 -330 v52" stroke="#c62828" stroke-width="4"/>` +
      `<rect x="-60" y="-292" width="120" height="24" rx="10" fill="#ef5350" ${st(4)}/>` +
      `<path d="M-48 -288 v16 M-32 -288 v16 M-16 -288 v16 M0 -288 v16 M16 -288 v16 M32 -288 v16 M48 -288 v16" stroke="#c62828" stroke-width="3"/>` +
      `<circle cx="0" cy="-346" r="18" fill="#fff" ${st(4)}/><path d="M-8 -352 q8 -6 14 2" stroke="#e0e0e0" stroke-width="3" fill="none"/>`,
  });
};

/** the trowel: a wooden handle, a diamond steel blade; its handle's end at 0,0, the blade up */
const trowel = () =>
  `<rect x="-6" y="-34" width="12" height="36" rx="5" fill="#a1704a" ${st(3)}/>` +
  `<path d="M0 -34 V-46" stroke="${INK}" stroke-width="6"/>` +
  `<path d="M0 -44 L-24 -84 L0 -126 L24 -84 Z" fill="#cfd8dc" ${st(4)}/>` +
  `<path d="M0 -50 V-118" stroke="#90a4ae" stroke-width="3"/><path d="M-12 -86 q6 -8 10 -22" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`;

/** Naf-Naf: the sensible builder — a blue work shirt, a leather apron, an orange hard hat, a trowel */
export const nafnaf = () =>
  piglet({
    skin: '#f39a96',
    dark: '#de6f76',
    // long blue trousers down to the hooves
    legs: `<path d="M-64 -104 Q-66 -70 -44 -20 L-8 -20 L0 -60 L8 -20 L44 -20 Q66 -70 64 -104 Z" fill="#3f6fb5" ${stroke}/>` + `<path d="M-40 -24 h32 M8 -24 h32" stroke="#2c4f86" stroke-width="5"/>`,
    shirt:
      `<path d="${TOP}" fill="#6a9ee0" ${stroke}/>` +
      `<path d="M-14 -190 L0 -172 L14 -190" fill="none" stroke="${INK}" stroke-width="4"/>` +
      // the leather apron on a strap round the neck, a pocket with a hammer and a pencil
      `<path d="M-30 -186 Q-18 -200 0 -200 Q18 -200 30 -186" fill="none" stroke="#6d4426" stroke-width="6"/>` +
      `<path d="M-32 -184 L-42 -78 Q0 -68 42 -78 L32 -184 Q0 -176 -32 -184 Z" fill="#a8693a" ${stroke}/>` +
      `<path d="M-36 -84 Q0 -76 36 -84" stroke="#7b4a26" stroke-width="3" fill="none" stroke-dasharray="6 6"/>` +
      `<path d="M-26 -120 h40 v30 q-20 8 -40 0 z" fill="#8d5530" ${st(3)}/>` +
      `<path d="M-14 -118 V-150" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-14 -118 V-150" stroke="#d7a86e" stroke-width="4"/>` +
      `<rect x="-26" y="-162" width="24" height="12" rx="3" fill="#90a4ae" ${st(3)}/>` +
      `<path d="M6 -118 L12 -146" stroke="#fbc02d" stroke-width="6" stroke-linecap="round"/><path d="M12 -146 l1 -6" stroke="${INK}" stroke-width="3"/>`,
    sleeves: `<circle cx="-56" cy="-168" r="18" fill="#6a9ee0" ${st(4)}/><circle cx="56" cy="-168" r="18" fill="#6a9ee0" ${st(4)}/><path d="M-72 -156 q16 8 32 0 M40 -156 q16 8 32 0" stroke="#3f6fb5" stroke-width="5" fill="none"/>`,
    hat:
      // an orange hard hat with a ridge and a short brim
      `<path d="M-54 -278 Q-56 -340 0 -342 Q56 -340 54 -278 Z" fill="#ff9800" ${stroke}/>` +
      `<path d="M-10 -340 Q-12 -310 -10 -280 L10 -280 Q12 -310 10 -340 Z" fill="#fb8c00" ${st(3)}/>` +
      `<path d="M-66 -282 Q0 -268 66 -282 L66 -272 Q0 -258 -66 -272 Z" fill="#f57c00" ${st(4)}/>` +
      `<path d="M-36 -326 q10 -10 20 -10" stroke="#ffe0b2" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    held: `<g transform="translate(-74 -96) rotate(-14)">${trowel()}</g><circle cx="-76" cy="-102" r="14" fill="#f39a96" ${st(4)}/>`,
  });

/** the cover of «Троє поросят»: the three brothers side by side, Naf-Naf in the middle */
export const troie_porosiat = () =>
  `<g transform="translate(-150 0) scale(.66)">${nifnif()}</g><g transform="translate(150 0) scale(.66)">${nufnuf()}</g><g transform="translate(0 14) scale(.7)">${nafnaf()}</g>`;

// ---------------- the houses ----------------

/** Nif-Nif's straw house: walls of straw bundles, a shaggy thatched roof, a round door. Door: mouth. */
export const hata_solomiana = () => {
  let straws = '';
  for (let x = -140; x <= 140; x += 14) straws += `<path d="M${x} -6 Q${x + 4} -110 ${x - 2} -214" stroke="${x % 28 ? '#d9a93a' : '#c9962c'}" stroke-width="3" fill="none"/>`;
  let fringe = '';
  for (let x = -186; x <= 186; x += 16) fringe += `<path d="M${x} -206 l${x % 32 ? 6 : -4} 24" stroke="#c9962c" stroke-width="5" stroke-linecap="round"/>`;
  return `
<g data-part="body"><g transform="scale(.9)">
  <rect x="-150" y="-220" width="300" height="220" rx="10" fill="#f2cf66" ${stroke}/>
  ${straws}
  <path d="M-150 -150 H150 M-150 -80 H150" stroke="#b5832a" stroke-width="7"/>
  <!-- the thatched roof, its shaggy fringe -->
  <path d="M-196 -200 L0 -380 L196 -200 Q0 -184 -196 -200 Z" fill="#e9bd4c" ${stroke}/>
  <path d="M-120 -230 L-40 -320 M-60 -224 L10 -330 M10 -222 L60 -300 M80 -226 L120 -260" stroke="#c9962c" stroke-width="5" stroke-linecap="round"/>
  ${fringe}
  <path d="M-6 -380 l-10 -26 M4 -380 l6 -28 M0 -380 l18 -18" stroke="#d9a93a" stroke-width="6" stroke-linecap="round"/>
  <!-- a round window, the round-topped door -->
  <circle cx="90" cy="-140" r="26" fill="#bfe6ff" ${st(5)}/><path d="M90 -166 v52 M64 -140 h52" stroke="${INK}" stroke-width="4"/>
  <path d="M-46 0 V-100 Q0 -150 46 -100 V0 Z" fill="#b38a3a" ${stroke}/>
  <path d="M-30 -6 V-104 M-14 -4 V-118 M2 -4 V-122 M18 -6 V-116 M32 -6 V-104" stroke="#8d6a2a" stroke-width="3"/>
  <circle cx="30" cy="-52" r="6" fill="#6d4426"/>
</g></g>`;
};

/** Nuf-Nuf's twig house: wattle walls of woven brushwood on stakes, a roof of branches with leaves */
export const hata_khmyzova = () => {
  let weave = '';
  for (let i = 0, y = -24; y > -224; i++, y -= 22)
    weave += `<path d="M-150 ${y} q19 ${i % 2 ? 8 : -8} 38 0 t38 0 t38 0 t38 0 t38 0 t38 0 t38 0 t38 0" stroke="${i % 2 ? '#7a5230' : '#8b5e34'}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  return `
<g data-part="body"><g transform="scale(.9)">
  <rect x="-150" y="-230" width="300" height="230" fill="#a1764a" ${stroke}/>
  ${weave}
  ${[-150, -76, 0, 76, 150].map((x) => `<path d="M${x} 4 V-236" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M${x} 4 V-236" stroke="#6d4426" stroke-width="8" stroke-linecap="round"/>`).join('')}
  <!-- the roof of branches, twigs sticking out, a few green leaves -->
  <path d="M-200 -212 L0 -370 L200 -212 Z" fill="#7a5a34" ${stroke}/>
  <path d="M-170 -224 L20 -360 M-110 -216 L60 -330 M-40 -214 L110 -290 M30 -214 L150 -250 M0 -370 l-30 -30 M0 -370 l24 -34 M-200 -212 l-30 6 M200 -212 l30 -10" stroke="#5a3a22" stroke-width="7" stroke-linecap="round"/>
  ${[[-120, -250], [-40, -300], [60, -290], [130, -240], [10, -398]].map(([x, y]) => `<path d="M${x} ${y} q14 -18 30 -6 q-12 16 -30 6 z" fill="#7cb342" ${st(3)}/>`).join('')}
  <!-- a little square window, a door of sticks -->
  <rect x="62" y="-170" width="56" height="50" fill="#bfe6ff" ${st(5)}/><path d="M90 -170 v50" stroke="${INK}" stroke-width="4"/>
  <rect x="-48" y="-120" width="90" height="120" fill="#8b5e34" ${stroke}/>
  <path d="M-34 -4 V-116 M-18 -4 V-116 M-2 -4 V-116 M14 -4 V-116 M28 -4 V-116 M-48 -90 H42 M-48 -30 H42" stroke="#5a3a22" stroke-width="4"/>
</g></g>`;
};

/**
 * Naf-Naf's brick house: red brick walls on a stone base, a tiled roof, a brick chimney on the right
 * slope (its top at 130,-490: the wolf climbs to it), an oak door with iron bands and a big bolt
 * (mouth: the door), a window with a flower box.
 */
export const hata_tsehlyana = () => {
  let bricks = '';
  for (let i = 0, y = -44; y > -300; i++, y -= 26) {
    bricks += `<path d="M-206 ${y} H206" stroke="#8e3a26" stroke-width="3"/>`;
    for (let x = -206 + (i % 2 ? 26 : 0); x < 206; x += 52) bricks += `<path d="M${x} ${y} v-26" stroke="#8e3a26" stroke-width="3"/>`;
  }
  let stones = '';
  for (let x = -200; x < 200; x += 50) stones += `<ellipse cx="${x + 25}" cy="-22" rx="24" ry="16" fill="${x % 100 ? '#9e9e9e' : '#b0b0b0'}" ${st(3)}/>`;
  let tiles = '';
  for (let r = 0; r < 5; r++) {
    const y = -300 - r * 34;
    const half = 240 - r * 48;
    for (let x = -half + 12; x < half; x += 30) tiles += `<path d="M${x - 14} ${y} q14 16 28 0" fill="none" stroke="#5d2a1c" stroke-width="3"/>`;
  }
  let chimney = '';
  for (let y = -380; y > -480; y -= 22) chimney += `<path d="M104 ${y} H156" stroke="#8e3a26" stroke-width="3"/>`;
  return `
<g data-part="body">
  <!-- the chimney behind the roof -->
  <rect x="104" y="-480" width="52" height="130" fill="#c0533a" ${stroke}/>
  ${chimney}
  <rect x="96" y="-494" width="68" height="18" rx="4" fill="#8e3a26" ${st(4)}/>
  <rect x="-206" y="-300" width="412" height="300" fill="#c9603f" ${stroke}/>
  ${bricks}
  ${stones}
  <!-- the tiled roof -->
  <path d="M-246 -292 L0 -470 L246 -292 Z" fill="#8d3b26" ${stroke}/>
  ${tiles}
  <!-- the window, its shutters and a flower box -->
  <rect x="62" y="-230" width="90" height="80" fill="#bfe6ff" ${st(6)}/>
  <path d="M107 -230 v80 M62 -190 h90" stroke="${INK}" stroke-width="5"/>
  <path d="M40 -232 h22 v84 h-22 z M152 -232 h22 v84 h-22 z" fill="#2e7d32" ${st(4)}/>
  <rect x="54" y="-148" width="106" height="20" rx="4" fill="#6d4426" ${st(4)}/>
  ${[70, 92, 114, 136].map((x, i) => `<circle cx="${x}" cy="-156" r="9" fill="${['#e53935', '#fdd835', '#e53935', '#ab47bc'][i]}" ${st(2)}/>`).join('')}
  <!-- the strong oak door: iron bands, rivets, the bolt -->
  <path d="M-130 0 V-150 Q-80 -196 -30 -150 V0 Z" fill="#7b4a26" ${stroke}/>
  <path d="M-114 0 V-160 M-96 0 V-172 M-80 0 V-176 M-64 0 V-172 M-46 0 V-160" stroke="#5d3519" stroke-width="3"/>
  <path d="M-130 -36 H-30 M-130 -120 H-30" stroke="#455a64" stroke-width="10"/>
  ${[-118, -92, -66, -42].map((x) => `<circle cx="${x}" cy="-36" r="3.5" fill="#cfd8dc"/><circle cx="${x}" cy="-120" r="3.5" fill="#cfd8dc"/>`).join('')}
  <rect x="-60" y="-86" width="40" height="12" rx="4" fill="#90a4ae" ${st(3)}/><circle cx="-52" cy="-80" r="6" fill="#607d8b" ${st(2)}/>
</g>`;
};

/** the silly house of pillows: plump pillows in a heap, a quilt folded over for a roof, a curtain door */
export const hata_podushkova = () => {
  const pillow = (x: number, y: number, w: number, h: number, fill: string, dots = '') =>
    `<path d="M${x - w / 2} ${y} Q${x - w / 2 - 10} ${y - h / 2} ${x - w / 2} ${y - h} Q${x} ${y - h - 12} ${x + w / 2} ${y - h} Q${x + w / 2 + 10} ${y - h / 2} ${x + w / 2} ${y} Q${x} ${y + 10} ${x - w / 2} ${y} Z" fill="${fill}" ${st(4)}/>` +
    `<path d="M${x - w / 2 + 4} ${y - 4} l-12 8 M${x + w / 2 - 4} ${y - 4} l12 8 M${x - w / 2 + 4} ${y - h + 4} l-12 -8 M${x + w / 2 - 4} ${y - h + 4} l12 -8" stroke="${INK}" stroke-width="3"/>` +
    dots;
  const dots = (x: number, y: number, c: string) => [[-20, -16], [14, -30], [26, -10], [-8, -40], [-30, -38]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="5" fill="${c}"/>`).join('');
  return `
<g data-part="body">
  ${pillow(-100, 0, 110, 76, '#f8bbd0', dots(-100, 0, '#fff'))}
  ${pillow(100, 0, 110, 76, '#bbdefb', dots(100, 0, '#fff'))}
  ${pillow(-104, -78, 104, 72, '#fff59d')}
  ${pillow(104, -78, 104, 72, '#c8e6c9', dots(104, -78, '#fff'))}
  ${pillow(-90, -152, 120, 70, '#e1bee7')}
  ${pillow(90, -152, 120, 70, '#ffccbc', dots(90, -152, '#fff'))}
  <!-- the quilt roof: a patchwork, folded in two over the top -->
  <path d="M-180 -214 Q-110 -230 0 -360 Q110 -230 180 -214 Q0 -196 -180 -214 Z" fill="#ffab91" ${stroke}/>
  <path d="M-120 -222 L-40 -310 M-60 -210 L20 -330 M40 -212 L60 -290 M100 -216 L40 -320" stroke="#fff" stroke-width="4" stroke-dasharray="8 7"/>
  <circle cx="-80" cy="-250" r="10" fill="#4fc3f7"/><circle cx="60" cy="-262" r="10" fill="#fff176"/><circle cx="0" cy="-310" r="10" fill="#81c784"/>
  <circle cx="0" cy="-366" r="16" fill="#fff" ${st(4)}/>
  <!-- the door: a striped curtain between the pillows -->
  <path d="M-44 0 V-186 Q0 -200 44 -186 V0 Z" fill="#fff8e1" ${stroke}/>
  <path d="M-30 0 V-188 M-12 0 V-192 M8 0 V-192 M26 0 V-188" stroke="#4fc3f7" stroke-width="7"/>
  <path d="M-44 -186 Q0 -200 44 -186" fill="none" ${stroke}/>
</g>`;
};

// ---------------- building things ----------------

/** a stack of red bricks */
export const tsehla = () => {
  let s = '';
  for (let r = 0; r < 4; r++)
    for (let i = 0; i < 4 - (r > 1 ? 1 : 0); i++) {
      const x = -80 + i * 54 + (r % 2 ? 27 : 0);
      s += `<rect x="${x - 26}" y="${-26 - r * 26}" width="52" height="26" rx="3" fill="${(i + r) % 2 ? '#c0533a' : '#d0603f'}" ${st(3.5)}/>`;
    }
  return `<g data-part="body">${s}</g>`;
};

/** a trowel lying on its own (the wolf takes it up to build) */
export const kelma = () => `<g data-part="body"><g transform="rotate(-90) scale(1.2)">${trowel()}</g></g>`;

/** a bundle of straw tied in the middle */
export const soloma = () => {
  let s = '';
  for (let i = 0; i < 13; i++) {
    const x = -48 + i * 8;
    s += `<path d="M${x * 0.6} -4 Q${x * 0.3} -70 ${x * 1.2} -150" stroke="${i % 2 ? '#e2b43f' : '#f2cf66'}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  }
  return `<g data-part="body">${s}<path d="M-34 -70 Q0 -60 34 -70" stroke="#a1704a" stroke-width="10" fill="none" stroke-linecap="round"/></g>`;
};

/** a bundle of twigs (brushwood) tied with a cord */
export const khmyz = () => {
  let s = '';
  for (let i = 0; i < 9; i++) {
    const y = -12 - i * 9;
    s += `<path d="M-110 ${y} L110 ${y - (i % 3) * 6} M${60 + i * 4} ${y - 3} l26 -18" stroke="${i % 2 ? '#6d4426' : '#8b5e34'}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  }
  return `<g data-part="body">${s}<path d="M-60 -6 V-100 M50 -6 V-104" stroke="#d7a86e" stroke-width="8"/><path d="M-70 -66 q-16 -18 -4 -30" fill="#7cb342" ${st(2)}/></g>`;
};

/** the big black pot of boiling water in the fireplace: bubbles, steam (in front: who falls in shows from the chest up) */
export const kazan = () => `
<g data-part="body">
  <path d="M-130 -150 Q-150 -40 -80 -6 Q0 14 80 -6 Q150 -40 130 -150 Z" fill="#37474f" ${stroke}/>
  <path d="M-100 -110 q-10 50 20 80" stroke="#607d8b" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-150" rx="134" ry="26" fill="#263238" ${stroke}/>
  <ellipse cx="0" cy="-148" rx="116" ry="18" fill="#90caf9"/>
  ${[[-60, -152, 10], [-20, -146, 7], [30, -154, 12], [72, -148, 8], [4, -156, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e3f2fd" stroke="#64b5f6" stroke-width="2"/>`).join('')}
  <path d="M-50 -180 q-14 -20 0 -40 q14 -20 0 -40 M10 -186 q-14 -20 0 -40 q14 -20 0 -40 M66 -180 q-14 -20 0 -40 q14 -20 0 -40" stroke="#eceff1" stroke-width="8" fill="none" stroke-linecap="round" opacity=".85"/>
  <path d="M-140 -146 q-24 0 -24 -22 M140 -146 q24 0 24 -22" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>
</g>`;

/** the same pot with its lid on (no steam out yet) */
export const kazan_kryshka = () => `
<g data-part="body">
  <path d="M-130 -150 Q-150 -40 -80 -6 Q0 14 80 -6 Q150 -40 130 -150 Z" fill="#37474f" ${stroke}/>
  <path d="M-100 -110 q-10 50 20 80" stroke="#607d8b" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M-140 -146 q-24 0 -24 -22 M140 -146 q24 0 24 -22" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M-136 -150 Q0 -210 136 -150 Q0 -128 -136 -150 Z" fill="#546e7a" ${stroke}/>
  <rect x="-16" y="-200" width="32" height="18" rx="7" fill="#263238" ${st(3)}/>
  <path d="M110 -160 q8 -18 0 -30 M-110 -160 q-8 -18 0 -30" stroke="#eceff1" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
</g>`;

/** the scarecrow the piglets make: a pole, a sack face with button eyes, a straw hat, a patched coat, straw sticking out */
export const opudalo = () => `
<g data-part="body">
  <path d="M0 0 V-300" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M0 0 V-300" stroke="#a1704a" stroke-width="12" stroke-linecap="round"/>
  <path d="M-150 -250 H150" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M-150 -250 H150" stroke="#a1704a" stroke-width="10" stroke-linecap="round"/>
  <!-- straw out of the sleeves and from under the coat -->
  ${[-1, 1].map((s) => `<path d="M${s * 150} -252 l${s * 30} -14 M${s * 150} -250 l${s * 34} 2 M${s * 150} -248 l${s * 28} 16" stroke="#e2b43f" stroke-width="6" stroke-linecap="round"/>`).join('')}
  <path d="M-40 -120 l-10 34 M-16 -116 l-4 36 M16 -116 l4 36 M40 -120 l10 34" stroke="#e2b43f" stroke-width="6" stroke-linecap="round"/>
  <!-- the patched coat -->
  <path d="M-130 -270 L130 -270 L120 -228 L60 -230 L66 -118 L-66 -118 L-60 -230 L-120 -228 Z" fill="#8d6e63" ${stroke}/>
  <rect x="-44" y="-200" width="36" height="34" fill="#fbc02d" ${st(3)}/><rect x="16" y="-170" width="30" height="30" fill="#4fc3f7" ${st(3)}/>
  <path d="M-40 -196 l28 26 M-40 -170 l28 -26" stroke="#e65100" stroke-width="2"/>
  <!-- the sack head, button eyes, a stitched grin, a straw hat -->
  <ellipse cx="0" cy="-322" rx="50" ry="54" fill="#e6cfa0" ${stroke}/>
  <circle cx="-18" cy="-334" r="9" fill="#37474f"/><circle cx="18" cy="-334" r="9" fill="#37474f"/>
  <path d="M-22 -298 q22 16 44 0" fill="none" stroke="${INK}" stroke-width="4"/><path d="M-14 -300 v8 M0 -296 v8 M14 -300 v8" stroke="${INK}" stroke-width="3"/>
  <path d="M-30 -276 Q0 -264 30 -276" stroke="#a1704a" stroke-width="7" fill="none"/>
  <ellipse cx="0" cy="-366" rx="92" ry="16" fill="#e9c46a" ${stroke}/>
  <path d="M-46 -368 Q-44 -414 0 -416 Q44 -414 46 -368 Z" fill="#f2d27a" ${stroke}/>
  <path d="M-46 -378 Q0 -386 46 -378" fill="none" stroke="#e53935" stroke-width="8"/>
  <path d="M80 -366 l24 4 M-80 -366 l-24 6" stroke="#e2b43f" stroke-width="5" stroke-linecap="round"/>
</g>`;

// ---------------- the wolf, dressed by the tale ----------------

/** the wolf after the pillow house burst: white feathers stuck all over him */
export const vovk_pirya = () => {
  const feather = (x: number, y: number, r: number) =>
    `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.6)"><path d="M0 0 Q-10 -18 0 -34 Q10 -18 0 0 Z" fill="#fff" ${st(2.5)}/><path d="M0 2 V-30" stroke="#bdbdbd" stroke-width="2"/></g>`;
  const all = [[-20, -200, -20], [20, -170, 30], [-30, -120, 10], [30, -110, -30], [0, -150, 60], [-50, -160, -60], [40, -220, 15], [10, -90, -10], [-14, -300, -30], [40, -320, 20], [-70, -250, 70], [20, -260, -10], [70, -60, 40], [-30, -40, -20], [90, -80, 80]];
  return vovk().replace(/<\/g>\s*$/, `${all.map(([x, y, r]) => feather(x, y, r)).join('')}${feather(20, -346, 10)}${feather(34, -340, 40)}</g>`);
};

/** the wolf turned builder: a yellow hard hat (comes off for a hat), a pencil behind his ear */
export const vovk_kaska = () =>
  vovk().replace(
    /<\/g>\s*$/,
    `<path d="M44 -320 L74 -350" stroke="#fbc02d" stroke-width="8" stroke-linecap="round"/><path d="M74 -350 l5 -5" stroke="${INK}" stroke-width="4"/>` +
      `<g data-part="hat"><path d="M-30 -300 Q-28 -360 16 -362 Q60 -360 62 -300 Z" fill="#fdd835" ${stroke}/>` +
      `<path d="M8 -360 V-302 M24 -360 V-302" stroke="#f9a825" stroke-width="4"/>` +
      `<path d="M-44 -302 Q16 -288 76 -302 L76 -292 Q16 -278 -44 -292 Z" fill="#fbc02d" ${st(4)}/></g></g>`,
  );
