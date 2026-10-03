// The puppets of «Івасик-Телесик»: the boy, his golden boat with a silver oar, the cradle with a
// log, the Zmiiuchka (a big green snake-witch in a headscarf) and her daughter Olenka, the smith and
// his anvil, the baker's peel, a tall maple, a flock of geese and the little gosling, a dish of pies.
// Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stitch, stroke } from './characters';

export const telesyk = () => `
<g data-part="body">
  <path d="M-22 -70 L-24 -8 L-4 -8 L-4 -70 Z" fill="#fbf7ee" ${st(4)}/>
  <path d="M4 -70 L4 -8 L24 -8 L22 -70 Z" fill="#fbf7ee" ${st(4)}/>
  <ellipse cx="-14" cy="-6" rx="13" ry="7" fill="#f2c4a0" ${st(3)}/><ellipse cx="14" cy="-6" rx="13" ry="7" fill="#f2c4a0" ${st(3)}/>
  <path d="M-38 -150 Q-48 -110 -40 -66 L40 -66 Q48 -110 38 -150 Q0 -162 -38 -150 Z" fill="#fbf7ee" ${stroke}/>
  ${stitch(-5, -150, 10, 50, true)}
  <rect x="-42" y="-80" width="84" height="12" rx="4" fill="#c62828" ${st(3)}/>
  <path d="M-36 -146 Q-60 -116 -50 -90" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
  <path d="M-36 -146 Q-60 -116 -50 -90" fill="none" stroke="#fbf7ee" stroke-width="14" stroke-linecap="round"/>
  <circle cx="-50" cy="-86" r="10" fill="#f2c4a0" ${st(3)}/>
  <path d="M36 -146 Q60 -116 50 -90" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
  <path d="M36 -146 Q60 -116 50 -90" fill="none" stroke="#fbf7ee" stroke-width="14" stroke-linecap="round"/>
  <circle cx="50" cy="-86" r="10" fill="#f2c4a0" ${st(3)}/>
  <ellipse cx="0" cy="-186" rx="34" ry="36" fill="#f2c4a0" ${stroke}/>
  <!-- straw-blond fringe -->
  <path d="M-34 -192 Q-34 -230 0 -230 Q34 -230 34 -192 Q24 -206 12 -200 Q2 -212 -10 -200 Q-22 -210 -34 -192 Z" fill="#f2c94c" ${st(4)}/>
  ${eyes(0, -190, 24, 5)}
  ${closedEyes(0, -190, 24, 5)}
  <ellipse cx="-17" cy="-174" rx="7" ry="4" fill="#f0786a" opacity=".7"/><ellipse cx="17" cy="-174" rx="7" ry="4" fill="#f0786a" opacity=".7"/>
  ${mouth(`<path d="M-9 -168 q9 8 18 0" fill="none" ${st(3)}/>`, `<path d="M-9 -170 q9 16 18 0 z" fill="#7a2a1a" ${st(3)}/>`)}
</g>`;

/** the golden boat with a silver oar (Telesyk stands in it) */
export const chovnyk = () => `
<g data-part="body">
  <path d="M-130 -46 Q-120 0 -60 4 L60 4 Q120 0 130 -46 Z" fill="#f5c542" ${stroke}/>
  <path d="M-120 -40 H120" stroke="#e0a800" stroke-width="6"/>
  <circle cx="-70" cy="-20" r="6" fill="#fff6c4"/><circle cx="0" cy="-20" r="6" fill="#fff6c4"/><circle cx="70" cy="-20" r="6" fill="#fff6c4"/>
  <path d="M80 -150 L30 20" stroke="#cfd8dc" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="26" cy="30" rx="12" ry="26" fill="#eceff1" stroke="#90a4ae" stroke-width="3" transform="rotate(18 26 30)"/>
</g>`;

/** the cradle on its hook, a log swaddled in it */
export const kolyska = () => `
<g data-part="body">
  <path d="M0 -330 V-200 M0 -200 L-90 -150 M0 -200 L90 -150" stroke="#6d4426" stroke-width="5"/>
  <path d="M-100 -150 Q-100 -70 0 -70 Q100 -70 100 -150 Z" fill="#c8a06e" ${stroke}/>
  <path d="M-90 -130 H90 M-80 -104 H80" stroke="#8b5a2b" stroke-width="4"/>
  <ellipse cx="0" cy="-152" rx="70" ry="14" fill="#fbf7ee" ${st(3)}/>
</g>`;

