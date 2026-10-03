// The puppets of «Котигорошко. Частина 2»: the three mighty companions (Vernyhora, Vernydub,
// Krutyvus), the tiny old man with the endless beard (Muzhychok-z-nihtyk), the griffin, its nest of
// chicks, the bottomless pit, a sack of gold, a barrel. Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stroke } from './characters';

/** a broad strong man; the colours and the face details make each companion */
function bohatyr(shirt: string, hair: string, extra: string) {
  return `
<g data-part="body">
  <path d="M-46 -130 L-50 -12 L-12 -12 L-10 -130 Z" fill="#3e4a59" ${st(4)}/>
  <path d="M10 -130 L12 -12 L50 -12 L46 -130 Z" fill="#3e4a59" ${st(4)}/>
  <path d="M-60 0 q2 -18 14 -18 h34 v18 z M60 0 q-2 -18 -14 -18 h-34 v18 z" fill="#3b2416" ${st(4)}/>
  <path d="M-84 -290 Q-104 -200 -92 -120 L92 -120 Q104 -200 84 -290 Q0 -314 -84 -290 Z" fill="${shirt}" ${stroke}/>
  <rect x="-94" y="-150" width="188" height="18" rx="6" fill="#5d4037" ${st(4)}/>
  <path d="M-82 -282 Q-126 -230 -116 -160" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/>
  <path d="M-82 -282 Q-126 -230 -116 -160" fill="none" stroke="${shirt}" stroke-width="35" stroke-linecap="round"/>
  <path d="M82 -282 Q126 -230 116 -160" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/>
  <path d="M82 -282 Q126 -230 116 -160" fill="none" stroke="${shirt}" stroke-width="35" stroke-linecap="round"/>
  <circle cx="-116" cy="-148" r="19" fill="#e0b090" ${st(4)}/><circle cx="116" cy="-148" r="19" fill="#e0b090" ${st(4)}/>
  <ellipse cx="0" cy="-344" rx="50" ry="52" fill="#e0b090" ${stroke}/>
  <path d="M-50 -350 Q-50 -404 0 -404 Q50 -404 50 -350 Q40 -378 0 -380 Q-40 -378 -50 -350 Z" fill="${hair}" ${st(4)}/>
  ${eyes(0, -354, 34, 6)}
  ${closedEyes(0, -354, 34, 6)}
  <ellipse cx="0" cy="-334" rx="9" ry="8" fill="#d48c6a"/>
  ${mouth(`<path d="M-14 -314 q14 8 28 0" fill="none" ${st(4)}/>`, '<ellipse cx="0" cy="-312" rx="11" ry="8" fill="#7a2a1a"/>')}
  ${extra}
</g>`;
}

/** Vernyhora: grey stone-coloured shirt, a pebble in hand */
export const vernyhora = () => bohatyr('#90a4ae', '#5d4037', `<circle cx="120" cy="-170" r="20" fill="#9e9a92" ${st(3)}/>`);

/** Vernydub: green shirt, a little oak sapling stuck in his belt */
export const vernydub = () =>
  bohatyr('#66bb6a', '#3e2723', `<path d="M60 -150 v-80" stroke="#6d4426" stroke-width="7"/><circle cx="60" cy="-246" r="22" fill="#43a047"/><circle cx="46" cy="-232" r="14" fill="#2e7d32"/>`);

/** Krutyvus: blue shirt and a mustache so long it can turn a river */
export const krutyvus = () =>
  bohatyr(
    '#64b5f6',
    '#212121',
    `<path d="M-6 -324 Q-80 -330 -150 -380 Q-160 -400 -140 -404 Q-120 -360 -6 -316 Z M6 -324 Q80 -330 150 -380 Q160 -400 140 -404 Q120 -360 6 -316 Z" fill="#212121" ${st(3)}/>`,
  );

/** Muzhychok-z-nihtyk: knee-high, with a beard many times longer than himself */
export const muzhychok = () => `
<g data-part="body">
  <path d="M-16 -40 L-18 -6 L-4 -6 L-4 -40 Z M4 -40 L4 -6 L18 -6 L16 -40 Z" fill="#5d4037" ${st(3)}/>
  <path d="M-26 -96 Q-32 -70 -28 -36 L28 -36 Q32 -70 26 -96 Q0 -104 -26 -96 Z" fill="#8d6e63" ${st(4)}/>
  <ellipse cx="0" cy="-118" rx="22" ry="22" fill="#e0b090" ${st(4)}/>
  <path d="M-24 -126 Q-24 -160 0 -164 Q24 -160 24 -126 Z" fill="#c62828" ${st(3)}/>
  <!-- the endless beard trailing behind him -->
  <path d="M-18 -110 Q-20 -80 0 -70 Q60 -60 120 -30 Q200 0 300 -10 L300 4 Q200 14 110 -16 Q40 -50 0 -56 Q-24 -70 -18 -110 Z" fill="#eceff1" ${st(3)}/>
  ${eyes(0, -122, 14, 3)}
  ${closedEyes(0, -122, 14, 3)}
  <path d="M-10 -132 l8 2 M10 -132 l-8 2" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  ${mouth('', '<ellipse cx="0" cy="-104" rx="5" ry="4" fill="#7a2a1a"/>')}
</g>`;

