// The puppets of «Дюймовочка»: the tiny girl herself (golden hair, a dress of tulip petals; drawn at a
// girl's size — on stage she is shown small, size ≈ 0.6, so the flowers, the nutshell and the toad
// round her look giant), the May beetle, the mole in his velvet coat and little gold glasses, the
// swallow and the prince of the elves (a crown, see-through wings). Not heroes: the woman, the old
// witch, the toad's son, the other beetles, the fish and the white butterfly. Things: the barley
// grain, the flower pot and the tulip that grows in it (closed bud; open: look vidkrytyi), the
// walnut-shell cradle, the plate of water with its wreath, the tulip petal she rows on, the lily pad
// and its stem (the fish gnaw it through), the daisy, the burdock leaf, the field mouse's door (in
// winter: look zyma), the hay blanket, the beam of light in the mole's tunnel, the red flower she
// says goodbye to, and the big white flower of the warm land (the prince lives in it).
// The toad is the frog of «Рукавичка» (zhabka, shown big), the field mouse — myshka.
//
// Wings (data-part="wings", data-cx/cy) flutter: fast while flying (off the ground), slowly at rest.
// Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stroke } from './characters';

const SKIN = '#f6d3b5';
const HAIR = '#f2c14e';
const HAIR_DARK = '#c98d1c';

/** a thick limb: the ink outline, then its colour over it */
const limb = (d: string, fill: string, w: number) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;

/** a flower of n petals (ellipses) round x, y */
const petals = (x: number, y: number, n: number, len: number, wid: number, fill: string, middle: string, mr: number) =>
  Array.from({ length: n }, (_, i) => `<ellipse cx="${x}" cy="${y - len}" rx="${wid}" ry="${len}" fill="${fill}" ${st(3)} transform="rotate(${((360 / n) * i).toFixed(1)} ${x} ${y})"/>`).join('') +
  `<circle cx="${x}" cy="${y}" r="${mr}" fill="${middle}" ${st(3)}/>`;

/** see-through wings round cx, cy (a pair up, a pair down), w — how far they reach */
const wings = (cx: number, cy: number, w: number, fill: string, edge: string) => {
  const one = (sx: number) =>
    `<path d="M${cx} ${cy} Q${cx + sx * w * 0.5} ${cy - w * 1.05} ${cx + sx * w} ${cy - w * 0.8} Q${cx + sx * w * 1.05} ${cy - w * 0.35} ${cx} ${cy} Z" fill="${fill}" fill-opacity=".72" stroke="${edge}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M${cx} ${cy} Q${cx + sx * w * 0.8} ${cy + w * 0.05} ${cx + sx * w * 0.78} ${cy + w * 0.48} Q${cx + sx * w * 0.35} ${cy + w * 0.5} ${cx} ${cy} Z" fill="${fill}" fill-opacity=".72" stroke="${edge}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M${cx} ${cy} Q${cx + sx * w * 0.5} ${cy - w * 0.6} ${cx + sx * w * 0.85} ${cy - w * 0.7} M${cx} ${cy} Q${cx + sx * w * 0.5} ${cy + w * 0.2} ${cx + sx * w * 0.66} ${cy + w * 0.4}" fill="none" stroke="${edge}" stroke-width="2" opacity=".8"/>`;
  return `<g data-part="wings" data-cx="${cx}" data-cy="${cy}">${one(-1)}${one(1)}</g>`;
};

// ---------- Дюймовочка ----------

/**
 * Thumbelina: long golden hair over her shoulders, a pink dress whose skirt is three tulip petals,
 * a belt and a collar of green sepals, bare legs, little slippers of green leaves; a tiny pink
 * flower in her hair (data-part="hat"). extra: drawn behind her (wings), crown: instead of the
 * flower (the queen of the elves).
 */
const girl = (extra = '', crown = '') => `
<g data-part="body">
  ${extra}
  <!-- the long hair behind her -->
  <path d="M-42 -262 Q-64 -200 -52 -146 Q-26 -156 0 -160 Q26 -156 52 -146 Q64 -200 42 -262 Z" fill="${HAIR}" ${st(4)}/>
  <!-- bare legs, slippers of green leaves -->
  <rect x="-24" y="-86" width="16" height="76" rx="7" fill="${SKIN}" ${st(4)}/>
  <rect x="8" y="-86" width="16" height="76" rx="7" fill="${SKIN}" ${st(4)}/>
  <path d="M-8 -18 Q-10 0 -24 0 Q-46 0 -44 -10 Q-30 -12 -24 -22 Z" fill="#66bb6a" ${st(3.5)}/>
  <path d="M8 -18 Q10 0 24 0 Q46 0 44 -10 Q30 -12 24 -22 Z" fill="#66bb6a" ${st(3.5)}/>
  <path d="M-40 -8 q8 -6 18 -8 M40 -8 q-8 -6 -18 -8" stroke="#2e7d32" stroke-width="2.5" fill="none"/>
  <!-- the skirt: three tulip petals, pointed at the hem -->
  <path d="M-28 -182 Q-90 -138 -74 -66 Q-50 -76 -40 -64 Q-30 -120 -10 -180 Z" fill="#ec407a" ${st(4)}/>
  <path d="M28 -182 Q90 -138 74 -66 Q50 -76 40 -64 Q30 -120 10 -180 Z" fill="#ec407a" ${st(4)}/>
  <path d="M0 -184 Q-52 -150 -44 -66 Q-22 -58 0 -50 Q22 -58 44 -66 Q52 -150 0 -184 Z" fill="#f48fb1" ${st(4)}/>
  <path d="M-20 -150 Q-24 -110 -18 -80 M20 -150 Q24 -110 18 -80" stroke="#f8bbd0" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g data-dress="legs"></g>
  <!-- the bodice, a belt of green sepals -->
  <path d="M-38 -238 Q-48 -208 -42 -178 L42 -178 Q48 -208 38 -238 Q0 -250 -38 -238 Z" fill="#f48fb1" ${stroke}/>
  <path d="M-44 -184 L-30 -170 L-16 -184 L0 -168 L16 -184 L30 -170 L44 -184 L40 -192 L-40 -192 Z" fill="#66bb6a" ${st(3)}/>
  <!-- arms: little petal sleeves, then bare arms -->
  ${limb('M-42 -222 Q-60 -196 -54 -164', SKIN, 12)}
  ${limb('M42 -222 Q60 -196 54 -164', SKIN, 12)}
  <path d="M-30 -240 Q-64 -244 -60 -214 Q-48 -206 -36 -214 Z" fill="#ec407a" ${st(3.5)}/>
  <path d="M30 -240 Q64 -244 60 -214 Q48 -206 36 -214 Z" fill="#ec407a" ${st(3.5)}/>
  <g data-dress="torso"></g>
  <circle cx="-54" cy="-160" r="10" fill="${SKIN}" ${st(4)}/>
  <circle cx="54" cy="-160" r="10" fill="${SKIN}" ${st(4)}/>
  <!-- a collar of green sepals -->
  <path data-part="collar" d="M-26 -218 L-18 -202 L-8 -214 L0 -198 L8 -214 L18 -202 L26 -218 Q0 -228 -26 -218 Z" fill="#81c784" ${st(3)}/>
  <!-- the head, the golden hair with a parting, two locks down over the shoulders -->
  <ellipse cx="0" cy="-252" rx="34" ry="36" fill="${SKIN}" ${stroke}/>
  <path d="M-36 -252 Q-40 -294 0 -294 Q40 -294 36 -252 Q30 -270 14 -276 Q4 -268 0 -282 Q-4 -268 -14 -276 Q-30 -270 -36 -252 Z" fill="${HAIR}" ${st(4)}/>
  <path d="M-36 -258 Q-48 -220 -40 -186 Q-30 -192 -28 -206 Q-30 -232 -30 -254 Z" fill="${HAIR}" ${st(3.5)}/>
  <path d="M36 -258 Q48 -220 40 -186 Q30 -192 28 -206 Q30 -232 30 -254 Z" fill="${HAIR}" ${st(3.5)}/>
  <path d="M-20 -286 q10 -6 18 -4 M-40 -220 q2 12 0 22 M40 -220 q-2 12 0 22" stroke="${HAIR_DARK}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <g data-part="hat">${
    crown ||
    `<path d="M22 -284 q14 -16 28 -6 q-8 12 -24 12 z" fill="#81c784" ${st(2.5)}/>` +
      `<path d="M14 -298 Q12 -322 24 -326 Q30 -312 34 -326 Q46 -322 42 -298 Q28 -290 14 -298 Z" fill="#ec407a" ${st(3)}/>`
  }</g>
  ${eyes(0, -252, 26, 6)}
  ${closedEyes(0, -252, 26, 6)}
  <ellipse cx="-19" cy="-236" rx="7" ry="4.5" fill="#f0786a" opacity=".7"/>
  <ellipse cx="19" cy="-236" rx="7" ry="4.5" fill="#f0786a" opacity=".7"/>
  ${mouth(
    `<path d="M-8 -229 q8 7 16 0" fill="none" ${st(3.5)}/>`,
    `<path d="M-8 -231 q8 14 16 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
