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
 * Old iPads (iOS 12 and older, or two cores): lighter animation — 30 frames a second, fewer
 * snowflakes, no see-through sunbeams, and the characters stand still unless they are doing
 * something. Repainting a big SVG every frame is what makes them stutter. ?lowend forces it (testing).
 */
const LOW_END = (() => {
  const m = navigator.userAgent.match(/(?:iPad|iPhone|iPod).*? OS (\d+)_/);
  return (!!m && Number(m[1]) < 13) || (navigator.hardwareConcurrency || 4) <= 2 || /[?&]lowend/.test(location.search);
})();

/**
 * Old iPads: a sliding layer of the backdrop (hundreds of trees, grass, flowers) is turned into one
 * picture — an SVG image the browser paints once and then only moves, instead of repainting every
 * tree on every frame. The tile is drawn with its neighbours on both sides so that trees crossing
 * the tile's edge aren't cut. The endless ground under the front layer is cut short in the picture
 * and drawn as a plain still rectangle below it.
 */
const LAYER_TOP = -300;
const LAYER_H = GROUND + 400 - LAYER_TOP;
const flatCache = new Map<string, { url: string; below: string }>();
function flattenLayer(markup: string) {
  const hit = flatCache.get(markup);
  if (hit) return hit;
  let below = '';
  const m = markup.replace(/<rect x="-1600" y="([\d.-]+)" width="4800" height="6000" fill="([^"]+)"\/>/, (_all, y: string, fill: string) => {
    below = `<rect x="-1600" y="${GROUND + 380}" width="4800" height="6000" fill="${fill}"/>`;
    return `<rect x="-1600" y="${y}" width="4800" height="${GROUND + 420 - Number(y)}" fill="${fill}"/>`;
  });
  const body = [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${m}</g>`).join('');
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${LAYER_H}" viewBox="0 ${LAYER_TOP} ${W} ${LAYER_H}">${body}</svg>`;
  const v = { url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(doc), below };
  flatCache.set(markup, v);
  return v;
}

/** set an attribute only when it changes (Safari repaints on every write, even of the same value) */
function setAttr(e: Element, name: string, value: string) {
  const cache = e as unknown as Record<string, string>;
  const k = '__' + name;
  if (cache[k] === value) return;
  cache[k] = value;
  e.setAttribute(name, value);
}
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
  /** grows with the animals inside (the mitten), or from nothing (the snow house being built) */
  size: number;
  /** a squash-and-stretch wobble, 1 → 0 (the mitten when someone moves in) */
  wobble: number;
  /** a thing, not a creature: doesn't walk or blink */
  prop: boolean;
  /** lying down: 'lie' — flat (the wolf behind the log), 'roll' — rolling side to side (the cat, full of presents) */
  pose: '' | 'lie' | 'roll';
  /** tumbling head over heels: degrees still to turn, and how fast */
  spin: number;
  spinSpeed: number;
}

/** things on stage rather than characters */
const PROPS = ['bush', 'bush2', 'rukavychka', 'rvana', 'khatka', 'khatynka', 'kapusta', 'dub', 'koloda', 'skatertyna', 'ryba', 'med', 'malyna', 'koshyk', 'stil', 'snip', 'snip2', 'halushky', 'dytyna', 'pyrizhok', 'sanky', 'lamani', 'drova', 'viz', 'lunka', 'vudka', 'chovnyk', 'kolyska', 'kovadlo', 'lopata', 'yavir', 'gusy', 'gusy2', 'gusy3', 'pyrohy', 'kozhi', 'bulava', 'holub', 'horoshyna', 'kamin', 'zalizo', 'zemlia', 'motuzky', 'lokh', 'kuzhil', 'husli', 'torba', 'vyazanka', 'tarilka', 'hlechyk', 'pyrih', 'hnizdo', 'yama', 'skarb', 'skarb2', 'bochka', 'hryfon'];
/** drawn in front of the characters (they hide behind) / behind everyone (they stand in front, climb it) */
const FRONT = ['bush', 'bush2', 'koloda', 'stil', 'zemlia', 'motuzky'];
/** animals on four legs (lying down = flat on the belly) */
const FOUR_LEGS = ['sirko', 'sobaka', 'koza', 'zmiy'];
const BACK = ['khatka', 'dub', 'skatertyna', 'lunka', 'viz', 'yavir', 'kolyska', 'lokh', 'yama'];

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

function hata(evening = false, winter = false) {
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
    ${winter ? `<path d="M120 424 L510 156 L900 424 Q860 404 820 420 Q770 392 720 414 Q660 386 600 410 Q540 384 480 410 Q420 386 360 412 Q300 388 240 414 Q180 396 120 424 Z" fill="#f7fbff" stroke="#c9dcee" stroke-width="5" stroke-linejoin="round"/><path d="M670 192 h76 v-10 q-38 -18 -76 0 z" fill="#f7fbff"/>` : ''}
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
    ${winter ? '<path d="M502 596 q30 -16 60 -4 q40 -14 80 0 q50 -12 96 4 z" fill="#f7fbff"/>' : ''}
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


// ---------- the goat's tale: a meadow with a little bridge, an autumn forest ----------

function autumnTree(x: number, y: number, s: number, c: [string, string]) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-12" y="-130" width="24" height="130" rx="6" fill="#6d4426"/>
    <circle cx="0" cy="-180" r="74" fill="${c[0]}"/><circle cx="-50" cy="-138" r="48" fill="${c[0]}"/><circle cx="52" cy="-140" r="50" fill="${c[1]}"/>
    <circle cx="-14" cy="-208" r="36" fill="${c[1]}"/></g>`;
}

function autumnRow(seed: number, n: number, y0: number, s0: number) {
  const r = rand(seed);
  const colors: [string, string][] = [['#ef6c00', '#ffa726'], ['#f9a825', '#fdd835'], ['#c62828', '#e53935'], ['#8d6e1f', '#c0a032']];
  let s = '';
  for (let i = 0; i < n; i++) s += autumnTree((i + r() * 0.6) * (W / n), y0 - r() * 20, s0 + r() * 0.3, colors[Math.floor(r() * colors.length)]);
  return s;
}

/** a maple: the goat "only snatched a maple leaf", she says */
function maple(x: number) {
  let leaves = '';
  const r = rand(97);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    leaves += `<circle cx="${(Math.cos(a) * 80).toFixed(0)}" cy="${(-300 + Math.sin(a) * 70).toFixed(0)}" r="${60 + r() * 20}" fill="${i % 2 ? '#43a047' : '#66bb6a'}"/>`;
  }
  return `<g transform="translate(${x} ${GROUND - 30})"><path d="M-16 0 Q-10 -150 -8 -260 L8 -260 Q12 -150 18 0 Z" fill="#6d4426"/>
    <path d="M-6 -180 L-60 -240 M6 -200 L60 -250" stroke="#6d4426" stroke-width="12" stroke-linecap="round"/>${leaves}
    <circle cx="0" cy="-300" r="70" fill="#4caf50"/></g>`;
}

/** a stream across the meadow with a little wooden bridge */
function streamAndBridge(x: number) {
  return `<path d="M${x - 140} ${GROUND - 40} Q${x - 90} ${GROUND + 80} ${x - 120} 2000 L${x + 120} 2000 Q${x + 150} ${GROUND + 80} ${x + 100} ${GROUND - 40} Z" fill="#4aa3df"/>
    <path d="M${x - 90} ${GROUND + 60} q20 -8 40 0 M${x + 10} ${GROUND + 120} q20 -8 40 0" stroke="#d6f0ff" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M${x - 170} ${GROUND - 4} Q${x} ${GROUND - 60} ${x + 170} ${GROUND - 4}" stroke="#8b5a2b" stroke-width="22" fill="none"/>
    ${Array.from({ length: 8 }, (_, i) => `<path d="M${x - 150 + i * 43} ${GROUND - 30 - Math.sin((i / 7) * Math.PI) * 30} v-46" stroke="#6d4426" stroke-width="7"/>`).join('')}
    <path d="M${x - 160} ${GROUND - 60} Q${x} ${GROUND - 116} ${x + 160} ${GROUND - 60}" stroke="#6d4426" stroke-width="8" fill="none"/>`;
}

/** Kyiv over the Dnipro: hills with white churches and golden domes, the river below */
function kyivView() {
  const church = (x: number, s: number) => `<g transform="translate(${x} ${GROUND - 250}) scale(${s})">
    <rect x="-70" y="-120" width="140" height="120" fill="#fdfaf2" stroke="#d9cdb4" stroke-width="5"/>
    <rect x="-24" y="-200" width="48" height="80" fill="#fdfaf2" stroke="#d9cdb4" stroke-width="5"/>
    <path d="M-30 -200 Q-30 -250 0 -262 Q30 -250 30 -200 Z" fill="#f5c542" stroke="#c99a1e" stroke-width="4"/>
    <path d="M0 -262 v-30 M-10 -282 h20" stroke="#c99a1e" stroke-width="5"/>
    <path d="M-70 -120 Q-70 -150 -50 -156 Q-30 -150 -30 -120 Z M30 -120 Q30 -150 50 -156 Q70 -150 70 -120 Z" fill="#f5c542" stroke="#c99a1e" stroke-width="4"/>
    <path d="M-12 -60 v40 h24 v-40 Q0 -76 -12 -60 Z" fill="#8b5a2b"/></g>`;
  return (
    sky('#7cc4f2', '#e0f4ff') +
    sun(1400, 230) +
    clouds(171) +
    [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#81c784', GROUND - 200, 90, 172)}</g>`).join('') +
    church(330, 0.9) +
    church(620, 0.7) +
    church(1280, 0.8) +
    `<rect x="-1600" y="${GROUND - 180}" width="4800" height="90" fill="#4aa3df"/>` +
    Array.from({ length: 14 }, (_, i) => `<path d="M${(i * 157) % 2200 - 300} ${GROUND - 150 + (i % 3) * 22} q20 -8 40 0" stroke="#d6f0ff" stroke-width="4" fill="none"/>`).join('') +
    ground('#7cb342', '#c9a77a') +
    `<g>${verge(173, false)}</g>`
  );
}