/** the griffin: a huge bird, lion-coloured, with a hooked beak (flies) */
export const hryfon = () => `
<g data-part="body">
  <g data-part="ears" data-cx="20" data-cy="-150">
    <path d="M20 -150 Q120 -330 300 -300 Q230 -250 250 -200 Q180 -200 170 -150 Q110 -160 90 -110 Z" fill="#c8a06e" ${stroke}/>
    <path d="M60 -170 Q150 -280 260 -290 M90 -150 Q170 -230 220 -220" stroke="#8b5a2b" stroke-width="5" fill="none"/>
  </g>
  <ellipse cx="20" cy="-110" rx="130" ry="60" fill="#d4a656" ${stroke}/>
  <path d="M140 -120 Q220 -100 240 -50 Q200 -80 140 -90 Z" fill="#b5893f" ${stroke}/>
  <path d="M-30 -60 v50 M40 -60 v50" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
  <path d="M-90 -140 Q-130 -190 -130 -230" fill="none" stroke="${INK}" stroke-width="56" stroke-linecap="round"/>
  <path d="M-90 -140 Q-130 -190 -130 -230" fill="none" stroke="#f4efe6" stroke-width="44" stroke-linecap="round"/>
  <circle cx="-136" cy="-252" r="40" fill="#f4efe6" ${stroke}/>
  <path d="M-172 -260 Q-214 -250 -206 -222 Q-196 -236 -170 -238 Z" fill="#ffb300" ${st(4)}/>
  <g data-part="eyes" data-cx="-140" data-cy="-262"><circle cx="-140" cy="-262" r="9" fill="#ffca28" ${st(3)}/><circle cx="-142" cy="-262" r="4" fill="#2b1a10"/></g>
  ${closedEyes(-140, -262, 0, 8)}
  ${mouth('', `<path d="M-172 -240 l-26 6 l24 6 z" fill="#8a2a1a" ${st(2)}/>`)}
</g>`;

/** the griffin's nest with three chicks squeaking */
export const hnizdo = () => `
<g data-part="body">
  <path d="M-110 0 Q-120 -50 -80 -60 L80 -60 Q120 -50 110 0 Z" fill="#8b5a2b" ${stroke}/>
  <path d="M-100 -30 q40 10 90 -4 q40 -10 100 6" stroke="#6d4426" stroke-width="5" fill="none"/>
  ${[-50, 0, 50].map((x) => `<circle cx="${x}" cy="-76" r="24" fill="#fff59d" ${st(3)}/><circle cx="${x - 8}" cy="-82" r="3" fill="#2b1a10"/><path d="M${x - 22} -78 l-12 4 l12 4 z" fill="#ffb300"/>`).join('')}
</g>`;

/** the bottomless pit */
export const yama = () => `
<g data-part="body">
  <ellipse cx="0" cy="-10" rx="170" ry="40" fill="#1d1b1a" stroke="#5d4037" stroke-width="10"/>
  <ellipse cx="0" cy="-4" rx="130" ry="24" fill="#000"/>
</g>`;

export const skarb = () => `
<g data-part="body">
  <path d="M-46 0 Q-60 -64 -26 -96 L26 -96 Q60 -64 46 0 Z" fill="#a1704a" ${stroke}/>
  <path d="M-30 -94 Q0 -84 30 -94" stroke="#5a3a22" stroke-width="6" fill="none"/>
  <circle cx="-14" cy="-104" r="9" fill="#f5c542" ${st(2)}/><circle cx="6" cy="-108" r="9" fill="#f5c542" ${st(2)}/><circle cx="22" cy="-102" r="8" fill="#e53935" ${st(2)}/>
</g>`;

export const bochka = () => `
<g data-part="body">
  <path d="M-46 0 Q-60 -60 -46 -120 L46 -120 Q60 -60 46 0 Z" fill="#a1704a" ${stroke}/>
  <path d="M-52 -30 h104 M-56 -60 h112 M-52 -90 h104" stroke="#5d4037" stroke-width="6"/>
</g>`;
