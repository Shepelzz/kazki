// How a thing is put on a puppet. Every thing is drawn once for a head of a standard size (u = 100:
// about the width of the two eyes) and is placed by the puppet's own face: its eyes (from the
// drawing) and mouth (ANCHORS). So one hat fits the grandfather, the kolobok and the fox; a puppet
// the guess misses gets a nudge in BODY, or a place set by hand on fit.html (OVERRIDES).
//
// The things go inside the part that holds the eyes (the body, or a head that turns), so they
// move, lean and turn with the puppet, in the tales too.
//
// Only this is in the app's main script: the things themselves (src/wardrobe.ts, src/items/) are
// drawn when the app is built, each into a little file of its own, fetched when worn (closet.ts).

import { ANCHORS, svg } from './characters';
import fitOverrides from './fit-overrides.json';

export type Slot = 'head' | 'face' | 'mouth' | 'neck' | 'torso' | 'legs' | 'feet';

/**
 * Clothes for the whole body: drawn for one hero, in that puppet's own numbers (its feet at 0,0),
 * put in where the puppet marks them (data-dress="torso" / "legs": under the beard and the
 * arms, over its own shirt and trousers).
 */
export const BODY_SLOTS: Slot[] = ['torso', 'legs', 'feet'];

/** a thing as it is put on: where it goes and its drawing */
export interface Wearable {
  id: string;
  slot: Slot;
  /** a beard or a moustache: the hero's own (data-part="beard") comes off for it */
  beard?: boolean;
  /** drawn for u = 100; the origin is the slot's point (see placeOn) */
  draw: () => string;
}

export const SLOTS: { slot: Slot; name: string }[] = [
  { slot: 'head', name: 'На голову' },
  { slot: 'face', name: 'На очі' },
  { slot: 'mouth', name: 'Вуса й борода' },
  { slot: 'neck', name: 'Тіло' },
  { slot: 'torso', name: 'Одяг' },
  { slot: 'legs', name: 'Штани' },
  { slot: 'feet', name: 'Взуття' },
];

// ---------- how each hero's body takes things ----------
//
// Where a slot is, is found on the drawing (the head shape round the eyes, the eyes, the mouth);
// the body map then moves it for this hero (dx, dy in u — about the head's width), scales it (k)
// and says what the hero is like: seen from the side (one eye: no glasses), or with the hats drawn
// behind its eyes (the crab's eyes on stalks). A puppet's own hat (data-part="hat") comes off for
// a thing on the head, its own collar (data-part="collar") for a thing round the neck.
// A new hero needs an entry only where the guess misses; a new thing fits everyone at once.
// Checked by eye on fit.html (npm run dev).

export interface Place {
  dx?: number;
  dy?: number;
  k?: number;
}

export interface Body {
  /** one eye seen: nothing that needs two (found from the drawing when not given) */
  view?: 'front' | 'side';
  /** where each slot goes, from the guess */
  slots?: Partial<Record<Slot, Place>>;
  /** one thing placed otherwise still (on top of its slot's place) */
  items?: Partial<Record<string, Place>>;
  /** the head, in the drawing's numbers, when it isn't a circle the guess can find (drawn as a path) */
  head?: { x: number; y: number; rx: number; ry: number };
  /** hats go behind the eyes */
  hatBehindEyes?: boolean;
  /** things this hero never wears, whatever its set says */
  never?: string[];
}

// dogs: a big head, so smaller hats; the collar behind the jaw
const DOG: Body = { slots: { head: { dx: 0.1, dy: 0.1, k: 0.8 }, neck: { dx: 0.35, dy: 0.1 } }, items: { medal: { dy: 0.2 } } };
// cats: hats lower and smaller; what's round the neck smaller, a little lower
const CAT: Body = { slots: { head: { dy: 0.15, k: 0.75 }, neck: { dy: 0.4, k: 0.75 } } };

