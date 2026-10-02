// The stage: one SVG, 1600×900, with the backdrop of the scene, the puppets and the effects. Puppets
// move in plain JS tweens on requestAnimationFrame (SVG transform attributes, which every Safari
// animates the same way); the stage never waits for anything itself — the tale (engine.ts) awaits
// the promises it returns.
//
// The SVG is fitted whole into the screen ("meet"); the backdrop is drawn far beyond 1600×900, so on
// a portrait iPad the free space above and below shows more sky and more meadow, not black bars.
//
// While the road "rolls", the backdrop slides left in layers (far hills slowly, the grass at the
// front fast) and the kolobok turns on the spot: he rolls along without leaving the screen.

import { ANCHORS, el, makePuppet, svg } from './characters';
import type { Point } from './story';

export const GROUND = 770;
/**
 * The part of the scene that is framed: less sky than the 0…900 the scenes are laid out in, more
 * meadow under the road — the subtitles go up into the sky, the choice buttons down onto the
 * meadow, and neither covers the characters.
 */
const VIEW_TOP = 80;
const VIEW_H = 1020;
/**
 * The camera closes in on the characters on stage and follows them as they move — a whole 1600-wide
 * scene would leave them small. Portrait screens: the scene takes the top part of the screen (the
 * subtitles and the buttons go under it). Landscape: the whole screen, the road low enough to leave
 * the meadow under it for the choice buttons.
 */
const PORTRAIT_SCENE = 0.74; // share of the screen height
const PORTRAIT_GROUND = 0.86; // where the road is, from the scene's top
const LANDSCAPE_GROUND = 0.72; // where the road is, from the screen's top…
const LOW_GROUND = 0.68; // …on a phone on its side (its buttons take a bigger share)
/** what must stay in view above the road, in scene units: the heads (did's hat, the bear's ears) */
const HEADROOM = 410;
const CAM_MIN_W = 640; // closest zoom on a portrait phone, in scene units
const CAM_MIN_W_LANDSCAPE = 1200;
const CAM_MAX_SCALE = 0.6; // portrait: never bigger than this many screen px per unit (an upright iPad isn't a phone)
const CAM_MAX_SCALE_LANDSCAPE = 1;
const CAM_MARGIN = 150; // room left and right of the outermost characters
const W = 1600;
/** px per second the front of the road slides by while rolling */
const ROLL_SPEED = 300;
const KOLOBOK_R = 50;

interface Move {
  from: Point;
  to: Point;
  t: number;
  ms: number;
  hop: boolean;
  roll: boolean;
  done: () => void;
}

interface Actor {
  id: string;
  g: SVGGElement;
  body: SVGGElement;
  x: number;
  y: number;
  flip: boolean;
  move: Move | null;
  talking: boolean;
  mouthT: number;
  eyesOpen: boolean;
  blinkIn: number;
  blinkLeft: number;
  crust: number;
  bounce: number;
  phase: number;
  parts: Record<string, SVGGElement | null>;
  /** shrinking into the fox's mouth: 1 → 0 */
  scale: number;
  /** held in someone's hands: follows them until put down (any move puts it down) */
  carriedBy: Actor | null;
}

interface Particle {
  el: SVGElement;
  t: number;
  life: number;
  update: (p: Particle, k: number) => void;
}

const rand = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// ---------- backdrops ----------

function sky(top: string, bottom: string) {
  return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs>
    <rect x="-1600" y="-1200" width="4800" height="${GROUND + 1200}" fill="url(#sky)"/>`;
}

function sun(x: number, y: number, color = '#ffd54f') {
  let rays = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    rays += `<path d="M${x + Math.cos(a) * 78} ${y + Math.sin(a) * 78} L${x + Math.cos(a) * 108} ${y + Math.sin(a) * 108}" stroke="${color}" stroke-width="12" stroke-linecap="round"/>`;
  }
  return `<g data-sun="1" data-cx="${x}" data-cy="${y}">${rays}<circle cx="${x}" cy="${y}" r="62" fill="${color}"/>
    <circle cx="${x - 20}" cy="${y - 10}" r="7" fill="#7a4a10"/><circle cx="${x + 20}" cy="${y - 10}" r="7" fill="#7a4a10"/>
    <path d="M${x - 20} ${y + 16} q20 18 40 0" fill="none" stroke="#7a4a10" stroke-width="6" stroke-linecap="round"/></g>`;
}

function cloud(x: number, y: number, s: number) {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".92">
    <ellipse cx="0" cy="0" rx="70" ry="34"/><ellipse cx="-50" cy="12" rx="50" ry="26"/><ellipse cx="56" cy="10" rx="54" ry="28"/><ellipse cx="10" cy="-24" rx="44" ry="34"/></g>`;
}

function clouds(seed: number) {
  const r = rand(seed);
  let s = '';
  for (let i = 0; i < 9; i++) s += cloud(-800 + i * 420 + r() * 200, -150 + r() * 330, 0.6 + r() * 0.7);
  return `<g data-clouds="1">${s}</g>`;
}

function hills(color: string, y: number, amp: number, seed: number) {
  // one tile 1600 wide whose ends meet, repeated by the layer
  const r = rand(seed);
  const n = 4;
  let d = `M0 ${y}`;
  for (let i = 0; i < n; i++) {
    const x0 = (i * W) / n;
    const h = amp * (0.6 + r() * 0.6);
    d += ` Q${x0 + W / n / 2} ${y - h * 2} ${x0 + W / n} ${y}`;
  }
  d += ` L${W} ${GROUND + 40} L0 ${GROUND + 40} Z`;
  return `<path d="${d}" fill="${color}"/>`;
}

function tree(x: number, y: number, s: number, dark: boolean) {
  const leaf = dark ? '#2e6b35' : '#4c9a44';
  const leaf2 = dark ? '#3b8042' : '#5fb052';
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-12" y="-120" width="24" height="120" rx="6" fill="#7a5232"/>
    <circle cx="0" cy="-170" r="72" fill="${leaf}"/><circle cx="-46" cy="-130" r="48" fill="${leaf}"/><circle cx="48" cy="-134" r="50" fill="${leaf}"/>
    <circle cx="-14" cy="-196" r="34" fill="${leaf2}"/></g>`;
}

function fir(x: number, y: number, s: number) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-10" y="-50" width="20" height="50" fill="#5d3b22"/>
    <path d="M0 -330 L70 -200 L36 -200 L96 -100 L56 -100 L116 -40 L-116 -40 L-56 -100 L-96 -100 L-36 -200 L-70 -200 Z" fill="#245a35"/></g>`;
}

function flower(x: number, y: number, color: string) {
  return `<g transform="translate(${x} ${y})"><path d="M0 0 v-26" stroke="#3d7a30" stroke-width="4"/>
    <circle cx="-6" cy="-30" r="6" fill="${color}"/><circle cx="6" cy="-30" r="6" fill="${color}"/><circle cx="0" cy="-36" r="6" fill="${color}"/><circle cx="0" cy="-24" r="6" fill="${color}"/><circle cx="0" cy="-30" r="4" fill="#ffeb3b"/></g>`;
}

