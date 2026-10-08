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

import { ANCHORS, el, INK, makePuppet, svg } from './characters';
import type { Point } from './story';
import { sfx } from './sfx';

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

/**
 * Writing on a puppet or its clothes reads the right way round whichever way it faces: each
 * <text> is mirrored back round its own middle when the puppet is flipped. False while a piece of
 * writing can't be measured yet (not on screen): tried again next frame.
 */
function keepTextReadable(g: Element, flipped: boolean): boolean {
  let done = true;
  for (const t of Array.from(g.querySelectorAll<SVGTextElement>('text'))) {
    if (t.getAttribute('data-flip') === String(flipped)) continue;
    const own = t.getAttribute('data-tf') ?? (t.getAttribute('transform') || '');
    let cx: number;
    try {
      const b = t.getBBox();
      if (!b.width) {
        done = false;
        continue;
      }
      cx = b.x + b.width / 2;
    } catch {
      done = false;
      continue;
    }
    t.setAttribute('data-tf', own);
    t.setAttribute('transform', flipped ? `${own} translate(${(cx * 2).toFixed(1)} 0) scale(-1 1)`.trim() : own);
    t.setAttribute('data-flip', String(flipped));
  }
  return done;
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
  /** which way its writing was last turned to read (keepTextReadable); unset: to do */
  textFlip?: boolean;
  /** lying down: 'lie' — flat (the wolf behind the log), 'roll' — rolling side to side (the cat, full of presents) */
  pose: '' | 'lie' | 'roll' | 'sit' | 'back';
  /** how far sat down, 0 → 1 (sitting folds the body at the hips: sitPose) */
  sitK: number;
  /** running flat out, legs a blur (fx whirl) */
  whirl?: SVGGElement | null;
  /** the pieces of a sitting body, made the first time it sits */
  sitRig?: { up: SVGGElement; thigh: SVGGElement; shin: SVGGElement; stool: SVGGElement; hip: number; knee: number; clipUp: string };
  /** asleep: eyes shut, the head nods, "z-z-z" floats up (wakes when it moves or opens its eyes) */
  asleep: boolean;
  zIn: number;
  /** a blow: lunging at someone (jab) / thrown back by one (knock) — seconds left and how far */
  jab: number;
  jabDx: number;
  knock: number;
  knockDx: number;
  /** where that puts it, off its place for now */
  ox: number;
  /** eating (seconds left): bends down and chews */
  munch: number;
  /** pulling (seconds left): leans back and forth, heaving at the one in front */
  tug: number;
  /** pulled at (the turnip): which way it gives a little, towards the ones pulling (+1: right) */
  tugTo?: number;
  /** a reaction to a tap (see ACTS): which, seconds gone, how long */
  act: string;
  actT: number;
  actDur: number;
  /** tumbling head over heels: degrees still to turn, and how fast */
  spin: number;
  spinSpeed: number;
}

/** things on stage rather than characters */
const PROPS = ['zasik', 'bush', 'bush2', 'rukavychka', 'rvana', 'khatka', 'khatynka', 'kapusta', 'dub', 'koloda', 'skatertyna', 'ryba', 'med', 'malyna', 'koshyk', 'stil', 'snip', 'snip2', 'halushky', 'dytyna', 'pyrizhok', 'sanky', 'lamani', 'drova', 'viz', 'lunka', 'vudka', 'chovnyk', 'kolyska', 'kovadlo', 'lopata', 'yavir', 'gusy', 'gusy2', 'gusy3', 'pyrohy', 'kozhi', 'bulava', 'holub', 'horoshyna', 'kamin', 'zalizo', 'zemlia', 'motuzky', 'lokh', 'kuzhil', 'husli', 'torba', 'vyazanka', 'tarilka', 'hlechyk', 'pyrih', 'hnizdo', 'yama', 'skarb', 'skarb2', 'bochka', 'hryfon', 'ripka', 'hriadka', 'kubelko', 'zolote', 'yaiechko', 'shkarlupa', 'shokolad', 'yaieshnia', 'korob', 'penok', 'hryby', 'hryby2', 'hryby3', 'yahidky', 'kasha', 'khata_vedmedya', 'kareta', 'kuropatky', 'voda', 'lakhmittia', 'restoran', 'miska_velyka', 'miska_serednia', 'miska_mala', 'lozhka', 'stilets_velykyi', 'stilets_serednii', 'stilets_malyi', 'stilets_lamanyi', 'stil_vedmediv', 'lizhko_velyke', 'lizhko_serednie', 'lizhko_male', 'vikno', 'dveri', 'zernia', 'vazon', 'tulpan', 'shkarlupka', 'tarilka_vody', 'pelustka', 'latattia', 'steblo', 'romashka', 'lopukh', 'norka', 'kovdrochka', 'promin', 'kvitochka', 'kvitka_bila', 'rybky', 'hata_solomiana', 'hata_khmyzova', 'hata_tsehlyana', 'hata_podushkova', 'tsehla', 'kelma', 'soloma', 'khmyz', 'kazan', 'opudalo', 'khatynka_babusi', 'lizhko_babusi', 'kovdra', 'khvist', 'kvity', 'kvity2', 'metelyky', 'kaminnia', 'koshyk_pyrizhky'];
/** drawn in front of the characters (they hide behind) / behind everyone (they stand in front, climb it) */
const FRONT = ['bush', 'bush2', 'koloda', 'stil', 'zemlia', 'motuzky', 'hriadka', 'kubelko', 'penok', 'voda', 'stil_vedmediv', 'promin', 'kovdrochka', 'kazan', 'opudalo', 'kovdra', 'khvist'];
/**
 * Reactions to a tap: each a little movement over its time, p 0→1, smooth at both ends (env).
 * lift up, rot in degrees (minus leans forward, the way it faces), ox along its facing, sx/sy squash.
 */
interface Act {
  dur: number;
  eyesShut?: boolean;
  at: (p: number, env: number) => { lift?: number; rot?: number; ox?: number; sx?: number; sy?: number };
}
const ACTS: Record<string, Act> = {
  // a jump for joy, squatting before and after
  hop: { dur: 0.8, at: (p) => ({ lift: Math.max(0, Math.sin(((p - 0.15) / 0.7) * Math.PI)) * 70, sy: p < 0.15 ? 1 - Math.sin((p / 0.15) * Math.PI) * 0.12 : p > 0.85 ? 1 - Math.sin(((p - 0.85) / 0.15) * Math.PI) * 0.1 : 1 }) },
  hops: { dur: 1.1, at: (p) => ({ lift: Math.abs(Math.sin(p * Math.PI * 3)) * 35 }) },
  // scratches its behind: bent forward, the hips going side to side, eyes shut with pleasure
  scratch: { dur: 1.8, eyesShut: true, at: (p, e) => ({ rot: -9 * e + Math.sin(p * Math.PI * 14) * 3 * e, ox: Math.sin(p * Math.PI * 14) * 6 * e }) },
  // wags its whole back end
  wiggle: { dur: 1.2, at: (p, e) => ({ rot: Math.sin(p * Math.PI * 8) * 7 * e }) },
  // shivers all over
  shiver: { dur: 1, at: (p, e) => ({ ox: Math.sin(p * Math.PI * 32) * 4 * e }) },
  // a big stretch, up on its toes
  // works with its hands at something in front of it: kneading dough, scooping flour — bends to it and back
  knead: { dur: 2.6, at: (p, e) => ({ rot: (5 + Math.sin(p * Math.PI * 8) * 4) * e, lift: -Math.abs(Math.sin(p * Math.PI * 8)) * 5 * e, sy: 1 - Math.abs(Math.sin(p * Math.PI * 8)) * 0.03 * e }) },
  stretch: { dur: 1.4, eyesShut: true, at: (p, e) => ({ sy: 1 + 0.16 * e, sx: 1 - 0.06 * e, rot: 3 * e }) },
  // a bow
  bow: { dur: 1.1, at: (p, e) => ({ rot: -14 * e, sy: 1 - 0.04 * e }) },
  // shakes its head: no-no-no
  no: { dur: 1, at: (p, e) => ({ rot: Math.sin(p * Math.PI * 6) * 5 * e }) },
  // butts forward with its head
  butt: { dur: 0.8, at: (p, e) => ({ ox: Math.sin(p * Math.PI) * 45, rot: -12 * e }) },
  // a sneeze: draws back, then bursts forward, then straightens
  sneeze: { dur: 0.9, at: (p) => ({ rot: p < 0.45 ? Math.sin((p / 0.45) * Math.PI * 0.5) * 9 : 9 * (1 - (p - 0.45) / 0.55) - Math.sin(((p - 0.45) / 0.55) * Math.PI) * 22 }) },
  // shows its muscles
  flex: { dur: 1.2, at: (p, e) => ({ sx: 1 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.12 * e, sy: 1 - Math.abs(Math.sin(p * Math.PI * 2)) * 0.04 * e }) },
  // curls into a ball (the hedgehog)
  curl: { dur: 1.6, eyesShut: true, at: (p, e) => ({ sy: 1 - 0.35 * e, sx: 1 + 0.1 * e }) },
  // dances: sways and bobs
  dance: { dur: 1.8, at: (p, e) => ({ rot: Math.sin(p * Math.PI * 6) * 8 * e, lift: Math.abs(Math.sin(p * Math.PI * 6)) * 18 * e }) },
  // goes round after its tail (turned by later() in poke)
  chase: { dur: 1.6, at: (p, e) => ({ lift: Math.abs(Math.sin(p * Math.PI * 5)) * 15 * e }) },
  // crows, chest out, head back
  crow: { dur: 1.3, at: (p, e) => ({ rot: 12 * e, sy: 1 + 0.08 * e }) },
  // giggles: little quick bounces
  giggle: { dur: 1, at: (p, e) => ({ lift: Math.abs(Math.sin(p * Math.PI * 8)) * 8 * e, sy: 1 - Math.abs(Math.sin(p * Math.PI * 8)) * 0.03 * e }) },
};
/** what can be done sitting or lying */
const QUIET = ['shiver', 'no', 'giggle', 'wiggle'];
/** each hero's own reactions, shown one after another, tap by tap (spin / flip: a turn round) */
const REACTIONS: Record<string, string[]> = {
  _: ['hop', 'wiggle', 'giggle'],
  did: ['scratch', 'bow', 'no', 'dance'],
  baba: ['no', 'dance', 'bow'],
  kolobok: ['hop', 'spin', 'hops', 'giggle'],
  zayets: ['hops', 'shiver', 'hop', 'scratch'],
  vovk: ['scratch', 'crow', 'shiver'],
  vedmid: ['scratch', 'stretch', 'dance'],
  lysytsia: ['wiggle', 'spin', 'bow', 'giggle'],
  vnuchka: ['dance', 'spin', 'hop'],
  zhuchka: ['chase', 'wiggle', 'hops'],
  sobaka: ['wiggle', 'chase', 'sneeze'],
  sirko: ['scratch', 'wiggle', 'sneeze'],
  kishka: ['stretch', 'wiggle', 'sneeze'],
  kit: ['stretch', 'scratch', 'spin'],
  myshka: ['shiver', 'hops', 'giggle'],
  zhabka: ['hop', 'hops', 'giggle'],
  kaban: ['scratch', 'butt', 'sneeze'],
  koza: ['butt', 'hop', 'no'],
  yizhachok: ['curl', 'shiver', 'sneeze'],
  rak: ['shiver', 'wiggle', 'no'],
  pivnyk: ['crow', 'flip', 'hop'],
  zhuravel: ['bow', 'stretch', 'dance'],
  gusenia: ['hops', 'wiggle', 'giggle'],
  solombychok: ['butt', 'wiggle', 'sneeze'],
  telesyk: ['hop', 'flip', 'dance'],
  kotyhoroshko: ['flex', 'flip', 'hop'],
  kyrylo: ['flex', 'stretch', 'no'],
  vernyhora: ['flex', 'stretch', 'scratch'],
  vernydub: ['flex', 'scratch', 'no'],
  krutyvus: ['flex', 'no', 'dance'],
  muzhychok: ['hops', 'scratch', 'no'],
  knyaz: ['bow', 'no', 'scratch'],
  knyazivna: ['bow', 'spin', 'dance'],
  nevista: ['dance', 'spin', 'bow'],
  olenka: ['wiggle', 'giggle', 'dance'],
  zmiyuchka: ['no', 'wiggle', 'shiver'],
  koval: ['flex', 'scratch', 'no'],
  pastushok: ['hop', 'scratch', 'dance'],
  hryfon: ['crow', 'shiver', 'stretch'],
  zmiy: ['crow', 'sneeze', 'scratch'],
  ryaba: ['bow', 'wiggle', 'dance', 'flip'],
  kurcha: ['hops', 'shiver', 'spin'],
  mariyka: ['giggle', 'bow', 'hops', 'spin'],
  kit_chobotar: ['bow', 'spin', 'stretch', 'hops'],
  markiz: ['scratch', 'hop', 'bow'],
  korol: ['crow', 'no', 'dance'],
  pryntsesa: ['giggle', 'spin', 'dance', 'bow'],
  lyudozher: ['flex', 'sneeze', 'stretch', 'giggle'],
  masha: ['spin', 'hop', 'giggle', 'bow'],
  vedmedytsia: ['bow', 'wiggle', 'stretch', 'no'],
  mishko: ['hops', 'sneeze', 'chase', 'curl'],
  duimovochka: ['dance', 'giggle', 'spin', 'bow'],
  zhuk: ['wiggle', 'flex', 'sneeze', 'hops'],
  krit: ['scratch', 'no', 'stretch', 'sneeze'],
  lastivka: ['flip', 'stretch', 'wiggle', 'hop'],
  elf: ['bow', 'flip', 'hops', 'dance'],
  nifnif: ['hops', 'giggle', 'spin', 'wiggle'],
  nufnuf: ['dance', 'sneeze', 'flip', 'hop'],
  nafnaf: ['flex', 'bow', 'no', 'stretch'],
  chervona_shapochka: ['spin', 'giggle', 'hop', 'bow'],
  myslyvets: ['flex', 'no', 'stretch', 'sneeze'],
  mama: ['bow', 'dance', 'giggle'],
  drovorub: ['flex', 'scratch', 'hops'],
};

/** one heave-ho of pulling (seconds) */
const PULL = 1.8;
/** a blow: the lunge and the being thrown back (seconds) */
const HIT = 0.55;
const KNOCK = 0.7;
/** animals on four legs (lying down = flat on the belly) */
let sitIds = 0;

/**
 * People pulling reach out with the arm in front (fx pull): its shoulders in the drawing (the one
 * on the side of what it holds is used, and its own arm there, data-arm, hides), sleeve and hand
 * colours. Animals hold on as they are.
 */
const PULL_ARMS: Record<string, { sh: Point[]; sleeve: string; hand: string; w: number }> = {
  did: { sh: [[-56, -246], [56, -246]], sleeve: '#fbf7ee', hand: '#f2c4a0', w: 24 },
  baba: { sh: [[-50, -228], [50, -228]], sleeve: '#fbf7ee', hand: '#f2c4a0', w: 22 },
  vnuchka: { sh: [[-40, -212], [40, -212]], sleeve: '#fbf7ee', hand: '#f2c4a0', w: 18 },
};
/** things to sit on: sitting by one of them, a puppet gets no stool */
const SEATS = /stil|stilets|lav|penok|lizhko|koloda|tron|kamin|skrynia|zasik|vozyk|viz|sanky|kareta|chovnyk/;

type Ambient = 'birds' | 'gulls' | 'fish' | 'dolphin' | 'owl' | 'caterpillar' | 'chimney';
/** the life of each place, in the background */
const AMBIENT: Record<string, Ambient[]> = {
  hata: ['chimney', 'birds'],
  'hata-evening': ['chimney', 'birds'],
  road: ['birds', 'caterpillar'],
  luh: ['birds', 'caterpillar'],
  horod: ['birds'],
  river: ['fish', 'birds', 'caterpillar'],
  forest: ['birds', 'owl', 'caterpillar'],
  deep: ['owl'],
  glade: ['birds', 'caterpillar'],
  polyana: ['birds'],
  mountains: ['birds'],
  sea: ['dolphin', 'gulls'],
};
/** seconds between one and the next (from, to) */
const AMBIENT_EVERY: Record<Ambient, [number, number]> = {
  birds: [7, 13],
  gulls: [5, 9],
  fish: [3.5, 7],
  dolphin: [5, 9],
  owl: [8, 14],
  caterpillar: [36, 50],
  chimney: [0.6, 0.9],
};
const FOUR_LEGS = ['sirko', 'sobaka', 'zhuchka', 'koza', 'zmiy'];
const BACK = ['restoran', 'khata_vedmedya', 'khatka', 'dub', 'skatertyna', 'lunka', 'viz', 'yavir', 'kolyska', 'lokh', 'yama', 'vikno', 'dveri', 'tarilka_vody', 'lopukh', 'norka', 'kvitka_bila', 'hata_solomiana', 'hata_khmyzova', 'hata_tsehlyana', 'hata_podushkova', 'khatynka_babusi', 'lizhko_babusi'];
/**
 * What the wolf's blowing (fx blow) knocks apart, and the bits that fly off it: straw, twigs,
 * feathers out of the pillows. Anything else (the brick house) only shakes.
 */