export const BODY: Record<string, Body> = {
  // a beard down the chest: what goes round the neck hangs below it
  did: { slots: { neck: { dy: 0.95 } } },
  knyaz: { slots: { neck: { dy: 0.6 } }, items: { medal: { dy: 0.45 } } },
  koval: { slots: { neck: { dy: 0.6 } } },
  // the kolobok is all head (no separate head shape): the hat right on top
  kolobok: { slots: { head: { dy: 0.5 } } },
  lysytsia: { slots: { neck: { dx: 0.25, dy: -0.15 } } },
  zhuchka: DOG,
  sobaka: DOG,
  sirko: DOG,
  kishka: CAT,
  kit: CAT,
  myshka: { head: { x: -14, y: -92, rx: 34, ry: 26 }, slots: { neck: { dx: 0.6 } } },
  zhabka: { slots: { head: { dy: 0.55 }, neck: { dy: -0.35 } }, items: { koruna: { dy: 0.25, k: 0.85 } } },
  kaban: { slots: { head: { dy: 0.25 }, mouth: { dy: 0.2 }, neck: { dy: 0.3 } } },
  koza: { view: 'side', slots: { neck: { dx: 0.75, dy: 0.1 } } },
  yizhachok: { view: 'side', slots: { head: { dy: 0.2 }, neck: { dx: 0.2, dy: -0.25 } } },
  rak: { hatBehindEyes: true, slots: { head: { dy: 0.85 }, neck: { dy: -0.4 } }, never: ['piratska'] },
  zmiyuchka: { items: { medal: { dy: 0.25 } } },
  gusenia: { view: 'side', slots: { face: { dx: -0.15 } } },
  pivnyk: { view: 'side', slots: { face: { dx: -0.15 } } },
  zhuravel: { view: 'side', slots: { face: { dx: -0.15 }, neck: { dx: 0.3 } } },
  hryfon: { view: 'side', slots: { neck: { dx: 0.35 } }, never: ['monokl', 'piratska'] },
  solombychok: { slots: { neck: { dx: 0.3 } }, items: { bant: { dx: 0.3 } } },
  zmiy: { view: 'side' },
};

/**
 * Places set by hand on fit.html (dragged into place there, saved by the dev server): hero → thing
 * → its place, instead of the one worked out from the body map.
 */
export const OVERRIDES = fitOverrides as Record<string, Record<string, Required<Place>>>;

/** where a thing goes on a hero: set by hand, or worked out from the body map */
export function placeOf(hero: string, it: Pick<Wearable, 'id' | 'slot'>): Required<Place> {
  const o = OVERRIDES[hero] && OVERRIDES[hero][it.id];
  return o ? { ...o } : place(BODY[hero], it.slot, it.id);
}

const place = (b: Body | undefined, slot: Slot, item: string): Required<Place> => {
  const s = (b && b.slots && b.slots[slot]) || {};
  const i = (b && b.items && b.items[item]) || {};
  return { dx: (s.dx || 0) + (i.dx || 0), dy: (s.dy || 0) + (i.dy || 0), k: (s.k || 1) * (i.k || 1) };
};

/** The eyes of a puppet: their middle and width, read from the drawing (circles and ellipses). */
function eyesOf(g: Element): { x: number; y: number; w: number; parent: Element; two: boolean } | null {
  const eyes = g.querySelector('[data-part="eyes"]') || g.querySelector('[data-part="eyes-closed"]');
  if (!eyes) return null;
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  const num = (e: Element, a: string) => Number(e.getAttribute(a) || 0);
  for (const c of Array.from(eyes.querySelectorAll('circle, ellipse'))) {
    const rx = c.tagName === 'circle' ? num(c, 'r') : num(c, 'rx');
    const ry = c.tagName === 'circle' ? num(c, 'r') : num(c, 'ry');
    x0 = Math.min(x0, num(c, 'cx') - rx);
    x1 = Math.max(x1, num(c, 'cx') + rx);
    y0 = Math.min(y0, num(c, 'cy') - ry);
    y1 = Math.max(y1, num(c, 'cy') + ry);
  }
  if (x0 === Infinity) {
    // closed eyes only (arcs): their middle is written on the group
    const cx = Number(eyes.getAttribute('data-cx'));
    const cy = Number(eyes.getAttribute('data-cy'));
    if (isNaN(cx) || isNaN(cy)) return null;
    return { x: cx, y: cy, w: 40, parent: eyes.parentNode as Element, two: true };
  }
  // one eye or two: the eye shapes' middles, apart by more than a highlight's shift
  const xs = Array.from(eyes.querySelectorAll('circle, ellipse')).map((c) => num(c, 'cx'));
  const two = Math.max(...xs) - Math.min(...xs) > (x1 - x0) * 0.35;
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, parent: eyes.parentNode as Element, two };
}

