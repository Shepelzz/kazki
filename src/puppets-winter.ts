// The puppets of the winter tale («Рукавичка»): the grandfather in a sheepskin coat, his dog, the
// mouse, the frog, the boar, the mitten itself (it swells as the animals move in) and the snow
// house. Same conventions as characters.ts: feet at (0, 0), animals face left, live parts marked
// with data-part.

import { INK, closedEyes, eyes, mouth, st, stitch, stroke } from './characters';

export const did_winter = () => `
<g data-part="body">
  <!-- felt boots (valenky) -->
  <path d="M-44 0 q0 -16 6 -60 h30 v60 z" fill="#8d8f94" ${stroke}/>
  <path d="M44 0 q0 -16 -6 -60 h-30 v60 z" fill="#8d8f94" ${stroke}/>
  <!-- sheepskin coat (kozhukh) with white fur trim -->
  <path d="M-66 -258 Q-86 -170 -82 -56 L82 -56 Q86 -170 66 -258 Q0 -278 -66 -258 Z" fill="#b5835a" ${stroke}/>
  <path d="M-84 -70 Q0 -50 84 -70 L84 -50 Q0 -30 -84 -50 Z" fill="#f4efe6" ${st(4)}/>
  <path d="M0 -262 L0 -66" stroke="#8a5e3c" stroke-width="5"/>
  <circle cx="0" cy="-220" r="6" fill="#6d4426"/><circle cx="0" cy="-180" r="6" fill="#6d4426"/>
  <rect x="-80" y="-176" width="160" height="16" rx="5" fill="#b71c1c" ${st(4)}/>
  <path d="M-34 -150 q10 30 0 60 M36 -150 q-10 30 0 60" stroke="#9c6c45" stroke-width="4" fill="none"/>
  <!-- arms with fur cuffs and mittens (one is lost later…) -->
  <path d="M-62 -252 Q-104 -200 -96 -140" fill="none" stroke="${INK}" stroke-width="38" stroke-linecap="round"/>
  <path d="M-62 -252 Q-104 -200 -96 -140" fill="none" stroke="#b5835a" stroke-width="28" stroke-linecap="round"/>
  <path d="M62 -252 Q104 -200 96 -140" fill="none" stroke="${INK}" stroke-width="38" stroke-linecap="round"/>
  <path d="M62 -252 Q104 -200 96 -140" fill="none" stroke="#b5835a" stroke-width="28" stroke-linecap="round"/>
  <ellipse cx="-96" cy="-142" rx="20" ry="11" fill="#f4efe6" ${st(4)}/>
  <ellipse cx="96" cy="-142" rx="20" ry="11" fill="#f4efe6" ${st(4)}/>
  <circle cx="-96" cy="-124" r="15" fill="#f2c4a0" ${st(4)}/>
  <circle cx="96" cy="-124" r="15" fill="#c62828" ${st(4)}/>
  <!-- fur collar -->
  <path d="M-60 -262 Q0 -236 60 -262 Q50 -238 0 -228 Q-50 -238 -60 -262 Z" fill="#f4efe6" ${st(4)}/>
  <!-- head -->
  <ellipse cx="0" cy="-310" rx="44" ry="48" fill="#f2c4a0" ${stroke}/>
  <path d="M-42 -300 Q-50 -230 0 -205 Q50 -230 42 -300 Q30 -272 0 -272 Q-30 -272 -42 -300 Z" fill="#f4f1ea" ${stroke}/>
  ${mouth('', '<ellipse cx="0" cy="-266" rx="10" ry="8" fill="#7a2a1a"/>')}
  <path d="M-30 -276 Q-14 -290 0 -278 Q14 -290 30 -276 Q16 -266 0 -272 Q-16 -266 -30 -276 Z" fill="#fff" ${st(3)}/>
  <ellipse cx="0" cy="-292" rx="9" ry="8" fill="#e98a7a"/>
  ${eyes(0, -318, 32, 6)}
  ${closedEyes(0, -318, 32, 6)}
  <ellipse cx="-26" cy="-298" rx="10" ry="6" fill="#f0786a" opacity=".7"/>
  <ellipse cx="26" cy="-298" rx="10" ry="6" fill="#f0786a" opacity=".7"/>
  <!-- fur hat with ear flaps -->
  <path d="M-50 -330 Q-56 -300 -46 -282 L-34 -286 Q-40 -306 -38 -326 Z" fill="#6d4c33" ${st(4)}/>
  <path d="M50 -330 Q56 -300 46 -282 L34 -286 Q40 -306 38 -326 Z" fill="#6d4c33" ${st(4)}/>
  <path d="M-46 -334 Q-46 -396 0 -398 Q46 -396 46 -334 Z" fill="#6d4c33" ${stroke}/>
  <rect x="-52" y="-344" width="104" height="22" rx="11" fill="#e8dcc8" ${st(4)}/>
</g>`;

