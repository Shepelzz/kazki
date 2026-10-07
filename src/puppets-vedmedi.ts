// The puppets of «Три ведмеді»: Masha (copper pigtails with green bows, a lilac dress with a white
// collar, striped tights), the bears' mother Nastasia Petrivna (a kerchief and an apron) and the cub
// Mishko (a little blue neckerchief) — the father, Mykhailo Ivanovych, is the big bear of characters.ts;
// three bowls of soup (big, middle and Mishko's little blue one, eaten up: look porozhnia), a wooden
// spoon, three chairs (the little one breaks: stilets_lamanyi), the long table (drawn in front: who is
// behind it shows from the waist up), three beds and the open window of the bedroom. Same
// conventions as characters.ts.

import { INK, closedEyes, eyes, mouth, st, stitch, stroke } from './characters';

const SKIN = '#f2c4a0';
const HAIR = '#d9622b';
const HAIR_DARK = '#a8441a';
const LILAC = '#9575cd';

/** a thick limb: the ink outline, then its colour over it */
const limb = (d: string, fill: string, w: number) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 10}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`;

/** a bow of ribbon, its knot at x, y */
const bow = (x: number, y: number, fill: string, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-22 -14 Q-28 0 -22 14 Z M0 0 L22 -14 Q28 0 22 14 Z" fill="${fill}" ${st(3)}/><circle r="6" fill="${fill}" ${st(3)}/></g>`;

/**
 * Masha: copper-red hair with a fringe and two puffy pigtails high on the sides tied with green
 * bows; a lilac dress (puffed sleeves, a round white collar, two white buttons, a white frill at the
 * hem), green-and-white striped tights, red shoes with a strap.
 */