// ---------- winter ----------

/** a fir under snow */
function snowFir(x: number, y: number, s: number) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-10" y="-50" width="20" height="50" fill="#5d3b22"/>
    <path d="M0 -330 L70 -200 L36 -200 L96 -100 L56 -100 L116 -40 L-116 -40 L-56 -100 L-96 -100 L-36 -200 L-70 -200 Z" fill="#2c6143"/>
    <path d="M0 -330 L34 -268 Q16 -276 0 -262 Q-16 -276 -34 -268 Z M-70 -200 L-36 -200 L-28 -214 Q-50 -206 -60 -216 Z M70 -200 L36 -200 L28 -214 Q50 -206 60 -216 Z M-96 -100 L-56 -100 L-46 -116 Q-74 -104 -84 -114 Z M96 -100 L56 -100 L46 -116 Q74 -104 84 -114 Z M-116 -40 L116 -40 L104 -54 Q60 -44 0 -52 Q-60 -44 -104 -54 Z" fill="#f7fbff"/></g>`;
}

function snowFirRow(seed: number, n: number, y0: number, s0: number) {
  const r = rand(seed);
  let s = '';
  for (let i = 0; i < n; i++) s += snowFir((i + r() * 0.6) * (W / n), y0 - r() * 20, s0 + r() * 0.35);
  return s;
}

function snowHills(color: string, y: number, amp: number, seed: number) {
  return hills(color, y, amp, seed);
}

/** snow on the ground: drifts, a trodden path, footprints, a few sticks and red berries */
function snowGround(seed: number, path = true) {
  const r = rand(seed);
  let s = `<rect x="-1600" y="${GROUND - 40}" width="4800" height="6000" fill="#f3f8fd"/>`;
  if (path) s += `<path d="M-1600 ${GROUND - 12} L3200 ${GROUND - 12} L3200 ${GROUND + 24} L-1600 ${GROUND + 24} Z" fill="#dde8f3"/>`;
  for (let i = 0; i < 14; i++) {
    const x = r() * W;
    const y = GROUND + 40 + r() * 120;
    const k = r();
    if (k < 0.55) s += `<ellipse cx="${x}" cy="${y}" rx="${40 + r() * 60}" ry="${10 + r() * 8}" fill="#e3edf7"/>`;
    else if (k < 0.8) s += `<path d="M${x} ${y} l-10 -30 M${x} ${y} l12 -26" stroke="#6d4c33" stroke-width="4"/><circle cx="${x - 10}" cy="${y - 32}" r="5" fill="#d32f2f"/><circle cx="${x - 4}" cy="${y - 36}" r="5" fill="#d32f2f"/><circle cx="${x + 12}" cy="${y - 28}" r="5" fill="#d32f2f"/>`;
    else s += `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#cddbea"/><ellipse cx="${x + 26}" cy="${y + 6}" rx="7" ry="4" fill="#cddbea"/>`;
  }
  return s;
}

function stump(x: number) {
  return `<g transform="translate(${x} ${GROUND - 10})"><path d="M-46 0 L-40 -70 L40 -70 L46 0 Z" fill="#7a5232" stroke="#5a3a22" stroke-width="5"/>
    <ellipse cx="0" cy="-74" rx="48" ry="16" fill="#f7fbff" stroke="#c9dcee" stroke-width="4"/></g>`;
}

interface Backdrop {
  /** drawn once, does not slide */
  still: string;
  /** sliding layers, back to front: [markup of one 1600 tile, speed] */
  layers: [string, number][];
  /** snow falls */
  snow?: boolean;
  /** autumn leaves fall */
  leaves?: boolean;
}

