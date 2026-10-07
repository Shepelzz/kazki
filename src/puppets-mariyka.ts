// The puppets of «Марійка і ведмідь»: Marijka in her sunny headscarf with a little basket, her two
// girlfriends (one puppet), the magpie, the bear's big birch-bark box with the pies on top (she hides
// in it: her eyes peek through a crack), a stump, mushrooms, wild strawberries, a pot of porridge and
// the bear's log hut. Same conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stitch, stroke } from './characters';

/** a pie: its bottom in the middle at x, y */
const pie = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0 Q-34 -34 0 -36 Q34 -34 30 0 Z" fill="#e2a24a" ${st(3)}/>` +
  `<path d="M-18 -6 q6 -8 0 -16 M0 -6 q6 -10 0 -22 M18 -6 q6 -8 0 -16" stroke="#b5762a" stroke-width="3" fill="none"/></g>`;

/** a little wicker basket, its bottom at x, y */
const basket = (x: number, y: number) => `
  <path d="M${x - 26} ${y - 34} Q${x} ${y - 82} ${x + 26} ${y - 34}" fill="none" stroke="#8b5a2b" stroke-width="6"/>
  <path d="M${x - 28} ${y - 36} L${x - 20} ${y} L${x + 20} ${y} L${x + 28} ${y - 36} Z" fill="#c8a06e" ${st(4)}/>
  <path d="M${x - 26} ${y - 24} h52 M${x - 24} ${y - 12} h48" stroke="#8b5a2b" stroke-width="3"/>
  <path d="M${x - 16} ${y - 36} q8 -16 16 0 z" fill="#8d5524" ${st(2.5)}/><path d="M${x - 14} ${y - 36} v6 M${x - 2} ${y - 36} v6" stroke="#fff6e6" stroke-width="4"/>
  <circle cx="${x + 12}" cy="${y - 40}" r="6" fill="#e53935" ${st(2)}/><circle cx="${x + 20}" cy="${y - 36}" r="5" fill="#e53935" ${st(2)}/>`;

/**
 * Marijka: a sunny yellow headscarf with red polka dots, knotted under her chin; two short chestnut
 * braids with red ribbons sticking out under it; freckles; a red sarafan over an embroidered blouse,
 * a short skirt (white stockings and red boots show), a little basket on her arm.
 */