function grassTuft(x: number, y: number, color: string) {
  return `<path d="M${x - 14} ${y} q4 -24 8 -30 q0 18 6 26 q4 -22 12 -34 q-2 22 2 34 q6 -14 14 -20 q-6 14 -4 24 z" fill="${color}"/>`;
}

/** front strip: grass, flowers, stones by the road (repeats every 1600) */
function mushroom(x: number, y: number, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-7 0 q-2 -14 0 -22 h14 q2 8 0 22 z" fill="#fff6e6" stroke="#5a3a22" stroke-width="2"/>
    <path d="M-24 -18 q24 -36 48 0 z" fill="#d32f2f" stroke="#5a3a22" stroke-width="2"/>
    <circle cx="-9" cy="-26" r="3.5" fill="#fff"/><circle cx="6" cy="-30" r="3" fill="#fff"/><circle cx="13" cy="-22" r="2.5" fill="#fff"/></g>`;
}

function verge(seed: number, forest: boolean, mushrooms = 0) {
  const r = rand(seed);
  let s = '';
  for (let i = 0; i < 26; i++) {
    const x = r() * W;
    const y = GROUND + 30 + r() * 110;
    const k = r();
    if (k < mushrooms) s += mushroom(x, y, 0.8 + r() * 0.6);
    else if (k < 0.5) s += grassTuft(x, y, forest ? '#2f6f2f' : '#4f9a3c');
    else if (k < 0.8) s += flower(x, y, ['#e53935', '#fdd835', '#8e24aa', '#ffffff', '#1e88e5'][Math.floor(r() * 5)]);
    else s += `<ellipse cx="${x}" cy="${y}" rx="${10 + r() * 12}" ry="${6 + r() * 6}" fill="#9e9a92"/>`;
  }
  return s;
}

function treeRow(seed: number, forest: boolean) {
  const r = rand(seed);
  let s = '';
  const n = forest ? 11 : 5;
  for (let i = 0; i < n; i++) {
    const x = (i + r() * 0.6) * (W / n);
    const y = GROUND - 30 - r() * 20;
    s += forest && r() < 0.55 ? fir(x, y, 0.8 + r() * 0.5) : tree(x, y, 0.8 + r() * 0.4, forest);
  }
  return s;
}

/** ground with the dirt road the tale goes along */
function ground(grass: string, road: string) {
  return `<rect x="-1600" y="${GROUND - 40}" width="4800" height="6000" fill="${grass}"/>
    <path d="M-1600 ${GROUND - 14} L3200 ${GROUND - 14} L3200 ${GROUND + 26} L-1600 ${GROUND + 26} Z" fill="${road}"/>`;
}

/** straw lines from the eaves up towards the ridge (inside the roof triangle) */
function thatch() {
  let s = '';
  for (let i = 0; i < 19; i++) {
    const x = 170 + i * 37;
    const k = 0.55 + (i % 3) * 0.12;
    s += `<path d="M${x} 412 L${x + (510 - x) * k} ${412 + (175 - 412) * k}" stroke="#c99a3e" stroke-width="4" stroke-linecap="round"/>`;
  }
  return s;
}

function hata(evening = false) {
  return `
  <!-- whitewashed house under a thatched roof -->
  <g>
    <rect x="160" y="${GROUND - 20}" width="700" height="34" rx="6" fill="#c9a77a"/>
    <path d="M200 ${GROUND - 4} L200 400 L820 400 L820 ${GROUND - 4} Z" fill="#fdfaf2" stroke="#d9cdb4" stroke-width="5"/>
    <path d="M200 ${GROUND - 40} L820 ${GROUND - 40}" stroke="#7aa6d8" stroke-width="16"/>
    <rect x="680" y="200" width="56" height="130" fill="#fdfaf2" stroke="#c4b79c" stroke-width="5"/>
    <rect x="672" y="190" width="72" height="18" rx="4" fill="#b23b2e"/>
    <path d="M130 420 Q510 120 890 420 Q510 380 130 420 Z" fill="#e2b45a"/>
    <path d="M130 420 L510 160 L890 420 Z" fill="#e2b45a" stroke="#b78630" stroke-width="6" stroke-linejoin="round"/>
    ${thatch()}
    <path d="M118 420 Q510 446 902 420 L894 436 Q510 462 126 436 Z" fill="#cf9d45"/>
    <!-- door -->
    <rect x="260" y="560" width="120" height="${GROUND - 564}" rx="10" fill="#8b5a2b" stroke="#5a3a22" stroke-width="5"/>
    <path d="M320 566 v${GROUND - 574}" stroke="#5a3a22" stroke-width="4"/>
    <circle cx="362" cy="670" r="7" fill="#f2c94c"/>
    <!-- window with shutters; the kolobok cools on its sill -->
    <rect x="530" y="460" width="180" height="134" fill="${evening ? '#ffd36b' : '#9fd3f0'}" stroke="#3b6aa0" stroke-width="8"/>
    <path d="M620 460 v134 M530 527 h180" stroke="#3b6aa0" stroke-width="6"/>
    <rect x="482" y="456" width="44" height="142" rx="4" fill="#3b6aa0"/>
    <rect x="714" y="456" width="44" height="142" rx="4" fill="#3b6aa0"/>
    <path d="M494 486 l20 20 l-20 20 M494 538 l20 20 l-20 20 M746 486 l-20 20 l20 20 M746 538 l-20 20 l20 20" stroke="#f5c542" stroke-width="5" fill="none"/>
    <rect x="506" y="596" width="228" height="18" rx="5" fill="#a0703c" stroke="#5a3a22" stroke-width="4"/>
    <!-- painted flowers on the wall -->
    ${flower(240, 520, '#d32f2f')}${flower(800, 520, '#d32f2f')}${flower(450, 700, '#1e88e5')}${flower(780, 700, '#d32f2f')}
  </g>`;
}

function wattleFence(x0: number, x1: number) {
  let s = '';
  for (let x = x0; x <= x1; x += 60) s += `<rect x="${x - 6}" y="${GROUND - 170}" width="12" height="170" rx="5" fill="#8b5a2b"/>`;
  for (let i = 0; i < 4; i++) {
    const y = GROUND - 150 + i * 34;
    s += `<path d="M${x0 - 10} ${y} Q${(x0 + x1) / 2} ${y + 10} ${x1 + 10} ${y}" stroke="#a87444" stroke-width="16" fill="none" stroke-linecap="round"/>`;
  }
  // pots hung on the stakes
  s += `<path d="M${x0 + 114} ${GROUND - 180} q-22 0 -22 24 q22 18 44 0 q0 -24 -22 -24z" fill="#c0542e"/>`;
  s += `<path d="M${x0 + 354} ${GROUND - 180} q-22 0 -22 24 q22 18 44 0 q0 -24 -22 -24z" fill="#2f6aa0"/>`;
  return s;
}

function sunflower(x: number, h: number) {
  let petals = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 360;
    petals += `<ellipse cx="0" cy="-34" rx="11" ry="22" fill="#fbc02d" transform="rotate(${a})"/>`;
  }
  return `<g transform="translate(${x} ${GROUND})"><path d="M0 0 V${-h}" stroke="#3d7a30" stroke-width="9"/>
    <path d="M0 ${-h * 0.5} q30 -30 54 -10 q-30 20 -54 10 M0 ${-h * 0.7} q-30 -26 -50 -6 q26 18 50 6" fill="#4c9a44"/>
    <g transform="translate(0 ${-h})">${petals}<circle r="26" fill="#6d4c2a"/></g></g>`;
}

function sea() {
  return `<rect x="-1600" y="${GROUND - 210}" width="4800" height="160" fill="#3f8fd2"/>
    <path d="M-1600 ${GROUND - 210} L3200 ${GROUND - 210}" stroke="#bfe3ff" stroke-width="6"/>
    <g data-waves="1">${Array.from({ length: 30 }, (_, i) => `<path d="M${-1600 + i * 170} ${GROUND - 150 + (i % 3) * 30} q20 -14 40 0 q20 -14 40 0" fill="none" stroke="#e3f3ff" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>
    <path d="M1180 ${GROUND - 214} l60 -6 l-8 -40 z M1190 ${GROUND - 214} h70 l-14 14 h-46z" fill="#fff"/>`;
}


function birch(x: number, y: number, s: number) {
  let marks = '';
  for (let i = 0; i < 6; i++) marks += `<path d="M${i % 2 ? 2 : -9} ${-30 - i * 36} h8" stroke="#2b2b2b" stroke-width="5" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-10" y="-250" width="20" height="250" rx="6" fill="#f7f5ef" stroke="#c9c4b8" stroke-width="2"/>${marks}
    <ellipse cx="0" cy="-270" rx="66" ry="80" fill="#8cc63f"/><ellipse cx="-40" cy="-230" rx="40" ry="44" fill="#7cb342"/><ellipse cx="42" cy="-236" rx="42" ry="46" fill="#9ccc65"/></g>`;
}

function birchRow(seed: number) {
  const r = rand(seed);
  let s = '';
  for (let i = 0; i < 7; i++) s += birch((i + r() * 0.5) * (W / 7), GROUND - 34 - r() * 10, 0.8 + r() * 0.35);
  return s;
}

/** Carpathian ridges with snow on the tops (one tile 1600 wide) */
function mountains(seed: number, color: string, y: number, h: number, snow: boolean) {
  const r = rand(seed);
  // the foot of the ridge reaches the meadow (no gap of sky under it)
  let s = `<rect x="0" y="${y - 2}" width="${W}" height="${GROUND - y + 10}" fill="${color}"/>`;
  const n = 5;
  for (let i = 0; i <= n; i++) {
    const cx = (i * W) / n + (i === 0 || i === n ? 0 : (r() - 0.5) * 120);
    const hh = h * (0.7 + r() * 0.5);
    const w = 260 + r() * 120;
    s += `<path d="M${cx - w} ${y} L${cx} ${y - hh} L${cx + w} ${y} Z" fill="${color}"/>`;
    if (snow) s += `<path d="M${cx - w * 0.22} ${y - hh * 0.78} L${cx} ${y - hh} L${cx + w * 0.22} ${y - hh * 0.78} L${cx + w * 0.08} ${y - hh * 0.72} L${cx - w * 0.06} ${y - hh * 0.8} Z" fill="#fff"/>`;
  }
  return s;
}

function firCluster(seed: number) {
  const r = rand(seed);
  let s = '';
  for (let i = 0; i < 6; i++) s += fir((i + r() * 0.4) * (W / 6), GROUND - 60 - r() * 30, 0.5 + r() * 0.3);
  return s;
}

/** a river along the road, behind it: reeds, lily pads and frogs */
function river(seed: number) {
  const r = rand(seed);
  let s = `<rect x="0" y="${GROUND - 120}" width="${W}" height="84" fill="#4aa3df"/>
    <path d="M0 ${GROUND - 120} H${W}" stroke="#bfe6ff" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) {
    const x = r() * W;
    const y = GROUND - 100 + r() * 50;
    s += `<path d="M${x} ${y} q16 -8 32 0" fill="none" stroke="#d6f0ff" stroke-width="4" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 4; i++) {
    const x = (i + r() * 0.6) * (W / 4);
    const y = GROUND - 70 + r() * 20;
    s += `<g transform="translate(${x} ${y})"><path d="M0 0 a26 12 0 1 0 1 0 l-1 -12 z" fill="#2e7d32"/>`;
    if (i % 2 === 0) s += `<ellipse cx="0" cy="-12" rx="16" ry="12" fill="#66bb6a"/><circle cx="-8" cy="-22" r="6" fill="#66bb6a"/><circle cx="8" cy="-22" r="6" fill="#66bb6a"/><circle cx="-8" cy="-23" r="3" fill="#222"/><circle cx="8" cy="-23" r="3" fill="#222"/>`;
    s += `</g>`;
  }
  for (let i = 0; i < 6; i++) {
    const x = (i + r()) * (W / 6);
    s += `<g transform="translate(${x} ${GROUND - 40})"><path d="M0 0 V-120 M14 0 V-100 M-12 0 V-90" stroke="#5d8f3a" stroke-width="5"/>
      <rect x="-5" y="-150" width="10" height="34" rx="5" fill="#7a4a24"/><rect x="9" y="-128" width="10" height="30" rx="5" fill="#7a4a24"/></g>`;
  }
  return s;
}

/** sunbeams through the dark forest */
function rays() {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const x = 200 + i * 330;
    s += `<path d="M${x} -200 L${x + 90} -200 L${x - 120} ${GROUND} L${x - 260} ${GROUND} Z" fill="#fffbe0" opacity=".12"/>`;
  }
  return s;
}

