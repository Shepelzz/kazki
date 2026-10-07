// The puppets of «Курочка Ряба»: the speckled hen (a hero: two eyes, a comb that comes off for a
// hat), her straw nest, the golden egg and its golden shell, the plain egg, the chocolate egg in
// its golden foil, the golden chick and a pan of fried eggs. Same conventions as characters.ts.

import { closedEyes, eyes, INK, mouth, st, stroke } from './characters';

/** the speckles that make her «ряба»: little dark feather marks */
const speckles = (spots: [number, number][], color = '#3b3b40') =>
  spots.map(([x, y]) => `<path d="M${x - 5} ${y - 3} q5 7 10 0" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`).join('');

/** the speckled hen, facing left, her head turned to us a little (both eyes show) */
export const ryaba = () => `
<g data-part="body">
  <!-- legs -->
  <path d="M-12 -40 V-4 M14 -40 V-4" stroke="#ef8f00" stroke-width="7" stroke-linecap="round"/>
  <path d="M-30 0 L-12 -4 L-2 0 M-12 -4 L-20 4 M-4 0 L14 -4 L24 0 M14 -4 L6 4" fill="none" stroke="#ef8f00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <g data-dress="legs"></g>
  <!-- tail feathers -->
  <g>
    <path d="M44 -98 Q76 -170 112 -176 Q100 -130 62 -80 Z" fill="#e9e3d6" ${st(4)}/>
    <path d="M50 -90 Q96 -140 124 -130 Q104 -96 62 -70 Z" fill="#d8d0c0" ${st(4)}/>
    ${speckles([[82, -146], [100, -160], [92, -118], [106, -126]])}
  </g>
  <!-- the round speckled body -->
  <ellipse cx="4" cy="-84" rx="62" ry="50" fill="#f1ece2" ${stroke}/>
  <path d="M-46 -60 Q-20 -36 30 -40 Q8 -54 -46 -60 Z" fill="#e3dccd"/>
  ${speckles([[-34, -100], [-14, -118], [8, -104], [30, -116], [44, -92], [-40, -74], [-18, -84], [22, -76], [46, -64], [-6, -60], [-26, -50], [10, -46]])}
  <!-- the wing -->
  <path d="M-6 -104 Q40 -116 58 -78 Q48 -58 18 -58 Q-4 -66 -6 -104 Z" fill="#dcd3c3" ${st(4)}/>
  <path d="M10 -78 q14 8 30 4 M14 -92 q14 6 30 2" fill="none" stroke="#b9ad97" stroke-width="3" stroke-linecap="round"/>
  ${speckles([[22, -98], [42, -88], [30, -70]], '#55555c')}
  <g data-dress="torso"></g>
  <!-- neck and head -->
  <path d="M-48 -118 Q-58 -96 -34 -88 Q-6 -96 -10 -124 Z" fill="#f1ece2"/>
  <!-- the comb (off under a hat) -->
  <g data-part="hat">
    <path d="M-62 -178 q-6 -24 12 -22 q2 -22 20 -14 q8 -20 22 -6 q12 -4 8 12 q-30 10 -62 30 z" fill="#e53935" ${st(4)}/>
  </g>
  <circle cx="-36" cy="-150" r="34" fill="#f1ece2" ${stroke}/>
  ${speckles([[-14, -170], [-10, -146], [-20, -128], [-50, -176]])}
  <!-- the wattle under the beak -->
  <path d="M-62 -128 q-8 16 2 24 q10 -2 8 -16 q6 8 12 2 q0 -10 -8 -14 z" fill="#e53935" ${st(3)}/>
  ${eyes(-40, -160, 24, 5.5)}
  ${closedEyes(-40, -160, 24, 5.5)}
  <path d="M-58 -168 l-5 -6 M-54 -170 l-2 -7 M-26 -170 l2 -7 M-22 -168 l5 -6" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="-62" cy="-144" rx="7" ry="4.5" fill="#f19a8e" opacity=".7"/>
  <ellipse cx="-16" cy="-144" rx="7" ry="4.5" fill="#f19a8e" opacity=".7"/>
  <!-- the beak: shut, or open with a «кудкудак» -->
  ${mouth(
    `<path d="M-50 -152 L-78 -142 L-50 -132 Q-44 -142 -50 -152 Z" fill="#ffb300" ${st(3)}/>`,
    `<path d="M-50 -154 L-80 -150 L-50 -140 Z" fill="#ffb300" ${st(3)}/><path d="M-50 -138 L-74 -130 L-50 -128 Z" fill="#ffb300" ${st(3)}/><path d="M-50 -140 L-70 -137 L-50 -138 Z" fill="#8a2a1a"/>`,
  )}
</g>`;

