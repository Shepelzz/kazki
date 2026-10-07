// The puppets of «Кирило Кожум'яка»: Kyrylo the tanner (and wrapped in hemp and tar for the fight),
// the dragon, the dove with the princess's letter, the prince, the princess, the children, a stack of
// hides, the club. Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stitch, stroke } from './characters';

/** a big, strong tanner in a leather apron */
export const kyrylo = (wrapped = false) => {
  const shirt = wrapped ? '#8d7a4e' : '#fbf7ee';
  const wrap = wrapped
    ? Array.from({ length: 12 }, (_, i) => `<path d="M-80 ${-60 - i * 22} Q0 ${-46 - i * 22} 80 ${-60 - i * 22}" stroke="${i % 3 ? '#c9b07a' : '#2b2420'}" stroke-width="${i % 3 ? 7 : 10}" fill="none"/>`).join('')
    : '';
  return `
<g data-part="body">
  <path d="M-46 -130 L-50 -12 L-12 -12 L-10 -130 Z" fill="#3e4a59" ${st(4)}/>
  <path d="M10 -130 L12 -12 L50 -12 L46 -130 Z" fill="#3e4a59" ${st(4)}/>
  <path d="M-60 0 q2 -18 14 -18 h34 v18 z M60 0 q-2 -18 -14 -18 h-34 v18 z" fill="#3b2416" ${st(4)}/>
  <g data-dress="legs"></g>
  <path d="M-84 -290 Q-104 -200 -92 -120 L92 -120 Q104 -200 84 -290 Q0 -314 -84 -290 Z" fill="${shirt}" ${stroke}/>
  ${wrapped ? '' : stitch(-7, -288, 14, 70, true)}
  ${wrapped ? '' : '<path d="M-56 -252 L-66 -70 L66 -70 L56 -252 Z" fill="#8b5a2b" stroke="#5a3a22" stroke-width="4"/>'}
  ${wrap}
  <rect x="-94" y="-150" width="188" height="18" rx="6" fill="#b71c1c" ${st(4)}/>
  <path d="M-82 -282 Q-126 -230 -116 -160" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/>
  <path d="M-82 -282 Q-126 -230 -116 -160" fill="none" stroke="${shirt}" stroke-width="35" stroke-linecap="round"/>
  <path d="M82 -282 Q126 -230 116 -160" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/>
  <path d="M82 -282 Q126 -230 116 -160" fill="none" stroke="${shirt}" stroke-width="35" stroke-linecap="round"/>
  <circle cx="-116" cy="-148" r="19" fill="#e0b090" ${st(4)}/><circle cx="116" cy="-148" r="19" fill="#e0b090" ${st(4)}/>
  <g data-dress="torso"></g>
  <ellipse cx="0" cy="-344" rx="50" ry="52" fill="#e0b090" ${stroke}/>
  <path d="M-50 -350 Q-50 -404 0 -404 Q50 -404 50 -350 Q40 -378 0 -380 Q-40 -378 -50 -350 Z" fill="#4e342e" ${st(4)}/>
  <path d="M-30 -312 Q-40 -280 0 -276 Q40 -280 30 -312 Q16 -298 0 -300 Q-16 -298 -30 -312 Z" fill="#4e342e" ${st(4)}/>
  <path d="M-36 -322 Q-18 -334 0 -322 Q18 -334 36 -322 Q18 -312 0 -318 Q-18 -312 -36 -322 Z" fill="#4e342e"/>
  ${eyes(0, -354, 34, 6)}
  ${closedEyes(0, -354, 34, 6)}
  <path d="M-30 -370 l18 4 M30 -370 l-18 4" stroke="#4e342e" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="0" cy="-334" rx="9" ry="8" fill="#d48c6a"/>
  ${mouth('', '<ellipse cx="0" cy="-306" rx="11" ry="8" fill="#7a2a1a"/>')}
  ${wrapped ? '<path d="M-56 -396 Q0 -430 56 -396 Q40 -410 0 -412 Q-40 -410 -56 -396 Z" fill="#c9b07a"/>' : ''}
</g>`;
};
export const kyrylo_konopli = () => kyrylo(true);