/** inside the hata: the whitewashed stove with a fire, the table, the bench and the window */
function interior(evening: boolean) {
  const F = GROUND - 40; // where the floor starts
  let planks = '';
  for (let x = -1600; x < 3200; x += 120) planks += `<path d="M${x} ${F} L${x - 300} 6000" stroke="#8a5e34" stroke-width="3"/>`;
  return `
  <rect x="-1600" y="-1200" width="4800" height="${F + 1200}" fill="#fbf6ea"/>
  <rect x="-1600" y="${F - 50}" width="4800" height="50" fill="#7aa6d8"/>
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#b07a45"/>${planks}
  <!-- wooden ceiling above the beam (seen on tall screens) -->
  <rect x="-1600" y="-3000" width="4800" height="2960" fill="#b98a5a"/>
  ${Array.from({ length: 40 }, (_, i) => `<path d="M${-1600 + i * 120} -3000 V-40" stroke="#9c7044" stroke-width="4"/>`).join('')}
  <rect x="-1600" y="-40" width="4800" height="70" fill="#7a5232"/>
  <!-- the stove -->
  <path d="M190 300 L230 -40 L330 -40 L370 300 Z" fill="#f4efe4" stroke="#d8cfbd" stroke-width="5"/>
  <rect x="40" y="300" width="520" height="${F - 300}" rx="16" fill="#fdfaf3" stroke="#d8cfbd" stroke-width="6"/>
  <rect x="24" y="286" width="552" height="30" rx="10" fill="#f4efe4" stroke="#d8cfbd" stroke-width="5"/>
  <rect x="40" y="${F - 60}" width="520" height="60" fill="#e9e1d0"/>
  <path d="M190 690 L190 560 Q300 470 410 560 L410 690 Z" fill="#3a2418"/>
  <ellipse data-glow="1" cx="300" cy="650" rx="120" ry="60" fill="#ff9a3c" opacity=".45"/>
  <g transform="translate(300 690)">
    <path data-flame="1" d="M-70 0 Q-80 -60 -50 -90 Q-40 -50 -20 -40 Q-30 -100 10 -130 Q10 -70 40 -60 Q40 -100 70 -110 Q90 -50 70 0 Z" fill="#ff7a1a"/>
    <path data-flame="1" d="M-40 0 Q-50 -40 -24 -64 Q-16 -34 0 -30 Q-6 -70 20 -90 Q24 -44 46 -36 Q60 -20 40 0 Z" fill="#ffd23f"/>
    <rect x="-80" y="-12" width="160" height="16" rx="6" fill="#6d4426"/>
  </g>
  <rect x="160" y="690" width="280" height="18" rx="6" fill="#e9e1d0" stroke="#d8cfbd" stroke-width="4"/>
  <!-- petrykivka on the stove -->
  <g fill="none" stroke-linecap="round">
    <path d="M90 600 q30 -60 70 -40" stroke="#3d7a30" stroke-width="6"/><path d="M500 600 q-30 -60 -70 -40" stroke="#3d7a30" stroke-width="6"/>
    <path d="M110 380 q60 -30 120 0 M370 380 q60 -30 120 0" stroke="#3d7a30" stroke-width="6"/>
  </g>
  ${flower(160, 560, '#d32f2f')}${flower(440, 560, '#1e88e5')}${flower(170, 380, '#d32f2f')}${flower(300, 360, '#f5a623')}${flower(430, 380, '#d32f2f')}
  <!-- pots by the fire -->
  <path d="M470 690 q-30 0 -30 -30 q0 -26 30 -30 q30 4 30 30 q0 30 -30 30z" fill="#c0542e" stroke="#7a3a1e" stroke-width="4"/>
  <path d="M110 690 q-26 0 -26 -26 q0 -22 26 -26 q26 4 26 26 q0 26 -26 26z" fill="#2f6aa0" stroke="#1d466e" stroke-width="4"/>
  <!-- a rushnyk draped on a peg above the table -->
  <circle cx="910" cy="180" r="8" fill="#7a5232"/>
  <path d="M760 200 Q910 270 1060 200" fill="none" stroke="#e5ddc9" stroke-width="34" stroke-linecap="round"/>
  <path d="M760 200 Q910 270 1060 200" fill="none" stroke="#fff" stroke-width="28" stroke-linecap="round"/>
  <path d="M752 196 L740 330 L782 334 L780 206 Z M1068 196 L1080 330 L1038 334 L1040 206 Z" fill="#fff" stroke="#e5ddc9" stroke-width="3"/>
  ${stitchBand(740, 300, 42)}${stitchBand(1038, 300, 42)}
  <path d="M742 330 v14 M752 331 v14 M762 332 v14 M772 333 v14 M1040 333 v14 M1050 332 v14 M1060 331 v14 M1070 330 v14" stroke="#c62828" stroke-width="3"/>
  <!-- table with a cloth -->
  <rect x="770" y="620" width="16" height="${F - 620 + 30}" fill="#6d4426"/><rect x="1034" y="620" width="16" height="${F - 620 + 30}" fill="#6d4426"/>
  <path d="M740 600 H1080 L1070 660 H750 Z" fill="#fff" stroke="#e5ddc9" stroke-width="4"/>
  ${stitchBand(752, 640, 316)}
  <!-- bench under the window -->
  <rect x="1130" y="680" width="420" height="22" rx="6" fill="#8b5a2b"/><rect x="1150" y="700" width="16" height="${F - 700 + 30}" fill="#6d4426"/><rect x="1514" y="700" width="16" height="${F - 700 + 30}" fill="#6d4426"/>
  <!-- the window -->
  <rect x="1190" y="300" width="250" height="220" fill="${evening ? '#1f2d5c' : '#9fd3f0'}" stroke="#3b6aa0" stroke-width="10"/>
  ${evening ? '<circle cx="1390" cy="350" r="22" fill="#fff6c8"/><circle cx="1240" cy="340" r="3" fill="#fff"/><circle cx="1290" cy="380" r="2.5" fill="#fff"/><circle cx="1350" cy="420" r="3" fill="#fff"/>' : '<circle cx="1390" cy="350" r="26" fill="#ffd54f"/><ellipse cx="1260" cy="400" rx="44" ry="18" fill="#fff"/>'}
  <path d="M1315 300 v220 M1190 410 h250" stroke="#3b6aa0" stroke-width="7"/>
  <rect x="1172" y="522" width="286" height="18" rx="5" fill="#a0703c" stroke="#5a3a22" stroke-width="4"/>
  ${evening ? '<rect x="-1600" y="-1200" width="4800" height="8000" fill="#24184a" opacity=".22"/><ellipse cx="300" cy="650" rx="420" ry="300" fill="#ffb347" opacity=".12"/>' : ''}`;
}