/**
 * Dress a puppet (a fresh one from makePuppet; `hero` is the actor it plays): the things are put on
 * its face. Anything worn before is taken off first. No eyes, nothing to dress.
 */
/** where the things of each slot go on this puppet (the eyes' unit, the points), or null: no face */
/**
 * The head of a puppet: the smallest circle or ellipse of the drawing round the eyes (most heads
 * are drawn so). Null for a head drawn as a path (the wolf, the fox): FIT places their things.
 */
function headOf(parent: Element, e: { x: number; y: number; w: number }) {
  let best: { x: number; y: number; rx: number; ry: number } | null = null;
  for (const c of Array.from(parent.children)) {
    if (c.tagName !== 'circle' && c.tagName !== 'ellipse') continue;
    const num = (a: string) => Number(c.getAttribute(a) || 0);
    const x = num('cx');
    const y = num('cy');
    const rx = c.tagName === 'circle' ? num('r') : num('rx');
    const ry = c.tagName === 'circle' ? num('r') : num('ry');
    // round the eyes, and bigger than them
    if (rx * 2 < e.w * 1.2 || ((e.x - x) / rx) ** 2 + ((e.y - y) / ry) ** 2 > 1) continue;
    if (!best || rx * ry < best.rx * best.ry) best = { x, y, rx, ry };
  }
  return best;
}

export function slotPoints(g: Element, hero: string) {
  const e = eyesOf(g);
  if (!e) return null;
  const given = BODY[hero] && BODY[hero].head;
  const head = given || headOf(e.parent, e);
  // the unit: from the head's width when the head is known (a hat as wide as the head), else the eyes
  const u = head ? Math.max(28, Math.min(130, head.rx * 1.55)) : Math.max(30, Math.min(80, e.w));
  const an = ANCHORS[hero];
  const mouth: [number, number] = an ? an.mouth : [e.x, e.y + u];
  // the mouth below the eyes (a sideways head: the mouth is off to the side)
  const mx = mouth[0];
  const my = Math.max(mouth[1], e.y + u * 0.3);
  const at: Record<Slot, [number, number]> = head
    ? {
        // the hat a little into the crown; what's round the neck just under the head
        head: [head.x, head.y - head.ry * 0.82],
        face: [e.x, e.y],
        mouth: [mx, my],
        neck: [head.x + (mx - head.x) * 0.3, head.y + head.ry * 1.05],
        torso: [0, 0],
        legs: [0, 0],
        feet: [0, 0],
      }
    : {
        head: [e.x, e.y - u * 0.95],
        face: [e.x, e.y],
        mouth: [mx, my],
        neck: [e.x + (mx - e.x) * 0.5, my + u * 0.75],
        torso: [0, 0],
        legs: [0, 0],
        feet: [0, 0],
      };
  // glasses and moustaches go by the eyes: as wide as the face, not the whole head
  const uFace = Math.max(26, Math.min(u, e.w * 1.15));
  return { u, uFace, at, parent: e.parent, head, two: e.two };
}

