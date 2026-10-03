// The puppets of «Лисичка-сестричка і вовк-панібрат»: a poppy-seed pie, the herd boy, the little
// bull, the sledge (whole and smashed), crooked firewood, the merchant's sledge of fish, an ice hole,
// a fishing rod, and the fox with dough on her head. Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stroke } from './characters';
import { lysytsia } from './characters';

export const pyrizhok = () => `
<g data-part="body">
  <path d="M-40 0 Q-44 -46 0 -48 Q44 -46 40 0 Z" fill="#e2a24a" ${stroke}/>
  <path d="M-30 -8 q8 -10 0 -20 M-10 -6 q8 -12 0 -26 M10 -6 q8 -12 0 -26 M30 -8 q8 -10 0 -20" stroke="#b5762a" stroke-width="4" fill="none"/>
  <circle cx="-14" cy="-30" r="2" fill="#2b1a10"/><circle cx="4" cy="-34" r="2" fill="#2b1a10"/><circle cx="18" cy="-28" r="2" fill="#2b1a10"/>
</g>`;

/** a herd boy in a sheepskin hat */
export const pastushok = () => `
<g data-part="body">
  <path d="M-30 -96 L-32 -10 L-6 -10 L-6 -96 Z" fill="#4e6a8a" ${st(4)}/>
  <path d="M6 -96 L6 -10 L32 -10 L30 -96 Z" fill="#4e6a8a" ${st(4)}/>
  <path d="M-38 0 q0 -14 8 -16 h24 v16 z M38 0 q0 -14 -8 -16 h-24 v16 z" fill="#3b2416" ${st(4)}/>
  <path d="M-46 -200 Q-58 -140 -54 -90 L54 -90 Q58 -140 46 -200 Q0 -214 -46 -200 Z" fill="#b5835a" ${stroke}/>
  <path d="M-54 -100 Q0 -86 54 -100 L54 -86 Q0 -72 -54 -86 Z" fill="#f4efe6" ${st(3)}/>
  <rect x="-54" y="-142" width="108" height="12" rx="4" fill="#c62828" ${st(3)}/>
  <!-- a herding stick -->
  <path d="M-70 -10 L-58 -230" stroke="#8b5a2b" stroke-width="9" stroke-linecap="round"/>
  <path d="M-46 -194 Q-70 -160 -64 -128" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/>
  <path d="M-46 -194 Q-70 -160 -64 -128" fill="none" stroke="#b5835a" stroke-width="17" stroke-linecap="round"/>
  <circle cx="-64" cy="-124" r="11" fill="#f2c4a0" ${st(3)}/>
  <ellipse cx="0" cy="-240" rx="36" ry="38" fill="#f2c4a0" ${stroke}/>
  ${eyes(0, -246, 26, 5)}
  ${closedEyes(0, -246, 26, 5)}
  <ellipse cx="-18" cy="-228" rx="7" ry="5" fill="#f0786a" opacity=".7"/><ellipse cx="18" cy="-228" rx="7" ry="5" fill="#f0786a" opacity=".7"/>
  <path d="M-6 -236 q6 6 12 0" fill="#e8a383"/>
  ${mouth(`<path d="M-10 -222 q10 8 20 0" fill="none" ${st(3)}/>`, `<path d="M-10 -224 q10 16 20 0 z" fill="#7a2a1a" ${st(3)}/>`)}
  <path d="M-40 -256 Q-40 -304 0 -306 Q40 -304 40 -256 Z" fill="#5d4037" ${stroke}/>
  <rect x="-44" y="-268" width="88" height="18" rx="9" fill="#e8dcc8" ${st(3)}/>
</g>`;

/** the little bull (bychok-tretiachok) */
export const bychok = () => `
<g data-part="body">
  <g data-part="tail" data-cx="70" data-cy="-110">
    <path d="M70 -110 Q100 -90 96 -50" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="96" cy="-46" r="8" fill="#5d4037"/>
  </g>
  <rect x="-60" y="-80" width="20" height="80" rx="7" fill="#8d5a35" ${st(4)}/>
  <rect x="-34" y="-80" width="20" height="80" rx="7" fill="#7a4a2a" ${st(4)}/>
  <rect x="30" y="-80" width="20" height="80" rx="7" fill="#7a4a2a" ${st(4)}/>
  <rect x="54" y="-80" width="20" height="80" rx="7" fill="#8d5a35" ${st(4)}/>
  <ellipse cx="8" cy="-116" rx="78" ry="46" fill="#9c6a42" ${stroke}/>
  <path d="M-10 -150 q30 -16 50 6 q-20 20 -50 -6 z" fill="#f4efe6"/>
  <path d="M-62 -150 Q-74 -186 -60 -190 Q-52 -170 -48 -152 Z" fill="#fffaf0" ${st(3)}/>
  <path d="M-30 -152 Q-20 -188 -34 -192 Q-44 -172 -46 -154 Z" fill="#fffaf0" ${st(3)}/>
  <ellipse cx="-66" cy="-128" rx="40" ry="34" fill="#9c6a42" ${stroke}/>
  <path d="M-100 -150 Q-118 -150 -112 -136 Q-104 -138 -96 -142 Z" fill="#9c6a42" ${st(3)}/>
  <ellipse cx="-88" cy="-104" rx="26" ry="18" fill="#e8b6a0" ${st(4)}/>
  <ellipse cx="-96" cy="-104" rx="3" ry="5" fill="#5a2a22"/><ellipse cx="-80" cy="-104" rx="3" ry="5" fill="#5a2a22"/>
  ${eyes(-64, -136, 26, 5)}
  ${closedEyes(-64, -136, 26, 5)}
</g>`;

