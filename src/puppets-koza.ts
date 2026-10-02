// The puppets of «Коза-дереза»: the goat (she munches with her head down: data-part="head"), the
// hedgehog, the crayfish, the hare's little hut and a cabbage. Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stroke } from './characters';

export const koza = () => `
<g data-part="body">
  <!-- legs with dark hooves -->
  <path d="M-46 -70 L-48 -8 L-34 -8 L-30 -70 Z" fill="#f4f1ea" ${st(4)}/>
  <path d="M-22 -70 L-22 -8 L-8 -8 L-6 -70 Z" fill="#e6e1d6" ${st(4)}/>
  <path d="M26 -70 L28 -8 L42 -8 L42 -70 Z" fill="#e6e1d6" ${st(4)}/>
  <path d="M50 -70 L54 -8 L68 -8 L66 -70 Z" fill="#f4f1ea" ${st(4)}/>
  <path d="M-50 0 h18 v-10 h-18 z M-24 0 h18 v-10 h-18 z M26 0 h18 v-10 h-18 z M52 0 h18 v-10 h-18 z" fill="#3a2a22"/>
  <!-- body and a little tail -->
  <path d="M78 -112 q20 -14 16 -36 q-12 14 -22 18 z" fill="#f4f1ea" ${st(4)}/>
  <ellipse cx="12" cy="-100" rx="74" ry="42" fill="#f4f1ea" ${stroke}/>
  <path d="M-10 -136 q20 -10 40 0 M20 -132 q16 -8 32 2" stroke="#d8d1c4" stroke-width="4" fill="none"/>
  <!-- head on its neck: tips down to munch grass -->
  <g data-part="head" data-cx="-38" data-cy="-118">
    <path d="M-40 -130 Q-58 -160 -66 -184 L-44 -194 Q-30 -160 -20 -128 Z" fill="#f4f1ea" ${stroke}/>
    <!-- bell on a red ribbon -->
    <path d="M-60 -160 Q-44 -150 -30 -156" stroke="#c62828" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M-52 -154 q-8 0 -9 12 q9 5 18 0 q-1 -12 -9 -12 z" fill="#f5c542" ${st(3)}/>
    <!-- horns -->
    <path d="M-62 -214 Q-50 -252 -24 -252 Q-44 -240 -50 -212 Z" fill="#a1887f" ${st(4)}/>
    <path d="M-44 -212 Q-26 -246 0 -240 Q-22 -232 -32 -206 Z" fill="#8d6e63" ${st(4)}/>
    <!-- ears -->
    <path d="M-34 -204 Q-4 -206 6 -194 Q-10 -186 -36 -194 Z" fill="#f4f1ea" ${st(4)}/>
    <path d="M-34 -200 Q-14 -200 -4 -194 Q-16 -190 -34 -196 Z" fill="#f4b8b0"/>
    <!-- head with a long face to the left -->
    <path d="M-40 -222 Q-20 -214 -26 -186 Q-36 -164 -64 -160 Q-90 -160 -96 -178 Q-96 -196 -78 -206 Q-62 -224 -40 -222 Z" fill="#f4f1ea" ${stroke}/>
    <ellipse cx="-92" cy="-180" rx="8" ry="6" fill="#d4a59a"/>
    <circle cx="-94" cy="-182" r="2.5" fill="#5a3a22"/>
    <!-- beard -->
    <path d="M-80 -164 Q-84 -138 -72 -130 Q-66 -146 -64 -162 Z" fill="#e6e1d6" ${st(4)}/>
    <g data-part="eyes" data-cx="-56" data-cy="-198">
      <ellipse cx="-56" cy="-198" rx="9" ry="8" fill="#fff" ${st(3)}/>
      <ellipse cx="-58" cy="-198" rx="5" ry="3" fill="#2b1a10"/>
      <path d="M-66 -203 Q-56 -210 -46 -203" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    </g>
    ${closedEyes(-56, -197, 0, 7)}
    <ellipse cx="-72" cy="-182" rx="7" ry="4" fill="#f0786a" opacity=".5"/>
    ${mouth(
      `<path d="M-90 -170 q8 6 16 2" fill="none" ${st(3)}/>`,
      `<path d="M-92 -172 q10 18 20 2 z" fill="#8a2a1a" ${st(3)}/>`,
    )}
  </g>
</g>`;

