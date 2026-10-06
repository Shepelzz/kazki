// «Мої герої»: everyone the child has met in the tales, on shelves. A hero not met yet is a shadow
// with a question mark. A hero met says hello (in its own voice) when tapped, and can be dressed:
// hats, glasses, a moustache, a scarf, bought with the coins for endings. The clothes are worn in the
// tales too, unless the hero's checkbox takes them off.

import { el, makePuppet } from './characters';
import { progress } from './progress';
import { say, stopSpeech, unlockAudio } from './speech';
import { COMMON, type Story } from './story';
import type { Voice } from './voiceKey';
import { dress, itemById, itemsFor, SLOTS, type Item, type Slot } from './wardrobe';

export interface Hero {
  id: string;
  name: string;
  voice: Voice;
  /** the narrator's voice of its home tale (for the page's own words) */
  narrator: Voice;
}

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

/** the heroes: every character with a hello, in the order of the tales on the shelf */
export function heroesOf(stories: Story[]): Hero[] {
  const out: Hero[] = [];
  for (const s of stories)
    for (const [id, v] of Object.entries(s.voices))
      if (v.hello && !out.some((h) => h.id === id)) out.push({ id, name: v.name, voice: v, narrator: s.voices.narrator });
  return out;
}

/** what a hero has on in the tales (nothing while its checkbox is off) */
export function outfitOf(hero: string): Item[] {
  if (!progress.dressed(hero)) return [];
  const w = progress.wearing(hero);
  return Object.keys(w)
    .map((slot) => itemById(w[slot]))
    .filter((i): i is Item => !!i && progress.owns(i.id));
}

/** a gold coin with a star, for prices and the purse */
export const COIN =
  '<svg class="coin" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#ffc83d" stroke="#c98a12" stroke-width="3"/><circle cx="20" cy="20" r="12" fill="none" stroke="#eaa51c" stroke-width="2.5"/><path d="M20 12.5l2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1-3.8-3.6 5.2-.8z" fill="#fff3c4"/></svg>';

/** the biggest things of each slot: a hero's picture is framed for them, so trying on doesn't jump */
const FRAME_FOR = ['shelom', 'boroda', 'sharf', 'okuliary'].map((id) => itemById(id)!);

/**
 * A puppet in its own little picture, cut to fit (it must be on screen to be measured): framed for
 * `frameFor` (what it wears, or the biggest things), then dressed in `items`.
 */
function portrait(host: Element, hero: string, items: Item[], pad = 0.08, frameFor: Item[] = items) {
  host.innerHTML = '';
  const s = el('svg', { class: 'hero-svg' });
  host.appendChild(s);
  const wrap = el('g');
  s.appendChild(wrap);
  const g = makePuppet(hero);
  wrap.appendChild(g);
  dress(g, hero, frameFor);
  let b = { x: -150, y: -320, width: 300, height: 330 };
  try {
    const bb = g.getBBox();
    if (bb.width > 0) b = { x: bb.x, y: bb.y, width: bb.width, height: bb.height };
  } catch {
    // not measurable (hidden): the default frame
  }
  if (frameFor !== items) dress(g, hero, items);
  // a square around it, standing on the bottom edge
  const side = Math.max(b.width, b.height) * (1 + pad * 2);
  s.setAttribute('viewBox', `${(b.x + b.width / 2 - side / 2).toFixed(0)} ${(b.y + b.height + side * pad * 0.5 - side).toFixed(0)} ${side.toFixed(0)} ${side.toFixed(0)}`);
  return { svg: s, wrap, g };
}

// ---------- the shelves ----------

let heroes: Hero[] = [];

export function initHeroes(stories: Story[]) {
  heroes = heroesOf(stories);
}