/** the dragon: green, winged, a long neck, smoke from the nostrils */
export const zmiy = () => `
<g data-part="body">
  <!-- tail -->
  <g transform="translate(-10 -36)">
  <path d="M120 -60 Q260 -40 280 -140 Q290 -180 320 -170 Q300 -120 300 -90 Q280 -10 140 -20 Z" fill="#43a047" ${stroke}/>
  <path d="M310 -176 l26 -10 l-6 24 z" fill="#c62828" ${st(3)}/>
  </g>
  <!-- wings -->
  <g data-part="ears" data-cx="40" data-cy="-220">
    <path d="M40 -220 Q120 -420 260 -400 Q200 -340 230 -300 Q170 -300 170 -250 Q110 -260 100 -200 Z" fill="#66bb6a" ${stroke}/>
    <path d="M60 -230 Q130 -360 230 -380 M90 -220 Q150 -320 200 -300 M110 -210 Q150 -260 160 -250" stroke="#2e7d32" stroke-width="4" fill="none"/>
  </g>
  <!-- legs and body -->
  <rect x="-60" y="-90" width="40" height="90" rx="12" fill="#388e3c" ${st(4)}/>
  <rect x="60" y="-90" width="40" height="90" rx="12" fill="#388e3c" ${st(4)}/>
  <path d="M-66 0 h50 M54 0 h50" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="30" cy="-140" rx="140" ry="86" fill="#4caf50" ${stroke}/>
  <path d="M-60 -110 Q30 -60 120 -110" fill="none" stroke="#c5e1a5" stroke-width="30" stroke-linecap="round"/>
  <path d="M-40 -220 l20 -24 l16 22 l20 -26 l16 24 l20 -24 l16 24" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <g data-dress="legs"></g>
  <g data-dress="torso"></g>
  <!-- neck and head to the left -->
  <path d="M-80 -170 Q-150 -240 -150 -330" fill="none" stroke="${INK}" stroke-width="64" stroke-linecap="round"/>
  <path d="M-80 -170 Q-150 -240 -150 -330" fill="none" stroke="#4caf50" stroke-width="52" stroke-linecap="round"/>
  <path d="M-110 -350 Q-140 -410 -200 -400 Q-260 -390 -270 -350 Q-270 -310 -230 -300 Q-160 -290 -110 -310 Z" fill="#4caf50" ${stroke}/>
  <path d="M-158 -398 l-10 -40 l26 26 z M-198 -402 l-16 -40 l30 28 z" fill="#ffca28" ${st(4)}/>
  <circle cx="-262" cy="-352" r="6" fill="#2b1a10"/>
  <g data-part="eyes" data-cx="-190" data-cy="-370">
    <ellipse cx="-190" cy="-370" rx="16" ry="14" fill="#fff59d" ${st(3)}/><ellipse cx="-192" cy="-370" rx="4" ry="11" fill="#2b1a10"/>
  </g>
  ${closedEyes(-190, -370, 0, 10)}
  <path d="M-206 -390 l34 8" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
  ${mouth(
    `<path d="M-270 -320 Q-220 -306 -170 -318" fill="none" ${st(4)}/><path d="M-246 -318 l4 12 l4 -12 M-216 -314 l4 12 l4 -12" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
    `<path d="M-272 -324 Q-220 -270 -166 -320 Q-220 -306 -272 -324 Z" fill="#8a2a1a" ${st(3)}/><path d="M-250 -320 l4 12 l4 -12 M-214 -314 l4 12 l4 -12" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
  )}
</g>`;

/** a white dove carrying a rolled letter */
export const holub = () => `
<g data-part="body">
  <ellipse cx="0" cy="-40" rx="40" ry="22" fill="#fafafa" ${st(4)}/>
  <circle cx="-38" cy="-54" r="15" fill="#fafafa" ${st(4)}/>
  <path d="M-52 -54 l-12 4 l12 4 z" fill="#ffb300" ${st(2)}/>
  <circle cx="-40" cy="-58" r="3" fill="#2b1a10"/>
  <g data-part="ears" data-cx="0" data-cy="-50"><path d="M-6 -50 Q20 -110 60 -96 Q36 -60 26 -38 Z" fill="#eceff1" ${st(3)}/></g>
  <path d="M36 -40 l26 -10 l-4 22 z" fill="#eceff1" ${st(3)}/>
  <rect x="-14" y="-26" width="34" height="14" rx="7" fill="#fff3d6" stroke="#b71c1c" stroke-width="3"/>
</g>`;

