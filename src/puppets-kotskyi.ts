// The puppets of «Пан Коцький»: the cat (head part for munching, a tail that swishes), the oak the
// bear climbs, the log the wolf hides behind, a tablecloth on the grass and the presents.
// Same conventions as characters.ts.

import { INK, closedEyes, mouth, st, stroke } from './characters';

export const kit = () => `
<g data-part="body">
  <!-- tail, curling up behind (swishes) -->
  <g data-part="tail" data-cx="34" data-cy="-40">
    <path d="M30 -30 Q96 -30 92 -96 Q90 -130 66 -138" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/>
    <path d="M30 -30 Q96 -30 92 -96 Q90 -130 66 -138" fill="none" stroke="#9e9e9e" stroke-width="17" stroke-linecap="round"/>
    <path d="M86 -70 l12 4 M90 -96 l12 -2 M80 -122 l10 -8" stroke="#616161" stroke-width="6" stroke-linecap="round"/>
  </g>
  <!-- legs and body -->
  <ellipse cx="-24" cy="-8" rx="20" ry="10" fill="#bdbdbd" ${st(4)}/>
  <ellipse cx="24" cy="-8" rx="20" ry="10" fill="#bdbdbd" ${st(4)}/>
  <path d="M-46 -12 Q-58 -90 -24 -126 Q0 -140 24 -126 Q58 -90 46 -12 Q0 4 -46 -12 Z" fill="#9e9e9e" ${stroke}/>
  <path d="M-22 -110 Q-30 -60 -14 -20 Q0 -12 14 -20 Q30 -60 22 -110 Q0 -120 -22 -110 Z" fill="#eeeeee"/>
  <path d="M-40 -80 l14 4 M-44 -56 l14 2 M40 -80 l-14 4 M44 -56 l-14 2" stroke="#616161" stroke-width="6" stroke-linecap="round"/>
  <!-- front paws -->
  <ellipse cx="-16" cy="-14" rx="12" ry="9" fill="#eeeeee" ${st(3)}/>
  <ellipse cx="12" cy="-14" rx="12" ry="9" fill="#eeeeee" ${st(3)}/>
  <!-- head (tips down to eat) -->
  <g data-part="head" data-cx="0" data-cy="-130">
    <path d="M-50 -170 L-48 -232 L-14 -196 Z" fill="#9e9e9e" ${stroke}/>
    <path d="M-44 -184 L-43 -216 L-24 -196 Z" fill="#f4b8b0"/>
    <path d="M18 -196 L48 -232 L50 -170 Z" fill="#9e9e9e" ${stroke}/>
    <path d="M24 -196 L42 -216 L44 -184 Z" fill="#f4b8b0"/>
    <ellipse cx="0" cy="-166" rx="56" ry="46" fill="#9e9e9e" ${stroke}/>
    <path d="M-12 -210 l6 18 M0 -212 v20 M12 -210 l-6 18" stroke="#616161" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="-12" cy="-146" rx="26" ry="18" fill="#eeeeee"/>
    <ellipse cx="12" cy="-146" rx="26" ry="18" fill="#eeeeee"/>
    <!-- big green eyes ("like embers", says the fox) -->
    <g data-part="eyes" data-cx="0" data-cy="-172">
      <ellipse cx="-22" cy="-172" rx="13" ry="14" fill="#c6e86b" ${st(3)}/>
      <ellipse cx="-24" cy="-172" rx="4" ry="10" fill="#2b1a10"/><circle cx="-19" cy="-178" r="3" fill="#fff"/>
      <ellipse cx="22" cy="-172" rx="13" ry="14" fill="#c6e86b" ${st(3)}/>
      <ellipse cx="20" cy="-172" rx="4" ry="10" fill="#2b1a10"/><circle cx="25" cy="-178" r="3" fill="#fff"/>
    </g>
    ${closedEyes(0, -170, 44, 8)}
    <path d="M-6 -156 h12 l-6 8 z" fill="#f06292" ${st(2)}/>
    <!-- whiskers -->
    <path d="M-24 -146 l-46 -8 M-24 -140 l-46 4 M-22 -134 l-40 14 M24 -146 l46 -8 M24 -140 l46 4 M22 -134 l40 14" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    ${mouth(
      `<path d="M-12 -142 q6 8 12 0 q6 8 12 0" fill="none" ${st(3)}/>`,
      `<path d="M-12 -144 q12 26 24 0 z" fill="#8a2a1a" ${st(3)}/><path d="M-8 -142 l3 6 l3 -6 M2 -142 l3 6 l3 -6" fill="#fff"/>`,
    )}
  </g>
</g>`;

