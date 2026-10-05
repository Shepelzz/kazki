// The puppets of «Ріпка»: the big turnip (it grows, sits half in the ground, pops out) and the
// garden bed in front of it that hides its lower half. Same conventions as characters.ts.

import { st, stroke } from './characters';

/** the turnip: a round white-and-violet bulb, a thin root below, big leaves on top */
export const ripka = () => `
<g data-part="body">
  <path d="M0 -6 Q6 20 -4 44" stroke="#c9b48c" stroke-width="7" fill="none" stroke-linecap="round"/>
  ${[-60, -24, 14, 52]
    .map((x, i) => `<path d="M${x} -200 Q${x * 1.8} -330 ${x * 1.2 + (i % 2 ? 30 : -30)} -430 Q${x * 0.9} -300 ${x * 0.3} -200 Z" fill="${i % 2 ? '#43a047' : '#66bb6a'}" ${st(4)}/>`)
    .join('')}
  <path d="M-8 -200 V-330 M20 -200 Q40 -300 60 -360" stroke="#2e7d32" stroke-width="5" fill="none"/>
  <path d="M0 -4 C-90 -4 -126 -70 -116 -128 C-106 -190 -54 -214 0 -214 C54 -214 106 -190 116 -128 C126 -70 90 -4 0 -4 Z" fill="#f6efe0" ${stroke}/>
  <path d="M-112 -142 C-96 -196 -50 -214 0 -214 C50 -214 96 -196 112 -142 C70 -168 -70 -168 -112 -142 Z" fill="#9c4dcc" ${st(4)}/>
  <path d="M-70 -90 q8 18 2 36 M60 -70 q10 14 4 30" stroke="#d8ccb2" stroke-width="4" fill="none" stroke-linecap="round"/>
</g>`;

/** a heaped garden bed: dark soil, drawn in front of the turnip */
export const hriadka = () => `
<g data-part="body">
  <path d="M-240 110 Q-236 -40 -120 -52 Q0 -66 120 -52 Q236 -40 240 110 Z" fill="#6d4426" ${stroke}/>
  ${[-150, -80, 0, 80, 150].map((x, i) => `<path d="M${x - 24} ${-30 + (i % 2) * 8} q24 -10 48 0" stroke="#8b5a2b" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
</g>`;