export const sobaka = () => `
<g data-part="body">
  <g data-part="tail" data-cx="40" data-cy="-70">
    <path d="M38 -66 Q74 -78 66 -118 Q58 -96 36 -86 Z" fill="#c08a52" ${st(4)}/>
  </g>
  <rect x="-44" y="-50" width="16" height="50" rx="7" fill="#c08a52" ${st(4)}/>
  <rect x="-18" y="-50" width="16" height="50" rx="7" fill="#c08a52" ${st(4)}/>
  <rect x="14" y="-50" width="16" height="50" rx="7" fill="#a8743f" ${st(4)}/>
  <rect x="34" y="-50" width="16" height="50" rx="7" fill="#c08a52" ${st(4)}/>
  <ellipse cx="2" cy="-68" rx="58" ry="32" fill="#c08a52" ${stroke}/>
  <ellipse cx="-12" cy="-60" rx="26" ry="18" fill="#f6ead8"/>
  <!-- red collar -->
  <path d="M-44 -88 Q-30 -70 -12 -82" stroke="#c62828" stroke-width="9" fill="none" stroke-linecap="round"/>
  <circle cx="-26" cy="-74" r="5" fill="#f5c542"/>
  <!-- head -->
  <ellipse cx="-46" cy="-112" rx="34" ry="30" fill="#c08a52" ${stroke}/>
  <path d="M-62 -110 Q-96 -108 -98 -94 Q-90 -82 -66 -88 Z" fill="#f6ead8" ${st(4)}/>
  <ellipse cx="-98" cy="-100" rx="8" ry="7" fill="#2b1a10"/>
  <path d="M-30 -134 Q-6 -136 -10 -96 Q-24 -106 -30 -134 Z" fill="#7a4e28" ${st(4)}/>
  ${eyes(-58, -118, 22, 5)}
  ${closedEyes(-58, -118, 22, 5)}
  ${mouth(
    `<path d="M-90 -88 q10 6 20 0" fill="none" ${st(3)}/>`,
    `<path d="M-92 -90 q12 22 26 0 z" fill="#8a2a1a" ${st(3)}/><path d="M-84 -82 q4 12 8 0" fill="#f06292"/>`,
  )}
</g>`;

export const myshka = () => `
<g data-part="body">
  <path d="M20 -16 Q70 -10 74 -44 Q78 -70 56 -72" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
  <path d="M20 -16 Q70 -10 74 -44 Q78 -70 56 -72" fill="none" stroke="#f3a6a6" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="-14" cy="-6" rx="14" ry="7" fill="#f3a6a6" ${st(3)}/>
  <ellipse cx="14" cy="-6" rx="14" ry="7" fill="#f3a6a6" ${st(3)}/>
  <path d="M-30 -10 Q-38 -60 0 -70 Q38 -60 30 -10 Q0 0 -30 -10 Z" fill="#a7a7ad" ${stroke}/>
  <ellipse cx="-4" cy="-30" rx="16" ry="20" fill="#e8e6ea"/>
  <ellipse cx="-22" cy="-46" rx="7" ry="5" fill="#f3a6a6" ${st(3)}/>
  <!-- big round ears -->
  <circle cx="-30" cy="-112" r="20" fill="#a7a7ad" ${stroke}/>
  <circle cx="-30" cy="-112" r="11" fill="#f6b8bb"/>
  <circle cx="18" cy="-114" r="20" fill="#a7a7ad" ${stroke}/>
  <circle cx="18" cy="-114" r="11" fill="#f6b8bb"/>
  <!-- head with a pointy snout to the left -->
  <path d="M-12 -116 Q22 -114 22 -88 Q20 -66 -6 -64 Q-30 -66 -48 -78 Q-60 -84 -52 -92 Q-40 -114 -12 -116 Z" fill="#a7a7ad" ${stroke}/>
  <circle cx="-56" cy="-86" r="6" fill="#f06292" ${st(2)}/>
  <path d="M-48 -84 l-26 -6 M-48 -80 l-26 4 M-46 -76 l-20 10" stroke="${INK}" stroke-width="2" opacity=".55"/>
  ${eyes(-18, -96, 20, 5)}
  ${closedEyes(-18, -96, 20, 5)}
  ${mouth(
    `<path d="M-46 -74 q6 5 12 0" fill="none" ${st(3)}/>`,
    `<ellipse cx="-40" cy="-72" rx="6" ry="5" fill="#8a2a1a" ${st(2)}/>`,
  )}
  <!-- a red headscarf with white dots, knotted under the chin -->
  <path d="M-36 -110 Q-8 -138 22 -108 Q10 -118 -8 -118 Q-26 -118 -36 -110 Z" fill="#d32f2f" ${st(3)}/>
  <circle cx="-14" cy="-122" r="2.5" fill="#fff"/><circle cx="4" cy="-120" r="2.5" fill="#fff"/>
  <path d="M10 -70 l10 6 l-4 10 z" fill="#d32f2f" ${st(2)}/>
</g>`;