export function dress(g: Element, hero: string, items: Wearable[]) {
  for (const old of Array.from(g.querySelectorAll('[data-part="outfit"]'))) old.parentNode!.removeChild(old);
  // the puppet's own hat and collar come off for a thing worn there
  const on = (slot: Slot) => items.some((i) => i.slot === slot);
  for (const h of Array.from(g.querySelectorAll('[data-part="hat"]'))) (h as SVGElement).style.display = on('head') ? 'none' : '';
  for (const c of Array.from(g.querySelectorAll('[data-part="collar"]'))) (c as SVGElement).style.display = on('neck') ? 'none' : '';
  // and its own beard and moustache for another one
  for (const c of Array.from(g.querySelectorAll('[data-part="beard"]'))) (c as SVGElement).style.display = items.some((i) => i.beard) ? 'none' : '';
  for (const c of Array.from(g.querySelectorAll('[data-part="outfit-body"]'))) c.parentNode!.removeChild(c);
  if (!items.length) return;
  // clothes for the body: in the puppet's numbers, at its markers (or under the head)
  for (const slot of BODY_SLOTS) {
    const it = items.find((i) => i.slot === slot);
    if (!it) continue;
    const p = placeOf(hero, it);
    const mark = g.querySelector(`[data-dress="${slot === 'feet' ? 'legs' : slot}"]`);
    const data = `data-item="${it.id}" data-ax="0" data-ay="0" data-u="100" data-unit="1" data-dx="${p.dx}" data-dy="${p.dy}" data-k="${p.k}"`;
    const node = svg(`<g data-part="outfit-body"><g ${data} transform="translate(${(p.dx * 100).toFixed(1)} ${(p.dy * 100).toFixed(1)}) scale(${p.k.toFixed(3)})">${it.draw()}</g></g>`).firstChild as Element;
    if (mark) mark.parentNode!.insertBefore(node, slot === 'feet' ? mark.nextSibling : mark);
    else {
      const body = g.querySelector('[data-part="body"]') || g;
      body.appendChild(node);
    }
  }
  items = items.filter((i) => BODY_SLOTS.indexOf(i.slot) < 0);
  if (!items.length) return;
  const pts = slotPoints(g, hero);
  if (!pts) return;
  const { u, uFace, at } = pts;
  const body = BODY[hero];
  const one = (it: Wearable) => {
    const p = placeOf(hero, it);
    const unit = (it.slot === 'face' || it.slot === 'mouth' ? uFace : it.slot === 'neck' ? u * 0.85 : u) / 100;
    const [x, y] = at[it.slot];
    // what fit.html needs to move it by hand and save its place
    const data = `data-item="${it.id}" data-ax="${x}" data-ay="${y}" data-u="${u}" data-unit="${unit}" data-dx="${p.dx}" data-dy="${p.dy}" data-k="${p.k}"`;
    return `<g ${data} transform="translate(${(x + p.dx * u).toFixed(1)} ${(y + p.dy * u).toFixed(1)}) scale(${(unit * p.k).toFixed(3)})">${it.draw()}</g>`;
  };
  // the order keeps a beard under the moustache and glasses over everything
  const order: Slot[] = ['neck', 'mouth', 'head', 'face'];
  const behind = !!(body && body.hatBehindEyes);
  const front = items.filter((i) => !(behind && i.slot === 'head'));
  const back = items.filter((i) => behind && i.slot === 'head');
  const group = (list: Wearable[]) =>
    svg(`<g data-part="outfit">${order.map((slot) => list.filter((i) => i.slot === slot).map(one).join('')).join('')}</g>`).firstChild as Element;
  if (front.length) pts.parent.appendChild(group(front));
  if (back.length) {
    // before the eyes (and the stalks drawn just before them)
    const eyes = pts.parent.querySelector('[data-part="eyes"]');
    let ref: Element | null = eyes;
    if (eyes && eyes.previousElementSibling && eyes.previousElementSibling.tagName === 'path') ref = eyes.previousElementSibling;
    pts.parent.insertBefore(group(back), ref);
  }
}