const BLOWN: Record<string, { colors: string[]; shape: 'straw' | 'twig' | 'feather' }> = {
  hata_solomiana: { colors: ['#f2cf66', '#e9bd4c', '#d9a93a'], shape: 'straw' },
  hata_khmyzova: { colors: ['#8b5e34', '#6d4426', '#7a5230', '#7cb342'], shape: 'twig' },
  hata_podushkova: { colors: ['#ffffff', '#ffffff', '#f8bbd0', '#bbdefb', '#fff59d'], shape: 'feather' },
};

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
  for (let i = 0; i < 46; i++) {
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

/** the hen-house on stilts: a thatched roof, a round door, a ramp of slats down to the yard */
function henHouse(x: number) {
  let planks = '';
  for (let i = 0; i < 9; i++) planks += `<path d="M${x + 22 + i * 42} 392 V560" stroke="#a96f3a" stroke-width="4"/>`;
  // the slats across the ramp (it runs from the door down to the right)
  let slats = '';
  for (let i = 1; i < 9; i++) {
    const px = x + 130 + 340 * (i / 9);
    const py = 548 + 228 * (i / 9);
    slats += `<path d="M${(px - 9).toFixed(0)} ${(py + 13).toFixed(0)} L${(px + 9).toFixed(0)} ${(py - 13).toFixed(0)}" stroke="#6d4426" stroke-width="6" stroke-linecap="round"/>`;
  }
  let roof = '';
  for (let i = 0; i < 12; i++) roof += `<path d="M${x - 10 + i * 40} 392 L${x + 200 + (i - 5.5) * 8} 250" stroke="#c99a3e" stroke-width="4" stroke-linecap="round"/>`;
  return `
  <g>
    <rect x="${x + 30}" y="560" width="22" height="${GROUND - 552}" fill="#7a4e28" stroke="#5a3a22" stroke-width="4"/>
    <rect x="${x + 330}" y="560" width="22" height="${GROUND - 552}" fill="#7a4e28" stroke="#5a3a22" stroke-width="4"/>
    <rect x="${x}" y="384" width="400" height="184" fill="#c98a4b" stroke="#5a3a22" stroke-width="6"/>${planks}
    <ellipse cx="${x + 110}" cy="500" rx="42" ry="52" fill="#3a2418" stroke="#5a3a22" stroke-width="6"/>
    <path d="M${x + 70} 548 h80" stroke="#5a3a22" stroke-width="8"/>
    <rect x="${x + 238}" y="430" width="100" height="70" fill="#9fd3f0" stroke="#3b6aa0" stroke-width="7"/>
    <path d="M${x + 288} 430 v70 M${x + 238} 465 h100" stroke="#3b6aa0" stroke-width="5"/>
    <path d="M${x + 244} 494 q20 -16 44 -6 q24 -12 44 6 z" fill="#e2b45a"/>
    <path d="M${x - 40} 396 L${x + 200} 236 L${x + 440} 396 Z" fill="#e2b45a" stroke="#b78630" stroke-width="6" stroke-linejoin="round"/>${roof}
    <path d="M${x - 46} 396 Q${x + 200} 416 ${x + 446} 396 L${x + 440} 410 Q${x + 200} 430 ${x - 40} 410 Z" fill="#cf9d45"/>
    <path d="M${x + 130} 548 L${x + 470} ${GROUND + 6}" stroke="#5a3a22" stroke-width="30" stroke-linecap="round"/>
    <path d="M${x + 130} 548 L${x + 470} ${GROUND + 6}" stroke="#a87444" stroke-width="20" stroke-linecap="round"/>${slats}
  </g>`;
}

/** the hens' yard: the hen-house on the left, the wattle fence, sunflowers, grain on the ground */
function kurnyk(night: boolean) {
  let grain = '';
  for (let i = 0; i < 40; i++) grain += `<ellipse cx="${(i * 89) % 1500 + 60}" cy="${GROUND - 4 + ((i * 37) % 90)}" rx="5" ry="3.5" fill="#f2c94c"/>`;
  return (
    (night
      ? sky('#14204a', '#3d4f8a') +
        `<circle cx="1320" cy="230" r="64" fill="#fff6c8"/><circle cx="1296" cy="214" r="12" fill="#e9dfa8"/>` +
        Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 137) % 2400 - 400}" cy="${-300 + ((i * 89) % 700)}" r="${i % 3 ? 2.5 : 4}" fill="#fff"/>`).join('')
      : sky('#7cc4f2', '#d6f0ff') + sun(1380, 230) + clouds(17)) +
    [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#9ccc65', GROUND - 120, 60, 18)}</g>`).join('') +
    ground('#7cb342', '#c9a77a') +
    wattleFence(640, 1580) +
    sunflower(700, 310) +
    sunflower(1480, 290) +
    henHouse(160) +
    grain +
    // a trough of water under the hen-house
    `<path d="M300 ${GROUND + 70} L316 ${GROUND + 20} L484 ${GROUND + 20} L500 ${GROUND + 70} Z" fill="#8b5a2b" stroke="#5a3a22" stroke-width="5"/><path d="M320 ${GROUND + 26} H480" stroke="#7ec8f0" stroke-width="10"/>` +
    `<g>${verge(19, false)}</g>` +
    (night ? `<rect x="-1600" y="-1200" width="4800" height="8000" fill="#0a1030" opacity=".38"/>` : '')
  );
}

/**
 * Inside the bear's log hut: walls of round logs, a clay stove with a fire (it flickers like the
 * one in the hata), a window onto the fir forest, shelves of honey pots, a table of planks, a big
 * bed with a patchwork quilt, a paw-print rug.
 */
function berloga() {
  const F = GROUND - 40;
  let logs = '';
  for (let i = 0, y = F - 64; y > -1300; i++, y -= 64) logs += `<rect x="-1600" y="${y}" width="4800" height="62" rx="30" fill="${i % 2 ? '#9a6a3e' : '#a87a4a'}"/><path d="M-1600 ${y + 62} H3200" stroke="#6d4426" stroke-width="4"/>`;
  let planks = '';
  for (let x = -1600; x < 3200; x += 140) planks += `<path d="M${x} ${F} L${x - 260} 6000" stroke="#5d3b22" stroke-width="4"/>`;
  let quilt = '';
  const colors = ['#e57373', '#fff176', '#81c784', '#64b5f6', '#ffb74d', '#ba68c8'];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) quilt += `<rect x="${1330 + i * 52}" y="${600 + j * 40}" width="52" height="40" fill="${colors[(i + j * 3) % 6]}" stroke="#5a3a22" stroke-width="3"/>`;
  const pot = (x: number, y: number) =>
    `<path d="M${x - 26} ${y} Q${x - 34} ${y - 30} ${x - 20} ${y - 50} L${x + 20} ${y - 50} Q${x + 34} ${y - 30} ${x + 26} ${y} Z" fill="#c0542e" stroke="#7a3a1e" stroke-width="4"/>` +
    `<ellipse cx="${x}" cy="${y - 52}" rx="22" ry="6" fill="#ffb300"/><path d="M${x - 6} ${y - 50} q2 14 0 22" stroke="#ffb300" stroke-width="6" stroke-linecap="round"/>`;
  return `
  <rect x="-1600" y="-1200" width="4800" height="${F + 1200}" fill="#8b5a2b"/>${logs}
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#7a4e2a"/>${planks}
  <!-- the clay stove, its fire -->
  <path d="M160 ${F} L160 330 Q170 290 210 290 L430 290 Q470 290 480 330 L480 ${F} Z" fill="#c9b49a" stroke="#8a7458" stroke-width="6"/>
  <path d="M260 290 L270 -40 L360 -40 L370 290 Z" fill="#c9b49a" stroke="#8a7458" stroke-width="6"/>
  ${[[200, 380], [300, 350], [420, 400], [230, 480], [440, 520]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="24" ry="14" fill="#b39c80"/>`).join('')}
  <path d="M230 ${F - 10} L230 590 Q320 520 410 590 L410 ${F - 10} Z" fill="#3a2418"/>
  <ellipse data-glow="1" cx="320" cy="${F - 50}" rx="110" ry="54" fill="#ff9a3c" opacity=".45"/>
  <g transform="translate(320 ${F - 14})">
    <path data-flame="1" d="M-60 0 Q-70 -50 -42 -78 Q-34 -44 -16 -34 Q-26 -88 10 -112 Q10 -60 36 -52 Q36 -86 62 -94 Q78 -44 60 0 Z" fill="#ff7a1a"/>
    <path data-flame="1" d="M-34 0 Q-44 -34 -20 -56 Q-14 -30 0 -26 Q-6 -60 18 -78 Q22 -38 40 -30 Q52 -16 34 0 Z" fill="#ffd23f"/>
    <rect x="-70" y="-10" width="140" height="14" rx="6" fill="#4e2f18"/>
  </g>
  <!-- the window onto the forest -->
  <rect x="600" y="300" width="200" height="180" fill="#9fd3c0" stroke="#5a3a22" stroke-width="12"/>
  <path d="M640 480 L680 360 L720 480 Z M700 480 L750 330 L800 480 Z" fill="#2e6b35"/>
  <path d="M700 300 v180 M600 390 h200" stroke="#5a3a22" stroke-width="8"/>
  <!-- shelves of honey pots -->
  <rect x="880" y="330" width="360" height="16" rx="5" fill="#5d3b22"/>
  ${pot(930, 330)}${pot(1010, 330)}${pot(1090, 330)}${pot(1170, 330)}
  <!-- a table of planks on stumps -->
  <rect x="890" y="620" width="40" height="${F - 620 + 30}" fill="#6d4426"/><rect x="1150" y="620" width="40" height="${F - 620 + 30}" fill="#6d4426"/>
  <rect x="860" y="596" width="360" height="30" rx="8" fill="#a1704a" stroke="#5a3a22" stroke-width="5"/>
  <!-- the big bed, a patchwork quilt -->
  <rect x="1300" y="520" width="30" height="${F - 520 + 30}" fill="#6d4426" stroke="#4e2f18" stroke-width="4"/>
  <rect x="1310" y="590" width="360" height="40" rx="10" fill="#fbf7ee" stroke="#5a3a22" stroke-width="4"/>
  ${quilt}
  <rect x="1320" y="680" width="360" height="24" rx="6" fill="#8b5a2b" stroke="#4e2f18" stroke-width="4"/>
  <ellipse cx="1360" cy="584" rx="40" ry="20" fill="#fff" stroke="#5a3a22" stroke-width="4"/>
  <!-- a rug with paw prints -->
  <ellipse cx="760" cy="${GROUND + 70}" rx="300" ry="50" fill="#c62828" opacity=".85"/>
  ${[620, 720, 820, 900].map((x, i) => `<g transform="translate(${x} ${GROUND + 60 + (i % 2) * 22})"><ellipse rx="14" ry="11" fill="#7f1d1d"/><circle cx="-12" cy="-16" r="5" fill="#7f1d1d"/><circle cx="0" cy="-20" r="5" fill="#7f1d1d"/><circle cx="12" cy="-16" r="5" fill="#7f1d1d"/></g>`).join('')}`;
}

function stump(x: number) {
  return `<g transform="translate(${x} ${GROUND - 10})"><path d="M-46 0 L-40 -70 L40 -70 L46 0 Z" fill="#7a5232" stroke="#5a3a22" stroke-width="5"/>
    <ellipse cx="0" cy="-74" rx="48" ry="16" fill="#f7fbff" stroke="#c9dcee" stroke-width="4"/></g>`;
}

// ---------- «Кіт у чоботях» ----------

/** the windmill on a hill (the miller's mill): a tower of planks, four sails, sacks of flour at the door */
function windmill(x: number) {
  const y = GROUND - 150;
  let planks = '';
  for (let i = 1; i < 8; i++) planks += `<path d="M${x - 90 + i * 4} ${y - i * 44} H${x + 90 - i * 4}" stroke="#8b5a2b" stroke-width="3"/>`;
  const sail = (a: number) => `<g transform="rotate(${a} ${x} ${y - 330})"><path d="M${x} ${y - 330} V${y - 560}" stroke="#5a3a22" stroke-width="10"/>
    <rect x="${x + 4}" y="${y - 550}" width="56" height="200" fill="#fbf7ee" stroke="#5a3a22" stroke-width="5"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${x + 4} ${y - 510 + i * 40} h56" stroke="#c9b48a" stroke-width="3"/>`).join('')}</g>`;
  return `<g>
    <path d="M${x - 420} ${GROUND - 40} Q${x} ${y - 120} ${x + 460} ${GROUND - 40} Z" fill="#8bc34a"/>
    <path d="M${x - 96} ${y + 20} L${x - 64} ${y - 320} L${x + 64} ${y - 320} L${x + 96} ${y + 20} Z" fill="#c98a4b" stroke="#5a3a22" stroke-width="6"/>${planks}
    <path d="M${x - 84} ${y - 316} Q${x} ${y - 420} ${x + 84} ${y - 316} Z" fill="#8d6e63" stroke="#5a3a22" stroke-width="6"/>
    <path d="M${x - 30} ${y + 20} v-90 q30 -30 60 0 v90 Z" fill="#5d3b22"/>
    <circle cx="${x}" cy="${y - 200}" r="24" fill="#9fd3f0" stroke="#5a3a22" stroke-width="6"/>
    ${sail(20)}${sail(110)}${sail(200)}${sail(290)}
    <circle cx="${x}" cy="${y - 330}" r="16" fill="#5d3b22"/>
    ${[[-150, 0], [-110, 6], [-130, -34]].map(([dx, dy]) => `<path d="M${x + dx - 26} ${y + 30 + dy} Q${x + dx - 32} ${y - 20 + dy} ${x + dx - 14} ${y - 34 + dy} L${x + dx + 14} ${y - 34 + dy} Q${x + dx + 32} ${y - 20 + dy} ${x + dx + 26} ${y + 30 + dy} Z" fill="#fff8e1" stroke="#5a3a22" stroke-width="4"/>`).join('')}
  </g>`;
}

/** the king's throne room: pink-gold walls, tall arched windows, red banners with crowns, a red carpet, the gold throne */
function palats() {
  const F = GROUND - 40;
  const win = (x: number) => `<path d="M${x - 70} ${F - 140} V200 Q${x} 90 ${x + 70} 200 V${F - 140} Z" fill="#9fd3f0" stroke="#c99a1e" stroke-width="10"/>
    <path d="M${x} ${F - 140} V140 M${x - 70} 380 h140" stroke="#c99a1e" stroke-width="6"/>
    <path d="M${x - 50} ${F - 150} q20 -60 50 -20 q30 -50 50 20 z" fill="#7cb342" opacity=".7"/>`;
  const banner = (x: number) => `<path d="M${x - 50} 80 H${x + 50} V330 L${x} 290 L${x - 50} 330 Z" fill="#c62828" stroke="#8e1b1b" stroke-width="5"/>
    <path d="M${x - 26} 210 L${x - 30} 170 L${x - 12} 186 L${x} 156 L${x + 12} 186 L${x + 30} 170 L${x + 26} 210 Z" fill="#ffd54f" stroke="#c99a1e" stroke-width="3"/>`;
  const column = (x: number) => `<rect x="${x - 30}" y="-1200" width="60" height="${F + 1200}" fill="#fff3d6" stroke="#e0c27a" stroke-width="5"/><rect x="${x - 44}" y="${F - 40}" width="88" height="40" fill="#f2d27a" stroke="#c99a1e" stroke-width="5"/>`;
  return `
  <rect x="-1600" y="-1200" width="4800" height="${F + 1200}" fill="#f8e1c4"/>
  ${Array.from({ length: 30 }, (_, i) => `<path d="M${-1600 + i * 160 + 80} 60 l14 20 l-14 20 l-14 -20 z" fill="#f0c98a"/>`).join('')}
  <rect x="-1600" y="${F - 30}" width="4800" height="30" fill="#e0b97a"/>
  ${win(160)}${win(560)}${banner(360)}${banner(820)}
  ${column(-40)}${column(1000)}${column(1640)}
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#d7b98a"/>
  ${Array.from({ length: 24 }, (_, i) => `<path d="M${-1600 + i * 200} ${F} L${-1900 + i * 200} 6000" stroke="#c4a374" stroke-width="4"/>`).join('')}
  <path d="M-1600 ${GROUND + 6} L3200 ${GROUND + 6} L3200 ${GROUND + 120} L-1600 ${GROUND + 120} Z" fill="#c62828"/>
  <path d="M-1600 ${GROUND + 18} H3200 M-1600 ${GROUND + 108} H3200" stroke="#ffd54f" stroke-width="6"/>
  <!-- the throne -->
  <g transform="translate(1150 ${F})">
    <path d="M-120 0 V-330 Q-120 -420 0 -440 Q120 -420 120 -330 V0 Z" fill="#ffd54f" stroke="#c99a1e" stroke-width="8"/>
    <path d="M-86 -60 V-320 Q-86 -390 0 -400 Q86 -390 86 -320 V-60 Z" fill="#c62828"/>
    <path d="M-40 -440 L-48 -490 L-20 -466 L0 -508 L20 -466 L48 -490 L40 -440 Z" fill="#ffd54f" stroke="#c99a1e" stroke-width="5"/>
    <rect x="-150" y="-150" width="40" height="150" rx="10" fill="#ffd54f" stroke="#c99a1e" stroke-width="6"/>
    <rect x="110" y="-150" width="40" height="150" rx="10" fill="#ffd54f" stroke="#c99a1e" stroke-width="6"/>
    <rect x="-130" y="-130" width="260" height="40" rx="12" fill="#e53935" stroke="#8e1b1b" stroke-width="5"/>
  </g>`;
}