export const masha = () => {
  let tights = '';
  for (const x of [-18, 18]) for (let y = -80; y < -20; y += 16) tights += `<rect x="${x - 10}" y="${y}" width="20" height="8" fill="#43a047"/>`;
  return `
<g data-part="body">
  <!-- legs in striped tights, red shoes with a strap -->
  <rect x="-28" y="-84" width="20" height="74" rx="8" fill="#fbf7ee" ${st(4)}/>
  <rect x="8" y="-84" width="20" height="74" rx="8" fill="#fbf7ee" ${st(4)}/>
  ${tights}
  <rect x="-28" y="-84" width="20" height="74" rx="8" fill="none" ${st(4)}/>
  <rect x="8" y="-84" width="20" height="74" rx="8" fill="none" ${st(4)}/>
  <path d="M-44 0 q0 -20 14 -22 h24 v22 z" fill="#d32f2f" ${st(4)}/>
  <path d="M44 0 q0 -20 -14 -22 h-24 v22 z" fill="#d32f2f" ${st(4)}/>
  <path d="M-28 -20 h20 M8 -20 h20" stroke="#8e1b1b" stroke-width="4"/>
  <!-- the lilac dress: a flared skirt with a white frill -->
  <path d="M-44 -180 L-74 -70 Q0 -58 74 -70 L44 -180 Z" fill="${LILAC}" ${stroke}/>
  <path d="M-74 -70 Q0 -58 74 -70 L78 -58 Q0 -44 -78 -58 Z" fill="#fbf7ee" ${st(3)}/>
  <path d="M-66 -64 v8 M-44 -60 v8 M-22 -58 v8 M0 -57 v8 M22 -58 v8 M44 -60 v8 M66 -64 v8" stroke="#d1c4e9" stroke-width="3"/>
  <g data-dress="legs"></g>
  <!-- the bodice -->
  <path d="M-44 -238 Q-54 -206 -48 -174 L48 -174 Q54 -206 44 -238 Q0 -252 -44 -238 Z" fill="${LILAC}" ${stroke}/>
  <path d="M-48 -176 H48" stroke="#7e57c2" stroke-width="8"/>
  <circle cx="0" cy="-182" r="5" fill="#fff" ${st(2)}/><circle cx="0" cy="-156" r="5" fill="#fff" ${st(2)}/>
  <!-- arms: puffed sleeves, then bare arms -->
  ${limb('M-50 -216 Q-66 -190 -60 -162', SKIN, 14)}
  ${limb('M50 -216 Q66 -190 60 -162', SKIN, 14)}
  <circle cx="-52" cy="-224" r="18" fill="${LILAC}" ${st(4)}/><circle cx="52" cy="-224" r="18" fill="${LILAC}" ${st(4)}/>
  <path d="M-66 -214 q14 6 28 0 M38 -214 q14 6 28 0" stroke="#fbf7ee" stroke-width="4" fill="none"/>
  <g data-dress="torso"></g>
  <circle cx="-60" cy="-156" r="11" fill="${SKIN}" ${st(4)}/>
  <circle cx="60" cy="-156" r="11" fill="${SKIN}" ${st(4)}/>
  <!-- pigtails: puffs of hair high on the sides, green bows -->
  <circle cx="-54" cy="-270" r="22" fill="${HAIR}" ${st(4)}/>
  <circle cx="54" cy="-270" r="22" fill="${HAIR}" ${st(4)}/>
  <path d="M-62 -282 q8 6 6 16 M50 -284 q10 4 10 16" stroke="${HAIR_DARK}" stroke-width="3" fill="none"/>
  ${bow(-38, -278, '#43a047', 0.8)}${bow(38, -278, '#43a047', 0.8)}
  <!-- the head, the copper hair with a fringe -->
  <ellipse cx="0" cy="-246" rx="36" ry="38" fill="${SKIN}" ${stroke}/>
  <path d="M-38 -246 Q-42 -290 0 -290 Q42 -290 38 -246 Q34 -258 26 -262 Q18 -254 12 -264 Q4 -254 -4 -264 Q-12 -254 -18 -264 Q-26 -256 -32 -262 Q-36 -256 -38 -246 Z" fill="${HAIR}" ${st(4)}/>
  <path d="M-20 -282 q10 -6 22 -4" stroke="#f08a4b" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- the round white collar under her chin -->
  <path data-part="collar" d="M-30 -214 Q-34 -190 -10 -190 Q0 -192 0 -204 Q0 -192 10 -190 Q34 -190 30 -214 Q0 -222 -30 -214 Z" fill="#fff" ${st(3.5)}/>
  ${eyes(0, -246, 28, 6)}
  ${closedEyes(0, -246, 28, 6)}
  <ellipse cx="-20" cy="-230" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  <ellipse cx="20" cy="-230" rx="8" ry="5" fill="#f0786a" opacity=".7"/>
  ${mouth(
    `<path d="M-9 -223 q9 8 18 0" fill="none" ${st(4)}/>`,
    `<path d="M-9 -225 q9 15 18 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
</g>`;
};

/**
 * Nastasia Petrivna, the bears' mother: smaller than the father and a lighter brown, a red kerchief
 * with white dots over her head (her ears stick out of it), knotted under the chin; a white apron
 * with a stitched hem and a pocket.
 */
export const vedmedytsia = () => {
  const FUR = '#96603a';
  const LIGHT = '#c89a6a';
  let dots = '';
  for (const [x, y] of [[-30, -312], [0, -320], [30, -312], [-50, -296], [50, -296], [-14, -310], [16, -310]]) dots += `<circle cx="${x}" cy="${y}" r="4" fill="#fff"/>`;
  return `
<g data-part="body">
  <ellipse cx="-32" cy="-20" rx="36" ry="22" fill="${FUR}" ${stroke}/>
  <ellipse cx="34" cy="-20" rx="36" ry="22" fill="${FUR}" ${stroke}/>
  <ellipse cx="0" cy="-130" rx="82" ry="104" fill="${FUR}" ${stroke}/>
  <!-- the apron -->
  <path d="M-46 -188 Q-56 -110 -50 -48 Q0 -36 50 -48 Q56 -110 46 -188 Z" fill="#fbf7ee" ${st(4)}/>
  ${stitch(-46, -66, 92)}
  <path d="M-24 -130 h48 v22 q-24 10 -48 0 z" fill="#fbf7ee" ${st(3)}/>
  <path d="M-46 -188 Q-40 -214 -24 -226 M46 -188 Q40 -214 24 -226" stroke="#fbf7ee" stroke-width="8" fill="none"/>
  <g data-dress="legs"></g>
  ${limb('M-72 -190 Q-112 -150 -94 -98', FUR, 30)}
  ${limb('M72 -190 Q112 -150 94 -98', FUR, 30)}
  <g data-dress="torso"></g>
  <!-- ears, the head -->
  <circle cx="-44" cy="-316" r="20" fill="${FUR}" ${stroke}/>
  <circle cx="-44" cy="-316" r="9" fill="${LIGHT}"/>
  <circle cx="42" cy="-320" r="20" fill="${FUR}" ${stroke}/>
  <circle cx="42" cy="-320" r="9" fill="${LIGHT}"/>
  <ellipse cx="0" cy="-270" rx="60" ry="54" fill="${FUR}" ${stroke}/>
  <g data-part="hat">
    <!-- the kerchief over the top of the head, between the ears; its ends knotted under the chin -->
    <path d="M-60 -262 Q-62 -326 0 -330 Q62 -326 60 -262 Q52 -298 0 -302 Q-52 -298 -60 -262 Z" fill="#d32f2f" ${stroke}/>
    ${dots}
    <path d="M-58 -264 Q-56 -240 -34 -224 M58 -264 Q56 -240 34 -224" stroke="#d32f2f" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M-12 -222 l12 -6 l12 6 l-2 10 l-10 -4 l-10 4 z" fill="#d32f2f" ${st(3)}/>
    <path d="M-6 -214 l-12 18 l10 2 z M6 -214 l12 18 l-10 2 z" fill="#d32f2f" ${st(3)}/>
  </g>
  <ellipse cx="-12" cy="-248" rx="30" ry="22" fill="${LIGHT}" ${st(4)}/>
  <ellipse cx="-17" cy="-260" rx="11" ry="8" fill="#2b1a10"/>
  ${eyes(-4, -286, 40, 6)}
  ${closedEyes(-4, -286, 40, 6)}
  <ellipse cx="-38" cy="-262" rx="8" ry="5" fill="#f0786a" opacity=".55"/>
  <ellipse cx="30" cy="-264" rx="8" ry="5" fill="#f0786a" opacity=".55"/>
  ${mouth(
    `<path d="M-30 -236 q13 10 26 0" fill="none" ${st(4)}/>`,
    `<path d="M-30 -240 q13 24 26 0 z" fill="#8a2a1a" ${st(3)}/>`,
  )}
</g>`;
};

/** Mishko, the little bear: honey-brown, a big round head, a blue neckerchief (data-part="collar") */
export const mishko = () => {
  const FUR = '#b9814a';
  const LIGHT = '#e6be8c';
  return `
<g data-part="body">
  <ellipse cx="-22" cy="-14" rx="24" ry="15" fill="${FUR}" ${st(4)}/>
  <ellipse cx="24" cy="-14" rx="24" ry="15" fill="${FUR}" ${st(4)}/>
  <ellipse cx="0" cy="-80" rx="56" ry="66" fill="${FUR}" ${stroke}/>
  <ellipse cx="-3" cy="-70" rx="34" ry="42" fill="${LIGHT}"/>
  <g data-dress="legs"></g>
  ${limb('M-48 -118 Q-76 -92 -64 -58', FUR, 20)}
  ${limb('M48 -118 Q76 -92 64 -58', FUR, 20)}
  <g data-dress="torso"></g>
  <!-- the blue neckerchief: a knot and a triangle on the chest -->
  <path data-part="collar" d="M-40 -126 Q0 -108 40 -126 L34 -112 L4 -86 L-4 -86 L-34 -112 Z" fill="#1e88e5" ${st(3.5)}/>
  <circle cx="-30" cy="-200" r="17" fill="${FUR}" ${stroke}/>
  <circle cx="-30" cy="-200" r="8" fill="${LIGHT}"/>
  <circle cx="30" cy="-202" r="17" fill="${FUR}" ${stroke}/>
  <circle cx="30" cy="-202" r="8" fill="${LIGHT}"/>
  <ellipse cx="0" cy="-160" rx="50" ry="46" fill="${FUR}" ${stroke}/>
  <path d="M-8 -206 q4 -12 10 -4 q4 -10 8 2" stroke="${INK}" stroke-width="3" fill="${FUR}"/>
  <ellipse cx="-8" cy="-140" rx="23" ry="17" fill="${LIGHT}" ${st(3.5)}/>
  <ellipse cx="-12" cy="-149" rx="8" ry="6" fill="#2b1a10"/>
  ${eyes(-2, -172, 34, 6)}
  ${closedEyes(-2, -172, 34, 6)}
  <ellipse cx="-34" cy="-150" rx="7" ry="4.5" fill="#f0786a" opacity=".6"/>
  <ellipse cx="26" cy="-152" rx="7" ry="4.5" fill="#f0786a" opacity=".6"/>
  ${mouth(
    `<path d="M-22 -131 q10 8 20 0" fill="none" ${st(3.5)}/>`,
    `<path d="M-22 -134 q10 18 20 0 z" fill="#8a2a1a" ${st(3)}/>`,
  )}
</g>`;
};

// ---------- the bowls, the spoon ----------

/** a bowl of soup (or eaten up), its bottom at 0,0: s — size, a spoon of its size stuck in it */
const miska = (s: number, fill: string, pattern: string, full: boolean, steam: number) => {
  const w = 60 * s;
  const h = 46 * s;
  let puffs = '';
  for (let i = 0; i < steam; i++) {
    const x = (-0.5 + (i + 0.5) / steam) * w * 1.1;
    puffs += `<path d="M${x.toFixed(0)} ${-h - 16} q-10 -16 0 -30 q10 -14 0 -28" stroke="#eceff1" stroke-width="${(5 * Math.min(1.4, s)).toFixed(1)}" fill="none" stroke-linecap="round" opacity=".9"/>`;
  }
  const spoon = `<path d="M${(w * 0.35).toFixed(0)} ${-h} L${(w * 0.85).toFixed(0)} ${(-h - 52 * s).toFixed(0)}" stroke="${INK}" stroke-width="${(10 * s).toFixed(1)}" stroke-linecap="round"/><path d="M${(w * 0.35).toFixed(0)} ${-h} L${(w * 0.85).toFixed(0)} ${(-h - 52 * s).toFixed(0)}" stroke="#d7a86e" stroke-width="${(5 * s).toFixed(1)}" stroke-linecap="round"/>`;
  return `<g data-part="body">
  ${full ? puffs : ''}
  ${full ? spoon : ''}
  <path d="M${-w} ${-h} Q${-w * 0.95} ${-h * 0.1} ${-w * 0.45} 0 L${w * 0.45} 0 Q${w * 0.95} ${-h * 0.1} ${w} ${-h} Z" fill="${fill}" ${st(4)}/>
  ${pattern}
  <ellipse cx="0" cy="${-h}" rx="${w}" ry="${12 * s}" fill="${full ? '#e8a33d' : '#f5efe3'}" ${st(4)}/>
  ${full ? `<circle cx="${-w * 0.4}" cy="${-h}" r="${5 * s}" fill="#ef6c00"/><circle cx="${w * 0.1}" cy="${-h + 3 * s}" r="${4 * s}" fill="#ef6c00"/><path d="M${-w * 0.1} ${-h - 3 * s} h${10 * s}" stroke="#7cb342" stroke-width="${4 * s}" stroke-linecap="round"/>` : `<circle cx="${-w * 0.3}" cy="${-h + 2}" r="${3 * s}" fill="#e8a33d"/><circle cx="${w * 0.2}" cy="${-h - 2}" r="${2.5 * s}" fill="#e8a33d"/>`}
</g>`;
};
/** a wavy band round a bowl at height y */
const wave = (s: number, color: string) => `<path d="M${-50 * s} ${-26 * s} q${10 * s} ${-10 * s} ${20 * s} 0 t${20 * s} 0 t${20 * s} 0 t${20 * s} 0 t${20 * s} 0" stroke="${color}" stroke-width="${4 * s}" fill="none"/>`;
const spots = (s: number, color: string) => [-36, -12, 12, 36].map((x) => `<circle cx="${x * s}" cy="${-22 * s}" r="${5 * s}" fill="${color}"/>`).join('');

/** Mykhailo Ivanovych's big bowl: brown clay with a white wave, soup still very hot */
export const miska_velyka = () => miska(1.45, '#8d5a2b', wave(1.45, '#fbf7ee'), true, 3);
/** Nastasia Petrivna's middle bowl: red with white spots */
export const miska_serednia = () => miska(1.15, '#c62828', spots(1.15, '#fbf7ee'), true, 1);
/** Mishko's little blue bowl (and eaten up to the last drop) */
export const miska_mala = () => miska(0.85, '#1e88e5', spots(0.85, '#fff'), true, 1);
export const miska_mala_porozhnia = () => miska(0.85, '#1e88e5', spots(0.85, '#fff'), false, 0);

/** a wooden spoon, standing on its handle's end (carried: in the hand, the bowl of it up) */
export const lozhka = () => `
<g data-part="body">
  <path d="M0 0 L0 -64" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
  <path d="M0 0 L0 -64" stroke="#d7a86e" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="0" cy="-82" rx="16" ry="22" fill="#d7a86e" ${st(4)}/>
  <ellipse cx="0" cy="-84" rx="9" ry="14" fill="#c08a52"/>
  <path d="M-4 -30 h8 M-4 -40 h8" stroke="#a1704a" stroke-width="2"/>
</g>`;

// ---------- the chairs ----------

/** a chair seen from the front, its legs at 0: seat at height sh, back up to bh, half-width w */
const chair = (w: number, sh: number, bh: number, wood: string, dark: string, extra: string) => `
<g data-part="body">
  <rect x="${-w}" y="${-bh}" width="16" height="${bh}" rx="6" fill="${wood}" ${st(4)}/>
  <rect x="${w - 16}" y="${-bh}" width="16" height="${bh}" rx="6" fill="${wood}" ${st(4)}/>
  <rect x="${-w}" y="${-bh}" width="${2 * w}" height="${Math.round((bh - sh) * 0.32)}" rx="10" fill="${wood}" ${st(4)}/>
  <path d="M${-w + 16} ${-sh - Math.round((bh - sh) * 0.45)} H${w - 16}" stroke="${dark}" stroke-width="8"/>
  <path d="M${-w + 4} 0 V${-sh} M${w - 4} 0 V${-sh}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/>
  <path d="M${-w + 4} 0 V${-sh} M${w - 4} 0 V${-sh}" stroke="${wood}" stroke-width="9" stroke-linecap="round"/>
  <path d="M${-w + 4} ${-sh * 0.4} H${w - 4}" stroke="${dark}" stroke-width="7"/>
  <rect x="${-w - 8}" y="${-sh - 16}" width="${2 * w + 16}" height="22" rx="8" fill="${wood}" ${st(4)}/>
  ${extra}
</g>`;

/** Mykhailo Ivanovych's big chair: tall, of dark oak, a carved honeycomb on its back */
export const stilets_velykyi = () =>
  chair(96, 210, 500, '#7a4a26', '#4e2f18',
    `<path d="M-30 -420 l15 -9 l15 9 v17 l-15 9 l-15 -9 z M0 -420 l15 -9 l15 9 v17 l-15 9 l-15 -9 z M-15 -394 l15 -9 l15 9 v17 l-15 9 l-15 -9 z" fill="#ffb300" ${st(3)}/>`);
/** Nastasia Petrivna's middle chair: lighter wood, a red cushion, a carved flower */
export const stilets_serednii = () =>
  chair(76, 180, 400, '#b07a45', '#7a5232',
    `<rect x="-70" y="-212" width="140" height="22" rx="10" fill="#e53935" ${st(3)}/>` +
    `<circle cx="0" cy="-334" r="10" fill="#fff59d" ${st(2.5)}/>` +
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-352" rx="7" ry="11" fill="#e53935" ${st(2)} transform="rotate(${a} 0 -334)"/>`).join(''));
/** Mishko's little chair: painted blue, a blue cushion with white dots */
export const stilets_malyi = () =>
  chair(52, 110, 250, '#64b5f6', '#1e88e5',
    `<rect x="-48" y="-140" width="96" height="20" rx="9" fill="#1565c0" ${st(3)}/>` +
    `<circle cx="-24" cy="-130" r="3" fill="#fff"/><circle cx="0" cy="-130" r="3" fill="#fff"/><circle cx="24" cy="-130" r="3" fill="#fff"/>` +
    `<circle cx="0" cy="-212" r="8" fill="#fff" ${st(2.5)}/>`);
