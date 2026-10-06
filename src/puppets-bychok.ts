// The puppets of «Солом'яний бичок»: the straw bull with a tarred side, the cellar door (the animals
// go in through it), a sheep and a hen (presents), a spindle. Same conventions as characters.ts.

import { closedEyes, eyes, st, stroke } from './characters';

/** a bull of straw: yellow bundles, a shiny black tarred side */
export const solombychok = () => {
  let straw = '';
  for (let i = 0; i < 16; i++) straw += `<path d="M${-70 + i * 9} -140 Q${-64 + i * 9} -110 ${-72 + i * 9} -80" stroke="#c99a3e" stroke-width="3" fill="none"/>`;
  return `
<g data-part="body">
  <g data-part="tail" data-cx="76" data-cy="-120">
    <path d="M76 -120 Q104 -100 98 -60" stroke="#d4a531" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M90 -62 l8 18 l8 -18" stroke="#d4a531" stroke-width="5" fill="none"/>
  </g>
  <rect x="-60" y="-84" width="20" height="84" rx="7" fill="#e2b45a" ${st(4)}/>
  <rect x="-34" y="-84" width="20" height="84" rx="7" fill="#d4a531" ${st(4)}/>
  <rect x="30" y="-84" width="20" height="84" rx="7" fill="#d4a531" ${st(4)}/>
  <rect x="54" y="-84" width="20" height="84" rx="7" fill="#e2b45a" ${st(4)}/>
  <g data-dress="legs"></g>
  <ellipse cx="8" cy="-120" rx="80" ry="48" fill="#e8bd45" ${stroke}/>
  ${straw}
  <!-- the tarred side: black and shiny -->
  <ellipse cx="22" cy="-116" rx="46" ry="30" fill="#1f1a17"/>
  <path d="M0 -132 q16 -8 30 -2" stroke="#6d6a68" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M-10 -90 q6 10 2 18 M30 -88 q4 12 0 22" stroke="#1f1a17" stroke-width="7" fill="none" stroke-linecap="round"/>
  <g data-dress="torso"></g>
  <path d="M-64 -150 Q-78 -186 -64 -192 Q-54 -172 -50 -154 Z" fill="#fffaf0" ${st(3)}/>
  <path d="M-32 -156 Q-22 -192 -36 -196 Q-46 -176 -48 -158 Z" fill="#fffaf0" ${st(3)}/>
  <ellipse cx="-68" cy="-130" rx="40" ry="34" fill="#e8bd45" ${stroke}/>
  <path d="M-100 -152 Q-120 -150 -114 -136 Q-104 -138 -96 -144 Z" fill="#e8bd45" ${st(3)}/>
  <ellipse cx="-90" cy="-106" rx="26" ry="18" fill="#f2d27a" ${st(4)}/>
  <ellipse cx="-98" cy="-106" rx="3" ry="5" fill="#5a2a22"/><ellipse cx="-82" cy="-106" rx="3" ry="5" fill="#5a2a22"/>
  ${eyes(-66, -138, 26, 5)}
  ${closedEyes(-66, -138, 26, 5)}
</g>`;
};

/** the cellar: a wooden door in a mound by the house */
export const lokh = () => `
<g data-part="body">
  <path d="M-150 0 Q-140 -150 0 -160 Q140 -150 150 0 Z" fill="#7cb342" ${stroke}/>
  <path d="M-60 0 L-60 -96 Q0 -130 60 -96 L60 0 Z" fill="#8b5a2b" stroke="#5a3a22" stroke-width="5"/>
  <path d="M-20 -110 v110 M20 -110 v110 M-60 -60 h120" stroke="#5a3a22" stroke-width="4"/>
  <circle cx="40" cy="-50" r="6" fill="#f2c94c"/>
  <g data-part="peek" style="display:none">
    <circle cx="-12" cy="-80" r="4" fill="#ffe066"/><circle cx="4" cy="-80" r="4" fill="#ffe066"/>
  </g>
</g>`;

export const ovechka = () => `
<g data-part="body">
  <rect x="-40" y="-40" width="14" height="40" rx="5" fill="#424242"/><rect x="-14" y="-40" width="14" height="40" rx="5" fill="#424242"/>
  <rect x="16" y="-40" width="14" height="40" rx="5" fill="#424242"/><rect x="36" y="-40" width="14" height="40" rx="5" fill="#424242"/>
  ${[[-40, -70], [-10, -84], [24, -82], [50, -66], [-20, -50], [20, -50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="28" fill="#fafafa" ${st(3)}/>`).join('')}
  <ellipse cx="-62" cy="-92" rx="22" ry="18" fill="#424242" ${st(3)}/>
  <circle cx="-68" cy="-96" r="3" fill="#fff"/>
  <path d="M-58 -108 q-14 -6 -20 4" fill="#424242"/>
</g>`;

export const kurka = () => `
<g data-part="body">
  <path d="M-6 0 v-20 M10 0 v-20" stroke="#ff9800" stroke-width="5"/>
  <ellipse cx="0" cy="-44" rx="36" ry="28" fill="#c8673a" ${stroke}/>
  <path d="M26 -54 Q52 -80 40 -44 Z" fill="#8d3c1f" ${st(3)}/>
  <circle cx="-28" cy="-74" r="16" fill="#c8673a" ${stroke}/>
  <path d="M-36 -90 q4 -12 10 -2 q4 -12 10 0" fill="#e53935" ${st(2)}/>
  <path d="M-44 -74 l-12 4 l12 4 z" fill="#ffb300" ${st(2)}/>
  <circle cx="-30" cy="-78" r="3" fill="#2b1a10"/>
</g>`;

/** a spindle and a distaff of tow: the grandmother spins while the bull grazes */
export const kuzhil = () => `
<g data-part="body">
  <path d="M0 0 L0 -150" stroke="#8b5a2b" stroke-width="7"/>
  <path d="M-24 -150 Q-30 -200 0 -210 Q30 -200 24 -150 Z" fill="#e8dcc8" ${st(3)}/>
  <path d="M20 -120 q30 10 30 40" stroke="#e8dcc8" stroke-width="3" fill="none"/>
</g>`;