/** a cross-stitch band (as on the puppets' shirts) */
function stitchBand(x: number, y: number, w: number) {
  let s = '';
  for (let i = 0; i * 14 + 14 <= w; i++) s += `<path d="M${x + i * 14 + 7} ${y + 1} l6 6 -6 6 -6 -6z" fill="${i % 2 ? '#1f1a17' : '#c62828'}"/>`;
  return s;
}

interface Backdrop {
  /** drawn once, does not slide */
  still: string;
  /** sliding layers, back to front: [markup of one 1600 tile, speed] */
  layers: [string, number][];
}

const BACKDROPS: Record<string, () => Backdrop> = {
  hata: () => ({
    still:
      sky('#7cc4f2', '#d6f0ff') +
      sun(1380, 230) +
      clouds(3) +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#9ccc65', GROUND - 120, 60, 7)}</g>`).join('') +
      ground('#7cb342', '#c9a77a') +
      wattleFence(920, 1580) +
      sunflower(960, 300) +
      sunflower(1450, 330) +
      sunflower(1540, 280) +
      hata() +
      `<g>${verge(11, false)}</g>`,
    layers: [],
  }),
  road: () => ({
    still: sky('#7cc4f2', '#d6f0ff') + sun(1380, 230) + clouds(5),
    layers: [
      [hills('#a5d6a7', GROUND - 150, 70, 2), 0.12],
      [hills('#81c784', GROUND - 90, 50, 4), 0.25],
      [treeRow(8, false), 0.5],
      [ground('#7cb342', '#c9a77a') + verge(9, false), 1],
    ],
  }),
  forest: () => ({
    still: sky('#8fc8e8', '#e3f4e8') + sun(1400, 225) + clouds(6),
    layers: [
      [hills('#6fa77a', GROUND - 160, 80, 12), 0.12],
      [treeRow(21, true), 0.3],
      [treeRow(22, true), 0.55],
      [ground('#5d9b3c', '#b8946a') + verge(23, true), 1],
    ],
  }),
  pich: () => ({ still: interior(false), layers: [] }),
  'pich-evening': () => ({ still: interior(true), layers: [] }),
  'hata-evening': () => ({
    still:
      sky('#f08a5d', '#ffd3a0') +
      sun(1300, 640, '#ffb74d') +
      clouds(4) +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#7fae55', GROUND - 120, 60, 7)}</g>`).join('') +
      ground('#6a9e3a', '#bf9a6c') +
      wattleFence(920, 1580) +
      sunflower(960, 300) +
      sunflower(1450, 330) +
      sunflower(1540, 280) +
      hata(true) +
      `<g>${verge(11, false)}</g>` +
      `<rect x="-1600" y="-1200" width="4800" height="8000" fill="#ff7043" opacity=".08"/>`,
    layers: [],
  }),
  river: () => ({
    still: sky('#7cc4f2', '#e0f4ff') + sun(1380, 230) + clouds(9),
    layers: [
      [hills('#a5d6a7', GROUND - 170, 70, 41), 0.1],
      [treeRow(42, false), 0.3],
      [river(43), 0.7],
      [ground('#7cb342', '#c9a77a') + verge(44, false), 1],
    ],
  }),
  deep: () => ({
    still: sky('#4f7d6a', '#a9cbb0') + clouds(12).replace('opacity=".92"', 'opacity=".35"'),
    layers: [
      [treeRow(51, true), 0.15],
      [rays(), 0.2],
      [treeRow(52, true), 0.35],
      [treeRow(53, true), 0.6],
      [ground('#3f7a32', '#9c7a55') + verge(54, true, 0.3), 1],
    ],
  }),
  glade: () => ({
    still: sky('#86cdf5', '#eaf8ff') + sun(1400, 230) + clouds(14),
    layers: [
      [hills('#9ccc65', GROUND - 140, 50, 61), 0.12],
      [birchRow(62), 0.4],
      [ground('#8bc34a', '#d2b080') + verge(63, false, 0.2) + verge(64, false), 1],
    ],
  }),
  mountains: () => ({
    still: sky('#8ecdf2', '#e8f6ff') + sun(1380, 230) + clouds(15),
    layers: [
      [mountains(71, '#8aa7c7', GROUND - 120, 420, true), 0.05],
      [mountains(72, '#6f9a7c', GROUND - 80, 260, false), 0.15],
      [firCluster(73), 0.35],
      [ground('#7cb342', '#c9a77a') + verge(74, false), 1],
    ],
  }),
  sea: () => ({
    still: sky('#ffb26b', '#ffe3b3') + sun(1240, 340, '#ffcc4d') + clouds(8) + sea(),
    layers: [[ground('#8bbf5a', '#d9b98a') + verge(31, false), 1]],
  }),
};