/** the little chair broken: the back lying on the floor, legs scattered, the cushion */
export const stilets_lamanyi = () => {
  const leg = (x1: number, y1: number, x2: number, y2: number) =>
    `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#64b5f6" stroke-width="9" stroke-linecap="round"/>`;
  return `
<g data-part="body">
  <!-- the back fallen flat behind, the legs splayed out, the seat snapped in two (a V), the cushion off -->
  <rect x="-150" y="-34" width="130" height="30" rx="10" fill="#64b5f6" ${st(4)}/>
  <circle cx="-85" cy="-19" r="7" fill="#fff" ${st(2.5)}/>
  ${leg(-60, -40, -110, -96)}${leg(70, -40, 120, -100)}${leg(-20, -10, -70, 4)}${leg(40, -10, 100, 2)}
  <rect x="-50" y="-58" width="62" height="20" rx="7" fill="#64b5f6" ${st(4)} transform="rotate(28 12 -48)"/>
  <rect x="14" y="-58" width="62" height="20" rx="7" fill="#64b5f6" ${st(4)} transform="rotate(-28 14 -48)"/>
  <path d="M8 -44 l4 -10 l4 8 l4 -10" stroke="${INK}" stroke-width="3" fill="none"/>
  <rect x="96" y="-22" width="90" height="20" rx="9" fill="#1565c0" ${st(3)} transform="rotate(10 140 -12)"/>
  <circle cx="120" cy="-14" r="3" fill="#fff"/><circle cx="142" cy="-10" r="3" fill="#fff"/><circle cx="164" cy="-6" r="3" fill="#fff"/>
</g>`;
};