/** a big oak: the bear climbs onto the left branch, the cat jumps onto the right one */
export const dub = () => {
  let crown = '';
  const spots: [number, number, number][] = [[0, -520, 150], [-150, -450, 110], [150, -460, 115], [-80, -600, 100], [90, -610, 105], [0, -400, 120]];
  for (const [x, y, r] of spots) crown += `<circle cx="${x}" cy="${y}" r="${r}" fill="#3f7f3a"/>`;
  crown += `<circle cx="-40" cy="-560" r="70" fill="#4f9446"/><circle cx="70" cy="-500" r="60" fill="#4f9446"/>`;
  return `
<g data-part="body">
  ${crown}
  <path d="M-40 0 Q-30 -200 -24 -420 L24 -420 Q30 -200 40 0 Z" fill="#6d4426" stroke="#4e2f18" stroke-width="5"/>
  <path d="M-26 -290 Q-120 -300 -230 -290 L-232 -270 Q-120 -278 -24 -262 Z" fill="#6d4426" stroke="#4e2f18" stroke-width="5"/>
  <path d="M26 -300 Q100 -310 190 -300 L192 -282 Q100 -290 24 -276 Z" fill="#6d4426" stroke="#4e2f18" stroke-width="5"/>
  <path d="M-8 -60 q10 -30 0 -60 M10 -180 q-8 -24 4 -50" stroke="#4e2f18" stroke-width="4" fill="none"/>
  <circle cx="-150" cy="-300" r="12" fill="#8d6e3f"/><path d="M-150 -310 q0 -10 8 -12" stroke="#5d4037" stroke-width="3"/>
</g>`;
};

export const koloda = () => `
<g data-part="body">
  <rect x="-170" y="-110" width="340" height="104" rx="50" fill="#8b5a2b" stroke="#5a3a22" stroke-width="6"/>
  <ellipse cx="170" cy="-58" rx="30" ry="52" fill="#c8a06e" stroke="#5a3a22" stroke-width="6"/>
  <ellipse cx="170" cy="-58" rx="16" ry="30" fill="none" stroke="#8b5a2b" stroke-width="4"/>
  <path d="M-130 -80 h90 M-100 -40 h120 M20 -90 h80" stroke="#6d4426" stroke-width="5" stroke-linecap="round"/>
  <path d="M-60 -110 q-10 -30 10 -40 q10 20 0 40" fill="#66bb6a"/>
</g>`;

export const skatertyna = () => {
  let band = '';
  for (let i = 0; i < 22; i++) band += `<path d="M${-220 + i * 20 + 10} -22 l7 7 -7 7 -7 -7z" fill="${i % 2 ? '#1f1a17' : '#c62828'}"/>`;
  return `
<g data-part="body">
  <path d="M-240 0 L-200 -40 L200 -40 L240 0 Z" fill="#fffaf0" stroke="#d9cdb4" stroke-width="4"/>
  ${band}
</g>`;
};

export const ryba = () => `
<g data-part="body">
  <path d="M-46 -24 Q-10 -56 30 -24 Q-10 8 -46 -24 Z" fill="#90a4ae" ${st(4)}/>
  <path d="M28 -24 L54 -44 L50 -24 L54 -4 Z" fill="#78909c" ${st(4)}/>
  <circle cx="-30" cy="-28" r="4" fill="#2b1a10"/>
  <path d="M-12 -38 q6 14 0 28 M2 -36 q6 12 0 24" stroke="#607d8b" stroke-width="3" fill="none"/>
</g>`;

export const med = () => `
<g data-part="body">
  <path d="M-36 0 Q-46 -40 -34 -76 L34 -76 Q46 -40 36 0 Z" fill="#a1704a" ${stroke}/>
  <path d="M-42 -20 h84 M-44 -56 h88" stroke="#6d4426" stroke-width="6"/>
  <ellipse cx="0" cy="-78" rx="36" ry="10" fill="#ffb300" ${st(4)}/>
  <path d="M-14 -80 q4 18 0 30 q8 -2 6 -12" fill="#ffb300" ${st(2)}/>
  <text x="0" y="-32" font-size="22" font-weight="900" text-anchor="middle" fill="#ffe082">МЕД</text>
</g>`;

export const malyna = () => {
  let berries = '';
  for (let i = 0; i < 9; i++) berries += `<circle cx="${-30 + (i % 5) * 15}" cy="${-62 - Math.floor(i / 5) * 12}" r="10" fill="#d81b60" stroke="#880e4f" stroke-width="2"/>`;
  return `
<g data-part="body">
  <path d="M-46 -54 L-36 0 L36 0 L46 -54 Z" fill="#c8a06e" ${stroke}/>
  <path d="M-42 -36 h84 M-40 -18 h80" stroke="#8b5a2b" stroke-width="4"/>
  ${berries}
  <path d="M-44 -56 Q0 -120 44 -56" fill="none" stroke="#8b5a2b" stroke-width="7"/>
</g>`;
};

export const koshyk = () => `
<g data-part="body">
  <path d="M-46 -50 L-36 0 L36 0 L46 -50 Z" fill="#c8a06e" ${stroke}/>
  <path d="M-42 -34 h84 M-40 -16 h80" stroke="#8b5a2b" stroke-width="4"/>
  <circle cx="-22" cy="-58" r="16" fill="#e53935" ${st(3)}/><circle cx="6" cy="-62" r="17" fill="#c62828" ${st(3)}/><circle cx="30" cy="-56" r="15" fill="#fbc02d" ${st(3)}/>
  <path d="M6 -78 q2 -8 8 -10" stroke="#5d4037" stroke-width="3" fill="none"/>
</g>`;