/** the river bank: the road on the left, the river on the right (water in front of the bather is the actor voda) */
function richka() {
  return (
    sky('#7cc4f2', '#e0f4ff') +
    sun(1380, 230) +
    clouds(221) +
    [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#a5d6a7', GROUND - 190, 60, 222)}${treeRow(223, false)}</g>`).join('') +
    `<rect x="-1600" y="${GROUND - 120}" width="4800" height="90" fill="#4aa3df"/>` +
    ground('#7cb342', '#c9a77a') +
    `<path d="M1070 ${GROUND - 40} Q1120 ${GROUND + 30} 1100 2000 L3200 2000 L3200 ${GROUND - 40} Z" fill="#4aa3df"/>` +
    `<path d="M1060 ${GROUND - 40} Q1122 ${GROUND + 30} 1102 2000" fill="none" stroke="#c9a77a" stroke-width="16"/>` +
    Array.from({ length: 14 }, (_, i) => `<path d="M${1160 + ((i * 97) % 460)} ${GROUND - 20 + ((i * 53) % 200)} q20 -9 40 0" stroke="#d6f0ff" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') +
    Array.from({ length: 7 }, (_, i) => `<g transform="translate(${1040 + i * 14} ${GROUND - 30})"><path d="M0 0 V-${80 + (i % 3) * 20}" stroke="#5d8f3a" stroke-width="5"/><rect x="-5" y="-${108 + (i % 3) * 20}" width="10" height="30" rx="5" fill="#7a4a24"/></g>`).join('') +
    `<g>${verge(224, false)}</g>`.replace('<g>', '<g transform="translate(-700 0)">')
  );
}

/** the ogre's castle: grey walls and towers with red roofs and purple flags, an open gate */
function zamok() {
  const x = 1150;
  const B = GROUND - 30;
  let cren = '';
  for (let i = 0; i < 9; i++) cren += `<rect x="${x - 300 + i * 70}" y="${B - 440}" width="40" height="40" fill="#9e9e9e" stroke="#616161" stroke-width="5"/>`;
  const tower = (tx: number, h: number) => `<rect x="${tx - 80}" y="${B - h}" width="160" height="${h}" fill="#a8a8a8" stroke="#616161" stroke-width="6"/>
    <path d="M${tx - 100} ${B - h} L${tx} ${B - h - 200} L${tx + 100} ${B - h} Z" fill="#c62828" stroke="#8e1b1b" stroke-width="6"/>
    <path d="M${tx} ${B - h - 200} V${B - h - 280}" stroke="#5a3a22" stroke-width="6"/><path d="M${tx} ${B - h - 280} l70 18 l-70 18 z" fill="#7b1fa2"/>
    <path d="M${tx - 18} ${B - h + 110} v-40 q18 -24 36 0 v40 z" fill="#3a3a3a"/>`;
  let blocks = '';
  for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) blocks += `<rect x="${x - 290 + c * 74 + (r % 2) * 30}" y="${B - 400 + r * 44}" width="60" height="30" rx="4" fill="none" stroke="#8a8a8a" stroke-width="3"/>`;
  return (
    sky('#8fb8e0', '#f3e2c4') +
    sun(300, 220, '#ffcc66') +
    clouds(231) +
    [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#93b07a', GROUND - 170, 70, 232)}</g>`).join('') +
    ground('#7a9c4a', '#b8a48a') +
    `<rect x="${x - 300}" y="${B - 400}" width="600" height="400" fill="#b5b5b5" stroke="#616161" stroke-width="6"/>${blocks}${cren}` +
    tower(x - 320, 560) +
    tower(x + 320, 520) +
    `<path d="M${x - 90} ${B} V${B - 170} Q${x} ${B - 260} ${x + 90} ${B - 170} V${B} Z" fill="#2b2420" stroke="#616161" stroke-width="8"/>` +
    Array.from({ length: 5 }, (_, i) => `<path d="M${x - 70 + i * 35} ${B - 216 + Math.abs(i - 2) * 14} V${B - 120}" stroke="#555" stroke-width="7"/>`).join('') +
    `<path d="M${x - 90} ${B - 120} H${x + 90}" stroke="#555" stroke-width="7"/>` +
    `<path d="M${x - 110} ${GROUND + 160} L${x - 90} ${B} L${x + 90} ${B} L${x + 140} ${GROUND + 160} Z" fill="#c9b48a"/>` +
    `<g>${verge(233, false)}</g>`
  );
}

/** the ogre's hall: grey stone walls, tall windows, a fireplace, his huge chair, chests of gold, a high beam (сволок) the cat jumps onto */
function zal() {
  const F = GROUND - 40;
  let blocks = '';
  for (let r = 0; r < 22; r++) for (let c = 0; c < 22; c++) blocks += `<rect x="${-200 + c * 100 + (r % 2) * 50}" y="${F - 60 - r * 60}" width="96" height="56" rx="6" fill="none" stroke="#8d8f96" stroke-width="3"/>`;
  const win = (x: number) => `<path d="M${x - 60} 520 V220 Q${x} 140 ${x + 60} 220 V520 Z" fill="#5f7fa8" stroke="#555a64" stroke-width="10"/><path d="M${x} 520 V160 M${x - 60} 360 h120" stroke="#555a64" stroke-width="6"/>`;
  const chest = (x: number) => `<path d="M${x - 60} ${F + 30} V${F - 40} H${x + 60} V${F + 30} Z" fill="#8b5a2b" stroke="#5a3a22" stroke-width="5"/>
    <path d="M${x - 64} ${F - 40} Q${x} ${F - 110} ${x + 64} ${F - 40}" fill="#ffd54f" stroke="#c99a1e" stroke-width="4"/>
    ${[-30, 0, 30, -14, 16].map((d, i) => `<ellipse cx="${x + d}" cy="${F - 56 - (i > 2 ? 20 : 0)}" rx="14" ry="6" fill="#ffe082" stroke="#c99a1e" stroke-width="2"/>`).join('')}
    <rect x="${x - 10}" y="${F - 30}" width="20" height="24" fill="#ffd54f" stroke="#5a3a22" stroke-width="3"/>`;
  return `
  <rect x="-1600" y="-1200" width="4800" height="${F + 1200}" fill="#a3a6ae"/>${blocks}
  ${win(1000)}${win(1500)}
  <!-- the fireplace -->
  <path d="M-200 ${F} V420 H140 V${F} Z" fill="#7d7f86" stroke="#555a64" stroke-width="8"/>
  <path d="M-150 ${F} V520 Q-30 440 90 520 V${F} Z" fill="#2b2420"/>
  <ellipse data-glow="1" cx="-30" cy="${F - 50}" rx="120" ry="54" fill="#ff9a3c" opacity=".45"/>
  <g transform="translate(-30 ${F - 10})">
    <path data-flame="1" d="M-60 0 Q-70 -50 -42 -78 Q-34 -44 -16 -34 Q-26 -88 10 -112 Q10 -60 36 -52 Q36 -86 62 -94 Q78 -44 60 0 Z" fill="#ff7a1a"/>
    <path data-flame="1" d="M-34 0 Q-44 -34 -20 -56 Q-14 -30 0 -26 Q-6 -60 18 -78 Q22 -38 40 -30 Q52 -16 34 0 Z" fill="#ffd23f"/>
  </g>
  <!-- the high beam on two posts -->
  <rect x="200" y="-1200" width="40" height="${F + 1200}" fill="#6d4426" stroke="#4e2f18" stroke-width="5"/>
  <rect x="700" y="-1200" width="40" height="${F + 1200}" fill="#6d4426" stroke="#4e2f18" stroke-width="5"/>
  <path d="M220 ${GROUND - 300} L300 ${GROUND - 220} M720 ${GROUND - 300} L640 ${GROUND - 220}" stroke="#6d4426" stroke-width="18"/>
  <rect x="120" y="${GROUND - 350}" width="700" height="44" rx="8" fill="#8b5a2b" stroke="#4e2f18" stroke-width="6"/>
  <path d="M140 ${GROUND - 328} H800" stroke="#6d4426" stroke-width="4"/>
  <!-- banners -->
  <path d="M1200 100 H1300 V340 L1250 300 L1200 340 Z" fill="#7b1fa2" stroke="#4a148c" stroke-width="5"/>
  <circle cx="1250" cy="200" r="24" fill="#ffd54f" stroke="#c99a1e" stroke-width="4"/>
  <!-- the ogre's huge chair -->
  <g transform="translate(1380 ${F})">
    <path d="M-110 0 V-420 Q0 -470 110 -420 V0 Z" fill="#5d4037" stroke="#3e2723" stroke-width="8"/>
    <path d="M-80 -110 V-390 Q0 -430 80 -390 V-110 Z" fill="#7b1fa2"/>
    <rect x="-140" y="-140" width="280" height="44" rx="12" fill="#6d4c41" stroke="#3e2723" stroke-width="6"/>
  </g>
  ${chest(560)}${chest(1640)}
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#6f7178"/>
  ${Array.from({ length: 30 }, (_, i) => `<path d="M${-1600 + i * 180} ${F} L${-1900 + i * 180} 6000" stroke="#5d5f66" stroke-width="4"/>`).join('')}
  ${Array.from({ length: 6 }, (_, i) => `<path d="M-1600 ${F + 40 + i * 70} H3200" stroke="#5d5f66" stroke-width="4"/>`).join('')}
  <path d="M-1600 ${GROUND + 6} L3200 ${GROUND + 6} L3200 ${GROUND + 110} L-1600 ${GROUND + 110} Z" fill="#7b1fa2" opacity=".85"/>`;
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

// ---------- «Три ведмеді» ----------

/** the bears' hut inside: honey-coloured log walls, a plank floor, a beam; room: what is in it */
function vedmezha(room: 'svitlytsia' | 'spalnia') {
  const F = GROUND - 40;
  let logs = '';
  for (let i = 0, y = F - 60; y > -1300; i++, y -= 60) logs += `<rect x="-1600" y="${y}" width="4800" height="58" rx="28" fill="${i % 2 ? '#c99a62' : '#d6aa70'}"/><path d="M-1600 ${y + 58} H3200" stroke="#8a5e34" stroke-width="4"/>`;
  let planks = '';
  for (let x = -1600; x < 3200; x += 130) planks += `<path d="M${x} ${F} L${x - 280} 6000" stroke="#7a5232" stroke-width="4"/>`;
  const base = `
  <rect x="-1600" y="-1300" width="4800" height="${F + 1300}" fill="#c99a62"/>${logs}
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#a1704a"/>${planks}
  <rect x="-1600" y="${F - 14}" width="4800" height="18" fill="#7a5232"/>`;
  // a bear's face in a round frame (the portraits over the beds), s — its size
  const portrait = (x: number, y: number, s: number, fur: string, frame: string, extra = '') => `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 -70 V-110" stroke="#5a3a22" stroke-width="3"/><circle cx="0" cy="-112" r="5" fill="#5a3a22"/>
    <ellipse cx="0" cy="0" rx="62" ry="70" fill="#fff8e1" stroke="${frame}" stroke-width="12"/>
    <circle cx="-26" cy="-30" r="14" fill="${fur}" stroke="#5a3a22" stroke-width="3"/><circle cx="26" cy="-30" r="14" fill="${fur}" stroke="#5a3a22" stroke-width="3"/>
    <ellipse cx="0" cy="6" rx="38" ry="34" fill="${fur}" stroke="#5a3a22" stroke-width="3"/>
    <ellipse cx="0" cy="18" rx="16" ry="12" fill="#e6c49a"/><ellipse cx="0" cy="12" rx="6" ry="4" fill="#2b1a10"/>
    <circle cx="-13" cy="-4" r="4" fill="#2b1a10"/><circle cx="13" cy="-4" r="4" fill="#2b1a10"/>${extra}</g>`;
  if (room === 'svitlytsia')
    return `${base}
  <!-- the clay stove, its fire, a pot on it -->
  <path d="M60 ${F} L60 330 Q70 290 110 290 L330 290 Q370 290 380 330 L380 ${F} Z" fill="#efe3cf" stroke="#b9a586" stroke-width="6"/>
  <path d="M170 290 L180 -60 L270 -60 L280 290 Z" fill="#efe3cf" stroke="#b9a586" stroke-width="6"/>
  <path d="M130 ${F - 10} L130 590 Q220 520 310 590 L310 ${F - 10} Z" fill="#3a2418"/>
  <ellipse data-glow="1" cx="220" cy="${F - 50}" rx="110" ry="54" fill="#ff9a3c" opacity=".45"/>
  <g transform="translate(220 ${F - 14})">
    <path data-flame="1" d="M-60 0 Q-70 -50 -42 -78 Q-34 -44 -16 -34 Q-26 -88 10 -112 Q10 -60 36 -52 Q36 -86 62 -94 Q78 -44 60 0 Z" fill="#ff7a1a"/>
    <path data-flame="1" d="M-34 0 Q-44 -34 -20 -56 Q-14 -30 0 -26 Q-6 -60 18 -78 Q22 -38 40 -30 Q52 -16 34 0 Z" fill="#ffd23f"/>
    <rect x="-70" y="-10" width="140" height="14" rx="6" fill="#4e2f18"/>
  </g>
  ${[[100, 380], [340, 420], [110, 520], [350, 560]].map(([x, y]) => `<path d="M${x - 16} ${y} q16 -22 32 0 q-16 14 -32 0z" fill="#e53935"/><circle cx="${x}" cy="${y - 2}" r="5" fill="#ffd54f"/>`).join('')}
  <path d="M250 290 q-30 0 -30 -34 q0 -30 30 -34 q30 4 30 34 q0 34 -30 34z" fill="#c0542e" stroke="#7a3a1e" stroke-width="4"/>
  <!-- the window with little curtains -->
  <rect x="680" y="230" width="240" height="210" fill="#9fd3c0" stroke="#5a3a22" stroke-width="12"/>
  <path d="M700 440 L750 320 L800 440 Z M780 440 L840 290 L900 440 Z" fill="#2e7d32"/>
  <path d="M800 230 v210 M680 335 h240" stroke="#5a3a22" stroke-width="8"/>
  <path d="M674 226 Q720 300 690 380 L674 380 Z M926 226 Q880 300 910 380 L926 380 Z" fill="#e57373" stroke="#5a3a22" stroke-width="4"/>
  <rect x="664" y="440" width="272" height="16" rx="5" fill="#8b5a2b" stroke="#5a3a22" stroke-width="4"/>
  <!-- three hats on pegs: the father's big brown one, the mother's red kerchief, Mishko's blue cap -->
  <rect x="1100" y="190" width="420" height="14" rx="5" fill="#6d4426"/>
  <path d="M1140 200 q0 -70 60 -72 q60 2 60 72 z" fill="#6d4c41" stroke="#3e2723" stroke-width="5"/><rect x="1120" y="194" width="160" height="16" rx="7" fill="#5d4037" stroke="#3e2723" stroke-width="4"/>
  <path d="M1320 204 L1370 290 L1420 204 Z" fill="#d32f2f" stroke="#5a3a22" stroke-width="4"/><circle cx="1350" cy="230" r="4" fill="#fff"/><circle cx="1385" cy="226" r="4" fill="#fff"/><circle cx="1368" cy="256" r="4" fill="#fff"/>
  <path d="M1452 204 q0 -44 34 -44 q34 0 34 44 z" fill="#1e88e5" stroke="#0d47a1" stroke-width="4"/><circle cx="1486" cy="158" r="8" fill="#fff" stroke="#0d47a1" stroke-width="3"/>
  <!-- a shelf with three mugs: big, middle, little -->
  <rect x="1100" y="420" width="420" height="14" rx="5" fill="#6d4426"/>
  <path d="M1140 420 v-70 h60 v70 z" fill="#8d5a2b" stroke="#5a3a22" stroke-width="4"/><path d="M1200 364 q24 0 24 20 q0 18 -24 18" fill="none" stroke="#5a3a22" stroke-width="6"/>
  <path d="M1280 420 v-52 h46 v52 z" fill="#c62828" stroke="#5a3a22" stroke-width="4"/><path d="M1326 378 q18 0 18 14 q0 14 -18 14" fill="none" stroke="#5a3a22" stroke-width="5"/>
  <path d="M1410 420 v-36 h32 v36 z" fill="#1e88e5" stroke="#5a3a22" stroke-width="4"/><path d="M1442 392 q12 0 12 10 q0 10 -12 10" fill="none" stroke="#5a3a22" stroke-width="4"/>
  <!-- a round rug -->
  <ellipse cx="900" cy="${GROUND + 80}" rx="420" ry="56" fill="#f5c542" opacity=".9"/>
  <ellipse cx="900" cy="${GROUND + 80}" rx="330" ry="40" fill="none" stroke="#e57373" stroke-width="10"/>`;
  return `${base}
  <!-- the portraits: the father, the mother in her kerchief, Mishko -->
  ${portrait(430, 250, 1.1, '#7b4b2a', '#6d4426')}
  ${portrait(930, 190, 0.9, '#96603a', '#b07a45', '<path d="M-44 -24 Q-40 -62 0 -64 Q40 -62 44 -24 Q30 -46 0 -46 Q-30 -46 -44 -24 Z" fill="#d32f2f" stroke="#5a3a22" stroke-width="3"/>')}
  ${portrait(1240, 340, 0.7, '#b9814a', '#1e88e5')}
  <!-- a shelf with a candle and a clock -->
  <rect x="580" y="430" width="160" height="12" rx="4" fill="#6d4426"/>
  <rect x="604" y="380" width="18" height="50" fill="#fff8e1" stroke="#5a3a22" stroke-width="3"/><path d="M613 376 q-8 -14 0 -26 q8 12 0 26z" fill="#ffb300"/>
  <circle cx="690" cy="396" r="30" fill="#fff8e1" stroke="#5a3a22" stroke-width="5"/><path d="M690 396 V376 M690 396 h14" stroke="#5a3a22" stroke-width="4" stroke-linecap="round"/>
  <!-- a long rug with paw prints -->
  <rect x="80" y="${GROUND + 40}" width="1440" height="70" rx="30" fill="#7cb342" opacity=".85"/>
  ${[200, 420, 640, 860, 1080, 1300].map((x, i) => `<g transform="translate(${x} ${GROUND + 70 + (i % 2) * 14})"><ellipse rx="13" ry="10" fill="#33691e"/><circle cx="-11" cy="-15" r="4.5" fill="#33691e"/><circle cx="0" cy="-19" r="4.5" fill="#33691e"/><circle cx="11" cy="-15" r="4.5" fill="#33691e"/></g>`).join('')}`;
}

// ---------- «Дюймовочка» ----------

/**
 * On the woman's table, seen as tiny Thumbelina sees it: the tabletop is the floor, the window
 * behind is huge, a giant spool of thread and a thimble stand about. Night: a dark window with the
 * moon and a broken pane (the toad comes in through it), the room dim.
 */
function stilZblyzka(night: boolean) {
  const F = GROUND - 40;
  let grain = '';
  for (let i = 0; i < 9; i++) grain += `<path d="M-1600 ${F + 30 + i * 46} Q0 ${F + 20 + i * 46} 3200 ${F + 34 + i * 46}" stroke="#a87444" stroke-width="4" fill="none"/>`;
  const pane = (x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${night ? '#1a2350' : '#a9dcf5'}"/>`;
  return `
  <rect x="-1600" y="-1400" width="4800" height="${F + 1400}" fill="#efe2c6"/>
  ${Array.from({ length: 30 }, (_, i) => `<path d="M${-1600 + i * 170} -1400 V${F}" stroke="#e6d6b4" stroke-width="40"/>`).join('')}
  <!-- the huge window -->
  <rect x="160" y="-760" width="1280" height="${F - 140 + 760}" fill="#8b5a2b"/>
  ${pane(220, -700, 560, 420)}${pane(820, -700, 560, 420)}${pane(220, -240, 560, F - 220 + 40)}${pane(820, -240, 560, F - 220 + 40)}
  ${night
    ? `<circle cx="1150" cy="-500" r="80" fill="#fff6c8"/><circle cx="1120" cy="-520" r="16" fill="#e9dfa8"/>` +
      Array.from({ length: 16 }, (_, i) => `<circle cx="${240 + ((i * 173) % 1130)}" cy="${-680 + ((i * 97) % 380)}" r="${i % 3 ? 3 : 5}" fill="#fff"/>`).join('') +
      // the broken pane, low on the left: a jagged hole with the night beyond and splinters of glass
      `<path d="M260 ${F - 160} L300 ${F - 330} L360 ${F - 250} L420 ${F - 380} L470 ${F - 260} L540 ${F - 300} L560 ${F - 160} Z" fill="#0b1030" stroke="#cfd8dc" stroke-width="5"/>` +
      `<path d="M240 ${F - 150} l40 -20 M560 ${F - 150} l-30 -24" stroke="#cfd8dc" stroke-width="4"/>`
    : `${cloud(500, -560, 1.8)}${cloud(1150, -420, 1.4)}<circle cx="1250" cy="-600" r="70" fill="#ffd54f"/>`}
  <path d="M780 -700 V${F - 160} M820 -700 V${F - 160}" stroke="#6d4426" stroke-width="10"/>
  <rect x="120" y="${F - 170}" width="1360" height="60" rx="14" fill="#a0703c" stroke="#5a3a22" stroke-width="8"/>
  <!-- the tabletop: the floor down here -->
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#c08a52"/>${grain}
  <path d="M-1600 ${F} H3200" stroke="#8b5a2b" stroke-width="8"/>
  <!-- a giant spool of red thread, a giant thimble -->
  <g transform="translate(-60 ${F + 4})">
    <rect x="-110" y="-30" width="220" height="30" rx="8" fill="#d7a86e" stroke="#5a3a22" stroke-width="6"/>
    <rect x="-80" y="-300" width="160" height="270" fill="#e53935" stroke="#5a3a22" stroke-width="6"/>
    ${Array.from({ length: 12 }, (_, i) => `<path d="M-80 ${-290 + i * 22} L80 ${-280 + i * 22}" stroke="#b71c1c" stroke-width="4"/>`).join('')}
    <rect x="-110" y="-330" width="220" height="30" rx="8" fill="#d7a86e" stroke="#5a3a22" stroke-width="6"/>
  </g>
  <g transform="translate(1660 ${F + 4})">
    <path d="M-120 0 L-96 -300 Q0 -360 96 -300 L120 0 Z" fill="#cfd8dc" stroke="#78909c" stroke-width="6"/>
    ${Array.from({ length: 30 }, (_, i) => `<circle cx="${-90 + (i % 6) * 36 + (Math.floor(i / 6) % 2) * 18}" cy="${-260 + Math.floor(i / 6) * 50}" r="7" fill="#90a4ae"/>`).join('')}
  </g>
  ${night ? `<rect x="-1600" y="-1400" width="4800" height="8000" fill="#0a1030" opacity=".42"/><path d="M820 -700 L1380 -700 L1700 ${F + 300} L600 ${F + 300} Z" fill="#fff6c8" opacity=".08"/>` : ''}`;
}

/** a winter field: stubble sticking out of the snow, a wood far off, grey sky, snow falling */
function zymovePole() {
  let stubble = '';
  const r = rand(235);
  for (let i = 0; i < 70; i++) {
    const x = -400 + r() * 2400;
    const y = GROUND - 30 + r() * 200;
    stubble += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} l-6 -22 M${(x + 8).toFixed(0)} ${y.toFixed(0)} l2 -26 M${(x + 16).toFixed(0)} ${y.toFixed(0)} l8 -20" stroke="#c9a14a" stroke-width="5" stroke-linecap="round"/>`;
  }
  return (
    sky('#97aec6', '#e6edf4') +
    clouds(231).replace(/opacity=".92"/, 'opacity=".55"') +
    [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${snowHills('#e3ecf5', GROUND - 170, 50, 232)}${snowFirRow(233, 9, GROUND - 110, 0.45)}</g>`).join('') +
    snowGround(234, false) +
    stubble
  );
}

/** the field mouse's home under the stubble: earth walls and roots, sacks and heaps of grain, a lamp, a rug */
function norkaInside() {
  const F = GROUND - 40;
  let stones = '';
  for (let i = 0; i < 40; i++) stones += `<ellipse cx="${(i * 157) % 2600 - 500}" cy="${-500 + ((i * 89) % 1100)}" rx="${14 + (i % 4) * 6}" ry="${9 + (i % 3) * 4}" fill="#7a5b4c"/>`;
  const sack = (x: number, s: number) => `<g transform="translate(${x} ${F + 6}) scale(${s})">
    <path d="M-60 0 Q-74 -110 -30 -140 L30 -140 Q74 -110 60 0 Z" fill="#e8d5a8" stroke="#8d6e3b" stroke-width="6"/>
    <path d="M-30 -140 Q0 -170 30 -140" fill="#e8d5a8" stroke="#8d6e3b" stroke-width="6"/><path d="M-34 -134 H34" stroke="#c62828" stroke-width="8"/></g>`;
  const heap = (x: number, y: number, w: number, c: string) => `<path d="M${x - w} ${y} Q${x} ${y - w * 0.9} ${x + w} ${y} Z" fill="${c}" stroke="#8d6e3b" stroke-width="4"/>`;
  return `
  <rect x="-1600" y="-1400" width="4800" height="${F + 1400}" fill="#8d6e63"/>${stones}
  <!-- the arched ceiling, roots hanging down -->
  <path d="M-1600 -60 Q-800 -260 0 -60 Q800 -260 1600 -60 Q2400 -260 3200 -60 L3200 -1400 L-1600 -1400 Z" fill="#5d4037"/>
  ${Array.from({ length: 12 }, (_, i) => `<path d="M${-200 + i * 170} ${-120 + (i % 3) * 30} q${i % 2 ? 20 : -20} 80 ${i % 2 ? -6 : 10} 160" stroke="#a1887f" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}
  <!-- shelves dug into the wall, heaps of grain on them -->
  <rect x="980" y="360" width="460" height="22" rx="8" fill="#6d4426"/>
  ${heap(1060, 360, 60, '#f2c14e')}${heap(1210, 360, 52, '#d7b26a')}${heap(1360, 360, 58, '#e8c35a')}
  <rect x="980" y="540" width="460" height="22" rx="8" fill="#6d4426"/>
  ${heap(1080, 540, 56, '#c9a14a')}${heap(1260, 540, 66, '#f2c14e')}
  <!-- a lamp in a nutshell: a warm glow -->
  <ellipse cx="560" cy="370" rx="150" ry="110" fill="#ffe0a0" opacity=".22"/><ellipse cx="560" cy="360" rx="80" ry="60" fill="#fff3c4" opacity=".3"/>
  <path d="M520 360 Q560 410 600 360 Z" fill="#a1704a" stroke="#5a3a22" stroke-width="5"/><path d="M560 356 q-10 -20 0 -40 q10 20 0 40z" fill="#ffb300"/>
  <path d="M560 316 V200" stroke="#5a3a22" stroke-width="4"/>
  <!-- the floor of trodden earth, a red rug -->
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#6d4c41"/>
  <ellipse cx="800" cy="${GROUND + 70}" rx="520" ry="60" fill="#c62828" opacity=".85"/>
  <ellipse cx="800" cy="${GROUND + 70}" rx="430" ry="44" fill="none" stroke="#ffd54f" stroke-width="8"/>
  ${sack(150, 1)}${sack(300, 0.8)}${sack(1500, 0.9)}`;
}

/** the mole's long tunnel: dark earth, roots, pebbles, a dim greyish light */
function khid() {
  const F = GROUND - 40;
  let pebbles = '';
  for (let i = 0; i < 50; i++) pebbles += `<ellipse cx="${(i * 131) % 2800 - 600}" cy="${-600 + ((i * 71) % 1300)}" rx="${10 + (i % 4) * 6}" ry="${7 + (i % 3) * 4}" fill="${i % 3 ? '#4e342e' : '#6d4c41'}"/>`;
  return `
  <rect x="-1600" y="-1400" width="4800" height="8000" fill="#3e2723"/>${pebbles}
  <!-- the tunnel: a long lighter tube of earth -->
  <path d="M-1600 ${F + 60} L-1600 120 Q800 40 3200 120 L3200 ${F + 60} Z" fill="#5d4037"/>
  <path d="M-1600 120 Q800 40 3200 120" stroke="#2b1b17" stroke-width="16" fill="none"/>
  ${Array.from({ length: 14 }, (_, i) => `<path d="M${-300 + i * 160} ${110 - (i % 2) * 20} q${i % 2 ? 24 : -24} 70 ${i % 2 ? -10 : 8} ${120 + (i % 3) * 40}" stroke="#8d6e63" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#4e342e"/>
  ${Array.from({ length: 20 }, (_, i) => `<ellipse cx="${(i * 113) % 1900 - 150}" cy="${GROUND + 20 + ((i * 47) % 160)}" rx="${12 + (i % 3) * 6}" ry="7" fill="#3e2723"/>`).join('')}
  <rect x="-1600" y="-1400" width="4800" height="8000" fill="#1a0f0c" opacity=".18"/>`;
}

/** a giant flower in the warm land's meadow */
function bigFlower(x: number, h: number, c: string, s = 1) {
  let p = '';
  for (let i = 0; i < 6; i++) p += `<ellipse cx="0" cy="-46" rx="24" ry="46" fill="${c}" transform="rotate(${i * 60})"/>`;
  return `<g transform="translate(${x} ${GROUND}) scale(${s})"><path d="M0 0 Q-14 ${-h / 2} 0 ${-h}" stroke="#388e3c" stroke-width="14" fill="none"/>
    <path d="M0 ${-h * 0.4} q-70 -40 -90 0 q50 20 90 0 M0 ${-h * 0.6} q70 -40 90 0 q-50 20 -90 0" fill="#4caf50"/>
    <g transform="translate(0 ${-h})">${p}<circle r="26" fill="#fff59d"/></g></g>`;
}

/** the warm land: a blue lake, a white marble palace wound with vines, giant flowers */
function teplyiKrai() {
  const col = (x: number, h: number) => `<rect x="${x - 26}" y="${GROUND - 160 - h}" width="52" height="${h}" fill="#fafafa" stroke="#cfd8dc" stroke-width="5"/>
    <rect x="${x - 36}" y="${GROUND - 176 - h}" width="72" height="22" rx="4" fill="#fafafa" stroke="#cfd8dc" stroke-width="5"/>
    <path d="M${x - 26} ${GROUND - 160 - h * 0.8} q30 20 0 40 q-30 20 0 40 q30 20 0 40" stroke="#43a047" stroke-width="8" fill="none"/>`;
  return (
    sky('#4fc3f7', '#e1f5fe') +
    sun(1380, 220, '#ffe082') +
    clouds(241) +
    [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#80cbc4', GROUND - 230, 70, 242)}</g>`).join('') +
    `<rect x="-1600" y="${GROUND - 210}" width="4800" height="110" fill="#29b6f6"/>` +
    Array.from({ length: 14 }, (_, i) => `<path d="M${(i * 157) % 2200 - 300} ${GROUND - 190 + (i % 3) * 26} q20 -8 40 0" stroke="#e1f5fe" stroke-width="4" fill="none"/>`).join('') +
    // the marble palace on the shore
    `<rect x="120" y="${GROUND - 470}" width="560" height="40" fill="#fafafa" stroke="#cfd8dc" stroke-width="6"/>` +
    `<path d="M100 ${GROUND - 470} L400 ${GROUND - 580} L700 ${GROUND - 470} Z" fill="#fafafa" stroke="#cfd8dc" stroke-width="6"/>` +
    [170, 290, 410, 530, 630].map((x) => col(x, 270)).join('') +
    `<rect x="100" y="${GROUND - 160}" width="620" height="40" fill="#eceff1" stroke="#cfd8dc" stroke-width="5"/>` +
    ground('#8bc34a', '#9ccc65') +
    bigFlower(900, 360, '#f06292', 0.9) +
    bigFlower(1500, 420, '#ffb74d', 1) +
    bigFlower(60, 300, '#ba68c8', 0.8) +
    `<g>${verge(243, false)}${verge(244, false)}</g>`
  );
}

// ---------- «Троє поросят» ----------

/**
 * Inside Naf-Naf's brick house: whitewashed walls with bricks showing, a big stone fireplace on the
 * left (its flue goes up through the ceiling: the wolf comes down it), the fire, an iron trivet the
 * pot (kazan, at x 600, y 700) stands on; a window, shelves of jars, a round rug.
 */
function kamianytsia() {
  const F = GROUND - 40;
  let planks = '';
  for (let x = -1600; x < 3200; x += 120) planks += `<path d="M${x} ${F} L${x - 300} 6000" stroke="#8a5e34" stroke-width="3"/>`;
  // patches of bare brick in the whitewash
  const bricks = (x: number, y: number, n: number) =>
    Array.from({ length: n }, (_, r) => Array.from({ length: 3 }, (_, i) => `<rect x="${x + i * 46 + (r % 2 ? 23 : 0)}" y="${y + r * 24}" width="44" height="22" rx="3" fill="#c9603f" stroke="#8e3a26" stroke-width="3"/>`).join('')).join('');
  let stones = '';
  for (let r = 0; r < 9; r++)
    for (let i = 0; i < 6; i++) {
      const x = 290 + i * 80 + (r % 2 ? 40 : 0);
      const y = 380 + r * 40;
      if (x > 740) continue;
      stones += `<rect x="${x}" y="${y}" width="76" height="36" rx="12" fill="${(i + r) % 3 ? '#a8a29a' : '#bdb7ae'}" stroke="#6d6760" stroke-width="4"/>`;
    }
  return `
  <rect x="-1600" y="-1200" width="4800" height="${F + 1200}" fill="#f6eedf"/>
  ${bricks(900, 120, 3)}${bricks(1380, 520, 2)}${bricks(-120, 300, 3)}
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#a8743f"/>${planks}
  <rect x="-1600" y="${F - 16}" width="4800" height="20" fill="#7a5232"/>
  <rect x="-1600" y="-3000" width="4800" height="2960" fill="#b98a5a"/>
  <rect x="-1600" y="-40" width="4800" height="70" fill="#7a5232"/>
  <!-- the flue up through the ceiling, the stone fireplace (drawn round x 520, put at 600, smaller) -->
  <g transform="translate(600 ${F}) scale(.76) translate(-520 ${-F})">
  <rect x="410" y="-1200" width="220" height="1600" fill="#bdb7ae" stroke="#6d6760" stroke-width="6"/>
  ${Array.from({ length: 30 }, (_, r) => `<path d="M410 ${370 - r * 52} H630 M${r % 2 ? 480 : 520} ${370 - r * 52} v-52 M${r % 2 ? 560 : 600} ${370 - r * 52} v-52" stroke="#8d877f" stroke-width="3"/>`).join('')}
  <rect x="280" y="370" width="480" height="${F - 370}" fill="#a8a29a"/>
  ${stones}
  <rect x="262" y="350" width="516" height="34" rx="8" fill="#8d6e63" stroke="#5a3a22" stroke-width="5"/>
  <path d="M370 ${F} V560 Q520 450 670 560 V${F} Z" fill="#2a1a12" stroke="#5a3a22" stroke-width="6"/>
  <ellipse data-glow="1" cx="520" cy="${F - 40}" rx="140" ry="70" fill="#ff9a3c" opacity=".5"/>
  <g transform="translate(520 ${F - 4})">
    <path data-flame="1" d="M-120 0 Q-130 -50 -100 -76 Q-92 -40 -70 -32 Q-80 -80 -40 -100 Q-40 -50 -10 -44 Q-10 -90 20 -100 Q30 -50 60 -44 Q60 -84 96 -90 Q130 -40 110 0 Z" fill="#ff7a1a"/>
    <path data-flame="1" d="M-90 0 Q-96 -30 -70 -50 Q-62 -26 -44 -22 Q-50 -56 -16 -70 Q-10 -30 14 -26 Q20 -62 50 -66 Q70 -30 80 0 Z" fill="#ffd23f"/>
    <rect x="-110" y="-10" width="220" height="14" rx="6" fill="#4e2f18"/>
  </g>
  <path d="M410 ${F} L440 690 H600 L630 ${F}" fill="none" stroke="#263238" stroke-width="10" stroke-linejoin="round"/>
  <!-- things on the mantelpiece: a clock, two candles -->
  <circle cx="520" cy="318" r="30" fill="#fff8e1" stroke="#5a3a22" stroke-width="5"/><path d="M520 318 V298 M520 318 h14" stroke="#5a3a22" stroke-width="4" stroke-linecap="round"/>
  <rect x="320" y="300" width="18" height="50" fill="#fff8e1" stroke="#5a3a22" stroke-width="3"/><path d="M329 296 q-8 -14 0 -26 q8 12 0 26z" fill="#ffb300"/>
  <rect x="702" y="300" width="18" height="50" fill="#fff8e1" stroke="#5a3a22" stroke-width="3"/><path d="M711 296 q-8 -14 0 -26 q8 12 0 26z" fill="#ffb300"/>
  </g>
  <!-- the window, its green shutters -->
  <rect x="980" y="250" width="220" height="200" fill="#9fd3f0" stroke="#5a3a22" stroke-width="12"/>
  <path d="M1090 250 v200 M980 350 h220" stroke="#5a3a22" stroke-width="8"/>
  <circle cx="1150" cy="300" r="22" fill="#ffd54f"/>
  <path d="M940 244 h40 v212 h-40 z M1200 244 h40 v212 h-40 z" fill="#2e7d32" stroke="#5a3a22" stroke-width="5"/>
  <!-- shelves with jars of jam and pickles -->
  <rect x="1300" y="300" width="260" height="14" rx="5" fill="#6d4426"/><rect x="1300" y="420" width="260" height="14" rx="5" fill="#6d4426"/>
  ${[[1330, 300, '#e53935'], [1400, 300, '#fbc02d'], [1470, 300, '#7cb342'], [1340, 420, '#8e24aa'], [1420, 420, '#ff7043'], [1500, 420, '#e53935']].map(([x, y, c]) => `<rect x="${x}" y="${Number(y) - 54}" width="44" height="54" rx="8" fill="${c}" stroke="#5a3a22" stroke-width="4"/><rect x="${Number(x) - 4}" y="${Number(y) - 64}" width="52" height="14" rx="4" fill="#fff" stroke="#5a3a22" stroke-width="3"/>`).join('')}
  <!-- a round striped rug -->
  <ellipse cx="1050" cy="${GROUND + 70}" rx="430" ry="56" fill="#ffca28" opacity=".9"/>
  <ellipse cx="1050" cy="${GROUND + 70}" rx="340" ry="40" fill="none" stroke="#e57373" stroke-width="10"/>
  <ellipse cx="1050" cy="${GROUND + 70}" rx="240" ry="26" fill="none" stroke="#4fc3f7" stroke-width="10"/>`;
}

// ---------- «Червона Шапочка» ----------

/**
 * The edge of the forest past the mill, where grandma lives: the windmill small on a far hill to the
 * left, the forest coming down on the right, a path. Her cottage (khatynka_babusi) is a prop.
 */
function uzlissia() {
  const far = `<g transform="translate(220 ${GROUND - 150}) scale(.42) translate(0 ${-(GROUND - 40)})">${windmill(0)}</g>`;
  // the forest: only from the middle to the right (and on past the edge)
  const r = rand(83);
  let woods = '';
  for (let i = 0; i < 22; i++) {
    const x = 620 + i * 105 + r() * 50;
    const y = GROUND - 30 - r() * 20;
    woods += r() < 0.55 ? fir(x, y, 0.8 + r() * 0.5) : tree(x, y, 0.8 + r() * 0.4, true);
  }
  return (
    sky('#86cdf5', '#eaf8ff') +
    sun(1420, 210) +
    clouds(81) +
    [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#aed581', GROUND - 150, 60, 82)}</g>`).join('') +
    far +
    woods +
    ground('#7cb342', '#c9a77a') +
    `<g>${verge(84, false)}</g>`
  );
}

/**
 * Inside grandma's cottage: whitewashed walls with a blue band at the bottom, a beam; the door on
 * the left (x 60..250) with its wooden latch and the string; a window with lace curtains and red
 * geraniums (x 520..760); a cuckoo clock; a little picture of the girl in her red hood; an
 * embroidered towel over where the bed stands (the bed is a prop: lizhko_babusi + kovdra at x ≈ 1100);
 * a shelf of jars of jam; a round rag rug.
 */
function babusynaKhata() {
  const F = GROUND - 40;
  let planks = '';
  for (let x = -1600; x < 3200; x += 120) planks += `<path d="M${x} ${F} L${x - 300} 6000" stroke="#8a5e34" stroke-width="3"/>`;
  return `
  <rect x="-1600" y="-1200" width="4800" height="${F + 1200}" fill="#fbf3e2"/>
  <rect x="-1600" y="${F - 60}" width="4800" height="60" fill="#7aa6d8"/>
  <rect x="-1600" y="${F}" width="4800" height="6000" fill="#b07a45"/>${planks}
  <rect x="-1600" y="-3000" width="4800" height="2960" fill="#b98a5a"/>
  ${Array.from({ length: 40 }, (_, i) => `<path d="M${-1600 + i * 120} -3000 V-40" stroke="#9c7044" stroke-width="4"/>`).join('')}
  <rect x="-1600" y="-40" width="4800" height="70" fill="#7a5232"/>
  <!-- the door, the latch, the string -->
  <rect x="50" y="${F - 420}" width="210" height="420" fill="#6d4426"/>
  <rect x="66" y="${F - 404}" width="178" height="404" fill="#8b5a2b" stroke="#5a3a22" stroke-width="5"/>
  ${[110, 155, 200].map((x) => `<path d="M${x} ${F - 400} V${F}" stroke="#6d4426" stroke-width="4"/>`).join('')}
  <path d="M66 ${F - 340} h178 M66 ${F - 80} h178" stroke="#5d4037" stroke-width="12"/>
  <rect x="200" y="${F - 230}" width="56" height="16" rx="5" fill="#c8955a" stroke="#5a3a22" stroke-width="3"/>
  <path d="M232 ${F - 214} Q236 ${F - 180} 228 ${F - 150}" stroke="#efe6cf" stroke-width="5" fill="none"/><circle cx="228" cy="${F - 148}" r="7" fill="#e53935"/>
  <!-- the window -->
  <rect x="520" y="260" width="240" height="230" fill="#9fd3f0" stroke="#5a3a22" stroke-width="10"/>
  <path d="M640 260 v230 M520 375 h240" stroke="#5a3a22" stroke-width="7"/>
  <circle cx="700" cy="310" r="24" fill="#ffd54f"/><path d="M540 470 q40 -60 80 0 M600 470 q50 -80 100 0 M670 470 q40 -50 80 0" fill="#4c9a44"/>
  <path d="M510 250 Q560 330 530 500 L500 500 V250 Z M770 250 Q720 330 750 500 L780 500 V250 Z" fill="#fff" stroke="#e0dacb" stroke-width="3"/>
  ${[518, 532, 546, 760, 746].map((x) => `<circle cx="${x}" cy="400" r="3" fill="#e0dacb"/>`).join('')}
  <rect x="500" y="490" width="280" height="18" rx="5" fill="#a0703c" stroke="#5a3a22" stroke-width="4"/>
  ${[560, 640, 720].map((x) => `<path d="M${x - 22} 490 l6 -34 h32 l6 34 z" fill="#c0542e" stroke="#7a3a1e" stroke-width="3"/><circle cx="${x - 10}" cy="440" r="14" fill="#e53935"/><circle cx="${x + 10}" cy="434" r="14" fill="#ef5350"/><circle cx="${x}" cy="422" r="13" fill="#e53935"/><path d="M${x - 18} 452 q-10 -6 -14 4 M${x + 18} 452 q10 -6 14 4" stroke="#43a047" stroke-width="7" fill="none"/>`).join('')}
  <!-- a little picture of the girl in her red hood -->
  <rect x="340" y="240" width="110" height="130" rx="8" fill="#ffe0b2" stroke="#8b5a2b" stroke-width="10"/>
  <path d="M362 350 Q356 270 395 266 Q434 270 428 350 Z" fill="#d62828"/>
  <circle cx="395" cy="310" r="24" fill="#f2c4a0"/><path d="M372 300 q23 -26 46 0 q-23 -10 -46 0z" fill="#e8b04a"/>
  <circle cx="386" cy="312" r="3" fill="#2b1a10"/><circle cx="404" cy="312" r="3" fill="#2b1a10"/><path d="M388 324 q7 6 14 0" stroke="#5a3a22" stroke-width="3" fill="none"/>
  <!-- the cuckoo clock -->
  <path d="M880 210 l60 -50 l60 50 Z" fill="#6d4426" stroke="#5a3a22" stroke-width="4"/>
  <rect x="890" y="210" width="100" height="110" fill="#a0703c" stroke="#5a3a22" stroke-width="4"/>
  <circle cx="940" cy="270" r="30" fill="#fff8e1" stroke="#5a3a22" stroke-width="4"/>
  <path d="M940 270 V250 M940 270 h16" stroke="#5a3a22" stroke-width="4" stroke-linecap="round"/>
  <rect x="926" y="214" width="28" height="22" fill="#3e2723"/><circle cx="936" cy="226" r="7" fill="#fdd835"/>
  <path d="M920 320 v80 M960 320 v120" stroke="#5a3a22" stroke-width="3"/><path d="M912 400 h16 v26 h-16z M952 440 h16 v26 h-16z" fill="#8d6e63"/>
  <!-- the embroidered towel over where the bed stands -->
  <circle cx="1170" cy="150" r="8" fill="#7a5232"/>
  <path d="M1020 170 Q1170 240 1320 170" fill="none" stroke="#e5ddc9" stroke-width="34" stroke-linecap="round"/>
  <path d="M1020 170 Q1170 240 1320 170" fill="none" stroke="#fff" stroke-width="28" stroke-linecap="round"/>
  <path d="M1012 166 L1000 300 L1042 304 L1040 176 Z M1328 166 L1340 300 L1298 304 L1300 176 Z" fill="#fff" stroke="#e5ddc9" stroke-width="3"/>
  ${stitchBand(1000, 270, 42)}${stitchBand(1298, 270, 42)}
  <!-- a shelf of jam jars -->
  <rect x="1430" y="380" width="200" height="14" rx="5" fill="#6d4426"/>
  ${[[1450, '#e53935'], [1500, '#8e24aa'], [1550, '#fbc02d'], [1600, '#e53935']].map(([x, c]) => `<rect x="${x}" y="330" width="36" height="50" rx="7" fill="${c}" stroke="#5a3a22" stroke-width="3"/><rect x="${Number(x) - 3}" y="322" width="42" height="12" rx="3" fill="#fff" stroke="#5a3a22" stroke-width="2"/>`).join('')}
  <!-- a round rag rug -->
  <ellipse cx="560" cy="${GROUND + 70}" rx="380" ry="50" fill="#ef9a9a" opacity=".9"/>
  <ellipse cx="560" cy="${GROUND + 70}" rx="290" ry="36" fill="none" stroke="#81d4fa" stroke-width="10"/>
  <ellipse cx="560" cy="${GROUND + 70}" rx="190" ry="22" fill="none" stroke="#fff59d" stroke-width="10"/>`;
}

const BACKDROPS: Record<string, () => Backdrop> = {
  uzlissia: () => ({ still: uzlissia(), layers: [] }),
  'khata-babusi': () => ({ still: babusynaKhata(), layers: [] }),
  kamianytsia: () => ({ still: kamianytsia(), layers: [] }),
  'stil-zblyzka': () => ({ still: stilZblyzka(false), layers: [] }),
  'stil-nich': () => ({ still: stilZblyzka(true), layers: [] }),
  'zymove-pole': () => ({ still: zymovePole(), layers: [], snow: true }),
  norka: () => ({ still: norkaInside(), layers: [] }),
  khid: () => ({ still: khid(), layers: [] }),
  'teplyi-krai': () => ({ still: teplyiKrai(), layers: [] }),
  svitlytsia: () => ({ still: vedmezha('svitlytsia'), layers: [] }),
  spalnia: () => ({ still: vedmezha('spalnia'), layers: [] }),
  mlyn: () => ({
    // the miller's windmill on a hill, wheat fields round it
    still:
      sky('#7cc4f2', '#e0f4ff') +
      sun(300, 220) +
      clouds(211) +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#c5e1a5', GROUND - 170, 50, 212)}</g>`).join('') +
      windmill(1250) +
      ground('#9ccc65', '#c9a77a') +
      `<g>${verge(213, false)}</g>`,
    layers: [],
  }),
  palats: () => ({ still: palats(), layers: [] }),
  richka: () => ({ still: richka(), layers: [] }),
  zamok: () => ({ still: zamok(), layers: [] }),
  zal: () => ({ still: zal(), layers: [] }),
  berloga: () => ({ still: berloga(), layers: [] }),
  kurnyk: () => ({ still: kurnyk(false), layers: [] }),
  'kurnyk-night': () => ({ still: kurnyk(true), layers: [] }),
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
  horod: () => ({
    // the garden by the house: the hata, sunflowers, rows of dug soil (the turnip grows here)
    still:
      sky('#7cc4f2', '#d6f0ff') +
      sun(1380, 230) +
      clouds(13) +
      [-1, 0, 1].map((i) => `<g transform="translate(${i * W} 0)">${hills('#9ccc65', GROUND - 120, 60, 7)}</g>`).join('') +
      ground('#7cb342', '#c9a77a') +
      wattleFence(920, 1580) +
      sunflower(1500, 300) +
      hata() +
      [0, 1, 2].map((r) => `<path d="M${640 - r * 40} ${GROUND + 34 + r * 46} Q1150 ${GROUND + 14 + r * 46} ${1680 + r * 40} ${GROUND + 34 + r * 46}" stroke="#6d4426" stroke-width="22" fill="none" stroke-linecap="round"/>` +
        Array.from({ length: 9 }, (_, i) => `<path d="M${720 + i * 110 - r * 20} ${GROUND + 26 + r * 46} q-10 -26 -24 -30 M${720 + i * 110 - r * 20} ${GROUND + 26 + r * 46} q10 -28 24 -30" stroke="#4caf50" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')).join(''),
    layers: [],
  }),
  road: () => ({
    still: sky('#7cc4f2', '#d6f0ff') + sun(1380, 230) + clouds(5),
    layers: [
      [hills('#a5d6a7', GROUND - 150, 70, 2), 0.12],
      [hills('#81c784', GROUND - 90, 50, 4), 0.25],
      [treeRow(8, false), 0.5],
      [ground('#7cb342', '#c9a77a'), 1], [verge(9, false), 1],
    ],
  }),
  forest: () => ({
    still: sky('#8fc8e8', '#e3f4e8') + sun(1400, 225) + clouds(6),
    layers: [
      [hills('#6fa77a', GROUND - 160, 80, 12), 0.12],
      [treeRow(21, true), 0.3],
      [treeRow(22, true), 0.55],
      [ground('#5d9b3c', '#b8946a'), 1], [verge(23, true, 0.22), 1],
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
      [ground('#7cb342', '#c9a77a'), 1], [verge(44, false), 1],
    ],
  }),
  deep: () => ({
    still: sky('#4f7d6a', '#a9cbb0') + clouds(12).replace('opacity=".92"', 'opacity=".35"'),
    layers: [
      [treeRow(51, true), 0.15],
      [LOW_END ? '' : rays(), 0.2],
      [treeRow(52, true), 0.35],
      [treeRow(53, true), 0.6],
      [ground('#3f7a32', '#9c7a55'), 1], [verge(54, true, 0.3), 1],
    ],
  }),
  glade: () => ({
    still: sky('#86cdf5', '#eaf8ff') + sun(1400, 230) + clouds(14),
    layers: [
      [hills('#9ccc65', GROUND - 140, 50, 61), 0.12],
      [birchRow(62), 0.4],
      [ground('#8bc34a', '#d2b080'), 1], [verge(63, false, 0.2) + verge(64, false), 1],
    ],
  }),
  mountains: () => ({
    still: sky('#8ecdf2', '#e8f6ff') + sun(1380, 230) + clouds(15),
    layers: [
      [mountains(71, '#8aa7c7', GROUND - 120, 420, true), 0.05],
      [mountains(72, '#6f9a7c', GROUND - 80, 260, false), 0.15],
      [firCluster(73), 0.35],
      [ground('#7cb342', '#c9a77a'), 1], [verge(74, false), 1],
    ],
  }),
  sea: () => ({
    still: sky('#ffb26b', '#ffe3b3') + sun(1240, 340, '#ffcc4d') + clouds(8) + sea(),
    layers: [[ground('#8bbf5a', '#d9b98a'), 1], [verge(31, false), 1]],
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
  /** life in the background: birds, a fish jumping, an owl peeping (AMBIENT) */
  private ambientLayer: SVGGElement;
  private ambient: { kind: Ambient; next: number }[] = [];
  private actors = new Map<string, Actor>();
  private particles: Particle[] = [];
  private rolling = false;
  private rollFast = false;
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
  /** a puppet came on stage (the heroes' page meets it and dresses it) */
  onShow: ((actor: string, g: SVGGElement) => void) | null = null;

  constructor(host: HTMLElement) {
    this.svg = el('svg', { viewBox: `0 ${VIEW_TOP} ${W} ${VIEW_H}`, preserveAspectRatio: 'xMidYMin meet', class: 'stage' });
    this.backdrop = el('g');
    this.ambientLayer = el('g', { 'pointer-events': 'none' });
    this.actorsLayer = el('g');
    this.frontLayer = el('g');
    this.fxLayer = el('g', { 'pointer-events': 'none' });
    this.snowLayer = el('g', { 'pointer-events': 'none' });
    this.svg.append(this.backdrop, this.ambientLayer, this.actorsLayer, this.frontLayer, this.fxLayer, this.snowLayer);
    host.appendChild(this.svg);
    this.frame();
    window.addEventListener('resize', () => this.frame());
    // a tap on a puppet: it giggles, jumps, sneezes or spins (a thing just wobbles)
    this.svg.addEventListener('click', (e) => {
      const g = (e.target as Element).closest('[data-actor]');
      const a = g && this.actors.get(g.getAttribute('data-actor')!);
      if (a) this.poke(a);
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
    this.stopPullArms();
    // the life of this place: each kind starts after a little while
    this.ambient = (AMBIENT[name] || []).map((kind, i) => ({ kind, next: this.time + 1 + i * 1.3 + Math.random() * 2 }));
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
      sitK: 0,
      asleep: false,
      zIn: 0,
      jab: 0,
      jabDx: 0,
      knock: 0,
      knockDx: 0,
      ox: 0,
      munch: 0,
      tug: 0,
      act: '',
      actT: 0,
      actDur: 0,
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
        wings: part('wings'),
      },
    };
    (FRONT.indexOf(id) >= 0 ? this.frontLayer : this.actorsLayer).appendChild(g);
    // the snow house, the oak, the tablecloth: behind everyone
    if (BACK.indexOf(id) >= 0) this.actorsLayer.insertBefore(g, this.actorsLayer.firstChild);
    this.actors.set(id, a);
    this.onShow?.(id, g);
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
    a.asleep = false;
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
    // in front of the one carrying it, or on its back (behind it)
    if (ANCHORS[by].behind && c.g.parentNode === a.g.parentNode) a.g.parentNode!.insertBefore(a.g, c.g);
    else a.g.parentNode!.appendChild(a.g);
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
    return this.moveTo(id, [dx + (a.x > dx ? 40 : -40), dy], Math.max(500, Math.abs(a.x - dx) * 1.4), { hop: id === 'zhabka' || id === 'zayets' || id === 'myshka' || id === 'krolyk' })
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

  /** the road rolls (or stops); fast: a race — everything flies past */
  setRolling(on: boolean, fast = false) {
    this.rolling = on;
    this.rollFast = fast;
  }

  setEyes(id: string, open: boolean) {
    const a = this.actors.get(id);
    if (!a) return;
    a.eyesOpen = open;
    // opening the eyes = waking up (and standing up, if dozing sitting)
    if (open && a.asleep) {
      a.asleep = false;
      if (a.pose === 'sit') a.pose = '';
      a.bounce = 1;
    }
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
    // a puppet shown smaller or bigger (size): its mouth and head are nearer or further
    if (which === 'top') return [a.x, a.y + an.top * a.size];
    return [a.x + an.mouth[0] * a.size * (a.flip ? -1 : 1), a.y + an.mouth[1] * a.size];
  }

  // ---------- effects ----------

  fx(name: string, on?: string, at?: Point, who: string[] = [], word?: string): Promise<void> {
    const a = on ? this.actors.get(on) : undefined;
    switch (name) {
      case 'munch': {
        // the goat tips her head down to the grass, three times
        const h = a && a.parts.head;
        if (!a) return this.wait(300);
        if (!h) {
          // no head of its own to tip: the whole body bends to the food, the mouth chews, crumbs
          a.munch = 2.4;
          return this.wait(2400);
        }
        const t0 = this.time;
        const cx = h.getAttribute('data-cx');
        const cy = h.getAttribute('data-cy');
        const step = () => {
          const p = Math.min(1, (this.time - t0) / 3.6);
          const ang = -Math.abs(Math.sin(p * Math.PI * 3)) * 38;
          h.setAttribute('transform', p < 1 ? `rotate(${ang.toFixed(1)} ${cx} ${cy})` : '');
          if (Math.random() < 0.15) this.crumbOf(a.x - 96 * (a.flip ? -1 : 1), a.y - 20, '#7cb342');
          if (p < 1) this.later(0, step);
        };
        step();
        return this.wait(3600);
      }
      case 'tears': {
        // big blue tears from the eyes
        if (!a) return this.wait(300);
        const [x, y] = this.anchor(a, 'mouth');
        for (let i = 0; i < 8; i++) this.later(i * 0.22, () => this.tear(x + (i % 2 ? 14 : -10), y - 30));
        return this.wait(1900);
      }
      case 'bang': {
        // a blow: its sound (the word picks it: sfx.ts), dust, the picture shakes
        const [x] = at || (a ? [a.x, a.y + ANCHORS[a.id].top * a.size * 0.5] : [800, 500]);
        sfx(word, 'boom');
        for (let i = 0; i < 8; i++) this.dustAt(x + (Math.random() - 0.5) * 200, GROUND);
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
        const id = a.id;
        const gold = id === 'zolote';
        for (let i = 0; i < 14; i++) this.wool(x, y, gold ? (i % 2 ? '#ffc928' : '#f0a000') : i % 2 ? '#b07e55' : '#6d4426');
        this.hide(id);
        // the sledge leaves its broken pieces; torn hides are replaced by the next stack; the golden
        // egg leaves its shell
        if (id === 'sanky') this.show('lamani', [x, GROUND]);
        else if (id === 'stilets_malyi') this.show('stilets_lamanyi', [x, a.y]);
        else if (gold) this.show('shkarlupa', [x, a.y]);
        else if (id === 'kozhi') this.later(0.6, () => this.show(id, [x, a.y]));
        return this.wait(700);
      }
      case 'throwfish': {
        // fish flung off the sledge, one after another, into the snow behind
        if (!a) return this.wait(300);
        for (let i = 0; i < 7; i++) this.later(i * 0.3, () => this.flyingFish(a.x - 60 + i * 20, a.y - 110));
        return this.wait(2400);
      }
      case 'wag': {
        // a wave of the back end (the mouse's tail): a quick wiggle, a swish of air behind
        if (!a) return this.wait(300);
        a.act = 'wiggle';
        a.actT = 0;
        a.actDur = ACTS.wiggle.dur;
        for (let i = 0; i < 4; i++) this.later(i * 0.1, () => this.dustAt(a.x + (a.flip ? -1 : 1) * (70 + i * 14), a.y - 30));
        return this.wait(900);
      }
      case 'tuck': {
        // already sitting inside (a scene on): who is in the box, without climbing in on stage
        if (!a) return this.wait(0);
        for (const id of who) {
          this.hide(id);
          this.inside[id] = a.id;
        }
        if (a.parts.peek) a.parts.peek.style.display = '';
        return this.wait(0);
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
      case 'hit': {
        // a blow: the one hitting (on) lunges at the others (who) and swings; they are thrown back
        // with its sound and some dust, and come back to their place
        if (!a) return this.wait(300);
        const targets = who.map((id) => this.actors.get(id)).filter((t): t is Actor => !!t);
        const t0 = targets[0];
        const dir = t0 ? (t0.x >= a.x ? 1 : -1) : a.flip ? 1 : -1;
        if (!a.prop) a.flip = dir > 0;
        a.jab = HIT;
        // right up to the target (bodies touching), not through it
        a.jabDx = t0 ? dir * Math.min(420, Math.max(60, Math.abs(t0.x - a.x) - 280 * Math.max(a.size, t0.size))) : dir * 120;
        for (let i = 0; i < 6; i++) this.later(i * 0.03, () => this.speedLine(a));
        this.later(HIT * 0.4, () => {
          sfx(word, 'thud');
          for (const t of targets) {
            const d = t.x >= a.x ? 1 : -1;
            // a house knocked on only shakes; the kolobok being bitten stays where the mouth is
            if (BACK.indexOf(t.id) >= 0) t.wobble = 1;
            else if (t.id !== 'kolobok') {
              t.knock = KNOCK;
              t.knockDx = d * (t.prop ? 30 : 110);
            }
            t.asleep = false;
            for (let i = 0; i < 5; i++) this.dustAt(t.x + (Math.random() - 0.5) * 160, GROUND);
          }
          this.shake = 0.4;
        });
        return this.wait(HIT * 1000 + 250);
      }
      case 'pull': {
        // they pull (who, one holding the next), at it (on): heave-ho together, twice — it only
        // leans towards them. Each one reaches out with both arms: the first to it, the others
        // to the back of the one in front (pullArms).
        const pullers = who.map((id) => this.actors.get(id)).filter((t): t is Actor => !!t);
        for (const p of pullers) {
          p.tug = PULL;
          // everyone faces it (the cat that was chasing the mouse turns round)
          if (a) p.flip = a.x > p.x;
        }
        if (a) {
          a.wobble = 1;
          a.tug = PULL;
          a.tugTo = pullers.length && pullers[0].x < a.x ? -1 : 1;
        }
        this.later(PULL / 2, () => {
          if (a) a.wobble = 1;
        });
        this.startPullArms(pullers, a || null);
        return this.wait(PULL * 1000 + 100);
      }
      case 'fallback': {
        // (the turnip gave way) they all fall over backwards in a heap: stars, dust, a bump
        const all = [a, ...who.map((id) => this.actors.get(id))].filter((t): t is Actor => !!t);
        // a chain of them flies apart, each lying where it doesn't cover the next (a little
        // higher or lower, at odds), the one in front first
        if (all.length > 2) {
          const back = all[1].x < all[0].x ? -1 : 1;
          const len = (t: Actor) => Math.abs(ANCHORS[t.id] ? ANCHORS[t.id].top : 200) * t.size;
          let x = all[0].x + back * 40;
          all.forEach((t, i) => {
            if (i) x += back * (len(all[i - 1]) * 0.42 + len(t) * 0.42);
            const to: Point = [x + (Math.random() - 0.5) * 30, t.y + (i % 2 ? 26 : -18)];
            void this.moveTo(t.id, to, 380 + i * 60, { hop: true });
          });
        }
        this.later(all.length > 2 ? 0.45 : 0, () => {
          for (const t of all) {
            t.pose = 'back';
            t.bounce = 1;
            const [x, y] = this.anchor(t, 'top');
            for (let i = 0; i < 5; i++) this.star(x, y + 40, (i / 5) * Math.PI * 2);
            this.dustAt(t.x, GROUND);
          }
          this.shake = 0.4;
        });
        return this.wait(all.length > 2 ? 1300 : 900);
      }
      case 'shiver':
        // shivers with cold (or fright)
        if (a) {
          a.act = 'shiver';
          a.actT = 0;
          a.actDur = 1.4;
        }
        return this.wait(1200);
      case 'sit':
        // sits down (on the ground, a bench): until it moves or stands up
        if (a) a.pose = 'sit';
        return this.wait(400);
      case 'stand':
        if (a) {
          a.pose = '';
          a.bounce = 1;
        }
        return this.wait(400);
      case 'sleep':
        // falls asleep: sits down (unless lying already), eyes shut, nods, z-z-z
        if (!a) return this.wait(300);
        if (!a.pose) a.pose = 'sit';
        this.setEyes(a.id, false);
        a.asleep = true;
        a.zIn = 0;
        return this.wait(900);
      case 'doze':
        // falls asleep where it is, without sitting down (sitting up in bed, under the quilt)
        if (!a) return this.wait(300);
        this.setEyes(a.id, false);
        a.asleep = true;
        a.zIn = 0;
        return this.wait(900);
      case 'wake':
        // wakes with a start: eyes open, jumps up, "!"
        if (!a) return this.wait(300);
        this.setEyes(a.id, true);
        a.asleep = false;
        a.pose = '';
        a.bounce = 1;
        {
          const [x, y] = this.anchor(a, 'top');
          this.exclaim(x, y);
        }
        return this.wait(600);
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
      case 'blow': {
        // the wolf (on) draws a big breath and blows at a house (who[0]): a gust streams from his
        // mouth; a house of straw, twigs or pillows (BLOWN) shakes and flies apart into bits, and
        // whoever was inside tumbles out; any other (the brick one) only shakes
        if (!a) return this.wait(300);
        const t = who[0] ? this.actors.get(who[0]) : undefined;
        const dir = t ? (t.x >= a.x ? 1 : -1) : a.flip ? 1 : -1;
        if (!a.prop) a.flip = dir > 0;
        a.act = 'sneeze';
        a.actT = 0;
        a.actDur = 1.4;
        this.mouth(a, true);
        this.later(1.4, () => this.mouth(a, false));
        const [mx, my] = this.anchor(a, 'mouth');
        const reach = t ? Math.max(200, Math.abs(t.x - mx)) : 500;
        for (let i = 0; i < 26; i++) this.later(0.35 + i * 0.04, () => this.gust(mx, my, dir, reach));
        if (!t) return this.wait(1500);
        for (const k of [0.6, 0.9, 1.2]) this.later(k, () => (t.wobble = 1));
        const bits = BLOWN[t.id];
        if (!bits) {
          for (let i = 0; i < 8; i++) this.later(0.6 + i * 0.08, () => this.dustAt(t.x + (Math.random() - 0.5) * 400, GROUND));
          return this.wait(1700);
        }
        const inside = Object.keys(this.inside).filter((id) => this.inside[id] === t.id);
        this.later(1.3, () => {
          const h = -ANCHORS[t.id].top * t.size;
          for (let i = 0; i < 46; i++) this.blownBit(t.x + (Math.random() - 0.5) * 380 * t.size, t.y - Math.random() * h, dir, bits.colors[i % bits.colors.length], bits.shape);
          for (let i = 0; i < 8; i++) this.dustAt(t.x + (Math.random() - 0.5) * 400, GROUND);
          this.shake = 0.3;
          t.g.style.display = 'none';
          if (inside.length) this.popOut(t, inside, true);
          this.later(inside.length * 0.15 + 0.2, () => this.hide(t.id));
        });
        return this.wait(1300 + inside.length * 150 + 1000);
      }
      case 'scald': {
        // fallen into the boiling pot: steam bursts up round him, he jumps and shivers all over
        if (!a) return this.wait(300);
        for (let i = 0; i < 16; i++) this.later(i * 0.05, () => this.puff(a.x + (Math.random() - 0.5) * 240, a.y - 140 - Math.random() * 100));
        a.act = 'shiver';
        a.actT = 0;
        a.actDur = 1.4;
        a.bounce = 1;
        this.shake = 0.4;
        return this.wait(1300);
      }
      case 'smell': {
        // a smell drifts from `on` (a fresh pie, the kolobok) to the nose of the first of `who`
        if (!a) return this.wait(100);
        const nose = who.map((id) => this.actors.get(id)).find((t): t is Actor => !!t);
        for (let i = 0; i < 10; i++)
          this.later(i * 0.3, () => {
            const [sx, sy] = this.anchor(a, 'top');
            const [tx, ty] = nose ? this.anchor(nose, 'mouth') : [sx + 300, sy - 200];
            const w = el('path', { d: 'M0 0 q10 -12 0 -24 q-10 -12 0 -24 q10 -12 0 -24', fill: 'none', stroke: i % 2 ? '#f0b85a' : '#e08f3a', 'stroke-width': 9, 'stroke-linecap': 'round' });
            const off = (Math.random() - 0.5) * 40;
            this.particle(w, 1.8, (p, k) => {
              const x = sx + (tx - sx) * k + Math.sin(k * 8 + i) * 14;
              const y = sy + (ty - sy) * k + off * Math.sin(k * Math.PI) - Math.sin(k * Math.PI) * 60;
              w.setAttribute('transform', `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(Math.sin(p.t * 4 + i) * 20).toFixed(0)}) scale(${(1.1 + k * 0.6).toFixed(2)})`);
              w.setAttribute('opacity', (k < 0.2 ? k / 0.2 : (1 - k) / 0.8).toFixed(2));
            });
          });
        return this.wait(400);
      }
      case 'whirl': {
        // runs flat out, cartoon-style: the legs a spinning blur
        if (!a || a.whirl) return this.wait(100);
        const foot = (ang: number) =>
          `<ellipse cx="0" cy="${-30}" rx="12" ry="22" fill="#d9c7b0" stroke="${INK}" stroke-width="3" opacity=".75" transform="rotate(${ang})"/>`;
        const g = svg(
          `<g data-part="whirl"><circle r="50" fill="#fff" opacity=".55"/><g>${[0, 90, 180, 270].map(foot).join('')}` +
            `<path d="M-46 -8 A46 46 0 0 1 8 -46 M46 8 A46 46 0 0 1 -8 46" fill="none" stroke="#9e9e9e" stroke-width="5" stroke-linecap="round" opacity=".7"/></g></g>`,
        ).firstChild as SVGGElement;
        a.body.appendChild(g);
        a.whirl = g;
        // its own legs are the blur now
        for (const l of Array.from(a.g.querySelectorAll<SVGGElement>('[data-part="legs"]'))) l.style.display = 'none';
        return this.wait(100);
      }
      case 'whirl-stop':
        if (a && a.whirl) {
          a.whirl.remove();
          a.whirl = null;
          for (const l of Array.from(a.g.querySelectorAll<SVGGElement>('[data-part="legs"]'))) l.style.display = '';
        }
        return this.wait(100);
      case 'knead': {
        // works at something with its hands (kneads the dough, sweeps the flour bin): bends to it
        // rhythmically, flour puffing up where it works (at)
        if (a) {
          a.act = 'knead';
          a.actT = 0;
          a.actDur = ACTS.knead.dur;
        }
        const [x, y] = at || (a ? this.anchor(a, 'mouth') : [900, 600]);
        for (let i = 0; i < 9; i++) this.later(0.15 + i * 0.27, () => this.dust(x + (Math.random() - 0.5) * 90, y));
        return this.wait(2600);
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
          const p = Math.min(1, (this.time - t0) / 3.6);
          this.fire = 1 + Math.sin(p * Math.PI) * 0.6;
          if (k && k.parts.raw) k.parts.raw.setAttribute('opacity', (1 - p).toFixed(3));
          if (p < 1) this.later(0, step);
        };
        step();
        return this.wait(3600);
      }
      case 'smoke':
        for (let i = 0; i < 9; i++) this.later(i * 0.35, () => this.puff(708, 196));
        return this.wait(2400);
      case 'bow':
        // a bow (the cat sweeping his hat to the king)
        if (a) {
          a.act = 'bow';
          a.actT = 0;
          a.actDur = ACTS.bow.dur;
        }
        return this.wait(1000);
      case 'poof': {
        // magic: a puff of purple smoke and stars, and in its place stands who (the ogre — a lion)
        if (!a) return this.wait(300);
        const [x, y, flip] = [a.x, a.y, a.flip];
        const h = -ANCHORS[a.id].top * a.size;
        for (let i = 0; i < 16; i++) this.later(i * 0.03, () => this.smokeBall(x + (Math.random() - 0.5) * 300, y - Math.random() * h * 0.9));
        for (let i = 0; i < 12; i++) this.star(x, y - h * 0.5, (i / 12) * Math.PI * 2);
        this.later(0.3, () => {
          this.hide(a.id);
          if (who[0]) this.show(who[0], [x, y], flip);
        });
        return this.wait(1100);
      }
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
        // gobbled up (the kolobok, or who[0]): gone into the mouth whole, and inside (popout: out again)
        return this.chomp(a, who[0]);
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

  private particle(node: SVGElement, life: number, update: Particle['update'], layer = this.fxLayer) {
    layer.appendChild(node);
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

  /** a curl of wind from the mouth (x, y), streaming `reach` along dir and spreading out */
  private gust(x: number, y: number, dir: number, reach: number) {
    const spread = (Math.random() - 0.5) * 2;
    const len = 60 + Math.random() * 70;
    const l = el('path', { d: `M0 0 q${dir * len * 0.5} -18 ${dir * len} 0 t${dir * len * 0.6} 0`, stroke: Math.random() < 0.3 ? '#e1f5fe' : '#ffffff', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' });
    this.particle(l, 0.7, (p, k) => {
      l.setAttribute('transform', `translate(${x + dir * reach * k} ${y + spread * 140 * k})`);
      l.setAttribute('opacity', String(0.95 * (1 - k * k)));
    });
  }

  /** a bit of a blown-apart house (a straw, a twig, a feather): swept away along dir, tumbling */
  private blownBit(x: number, y: number, dir: number, color: string, shape: 'straw' | 'twig' | 'feather') {
    const b =
      shape === 'feather'
        ? svg(`<g><path d="M0 12 Q-9 -4 0 -20 Q9 -4 0 12 Z" fill="${color}" stroke="#5a3a22" stroke-width="2"/></g>`)
        : el('rect', { x: shape === 'twig' ? -30 : -22, y: -3, width: shape === 'twig' ? 60 : 44, height: shape === 'twig' ? 8 : 5, rx: 3, fill: color, stroke: '#5a3a22', 'stroke-width': shape === 'twig' ? 2 : 1 });
    const vx = dir * (500 + Math.random() * 700);
    const vy = shape === 'feather' ? -150 - Math.random() * 250 : -250 - Math.random() * 350;
    const fall = shape === 'feather' ? 220 : 600;
    const spin = (Math.random() - 0.5) * 1400;
    this.particle(b, shape === 'feather' ? 2.6 : 1.8, (p, k) => {
      const sway = shape === 'feather' ? Math.sin(k * 14) * 30 : 0;
      b.setAttribute('transform', `translate(${(x + vx * k + sway).toFixed(1)} ${(y + vy * k + fall * k * k).toFixed(1)}) rotate(${(spin * k).toFixed(0)})`);
      b.setAttribute('opacity', String(k < 0.75 ? 1 : (1 - k) * 4));
    });
  }

  /** a ball of magic smoke: swells and fades where it is */
  private smokeBall(x: number, y: number) {
    const c = el('circle', { r: 30, fill: Math.random() < 0.5 ? '#d1c4e9' : '#f3e5f5' });
    this.particle(c, 1.3, (p, k) => {
      c.setAttribute('cx', String(x));
      c.setAttribute('cy', String(y - k * 40));
      c.setAttribute('r', String(30 + Math.sin(Math.min(1, k * 2) * Math.PI * 0.5) * 70));
      c.setAttribute('opacity', String(0.95 * (1 - k * k)));
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

  /** the last reaction to a tap, so the next one is a different one */
  private lastPoke = -1;

  /** which reaction of its list each hero shows next */
  private pokeNext: Record<string, number> = {};

  private poke(a: Actor) {
    if (a.prop) {
      a.wobble = 1;
      return;
    }
    // walking, carried, in a blow or another reaction: not now
    if (a.move || a.carriedBy || a.jab > 0 || a.knock > 0 || a.tug > 0 || a.spin > 0 || a.act) return;
    const list = REACTIONS[a.id] || REACTIONS._;
    // lying or sitting: only what can be done so
    const can = a.pose ? list.filter((k) => QUIET.indexOf(k) >= 0) : list;
    const pick = can.length ? can : ['wiggle'];
    const i = (this.pokeNext[a.id] || 0) % pick.length;
    this.pokeNext[a.id] = i + 1;
    const kind = pick[i];
    if (kind === 'spin' || kind === 'flip') {
      // a turn round (with a jump: a somersault)
      a.spin = 360;
      a.spinSpeed = kind === 'flip' ? 600 : 480;
      if (kind === 'flip') a.bounce = 1;
      return;
    }
    a.act = kind;
    a.actT = 0;
    a.actDur = ACTS[kind].dur;
    // eyes shut for a blissful scratch, a stretch, a curl
    if (ACTS[kind].eyesShut && a.eyesOpen) {
      this.setEyes(a.id, false);
      this.later(a.actDur * 0.9, () => {
        if (this.actors.get(a.id) === a && !a.asleep) this.setEyes(a.id, true);
      });
    }
    // a sneeze blows a little cloud
    if (kind === 'sneeze') {
      const [mx, my] = this.anchor(a, 'mouth');
      this.later(0.45, () => {
        for (let k = 0; k < 6; k++) this.dustAt(mx + (a.flip ? 1 : -1) * (20 + k * 16), my + (Math.random() - 0.5) * 30);
      });
    }
    // chasing its own tail: turns round and round
    if (kind === 'chase') for (let k = 1; k <= 4; k++) this.later((a.actDur / 5) * k, () => (a.flip = !a.flip));
  }

  /** a "z" floating up from a sleeper's head */
  private zed(x: number, y: number, flip: boolean) {
    const t = el('text', { 'font-size': 58, fill: '#3f51b5', 'font-weight': 800, 'font-family': 'Georgia, serif' }, ['z']);
    const dx = (50 + Math.random() * 30) * (flip ? -1 : 1);
    this.particle(t, 2.4, (p, k) => {
      t.setAttribute('transform', `translate(${x + dx * k + Math.sin(k * 7) * 12} ${y - 20 - k * 170}) scale(${0.5 + k * 0.9})`);
      t.setAttribute('opacity', String(k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85));
    });
  }

  /** "!" above someone startled */
  private exclaim(x: number, y: number) {
    const t = el('text', { 'font-size': 110, fill: '#e53935', 'font-weight': 900, 'text-anchor': 'middle', stroke: '#fff', 'stroke-width': 6, 'paint-order': 'stroke' }, ['!']);
    this.particle(t, 1, (p, k) => {
      t.setAttribute('transform', `translate(${x} ${y - 30 - Math.min(1, k * 4) * 40}) scale(${Math.min(1, k * 5)})`);
      t.setAttribute('opacity', String(k < 0.7 ? 1 : (1 - k) / 0.3));
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
  private chomp(fox?: Actor, victim = 'kolobok'): Promise<void> {
    const k = this.actors.get(victim);
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
        this.hide(victim);
        if (victim !== 'kolobok') {
          this.sizeWhenIn[victim] = k.size;
          this.inside[victim] = fox.id;
        }
        this.mouth(fox, false);
        if (victim === 'kolobok') for (let i = 0; i < 10; i++) this.crumb(mx, my);
        else {
          // someone swallowed whole: a snap of the jaws, the picture jolts
          sfx('ГАМ!', 'snap');
          this.shake = 0.3;
        }
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

  /**
   * Sitting, seen from the front: the body above the hips keeps its shape and comes down, the
   * thighs (hips to knees) shorten as if coming towards us, the shins and feet stay on the ground.
   * Made of the body itself: it is clipped above the hips, and two live copies of it (<use>) show
   * the thighs and the shins.
   */
  private sitPose(a: Actor) {
    let r = a.sitRig;
    if (!r) {
      if (!a.sitK) return;
      const id = `sit${++sitIds}`;
      const an = ANCHORS[a.id];
      const hip = an && an.hip !== undefined ? an.hip : Math.round((an ? an.top : -300) * 0.3);
      const knee = Math.round(hip / 2);
      a.body.id = a.body.id || `${id}b`;
      const defs = el('defs');
      const clip = (cid: string, y0: number, y1: number) => {
        const c = el('clipPath', { id: cid });
        c.appendChild(el('rect', { x: -4000, y: y0, width: 8000, height: y1 - y0 }));
        defs.appendChild(c);
      };
      clip(`${id}u`, -6000, hip + 2);
      clip(`${id}t`, hip - 2, knee + 2);
      clip(`${id}s`, knee - 2, 600);
      const copy = (cid: string) => {
        const g = el('g', { 'clip-path': `url(#${cid})` }) as SVGGElement;
        const u = el('use', { href: `#${a.body.id}` });
        u.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${a.body.id}`);
        g.appendChild(u);
        return g;
      };
      // a stool to sit on, behind the legs: as wide as the body
      let half = Math.abs(hip) * 0.55;
      try {
        const bb = a.body.getBBox();
        if (bb.width) half = Math.min(bb.width * 0.36, Math.abs(hip) * 0.9);
      } catch {
        // not measured: the guess
      }
      const stool = svg(
        `<g><path d="M${-half + 12} 0 L${-half + 18} 14 M${half - 12} 0 L${half - 18} 14" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
          `<path d="M${-half + 12} 0 L${-half + 18} 14 M${half - 12} 0 L${half - 18} 14" stroke="#8d5a2b" stroke-width="5" stroke-linecap="round"/>` +
          `<rect x="${-half}" y="-16" width="${half * 2}" height="18" rx="7" fill="#b07a45" stroke="${INK}" stroke-width="5"/></g>`,
      ).firstChild as SVGGElement;
      const parent = a.body.parentNode!;
      const up = el('g') as SVGGElement;
      const thigh = copy(`${id}t`);
      const shin = copy(`${id}s`);
      parent.insertBefore(defs, a.body);
      parent.insertBefore(stool, a.body);
      parent.insertBefore(shin, a.body);
      parent.insertBefore(thigh, a.body);
      parent.insertBefore(up, a.body);
      up.appendChild(a.body);
      r = a.sitRig = { up, thigh, shin, stool, hip, knee, clipUp: `url(#${id}u)` };
    }
    const k = a.sitK;
    if (!k) {
      r.up.removeAttribute('clip-path');
      r.up.removeAttribute('transform');
      r.thigh.style.display = r.shin.style.display = r.stool.style.display = 'none';
      return;
    }
    r.up.setAttribute('clip-path', r.clipUp);
    r.thigh.style.display = r.shin.style.display = '';
    // a seat of its own (a chair, a stump, a bed, a log) right there: no stool
    const seated = [...this.actors.values()].some((o) => o.prop && SEATS.test(o.id) && Math.abs(o.x - a.x) < 150);
    r.stool.style.display = seated ? 'none' : '';
    // the thighs come down to a third of their height, the body above them with them
    const fold = 0.68 * k;
    r.up.setAttribute('transform', `translate(0 ${((r.knee - r.hip) * fold).toFixed(1)})`);
    r.thigh.setAttribute('transform', `translate(0 ${r.knee}) scale(1 ${(1 - fold).toFixed(3)}) translate(0 ${-r.knee})`);
    // the seat at the hips, its legs down to the ground (drawn for a seat at y 0, 14 high: stretched)
    const seat = r.hip + (r.knee - r.hip) * fold;
    r.stool.setAttribute('opacity', k.toFixed(2));
    r.stool.setAttribute('transform', `translate(0 ${seat.toFixed(1)}) scale(1 1)`);
    const legs = r.stool.querySelectorAll('path');
    const h = -seat;
    for (let i = 0; i < legs.length; i++) {
      const d = legs[i].getAttribute('d')!.replace(/L(-?[\d.]+) (-?[\d.]+)/g, (_m, x) => `L${x} ${h.toFixed(0)}`);
      legs[i].setAttribute('d', d);
    }
  }

  // ---------- pulling: arms reaching out ----------

  private pullArms: { pullers: Actor[]; target: Actor | null; g: SVGGElement; arms: { from: Actor; sh: Point; out: SVGElement; fill: SVGElement; hand: SVGElement }[] } | null = null;

  private startPullArms(pullers: Actor[], target: Actor | null) {
    this.stopPullArms();
    const g = el('g') as SVGGElement;
    this.fxLayer.appendChild(g);
    const arms: NonNullable<typeof this.pullArms>['arms'] = [];
    pullers.forEach((p, i) => {
      const rig = PULL_ARMS[p.id];
      const held = i === 0 ? target : pullers[i - 1];
      if (!rig || !held) return;
      // the arm on the side of what it holds (in the drawing: flipped puppets have it mirrored)
      const side = (held.x >= p.x ? 1 : -1) * (p.flip ? -1 : 1);
      for (const l of Array.from(p.g.querySelectorAll<SVGGElement>(`[data-arm="${side}"]`))) l.style.display = 'none';
      for (const sh of rig.sh.filter((q) => Math.sign(q[0]) === side)) {
        const out = el('path', { fill: 'none', stroke: INK, 'stroke-width': rig.w + 10, 'stroke-linecap': 'round' });
        const fill = el('path', { fill: 'none', stroke: rig.sleeve, 'stroke-width': rig.w, 'stroke-linecap': 'round' });
        const hand = el('circle', { r: rig.w * 0.55, fill: rig.hand, stroke: INK, 'stroke-width': 4 });
        g.append(out, fill, hand);
        arms.push({ from: p, sh, out, fill, hand });
      }
    });
    this.pullArms = { pullers, target, g, arms };
  }

  private stopPullArms() {
    const pa = this.pullArms;
    if (!pa) return;
    pa.g.remove();
    for (const p of pa.pullers) for (const l of Array.from(p.g.querySelectorAll<SVGGElement>('[data-arm]'))) l.style.display = '';
    this.pullArms = null;
  }

  /** every frame while they pull: each arm from the shoulder to what it holds */
  private tickPullArms() {
    const pa = this.pullArms;
    if (!pa) return;
    if (!pa.pullers.some((p) => p.tug > 0)) return this.stopPullArms();
    const k = (a: Actor) => a.scale * a.size;
    for (const arm of pa.arms) {
      const p = arm.from;
      const i = pa.pullers.indexOf(p);
      const held = i === 0 ? pa.target : pa.pullers[i - 1];
      if (!held) continue;
      const dir = held.x >= p.x ? 1 : -1;
      const f = p.flip ? -1 : 1;
      const sx = p.x + p.ox + arm.sh[0] * f * k(p);
      const sy = p.y + arm.sh[1] * k(p);
      // the turnip by its top, under the leaves; a person by the back, at the waist
      const top = ANCHORS[held.id] ? ANCHORS[held.id].top : -200;
      const gx = held.x + held.ox - dir * (i === 0 ? 40 : 34) * k(held);
      const gy = held.y + top * (i === 0 ? 0.62 : 0.42) * k(held) + (arm.sh[0] * f < 0 ? -10 : 10);
      const mx = (sx + gx) / 2;
      const my = Math.max(sy, gy) + 18;
      const d = `M${sx.toFixed(0)} ${sy.toFixed(0)} Q${mx.toFixed(0)} ${my.toFixed(0)} ${gx.toFixed(0)} ${gy.toFixed(0)}`;
      arm.out.setAttribute('d', d);
      arm.fill.setAttribute('d', d);
      arm.hand.setAttribute('cx', gx.toFixed(0));
      arm.hand.setAttribute('cy', gy.toFixed(0));
    }
  }

  // ---------- life in the background ----------

  private spawnAmbient(kind: Ambient) {
    const L = this.ambientLayer;
    const R = Math.random;
    switch (kind) {
      case 'birds':
      case 'gulls': {
        // a few birds crossing the sky far away, wings flapping
        const gull = kind === 'gulls';
        const n = 1 + Math.floor(R() * 3);
        const ltr = R() < 0.5;
        const y0 = gull ? 400 + R() * 110 : 130 + R() * 200;
        for (let i = 0; i < n; i++) {
          const b = el('path', { fill: 'none', stroke: gull ? '#fafafa' : '#4a3a30', 'stroke-width': gull ? 5 : 4, 'stroke-linecap': 'round' });
          const sc = (gull ? 1 : 0.6) + R() * 0.4;
          const dy = i * 26 - n * 10;
          const lag = i * 0.03;
          const ph = R() * 6;
          this.particle(
            b,
            gull ? 10 : 14,
            (p, k) => {
              const kk = Math.min(1, Math.max(0, k - lag));
              const x = ltr ? -100 + kk * 1800 : 1700 - kk * 1800;
              const y = y0 + dy + Math.sin(kk * 9 + ph) * 12;
              const up = Math.sin(p.t * 9 + ph) > 0;
              b.setAttribute('d', up ? 'M-16 0 Q-8 -12 0 0 Q8 -12 16 0' : 'M-16 -4 Q-8 4 0 0 Q8 4 16 -4');
              b.setAttribute('transform', `translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${sc.toFixed(2)})`);
            },
            L,
          );
        }
        return;
      }
      case 'fish': {
        // a little fish leaps out of the river and back with a splash
        const x0 = 150 + R() * 1300;
        const y0 = GROUND - 82;
        const dir = R() < 0.5 ? 1 : -1;
        const f = svg(`<g><path d="M-16 0 Q0 -12 16 0 Q0 12 -16 0 Z" fill="#ff9800" stroke="${INK}" stroke-width="3"/><path d="M-16 0 L-28 -9 L-28 9 Z" fill="#ff9800" stroke="${INK}" stroke-width="3"/><circle cx="8" cy="-2" r="2.5" fill="${INK}"/></g>`).firstChild as SVGGElement;
        this.splash(x0, y0);
        this.later(1.1, () => this.splash(x0 + dir * 120, y0));
        this.particle(
          f,
          1.1,
          (_p, k) => {
            const x = x0 + dir * 120 * k;
            const y = y0 - Math.sin(k * Math.PI) * 110;
            const ang = Math.atan2(-Math.cos(k * Math.PI) * 110 * Math.PI, dir * 120) * (180 / Math.PI);
            f.setAttribute('transform', `translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${dir * 1.5} 1.5) rotate(${(ang * dir).toFixed(0)})`);
          },
          L,
        );
        return;
      }
      case 'dolphin': {
        // a dolphin arcs out of the sea
        const x0 = 150 + R() * 1150;
        const y0 = GROUND - 150;
        const d = svg(
          `<g><path d="M-60 6 Q-20 -30 40 -14 Q60 -8 74 2 Q56 4 44 2 Q0 26 -60 6 Z" fill="#6b8fb5" stroke="${INK}" stroke-width="4"/>` +
            `<path d="M-6 -18 L6 -40 L18 -16 Z" fill="#6b8fb5" stroke="${INK}" stroke-width="4"/><path d="M-60 6 L-80 -10 M-60 6 L-80 20" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
            `<path d="M-60 6 L-80 -10 M-60 6 L-80 20" stroke="#6b8fb5" stroke-width="4" stroke-linecap="round"/><path d="M-30 6 Q10 14 44 2" fill="none" stroke="#dbe7f2" stroke-width="5"/><circle cx="46" cy="-6" r="3" fill="${INK}"/></g>`,
        ).firstChild as SVGGElement;
        this.splash(x0, y0, 1.6);
        this.later(1.6, () => this.splash(x0 + 300, y0, 1.6));
        this.particle(
          d,
          1.6,
          (_p, k) => {
            const x = x0 + 300 * k;
            const y = y0 - Math.sin(k * Math.PI) * 170;
            const ang = -Math.cos(k * Math.PI) * 50;
            d.setAttribute('transform', `translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${ang.toFixed(0)})`);
          },
          L,
        );
        return;
      }
      case 'owl': {
        // an owl peeps out among the trees, blinks, and hides again
        const x = 150 + R() * 1300;
        const y = GROUND - 250 - R() * 120;
        const o = svg(
          `<g><ellipse cx="0" cy="0" rx="30" ry="36" fill="#8d6e63" stroke="${INK}" stroke-width="4"/><path d="M-26 -26 L-20 -48 L-8 -32 M26 -26 L20 -48 L8 -32" fill="#8d6e63" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
            `<circle cx="-12" cy="-8" r="11" fill="#fff8e1" stroke="${INK}" stroke-width="3"/><circle cx="12" cy="-8" r="11" fill="#fff8e1" stroke="${INK}" stroke-width="3"/>` +
            `<g data-owl-eyes="1"><circle cx="-12" cy="-8" r="5" fill="${INK}"/><circle cx="12" cy="-8" r="5" fill="${INK}"/></g><path d="M-5 4 L0 12 L5 4 Z" fill="#ffb300" stroke="${INK}" stroke-width="2"/>` +
            `<path d="M-14 18 q6 6 12 0 M2 18 q6 6 12 0" fill="none" stroke="#6d4c41" stroke-width="3"/></g>`,
        ).firstChild as SVGGElement;
        const eyes = o.querySelector('[data-owl-eyes]') as SVGGElement;
        this.particle(
          o,
          4,
          (p, k) => {
            const show = k < 0.15 ? k / 0.15 : k > 0.85 ? (1 - k) / 0.15 : 1;
            o.setAttribute('transform', `translate(${x.toFixed(0)} ${(y + (1 - show) * 40).toFixed(0)})`);
            o.setAttribute('opacity', show.toFixed(2));
            // a blink and a look round
            eyes.setAttribute('transform', Math.abs(p.t - 1.6) < 0.1 || Math.abs(p.t - 2.6) < 0.1 ? 'translate(0 -8) scale(1 0.15) translate(0 8)' : `translate(${(Math.sin(p.t * 1.5) * 3).toFixed(1)} 0)`);
          },
          L,
        );
        return;
      }
      case 'caterpillar': {
        // a caterpillar crawls slowly through the grass in front
        const ltr = R() < 0.5;
        const y = GROUND + 90 + R() * 30;
        const c = el('g');
        const segs: SVGElement[] = [];
        for (let i = 0; i < 6; i++) {
          const seg = el('circle', { r: i === 0 ? 11 : 9, fill: i === 0 ? '#9ccc65' : i % 2 ? '#7cb342' : '#8bc34a', stroke: INK, 'stroke-width': 3 });
          segs.push(seg);
        }
        for (const seg of segs.slice().reverse()) c.appendChild(seg);
        // it is on the ground: the road rolling carries it back with the grass
        const scroll0 = this.scroll;
        const face = svg(`<g><circle cx="4" cy="-3" r="2" fill="${INK}"/><path d="M2 -10 l4 -10 M-4 -10 l-2 -10" stroke="${INK}" stroke-width="2"/></g>`).firstChild as SVGGElement;
        c.appendChild(face);
        this.particle(
          c,
          34,
          (p, k) => {
            const head = (ltr ? -80 + k * 1760 : 1680 - k * 1760) - (this.scroll - scroll0);
            const dir = ltr ? 1 : -1;
            segs.forEach((seg, i) => {
              seg.setAttribute('cx', (head - dir * i * 15).toFixed(1));
              seg.setAttribute('cy', (y - Math.max(0, Math.sin(p.t * 5 - i * 0.9)) * 7).toFixed(1));
            });
            face.setAttribute('transform', `translate(${head.toFixed(1)} ${y}) scale(${dir} 1)`);
          },
          L,
        );
        return;
      }
      case 'chimney': {
        // smoke from the chimney: a soft puff now and then
        const c = el('circle', { r: 14, fill: '#e9e4dc' });
        const drift = 10 + R() * 30;
        this.particle(
          c,
          3.2,
          (_p, k) => {
            c.setAttribute('cx', (708 + drift * k + Math.sin(k * 5) * 8).toFixed(1));
            c.setAttribute('cy', (196 - k * 200).toFixed(1));
            c.setAttribute('r', (12 + k * 34).toFixed(1));
            c.setAttribute('opacity', (0.75 * (1 - k)).toFixed(2));
          },
          L,
        );
        return;
      }
    }
  }

  /** rings on the water where something went in or came out */
  private splash(x: number, y: number, big = 1) {
    for (let i = 0; i < 2; i++) {
      const r = el('ellipse', { cx: x, cy: y, fill: 'none', stroke: '#e3f3ff', 'stroke-width': 4 });
      this.particle(
        r,
        0.9,
        (_p, k) => {
          const kk = Math.max(0, k - i * 0.25);
          r.setAttribute('rx', (8 + kk * 40 * big).toFixed(1));
          r.setAttribute('ry', (3 + kk * 10 * big).toFixed(1));
          r.setAttribute('opacity', (1 - kk).toFixed(2));
        },
        this.ambientLayer,
      );
    }
  }

  // ---------- the frame ----------

  private mouth(a: Actor, open: boolean) {
    if (a.parts.mouthOpen) a.parts.mouthOpen.style.display = open ? '' : 'none';
    if (a.parts.mouthClosed && !(a.id === 'kolobok' && !a.eyesOpen)) a.parts.mouthClosed.style.display = open ? 'none' : '';
  }

  private place(a: Actor) {
    // turned round, it is mirrored whole: the writing on it (a T-shirt, a sign) is turned back
    if (a.textFlip !== a.flip) a.textFlip = keepTextReadable(a.g, a.flip) ? a.flip : undefined;
    const k = a.scale * a.size;
    setAttr(a.g, 'transform', `translate(${(a.x + a.ox).toFixed(1)} ${a.y.toFixed(1)}) scale(${(a.flip ? -k : k).toFixed(3)} ${k.toFixed(3)})`);
  }

  private tick(dt: number) {
    this.time += dt;
    // background life (not while rushing through scenes)
    if (this.rush === 1)
      for (const am of this.ambient)
        if (this.time >= am.next) {
          const [lo, hi] = AMBIENT_EVERY[am.kind];
          am.next = this.time + (lo + Math.random() * (hi - lo)) * (LOW_END ? 1.8 : 1);
          this.spawnAmbient(am.kind);
        }
    const due = this.timers.filter((t) => t.at <= this.time);
    if (due.length) {
      this.timers = this.timers.filter((t) => t.at > this.time);
      for (const t of due) t.fn();
    }

    // the road eases in and out of rolling
    this.rollAmount += ((this.rolling ? (this.rollFast ? 2.4 : 1) : 0) - this.rollAmount) * Math.min(1, dt * 3);
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
    this.tickPullArms();
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
    if (a.whirl) {
      const hipY = Math.round((ANCHORS[a.id] ? ANCHORS[a.id].top : -200) * 0.11);
      a.whirl.setAttribute('transform', `translate(0 ${hipY})`);
      // the way it runs: a puppet faces left in its own drawing, so forward is anticlockwise there
      (a.whirl.lastChild as SVGGElement).setAttribute('transform', `rotate(${(-(a.phase * 1400) % 360).toFixed(0)})`);
    }
    if (a.carriedBy) {
      const c = a.carriedBy;
      if (!this.actors.has(c.id)) a.carriedBy = null;
      else {
        const h = ANCHORS[c.id].hands!;
        // bobbing along with the carrier's steps
        const step = c.move && !c.move.hop ? Math.abs(Math.sin(c.phase * 9)) * 9 : 0;
        // held on the side the carrier faces
        a.x = c.x + c.ox + h[0] * (c.flip ? -1 : 1);
        a.y = c.y + h[1] - step;
      }
    }
    let lift = 0;
    let lean = 0;
    // eating: bending to the food in bites, mouth going, crumbs
    let chew = 0;
    if (a.munch > 0) {
      a.munch = Math.max(0, a.munch - dt);
      chew = -Math.abs(Math.sin(a.munch * Math.PI * 2.5)) * 12;
      if (Math.random() < 0.2) this.mouth(a, Math.random() < 0.5);
      if (a.munch === 0) this.mouth(a, false);
      if (Math.random() < 0.12) {
        const [mx, my] = this.anchor(a, 'mouth');
        this.crumbOf(mx, my, ['#c8873a', '#e6b450', '#7cb342'][Math.floor(Math.random() * 3)]);
      }
    }
    // a blow given or taken
    a.ox = 0;
    let blow = 0;
    let blowLift = 0;
    if (a.jab > 0) {
      a.jab = Math.max(0, a.jab - dt);
      const p = 1 - a.jab / HIT;
      // fast out, a little slower back
      const out = p < 0.4 ? Math.sin((p / 0.4) * Math.PI * 0.5) : Math.cos(((p - 0.4) / 0.6) * Math.PI * 0.5);
      a.ox += a.jabDx * out;
      blow -= 16 * out;
    }
    // a club, a stick in the hands of one hitting swings at the target
    const holder = a.carriedBy;
    if (holder && holder.jab > 0) {
      const p = 1 - holder.jab / HIT;
      const out = p < 0.4 ? Math.sin((p / 0.4) * Math.PI * 0.5) : Math.cos(((p - 0.4) / 0.6) * Math.PI * 0.5);
      blow += (holder.flip ? 1 : -1) * (a.flip ? -1 : 1) * 75 * out;
    }
    if (a.tug > 0) {
      a.tug = Math.max(0, a.tug - dt);
      const h = Math.abs(Math.sin((1 - a.tug / PULL) * Math.PI * 2));
      if (a.tugTo) {
        // pulled at: gives a little towards them and leans their way
        a.ox += a.tugTo * 22 * h;
        blow += a.tugTo * 7 * h;
        if (!a.tug) a.tugTo = 0;
      } else {
        // heaving back (away from where it faces), twice
        a.ox += (a.flip ? -1 : 1) * 26 * h;
        blow += 14 * h;
      }
    }
    if (a.knock > 0) {
      a.knock = Math.max(0, a.knock - dt);
      const p = 1 - a.knock / KNOCK;
      const out = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
      a.ox += a.knockDx * out;
      blow += 18 * out;
      blowLift = Math.sin(Math.min(1, p / 0.45) * Math.PI) * 40;
    }
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
    const sit = a.pose === 'sit';
    if (sit) {
      // sitting: lower and a bit wider; asleep, the head nods slowly
      if (a.asleep) lean += 5 + Math.sin(a.phase * 1.4) * 4;
    } else if (a.pose && !flat) {
      // on its side, head towards where it faces, turning about a point near the feet
      spinAt = a.pose === 'roll' ? -90 + Math.sin(a.phase * 4) * 22 : a.pose === 'back' ? 84 : -88;
      pivotY = -40;
    }
    const pivot = a.pose && !sit ? pivotY : (ANCHORS[a.id] ? ANCHORS[a.id].top : -100) / 2;
    let breathe = a.id === 'khatka' || a.id === 'rvana' ? 1 : 1 + Math.sin(a.phase * 2.2) * 0.012;
    // a thing talking (the mitten, for those inside) or just moved into: squash and stretch
    if (a.prop && a.talking) breathe += Math.sin(a.phase * 14) * 0.025;
    if (a.wobble > 0) {
      a.wobble = Math.max(0, a.wobble - dt * 1.8);
      breathe += Math.sin((1 - a.wobble) * Math.PI * 4) * 0.08 * a.wobble;
    }
    // old iPads: standing still means still (no breathing) — fewer repaints
    if (LOW_END && !a.talking && !a.wobble) breathe = 1;
    // a reaction to a tap
    let actSX = 1;
    let actSY = 1;
    if (a.act) {
      a.actT += dt;
      const p = Math.min(1, a.actT / a.actDur);
      const r = ACTS[a.act].at(p, Math.sin(p * Math.PI));
      blowLift += r.lift || 0;
      blow += r.rot || 0;
      a.ox += (r.ox || 0) * (a.flip ? 1 : -1);
      actSX = r.sx || 1;
      actSY = r.sy || 1;
      if (p >= 1) a.act = '';
    }
    // sitting: people fold at the hips (sitPose); four-legged ones and things just get lower
    const folds = !a.prop && a.id !== 'kolobok' && FOUR_LEGS.indexOf(a.id) < 0;
    const squat = sit && !folds;
    setAttr(
      a.body,
      'transform',
      `translate(0 ${(-lift - blowLift).toFixed(1)}) rotate(${(lean + blow + chew + spinAt).toFixed(2)} 0 ${spinAt ? pivot : 0}) scale(${((2 - breathe) * actSX * (flat ? 1.08 : squat ? 1.06 : 1)).toFixed(4)} ${(breathe * actSY * (flat ? 0.62 : squat ? 0.8 : 1)).toFixed(4)})`,
    );
    const sitTo = sit && folds ? 1 : 0;
    if (a.sitK !== sitTo) {
      a.sitK = sitTo > a.sitK ? Math.min(1, a.sitK + dt * 4) : Math.max(0, a.sitK - dt * 4);
      this.sitPose(a);
    }

    // asleep: z-z-z from the head
    if (a.asleep) {
      a.zIn -= dt;
      if (a.zIn <= 0) {
        a.zIn = 0.9;
        const [x, y] = this.anchor(a, 'top');
        this.zed(x + (a.flip ? -30 : 30), y + (a.pose === 'lie' || a.pose === 'roll' ? -ANCHORS[a.id].top * 0.55 : a.pose === 'sit' ? -ANCHORS[a.id].top * 0.2 : 0), a.flip);
      }
    }

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

    // wings flutter: fast in the air (off the ground or flying somewhere), slowly at rest
    if (a.parts.wings) {
      const w = a.parts.wings;
      const flying = a.y < GROUND - 30 || (a.move && a.move.to[1] < GROUND - 30);
      const s = flying ? 0.35 + Math.abs(Math.sin(a.phase * 16)) * 0.65 : 0.9 + Math.sin(a.phase * 2.5) * 0.1;
      const cy = Number(w.getAttribute('data-cy'));
      w.setAttribute('transform', `translate(0 ${cy}) scale(1 ${s.toFixed(3)}) translate(0 ${-cy})`);
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
