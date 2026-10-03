// The puppets of «Сірко»: the old grey dog, a swaddled baby, the bride with a flower wreath, the
// wedding table (the wolf lies under it, behind the cloth), a sheaf in the field and a bowl of
// halushky. Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stitch, stroke } from './characters';

export const sirko = () => `
<g data-part="body">
  <g data-part="tail" data-cx="56" data-cy="-80">
    <path d="M56 -80 Q96 -86 104 -50 Q86 -66 58 -66 Z" fill="#8d8f94" ${st(4)}/>
  </g>
  <rect x="-58" y="-58" width="20" height="58" rx="8" fill="#8d8f94" ${st(4)}/>
  <rect x="-30" y="-58" width="20" height="58" rx="8" fill="#7d7f84" ${st(4)}/>
  <rect x="22" y="-58" width="20" height="58" rx="8" fill="#7d7f84" ${st(4)}/>
  <rect x="46" y="-58" width="20" height="58" rx="8" fill="#8d8f94" ${st(4)}/>
  <ellipse cx="4" cy="-82" rx="72" ry="38" fill="#9ea1a7" ${stroke}/>
  <path d="M-30 -110 q16 -10 30 0 M10 -114 q16 -10 30 0 M30 -60 q14 8 28 0" stroke="#7d7f84" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- head: grey muzzle, bushy old-dog eyebrows, a floppy ear -->
  <ellipse cx="-58" cy="-128" rx="40" ry="36" fill="#9ea1a7" ${stroke}/>
  <path d="M-78 -126 Q-118 -124 -122 -106 Q-112 -92 -82 -98 Z" fill="#d4d6da" ${st(4)}/>
  <ellipse cx="-120" cy="-112" rx="9" ry="8" fill="#2b1a10"/>
  <path d="M-40 -154 Q-12 -158 -14 -110 Q-30 -122 -40 -154 Z" fill="#6d6f74" ${st(4)}/>
  ${eyes(-70, -136, 24, 5)}
  ${closedEyes(-70, -136, 24, 5)}
  <path d="M-90 -148 q8 -6 16 -2 M-66 -150 q8 -6 16 -2" stroke="#eceef1" stroke-width="6" stroke-linecap="round" fill="none"/>
  ${mouth(
    `<path d="M-110 -98 q12 6 24 0" fill="none" ${st(3)}/>`,
    `<path d="M-112 -100 q14 24 30 0 z" fill="#8a2a1a" ${st(3)}/><path d="M-102 -92 q4 12 8 0" fill="#f06292"/>`,
  )}
  <!-- an old rope for a collar -->
  <path d="M-60 -98 Q-36 -84 -18 -100" stroke="#b08a52" stroke-width="7" fill="none" stroke-linecap="round"/>
</g>`;

/** a baby swaddled in an embroidered cloth */
export const dytyna = () => `
<g data-part="body">
  <path d="M-46 -6 Q-56 -40 -30 -54 L36 -50 Q54 -30 44 -4 Z" fill="#fbf7ee" ${st(4)}/>
  ${stitch(-40, -26, 80)}
  <circle cx="-32" cy="-46" r="20" fill="#f6cfae" ${st(4)}/>
  <path d="M-50 -54 Q-32 -76 -12 -56" fill="#d32f2f" ${st(3)}/>
  ${eyes(-34, -48, 12, 3)}
  ${closedEyes(-34, -48, 12, 3)}
  <ellipse cx="-42" cy="-40" rx="5" ry="3" fill="#f0786a" opacity=".6"/>
  ${mouth(`<path d="M-38 -38 q4 3 8 0" fill="none" ${st(2)}/>`, `<circle cx="-34" cy="-37" r="3" fill="#8a2a1a"/>`)}
</g>`;