</g>`;

export const duimovochka = () => girl();
/** with the wings the elves gave her and the prince's little crown: the queen of the elves, Maya */
export const duimovochka_koroleva = () =>
  girl(
    wings(0, -206, 150, '#e1f5fe', '#4fc3f7'),
    `<path d="M-30 -286 L-32 -318 L-16 -302 L0 -326 L16 -302 L32 -318 L30 -286 Q0 -294 -30 -286 Z" fill="#ffd54f" ${st(3)}/>` +
      `<circle cx="0" cy="-308" r="5" fill="#ec407a"/><circle cx="-20" cy="-296" r="3.5" fill="#4fc3f7"/><circle cx="20" cy="-296" r="3.5" fill="#81c784"/>`,
  );

// ---------- the May beetle ----------

/** one beetle's fan antenna, from its root up to the fan at fx, fy */
const antenna = (x: number, y: number, fx: number, fy: number, sx: number, fill: string) =>
  `<path d="M${x} ${y} Q${(x + fx) / 2 + sx * 4} ${(y + fy) / 2 - 10} ${fx} ${fy}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
  [-50, -20, 10, 40].map((a) => `<ellipse cx="${fx}" cy="${fy - 14}" rx="5" ry="15" fill="${fill}" ${st(2.5)} transform="rotate(${sx * a} ${fx} ${fy})"/>`).join('');

/**
 * The May beetle, standing up on his back legs: chestnut wing cases, the dark shield behind his
 * head, the white zig-zag along his sides (as a real May beetle has), big round eyes, fan antennae
 * (they twitch: data-part="ears"), four arms; see-through flying wings peep out under the wing
 * cases. c — his colours (the other beetles are a beetle of another colour).
 */
const beetle = (c = { shell: '#a0522d', shellDark: '#6d3517', body: '#3a2a22', head: '#2f2622', fan: '#b5651d' }) => {
  let zig = '';
  for (let i = 0; i < 6; i++) zig += `<path d="M-70 ${-226 + i * 28} l12 12 l-12 12 Z M70 ${-226 + i * 28} l-12 12 l12 12 Z" fill="#fafafa"/>`;
  return `
<g data-part="body">
  ${wings(0, -150, 120, '#eceff1', '#90a4ae')}
  <!-- the back legs he stands on -->
  ${limb('M-26 -84 Q-46 -50 -34 -10', '#5d3a1e', 9)}
  ${limb('M26 -84 Q46 -50 34 -10', '#5d3a1e', 9)}
  <path d="M-34 -8 l-22 2 M34 -8 l22 2" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
  <g data-dress="legs"></g>
  <!-- the body, the white zig-zag along the sides -->
  <ellipse cx="0" cy="-150" rx="72" ry="104" fill="${c.body}" ${stroke}/>
  ${zig}
  <!-- the wing cases -->
  <path d="M-3 -238 Q-62 -232 -64 -156 Q-62 -76 -3 -58 Z" fill="${c.shell}" ${stroke}/>
  <path d="M3 -238 Q62 -232 64 -156 Q62 -76 3 -58 Z" fill="${c.shell}" ${stroke}/>
  <path d="M-22 -224 Q-30 -150 -22 -74 M-44 -214 Q-52 -150 -40 -90 M22 -224 Q30 -150 22 -74 M44 -214 Q52 -150 40 -90" stroke="${c.shellDark}" stroke-width="3.5" fill="none"/>
  <path d="M-36 -204 q8 -8 16 -4" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>
  <!-- four arms -->
  ${limb('M-56 -214 Q-92 -196 -96 -150', '#5d3a1e', 9)}
  ${limb('M56 -214 Q92 -196 96 -150', '#5d3a1e', 9)}
  ${limb('M-60 -150 Q-86 -128 -80 -96', '#5d3a1e', 8)}
  ${limb('M60 -150 Q86 -128 80 -96', '#5d3a1e', 8)}
  <g data-dress="torso"></g>
  <path d="M-96 -150 l-10 10 M-96 -150 l6 12 M96 -150 l10 10 M96 -150 l-6 12" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <!-- the shield behind the head -->
  <path d="M-52 -238 Q-46 -262 0 -266 Q46 -262 52 -238 Q26 -230 0 -232 Q-26 -230 -52 -238 Z" fill="${c.head}" ${st(4)}/>
  <!-- fan antennae -->
  <g data-part="ears" data-cx="0" data-cy="-300">
    ${antenna(-16, -308, -46, -356, -1, c.fan)}
    ${antenna(16, -308, 46, -356, 1, c.fan)}
  </g>
  <!-- the head, big round eyes -->
  <ellipse cx="0" cy="-284" rx="44" ry="36" fill="${c.head}" ${stroke}/>
  ${eyes(0, -292, 38, 7, true)}
  ${closedEyes(0, -292, 38, 7)}
  <ellipse cx="-24" cy="-270" rx="7" ry="4" fill="#f0786a" opacity=".55"/>
  <ellipse cx="24" cy="-270" rx="7" ry="4" fill="#f0786a" opacity=".55"/>
  ${mouth(
    `<path d="M-12 -262 q12 8 24 0" fill="none" stroke="#e0c9a6" stroke-width="4" stroke-linecap="round"/><path d="M-16 -256 l6 8 M16 -256 l-6 8" stroke="#e0c9a6" stroke-width="4" stroke-linecap="round"/>`,
    `<path d="M-13 -264 q13 18 26 0 z" fill="#8a2a1a" stroke="#e0c9a6" stroke-width="3"/><path d="M-18 -254 l6 10 M18 -254 l-6 10" stroke="#e0c9a6" stroke-width="4" stroke-linecap="round"/>`,
  )}
</g>`;
};
export const zhuk = () => beetle();