/** the prince: a fur-trimmed crimson coat and a cap */
export const knyaz = () => `
<g data-part="body">
  <path d="M-40 -110 L-42 -12 L-8 -12 L-6 -110 Z" fill="#283593" ${st(4)}/>
  <path d="M6 -110 L8 -12 L42 -12 L40 -110 Z" fill="#283593" ${st(4)}/>
  <path d="M-54 0 q2 -18 14 -18 h30 v18 z M54 0 q-2 -18 -14 -18 h-30 v18 z" fill="#b71c1c" ${st(4)}/>
  <g data-dress="legs"></g>
  <path d="M-70 -262 Q-92 -170 -84 -60 L84 -60 Q92 -170 70 -262 Q0 -282 -70 -262 Z" fill="#b71c1c" ${stroke}/>
  <path d="M-84 -70 H84 M0 -262 V-64" stroke="#f5c542" stroke-width="10"/>
  <path d="M-70 -262 Q0 -232 70 -262 Q56 -236 0 -228 Q-56 -236 -70 -262 Z" fill="#f4efe6" ${st(4)}/>
  <path d="M-66 -256 Q-104 -210 -96 -150" fill="none" stroke="${INK}" stroke-width="36" stroke-linecap="round"/>
  <path d="M-66 -256 Q-104 -210 -96 -150" fill="none" stroke="#b71c1c" stroke-width="26" stroke-linecap="round"/>
  <path d="M66 -256 Q104 -210 96 -150" fill="none" stroke="${INK}" stroke-width="36" stroke-linecap="round"/>
  <path d="M66 -256 Q104 -210 96 -150" fill="none" stroke="#b71c1c" stroke-width="26" stroke-linecap="round"/>
  <circle cx="-96" cy="-140" r="15" fill="#f2c4a0" ${st(4)}/><circle cx="96" cy="-140" r="15" fill="#f2c4a0" ${st(4)}/>
  <g data-dress="torso"></g>
  <ellipse cx="0" cy="-310" rx="44" ry="48" fill="#f2c4a0" ${stroke}/>
  <g data-part="beard"><path d="M-42 -300 Q-50 -232 0 -212 Q50 -232 42 -300 Q30 -272 0 -272 Q-30 -272 -42 -300 Z" fill="#9e9e9e" ${stroke}/></g>
  ${mouth('', '<ellipse cx="0" cy="-266" rx="10" ry="8" fill="#7a2a1a"/>')}
  <g data-part="beard"><path d="M-30 -276 Q-14 -290 0 -278 Q14 -290 30 -276 Q16 -266 0 -272 Q-16 -266 -30 -276 Z" fill="#bdbdbd" ${st(3)}/></g>
  ${eyes(0, -318, 32, 6)}
  ${closedEyes(0, -318, 32, 6)}
  <ellipse cx="0" cy="-294" rx="9" ry="8" fill="#e8a383"/>
<g data-part="hat">
  <path d="M-46 -346 Q-46 -396 0 -398 Q46 -396 46 -346 Z" fill="#b71c1c" ${stroke}/>
  <rect x="-52" y="-356" width="104" height="22" rx="11" fill="#f4efe6" ${st(4)}/>
  <circle cx="0" cy="-376" r="8" fill="#f5c542" ${st(2)}/>
  </g>
</g>`;

/** two small children holding hands */
export const dity = () => {
  const kid = (x: number, hair: string, shirt: string) => `
    <g transform="translate(${x} 0)">
      <path d="M-16 -50 L-18 -6 L-2 -6 L-2 -50 Z M2 -50 L2 -6 L18 -6 L16 -50 Z" fill="#fbf7ee" ${st(3)}/>
      <path d="M-28 -110 Q-36 -80 -30 -46 L30 -46 Q36 -80 28 -110 Q0 -120 -28 -110 Z" fill="${shirt}" ${st(4)}/>
      <ellipse cx="0" cy="-140" rx="26" ry="28" fill="#f2c4a0" ${st(4)}/>
      <path d="M-26 -146 Q-26 -172 0 -172 Q26 -172 26 -146 Q14 -158 0 -154 Q-14 -158 -26 -146 Z" fill="${hair}" ${st(3)}/>
      ${eyes(0, -142, 18, 4)}
      <path d="M-8 -126 q8 6 16 0" fill="none" ${st(2)}/>
      <path d="M-10 -132 q-4 10 -2 16 M10 -132 q4 10 2 16" stroke="#4fc3f7" stroke-width="4" fill="none" opacity=".8"/>
    </g>`;
  return `<g data-part="body">${kid(-36, '#f2c94c', '#e57373')}${kid(36, '#6d4c41', '#81c784')}
    <path d="M-10 -80 Q0 -70 10 -80" stroke="#f2c4a0" stroke-width="10" stroke-linecap="round" fill="none"/>
    <g data-part="eyes" data-cx="0" data-cy="-142"></g></g>`;
};

/** a stack of hides drying (Kyrylo tears twelve of them in a fright) */
export const kozhi = () => {
  let s = '';
  for (let i = 0; i < 6; i++) s += `<path d="M-90 ${-12 - i * 16} Q-60 ${-26 - i * 16} 0 ${-20 - i * 16} Q60 ${-26 - i * 16} 90 ${-12 - i * 16} L86 ${-2 - i * 16} Q0 ${-8 - i * 16} -86 ${-2 - i * 16} Z" fill="${i % 2 ? '#a1704a' : '#8b5a2b'}" stroke="#5a3a22" stroke-width="3"/>`;
  return `<g data-part="body">${s}</g>`;
};

/** a big iron-bound club */
export const bulava = () => `
<g data-part="body">
  <path d="M0 0 L0 -220" stroke="#6d4426" stroke-width="14" stroke-linecap="round"/>
  <ellipse cx="0" cy="-240" rx="36" ry="46" fill="#5d4037" ${stroke}/>
  <path d="M-36 -250 h72 M-34 -220 h68" stroke="#90a4ae" stroke-width="7"/>
  <circle cx="-20" cy="-270" r="5" fill="#cfd8dc"/><circle cx="18" cy="-266" r="5" fill="#cfd8dc"/>
</g>`;
