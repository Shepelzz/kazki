// «Мої герої»: everyone the child has met in the tales, on shelves. A hero not met yet is a shadow
// with a question mark. A hero met says hello (in its own voice) when tapped, and can be dressed:
// hats, glasses, a moustache, a scarf, bought with the coins for endings. The clothes are worn in the
// tales too, unless the hero's checkbox takes them off.

import CATALOG from 'virtual:wardrobe-catalog';
import { el, makePuppet } from './characters';
import { loadItems, outfitIds, outfitOf, wearable } from './closet';
import { dress, SLOTS, type Slot, type Wearable } from './dress';
import { COIN, heroesOf, type Hero } from './heroes';
import { progress } from './progress';
import { sfx } from './sfx';
import { say, stopSpeech, unlockAudio } from './speech';
import { COMMON, type Story } from './story';
import type { Voice } from './voiceKey';

/** a thing of the shop: what it is called and costs, and its drawing (fetched: loadItems) */
type Item = Wearable & { name: string; price: number };

/** a hero's things (its set), by id: fetched when its card opens */
const setOf = (hero: string): string[] => CATALOG.sets[hero] || CATALOG.any;

/** a hero's things, of those fetched */
function itemsFor(hero: string): Item[] {
  const out: Item[] = [];
  for (const id of setOf(hero)) {
    const w = wearable(id);
    if (w) out.push({ ...w, name: CATALOG.items[id].name, price: CATALOG.items[id].price });
  }
  return out;
}


const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;




/** the biggest things of each slot: a hero's picture is framed for them, so trying on doesn't jump */
const FRAME_IDS = ['shelom', 'boroda', 'sharf', 'okuliary'];
const frameFor = () => FRAME_IDS.map(wearable).filter((i): i is Wearable => !!i);

/**
 * A puppet in its own little picture, cut to fit (it must be on screen to be measured): framed for
 * `frameFor` (what it wears, or the biggest things), then dressed in `items`.
 */
function portrait(host: Element, hero: string, items: Wearable[], pad = 0.08, frameFor: Wearable[] = items) {
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
  if (frameFor !== items) {
    dress(g, hero, items);
    // a thing sticking out further than the frame's (a toothbrush out of the dragon's snout): the
    // frame grows round it, not cut off
    try {
      const bb = g.getBBox();
      if (bb.width > 0) {
        const x1 = Math.max(b.x + b.width, bb.x + bb.width);
        const y1 = Math.max(b.y + b.height, bb.y + bb.height);
        b = { x: Math.min(b.x, bb.x), y: Math.min(b.y, bb.y), width: 0, height: 0 };
        b.width = x1 - b.x;
        b.height = y1 - b.y;
      }
    } catch {
      // not measurable: the frame as it was
    }
  }
  // a square around it, standing on the bottom edge
  const side = Math.max(b.width, b.height) * (1 + pad * 2);
  s.setAttribute('viewBox', `${(b.x + b.width / 2 - side / 2).toFixed(0)} ${(b.y + b.height + side * pad * 0.5 - side).toFixed(0)} ${side.toFixed(0)} ${side.toFixed(0)}`);
  return { svg: s, wrap, g };
}

// ---------- the shelves ----------

let heroes: Hero[] = [];

export function initHeroes(stories: Pick<Story, 'voices'>[]) {
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
    // drawn at once in what's here already; each one dressed as soon as its things come
    portrait(art, h.id, known ? outfitOf(h.id) : []);
    const ids = known ? outfitIds(h.id) : [];
    if (ids.some((id) => !wearable(id))) void loadItems(ids).then(() => art.isConnected && portrait(art, h.id, outfitOf(h.id)));
    tile.addEventListener('click', () => {
      unlockAudio();
      if (known) void openHero(h, tile);
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
/** a card being opened: its hero's things are coming */
let opening = false;
let live: ReturnType<typeof portrait> | null = null;
let hop = 0;
let talking = false;
let anim = 0;

function look(): Wearable[] {
  const items = outfitOf(open!.id).filter((i) => !trying || i.slot !== trying.slot);
  return trying ? items.concat(trying) : items;
}

function redraw() {
  if (!open) return;
  live = portrait($('hero-view'), open.id, look(), 0.06, frameFor());
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
  // bought: the coins jingle (no words)
  sfx('ДЗИНЬ!', 'coins');
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

async function openHero(h: Hero, tile: HTMLElement) {
  if (opening) return;
  // its things, to try on: fetched first (a moment, the first time)
  opening = true;
  tile.classList.add('loading');
  await loadItems(setOf(h.id).concat(outfitIds(h.id), FRAME_IDS));
  tile.classList.remove('loading');
  opening = false;
  if ($('heroes').hidden) return;
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