/** the Zmiiuchka: a big green snake with a headscarf, coiled, swaying */
export const zmiyuchka = () => `
<g data-part="body">
  <path d="M120 -10 Q180 -20 170 -60 Q150 -40 110 -40 Z" fill="#558b2f" ${stroke}/>
  <ellipse cx="20" cy="-34" rx="120" ry="38" fill="#689f38" ${stroke}/>
  <ellipse cx="0" cy="-86" rx="92" ry="34" fill="#7cb342" ${stroke}/>
  <path d="M-30 -110 Q-56 -200 -30 -260" fill="none" stroke="${INK}" stroke-width="62" stroke-linecap="round"/>
  <path d="M-30 -110 Q-56 -200 -30 -260" fill="none" stroke="#7cb342" stroke-width="50" stroke-linecap="round"/>
  <path d="M-40 -130 Q-58 -196 -38 -246" fill="none" stroke="#dcedc8" stroke-width="18" stroke-dasharray="14 10" stroke-linecap="round"/>
  <!-- head in a black headscarf with red roses -->
  <ellipse cx="-44" cy="-300" rx="64" ry="54" fill="#7cb342" ${stroke}/>
  <path d="M-108 -300 Q-112 -370 -44 -374 Q24 -370 20 -300 Q8 -340 -44 -342 Q-96 -340 -108 -300 Z" fill="#212121" ${st(4)}/>
  <circle cx="-70" cy="-352" r="8" fill="#e53935"/><circle cx="-24" cy="-356" r="8" fill="#e53935"/>
  <path d="M-10 -290 l40 26 l-14 4 z" fill="#212121"/>
  <g data-part="eyes" data-cx="-56" data-cy="-306">
    <ellipse cx="-78" cy="-306" rx="12" ry="14" fill="#fff59d" ${st(3)}/><ellipse cx="-78" cy="-306" rx="3" ry="11" fill="#2b1a10"/>
    <ellipse cx="-36" cy="-306" rx="12" ry="14" fill="#fff59d" ${st(3)}/><ellipse cx="-36" cy="-306" rx="3" ry="11" fill="#2b1a10"/>
  </g>
  ${closedEyes(-57, -306, 42, 8)}
  ${mouth(
    `<path d="M-90 -272 Q-60 -256 -30 -272" fill="none" ${st(4)}/><path d="M-62 -264 l-4 18 l4 -6 l4 6 z" fill="#e53935"/>`,
    `<path d="M-92 -276 Q-60 -232 -28 -276 Q-60 -266 -92 -276 Z" fill="#8a2a1a" ${st(3)}/><path d="M-64 -258 l-6 22 l6 -8 l6 8 z" fill="#e53935"/>`,
  )}
</g>`;

/** Olenka, the Zmiiuchka's daughter: a smaller snake-girl with braids */
export const olenka = () => `
<g data-part="body">
  <ellipse cx="10" cy="-26" rx="80" ry="26" fill="#8bc34a" ${stroke}/>
  <path d="M-10 -40 Q-30 -120 -14 -170" fill="none" stroke="${INK}" stroke-width="44" stroke-linecap="round"/>
  <path d="M-10 -40 Q-30 -120 -14 -170" fill="none" stroke="#9ccc65" stroke-width="34" stroke-linecap="round"/>
  <ellipse cx="-20" cy="-204" rx="46" ry="42" fill="#9ccc65" ${stroke}/>
  <path d="M-58 -214 Q-74 -170 -64 -140 M18 -214 Q32 -170 24 -140" stroke="#33691e" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M-64 -222 Q-60 -252 -20 -252 Q20 -252 24 -222 Q4 -236 -20 -236 Q-44 -236 -64 -222 Z" fill="#33691e" ${st(4)}/>
  <circle cx="-64" cy="-140" r="7" fill="#e53935"/><circle cx="24" cy="-140" r="7" fill="#e53935"/>
  <g data-part="eyes" data-cx="-28" data-cy="-208">
    <ellipse cx="-44" cy="-208" rx="9" ry="10" fill="#fff59d" ${st(3)}/><ellipse cx="-44" cy="-208" rx="2.5" ry="8" fill="#2b1a10"/>
    <ellipse cx="-12" cy="-208" rx="9" ry="10" fill="#fff59d" ${st(3)}/><ellipse cx="-12" cy="-208" rx="2.5" ry="8" fill="#2b1a10"/>
  </g>
  ${closedEyes(-28, -208, 32, 7)}
  ${mouth(`<path d="M-44 -184 q16 10 30 0" fill="none" ${st(3)}/>`, `<path d="M-44 -186 q16 20 30 0 z" fill="#8a2a1a" ${st(3)}/>`)}
</g>`;