/**
 * The bears' long table, drawn in front of everyone: who stands (or sits) behind it shows from the
 * waist up. Its top at y -150, from x -380 to 380; a cloth with a stitched hem hangs over it.
 */
export const stil_vedmediv = () => `
<g data-part="body">
  <path d="M-350 -130 V0 M350 -130 V0" stroke="${INK}" stroke-width="34" stroke-linecap="round"/>
  <path d="M-350 -130 V0 M350 -130 V0" stroke="#7a4a26" stroke-width="22" stroke-linecap="round"/>
  <path d="M-392 -150 H392 L378 -80 Q0 -66 -378 -80 Z" fill="#fbf7ee" ${stroke}/>
  ${stitch(-370, -102, 740)}
  <path d="M-392 -150 H392" stroke="#e5ddc9" stroke-width="6"/>
  <path d="M-378 -80 l-4 14 l10 -8 l6 14 l6 -16" fill="#c62828" stroke="none"/>
</g>`;

// ---------- the beds, the window ----------

/**
 * A bed seen from the side, its headboard (and the pillow) on the left: half-length l, the mattress
 * at height mh; a puffy quilt over it, with a pattern drawn on it at points spread across the quilt.
 */
const bed = (l: number, mh: number, wood: string, quilt: string, pillow: string, deco: (x: number, y: number, i: number) => string) => {
  const x0 = -l + 120;
  const x1 = l - 24;
  const top = -mh - 50;
  let pattern = '';
  const n = Math.max(3, Math.round((x1 - x0) / 60));
  for (let i = 0; i < n; i++) {
    const x = x0 + ((i + 0.5) * (x1 - x0)) / n;
    pattern += deco(Math.round(x), Math.round(top + 30 + (i % 2) * 18), i);
  }
  return `
<g data-part="body">
  <rect x="${-l - 10}" y="${-mh - 130}" width="28" height="${mh + 130}" rx="10" fill="${wood}" ${st(4)}/>
  <circle cx="${-l + 4}" cy="${-mh - 136}" r="16" fill="${wood}" ${st(4)}/>
  <rect x="${l - 18}" y="${-mh - 50}" width="26" height="${mh + 50}" rx="10" fill="${wood}" ${st(4)}/>
  <circle cx="${l - 5}" cy="${-mh - 56}" r="14" fill="${wood}" ${st(4)}/>
  <rect x="${-l + 10}" y="${-mh}" width="${2 * l - 30}" height="30" rx="8" fill="${wood}" ${st(4)}/>
  <rect x="${-l + 14}" y="${-mh - 30}" width="${2 * l - 38}" height="32" rx="12" fill="#fbf7ee" ${st(4)}/>
  <ellipse cx="${-l + 72}" cy="${-mh - 46}" rx="58" ry="26" fill="${pillow}" ${st(4)}/>
  <path d="M${-l + 60} ${-mh - 50} q-6 -10 8 -12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M${x0} ${top + 14} Q${x0} ${top} ${x0 + 30} ${top} H${x1 - 10} Q${x1 + 4} ${top} ${x1 + 4} ${top + 14} V${-mh + 26} Q${(x0 + x1) / 2} ${-mh + 40} ${x0 - 10} ${-mh + 26} Z" fill="${quilt}" ${st(4)}/>
  ${pattern}
  <path d="M${-l + 4} ${-mh + 30} V0 M${l - 12} ${-mh + 30} V0" stroke="${INK}" stroke-width="20" stroke-linecap="round"/>
  <path d="M${-l + 4} ${-mh + 30} V0 M${l - 12} ${-mh + 30} V0" stroke="${wood}" stroke-width="10" stroke-linecap="round"/>
</g>`;
};

