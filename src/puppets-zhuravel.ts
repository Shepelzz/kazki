// The puppets of «Лисичка і Журавель»: the crane (pecks with its head: data-part="head"), a flat
// plate of porridge, a tall narrow-necked jug, a pie. Same conventions as characters.ts.

import { INK, closedEyes, mouth, st, stroke } from './characters';

export const zhuravel = () => `
<g data-part="body">
  <!-- long legs -->
  <path d="M-12 -150 L-18 -4 M14 -150 L22 -4" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
  <path d="M-12 -150 L-18 -4 M14 -150 L22 -4" stroke="#455a64" stroke-width="5" stroke-linecap="round"/>
  <path d="M-30 -2 h26 M8 -2 h28" stroke="#455a64" stroke-width="6" stroke-linecap="round"/>
  <g data-dress="legs"></g>
  <!-- body with dark tail plumes -->
  <path d="M40 -190 Q100 -170 96 -130 Q70 -150 40 -150 Z" fill="#37474f" ${st(4)}/>
  <ellipse cx="0" cy="-180" rx="60" ry="40" fill="#cfd8dc" ${stroke}/>
  <path d="M-30 -190 Q10 -160 54 -186" stroke="#90a4ae" stroke-width="5" fill="none"/>
  <g data-dress="torso"></g>
  <!-- neck and head (pecks down) -->
  <g data-part="head" data-cx="-40" data-cy="-200">
    <path d="M-40 -200 Q-56 -270 -40 -320" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>
    <path d="M-40 -200 Q-56 -270 -40 -320" fill="none" stroke="#eceff1" stroke-width="13" stroke-linecap="round"/>
    <circle cx="-42" cy="-334" r="20" fill="#eceff1" ${stroke}/>
    <path d="M-50 -350 q8 -10 18 -2" fill="#e53935" ${st(2)}/>
    <!-- long beak to the left -->
    ${mouth(
      `<path d="M-60 -334 L-150 -326 L-60 -324 Z" fill="#ffb300" ${st(3)}/>`,
      `<path d="M-60 -336 L-150 -340 L-60 -330 Z M-60 -326 L-148 -318 L-60 -320 Z" fill="#ffb300" ${st(3)}/>`,
    )}
    <g data-part="eyes" data-cx="-46" data-cy="-338"><circle cx="-46" cy="-338" r="5" fill="#2b1a10"/><circle cx="-44" cy="-340" r="1.8" fill="#fff"/></g>
    ${closedEyes(-46, -338, 0, 5)}
  </g>
</g>`;

/** a flat plate with porridge smeared thin over it */
export const tarilka = () => `
<g data-part="body">
  <ellipse cx="0" cy="-10" rx="90" ry="16" fill="#e3f2fd" ${stroke}/>
  <ellipse cx="0" cy="-12" rx="62" ry="9" fill="#ffe082"/>
  <path d="M-40 -14 q20 -4 40 0 q20 4 40 0" stroke="#ffca28" stroke-width="3" fill="none"/>
</g>`;

/** a tall jug with a narrow neck: only a long beak gets in */
export const hlechyk = () => `
<g data-part="body">
  <path d="M-50 0 Q-76 -90 -40 -140 Q-20 -160 -18 -210 L18 -210 Q20 -160 40 -140 Q76 -90 50 0 Z" fill="#c0542e" ${stroke}/>
  <rect x="-24" y="-226" width="48" height="18" rx="6" fill="#a8442a" ${st(4)}/>
  <path d="M-46 -60 Q0 -40 46 -60 M-56 -100 Q0 -80 56 -100" stroke="#f5c542" stroke-width="6" fill="none"/>
  <circle cx="0" cy="-80" r="8" fill="#f5c542"/>
</g>`;

/** a big round pie, good for a beak and a muzzle alike */
export const pyrih = () => `
<g data-part="body">
  <ellipse cx="0" cy="-10" rx="90" ry="16" fill="#e0e0e0" ${st(3)}/>
  <path d="M-70 -18 Q-70 -70 0 -74 Q70 -70 70 -18 Z" fill="#e2a24a" ${stroke}/>
  <path d="M-40 -40 q10 -14 20 0 M0 -50 q10 -14 20 0 M30 -36 q8 -10 16 0" stroke="#b5762a" stroke-width="4" fill="none"/>
</g>`;