export const mariyka = () => {
  let dots = '';
  for (const [x, y] of [[0, -290], [-20, -288], [20, -288], [-36, -280], [36, -280], [-47, -262], [47, -262]]) dots += `<circle cx="${x}" cy="${y}" r="4.5" fill="#e53935"/>`;
  return `
<g data-part="body">
  <!-- legs in white stockings, red boots -->
  <rect x="-28" y="-84" width="20" height="74" rx="8" fill="#fbf7ee" ${st(4)}/>
  <rect x="8" y="-84" width="20" height="74" rx="8" fill="#fbf7ee" ${st(4)}/>
  <path d="M-42 0 q0 -18 12 -22 h22 v22 z" fill="#d32f2f" ${st(4)}/>
  <path d="M42 0 q0 -18 -12 -22 h-22 v22 z" fill="#d32f2f" ${st(4)}/>
  <path d="M-30 -22 v-14 h22 v14 M30 -22 v-14 h-22 v14" fill="#d32f2f" ${st(4)}/>
  <!-- the red sarafan: a short flared skirt with a yellow and a green band -->
  <path d="M-46 -176 L-74 -66 Q0 -54 74 -66 L46 -176 Z" fill="#c62828" ${stroke}/>
  <path d="M-71 -80 Q0 -68 71 -80" stroke="#f5c542" stroke-width="9" fill="none"/>
  <path d="M-66 -96 Q0 -86 66 -96" stroke="#2e7d32" stroke-width="5" fill="none"/>
  <!-- a white apron with a stitched hem -->
  <path d="M-28 -168 L-36 -84 L36 -84 L28 -168 Z" fill="#fbf7ee" ${st(4)}/>
  ${stitch(-34, -102, 68)}
  <g data-dress="legs"></g>
  <!-- the blouse: puffed sleeves, the sarafan's straps over it -->
  <path d="M-44 -238 Q-54 -206 -48 -172 L48 -172 Q54 -206 44 -238 Q0 -252 -44 -238 Z" fill="#fbf7ee" ${stroke}/>
  ${stitch(-7, -236, 14, 56, true)}
  <path d="M-34 -240 L-28 -172 M34 -240 L28 -172" stroke="#c62828" stroke-width="12"/>
  <path d="M-48 -230 Q-74 -200 -60 -160" fill="none" stroke="${INK}" stroke-width="28" stroke-linecap="round"/>
  <path d="M-48 -230 Q-74 -200 -60 -160" fill="none" stroke="#fbf7ee" stroke-width="19" stroke-linecap="round"/>
  <path d="M48 -230 Q74 -200 62 -160" fill="none" stroke="${INK}" stroke-width="28" stroke-linecap="round"/>
  <path d="M48 -230 Q74 -200 62 -160" fill="none" stroke="#fbf7ee" stroke-width="19" stroke-linecap="round"/>
  <circle cx="-52" cy="-226" r="15" fill="#fbf7ee" ${st(4)}/><circle cx="52" cy="-226" r="15" fill="#fbf7ee" ${st(4)}/>
  <path d="M-58 -186 h14 M48 -186 h14" stroke="#c62828" stroke-width="4"/>
  <g data-dress="torso"></g>
  <circle cx="-60" cy="-156" r="11" fill="#f2c4a0" ${st(4)}/>
  <!-- the basket hangs on her right arm -->
  ${basket(70, -96)}
  <circle cx="62" cy="-156" r="11" fill="#f2c4a0" ${st(4)}/>
  <!-- short braids with red ribbons, sticking out to the sides -->
  <path d="M-34 -232 Q-54 -220 -62 -200" stroke="${INK}" stroke-width="16" stroke-linecap="round" fill="none"/>
  <path d="M-34 -232 Q-54 -220 -62 -200" stroke="#8d4a1e" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M34 -232 Q54 -220 62 -200" stroke="${INK}" stroke-width="16" stroke-linecap="round" fill="none"/>
  <path d="M34 -232 Q54 -220 62 -200" stroke="#8d4a1e" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M-62 -204 l-12 -6 l2 14 z M-62 -204 l4 -12 l8 10 z M62 -204 l12 -6 l-2 14 z M62 -204 l-4 -12 l-8 10 z" fill="#e53935" ${st(2)}/>
  <!-- the head; chestnut hair (under the scarf) -->
  <ellipse cx="0" cy="-246" rx="36" ry="38" fill="#f2c4a0" ${stroke}/>
  <path d="M-36 -254 Q-34 -290 0 -290 Q34 -290 36 -254 Q24 -268 8 -264 L0 -274 L-8 -264 Q-24 -268 -36 -254 Z" fill="#8d4a1e" ${st(4)}/>
  <g data-part="hat">
    <!-- the headscarf over the top of the head, a knot and two ends under the chin -->
    <path d="M-48 -236 Q-56 -300 0 -304 Q56 -300 48 -236 Q44 -270 0 -274 Q-44 -270 -48 -236 Z" fill="#ffca28" ${stroke}/>
    ${dots}
    <path d="M-46 -240 Q-44 -226 -26 -212 M46 -240 Q44 -226 26 -212" stroke="#ffca28" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M-10 -210 l10 -6 l10 6 l-2 10 l-8 -4 l-8 4 z" fill="#ffca28" ${st(3)}/>
    <path d="M-6 -202 l-12 18 l10 2 z M6 -202 l12 18 l-10 2 z" fill="#ffca28" ${st(3)}/>
  </g>
  ${eyes(0, -248, 28, 6)}
  ${closedEyes(0, -248, 28, 6)}
  <!-- cheeks and freckles -->
  <ellipse cx="-20" cy="-232" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  <ellipse cx="20" cy="-232" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  <circle cx="-24" cy="-238" r="1.8" fill="#b5651d"/><circle cx="-17" cy="-240" r="1.8" fill="#b5651d"/><circle cx="-20" cy="-235" r="1.6" fill="#b5651d"/>
  <circle cx="24" cy="-238" r="1.8" fill="#b5651d"/><circle cx="17" cy="-240" r="1.8" fill="#b5651d"/><circle cx="20" cy="-235" r="1.6" fill="#b5651d"/>
  ${mouth(
    `<path d="M-9 -225 q9 8 18 0" fill="none" ${st(4)}/>`,
    `<path d="M-9 -227 q9 15 18 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
</g>`;
};

/** one little girlfriend, a bit smaller than Marijka, at x */
const friend = (x: number, o: { dress: string; hair: string; scarf?: string; flowers?: string[] }) => {
  const top = o.scarf
    ? `<path d="M${x - 34} -210 Q${x - 38} -262 ${x} -264 Q${x + 38} -262 ${x + 34} -210 Q${x + 30} -236 ${x} -240 Q${x - 30} -236 ${x - 34} -210 Z" fill="${o.scarf}" ${st(4)}/>`
    : (o.flowers || []).map((c, i) => `<circle cx="${x - 30 + i * 15}" cy="${-252 + Math.abs(i - 2) * 6}" r="9" fill="${c}" ${st(2)}/>`).join('');
  return `
  <rect x="${x - 18}" y="-70" width="14" height="62" rx="6" fill="#f2c4a0" ${st(3)}/><rect x="${x + 4}" y="-70" width="14" height="62" rx="6" fill="#f2c4a0" ${st(3)}/>
  <path d="M${x - 30} 0 q0 -12 10 -14 h16 v14 z M${x + 30} 0 q0 -12 -10 -14 h-16 v14 z" fill="#5d4037" ${st(3)}/>
  <path d="M${x - 34} -148 L${x - 56} -56 Q${x} -48 ${x + 56} -56 L${x + 34} -148 Z" fill="${o.dress}" ${st(4)}/>
  <path d="M${x - 34} -200 Q${x - 42} -172 ${x - 36} -146 L${x + 36} -146 Q${x + 42} -172 ${x + 34} -200 Q${x} -212 ${x - 34} -200 Z" fill="#fbf7ee" ${st(4)}/>
  ${stitch(x - 6, -198, 12, 42, true)}
  <circle cx="${x - 38}" cy="-140" r="9" fill="#f2c4a0" ${st(3)}/>
  ${basket(x + 48, -84)}
  <circle cx="${x + 40}" cy="-140" r="9" fill="#f2c4a0" ${st(3)}/>
  <path d="M${x + 22} -214 Q${x + 34} -180 ${x + 28} -150" stroke="${INK}" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M${x + 22} -214 Q${x + 34} -180 ${x + 28} -150" stroke="${o.hair}" stroke-width="8" stroke-linecap="round" fill="none"/>
  <ellipse cx="${x}" cy="-222" rx="28" ry="30" fill="#f2c4a0" ${st(4)}/>
  <path d="M${x - 28} -228 Q${x - 26} -254 ${x} -254 Q${x + 26} -254 ${x + 28} -228 Q${x + 14} -240 ${x} -238 Q${x - 14} -240 ${x - 28} -228 Z" fill="${o.hair}" ${st(3)}/>
  ${top}
  <ellipse cx="${x - 14}" cy="-210" rx="6" ry="4" fill="#f0786a" opacity=".7"/><ellipse cx="${x + 14}" cy="-210" rx="6" ry="4" fill="#f0786a" opacity=".7"/>`;
};

/** her two girlfriends (one puppet): one in a blue dress with a daisy wreath, one in green with a white scarf */
export const podruzhky = () => `
<g data-part="body">
  ${friend(70, { dress: '#2e7d32', hair: '#3e2723', scarf: '#fafafa' })}
  ${eyes(70, -224, 20, 4.5)}
  ${mouth(`<path d="M64 -206 q6 6 12 0" fill="none" ${st(3)}/>`, `<path d="M64 -207 q6 11 12 0 z" fill="#7a2a1a" ${st(2.5)}/>`)}
  ${friend(-70, { dress: '#1e6fbf', hair: '#e0a93a', flowers: ['#fff', '#fff176', '#fff', '#fff176', '#fff'] })}
  ${eyes(-70, -224, 20, 4.5)}
  ${mouth(`<path d="M-76 -206 q6 6 12 0" fill="none" ${st(3)}/>`, `<path d="M-76 -207 q6 11 12 0 z" fill="#7a2a1a" ${st(2.5)}/>`)}
</g>`;

/** the magpie: black and white, a long tail; facing left, her head turned to us a little */
export const soroka = () => `
<g data-part="body">
  <path d="M-8 -26 V-4 M8 -26 V-4" stroke="#37474f" stroke-width="5" stroke-linecap="round"/>
  <path d="M-18 0 h14 M2 0 h14" stroke="#37474f" stroke-width="4" stroke-linecap="round"/>
  <path d="M30 -50 L120 -86 L126 -70 L36 -36 Z" fill="#263238" ${st(4)}/>
  <path d="M60 -62 L118 -84" stroke="#3f51b5" stroke-width="5"/>
  <ellipse cx="4" cy="-52" rx="40" ry="28" fill="#fafafa" ${stroke}/>
  <path d="M-8 -74 Q36 -82 48 -52 Q36 -34 10 -36 Z" fill="#263238" ${st(4)}/>
  <path d="M8 -60 q14 4 28 0" stroke="#3f51b5" stroke-width="4" fill="none"/>
  <circle cx="-30" cy="-86" r="22" fill="#263238" ${stroke}/>
  ${eyes(-32, -90, 16, 4.5, true)}
  ${closedEyes(-32, -90, 16, 4.5)}
  ${mouth(
    `<path d="M-46 -84 L-70 -80 L-46 -74 Z" fill="#37474f" ${st(2.5)}/>`,
    `<path d="M-46 -86 L-72 -86 L-46 -80 Z M-46 -76 L-68 -72 L-46 -72 Z" fill="#37474f" ${st(2.5)}/>`,
  )}
</g>`;

/**
 * The bear's big birch-bark box, the pies heaped on top (Marijka sits under them). Her eyes peek out
 * through a crack while she is inside (data-part="peek"); the door (ANCHORS mouth) is the top.
 */
export const korob = () => {
  let weave = '';
  for (let i = 0; i < 7; i++) weave += `<path d="M${-74 + i * 25} -16 V-150" stroke="#cdb98a" stroke-width="3"/>`;
  for (let j = 0; j < 5; j++) weave += `<path d="M-80 ${-36 - j * 26} H80" stroke="#cdb98a" stroke-width="3"/>`;
  // dark birch-bark marks
  const marks = [[-56, -60], [-20, -110], [30, -48], [52, -120], [-40, -132], [10, -84]].map(([x, y]) => `<path d="M${x} ${y} h16" stroke="#3e3a36" stroke-width="5" stroke-linecap="round"/>`).join('');
  return `
<g data-part="body">
  <path d="M-86 -150 L-80 -6 Q0 6 80 -6 L86 -150 Z" fill="#f1e6c8" ${stroke}/>
  ${weave}${marks}
  <path d="M-86 -150 Q0 -138 86 -150 L86 -136 Q0 -124 -86 -136 Z" fill="#c9a86a" ${st(4)}/>
  <path d="M-80 -20 Q0 -8 80 -20" stroke="#c9a86a" stroke-width="10" fill="none"/>
  <!-- a strap for the back -->
  <path d="M40 -140 Q70 -80 44 -20" stroke="#6d4426" stroke-width="9" fill="none"/>
  <!-- pies heaped on top -->
  ${pie(-44, -140)}${pie(42, -142)}${pie(0, -146, 1.1)}${pie(-18, -168, 0.9)}${pie(22, -170, 0.9)}
  <g data-part="peek" style="display:none">
    <path d="M-40 -96 Q0 -104 40 -96 L40 -82 Q0 -90 -40 -82 Z" fill="#3a2418"/>
    <circle cx="-12" cy="-91" r="5" fill="#fff"/><circle cx="12" cy="-91" r="5" fill="#fff"/>
    <circle cx="-11" cy="-91" r="2.6" fill="#2b1a10"/><circle cx="13" cy="-91" r="2.6" fill="#2b1a10"/>
  </g>
</g>`;
};

/** a stump with roots, rings on its top and a tuft of moss (the bear wants to sit on it) */
export const penok = () => `
<g data-part="body">
  <path d="M-70 0 Q-56 -6 -50 -20 L-48 -90 L48 -90 L50 -20 Q56 -6 72 0 Z" fill="#8b5a2b" ${stroke}/>
  <path d="M-30 -84 V-10 M0 -80 V-6 M28 -84 V-14" stroke="#6d4426" stroke-width="4"/>
  <ellipse cx="0" cy="-92" rx="50" ry="14" fill="#e0b97a" ${st(4)}/>
  <ellipse cx="0" cy="-92" rx="32" ry="8" fill="none" stroke="#b78a4a" stroke-width="3"/>
  <ellipse cx="0" cy="-92" rx="14" ry="4" fill="none" stroke="#b78a4a" stroke-width="3"/>
  <path d="M-50 -40 q-14 -10 -6 -24 q10 4 8 20 z" fill="#6fae4a"/>
  <path d="M40 -20 q4 -16 18 -12 q-2 12 -18 12 z" fill="#6fae4a"/>
</g>`;

/** a few brown-capped mushrooms in a tuft of grass */
export const hryby = () => {
  const one = (x: number, s: number) =>
    `<g transform="translate(${x} 0) scale(${s})"><path d="M-9 0 q-3 -22 0 -34 h18 q3 12 0 34 z" fill="#fff6e6" ${st(3)}/>` +
    `<path d="M-30 -30 Q-26 -62 0 -62 Q26 -62 30 -30 Q0 -22 -30 -30 Z" fill="#8d5524" ${st(3)}/><ellipse cx="-8" cy="-50" rx="7" ry="4" fill="#b07040"/></g>`;
  return `<g data-part="body">
  <path d="M-50 0 q4 -20 8 -24 q2 14 6 20 q4 -18 10 -26 q0 18 4 26 M24 0 q4 -18 10 -24 q0 14 4 22 q6 -12 12 -16 q-4 10 -2 18" fill="#4f9a3c"/>
  ${one(-24, 1)}${one(20, 0.8)}${one(46, 0.6)}
</g>`;
};

/** a clump of wild strawberries */
export const yahidky = () => {
  let leaves = '';
  for (const [x, y, r] of [[-30, -24, -30], [0, -34, 0], [30, -24, 30], [-14, -14, -60], [16, -14, 60]]) leaves += `<ellipse cx="${x}" cy="${y}" rx="18" ry="10" fill="#43a047" ${st(2.5)} transform="rotate(${r} ${x} ${y})"/>`;
  let berries = '';
  for (const [x, y] of [[-34, -8], [-8, -4], [20, -10], [40, -4], [6, -22]]) berries += `<path d="M${x - 8} ${y - 8} Q${x} ${y + 12} ${x + 8} ${y - 8} Q${x} ${y - 14} ${x - 8} ${y - 8} Z" fill="#e53935" ${st(2)}/><path d="M${x - 6} ${y - 10} l6 -5 l6 5" stroke="#2e7d32" stroke-width="3" fill="none"/>`;
  return `<g data-part="body">${leaves}${berries}</g>`;
};

/** a clay pot of millet porridge, steaming */
export const kasha = () => `
<g data-part="body">
  <path d="M-42 -50 Q-56 -14 -30 0 L30 0 Q56 -14 42 -50 Z" fill="#c0542e" ${stroke}/>
  <path d="M-46 -40 h92" stroke="#fff3e0" stroke-width="5" stroke-dasharray="8 8"/>
  <ellipse cx="0" cy="-52" rx="46" ry="12" fill="#a8411f" ${st(4)}/>
  <path d="M-38 -54 Q-30 -76 0 -78 Q30 -76 38 -54 Z" fill="#ffd54f" ${st(3)}/>
  <path d="M-10 -60 q4 -8 8 0 M10 -64 q4 -8 8 0" stroke="#e6a817" stroke-width="3" fill="none"/>
  <path d="M30 -70 L58 -104" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M30 -70 L58 -104" stroke="#d7a86e" stroke-width="5" stroke-linecap="round"/>
  <path d="M-20 -88 q-8 -14 2 -26 q10 -12 0 -24 M6 -90 q-8 -14 2 -26 q10 -12 0 -24" stroke="#e0e0e0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
</g>`;

/** the bear's log hut in the deep forest: a mossy roof, a crooked chimney, a paw on the door, a honey barrel */
export const khata_vedmedya = () => {
  let logs = '';
  for (let i = 0; i < 7; i++) logs += `<rect x="-210" y="${-36 - i * 38}" width="420" height="36" rx="18" fill="${i % 2 ? '#8b5a2b' : '#a1704a'}" stroke="#5a3a22" stroke-width="4"/><circle cx="${i % 2 ? -200 : 200}" cy="${-18 - i * 38}" r="12" fill="#d7b47a" stroke="#5a3a22" stroke-width="3"/>`;
  return `
<g data-part="body">
  ${logs}
  <!-- a crooked chimney and the mossy roof -->
  <path d="M110 -400 L104 -320 L150 -310 L156 -396 Z" fill="#7d7f84" ${st(4)}/>
  <path d="M-250 -260 L0 -420 L250 -260 Z" fill="#6d8f3a" stroke="#4a6a28" stroke-width="6" stroke-linejoin="round"/>
  <path d="M-180 -270 q20 -20 40 0 M-90 -300 q20 -20 40 0 M10 -330 q20 -20 40 0 M100 -290 q20 -20 40 0 M-30 -280 q20 -20 40 0" stroke="#8fbf4a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <!-- a little round window -->
  <circle cx="110" cy="-160" r="36" fill="#ffe08a" stroke="#5a3a22" stroke-width="7"/>
  <path d="M110 -196 v72 M74 -160 h72" stroke="#5a3a22" stroke-width="5"/>
  <!-- the door, a bear's paw painted on it -->
  <path d="M-110 0 L-110 -150 Q-60 -196 -10 -150 L-10 0 Z" fill="#6d4426" stroke="#4e2f18" stroke-width="5"/>
  <ellipse cx="-60" cy="-92" rx="16" ry="13" fill="#3a2418"/>
  <circle cx="-78" cy="-114" r="6" fill="#3a2418"/><circle cx="-64" cy="-120" r="6" fill="#3a2418"/><circle cx="-50" cy="-118" r="6" fill="#3a2418"/><circle cx="-40" cy="-108" r="6" fill="#3a2418"/>
  <circle cx="-24" cy="-70" r="6" fill="#f2c94c"/>
  <!-- a barrel of honey by the wall -->
  <path d="M146 0 Q132 -50 146 -100 L214 -100 Q228 -50 214 0 Z" fill="#a1704a" ${st(4)}/>
  <path d="M138 -24 h84 M138 -76 h84" stroke="#6d4426" stroke-width="6"/>
  <ellipse cx="180" cy="-100" rx="34" ry="9" fill="#ffb300" ${st(3)}/>
  <text x="180" y="-42" font-size="20" font-weight="900" text-anchor="middle" fill="#ffe082">МЕД</text>
</g>`;
};