/** the other beetles: a green-bronze one and a dark one, side by side (they speak together) */
export const zhuky = () => {
  const one = (x: number, c: Parameters<typeof beetle>[0]) => `<g transform="translate(${x} 0) scale(.72)">${beetle(c)}</g>`;
  return (
    one(-90, { shell: '#2e7d32', shellDark: '#1b5e20', body: '#263238', head: '#1b3a2a', fan: '#7cb342' }) +
    one(90, { shell: '#5d4037', shellDark: '#3e2723', body: '#212121', head: '#3e2723', fan: '#8d6e63' })
  ).replace(/data-part="body"/g, 'data-part="b"').replace(/data-part="wings"/g, 'data-part="w"').replace(/^/, '<g data-part="body">') + '</g>';
};

// ---------- the mole ----------

/**
 * The mole: black velvety fur, a long pink snout, big pink spade-paws, tiny eyes behind little
 * round gold glasses (data-part="glasses": they come off for glasses of the wardrobe); a rich
 * plum velvet coat with gold buttons and a white fur hem, its fur collar (data-part="collar").
 */
export const krit = () => `
<g data-part="body">
  <!-- pink feet -->
  <ellipse cx="-34" cy="-12" rx="34" ry="14" fill="#f4a6a0" ${st(4)}/>
  <ellipse cx="34" cy="-12" rx="34" ry="14" fill="#f4a6a0" ${st(4)}/>
  <path d="M-62 -6 l-6 6 M-52 -2 l-4 6 M62 -6 l6 6 M52 -2 l4 6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <!-- the round black body -->
  <ellipse cx="0" cy="-158" rx="90" ry="134" fill="#2e2b3a" ${stroke}/>
  <!-- the velvet coat: plum, gold buttons, a white fur hem -->
  <path d="M-80 -232 Q-100 -130 -86 -40 Q0 -24 86 -40 Q100 -130 80 -232 Q40 -258 0 -250 Q-40 -258 -80 -232 Z" fill="#6a1b9a" ${stroke}/>
  <path d="M-10 -246 L-4 -36 M10 -246 L4 -36" stroke="#4a148c" stroke-width="5"/>
  <path d="M-60 -200 Q-70 -140 -60 -80" stroke="#9c4dcc" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>
  <path d="M-88 -50 Q0 -30 88 -50 L90 -30 Q0 -8 -90 -30 Z" fill="#fafafa" ${st(4)}/>
  <path d="M-70 -42 l4 6 M-40 -36 l4 6 M-10 -33 l4 6 M20 -33 l4 6 M50 -37 l4 6 M76 -44 l4 6" stroke="#9e9e9e" stroke-width="2.5"/>
  <circle cx="18" cy="-200" r="7" fill="#ffd54f" ${st(3)}/><circle cx="18" cy="-160" r="7" fill="#ffd54f" ${st(3)}/><circle cx="18" cy="-120" r="7" fill="#ffd54f" ${st(3)}/>
  <!-- (his legs are short, under the coat: trousers go over its lower half) -->
  <g data-dress="legs"></g>
  <!-- arms in velvet sleeves, big pink spade-paws with claws -->
  ${limb('M-76 -224 Q-112 -190 -104 -140', '#6a1b9a', 26)}
  ${limb('M76 -224 Q112 -190 104 -140', '#6a1b9a', 26)}
  <g data-dress="torso"></g>
  <path d="M-126 -150 Q-130 -112 -100 -104 Q-80 -110 -82 -140 Q-100 -158 -126 -150 Z" fill="#f4a6a0" ${st(4)}/>
  <path d="M126 -150 Q130 -112 100 -104 Q80 -110 82 -140 Q100 -158 126 -150 Z" fill="#f4a6a0" ${st(4)}/>
  <path d="M-126 -140 l-12 -4 M-124 -126 l-12 0 M-118 -112 l-10 4 M126 -140 l12 -4 M124 -126 l12 0 M118 -112 l10 4" stroke="#fafafa" stroke-width="5" stroke-linecap="round"/>
  <!-- the fur collar -->
  <path data-part="collar" d="M-62 -238 Q0 -206 62 -238 Q66 -224 52 -214 Q0 -192 -52 -214 Q-66 -224 -62 -238 Z" fill="#fafafa" ${st(4)}/>
  <!-- the head: velvet black, a long pink snout -->
  <ellipse cx="0" cy="-294" rx="64" ry="56" fill="#2e2b3a" ${stroke}/>
  <path d="M-34 -330 q20 -12 40 -8" stroke="#55516b" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M-16 -290 Q-22 -250 -12 -236 Q0 -230 12 -236 Q22 -250 16 -290 Z" fill="#f4a6a0" ${st(4)}/>
  <ellipse cx="0" cy="-236" rx="13" ry="9" fill="#e57373" ${st(3)}/>
  <path d="M-16 -250 l-34 -6 M-16 -244 l-32 6 M16 -250 l34 -6 M16 -244 l32 6" stroke="#bdbdbd" stroke-width="2.5"/>
  ${eyes(0, -304, 48, 4)}
  ${closedEyes(0, -304, 48, 4)}
  <g data-part="glasses">
    <circle cx="-24" cy="-304" r="12" fill="#e3f2fd" fill-opacity=".3" stroke="#f9a825" stroke-width="4"/>
    <circle cx="24" cy="-304" r="12" fill="#e3f2fd" fill-opacity=".3" stroke="#f9a825" stroke-width="4"/>
    <path d="M-12 -306 Q0 -314 12 -306" stroke="#f9a825" stroke-width="4" fill="none"/>
  </g>
  ${mouth(
    `<path d="M-8 -224 q8 6 16 0" fill="none" ${st(3)}/>`,
    `<path d="M-9 -226 q9 14 18 0 z" fill="#8a2a1a" ${st(3)}/>`,
  )}
</g>`;