export const zhabka = () => `
<g data-part="body">
  <ellipse cx="-30" cy="-8" rx="24" ry="9" fill="#5fae4a" ${st(4)}/>
  <ellipse cx="30" cy="-8" rx="24" ry="9" fill="#5fae4a" ${st(4)}/>
  <ellipse cx="0" cy="-34" rx="46" ry="32" fill="#6cc24a" ${stroke}/>
  <ellipse cx="0" cy="-26" rx="28" ry="18" fill="#d9f2b8"/>
  <!-- woolly scarf: a frog in winter -->
  <path d="M-38 -52 Q0 -36 38 -52 L38 -40 Q0 -24 -38 -40 Z" fill="#f5c542" ${st(3)}/>
  <path d="M22 -40 l8 26 l12 -4 l-8 -24 z" fill="#f5c542" ${st(3)}/>
  <path d="M-30 -48 v8 M-16 -44 v8 M0 -42 v8 M16 -44 v8" stroke="#e08a1e" stroke-width="3"/>
  <!-- eyes on top of the head -->
  <circle cx="-22" cy="-70" r="17" fill="#6cc24a" ${stroke}/>
  <circle cx="20" cy="-70" r="17" fill="#6cc24a" ${stroke}/>
  <g data-part="eyes" data-cx="0" data-cy="-71">
    <circle cx="-22" cy="-71" r="10" fill="#fff"/><circle cx="-24" cy="-70" r="6" fill="#2b1a10"/><circle cx="-22" cy="-72" r="2" fill="#fff"/>
    <circle cx="20" cy="-71" r="10" fill="#fff"/><circle cx="18" cy="-70" r="6" fill="#2b1a10"/><circle cx="20" cy="-72" r="2" fill="#fff"/>
  </g>
  ${closedEyes(-1, -70, 42, 7)}
  <ellipse cx="-30" cy="-50" rx="7" ry="4" fill="#f0786a" opacity=".5"/>
  <ellipse cx="28" cy="-50" rx="7" ry="4" fill="#f0786a" opacity=".5"/>
  ${mouth(
    `<path d="M-26 -56 Q0 -44 26 -56" fill="none" ${st(4)}/>`,
    `<path d="M-26 -58 Q0 -30 26 -58 Q0 -50 -26 -58 Z" fill="#8a2a1a" ${st(3)}/>`,
  )}
</g>`;

export const kaban = () => `
<g data-part="body">
  <rect x="-48" y="-60" width="26" height="60" rx="8" fill="#4e342e" ${st(4)}/>
  <rect x="22" y="-60" width="26" height="60" rx="8" fill="#4e342e" ${st(4)}/>
  <path d="M-46 -2 h22 M24 -2 h22" stroke="#2b1a10" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="2" cy="-130" rx="80" ry="88" fill="#6d4c41" ${stroke}/>
  <!-- bristles along the back -->
  <path d="M-20 -214 l6 -20 l6 18 l8 -22 l6 22 l8 -20 l6 22 l8 -16 l4 18" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="-8" cy="-112" rx="44" ry="56" fill="#8d6e63"/>
  <path d="M-70 -170 Q-104 -130 -86 -96" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>
  <path d="M-70 -170 Q-104 -130 -86 -96" fill="none" stroke="#6d4c41" stroke-width="20" stroke-linecap="round"/>
  <!-- head -->
  <path d="M-20 -258 L-6 -296 L14 -258 Z" fill="#6d4c41" ${stroke}/>
  <path d="M26 -254 L48 -288 L56 -248 Z" fill="#6d4c41" ${stroke}/>
  <ellipse cx="6" cy="-226" rx="56" ry="46" fill="#6d4c41" ${stroke}/>
  <!-- the snout with a flat pink nose -->
  <path d="M-30 -234 Q-70 -232 -82 -220 Q-84 -196 -70 -192 Q-40 -190 -24 -200 Z" fill="#8d6e63" ${stroke}/>
  <ellipse cx="-84" cy="-208" rx="12" ry="18" fill="#f2a7a0" ${st(4)}/>
  <ellipse cx="-86" cy="-214" rx="3" ry="5" fill="#5a2a22"/><ellipse cx="-86" cy="-200" rx="3" ry="5" fill="#5a2a22"/>
  <!-- tusks -->
  <path d="M-58 -196 q-6 -22 -18 -26 q8 14 6 28 z" fill="#fffaf0" ${st(3)}/>
  <path d="M-38 -194 q-4 -20 -14 -26 q6 14 4 28 z" fill="#fffaf0" ${st(3)}/>
  ${eyes(-6, -240, 30, 5)}
  ${closedEyes(-6, -240, 30, 5)}
  <path d="M-26 -254 l16 6 M14 -254 l-12 8" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  ${mouth(
    `<path d="M-60 -190 q14 8 30 0" fill="none" ${st(3)}/>`,
    `<path d="M-62 -192 q16 26 34 0 z" fill="#8a2a1a" ${st(3)}/>`,
  )}
</g>`;