/** Mykhailo Ivanovych's big bed: a huge brown patchwork quilt */
export const lizhko_velyke = () =>
  bed(260, 170, '#6d4426', '#8d6e63', '#efebe9', (x, y, i) => `<rect x="${x - 22}" y="${y - 14}" width="44" height="34" rx="4" fill="${['#a1887f', '#6d4c41', '#bcaaa4', '#795548'][i % 4]}" ${st(2.5)}/>`);
/** Nastasia Petrivna's middle bed: high on its long legs, a red quilt with white hearts */
export const lizhko_serednie = () =>
  bed(200, 300, '#b07a45', '#e53935', '#fff8e1', (x, y) => `<path d="M${x} ${y + 10} l-12 -12 a7 7 0 0 1 12 -10 a7 7 0 0 1 12 10 Z" fill="#fff"/>`);
/** Mishko's little bed: low, a blue blanket with yellow stars, a little pillow */
export const lizhko_male = () =>
  bed(175, 70, '#64b5f6', '#1e88e5', '#e3f2fd', (x, y) => `<path d="M${x} ${y - 10} l3 7 h8 l-6 5 l3 8 l-8 -5 l-8 5 l3 -8 l-6 -5 h8 z" fill="#ffeb3b"/>`);

/**
 * The bedroom's open window: a log frame, the shutters open, the forest outside; its sill at 0, 0
 * (stood up on the wall: shown at y ≈ 560). The door (ANCHORS mouth) is the window itself.
 */