/** the smith: leather apron, a hammer raised */
export const koval = () => `
<g data-part="body">
  <path d="M-40 -120 L-42 -10 L-10 -10 L-8 -120 Z" fill="#37474f" ${st(4)}/>
  <path d="M8 -120 L10 -10 L42 -10 L40 -120 Z" fill="#37474f" ${st(4)}/>
  <path d="M-52 0 q2 -16 12 -16 h30 v16 z M52 0 q-2 -16 -12 -16 h-30 v16 z" fill="#212121" ${st(4)}/>
  <path d="M-66 -260 Q-84 -180 -76 -114 L76 -114 Q84 -180 66 -260 Q0 -280 -66 -260 Z" fill="#cfd8dc" ${stroke}/>
  <path d="M-46 -230 L-56 -60 L56 -60 L46 -230 Z" fill="#6d4426" ${st(4)}/>
  <path d="M-64 -250 Q-100 -210 -94 -160" fill="none" stroke="${INK}" stroke-width="36" stroke-linecap="round"/>
  <path d="M-64 -250 Q-100 -210 -94 -160" fill="none" stroke="#cfd8dc" stroke-width="26" stroke-linecap="round"/>
  <circle cx="-94" cy="-150" r="15" fill="#e0b090" ${st(4)}/>
  <!-- the raised arm with a hammer -->
  <g data-part="ears" data-cx="66" data-cy="-250">
    <path d="M64 -250 Q110 -290 100 -340" fill="none" stroke="${INK}" stroke-width="36" stroke-linecap="round"/>
    <path d="M64 -250 Q110 -290 100 -340" fill="none" stroke="#cfd8dc" stroke-width="26" stroke-linecap="round"/>
    <circle cx="100" cy="-350" r="15" fill="#e0b090" ${st(4)}/>
    <path d="M100 -350 L60 -400" stroke="#6d4426" stroke-width="10" stroke-linecap="round"/>
    <rect x="30" y="-430" width="56" height="34" rx="6" fill="#546e7a" ${st(4)} transform="rotate(-40 58 -413)"/>
  </g>
  <ellipse cx="0" cy="-310" rx="44" ry="46" fill="#e0b090" ${stroke}/>
  <path d="M-44 -310 Q-44 -360 0 -360 Q44 -360 44 -310 Q30 -330 0 -330 Q-30 -330 -44 -310 Z" fill="#3e2723" ${st(4)}/>
  <path d="M-38 -290 Q-40 -240 0 -232 Q40 -240 38 -290 Q24 -270 0 -272 Q-24 -270 -38 -290 Z" fill="#3e2723" ${st(4)}/>
  ${eyes(0, -314, 30, 6)}
  ${closedEyes(0, -314, 30, 6)}
  <ellipse cx="0" cy="-296" rx="9" ry="8" fill="#d48c6a"/>
  ${mouth('', '<ellipse cx="0" cy="-268" rx="10" ry="8" fill="#7a2a1a"/>')}
</g>`;

export const kovadlo = () => `
<g data-part="body">
  <path d="M-30 0 L-20 -60 L20 -60 L30 0 Z" fill="#6d4426" ${st(4)}/>
  <path d="M-80 -60 Q-110 -70 -100 -90 L70 -90 L80 -60 Z" fill="#455a64" ${stroke}/>
  <rect x="-10" y="-120" width="40" height="30" rx="4" fill="#ff7043" ${st(3)}/>
</g>`;

