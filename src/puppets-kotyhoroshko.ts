// The puppets of «Котигорошко»: the hero (a strong lad in a shirt with green peas), his six brothers
// (one group), a pea, a big stone, a lump of iron, the ground in front (to drive someone into the
// iron field) and ropes (tied to the oak). Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stroke } from './characters';

export const kotyhoroshko = () => {
  let peas = '';
  const spots: [number, number][] = [[-40, -230], [10, -250], [44, -210], [-30, -170], [26, -160], [-6, -200], [40, -140], [-44, -130]];
  for (const [x, y] of spots) peas += `<circle cx="${x}" cy="${y}" r="7" fill="#7cb342" stroke="#33691e" stroke-width="2"/>`;
  return `
<g data-part="body">
  <path d="M-40 -110 L-44 -12 L-10 -12 L-8 -110 Z" fill="#2e5e3e" ${st(4)}/>
  <path d="M8 -110 L10 -12 L44 -12 L40 -110 Z" fill="#2e5e3e" ${st(4)}/>
  <path d="M-54 0 q2 -18 14 -18 h32 v18 z M54 0 q-2 -18 -14 -18 h-32 v18 z" fill="#b71c1c" ${st(4)}/>
  <g data-dress="legs"></g>
  <path d="M-72 -270 Q-90 -190 -80 -104 L80 -104 Q90 -190 72 -270 Q0 -290 -72 -270 Z" fill="#fbf7ee" ${stroke}/>
  ${peas}
  <rect x="-82" y="-124" width="164" height="16" rx="6" fill="#2e7d32" ${st(4)}/>
  <path d="M-70 -264 Q-112 -214 -104 -150" fill="none" stroke="${INK}" stroke-width="42" stroke-linecap="round"/>
  <path d="M-70 -264 Q-112 -214 -104 -150" fill="none" stroke="#fbf7ee" stroke-width="31" stroke-linecap="round"/>
  <path d="M70 -264 Q112 -214 104 -150" fill="none" stroke="${INK}" stroke-width="42" stroke-linecap="round"/>
  <path d="M70 -264 Q112 -214 104 -150" fill="none" stroke="#fbf7ee" stroke-width="31" stroke-linecap="round"/>
  <g data-dress="torso"></g>
  <circle cx="-104" cy="-138" r="17" fill="#f2c4a0" ${st(4)}/><circle cx="104" cy="-138" r="17" fill="#f2c4a0" ${st(4)}/>
  <ellipse cx="0" cy="-322" rx="46" ry="48" fill="#f2c4a0" ${stroke}/>
  <path d="M-46 -330 Q-48 -380 0 -382 Q48 -380 46 -330 Q34 -352 16 -346 Q2 -360 -14 -346 Q-32 -356 -46 -330 Z" fill="#a1662f" ${st(4)}/>
  ${eyes(0, -326, 32, 6)}
  ${closedEyes(0, -326, 32, 6)}
  <ellipse cx="-24" cy="-306" rx="9" ry="5" fill="#f0786a" opacity=".6"/><ellipse cx="24" cy="-306" rx="9" ry="5" fill="#f0786a" opacity=".6"/>
  <ellipse cx="0" cy="-308" rx="8" ry="7" fill="#e8a383"/>
  ${mouth(`<path d="M-14 -294 q14 10 28 0" fill="none" ${st(4)}/>`, `<path d="M-14 -296 q14 20 28 0 z" fill="#7a2a1a" ${st(3)}/>`)}
</g>`;
};

/** the six brothers, in two rows */
export const braty = () => {
  const lad = (x: number, y: number, hair: string, shirt: string) => `
    <g transform="translate(${x} ${y})">
      <path d="M-34 -100 Q-44 -60 -38 -10 L38 -10 Q44 -60 34 -100 Q0 -112 -34 -100 Z" fill="${shirt}" ${st(4)}/>
      <ellipse cx="0" cy="-134" rx="28" ry="30" fill="#f2c4a0" ${st(4)}/>
      <path d="M-28 -140 Q-28 -170 0 -170 Q28 -170 28 -140 Q16 -154 0 -150 Q-16 -154 -28 -140 Z" fill="${hair}" ${st(3)}/>
      ${eyes(0, -136, 20, 4)}
      <path d="M-14 -152 l10 4 M14 -152 l-10 4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M-8 -118 q8 -4 16 0" fill="none" ${st(3)}/>
    </g>`;
  return `<g data-part="body">
    ${lad(-150, -40, '#5d4037', '#cfd8dc')}${lad(-50, -40, '#a1662f', '#fbf7ee')}${lad(50, -40, '#3e2723', '#e8dcc8')}${lad(150, -40, '#6d4c41', '#fbf7ee')}
    ${lad(-100, 0, '#4e342e', '#fbf7ee')}${lad(100, 0, '#8d6e63', '#cfd8dc')}
    <g data-part="eyes" data-cx="0" data-cy="-136"></g></g>`;
};

export const horoshyna = () => `
<g data-part="body">
  <circle cx="0" cy="-18" r="18" fill="#7cb342" ${st(4)}/>
  <circle cx="-6" cy="-24" r="5" fill="#c5e1a5"/>
</g>`;

export const kamin = () => `
<g data-part="body">
  <path d="M-110 0 Q-130 -90 -60 -130 Q20 -160 90 -110 Q140 -60 110 0 Z" fill="#9e9a92" ${stroke}/>
  <path d="M-60 -90 q30 -20 60 -6 M20 -60 q30 -10 50 10" stroke="#7a766e" stroke-width="5" fill="none"/>
</g>`;

export const zalizo = () => `
<g data-part="body">
  <path d="M-70 0 L-80 -50 L-30 -80 L50 -70 L80 -30 L60 0 Z" fill="#546e7a" ${stroke}/>
  <path d="M-40 -50 l40 -10 M10 -30 l40 6" stroke="#90a4ae" stroke-width="5"/>
</g>`;

/** the iron field in front: whoever stands here can be driven into it */
export const zemlia = () => `
<g data-part="body">
  <rect x="-2400" y="0" width="4800" height="2000" fill="#6b6f76"/>
  <path d="M-2400 0 H2400" stroke="#4e5157" stroke-width="10"/>
  ${Array.from({ length: 30 }, (_, i) => `<path d="M${-1500 + i * 110} ${30 + (i % 4) * 30} l40 -6 l30 10" stroke="#55595f" stroke-width="5" fill="none"/>`).join('')}
</g>`;

/** ropes of twisted vines, round someone tied to the oak */
export const motuzky = () => `
<g data-part="body">
  ${[-90, -150, -210, -270].map((y) => `<path d="M-90 ${y} Q0 ${y + 26} 90 ${y}" stroke="#6d8f3a" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-90 ${y} Q0 ${y + 26} 90 ${y}" stroke="#9ccc65" stroke-width="4" fill="none" stroke-dasharray="10 8"/>`).join('')}
</g>`;