const BACKDROPS: Record<string, () => Backdrop> = {
  luh: () => ({
    still:
      sky('#7cc4f2', '#e0f4ff') +
      sun(1380, 230) +
      clouds(101) +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#a5d6a7', GROUND - 150, 60, 102)}${treeRow(103, false)}</g>`).join('') +
      ground('#7cb342', '#7cb342') +
      streamAndBridge(1360) +
      maple(260) +
      `<g>${verge(104, false)}${verge(105, false)}</g>`,
    layers: [],
  }),
  pidzemne: () => ({
    // the world under the ground: a violet sky, glowing crystals, a golden palace
    still:
      sky('#3b1f5c', '#8e5bb5') +
      Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 149) % 2400 - 400}" cy="${-300 + ((i * 71) % 800)}" r="${i % 3 ? 3 : 5}" fill="#e1bee7"/>`).join('') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${mountains(201, '#5e3a7a', GROUND - 60, 340, false)}</g>`).join('') +
      `<g transform="translate(1180 ${GROUND - 40})">
        <rect x="-220" y="-300" width="440" height="300" fill="#f5c542" stroke="#c99a1e" stroke-width="8"/>
        ${[-150, -50, 50, 150].map((x) => `<rect x="${x - 26}" y="-250" width="52" height="90" rx="26" fill="#7e57c2" stroke="#c99a1e" stroke-width="5"/>`).join('')}
        <path d="M-60 0 v-120 Q0 -170 60 -120 v120 Z" fill="#7e57c2" stroke="#c99a1e" stroke-width="6"/>
        ${[-180, 0, 180].map((x) => `<path d="M${x - 50} -300 Q${x - 50} -380 ${x} -410 Q${x + 50} -380 ${x + 50} -300 Z" fill="#ffd54f" stroke="#c99a1e" stroke-width="6"/><circle cx="${x}" cy="-420" r="12" fill="#e53935"/>`).join('')}
      </g>` +
      `<rect x="-1600" y="${GROUND - 40}" width="4800" height="6000" fill="#4a2f63"/>` +
      Array.from({ length: 14 }, (_, i) => `<path d="M${(i * 113) % 1700 - 50} ${GROUND + 40 + ((i * 37) % 120)} l14 -50 l14 50 z" fill="${['#80deea', '#ce93d8', '#fff59d'][i % 3]}" opacity=".9"/>`).join(''),
    layers: [],
  }),
  nebo: () => ({
    // high in the sky: only clouds rush past (the griffin's flight)
    still: sky('#64b5f6', '#e3f2fd'),
    layers: [
      [clouds(211), 0.4],
      [clouds(212), 0.9],
    ],
  }),
  oranka: () => ({
    // a ploughed field: brown furrows to the edge of the forest
    still:
      sky('#7cc4f2', '#e0f4ff') +
      sun(1380, 230) +
      clouds(181) +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#a5d6a7', GROUND - 160, 60, 182)}${treeRow(183, true)}</g>`).join('') +
      `<rect x="-1600" y="${GROUND - 60}" width="4800" height="6000" fill="#7a5232"/>` +
      Array.from({ length: 14 }, (_, i) => `<path d="M-1600 ${GROUND - 40 + i * 22} H3200" stroke="${i % 2 ? '#6d4426' : '#8b5a2b'}" stroke-width="9"/>`).join(''),
    layers: [],
  }),
  zalizne: () => ({
    // the dragon's iron field: grey sky, grey ground (the front ground is an actor: zemlia)
    still:
      sky('#5f6577', '#b0b4bf') +
      clouds(191).replace(/opacity=".92"/, 'opacity=".4"') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${mountains(192, '#6b6f7a', GROUND - 40, 300, false)}</g>`).join('') +
      `<rect x="-1600" y="${GROUND - 60}" width="4800" height="6000" fill="#6b6f76"/>`,
    layers: [],
  }),
  kyiv: () => ({
    // Kyiv on the hills over the Dnipro: golden domes, the river below
    still: kyivView(),
    layers: [],
  }),
  kozhum: () => ({
    // Kyrylo's yard by the Dnipro: hides drying on poles, a tanning vat
    still:
      kyivView() +
      `<path d="M-200 ${GROUND - 260} H1800" stroke="#6d4426" stroke-width="8"/>` +
      [80, 380, 1240, 1520].map((x) => `<rect x="${x - 8}" y="${GROUND - 270}" width="16" height="270" fill="#6d4426"/>`).join('') +
      [140, 300, 1180, 1340, 1480].map((x, i) => `<path d="M${x - 60} ${GROUND - 262} Q${x - 70} ${GROUND - 170} ${x - 40} ${GROUND - 120} L${x + 40} ${GROUND - 120} Q${x + 70} ${GROUND - 170} ${x + 60} ${GROUND - 262} Z" fill="${i % 2 ? '#a1704a' : '#8b5a2b'}" stroke="#5a3a22" stroke-width="4"/>`).join('') +
      `<path d="M1000 ${GROUND} L980 ${GROUND - 120} L1120 ${GROUND - 120} L1100 ${GROUND} Z" fill="#8b5a2b" stroke="#5a3a22" stroke-width="5"/><ellipse cx="1050" cy="${GROUND - 120}" rx="70" ry="14" fill="#5d4037"/>`,
    layers: [],
  }),
  lihvo: () => ({
    // the dragon's lair: grey rocks, a dark cave, scorched earth
    still:
      sky('#6d6f86', '#c9b7a6') +
      clouds(161).replace(/opacity=".92"/, 'opacity=".45"') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${mountains(162, '#7e7a74', GROUND - 60, 360, false)}</g>`).join('') +
      `<path d="M1100 ${GROUND - 40} Q1130 ${GROUND - 300} 1300 ${GROUND - 320} Q1480 ${GROUND - 300} 1520 ${GROUND - 40} Z" fill="#5d5a55" stroke="#3e3c39" stroke-width="6"/>` +
      `<path d="M1220 ${GROUND - 40} Q1230 ${GROUND - 200} 1310 ${GROUND - 210} Q1390 ${GROUND - 200} 1400 ${GROUND - 40} Z" fill="#1d1b1a"/>` +
      ground('#8a7f62', '#6e6450') +
      Array.from({ length: 18 }, (_, i) => `<ellipse cx="${(i * 97) % 1700 - 50}" cy="${GROUND + 50 + ((i * 41) % 130)}" rx="${18 + (i % 4) * 8}" ry="${10 + (i % 3) * 4}" fill="#7a7468"/>`).join(''),
    layers: [],
  }),
  bereh: () => ({
    // a river bank: the mother calls from the bank on the left, the boat floats on the water
    still:
      sky('#7cc4f2', '#e0f4ff') +
      sun(1380, 230) +
      clouds(151) +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#a5d6a7', GROUND - 170, 60, 152)}${treeRow(153, false)}</g>`).join('') +
      `<rect x="-1600" y="${GROUND - 50}" width="4800" height="6000" fill="#4aa3df"/>` +
      Array.from({ length: 24 }, (_, i) => `<path d="M${(i * 131) % 2400 - 400} ${GROUND - 10 + ((i * 37) % 180)} q22 -10 44 0" stroke="#d6f0ff" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') +
      `<path d="M-1600 ${GROUND - 50} L420 ${GROUND - 50} Q500 ${GROUND - 20} 470 ${GROUND + 40} L380 2000 L-1600 2000 Z" fill="#7cb342"/>` +
      `<path d="M300 ${GROUND - 50} L430 ${GROUND - 50} Q490 ${GROUND - 26} 470 ${GROUND + 20}" fill="none" stroke="#c9a77a" stroke-width="18"/>` +
      `<g transform="translate(0 -40)">${verge(154, false)}</g>`.replace(/translate\(0 -40\)/, 'translate(-1150 -40)') +
      Array.from({ length: 6 }, (_, i) => `<g transform="translate(${420 + i * 18} ${GROUND - 30})"><path d="M0 0 V-90" stroke="#5d8f3a" stroke-width="5"/><rect x="-5" y="-118" width="10" height="30" rx="5" fill="#7a4a24"/></g>`).join(''),
    layers: [],
  }),
  kuznya: () => ({
    still: `
      <rect x="-1600" y="-1200" width="4800" height="${GROUND + 1160}" fill="#4e3a2e"/>
      <rect x="-1600" y="${GROUND - 40}" width="4800" height="6000" fill="#3b2b22"/>
      ${Array.from({ length: 30 }, (_, i) => `<rect x="${-200 + (i % 10) * 200}" y="${80 + Math.floor(i / 10) * 140}" width="180" height="120" fill="none" stroke="#5d463a" stroke-width="5"/>`).join('')}
      <!-- the forge -->
      <path d="M140 ${GROUND - 40} L140 420 L560 420 L560 ${GROUND - 40} Z" fill="#6d5546" stroke="#3b2b22" stroke-width="6"/>
      <path d="M220 420 L280 -100 L420 -100 L480 420 Z" fill="#5d463a" stroke="#3b2b22" stroke-width="6"/>
      <ellipse data-glow="1" cx="350" cy="560" rx="170" ry="70" fill="#ff7043" opacity=".5"/>
      <g transform="translate(350 600)">
        <path data-flame="1" d="M-90 0 Q-100 -70 -60 -100 Q-50 -60 -30 -50 Q-40 -110 0 -140 Q0 -80 30 -70 Q30 -110 60 -120 Q90 -60 80 0 Z" fill="#ff7a1a"/>
        <path data-flame="1" d="M-50 0 Q-60 -40 -30 -70 Q-20 -40 0 -36 Q-6 -80 20 -100 Q24 -50 46 -40 Q60 -20 40 0 Z" fill="#ffd23f"/>
      </g>
      <rect x="120" y="600" width="460" height="30" rx="6" fill="#3b2b22"/>
      <path d="M1300 300 l40 60 M1340 300 l-40 60 M1420 280 v120 M1400 300 h40" stroke="#90a4ae" stroke-width="10" stroke-linecap="round"/>
      <ellipse cx="350" cy="640" rx="700" ry="400" fill="#ffab40" opacity=".08"/>`,
    layers: [],
  }),
  'pich-zmiya': () => ({ still: interior(false) + `<rect x="-1600" y="-1200" width="4800" height="8000" fill="#1b3a1b" opacity=".4"/>`, layers: [] }),
  zhnyva: () => {
    // a wheat field at harvest: golden rows, sheaves already stood up here and there
    let wheat = '';
    for (let i = 0; i < 70; i++) {
      const x = -200 + i * 30;
      wheat += `<path d="M${x} ${GROUND - 30} q6 -60 0 -110" stroke="#d4a531" stroke-width="6" fill="none"/><ellipse cx="${x}" cy="${GROUND - 146}" rx="7" ry="16" fill="#e8bd45"/>`;
    }
    return {
      still:
        sky('#8ecdf2', '#fff3d6') +
        sun(1380, 230) +
        clouds(131) +
        [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#e0c060', GROUND - 170, 50, 132)}</g>`).join('') +
        `<rect x="-1600" y="${GROUND - 180}" width="4800" height="150" fill="#e8c24f"/>` +
        wheat +
        `<rect x="-1600" y="${GROUND - 40}" width="4800" height="6000" fill="#d9b85c"/>` +
        `<path d="M-1600 ${GROUND - 14} L3200 ${GROUND - 14} L3200 ${GROUND + 26} L-1600 ${GROUND + 26} Z" fill="#c9a77a"/>` +
        `<g>${Array.from({ length: 40 }, (_, i) => `<path d="M${(i * 83) % 1700 - 50} ${GROUND + 60 + ((i * 47) % 140)} l-8 -22 M${(i * 83) % 1700 - 50} ${GROUND + 60 + ((i * 47) % 140)} l8 -20" stroke="#b8963c" stroke-width="4"/>`).join('')}</g>`,
      layers: [],
    };
  },
  'hata-night': () => ({
    still:
      sky('#14204a', '#3d4f8a') +
      `<circle cx="1320" cy="230" r="64" fill="#fff6c8"/><circle cx="1296" cy="214" r="12" fill="#e9dfa8"/><circle cx="1340" cy="252" r="8" fill="#e9dfa8"/>` +
      Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 137) % 2400 - 400}" cy="${-300 + ((i * 89) % 700)}" r="${i % 3 ? 2.5 : 4}" fill="#fff"/>`).join('') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#2c4a3a', GROUND - 120, 60, 7)}</g>`).join('') +
      ground('#2f5a2a', '#6b5a44') +
      wattleFence(920, 1580).replace(/#8b5a2b/g, '#4e3420').replace(/#a87444/g, '#5c4028') +
      hata(true) +
      `<rect x="-1600" y="-1200" width="4800" height="8000" fill="#0a1030" opacity=".35"/>`,
    layers: [],
  }),
  ozero: () => ({
    // a frozen river by the village: the wolf fishes through the ice here
    still:
      sky('#a9cbe6', '#eef5fb') +
      clouds(141).replace(/opacity=".92"/, 'opacity=".7"') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${snowHills('#e6eff8', GROUND - 190, 50, 142)}</g>`).join('') +
      // the village on the far bank
      [180, 420, 1180, 1420].map((x, i) => `<g transform="translate(${x} ${GROUND - 360}) scale(0.32)">${hata(false, true).replace(/<g>/, '<g>')}</g>`.replace(/scale\(0.32\)/, `scale(${0.28 + (i % 2) * 0.05})`)).join('') +
      snowFirRow(143, 6, GROUND - 120, 0.4) +
      `<rect x="-1600" y="${GROUND - 70}" width="4800" height="6000" fill="#f3f8fd"/>` +
      `<path d="M-1600 ${GROUND - 50} Q800 ${GROUND - 66} 3200 ${GROUND - 50} L3200 ${GROUND + 140} Q800 ${GROUND + 120} -1600 ${GROUND + 140} Z" fill="#d6ebf8"/>` +
      Array.from({ length: 12 }, (_, i) => `<path d="M${i * 150 - 100} ${GROUND + (i % 3) * 30} l60 -8 l40 14" stroke="#b3d4ec" stroke-width="3" fill="none"/>`).join(''),
    layers: [],
    snow: true,
  }),
  polyana: () => ({
    still:
      sky('#7cc4f2', '#e0f4ff') +
      sun(1380, 230) +
      clouds(121) +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#a5d6a7', GROUND - 150, 60, 122)}${treeRow(123, false)}</g>`).join('') +
      ground('#7cb342', '#7cb342') +
      `<g>${verge(124, false)}${verge(125, false)}</g>`,
    layers: [],
  }),
  'lis-osin': () => ({
    still:
      sky('#f6d7a7', '#fff3e0') +
      sun(1400, 230, '#ffcc80') +
      clouds(111).replace(/opacity=".92"/, 'opacity=".75"') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#c8b273', GROUND - 160, 60, 112)}${autumnRow(113, 8, GROUND - 60, 0.6)}</g>`).join('') +
      autumnTree(120, GROUND - 10, 1.3, ['#ef6c00', '#ffa726']) +
      autumnTree(1500, GROUND - 10, 1.4, ['#c62828', '#e53935']) +
      `<rect x="-1600" y="${GROUND - 40}" width="4800" height="6000" fill="#9e9d24"/>` +
      `<path d="M-1600 ${GROUND - 14} L3200 ${GROUND - 14} L3200 ${GROUND + 26} L-1600 ${GROUND + 26} Z" fill="#b8946a"/>` +
      `<g>${verge(114, true, 0.3)}${Array.from({ length: 30 }, (_, i) => `<ellipse cx="${(i * 97) % 1700 - 50}" cy="${GROUND + 40 + ((i * 53) % 140)}" rx="12" ry="6" fill="${['#e65100', '#f9a825', '#c62828'][i % 3]}" transform="rotate(${(i * 37) % 180} ${(i * 97) % 1700 - 50} ${GROUND + 40 + ((i * 53) % 140)})"/>`).join('')}</g>`,
    layers: [],
    leaves: true,
  }),
  'winter-forest': () => ({
    still: sky('#a9cbe6', '#eef5fb') + clouds(81).replace(/opacity=".92"/, 'opacity=".7"'),
    layers: [
      [snowHills('#e6eff8', GROUND - 170, 70, 82), 0.1],
      [snowFirRow(83, 9, GROUND - 60, 0.55), 0.3],
      [snowFirRow(84, 6, GROUND - 30, 0.85), 0.6],
      [snowGround(85), 1],
    ],
    snow: true,
  }),
  'winter-glade': () => ({
    still:
      sky('#b5d4ec', '#f1f7fc') +
      clouds(86).replace(/opacity=".92"/, 'opacity=".7"') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${snowHills('#e9f1f9', GROUND - 150, 60, 87)}${snowFirRow(88, 8, GROUND - 60, 0.6)}</g>`).join('') +
      snowFir(80, GROUND - 10, 1.25) +
      snowFir(1530, GROUND - 10, 1.35) +
      snowFir(-120, GROUND, 1.5) +
      snowFir(1720, GROUND, 1.4) +
      snowGround(89, false) +
      stump(1330),
    layers: [],
    snow: true,
  }),
  'winter-dusk': () => ({
    still:
      sky('#8f8fc9', '#f7c9b7') +
      sun(1250, 620, '#ffcf7a') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${snowHills('#e4e0f2', GROUND - 150, 60, 87)}${snowFirRow(88, 8, GROUND - 60, 0.6)}</g>`).join('') +
      snowFir(80, GROUND - 10, 1.25) +
      snowFir(1530, GROUND - 10, 1.35) +
      snowGround(89, false).replace(/#f3f8fd/, '#f1eef8') +
      `<rect x="-1600" y="-1200" width="4800" height="8000" fill="#3a2a6a" opacity=".08"/>`,
    layers: [],
    snow: true,
  }),
  'hata-winter': () => ({
    still:
      sky('#a9cbe6', '#eef5fb') +
      clouds(91).replace(/opacity=".92"/, 'opacity=".7"') +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${snowHills('#e6eff8', GROUND - 120, 60, 7)}</g>`).join('') +
      snowGround(92) +
      wattleFence(920, 1580).replace(/#a87444/g, '#9c6c45') +
      `<path d="M910 ${GROUND - 160} H1590" stroke="#f7fbff" stroke-width="14" stroke-linecap="round"/>` +
      snowFir(1700, GROUND, 1.3) +
      hata(false, true),
    layers: [],
    snow: true,
  }),
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
      [LOW_END ? '' : rays(), 0.2],
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
  /** falling snow (winter scenes): flakes drift down in front of everything */
  private flakes: { el: SVGElement; x: number; y: number; v: number; sway: number; ph: number }[] = [];
  private snowLayer: SVGGElement;
  /** the stove's fire in the hata: flames flicker, `fire` > 1 while it roars (baking) */
  private flames: SVGElement[] = [];
  private glow: SVGElement | null = null;
  private fire = 1;
  private noteIn = 0;
  /** speed multiplier for tests (window.tale.fast) */
  speed = 1;
  /** the pause button: stage time stands still — puppets, effects and waits all freeze */
  paused = false;
  /** debug skipping: everything runs this many times faster until the next line */
  rush = 1;

  constructor(host: HTMLElement) {
    this.svg = el('svg', { viewBox: `0 ${VIEW_TOP} ${W} ${VIEW_H}`, preserveAspectRatio: 'xMidYMin meet', class: 'stage' });
    this.backdrop = el('g');
    this.actorsLayer = el('g');
    this.frontLayer = el('g');
    this.fxLayer = el('g', { 'pointer-events': 'none' });
    this.snowLayer = el('g', { 'pointer-events': 'none' });
    this.svg.append(this.backdrop, this.actorsLayer, this.frontLayer, this.fxLayer, this.snowLayer);
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
      requestAnimationFrame(frame);
      // old iPads: every other frame (30 a second) — smooth enough, half the repainting
      if (LOW_END && this.last && now - this.last < 30) return;
      const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0;
      this.last = now;
      this.tick(this.paused ? 0 : dt * this.speed * this.rush);
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
  /** seconds of camera shake left */
  private shake = 0;

  /** Frame the characters on stage, easing towards them (snap: at once). */
  private camera(dt: number, snap = false) {
    let lo = Infinity;
    let hi = -Infinity;
    // how high above the road the heads go (a bear up a tree is higher)
    let headroom = HEADROOM;
    for (const a of this.actors.values()) {
      // ones walking off far away don't drag the camera along
      if (a.x < -60 || a.x > W + 60) continue;
      lo = Math.min(lo, a.x);
      hi = Math.max(hi, a.x);
      if (!a.prop && ANCHORS[a.id]) headroom = Math.max(headroom, GROUND - (a.y + ANCHORS[a.id].top * a.size) + 30);
    }
    const [w, h] = this.screen;
    const p = this.portrait;
    // the scene's part of the screen, and where the road is in it
    const sceneH = p ? h * PORTRAIT_SCENE : h;
    const groundAt = p ? PORTRAIT_GROUND : h < 520 ? LOW_GROUND : LANDSCAPE_GROUND;
    // wide enough for the heads to fit between the road and the subtitles / round buttons up top
    const topUi = p ? 76 : h < 520 ? 66 : 100;
    const tallEnough = (headroom * w) / Math.max(1, sceneH * groundAt - topUi);
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
    // whole units: a camera that has settled doesn't touch the viewBox (that repaints everything)
    // a blow or a fall shakes the picture for a moment
    let sx = 0;
    let sy = 0;
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt);
      const k = this.shake * this.camW * 0.03;
      sx = (Math.random() - 0.5) * k;
      sy = (Math.random() - 0.5) * k;
    }
    setAttr(this.svg, 'viewBox', `${Math.round(this.camX - this.camW / 2 + sx)} ${Math.round(vy + sy)} ${Math.round(this.camW)} ${Math.round(vh)}`);
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
    let below = '';
    this.layerEls = b.layers.map(([markup, speed]) => {
      if (LOW_END && markup) {
        const flat = flattenLayer(markup);
        if (flat.below) below = flat.below;
        const g = el('g');
        for (const i of [-1, 0, 1, 2]) {
          const img = el('image', { x: i * W, y: LAYER_TOP, width: W, height: LAYER_H, preserveAspectRatio: 'none' });
          // Safari 12 knows only the old xlink:href
          img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', flat.url);
          g.appendChild(img);
        }
        this.backdrop.appendChild(g);
        return { el: g, speed };
      }
      // the tile four times: -1600…4800, enough for any screen shape while sliding
      const g = svg([-1, 0, 1, 2].map((i) => `<g transform="translate(${i * W} 0)">${markup}</g>`).join(''));
      this.backdrop.appendChild(g);
      return { el: g, speed };
    });
    // the meadow further down than the flattened front layer reaches (portrait screens)
    if (below) this.backdrop.appendChild(svg(below));
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
    this.inside = {};
    while (this.snowLayer.firstChild) this.snowLayer.removeChild(this.snowLayer.firstChild);
    this.flakes = [];
    if (b.leaves)
      for (let i = 0; i < (LOW_END ? 10 : 26); i++) {
        const r = 7 + Math.random() * 6;
        const f = el('ellipse', { rx: r, ry: r * 0.5, fill: ['#e65100', '#f9a825', '#c62828', '#ef6c00'][i % 4], opacity: '0.9' });
        this.snowLayer.appendChild(f);
        this.flakes.push({ el: f, x: -400 + Math.random() * 2400, y: -900 + Math.random() * 2400, v: 40 + Math.random() * 40, sway: 40 + Math.random() * 40, ph: Math.random() * 6 });
      }
    if (b.snow)
      for (let i = 0; i < (LOW_END ? 24 : 70); i++) {
        const r = 3 + Math.random() * 6;
        const f = el('circle', { r, fill: '#fff', opacity: (0.6 + Math.random() * 0.4).toFixed(2) });
        this.snowLayer.appendChild(f);
        this.flakes.push({ el: f, x: -400 + Math.random() * 2400, y: -900 + Math.random() * 2400, v: 30 + r * 12, sway: 10 + Math.random() * 30, ph: Math.random() * 6 });
      }
  }

  /** `look`: another drawing of the same character (did + winter = the grandfather in his coat) */
  show(id: string, at: Point, flip = false, eyesOpen = true, raw = false, look?: string, size = 1) {
    this.hide(id);
    delete this.inside[id];
    const g = makePuppet(look ? `${id}_${look}` : id, id);
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
      size,
      wobble: 0,
      prop: PROPS.indexOf(id) >= 0,
      pose: '',
      spin: 0,
      spinSpeed: 0,
      parts: {
        eyes: part('eyes'),
        eyesClosed: part('eyes-closed'),
        mouthOpen: part('mouth-open'),
        mouthClosed: part('mouth-closed'),
        crust: part('crust'),
        ears: part('ears'),
        face: part('face'),
        raw: part('raw'),
        tail: part('tail'),
        head: part('head'),
        peek: part('peek'),
      },
    };
    (FRONT.indexOf(id) >= 0 ? this.frontLayer : this.actorsLayer).appendChild(g);
    // the snow house, the oak, the tablecloth: behind everyone
    if (BACK.indexOf(id) >= 0) this.actorsLayer.insertBefore(g, this.actorsLayer.firstChild);
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
    a.pose = '';
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

  /** who is inside what: animal → the mitten / snow house */
  private inside: Record<string, string> = {};
  /** the size someone had when they went in (they come out the same size) */
  private sizeWhenIn: Record<string, number> = {};

  /**
   * The puppet goes into the mitten (or the snow house): hops to its door, shrinks into it and is
   * gone; the mitten swells a little and wobbles. Resolves when it is inside.
   */
  enter(id: string, into: string): Promise<void> {
    const a = this.actors.get(id);
    const c = this.actors.get(into);
    if (!a || !c) return Promise.resolve();
    const door = ANCHORS[into].mouth;
    const dx = c.x + door[0] * c.size;
    const dy = c.y;
    // in the snow: a hop (frog, hare), the others walk
    return this.moveTo(id, [dx + (a.x > dx ? 40 : -40), dy], Math.max(500, Math.abs(a.x - dx) * 1.4), { hop: id === 'zhabka' || id === 'zayets' || id === 'myshka' })
      .then(
        () =>
          new Promise<void>((resolve) => {
            const t0 = this.time;
            const fromX = a.x;
            const step = () => {
              if (!this.actors.has(id)) return resolve();
              const p = Math.min(1, (this.time - t0) / 0.35);
              a.x = fromX + (dx - fromX) * p;
              a.y = dy + door[1] * c.size * p * 0.6;
              a.scale = 1 - p;
              if (p < 1) this.later(0, step);
              else {
                this.sizeWhenIn[id] = a.size;
                this.hide(id);
                this.inside[id] = into;
                if (into === 'rukavychka') c.size += 0.075;
                c.wobble = 1;
                if (c.parts.peek) c.parts.peek.style.display = '';
                resolve();
              }
            };
            step();
          }),
      );
  }

  /** the puppet comes back out (popout / scatter) */
  private comeOut(id: string, out?: Actor): Actor | null {
    // whoever is listed comes out of the given place (also if they went in in an earlier scene)
    const from = this.inside[id];
    const c = out || (from ? this.actors.get(from) : undefined);
    if (!c) return null;
    delete this.inside[id];
    const door = ANCHORS[c.id].mouth;
    const x = c.x + door[0] * c.size;
    // the mitten goes back down as they leave; nobody left: no eyes in the door
    if (c.id === 'rukavychka') c.size = Math.max(1, c.size - 0.075);
    if (c.parts.peek && !Object.keys(this.inside).some((k) => this.inside[k] === c.id)) c.parts.peek.style.display = 'none';
    this.show(id, [x, c.y]);
    const a = this.actors.get(id)!;
    a.scale = 0.3;
    return a;
  }

  /**
   * Out of the container in all directions, landing in a row around it, facing it — clear of
   * whoever already stands there. `tumble`: head over heels (the mitten burst).
   */
  private popOut(c: Actor, who: string[], tumble = false) {
    const cx = c.x;
    const taken = [...this.actors.values()].filter((a) => !a.prop && a !== c).map((a) => a.x);
    const spots: number[] = [];
    for (const d of [300, -300, 470, -470, 640, -640, 810, -810, 980, -980]) {
      const x = cx + d;
      if (taken.every((t) => Math.abs(t - x) > 150)) spots.push(x);
    }
    if (!spots.length) spots.push(cx + 300, cx - 300);
    who.forEach((id, i) =>
      this.later(i * 0.15, () => {
        const p = this.comeOut(id, c);
        if (!p) return;
        const x = spots[i % spots.length];
        p.flip = x < cx;
        this.grow(p, this.sizeWhenIn[id] || 1, 0.3);
        if (tumble) {
          p.spin = 360;
          p.spinSpeed = 450;
        }
        void this.moveTo(id, [x, GROUND], 800, { hop: true, flip: x < cx });
      }),
    );
  }

  /** ease a puppet to `size` (the mitten shrinking back to a mitten in the grandfather's hand) */
  resize(id: string, size: number, ms: number): Promise<void> {
    const a = this.actors.get(id);
    if (!a) return Promise.resolve();
    this.grow(a, size, ms / 1000);
    return this.wait(ms);
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
    // someone speaking from inside the mitten: the mitten itself "talks" (wobbles)
    if (id && !this.actors.has(id) && this.inside[id]) id = this.inside[id];
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

  fx(name: string, on?: string, at?: Point, who: string[] = [], word?: string): Promise<void> {
    const a = on ? this.actors.get(on) : undefined;
    switch (name) {
      case 'munch': {
        // the goat tips her head down to the grass, three times
        const h = a && a.parts.head;
        if (!a || !h) return this.wait(300);
        const t0 = this.time;
        const cx = h.getAttribute('data-cx');
        const cy = h.getAttribute('data-cy');
        const step = () => {
          const p = Math.min(1, (this.time - t0) / 2.4);
          const ang = -Math.abs(Math.sin(p * Math.PI * 3)) * 38;
          h.setAttribute('transform', p < 1 ? `rotate(${ang.toFixed(1)} ${cx} ${cy})` : '');
          if (Math.random() < 0.15) this.crumbOf(a.x - 96 * (a.flip ? -1 : 1), a.y - 20, '#7cb342');
          if (p < 1) this.later(0, step);
        };
        step();
        return this.wait(2400);
      }
      case 'tears': {
        // big blue tears from the eyes
        if (!a) return this.wait(300);
        const [x, y] = this.anchor(a, 'mouth');
        for (let i = 0; i < 8; i++) this.later(i * 0.22, () => this.tear(x + (i % 2 ? 14 : -10), y - 30));
        return this.wait(1900);
      }
      case 'bang': {
        // a comic-book blow: a burst star with a word, a shock ring, dust, the picture shakes
        const [x, y] = at || (a ? [a.x, a.y + ANCHORS[a.id].top * a.size * 0.5] : [800, 500]);
        this.burst(x, y, word || 'БАХ!');
        for (let i = 0; i < 8; i++) this.dustAt(x + (Math.random() - 0.5) * 200, GROUND);
        for (let i = 0; i < 10; i++) this.star(x, y, (i / 10) * Math.PI * 2);
        this.shake = 0.45;
        return this.wait(700);
      }
      case 'shake':
        // the ground trembles (something heavy fell)
        this.shake = 0.7;
        if (a) for (let i = 0; i < 10; i++) this.dustAt(a.x + (Math.random() - 0.5) * 300, GROUND);
        return this.wait(600);
      case 'whoosh': {
        // speed lines streaming behind someone dashing off
        if (!a) return this.wait(200);
        for (let i = 0; i < 12; i++) this.later(i * 0.05, () => this.speedLine(a));
        return this.wait(300);
      }
      case 'dust':
        if (a) for (let i = 0; i < 8; i++) this.later(i * 0.05, () => this.dustAt(a.x + (Math.random() - 0.5) * 120, GROUND));
        return this.wait(400);
      case 'sparrows': {
        // a flock of sparrows bursts out — and there's nothing left where they were
        if (!a) return this.wait(300);
        const [x, y] = [a.x, a.y - 110];
        for (let i = 0; i < 16; i++) this.later(i * 0.04, () => this.sparrow(x, y));
        this.hide(a.id);
        return this.wait(1400);
      }
      case 'break': {
        // smashed to pieces: chips fly, the broken pieces stay
        if (!a) return this.wait(300);
        const [x, y] = [a.x, a.y - 40];
        for (let i = 0; i < 14; i++) this.wool(x, y, i % 2 ? '#b07e55' : '#6d4426');
        const id = a.id;
        this.hide(id);
        // the sledge leaves its broken pieces; torn hides are replaced by the next stack
        if (id === 'sanky') this.show('lamani', [x, GROUND]);
        else if (id === 'kozhi') this.later(0.6, () => this.show(id, [x, a.y]));
        return this.wait(700);
      }
      case 'throwfish': {
        // fish flung off the sledge, one after another, into the snow behind
        if (!a) return this.wait(300);
        for (let i = 0; i < 7; i++) this.later(i * 0.3, () => this.flyingFish(a.x - 60 + i * 20, a.y - 110));
        return this.wait(2400);
      }
      case 'rock':
        // rocked (the cradle), shaken (the maple the snake gnaws)
        if (a) a.wobble = 1;
        return this.wait(900);
      case 'tumble':
        // a twirl (dancing): one full turn on the spot
        if (a) {
          a.spin = 360;
          a.spinSpeed = 540;
          a.bounce = 1;
        }
        return this.wait(700);
      case 'belly':
        // lies down and rolls from side to side (gets up as soon as it moves)
        if (a) a.pose = 'roll';
        return this.wait(1600);
      case 'lie':
        // lies flat on the ground (behind the log: only the ears show)
        if (a) a.pose = 'lie';
        return this.wait(300);
      case 'squash': {
        // someone landed on it: squashed flat for a moment, stars
        if (!a) return this.wait(300);
        a.wobble = 1;
        const [x, y] = this.anchor(a, 'top');
        for (let i = 0; i < 10; i++) this.star(x, y + 60, (i / 10) * Math.PI * 2);
        return this.wait(900);
      }
      case 'rustle': {
        // something stirs in the bush: it shakes, leaves fly
        if (!a) return this.wait(300);
        a.wobble = 1;
        for (let i = 0; i < 8; i++) this.later(i * 0.08, () => this.crumbOf(a.x + (Math.random() - 0.3) * 160 * a.size, a.y - 120 * a.size, '#4f9446'));
        return this.wait(900);
      }
      case 'pinch': {
        // a pinch inside: stars burst from the door, the hut jumps
        if (!a) return this.wait(300);
        const [x, y] = this.anchor(a, 'mouth');
        for (let i = 0; i < 12; i++) this.star(x, y - 40, (i / 12) * Math.PI * 2);
        a.wobble = 1;
        a.bounce = 1;
        return this.wait(800);
      }
      case 'popout':
        if (a) this.popOut(a, who);
        return this.wait(who.length * 150 + 900);
      case 'scatter': {
        // out of the mitten and away into the forest, as fast as they can
        const cx = a ? a.x : 800;
        who.forEach((id, i) =>
          this.later(i * 0.12, () => {
            const p = this.comeOut(id);
            if (!p) return;
            const right = i % 2 === 1;
            this.grow(p, this.sizeWhenIn[id] || 1, 0.25);
            void this.moveTo(id, [right ? cx + 1500 : cx - 1500, GROUND], 1300 + Math.random() * 500, { hop: true, flip: right });
          }),
        );
        return this.wait(who.length * 120 + 1600);
      }
      case 'burst': {
        // the mitten bursts at the seams: wool flies, it lies torn on the snow
        // and everyone inside tumbles out into the snow
        if (!a) return this.wait(300);
        const [x, y] = [a.x, a.y - 150 * a.size];
        for (let i = 0; i < 18; i++) this.wool(x, y, i % 3 ? '#c62828' : '#fbf7ee');
        for (let i = 0; i < 10; i++) this.star(x, y, (i / 10) * Math.PI * 2);
        a.g.style.display = 'none';
        this.show('rvana', [a.x, GROUND]);
        this.actorsLayer.insertBefore(this.actors.get('rvana')!.g, this.actorsLayer.firstChild);
        this.popOut(a, who, true);
        this.later(who.length * 0.15 + 0.2, () => this.hide(a.id));
        return this.wait(who.length * 150 + 900);
      }
      case 'build': {
        // the snow house rises from a pile of snow
        if (!a) return this.wait(300);
        a.size = 0.05;
        this.grow(a, 1, 3);
        for (let i = 0; i < 16; i++) this.later(i * 0.18, () => this.puffSnow(a.x + (Math.random() - 0.5) * 560, GROUND - Math.random() * 80));
        return this.wait(3200);
      }
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

  /** ease a puppet's size to `to` over `sec` */
  private grow(a: Actor, to: number, sec: number) {
    const from = a.size * a.scale;
    a.scale = 1;
    a.size = from;
    const t0 = this.time;
    const step = () => {
      const p = Math.min(1, (this.time - t0) / sec);
      const e = 1 - Math.pow(1 - p, 3);
      a.size = from + (to - from) * e;
      if (p < 1) this.later(0, step);
    };
    step();
  }

  private wool(x: number, y: number, color: string) {
    const c = el('circle', { r: 8 + Math.random() * 10, fill: color, stroke: '#5a3a22', 'stroke-width': 2 });
    const vx = (Math.random() - 0.5) * 700;
    const vy = -300 - Math.random() * 400;
    this.particle(c, 1.6, (p, k) => {
      c.setAttribute('cx', String(x + vx * k));
      c.setAttribute('cy', String(y + vy * k + 700 * k * k));
      c.setAttribute('opacity', String(1 - k * k));
    });
  }

  /** a jagged comic burst with a word on it, popping out and fading */
  private burst(x: number, y: number, text: string) {
    let pts = '';
    for (let i = 0; i < 18; i++) {
      const r = i % 2 ? 70 : 130;
      const ang = (i / 18) * Math.PI * 2;
      pts += `${(Math.cos(ang) * r).toFixed(0)},${(Math.sin(ang) * r * 0.75).toFixed(0)} `;
    }
    const g = svg(`<g><polygon points="${pts}" fill="#ffd600" stroke="#d84315" stroke-width="10" stroke-linejoin="round"/>
      <polygon points="${pts}" fill="#ff7043" transform="scale(0.62)"/>
      <text x="0" y="16" font-size="54" font-weight="900" text-anchor="middle" fill="#fff" stroke="#b71c1c" stroke-width="5" paint-order="stroke" font-family="Nunito, Arial, sans-serif">${text}</text></g>`);
    const ring = el('ellipse', { cx: x, cy: y, rx: 10, ry: 8, fill: 'none', stroke: '#fff', 'stroke-width': 10 });
    this.particle(ring, 0.5, (p, k) => {
      ring.setAttribute('rx', String(10 + k * 260));
      ring.setAttribute('ry', String(8 + k * 180));
      ring.setAttribute('opacity', String(1 - k));
    });
    this.particle(g, 0.9, (p, k) => {
      const sc = k < 0.25 ? 0.3 + (k / 0.25) * 0.9 : 1.2 - (k - 0.25) * 0.2;
      g.setAttribute('transform', `translate(${x} ${y}) rotate(${-8 + k * 6}) scale(${sc.toFixed(3)})`);
      g.setAttribute('opacity', String(k < 0.7 ? 1 : (1 - k) / 0.3));
    });
  }

  private dustAt(x: number, y: number) {
    const c = el('circle', { r: 16, fill: '#d7c4a3' });
    const vx = (Math.random() - 0.5) * 220;
    this.particle(c, 0.9, (p, k) => {
      c.setAttribute('cx', String(x + vx * k));
      c.setAttribute('cy', String(y - 10 - k * 60));
      c.setAttribute('r', String(14 + k * 36));
      c.setAttribute('opacity', String(0.8 * (1 - k)));
    });
  }

  private speedLine(a: Actor) {
    const dir = a.move ? Math.sign(a.move.to[0] - a.move.from[0]) || 1 : a.flip ? 1 : -1;
    const y = a.y + ANCHORS[a.id].top * a.size * (0.2 + Math.random() * 0.6);
    const x0 = a.x - dir * 60;
    const len = 80 + Math.random() * 120;
    const l = el('path', { d: `M0 0 h${-dir * len}`, stroke: '#ffffff', 'stroke-width': 6, 'stroke-linecap': 'round' });
    this.particle(l, 0.45, (p, k) => {
      l.setAttribute('transform', `translate(${x0 - dir * k * 120} ${y})`);
      l.setAttribute('opacity', String(0.9 * (1 - k)));
    });
  }

  private sparrow(x: number, y: number) {
    const b = svg(`<g><ellipse cx="0" cy="0" rx="14" ry="10" fill="#8d6e63" stroke="#4e342e" stroke-width="2"/><circle cx="-10" cy="-6" r="6" fill="#8d6e63" stroke="#4e342e" stroke-width="2"/><path d="M-16 -6 l-6 2 l6 2 z" fill="#fbc02d"/><path d="M0 -4 q10 -14 18 -4" fill="#a1887f" stroke="#4e342e" stroke-width="2"/></g>`);
    const vx = (Math.random() - 0.5) * 900;
    const vy = -300 - Math.random() * 400;
    const flap = Math.random() * 6;
    this.particle(b, 1.6, (p, k) => {
      b.setAttribute('transform', `translate(${x + vx * k} ${y + vy * k}) scale(${vx < 0 ? 1 : -1} ${1 + Math.sin(k * 40 + flap) * 0.25})`);
      b.setAttribute('opacity', String(k < 0.8 ? 1 : (1 - k) * 5));
    });
  }

  private flyingFish(x: number, y: number) {
    const f = svg(`<g><path d="M-30 0 Q-6 -20 20 0 Q-6 18 -30 0 Z" fill="#90a4ae" stroke="#5a3a22" stroke-width="3"/><path d="M18 0 L34 -12 L32 0 L34 12 Z" fill="#78909c" stroke="#5a3a22" stroke-width="3"/></g>`);
    const vx = -260 - Math.random() * 200;
    this.particle(f, 1.1, (p, k) => {
      f.setAttribute('transform', `translate(${x + vx * k} ${y - 260 * k + 420 * k * k}) rotate(${k * 360})`);
      f.setAttribute('opacity', String(k < 0.85 ? 1 : (1 - k) * 6));
    });
  }

  private tear(x: number, y: number) {
    const d = el('path', { d: 'M0 -10 Q8 2 0 8 Q-8 2 0 -10 Z', fill: '#4fc3f7', stroke: '#0288d1', 'stroke-width': 2 });
    this.particle(d, 0.9, (p, k) => {
      d.setAttribute('transform', `translate(${x} ${y + k * 120 + k * k * 60})`);
      d.setAttribute('opacity', String(1 - k * 0.7));
    });
  }

  private crumbOf(x: number, y: number, color: string) {
    const c = el('rect', { width: 5, height: 14, rx: 2, fill: color });
    const vx = (Math.random() - 0.5) * 160;
    const vy = -100 - Math.random() * 120;
    this.particle(c, 0.8, (p, k) => {
      c.setAttribute('x', String(x + vx * k));
      c.setAttribute('y', String(y + vy * k + 300 * k * k));
      c.setAttribute('opacity', String(1 - k));
    });
  }

  private puffSnow(x: number, y: number) {
    const c = el('circle', { r: 20, fill: '#ffffff' });
    this.particle(c, 1.2, (p, k) => {
      c.setAttribute('cx', String(x));
      c.setAttribute('cy', String(y - k * 120));
      c.setAttribute('r', String(16 + k * 44));
      c.setAttribute('opacity', String(0.9 * (1 - k)));
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
    const k = a.scale * a.size;
    setAttr(a.g, 'transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) scale(${(a.flip ? -k : k).toFixed(3)} ${k.toFixed(3)})`);
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
    for (const l of this.layerEls) setAttr(l.el, 'transform', `translate(${(-(this.scroll * l.speed) % W).toFixed(LOW_END ? 0 : 1)} 0)`);

    for (const f of this.flakes) {
      f.y += f.v * dt;
      f.x -= slide * 0.8;
      if (f.y > 1600) f.y -= 2500;
      if (f.x < -600) f.x += 2600;
      f.el.setAttribute('cx', (f.x + Math.sin(this.time * 1.3 + f.ph) * f.sway).toFixed(0));
      f.el.setAttribute('cy', f.y.toFixed(0));
      // leaves turn as they fall
      if (f.el.tagName === 'ellipse') f.el.setAttribute('transform', `rotate(${((this.time * 60 + f.ph * 60) % 360).toFixed(0)} ${f.el.getAttribute('cx')} ${f.el.getAttribute('cy')})`);
    }

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
        // held on the side the carrier faces
        a.x = c.x + h[0] * (c.flip ? -1 : 1);
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
    // the road rolls under someone standing on it: they walk along (the grandfather and his dog)
    else if (slide > 0.3 && !a.prop && a.id !== 'kolobok' && !a.carriedBy) {
      lift = Math.abs(Math.sin(a.phase * 9)) * 9;
      lean = Math.sin(a.phase * 9) * 2;
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

    if (a.spin > 0) {
      const d = Math.min(a.spin, a.spinSpeed * dt);
      a.spin -= d;
    }
    // turning about the middle of the body (tumbling, or lying on its back)
    let spinAt = a.spin > 0 ? 360 - a.spin : 0;
    let pivotY = 0;
    // four-legged ones lie down on their belly: flattened to the ground, not turned over
    const flat = a.pose === 'lie' && FOUR_LEGS.indexOf(a.id) >= 0;
    if (a.pose && !flat) {
      // on its side, head towards where it faces, turning about a point near the feet
      spinAt = a.pose === 'roll' ? -90 + Math.sin(a.phase * 4) * 22 : -88;
      pivotY = -40;
    }
    const pivot = a.pose ? pivotY : (ANCHORS[a.id] ? ANCHORS[a.id].top : -100) / 2;
    let breathe = a.id === 'khatka' || a.id === 'rvana' ? 1 : 1 + Math.sin(a.phase * 2.2) * 0.012;
    // a thing talking (the mitten, for those inside) or just moved into: squash and stretch
    if (a.prop && a.talking) breathe += Math.sin(a.phase * 14) * 0.025;
    if (a.wobble > 0) {
      a.wobble = Math.max(0, a.wobble - dt * 1.8);
      breathe += Math.sin((1 - a.wobble) * Math.PI * 4) * 0.08 * a.wobble;
    }
    // old iPads: standing still means still (no breathing) — fewer repaints
    if (LOW_END && !a.talking && !a.wobble) breathe = 1;
    setAttr(
      a.body,
      'transform',
      `translate(0 ${(-lift).toFixed(1)}) rotate(${(lean + spinAt).toFixed(2)} 0 ${spinAt ? pivot : 0}) scale(${((2 - breathe) * (flat ? 1.08 : 1)).toFixed(4)} ${(breathe * (flat ? 0.62 : 1)).toFixed(4)})`,
    );

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

    // the dog wags its tail
    if (a.parts.tail) {
      const t = a.parts.tail;
      t.setAttribute('transform', `rotate(${(Math.sin(a.phase * (a.talking ? 18 : 8)) * 14).toFixed(1)} ${t.getAttribute('data-cx')} ${t.getAttribute('data-cy')})`);
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