export const vikno = () => `
<g data-part="body">
  <rect x="-110" y="-250" width="220" height="250" fill="#b9e3f5" stroke="#5a3a22" stroke-width="12"/>
  <path d="M-104 -10 Q-60 -90 -20 -10 Z M-40 -10 L10 -120 L60 -10 Z M30 -10 Q70 -80 104 -10 Z" fill="#2e7d32"/>
  <circle cx="60" cy="-200" r="18" fill="#ffd54f"/>
  <ellipse cx="-50" cy="-190" rx="34" ry="12" fill="#fff"/>
  <!-- the shutters, open -->
  <path d="M-116 -252 L-176 -232 L-176 -18 L-116 2 Z" fill="#43a047" ${st(4)}/>
  <path d="M116 -252 L176 -232 L176 -18 L116 2 Z" fill="#43a047" ${st(4)}/>
  <path d="M-146 -200 l-12 14 l12 14 l12 -14 z M146 -200 l-12 14 l12 14 l12 -14 z" fill="#fff59d" ${st(2)}/>
  <rect x="-130" y="-6" width="260" height="20" rx="6" fill="#a0703c" ${st(4)}/>
</g>`;

/** the door of the bedroom (the bears come in by it): planks, iron hinges, a paw painted on it */
export const dveri = () => {
  let planks = '';
  for (let x = -70; x < 90; x += 46) planks += `<path d="M${x} -350 V0" stroke="#5a3a22" stroke-width="4"/>`;
  return `
<g data-part="body">
  <path d="M-110 0 V-360 Q0 -420 110 -360 V0 Z" fill="#6d4426" stroke="#4e2f18" stroke-width="10"/>
  <path d="M-94 0 V-350 Q0 -402 94 -350 V0 Z" fill="#8b5a2b" ${st(4)}/>
  ${planks}
  <path d="M-94 -290 h70 M-94 -80 h70" stroke="#37474f" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="0" cy="-200" rx="22" ry="18" fill="#3a2418"/>
  <circle cx="-22" cy="-228" r="8" fill="#3a2418"/><circle cx="-7" cy="-236" r="8" fill="#3a2418"/><circle cx="9" cy="-235" r="8" fill="#3a2418"/><circle cx="23" cy="-226" r="8" fill="#3a2418"/>
  <circle cx="66" cy="-170" r="10" fill="#f2c94c" ${st(3)}/>
</g>`;
};