export const sanky = () => `
<g data-part="body">
  <path d="M-130 -10 H120 Q160 -10 150 -50" fill="none" stroke="#6d4426" stroke-width="10" stroke-linecap="round"/>
  <rect x="-110" y="-60" width="220" height="24" rx="6" fill="#b07e55" stroke="#6d4426" stroke-width="5"/>
  <path d="M-90 -36 v26 M-30 -36 v26 M30 -36 v26 M90 -36 v26" stroke="#6d4426" stroke-width="8"/>
  <path d="M-110 -60 q-30 -20 -20 -50" fill="none" stroke="#6d4426" stroke-width="8" stroke-linecap="round"/>
</g>`;

export const sanky_lamani = () => `
<g data-part="body">
  <path d="M-140 -6 L-40 -10 M10 -4 L130 -12" stroke="#6d4426" stroke-width="10" stroke-linecap="round"/>
  <path d="M-100 -30 l70 -16 l6 18 l-70 16 z" fill="#b07e55" stroke="#6d4426" stroke-width="4"/>
  <path d="M20 -24 l80 10 l-4 18 l-80 -10 z" fill="#b07e55" stroke="#6d4426" stroke-width="4"/>
  <path d="M-20 -8 l10 -30 M60 -40 l8 26" stroke="#6d4426" stroke-width="7" stroke-linecap="round"/>
</g>`;

/** firewood chopped "crooked and crooked": all twists */
export const drova = () => `
<g data-part="body">
  <path d="M-120 -20 q30 -40 60 0 q30 40 60 0 q30 -40 60 0" fill="none" stroke="#8b5a2b" stroke-width="22" stroke-linecap="round"/>
  <path d="M-100 -60 q20 30 40 0 q20 -30 40 0 q20 30 40 0" fill="none" stroke="#a1704a" stroke-width="18" stroke-linecap="round"/>
</g>`;

/** the merchants' sledge, piled with fish */
export const viz = () => {
  let fish = '';
  for (let i = 0; i < 9; i++) {
    const x = -130 + (i % 5) * 62 + (i > 4 ? 30 : 0);
    const y = -98 - (i > 4 ? 26 : 0);
    fish += `<g transform="translate(${x} ${y}) rotate(${i % 2 ? 8 : -8})"><path d="M-30 0 Q-6 -20 20 0 Q-6 18 -30 0 Z" fill="#90a4ae" ${st(3)}/><path d="M18 0 L34 -12 L32 0 L34 12 Z" fill="#78909c" ${st(3)}/><circle cx="-20" cy="-3" r="2.5" fill="#2b1a10"/></g>`;
  }
  return `
<g data-part="body">
  <path d="M-200 -8 H180 Q220 -8 212 -46" fill="none" stroke="#5d4037" stroke-width="12" stroke-linecap="round"/>
  <rect x="-190" y="-90" width="360" height="66" rx="8" fill="#8b5a2b" stroke="#5a3a22" stroke-width="6"/>
  <path d="M-170 -24 v16 M-60 -24 v16 M60 -24 v16 M150 -24 v16" stroke="#5a3a22" stroke-width="10"/>
  <path d="M-180 -70 H160 M-180 -46 H160" stroke="#6d4426" stroke-width="4"/>
  ${fish}
</g>`;
};

/** an ice hole in the frozen river */
export const lunka = () => `
<g data-part="body">
  <ellipse cx="0" cy="-6" rx="70" ry="20" fill="#1f4f7a" stroke="#cfe3f4" stroke-width="8"/>
  <path d="M-70 -6 l-40 10 M70 -6 l36 -12 M-30 12 l-14 16 M30 12 l10 18" stroke="#9cc4e4" stroke-width="3"/>
</g>`;

export const vudka = () => `
<g data-part="body">
  <path d="M0 0 L60 -200" stroke="#8b5a2b" stroke-width="7" stroke-linecap="round"/>
  <path d="M60 -200 Q110 -120 96 -20" stroke="#5a3a22" stroke-width="2" fill="none"/>
  <circle cx="96" cy="-24" r="7" fill="#e53935" stroke="#fff" stroke-width="3"/>
</g>`;

/** the fox "badly beaten": dough smeared on her head */
export const lysytsia_tisto = () =>
  lysytsia().replace(
    /<\/g>\s*$/,
    `<path d="M-48 -236 Q-40 -270 -2 -262 Q30 -276 44 -240 Q36 -222 14 -230 Q-6 -214 -24 -228 Q-40 -216 -48 -236 Z" fill="#fff3d6" ${st(3)}/>
     <path d="M-30 -232 q4 18 -2 30 M20 -232 q6 16 2 28" stroke="#fff3d6" stroke-width="7" stroke-linecap="round" fill="none"/>
     </g>`,
  );