export function renderHeroes() {
  const grid = $('hero-grid');
  grid.innerHTML = '';
  const met = heroes.filter((h) => progress.met(h.id)).length;
  $('heroes-count').textContent = `${met} з ${heroes.length}`;
  for (const h of heroes) {
    const known = progress.met(h.id);
    const tile = document.createElement('button');
    tile.className = 'hero-tile' + (known ? '' : ' unmet');
    tile.setAttribute('aria-label', known ? h.name : 'Невідомий герой');
    const art = document.createElement('div');
    art.className = 'hero-art';
    const name = document.createElement('div');
    name.className = 'hero-name';
    name.textContent = known ? h.name : '?';
    tile.append(art, name);
    grid.appendChild(tile);
    portrait(art, h.id, known ? outfitOf(h.id) : []);
    tile.addEventListener('click', () => {
      unlockAudio();
      if (known) openHero(h, tile);
      else if (__DEBUG__) {
        // DEBUG=TRUE builds: a hidden hero is met at a tap
        progress.meet(h.id);
        renderHeroes();
      } else {
        tile.classList.remove('shake');
        void tile.offsetWidth;
        tile.classList.add('shake');
        void say(h.narrator, COMMON.hidden);
      }
    });
  }
}

// ---------- one hero: hello, and the wardrobe ----------

let open: Hero | null = null;
let from: HTMLElement | null = null;
/** a thing tried on, not bought yet */
let trying: Item | null = null;
let live: ReturnType<typeof portrait> | null = null;
let hop = 0;
let talking = false;
let anim = 0;

function look(): Item[] {
  const items = outfitOf(open!.id).filter((i) => !trying || i.slot !== trying.slot);
  return trying ? items.concat(trying) : items;
}

function redraw() {
  if (!open) return;
  live = portrait($('hero-view'), open.id, look(), 0.06, FRAME_FOR);
  live.svg.addEventListener('click', () => greet());
  // the checkbox, the tabs, the things of the tab
  ($('hero-dressed') as HTMLInputElement).checked = progress.dressed(open.id);
  // all its things at once (a hero has a few of its own, not a shop of them)
  const own = itemsFor(open.id);
  const box = $('hero-items');
  box.innerHTML = '';
  const wearing = progress.wearing(open.id);
  for (const it of SLOTS.reduce<Item[]>((l, s) => l.concat(own.filter((i) => i.slot === s.slot)), [])) {
    const worn = wearing[it.slot];
    const owned = progress.owns(it.id);
    const b = document.createElement('button');
    const on = (progress.dressed(open.id) && worn === it.id && owned) || (trying && trying.id === it.id);
    b.className = 'item' + (on ? ' on' : '') + (owned ? ' owned' : '');
    b.setAttribute('aria-label', it.name + (owned ? '' : `, ${it.price} монет`));
    b.innerHTML = thumb(it) + (owned ? '' : `<span class="price">${COIN}${it.price}</span>`);
    b.addEventListener('click', () => pick(it));
    box.appendChild(b);
  }
  fitThumbs(box);
  // buying what's tried on
  const buy = $('hero-buy');
  // always there (the card doesn't jump), live only for a thing tried on
  const short = trying ? trying.price - progress.coins() : 0;
  (buy as HTMLButtonElement).disabled = !trying;
  buy.classList.toggle('short', short > 0);
  buy.innerHTML = !trying ? 'Купити' : short > 0 ? `Ще треба ${COIN}${short}` : `Купити за ${COIN}${trying.price}`;
  $('hero-purse').innerHTML = `${COIN}${progress.coins()}`;
}

/** each small picture framed on its own drawing (the things are drawn round different points) */
function fitThumbs(box: Element) {
  for (const t of Array.from(box.querySelectorAll<SVGSVGElement>('svg.thumb'))) {
    try {
      const b = t.getBBox();
      if (!b.width) continue;
      const side = Math.max(b.width, b.height) * 1.12;
      t.setAttribute('viewBox', `${(b.x + b.width / 2 - side / 2).toFixed(1)} ${(b.y + b.height / 2 - side / 2).toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}`);
    } catch {
      // not measurable: the slot's frame stays
    }
  }
}

/** a thing drawn small, for the buttons */
function thumb(it: Item) {
  const box: Record<Slot, string> = { head: '-95 -150 190 190', face: '-95 -60 190 120', mouth: '-80 -40 160 180', neck: '-95 -50 190 180', torso: '-120 -300 240 260', legs: '-80 -140 160 150', feet: '-80 -60 160 70' };
  return `<svg class="thumb" viewBox="${box[it.slot]}" aria-hidden="true">${it.draw()}</svg>`;
}