// ---------- the swallow ----------

/**
 * The swallow: a glossy dark-blue back and wings, a white breast, a red-brown forehead and throat,
 * a short beak, a long forked tail behind her; the wings at her sides flap (data-part="wings").
 */
export const lastivka = () => `
<g data-part="body">
  <!-- the forked tail -->
  <path d="M10 -90 Q60 -60 96 -2 Q66 -40 40 -56 Q60 -30 62 4 Q34 -40 -6 -76 Z" fill="#1c2a6b" ${stroke}/>
  <!-- little legs -->
  <path d="M-16 -46 V-8 M16 -46 V-8" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
  <path d="M-28 -4 L-16 -8 L-4 -4 M4 -4 L16 -8 L28 -4" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g data-dress="legs"></g>
  <!-- the body, the white breast -->
  <ellipse cx="0" cy="-144" rx="74" ry="104" fill="#1c2a6b" ${stroke}/>
  <path d="M-48 -196 Q-60 -100 0 -42 Q60 -100 48 -196 Q0 -176 -48 -196 Z" fill="#fafafa" ${st(4)}/>
  <path d="M-30 -120 q8 6 16 0 M6 -100 q8 6 16 0 M-14 -76 q8 6 16 0" stroke="#e0e0e0" stroke-width="3" fill="none"/>
  <!-- the long pointed wings at her sides -->
  <g data-part="wings" data-cx="0" data-cy="-190">
    <path d="M-58 -206 Q-128 -170 -118 -40 Q-98 -60 -84 -100 Q-74 -150 -46 -176 Z" fill="#283593" ${stroke}/>
    <path d="M58 -206 Q128 -170 118 -40 Q98 -60 84 -100 Q74 -150 46 -176 Z" fill="#283593" ${stroke}/>
    <path d="M-92 -150 Q-104 -110 -106 -70 M92 -150 Q104 -110 106 -70" stroke="#5c6bc0" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>
  <g data-dress="torso"></g>
  <!-- the head: red-brown forehead and throat, a short dark beak -->
  <circle cx="0" cy="-256" r="52" fill="#1c2a6b" ${stroke}/>
  <path d="M-36 -230 Q0 -196 36 -230 Q30 -212 0 -204 Q-30 -212 -36 -230 Z" fill="#c0392b" ${st(3.5)}/>
  <path d="M-18 -300 Q0 -310 18 -300 Q12 -290 0 -290 Q-12 -290 -18 -300 Z" fill="#c0392b" ${st(3)}/>
  <path d="M-28 -282 q14 -8 26 -4" stroke="#5c6bc0" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${eyes(0, -266, 40, 7, true)}
  ${closedEyes(0, -266, 40, 7)}
  ${mouth(
    `<path d="M-12 -244 L0 -226 L12 -244 Z" fill="#37474f" ${st(3)}/>`,
    `<path d="M-12 -248 L0 -238 L12 -248 Z M-12 -240 L0 -222 L12 -240 Z" fill="#37474f" ${st(3)}/><path d="M-8 -240 h16" stroke="#8a2a1a" stroke-width="5"/>`,
  )}
</g>`;

// ---------- the prince of the elves ----------

/**
 * The prince of the elves, as tiny as she is: see-through wings, a golden crown (data-part="hat"),
 * fair curls, a sky-blue tunic with a hem of petals, white tights, green pointed shoes.
 */
export const elf = () => `
<g data-part="body">
  ${wings(0, -206, 150, '#e1f5fe', '#4fc3f7')}
  <!-- legs in white tights, pointed green shoes -->
  <rect x="-24" y="-96" width="17" height="86" rx="7" fill="#fafafa" ${st(4)}/>
  <rect x="7" y="-96" width="17" height="86" rx="7" fill="#fafafa" ${st(4)}/>
  <path d="M-8 -20 Q-8 0 -26 0 Q-50 -2 -54 -16 Q-36 -12 -24 -22 Z" fill="#43a047" ${st(3.5)}/>
  <path d="M8 -20 Q8 0 26 0 Q50 -2 54 -16 Q36 -12 24 -22 Z" fill="#43a047" ${st(3.5)}/>
  <circle cx="-54" cy="-16" r="4" fill="#ffd54f"/><circle cx="54" cy="-16" r="4" fill="#ffd54f"/>
  <g data-dress="legs"></g>
  <!-- the tunic, a hem of petals, a golden belt -->
  <path d="M-40 -238 Q-52 -190 -50 -110 L50 -110 Q52 -190 40 -238 Q0 -250 -40 -238 Z" fill="#4fc3f7" ${stroke}/>
  <path d="M-52 -112 Q-46 -84 -32 -96 Q-26 -80 -12 -94 Q0 -78 12 -94 Q26 -80 32 -96 Q46 -84 52 -112 Z" fill="#b3e5fc" ${st(3.5)}/>
  <rect x="-48" y="-168" width="96" height="12" rx="5" fill="#ffd54f" ${st(3)}/>
  <path d="M-6 -234 L0 -170 M6 -234 L0 -170" stroke="#0288d1" stroke-width="3"/>
  <!-- arms in sleeves -->
  ${limb('M-42 -224 Q-62 -196 -56 -160', '#4fc3f7', 13)}
  ${limb('M42 -224 Q62 -196 56 -160', '#4fc3f7', 13)}
  <g data-dress="torso"></g>
  <circle cx="-56" cy="-156" r="10" fill="${SKIN}" ${st(4)}/>
  <circle cx="56" cy="-156" r="10" fill="${SKIN}" ${st(4)}/>
  <path data-part="collar" d="M-24 -222 Q0 -206 24 -222 L20 -210 Q0 -198 -20 -210 Z" fill="#fafafa" ${st(3)}/>
  <!-- pointed ears, the head, fair curls -->
  <path d="M-32 -258 L-54 -270 L-32 -242 Z M32 -258 L54 -270 L32 -242 Z" fill="${SKIN}" ${st(3.5)}/>
  <ellipse cx="0" cy="-254" rx="33" ry="35" fill="${SKIN}" ${stroke}/>
  <path d="M-34 -258 Q-44 -296 0 -294 Q44 -296 34 -258 Q30 -272 20 -276 Q14 -266 6 -276 Q0 -266 -6 -276 Q-14 -266 -20 -276 Q-30 -272 -34 -258 Z" fill="#fff59d" ${st(4)}/>
  <circle cx="-30" cy="-270" r="8" fill="#fff59d" ${st(3)}/><circle cx="30" cy="-270" r="8" fill="#fff59d" ${st(3)}/>
  <g data-part="hat">
    <path d="M-28 -284 L-30 -318 L-14 -300 L0 -326 L14 -300 L30 -318 L28 -284 Q0 -292 -28 -284 Z" fill="#ffd54f" ${st(3)}/>
    <circle cx="0" cy="-306" r="5" fill="#e53935"/><circle cx="-30" cy="-320" r="4" fill="#fff"/><circle cx="30" cy="-320" r="4" fill="#fff"/>
  </g>
  ${eyes(0, -254, 26, 6)}
  ${closedEyes(0, -254, 26, 6)}
  <ellipse cx="-19" cy="-238" rx="7" ry="4.5" fill="#f0786a" opacity=".6"/>
  <ellipse cx="19" cy="-238" rx="7" ry="4.5" fill="#f0786a" opacity=".6"/>
  ${mouth(
    `<path d="M-8 -231 q8 7 16 0" fill="none" ${st(3.5)}/>`,
    `<path d="M-8 -233 q8 14 16 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