export const yizhachok = () => {
  let spikes = '';
  for (let i = 0; i < 13; i++) {
    const a = Math.PI * (0.05 + (i / 12) * 0.9);
    const x0 = Math.cos(a) * 62 + 6;
    const y0 = -Math.sin(a) * 50 - 30;
    const x1 = Math.cos(a) * 92 + 6;
    const y1 = -Math.sin(a) * 78 - 30;
    spikes += `<path d="M${(x0 - 9 * Math.sin(a)).toFixed(1)} ${(y0 - 9 * Math.cos(a)).toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${(x0 + 9 * Math.sin(a)).toFixed(1)} ${(y0 + 9 * Math.cos(a)).toFixed(1)} Z" fill="#6d4c41" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
  }
  return `
<g data-part="body">
  <ellipse cx="-20" cy="-6" rx="14" ry="7" fill="#5d4037"/><ellipse cx="30" cy="-6" rx="14" ry="7" fill="#5d4037"/>
  ${spikes}
  <path d="M-58 -30 Q-56 -86 6 -88 Q68 -86 70 -30 Q66 -6 6 -6 Q-54 -6 -58 -30 Z" fill="#8d6e63" ${stroke}/>
  <!-- face: light, with a pointy nose to the left -->
  <path d="M-30 -66 Q-4 -66 -6 -36 Q-8 -12 -40 -14 Q-64 -18 -80 -32 Q-84 -40 -76 -46 Q-56 -66 -30 -66 Z" fill="#f2d7b6" ${stroke}/>
  <circle cx="-82" cy="-38" r="7" fill="#2b1a10"/>
  ${eyes(-40, -46, 0, 6)}
  ${closedEyes(-40, -46, 0, 6)}
  <ellipse cx="-30" cy="-32" rx="8" ry="5" fill="#f0786a" opacity=".55"/>
  ${mouth(
    `<path d="M-70 -28 q8 5 16 0" fill="none" ${st(3)}/>`,
    `<ellipse cx="-62" cy="-26" rx="7" ry="6" fill="#8a2a1a" ${st(2)}/>`,
  )}
  <!-- an apple on his back, as in the tales -->
  <circle cx="20" cy="-106" r="16" fill="#e53935" ${st(3)}/>
  <path d="M20 -122 q2 -8 8 -10" stroke="#5d4037" stroke-width="4" fill="none"/>
  <path d="M24 -126 q10 -6 16 2 q-8 4 -16 -2 z" fill="#66bb6a"/>
</g>`;
};

export const rak = () => `
<g data-part="body">
  <!-- legs -->
  <path d="M-40 -30 l-24 26 M-24 -24 l-14 24 M24 -24 l14 24 M40 -30 l24 26" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
  <path d="M-40 -30 l-24 26 M-24 -24 l-14 24 M24 -24 l14 24 M40 -30 l24 26" stroke="#e05a3a" stroke-width="4" stroke-linecap="round"/>
  <!-- body -->
  <ellipse cx="0" cy="-56" rx="56" ry="42" fill="#e05a3a" ${stroke}/>
  <path d="M-36 -64 q36 -14 72 0 M-40 -46 q40 -12 80 0" stroke="#b83b22" stroke-width="4" fill="none"/>
  <!-- big claws, raised -->
  <g data-part="claws">
    <path d="M-50 -76 Q-84 -110 -86 -140" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
    <path d="M-50 -76 Q-84 -110 -86 -140" fill="none" stroke="#e05a3a" stroke-width="9" stroke-linecap="round"/>
    <path d="M-86 -140 Q-120 -150 -112 -184 Q-98 -170 -86 -166 Q-88 -190 -66 -196 Q-62 -160 -86 -140 Z" fill="#e05a3a" ${stroke}/>
    <path d="M50 -76 Q84 -110 86 -140" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>
    <path d="M50 -76 Q84 -110 86 -140" fill="none" stroke="#e05a3a" stroke-width="9" stroke-linecap="round"/>
    <path d="M86 -140 Q120 -150 112 -184 Q98 -170 86 -166 Q88 -190 66 -196 Q62 -160 86 -140 Z" fill="#e05a3a" ${stroke}/>
  </g>
  <!-- eyes on stalks -->
  <path d="M-16 -94 l-6 -26 M16 -94 l6 -26" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  <g data-part="eyes" data-cx="0" data-cy="-124">
    <circle cx="-22" cy="-124" r="11" fill="#fff" ${st(3)}/><circle cx="-24" cy="-124" r="6" fill="#2b1a10"/>
    <circle cx="22" cy="-124" r="11" fill="#fff" ${st(3)}/><circle cx="20" cy="-124" r="6" fill="#2b1a10"/>
  </g>
  ${closedEyes(0, -124, 44, 8)}
  ${mouth(
    `<path d="M-12 -52 q12 10 24 0" fill="none" ${st(4)}/>`,
    `<path d="M-12 -54 q12 22 24 0 z" fill="#7a1a10" ${st(3)}/>`,
  )}
</g>`;

/** the hare's little log hut; the door is where the goat goes in and out */
export const khatynka = () => {
  let logs = '';
  for (let i = 0; i < 6; i++) logs += `<rect x="-150" y="${-34 - i * 34}" width="300" height="32" rx="16" fill="${i % 2 ? '#a1704a' : '#b07e55'}" stroke="#6d4426" stroke-width="4"/>`;
  return `
<g data-part="body">
  ${logs}
  <!-- thatched roof -->
  <path d="M-184 -200 L0 -330 L184 -200 Z" fill="#e2b45a" stroke="#b78630" stroke-width="6" stroke-linejoin="round"/>
  <path d="M-140 -206 L-60 -270 M-90 -206 L-20 -290 M-30 -206 L20 -300 M40 -206 L60 -280 M100 -206 L100 -250" stroke="#c99a3e" stroke-width="4"/>
  <rect x="80" y="-320" width="34" height="70" fill="#8a5a3a" stroke="#5a3a22" stroke-width="4"/>
  <!-- window with a carrot-coloured curtain -->
  <rect x="50" y="-150" width="70" height="60" fill="#9fd3f0" stroke="#5a3a22" stroke-width="6"/>
  <path d="M85 -150 v60 M50 -120 h70" stroke="#5a3a22" stroke-width="4"/>
  <path d="M52 -148 q14 30 0 54 z" fill="#ff9f43"/>
  <!-- door -->
  <path d="M-70 0 L-70 -110 Q-30 -150 10 -110 L10 0 Z" fill="#7a4e2a" stroke="#5a3a22" stroke-width="5"/>
  <circle cx="-4" cy="-56" r="6" fill="#f2c94c"/>
  <g data-part="peek" style="display:none">
    <circle cx="-40" cy="-96" r="5" fill="#ffe066"/><circle cx="-24" cy="-96" r="5" fill="#ffe066"/>
  </g>
</g>`;
};

export const kapusta = () => `
<g data-part="body">
  <circle cx="0" cy="-34" r="34" fill="#9ccc65" ${stroke}/>
  <path d="M-30 -34 Q-20 -60 0 -62 Q-16 -40 -8 -6 M30 -34 Q20 -60 0 -62 Q16 -40 8 -6" fill="#c5e1a5" ${st(3)}/>
  <path d="M0 -62 V-8" stroke="#7cb342" stroke-width="3"/>
</g>`;