/** the mitten, standing up like a little house: the cuff's opening is the door */
export const rukavychka = () => {
  let flakes = '';
  const spots: [number, number][] = [[-60, -150], [10, -190], [40, -120], [-30, -100], [-70, -210], [70, -200]];
  for (const [x, y] of spots)
    flakes += `<path d="M${x} ${y - 12} V${y + 12} M${x - 11} ${y - 6} L${x + 11} ${y + 6} M${x - 11} ${y + 6} L${x + 11} ${y - 6}" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
  return `
<g data-part="body">
  <!-- thumb -->
  <path d="M74 -150 Q118 -168 126 -214 Q130 -244 108 -248 Q88 -246 86 -214 Q84 -190 70 -184 Z" fill="#c62828" ${stroke}/>
  <!-- palm -->
  <path d="M-96 -70 Q-112 -200 -70 -262 Q-20 -308 34 -290 Q92 -266 96 -180 Q100 -120 92 -70 Z" fill="#c62828" ${stroke}/>
  ${flakes}
  <path d="M-92 -96 Q0 -80 94 -96" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="10 8"/>
  <!-- cuff with an embroidered band -->
  <path d="M-104 -74 Q0 -60 100 -74 L104 -6 Q0 8 -108 -6 Z" fill="#fbf7ee" ${stroke}/>
  ${stitch(-94, -48, 186)}
  <!-- the door: an arch in the cuff -->
  <path d="M-46 -4 L-46 -40 Q-26 -66 -6 -40 L-6 -4 Z" fill="#3a2418" ${st(4)}/>
  <g data-part="peek" style="display:none">
    <circle cx="-32" cy="-30" r="4" fill="#ffe066"/><circle cx="-20" cy="-30" r="4" fill="#ffe066"/>
  </g>
</g>`;
};

/** the mitten after the bear: two halves and loose wool */
export const rukavychka_rvana = () => `
<g data-part="body">
  <path d="M-150 0 Q-170 -60 -120 -110 Q-90 -130 -60 -100 L-80 -60 L-50 -40 L-70 0 Z" fill="#c62828" ${stroke}/>
  <path d="M40 0 L60 -40 L30 -60 L50 -100 Q100 -130 140 -90 Q176 -50 160 0 Z" fill="#c62828" ${stroke}/>
  <path d="M-70 0 q20 -30 0 -50 q30 -10 20 -40 M50 0 q-20 -30 0 -60" fill="none" stroke="#e57373" stroke-width="4"/>
  <path d="M-150 -20 Q-110 -10 -70 -20 M40 -18 Q100 -8 160 -18" stroke="#fbf7ee" stroke-width="10"/>
</g>`;

/** an igloo-like snow house, warm light in the window */
export const snizhna_khatka = () => {
  let blocks = '';
  for (let r = 0; r < 4; r++) {
    const y = -40 - r * 62;
    const half = Math.sqrt(Math.max(0, 1 - Math.pow((r * 62 + 40) / 300, 2))) * 280;
    blocks += `<path d="M${-half} ${y} H${half}" stroke="#b9d3ea" stroke-width="4"/>`;
    for (let x = -half + 60 + (r % 2) * 40; x < half - 20; x += 90) blocks += `<path d="M${x} ${y} V${y + 62}" stroke="#b9d3ea" stroke-width="4"/>`;
  }
  return `
<g data-part="body">
  <path d="M-290 0 Q-300 -300 0 -300 Q300 -300 290 0 Z" fill="#f7fbff" stroke="#9cbbd8" stroke-width="6"/>
  ${blocks}
  <path d="M-80 0 L-80 -90 Q0 -170 80 -90 L80 0 Z" fill="#3a5a7a" stroke="#9cbbd8" stroke-width="6"/>
  <path d="M-60 0 L-60 -84 Q0 -140 60 -84 L60 0 Z" fill="#ffc861" opacity=".85"/>
  <circle cx="160" cy="-170" r="34" fill="#ffd36b" stroke="#9cbbd8" stroke-width="6"/>
  <path d="M126 -170 H194 M160 -204 V-136" stroke="#9cbbd8" stroke-width="5"/>
  <path d="M-240 -120 l-8 26 M-200 -190 l-6 22 M200 -60 l-8 24" stroke="#cfe3f4" stroke-width="6" stroke-linecap="round"/>
</g>`;
};
