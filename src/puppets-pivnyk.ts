// The puppets of «Котик і Півник»: the rooster with a golden comb, the cat's gusli, a sack (torba),
// a bundle of firewood. Same conventions as characters.ts.

import { closedEyes, eyes, mouth, st, stroke } from './characters';

export const pivnyk = () => `
<g data-part="body">
  <path d="M-10 0 v-34 M14 0 v-34" stroke="#ff9800" stroke-width="7"/>
  <path d="M-22 0 h20 M2 0 h22" stroke="#ff9800" stroke-width="6" stroke-linecap="round"/>
  <g data-dress="legs"></g>
  <!-- tail feathers -->
  <g data-part="tail" data-cx="40" data-cy="-80">
    <path d="M36 -70 Q90 -150 70 -190 Q60 -130 30 -100 Z" fill="#2e7d32" ${st(3)}/>
    <path d="M40 -76 Q110 -120 104 -170 Q80 -120 34 -96 Z" fill="#1565c0" ${st(3)}/>
    <path d="M40 -80 Q100 -80 112 -120 Q80 -96 36 -90 Z" fill="#c62828" ${st(3)}/>
  </g>
  <ellipse cx="0" cy="-74" rx="50" ry="40" fill="#e65100" ${stroke}/>
  <path d="M-30 -70 Q0 -40 30 -66 Q10 -90 -30 -70 Z" fill="#ffb74d" ${st(3)}/>
  <g data-dress="torso"></g>
  <!-- neck and head to the left -->
  <path d="M-30 -96 Q-40 -140 -34 -160" stroke="#ef6c00" stroke-width="34" fill="none" stroke-linecap="round"/>
  <circle cx="-38" cy="-168" r="24" fill="#f57c00" ${stroke}/>
  <!-- golden comb -->
  <path d="M-58 -186 q4 -24 14 -10 q4 -26 16 -8 q6 -22 16 -4 q-12 10 -46 22 z" fill="#ffca28" ${st(3)}/>
  <path d="M-62 -164 l-20 6 l20 6 z" fill="#ffca28" ${st(3)}/>
  <path d="M-58 -150 q-4 14 6 18 q8 -4 6 -16" fill="#e53935" ${st(2)}/>
  ${eyes(-42, -172, 0, 5)}
  ${closedEyes(-42, -172, 0, 5)}
  ${mouth('', `<path d="M-62 -160 l-18 8 l18 2 z" fill="#8a2a1a" ${st(2)}/>`)}
</g>`;

/** gusli: a wing-shaped psaltery with golden strings */
export const husli = () => `
<g data-part="body">
  <path d="M-60 0 Q-70 -60 0 -80 Q80 -90 70 -20 Q40 10 -60 0 Z" fill="#a1704a" ${stroke}/>
  ${Array.from({ length: 6 }, (_, i) => `<path d="M${-46 + i * 6} ${-8 - i * 2} L${-6 + i * 14} ${-66 - i * 2}" stroke="#ffd54f" stroke-width="2"/>`).join('')}
  <circle cx="10" cy="-36" r="9" fill="#5d4037"/>
</g>`;

/** a sack the cat catches the fox cubs into (they're let out later) */
export const torba = () => `
<g data-part="body">
  <path d="M-50 0 Q-66 -70 -30 -110 L30 -110 Q66 -70 50 0 Z" fill="#c8a06e" ${stroke}/>
  <path d="M-36 -108 Q0 -96 36 -108" stroke="#8b5a2b" stroke-width="7" fill="none"/>
  <path d="M-20 -60 l10 10 M10 -40 l12 8" stroke="#a1704a" stroke-width="4"/>
  <g data-part="peek" style="display:none">
    <circle cx="-8" cy="-96" r="4" fill="#ffe066"/><circle cx="8" cy="-96" r="4" fill="#ffe066"/>
  </g>
</g>`;

export const vyazanka = () => `
<g data-part="body">
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="-60" y="${-14 - i * 16}" width="120" height="16" rx="8" fill="${i % 2 ? '#a1704a' : '#8b5a2b'}" stroke="#5a3a22" stroke-width="3" transform="rotate(${(i % 2 ? 4 : -4)} 0 ${-6 - i * 16})"/>`).join('')}
  <path d="M-20 -90 V0 M20 -90 V0" stroke="#6d8f3a" stroke-width="5"/>
</g>`;