export const lopata = () => `
<g data-part="body">
  <path d="M-160 -8 H40" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/>
  <path d="M40 -30 Q120 -36 130 -8 Q120 20 40 14 Z" fill="#c8a06e" ${stroke}/>
</g>`;

/** a tall maple: Telesyk climbs to the very top */
export const yavir = () => {
  let crown = '';
  const r = [0.3, 0.7, 0.2, 0.9, 0.5, 0.6, 0.1, 0.8];
  for (let i = 0; i < 8; i++) crown += `<circle cx="${(r[i] - 0.5) * 220}" cy="${-760 + i * 70}" r="${100 - i * 4}" fill="${i % 2 ? '#43a047' : '#2e7d32'}"/>`;
  return `
<g data-part="body">
  ${crown}
  <path d="M-36 0 Q-24 -400 -14 -800 L14 -800 Q24 -400 36 0 Z" fill="#6d4426" stroke="#4e2f18" stroke-width="5"/>
  <path d="M-14 -720 Q-80 -740 -120 -720 L-120 -704 Q-80 -724 -14 -704 Z" fill="#6d4426" stroke="#4e2f18" stroke-width="4"/>
  <path d="M-10 -500 Q-90 -520 -140 -480 M10 -420 Q80 -440 130 -400" stroke="#6d4426" stroke-width="14" fill="none" stroke-linecap="round"/>
</g>`;
};

/** one goose, wings up or down (flapping) */
function goose(x: number, y: number, s: number) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="44" ry="20" fill="#eceff1" ${st(3)}/>
    <path d="M-40 -6 Q-70 -20 -80 -40" stroke="${INK}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M-40 -6 Q-70 -20 -80 -40" stroke="#eceff1" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="-82" cy="-42" r="11" fill="#eceff1" ${st(3)}/>
    <path d="M-92 -42 l-14 4 l14 4 z" fill="#ff9800" ${st(2)}/>
    <circle cx="-84" cy="-45" r="2.5" fill="#2b1a10"/>
    <g data-part="wing"><path d="M-6 -6 Q20 -70 50 -60 Q30 -24 20 -4 Z" fill="#cfd8dc" ${st(3)}/></g>
  </g>`;
}

/** a flock flying in a V (flies left) */
export const gusy = () => `
<g data-part="body">
  ${goose(0, -40, 1)}${goose(110, -90, 0.9)}${goose(110, 10, 0.9)}${goose(210, -130, 0.8)}${goose(210, 50, 0.8)}
</g>`;

/** the little gosling, tired, that takes Telesyk home */
export const gusenia = () => `
<g data-part="body">
  <ellipse cx="0" cy="-40" rx="56" ry="30" fill="#fff59d" ${stroke}/>
  <path d="M-46 -50 Q-70 -70 -66 -100" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M-46 -50 Q-70 -70 -66 -100" stroke="#fff59d" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="-66" cy="-108" r="18" fill="#fff59d" ${stroke}/>
  <path d="M-82 -108 l-18 5 l18 6 z" fill="#ff9800" ${st(2)}/>
  ${eyes(-70, -112, 0, 4)}
  ${closedEyes(-70, -112, 0, 4)}
  <g data-part="ears" data-cx="0" data-cy="-50"><path d="M-10 -50 Q20 -110 60 -96 Q36 -60 24 -36 Z" fill="#fff176" ${st(3)}/></g>
  <path d="M-16 -12 v12 M10 -12 v12" stroke="#ff9800" stroke-width="6"/>
</g>`;

export const pyrohy = () => `
<g data-part="body">
  <ellipse cx="0" cy="-12" rx="70" ry="14" fill="#e0e0e0" ${st(3)}/>
  <path d="M-50 -20 Q-46 -50 -20 -48 Q-6 -44 -10 -20 Z M-10 -22 Q-4 -54 22 -52 Q38 -46 32 -22 Z M28 -20 Q34 -46 56 -42 Q66 -32 58 -18 Z" fill="#e2a24a" ${st(3)}/>
</g>`;