function pick(it: Item) {
  if (!open) return;
  const hero = open.id;
  if (progress.owns(it.id)) {
    trying = null;
    const worn = progress.wearing(hero)[it.slot] === it.id && progress.dressed(hero);
    if (!progress.dressed(hero)) progress.setDressed(hero, true);
    progress.wear(hero, it.slot, worn ? null : it.id);
    if (!worn) hop = 1;
  } else {
    // try it on; tapping it again takes it off
    trying = trying && trying.id === it.id ? null : it;
    if (trying) hop = 1;
  }
  redraw();
}

function buyTried() {
  if (!open || !trying) return;
  const it = trying;
  if (!progress.buy(it.id, it.price)) {
    void say(open.narrator, COMMON.notEnough);
    return;
  }
  trying = null;
  progress.setDressed(open.id, true);
  progress.wear(open.id, it.slot, it.id);
  hop = 1;
  redraw();
  void say(open.narrator, COMMON.bought);
}

async function greet() {
  if (!open || talking) return;
  hop = 1;
  talking = true;
  await say(open.voice, open.voice.hello || open.name);
  talking = false;
}

function animate() {
  cancelAnimationFrame(anim);
  let last = 0;
  let mouthIn = 0;
  let blinkIn = 2;
  const step = (now: number) => {
    if (!open) return;
    anim = requestAnimationFrame(step);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    if (!live) return;
    hop = Math.max(0, hop - dt * 2);
    const lift = Math.sin((1 - hop) * Math.PI) * (hop > 0 ? 40 : 0);
    const breathe = 1 + Math.sin(now / 700) * 0.012;
    live.wrap.setAttribute('transform', `translate(0 ${(-lift).toFixed(1)}) scale(${(2 - breathe).toFixed(4)} ${breathe.toFixed(4)})`);
    const g = live.g;
    const open_ = g.querySelector('[data-part="mouth-open"]') as SVGElement | null;
    const shut = g.querySelector('[data-part="mouth-closed"]') as SVGElement | null;
    mouthIn -= dt;
    if (open_ && shut && mouthIn <= 0) {
      const wide = talking && open_.style.display === 'none';
      open_.style.display = wide ? '' : 'none';
      shut.style.display = wide ? 'none' : '';
      mouthIn = 0.08 + Math.random() * 0.1;
    }
    blinkIn -= dt;
    const eyes = g.querySelector('[data-part="eyes"]') as SVGElement | null;
    if (eyes) {
      const cy = eyes.getAttribute('data-cy') || '0';
      eyes.setAttribute('transform', blinkIn < 0.13 && blinkIn > 0 ? `translate(0 ${cy}) scale(1 0.1) translate(0 ${-cy})` : '');
      if (blinkIn <= 0) blinkIn = 2.5 + Math.random() * 3;
    }
  };
  anim = requestAnimationFrame(step);
}

function openHero(h: Hero, tile: HTMLElement) {
  open = h;
  from = tile;
  const own = itemsFor(h.id);
  $('hero-card').classList.toggle('no-items', !own.length);
  trying = null;
  $('hero-name').textContent = h.name;
  $('hero-card').hidden = false;
  // the shelves under the card stay still
  $('heroes').classList.add('locked');
  redraw();
  animate();
  ($('hero-card').querySelector('.tale-card-box') as HTMLElement).focus();
  void greet();
}

function closeHero() {
  if (!open) return;
  open = null;
  trying = null;
  talking = false;
  stopSpeech();
  cancelAnimationFrame(anim);
  $('hero-card').hidden = true;
  $('heroes').classList.remove('locked');
  renderHeroes();
  from?.focus();
}

export function heroesOpen() {
  return !!open;
}

export function wireHeroes() {
  $('hero-close').addEventListener('click', closeHero);
  $('hero-card').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeHero();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeHero();
  });
  $('hero-buy').addEventListener('click', buyTried);
  $('hero-dressed').addEventListener('change', () => {
    if (!open) return;
    progress.setDressed(open.id, ($('hero-dressed') as HTMLInputElement).checked);
    trying = null;
    redraw();
  });
}

export function sayHeroesIntro(narrator: Voice) {
  void say(narrator, COMMON.heroes);
}