// ---------- the stage ----------

export class Stage {
  readonly svg: SVGSVGElement;
  private backdrop: SVGGElement;
  private layerEls: { el: SVGGElement; speed: number }[] = [];
  private actorsLayer: SVGGElement;
  private frontLayer: SVGGElement;
  private fxLayer: SVGGElement;
  private actors = new Map<string, Actor>();
  private particles: Particle[] = [];
  private rolling = false;
  /** 0 → 1: the road eases into rolling and out of it */
  private rollAmount = 0;
  private scroll = 0;
  private time = 0;
  private last = 0;
  private sceneName = '';
  private singing: Actor | null = null;
  /** the stove's fire in the hata: flames flicker, `fire` > 1 while it roars (baking) */
  private flames: SVGElement[] = [];
  private glow: SVGElement | null = null;
  private fire = 1;
  private noteIn = 0;
  /** speed multiplier for tests (window.tale.fast) */
  speed = 1;
  /** the pause button: stage time stands still — puppets, effects and waits all freeze */
  paused = false;

  constructor(host: HTMLElement) {
    this.svg = el('svg', { viewBox: `0 ${VIEW_TOP} ${W} ${VIEW_H}`, preserveAspectRatio: 'xMidYMin meet', class: 'stage' });
    this.backdrop = el('g');
    this.actorsLayer = el('g');
    this.frontLayer = el('g');
    this.fxLayer = el('g', { 'pointer-events': 'none' });
    this.svg.append(this.backdrop, this.actorsLayer, this.frontLayer, this.fxLayer);
    host.appendChild(this.svg);
    this.frame();
    window.addEventListener('resize', () => this.frame());
    // a tap on a puppet makes it jump for joy
    this.svg.addEventListener('click', (e) => {
      const g = (e.target as Element).closest('[data-actor]');
      const a = g && this.actors.get(g.getAttribute('data-actor')!);
      if (a && !a.move && a.bounce <= 0) a.bounce = 1;
    });
    const frame = (now: number) => {
      const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0;
      this.last = now;
      this.tick(this.paused ? 0 : dt * this.speed);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /**
   * Fit the frame to the screen: landscape shows the whole 1600 width; portrait closes in on the
   * characters, and the free space under the scene (meadow) is for subtitles and buttons. The
   * scene's height on screen goes to CSS as --scene-h.
   */
  private frame() {
    const w = this.svg.clientWidth || window.innerWidth;
    const h = this.svg.clientHeight || window.innerHeight;
    this.screen = [w, h];
    this.portrait = h > w;
    const sceneH = this.portrait ? h * PORTRAIT_SCENE : Math.min(h, (w / W) * VIEW_H);
    const root = document.documentElement;
    root.style.setProperty('--scene-h', `${Math.round(sceneH)}px`);
    root.classList.toggle('portrait', this.portrait);
    this.camera(0, true);
  }

  private screen: [number, number] = [0, 0];
  private portrait = false;
  /** the camera: centre and width of what it frames, in scene units */
  private camX = 850;
  private camW = 1100;
  private snapCam = false;

  /** Frame the characters on stage, easing towards them (snap: at once). */
  private camera(dt: number, snap = false) {
    let lo = Infinity;
    let hi = -Infinity;
    for (const a of this.actors.values()) {
      // ones walking off far away don't drag the camera along
      if (a.x < -60 || a.x > W + 60) continue;
      lo = Math.min(lo, a.x);
      hi = Math.max(hi, a.x);
    }
    const [w, h] = this.screen;
    const p = this.portrait;
    // the scene's part of the screen, and where the road is in it
    const sceneH = p ? h * PORTRAIT_SCENE : h;
    const groundAt = p ? PORTRAIT_GROUND : h < 520 ? LOW_GROUND : LANDSCAPE_GROUND;
    // wide enough for the heads to fit between the road and the subtitles / round buttons up top
    const topUi = p ? 76 : h < 520 ? 66 : 100;
    const tallEnough = (HEADROOM * w) / Math.max(1, sceneH * groundAt - topUi);
    const minW = Math.max(p ? CAM_MIN_W : CAM_MIN_W_LANDSCAPE, w / (p ? CAM_MAX_SCALE : CAM_MAX_SCALE_LANDSCAPE), tallEnough);
    let tx = W / 2;
    let tw = Math.max(minW, p ? 1100 : W);
    if (lo <= hi) {
      tw = Math.max(minW, Math.min(W, hi - lo + 2 * CAM_MARGIN));
      tx = (lo + hi) / 2;
    }
    if (this.snapCam && lo <= hi) {
      this.snapCam = false;
      snap = true;
    }
    if (snap) {
      this.camX = tx;
      this.camW = tw;
    } else {
      const k = Math.min(1, dt * 1.6);
      this.camX += (tx - this.camX) * k;
      this.camW += (tw - this.camW) * k;
    }
    const vh = this.camW * (sceneH / w);
    const vy = GROUND - vh * groundAt;
    // the rest of the screen below the scene shows more meadow (the backdrop goes far down)
    this.svg.setAttribute('viewBox', `${(this.camX - this.camW / 2).toFixed(1)} ${vy.toFixed(1)} ${this.camW.toFixed(1)} ${vh.toFixed(1)}`);
  }

  get scene() {
    return this.sceneName;
  }

  /** Change the backdrop; every puppet leaves the stage. */
  setScene(name: string) {
    const make = BACKDROPS[name];
    if (!make) throw new Error(`no scene "${name}"`);
    const b = make();
    this.sceneName = name;
    // the tale screen may have been hidden (size 0) when the window last changed shape
    this.frame();
    // a new place: the camera jumps to whoever comes on first instead of sliding over
    this.snapCam = true;
    while (this.backdrop.firstChild) this.backdrop.removeChild(this.backdrop.firstChild);
    this.backdrop.appendChild(svg(b.still));
    this.layerEls = b.layers.map(([markup, speed]) => {
      // the tile four times: -1600…4800, enough for any screen shape while sliding
      const g = svg([-1, 0, 1, 2].map((i) => `<g transform="translate(${i * W} 0)">${markup}</g>`).join(''));
      this.backdrop.appendChild(g);
      return { el: g, speed };
    });
    this.flames = Array.prototype.slice.call(this.backdrop.querySelectorAll('[data-flame]'));
    this.glow = this.backdrop.querySelector('[data-glow]');
    this.fire = 1;
    for (const id of [...this.actors.keys()]) this.hide(id);
    for (const p of this.particles) p.el.remove();
    this.particles = [];
    this.rolling = false;
    this.rollAmount = 0;
    this.scroll = 0;
    this.singing = null;
  }

  show(id: string, at: Point, flip = false, eyesOpen = true, raw = false) {
    this.hide(id);
    const g = makePuppet(id);
    const body = g.querySelector('[data-part="body"]') as SVGGElement;
    const part = (name: string) => g.querySelector(`[data-part="${name}"]`) as SVGGElement | null;
    const a: Actor = {
      id,
      g,
      body,
      x: at[0],
      y: at[1],
      flip,
      move: null,
      talking: false,
      mouthT: 0,
      eyesOpen: true,
      blinkIn: 1 + Math.random() * 3,
      blinkLeft: 0,
      crust: 0,
      bounce: 0,
      phase: Math.random() * 10,
      scale: 1,
      carriedBy: null,
      parts: {
        eyes: part('eyes'),
        eyesClosed: part('eyes-closed'),
        mouthOpen: part('mouth-open'),
        mouthClosed: part('mouth-closed'),
        crust: part('crust'),
        ears: part('ears'),
        face: part('face'),
        raw: part('raw'),
      },
    };
    (id === 'bush' ? this.frontLayer : this.actorsLayer).appendChild(g);
    this.actors.set(id, a);
    this.setEyes(id, eyesOpen);
    if (raw && a.parts.raw) a.parts.raw.setAttribute('opacity', '1');
    this.place(a);
  }

  hide(id: string) {
    const a = this.actors.get(id);
    if (!a) return;
    a.move?.done();
    a.g.remove();
    this.actors.delete(id);
    if (this.singing === a) this.singing = null;
  }

  has(id: string) {
    return this.actors.has(id);
  }

  /** Resolves when the puppet gets there (at once if it is not on stage). */
  moveTo(id: string, to: Point, ms: number, opts: { hop?: boolean; roll?: boolean; flip?: boolean } = {}): Promise<void> {
    const a = this.actors.get(id);
    if (!a) return Promise.resolve();
    a.move?.done();
    a.carriedBy = null;
    if (opts.flip !== undefined) a.flip = opts.flip;
    return new Promise((resolve) => {
      const m: Move = {
        from: [a.x, a.y],
        to,
        t: 0,
        ms,
        hop: !!opts.hop,
        roll: !!opts.roll,
        done: () => {
          if (a.move === m) a.move = null;
          resolve();
        },
      };
      a.move = m;
    });
  }

  /** `by` picks the puppet up: it rides in their hands, in front of them */
  carry(id: string, by: string) {
    const a = this.actors.get(id);
    const c = this.actors.get(by);
    if (!a || !c || !ANCHORS[by].hands) return;
    a.move?.done();
    a.carriedBy = c;
    a.g.parentNode!.appendChild(a.g);
  }

  setRolling(on: boolean) {
    this.rolling = on;
  }

  setEyes(id: string, open: boolean) {
    const a = this.actors.get(id);
    if (!a) return;
    a.eyesOpen = open;
    if (a.parts.eyes) a.parts.eyes.style.display = open ? '' : 'none';
    if (a.parts.eyesClosed) a.parts.eyesClosed.style.display = open ? 'none' : '';
    // playing a stone: no smile either
    if (id === 'kolobok' && a.parts.mouthClosed) a.parts.mouthClosed.style.display = open ? '' : 'none';
  }

  setTalking(id: string | null, sing = false) {
    for (const a of this.actors.values()) {
      const on = a.id === id;
      a.talking = on;
      if (!on) this.mouth(a, false);
    }
    this.singing = sing && id ? this.actors.get(id) || null : null;
    this.noteIn = 0;
  }

  /** Where a puppet's anchor is on the stage right now. */
  private anchor(a: Actor, which: 'mouth' | 'top'): Point {
    const an = ANCHORS[a.id];
    if (which === 'top') return [a.x, a.y + an.top];
    return [a.x + an.mouth[0] * (a.flip ? -1 : 1), a.y + an.mouth[1]];
  }

  // ---------- effects ----------

  fx(name: string, on?: string, at?: Point): Promise<void> {
    const a = on ? this.actors.get(on) : undefined;
    switch (name) {
      case 'flour': {
        const [x, y] = at || (a ? this.anchor(a, 'mouth') : [900, 600]);
        for (let i = 0; i < 14; i++) this.later(i * 0.12, () => this.dust(x + (Math.random() - 0.5) * 120, y));
        return this.wait(1600);
      }
      case 'bake': {
        // the fire roars, the dough turns golden
        const k = a;
        const t0 = this.time;
        const step = () => {
          const p = Math.min(1, (this.time - t0) / 2.4);
          this.fire = 1 + Math.sin(p * Math.PI) * 0.6;
          if (k && k.parts.raw) k.parts.raw.setAttribute('opacity', (1 - p).toFixed(3));
          if (p < 1) this.later(0, step);
        };
        step();
        return this.wait(2400);
      }
      case 'smoke':
        for (let i = 0; i < 9; i++) this.later(i * 0.35, () => this.puff(708, 196));
        return this.wait(2400);
      case 'sparkle': {
        const [x, y] = a ? this.anchor(a, 'top') : [800, 300];
        for (let i = 0; i < 12; i++) this.star(x, y + 40, (i / 12) * Math.PI * 2);
        return this.wait(900);
      }
      case 'hearts': {
        const [x, y] = a ? this.anchor(a, 'top') : [800, 400];
        for (let i = 0; i < 7; i++) this.later(i * 0.25, () => this.heart(x + (Math.random() - 0.5) * 120, y));
        return this.wait(1600);
      }
      case 'chomp':
        return this.chomp(a);
    }
    throw new Error(`no effect "${name}"`);
  }

  private timers: { at: number; fn: () => void }[] = [];
  private later(sec: number, fn: () => void) {
    this.timers.push({ at: this.time + sec, fn });
  }
  /** a pause in stage time (faster in tests) */
  wait(ms: number): Promise<void> {
    return new Promise((r) => this.later(ms / 1000, r));
  }

  private particle(node: SVGElement, life: number, update: Particle['update']) {
    this.fxLayer.appendChild(node);
    const p: Particle = { el: node, t: 0, life, update };
    this.particles.push(p);
    update(p, 0);
  }

  private puff(x: number, y: number) {
    const c = el('circle', { r: 20, fill: '#e9e4dc' });
    const drift = (Math.random() - 0.3) * 60;
    this.particle(c, 3, (p, k) => {
      c.setAttribute('cx', String(x + drift * k + Math.sin(k * 6) * 10));
      c.setAttribute('cy', String(y - k * 230));
      c.setAttribute('r', String(18 + k * 40));
      c.setAttribute('opacity', String(0.9 * (1 - k)));
    });
  }

  private star(x: number, y: number, angle: number) {
    const s = el('path', { d: 'M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z', fill: '#ffe066' });
    this.particle(s, 1.1, (p, k) => {
      const r = 30 + k * 110;
      s.setAttribute('transform', `translate(${x + Math.cos(angle) * r} ${y + Math.sin(angle) * r}) rotate(${k * 180}) scale(${1.2 - k})`);
      s.setAttribute('opacity', String(1 - k * k));
    });
  }

  private dust(x: number, y: number) {
    const c = el('circle', { r: 10, fill: '#ffffff' });
    const vx = (Math.random() - 0.5) * 80;
    this.particle(c, 1.4, (p, k) => {
      c.setAttribute('cx', String(x + vx * k));
      c.setAttribute('cy', String(y - k * 90));
      c.setAttribute('r', String(8 + k * 26));
      c.setAttribute('opacity', String(0.85 * (1 - k)));
    });
  }

  private heart(x: number, y: number) {
    const h = el('path', { d: 'M0 10 C-26 -8 -14 -30 0 -16 C14 -30 26 -8 0 10 Z', fill: '#ef5370' });
    const sway = Math.random() * 6;
    this.particle(h, 2, (p, k) => {
      h.setAttribute('transform', `translate(${x + Math.sin(k * 6 + sway) * 20} ${y - k * 200}) scale(${1 + k})`);
      h.setAttribute('opacity', String(1 - k));
    });
  }

  private note(x: number, y: number) {
    const glyph = Math.random() < 0.5 ? '♪' : '♫';
    const t = el('text', { 'font-size': 54, fill: ['#6a1b9a', '#1565c0', '#c62828', '#2e7d32'][Math.floor(Math.random() * 4)], 'font-weight': 700 }, [glyph]);
    const dx = 60 + Math.random() * 60;
    this.particle(t, 2.2, (p, k) => {
      t.setAttribute('transform', `translate(${x + dx * k} ${y - 30 - k * 190}) rotate(${Math.sin(k * 8) * 15})`);
      t.setAttribute('opacity', String(k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85));
    });
  }

  /** the fox: mouth wide open, the kolobok vanishes into it, crumbs fly */
  private chomp(fox?: Actor): Promise<void> {
    const k = this.actors.get('kolobok');
    if (!fox || !k) return this.wait(500);
    const [mx, my] = this.anchor(fox, 'mouth');
    this.mouth(fox, true);
    const from: Point = [k.x, k.y];
    const t0 = this.time;
    const shrink = () => {
      const p = Math.min(1, (this.time - t0) / 0.35);
      k.x = from[0] + (mx - from[0]) * p;
      k.y = from[1] + (my + 20 - from[1]) * p;
      k.scale = 1 - p;
      if (p < 1) this.later(0, shrink);
      else {
        this.hide('kolobok');
        this.mouth(fox, false);
        for (let i = 0; i < 10; i++) this.crumb(mx, my);
        fox.bounce = 1;
      }
    };
    shrink();
    return this.wait(700);
  }

  private crumb(x: number, y: number) {
    const c = el('circle', { r: 6 + Math.random() * 5, fill: '#f4b23f' });
    const vx = (Math.random() - 0.5) * 300;
    const vy = -150 - Math.random() * 200;
    this.particle(c, 1, (p, k) => {
      const t = k;
      c.setAttribute('cx', String(x + vx * t));
      c.setAttribute('cy', String(y + vy * t + 500 * t * t));
      c.setAttribute('opacity', String(1 - k));
    });
  }

  // ---------- the frame ----------

  private mouth(a: Actor, open: boolean) {
    if (a.parts.mouthOpen) a.parts.mouthOpen.style.display = open ? '' : 'none';
    if (a.parts.mouthClosed && !(a.id === 'kolobok' && !a.eyesOpen)) a.parts.mouthClosed.style.display = open ? 'none' : '';
  }

  private place(a: Actor) {
    a.g.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) scale(${(a.flip ? -a.scale : a.scale).toFixed(3)} ${a.scale.toFixed(3)})`);
  }

  private tick(dt: number) {
    this.time += dt;
    const due = this.timers.filter((t) => t.at <= this.time);
    if (due.length) {
      this.timers = this.timers.filter((t) => t.at > this.time);
      for (const t of due) t.fn();
    }

    // the road eases in and out of rolling
    this.rollAmount += ((this.rolling ? 1 : 0) - this.rollAmount) * Math.min(1, dt * 3);
    const slide = ROLL_SPEED * this.rollAmount * dt;
    this.scroll += slide;
    for (const l of this.layerEls) l.el.setAttribute('transform', `translate(${(-(this.scroll * l.speed) % W).toFixed(1)} 0)`);

    // carried puppets last: they follow where their carrier has just moved
    for (const a of this.actors.values()) if (!a.carriedBy) this.tickActor(a, dt, slide);
    for (const a of this.actors.values()) if (a.carriedBy) this.tickActor(a, dt, slide);
    this.camera(dt);

    this.flames.forEach((f, i) => {
      const t = this.time * (7 + i * 3);
      const sy = (0.85 + Math.sin(t) * 0.08 + Math.sin(t * 2.3) * 0.06) * this.fire;
      const sx = 1 + Math.sin(t * 1.7) * 0.05 + (this.fire - 1) * 0.3;
      f.setAttribute('transform', `scale(${sx.toFixed(3)} ${sy.toFixed(3)})`);
    });
    if (this.glow) this.glow.setAttribute('opacity', (0.35 * this.fire + Math.sin(this.time * 9) * 0.06).toFixed(3));

    if (this.singing) {
      this.noteIn -= dt;
      if (this.noteIn <= 0) {
        this.noteIn = 0.45;
        const [x, y] = this.anchor(this.singing, 'mouth');
        this.note(x, y);
      }
    }

    for (const p of this.particles) {
      p.t += dt;
      p.update(p, Math.min(1, p.t / p.life));
    }
    const dead = this.particles.filter((p) => p.t >= p.life);
    if (dead.length) {
      for (const p of dead) p.el.remove();
      this.particles = this.particles.filter((p) => p.t < p.life);
    }
  }

  private tickActor(a: Actor, dt: number, slide: number) {
    a.phase += dt;
    if (a.carriedBy) {
      const c = a.carriedBy;
      if (!this.actors.has(c.id)) a.carriedBy = null;
      else {
        const h = ANCHORS[c.id].hands!;
        // bobbing along with the carrier's steps
        const step = c.move && !c.move.hop ? Math.abs(Math.sin(c.phase * 9)) * 9 : 0;
        a.x = c.x + h[0];
        a.y = c.y + h[1] - step;
      }
    }
    let lift = 0;
    let lean = 0;
    let dx = 0;
    if (a.move) {
      const m = a.move;
      m.t += dt * 1000;
      const k = Math.min(1, m.t / m.ms);
      // ease in and out, but keep walking speed even through the middle
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const nx = m.from[0] + (m.to[0] - m.from[0]) * (m.roll ? k : e);
      const ny = m.from[1] + (m.to[1] - m.from[1]) * e;
      dx = nx - a.x;
      a.x = nx;
      a.y = ny;
      const dist = Math.hypot(m.to[0] - m.from[0], m.to[1] - m.from[1]);
      if (m.hop) {
        const hops = Math.max(1, Math.round(dist / 220));
        lift = Math.abs(Math.sin(k * Math.PI * hops)) * (dist < 300 ? 90 : 60);
      } else if (!m.roll) {
        lift = Math.abs(Math.sin(a.phase * 9)) * 9;
        lean = Math.sin(a.phase * 9) * 2;
      }
      if (k >= 1) m.done();
    }
    if (a.bounce > 0) {
      a.bounce = Math.max(0, a.bounce - dt * 2.2);
      lift += Math.sin((1 - a.bounce) * Math.PI) * 50;
    }

    // the kolobok's crust turns with the distance rolled — his own, and the road's under him
    if (a.parts.crust) {
      const rolled = (a.move && a.move.roll ? dx : 0) + (a.id === 'kolobok' ? slide : 0);
      a.crust += (rolled / KOLOBOK_R) * (180 / Math.PI) * (a.flip ? -1 : 1);
      const c = a.parts.crust;
      c.setAttribute('transform', `rotate(${a.crust.toFixed(1)} ${c.getAttribute('data-cx')} ${c.getAttribute('data-cy')})`);
      // rolling fast, the face wobbles a little
      if (a.parts.face) a.parts.face.setAttribute('transform', `translate(0 ${(Math.abs(rolled) > 0.5 ? Math.sin(a.phase * 20) * 2 : 0).toFixed(1)})`);
    }

    const breathe = 1 + Math.sin(a.phase * 2.2) * 0.012;
    a.body.setAttribute('transform', `translate(0 ${(-lift).toFixed(1)}) rotate(${lean.toFixed(2)}) scale(${(2 - breathe).toFixed(4)} ${breathe.toFixed(4)})`);

    // blink
    const eyes = a.parts.eyes;
    if (eyes && a.eyesOpen) {
      a.blinkIn -= dt;
      if (a.blinkIn <= 0) {
        a.blinkLeft = 0.13;
        a.blinkIn = 2.5 + Math.random() * 3;
      }
      if (a.blinkLeft > 0) {
        a.blinkLeft -= dt;
        const cy = Number(eyes.getAttribute('data-cy'));
        eyes.setAttribute('transform', a.blinkLeft > 0 ? `translate(0 ${cy}) scale(1 0.1) translate(0 ${-cy})` : '');
      }
    }

    // speaking: the mouth opens and closes
    if (a.talking) {
      a.mouthT -= dt;
      if (a.mouthT <= 0) {
        const open = a.parts.mouthOpen?.style.display === 'none';
        this.mouth(a, open);
        a.mouthT = open ? 0.09 + Math.random() * 0.1 : 0.06 + Math.random() * 0.08;
      }
    }

    // the hare's ears twitch now and then
    if (a.parts.ears) {
      const tw = Math.max(0, Math.sin(a.phase * 1.3) - 0.85) * 40;
      const ears = a.parts.ears;
      ears.setAttribute('transform', `rotate(${(-tw).toFixed(1)} ${ears.getAttribute('data-cx')} ${ears.getAttribute('data-cy')})`);
    }

    this.place(a);
  }
}