</g>`;

// ---------- not heroes: the woman, the witch, the toad's son, the fish, the butterfly ----------

/** the woman who wished for a child: a red headscarf, a white embroidered blouse, a blue skirt */
export const zhinka = () => `
<g data-part="body">
  <path d="M-58 -176 L-82 -6 L82 -6 L58 -176 Z" fill="#1e5aa8" ${stroke}/>
  <path d="M-78 -36 L78 -36" stroke="#f5c542" stroke-width="9"/>
  <path d="M-70 -64 L70 -64" stroke="#e53935" stroke-width="6"/>
  <path d="M-52 -2 q-4 6 -16 4 M52 -2 q4 6 16 4" ${stroke} fill="none"/>
  <path d="M-52 -240 Q-64 -204 -58 -170 L58 -170 Q64 -204 52 -240 Q0 -256 -52 -240 Z" fill="#fbf7ee" ${stroke}/>
  <path d="M-8 -238 l8 8 l8 -8 M-8 -224 l8 8 l8 -8 M-8 -210 l8 8 l8 -8" stroke="#c62828" stroke-width="4" fill="none"/>
  <rect x="-60" y="-180" width="120" height="13" rx="5" fill="#c62828" ${st(4)}/>
  ${limb('M-50 -232 Q-80 -196 -64 -160', '#fbf7ee', 22)}
  ${limb('M50 -232 Q80 -196 64 -160', '#fbf7ee', 22)}
  <path d="M-78 -206 l12 6 M66 -200 l12 -6" stroke="#c62828" stroke-width="5"/>
  <circle cx="-64" cy="-156" r="12" fill="#f2c4a0" ${st(4)}/>
  <circle cx="64" cy="-156" r="12" fill="#f2c4a0" ${st(4)}/>
  <ellipse cx="0" cy="-282" rx="38" ry="42" fill="#f2c4a0" ${stroke}/>
  <path d="M-46 -276 Q-50 -336 0 -338 Q50 -336 46 -276 Q40 -306 0 -310 Q-40 -306 -46 -276 Z" fill="#c62828" ${stroke}/>
  <path d="M-28 -326 l5 5 M0 -332 l5 5 M24 -326 l5 5 M-40 -300 l5 5 M36 -300 l5 5" stroke="#fff59d" stroke-width="4" stroke-linecap="round"/>
  <path d="M-30 -308 Q-32 -296 -36 -290 M30 -308 Q32 -296 36 -290" stroke="#5d3a1a" stroke-width="8" stroke-linecap="round"/>
  ${eyes(0, -284, 28, 6)}
  ${closedEyes(0, -284, 28, 6)}
  <ellipse cx="-20" cy="-266" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  <ellipse cx="20" cy="-266" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  ${mouth(
    `<path d="M-10 -258 q10 9 20 0" fill="none" ${st(4)}/>`,
    `<path d="M-10 -260 q10 16 20 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
</g>`;

/** the old witch, a kind one: a starry purple cloak to the ground, a pointed hat, a staff with a star */
export const charivnytsia = () => `
<g data-part="body">
  <!-- the staff -->
  <path d="M-96 0 L-92 -330" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M-96 0 L-92 -330" stroke="#8d6e3b" stroke-width="7" stroke-linecap="round"/>
  <path d="M-92 -376 l9 22 h24 l-19 14 l7 23 l-21 -14 l-21 14 l7 -23 l-19 -14 h24 z" fill="#ffd54f" ${st(3)}/>
  <!-- the cloak -->
  <path d="M-46 -250 Q-70 -130 -92 -4 L92 -4 Q70 -130 46 -250 Q0 -268 -46 -250 Z" fill="#5e35b1" ${stroke}/>
  <path d="M-40 -60 l4 -10 l4 10 l-4 10 Z M30 -120 l4 -10 l4 10 l-4 10 Z M-20 -180 l4 -10 l4 10 l-4 10 Z M50 -40 l4 -10 l4 10 l-4 10 Z M-60 -110 l4 -10 l4 10 l-4 10 Z" fill="#fff59d"/>
  ${limb('M-40 -234 Q-80 -210 -92 -180', '#5e35b1', 24)}
  ${limb('M40 -234 Q70 -196 54 -160', '#5e35b1', 24)}
  <circle cx="-92" cy="-180" r="12" fill="#e8c9a8" ${st(4)}/>
  <circle cx="54" cy="-156" r="12" fill="#e8c9a8" ${st(4)}/>
  <!-- long grey hair, the face, a big nose -->
  <path d="M-40 -296 Q-58 -230 -46 -196 Q-30 -210 -28 -250 Z M40 -296 Q58 -230 46 -196 Q30 -210 28 -250 Z" fill="#cfd8dc" ${st(4)}/>
  <ellipse cx="0" cy="-276" rx="36" ry="40" fill="#e8c9a8" ${stroke}/>
  <path d="M-4 -280 Q-26 -262 -6 -256" fill="#d9a988" ${st(3)}/>
  <path d="M-22 -244 q-6 6 -2 12 M22 -244 q6 6 2 12" stroke="#bfa28a" stroke-width="3" fill="none"/>
  ${eyes(0, -288, 30, 5)}
  ${closedEyes(0, -288, 30, 5)}
  <path d="M-26 -300 q8 -4 14 0 M12 -300 q8 -4 14 0" stroke="#cfd8dc" stroke-width="5" stroke-linecap="round" fill="none"/>
  ${mouth(
    `<path d="M-10 -248 q10 8 20 0" fill="none" ${st(3.5)}/>`,
    `<path d="M-10 -250 q10 14 20 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
  <!-- the pointed hat with a moon and stars -->
  <ellipse cx="0" cy="-306" rx="74" ry="14" fill="#4527a0" ${stroke}/>
  <path d="M-42 -310 Q-20 -370 40 -440 Q10 -380 42 -310 Z" fill="#5e35b1" ${stroke}/>
  <path d="M-4 -350 q-12 -4 -10 -18 q4 10 16 8 z" fill="#ffd54f"/>
  <circle cx="16" cy="-380" r="4" fill="#fff59d"/><circle cx="20" cy="-334" r="4" fill="#fff59d"/>
</g>`;

/**
 * The toad's son: a fat, warty, muddy-brown young toad sitting in a puddle of mud, a silly wide
 * grin (as ugly as his mother: "весь у матір").
 */
export const synok = () => {
  let warts = '';
  for (const [x, y, r] of [[-40, -70, 7], [-10, -96, 6], [30, -84, 8], [52, -56, 6], [-56, -44, 6], [14, -50, 5], [-24, -48, 5], [40, -110, 5]]) warts += `<circle cx="${x}" cy="${y}" r="${r}" fill="#6b7a2a" ${st(2)}/>`;
  return `
<g data-part="body">
  <ellipse cx="0" cy="-6" rx="96" ry="14" fill="#6d5636" opacity=".8"/>
  <ellipse cx="-50" cy="-12" rx="34" ry="12" fill="#8a9a3c" ${st(4)}/>
  <ellipse cx="50" cy="-12" rx="34" ry="12" fill="#8a9a3c" ${st(4)}/>
  <ellipse cx="0" cy="-70" rx="78" ry="62" fill="#8a9a3c" ${stroke}/>
  <ellipse cx="0" cy="-48" rx="48" ry="30" fill="#d7d39a"/>
  ${warts}
  <circle cx="-36" cy="-128" r="24" fill="#8a9a3c" ${stroke}/>
  <circle cx="36" cy="-128" r="24" fill="#8a9a3c" ${stroke}/>
  <g data-part="eyes" data-cx="0" data-cy="-130">
    <circle cx="-36" cy="-130" r="14" fill="#fff59d"/><ellipse cx="-36" cy="-130" rx="9" ry="5" fill="#2b1a10"/>
    <circle cx="36" cy="-130" r="14" fill="#fff59d"/><ellipse cx="36" cy="-130" rx="9" ry="5" fill="#2b1a10"/>
  </g>
  ${closedEyes(0, -130, 72, 9)}
  ${mouth(
    `<path d="M-52 -96 Q0 -66 52 -96" fill="none" ${st(5)}/>`,
    `<path d="M-54 -98 Q0 -30 54 -98 Q0 -84 -54 -98 Z" fill="#8a2a1a" ${st(4)}/><ellipse cx="0" cy="-70" rx="16" ry="8" fill="#f06292"/>`,
  )}
</g>`;
};

/** three little fish with their heads out of the water (the water's surface at 0) */
export const rybky = () => {
  const fish = (x: number, y: number, c: string, s: number) => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M-30 30 Q-36 -30 0 -40 Q36 -30 30 30 Z" fill="${c}" ${stroke}/>
    <path d="M-14 -20 q14 -10 28 0" stroke="#fff" stroke-width="4" fill="none" opacity=".6"/>
    <circle cx="-12" cy="-12" r="8" fill="#fff" ${st(2)}/><circle cx="-12" cy="-12" r="4" fill="#2b1a10"/>
    <circle cx="12" cy="-12" r="8" fill="#fff" ${st(2)}/><circle cx="12" cy="-12" r="4" fill="#2b1a10"/>
    <ellipse cx="0" cy="8" rx="8" ry="6" fill="#8a2a1a" ${st(2)}/></g>`;
  return `
<g data-part="body">
  ${fish(-90, -10, '#ffb74d', 1)}${fish(0, -20, '#4fc3f7', 1.15)}${fish(90, -6, '#ff8a65', 0.95)}
  <path d="M-160 4 Q-120 -6 -80 4 Q-40 14 0 4 Q40 -6 80 4 Q120 14 160 4 L160 40 L-160 40 Z" fill="#4aa3df"/>
  <path d="M-150 6 q20 -8 40 0 M-30 6 q20 -8 40 0 M90 6 q20 -8 40 0" stroke="#d6f0ff" stroke-width="4" fill="none" stroke-linecap="round"/>
</g>`;
};

/** the white butterfly (it pulls the lily pad on her belt), its wings flutter */
export const metelyk_bilyi = () => `
<g data-part="body">
  <g data-part="wings" data-cx="0" data-cy="-60">
    <path d="M0 -60 Q-60 -150 -100 -110 Q-110 -60 0 -60 Z M0 -60 Q-70 -40 -70 -10 Q-30 0 0 -60 Z" fill="#fafafa" ${st(4)}/>
    <path d="M0 -60 Q60 -150 100 -110 Q110 -60 0 -60 Z M0 -60 Q70 -40 70 -10 Q30 0 0 -60 Z" fill="#fafafa" ${st(4)}/>
    <circle cx="-62" cy="-104" r="8" fill="#37474f"/><circle cx="62" cy="-104" r="8" fill="#37474f"/>
    <circle cx="-44" cy="-28" r="5" fill="#ffd54f"/><circle cx="44" cy="-28" r="5" fill="#ffd54f"/>
  </g>
  <ellipse cx="0" cy="-50" rx="9" ry="34" fill="#424242" ${st(3)}/>
  <circle cx="0" cy="-90" r="12" fill="#424242" ${st(3)}/>
  <path d="M-4 -100 q-10 -24 -22 -26 M4 -100 q10 -24 22 -26" stroke="${INK}" stroke-width="3" fill="none"/>
  <g data-part="eyes" data-cx="0" data-cy="-92"><circle cx="-5" cy="-92" r="3" fill="#fff"/><circle cx="5" cy="-92" r="3" fill="#fff"/></g>
</g>`;

// ---------- things ----------

/** the barley grain the witch gives: golden, with a whisker */
export const zernia = () => `
<g data-part="body">
  <path d="M0 0 Q-22 -26 0 -60 Q22 -26 0 0 Z" fill="#f5c542" ${st(4)}/>
  <path d="M0 -6 V-54" stroke="#c99a1e" stroke-width="3"/>
  <path d="M0 -60 L4 -96" stroke="#c99a1e" stroke-width="3" stroke-linecap="round"/>
</g>`;

/** the flower pot on the table: red clay, a band of white dots, dark earth at the top (y -64) */
export const vazon = () => `
<g data-part="body">
  <path d="M-54 -64 L-42 0 L42 0 L54 -64 Z" fill="#d1693a" ${stroke}/>
  <rect x="-62" y="-80" width="124" height="20" rx="6" fill="#e07b47" ${st(4)}/>
  <ellipse cx="0" cy="-76" rx="54" ry="7" fill="#5d4037"/>
  <circle cx="-24" cy="-36" r="5" fill="#fff"/><circle cx="0" cy="-30" r="5" fill="#fff"/><circle cx="24" cy="-36" r="5" fill="#fff"/>
</g>`;

const stem = (h: number) =>
  `<path d="M0 0 Q-8 ${-h * 0.5} 0 ${-h}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M0 0 Q-8 ${-h * 0.5} 0 ${-h}" stroke="#4caf50" stroke-width="8" fill="none" stroke-linecap="round"/>` +
  `<path d="M-2 -20 Q-70 -${h * 0.35} -40 -${h * 0.62} Q-20 -${h * 0.35} -2 -40 Z" fill="#66bb6a" ${st(4)}/>` +
  `<path d="M2 -30 Q70 -${h * 0.3} 46 -${h * 0.55} Q22 -${h * 0.3} 2 -50 Z" fill="#66bb6a" ${st(4)}/>`;

/** the tulip that grew from the grain (its stem's foot at 0: stood on the pot's earth), a closed red bud */
export const tulpan = () => `
<g data-part="body">
  ${stem(230)}
  <path d="M0 -226 Q-40 -240 -30 -290 Q-16 -312 0 -318 Q16 -312 30 -290 Q40 -240 0 -226 Z" fill="#e53935" ${stroke}/>
  <path d="M-14 -232 Q-10 -280 0 -316 M14 -232 Q10 -280 0 -316" stroke="#b71c1c" stroke-width="3" fill="none"/>
</g>`;

/** the tulip open: its petals spread, the cup's floor at y -244 (where she stands) */
export const tulpan_vidkrytyi = () => `
<g data-part="body">
  ${stem(230)}
  <path d="M-34 -236 Q-46 -318 0 -344 Q46 -318 34 -236 Z" fill="#c62828" ${stroke}/>
  <path d="M0 -226 Q-84 -230 -96 -330 Q-50 -300 -30 -246 Z" fill="#e53935" ${stroke}/>
  <path d="M0 -226 Q84 -230 96 -330 Q50 -300 30 -246 Z" fill="#e53935" ${stroke}/>
  <path d="M-44 -244 Q0 -226 44 -244 Q40 -232 0 -224 Q-40 -232 -44 -244 Z" fill="#ffd54f" ${st(3)}/>
  <path d="M-20 -240 l-4 -14 M0 -238 v-16 M20 -240 l4 -14" stroke="#5d4037" stroke-width="4" stroke-linecap="round"/>
</g>`;

/**
 * Her cradle: half a walnut shell (ridged, brown), a mattress of violet petals, a rose-petal blanket
 * turned back. Whoever lies in it lies on the mattress (hands: y -50).
 */
export const shkarlupka = () => `
<g data-part="body">
  <path d="M-190 -60 Q-180 10 0 12 Q180 10 190 -60 Q0 -40 -190 -60 Z" fill="#a1704a" ${stroke}/>
  <path d="M-150 -40 Q-130 -6 -100 4 M-80 -50 Q-70 -10 -40 10 M10 -48 Q20 -10 40 10 M90 -50 Q100 -10 120 2 M150 -48 Q160 -24 170 -16" stroke="#6d4426" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M-180 -62 Q-120 -82 -60 -64 Q0 -84 60 -64 Q120 -82 180 -62 Q120 -48 0 -50 Q-120 -48 -180 -62 Z" fill="#9575cd" ${st(4)}/>
  <path d="M40 -60 Q100 -96 176 -66 Q160 -44 40 -46 Z" fill="#f06292" ${st(4)}/>
  <path d="M60 -62 Q110 -84 166 -66" stroke="#f8bbd0" stroke-width="4" fill="none"/>
</g>`;

/**
 * The plate of water on the table, seen from the side: a wide white plate, the water in it, a
 * wreath of flowers round its rim, their stalks in the water. Its water at y -64.
 */
export const tarilka_vody = () => {
  let wreath = '';
  const cols = ['#e53935', '#fdd835', '#8e24aa', '#1e88e5', '#ec407a', '#fafafa'];
  for (let i = 0; i < 14; i++) {
    const x = -400 + i * (800 / 13);
    const back = i % 2 === 0;
    const y = back ? -96 : -40;
    wreath += `<g transform="translate(${x.toFixed(0)} ${y})">${petals(0, 0, 5, 14, 9, cols[i % cols.length], '#ffeb3b', 8)}</g>`;
    if (!back) wreath += `<path d="M${(x + 6).toFixed(0)} -30 q16 10 34 0" stroke="#43a047" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  }
  return `
<g data-part="body">
  <path d="M-460 -70 Q-440 0 0 4 Q440 0 460 -70 Z" fill="#fafafa" ${stroke}/>
  <path d="M-300 -10 Q0 0 300 -10" stroke="#90caf9" stroke-width="10" fill="none"/>
  <ellipse cx="0" cy="-68" rx="420" ry="44" fill="#81d4fa" ${st(4)}/>
  <path d="M-250 -70 q30 -10 60 0 M60 -60 q30 -10 60 0 M-60 -84 q30 -10 60 0" stroke="#e1f5fe" stroke-width="5" fill="none" stroke-linecap="round"/>
  ${wreath}
</g>`;
};

/** a big red tulip petal, curled up at the ends: she rows on it (hands: she stands in it) */
export const pelustka = () => `
<g data-part="body">
  <path d="M-110 -40 Q-90 10 0 10 Q90 10 110 -40 Q60 -18 0 -18 Q-60 -18 -110 -40 Z" fill="#e53935" ${stroke}/>
  <path d="M-80 -20 Q0 0 80 -20" stroke="#ef9a9a" stroke-width="5" fill="none"/>
  <!-- the two white horse-hair oars -->
  <path d="M-30 -60 L-110 4 M30 -60 L110 4" stroke="#fafafa" stroke-width="4" stroke-linecap="round"/>
</g>`;

/** the broad lily pad floating on the river (hands: she stands on it), a white water lily on it */
export const latattia = () => `
<g data-part="body">
  <path d="M0 0 L-24 -8 Q-200 -10 -180 18 Q-120 40 0 40 Q120 40 180 18 Q200 -10 24 -8 Z" fill="#43a047" ${stroke}/>
  <path d="M0 6 L-120 18 M0 6 L120 18 M0 6 L-50 32 M0 6 L50 32" stroke="#2e7d32" stroke-width="4"/>
  <g transform="translate(130 0)">${petals(0, -10, 6, 20, 10, '#fafafa', '#ffeb3b', 9)}</g>
</g>`;

/** the lily pad's stalk, down into the water (the fish gnaw it through) */
export const steblo = () => `
<g data-part="body">
  <path d="M0 0 Q-16 50 0 110" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M0 0 Q-16 50 0 110" stroke="#558b2f" stroke-width="8" fill="none" stroke-linecap="round"/>
</g>`;

/** a giant daisy (she sits on its yellow middle: at y -410) */
export const romashka = () => `
<g data-part="body">
  ${stem(400)}
  <g transform="translate(0 -400)">
    ${petals(0, 0, 16, 64, 18, '#fafafa', '#fdd835', 46)}
    <circle cx="-14" cy="-12" r="5" fill="#f9a825"/><circle cx="12" cy="6" r="5" fill="#f9a825"/><circle cx="16" cy="-16" r="4" fill="#f9a825"/>
  </g>
</g>`;

/** a giant burdock leaf over a hammock of grass she wove herself */
export const lopukh = () => `
<g data-part="body">
  <path d="M120 0 Q90 -200 60 -330" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M120 0 Q90 -200 60 -330" stroke="#7cb342" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M60 -330 Q-120 -440 -260 -330 Q-300 -280 -250 -250 Q-120 -290 60 -330 Z" fill="#558b2f" ${stroke}/>
  <path d="M60 -330 Q-80 -340 -240 -280 M-40 -350 L-60 -310 M-130 -350 L-150 -300" stroke="#33691e" stroke-width="5" fill="none"/>
  <path d="M-200 -250 Q-120 -150 -20 -250" stroke="#9ccc65" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M-200 -250 L-210 -300 M-20 -250 L-4 -320" stroke="#9ccc65" stroke-width="5"/>
</g>`;

/** the field mouse's door: a little round wooden door in an earth mound under the stubble (zyma: under snow) */
const norkaMound = (snow: boolean) => `
<g data-part="body">
  <path d="M-200 0 Q-180 -170 0 -180 Q180 -170 200 0 Z" fill="#8d6e63" ${stroke}/>
  ${snow ? `<path d="M-196 -40 Q-170 -170 0 -180 Q170 -170 196 -40 Q150 -70 110 -50 Q60 -86 0 -64 Q-60 -86 -110 -52 Q-150 -72 -196 -40 Z" fill="#f7fbff" stroke="#c9dcee" stroke-width="5" stroke-linejoin="round"/>` : `<path d="M-150 -130 l-6 -30 M-110 -158 l4 -30 M120 -150 l8 -28 M150 -120 l12 -24" stroke="#d4a531" stroke-width="5" stroke-linecap="round"/>`}
  <path d="M-56 0 V-70 Q0 -126 56 -70 V0 Z" fill="#8b5a2b" ${st(5)}/>
  <path d="M-20 -110 V0 M20 -110 V0" stroke="#5a3a22" stroke-width="4"/>
  <circle cx="34" cy="-50" r="7" fill="#f2c94c" ${st(3)}/>
  <rect x="-30" y="-14" width="60" height="14" rx="4" fill="#a0703c" ${st(3)}/>
</g>`;
export const norka = () => norkaMound(false);
export const norka_zyma = () => norkaMound(true);

/** the blanket of hay she wove for the swallow (laid over her as she lies there) */
export const kovdrochka = () => `
<g data-part="body">
  <path d="M-150 0 Q-160 -70 -90 -80 Q0 -96 90 -80 Q160 -70 150 0 Z" fill="#e6c35c" ${stroke}/>
  <path d="M-130 -20 l40 -40 M-90 -10 l50 -56 M-40 -6 l50 -66 M10 -6 l50 -64 M60 -8 l44 -54 M100 -12 l30 -34" stroke="#c99a1e" stroke-width="4" stroke-linecap="round"/>
  <path d="M-150 0 Q0 10 150 0" stroke="#b07a22" stroke-width="6" fill="none"/>
</g>`;

/** the beam of daylight through the hole the mole pushed in the tunnel's roof */
export const promin = () => `
<g data-part="body">
  <path d="M-50 -760 L50 -760 L170 0 L-170 0 Z" fill="#fff8c4" opacity=".55"/>
  <path d="M-30 -760 L30 -760 L90 0 L-90 0 Z" fill="#fffde7" opacity=".55"/>
  <ellipse cx="0" cy="-760" rx="60" ry="16" fill="#fffde7" ${st(4)}/>
</g>`;

/** the little red flower she hugs goodbye */
export const kvitochka = () => `
<g data-part="body">
  <path d="M0 0 Q-6 -60 0 -110" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M0 0 Q-6 -60 0 -110" stroke="#4caf50" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M-2 -30 Q-40 -50 -30 -70 Q-10 -56 -2 -40 Z" fill="#66bb6a" ${st(3)}/>
  ${petals(0, -126, 6, 20, 13, '#e53935', '#fdd835', 12)}
</g>`;

/** a big white flower of the warm land (whoever lives in it stands on its middle: y -410) */
export const kvitka_bila = () => `
<g data-part="body">
  ${stem(390)}
  <path d="M0 -392 Q-150 -400 -170 -520 Q-80 -470 -40 -414 Z" fill="#fafafa" ${stroke}/>
  <path d="M0 -392 Q150 -400 170 -520 Q80 -470 40 -414 Z" fill="#fafafa" ${stroke}/>
  <path d="M0 -392 Q-90 -440 -60 -560 Q-10 -480 0 -420 Z" fill="#f5f5f5" ${stroke}/>
  <path d="M0 -392 Q90 -440 60 -560 Q10 -480 0 -420 Z" fill="#f5f5f5" ${stroke}/>
  <path d="M-60 -416 Q0 -394 60 -416 Q50 -398 0 -390 Q-50 -398 -60 -416 Z" fill="#fff59d" ${st(3)}/>
  <path d="M-120 -470 q30 20 60 40 M120 -470 q-30 20 -60 40" stroke="#e0e0e0" stroke-width="4" fill="none"/>
</g>`;

/** the cover: Thumbelina standing in the open tulip */
export const duimovochka_cover = () =>
  `<g transform="scale(1.1)">${tulpan_vidkrytyi()}</g><g transform="translate(0 ${-244 * 1.1}) scale(.62)">${duimovochka()}</g>`;