/** the bride: braids, a wreath of flowers with long ribbons */
export const nevista = () => {
  let wreath = '';
  const colors = ['#e53935', '#fdd835', '#1e88e5', '#e53935', '#8e24aa', '#fdd835', '#e53935'];
  colors.forEach((c, i) => {
    const a = Math.PI * (1.05 + (i / (colors.length - 1)) * 0.9);
    wreath += `<circle cx="${(Math.cos(a) * 44).toFixed(0)}" cy="${(-300 + Math.sin(a) * 30).toFixed(0)}" r="13" fill="${c}" ${st(2)}/>`;
  });
  return `
<g data-part="body">
  <path d="M-30 -270 Q-50 -200 -40 -140 M30 -270 Q50 -200 40 -140" stroke="#e53935" stroke-width="7" fill="none"/>
  <path d="M-20 -270 Q-34 -190 -24 -130 M20 -270 Q34 -190 24 -130" stroke="#1e88e5" stroke-width="6" fill="none"/>
  <path d="M-58 -170 L-80 -6 L80 -6 L58 -170 Z" fill="#2e5e3e" ${stroke}/>
  <path d="M-74 -40 L74 -40" stroke="#f5c542" stroke-width="10"/>
  <path d="M-36 -160 L-44 -30 L44 -30 L36 -160 Z" fill="#fbf7ee" ${st(4)}/>
  ${stitch(-40, -58, 80)}
  <path d="M-52 -236 Q-64 -200 -58 -165 L58 -165 Q64 -200 52 -236 Q0 -252 -52 -236 Z" fill="#fbf7ee" ${stroke}/>
  ${stitch(-7, -234, 14, 60, true)}
  <rect x="-60" y="-176" width="120" height="14" rx="5" fill="#c62828" ${st(4)}/>
  <circle cx="-30" cy="-176" r="12" fill="#f2c4a0" ${st(4)}/><circle cx="30" cy="-176" r="12" fill="#f2c4a0" ${st(4)}/>
  <!-- braids -->
  <path d="M-36 -266 Q-46 -230 -38 -196" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
  <path d="M-36 -266 Q-46 -230 -38 -196" stroke="#b26a2e" stroke-width="10" stroke-linecap="round"/>
  <path d="M36 -266 Q46 -230 38 -196" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
  <path d="M36 -266 Q46 -230 38 -196" stroke="#b26a2e" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="0" cy="-280" rx="38" ry="42" fill="#f2c4a0" ${stroke}/>
  <path d="M-38 -290 Q-34 -324 0 -324 Q34 -324 38 -290 Q20 -306 0 -306 Q-20 -306 -38 -290 Z" fill="#b26a2e" ${st(4)}/>
  ${wreath}
  ${eyes(0, -284, 28, 6)}
  ${closedEyes(0, -284, 28, 6)}
  <ellipse cx="-20" cy="-264" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  <ellipse cx="20" cy="-264" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  ${mouth(
    `<path d="M-10 -256 q10 9 20 0" fill="none" ${st(4)}/>`,
    `<path d="M-10 -258 q10 16 20 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
</g>`;
};

/** the wedding table: a long embroidered cloth down to the floor (the wolf hides under it) */
export const stil = () => `
<g data-part="body">
  <path d="M-300 -200 H300 L320 0 H-320 Z" fill="#fffaf0" stroke="#d9cdb4" stroke-width="5"/>
  ${stitch(-300, -60, 600)}
  ${stitch(-300, -180, 600)}
  <rect x="-310" y="-214" width="620" height="18" rx="6" fill="#fffaf0" stroke="#d9cdb4" stroke-width="4"/>
  <!-- korovai, dishes, a jug -->
  <ellipse cx="0" cy="-246" rx="80" ry="36" fill="#e2a24a" ${st(4)}/>
  <path d="M-50 -262 q16 -12 30 0 M-6 -270 q14 -10 28 0 M30 -258 q12 -10 24 0" stroke="#b5762a" stroke-width="5" fill="none"/>
  <circle cx="-20" cy="-276" r="8" fill="#e53935"/><circle cx="12" cy="-278" r="8" fill="#e53935"/>
  <ellipse cx="-200" cy="-220" rx="50" ry="12" fill="#e0e0e0" ${st(3)}/>
  <ellipse cx="-200" cy="-228" rx="30" ry="12" fill="#ffd54f"/>
  <path d="M170 -214 q-4 -60 26 -66 q30 6 26 66 z" fill="#c0542e" ${st(4)}/>
  <ellipse cx="250" cy="-220" rx="40" ry="10" fill="#e0e0e0" ${st(3)}/>
</g>`;

/** a sheaf of wheat, stood up in the field (the baby sleeps in its shade) */
export const snip = () => {
  let stalks = '';
  for (let i = 0; i < 11; i++) {
    const x = -50 + i * 10;
    stalks += `<path d="M${x} 0 Q${x * 0.4} -110 ${x * 1.4} -200" stroke="#d4a531" stroke-width="7" fill="none"/>`;
    stalks += `<ellipse cx="${x * 1.4}" cy="-206" rx="7" ry="16" fill="#e8bd45" transform="rotate(${x * 0.6} ${x * 1.4} -206)"/>`;
  }
  return `<g data-part="body">${stalks}<path d="M-30 -96 Q0 -86 30 -96" stroke="#b08a52" stroke-width="10" fill="none"/></g>`;
};

export const halushky = () => `
<g data-part="body">
  <path d="M-46 -30 Q0 10 46 -30 Z" fill="#c0542e" ${stroke}/>
  <circle cx="-20" cy="-36" r="12" fill="#fff6e0" ${st(3)}/><circle cx="4" cy="-40" r="12" fill="#fff6e0" ${st(3)}/><circle cx="26" cy="-34" r="11" fill="#fff6e0" ${st(3)}/>
  <path d="M-10 -56 q4 -10 0 -18 M10 -58 q4 -10 0 -18" stroke="#ddd" stroke-width="3" fill="none"/>
</g>`;