/** a round nest of straw (drawn in front of the hen sitting in it) */
export const kubelko = () => {
  let straw = '';
  for (let i = 0; i < 15; i++) {
    const x = -96 + i * 13.5;
    straw += `<path d="M${x} ${-46 + (i % 3) * 6} q${i % 2 ? 10 : -8} 18 ${i % 2 ? 4 : 2} 38" stroke="${i % 2 ? '#b8862e' : '#d9a640'}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  return `
<g data-part="body">
  <path d="M-110 -40 Q-114 -2 -60 2 L60 2 Q114 -2 110 -40 Q0 -20 -110 -40 Z" fill="#e2b45a" ${stroke}/>
  ${straw}
  <path d="M-116 -42 Q0 -18 116 -42" stroke="#c99a3e" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M-108 -50 l-14 -10 M-80 -40 l-6 -16 M90 -44 l18 -12 M60 -36 l8 -16" stroke="#d9a640" stroke-width="4" stroke-linecap="round"/>
</g>`;
};

/** the egg shape, its bottom at 0,0 */
const EGG = 'M0 0 C-34 0 -38 -34 -34 -50 C-28 -76 -14 -86 0 -86 C14 -86 28 -76 34 -50 C38 -34 34 0 0 0 Z';

/** a four-pointed twinkle */
const twinkle = (x: number, y: number, r: number, fill = '#fff3a0') =>
  `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z" fill="${fill}" stroke="#d99a00" stroke-width="2" stroke-linejoin="round"/>`;

/** the golden egg: gleaming, with twinkles round it */
export const zolote = () => `
<g data-part="body">
  <path d="${EGG}" fill="#ffc928" ${stroke}/>
  <path d="M10 -6 C30 -12 36 -40 30 -60 C26 -36 18 -18 -6 -4 Z" fill="#f0a000"/>
  <ellipse cx="-14" cy="-58" rx="8" ry="16" fill="#fff8d0" transform="rotate(20 -14 -58)"/>
  <circle cx="-20" cy="-34" r="4" fill="#fff8d0"/>
  ${twinkle(-46, -84, 13)}${twinkle(46, -40, 10)}${twinkle(30, -100, 8)}
  <path d="${EGG}" fill="none" stroke="#c98a12" stroke-width="2" transform="translate(0 -4) scale(.9)" opacity=".5"/>
</g>`;

/** a plain white egg */
export const yaiechko = () => `
<g data-part="body">
  <path d="${EGG}" fill="#fffaf0" ${stroke}/>
  <path d="M10 -6 C30 -12 36 -40 30 -60 C26 -36 18 -18 -6 -4 Z" fill="#ece3cf"/>
  <ellipse cx="-14" cy="-58" rx="7" ry="13" fill="#fff" transform="rotate(20 -14 -58)"/>
</g>`;

/** the golden shell in pieces: two halves with zigzag edges, some chips */
export const shkarlupa = () => `
<g data-part="body">
  <path d="M-80 0 C-112 -2 -112 -36 -100 -46 L-92 -36 L-84 -48 L-76 -36 L-66 -46 C-56 -30 -56 -2 -80 0 Z" fill="#ffc928" ${stroke}/>
  <path d="M60 0 C40 0 34 -22 42 -34 L52 -26 L58 -38 L66 -28 L74 -38 L82 -28 C90 -12 82 0 60 0 Z" fill="#ffc928" ${stroke}/>
  <path d="M-20 -2 l12 -10 l10 8 z M10 0 l8 -12 l8 10 z" fill="#f0a000" ${st(3)}/>
  ${twinkle(-92, -60, 9)}${twinkle(74, -52, 8)}
</g>`;

/** the «golden» egg is chocolate in golden foil: the foil peeled back like petals */
export const shokolad = () => `
<g data-part="body">
  <path d="${EGG}" fill="#7b4a2a" ${stroke}/>
  <path d="M-20 -60 q10 -14 22 -4 M-10 -36 q12 -10 24 0" stroke="#a06a3e" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="-14" cy="-62" rx="6" ry="12" fill="#a87a52" transform="rotate(20 -14 -62)"/>
  <path d="M-36 -36 L-58 -20 L-40 -8 L-46 6 L-10 2 Z" fill="#ffc928" ${st(3)}/>
  <path d="M36 -34 L60 -24 L44 -10 L52 4 L10 2 Z" fill="#ffc928" ${st(3)}/>
  <path d="M-34 -2 Q0 8 34 -2 L30 4 Q0 12 -30 4 Z" fill="#f0a000" ${st(3)}/>
  ${twinkle(-58, -30, 8)}${twinkle(60, -36, 7)}
</g>`;

/** the golden chick, a bit of its shell still on its head */
export const kurcha = () => `
<g data-part="body">
  <path d="M-10 -14 V-2 M10 -14 V-2" stroke="#ef8f00" stroke-width="5" stroke-linecap="round"/>
  <path d="M-20 0 h18 M2 0 h18" stroke="#ef8f00" stroke-width="4" stroke-linecap="round"/>
  <g data-dress="legs"></g>
  <circle cx="2" cy="-42" r="32" fill="#ffd23f" ${stroke}/>
  <path d="M22 -50 Q44 -48 38 -26 Q26 -30 20 -38 Z" fill="#ffc107" ${st(3)}/>
  <path d="M-18 -66 q-6 -14 4 -16 q-2 10 6 10 z" fill="#ffd23f" ${st(3)}/>
  <g data-dress="torso"></g>
  <g data-part="hat">
    <path d="M-20 -64 C-18 -84 22 -86 26 -64 L18 -70 L12 -62 L4 -72 L-4 -62 L-12 -72 Z" fill="#ffc928" ${st(3)}/>
  </g>
  ${eyes(-10, -46, 20, 4.5)}
  ${closedEyes(-10, -46, 20, 4.5)}
  <ellipse cx="-24" cy="-34" rx="5" ry="3" fill="#f0786a" opacity=".6"/>
  <ellipse cx="6" cy="-34" rx="5" ry="3" fill="#f0786a" opacity=".6"/>
  ${mouth(
    `<path d="M-16 -38 L-30 -33 L-16 -28 Z" fill="#ff8f00" ${st(2.5)}/>`,
    `<path d="M-16 -40 L-32 -38 L-16 -34 Z M-16 -32 L-28 -28 L-16 -27 Z" fill="#ff8f00" ${st(2.5)}/>`,
  )}
  ${twinkle(30, -78, 8)}${twinkle(-34, -18, 6)}
</g>`;

/** a frying pan of fried eggs */
export const yaieshnia = () => `
<g data-part="body">
  <path d="M70 -18 L150 -34" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
  <path d="M70 -18 L150 -34" stroke="#5d4037" stroke-width="9" stroke-linecap="round"/>
  <path d="M-80 -24 Q-78 0 0 0 Q78 0 80 -24 Z" fill="#37474f" ${stroke}/>
  <ellipse cx="0" cy="-24" rx="80" ry="14" fill="#546e7a" ${st(4)}/>
  <path d="M-62 -26 q4 -14 24 -12 q14 -10 26 4 q14 10 -6 14 q-30 6 -44 -6 Z M6 -28 q8 -12 26 -8 q16 -2 20 8 q-4 12 -26 10 q-18 0 -20 -10 Z" fill="#fff" ${st(2.5)}/>
  <circle cx="-34" cy="-30" r="9" fill="#ffb300" ${st(2.5)}/><circle cx="30" cy="-28" r="9" fill="#ffb300" ${st(2.5)}/>
  <path d="M-30 -48 q-6 -14 4 -24 M10 -50 q-6 -14 4 -24" stroke="#cfd8dc" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
</g>`;
